import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, FunctionDeclaration, Type, LiveSession, Blob } from "@google/genai";
import { useProducts } from '../hooks/useProducts';
import { usePromotions } from '../hooks/usePromotions';
import { useCategories } from '../hooks/useCategories';
import { decode, decodeAudioData, createPcmBlob } from '../utils/audioUtils';
import { Icon } from './Icon';

interface VirtualAssistantProps {
    isOpen: boolean;
    onClose: () => void;
}

type Status = 'idle' | 'requesting_mic' | 'connecting' | 'listening' | 'processing' | 'error';

const VirtualAssistant: React.FC<VirtualAssistantProps> = ({ isOpen, onClose }) => {
    const { products } = useProducts();
    const { promotions } = usePromotions();
    const { categories } = useCategories();

    const [status, setStatus] = useState<Status>('idle');
    const [transcription, setTranscription] = useState<{ speaker: 'user' | 'assistant', text: string }[]>([]);
    const [currentInput, setCurrentInput] = useState('');
    const [currentOutput, setCurrentOutput] = useState('');

    const aiRef = useRef<GoogleGenAI | null>(null);
    const sessionPromiseRef = useRef<Promise<LiveSession> | null>(null);
    
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

    const audioPlaybackQueue = useRef<AudioBufferSourceNode[]>([]);
    const nextStartTime = useRef(0);

    const getProductByName = useCallback((productName: string) => {
        const foundProduct = products.find(p => p.name.toLowerCase().includes(productName.toLowerCase()));
        if (foundProduct) {
            return `Found it! ${foundProduct.name} costs Rp ${foundProduct.price}. It's described as: ${foundProduct.description}. Is there anything else?`;
        }
        return `I'm sorry, I couldn't find a product named "${productName}". You can ask me to list all products if you'd like.`;
    }, [products]);

    const listProducts = useCallback((categoryName?: string) => {
        let productList = products;
        if (categoryName) {
            productList = products.filter(p => p.category.toLowerCase() === categoryName.toLowerCase());
        }

        if (productList.length === 0) {
            return categoryName
                ? `I'm sorry, I couldn't find any products in the "${categoryName}" category.`
                : "I couldn't find any products.";
        }
        
        const productNames = productList.map(p => p.name).join(', ');
        return `Sure! Here are the products ${categoryName ? `in the ${categoryName} category` : ''}: ${productNames}. Which one are you interested in?`;
    }, [products]);

    const listPromotions = useCallback(() => {
        if (promotions.length === 0) {
            return "There are no special promotions at the moment, but all our snacks are delicious!";
        }
        const promoProductNames = promotions.map(promo => products.find(p => p.id === promo.productId)?.name).filter(Boolean).join(', ');
        return `We have special promotions for these products: ${promoProductNames}. Would you like to know more about any of them?`;
    }, [promotions, products]);

    const functionDeclarations: FunctionDeclaration[] = [
        {
            name: 'getProductByName',
            description: 'Get detailed information about a specific product by its name.',
            parameters: {
                type: Type.OBJECT,
                properties: { productName: { type: Type.STRING, description: 'The name of the product.' } },
                required: ['productName'],
            },
        },
        {
            name: 'listProducts',
            description: 'List all available products, optionally filtering by category.',
            parameters: {
                type: Type.OBJECT,
                properties: { categoryName: { type: Type.STRING, description: 'The category to filter by.' } },
            },
        },
        {
            name: 'listPromotions',
            description: 'Get a list of all current promotions.',
            parameters: { type: Type.OBJECT, properties: {} },
        },
    ];

    const startSession = useCallback(async () => {
        setTranscription([{ speaker: 'assistant', text: "Hi! How can I help you with Kriuké Snack today?" }]);
        setStatus('requesting_mic');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;
            setStatus('connecting');

            aiRef.current = new GoogleGenAI({ apiKey: process.env.API_KEY });
            // Fix: Cast window to `any` to allow `webkitAudioContext` for older browser compatibility without TypeScript errors.
            inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            // Fix: Cast window to `any` to allow `webkitAudioContext` for older browser compatibility without TypeScript errors.
            outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

            sessionPromiseRef.current = aiRef.current.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
                    systemInstruction: 'You are a friendly and helpful shopping assistant for a snack shop called "Kriuké Snack". Keep your answers concise and friendly. When asked for a product price, state it in Indonesian Rupiah (Rp).',
                    tools: [{ functionDeclarations }],
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                },
                callbacks: {
                    onopen: () => {
                        setStatus('listening');
                        const source = inputAudioContextRef.current!.createMediaStreamSource(mediaStreamRef.current!);
                        mediaStreamSourceRef.current = source;
                        const scriptProcessor = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
                        scriptProcessorRef.current = scriptProcessor;

                        scriptProcessor.onaudioprocess = (event) => {
                            const inputData = event.inputBuffer.getChannelData(0);
                            const pcmBlob = createPcmBlob(inputData);
                            sessionPromiseRef.current?.then(session => {
                                session.sendRealtimeInput({ media: pcmBlob });
                            });
                        };
                        source.connect(scriptProcessor);
                        scriptProcessor.connect(inputAudioContextRef.current!.destination);
                    },
                    onmessage: (message: LiveServerMessage) => handleMessage(message),
                    onerror: (e: ErrorEvent) => {
                        console.error('Session error:', e);
                        setStatus('error');
                    },
                    onclose: () => {
                        // The session is closed by the user action.
                    },
                },
            });

        } catch (err) {
            console.error('Error getting media stream:', err);
            setStatus('error');
        }
    }, [functionDeclarations, getProductByName, listProducts, listPromotions]);

    const closeSession = useCallback(async () => {
        if (sessionPromiseRef.current) {
            const session = await sessionPromiseRef.current;
            session.close();
            sessionPromiseRef.current = null;
        }
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
            mediaStreamRef.current = null;
        }
        if (scriptProcessorRef.current) {
            scriptProcessorRef.current.disconnect();
            scriptProcessorRef.current = null;
        }
        if (mediaStreamSourceRef.current) {
            mediaStreamSourceRef.current.disconnect();
            mediaStreamSourceRef.current = null;
        }
        if (inputAudioContextRef.current && inputAudioContextRef.current.state !== 'closed') {
            await inputAudioContextRef.current.close();
        }
        if (outputAudioContextRef.current && outputAudioContextRef.current.state !== 'closed') {
            await outputAudioContextRef.current.close();
        }
        audioPlaybackQueue.current.forEach(source => source.stop());
        audioPlaybackQueue.current = [];
        nextStartTime.current = 0;
        setStatus('idle');
        setTranscription([]);
        setCurrentInput('');
        setCurrentOutput('');
    }, []);

    const handleMessage = async (message: LiveServerMessage) => {
        if (message.serverContent?.inputTranscription) {
            setCurrentInput(prev => prev + message.serverContent!.inputTranscription!.text);
        }
        if (message.serverContent?.outputTranscription) {
            setCurrentOutput(prev => prev + message.serverContent!.outputTranscription!.text);
        }

        if (message.serverContent?.turnComplete) {
            if (currentInput.trim()) {
                setTranscription(prev => [...prev, { speaker: 'user', text: currentInput.trim() }]);
            }
            if (currentOutput.trim()) {
                setTranscription(prev => [...prev, { speaker: 'assistant', text: currentOutput.trim() }]);
            }
            setCurrentInput('');
            setCurrentOutput('');
        }
        
        if (message.toolCall) {
            setStatus('processing');
            for (const fc of message.toolCall.functionCalls) {
                let resultText = '';
                if (fc.name === 'getProductByName') {
                    resultText = getProductByName(fc.args.productName);
                } else if (fc.name === 'listProducts') {
                    resultText = listProducts(fc.args.categoryName);
                } else if (fc.name === 'listPromotions') {
                    resultText = listPromotions();
                } else {
                    resultText = "I'm not sure how to handle that function.";
                }

                sessionPromiseRef.current?.then(session => {
                    session.sendToolResponse({
                        functionResponses: { id: fc.id, name: fc.name, response: { result: resultText } }
                    });
                });
            }
            setStatus('listening');
        }

        const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
        if (audioData) {
            const audioContext = outputAudioContextRef.current;
            if (audioContext) {
                const audioBuffer = await decodeAudioData(decode(audioData), audioContext, 24000, 1);
                const source = audioContext.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(audioContext.destination);
                
                const currentTime = audioContext.currentTime;
                const startTime = Math.max(currentTime, nextStartTime.current);
                source.start(startTime);
                
                nextStartTime.current = startTime + audioBuffer.duration;
                audioPlaybackQueue.current.push(source);
                source.onended = () => {
                    audioPlaybackQueue.current = audioPlaybackQueue.current.filter(s => s !== source);
                };
            }
        }
    };
    
    useEffect(() => {
        if (isOpen) {
            startSession();
        } else {
            closeSession();
        }
        return () => {
            closeSession();
        };
    }, [isOpen, startSession, closeSession]);

    if (!isOpen) return null;

    const getStatusText = () => {
        switch (status) {
            case 'requesting_mic': return 'Requesting microphone...';
            case 'connecting': return 'Connecting to assistant...';
            case 'listening': return 'Listening...';
            case 'processing': return 'Thinking...';
            case 'error': return 'An error occurred. Please try again.';
            default: return 'Welcome!';
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex flex-col justify-end" role="dialog" aria-modal="true">
            <div className="bg-white w-full max-w-md mx-auto rounded-t-2xl h-[90vh] flex flex-col p-4 shadow-2xl">
                <div className="flex justify-between items-center mb-4">
                     <h2 className="text-xl font-bold text-gray-800">Virtual Assistant</h2>
                    <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-800" aria-label="Close assistant">
                        <Icon name="close" />
                    </button>
                </div>
                
                <div className="flex-grow overflow-y-auto space-y-4 pr-2">
                    {transcription.map((entry, index) => (
                        <div key={index} className={`flex ${entry.speaker === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${entry.speaker === 'user' ? 'bg-orange-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                                <p className="text-sm">{entry.text}</p>
                            </div>
                        </div>
                    ))}
                    {currentInput && <div className="text-right text-sm text-gray-500 italic">You: {currentInput}</div>}
                    {currentOutput && <div className="text-left text-sm text-gray-500 italic">Assistant: {currentOutput}</div>}
                </div>

                <div className="flex flex-col items-center justify-center pt-4">
                    <div className="relative w-20 h-20 flex items-center justify-center">
                        {status === 'listening' && (
                            <>
                                <div className="absolute w-full h-full bg-orange-400 rounded-full animate-ping opacity-75"></div>
                                <div className="absolute w-3/4 h-3/4 bg-orange-400 rounded-full animate-ping opacity-50 delay-75"></div>
                            </>
                        )}
                        <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white">
                           <Icon name="microphone" className="w-8 h-8"/>
                        </div>
                    </div>
                    <p className="mt-4 font-semibold text-gray-600">{getStatusText()}</p>
                </div>
            </div>
        </div>
    );
};

export default VirtualAssistant;