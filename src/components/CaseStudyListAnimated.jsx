import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Easing curves from camillemormal.com
const EXPO_OUT = [0.19, 1, 0.22, 1];
const CUBIC_OUT = [0.215, 0.61, 0.355, 1];

const FILTERS = [
  { id: 'all', label: 'All Projects' },
  { id: 'ux-ui-design', label: 'UX/UI Design' },
  { id: 'web-development', label: 'Web Development' },
  { id: 'mobile-app', label: 'Mobile App' },
  { id: 'branding', label: 'Branding' },
  { id: 'digital-marketing', label: 'Digital Marketing' },
];

// ─── Individual row ────────────────────────────────────────────────────────────
function CaseStudyRow({ study, index, onHover, isFiltered }) {
  const num = String(index + 1).padStart(2, '0');

  return (
    <motion.a
      href={`/case-studies/${study.slug}`}
      className="group flex items-center gap-4 md:gap-8 py-6 md:py-8 border-b border-white/10 hover:border-white/30 transition-colors duration-300 relative cursor-pointer no-underline"
      // Staggered entrance
      initial={{ opacity: 0, y: 40 }}
      animate={isFiltered ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: CUBIC_OUT }}
      onMouseEnter={() => onHover(study)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Index number */}
      <span className="text-gray-600 text-xs font-mono w-7 flex-shrink-0 group-hover:opacity-30 transition-opacity duration-200 select-none">
        {num}
      </span>

      {/* Title + client */}
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

      {/* Service tag — hidden on small screens */}
      {study.service && (
        <span className="hidden lg:flex ml-auto mr-6 px-3 py-1 border border-white/20 rounded-full text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
          {study.service.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
        </span>
      )}

      {/* Revenue impact badge */}
      {study.revenueImpact && (
        <span className="hidden md:flex px-3 py-1 bg-[#00f19f]/10 border border-[#00f19f]/20 text-[#00f19f] text-xs font-bold rounded-full uppercase tracking-wider whitespace-nowrap flex-shrink-0">
          {study.revenueImpact}
        </span>
      )}

      {/* Arrow */}
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

// ─── Main component ────────────────────────────────────────────────────────────
export default function CaseStudyListAnimated({ initialCaseStudies = [] }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewStudy, setPreviewStudy] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const previewRef = useRef(null);
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const curX = useRef(0);
  const curY = useRef(0);
  const rafId = useRef(null);

  // ── Detect mobile ──────────────────────────────────────────────────────────
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // ── Read URL filter param ──────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const sp = params.get('service');
    if (sp && FILTERS.some(f => f.id === sp)) setActiveFilter(sp);
  }, []);

  // ── Cursor-following preview (desktop only) ────────────────────────────────
  useEffect(() => {
    if (isMobile) return;

    const onMove = (e) => {
      mouseX.current = e.clientX;
      mouseY.current = e.clientY;
    };
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

  // ── Filtering ──────────────────────────────────────────────────────────────
  const filteredStudies = useMemo(() => {
    return initialCaseStudies.filter(study => {
      const studyServices = Array.isArray(study.services)
        ? study.services
        : [study.service];
      const matchesFilter =
        activeFilter === 'all' ||
        studyServices.includes(activeFilter) ||
        study.service === activeFilter;
      const matchesSearch =
        study.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (study.client || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchQuery, initialCaseStudies]);

  return (
    <div className="min-h-screen bg-black text-white">

      {/* ── Filter + Search bar ─────────────────────────────────────────────── */}
      <div className="sticky top-4 z-40 px-4 md:px-8 mb-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 justify-between items-center bg-black/80 backdrop-blur-xl p-4 rounded-2xl border border-gray-800">

          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-hide">
            {FILTERS.map(filter => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeFilter === filter.id
                    ? 'bg-[#00f19f] text-black shadow-[0_0_20px_rgba(0,241,159,0.4)]'
                    : 'bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-5 py-2.5 bg-gray-900 border border-gray-800 rounded-full text-white text-sm focus:outline-none focus:border-[#00f19f] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* ── Project list ────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-32">

        {/* Top border */}
        <div className="border-t border-white/10 mb-0" />

        {/* Row count */}
        <motion.p
          key={filteredStudies.length}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-600 text-xs font-mono py-4"
        >
          {filteredStudies.length} project{filteredStudies.length !== 1 ? 's' : ''}
        </motion.p>

        {/* Rows */}
        <AnimatePresence mode="wait">
          {filteredStudies.length > 0 ? (
            <motion.div key={activeFilter + searchQuery}>
              {filteredStudies.map((study, i) => (
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

      {/* ── Cursor-following preview (desktop only) ─────────────────────────── */}
      {!isMobile && (
        <div
          ref={previewRef}
          className="fixed top-0 left-0 pointer-events-none z-50 w-[300px] rounded-xl overflow-hidden shadow-2xl transition-[opacity,scale] duration-200"
          style={{
            opacity: previewStudy ? 1 : 0,
            scale: previewStudy ? 1 : 0.85,
          }}
        >
          {previewStudy?.image && (
            <img
              src={previewStudy.image}
              alt={previewStudy.title}
              className="w-full aspect-[4/3] object-cover block"
            />
          )}
          {/* Overlay with title */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          {previewStudy && (
            <div className="absolute bottom-3 left-3 right-3">
              <p className="text-white text-xs font-bold truncate">{previewStudy.title}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
