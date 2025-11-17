

import React, { useState, useMemo, useEffect } from 'react';
import { Product, Page, Variant } from '../types';
import { Icon } from '../components/Icon';
import { generateSocialPost } from '../services/geminiService';
import { useCart } from '../hooks/useCart';
import { useShare } from '../hooks/useShare';
import { useReviews } from '../hooks/useReviews';
import { useAuth } from '../hooks/useAuth';
import { useWishlist } from '../hooks/useWishlist';
import StarRatingInput from '../components/StarRatingInput';
import RecommendedProducts from '../components/RecommendedProducts';
import { useWhatsAppChat } from '../hooks/useWhatsAppChat';
import { useDiscounts } from '../hooks/useDiscounts';

interface ProductPageProps {
    product: Product;
    navigate: (page: Page, productId?: string) => void;
}

const StarRatingDisplay: React.FC<{ rating: number; reviewCount: number; size?: 'sm' | 'md' }> = ({ rating, reviewCount, size = 'md' }) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
    }
    return (
        <div className="flex items-center gap-2">
            <Icon
                name="star"
                className={`${sizeClasses[size]} text-amber-400`}
                isSolid={true}
            />
            {reviewCount > 0 && (
                <>
                    <span className="font-bold text-gray-800 dark:text-gray-200">{rating.toFixed(1)}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">({reviewCount} ulasan)</span>
                </>
            )}
        </div>
    );
};

const Stars: React.FC<{ rating: number; size?: 'sm' | 'md' }> = ({ rating, size = 'sm' }) => {
     const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
    }
    return (
        <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
                <Icon
                    key={i}
                    name="star"
                    className={`${sizeClasses[size]} ${i < Math.round(rating) ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600'}`}
                    isSolid={true}
                />
            ))}
        </div>
    );
};

