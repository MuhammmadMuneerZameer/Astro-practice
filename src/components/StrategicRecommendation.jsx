import React from 'react';
import { Lightbulb, ArrowRight } from 'lucide-react';

export default function StrategicRecommendation({ fromService, toService, message, linkText, linkUrl }) {
    return (
        <div className="relative my-16 p-1 rounded-xl bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 shadow-xl overflow-hidden max-w-4xl mx-auto transform hover:scale-[1.01] transition-transform duration-300">

            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 blur-[80px] rounded-full pointer-events-none"></div>

            <div className="bg-gray-900 rounded-lg p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 relative z-10">

                {/* Icon */}
                <div className="p-4 bg-yellow-500/10 rounded-full text-yellow-400 shrink-0 border border-yellow-500/20">
                    <Lightbulb size={24} />
                </div>

                {/* Content */}
                <div className="flex-1 text-center md:text-left">
                    <h4 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">
                        Strategic Insight
                    </h4>
                    <p className="text-gray-200 text-lg font-medium leading-relaxed">
                        "{message}"
                    </p>
                </div>

                {/* Action */}
                <a
                    href={linkUrl}
                    className="shrink-0 group flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white font-semibold transition-all"
                >
                    {linkText}
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </a>

            </div>
        </div>
    );
}
