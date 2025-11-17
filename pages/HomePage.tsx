
import React, { useState, useMemo } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import ProductCard from '../components/ProductCard';
import PromotionSlider from '../components/PromotionSlider';
import { Page } from '../types';
import RunningText from '../components/RunningText';
import QuickActions from '../components/QuickActions';
import PromoProductCard from '../components/PromoProductCard';

interface HomePageProps {
    navigate: (page: Page, productId?: string) => void;
    searchTerm: string;
}

const HomePage: React.FC<HomePageProps> = ({ navigate, searchTerm }) => {
    const { products } = useProducts();
    const { categories } = useCategories();
    const [selectedCategory, setSelectedCategory] = useState('All');

    const displayCategories = useMemo(() => ['All', 'Diskon', ...categories.map(c => c.name)], [categories]);

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
            if (!matchesSearch) return false;

            if (selectedCategory === 'All') {
                return true;
            }
            if (selectedCategory === 'Diskon') {
                // Fix: A product is considered discounted if it has a discountCodeId.
                return !!product.discountCodeId;
            }
            return product.category === selectedCategory;
        });
    }, [products, selectedCategory, searchTerm]);

    const promoProducts = useMemo(() => {
        return products.filter(product => !!product.discountCodeId);
    }, [products]);
    
    const newestProducts = useMemo(() => {
        const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        return [...products]
            .filter(p => parseInt(p.id) >= sevenDaysAgo)
            .sort((a, b) => parseInt(b.id) - parseInt(a.id));
    }, [products]);

    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-full">
            <QuickActions />
            <RunningText />
             <div className="p-4">
                 <div className="flex items-center space-x-2 overflow-x-auto pb-2 -mx-4 px-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                     {displayCategories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors duration-200 shadow-sm ${
                                selectedCategory === category 
                                ? 'bg-orange-500 text-white border border-transparent' 
                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600'
                            }`}
                        >
                            {category}
                        </button>
                     ))}
                 </div>
             </div>

            <PromotionSlider navigate={navigate} />

            <div className="px-4 pb-4 grid grid-cols-3 gap-3">
                {filteredProducts.map((product) => (
                    <ProductCard 
                        key={product.id} 
                        product={product} 
                        onCardClick={() => navigate('product', product.id)}
                        navigate={navigate}
                    />
                ))}
            </div>
            
            {newestProducts.length > 0 && (
                <div className="mt-4 pb-4">
                    <div className="flex justify-between items-center px-4 mb-3">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Produk Terbaru</h2>
                        <button 
                            onClick={() => navigate('newProducts')}
                            className="text-sm font-semibold text-orange-500 hover:text-orange-600 flex items-center gap-1"
                        >
                            Lihat Semua
                            <i className="fa-solid fa-chevron-right text-xs"></i>
                        </button>
                    </div>
                    <div className="px-4 space-y-3">
                        {newestProducts.slice(0, 4).map(product => (
                            <PromoProductCard
                                key={`new-${product.id}`}
                                product={product}
                                navigate={navigate}
                            />
                        ))}
                    </div>
                </div>
            )}

            {promoProducts.length > 0 && (
                <div className="mt-4 pb-4">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 px-4 mb-3">Promo Spesial Hari Ini</h2>
                    <div className="px-4 space-y-3">
                        {promoProducts.map(product => (
                            <PromoProductCard
                                key={product.id}
                                product={product}
                                navigate={navigate}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomePage;