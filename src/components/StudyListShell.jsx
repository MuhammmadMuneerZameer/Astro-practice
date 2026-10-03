import React, { useState, useMemo, useEffect } from 'react';
import { Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Shared filter+search shell for case-study list views.
 * Accepts `filters`, `initialItems`, and a `renderList` render-prop
 * that receives the filtered array and can compose any visual layout.
 */
export default function StudyListShell({ filters, initialItems = [], renderList }) {
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Read URL ?service= param on mount
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const sp = new URLSearchParams(window.location.search).get('service');
        if (sp && filters.some(f => f.id === sp)) setActiveFilter(sp);
    }, []);

    const filteredItems = useMemo(() => {
        return initialItems.filter(study => {
            const studyServices = Array.isArray(study.services) ? study.services : [study.service];
            const matchesFilter =
                activeFilter === 'all' ||
                studyServices.includes(activeFilter) ||
                study.service === activeFilter;
            const matchesSearch =
                study.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (study.client || '').toLowerCase().includes(searchQuery.toLowerCase());
            return matchesFilter && matchesSearch;
        });
    }, [activeFilter, searchQuery, initialItems]);

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Filter + Search bar */}
            <div className="sticky top-4 z-40 px-4 md:px-8 mb-4">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 justify-between items-center bg-black/80 backdrop-blur-xl p-4 rounded-2xl border border-white/10">
                    <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-hide">
                        {filters.map(filter => (
                            <button
                                key={filter.id}
                                onClick={() => setActiveFilter(filter.id)}
                                className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                                    activeFilter === filter.id
                                        ? 'bg-[#00f19f] text-black shadow-[0_0_20px_rgba(0,241,159,0.4)]'
                                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-5 py-2.5 bg-white/5 border border-white/10 rounded-full text-white text-sm focus:outline-none focus:border-[#00f19f] transition-colors"
                        />
                    </div>
                </div>
            </div>

            {renderList({ filteredItems, activeFilter, searchQuery, setActiveFilter, setSearchQuery })}
        </div>
    );
}
