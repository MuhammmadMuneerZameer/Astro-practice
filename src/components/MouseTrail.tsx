import { useEffect, useRef } from 'react';

const TRAIL_SIZE = 12;
const FADE_DURATION = 600;
const THROTTLE_MS = 80;

interface Props {
  images?: string[];
  className?: string;
}

export default function MouseTrail({ images = [], className = '' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);
  const indexRef = useRef(0);
  const lastDropRef = useRef(0);

  useEffect(() => {
    if (!images.length) return;
    const container = containerRef.current;
    if (!container) return;

    itemsRef.current = Array.from({ length: TRAIL_SIZE }, () => {
      const el = document.createElement('div');
      el.style.cssText = `
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        opacity: 0;
        will-change: transform, opacity;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 8px 32px rgba(0,0,0,0.45);
      `;
      const img = document.createElement('img');
      img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
      el.appendChild(img);
      document.body.appendChild(el);
      return el;
    });

    function drop(x: number, y: number) {
      const now = Date.now();
      if (now - lastDropRef.current < THROTTLE_MS) return;
      lastDropRef.current = now;

      const slot = indexRef.current % TRAIL_SIZE;
      indexRef.current++;

      const imgIndex = (indexRef.current - 1) % images.length;
      const el = itemsRef.current[slot];
      const img = el.querySelector('img') as HTMLImageElement;

      const size = 80 + Math.random() * 80;
      const tilt = (Math.random() - 0.5) * 24;

      img.src = images[imgIndex];
      el.style.width = `${size}px`;
      el.style.height = `${size * 0.7}px`;
      el.style.left = `${x - size / 2}px`;
      el.style.top = `${y - (size * 0.7) / 2}px`;
      el.style.transform = `rotate(${tilt}deg) scale(0.6)`;
      el.style.transition = 'none';
      el.style.opacity = '0';

      void el.offsetWidth;

      el.style.transition = `opacity 150ms ease, transform 150ms ease`;
      el.style.opacity = '1';
      el.style.transform = `rotate(${tilt}deg) scale(1)`;

      setTimeout(() => {
        el.style.transition = `opacity ${FADE_DURATION}ms ease, transform ${FADE_DURATION}ms ease`;
        el.style.opacity = '0';
        el.style.transform = `rotate(${tilt}deg) scale(0.85)`;
      }, 200);
    }

    function onMove(e: MouseEvent) {
      if ((e.target as Element).closest('nav, header')) return;
      drop(e.clientX, e.clientY);
    }

    window.addEventListener('mousemove', onMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMove);
      itemsRef.current.forEach(el => el.remove());
      itemsRef.current = [];
    };
  }, [images]);

  return <div ref={containerRef} className={className} aria-hidden="true" />;
}
