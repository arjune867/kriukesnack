

import React, { useState, useEffect, useMemo } from 'react';
import { useProducts } from '../hooks/useProducts';
import { usePromotions } from '../hooks/usePromotions';
import { useCategories } from '../hooks/useCategories';
import { useDiscounts } from '../hooks/useDiscounts';
import { useAuth } from '../hooks/useAuth';
import { useSettings } from '../hooks/useSettings';
import { useQuickActions } from '../hooks/useQuickActions';
import ProductForm from '../components/ProductForm';
import PromotionForm from '../components/PromotionForm';
import CategoryForm from '../components/CategoryForm';
import DiscountForm from '../components/DiscountForm';
import QuickActionForm from '../components/QuickActionForm';
import { Product, Page, Promotion, Category, DiscountCode, QuickAction } from '../types';
import { Icon } from '../components/Icon';

interface AdminDashboardPageProps {
    navigate: (page: Page) => void;
}

type AdminTab = 'products' | 'promotions' | 'categories' | 'discounts' | 'quickActions' | 'reports';
type StockFilter = 'all' | 'inStock' | 'lowStock' | 'outOfStock';

const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ navigate }) => {
    const { products, deleteProduct } = useProducts();
    const { promotions, deletePromotion } = usePromotions();
    const { categories, deleteCategory } = useCategories();
    const { discounts, deleteDiscount } = useDiscounts();
    const { quickActions, deleteQuickAction } = useQuickActions();
    const { settings, updateSettings } = useSettings();
    const { logout } = useAuth();

    const [activeTab, setActiveTab] = useState<AdminTab>('products');
    const [stockFilter, setStockFilter] = useState<StockFilter>('all');

    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isProductFormVisible, setIsProductFormVisible] = useState(false);
    
    const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
    const [isPromotionFormVisible, setIsPromotionFormVisible] = useState(false);
    
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [isCategoryFormVisible, setIsCategoryFormVisible] = useState(false);
    
    const [editingDiscount, setEditingDiscount] = useState<DiscountCode | null>(null);
    const [isDiscountFormVisible, setIsDiscountFormVisible] = useState(false);
    
    const [editingQuickAction, setEditingQuickAction] = useState<QuickAction | null>(null);
    const [isQuickActionFormVisible, setIsQuickActionFormVisible] = useState(false);

    const [marqueeText, setMarqueeText] = useState('');
    const [showMarqueeSaveSuccess, setShowMarqueeSaveSuccess] = useState(false);

    useEffect(() => {
        if (settings) {
            setMarqueeText(settings.marqueeText);
        }
    }, [settings]);

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const totalStock = p.variants.reduce((sum, v) => sum + v.stock, 0);
            switch (stockFilter) {
                case 'inStock':
                    return totalStock > 10;
                case 'lowStock':
                    return totalStock > 0 && totalStock <= 10;
                case 'outOfStock':
                    return totalStock === 0;
                case 'all':
                default:
                    return true;
            }
        });
    }, [products, stockFilter]);

    const handleMarqueeTextSave = () => {
        updateSettings({ marqueeText });
        setShowMarqueeSaveSuccess(true);
        setTimeout(() => setShowMarqueeSaveSuccess(false), 2000);
    };

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

    const handleEditQuickAction = (action: QuickAction) => {
        setEditingQuickAction(action);
        setIsQuickActionFormVisible(true);
    };
    const handleAddNewQuickAction = () => {
        setEditingQuickAction(null);
        setIsQuickActionFormVisible(true);
    };
    const handleDeleteQuickAction = (actionId: string) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus ikon promosi ini?')) {
            deleteQuickAction(actionId);
        }
    };
    
    const handleLogout = () => {
        logout();
        navigate('home');
    }

    if (isProductFormVisible) return <ProductForm product={editingProduct} onDone={() => setIsProductFormVisible(false)} />;
    if (isPromotionFormVisible) return <PromotionForm promotion={editingPromotion} onDone={() => setIsPromotionFormVisible(false)} />;
    if (isCategoryFormVisible) return <CategoryForm category={editingCategory} onDone={() => setIsCategoryFormVisible(false)} />;
    if (isDiscountFormVisible) return <DiscountForm discount={editingDiscount} onDone={() => setIsDiscountFormVisible(false)} />;
    if (isQuickActionFormVisible) return <QuickActionForm quickAction={editingQuickAction} onDone={() => setIsQuickActionFormVisible(false)} />;

    const renderTabContent = () => {
        switch (activeTab) {
            case 'products': return <ProductsTab onAdd={handleAddNewProduct} onEdit={handleEditProduct} onDelete={handleDeleteProduct} products={filteredProducts} activeFilter={stockFilter} onFilterChange={setStockFilter} />;
            case 'promotions': return <PromotionsTab onAdd={handleAddNewPromotion} onEdit={handleEditPromotion} onDelete={handleDeletePromotion} promotions={promotions} products={products} />;
            case 'categories': return <CategoriesTab onAdd={handleAddNewCategory} onEdit={handleEditCategory} onDelete={handleDeleteCategory} categories={categories} />;
            case 'discounts': return <DiscountsTab onAdd={handleAddNewDiscount} onEdit={handleEditDiscount} onDelete={handleDeleteDiscount} discounts={discounts} />;
            case 'quickActions': return <QuickActionsTab onAdd={handleAddNewQuickAction} onEdit={handleEditQuickAction} onDelete={handleDeleteQuickAction} actions={quickActions} />;
            case 'reports': return <ReportsTab products={products} />;
            default: return null;
        }
    };
    
    const TabButton = ({ tab, label }: { tab: AdminTab, label: string }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-2 text-sm font-semibold rounded-t-lg transition-colors duration-200 focus:outline-none whitespace-nowrap ${
                activeTab === tab 
                ? 'bg-white dark:bg-gray-900 text-orange-500 border-b-2 border-orange-500' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 border-b-2 border-transparent'
            }`}
             role="tab"
             aria-selected={activeTab === tab}
        >
            {label}
        </button>
    );

    return (
        <div className="p-4 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold dark:text-white">Dashboard Admin</h1>
                <button onClick={handleLogout} className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-500">
                    <Icon name="logout" />
                </button>
            </div>

            {/* Marquee Text Management */}
            <div>
                <h2 className="text-xl font-semibold mb-3 dark:text-gray-100">Teks Promo Berjalan</h2>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
                    <textarea
                        id="marqueeText"
                        rows={2}
                        value={marqueeText}
                        onChange={(e) => setMarqueeText(e.target.value)}
                        className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                        placeholder="Masukkan teks promo yang akan berjalan..."
                    />
                    <div className="flex justify-end items-center mt-3">
                         {showMarqueeSaveSuccess && (
                            <span className="text-sm text-green-500 mr-4">Tersimpan!</span>
                        )}
                        <button
                            onClick={handleMarqueeTextSave}
                            className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-green-600 transition-colors"
                        >
                            Simpan
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <nav className="-mb-px flex space-x-2" aria-label="Tabs">
                    <TabButton tab="products" label="Produk" />
                    <TabButton tab="reports" label="Laporan" />
                    <TabButton tab="promotions" label="Promosi" />
                    <TabButton tab="categories" label="Kategori" />
                    <TabButton tab="discounts" label="Diskon" />
                    <TabButton tab="quickActions" label="Ikon Promosi" />
                </nav>
            </div>
            
            <div className="mt-4" role="tabpanel">
                {renderTabContent()}
            </div>
        </div>
    );
};

// --- TAB CONTENT COMPONENTS ---

const FilterButton = ({ label, filter, activeFilter, onClick }: { label: string, filter: StockFilter, activeFilter: StockFilter, onClick: (filter: StockFilter) => void }) => {
    const isActive = activeFilter === filter;
    return (
        <button
            onClick={() => onClick(filter)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors duration-200 shadow-sm ${
                isActive
                ? 'bg-orange-500 text-white border border-transparent'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600'
            }`}
        >
            {label}
        </button>
    );
};

