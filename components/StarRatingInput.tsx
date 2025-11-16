import React, { useState } from 'react';
import { Icon } from './Icon';

interface StarRatingInputProps {
    rating: number;
    setRating: (rating: number) => void;
    size?: 'sm' | 'md' | 'lg';
}

const StarRatingInput: React.FC<StarRatingInputProps> = ({ rating, setRating, size = 'md' }) => {
    const [hoverRating, setHoverRating] = useState(0);

    const sizeClasses = {
        sm: 'w-6 h-6',
        md: 'w-8 h-8',
        lg: 'w-10 h-10',
    };

    return (
        <div className="flex items-center" onMouseLeave={() => setHoverRating(0)}>
            {[...Array(5)].map((_, index) => {
                const starValue = index + 1;
                return (
                    <button
                        type="button"
                        key={starValue}
                        className={`text-gray-300 transition-colors duration-150 ${
                            (hoverRating || rating) >= starValue ? 'text-amber-400' : 'text-gray-300'
                        }`}
                        onClick={() => setRating(starValue)}
                        onMouseEnter={() => setHoverRating(starValue)}
                        aria-label={`Set rating to ${starValue}`}
                    >
                        <Icon name="star" className={sizeClasses[size]} isSolid={true} />
                    </button>
                );
            })}
        </div>
    );
};

export default StarRatingInput;
