import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Product, DiscountCode, Variant } from '../types';
import { useDiscounts } from './useDiscounts';
import { useProducts } from './useProducts';

export interface CartItem {
    product: Product;
    variant: Variant;
    quantity: number;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (product: Product, variant: Variant, quantity?: number) => void;
    removeFromCart: (productId: string, variantId: string) => void;
    updateQuantity: (productId: string, variantId: string, quantity: number) => void;
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
    const { getProductById } = useProducts();

    useEffect(() => {
        try {
            const storedCart = localStorage.getItem('kriuke_cart_v2'); // Use new key for new structure
            if (storedCart) {
                const parsedCart = JSON.parse(storedCart);
                // Data hydration: ensure product data is up-to-date
                const hydratedCart = parsedCart.map(item => {
                    const product = getProductById(item.productId);
                    if (!product) return null;
                    const variant = product.variants.find(v => v.id === item.variantId);
                    if (!variant) return null;
                    return { product, variant, quantity: item.quantity };
                }).filter(Boolean); // Filter out nulls if product/variant was deleted
                setCartItems(hydratedCart);
            }

            const storedDiscount = localStorage.getItem('kriuke_discount');
            if (storedDiscount) {
                setAppliedDiscount(JSON.parse(storedDiscount));
            }
        } catch (error) {
            console.error("Failed to load cart/discount from localStorage", error);
        }
    }, [getProductById]);

    const persistCart = (newCart: CartItem[]) => {
        // Store only identifiers to keep localStorage light and allow for data hydration
        const storableCart = newCart.map(item => ({
            productId: item.product.id,
            variantId: item.variant.id,
            quantity: item.quantity
        }));
        localStorage.setItem('kriuke_cart_v2', JSON.stringify(storableCart));
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

    const addToCart = useCallback((product: Product, variant: Variant, quantity: number = 1) => {
        if (variant.stock === 0) return;
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.product.id === product.id && item.variant.id === variant.id);
            
            const newQuantity = existingItem ? existingItem.quantity + quantity : quantity;
            if (newQuantity > variant.stock) {
                // Optionally: show a notification to the user
                return prevItems; // Do not add more than available in stock
            }

            let newCart;
            if (existingItem) {
                newCart = prevItems.map(item =>
                    (item.product.id === product.id && item.variant.id === variant.id) ? { ...item, quantity: newQuantity } : item
                );
            } else {
                newCart = [...prevItems, { product, variant, quantity }];
            }
            persistCart(newCart);
            return newCart;
        });
    }, []);

    const updateQuantity = useCallback((productId: string, variantId: string, quantity: number) => {
        const itemInCart = cartItems.find(item => item.product.id === productId && item.variant.id === variantId);
        if (!itemInCart) return;

        // Cap quantity at available stock
        const effectiveQuantity = Math.min(quantity, itemInCart.variant.stock);

        let updatedCart;
        if (effectiveQuantity <= 0) {
            updatedCart = cartItems.filter(item => !(item.product.id === productId && item.variant.id === variantId));
        } else {
            updatedCart = cartItems.map(item =>
                (item.product.id === productId && item.variant.id === variantId) ? { ...item, quantity: effectiveQuantity } : item
            );
        }
        persistCart(updatedCart);
    }, [cartItems]);

    const removeFromCart = useCallback((productId: string, variantId: string) => {
        const updatedCart = cartItems.filter(item => !(item.product.id === productId && item.variant.id === variantId));
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

    const subtotal = cartItems.reduce((total, item) => {
        let itemPrice = item.variant.price;
        if (item.product.discountCodeId) {
            const discount = validateDiscountCode(item.product.discountCodeId);
            if (discount) {
                if (discount.type === 'percentage') {
                    itemPrice = itemPrice * (1 - discount.value / 100);
                } else {
                    itemPrice = Math.max(0, itemPrice - discount.value);
                }
            }
        }
        return total + itemPrice * item.quantity;
    }, 0);

    let discountAmount = 0;
    if (appliedDiscount) {
        if (appliedDiscount.type === 'percentage') {
            discountAmount = subtotal * (appliedDiscount.value / 100);
        } else {
            discountAmount = appliedDiscount.value;
        }
    }
    
    const totalPrice = Math.max(0, subtotal - discountAmount);
    const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

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