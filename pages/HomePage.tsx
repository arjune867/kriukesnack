
import React, { useState, useMemo, useEffect } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import ProductCard from '../components/ProductCard';
import PromotionSlider from '../components/PromotionSlider';
import { Page } from '../types';
import { Icon } from '../components/Icon';

interface HomePageProps {
    navigate: (page: Page, productId: string) => void;
    searchTerm: string;
}

const HomePage: React.FC<HomePageProps> = ({ navigate, searchTerm }) => {
    const { products } = useProducts();
    const { categories } = useCategories();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [showGoToTop, setShowGoToTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowGoToTop(true);
            } else {
                setShowGoToTop(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const displayCategories = useMemo(() => ['All', 'Diskon', ...categories.map(c => c.name)], [categories]);

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
            if (!matchesSearch) return false;

            if (selectedCategory === 'All') {
                return true;
            }
            if (selectedCategory === 'Diskon') {
                return !!product.discountedPrice;
            }
            return product.category === selectedCategory;
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

            <div className="px-4 pb-4 grid grid-cols-3 gap-3">
                {filteredProducts.map((product) => (
                    <ProductCard 
                        key={product.id} 
                        product={product} 
                        onCardClick={() => navigate('product', product.id)}
                    />
                ))}
            </div>

            {showGoToTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-20 right-4 bg-orange-500 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center z-50 hover:bg-orange-600 transition-opacity duration-300 animate-fade-in"
                    aria-label="Go to top"
                >
                    <Icon name="arrowUp" className="w-6 h-6" />
                </button>
            )}
             <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default HomePage;
