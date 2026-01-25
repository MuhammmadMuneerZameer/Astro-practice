import React from 'react';
import { TrendingUp, DollarSign, Activity } from 'lucide-react';

export default function MarketImpactModule({ revenueImpact, kpis }) {
    if (!revenueImpact && (!kpis || kpis.length === 0)) return null;

    return (
        <section className="bg-gradient-to-b from-gray-900 to-black py-24 px-6 md:px-16">
            <div className="max-w-7xl mx-auto text-center">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-16">The Market Impact</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                    {revenueImpact && (
                        <div className="col-span-1 md:col-span-2 lg:col-span-4 bg-green-500/10 border border-green-500/20 p-8 rounded-2xl mb-8">
                            <div className="flex items-center justify-center gap-3 text-green-400 mb-4">
                                <DollarSign size={32} />
                                <h3 className="text-xl font-bold uppercase tracking-widest">Revenue Impact</h3>
                            </div>
                            <p className="text-4xl md:text-6xl font-bold text-white">{revenueImpact}</p>
                        </div>
                    )}

                    {kpis && kpis.map((kpi, idx) => (
                        kpi.value && (
                            <div key={idx} className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700 hover:border-green-500/50 transition-colors">
                                <h4 className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-4">{kpi.label}</h4>
                                <p className="text-3xl md:text-5xl font-bold text-white mb-2">{kpi.value}</p>
                                <div className="w-12 h-1 bg-green-500 rounded-full mx-auto"></div>
                            </div>
                        )
                    ))}

                </div>
            </div>
        </section>
    );
}
