import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import '../styles/global.css';

export default function SplitTextComponent() {
  const textRef = useRef();
  const paragraphRef = useRef();

  useEffect(() => {
    if (!textRef.current || !paragraphRef.current) return;

    // Simple word/character split without plugin
    const splitText = (element) => {
      const text = element.innerText;
      const words = text.split(' ');
      element.innerHTML = '';
      
      words.forEach((word, wordIndex) => {
        const wordSpan = document.createElement('span');
        wordSpan.style.display = 'inline-block';
        wordSpan.style.overflow = 'visible'; // Changed to visible
        
        const chars = word.split('');
        chars.forEach((char) => {
          const charSpan = document.createElement('span');
          charSpan.innerText = char;
          charSpan.style.display = 'inline-block';
          wordSpan.appendChild(charSpan);
        });
        
        element.appendChild(wordSpan);
        
        // Add space after word (except last word)
        if (wordIndex < words.length - 1) {
          const space = document.createElement('span');
          space.innerHTML = '&nbsp;';
          space.style.display = 'inline-block';
          element.appendChild(space);
        }
      });
      
      return element.querySelectorAll('span span');
    };

    // Split the text
    const headerChars = splitText(textRef.current);
    const paragraphChars = splitText(paragraphRef.current);

    // Create animation timeline
    const tl = gsap.timeline();

    // Animate header chars
    tl.from(headerChars, {
      opacity: 0,
      y: 20,
      stagger: 0.05,
      duration: 1,
      ease: 'power2.out',
    })
    // Animate paragraph chars
    .from(paragraphChars, {
      opacity: 0,
      y: 15,
      stagger: 0.02,
      duration: 0.8,
      ease: 'power2.out',
    }, "-=0.5");

    // Cleanup
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div className="text-container" style={{ overflow: 'visible', width: '100%' }}>
      <h1
        ref={textRef}
        className="hero-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight"
        style={{ 
          color: 'var(--color-accent)',
          overflow: 'visible',
          wordWrap: 'break-word',
          whiteSpace: 'normal'
        }}
      >
        Welcome to Hydra Fox Designs
      </h1>
      <p
        ref={paragraphRef}
        className="hero-subtitle text-base sm:text-lg md:text-xl lg:text-2xl mb-6 text-gray-400 leading-relaxed"
        style={{ 
          overflow: 'visible',
          wordWrap: 'break-word',
          whiteSpace: 'normal'
        }}
      >
        Build fast, modern websites with ease. Start your next project today!
      </p>
    </div>
  );
}