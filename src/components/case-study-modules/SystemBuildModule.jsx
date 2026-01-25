import React from 'react';
import { Share2, Zap, Settings } from 'lucide-react';

export default function SystemBuildModule({ ecosystem, automation }) {
    if (!ecosystem && !automation) return null;

    return (
        <section className="bg-black py-24 px-6 md:px-16">
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 gap-16">

                    {/* Ecosystem */}
                    {ecosystem && (
                        <div className="relative group">
                            <div className="absolute inset-0 bg-blue-500/5 blur-3xl group-hover:bg-blue-500/10 transition-colors"></div>
                            <div className="relative z-10 border-l-2 border-blue-500 pl-8 py-2">
                                <div className="flex items-center gap-3 text-blue-400 mb-6">
                                    <Share2 size={28} />
                                    <h3 className="text-3xl font-bold text-white">The Ecosystem</h3>
                                </div>
                                <p className="text-gray-400 text-lg leading-relaxed whitespace-pre-line">
                                    {ecosystem}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Automation */}
                    {automation && (
                        <div className="relative group">
                            <div className="absolute inset-0 bg-purple-500/5 blur-3xl group-hover:bg-purple-500/10 transition-colors"></div>
                            <div className="relative z-10 border-l-2 border-purple-500 pl-8 py-2">
                                <div className="flex items-center gap-3 text-purple-400 mb-6">
                                    <Zap size={28} />
                                    <h3 className="text-3xl font-bold text-white">Automation Layer</h3>
                                </div>
                                <p className="text-gray-400 text-lg leading-relaxed whitespace-pre-line">
                                    {automation}
                                </p>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </section>
    );
}
