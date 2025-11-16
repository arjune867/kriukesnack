import { Product, Promotion, Category, DiscountCode } from '../types';

export const MOCK_PRODUCTS: Product[] = [
    {
        id: '1',
        name: 'Keripik Pisang Rasa Original',
        price: 25000,
        description: 'Rasa original yang gurih dan renyah, dibuat dari pisang pilihan. Cocok untuk teman santai kapan saja!',
        category: 'Keripik Pisang',
        imageUrl: 'https://picsum.photos/seed/original-kriuke/400/400',
        rating: 4.8,
        reviewCount: 0,
        soldCount: 132,
        ecommerceLinks: {
            tiktok: '#',
            tokopedia: '#',
            shopee: '#',
            lazada: '#',
        },
        discountCodeId: '1', // Linked to HEMAT10 (10% off)
    },
    {
        id: '2',
        name: 'Kriuke Rasa Coklat',
        price: 20000,
        description: 'Perpaduan sempurna rasa coklat lumer. Bikin nagih sejak gigitan pertama!',
        category: 'Promo Spesial',
        imageUrl: 'https://picsum.photos/seed/coklat-kriuke/400/400',
        rating: 4.9,
        reviewCount: 0,
        soldCount: 250,
        ecommerceLinks: {
            tiktok: '#',
            tokopedia: '#',
            shopee: '#',
            lazada: '#',
        }
    },
    {
        id: '3',
        name: 'Keripik Pisang Rasa Balado',
        price: 22000,
        description: 'Kriuknya kripik pisang dibalut dengan bumbu balado pedas yang mantap. Favorit semua kalangan!',
        category: 'Keripik Pisang',
        imageUrl: 'https://picsum.photos/seed/balado-kriuke/400/400',
        rating: 4.7,
        reviewCount: 0,
        soldCount: 98,
        ecommerceLinks: {
            tiktok: '#',
            tokopedia: '#',
            shopee: '#',
            lazada: '#',
        }
    },
    {
        id: '4',
        name: 'Keripik Pisang Pedas Manis',
        price: 22000,
        description: 'Taburan bumbu pedas manis yang melimpah di setiap kepingnya. Rasa pedas manisnya pas banget di lidah.',
        category: 'Keripik Pisang',
        imageUrl: 'https://picsum.photos/seed/pedas-manis-kriuke/400/400',
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
        price: 17000,
        description: 'Aroma dan rasa jagung bakar yang khas, membawa sensasi seperti sedang berpesta barbekyu.',
        category: 'Promo Spesial',
        imageUrl: 'https://picsum.photos/seed/jagung-bakar-kriuke/400/400',
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
        price: 18000,
        description: 'Rasa green tea yang unik dan sedikit pahit, memberikan pengalaman ngemil yang berbeda dan modern.',
        category: 'Keripik Pisang',
        imageUrl: 'https://picsum.photos/seed/greentea-kriuke/400/400',
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
        imageUrl: 'https://picsum.photos/seed/promo1/800/400',
        productId: '2', // Links to 'Kriuke Rasa Coklat'
    },
    {
        id: 'promo2',
        imageUrl: 'https://picsum.photos/seed/promo2/800/400',
        productId: '5', // Links to 'Jagung Bakar Special'
    },
    {
        id: 'promo3',
        imageUrl: 'https://picsum.photos/seed/promo3/800/400',
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