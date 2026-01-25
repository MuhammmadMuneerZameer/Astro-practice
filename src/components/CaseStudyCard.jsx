import React from 'react';
import { Briefcase, Clock, ExternalLink } from 'lucide-react';
import { getServiceDisplayName } from '../data/caseStudies';

export default function CaseStudyCard({ caseStudy, compact = false }) {
    if (compact) {
        return (
            <div className="bg-black/60 backdrop-blur-lg border border-gray-800 rounded-xl overflow-hidden hover:border-green-500/30 transition-all group">
                <div className="aspect-video overflow-hidden">
                    <img
                        src={caseStudy.image}
                        alt={caseStudy.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                </div>
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs border border-purple-500/30">
                            {getServiceDisplayName(caseStudy.service)}
                        </span>
                        {caseStudy.duration && (
                            <span className="flex items-center gap-1 text-gray-400 text-xs">
                                <Clock size={12} />
                                {caseStudy.duration}
                            </span>
                        )}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">
                        {caseStudy.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-3">
                        Client: <span className="text-gray-300">{caseStudy.client}</span>
                    </p>
                    {caseStudy.challenge && (
                        <p className="text-gray-400 text-sm line-clamp-2">
                            {caseStudy.challenge}
                        </p>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-black/60 backdrop-blur-lg border border-gray-800 rounded-xl overflow-hidden hover:border-green-500/30 transition-all group">
            <div className="grid md:grid-cols-2 gap-6">
                <div className="aspect-video md:aspect-auto overflow-hidden">
                    <img
                        src={caseStudy.image}
                        alt={caseStudy.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                </div>
                <div className="p-6 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs border border-purple-500/30">
                            {getServiceDisplayName(caseStudy.service)}
                        </span>
                        {caseStudy.duration && (
                            <span className="flex items-center gap-1 text-gray-400 text-xs">
                                <Clock size={12} />
                                {caseStudy.duration}
                            </span>
                        )}
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors">
                        {caseStudy.title}
                    </h3>

                    <p className="text-gray-400 text-sm mb-4">
                        Client: <span className="text-gray-300 font-semibold">{caseStudy.client}</span>
                    </p>

                    {caseStudy.challenge && (
                        <div className="mb-4">
                            <h4 className="text-green-400 font-semibold text-sm mb-2">Challenge</h4>
                            <p className="text-gray-400 text-sm line-clamp-3">
                                {caseStudy.challenge}
                            </p>
                        </div>
                    )}

                    {caseStudy.technologies && caseStudy.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {caseStudy.technologies.slice(0, 4).map((tech, idx) => (
                                <span
                                    key={idx}
                                    className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs border border-blue-500/30"
                                >
                                    {tech}
                                </span>
                            ))}
                            {caseStudy.technologies.length > 4 && (
                                <span className="px-2 py-1 text-gray-400 text-xs">
                                    +{caseStudy.technologies.length - 4} more
                                </span>
                            )}
                        </div>
                    )}

                    <a
                        href={`/case-studies/${caseStudy.slug}`}
                        className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 font-semibold transition-colors"
                    >
                        View Case Study
                        <ExternalLink size={16} />
                    </a>
                </div>
            </div>
        </div>
    );
}
