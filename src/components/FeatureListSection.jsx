import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Target, Users, BarChart3, Globe, Rocket } from 'lucide-react';

const CUBIC_OUT = [0.215, 0.61, 0.355, 1];

const features = [
  {
    title: 'Trusted Security',
    description: 'We prioritize your data privacy and implement enterprise-grade security at every layer.',
    icon: Shield
  },
  {
    title: 'Goal-Driven Approach',
    description: 'Every project is aligned with measurable goals to ensure we drive tangible outcomes.',
    icon: Target
  },
  {
    title: 'Expert Teamwork',
    description: 'Our team consists of skilled professionals who work collaboratively to deliver excellence.',
    icon: Users
  },
  {
    title: 'Data-Backed Results',
    description: 'We leverage advanced analytics to provide actionable insights and data-driven decisions.',
    icon: BarChart3
  },
  {
    title: 'Global Reach',
    description: 'We serve clients worldwide, offering scalable solutions with international support.',
    icon: Globe
  },
  {
    title: 'Fast Execution',
    description: 'With agile methodologies, we accelerate project delivery without compromising quality.',
    icon: Rocket
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
              Our Mission
            </p>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-white leading-none">
              Why Choose Us
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
