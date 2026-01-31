import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

const ThemeToggle: React.FC = () => {
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        // Apply theme to document
        const root = window.document.documentElement;
        if (isDark) {
            root.removeAttribute('data-theme');
        } else {
            root.setAttribute('data-theme', 'light');
        }
    }, [isDark]);

    const toggleTheme = () => setIsDark(!isDark);

    return (
        <button
            onClick={toggleTheme}
            className="fixed top-6 right-6 z-50 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all text-white dark:text-gray-900"
            aria-label="Toggle Theme"
        >
            <motion.div
                initial={false}
                animate={{ rotate: isDark ? 0 : 180 }}
                transition={{ duration: 0.3 }}
            >
                {isDark ? (
                    <Moon size={24} className="text-violet-400 drop-shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
                ) : (
                    <Sun size={24} className="text-yellow-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                )}
            </motion.div>
        </button>
    );
};

export default ThemeToggle;
