import React from 'react';
import { Product } from '../types';
import { Icon } from './Icon';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { useShare } from '../hooks/useShare';
import { useDiscounts } from '../hooks/useDiscounts';

interface ProductCardProps {
    product: Product;
    onCardClick: () => void;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
    return (
        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
            <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                    <Icon
                        key={i}
                        name="star"
                        className={`w-4 h-4 ${i < Math.round(rating) ? 'text-amber-400' : 'text-gray-300'}`}
                        isSolid={true}
                    />
                ))}
            </div>
            <span className="font-semibold text-gray-700">{rating.toFixed(1)}</span>
        </div>
    );
};


const ProductCard: React.FC<ProductCardProps> = ({ product, onCardClick }) => {
    const { addToCart } = useCart();
    const { toggleWishlist, isProductInWishlist } = useWishlist();
    const { openShareModal } = useShare();
    const { discounts } = useDiscounts();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount).replace('Rp', 'Rp ').trim();
    };
    
    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        addToCart(product);
    };
    
    const handleToggleWishlist = (e: React.MouseEvent) => {
        e.stopPropagation();
        toggleWishlist(product.id);
    };
    
    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation();
        openShareModal(product);
    };

    const inWishlist = isProductInWishlist(product.id);

    const discount = product.discountCodeId ? discounts.find(d => d.id === product.discountCodeId) : null;

    return (
        <div 
            className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col cursor-pointer transition-transform duration-200 active:scale-95"
            onClick={onCardClick}
            role="button"
            tabIndex={0}
            aria-label={`View details for ${product.name}`}
        >
            <div className="relative aspect-square w-full">
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                {discount && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        DISKON {discount.type === 'percentage' ? `${discount.value}%` : `Rp ${discount.value/1000}rb`}
                    </div>
                )}
                <button 
                    className={`absolute top-2 right-2 bg-white/70 backdrop-blur-sm rounded-full p-1.5 transition-colors ${inWishlist ? 'text-red-500' : 'text-gray-700 hover:text-red-500'}`}
                    onClick={handleToggleWishlist}
                    aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                >
                    <Icon name="heart" className="w-5 h-5" isSolid={inWishlist} />
                </button>
            </div>
            <div className="p-2 flex-grow flex flex-col">
                <h3 className="text-[11px] font-bold text-gray-800 leading-tight min-h-[34px]">{product.name}</h3>
                <StarRating rating={product.rating} />
                <p className="text-[10px] text-gray-400">({product.soldCount || 0} terjual)</p>
                <p className="text-[10px] text-gray-500">{product.category}</p>
                <div className="flex-grow" />
                <div className="flex items-baseline gap-2 mt-1">
                    <p className="text-xs font-bold text-orange-500">{formatCurrency(product.discountedPrice ?? product.price)}</p>
                    {product.discountedPrice && (
                        <p className="text-[10px] text-gray-400 line-through">{formatCurrency(product.price)}</p>
                    )}
                </div>
                <div className="flex items-center justify-between mt-2 gap-2">
                     <button onClick={handleShare} className="border border-gray-300 rounded-md p-1.5 text-gray-600 hover:bg-gray-100 flex-1 flex justify-center" aria-label="Share product">
                        <Icon name="share" className="w-4 h-4"/>
                     </button>
                     <button onClick={handleAddToCart} className="border border-orange-500 bg-orange-500 rounded-md p-1.5 text-white hover:bg-orange-600 flex-1 flex justify-center" aria-label="Add to cart">
                         <Icon name="cart" className="w-4 h-4"/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;