import React from 'react';
import { Icon } from './Icon';
import { useQuickActions } from '../hooks/useQuickActions';

const QuickActions: React.FC = () => {
    const { quickActions } = useQuickActions();

    if (!quickActions || quickActions.length === 0) {
        return null;
    }

    return (
        <div className="bg-white dark:bg-gray-800/50 p-4">
            <div className="flex items-start space-x-4 overflow-x-auto pb-2 -mx-4 px-4" style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch', msOverflowStyle: 'none' }}>
                {quickActions.map(action => {
                    const ActionContent = (
                        <>
                            <div className={`w-14 h-14 rounded-lg flex items-center justify-center transition-transform active:scale-90 ${action.color}`}>
                                <Icon name={action.icon} className="w-7 h-7" />
                            </div>
                            <span className="w-16 text-xs font-medium text-gray-700 dark:text-gray-300 mt-2 break-words whitespace-normal leading-tight">{action.name}</span>
                        </>
                    );

                    const baseClasses = "flex-shrink-0 flex flex-col items-center justify-start text-center no-underline";
                    
                    if (action.link) {
                        return (
                             <a key={action.id} href={action.link} className={baseClasses}>
                                {ActionContent}
                            </a>
                        )
                    }
                    
                    return (
                        <div key={action.id} className={baseClasses}>
                           {ActionContent}
                        </div>
                    )

                })}
            </div>
        </div>
    );
};

export default QuickActions;