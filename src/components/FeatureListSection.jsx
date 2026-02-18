import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Target, Users, BarChart3, Globe, Rocket } from 'lucide-react';

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
    <section className="bg-black py-16 sm:py-20 md:py-24 px-4 sm:px-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 md:mb-12 gap-4">
            <div>
              <p className="text-green-400 text-xs font-semibold tracking-wider uppercase mb-2">
                OUR MISSION
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-white">
                Why <span className="text-green-300">Choose</span> Us
              </h2>
            </div>
            <a
              href="/contact/"
              className="group relative inline-flex items-center justify-center px-6 py-3 text-white font-medium rounded-full bg-black/80 backdrop-blur-sm transition-all duration-300 overflow-hidden"
              style={{ boxShadow: '0 2px 15px rgb(99, 253, 189)' }}
            >
              <span className="relative z-10 flex items-center gap-2">
                let's talk
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
              <span className="absolute inset-0 rounded-full bg-green-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
              <span className="absolute inset-0 rounded-full border border-green-400 opacity-0 group-hover:opacity-100 transition-all duration-500"></span>
            </a>
          </div>

          {/* Description */}
          <p className="text-gray-400 max-w-2xl text-sm md:text-base leading-relaxed mb-12">
            Discover the difference with our expert team, customized strategies, and proven results. We're dedicated to helping your business thrive in the digital world.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
                  ease: [0.22, 1, 0.36, 1]
                }}
                className="group relative"
              >
                {/* Card */}
                <motion.div
                  className="relative h-full p-8 rounded-xl transition-all duration-500"
                  whileHover={{
                    y: -12,
                    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
                  }}
                >
                  {/* Animated background gradient */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-emerald-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    initial={false}
                  ></motion.div>

                  {/* Subtle border glow on hover */}
                  <div className="absolute inset-0 rounded-xl border border-gray-800/50 group-hover:border-green-500/30 transition-all duration-500"></div>

                  {/* Animated corner accent */}
                  <motion.div
                    className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-400/0 to-green-400/10 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    initial={false}
                  ></motion.div>

                  <div className="relative z-10">
                    {/* Icon with animation */}
                    <motion.div
                      className="mb-6"
                      whileHover={{
                        scale: 1.1,
                        rotate: [0, -5, 5, 0],
                        transition: { duration: 0.5 }
                      }}
                    >
                      <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/5 group-hover:from-green-500/20 group-hover:to-emerald-500/10 transition-all duration-500">
                        <Icon className="w-8 h-8 text-gray-400 group-hover:text-[var(--color-accent)] transition-colors duration-500" />
                      </div>
                    </motion.div>

                    {/* Title with gradient text on hover */}
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-green-300 group-hover:to-emerald-400 transition-all duration-500">
                      {feature.title}
                    </h3>

                    {/* Animated underline */}
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: '60px' }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                      className="h-0.5 mb-4 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 opacity-30 group-hover:opacity-100 group-hover:w-20 transition-all duration-500"
                    ></motion.div>

                    {/* Description */}
                    <p className="text-gray-400 text-sm md:text-base leading-relaxed group-hover:text-gray-300 transition-colors duration-500">
                      {feature.description}
                    </p>
                  </div>

                  {/* Floating particles effect on hover */}
                  <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-green-400 rounded-full opacity-0 group-hover:opacity-60"
                        style={{
                          left: `${20 + i * 30}%`,
                          bottom: '20%',
                        }}
                        animate={{
                          y: [0, -100],
                          opacity: [0, 0.6, 0],
                        }}
                        transition={{
                          duration: 2,
                          delay: i * 0.3,
                          repeat: Infinity,
                          repeatDelay: 1,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}