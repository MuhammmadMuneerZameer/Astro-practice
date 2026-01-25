import React, { useState, useEffect } from 'react';
import { Loader } from 'lucide-react';
import CaseStudyCard from './CaseStudyCard';
import { getCaseStudiesByService } from '../data/caseStudies';

export default function ServiceCaseStudies({ service, title, limit = 3 }) {
    const [caseStudies, setCaseStudies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCaseStudies() {
            try {
                setLoading(true);
                const data = await getCaseStudiesByService(service);
                setCaseStudies(data.slice(0, limit));
            } catch (error) {
                console.error('Error fetching case studies:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchCaseStudies();
    }, [service, limit]);

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <Loader className="animate-spin text-green-400" size={32} />
            </div>
        );
    }

    if (caseStudies.length === 0) {
        return null; // Don't show anything if no case studies for this service
    }

    return (
        <div className="py-16 px-4 md:px-16 bg-black">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-green-300">
                    {title || 'Case Studies'}
                </h2>

                <div className="grid md:grid-cols-1 gap-8">
                    {caseStudies.map((caseStudy) => (
                        <CaseStudyCard key={caseStudy.id} caseStudy={caseStudy} />
                    ))}
                </div>

                {caseStudies.length > 0 && (
                    <div className="text-center mt-12">
                        <a
                            href="/case-studies"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-green-500 hover:bg-green-600 text-black font-semibold rounded-full transition-all"
                        >
                            View All Case Studies
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
