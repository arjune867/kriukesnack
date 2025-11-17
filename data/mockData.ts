import { Product, Promotion, Category, DiscountCode, QuickAction } from '../types';

export const MOCK_PRODUCTS: Product[] = [
    {
        id: '1',
        name: 'Keripik Pisang Rasa Original',
        description: 'Rasa original yang gurih dan renyah, dibuat dari pisang pilihan. Cocok untuk teman santai kapan saja!',
        category: 'Keripik Pisang',
        imageUrl: 'https://picsum.photos/seed/original-kriuke/400/400',
        variants: [
            { id: 'v1-100', name: '100g', price: 15000, stock: 30 },
            { id: 'v1-250', name: '250g', price: 25000, stock: 50 },
        ],
        rating: 4.8,
        reviewCount: 0,
        soldCount: 132,
        ecommerceLinks: {
            tiktok: 'https://www.tiktok.com/',
            tokopedia: 'https://www.tokopedia.com/find/keripik-pisang',
            shopee: 'https://shopee.co.id/search?keyword=keripik%20pisang',
            lazada: 'https://www.lazada.co.id/catalog/?q=keripik+pisang',
        },
        discountCodeId: '1', // Linked to HEMAT10 (10% off)
    },
    {
        id: '2',
        name: 'Kriuke Rasa Coklat',
        description: 'Perpaduan sempurna rasa coklat lumer. Bikin nagih sejak gigitan pertama!',
        category: 'Promo Spesial',
        imageUrl: 'https://picsum.photos/seed/coklat-kriuke/400/400',
        variants: [
            { id: 'v2-100', name: '100g', price: 12000, stock: 80 },
            { id: 'v2-250', name: '250g', price: 20000, stock: 120 },
        ],
        rating: 4.9,
        reviewCount: 0,
        soldCount: 250,
        ecommerceLinks: {
            tiktok: 'https://www.tiktok.com/',
            tokopedia: 'https://www.tokopedia.com/find/keripik-pisang-coklat',
            shopee: 'https://shopee.co.id/search?keyword=keripik%20pisang%20coklat',
            lazada: 'https://www.lazada.co.id/catalog/?q=keripik+pisang+coklat',
        }
    },
    {
        id: '3',
        name: 'Keripik Pisang Rasa Balado',
        description: 'Kriuknya kripik pisang dibalut dengan bumbu balado pedas yang mantap. Favorit semua kalangan!',
        category: 'Keripik Pisang',
        imageUrl: 'https://picsum.photos/seed/balado-kriuke/400/400',
        variants: [
            { id: 'v3-250', name: '250g', price: 22000, stock: 8 },
        ],
        rating: 4.7,
        reviewCount: 0,
        soldCount: 98,
        ecommerceLinks: {
            tiktok: 'https://www.tiktok.com/',
            tokopedia: 'https://www.tokopedia.com/find/keripik-pisang-balado',
            shopee: 'https://shopee.co.id/search?keyword=keripik%20pisang%20balado',
            lazada: 'https://www.lazada.co.id/catalog/?q=keripik+pisang+balado',
        }
    },
    {
        id: '4',
        name: 'Keripik Pisang Pedas Manis',
        description: 'Taburan bumbu pedas manis yang melimpah di setiap kepingnya. Rasa pedas manisnya pas banget di lidah.',
        category: 'Keripik Pisang',
        imageUrl: 'https://picsum.photos/seed/pedas-manis-kriuke/400/400',
        variants: [
            { id: 'v4-250', name: '250g', price: 22000, stock: 0 },
        ],
        rating: 4.6,
        reviewCount: 0,
        soldCount: 115,
        ecommerceLinks: {
            tiktok: '#',
            tokopedia: '#',
            shopee: '#',
            lazada: '#',
        }
    },
    {
        id: '5',
        name: 'Jagung Bakar Special',
        description: 'Aroma dan rasa jagung bakar yang khas, membawa sensasi seperti sedang berpesta barbekyu.',
        category: 'Promo Spesial',
        imageUrl: 'https://picsum.photos/seed/jagung-bakar-kriuke/400/400',
        variants: [
            { id: 'v5-100', name: '100g', price: 10000, stock: 15 },
            { id: 'v5-250', name: '250g', price: 17000, stock: 35 },
        ],
        rating: 4.5,
        reviewCount: 0,
        soldCount: 88,
        ecommerceLinks: {
            tiktok: '#',
            tokopedia: '#',
            shopee: '#',
            lazada: '#',
        }
    },
    {
        id: '6',
        name: 'Premium Green Tea',
        description: 'Rasa green tea yang unik dan sedikit pahit, memberikan pengalaman ngemil yang berbeda dan modern.',
        category: 'Keripik Pisang',
        imageUrl: 'https://picsum.photos/seed/greentea-kriuke/400/400',
        variants: [
            { id: 'v6-250', name: '250g', price: 18000, stock: 22 },
        ],
        rating: 4.7,
        reviewCount: 0,
        soldCount: 102,
        ecommerceLinks: {
            tiktok: '#',
            tokopedia: '#',
            shopee: '#',
            lazada: '#',
        }
    }
];

