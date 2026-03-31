import React from "react";
import { motion } from "framer-motion";

const CUBIC_OUT = [0.215, 0.61, 0.355, 1];

const testimonials = [
  {
    avatarSrc: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    avatarFallback: "SJ",
    userName: "Sarah Johnson",
    userRole: "CEO, TechStart Inc.",
    result: "+$2M Series A",
    quote: "The team completely transformed our startup's brand identity. The work directly helped us communicate our value proposition and secure Series A funding.",
  },
  {
    avatarSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    avatarFallback: "MR",
    userName: "Mike Rodriguez",
    userRole: "Founder, Digital Dynamics",
    result: "Brand launch",
    quote: "They understood our vision and created a brand that truly represents who we are. The entire process was seamless from start to finish.",
  },
  {
    avatarSrc: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    avatarFallback: "AL",
    userName: "Alex Liu",
    userRole: "CTO, InnovateNow",
    result: "+300% conversions",
    quote: "The attention to detail and creative approach exceeded our expectations. Our conversion rates improved by 300% within three months of launch.",
  },
  {
    avatarSrc: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    avatarFallback: "AK",
    userName: "Ayesha Khan",
    userRole: "Marketing Lead, BrightAds",
    result: "3× ROAS",
    quote: "Professional, creative, and always on time. Our digital marketing results have improved dramatically since working with Hydra Fox Designs.",
  },
  {
    avatarSrc: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    avatarFallback: "SM",
    userName: "Sara Malik",
    userRole: "Founder, Craftify",
    result: "On-time delivery",
    quote: "The best agency experience we've had. They listened to our needs and delivered a beautiful, functional website on time and within budget.",
  },
  {
    avatarSrc: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    avatarFallback: "LP",
    userName: "Laura Park",
    userRole: "Head of Growth, Scalify",
    result: "World-class",
    quote: "Hydra Fox Designs delivered beyond expectations — their strategy and execution are genuinely world-class. I'd recommend them without hesitation.",
  },
];

function TestimonialCard({ avatarSrc, avatarFallback, userName, userRole, result, quote, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: CUBIC_OUT }}
      className="group bg-black border border-white/10 hover:border-white/25 rounded-2xl p-7 flex flex-col gap-6 transition-colors duration-300"
    >
      {/* Quote mark */}
      <span className="text-[#00f19f] text-4xl font-heading font-bold leading-none select-none">"</span>

      {/* Quote text */}
      <p className="text-gray-300 text-base leading-relaxed flex-1">
        {quote}
      </p>

      {/* Result badge */}
      <span className="self-start px-3 py-1 border border-[#00f19f]/30 bg-[#00f19f]/8 text-[#00f19f] text-xs font-bold tracking-wider uppercase rounded-full">
        {result}
      </span>

      {/* Divider */}
      <div className="border-t border-white/10" />

      {/* Author */}
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-full overflow-hidden bg-white/10 flex-shrink-0">
          <img
            src={avatarSrc}
            alt={userName}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
        <div>
          <p className="text-white text-sm font-semibold leading-tight">{userName}</p>
          <p className="text-[#00f19f] text-[10px] font-bold tracking-[0.15em] uppercase mt-0.5">{userRole}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function TestimonialSection() {
  return (
    <section className="bg-black border-t border-white/10 py-24 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Editorial header */}
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
            Real feedback from real businesses we've helped grow.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <TestimonialCard key={i} {...t} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
}
