

import React, { useMemo } from 'react';
import { useProducts } from '../hooks/useProducts';
import { Page } from '../types';
import RecommendationCard from './RecommendationCard';

interface RecommendedProductsProps {
    category: string;
    currentProductId: string;
    navigate: (page: Page, productId?: string) => void;
}

const RecommendedProducts: React.FC<RecommendedProductsProps> = ({ category, currentProductId, navigate }) => {
    const { products } = useProducts();

    const recommended = useMemo(() => {
        return products
            .filter(p => p.category === category && p.id !== currentProductId)
            .slice(0, 5); // Limit to 5 products
    }, [products, category, currentProductId]);

    if (recommended.length === 0) {
        return null;
    }

    return (
        <div className="bg-gray-50 dark:bg-gray-950 py-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 px-4 mb-4">Rekomendasi untuk Anda</h2>
            <div className="flex space-x-3 overflow-x-auto pb-2 -mx-4 px-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <div className="flex-shrink-0 w-1"></div> {/* Spacer */}
                {recommended.map(product => (
                    <RecommendationCard 
                        key={product.id}
                        product={product}
                        navigate={navigate}
                    />
                ))}
                <div className="flex-shrink-0 w-1"></div> {/* Spacer */}
            </div>
        </div>
    );
};

export default RecommendedProducts;