export const MOCK_PROMOTIONS: Promotion[] = [
    {
        id: 'promo1',
        title: 'Coklat Lumer Bikin Nagih!',
        imageUrl: 'https://picsum.photos/seed/promo1/400/400',
        productId: '2', // Links to 'Kriuke Rasa Coklat'
    },
    {
        id: 'promo2',
        title: 'Spesial Rasa Jagung Bakar',
        imageUrl: 'https://picsum.photos/seed/promo2/400/400',
        productId: '5', // Links to 'Jagung Bakar Special'
    },
    {
        id: 'promo3',
        title: 'Gurih Original, Teman Santai',
        imageUrl: 'https://picsum.photos/seed/promo3/400/400',
        productId: '1', // Links to 'Original'
    }
];

export const MOCK_CATEGORIES: Category[] = [
    { id: '1', name: 'Keripik Pisang' },
    { id: '2', name: 'Promo Spesial' },
];

export const MOCK_DISCOUNTS: DiscountCode[] = [
    { id: '1', code: 'HEMAT10', type: 'percentage', value: 10 },
    { id: '2', code: 'KRIUKE5K', type: 'fixed', value: 5000 },
];

export const MOCK_QUICK_ACTIONS: QuickAction[] = [
    { id: 'qa1', name: 'Diskon Kilat', icon: 'ticket', color: 'bg-red-100 dark:bg-red-500/20 text-red-500 dark:text-red-400', link: '#' },
    { id: 'qa2', name: 'Voucher', icon: 'ticket', color: 'bg-green-100 dark:bg-green-500/20 text-green-500 dark:text-green-400', link: '#' },
    { id: 'qa3', name: 'Produk Baru', icon: 'sparkles', color: 'bg-blue-100 dark:bg-blue-500/20 text-blue-500 dark:text-blue-400', link: '#' },
    { id: 'qa4', name: 'Kategori', icon: 'grid', color: 'bg-purple-100 dark:bg-purple-500/20 text-purple-500 dark:text-purple-400', link: '#' },
    { id: 'qa5', name: 'Best Seller', icon: 'star', color: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-500 dark:text-yellow-400', link: '#' },
    { id: 'qa6', name: 'Info Toko', icon: 'mapPin', color: 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-500 dark:text-indigo-400', link: '#' },
    { id: 'qa7', name: 'Kontak Kami', icon: 'phone', color: 'bg-pink-100 dark:bg-pink-500/20 text-pink-500 dark:text-pink-400', link: '#' },
    { id: 'qa8', name: 'Shopee', icon: 'shopee', color: 'bg-orange-100 dark:bg-orange-500/20 text-orange-500 dark:text-orange-400', link: '#' },
    { id: 'qa9', name: 'Tokopedia', icon: 'tokopedia', color: 'bg-teal-100 dark:bg-teal-500/20 text-teal-500 dark:text-teal-400', link: '#' },
    { id: 'qa10', name: 'Lazada', icon: 'lazada', color: 'bg-sky-100 dark:bg-sky-500/20 text-sky-500 dark:text-sky-400', link: '#' },
];