import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Page } from '../types';
import { Icon } from '../components/Icon';

interface UserLoginPageProps {
    navigate: (page: Page) => void;
}

const UserLoginPage: React.FC<UserLoginPageProps> = ({ navigate }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (login(username, password)) {
            navigate('profile');
        } else {
            setError('Username atau password salah.');
        }
    };

    return (
        <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm">
                        <div>
                            <label htmlFor="username-user" className="sr-only">Username</label>
                            <input
                                id="username-user"
                                name="username"
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 rounded-t-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm"
                                placeholder="Username"
                            />
                        </div>
                        <div className="relative">
                            <label htmlFor="password-user" className="sr-only">Password</label>
                            <input
                                id="password-user"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 rounded-b-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                            />
                             <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                            >
                                <Icon name={showPassword ? 'eye-slash' : 'eye'} className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-end">
                        <div className="text-sm">
                            <button 
                                type="button"
                                onClick={() => navigate('forgotPassword')}
                                className="font-medium text-amber-600 hover:text-amber-500"
                            >
                                Lupa Password?
                            </button>
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                        >
                            Masuk
                        </button>
                    </div>
                </form>
                <div className="text-center">
                    <button 
                        onClick={() => navigate('register')}
                        className="font-medium text-amber-600 hover:text-amber-500 text-sm"
                    >
                        Belum punya akun? Daftar sekarang
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserLoginPage;