import React from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export default function CredibilityCTA({ service, link }) {
    return (
        <div className="w-full max-w-4xl mx-auto mt-6 mb-16 px-4">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 to-black border border-gray-800 p-8 md:p-10 text-center shadow-2xl group hover:border-green-500/30 transition-all duration-300">

                {/* Background Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-1/2 bg-green-500/10 blur-[100px] rounded-full group-hover:bg-green-500/20 transition-all duration-500"></div>

                <div className="relative z-10 flex flex-col items-center gap-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-300 rounded-full text-sm font-medium border border-green-500/20">
                        <ShieldCheck size={16} />
                        <span>Proven Track Record</span>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-bold text-white max-w-2xl">
                        See how we delivered results for {service} brands just like yours
                    </h3>

                    <p className="text-gray-400 max-w-xl text-base md:text-lg">
                        Don't just take our word for it. Explore detailed breakdowns of our strategy, execution, and impact.
                    </p>

                    <a
                        href={link}
                        className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-green-400 hover:scale-105 transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(74,222,128,0.5)]"
                    >
                        Read {service} Case Studies
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                </div>
            </div>
        </div>
    );
}
