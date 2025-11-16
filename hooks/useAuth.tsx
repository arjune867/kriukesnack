
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Admin } from '../types';

interface AuthContextType {
    admin: Admin | null;
    login: (user: string, pass: string) => boolean;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_USER = 'arjune';
const ADMIN_PASS = 'kriuke123';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [admin, setAdmin] = useState<Admin | null>(() => {
        try {
            const storedAdmin = sessionStorage.getItem('kriuke_admin');
            return storedAdmin ? JSON.parse(storedAdmin) : null;
        } catch {
            return null;
        }
    });

    const login = (user: string, pass: string) => {
        if (user === ADMIN_USER && pass === ADMIN_PASS) {
            const adminData = { username: user };
            setAdmin(adminData);
            sessionStorage.setItem('kriuke_admin', JSON.stringify(adminData));
            return true;
        }
        return false;
    };

    const logout = () => {
        setAdmin(null);
        sessionStorage.removeItem('kriuke_admin');
    };

    return (
        <AuthContext.Provider value={{ admin, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
