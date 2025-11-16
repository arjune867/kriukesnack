
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Product } from '../types';
import { MOCK_PRODUCTS } from '../data/mockData';

interface ProductsContextType {
    products: Product[];
    addProduct: (product: Omit<Product, 'id' | 'rating' | 'reviewCount'>) => void;
    updateProduct: (product: Product) => void;
    deleteProduct: (productId: string) => void;
    getProductById: (productId: string) => Product | undefined;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        try {
            const storedProducts = localStorage.getItem('kriuke_products');
            if (storedProducts) {
                setProducts(JSON.parse(storedProducts));
            } else {
                setProducts(MOCK_PRODUCTS);
                localStorage.setItem('kriuke_products', JSON.stringify(MOCK_PRODUCTS));
            }
        } catch (error) {
            console.error("Failed to load products from localStorage", error);
            setProducts(MOCK_PRODUCTS);
        }
    }, []);

    const persistProducts = (newProducts: Product[]) => {
        localStorage.setItem('kriuke_products', JSON.stringify(newProducts));
        setProducts(newProducts);
    };

    const addProduct = useCallback((productData: Omit<Product, 'id' | 'rating' | 'reviewCount'>) => {
        const newProduct: Product = {
            id: new Date().getTime().toString(),
            rating: 0,
            reviewCount: 0,
            ...productData,
        };
        const updatedProducts = [...products, newProduct];
        persistProducts(updatedProducts);
    }, [products]);

    const updateProduct = useCallback((updatedProduct: Product) => {
        const updatedProducts = products.map(p => p.id === updatedProduct.id ? updatedProduct : p);
        persistProducts(updatedProducts);
    }, [products]);

    const deleteProduct = useCallback((productId: string) => {
        const updatedProducts = products.filter(p => p.id !== productId);
        persistProducts(updatedProducts);
    }, [products]);
    
    const getProductById = useCallback((productId: string) => {
        return products.find(p => p.id === productId);
    }, [products]);

    const value = { products, addProduct, updateProduct, deleteProduct, getProductById };

    return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
};

export const useProducts = (): ProductsContextType => {
    const context = useContext(ProductsContext);
    if (context === undefined) {
        throw new Error('useProducts must be used within a ProductProvider');
    }
    return context;
};