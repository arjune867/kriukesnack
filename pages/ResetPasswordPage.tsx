import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Page } from '../types';
import { Icon } from '../components/Icon';

interface ResetPasswordPageProps {
    navigate: (page: Page) => void;
    username: string;
}

const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ navigate, username }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const { updatePassword } = useAuth();

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

        const result = updatePassword(username, password);
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
                <div>
                    <h2 className="text-center text-2xl font-bold text-gray-900">Buat Password Baru</h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Memperbarui password untuk akun: <span className="font-bold">{username}</span>
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm">
                        <div className="relative">
                            <label htmlFor="password-reset" className="sr-only">Password Baru</label>
                            <input
                                id="password-reset"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                                placeholder="Password Baru"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                            >
                                <Icon name={showPassword ? 'eye-slash' : 'eye'} className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>
                        <div className="relative">
                            <label htmlFor="confirm-password-reset" className="sr-only">Konfirmasi Password</label>
                            <input
                                id="confirm-password-reset"
                                name="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                                placeholder="Konfirmasi Password"
                            />
                             <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
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
                            Update Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;