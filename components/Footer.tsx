import React from 'react';
import { Page } from '../types';
import { Icon } from './Icon';

interface FooterProps {
    navigate: (page: Page) => void;
    currentPage: Page;
}

const Footer: React.FC<FooterProps> = ({ navigate, currentPage }) => {
    const navItems = [
        { page: 'home' as Page, label: 'Home', icon: 'home' as const },
        { page: 'wishlist' as Page, label: 'Wishlist', icon: 'heart' as const },
        { page: 'cart' as Page, label: 'Keranjang', icon: 'cart' as const },
        { page: 'profile' as Page, label: 'Profil', icon: 'user' as const },
    ];

    return (
        <footer className="bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 max-w-md mx-auto h-16 z-40">
            <nav className="h-full">
                <ul className="flex justify-around items-center h-full">
                    {navItems.map((item) => {
                        const isActive = currentPage === item.page;
                        const colorClass = isActive ? 'text-orange-500' : 'text-gray-400';
                        return (
                            <li key={item.page} className="flex-1">
                                <button
                                    onClick={() => navigate(item.page)}
                                    className={`w-full flex flex-col items-center justify-center gap-1 p-2 ${colorClass} transition-colors duration-200`}
                                    aria-current={isActive ? 'page' : undefined}
                                >
                                    <Icon name={item.icon} isSolid={isActive && (item.icon === 'home' || item.icon === 'heart' || item.icon === 'user')} />
                                    <span className="text-xs font-medium">{item.label}</span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </footer>
    );
};

export default Footer;