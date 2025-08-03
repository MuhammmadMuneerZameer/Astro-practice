
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap'; 
import SplitText from '../plugins/SplitText';
gsap.registerPlugin(SplitText);
import '../styles/global.css';
 
 const Welcome = () => {
  useEffect(() => {
    const split = new SplitText('.header', { 
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
     <div
  class=" min-h-[100vh] flex flex-col items-center justify-center text-center px-4"
  style="
  background-image: url(images/bg.png); background-size: cover; background-position: center; background-repeat: no-repeat; background-attachment: fixed;"
>
  <h1 class="text-4xl md:text-6xl font-bold mb-4 header" style="color: var(--color-accent);">
    Welcome to Hydra Fox Designs
  </h1>
  <p class="text-lg md:text-2xl mb-6" style="color: var(--color-text);">
    Build fast, modern websites with ease. Start your next project today!
  </p>
 <a
  href="/contact"
  class="hero-button group relative inline-flex items-center justify-center px-6 py-3 text-white font-medium rounded-full  bg-black/80 backdrop-blur-sm shadow-md transition-all duration-300 overflow-hidden"
>
  <span class="relative z-10 flex items-center gap-2">
    Start a project
    <svg
      class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0"
      fill="none"
      stroke="currentColor"
      stroke-width={2}
      viewBox="0 0 24 24"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  </span>
  <span
    class="absolute inset-0 rounded-full bg-green-500 opacity-0 "
  ></span>
  <span
    class="absolute inset-0 rounded-full border border-green-400 opacity-0 group-hover:opacity-100 transition-all duration-500"
  ></span>
</a>

</div>
   )
 }
 
 export default Welcome


{/* <style>
  .hero-button{
    box-shadow: 0 4px 20px rgb(99, 253, 189);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
</style> */}