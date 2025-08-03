import { useEffect, useRef } from 'react';
import gsap from 'gsap';
// Adjust path to your downloaded plugin
import SplitText from '../plugins/SplitText'; 

// Register plugin
gsap.registerPlugin(SplitText);

export default function SplitTextComponent() {
  const textRef = useRef();

  useEffect(() => {
    const split = new SplitText('.hello', {
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

  return <h1  className='hello'>Hello from SplitText</h1>;
}
