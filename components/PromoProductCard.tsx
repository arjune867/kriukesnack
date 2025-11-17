import React from 'react';
import { Product, Page } from '../types';
import { useDiscounts } from '../hooks/useDiscounts';
import { useCart } from '../hooks/useCart';

interface PromoProductCardProps {
    product: Product;
    navigate: (page: Page, productId?: string) => void;
}

const PromoProductCard: React.FC<PromoProductCardProps> = ({ product, navigate }) => {
    const { discounts } = useDiscounts();
    const { addToCart } = useCart();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const discount = product.discountCodeId ? discounts.find(d => d.id === product.discountCodeId) : null;
    const isSingleVariant = product.variants.length === 1;
    const singleVariant = isSingleVariant ? product.variants[0] : null;
    const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
    const isOutOfStock = totalStock === 0;

    const price = singleVariant ? singleVariant.price : Math.min(...product.variants.map(v => v.price));

    const discountedPrice = discount
        ? discount.type === 'percentage'
            ? price * (1 - discount.value / 100)
            : Math.max(0, price - discount.value)
        : price;

    const handleBuyNow = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isSingleVariant && singleVariant && !isOutOfStock) {
            addToCart(product, singleVariant);
            navigate('cart');
        } else {
            // If multiple variants, navigate to product page to choose
            navigate('product', product.id);
        }
    };

    return (
        <div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden flex items-center gap-4 p-3 cursor-pointer"
            onClick={() => navigate('product', product.id)}
        >
            <div className="flex-shrink-0 relative">
                <img src={product.imageUrl} alt={product.name} className="w-24 h-24 rounded-md object-cover" />
                {isOutOfStock && (
                     <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-md">
                        <span className="text-white font-bold text-sm bg-red-500/90 px-2 py-1 rounded">Habis</span>
                    </div>
                )}
            </div>
            <div className="flex-grow flex flex-col justify-between h-24">
                <div>
                    <h3 className="font-bold text-sm text-gray-800 dark:text-gray-100 leading-tight">{product.name}</h3>
                    <div className="flex items-baseline gap-2 mt-1">
                        <p className="text-orange-500 font-bold">{formatCurrency(discountedPrice)}</p>
                        {discount && (
                            <p className="text-gray-400 dark:text-gray-500 text-xs line-through">{formatCurrency(price)}</p>
                        )}
                    </div>
                </div>
                 <div className="flex items-center justify-between">
                     {discount ? (
                        <div className="flex items-center gap-1.5">
                            <span className="text-xs text-gray-500 dark:text-gray-400">Kode:</span>
                            <span className="text-xs font-bold text-green-600 bg-green-100 dark:bg-green-800 dark:text-green-300 px-2 py-0.5 rounded-md">{discount.code}</span>
                        </div>
                     ) : <div />}
                     <button
                        onClick={handleBuyNow}
                        disabled={isOutOfStock}
                        className="text-center text-sm font-semibold text-white bg-green-500 hover:bg-green-600 py-1.5 px-4 rounded-lg transition-colors active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        aria-label="Beli"
                    >
                        Beli
                    </button>
                 </div>
            </div>
        </div>
    );
};

export default PromoProductCard;