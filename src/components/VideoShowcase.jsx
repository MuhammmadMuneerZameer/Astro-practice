import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MuxPlayer from '@mux/mux-player-react';

const VIDEO_REELS = [
  {
    id: 1,
    published: true,
    playbackId: 'qPsZ023qdZS9154AE7400tJ7IELSw4pWrZ01qnpLgiiCUU',
    title: 'Video Edit — Project 1',
    category: 'Video Editing',
    description: '',
    thumbnailTime: 0,
  },
  {
    id: 2,
    published: true,
    playbackId: 'SQ2BcMddg6q4XyJtvh2egllgMS2XH5guZG9AXazLrac',
    title: 'Video Edit — Project 2',
    category: 'Video Editing',
    description: '',
    thumbnailTime: 0,
  },
  {
    id: 3,
    published: true,
    playbackId: 'b1yD01MblIcQpuZmSBLSaro5Wl6o3WGYrDJ8TJkRNN1s',
    title: 'Video Edit — Project 3',
    category: 'Video Editing',
    description: '',
    thumbnailTime: 0,
  },
  {
    id: 4,
    published: true,
    playbackId: '3l2qJd5RYA8uNDw02JU6007QxZccCvmkwN8XDqOOwcmQk',
    title: 'Social Reel — Project 4',
    category: 'Social Reels',
    description: '',
    thumbnailTime: 0,
  },
  {
    id: 5,
    published: true,
    playbackId: '5Uw6Ksq402CPT02XTySPQTbw58MEJnTPJGmTRWtJnixLQ',
    title: 'Social Reel — Project 5',
    category: 'Social Reels',
    description: '',
    thumbnailTime: 0,
  },
];

const PUBLISHED = VIDEO_REELS.filter((v) => v.published);

