

import React, { useMemo } from 'react';
import { Product, Page } from '../types';
import { Icon } from './Icon';
import { useDiscounts } from '../hooks/useDiscounts';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';

interface ProductCardProps {
    product: Product;
    onCardClick: () => void;
    navigate: (page: Page) => void;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
    return (
        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
            <Icon name="star" className="w-4 h-4 text-amber-400" isSolid={true} />
            <span className="font-semibold text-gray-700 dark:text-gray-300">Rating {rating.toFixed(1)}</span>
        </div>
    );
};


const ProductCard: React.FC<ProductCardProps> = ({ product, onCardClick, navigate }) => {
    const { discounts } = useDiscounts();
    const { addToCart } = useCart();
    const { toggleWishlist, isProductInWishlist } = useWishlist();
    
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount).replace('Rp', 'Rp ').trim();
    };
    
    const handleToggleWishlist = (e: React.MouseEvent) => {
        e.stopPropagation();
        toggleWishlist(product.id);
    };

    const isSingleVariant = product.variants.length === 1;
    const singleVariant = isSingleVariant ? product.variants[0] : null;
    const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
    const isOutOfStock = totalStock === 0;

    const { priceDisplay, originalPriceDisplay } = useMemo(() => {
        if (!product.variants || product.variants.length === 0) {
            return { priceDisplay: formatCurrency(0), originalPriceDisplay: null };
        }

        const discount = product.discountCodeId ? discounts.find(d => d.id === product.discountCodeId) : null;
        
        const calculateDiscountedPrice = (price: number) => {
            if (!discount) return price;
            return discount.type === 'percentage'
                ? price * (1 - discount.value / 100)
                : Math.max(0, price - discount.value);
        };
        
        const prices = product.variants.map(v => v.price);
        const discountedPrices = product.variants.map(v => calculateDiscountedPrice(v.price));

        const minPrice = Math.min(...prices);
        const minDiscountedPrice = Math.min(...discountedPrices);

        if (product.variants.length === 1) {
             return { 
                priceDisplay: formatCurrency(minDiscountedPrice), 
                originalPriceDisplay: discount ? formatCurrency(minPrice) : null 
            };
        } else {
            return { 
                priceDisplay: `Mulai ${formatCurrency(minDiscountedPrice)}`, 
                originalPriceDisplay: null 
            };
        }
    }, [product, discounts]);
    
    const discount = product.discountCodeId ? discounts.find(d => d.id === product.discountCodeId) : null;
    const inWishlist = isProductInWishlist(product.id);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isSingleVariant && singleVariant && !isOutOfStock) {
            addToCart(product, singleVariant);
        } else {
            onCardClick();
        }
    };

    const handleBuyNow = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isSingleVariant && singleVariant && !isOutOfStock) {
            addToCart(product, singleVariant);
            navigate('cart');
        } else {
            onCardClick();
        }
    };

    return (
        <div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden flex flex-col cursor-pointer transition-transform duration-200 active:scale-95"
            onClick={onCardClick}
            role="button"
            tabIndex={0}
            aria-label={`View details for ${product.name}`}
        >
            <div className="relative aspect-square w-full">
                <img src={product.imageUrl} alt={product.name} className={`w-full h-full object-cover ${isOutOfStock ? 'grayscale' : ''}`} />
                 {isOutOfStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-bold text-base bg-red-500/90 px-3 py-1 rounded">Habis</span>
                    </div>
                )}
                {discount && !isOutOfStock && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-md shadow-lg z-10">
                        <span>{discount.type === 'percentage' ? `Diskon ${discount.value}%` : `Hemat Rp${(discount.value / 1000).toLocaleString('id-ID')}rb`}</span>
                    </div>
                )}
                <div className="absolute top-2 right-2 flex flex-col items-center gap-1.5 z-10">
                    <button 
                        className={`bg-white/70 dark:bg-gray-900/50 backdrop-blur-sm rounded-full p-1.5 transition-all duration-200 hover:bg-white dark:hover:bg-gray-800 ${inWishlist ? 'text-red-500' : 'text-gray-700 dark:text-gray-300 hover:text-red-500'}`}
                        onClick={handleToggleWishlist}
                        aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                    >
                        <Icon name="heart" className="w-5 h-5" isSolid={inWishlist} />
                    </button>
                </div>
            </div>
            <div className="p-2 flex-grow flex flex-col">
                <h3 className="text-[11px] font-bold text-gray-800 dark:text-gray-100 leading-tight min-h-[34px]">{product.name}</h3>
                <StarRating rating={product.rating} />
                <p className="text-[10px] text-gray-400 dark:text-gray-500">({product.soldCount || 0} terjual)</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">{product.category}</p>
                <div className="flex-grow" />
                <div className="flex items-baseline gap-2 mt-1">
                    <p className="text-xs font-bold text-orange-500">{priceDisplay}</p>
                    {originalPriceDisplay && (
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 line-through">{originalPriceDisplay}</p>
                    )}
                </div>
                <div className="flex items-center mt-2 gap-2">
                    {isOutOfStock ? (
                        <div className="w-full text-center text-xs font-semibold text-gray-500 bg-gray-200 dark:bg-gray-700 dark:text-gray-400 py-2 rounded-md">
                            Stok Habis
                        </div>
                    ) : (
                        <>
                            <button
                                onClick={handleAddToCart}
                                className="w-1/3 flex items-center justify-center text-green-600 dark:text-green-400 bg-white dark:bg-gray-800 border border-green-500 py-2 rounded-lg transition-colors hover:bg-green-50 dark:hover:bg-gray-700 active:scale-95"
                                aria-label="Tambah ke Keranjang"
                            >
                                <Icon name="cart" className="w-4 h-4" />
                            </button>
                            <button
                                onClick={handleBuyNow}
                                className="w-2/3 text-center text-xs font-semibold text-white bg-green-500 hover:bg-green-600 py-2 rounded-lg transition-colors active:scale-95"
                                aria-label="Beli"
                            >
                                Beli
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;