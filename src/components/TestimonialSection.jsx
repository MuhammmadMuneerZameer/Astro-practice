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

  // Auto-advance testimonials
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === 2 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  function goToSlide(index) {
    setCurrent(index);
  }

  return (
    <section className="testimonials-section bg-black py-12 md:py-20 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-green-300">
          What Our Clients Say
        </h2>

        <div className="testimonial-slider overflow-hidden relative">
          <div
            className="testimonial-track flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            <div className="testimonial-slide flex-shrink-0 w-full px-2 md:px-4">
              <div className="bg-[#1a1a1a] p-4 md:p-6 rounded-xl max-w-2xl mx-auto">
                <div className="flex text-green-500 mb-3 md:mb-4">
                  ⭐⭐⭐⭐⭐
                </div>
                <p className="text-gray-300 mb-4 md:mb-6 text-base md:text-lg italic">
                  "The team completely transformed our startup's brand. The work helped us secure $2M in Series A funding."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-green-500 rounded-full flex items-center justify-center mr-3 md:mr-4">
                    <span className="font-bold text-black">SJ</span>
                  </div>
                  <div>
                    <p className="font-bold text-white">Sarah Johnson</p>
                    <p className="text-gray-400">CEO, TechStart Inc.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="testimonial-slide flex-shrink-0 w-full px-2 md:px-4">
              <div className="bg-[#1a1a1a] p-4 md:p-6 rounded-xl max-w-2xl mx-auto">
                <div className="flex text-green-500 mb-3 md:mb-4">
                  ⭐⭐⭐⭐⭐
                </div>
                <p className="text-gray-300 mb-4 md:mb-6 text-base md:text-lg italic">
                  "Working with this team was amazing. They understood our vision and created a brand that truly represents who we are."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-green-500 rounded-full flex items-center justify-center mr-3 md:mr-4">
                    <span className="font-bold text-black">MR</span>
                  </div>
                  <div>
                    <p className="font-bold text-white">Mike Rodriguez</p>
                    <p className="text-gray-400">Founder, Digital Dynamics</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="testimonial-slide flex-shrink-0 w-full px-2 md:px-4">
              <div className="bg-[#1a1a1a] p-4 md:p-6 rounded-xl max-w-2xl mx-auto">
                <div className="flex text-green-500 mb-3 md:mb-4">
                  ⭐⭐⭐⭐⭐
                </div>
                <p className="text-gray-300 mb-4 md:mb-6 text-base md:text-lg italic">
                  "The attention to detail and creative approach exceeded our expectations. Our conversion rates improved by 300%!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-green-500 rounded-full flex items-center justify-center mr-3 md:mr-4">
                    <span className="font-bold text-black">AL</span>
                  </div>
                  <div>
                    <p className="font-bold text-white">Alex Liu</p>
                    <p className="text-gray-400">CTO, InnovateNow</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-6 md:mt-8 space-x-2">
            {[0, 1, 2].map((idx) => (
              <button
                key={idx}
                className={`testimonial-dot w-2.5 h-2.5 md:w-3 md:h-3 rounded-full ${current === idx ? "bg-green-500" : "bg-gray-600"}`}
                data-slide={idx}
                onClick={() => goToSlide(idx)}
                aria-label={`Go to testimonial ${idx + 1}`}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}