import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import SplitText from '../plugins/SplitText'; // Make sure the path is correct
import '../styles/global.css';

gsap.registerPlugin(SplitText);

export default function SplitTextComponent() {
  const textRef = useRef();
  const paragraphRef = useRef();

  useEffect(() => {
    if (!textRef.current || !paragraphRef.current) return;

    // Split the header element
    const headerSplit = new SplitText(textRef.current, {
      type: 'chars, words',
    });

    // Split the paragraph element
    const paragraphSplit = new SplitText(paragraphRef.current, {
      type: 'chars, words',
    });

    // Create a timeline for coordinated animations
    const tl = gsap.timeline();

    // Animate header chars
    tl.from(headerSplit.chars, {
      opacity: 0,
      y: 20,
      stagger: 0.05,
      duration: 1,
      ease: 'power2.out',
    })
    // Animate paragraph chars with a slight delay
    .from(paragraphSplit.chars, {
      opacity: 0,
      y: 15,
      stagger: 0.02,
      duration: 0.8,
      ease: 'power2.out',
    }, "-=0.5"); // Start 0.5 seconds before header animation ends

    // Cleanup function
    return () => {
      headerSplit.revert();
      paragraphSplit.revert();
    };
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
        ref={paragraphRef}
        className="text-lg md:text-2xl mb-6 text-gray-400"
      >
        Build fast, modern websites with ease. Start your next project today!
      </p>
    </div>
  );
}