import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Page } from '../types';

interface ForgotPasswordPageProps {
    navigate: (page: Page) => void;
    onUserFound: (username: string) => void;
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ navigate, onUserFound }) => {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { findUserByUsername } = useAuth();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const user = findUserByUsername(username);

        if (user) {
            setSuccess('Pengguna ditemukan. Mengarahkan ke halaman reset password...');
            // In a real app, you'd send an email here. We simulate this by navigating directly.
            setTimeout(() => {
                onUserFound(user.username);
            }, 1500);
        } else {
            setError('Username tidak ditemukan.');
        }
    };

    return (
        <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="text-center text-2xl font-bold text-gray-900">Lupa Password Anda?</h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Masukkan username Anda dan kami akan (simulasikan) mengirimkan link untuk reset password.
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm">
                        <div>
                            <label htmlFor="username-forgot" className="sr-only">Username</label>
                            <input
                                id="username-forgot"
                                name="username"
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                                placeholder="Username"
                            />
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    {success && <p className="text-green-500 text-sm text-center">{success}</p>}

                    <div>
                        <button
                            type="submit"
                            disabled={!!success}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-orange-300"
                        >
                            Kirim
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;