function VideoCard({ video, index, onClick }) {
  const thumbUrl = `https://image.mux.com/${video.playbackId}/thumbnail.webp?width=640&height=360&time=${video.thumbnailTime ?? 0}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.215, 0.61, 0.355, 1] }}
      onClick={onClick}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
      role="button"
      tabIndex={0}
      aria-label={`Play ${video.title}`}
      className="group relative cursor-pointer rounded-2xl overflow-hidden border border-white/10 bg-[var(--color-card)] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00f19f] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      whileHover={{
        y: -8,
        borderColor: 'rgba(0,241,159,0.4)',
        boxShadow: '0 20px 40px rgba(0,241,159,0.12)',
      }}
    >
      <div className="relative aspect-video overflow-hidden bg-[#0f172a]">
        <img
          src={thumbUrl}
          alt=""
          width={640}
          height={360}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 group-hover:brightness-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="transform scale-90 group-hover:scale-100 transition-transform duration-300">
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden="true">
              <circle cx="28" cy="28" r="27" stroke="#00f19f" strokeWidth="1.5" />
              <path d="M23 19.5L37 28L23 36.5V19.5Z" fill="#00f19f" />
            </svg>
          </div>
        </div>
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium tracking-wide bg-black/60 text-[#00f19f] border border-[#00f19f]/30 backdrop-blur-sm">
          {video.category}
        </span>
      </div>

      <div className="p-5 flex items-center justify-between gap-3">
        <h3 className="font-heading text-lg text-white group-hover:text-[#00f19f] transition-colors duration-200 leading-snug">
          {video.title}
        </h3>
        <div className="flex-shrink-0 w-8 h-8 rounded-full border border-white/20 group-hover:border-[#00f19f] group-hover:bg-[#00f19f] flex items-center justify-center transition-all duration-300">
          <svg className="w-3.5 h-3.5 text-white group-hover:text-black transition-colors duration-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      {video.description && (
        <p className="px-5 pb-5 -mt-1 text-sm text-[var(--color-subtext)] leading-relaxed">
          {video.description}
        </p>
      )}
    </motion.article>
  );
}

function VideoModal({ videos, activeIndex, onClose, onNav }) {
  const video = videos[activeIndex];
  const hasPrev = activeIndex > 0;
  const hasNext = activeIndex < videos.length - 1;

  const handleKey = useCallback((e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft' && hasPrev) onNav(activeIndex - 1);
    if (e.key === 'ArrowRight' && hasNext) onNav(activeIndex + 1);
  }, [onClose, onNav, activeIndex, hasPrev, hasNext]);

  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [handleKey]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Prev arrow */}
      <button
        onClick={(e) => { e.stopPropagation(); onNav(activeIndex - 1); }}
        disabled={!hasPrev}
        aria-label="Previous video"
        className="absolute left-3 sm:left-6 z-10 w-10 h-10 rounded-full border border-white/20 hover:border-[#00f19f] hover:bg-[#00f19f] flex items-center justify-center transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:border-white/20 disabled:hover:bg-transparent"
      >
        <svg className="w-4 h-4 text-white hover:text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Next arrow */}
      <button
        onClick={(e) => { e.stopPropagation(); onNav(activeIndex + 1); }}
        disabled={!hasNext}
        aria-label="Next video"
        className="absolute right-3 sm:right-6 z-10 w-10 h-10 rounded-full border border-white/20 hover:border-[#00f19f] hover:bg-[#00f19f] flex items-center justify-center transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:border-white/20 disabled:hover:bg-transparent"
      >
        <svg className="w-4 h-4 text-white hover:text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>

      <motion.div
        key={video.id}
        initial={{ scale: 0.95, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 12 }}
        transition={{ duration: 0.25, ease: [0.19, 1, 0.22, 1] }}
        className="relative w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-xs font-medium tracking-widest uppercase text-[#00f19f]">
              {video.category}
            </span>
            <h2 className="font-heading text-xl sm:text-2xl text-white mt-1 leading-snug">
              {video.title}
            </h2>
          </div>
          <div className="flex items-center gap-4 ml-4 mt-1">
            {/* Counter */}
            <span className="text-xs font-mono text-white/30">
              {activeIndex + 1} / {videos.length}
            </span>
            <button
              onClick={onClose}
              aria-label="Close video"
              className="p-2 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00f19f]"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M14 4L4 14M4 4l10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Player */}
        <div className="rounded-2xl overflow-hidden border border-white/10" style={{ aspectRatio: '16/9' }}>
          <MuxPlayer
            key={video.playbackId}
            playbackId={video.playbackId}
            streamType="on-demand"
            autoPlay
            style={{
              width: '100%',
              height: '100%',
              '--controls': 'flex',
              '--media-object-fit': 'contain',
            }}
          />
        </div>

        {video.description && (
          <p className="mt-4 text-sm text-[var(--color-subtext)] leading-relaxed max-w-2xl">
            {video.description}
          </p>
        )}

        {/* Dot indicators */}
        <div className="flex items-center justify-center gap-2 mt-5">
          {videos.map((v, i) => (
            <button
              key={v.id}
              onClick={() => onNav(i)}
              aria-label={`Go to ${v.title}`}
              className={`transition-all duration-200 rounded-full ${
                i === activeIndex
                  ? 'w-5 h-1.5 bg-[#00f19f]'
                  : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/50'
              }`}
            />
          ))}
        </div>

        <p className="mt-3 text-xs text-white/20 text-center">← → to navigate · Esc to close</p>
      </motion.div>
    </motion.div>
  );
}

export default function VideoShowcase() {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <section aria-label="Video showcase">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {PUBLISHED.map((video, index) => (
          <VideoCard
            key={video.id}
            video={video}
            index={index}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>

      <AnimatePresence>
        {activeIndex !== null && (
          <VideoModal
            videos={PUBLISHED}
            activeIndex={activeIndex}
            onClose={() => setActiveIndex(null)}
            onNav={(i) => setActiveIndex(i)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
