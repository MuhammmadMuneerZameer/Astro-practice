import React from 'react';
import { MessageSquare, Quote } from 'lucide-react';

export default function TestimonialModule({ quote, author, role }) {
    if (!quote) return null;

    return (
        <section className="bg-gray-900 py-24 px-6 md:px-16 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 left-0 text-gray-800/20 pointer-events-none select-none">
                <Quote size={200} />
            </div>

            <div className="max-w-5xl mx-auto relative z-10 text-center">
                <div className="mb-8 flex justify-center">
                    <div className="p-4 bg-green-500/10 rounded-full text-green-400">
                        <MessageSquare size={32} />
                    </div>
                </div>

                <h2 className="text-3xl md:text-5xl font-serif text-white leading-tight mb-12">
                    "{quote}"
                </h2>

                <div className="flex flex-col items-center gap-2">
                    <p className="text-xl font-bold text-white">{author}</p>
                    <p className="text-green-400 font-medium tracking-wide uppercase text-sm">{role}</p>
                </div>
            </div>
        </section>
    );
}
