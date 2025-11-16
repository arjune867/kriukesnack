import React from 'react';
import { Page } from '../types';
import { Icon } from './Icon';
import { useAuth } from '../hooks/useAuth';

interface SideMenuProps {
    isOpen: boolean;
    onClose: () => void;
    navigate: (page: Page) => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose, navigate }) => {
    const { admin, currentUser, logout } = useAuth();
    const isLoggedIn = !!admin || !!currentUser;

    const navItems = [
        { page: 'home' as Page, label: 'Beranda', icon: 'home' as const },
        { page: 'wishlist' as Page, label: 'Wishlist', icon: 'heart' as const },
        { page: 'cart' as Page, label: 'Keranjang', icon: 'cart' as const },
        { page: 'profile' as Page, label: 'Profil', icon: 'user' as const },
    ];

    const socials = [
        { name: 'Instagram', icon: 'instagram' as const, href: 'https://instagram.com' },
        { name: 'TikTok', href: 'https://tiktok.com', imageUrl: 'https://i.ibb.co.com/399C2Fwj/social-media.png' },
        { name: 'Facebook', icon: 'facebook' as const, href: 'https://facebook.com' },
    ];

    const handleLogout = () => {
        logout();
        onClose();
        navigate('home');
    }

    return (
        <>
            <div 
                className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
                aria-hidden={!isOpen}
            ></div>
            <div
                className={`fixed top-0 right-0 h-full bg-white w-64 shadow-2xl z-[60] transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
                role="dialog"
                aria-modal="true"
            >
                <div className="p-4 flex flex-col h-full">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-orange-500">Menu</h2>
                        <button onClick={onClose} className="p-2 -mr-2 text-gray-500 hover:text-gray-800">
                            <Icon name="close" />
                        </button>
                    </div>
                    <nav className="flex-grow">
                        <ul className="space-y-2">
                            {navItems.map(item => (
                                <li key={item.page}>
                                    <button
                                        onClick={() => navigate(item.page)}
                                        className="w-full flex items-center gap-4 p-3 rounded-lg text-gray-700 hover:bg-orange-50 transition-colors"
                                    >
                                        <Icon name={item.icon} className="w-6 h-6 text-gray-500" />
                                        <span className="font-semibold">{item.label}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                     <div className="mt-auto pt-4 border-t">
                        <div className="mb-4">
                            <p className="px-3 text-xs font-semibold text-gray-400 uppercase mb-3">Ikuti Kami</p>
                            <div className="flex items-center gap-4 px-3">
                                {socials.map(social => (
                                    <a
                                        key={social.name}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-500 hover:text-orange-500 transition-colors"
                                        aria-label={`Follow us on ${social.name}`}
                                    >
                                        {'imageUrl' in social && social.imageUrl ? (
                                            <img src={social.imageUrl} alt={social.name} className="w-6 h-6 rounded" />
                                        ) : (
                                            <Icon name={social.icon!} className="w-6 h-6" />
                                        )}
                                    </a>
                                ))}
                            </div>
                        </div>
                        {isLoggedIn && (
                             <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-4 p-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <Icon name="logout" className="w-6 h-6" />
                                <span className="font-semibold">Logout</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default SideMenu;