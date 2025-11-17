import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [theme, setThemeState] = useState<Theme>(() => {
        try {
            const storedTheme = localStorage.getItem('kriuke_theme') as Theme | null;
            return storedTheme || 'system';
        } catch {
            return 'system';
        }
    });

    useEffect(() => {
        const root = window.document.documentElement;
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        // This function will apply the correct theme class to the root element
        const applyTheme = () => {
            const isDark =
                theme === 'dark' ||
                (theme === 'system' && mediaQuery.matches);

            // Only manage the 'dark' class. The absence of 'dark' implies light mode.
            if (isDark) {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
        };

        applyTheme(); // Apply theme when the hook runs

        // Listen for changes in system preference
        mediaQuery.addEventListener('change', applyTheme);
        
        // Cleanup listener on component unmount or when theme changes
        return () => {
            mediaQuery.removeEventListener('change', applyTheme);
        };
    }, [theme]);

    const setTheme = (newTheme: Theme) => {
        try {
            localStorage.setItem('kriuke_theme', newTheme);
        } catch (error) {
            console.error("Failed to save theme to localStorage", error);
        }
        setThemeState(newTheme);
    };

    const value = { theme, setTheme };

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};