import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// buildinamsterdam.com easing
const BIA_EASE = [0.45, 0.02, 0.09, 0.98];
const CUBIC_OUT = [0.215, 0.61, 0.355, 1];

const FILTERS = [
  { id: 'all',                     label: 'All' },
  { id: 'ecommerce-growth',        label: 'Ecommerce Growth' },
  { id: 'store-design-build',      label: 'Store Design' },
  { id: 'growth-tools-automation', label: 'Growth Tools' },
  { id: 'brand-content',           label: 'Brand & Content' },
];

// ─── Crossfade image panel ─────────────────────────────────────────────────────
// Two-slot approach: slot A and slot B alternate as "active" so both images
// are always in the DOM. The active slot fades in, the inactive fades out.
function SlotImage({ slot, active }) {
  const [errored, setErrored] = useState(false);

  // Reset error state when src changes
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

      {/* Fallback shown when no valid image loaded */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-gray-800 text-6xl font-heading font-bold tabular-nums select-none">
          {String(safeIndex + 1).padStart(2, '0')}
        </span>
      </div>

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

      {/* Metadata fades per active study */}
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

// ─── Individual row ────────────────────────────────────────────────────────────
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
      {/* Index */}
      <span className={`text-xs font-mono w-7 flex-shrink-0 transition-all duration-300 select-none ${
        isActive ? 'text-[#00f19f]' : 'text-gray-700 group-hover:text-gray-500'
      }`}>
        {num}
      </span>

      {/* Title + client */}
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

      {/* Service tag */}
      {study.service && (
        <span className="hidden lg:flex ml-auto mr-6 px-3 py-1 border border-white/10 rounded-full text-xs text-gray-500 whitespace-nowrap flex-shrink-0">
          {study.service.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
        </span>
      )}

      {/* Revenue badge */}
      {study.revenueImpact && (
        <span className="hidden md:flex px-3 py-1 bg-[#00f19f]/10 border border-[#00f19f]/20 text-[#00f19f] text-xs font-bold rounded-full uppercase tracking-wider whitespace-nowrap flex-shrink-0">
          {study.revenueImpact}
        </span>
      )}

      {/* Arrow */}
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

// ─── Main component ────────────────────────────────────────────────────────────
export default function WorkListAnimated({ initialCaseStudies = [] }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery]   = useState('');
  const [activeIndex, setActiveIndex]   = useState(0);
  const [isMobile, setIsMobile]         = useState(false);

  // Cursor-follow state (mobile fallback)
  const previewRef = useRef(null);
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const curX   = useRef(0);
  const curY   = useRef(0);
  const rafId  = useRef(null);
  const [previewStudy, setPreviewStudy] = useState(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Read URL filter param
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const sp = new URLSearchParams(window.location.search).get('service');
    if (sp && FILTERS.some(f => f.id === sp)) setActiveFilter(sp);
  }, []);

  // Mobile cursor-follow
  useEffect(() => {
    if (!isMobile) return;
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

  const filteredStudies = useMemo(() => {
    return initialCaseStudies.filter(study => {
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
  }, [activeFilter, searchQuery, initialCaseStudies]);

  // Reset active index when filter changes
  useEffect(() => { setActiveIndex(0); }, [activeFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-black text-white">

      {/* ── Filter + Search bar ───────────────────────────────────────────── */}
      <div className="sticky top-4 z-40 px-4 md:px-8 mb-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 justify-between items-center bg-black/80 backdrop-blur-xl p-4 rounded-2xl border border-white/10">
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-hide">
            {FILTERS.map(filter => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeFilter === filter.id
                    ? 'bg-[#00f19f] text-black shadow-[0_0_20px_rgba(0,241,159,0.35)]'
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

      {/* ── Split layout ─────────────────────────────────────────────────── */}
      {filteredStudies.length > 0 ? (
        <div className="max-w-7xl mx-auto px-4 md:px-8 pb-32">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start">

            {/* LEFT: Sticky image panel (desktop only) */}
            <div className="hidden lg:block sticky top-24 h-[calc(100vh-8rem)] rounded-2xl overflow-hidden">
              <StickyImagePanel
                studies={filteredStudies}
                activeIndex={Math.min(activeIndex, filteredStudies.length - 1)}
              />
            </div>

            {/* RIGHT: Scrollable list */}
            <div>
              {/* Top border + count */}
              <div className="border-t border-white/10 mb-0" />
              <motion.p
                key={filteredStudies.length}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-600 text-xs font-mono py-4"
              >
                {filteredStudies.length} project{filteredStudies.length !== 1 ? 's' : ''}
              </motion.p>

              <AnimatePresence mode="wait">
                <motion.div key={activeFilter + searchQuery}>
                  {filteredStudies.map((study, i) => (
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
      )}

      {/* ── Mobile cursor-follow preview ─────────────────────────────────── */}
      {isMobile && (
        <div
          ref={previewRef}
          className="fixed top-0 left-0 pointer-events-none z-50 w-[280px] rounded-xl overflow-hidden shadow-2xl transition-[opacity,scale] duration-200"
          style={{ opacity: previewStudy ? 1 : 0, scale: previewStudy ? 1 : 0.85 }}
        >
          {previewStudy?.image && (
            <img
              src={previewStudy.image}
              alt={previewStudy.title}
              className="w-full aspect-[4/3] object-cover block"
            />
          )}
        </div>
      )}

    </div>
  );
}
