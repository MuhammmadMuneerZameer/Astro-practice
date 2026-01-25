import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function VisualProofModule({ galleryImages }) {
    if (!galleryImages || galleryImages.length === 0) return null;

    const [selectedImage, setSelectedImage] = useState(null);

    return (
        <section className="bg-black py-24 px-6 md:px-16">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-12">Visual Proof</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {galleryImages.map((img, idx) => (
                        <div
                            key={idx}
                            className={`relative group cursor-pointer overflow-hidden rounded-xl ${idx === 0 ? 'md:col-span-2 md:row-span-2' : 'col-span-1'
                                }`}
                            onClick={() => setSelectedImage(img)}
                        >
                            <img
                                src={img}
                                alt={`Proof ${idx + 1}`}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <span className="text-white font-medium border border-white/30 px-4 py-2 rounded-full backdrop-blur-md">View Fullscreen</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Lightbox */}
            {selectedImage && (
                <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
                    <button className="absolute top-6 right-6 text-white bg-white/10 p-2 rounded-full hover:bg-white/20">
                        <X size={24} />
                    </button>
                    <img src={selectedImage} alt="Fullscreen" className="max-w-full max-h-[90vh] rounded-lg shadow-2xl" />
                </div>
            )}
        </section>
    );
}
