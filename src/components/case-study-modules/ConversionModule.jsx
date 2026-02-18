import React from 'react';
import { ArrowRight, Calendar, Layers } from 'lucide-react';

export default function ConversionModule({ bookingLink, services = [] }) {
    // If we have multiple services, we highlight the "Stack" value
    const isStack = services.length > 1;

    return (
        <section className="bg-black py-32 px-6 md:px-16 border-t border-gray-900 overflow-hidden relative">
            {/* Background Decor */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-500/5 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="max-w-4xl mx-auto text-center relative z-10">

                {/* Upsell Indicator: Service Stack */}
                {isStack && (
                    <div className="flex justify-center mb-8">
                        <div className="inline-flex items-center gap-3 px-4 py-2 bg-gray-900/80 backdrop-blur border border-gray-800 rounded-full animate-fade-in-up">
                            <Layers size={16} className="text-green-400" />
                            <span className="text-gray-300 text-sm font-medium">Power Component Stack:</span>
                            <div className="flex gap-2">
                                {services.map((s, i) => (
                                    <span key={i} className="text-white font-bold text-sm uppercase tracking-wider">{s}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
                    {isStack
                        ? <span>Ready to deploy this <span className="text-green-500">System?</span></span>
                        : <span>Ready to build your <span className="text-green-500">Growth Engine?</span></span>
                    }
                </h2>

                {isStack ? (
                    <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
                        This client used a combination of <strong>{services.join(' + ')}</strong> to dominate their market. We can build the same integrated ecosystem for you.
                    </p>
                ) : (
                    <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
                        We don't just design websites. We engineer growth systems for lifestyle brands that want results like these.
                    </p>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <a
                        href={bookingLink || "/contact/"}
                        className="w-full sm:w-auto px-8 py-5 bg-green-500 hover:bg-green-400 text-black font-bold text-lg rounded-full transition-all hover:scale-105 flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(34,197,94,0.3)]"
                    >
                        <Calendar size={20} />
                        Book a System Audit
                    </a>

                    <a
                        href="/case-studies"
                        className="w-full sm:w-auto px-8 py-5 bg-gray-900 hover:bg-gray-800 text-white font-bold text-lg rounded-full transition-all border border-gray-700 flex items-center justify-center gap-3"
                    >
                        View More Stacks
                        <ArrowRight size={20} />
                    </a>
                </div>
            </div>
        </section>
    );
}
