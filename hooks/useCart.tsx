import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Product, DiscountCode } from '../types';
import { useDiscounts } from './useDiscounts';

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
    subtotal: number;
    discountAmount: number;
    totalPrice: number;
    appliedDiscount: DiscountCode | null;
    applyDiscount: (code: string) => { success: boolean, message: string };
    removeDiscount: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [appliedDiscount, setAppliedDiscount] = useState<DiscountCode | null>(null);
    const { validateDiscountCode } = useDiscounts();

    useEffect(() => {
        try {
            const storedCart = localStorage.getItem('kriuke_cart');
            if (storedCart) {
                setCartItems(JSON.parse(storedCart));
            }
            const storedDiscount = localStorage.getItem('kriuke_discount');
            if (storedDiscount) {
                setAppliedDiscount(JSON.parse(storedDiscount));
            }
        } catch (error) {
            console.error("Failed to load cart/discount from localStorage", error);
        }
    }, []);

    const persistCart = (newCart: CartItem[]) => {
        localStorage.setItem('kriuke_cart', JSON.stringify(newCart));
        setCartItems(newCart);
    };

    const persistDiscount = (discount: DiscountCode | null) => {
        if (discount) {
            localStorage.setItem('kriuke_discount', JSON.stringify(discount));
        } else {
            localStorage.removeItem('kriuke_discount');
        }
        setAppliedDiscount(discount);
    }

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
        let updatedCart;
        if (quantity <= 0) {
            updatedCart = cartItems.filter(item => item.id !== productId);
        } else {
            updatedCart = cartItems.map(item =>
                item.id === productId ? { ...item, quantity } : item
            );
        }
        persistCart(updatedCart);
    }, [cartItems]);

    const removeFromCart = useCallback((productId: string) => {
        const updatedCart = cartItems.filter(item => item.id !== productId);
        persistCart(updatedCart);
    }, [cartItems]);

    const clearCart = useCallback(() => {
        persistCart([]);
        persistDiscount(null);
    }, []);
    
    const applyDiscount = (code: string) => {
        const discount = validateDiscountCode(code);
        if (discount) {
            persistDiscount(discount);
            return { success: true, message: 'Kode diskon berhasil diterapkan!' };
        }
        return { success: false, message: 'Kode diskon tidak valid.' };
    };

    const removeDiscount = () => {
        persistDiscount(null);
    };

    const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    let discountAmount = 0;
    if (appliedDiscount) {
        if (appliedDiscount.type === 'percentage') {
            discountAmount = subtotal * (appliedDiscount.value / 100);
        } else {
            discountAmount = appliedDiscount.value;
        }
    }
    
    const totalPrice = Math.max(0, subtotal - discountAmount);

    const value = { cartItems, addToCart, removeFromCart, updateQuantity, clearCart, itemCount, subtotal, discountAmount, totalPrice, appliedDiscount, applyDiscount, removeDiscount };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};