const ProductPage: React.FC<ProductPageProps> = ({ product, navigate }) => {
    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [socialPost, setSocialPost] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [showCopySuccess, setShowCopySuccess] = useState(false);
    const { addToCart } = useCart();
    const { openShareModal } = useShare();
    const { getReviewsByProductId, addReview } = useReviews();
    const { currentUser } = useAuth();
    const { toggleWishlist, isProductInWishlist } = useWishlist();
    const { discounts } = useDiscounts();
    const { openWhatsAppModal } = useWhatsAppChat();
    
    const [newRating, setNewRating] = useState(0);
    const [newComment, setNewComment] = useState('');
    const [newAuthor, setNewAuthor] = useState(currentUser?.username || '');
    const [reviewError, setReviewError] = useState('');

    useEffect(() => {
        // Set default variant to the first one available in stock, or just the first one if all are OOS
        if (product && product.variants.length > 0) {
            const firstAvailable = product.variants.find(v => v.stock > 0);
            setSelectedVariant(firstAvailable || product.variants[0]);
            setQuantity(1);
        }
    }, [product]);
    
    const inWishlist = isProductInWishlist(product.id);

    const productReviews = useMemo(() => getReviewsByProductId(product.id), [getReviewsByProductId, product.id]);

    const handleReviewSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newRating === 0) {
            setReviewError('Rating bintang tidak boleh kosong.');
            return;
        }
        if (!newComment.trim()) {
            setReviewError('Komentar tidak boleh kosong.');
            return;
        }
        if (!newAuthor.trim()) {
            setReviewError('Nama tidak boleh kosong.');
            return;
        }
        setReviewError('');
        addReview({
            productId: product.id,
            author: newAuthor,
            rating: newRating,
            comment: newComment,
        });
        setNewRating(0);
        setNewComment('');
        if (!currentUser) {
            setNewAuthor('');
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };
    
    const handleShare = () => {
        openShareModal(product);
    };

    const handleQuantityChange = (amount: number) => {
        setQuantity(prev => {
            const newQuantity = prev + amount;
            if (newQuantity < 1) return 1;
            if (selectedVariant && newQuantity > selectedVariant.stock) return selectedVariant.stock;
            return newQuantity;
        });
    };
    
    const handleAddToCart = () => {
        if (selectedVariant) {
            addToCart(product, selectedVariant, quantity);
        }
    };

    const handleBuyNow = () => {
        if (selectedVariant) {
            addToCart(product, selectedVariant, quantity);
            navigate('cart');
        }
    };

    const { currentPrice, originalPrice } = useMemo(() => {
        if (!selectedVariant) return { currentPrice: 0, originalPrice: null };

        const discount = product.discountCodeId ? discounts.find(d => d.id === product.discountCodeId) : null;
        if (discount) {
            const discounted = discount.type === 'percentage'
                ? selectedVariant.price * (1 - discount.value / 100)
                : Math.max(0, selectedVariant.price - discount.value);
            return { currentPrice: discounted, originalPrice: selectedVariant.price };
        }
        return { currentPrice: selectedVariant.price, originalPrice: null };
    }, [selectedVariant, product.discountCodeId, discounts]);

    const handleGenerateSocialPost = async () => {
        setIsGenerating(true);
        const post = await generateSocialPost(product.name);
        setSocialPost(post);
        setIsGenerating(false);
    };

    const handleCopy = () => {
        if (!socialPost) return;
        const textToCopy = `${socialPost}\n\nYuk, beli di sini: ${window.location.origin}/?product=${product.id}`;
        navigator.clipboard.writeText(textToCopy).then(() => {
            setShowCopySuccess(true);
            setTimeout(() => setShowCopySuccess(false), 2500);
        }, (err) => {
            console.error('Could not copy text: ', err);
            alert('Gagal menyalin teks.');
        });
    };

    const ecommercePlatforms = [
      { name: 'tiktok', label: 'TikTok', link: product.ecommerceLinks.tiktok, imageUrl: 'https://i.ibb.co.com/399C2Fwj/social-media.png' },
      { name: 'shopee', label: 'Shopee', link: product.ecommerceLinks.shopee, imageUrl: 'https://i.ibb.co/Vp32s5hK/shopee-seeklogo.png' },
      { name: 'tokopedia', label: 'Tokopedia', link: product.ecommerceLinks.tokopedia, imageUrl: 'https://i.ibb.co/fYb3fDrz/tokopedia-seeklogo.png' },
      { name: 'lazada', label: 'Lazada', link: product.ecommerceLinks.lazada, imageUrl: 'https://i.ibb.co/0VBH5vB9/lazada-seeklogo.png' },
    ];
    
    const validEcommerceLinks = ecommercePlatforms.filter(p => p.link && p.link !== '#');

    const isOutOfStock = selectedVariant ? selectedVariant.stock === 0 : true;
    const stockStatus = selectedVariant
        ? isOutOfStock
            ? { text: 'Habis', color: 'text-red-500' }
            : selectedVariant.stock <= 10
            ? { text: `Stok Terbatas (${selectedVariant.stock})`, color: 'text-orange-500' }
            : { text: 'Tersedia', color: 'text-green-500' }
        : { text: 'Pilih Varian', color: 'text-gray-500' };

    return (
        <div className="bg-white dark:bg-gray-900 pb-32">
            <div className="aspect-w-1 aspect-h-1 w-full relative">
                <img src={product.imageUrl} alt={product.name} className={`w-full h-full object-cover ${selectedVariant?.stock === 0 ? 'grayscale' : ''}`} />
                 {selectedVariant?.stock === 0 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-white font-bold text-xl bg-red-500/90 px-4 py-2 rounded-lg">Stok Habis</span>
                    </div>
                )}
            </div>
            <div className="p-4">
                <div className="flex justify-between items-start gap-4">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50 flex-1">{product.name}</h1>
                    <div className="flex items-center gap-3 flex-shrink-0 pt-1">
                        <button
                            onClick={() => toggleWishlist(product.id)}
                            className={`p-1.5 rounded-full transition-all duration-200 ${
                                inWishlist 
                                ? 'bg-red-100 dark:bg-red-500/20 text-red-500' 
                                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                            aria-label={inWishlist ? "Hapus dari wishlist" : "Tambah ke wishlist"}
                        >
                            <Icon name="heart" className="w-5 h-5" isSolid={inWishlist} />
                        </button>
                        <button
                            onClick={() => openWhatsAppModal(product)}
                            className="p-1.5 text-gray-500 dark:text-gray-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            aria-label="Tanya via WhatsApp"
                        >
                            <Icon name="whatsapp" className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleShare}
                            className="p-1.5 text-gray-500 dark:text-gray-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            aria-label="Bagikan produk"
                        >
                            <Icon name="share" className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <div className="mt-2 flex items-center flex-wrap gap-x-4 gap-y-1 text-sm">
                   <StarRatingDisplay rating={product.rating} reviewCount={product.reviewCount} />
                   {typeof product.soldCount === 'number' && product.soldCount > 0 && (
                        <div className="flex items-center gap-4">
                            <div className="h-4 w-px bg-gray-300 dark:bg-gray-700"></div>
                            <div className="text-gray-600 dark:text-gray-300">
                                <span className="font-semibold">{product.soldCount}</span> terjual
                            </div>
                        </div>
                   )}
                    <div className="flex items-center gap-4">
                        <div className="h-4 w-px bg-gray-300 dark:bg-gray-700"></div>
                        <div className={`font-semibold ${stockStatus.color}`}>{stockStatus.text}</div>
                    </div>
                </div>

                <div className="mt-4 border-t dark:border-gray-700 pt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pilih Varian:</label>
                    <div className="flex flex-wrap gap-2">
                        {product.variants.map(variant => (
                            <button
                                key={variant.id}
                                onClick={() => {
                                    setSelectedVariant(variant);
                                    setQuantity(1);
                                }}
                                disabled={variant.stock === 0}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold border-2 transition-all duration-200 relative overflow-hidden ${
                                    selectedVariant?.id === variant.id
                                    ? 'bg-orange-500 text-white border-orange-500'
                                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600'
                                } ${variant.stock === 0 ? 'text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700 cursor-not-allowed' : 'hover:border-orange-400 dark:hover:border-orange-500'}`}
                            >
                                {variant.name}
                                {variant.stock === 0 && (
                                    <span className="absolute top-1/2 left-0 w-full h-px bg-gray-400 dark:bg-gray-500 transform -rotate-12"></span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-4">
                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Jumlah:</label>
                     <div className="flex items-center">
                        <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1 || isOutOfStock} className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg font-bold text-xl flex items-center justify-center disabled:opacity-50 transition-colors">-</button>
                        <span className="w-12 text-center font-semibold dark:text-gray-200 text-lg">{quantity}</span>
                        <button onClick={() => handleQuantityChange(1)} disabled={!selectedVariant || quantity >= selectedVariant.stock || isOutOfStock} className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg font-bold text-xl flex items-center justify-center disabled:opacity-50 transition-colors">+</button>
                    </div>
                </div>

                 <div className="mt-4 flex items-baseline gap-2">
                    <p className="text-3xl font-bold text-orange-500">{formatCurrency(currentPrice * quantity)}</p>
                    {originalPrice && (
                        <p className="text-lg text-gray-400 dark:text-gray-500 line-through">{formatCurrency(originalPrice * quantity)}</p>
                    )}
                </div>

                <div className="mt-4 border-t dark:border-gray-700 pt-4">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Deskripsi</h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{product.description}</p>
                    <button
                        onClick={() => openWhatsAppModal(product)}
                        className="mt-4 w-full flex items-center justify-center gap-2 bg-green-500 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-green-600 transition-all duration-200"
                        aria-label="Tanya via WhatsApp"
                    >
                        <Icon name="whatsapp" className="w-5 h-5" />
                        Tanya Via WhatsApp
                    </button>
                </div>
                 
                 {/* Customer Reviews Section */}
                <div className="mt-6 border-t dark:border-gray-700 pt-4">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Ulasan Pelanggan ({product.reviewCount})</h2>
                    <div className="mt-4 space-y-4">
                        {productReviews.length > 0 ? productReviews.map(review => (
                            <div key={review.id} className="border-b dark:border-gray-700 pb-4">
                                <div className="flex items-center justify-between">
                                    <p className="font-semibold text-gray-800 dark:text-gray-200">{review.author}</p>
                                    <Stars rating={review.rating} />
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{review.comment}</p>
                            </div>
                        )) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400">Belum ada ulasan untuk produk ini.</p>
                        )}
                    </div>
                     <div className="mt-6 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Tulis Ulasan Anda</h3>
                        <form onSubmit={handleReviewSubmit} className="space-y-3">
                            <div>
                                <StarRatingInput rating={newRating} setRating={setNewRating} size="md" />
                            </div>
                            <div>
                                <label htmlFor="author" className="sr-only">Nama Anda</label>
                                <input
                                    type="text"
                                    id="author"
                                    value={newAuthor}
                                    onChange={(e) => setNewAuthor(e.target.value)}
                                    placeholder="Nama Anda"
                                    className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                                    required
                                    disabled={!!currentUser}
                                />
                            </div>
                             <div>
                                <label htmlFor="comment" className="sr-only">Komentar Anda</label>
                                <textarea
                                    id="comment"
                                    rows={3}
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Bagikan pengalaman Anda..."
                                    className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                                    required
                                ></textarea>
                            </div>
                            {reviewError && <p className="text-red-500 text-sm">{reviewError}</p>}
                            <button type="submit" className="w-full bg-amber-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-amber-600 transition-colors">
                                Kirim Ulasan
                            </button>
                        </form>
                    </div>
                </div>
                 
                {/* E-commerce Links Section */}
                {validEcommerceLinks.length > 0 && (
                    <div className="mt-6 border-t dark:border-gray-700 pt-4">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Beli Juga di</h2>
                        <div className="grid grid-cols-2 gap-3 mt-4">
                            {validEcommerceLinks.map(platform => (
                                <a key={platform.name} href={platform.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                    <img src={platform.imageUrl} alt={platform.label} className="w-8 h-8 rounded-md" />
                                    <span className="font-semibold text-gray-700 dark:text-gray-200">{platform.label}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                )}


                {/* AI Social Post Generator Section */}
                <div className="mt-6 border-t dark:border-gray-700 pt-4">
                     <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Buat Postingan Promosi</h2>
                     <button onClick={handleGenerateSocialPost} disabled={isGenerating} className="mt-3 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400">
                        <Icon name="sparkles" className="w-4 h-4" />
                        {isGenerating ? 'Membuat...' : 'Buat Teks Promosi dengan AI'}
                    </button>
                    {socialPost && (
                        <div className="mt-3 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg relative">
                            <p className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap">{socialPost}</p>
                             <button onClick={handleCopy} className="absolute top-2 right-2 p-2 text-gray-500 dark:text-gray-400 hover:text-blue-500">
                                 <Icon name="copy" className="w-5 h-5"/>
                             </button>
                             {showCopySuccess && <span className="absolute bottom-2 right-2 text-xs text-green-500">Tersalin!</span>}
                        </div>
                    )}
                </div>
                
                 <RecommendedProducts 
                    category={product.category} 
                    currentProductId={product.id} 
                    navigate={navigate}
                />
            </div>
            
             {/* Sticky Footer */}
            <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white dark:bg-gray-800 p-3 border-t border-gray-200 dark:border-gray-700 shadow-t-lg z-30">
                <div className="flex items-center gap-3">
                    {isOutOfStock ? (
                        <div className="w-full text-center font-bold text-gray-500 bg-gray-200 dark:bg-gray-700 dark:text-gray-400 py-3 rounded-lg">
                            Stok Habis
                        </div>
                    ) : (
                        <>
                            <button
                                onClick={handleAddToCart}
                                className="flex-shrink-0 w-16 h-12 flex items-center justify-center font-bold text-green-600 dark:text-green-400 bg-white dark:bg-gray-800 border-2 border-green-500 rounded-lg shadow-sm hover:bg-green-50 dark:hover:bg-gray-700 transition-all duration-200 active:scale-95"
                                aria-label="Tambah ke Keranjang"
                            >
                                <Icon name="cart" className="w-6 h-6" />
                            </button>
                            <button
                                onClick={handleBuyNow}
                                className="flex-grow text-center bg-green-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:bg-green-600 transition-all duration-200 active:scale-95"
                            >
                                Beli
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductPage;