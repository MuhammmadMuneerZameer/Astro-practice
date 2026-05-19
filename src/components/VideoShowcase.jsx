import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MuxPlayer from '@mux/mux-player-react';

// ─────────────────────────────────────────────
// Add your Mux playback IDs here.
// Upload at dashboard.mux.com → Assets → Create new asset.
// thumbnailTime: which second of the video to use as poster image.
// ─────────────────────────────────────────────
const VIDEO_REELS = [
  {
    id: 1,
    playbackId: 'qPsZ023qdZS9154AE7400tJ7IELSw4pWrZ01qnpLgiiCUU',
    title: 'Video Edit — Project 1',
    category: 'Video Editing',
    description: '',
    thumbnailTime: 0,
  },
  {
    id: 2,
    playbackId: 'SQ2BcMddg6q4XyJtvh2egllgMS2XH5guZG9AXazLrac',
    title: 'Video Edit — Project 2',
    category: 'Video Editing',
    description: '',
    thumbnailTime: 0,
  },
  {
    id: 3,
    playbackId: 'b1yD01MblIcQpuZmSBLSaro5Wl6o3WGYrDJ8TJkRNN1s',
    title: 'Video Edit — Project 3',
    category: 'Video Editing',
    description: '',
    thumbnailTime: 0,
  },
  {
    id: 4,
    playbackId: '3l2qJd5RYA8uNDw02JU6007QxZccCvmkwN8XDqOOwcmQk',
    title: 'Social Reel - Project 4',
    category: 'Social Reels',
    description: '',
    thumbnailTime: 0,
  },
  {
    id: 5,
    playbackId: '5Uw6Ksq402CPT02XTySPQTbw58MEJnTPJGmTRWtJnixLQ',
    title: 'Social Reel - Project 5',
    category: 'Social Reels',
    description: '',
    thumbnailTime: 0,
  },
];

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
      {/* Thumbnail */}
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

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Play button — centre */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="transform scale-90 group-hover:scale-100 transition-transform duration-300">
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden="true">
              <circle cx="28" cy="28" r="27" stroke="#00f19f" strokeWidth="1.5" />
              <path d="M23 19.5L37 28L23 36.5V19.5Z" fill="#00f19f" />
            </svg>
          </div>
        </div>

        {/* Category badge */}
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium tracking-wide bg-black/60 text-[#00f19f] border border-[#00f19f]/30 backdrop-blur-sm">
          {video.category}
        </span>
      </div>

      {/* Card footer */}
      <div className="p-5 flex items-center justify-between gap-3">
        <h3 className="font-heading text-lg text-white group-hover:text-[#00f19f] transition-colors duration-200 leading-snug">
          {video.title}
        </h3>
        <div className="flex-shrink-0 w-8 h-8 rounded-full border border-white/20 group-hover:border-[#00f19f] group-hover:bg-[#00f19f] flex items-center justify-center transition-all duration-300">
          <svg
            className="w-3.5 h-3.5 text-white group-hover:text-black transition-colors duration-300"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
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

function VideoModal({ video, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.93, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.93, opacity: 0, y: 16 }}
        transition={{ duration: 0.28, ease: [0.19, 1, 0.22, 1] }}
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
          <button
            onClick={onClose}
            aria-label="Close video"
            className="ml-4 mt-1 p-2 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00f19f]"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M14 4L4 14M4 4l10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Player */}
        <div className="rounded-2xl overflow-hidden border border-white/10" style={{ aspectRatio: '16/9' }}>
          <MuxPlayer
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

        <p className="mt-4 text-xs text-white/20 text-center">Esc or click outside to close</p>
      </motion.div>
    </motion.div>
  );
}

export default function VideoShowcase() {
  const [active, setActive] = useState(null);

  return (
    <section aria-label="Video showcase">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {VIDEO_REELS.map((video, index) => (
          <VideoCard
            key={video.id}
            video={video}
            index={index}
            onClick={() => setActive(video)}
          />
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <VideoModal video={active} onClose={() => setActive(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
