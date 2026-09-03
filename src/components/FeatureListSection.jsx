import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Layers, Calendar, Radio } from 'lucide-react';

const CUBIC_OUT = [0.215, 0.61, 0.355, 1];

const features = [
  {
    title: 'One team owns ads, store, and tracking.',
    description: 'Most DTC brands end up with a paid media agency, a Shopify developer, and a tracking consultant who can each blame the other when MER slips. We own the full stack — store architecture, ad account, email retention, and server-side tracking. When MER drifts or attribution breaks, one team is accountable: us.',
    icon: Layers
  },
  {
    title: 'No retainer lock-in. Cancel with 30 days\' notice.',
    description: 'Every engagement runs month-to-month. We don\'t use contracts to retain clients — we use results. If the numbers aren\'t moving in the right direction after 90 days, you should leave, and we\'ll tell you honestly what didn\'t work and why.',
    icon: Calendar
  },
  {
    title: 'Conversions API live before your first campaign.',
    description: 'We treat server-side tracking as infrastructure, not an afterthought. Conversions API and first-party event pipelines go live in week one — so you\'re never optimising Meta spend against data a browser decided not to share.',
    icon: Radio
  }
];

export default function WhyChooseUs() {
  return (
    <section className="bg-black border-t border-white/10 px-4 md:px-8 py-24">
      <div className="max-w-7xl mx-auto">

        {/* Editorial header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <p className="text-[#00f19f] text-xs font-bold tracking-[0.2em] uppercase mb-4">
              Why Work With Us
            </p>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-white leading-none">
              Three Reasons.
            </h2>
          </div>
          <a
            href="/contact/"
            className="group inline-flex items-center gap-3 text-white text-sm font-medium hover:text-[#00f19f] transition-colors duration-300 flex-shrink-0"
          >
            Let's talk
            <span className="w-9 h-9 rounded-full border border-white/20 group-hover:border-[#00f19f] group-hover:bg-[#00f19f] flex items-center justify-center transition-all duration-300">
              <ArrowRight className="w-4 h-4 text-white group-hover:text-black transition-colors" />
            </span>
          </a>
        </div>

        {/* List rows */}
        <div className="border-t border-white/10">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={i}
                className="group flex items-start gap-6 md:gap-10 py-8 border-b border-white/10 hover:border-white/30 transition-colors duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: CUBIC_OUT }}
              >
                <span className="text-gray-600 text-xs font-mono w-8 flex-shrink-0 mt-1.5 select-none">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <Icon className="w-5 h-5 text-[#00f19f] flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-heading font-bold text-white group-hover:text-[#00f19f] transition-colors duration-300 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
