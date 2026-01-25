import React from 'react';
import { ArrowRight, History, Rocket } from 'lucide-react';

export default function StrategicShiftModule({ oldStrategy, newStrategy }) {
    if (!oldStrategy || !newStrategy) return null;

    return (
        <section className="bg-gray-950 py-24 px-6 md:px-16">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">The Strategic Pivot</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        We moved from reactive tactics to a proactive, system-led growth engine.
                    </p>
                </div>

                <div className="grid md:grid-cols-12 gap-8 items-center">
                    {/* Old Strategy (Left) */}
                    <div className="md:col-span-5 bg-gray-900/50 p-8 rounded-2xl border border-gray-800 opacity-70 hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-3 mb-6 text-gray-500">
                            <History size={24} />
                            <h3 className="text-2xl font-bold font-mono">OLD MODEL</h3>
                        </div>
                        <p className="text-gray-400 leading-relaxed text-lg whitespace-pre-line">
                            {oldStrategy}
                        </p>
                    </div>

                    {/* Arrow (Center) */}
                    <div className="md:col-span-2 flex justify-center py-6 md:py-0">
                        <div className="p-4 bg-green-500/10 rounded-full text-green-400">
                            <ArrowRight size={32} className="rotate-90 md:rotate-0" />
                        </div>
                    </div>

                    {/* New Strategy (Right) */}
                    <div className="md:col-span-5 bg-gradient-to-br from-green-900/20 to-gray-900 border border-green-500/30 p-10 rounded-2xl shadow-[0_0_30px_rgba(34,197,94,0.1)] relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-green-300"></div>

                        <div className="flex items-center gap-3 mb-6 text-green-400">
                            <Rocket size={24} />
                            <h3 className="text-2xl font-bold font-mono">NEW ENGINE</h3>
                        </div>
                        <p className="text-white leading-relaxed text-lg font-medium whitespace-pre-line">
                            {newStrategy}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
