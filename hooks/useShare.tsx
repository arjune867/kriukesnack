import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '../types';
import ShareModal from '../components/ShareModal';

interface ShareContextType {
    openShareModal: (product: Product) => void;
}

const ShareContext = createContext<ShareContextType | undefined>(undefined);

export const ShareProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [productToShare, setProductToShare] = useState<Product | null>(null);

    const openShareModal = (product: Product) => {
        setProductToShare(product);
    };

    const closeShareModal = () => {
        setProductToShare(null);
    };

    return (
        <ShareContext.Provider value={{ openShareModal }}>
            {children}
            {productToShare && <ShareModal product={productToShare} onClose={closeShareModal} />}
        </ShareContext.Provider>
    );
};

export const useShare = (): ShareContextType => {
    const context = useContext(ShareContext);
    if (!context) {
        throw new Error('useShare must be used within a ShareProvider');
    }
    return context;
};
