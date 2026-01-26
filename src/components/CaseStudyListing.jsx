import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CaseStudyCard from './CaseStudyCard';

const FILTERS = [
    { id: 'all', label: 'All Projects' },
    { id: 'ux-ui-design', label: 'UX/UI Design' },
    { id: 'web-development', label: 'Web Development' },
    { id: 'mobile-app', label: 'Mobile App' },
    { id: 'branding', label: 'Branding' },
    { id: 'digital-marketing', label: 'Digital Marketing' }
];

export default function CaseStudyListing({ initialCaseStudies = [] }) {
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Initialize filter from URL query param
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const serviceParam = params.get('service');
            if (serviceParam && FILTERS.some(f => f.id === serviceParam)) {
                setActiveFilter(serviceParam);
            }
        }
    }, []);

    const filteredStudies = useMemo(() => {
        return initialCaseStudies.filter(study => {
            // Handle both single service (string) and multiple services (array)
            const studyServices = Array.isArray(study.services) ? study.services : [study.service];

            const matchesFilter = activeFilter === 'all' || studyServices.includes(activeFilter) || study.service === activeFilter;
            const matchesSearch = study.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                study.client.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesFilter && matchesSearch;
        });
    }, [activeFilter, searchQuery, initialCaseStudies]);

    return (
        <div className="min-h-screen bg-black text-white py-12 md:py-24 px-4 md:px-8">

            {/* Search & Filter Bar */}
            <div className="max-w-7xl mx-auto mb-16 flex flex-col md:flex-row gap-6 justify-between items-center sticky top-4 z-40 bg-black/80 backdrop-blur-xl p-4 rounded-2xl border border-gray-800">

                {/* Filters */}
                <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
                    {FILTERS.map(filter => (
                        <button
                            key={filter.id}
                            onClick={() => setActiveFilter(filter.id)}
                            className={`whitespace-nowrap px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${activeFilter === filter.id
                                ? 'bg-green-500 text-black shadow-[0_0_20px_rgba(34,197,94,0.4)]'
                                : 'bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white'
                                }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search projects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-6 py-3 bg-gray-900 border border-gray-800 rounded-full text-white focus:outline-none focus:border-green-500 transition-colors"
                    />
                </div>
            </div>

            {/* Masonry Grid */}
            <motion.div
                layout
                className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
                <AnimatePresence>
                    {filteredStudies.map((study) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                            key={study.id}
                            className="h-full"
                        >
                            <CaseStudyCard study={study} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {filteredStudies.length === 0 && (
                <div className="text-center py-20">
                    <h3 className="text-2xl font-bold text-gray-700">No projects found.</h3>
                    <p className="text-gray-500">Try adjusting your filters or search terms.</p>
                </div>
            )}
        </div>
    );
}
