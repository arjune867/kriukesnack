import React, { useState, useMemo } from 'react';
import { Product, Page } from '../types';
import { Icon } from '../components/Icon';
import { generateSocialPost } from '../services/geminiService';
import { useCart } from '../hooks/useCart';
import { useShare } from '../hooks/useShare';
import { useReviews } from '../hooks/useReviews';
import { useAuth } from '../hooks/useAuth';
import StarRatingInput from '../components/StarRatingInput';

interface ProductPageProps {
    product: Product;
    navigate: (page: Page) => void;
}

const StarRatingDisplay: React.FC<{ rating: number; reviewCount: number; size?: 'sm' | 'md' }> = ({ rating, reviewCount, size = 'md' }) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
    }
    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                    <Icon
                        key={i}
                        name="star"
                        className={`${sizeClasses[size]} ${i < Math.round(rating) ? 'text-amber-400' : 'text-gray-300'}`}
                        isSolid={true}
                    />
                ))}
            </div>
            {reviewCount > 0 && (
                <>
                    <span className="font-bold text-gray-800">{rating.toFixed(1)}</span>
                    <span className="text-sm text-gray-500">({reviewCount} ulasan)</span>
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
                    className={`${sizeClasses[size]} ${i < Math.round(rating) ? 'text-amber-400' : 'text-gray-300'}`}
                    isSolid={true}
                />
            ))}
        </div>
    );
};

