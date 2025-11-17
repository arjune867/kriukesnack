import React, { useState } from 'react';
import { Product } from '../types';
import { Icon } from './Icon';

interface WhatsAppChatModalProps {
    product: Product;
    onClose: () => void;
}

const WhatsAppChatModal: React.FC<WhatsAppChatModalProps> = ({ product, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        whatsappNumber: '',
        question: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const WHATSAPP_NUMBER = '6282349786916'; // Your WhatsApp number
        let message = `Halo, saya ingin bertanya tentang produk: *${product.name}*\n\n`;
        message += `*Nama:* ${formData.name}\n`;
        message += `*Alamat:* ${formData.address}\n`;
        message += `*No. WhatsApp:* ${formData.whatsappNumber}\n\n`;
        message += `*Pertanyaan:*\n${formData.question}`;

        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        onClose();
    };

    const inputClass = "mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm";
    const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300";

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm p-6 shadow-xl animate-fade-in-up" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                        <Icon name="whatsapp" className="text-green-500" />
                        Tanya via WhatsApp
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <Icon name="close" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="product" className={labelClass}>Produk</label>
                        <input type="text" id="product" value={product.name} readOnly className={`${inputClass} bg-gray-100 dark:bg-gray-600`} />
                    </div>
                    <div>
                        <label htmlFor="name" className={labelClass}>Nama</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className={inputClass} required />
                    </div>
                    <div>
                        <label htmlFor="address" className={labelClass}>Alamat</label>
                        <input type="text" name="address" id="address" value={formData.address} onChange={handleChange} className={inputClass} required />
                    </div>
                    <div>
                        <label htmlFor="whatsappNumber" className={labelClass}>Nomor WhatsApp</label>
                        <input type="tel" name="whatsappNumber" id="whatsappNumber" value={formData.whatsappNumber} onChange={handleChange} className={inputClass} required />
                    </div>
                    <div>
                        <label htmlFor="question" className={labelClass}>Pertanyaan</label>
                        <textarea name="question" id="question" rows={3} value={formData.question} onChange={handleChange} className={inputClass} required placeholder="Tulis pertanyaan Anda di sini..."></textarea>
                    </div>
                    <div className="pt-2">
                        <button type="submit" className="w-full flex justify-center items-center gap-2 bg-green-500 text-white font-bold py-2.5 px-4 rounded-lg shadow-lg hover:bg-green-600 transition-all duration-200">
                            Kirim Pertanyaan
                        </button>
                    </div>
                </form>
            </div>
             <style>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default WhatsAppChatModal;
