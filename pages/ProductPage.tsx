
import React, { useState } from 'react';
import { Product, Page } from '../types';
import { Icon } from '../components/Icon';
import { generateSocialPost } from '../services/geminiService';
import { useCart } from '../hooks/useCart';

interface ProductPageProps {
    product: Product;
    navigate: (page: Page) => void;
}

const ProductPage: React.FC<ProductPageProps> = ({ product }) => {
    const [socialPost, setSocialPost] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const { addToCart } = useCart();

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

    const handleShare = async () => {
        const shareData = {
            title: `Kriuké Snack - ${product.name}`,
            text: socialPost || `Cek kripik pisang enak ini: ${product.name} dari Kriuké Snack!`,
            url: window.location.href,
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                alert('Fitur share tidak didukung di browser ini.');
            }
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    const handleGenerateSocialPost = async () => {
        setIsGenerating(true);
        const post = await generateSocialPost(product.name);
        setSocialPost(post);
        setIsGenerating(false);
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

                <div className="mt-6 border-t pt-6">
                     <div className="space-y-3">
                        <button onClick={handleGenerateSocialPost} disabled={isGenerating} className="w-full flex justify-center items-center gap-2 bg-blue-500 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-blue-600 transition-all duration-200 disabled:bg-blue-300">
                           <Icon name="sparkles" /> {isGenerating ? 'Membuat Teks...' : 'Buat Teks Share (AI)'}
                        </button>
                         {socialPost && (
                             <div className="p-3 bg-gray-100 rounded-lg text-sm text-gray-700">
                                 {socialPost}
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
        </div>
    );
};

export default ProductPage;