const ProductsTab = ({ onAdd, onEdit, onDelete, products, activeFilter, onFilterChange }) => (
    <div>
        <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold dark:text-gray-100">Kelola Produk</h2>
            <button onClick={onAdd} className="flex items-center justify-center w-10 h-10 bg-amber-500 text-white rounded-full shadow-md hover:bg-amber-600 transition-colors" aria-label="Tambah Produk Baru"><Icon name="plus" className="w-6 h-6" /></button>
        </div>
        <div className="flex items-center space-x-2 overflow-x-auto pb-3 mb-3">
            <FilterButton label="Semua" filter="all" activeFilter={activeFilter} onClick={onFilterChange} />
            <FilterButton label="Tersedia" filter="inStock" activeFilter={activeFilter} onClick={onFilterChange} />
            <FilterButton label="Stok Terbatas" filter="lowStock" activeFilter={activeFilter} onClick={onFilterChange} />
            <FilterButton label="Habis" filter="outOfStock" activeFilter={activeFilter} onClick={onFilterChange} />
        </div>
        <div className="space-y-3">
            {products.length > 0 ? products.map(product => {
                const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
                const priceRange = product.variants.length > 1
                    ? `Rp ${Math.min(...product.variants.map(v => v.price)).toLocaleString('id-ID')} - Rp ${Math.max(...product.variants.map(v => v.price)).toLocaleString('id-ID')}`
                    : product.variants.length === 1
                    ? `Rp ${product.variants[0].price.toLocaleString('id-ID')}`
                    : 'Tidak ada harga';

                return (
                    <div key={product.id} className="bg-white dark:bg-gray-800 p-3 rounded-lg border dark:border-gray-700 flex items-center gap-4">
                        <img src={product.imageUrl} alt={product.name} className="w-16 h-16 rounded-md object-cover" />
                        <div className="flex-grow">
                            <h3 className="font-semibold text-gray-800 dark:text-gray-100">{product.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{priceRange}</p>
                            <p className={`text-sm font-medium ${
                                totalStock > 10 
                                ? 'text-green-500' 
                                : totalStock > 0
                                ? 'text-orange-500'
                                : 'text-red-500'
                            }`}>
                                Total Stok: {totalStock}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => onEdit(product)} className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-500"><Icon name="edit" /></button>
                            <button onClick={() => onDelete(product.id)} className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-500"><Icon name="trash" /></button>
                        </div>
                    </div>
                )
            }) : <p className="text-center text-gray-500 dark:text-gray-400 py-4">Tidak ada produk yang cocok dengan filter ini.</p>}
        </div>
    </div>
);

