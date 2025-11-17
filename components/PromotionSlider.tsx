import React from 'react';
import { usePromotions } from '../hooks/usePromotions';
import { useProducts } from '../hooks/useProducts';
import { Page } from '../types';

interface PromotionSliderProps {
    navigate: (page: Page, productId: string) => void;
}

const PromotionSlider: React.FC<PromotionSliderProps> = ({ navigate }) => {
    const { promotions } = usePromotions();
    const { getProductById } = useProducts();

    // Ensure that we only display promotions that link to an existing product.
    const validPromotions = promotions.filter(promo => getProductById(promo.productId));

    if (validPromotions.length === 0) {
        return null;
    }

    return (
        <div className="px-4 pb-4">
            <div className="flex space-x-4 overflow-x-auto pb-2 -mx-4 px-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {validPromotions.map(promo => (
                    <div
                        key={promo.id}
                        onClick={() => navigate('product', promo.productId)}
                        className="flex-shrink-0 w-2/5 md:w-1/4 cursor-pointer"
                        role="button"
                        aria-label={`View promotion for ${promo.title}`}
                    >
                        <div className="rounded-lg shadow-md overflow-hidden aspect-square">
                            <img 
                                src={promo.imageUrl} 
                                alt={promo.title} 
                                className="w-full h-full object-cover" 
                            />
                        </div>
                        <p className="mt-2 text-center text-xs font-semibold text-gray-700 dark:text-gray-200 leading-tight h-8">
                            {promo.title}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PromotionSlider;