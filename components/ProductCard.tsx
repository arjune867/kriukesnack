import React from 'react';
import { Product } from '../types';
import { Icon } from './Icon';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { useShare } from '../hooks/useShare';

interface ProductCardProps {
    product: Product;
    onCardClick: () => void;
}

const StarRating: React.FC<{ rating: number; reviewCount: number }> = ({ rating, reviewCount }) => {
    return (
        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
            <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                    <Icon
                        key={i}
                        name="star"
                        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-amber-400' : 'text-gray-300'}`}
                        isSolid={true}
                    />
                ))}
            </div>
            <span className="font-semibold text-gray-700">{rating.toFixed(1)}</span>
            <span className="text-gray-400">({reviewCount})</span>
        </div>
    );
};


const ProductCard: React.FC<ProductCardProps> = ({ product, onCardClick }) => {
    const { addToCart } = useCart();
    const { toggleWishlist, isProductInWishlist } = useWishlist();
    const { openShareModal } = useShare();

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
                <button 
                    className={`absolute top-2 right-2 bg-white/70 backdrop-blur-sm rounded-full p-1.5 transition-colors ${inWishlist ? 'text-red-500' : 'text-gray-700 hover:text-red-500'}`}
                    onClick={handleToggleWishlist}
                    aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                >
                    <Icon name="heart" className="w-5 h-5" isSolid={inWishlist} />
                </button>
            </div>
            <div className="p-3 flex-grow flex flex-col">
                <p className="text-xs text-gray-500">{product.category}</p>
                <h3 className="text-sm font-semibold text-gray-800 mt-1 leading-tight">{product.name}</h3>
                <StarRating rating={product.rating} reviewCount={product.reviewCount} />
                <div className="flex-grow" />
                <p className="text-base font-bold text-orange-500 mt-2">{formatCurrency(product.price)}</p>
                <div className="flex items-center justify-between mt-3 gap-2">
                     <button onClick={handleShare} className="border border-gray-300 rounded-md p-2 text-gray-600 hover:bg-gray-100 flex-1 flex justify-center" aria-label="Share product">
                        <Icon name="share" className="w-5 h-5"/>
                     </button>
                     <button onClick={handleAddToCart} className="border border-orange-500 bg-orange-500 rounded-md p-2 text-white hover:bg-orange-600 flex-1 flex justify-center" aria-label="Add to cart">
                         <Icon name="cart" className="w-5 h-5"/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;