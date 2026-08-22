import React from "react";
import { motion } from "framer-motion";

const CUBIC_OUT = [0.215, 0.61, 0.355, 1];

const testimonials = [
  {
    initials: "SA",
    userName: "Saifullah Asif",
    userRole: "Logo Design Client",
    location: "Facebook Recommendation · Oct 2023",
    quote:
      "Absolutely thrilled with the logo design I received from this page on Facebook! It perfectly captured my vision and was delivered promptly. Highly recommended.",
  },
  {
    initials: "GY",
    userName: "Grace Younger",
    userRole: "Founder, Clothing Brand",
    location: "United States",
    quote:
      "Hydra Fox took my clothing brand from a blank page to a full identity — completely from scratch. Couldn't be more satisfied with the entire process.",
  },
];

function TestimonialCard({ initials, userName, userRole, location, quote, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: CUBIC_OUT }}
      className="group bg-black border border-white/10 hover:border-white/25 rounded-2xl p-7 flex flex-col gap-6 transition-colors duration-300"
    >
      <span className="text-[#00f19f] text-4xl font-heading font-bold leading-none select-none">"</span>

      <p className="text-gray-300 text-base leading-relaxed flex-1">{quote}</p>

      <div className="border-t border-white/10" />

      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-full bg-[#00f19f]/15 border border-[#00f19f]/30 flex-shrink-0 flex items-center justify-center">
          <span className="text-[#00f19f] text-xs font-bold tracking-wider">{initials}</span>
        </div>
        <div>
          <p className="text-white text-sm font-semibold leading-tight">{userName}</p>
          <p className="text-[#00f19f] text-[10px] font-bold tracking-[0.15em] uppercase mt-0.5">{userRole}</p>
          <p className="text-gray-600 text-[10px] mt-0.5">{location}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function TestimonialSection() {
  return (
    <section className="bg-black border-t border-white/10 py-24 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-6">
          <div>
            <p className="text-[#00f19f] text-xs font-bold tracking-[0.2em] uppercase mb-4">
              Client Stories
            </p>
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-heading font-bold text-white leading-none">
              What our clients say.
            </h2>
          </div>
          <p className="text-gray-500 text-sm max-w-xs sm:text-right leading-relaxed">
            Verified feedback from real clients.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5 max-w-3xl">
          {testimonials.map((t, i) => (
            <TestimonialCard key={i} {...t} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
}
