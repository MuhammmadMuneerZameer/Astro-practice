import React from 'react';
import { AlertCircle, XCircle } from 'lucide-react';

export default function GrowthBlockModule({ challenges, bottlenecks }) {
    return (
        <section className="bg-brand-dark py-24 px-6 md:px-16 relative overflow-hidden">
            {/* Abstract Background Element */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-red-900/10 to-transparent pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col lg:flex-row gap-20">

                    <div className="lg:w-1/3">
                        <span className="text-brand-accent/50 font-bold tracking-[0.2em] uppercase text-sm mb-2 block">
                            The Obstacles
                        </span>
                        <h2 className="text-7xl md:text-8xl font-heading font-bold text-brand-neutral-800 select-none mb-[-0.3em] opacity-50">
                            STOP
                        </h2>
                        <h3 className="text-4xl md:text-5xl font-heading font-semibold text-white mb-6 leading-tight">
                            Growth <span className="text-brand-neutral-500">Blockers</span>
                        </h3>
                        <p className="text-brand-neutral-400 text-lg leading-relaxed">
                            We identified the specific friction points that were holding the brand back from its true scaling potential.
                        </p>
                    </div>

                    <div className="lg:w-2/3 space-y-8">
                        {challenges && (
                            <div className="bg-brand-neutral-900/50 border border-white/5 rounded-2xl p-8 hover:border-red-500/30 transition-colors duration-300">
                                <div className="flex items-start gap-6">
                                    <div className="flex-shrink-0 p-4 bg-red-500/10 rounded-xl text-red-500">
                                        <AlertCircle size={28} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-white mb-4 font-heading">Core Challenges</h4>
                                        <p className="text-brand-neutral-300 text-lg leading-relaxed whitespace-pre-line">
                                            {challenges}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {bottlenecks && (
                            <div className="bg-brand-neutral-900/50 border border-white/5 rounded-2xl p-8 hover:border-orange-500/30 transition-colors duration-300">
                                <div className="flex items-start gap-6">
                                    <div className="flex-shrink-0 p-4 bg-orange-500/10 rounded-xl text-orange-500">
                                        <XCircle size={28} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-white mb-4 font-heading">System Bottlenecks</h4>
                                        <p className="text-brand-neutral-300 text-lg leading-relaxed whitespace-pre-line">
                                            {bottlenecks}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </section>
    );
}
