export type IconName = 'home' | 'user' | 'arrowLeft' | 'share' | 'whatsapp' | 'tiktok' | 'tokopedia' | 'shopee' | 'lazada' | 'edit' | 'trash' | 'plus' | 'sparkles' | 'logout' | 'cart' | 'search' | 'menu' | 'heart' | 'star' | 'close' | 'eye' | 'eye-slash' | 'copy' | 'twitter' | 'facebook' | 'email' | 'link' | 'arrowUp' | 'ticket' | 'instagram' | 'phone' | 'mapPin' | 'pencil' | 'grid';

export interface Variant {
    id: string;
    name: string; // e.g., "100g", "250g"
    price: number;
    stock: number;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    category: string;
    variants: Variant[];
    rating: number;
    reviewCount: number;
    ecommerceLinks: {
        tiktok: string;
        tokopedia: string;
        shopee: string;
        lazada: string;
    };
    discountCodeId?: string; // Link to a discount
    soldCount?: number;
}

export interface Promotion {
    id: string;
    title: string;
    imageUrl: string;
    productId: string; // ID of the product it links to
}

export interface Category {
    id:string;
    name: string;
}

export interface DiscountCode {
    id: string;
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
}

export interface Admin {
    username: string;
}

export interface User {
    username: string;
    password: string; // In a real app, this would be a hash
    email?: string;
    whatsapp?: string;
}

export interface Review {
    id: string;
    productId: string;
    author: string;
    rating: number;
    comment: string;
    timestamp: number;
}

export interface QuickAction {
    id: string;
    name: string;
    icon: IconName;
    color: string; // Tailwind classes like "bg-red-100 dark:bg-red-500/20 text-red-500 dark:text-red-400"
    link?: string;
}

export type Page = 'home' | 'product' | 'admin' | 'cart' | 'wishlist' | 'profile' | 'login' | 'register' | 'forgotPassword' | 'resetPassword' | 'promo' | 'newProducts';