import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const services = [
  {
    title: "Ecommerce Growth",
    description: "Paid media managed to MER targets — and the Klaviyo lifecycle infrastructure to make it profitable. Welcome series, abandoned checkout, post-purchase, win-back, and segmentation built before the first campaign launches.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    link: "/services/ecommerce-growth/"
  },
  {
    title: "Store Design & Build",
    description: "Shopify and Shopify Plus storefronts engineered for conversion rate, Core Web Vitals, and a post-purchase experience that compounds LTV.",
    image: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&h=600&fit=crop",
    link: "/services/store-design-build/"
  },
  {
    title: "Growth Tools & Automation",
    description: "Conversions API, server-side tracking, and custom MER dashboards that give you accurate data to make better decisions with less spend.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    link: "/services/growth-tools-automation/"
  },
  {
    title: "Brand & Content",
    description: "Brand identity, video, and motion content that earns the margin premium to make paid acquisition sustainable — and defensible against commoditization.",
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&h=600&fit=crop",
    link: "/services/brand-content/"
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
    <section className="bg-black border-t border-white/10 text-white py-24 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-16 gap-8">
          <div>
            <p className="text-[#00f19f] text-xs font-bold tracking-[0.2em] uppercase mb-4">
              Our Services
            </p>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-none text-white">
              What We Offer.
            </h2>
          </div>
          <a
            href="/services/"
            className="group inline-flex items-center gap-3 text-white text-sm font-medium hover:text-[#00f19f] transition-colors duration-300"
          >
            <span className="relative z-10 flex items-center gap-3">
              All services
              <span className="w-9 h-9 rounded-full border border-white/20 group-hover:border-[#00f19f] group-hover:bg-[#00f19f] flex items-center justify-center transition-all duration-300">
                <ArrowRight className="w-4 h-4 text-white group-hover:text-black transition-colors" />
              </span>
            </span>
          </a>
        </div>

        <p className="text-gray-500 max-w-2xl text-sm md:text-base leading-relaxed mb-12">
          We build the full stack for DTC growth — Shopify development, paid media managed to MER targets, Klaviyo retention systems, and brand work that earns the margin to make all of it profitable.
        </p>

        <div className="relative">
          <div className="border-t border-white/10 space-y-0">
            {services.map((service, index) => (
              <div key={index}>
                <motion.div
                  onHoverStart={() => !isMobile && setHoveredIndex(index)}
                  onHoverEnd={() => !isMobile && setHoveredIndex(null)}
                  onClick={() => window.location.href = service.link}
                  onKeyDown={(e) => e.key === 'Enter' && (window.location.href = service.link)}
                  role="link"
                  tabIndex={0}
                  aria-label={`${service.title} — learn more`}
                  className="relative border-t border-white/10 last:border-b last:border-white/10"
                >
                  <div className="py-6 md:py-8 flex items-center justify-between group cursor-pointer">
                    <div className="flex-1">
                      <motion.h3
                        className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-white group-hover:text-[#00f19f] transition-colors duration-300"
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
                      <div className="w-10 h-10 md:w-11 md:h-11 rounded-full border border-white/20 group-hover:border-[#00f19f] group-hover:bg-[#00f19f] flex items-center justify-center transition-all duration-300">
                        <ArrowRight className="w-4 h-4 text-white group-hover:text-black transition-colors duration-300" />
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
                              loading="lazy"
                              width="800"
                              height="600"
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
                          loading="lazy"
                          width="800"
                          height="600"
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