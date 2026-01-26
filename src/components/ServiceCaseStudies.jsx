import React, { useState, useEffect } from 'react';
import { Loader } from 'lucide-react';
import CaseStudyCard from './CaseStudyCard';
import { getCaseStudiesByService } from '../data/caseStudies';
import Button from './ui/Button';

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
                        <CaseStudyCard key={caseStudy.id} study={caseStudy} />
                    ))}
                </div>

                {caseStudies.length > 0 && (
                    <div className="text-center mt-12">
                        <Button
                            href="/case-studies"
                            variant="primary"
                        >
                            View All Case Studies
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
