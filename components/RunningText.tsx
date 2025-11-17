import React from 'react';
import { useSettings } from '../hooks/useSettings';
import { Icon } from './Icon';

const RunningText: React.FC = () => {
    const { settings } = useSettings();
    const marqueeText = settings.marqueeText;

    if (!marqueeText) {
        return null;
    }
    
    // Create a JSX element for the content to be animated
    const AnimatedContent = () => (
        <div className="flex items-center">
            <span className="mx-4">{marqueeText}</span>
            <Icon name="star" className="w-3 h-3 text-amber-300 dark:text-amber-500 flex-shrink-0" isSolid />
            <span className="mx-4">{marqueeText}</span>
            <Icon name="star" className="w-3 h-3 text-amber-300 dark:text-amber-500 flex-shrink-0" isSolid />
        </div>
    );


    return (
        <div className="bg-amber-50 dark:bg-gray-800 flex items-center overflow-hidden whitespace-nowrap text-sm font-medium h-8 border-b border-gray-200 dark:border-gray-700">
            {/* By adding relative and z-10, we ensure this icon container is rendered on top of its sibling text container, preventing any potential overlap from the animation. */}
            <div className="relative z-10 bg-amber-400 dark:bg-amber-600 flex items-center justify-center h-full px-3 flex-shrink-0">
                <Icon name="ticket" className="h-5 w-5 text-white" />
            </div>
            <div className="animate-marquee text-gray-700 dark:text-gray-200">
                <div className="inline-block"><AnimatedContent /></div>
                <div className="inline-block" aria-hidden="true"><AnimatedContent /></div>
            </div>
             <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 30s linear infinite;
                    white-space: nowrap;
                    will-change: transform;
                    display: inline-block;
                }
                 .animate-marquee:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    );
};

export default RunningText;