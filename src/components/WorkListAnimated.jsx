import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StudyListShell from './StudyListShell';

const BIA_EASE = [0.45, 0.02, 0.09, 0.98];
const CUBIC_OUT = [0.215, 0.61, 0.355, 1];

const FILTERS = [
    { id: 'all',                     label: 'All' },
    { id: 'ecommerce-growth',        label: 'Ecommerce Growth' },
    { id: 'store-design-build',      label: 'Store Design' },
    { id: 'growth-tools-automation', label: 'Growth Tools' },
    { id: 'brand-content',           label: 'Brand & Content' },
];

// ── Crossfade image panel ──────────────────────────────────────────────────────
function SlotImage({ slot, active }) {
    const [errored, setErrored] = useState(false);
    useEffect(() => { setErrored(false); }, [slot.image]);
    if (!slot.image || errored) return null;
    return (
        <img
            src={slot.image}
            alt={slot.title || ''}
            onError={() => setErrored(true)}
            width="1200"
            height="675"
            style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: active ? 1 : 0,
                transform: active ? 'scale(1)' : 'scale(1.04)',
                transition: 'opacity 0.65s cubic-bezier(0.45,0.02,0.09,0.98), transform 0.65s cubic-bezier(0.45,0.02,0.09,0.98)',
            }}
        />
    );
}

