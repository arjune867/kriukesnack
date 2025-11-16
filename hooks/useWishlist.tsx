
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

interface WishlistContextType {
    wishlist: string[]; // Array of product IDs
    toggleWishlist: (productId: string) => void;
    isProductInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [wishlist, setWishlist] = useState<string[]>([]);

    useEffect(() => {
        try {
            const storedWishlist = localStorage.getItem('kriuke_wishlist');
            if (storedWishlist) {
                setWishlist(JSON.parse(storedWishlist));
            }
        } catch (error) {
            console.error("Failed to load wishlist from localStorage", error);
        }
    }, []);

    const persistWishlist = (newWishlist: string[]) => {
        localStorage.setItem('kriuke_wishlist', JSON.stringify(newWishlist));
        setWishlist(newWishlist);
    };

    const toggleWishlist = useCallback((productId: string) => {
        setWishlist(prevWishlist => {
            const isInWishlist = prevWishlist.includes(productId);
            const newWishlist = isInWishlist
                ? prevWishlist.filter(id => id !== productId)
                : [...prevWishlist, productId];
            persistWishlist(newWishlist);
            return newWishlist;
        });
    }, []);
    
    const isProductInWishlist = useCallback((productId: string) => {
        return wishlist.includes(productId);
    }, [wishlist]);

    const value = { wishlist, toggleWishlist, isProductInWishlist };

    return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = (): WishlistContextType => {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};
