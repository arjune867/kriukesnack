
import React, { useState, useMemo, useCallback } from 'react';
import { ProductProvider, useProducts } from './hooks/useProducts';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { CartProvider } from './hooks/useCart';
import { WishlistProvider } from './hooks/useWishlist';
import { PromotionProvider } from './hooks/usePromotions';
import { CategoryProvider } from './hooks/useCategories';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import Footer from './components/Footer';
import Header from './components/Header';
import { Page, Product } from './types';

const AppContent: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<Page>('home');
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const { products } = useProducts();
    const { admin } = useAuth();

    const navigate = useCallback((page: Page, productId: string | null = null) => {
        setCurrentPage(page);
        setSelectedProductId(productId);
        window.scrollTo(0, 0);
    }, []);

    const selectedProduct = useMemo(() => {
        if (currentPage === 'product' && selectedProductId) {
            return products.find(p => p.id === selectedProductId) || null;
        }
        return null;
    }, [currentPage, selectedProductId, products]);

    const renderPage = () => {
        switch (currentPage) {
            case 'product':
                return selectedProduct ? <ProductPage product={selectedProduct} navigate={navigate} /> : <HomePage navigate={navigate} searchTerm="" />;
            case 'admin':
                // The login page is handled separately below
                return admin ? <AdminDashboardPage navigate={navigate} /> : null;
            case 'cart':
                return <CartPage navigate={navigate} />;
            case 'wishlist':
                return <WishlistPage navigate={navigate} />;
            case 'home':
            default:
                return <HomePage navigate={navigate} searchTerm={searchTerm} />;
        }
    };

    if (currentPage === 'admin' && !admin) {
        return <AdminLoginPage navigate={navigate} />;
    }
    
    const mainPaddingTop = (currentPage === 'home' || currentPage === 'wishlist') ? 'pt-32' : 'pt-20';
    const showFooter = currentPage !== 'admin' && currentPage !== 'cart';

    return (
        <div className="bg-gray-100 max-w-md mx-auto min-h-screen shadow-2xl flex flex-col font-sans">
            <Header 
                navigate={navigate} 
                currentPage={currentPage}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                productName={selectedProduct?.name}
            />
            <main className={`flex-grow ${mainPaddingTop} ${showFooter ? 'pb-16' : 'pb-4'}`}>
                {renderPage()}
            </main>
            {showFooter && <Footer navigate={navigate} currentPage={currentPage} />}
        </div>
    );
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <ProductProvider>
                <PromotionProvider>
                    <CategoryProvider>
                        <CartProvider>
                            <WishlistProvider>
                                <AppContent />
                            </WishlistProvider>
                        </CartProvider>
                    </CategoryProvider>
                </PromotionProvider>
            </ProductProvider>
        </AuthProvider>
    );
};

export default App;