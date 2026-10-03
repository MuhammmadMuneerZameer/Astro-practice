import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StudyListShell from './StudyListShell';

const EXPO_OUT = [0.19, 1, 0.22, 1];
const CUBIC_OUT = [0.215, 0.61, 0.355, 1];

const FILTERS = [
    { id: 'all',              label: 'All Projects' },
    { id: 'ux-ui-design',    label: 'UX/UI Design' },
    { id: 'web-development', label: 'Web Development' },
    { id: 'mobile-app',      label: 'Mobile App' },
    { id: 'branding',        label: 'Branding' },
    { id: 'digital-marketing', label: 'Digital Marketing' },
];

function CaseStudyRow({ study, index, onHover, isFiltered }) {
    const num = String(index + 1).padStart(2, '0');

    return (
        <motion.a
            href={`/case-studies/${study.slug}/`}
            className="group flex items-center gap-4 md:gap-8 py-6 md:py-8 border-b border-white/10 hover:border-white/30 transition-colors duration-300 relative cursor-pointer no-underline"
            initial={{ opacity: 0, y: 40 }}
            animate={isFiltered ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: index * 0.08, ease: CUBIC_OUT }}
            onMouseEnter={() => onHover(study)}
            onMouseLeave={() => onHover(null)}
        >
            <span className="text-gray-600 text-xs font-mono w-7 flex-shrink-0 group-hover:opacity-30 transition-opacity duration-200 select-none">
                {num}
            </span>
            <div className="flex-1 min-w-0">
                <motion.h2
                    className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-heading font-bold text-white group-hover:text-[#00f19f] transition-colors duration-300 leading-tight truncate"
                    whileHover={{ x: 20 }}
                    transition={{ duration: 0.35, ease: EXPO_OUT }}
                >
                    {study.title}
                </motion.h2>
                {study.client && (
                    <p className="text-gray-500 text-sm mt-1 hidden sm:block">{study.client}</p>
                )}
            </div>
            {study.service && (
                <span className="hidden lg:flex ml-auto mr-6 px-3 py-1 border border-white/20 rounded-full text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                    {study.service.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                </span>
            )}
            {study.revenueImpact && (
                <span className="hidden md:flex px-3 py-1 bg-[#00f19f]/10 border border-[#00f19f]/20 text-[#00f19f] text-xs font-bold rounded-full uppercase tracking-wider whitespace-nowrap flex-shrink-0">
                    {study.revenueImpact}
                </span>
            )}
            <motion.span
                className="w-9 h-9 md:w-11 md:h-11 rounded-full border border-white/20 flex items-center justify-center text-gray-400 group-hover:border-[#00f19f] group-hover:bg-[#00f19f] group-hover:text-black transition-all duration-300 flex-shrink-0 text-base"
                initial={{ rotate: -45 }}
                whileHover={{ rotate: 0 }}
                transition={{ duration: 0.3, ease: EXPO_OUT }}
            >
                ↗
            </motion.span>
        </motion.a>
    );
}

export default function CaseStudyListAnimated({ initialCaseStudies = [] }) {
    const [previewStudy, setPreviewStudy] = useState(null);
    const [isMobile, setIsMobile] = useState(false);

    const previewRef = useRef(null);
    const mouseX = useRef(0);
    const mouseY = useRef(0);
    const curX = useRef(0);
    const curY = useRef(0);
    const rafId = useRef(null);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 1024);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    useEffect(() => {
        if (isMobile) return;
        const onMove = (e) => { mouseX.current = e.clientX; mouseY.current = e.clientY; };
        window.addEventListener('mousemove', onMove);
        const loop = () => {
            curX.current += (mouseX.current - curX.current) * 0.12;
            curY.current += (mouseY.current - curY.current) * 0.12;
            if (previewRef.current) {
                previewRef.current.style.transform =
                    `translate(${curX.current}px, ${curY.current}px) translate(-50%, -60%)`;
            }
            rafId.current = requestAnimationFrame(loop);
        };
        rafId.current = requestAnimationFrame(loop);
        return () => {
            window.removeEventListener('mousemove', onMove);
            if (rafId.current) cancelAnimationFrame(rafId.current);
        };
    }, [isMobile]);

    return (
        <>
            <StudyListShell
                filters={FILTERS}
                initialItems={initialCaseStudies}
                renderList={({ filteredItems, activeFilter, searchQuery, setActiveFilter, setSearchQuery }) => (
                    <div className="max-w-7xl mx-auto px-4 md:px-8 pb-32">
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
                            {filteredItems.length > 0 ? (
                                <motion.div key={activeFilter + searchQuery}>
                                    {filteredItems.map((study, i) => (
                                        <CaseStudyRow
                                            key={study.id}
                                            study={study}
                                            index={i}
                                            onHover={isMobile ? () => {} : setPreviewStudy}
                                            isFiltered={false}
                                        />
                                    ))}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
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
                            )}
                        </AnimatePresence>
                    </div>
                )}
            />

            {/* Cursor-following preview (desktop only) */}
            {!isMobile && (
                <div
                    ref={previewRef}
                    className="fixed top-0 left-0 pointer-events-none z-50 w-[300px] rounded-xl overflow-hidden shadow-2xl transition-[opacity,scale] duration-200"
                    style={{ opacity: previewStudy ? 1 : 0, scale: previewStudy ? 1 : 0.85 }}
                >
                    {previewStudy?.image && (
                        <img
                            src={previewStudy.image}
                            alt={previewStudy.title}
                            className="w-full aspect-[4/3] object-cover block"
                            width="800"
                            height="600"
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    {previewStudy && (
                        <div className="absolute bottom-3 left-3 right-3">
                            <p className="text-white text-xs font-bold truncate">{previewStudy.title}</p>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
