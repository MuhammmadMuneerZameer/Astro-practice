import React from 'react';
import { Map, Lightbulb, Search } from 'lucide-react';

export default function MarketRealityModule({ marketMap, competitors, insights }) {
    if (!marketMap && !insights) return null;

    return (
        <section className="bg-gray-950 py-24 px-6 md:px-16">
            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-24">

                    {/* Header */}
                    <div className="lg:col-span-4">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">The Market Reality</h2>
                        <p className="text-xl text-gray-400 leading-relaxed mb-8">
                            Before building, we analyzed the landscape to find the gaps others missed.
                        </p>
                        <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl">
                            <h4 className="flex items-center gap-2 text-red-400 font-bold mb-2">
                                <Search size={18} />
                                Key Insight
                            </h4>
                            <p className="text-gray-300 text-sm md:text-base">
                                {insights || "Market analysis revealed a crucial opportunity for differentiation."}
                            </p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-8 space-y-12">

                        {/* Market Map */}
                        {marketMap && (
                            <div className="relative pl-8 border-l-2 border-gray-800 hover:border-green-500 transition-colors duration-500">
                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-gray-800 border-4 border-black group-hover:bg-green-500"></div>
                                <h3 className="flex items-center gap-3 text-2xl font-bold text-white mb-4">
                                    <Map className="text-blue-400" size={24} />
                                    Landscape Analysis
                                </h3>
                                <p className="text-gray-400 text-lg leading-relaxed whitespace-pre-line">
                                    {marketMap}
                                </p>
                            </div>
                        )}

                        {/* Competitors */}
                        <div className="relative pl-8 border-l-2 border-gray-800 hover:border-green-500 transition-colors duration-500">
                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-gray-800 border-4 border-black group-hover:bg-green-500"></div>
                            <h3 className="flex items-center gap-3 text-2xl font-bold text-white mb-4">
                                <Lightbulb className="text-yellow-400" size={24} />
                                The Opportunity Gap
                            </h3>
                            <p className="text-gray-400 text-lg leading-relaxed whitespace-pre-line">
                                {competitors || "We identified white space in the market where competitors were falling short on user experience and brand promise."}
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
