import React from 'react';
import { AlertCircle, XCircle } from 'lucide-react';

export default function GrowthBlockModule({ challenges, bottlenecks }) {
    return (
        <section className="bg-black py-24 px-6 md:px-16 relative overflow-hidden">
            {/* Abstract Background Element */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-red-900/5 to-transparent pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row gap-16">

                    <div className="md:w-1/3">
                        <h2 className="text-7xl font-bold text-gray-800 select-none mb-4 opacity-50">STOP</h2>
                        <h3 className="text-3xl md:text-5xl font-bold text-white mb-6">Growth Blockers</h3>
                        <p className="text-gray-400 text-lg">
                            Identifying the friction points that were holding the brand back from its true potential.
                        </p>
                    </div>

                    <div className="md:w-2/3 space-y-8">
                        {challenges && (
                            <div className="bg-gray-900 border-l-4 border-red-500 p-8 rounded-r-xl shadow-xl">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-red-500/10 rounded-full text-red-400 mt-1">
                                        <AlertCircle size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-white mb-3">Core Challenges</h4>
                                        <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-line">
                                            {challenges}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {bottlenecks && (
                            <div className="bg-gray-900 border-l-4 border-orange-500 p-8 rounded-r-xl shadow-xl">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-orange-500/10 rounded-full text-orange-400 mt-1">
                                        <XCircle size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-white mb-3">System Bottlenecks</h4>
                                        <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-line">
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
