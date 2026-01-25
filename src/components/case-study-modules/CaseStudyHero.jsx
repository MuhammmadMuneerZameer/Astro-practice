import React from 'react';
import { ArrowDown, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CaseStudyHero({ title, subtitle, client, service, industry, duration, image }) {
    return (
        <div className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/30 z-10" />
                <img
                    src={image}
                    alt={client}
                    className="w-full h-full object-cover scale-105 animate-slow-zoom"
                />
            </div>

            {/* Content */}
            <div className="relative z-20 max-w-7xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-6"
                >
                    {/* Tags */}
                    <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
                        <span className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-sm font-medium">
                            {service}
                        </span>
                        <span className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-sm font-medium">
                            {industry}
                        </span>
                        {duration && (
                            <span className="flex items-center gap-2 px-4 py-2 bg-green-500/20 backdrop-blur-md border border-green-500/30 rounded-full text-green-300 text-sm font-medium">
                                <Clock size={14} />
                                {duration}
                            </span>
                        )}
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight leading-tight">
                        {title}
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
                        {subtitle}
                    </p>

                    <p className="pt-8 text-sm font-bold tracking-widest uppercase text-green-400">
                        Client: {client}
                    </p>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-white flex flex-col items-center gap-2"
            >
                <span className="text-xs uppercase tracking-widest text-gray-400">Scroll to Explore</span>
                <ArrowDown className="animate-bounce" size={20} />
            </motion.div>
        </div>
    );
}
