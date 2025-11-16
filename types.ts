export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
    category: string;
    rating: number;
    reviewCount: number;
    ecommerceLinks: {
        tiktok: string;
        tokopedia: string;
        shopee: string;
        lazada: string;
    };
}

export interface Promotion {
    id: string;
    imageUrl: string;
    productId: string; // ID of the product it links to
}

export interface Category {
    id: string;
    name: string;
}

export interface Admin {
    username: string;
}

export interface User {
    username: string;
    password: string; // In a real app, this would be a hash
}

export type Page = 'home' | 'product' | 'admin' | 'cart' | 'wishlist' | 'profile' | 'login' | 'register' | 'forgotPassword' | 'resetPassword';