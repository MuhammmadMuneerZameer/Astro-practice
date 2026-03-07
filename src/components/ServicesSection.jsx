import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const services = [
  {
    title: "Product Design",
    description: "Understanding user behavior to create intuitive, effective experiences.",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop"
  },
  {
    title: "UX/UI Design",
    description: "Understanding user behavior to create intuitive, effective experiences.",
    image: "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=800&h=600&fit=crop"
  },
  {
    title: "Mobile Applications",
    description: "Understanding user behavior to create intuitive, effective experiences.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop"
  },
  {
    title: "Web Development",
    description: "Understanding user behavior to create intuitive, effective experiences.",
    image: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&h=600&fit=crop"
  },
  {
    title: "Video Editing",
    description: "Understanding user behavior to create intuitive, effective experiences.",
    image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&h=600&fit=crop"
  },
  {
    title: "Branding",
    description: "Understanding user behavior to create intuitive, effective experiences.",
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&h=600&fit=crop"
  },
  {
    title: "Motion Design",
    description: "Understanding user behavior to create intuitive, effective experiences.",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=600&fit=crop"
  },
  {
    title: "Digital Marketing",
    description: "Understanding user behavior to create intuitive, effective experiences.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop"
  }
];

export default function ServicesSection() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleMouseMove = (e) => {
      if (!isMobile) {
        setMousePosition({ x: e.clientX, y: e.clientY });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', checkMobile);
    };
  }, [isMobile]);

  const handleServiceClick = (index) => {
    if (isMobile) {
      setHoveredIndex(hoveredIndex === index ? null : index);
    }
  };

  return (
    <section className="min-h-screen bg-black text-white py-12 sm:py-16 md:py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 md:mb-12 gap-4">
          <div>
            <p className="text-green-400 text-xs font-semibold tracking-wider uppercase mb-2">
              OUR SERVICES
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold leading-tight">
              What <span className="text-green-300">Services</span>
              <br />
              We're Offering
            </h2>
          </div>
          <a
            href="/services"
            className="group relative inline-flex items-center justify-center px-6 py-3 text-white font-medium rounded-full bg-gray-900 border border-white/10 hover:border-green-400/50 transition-all duration-300"
          >
            <span className="relative z-10 flex items-center gap-2">
              Learn more
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </a>
        </div>

        <p className="text-gray-400 max-w-2xl text-sm md:text-base leading-relaxed mb-12">
          We offer services that can help businesses improve their visibility and business reputation online,
          expand market reach, and increase turnover through effective digital strategies.
        </p>

        <div className="relative">
          <div className="space-y-0">
            {services.map((service, index) => (
              <div key={index}>
                <motion.div
                  onHoverStart={() => !isMobile && setHoveredIndex(index)}
                  onHoverEnd={() => !isMobile && setHoveredIndex(null)}
                  onClick={() => handleServiceClick(index)}
                  className="relative border-t border-gray-800 last:border-b"
                >
                  <div className="py-6 md:py-8 flex items-center justify-between group cursor-pointer">
                    <div className="flex-1">
                      <motion.h3
                        className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-gray-400 group-hover:text-green-400 transition-colors duration-300"
                        animate={{
                          x: hoveredIndex === index ? 20 : 0
                        }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      >
                        {service.title}
                      </motion.h3>
                      <AnimatePresence>
                        {hoveredIndex === index && (
                          <motion.p
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 1, height: "auto", marginTop: 12 }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            transition={{ duration: 0.3 }}
                            className="text-gray-500 text-sm md:text-base max-w-xl overflow-hidden"
                          >
                            {service.description}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    <motion.div
                      animate={{
                        scale: hoveredIndex === index ? 1.1 : 1,
                        rotate: hoveredIndex === index ? 0 : -45
                      }}
                      transition={{ duration: 0.3 }}
                      className="ml-6 flex-shrink-0"
                    >
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-gray-700 group-hover:border-green-400 flex items-center justify-center transition-colors duration-300">
                        <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-gray-500 group-hover:text-green-400 transition-colors duration-300" />
                      </div>
                    </motion.div>
                  </div>
                </motion.div>

                {isMobile && (
                  <AnimatePresence>
                    {hoveredIndex === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="overflow-hidden "
                      >
                        <div className="pb-6 px-2">
                          <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                            className="relative rounded-xl overflow-hidden"
                          >
                            <img
                              src={service.image}
                              alt={service.title}
                              className="w-full h-64 object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                            <div className="absolute bottom-4 left-4 bg-brand-accent text-black px-4 py-2 rounded-lg font-bold text-sm shadow-lg">
                              {service.title}
                            </div>
                          </motion.div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </div>

          {!isMobile && (
            <AnimatePresence>
              {hoveredIndex !== null && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    x: mousePosition.x,
                    y: mousePosition.y
                  }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{
                    opacity: { duration: 0.3 },
                    scale: { duration: 0.3 },
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    y: { type: "spring", stiffness: 300, damping: 30 }
                  }}
                  className="fixed pointer-events-none z-50"
                  style={{
                    left: -200,
                    top: -200,
                    filter: 'drop-shadow(0 20px 40px rgba(0, 241, 159, 0.3))'
                  }}
                >
                  <div className="relative w-[400px] h-[300px]">
                    <motion.div
                      animate={{
                        scale: [1, 1.05, 1],
                        opacity: [0.5, 0.7, 0.5]
                      }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute inset-0 bg-brand-accent/20 rounded-2xl blur-3xl"
                    />

                    <div className="relative bg-gradient-to-br from-brand-neutral-900 to-black rounded-2xl p-4 border-2 border-green-400/30 shadow-2xl overflow-hidden">
                      <div className="relative overflow-hidden rounded-xl">
                        <img
                          src={services[hoveredIndex].image}
                          alt={services[hoveredIndex].title}
                          className="w-full h-64 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                        <motion.div
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.1 }}
                          className="absolute bottom-4 left-4 bg-brand-accent text-black px-4 py-2 rounded-lg font-bold text-sm shadow-lg"
                        >
                          {services[hoveredIndex].title}
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </section>
  );
}