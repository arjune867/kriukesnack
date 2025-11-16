
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Promotion } from '../types';
import { MOCK_PROMOTIONS } from '../data/mockData';

interface PromotionsContextType {
    promotions: Promotion[];
    addPromotion: (promotion: Omit<Promotion, 'id'>) => void;
    updatePromotion: (promotion: Promotion) => void;
    deletePromotion: (promotionId: string) => void;
}

const PromotionsContext = createContext<PromotionsContextType | undefined>(undefined);

export const PromotionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [promotions, setPromotions] = useState<Promotion[]>([]);

    useEffect(() => {
        try {
            const storedPromotions = localStorage.getItem('kriuke_promotions');
            if (storedPromotions) {
                setPromotions(JSON.parse(storedPromotions));
            } else {
                setPromotions(MOCK_PROMOTIONS);
                localStorage.setItem('kriuke_promotions', JSON.stringify(MOCK_PROMOTIONS));
            }
        } catch (error) {
            console.error("Failed to load promotions from localStorage", error);
            setPromotions(MOCK_PROMOTIONS);
        }
    }, []);

    const persistPromotions = (newPromotions: Promotion[]) => {
        localStorage.setItem('kriuke_promotions', JSON.stringify(newPromotions));
        setPromotions(newPromotions);
    };

    const addPromotion = useCallback((promotionData: Omit<Promotion, 'id'>) => {
        const newPromotion: Promotion = {
            id: new Date().getTime().toString(),
            ...promotionData,
        };
        const updatedPromotions = [...promotions, newPromotion];
        persistPromotions(updatedPromotions);
    }, [promotions]);

    const updatePromotion = useCallback((updatedPromotion: Promotion) => {
        const updatedPromotions = promotions.map(p => p.id === updatedPromotion.id ? updatedPromotion : p);
        persistPromotions(updatedPromotions);
    }, [promotions]);

    const deletePromotion = useCallback((promotionId: string) => {
        const updatedPromotions = promotions.filter(p => p.id !== promotionId);
        persistPromotions(updatedPromotions);
    }, [promotions]);

    const value = { promotions, addPromotion, updatePromotion, deletePromotion };

    return <PromotionsContext.Provider value={value}>{children}</PromotionsContext.Provider>;
};

export const usePromotions = (): PromotionsContextType => {
    const context = useContext(PromotionsContext);
    if (context === undefined) {
        throw new Error('usePromotions must be used within a PromotionProvider');
    }
    return context;
};