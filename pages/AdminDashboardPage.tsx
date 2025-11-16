import React, { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import { usePromotions } from '../hooks/usePromotions';
import { useCategories } from '../hooks/useCategories';
import { useDiscounts } from '../hooks/useDiscounts';
import { useAuth } from '../hooks/useAuth';
import ProductForm from '../components/ProductForm';
import PromotionForm from '../components/PromotionForm';
import CategoryForm from '../components/CategoryForm';
import DiscountForm from '../components/DiscountForm';
import { Product, Page, Promotion, Category, DiscountCode } from '../types';
import { Icon } from '../components/Icon';

interface AdminDashboardPageProps {
    navigate: (page: Page) => void;
}

const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ navigate }) => {
    const { products, deleteProduct } = useProducts();
    const { promotions, deletePromotion } = usePromotions();
    const { categories, deleteCategory } = useCategories();
    const { discounts, deleteDiscount } = useDiscounts();
    const { logout } = useAuth();

    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isProductFormVisible, setIsProductFormVisible] = useState(false);
    
    const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
    const [isPromotionFormVisible, setIsPromotionFormVisible] = useState(false);
    
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [isCategoryFormVisible, setIsCategoryFormVisible] = useState(false);
    
    const [editingDiscount, setEditingDiscount] = useState<DiscountCode | null>(null);
    const [isDiscountFormVisible, setIsDiscountFormVisible] = useState(false);

    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
        setIsProductFormVisible(true);
    };

    const handleAddNewProduct = () => {
        setEditingProduct(null);
        setIsProductFormVisible(true);
    };

    const handleDeleteProduct = (productId: string) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
            deleteProduct(productId);
        }
    };

    const handleEditPromotion = (promotion: Promotion) => {
        setEditingPromotion(promotion);
        setIsPromotionFormVisible(true);
    };

    const handleAddNewPromotion = () => {
        setEditingPromotion(null);
        setIsPromotionFormVisible(true);
    };

    const handleDeletePromotion = (promotionId: string) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus promosi ini?')) {
            deletePromotion(promotionId);
        }
    };

    const handleEditCategory = (category: Category) => {
        setEditingCategory(category);
        setIsCategoryFormVisible(true);
    };

    const handleAddNewCategory = () => {
        setEditingCategory(null);
        setIsCategoryFormVisible(true);
    };

    const handleDeleteCategory = (categoryId: string) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
            deleteCategory(categoryId);
        }
    };

    const handleEditDiscount = (discount: DiscountCode) => {
        setEditingDiscount(discount);
        setIsDiscountFormVisible(true);
    };

    const handleAddNewDiscount = () => {
        setEditingDiscount(null);
        setIsDiscountFormVisible(true);
    };

    const handleDeleteDiscount = (discountId: string) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus kode diskon ini?')) {
            deleteDiscount(discountId);
        }
    };
    
    const handleLogout = () => {
        logout();
        navigate('home');
    }

    if (isProductFormVisible) {
        return <ProductForm product={editingProduct} onDone={() => setIsProductFormVisible(false)} />;
    }
    
    if (isPromotionFormVisible) {
        return <PromotionForm promotion={editingPromotion} onDone={() => setIsPromotionFormVisible(false)} />;
    }

    if (isCategoryFormVisible) {
        return <CategoryForm category={editingCategory} onDone={() => setIsCategoryFormVisible(false)} />;
    }
    
    if (isDiscountFormVisible) {
        return <DiscountForm discount={editingDiscount} onDone={() => setIsDiscountFormVisible(false)} />;
    }

    return (
        <div className="p-4 space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Dashboard Admin</h1>
                <button onClick={handleLogout} className="p-2 text-gray-500 hover:text-red-500">
                    <Icon name="logout" />
                </button>
            </div>

            {/* Product Management */}
            <div>
                <h2 className="text-xl font-semibold mb-3">Kelola Produk</h2>
                <button
                    onClick={handleAddNewProduct}
                    className="w-full flex justify-center items-center gap-2 bg-amber-500 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-amber-600 transition-all duration-200 mb-4"
                >
                    <Icon name="plus" /> Tambah Produk Baru
                </button>
                <div className="space-y-3">
                    {products.map(product => (
                        <div key={product.id} className="bg-white p-3 rounded-lg border flex items-center gap-4">
                            <img src={product.imageUrl} alt={product.name} className="w-16 h-16 rounded-md object-cover" />
                            <div className="flex-grow">
                                <h3 className="font-semibold text-gray-800">{product.name}</h3>
                                <p className="text-sm text-gray-500">IDR {product.price.toLocaleString('id-ID')}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => handleEditProduct(product)} className="p-2 text-gray-500 hover:text-blue-500">
                                    <Icon name="edit" />
                                </button>
                                <button onClick={() => handleDeleteProduct(product.id)} className="p-2 text-gray-500 hover:text-red-500">
                                    <Icon name="trash" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Category Management */}
             <div>
                <h2 className="text-xl font-semibold mb-3">Kelola Kategori</h2>
                 <button
                    onClick={handleAddNewCategory}
                    className="w-full flex justify-center items-center gap-2 bg-indigo-500 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-indigo-600 transition-all duration-200 mb-4"
                >
                    <Icon name="plus" /> Tambah Kategori Baru
                </button>
                 <div className="space-y-3">
                    {categories.map(cat => (
                        <div key={cat.id} className="bg-white p-3 rounded-lg border flex items-center justify-between gap-4">
                            <h3 className="font-semibold text-gray-800">{cat.name}</h3>
                            <div className="flex items-center gap-2">
                                <button onClick={() => handleEditCategory(cat)} className="p-2 text-gray-500 hover:text-blue-500">
                                    <Icon name="edit" />
                                </button>
                                <button onClick={() => handleDeleteCategory(cat.id)} className="p-2 text-gray-500 hover:text-red-500">
                                    <Icon name="trash" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>


            {/* Promotion Management */}
            <div>
                <h2 className="text-xl font-semibold mb-3">Kelola Promosi</h2>
                 <button
                    onClick={handleAddNewPromotion}
                    className="w-full flex justify-center items-center gap-2 bg-blue-500 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-blue-600 transition-all duration-200 mb-4"
                >
                    <Icon name="plus" /> Tambah Promosi Baru
                </button>
                 <div className="space-y-3">
                    {promotions.map(promo => (
                        <div key={promo.id} className="bg-white p-3 rounded-lg border flex items-center gap-4">
                            <img src={promo.imageUrl} alt={`Promo ${promo.id}`} className="w-16 h-16 rounded-md object-cover" />
                            <div className="flex-grow">
                                <h3 className="font-semibold text-gray-800">Promosi #{promo.id}</h3>
                                <p className="text-sm text-gray-500">Link ke: {products.find(p => p.id === promo.productId)?.name || 'Produk tidak ditemukan'}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => handleEditPromotion(promo)} className="p-2 text-gray-500 hover:text-blue-500">
                                    <Icon name="edit" />
                                </button>
                                <button onClick={() => handleDeletePromotion(promo.id)} className="p-2 text-gray-500 hover:text-red-500">
                                    <Icon name="trash" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Discount Management */}
            <div>
                <h2 className="text-xl font-semibold mb-3">Kelola Diskon</h2>
                 <button
                    onClick={handleAddNewDiscount}
                    className="w-full flex justify-center items-center gap-2 bg-teal-500 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-teal-600 transition-all duration-200 mb-4"
                >
                    <Icon name="plus" /> Tambah Diskon Baru
                </button>
                 <div className="space-y-3">
                    {discounts.map(d => (
                        <div key={d.id} className="bg-white p-3 rounded-lg border flex items-center justify-between gap-4">
                            <div>
                                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                    <Icon name="ticket" className="w-5 h-5 text-teal-500" />
                                    {d.code}
                                </h3>
                                <p className="text-sm text-gray-500 ml-7">
                                    {d.type === 'percentage' ? `${d.value}% off` : `Rp ${d.value.toLocaleString('id-ID')} off`}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => handleEditDiscount(d)} className="p-2 text-gray-500 hover:text-blue-500">
                                    <Icon name="edit" />
                                </button>
                                <button onClick={() => handleDeleteDiscount(d.id)} className="p-2 text-gray-500 hover:text-red-500">
                                    <Icon name="trash" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default AdminDashboardPage;