function StickyImagePanel({ studies, activeIndex }) {
    const safeIndex = Math.min(activeIndex, studies.length - 1);
    const [slotA, setSlotA] = useState({ ...studies[safeIndex], active: true });
    const [slotB, setSlotB] = useState({ active: false });
    const useA = useRef(true);

    useEffect(() => {
        const study = studies[safeIndex];
        if (!study) return;
        if (useA.current) {
            setSlotA({ ...study, active: true });
            setSlotB(prev => ({ ...prev, active: false }));
        } else {
            setSlotB({ ...study, active: true });
            setSlotA(prev => ({ ...prev, active: false }));
        }
        useA.current = !useA.current;
    }, [safeIndex]);

    const activeStudy = slotA.active ? slotA : slotB;

    return (
        <div className="relative w-full h-full overflow-hidden bg-gray-950">
            <SlotImage slot={slotA} active={slotA.active} />
            <SlotImage slot={slotB} active={slotB.active} />
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-gray-800 text-6xl font-heading font-bold tabular-nums select-none">
                    {String(safeIndex + 1).padStart(2, '0')}
                </span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
            <AnimatePresence mode="wait">
                <motion.div
                    key={safeIndex}
                    className="absolute bottom-10 left-10 right-10"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.5, ease: BIA_EASE }}
                >
                    {activeStudy?.service && (
                        <p className="text-[#00f19f] text-xs font-bold tracking-[0.2em] uppercase mb-3">
                            {activeStudy.service.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                        </p>
                    )}
                    {activeStudy?.title && (
                        <h3 className="text-white font-heading font-bold text-3xl md:text-4xl leading-tight">
                            {activeStudy.title}
                        </h3>
                    )}
                    {activeStudy?.client && (
                        <p className="text-gray-400 text-sm mt-2">{activeStudy.client}</p>
                    )}
                    {activeStudy?.revenueImpact && (
                        <span className="inline-flex mt-4 px-3 py-1 bg-[#00f19f]/10 border border-[#00f19f]/30 text-[#00f19f] text-xs font-bold rounded-full uppercase tracking-wider">
                            {activeStudy.revenueImpact}
                        </span>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

function WorkRow({ study, index, isActive, onHover }) {
    const num = String(index + 1).padStart(2, '0');
    return (
        <motion.a
            href={`/case-studies/${study.slug}`}
            className={`group flex items-center gap-4 md:gap-8 py-7 md:py-8 border-b transition-colors duration-300 relative cursor-pointer no-underline ${
                isActive ? 'border-white/30' : 'border-white/10 hover:border-white/30'
            }`}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: index * 0.07, ease: CUBIC_OUT }}
            onMouseEnter={() => onHover(index)}
        >
            <span className={`text-xs font-mono w-7 flex-shrink-0 transition-all duration-300 select-none ${
                isActive ? 'text-[#00f19f]' : 'text-gray-700 group-hover:text-gray-500'
            }`}>
                {num}
            </span>
            <div className="flex-1 min-w-0">
                <motion.h2
                    className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold leading-tight truncate transition-colors duration-300 ${
                        isActive ? 'text-[#00f19f]' : 'text-white group-hover:text-[#00f19f]'
                    }`}
                    animate={{ x: isActive ? 16 : 0 }}
                    transition={{ duration: 0.45, ease: BIA_EASE }}
                >
                    {study.title}
                </motion.h2>
                {study.client && (
                    <p className="text-gray-600 text-sm mt-1 hidden sm:block">{study.client}</p>
                )}
            </div>
            {study.service && (
                <span className="hidden lg:flex ml-auto mr-6 px-3 py-1 border border-white/10 rounded-full text-xs text-gray-500 whitespace-nowrap flex-shrink-0">
                    {study.service.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                </span>
            )}
            {study.revenueImpact && (
                <span className="hidden md:flex px-3 py-1 bg-[#00f19f]/10 border border-[#00f19f]/20 text-[#00f19f] text-xs font-bold rounded-full uppercase tracking-wider whitespace-nowrap flex-shrink-0">
                    {study.revenueImpact}
                </span>
            )}
            <motion.span
                className={`w-9 h-9 md:w-11 md:h-11 rounded-full border flex items-center justify-center transition-all duration-300 flex-shrink-0 text-base ${
                    isActive
                        ? 'border-[#00f19f] bg-[#00f19f] text-black'
                        : 'border-white/20 text-gray-500 group-hover:border-[#00f19f] group-hover:bg-[#00f19f] group-hover:text-black'
                }`}
                animate={{ rotate: isActive ? 0 : -45 }}
                transition={{ duration: 0.35, ease: BIA_EASE }}
            >
                ↗
            </motion.span>
        </motion.a>
    );
}

export default function WorkListAnimated({ initialCaseStudies = [] }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 1024);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    return (
        <StudyListShell
            filters={FILTERS}
            initialItems={initialCaseStudies}
            renderList={({ filteredItems, activeFilter, searchQuery, setActiveFilter, setSearchQuery }) => {
                // Reset active index when filter/search changes — tracked via key on inner component
                return filteredItems.length > 0 ? (
                    <div className="max-w-7xl mx-auto px-4 md:px-8 pb-32">
                        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start">
                            {/* Sticky image panel (desktop only) */}
                            <div className="hidden lg:block sticky top-24 h-[calc(100vh-8rem)] rounded-2xl overflow-hidden">
                                <StickyImagePanel
                                    studies={filteredItems}
                                    activeIndex={Math.min(activeIndex, filteredItems.length - 1)}
                                />
                            </div>

                            {/* Scrollable list */}
                            <div>
                                <div className="border-t border-white/10 mb-0" />
                                <motion.p
                                    key={filteredItems.length}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-gray-600 text-xs font-mono py-4"
                                >
                                    {filteredItems.length} project{filteredItems.length !== 1 ? 's' : ''}
                                </motion.p>
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeFilter + searchQuery}
                                        onAnimationStart={() => setActiveIndex(0)}
                                    >
                                        {filteredItems.map((study, i) => (
                                            <WorkRow
                                                key={study.id || study.slug}
                                                study={study}
                                                index={i}
                                                isActive={i === activeIndex}
                                                onHover={setActiveIndex}
                                            />
                                        ))}
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="py-32 text-center"
                    >
                        <p className="text-gray-500 text-lg">No projects found.</p>
                        <button
                            onClick={() => { setActiveFilter('all'); setSearchQuery(''); }}
                            className="mt-4 text-[#00f19f] text-sm hover:underline"
                        >
                            Clear filters
                        </button>
                    </motion.div>
                );
            }}
        />
    );
}
