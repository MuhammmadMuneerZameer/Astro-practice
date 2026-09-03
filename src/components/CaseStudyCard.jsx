import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CaseStudyCard({ study, layoutId }) {
    // Helper to get services array
    const services = Array.isArray(study.services) && study.services.length > 0
        ? study.services
        : [study.service];

    return (
        <a
            href={`/case-studies/${study.slug}`}
            className="group block h-full"
        >
            <motion.div
                layoutId={layoutId}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative bg-brand-neutral-900 border border-white/5 rounded-2xl overflow-hidden hover:border-brand-accent/30 transition-all duration-500 h-full flex flex-col group-hover:shadow-[0_0_30px_rgba(0,241,159,0.1)]"
            >
                {/* Image Container with Hover Zoom */}
                <div className="aspect-[4/3] overflow-hidden relative">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                    <img
                        src={study.image || '/images/desktop-opt.webp'}
                        alt={study.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        width="800"
                        height="600"
                    />

                    {/* Tags overlay */}
                    <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2">
                        {services.slice(0, 2).map((srv, idx) => (
                            <span key={idx} className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 text-brand-accent text-xs font-bold tracking-wider uppercase rounded-full">
                                {srv}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Content Container */}
                <div className="p-6 md:p-8 flex-1 flex flex-col">
                    {/* Impact Badge (if exists) */}
                    {study.revenueImpact && (
                        <div className="mb-4">
                            <span className="inline-block px-3 py-1 bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-xs font-bold rounded-full uppercase tracking-wider">
                                {study.revenueImpact}
                            </span>
                        </div>
                    )}

                    <h3 className="text-2xl md:text-3xl font-heading font-bold text-white mb-3 group-hover:text-brand-accent transition-colors">
                        {study.title}
                    </h3>

                    <p className="text-brand-neutral-400 text-sm md:text-base mb-6 line-clamp-2">
                        {study.client} — {study.summary || "Strategic digital transformation resulting in measurable growth."}
                    </p>

                    <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between text-white group-hover:text-brand-accent transition-colors">
                        <span className="font-semibold text-sm tracking-wide">View Case Study</span>
                        <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:border-brand-accent group-hover:bg-brand-accent group-hover:text-black transition-all">
                            <ArrowUpRight size={16} />
                        </div>
                    </div>
                </div>
            </motion.div>
        </a>
    );
}
