import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { Admin, User } from '../types';

interface AuthContextType {
    admin: Admin | null;
    currentUser: User | null;
    adminLogin: (user: string, pass: string) => boolean;
    login: (user: string, pass: string) => boolean;
    logout: () => void;
    register: (username: string, pass: string, email: string, whatsapp: string) => { success: boolean, message: string };
    findUserByUsername: (username: string) => User | undefined;
    updatePassword: (username: string, newPass: string) => { success: boolean, message: string };
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

    const [currentUser, setCurrentUser] = useState<User | null>(() => {
        try {
            const storedUser = sessionStorage.getItem('kriuke_user');
            return storedUser ? JSON.parse(storedUser) : null;
        } catch {
            return null;
        }
    });

    const [users, setUsers] = useState<User[]>(() => {
        try {
            const storedUsers = localStorage.getItem('kriuke_users');
            return storedUsers ? JSON.parse(storedUsers) : [];
        } catch {
            return [];
        }
    });

    const persistUsers = (newUsers: User[]) => {
        localStorage.setItem('kriuke_users', JSON.stringify(newUsers));
        setUsers(newUsers);
    };

    const adminLogin = (user: string, pass: string) => {
        if (user === ADMIN_USER && pass === ADMIN_PASS) {
            const adminData = { username: user };
            setAdmin(adminData);
            setCurrentUser(null);
            sessionStorage.setItem('kriuke_admin', JSON.stringify(adminData));
            sessionStorage.removeItem('kriuke_user');
            return true;
        }
        return false;
    };

    const login = (username: string, pass: string) => {
        const foundUser = users.find(u => u.username === username && u.password === pass);
        if (foundUser) {
            setCurrentUser(foundUser);
            setAdmin(null);
            sessionStorage.setItem('kriuke_user', JSON.stringify(foundUser));
            sessionStorage.removeItem('kriuke_admin');
            return true;
        }
        return false;
    };

    const register = (username: string, pass: string, email: string, whatsapp: string) => {
        if (users.some(u => u.username === username)) {
            return { success: false, message: 'Username sudah digunakan.' };
        }
        const newUser: User = { username, password: pass, email, whatsapp };
        persistUsers([...users, newUser]);
        return { success: true, message: 'Registrasi berhasil!' };
    };
    
    const findUserByUsername = (username: string) => {
        return users.find(u => u.username.toLowerCase() === username.toLowerCase());
    };

    const updatePassword = (username: string, newPass: string) => {
        const userExists = users.some(u => u.username === username);
        if (!userExists) {
            return { success: false, message: 'Pengguna tidak ditemukan.' };
        }
        const updatedUsers = users.map(u => 
            u.username === username ? { ...u, password: newPass } : u
        );
        persistUsers(updatedUsers);
        return { success: true, message: 'Password berhasil diubah!' };
    };

    const logout = useCallback(() => {
        setAdmin(null);
        setCurrentUser(null);
        sessionStorage.removeItem('kriuke_admin');
        sessionStorage.removeItem('kriuke_user');
    }, []);

    return (
        <AuthContext.Provider value={{ admin, currentUser, adminLogin, login, logout, register, findUserByUsername, updatePassword }}>
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