const PromotionsTab = ({ onAdd, onEdit, onDelete, promotions, products }) => (
    <div>
        <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold dark:text-gray-100">Kelola Promosi</h2>
            <button onClick={onAdd} className="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition-colors" aria-label="Tambah Promosi Baru"><Icon name="plus" className="w-6 h-6" /></button>
        </div>
        <div className="space-y-3">
            {promotions.map(promo => (
                <div key={promo.id} className="bg-white dark:bg-gray-800 p-3 rounded-lg border dark:border-gray-700 flex items-center gap-4">
                    <img src={promo.imageUrl} alt={promo.title} className="w-16 h-16 rounded-md object-cover" />
                    <div className="flex-grow">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-100">{promo.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Link ke: {products.find(p => p.id === promo.productId)?.name || 'Produk tidak ditemukan'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => onEdit(promo)} className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-500"><Icon name="edit" /></button>
                        <button onClick={() => onDelete(promo.id)} className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-500"><Icon name="trash" /></button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const CategoriesTab = ({ onAdd, onEdit, onDelete, categories }) => (
    <div>
        <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold dark:text-gray-100">Kelola Kategori</h2>
            <button onClick={onAdd} className="flex items-center justify-center w-10 h-10 bg-indigo-500 text-white rounded-full shadow-md hover:bg-indigo-600 transition-colors" aria-label="Tambah Kategori Baru"><Icon name="plus" className="w-6 h-6" /></button>
        </div>
        <div className="space-y-3">
            {categories.map(cat => (
                <div key={cat.id} className="bg-white dark:bg-gray-800 p-3 rounded-lg border dark:border-gray-700 flex items-center justify-between gap-4">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100">{cat.name}</h3>
                    <div className="flex items-center gap-2">
                        <button onClick={() => onEdit(cat)} className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-500"><Icon name="edit" /></button>
                        <button onClick={() => onDelete(cat.id)} className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-500"><Icon name="trash" /></button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const DiscountsTab = ({ onAdd, onEdit, onDelete, discounts }) => (
     <div>
        <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold dark:text-gray-100">Kelola Diskon</h2>
            <button onClick={onAdd} className="flex items-center justify-center w-10 h-10 bg-teal-500 text-white rounded-full shadow-md hover:bg-teal-600 transition-colors" aria-label="Tambah Diskon Baru"><Icon name="plus" className="w-6 h-6" /></button>
        </div>
        <div className="space-y-3">
            {discounts.map(d => (
                <div key={d.id} className="bg-white dark:bg-gray-800 p-3 rounded-lg border dark:border-gray-700 flex items-center justify-between gap-4">
                    <div>
                        <h3 className="font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2"><Icon name="ticket" className="w-5 h-5 text-teal-500" />{d.code}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 ml-7">{d.type === 'percentage' ? `${d.value}% off` : `Rp ${d.value.toLocaleString('id-ID')} off`}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => onEdit(d)} className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-500"><Icon name="edit" /></button>
                        <button onClick={() => onDelete(d.id)} className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-500"><Icon name="trash" /></button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const QuickActionsTab = ({ onAdd, onEdit, onDelete, actions }) => (
     <div>
        <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold dark:text-gray-100">Kelola Ikon Promosi</h2>
            <button onClick={onAdd} className="flex items-center justify-center w-10 h-10 bg-purple-500 text-white rounded-full shadow-md hover:bg-purple-600 transition-colors" aria-label="Tambah Ikon Promosi Baru"><Icon name="plus" className="w-6 h-6" /></button>
        </div>
        <div className="space-y-3">
            {actions.map(action => (
                <div key={action.id} className="bg-white dark:bg-gray-800 p-3 rounded-lg border dark:border-gray-700 flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${action.color}`}>
                        <Icon name={action.icon} className="w-6 h-6" />
                    </div>
                    <div className="flex-grow">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-100">{action.name}</h3>
                        <p className="text-xs text-gray-400 truncate">{action.link || 'Tidak ada link'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => onEdit(action)} className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-500"><Icon name="edit" /></button>
                        <button onClick={() => onDelete(action.id)} className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-500"><Icon name="trash" /></button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const ReportsTab = ({ products }: { products: Product[] }) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const salesSummary = useMemo(() => {
        const totalSoldCount = products.reduce((sum, p) => sum + (p.soldCount || 0), 0);
        const estimatedRevenue = products.reduce((totalRevenue, p) => {
            if (!p.soldCount || p.variants.length === 0) return totalRevenue;
            const avgPrice = p.variants.reduce((sum, v) => sum + v.price, 0) / p.variants.length;
            return totalRevenue + (p.soldCount * avgPrice);
        }, 0);
        return { totalSoldCount, estimatedRevenue };
    }, [products]);

    const stockSummary = useMemo(() => {
        let totalItems = 0;
        let inStockCount = 0;
        let lowStockCount = 0;
        let outOfStockCount = 0;

        products.forEach(p => {
            const totalStock = p.variants.reduce((sum, v) => sum + v.stock, 0);
            totalItems += totalStock;
            if (totalStock === 0) {
                outOfStockCount++;
            } else if (totalStock <= 10) {
                lowStockCount++;
            } else {
                inStockCount++;
            }
        });
        return { totalItems, inStockCount, lowStockCount, outOfStockCount };
    }, [products]);

    const bestSellers = useMemo(() => {
        return [...products]
            .sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0))
            .slice(0, 5);
    }, [products]);

    const SummaryCard = ({ title, value, colorClass }) => (
        <div className={`bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700 ${colorClass}`}>
            <p className="text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    );
    
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold mb-3 dark:text-gray-100">Ringkasan Penjualan</h2>
                <div className="grid grid-cols-2 gap-4">
                     <SummaryCard 
                        title="Total Produk Terjual" 
                        value={salesSummary.totalSoldCount.toLocaleString('id-ID')}
                        colorClass="bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300"
                    />
                    <SummaryCard 
                        title="Total Pendapatan" 
                        value={formatCurrency(salesSummary.estimatedRevenue)} 
                        colorClass="bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-300"
                    />
                </div>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-3 dark:text-gray-100">Ringkasan Stok</h2>
                <div className="grid grid-cols-2 gap-4">
                    <SummaryCard 
                        title="Total Item di Stok" 
                        value={stockSummary.totalItems.toLocaleString('id-ID')}
                        colorClass="bg-indigo-100 dark:bg-indigo-500/20 text-indigo-800 dark:text-indigo-300"
                    />
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700 flex flex-col justify-center">
                        <div className="flex justify-between items-center text-sm"><span className="text-gray-500 dark:text-gray-400">Tersedia</span> <span className="font-bold text-green-500">{stockSummary.inStockCount}</span></div>
                        <div className="flex justify-between items-center text-sm"><span className="text-gray-500 dark:text-gray-400">Terbatas</span> <span className="font-bold text-orange-500">{stockSummary.lowStockCount}</span></div>
                        <div className="flex justify-between items-center text-sm"><span className="text-gray-500 dark:text-gray-400">Habis</span> <span className="font-bold text-red-500">{stockSummary.outOfStockCount}</span></div>
                    </div>
                </div>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-3 dark:text-gray-100">Produk Terlaris</h2>
                <div className="bg-white dark:bg-gray-800 p-2 rounded-lg border dark:border-gray-700 space-y-2">
                    {bestSellers.map((p, index) => (
                        <div key={p.id} className="flex items-center gap-4 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <span className="font-bold text-gray-400 w-5 text-center">{index + 1}</span>
                            <img src={p.imageUrl} alt={p.name} className="w-10 h-10 rounded-md object-cover" />
                            <p className="flex-grow font-medium text-sm text-gray-700 dark:text-gray-200">{p.name}</p>
                            <p className="font-bold text-sm text-gray-800 dark:text-gray-100">{p.soldCount || 0} <span className="font-normal text-gray-500">terjual</span></p>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-3 dark:text-gray-100">Detail Stok Produk</h2>
                <div className="space-y-3">
                    {products.map(product => {
                        const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
                        let status;
                        if (totalStock === 0) {
                            status = { text: 'Habis', color: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300' };
                        } else if (totalStock <= 10) {
                            status = { text: 'Terbatas', color: 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300' };
                        } else {
                            status = { text: 'Tersedia', color: 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300' };
                        }
                        
                        return (
                            <div key={product.id} className="bg-white dark:bg-gray-800 p-3 rounded-lg border dark:border-gray-700 flex items-center gap-4">
                                <img src={product.imageUrl} alt={product.name} className="w-12 h-12 rounded-md object-cover" />
                                <div className="flex-grow">
                                    <h3 className="font-semibold text-sm text-gray-800 dark:text-gray-100">{product.name}</h3>
                                    <p className="text-sm font-bold text-gray-600 dark:text-gray-300">Stok: {totalStock}</p>
                                </div>
                                <span className={`px-3 py-1 text-xs font-bold rounded-full ${status.color}`}>{status.text}</span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}

export default AdminDashboardPage;