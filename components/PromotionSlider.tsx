
import React from 'react';
import { usePromotions } from '../hooks/usePromotions';
import { Page } from '../types';

interface PromotionSliderProps {
    navigate: (page: Page, productId: string) => void;
}

const PromotionSlider: React.FC<PromotionSliderProps> = ({ navigate }) => {
    const { promotions } = usePromotions();

    if (promotions.length === 0) {
        return null;
    }

    return (
        <div className="px-4 pb-4">
            <div className="flex space-x-3 overflow-x-auto pb-2 -mx-4 px-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {promotions.map(promo => (
                    <div
                        key={promo.id}
                        onClick={() => navigate('product', promo.productId)}
                        className="flex-shrink-0 w-4/5 md:w-2/5 cursor-pointer rounded-lg shadow-md overflow-hidden"
                        role="button"
                        aria-label={`View promotion for product ID ${promo.productId}`}
                    >
                        <img 
                            src={promo.imageUrl} 
                            alt={`Promotion ${promo.id}`} 
                            className="w-full h-full object-cover aspect-[16/7]" 
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PromotionSlider;