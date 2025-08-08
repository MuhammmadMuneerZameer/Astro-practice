import React from "react";
import { useState } from "react";
import "../styles/global.css";

const testimonials = [
  {
    name: "Ayesha Khan",
    role: "CEO, TechNova",
    text: "HydraFox Design exceeded our expectations! Their team delivered a stunning website and branding that truly represents our company.",
  },
  {
    name: "Ali Raza",
    role: "Marketing Lead, BrightAds",
    text: "Professional, creative, and always on time. Our digital marketing results have improved dramatically since working with them.",
  },
  {
    name: "Sara Malik",
    role: "Founder, Craftify",
    text: "The best agency experience we've had. They listened to our needs and delivered a beautiful, functional site.",
  },
];

export default function TestimonialSection() {
  const [current, setCurrent] = useState(0);

  function prev() {
    setCurrent((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  }

  function next() {
    setCurrent((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  }

  return (
    <section className="py-12 px-4 overflow-x-hidden bg-[url(/images/texture.jpg)] bg-[var(--color-card)] bg-blend-multiply ">
      <div className="max-w-3xl mx-auto text-center ">
        <h2 className="text-3xl pt-4 md:text-4xl font-bold mb-8" style={{color: "var(--color-subtext)"}}>
          What Our Clients Say
        </h2>
        <div className="relative">
          <div className=" shadow-lg  transition-all duration-500 p-8 rounded-lg bg-gradient-to-r from-black to-gray-800  min-h-[220px]">
            <p className="text-lg mb-4 text-gray-300 dark:text-gray-300">
              "{testimonials[current].text}"
            </p>
            <div className="font-semibold text-xl mb-1 text-green-300">
              {testimonials[current].name}
            </div>
            <div className="text-sm text-gray-400">
              {testimonials[current].role}
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-6">
            <button
              className="w-10 h-10 flex items-center justify-center rounded-full bg-green-300 text-gray-800 hover:bg-green-400"
              onClick={prev}
              aria-label="Previous testimonial"
            >
              ←
            </button>
            <button
              className="w-10 h-10 flex items-center justify-center rounded-full bg-green-300 text-gray-800 hover:bg-green-400"
              onClick={next}
              aria-label="Next testimonial"
            >
              →
            </button>
          </div>
          <div className="flex justify-center gap-2 mt-4">
            {testimonials.map((_, idx) => (
              <span
                key={idx}
                className={`inline-block w-3 h-3 rounded-full transition cursor-pointer ${
                  idx === current 
                    ? 'bg-green-300' 
                    : 'bg-gray-400 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
                onClick={() => setCurrent(idx)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}