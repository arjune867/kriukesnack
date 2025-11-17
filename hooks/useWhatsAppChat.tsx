
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '../types';
import WhatsAppChatModal from '../components/WhatsAppChatModal';

interface WhatsAppChatContextType {
    openWhatsAppModal: (product: Product) => void;
}

const WhatsAppChatContext = createContext<WhatsAppChatContextType | undefined>(undefined);

export const WhatsAppChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [productForChat, setProductForChat] = useState<Product | null>(null);

    const openWhatsAppModal = (product: Product) => {
        setProductForChat(product);
    };

    const closeWhatsAppModal = () => {
        setProductForChat(null);
    };

    return (
        <WhatsAppChatContext.Provider value={{ openWhatsAppModal }}>
            {children}
            {productForChat && <WhatsAppChatModal product={productForChat} onClose={closeWhatsAppModal} />}
        </WhatsAppChatContext.Provider>
    );
};

export const useWhatsAppChat = (): WhatsAppChatContextType => {
    const context = useContext(WhatsAppChatContext);
    if (!context) {
        throw new Error('useWhatsAppChat must be used within a WhatsAppChatProvider');
    }
    return context;
};
