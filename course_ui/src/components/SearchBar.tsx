import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

interface SearchBarProps {
    onSearch: (query: string) => void;
    isSearching: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isSearching }) => {
    const [query, setQuery] = useState('');

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && query.trim()) {
            onSearch(query);
        }
    };

    return (
        <motion.div
            className="relative w-full max-w-2xl px-4"
            layoutId="search-container"
        >
            <div className="relative group">
                <div
                    className={`absolute -inset-1 rounded-full bg-gradient-to-r from-primary via-accent to-secondary opacity-75 blur-lg transition-all duration-500 group-hover:opacity-100 group-hover:duration-200 ${isSearching ? 'animate-pulse' : 'animate-siren'}`}
                ></div>
                <div className="relative flex items-center bg-surface rounded-full ring-1 ring-white/20 dark:ring-black/10 shadow-2xl overflow-hidden">
                    <Search className="ml-6 text-gray-400" size={24} />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Describe the course you want to learn (e.g. beginner python)..."
                        className="w-full py-5 px-4 bg-transparent text-text text-lg placeholder-gray-500 focus:outline-none font-medium"
                        autoFocus
                    />
                    <button
                        onClick={() => query.trim() && onSearch(query)}
                        className="mr-2 p-3 rounded-full hover:bg-text/5 transition-colors"
                    >
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                            <span className="sr-only">Search</span>
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center">
                                <Search size={16} className="text-white" />
                            </div>
                        </motion.div>
                    </button>
                </div>
            </div>
        </motion.div >
    );
};

export default SearchBar;
