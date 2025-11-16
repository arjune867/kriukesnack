
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Category } from '../types';
import { MOCK_CATEGORIES } from '../data/mockData';

interface CategoriesContextType {
    categories: Category[];
    addCategory: (name: string) => void;
    updateCategory: (category: Category) => void;
    deleteCategory: (categoryId: string) => void;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export const CategoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        try {
            const storedCategories = localStorage.getItem('kriuke_categories');
            if (storedCategories) {
                setCategories(JSON.parse(storedCategories));
            } else {
                setCategories(MOCK_CATEGORIES);
                localStorage.setItem('kriuke_categories', JSON.stringify(MOCK_CATEGORIES));
            }
        } catch (error) {
            console.error("Failed to load categories from localStorage", error);
            setCategories(MOCK_CATEGORIES);
        }
    }, []);

    const persistCategories = (newCategories: Category[]) => {
        localStorage.setItem('kriuke_categories', JSON.stringify(newCategories));
        setCategories(newCategories);
    };

    const addCategory = useCallback((name: string) => {
        const newCategory: Category = {
            id: new Date().getTime().toString(),
            name,
        };
        const updatedCategories = [...categories, newCategory];
        persistCategories(updatedCategories);
    }, [categories]);

    const updateCategory = useCallback((updatedCategory: Category) => {
        const updatedCategories = categories.map(c => c.id === updatedCategory.id ? updatedCategory : c);
        persistCategories(updatedCategories);
    }, [categories]);

    const deleteCategory = useCallback((categoryId: string) => {
        const updatedCategories = categories.filter(c => c.id !== categoryId);
        persistCategories(updatedCategories);
    }, [categories]);

    const value = { categories, addCategory, updateCategory, deleteCategory };

    return <CategoriesContext.Provider value={value}>{children}</CategoriesContext.Provider>;
};

export const useCategories = (): CategoriesContextType => {
    const context = useContext(CategoriesContext);
    if (context === undefined) {
        throw new Error('useCategories must be used within a CategoryProvider');
    }
    return context;
};