const ProductPage: React.FC<ProductPageProps> = ({ product }) => {
    const [socialPost, setSocialPost] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [showCopySuccess, setShowCopySuccess] = useState(false);
    const { addToCart } = useCart();
    const { openShareModal } = useShare();
    const { getReviewsByProductId, addReview } = useReviews();
    const { currentUser } = useAuth();
    
    const [newRating, setNewRating] = useState(0);
    const [newComment, setNewComment] = useState('');
    const [newAuthor, setNewAuthor] = useState(currentUser?.username || '');
    const [reviewError, setReviewError] = useState('');

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
    
    const WHATSAPP_NUMBER = '6282349786916';
    const whatsappMessage = `Halo Kriuké Snack, saya tertarik untuk memesan produk ${product.name}.`;
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

    const handleShare = () => {
        openShareModal(product);
    };

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
      { name: 'shopee', label: 'Shopee', link: product.ecommerceLinks.shopee, imageUrl: 'https://i.ibb.co.com/Vp32s5hK/shopee-seeklogo.png' },
      { name: 'tokopedia', label: 'Tokopedia', link: product.ecommerceLinks.tokopedia, imageUrl: 'https://i.ibb.co.com/fYb3fDrz/tokopedia-seeklogo.png' },
      { name: 'lazada', label: 'Lazada', link: product.ecommerceLinks.lazada, imageUrl: 'https://i.ibb.co.com/0VBH5vB9/lazada-seeklogo.png' },
    ];


    return (
        <div className="bg-white pb-32">
            <div className="aspect-w-1 aspect-h-1 w-full">
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
                <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
                <div className="mt-2">
                   <StarRatingDisplay rating={product.rating} reviewCount={product.reviewCount} />
                </div>
                <p className="text-3xl font-extrabold text-amber-500 mt-2">{formatCurrency(product.price)}</p>
                <div className="mt-4 prose prose-sm text-gray-600">
                    <p>{product.description}</p>
                </div>
                
                <div className="mt-6">
                    <h3 className="font-semibold text-gray-800 mb-2">Beli lewat E-commerce Favoritmu:</h3>
                    <div className="grid grid-cols-4 gap-3 text-center">
                        {ecommercePlatforms.map(platform => (
                            <a 
                                key={platform.name} 
                                href={platform.link} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="block p-3 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                            >
                                <img src={platform.imageUrl} alt={platform.label} className="w-10 h-10 mx-auto rounded" />
                                <span className="text-xs font-medium mt-1 block">{platform.label}</span>
                            </a>
                        ))}
                    </div>
                </div>

                 <div className="mt-8 border-t pt-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Ulasan Pelanggan</h3>
                    
                    <div className="bg-gray-50 p-4 rounded-lg mb-6 border">
                        <h4 className="font-semibold mb-3 text-gray-700">Tulis Ulasan Anda</h4>
                        <form onSubmit={handleReviewSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Rating</label>
                                <StarRatingInput rating={newRating} setRating={setNewRating} />
                            </div>
                             {!currentUser && (
                                <div>
                                    <label htmlFor="author" className="block text-sm font-medium text-gray-600">Nama</label>
                                    <input
                                        type="text"
                                        id="author"
                                        value={newAuthor}
                                        onChange={(e) => setNewAuthor(e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                                        placeholder="Nama Anda"
                                        required
                                    />
                                </div>
                            )}
                            <div>
                                <label htmlFor="comment" className="block text-sm font-medium text-gray-600">Komentar</label>
                                <textarea
                                    id="comment"
                                    rows={3}
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                                    placeholder="Bagaimana pendapat Anda tentang produk ini?"
                                    required
                                />
                            </div>
                            {reviewError && <p className="text-red-500 text-sm">{reviewError}</p>}
                            <button type="submit" className="w-full bg-orange-500 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-orange-600 transition-colors">
                                Kirim Ulasan
                            </button>
                        </form>
                    </div>

                    <div className="space-y-6">
                        {productReviews.length > 0 ? (
                            productReviews.map(review => (
                                <div key={review.id} className="border-b pb-4 last:border-b-0">
                                    <div className="flex items-center mb-1">
                                         <Stars rating={review.rating} size="sm" />
                                         <span className="text-gray-400 mx-2">•</span>
                                         <p className="font-semibold text-gray-800 text-sm">{review.author}</p>
                                    </div>
                                    <p className="text-xs text-gray-400 mb-2">
                                        {new Date(review.timestamp).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </p>
                                    <p className="text-gray-600 text-sm">{review.comment}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm">Belum ada ulasan untuk produk ini. Jadilah yang pertama!</p>
                        )}
                    </div>
                </div>

                <div className="mt-6 border-t pt-6">
                     <div className="space-y-3">
                        <button onClick={handleGenerateSocialPost} disabled={isGenerating} className="w-full flex justify-center items-center gap-2 bg-blue-500 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-blue-600 transition-all duration-200 disabled:bg-blue-300">
                           <Icon name="sparkles" /> {isGenerating ? 'Membuat Teks...' : 'Buat Teks Share (AI)'}
                        </button>
                         {socialPost && (
                             <div className="relative p-4 pr-12 bg-gray-100 rounded-lg text-sm text-gray-700 border border-gray-200">
                                <pre className="whitespace-pre-wrap font-sans break-words">{socialPost}</pre>
                                <button 
                                    onClick={handleCopy}
                                    className="absolute top-2 right-2 p-2 bg-white rounded-full text-gray-600 hover:bg-gray-200 active:bg-gray-300 transition-colors"
                                    aria-label="Salin teks"
                                >
                                    <Icon name="copy" className="w-5 h-5" />
                                </button>
                            </div>
                         )}
                    </div>
                </div>
            </div>
            <div className="sticky bottom-16 left-0 right-0 p-4 bg-white border-t">
                 <div className="flex items-center gap-3">
                    <button 
                        onClick={handleShare} 
                        className="p-3 rounded-lg shadow-md transition-all duration-200 border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                        aria-label="Bagikan produk"
                    >
                        <Icon name="share" />
                    </button>
                     <button
                        onClick={() => addToCart(product)}
                        className="p-3 rounded-lg shadow-md transition-all duration-200 border border-orange-500 bg-orange-50 text-orange-600 hover:bg-orange-100"
                        aria-label="Tambah ke keranjang"
                    >
                        <Icon name="cart" />
                    </button>
                    <a 
                        href={whatsappUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex-grow flex justify-center items-center gap-2 bg-green-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:bg-green-600 transition-all duration-200"
                    >
                        <Icon name="whatsapp" /> Beli via WhatsApp
                    </a>
                </div>
            </div>
            {showCopySuccess && (
                <div className="fixed bottom-32 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-full text-sm shadow-lg z-50 animate-fade-in-out">
                    Teks promosi berhasil disalin!
                </div>
            )}
        </div>
    );
};

export default ProductPage;