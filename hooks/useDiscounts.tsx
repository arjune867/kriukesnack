import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { DiscountCode } from '../types';
import { MOCK_DISCOUNTS } from '../data/mockData';

interface DiscountsContextType {
    discounts: DiscountCode[];
    addDiscount: (discount: Omit<DiscountCode, 'id'>) => void;
    updateDiscount: (discount: DiscountCode) => void;
    deleteDiscount: (discountId: string) => void;
    validateDiscountCode: (code: string) => DiscountCode | null;
}

const DiscountsContext = createContext<DiscountsContextType | undefined>(undefined);

export const DiscountProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [discounts, setDiscounts] = useState<DiscountCode[]>([]);

    useEffect(() => {
        try {
            const storedDiscounts = localStorage.getItem('kriuke_discounts');
            if (storedDiscounts) {
                setDiscounts(JSON.parse(storedDiscounts));
            } else {
                setDiscounts(MOCK_DISCOUNTS);
                localStorage.setItem('kriuke_discounts', JSON.stringify(MOCK_DISCOUNTS));
            }
        } catch (error) {
            console.error("Failed to load discounts from localStorage", error);
            setDiscounts(MOCK_DISCOUNTS);
        }
    }, []);

    const persistDiscounts = (newDiscounts: DiscountCode[]) => {
        localStorage.setItem('kriuke_discounts', JSON.stringify(newDiscounts));
        setDiscounts(newDiscounts);
    };

    const addDiscount = useCallback((discountData: Omit<DiscountCode, 'id'>) => {
        const newDiscount: DiscountCode = {
            id: new Date().getTime().toString(),
            ...discountData,
            code: discountData.code.toUpperCase(),
        };
        const updatedDiscounts = [...discounts, newDiscount];
        persistDiscounts(updatedDiscounts);
    }, [discounts]);

    const updateDiscount = useCallback((updatedDiscount: DiscountCode) => {
        const updatedDiscounts = discounts.map(d => 
            d.id === updatedDiscount.id 
            ? { ...updatedDiscount, code: updatedDiscount.code.toUpperCase() } 
            : d
        );
        persistDiscounts(updatedDiscounts);
    }, [discounts]);

    const deleteDiscount = useCallback((discountId: string) => {
        const updatedDiscounts = discounts.filter(d => d.id !== discountId);
        persistDiscounts(updatedDiscounts);
    }, [discounts]);

    const validateDiscountCode = useCallback((code: string): DiscountCode | null => {
        const found = discounts.find(d => d.code.toUpperCase() === code.toUpperCase());
        return found || null;
    }, [discounts]);

    const value = { discounts, addDiscount, updateDiscount, deleteDiscount, validateDiscountCode };

    return <DiscountsContext.Provider value={value}>{children}</DiscountsContext.Provider>;
};

export const useDiscounts = (): DiscountsContextType => {
    const context = useContext(DiscountsContext);
    if (context === undefined) {
        throw new Error('useDiscounts must be used within a DiscountProvider');
    }
    return context;
};