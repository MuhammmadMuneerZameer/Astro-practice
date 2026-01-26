import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CaseStudyCard({ study, layoutId }) {
    return (
        <div
            layoutid={layoutId}
            className="group relative bg-gray-900/40 border border-gray-800 rounded-2xl overflow-hidden hover:border-green-500/50 transition-colors duration-500 h-full flex flex-col"
        >
            {/* Image Container */}
            <div className="aspect-[4/3] overflow-hidden relative">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                <img
                    src={study.image}
                    alt={study.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Service Badge */}
                <div className="absolute top-4 left-4 z-20">
                    <span className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 text-white text-xs font-medium rounded-full">
                        {study.service}
                    </span>
                </div>
            </div>

            {/* Content Container - Overlay style for Desktop, stacked for Mobile */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex flex-col justify-end p-8 z-20">

                {/* Impact Badge */}
                {study.revenueImpact && (
                    <div className="self-start mb-auto translate-y-[-10px] group-hover:translate-y-0 transition-transform duration-500 delay-100">
                        <span className="bg-green-500 text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                            {study.revenueImpact}
                        </span>
                    </div>
                )}

                <h3 className="text-2xl font-bold text-white mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    {study.title}
                </h3>

                <div className="flex items-center justify-between translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                    <p className="text-gray-300 text-sm font-medium">{study.client}</p>
                    <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-green-400 transition-colors">
                        <ArrowUpRight size={20} />
                    </div>
                </div>

                {/* Click Area Overlay */}
                <a href={`/case-studies/${study.slug}`} className="absolute inset-0 z-30" aria-label={`View ${study.title}`} />
            </div>

            {/* Mobile Visible Content */}
            <div className="p-6 md:hidden flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-white mb-1">{study.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{study.client}</p>
                <div className="mt-auto flex justify-between items-center">
                    {study.revenueImpact && (
                        <span className="text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded border border-green-500/20">
                            {study.revenueImpact}
                        </span>
                    )}
                    <a href={`/case-studies/${study.slug}`} className="text-green-400 text-sm font-bold flex items-center gap-1">
                        View Case Study <ArrowUpRight size={16} />
                    </a>
                </div>
            </div>

        </div>
    );
}
