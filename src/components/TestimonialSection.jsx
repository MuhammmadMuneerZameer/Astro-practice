import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";

const CUBIC_OUT = [0.215, 0.61, 0.355, 1];

// Fallback data — shown only when the Firestore collection is empty.
// Once you add testimonials via the admin panel, this is ignored.
const FALLBACK = [
  {
    id: "fallback-1",
    quote:
      "Hydra Fox took my clothing brand from a blank page to a full identity — completely from scratch. Couldn't be more satisfied with the entire process.",
    name: "Grace Younger",
    title: "Founder",
    company: "Disgraced",
    platform: "Direct",
    platformHref: null,
    metricValue: null,
    metricLabel: null,
  },
  {
    id: "fallback-2",
    quote:
      "Absolutely thrilled with the logo design. It perfectly captured my vision and was delivered promptly. Highly recommended.",
    name: "Saifullah Asif",
    title: "Business Owner",
    company: null,
    platform: "Facebook",
    platformHref: null,
    metricValue: null,
    metricLabel: null,
  },
];

function QuoteCard({ item, index }) {
  const { quote, name, title, company, platform, platformHref, metricValue, metricLabel } = item;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, delay: index * 0.08, ease: CUBIC_OUT }}
      className="bg-black border border-white/10 rounded-2xl p-8 flex flex-col gap-7"
    >
      {/* Metric — only rendered when present */}
      {metricValue && (
        <div className="pb-6 border-b border-white/10">
          <p className="font-heading font-bold text-4xl text-[#00f19f] leading-none tabular-nums">
            {metricValue}
          </p>
          {metricLabel && (
            <p className="text-gray-600 text-[10px] font-mono tracking-widest uppercase mt-2">
              {metricLabel}
            </p>
          )}
        </div>
      )}

      {/* Quote */}
      <p className="text-gray-300 text-base leading-relaxed flex-1">
        &ldquo;{quote}&rdquo;
      </p>

      {/* Attribution */}
      <div className="border-t border-white/10 pt-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-white text-sm font-semibold leading-tight">{name}</p>
          <p className="text-gray-500 text-xs mt-1">
            {[title, company].filter(Boolean).join(", ")}
          </p>
        </div>

        {platformHref ? (
          <a
            href={platformHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-[#00f19f] text-[10px] font-mono tracking-widest uppercase transition-colors duration-200 flex-shrink-0"
          >
            {platform}&nbsp;↗
          </a>
        ) : (
          <span className="text-gray-700 text-[10px] font-mono tracking-widest uppercase flex-shrink-0">
            {platform}
          </span>
        )}
      </div>
    </motion.div>
  );
}

export default function TestimonialSection() {
  const [testimonials, setTestimonials] = useState(null); // null = loading

  useEffect(() => {
    const q = query(
      collection(db, "testimonials"),
      where("active", "==", true),
      orderBy("order", "asc")
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        // Use Firestore data if any exists; otherwise show fallback
        setTestimonials(docs.length > 0 ? docs : FALLBACK);
      },
      () => {
        // On error (e.g. no network), show fallback silently
        setTestimonials(FALLBACK);
      }
    );

    return unsub;
  }, []);

  // Don't render the section until we know what to show
  if (testimonials === null) return null;

  return (
    <section className="bg-black border-t border-white/10 py-24 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">

        <div className="mb-14">
          <p className="text-[#00f19f] text-xs font-bold tracking-[0.2em] uppercase mb-4">
            Client results
          </p>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-white leading-none">
            What clients say.
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <QuoteCard key={t.id} item={t} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
}
