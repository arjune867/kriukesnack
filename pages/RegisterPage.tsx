import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Page } from '../types';
import { Icon } from '../components/Icon';

interface RegisterPageProps {
    navigate: (page: Page) => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ navigate }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const { register } = useAuth();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Password tidak cocok.');
            return;
        }
        if (password.length < 6) {
            setError('Password minimal 6 karakter.');
            return;
        }

        const result = register(username, password, email, whatsapp);
        if (result.success) {
            alert(result.message);
            navigate('login');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="username-register" className="sr-only">Username</label>
                            <input
                                id="username-register"
                                name="username"
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm"
                                placeholder="Username"
                            />
                        </div>
                         <div>
                            <label htmlFor="email-register" className="sr-only">Email</label>
                            <input
                                id="email-register"
                                name="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm"
                                placeholder="Email"
                            />
                        </div>
                        <div>
                            <label htmlFor="whatsapp-register" className="sr-only">Nomor WhatsApp</label>
                            <input
                                id="whatsapp-register"
                                name="whatsapp"
                                type="tel"
                                required
                                value={whatsapp}
                                onChange={(e) => setWhatsapp(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm"
                                placeholder="Nomor WhatsApp"
                            />
                        </div>
                        <div className="relative">
                            <label htmlFor="password-register" className="sr-only">Password</label>
                            <input
                                id="password-register"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm"
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
                        <div className="relative">
                            <label htmlFor="confirm-password-register" className="sr-only">Konfirmasi Password</label>
                            <input
                                id="confirm-password-register"
                                name="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm"
                                placeholder="Konfirmasi Password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                                aria-label={showConfirmPassword ? "Sembunyikan password" : "Tampilkan password"}
                            >
                                <Icon name={showConfirmPassword ? 'eye-slash' : 'eye'} className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                        >
                            Daftar
                        </button>
                    </div>
                </form>
                <div className="text-center text-sm">
                     <p>
                        <button 
                            onClick={() => navigate('login')}
                            className="font-medium text-amber-600 hover:text-amber-500"
                        >
                            Sudah punya akun? Masuk di sini
                        </button>
                    </p>
                     <p className="mt-2">
                        <button 
                            onClick={() => navigate('forgotPassword')}
                            className="font-medium text-amber-600 hover:text-amber-500"
                        >
                            Lupa Password?
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;