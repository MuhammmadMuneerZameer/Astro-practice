import React from 'react';
import { ArrowDown, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CaseStudyHero({ title, subtitle, client, service, industry, duration, image }) {
    return (
        <div className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-brand-dark">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/80 to-brand-dark/40 z-10" />
                <img
                    src={image}
                    alt={client}
                    className="w-full h-full object-cover scale-105 animate-slow-zoom opacity-60"
                />
            </div>

            {/* Content */}
            <div className="relative z-20 max-w-7xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-8"
                >
                    {/* Tags */}
                    <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
                        <span className="px-4 py-1.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-brand-neutral-200 text-sm font-bold tracking-wide uppercase">
                            {service}
                        </span>
                        <span className="px-4 py-1.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-brand-neutral-200 text-sm font-bold tracking-wide uppercase">
                            {industry}
                        </span>
                        {duration && (
                            <span className="flex items-center gap-2 px-4 py-1.5 bg-brand-accent/10 backdrop-blur-md border border-brand-accent/20 rounded-full text-brand-accent text-sm font-bold tracking-wide uppercase">
                                <Clock size={14} />
                                {duration}
                            </span>
                        )}
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-9xl font-heading font-semibold text-white tracking-tight leading-[0.9]">
                        {title}
                    </h1>

                    <p className="text-xl md:text-2xl text-brand-neutral-400 max-w-3xl mx-auto font-light leading-relaxed">
                        {subtitle}
                    </p>

                    <p className="pt-8 text-sm font-bold tracking-[0.2em] uppercase text-brand-accent/80">
                        Client: {client}
                    </p>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-white flex flex-col items-center gap-3"
            >
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-neutral-500">Explore Case Study</span>
                <ArrowDown className="animate-bounce text-brand-accent" size={20} />
            </motion.div>
        </div>
    );
}
