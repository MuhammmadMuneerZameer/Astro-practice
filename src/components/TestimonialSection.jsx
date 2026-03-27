import React, { useState, useEffect, useRef } from "react";
import { Send, Check } from "lucide-react";

const testimonials = [
  {
    avatarSrc: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    avatarFallback: "SJ",
    isOnline: true,
    userName: "Sarah Johnson",
    userRole: "CEO, TechStart Inc.",
    message: "The team completely transformed our startup's brand. The work helped us secure $2M in Series A funding.",
    timestamp: "2 weeks ago",
    readStatus: "Read",
  },
  {
    avatarSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    avatarFallback: "MR",
    isOnline: false,
    userName: "Mike Rodriguez",
    userRole: "Founder, Digital Dynamics",
    message: "Working with this team was amazing. They understood our vision and created a brand that truly represents who we are.",
    timestamp: "1 month ago",
    readStatus: "Read",
  },
  {
    avatarSrc: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    avatarFallback: "AL",
    isOnline: true,
    userName: "Alex Liu",
    userRole: "CTO, InnovateNow",
    message: "The attention to detail and creative approach exceeded our expectations. Our conversion rates improved by 300%!",
    timestamp: "3 weeks ago",
    readStatus: "Read",
  },
  {
    avatarSrc: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    avatarFallback: "AK",
    isOnline: true,
    userName: "Ayesha Khan",
    userRole: "Marketing Lead, BrightAds",
    message: "Professional, creative, and always on time. Our digital marketing results have improved dramatically since working with them.",
    timestamp: "5 days ago",
    readStatus: "Unread",
  },
  {
    avatarSrc: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    avatarFallback: "SM",
    isOnline: false,
    userName: "Sara Malik",
    userRole: "Founder, Craftify",
    message: "The best agency experience we've had. They listened to our needs and delivered a beautiful, functional site on time.",
    timestamp: "2 months ago",
    readStatus: "Read",
  },
  {
    avatarSrc: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    avatarFallback: "LP",
    isOnline: true,
    userName: "Laura Park",
    userRole: "Head of Growth, Scalify",
    message: "Hydra Fox Designs delivered beyond expectations — their strategy and execution are genuinely world-class.",
    timestamp: "1 week ago",
    readStatus: "Read",
  },
];

function TestimonialCard({ avatarSrc, avatarFallback, isOnline, userName, userRole, message, timestamp, readStatus, style }) {
  return (
    <div
      style={style}
      className="w-full overflow-hidden rounded-2xl bg-gray-900/80 border border-gray-800 p-2 backdrop-blur-sm hover:border-green-500/30 transition-all duration-300 opacity-0 translate-y-4 animate-card-in"
    >
      {/* Content */}
      <div className="px-4 py-4">
        <div className="flex items-start justify-between gap-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-700">
                <img
                  src={avatarSrc}
                  alt={`${userName}'s avatar`}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentNode.querySelector('.fallback')?.style.setProperty('display', 'flex');
                  }}
                />
                <div className="fallback hidden h-full w-full items-center justify-center bg-gray-700 text-xs font-bold text-green-400">
                  {avatarFallback}
                </div>
              </div>
              {isOnline && (
                <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full border-2 border-gray-900 bg-green-500" />
              )}
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 min-w-0">
            <div className="mb-2">
              <p className="text-sm font-semibold text-white">{userName}</p>
              <p className="text-xs font-medium uppercase tracking-wider text-green-400">{userRole}</p>
            </div>

            {/* Message bubble */}
            <div className="mb-3 rounded-lg rounded-tl-none bg-gray-800 p-3 text-sm text-gray-300">
              <p>{message}</p>
            </div>

            {/* Footer */}
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>{timestamp}</span>
              <span>&middot;</span>
              {readStatus === "Read" ? (
                <>
                  <span>Read</span>
                  <Check className="h-3.5 w-3.5 text-green-400" />
                </>
              ) : (
                <span className="text-green-400">Unread</span>
              )}
            </div>
          </div>

          {/* Reply icon */}
          <div className="flex-shrink-0">
            <button
              className="h-9 w-9 rounded-full flex items-center justify-center transition-colors hover:bg-green-500/10"
              aria-label="Reply"
            >
              <Send className="h-4 w-4 text-gray-500 hover:text-green-400 transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialSection() {
  return (
    <section className="bg-black border-t border-white/10 py-24 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Editorial Header */}
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <TestimonialCard
              key={i}
              {...t}
              style={{ animationDelay: `${i * 120}ms` }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
