import React, { useState } from 'react';
import { Product } from '../types';
import { Icon } from './Icon';

interface ShareModalProps {
    product: Product;
    onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ product, onClose }) => {
    const [copySuccess, setCopySuccess] = useState('');
    const productUrl = `${window.location.origin}/?product=${product.id}`;
    const shareText = `Yuk, cek produk keren ini: ${product.name} dari Kriuké Snack!`;

    const shareOptions = [
        { name: 'WhatsApp', icon: 'whatsapp' as const, color: 'bg-green-500', href: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + productUrl)}` },
        { name: 'Facebook', icon: 'facebook' as const, color: 'bg-blue-600', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}` },
        { name: 'Twitter', icon: 'twitter' as const, color: 'bg-sky-500', href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(shareText)}` },
        { name: 'Email', icon: 'email' as const, color: 'bg-gray-600', href: `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent('Lihat selengkapnya di: ' + productUrl)}` }
    ];

    const handleCopyLink = () => {
        navigator.clipboard.writeText(productUrl).then(() => {
            setCopySuccess('Link berhasil disalin!');
            setTimeout(() => setCopySuccess(''), 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            setCopySuccess('Gagal menyalin link.');
             setTimeout(() => setCopySuccess(''), 2000);
        });
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm p-6 shadow-xl animate-fade-in-up" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Bagikan Produk</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <Icon name="close" />
                    </button>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">Bagikan "{product.name}" ke teman-temanmu!</p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                    {shareOptions.map(option => (
                        <a 
                            key={option.name}
                            href={option.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => {
                                // For social popups
                                if (option.name === 'Facebook' || option.name === 'Twitter') {
                                    e.preventDefault();
                                    window.open(option.href, 'social-share', 'width=580,height=400');
                                }
                            }}
                            className={`flex items-center gap-3 p-3 rounded-lg text-white font-semibold ${option.color} hover:opacity-90 transition-opacity`}
                        >
                            <Icon name={option.icon} className="w-5 h-5" />
                            <span>{option.name}</span>
                        </a>
                    ))}
                </div>
                
                <div className="mt-6">
                    <div className="relative">
                        <input type="text" readOnly value={productUrl} className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg pl-3 pr-12 py-2 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400" />
                        <button onClick={handleCopyLink} className="absolute top-1/2 right-1 -translate-y-1/2 p-2 text-gray-600 dark:text-gray-300 hover:text-orange-500">
                            <Icon name="link" className="w-5 h-5" />
                        </button>
                    </div>
                    {copySuccess && <p className="text-xs text-green-600 mt-2 text-center">{copySuccess}</p>}
                </div>
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

export default ShareModal;