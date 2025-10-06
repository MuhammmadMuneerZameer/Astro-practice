import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Target, ArrowRight } from 'lucide-react';
import "../styles/global.css";
const stats = [
  {
    value: 250,
    suffix: '%',
    prefix: '+',
    title: 'Increased Online Presence',
    description: 'Boost your visibility and reach more customers with our proven digital strategies.',
    icon: TrendingUp
  },
  {
    value: 15,
    suffix: '+',
    prefix: '',
    title: 'Expert Team',
    description: 'Work with experienced professionals dedicated to your success.',
    icon: Users
  },
  {
    value: 100,
    suffix: '%',
    prefix: '',
    title: 'Customized Strategies',
    description: 'Get tailored solutions that fit your business goals and needs.',
    icon: Target
  }
];

function CountUpAnimation({ end, duration = 2, suffix = '', prefix = '' }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime;
    let animationFrame;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = (currentTime - startTime) / (duration * 1000);

      if (progress < 1) {
        setCount(Math.floor(end * progress));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isVisible, end, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{count}{suffix}
    </span>
  );
}

export default function WhyChooseUs() {
  return (
    <section className="bg-black  py-16 sm:py-20 md:py-24 px-4 sm:px-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10 ">
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
            <p className="text-[var(--color-accent)] text-xs font-semibold tracking-wider uppercase mb-2">
              OUR MISSION
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-white">
              Why <span className="text-green-300">Choose</span>
              <br />
              We're Offering
            </h2>
          </div>
          <a
            href="/aboutUs"
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

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group relative"
              >
                {/* Card */}
                <div className="relative h-full  border border-gray-800 rounded-2xl p-6 md:p-8 overflow-hidden transition-all duration-300 hover:border-[var(--color-accent)]">
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-emerald-500/0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  
                  {/* Icon */}
                  <div className="relative mb-6">
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-10`}>
                      <Icon className="w-6 h-6 md:w-7 md:h-7 text-[var(--color-accent)]" />
                    </div>
                  </div>

                  {/* Number */}
                  <div className="relative mb-4">
                    <motion.div
                      className={`text-5xl md:text-6xl font-bold text-[var(--color-accent)] bg-clip-text`}
                    >
                      <CountUpAnimation 
                        end={stat.value} 
                        suffix={stat.suffix}
                        prefix={stat.prefix}
                      />
                    </motion.div>
                    
                    {/* Animated underline */}
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: '60px' }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                      className={`h-1 mt-3 rounded-full bg-gradient-to-r text-red-500`}
                    ></motion.div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl md:text-2xl font-semibold text-white mb-3 group-hover:text-green-300 transition-colors duration-300">
                    {stat.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                    {stat.description}
                  </p>

                  {/* Corner decoration */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA (Optional) */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12 md:mt-16"
        >
          <p className="text-gray-400 text-sm md:text-base">
            Ready to transform your business?{' '}
            <a 
              href="/contact" 
              className="text-green-300 hover:text-green-400 font-semibold transition-colors duration-300 underline decoration-green-500/30 underline-offset-4 hover:decoration-green-500"
            >
              Get in touch today
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}