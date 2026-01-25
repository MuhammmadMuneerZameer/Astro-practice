import React from 'react';
import { Fingerprint, Palette, Users, Target } from 'lucide-react';

export default function BrandIdentityModule({ brandBio, visualIdentity, marketPos, persona }) {
    const cards = [
        {
            title: "The Brand DNA",
            icon: Fingerprint,
            content: brandBio,
            color: "blue"
        },
        {
            title: "Visual Identity",
            icon: Palette,
            content: visualIdentity,
            color: "purple"
        },
        {
            title: "Market Position",
            icon: Target,
            content: marketPos,
            color: "green"
        },
        {
            title: "Audience Persona",
            icon: Users,
            content: persona,
            color: "orange"
        }
    ];

    return (
        <section className="bg-black py-24 px-6 md:px-16 border-t border-gray-900">
            <div className="max-w-7xl mx-auto">
                <div className="mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Deconstructing the Brand</h2>
                    <div className="w-24 h-1 bg-green-500 rounded-full"></div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {cards.map((card, idx) => (
                        card.content && (
                            <div
                                key={idx}
                                className="group p-8 md:p-10 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-gray-700 hover:bg-gray-900 transition-all duration-300"
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-${card.color}-500/10 text-${card.color}-400 group-hover:scale-110 transition-transform`}>
                                    <card.icon size={24} />
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">{card.title}</h3>
                                <p className="text-gray-400 leading-relaxed text-lg whitespace-pre-line">
                                    {card.content}
                                </p>
                            </div>
                        )
                    ))}
                </div>
            </div>
        </section>
    );
}
