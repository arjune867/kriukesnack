
import React, { useState, useMemo } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import ProductCard from '../components/ProductCard';
import PromotionSlider from '../components/PromotionSlider';
import { Page } from '../types';

interface HomePageProps {
    navigate: (page: Page, productId: string) => void;
    searchTerm: string;
}

const HomePage: React.FC<HomePageProps> = ({ navigate, searchTerm }) => {
    const { products } = useProducts();
    const { categories } = useCategories();
    const [selectedCategory, setSelectedCategory] = useState('All');

    const displayCategories = useMemo(() => ['All', ...categories.map(c => c.name)], [categories]);

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [products, selectedCategory, searchTerm]);

    return (
        <div className="bg-gray-100 min-h-full">
             <div className="p-4">
                 <div className="flex items-center space-x-2 overflow-x-auto pb-2 -mx-4 px-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                     {displayCategories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors duration-200 shadow-sm ${
                                selectedCategory === category 
                                ? 'bg-orange-500 text-white border border-transparent' 
                                : 'bg-white text-gray-700 border border-gray-300'
                            }`}
                        >
                            {category}
                        </button>
                     ))}
                 </div>
             </div>

            <PromotionSlider navigate={navigate} />

            <div className="px-4 pb-4 grid grid-cols-2 gap-4">
                {filteredProducts.map((product) => (
                    <ProductCard 
                        key={product.id} 
                        product={product} 
                        onCardClick={() => navigate('product', product.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default HomePage;
