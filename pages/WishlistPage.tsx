
import React, { useMemo } from 'react';
import { useWishlist } from '../hooks/useWishlist';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import { Page } from '../types';

interface WishlistPageProps {
    navigate: (page: Page, productId?: string) => void;
}

const WishlistPage: React.FC<WishlistPageProps> = ({ navigate }) => {
    const { wishlist } = useWishlist();
    const { products } = useProducts();

    const wishlistedProducts = useMemo(() => {
        return products.filter(product => wishlist.includes(product.id));
    }, [products, wishlist]);

    if (wishlistedProducts.length === 0) {
        return (
            <div className="text-center p-8 flex flex-col items-center justify-center h-full">
                <h1 className="text-2xl font-bold mb-4 text-gray-800">Wishlist Kosong</h1>
                <p className="text-gray-600 mb-6">Simpan produk yang kamu suka dengan menekan ikon hati!</p>
                <button
                    onClick={() => navigate('home')}
                    className="bg-orange-500 text-white font-bold py-2 px-6 rounded-lg shadow hover:bg-orange-600 transition-colors"
                >
                    Mulai Belanja
                </button>
            </div>
        );
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Wishlist Saya</h1>
            <div className="grid grid-cols-2 gap-4">
                {wishlistedProducts.map(product => (
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

export default WishlistPage;
