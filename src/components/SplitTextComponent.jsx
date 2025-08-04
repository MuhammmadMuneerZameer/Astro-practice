import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import SplitText from '../plugins/SplitText'; // Make sure the path is correct
import '../styles/global.css';

gsap.registerPlugin(SplitText);

export default function SplitTextComponent() {
  const textRef = useRef();

  useEffect(() => {
    if (!textRef.current) return;

    // Split only this specific header element
    const split = new SplitText(textRef.current, {
      type: 'chars, words',
    });

    gsap.from(split.chars, {
      opacity: 0,
      y: 20,
      stagger: 0.05,
      duration: 1,
      ease: 'power2.out',
    });
  }, []);

  return (
    <div>
      <h1
        ref={textRef}
        className="text-4xl md:text-6xl font-bold mb-4"
        style={{ color: 'var(--color-accent)' }}
      >
        Welcome to Hydra Fox Designs
      </h1>
      <p
        className="text-lg md:text-2xl mb-6"
        style={{ color: 'var(--color-text)' }}
      >
        Build fast, modern websites with ease. Start your next project today!
      </p>
    </div>
  );
}
