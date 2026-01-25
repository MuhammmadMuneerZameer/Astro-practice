import React from 'react';
import { ArrowRight, Calendar } from 'lucide-react';

export default function ConversionModule({ bookingLink }) {
    return (
        <section className="bg-black py-32 px-6 md:px-16 border-t border-gray-900">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
                    Ready to build your <span className="text-green-500">System?</span>
                </h2>

                <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
                    We don't just design websites. We engineer growth systems for lifestyle brands that want to dominate their market.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <a
                        href={bookingLink || "/ContactUs"}
                        className="w-full sm:w-auto px-8 py-5 bg-green-500 hover:bg-green-400 text-black font-bold text-lg rounded-full transition-all hover:scale-105 flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(34,197,94,0.3)]"
                    >
                        <Calendar size={20} />
                        Book a Strategy Call
                    </a>

                    <a
                        href="/case-studies"
                        className="w-full sm:w-auto px-8 py-5 bg-gray-900 hover:bg-gray-800 text-white font-bold text-lg rounded-full transition-all border border-gray-700 flex items-center justify-center gap-3"
                    >
                        View More Case Studies
                        <ArrowRight size={20} />
                    </a>
                </div>
            </div>
        </section>
    );
}
