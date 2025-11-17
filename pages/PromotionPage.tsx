import React from 'react';
import { usePromotions } from '../hooks/usePromotions';
import { useProducts } from '../hooks/useProducts';
import { Page } from '../types';

interface PromotionPageProps {
    navigate: (page: Page, productId?: string) => void;
}

const PromotionPage: React.FC<PromotionPageProps> = ({ navigate }) => {
    const { promotions } = usePromotions();
    const { getProductById } = useProducts();

    const validPromotions = promotions.filter(promo => getProductById(promo.productId));

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Promosi Saat Ini</h1>
            {validPromotions.length > 0 ? (
                <div className="space-y-4">
                    {validPromotions.map(promo => {
                        const product = getProductById(promo.productId);
                        if (!product) return null;

                        return (
                            <div
                                key={promo.id}
                                onClick={() => navigate('product', promo.productId)}
                                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden flex items-center cursor-pointer transition-transform duration-200 active:scale-95"
                                role="button"
                            >
                                <img src={promo.imageUrl} alt={promo.title} className="w-24 h-24 object-cover flex-shrink-0" />
                                <div className="p-4">
                                    <h2 className="font-bold text-gray-800 dark:text-gray-100">{promo.title}</h2>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                        Penawaran untuk: <span className="font-semibold">{product.name}</span>
                                    </p>
                                    <span className="text-xs text-orange-500 font-semibold mt-2 inline-block">Lihat Detail</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center p-8 mt-16 flex flex-col items-center">
                     <img src="https://i.ibb.co/C5CmdLDX/Pngtree-hot-promo-announcement-banner-with-8630488.png" alt="No promotions" className="w-32 h-32 opacity-50 mb-4" />
                    <p className="text-gray-600 dark:text-gray-300">Belum ada promosi yang berlangsung saat ini.</p>
                </div>
            )}
        </div>
    );
};

export default PromotionPage;
