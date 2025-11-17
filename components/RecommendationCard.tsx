


import React, { useMemo } from 'react';
import { Product, Page } from '../types';
import { Icon } from './Icon';

interface RecommendationCardProps {
    product: Product;
    navigate: (page: Page, productId?: string) => void;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
    <div className="flex items-center gap-1">
        <Icon name="star" className="w-3 h-3 text-amber-400" isSolid={true} />
        <span className="text-[10px] text-gray-600 dark:text-gray-300 font-semibold">{rating.toFixed(1)}</span>
    </div>
);

const RecommendationCard: React.FC<RecommendationCardProps> = ({ product, navigate }) => {
    
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount).replace(/\s?Rp\s?/,'');
    };

    const handleCardClick = () => {
        navigate('product', product.id);
    };

    const priceDisplay = useMemo(() => {
        if (!product.variants || product.variants.length === 0) {
            return 'Rp 0';
        }
        const minPrice = Math.min(...product.variants.map(v => v.price));
        return `Rp ${formatCurrency(minPrice)}`;
    }, [product.variants]);

    const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
    const isOutOfStock = totalStock === 0;

    return (
        <div 
            className="flex-shrink-0 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden flex flex-col cursor-pointer transition-transform duration-200 active:scale-95"
            onClick={handleCardClick}
            role="button"
            tabIndex={0}
        >
            <div className="relative aspect-square w-full">
                <img src={product.imageUrl} alt={product.name} className={`w-full h-full object-cover ${isOutOfStock ? 'grayscale' : ''}`} />
                {isOutOfStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-bold text-xs bg-red-500/90 px-2 py-0.5 rounded">Habis</span>
                    </div>
                )}
            </div>
            <div className="p-2 flex-grow flex flex-col text-left">
                <div className="flex items-center justify-between">
                    <StarRating rating={product.rating} />
                    <p className="text-[10px] text-gray-400 dark:text-gray-500">{product.soldCount || 0} terjual</p>
                </div>
                <div className="mt-1">
                     <p className="text-xs font-bold text-red-500">
                        {product.variants.length > 1 ? 'Mulai ' : ''}{priceDisplay}
                    </p>
                </div>
                <div className="flex-grow" />
                <div className="flex items-center justify-between mt-2 gap-2">
                    <div className="w-full text-center text-xs font-semibold text-orange-600 dark:text-orange-400 border border-orange-500/50 bg-orange-50 dark:bg-orange-500/10 py-1.5 rounded-md">
                       Lihat Detail
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecommendationCard;