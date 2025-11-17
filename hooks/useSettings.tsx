import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

export interface Settings {
    marqueeText: string;
}

interface SettingsContextType {
    settings: Settings;
    updateSettings: (newSettings: Partial<Settings>) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const DEFAULT_SETTINGS: Settings = {
    marqueeText: '🔥 Hot Promo! Cek diskon spesial kami hari ini! Diskon hingga 50% untuk produk tertentu! 🔥',
};

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

    useEffect(() => {
        try {
            const storedSettings = localStorage.getItem('kriuke_settings');
            if (storedSettings) {
                // Merge with defaults to ensure new settings are added
                setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(storedSettings) });
            } else {
                localStorage.setItem('kriuke_settings', JSON.stringify(DEFAULT_SETTINGS));
            }
        } catch (error) {
            console.error("Failed to load settings from localStorage", error);
            setSettings(DEFAULT_SETTINGS);
        }
    }, []);

    const updateSettings = useCallback((newSettings: Partial<Settings>) => {
        setSettings(prevSettings => {
            const updated = { ...prevSettings, ...newSettings };
            localStorage.setItem('kriuke_settings', JSON.stringify(updated));
            return updated;
        });
    }, []);

    const value = { settings, updateSettings };

    return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettings = (): SettingsContextType => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
