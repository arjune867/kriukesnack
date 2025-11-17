

import React, { useState, useRef, useEffect } from 'react';
import { Page } from '../types';
import { Icon } from './Icon';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useSettings } from '../hooks/useSettings';

interface HeaderProps {
    navigate: (page: Page, productId?: string) => void;
    currentPage: Page;
    searchTerm?: string;
    setSearchTerm?: (term: string) => void;
    productName?: string;
    onMenuClick: () => void;
}

const Logo: React.FC = () => (
    <div className="flex items-center cursor-pointer">
         <img src="https://i.ibb.co.com/BKVP5bzW/Logo-Toko-Aneka-Cemilan-Snack-Ceria-Oranye-Kuning-20251105-010331-0000.png" alt="Kriuké Snack Logo" className="h-10" />
    </div>
);


const Header: React.FC<HeaderProps> = ({ navigate, currentPage, searchTerm, setSearchTerm, productName, onMenuClick }) => {
    const { itemCount } = useCart();
    const { admin } = useAuth();
    const { settings } = useSettings();
    const [isSearching, setIsSearching] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isSearching) {
            searchInputRef.current?.focus();
        }
    }, [isSearching]);

    const handleSearchClick = () => {
        setIsSearching(true);
    };

    const handleCloseSearch = () => {
        setIsSearching(false);
        if (setSearchTerm) {
            setSearchTerm('');
        }
    };
    
    if (currentPage === 'admin' && admin) {
         return (
             <header className="bg-white dark:bg-gray-800 shadow-md fixed top-0 left-0 right-0 max-w-md mx-auto z-40 p-4 dark:border-b dark:border-gray-700 h-20 flex items-center">
                 <div className="flex items-center justify-between w-full">
                     <div onClick={() => navigate('home')}>
                        <Logo />
                     </div>
                     <h1 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Admin Dashboard</h1>
                 </div>
             </header>
         );
    }
    
    if (['product', 'cart', 'login', 'register', 'forgotPassword', 'resetPassword', 'newProducts'].includes(currentPage)) {
        const titleMap: Record<string, string> = {
            product: productName || 'Detail Produk',
            cart: 'Keranjang & Checkout',
            login: 'Masuk Akun',
            register: 'Daftar Akun',
            forgotPassword: 'Lupa Password',
            resetPassword: 'Reset Password',
            newProducts: 'Produk Terbaru'
        };
        const title = titleMap[currentPage];
        const backPageMap: Record<string, Page> = {
            product: 'home',
            cart: 'home',
            login: 'profile',
            register: 'profile',
            forgotPassword: 'login',
            resetPassword: 'login',
            newProducts: 'home'
        }
        const backPage = backPageMap[currentPage];


        return (
             <header className="bg-white dark:bg-gray-800 shadow-md fixed top-0 left-0 right-0 max-w-md mx-auto z-40 p-4 dark:border-b dark:border-gray-700 h-20 flex items-center">
                <div className="flex items-center justify-between w-full">
                    <button onClick={() => navigate(backPage)} className="p-2 -ml-2 text-gray-700 dark:text-gray-300">
                        <Icon name="arrowLeft" />
                    </button>
                    <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{title}</h1>
                     {currentPage === 'product' ? (
                        <button onClick={() => navigate('cart')} className="relative">
                            <Icon name="cart" />
                            {itemCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {itemCount}
                                </span>
                            )}
                        </button>
                     ) : (
                        <div className="w-10 h-10" /> // Placeholder for alignment
                     )}
                </div>
            </header>
        );
    }
    
    return (
        <header className="bg-white dark:bg-gray-800 shadow-md fixed top-0 left-0 right-0 max-w-md mx-auto z-40 p-4 dark:border-b dark:border-gray-700 h-20 flex items-center transition-all duration-300">
             {isSearching ? (
                <div className="flex items-center gap-2 w-full animate-fade-in">
                    <button onClick={handleCloseSearch} className="p-2 -ml-2 text-gray-700 dark:text-gray-300">
                        <Icon name="arrowLeft" />
                    </button>
                    <div className="relative flex-grow">
                        <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Cari produk..."
                            value={searchTerm || ''}
                            onChange={(e) => setSearchTerm?.(e.target.value)}
                            className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 dark:text-white dark:placeholder-gray-400"
                        />
                    </div>
                </div>
            ) : (
                 <div className="relative flex items-center justify-between w-full animate-fade-in">
                    <div onClick={() => navigate('home')}>
                        <Logo />
                    </div>
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                        <h1 className="text-orange-500 font-bold text-xl">Kriuké Snack</h1>
                    </div>
                    <div className="flex items-center gap-4">
                         <button onClick={handleSearchClick} className="text-gray-700 dark:text-gray-200">
                             <Icon name="search" />
                         </button>
                         <a href={settings.tiktokLiveUrl || 'https://www.tiktok.com/@kriukesnack.id/live'} target="_blank" rel="noopener noreferrer" aria-label="Tonton TikTok Live" className="flex items-center">
                            <img src="https://i.ibb.co/zWVKXBk6/Pngtree-tiktok-live-icon-sign-vector-8240242.png" alt="TikTok Live" className="h-7" />
                         </a>
                        <button onClick={onMenuClick}>
                            <Icon name="menu" />
                        </button>
                    </div>
                 </div>
            )}
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out forwards;
                }
            `}</style>
        </header>
    );
};

export default Header;