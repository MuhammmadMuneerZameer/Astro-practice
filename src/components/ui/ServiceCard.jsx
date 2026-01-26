import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const ServiceCard = ({
    tag,
    title,
    description,
    onClick,
    index,
    isActive
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ y: -5, scale: 1.01 }}
            onClick={onClick}
            className={`
        group relative p-8 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden h-full flex flex-col justify-between
        ${isActive
                    ? 'bg-brand-neutral-800 border-brand-accent/50 shadow-[0_0_30px_rgba(0,241,159,0.15)] ring-1 ring-brand-accent/30'
                    : 'bg-brand-neutral-900 border-white/5 hover:border-brand-accent/30 hover:bg-brand-neutral-800 hover:shadow-xl'
                }
      `}
        >
            {/* Background Gradient Hover Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div>
                {/* 1. Tag */}
                <div className="mb-6">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-[0.2em] uppercase bg-brand-accent/10 text-brand-accent border border-brand-accent/20">
                        {tag}
                    </span>
                </div>

                {/* 2. Heading */}
                <h3 className="text-3xl md:text-4xl font-heading font-semibold text-white mb-4 leading-tight group-hover:text-brand-accent transition-colors duration-300">
                    {title}
                </h3>

                {/* 3. Context Description */}
                <p className="text-brand-neutral-400 text-base leading-relaxed max-w-sm">
                    {description}
                </p>
            </div>

            {/* 4. CTA */}
            <div className="mt-8 pt-8 border-t border-white/5 group-hover:border-white/10 transition-colors">
                <div className="flex items-center gap-3 text-white group-hover:text-brand-accent transition-colors duration-300 font-medium tracking-wide">
                    <span>Explore Solution</span>
                    <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                </div>
            </div>

            {/* Decorative Icon Glow */}
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-brand-accent/20 rounded-full blur-2xl group-hover:bg-brand-accent/30 transition-all duration-500" />
        </motion.div>
    );
};

export default ServiceCard;
