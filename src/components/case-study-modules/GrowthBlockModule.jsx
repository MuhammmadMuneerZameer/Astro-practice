import React from 'react';

export default function GrowthBlockModule({ challenges, bottlenecks }) {
    return (
        <section className="bg-black py-24 px-6 md:px-16 relative overflow-hidden">
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col lg:flex-row gap-20">

                    <div className="lg:w-1/3">
                        <span className="text-brand-text-soft/60 font-bold tracking-[0.2em] uppercase text-sm mb-4 block">
                            The Obstacles
                        </span>

                        <h3 className="text-4xl md:text-5xl font-heading font-semibold text-brand-text-soft mb-6 leading-tight">
                            Growth Blockers
                        </h3>
                        <p className="text-brand-text-soft/80 text-lg leading-relaxed">
                            We identified the specific friction points that were holding the brand back from its true scaling potential.
                        </p>
                    </div>

                    <div className="lg:w-2/3 space-y-8">
                        {challenges && (
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-brand-text-soft/30 transition-colors duration-300">
                                <h4 className="text-xl font-bold text-brand-text-soft mb-4 font-heading">Core Challenges</h4>
                                <p className="text-brand-text-soft/80 text-lg leading-relaxed whitespace-pre-line">
                                    {challenges}
                                </p>
                            </div>
                        )}

                        {bottlenecks && (
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-brand-text-soft/30 transition-colors duration-300">
                                <h4 className="text-xl font-bold text-brand-text-soft mb-4 font-heading">System Bottlenecks</h4>
                                <p className="text-brand-text-soft/80 text-lg leading-relaxed whitespace-pre-line">
                                    {bottlenecks}
                                </p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </section>
    );
}
