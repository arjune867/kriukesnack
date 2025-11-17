import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { QuickAction } from '../types';
import { MOCK_QUICK_ACTIONS } from '../data/mockData';

interface QuickActionsContextType {
    quickActions: QuickAction[];
    addQuickAction: (action: Omit<QuickAction, 'id'>) => void;
    updateQuickAction: (action: QuickAction) => void;
    deleteQuickAction: (actionId: string) => void;
}

const QuickActionsContext = createContext<QuickActionsContextType | undefined>(undefined);

export const QuickActionsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [quickActions, setQuickActions] = useState<QuickAction[]>([]);

    useEffect(() => {
        try {
            const storedActions = localStorage.getItem('kriuke_quick_actions');
            if (storedActions) {
                setQuickActions(JSON.parse(storedActions));
            } else {
                setQuickActions(MOCK_QUICK_ACTIONS);
                localStorage.setItem('kriuke_quick_actions', JSON.stringify(MOCK_QUICK_ACTIONS));
            }
        } catch (error) {
            console.error("Failed to load quick actions from localStorage", error);
            setQuickActions(MOCK_QUICK_ACTIONS);
        }
    }, []);

    const persistQuickActions = (newActions: QuickAction[]) => {
        localStorage.setItem('kriuke_quick_actions', JSON.stringify(newActions));
        setQuickActions(newActions);
    };

    const addQuickAction = useCallback((actionData: Omit<QuickAction, 'id'>) => {
        const newAction: QuickAction = {
            id: new Date().getTime().toString(),
            ...actionData,
        };
        const updatedActions = [...quickActions, newAction];
        persistQuickActions(updatedActions);
    }, [quickActions]);

    const updateQuickAction = useCallback((updatedAction: QuickAction) => {
        const updatedActions = quickActions.map(p => p.id === updatedAction.id ? updatedAction : p);
        persistQuickActions(updatedActions);
    }, [quickActions]);

    const deleteQuickAction = useCallback((actionId: string) => {
        const updatedActions = quickActions.filter(p => p.id !== actionId);
        persistQuickActions(updatedActions);
    }, [quickActions]);

    const value = { quickActions, addQuickAction, updateQuickAction, deleteQuickAction };

    return <QuickActionsContext.Provider value={value}>{children}</QuickActionsContext.Provider>;
};

export const useQuickActions = (): QuickActionsContextType => {
    const context = useContext(QuickActionsContext);
    if (context === undefined) {
        throw new Error('useQuickActions must be used within a QuickActionsProvider');
    }
    return context;
};
