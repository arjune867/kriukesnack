
import React from 'react';
import { Page } from '../types';
import { Icon } from './Icon';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';

interface HeaderProps {
    navigate: (page: Page, productId?: string) => void;
    currentPage: Page;
    searchTerm?: string;
    setSearchTerm?: (term: string) => void;
    productName?: string;
}

const Logo: React.FC = () => (
    <div className="flex items-center cursor-pointer">
         <img src="https://i.ibb.co.com/BKVP5bzW/Logo-Toko-Aneka-Cemilan-Snack-Ceria-Oranye-Kuning-20251105-010331-0000.png" alt="Kriuké Snack Logo" className="h-10" />
    </div>
);


const Header: React.FC<HeaderProps> = ({ navigate, currentPage, searchTerm, setSearchTerm, productName }) => {
    const { itemCount } = useCart();
    const { admin } = useAuth();
    
    if (currentPage === 'admin' && admin) {
         return (
             <header className="bg-white shadow-md fixed top-0 left-0 right-0 max-w-md mx-auto z-40 p-4">
                 <div className="flex items-center justify-between">
                     <div onClick={() => navigate('home')}>
                        <Logo />
                     </div>
                     <h1 className="text-lg font-semibold text-gray-700">Admin Dashboard</h1>
                 </div>
             </header>
         );
    }
    
    if (currentPage === 'product' || currentPage === 'cart') {
        const titleMap: Record<string, string> = {
            product: productName || 'Detail Produk',
            cart: 'Keranjang & Checkout'
        };
        const title = titleMap[currentPage];
        const backPage = 'home';

        return (
             <header className="bg-white shadow-md fixed top-0 left-0 right-0 max-w-md mx-auto z-40 p-4">
                <div className="flex items-center justify-between">
                    <button onClick={() => navigate(backPage)} className="p-2 -ml-2 text-gray-700">
                        <Icon name="arrowLeft" />
                    </button>
                    <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
                     {currentPage === 'cart' ? (
                        <div className="w-10 h-10" /> // Placeholder for alignment
                     ) : (
                        <button onClick={() => navigate('cart')} className="relative">
                            <Icon name="cart" />
                            {itemCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {itemCount}
                                </span>
                            )}
                        </button>
                     )}
                </div>
            </header>
        );
    }
    
    return (
        <header className="bg-white shadow-md fixed top-0 left-0 right-0 max-w-md mx-auto z-40 p-4 flex flex-col gap-4">
             <div className="relative flex items-center justify-between">
                <div onClick={() => navigate('home')}>
                    <Logo />
                </div>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                    <h1 className="text-orange-500 font-bold text-xl">Kriuké Snack</h1>
                </div>
                <div className="flex items-center gap-4">
                     <button onClick={() => navigate('cart')} className="relative">
                        <Icon name="cart" />
                        {itemCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                {itemCount}
                            </span>
                        )}
                    </button>
                    <button>
                        <Icon name="menu" />
                    </button>
                </div>
             </div>
             <div className="relative">
                <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                    type="text"
                    placeholder="Cari produk..."
                    value={searchTerm || ''}
                    onChange={(e) => setSearchTerm?.(e.target.value)}
                    className="w-full bg-gray-100 border border-gray-200 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
             </div>
        </header>
    );
};

export default Header;