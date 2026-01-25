import React, { useState } from 'react';
import { FileText, Briefcase, FolderOpen } from 'lucide-react';
import BlogAdminDashboard from './BlogAdminDashboard';
import ProjectAdminPanel from './ProjectAdminPanel';
import CaseStudyAdminPanel from './CaseStudyAdminPanel';

export default function UnifiedAdminDashboard() {
    const [activeTab, setActiveTab] = useState('blogs');

    const tabs = [
        { id: 'blogs', label: 'Blog Posts', icon: FileText, component: BlogAdminDashboard },
        { id: 'projects', label: 'Projects', icon: FolderOpen, component: ProjectAdminPanel },
        { id: 'case-studies', label: 'Case Studies', icon: Briefcase, component: CaseStudyAdminPanel },
    ];

    const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header Section */}
            <section className="relative w-full h-[300px] flex flex-col items-center justify-center bg-black text-white">
                <div className="absolute inset-0 z-0 bg-gradient-to-br from-green-500/5 via-transparent to-green-400/5"></div>

                <div className="relative z-10 px-4 mt-24 text-center">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-6 pt-24 text-green-300">
                        Content Management Dashboard
                    </h1>
                    <p className="text-gray-300 mb-8 max-w-2xl mx-auto text-sm sm:text-base">
                        Manage your blog posts, projects, and case studies with real-time updates 🔥
                    </p>
                </div>
            </section>

            {/* Tab Navigation */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex flex-wrap gap-4 mb-8 border-b border-gray-800 pb-4">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-t-lg font-semibold transition-all ${activeTab === tab.id
                                        ? 'bg-green-500 text-black shadow-lg'
                                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                    }`}
                            >
                                <Icon size={20} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Active Tab Content */}
                <div className="min-h-[600px]">
                    {ActiveComponent && <ActiveComponent />}
                </div>
            </div>
        </div>
    );
}
