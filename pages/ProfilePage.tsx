import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Page } from '../types';
import { Icon } from '../components/Icon';

interface ProfilePageProps {
    navigate: (page: Page) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ navigate }) => {
    const { admin, currentUser, logout } = useAuth();

    const handleLogout = () => {
        logout();
        // Stay on the profile page to show the logged-out state.
    };

    const renderLoggedInState = () => {
        const user = admin || currentUser;
        const isUserAdmin = !!admin;

        return (
            <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-orange-500 mx-auto flex items-center justify-center mb-4">
                    <Icon name="user" className="w-12 h-12 text-white" isSolid/>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Halo, {user?.username}!</h2>
                <p className="text-gray-600 mt-1">Selamat datang kembali di Kriuké Snack.</p>
                
                <div className="mt-8 space-y-3">
                    {isUserAdmin && (
                        <button
                            onClick={() => navigate('admin')}
                            className="w-full bg-amber-500 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-amber-600 transition-all duration-200"
                        >
                            Buka Dashboard Admin
                        </button>
                    )}
                    <button
                        onClick={handleLogout}
                        className="w-full bg-red-500 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-red-600 transition-all duration-200"
                    >
                        Logout
                    </button>
                </div>
            </div>
        );
    };

    const renderLoggedOutState = () => {
        return (
            <div className="text-center">
                 <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto flex items-center justify-center mb-4">
                    <Icon name="user" className="w-12 h-12 text-gray-400"/>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Akun Saya</h2>
                <p className="text-gray-600 mt-1">Masuk atau daftar untuk pengalaman belanja yang lebih baik.</p>

                <div className="mt-8 space-y-3">
                    <button
                        onClick={() => navigate('login')}
                        className="w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-orange-600 transition-all duration-200"
                    >
                        Masuk
                    </button>
                     <button
                        onClick={() => navigate('register')}
                        className="w-full bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition-all duration-200"
                    >
                        Daftar Akun Baru
                    </button>
                </div>

                <div className="mt-8 border-t pt-4">
                     <button
                        onClick={() => navigate('admin')}
                        className="font-medium text-amber-600 hover:text-amber-500 text-sm"
                    >
                        Masuk sebagai Admin
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="p-4 flex flex-col justify-center h-full">
            {(admin || currentUser) ? renderLoggedInState() : renderLoggedOutState()}
        </div>
    );
};

export default ProfilePage;
