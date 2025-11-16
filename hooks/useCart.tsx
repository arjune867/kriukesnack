
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Product } from '../types';

export interface CartItem extends Product {
    quantity: number;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    useEffect(() => {
        try {
            const storedCart = localStorage.getItem('kriuke_cart');
            if (storedCart) {
                setCartItems(JSON.parse(storedCart));
            }
        } catch (error) {
            console.error("Failed to load cart from localStorage", error);
        }
    }, []);

    const persistCart = (newCart: CartItem[]) => {
        localStorage.setItem('kriuke_cart', JSON.stringify(newCart));
        setCartItems(newCart);
    };

    const addToCart = useCallback((product: Product) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);
            let newCart;
            if (existingItem) {
                newCart = prevItems.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                newCart = [...prevItems, { ...product, quantity: 1 }];
            }
            persistCart(newCart);
            return newCart;
        });
    }, []);

    const updateQuantity = useCallback((productId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            const updatedCart = cartItems.map(item =>
                item.id === productId ? { ...item, quantity } : item
            );
            persistCart(updatedCart);
        }
    }, [cartItems]);


    const removeFromCart = useCallback((productId: string) => {
        const updatedCart = cartItems.filter(item => item.id !== productId);
        persistCart(updatedCart);
    }, [cartItems]);

    const clearCart = useCallback(() => {
        persistCart([]);
    }, []);
    
    const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    const value = { cartItems, addToCart, removeFromCart, updateQuantity, clearCart, itemCount };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
