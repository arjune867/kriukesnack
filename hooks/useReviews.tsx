import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Review } from '../types';

interface ReviewsContextType {
    reviews: Review[];
    addReview: (reviewData: Omit<Review, 'id' | 'timestamp'>) => void;
    getReviewsByProductId: (productId: string) => Review[];
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

export const ReviewProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [reviews, setReviews] = useState<Review[]>([]);

    useEffect(() => {
        try {
            const storedReviews = localStorage.getItem('kriuke_reviews');
            if (storedReviews) {
                setReviews(JSON.parse(storedReviews));
            }
        } catch (error) {
            console.error("Failed to load reviews from localStorage", error);
            setReviews([]);
        }
    }, []);

    const persistReviews = (newReviews: Review[]) => {
        localStorage.setItem('kriuke_reviews', JSON.stringify(newReviews));
        setReviews(newReviews);
    };

    const addReview = useCallback((reviewData: Omit<Review, 'id' | 'timestamp'>) => {
        const newReview: Review = {
            id: new Date().getTime().toString(),
            timestamp: Date.now(),
            ...reviewData,
        };
        const updatedReviews = [...reviews, newReview];
        persistReviews(updatedReviews);
    }, [reviews]);

    const getReviewsByProductId = useCallback((productId: string) => {
        return reviews.filter(review => review.productId === productId).sort((a, b) => b.timestamp - a.timestamp);
    }, [reviews]);

    const value = { reviews, addReview, getReviewsByProductId };

    return <ReviewsContext.Provider value={value}>{children}</ReviewsContext.Provider>;
};

export const useReviews = (): ReviewsContextType => {
    const context = useContext(ReviewsContext);
    if (context === undefined) {
        throw new Error('useReviews must be used within a ReviewProvider');
    }
    return context;
};
