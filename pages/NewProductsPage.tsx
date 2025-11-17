
import React, { useMemo } from 'react';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import { Page } from '../types';

interface NewProductsPageProps {
    navigate: (page: Page, productId?: string) => void;
}

const NewProductsPage: React.FC<NewProductsPageProps> = ({ navigate }) => {
    const { products } = useProducts();

    const newProducts = useMemo(() => {
        const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        return products
            .filter(product => parseInt(product.id) >= sevenDaysAgo)
            .sort((a, b) => parseInt(b.id) - parseInt(a.id));
    }, [products]);

    return (
        <div className="p-4">
            {newProducts.length > 0 ? (
                <div className="grid grid-cols-3 gap-3">
                    {newProducts.map(product => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onCardClick={() => navigate('product', product.id)}
                            navigate={navigate}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center p-8 flex flex-col items-center justify-center h-full">
                    <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Tidak Ada Produk Baru</h1>
                    <p className="text-gray-600 dark:text-gray-300">Cek kembali nanti untuk melihat produk-produk terbaru kami!</p>
                </div>
            )}
        </div>
    );
};

export default NewProductsPage;
