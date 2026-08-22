import React, { useState, useEffect, useCallback } from 'react';
import { getAuth } from 'firebase/auth';
import { app } from '../lib/firebase';
import {
    PlusCircle, Trash2, Edit, Save, X, AlertCircle,
    Upload, Link2, Loader, Check, Image as ImageIcon,
    Star, Briefcase, Target, Lightbulb, TrendingUp, Clock,
    Layout, Users, BarChart, Settings, Share2, MessageSquare,
    Zap, ChevronDown, ChevronUp
} from 'lucide-react';
import {
    collection, addDoc, updateDoc, deleteDoc, doc,
    onSnapshot, serverTimestamp, query, orderBy
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { SERVICES, getServiceDisplayName } from '../data/caseStudies';

const CONSTANTS = {
    COLLECTION_NAME: 'caseStudies',
    MAX_FILE_SIZE: 5 * 1024 * 1024,
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
    MESSAGE_TIMEOUT: 3000,
};

const INITIAL_FORM_STATE = {
    // 1. Hero Module
    title: '',
    subtitle: '',
    service: '', // Primary service (legacy)
    services: [], // Multi-service array
    client: '',
    industry: '',
    duration: '',
    heroImage: '',

    // 2. Brand Identity Module
    brandBio: '', // Brand DNA
    visualIdentity: '',
    marketPos: '', // Positioning
    persona: '',

    // 3. Market Reality Module
    marketMap: '',
    competitors: '',
    insights: '',

    // 4. Growth Block Module
    challenges: '',
    bottlenecks: '',

    // 5. Strategic Shift Module
    oldStrategy: '',
    newStrategy: '',

    // 6. System Build Module
    ecosystem: '', // Channel ecosystem
    automation: '',

    // 7. Execution Module
    tools: [], // Array of strings
    workflows: '',

    // 8. Market Impact Module
    revenueImpact: '',
    kpis: [{ label: '', value: '' }], // Array of metric objects

    // 9. Visual Proof Module
    galleryImages: [], // For dashboards, screenshots

    // 10. Testimonial Module
    testimonialQuote: '',
    testimonialAuthor: '',
    testimonialRole: '',

    // 11. Conversion Module
    bookingLink: '',

    // System Fields
    slug: '',
    featured: false,
    status: 'published',
    technologies: [] // Kept for compatibility
};

const generateSlug = (title) => {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
};

const validateImageFile = (file) => {
    if (!file) throw new Error('No file selected');
    if (!CONSTANTS.ALLOWED_IMAGE_TYPES.includes(file.type)) {
        throw new Error('Invalid file type. Please upload JPG, PNG, GIF, WEBP, or SVG');
    }
    if (file.size > CONSTANTS.MAX_FILE_SIZE) {
        throw new Error(`File size must be less than ${CONSTANTS.MAX_FILE_SIZE / (1024 * 1024)}MB`);
    }
    return true;
};

const uploadToImgBB = async (file) => {
    const token = await getAuth(app).currentUser?.getIdToken() ?? '';
    const formData = new FormData();
    formData.append('image', file);
    const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
    });

    if (!response.ok) throw new Error(`Upload failed with status: ${response.status}`);
    const data = await response.json();
    if (!data.success) throw new Error(data.error || 'Upload failed');
    return data.url;
};

// Collapsible Section Component
const FormSection = ({ title, icon: Icon, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="border border-gray-800 rounded-lg overflow-hidden mb-4">
            <button
                className="w-full flex items-center justify-between p-4 bg-gray-900/50 hover:bg-gray-900 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
                type="button"
            >
                <div className="flex items-center gap-2 font-semibold text-white">
                    <Icon size={18} className="text-green-400" />
                    {title}
                </div>
                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {isOpen && <div className="p-4 bg-black/30 border-t border-gray-800 space-y-4">{children}</div>}
        </div>
    );
};

export default function CaseStudyAdminPanel() {
    const [caseStudies, setCaseStudies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [uploadMethod, setUploadMethod] = useState('url');
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState(INITIAL_FORM_STATE);
    const [techInput, setTechInput] = useState('');
    const [toolInput, setToolInput] = useState('');
    const [filterService, setFilterService] = useState('all');

    // Load Data
    useEffect(() => {
        const caseStudiesCollection = collection(db, CONSTANTS.COLLECTION_NAME);
        const q = query(caseStudiesCollection, orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setCaseStudies(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        }, (err) => {
            console.error('Firebase Error:', err);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleInputChange = useCallback((field, value) => {
        setFormData(prev => {
            const updates = { [field]: value };
            if (field === 'title') updates.slug = generateSlug(value);
            return { ...prev, ...updates };
        });
    }, []);

    // Form Reset
    const resetForm = useCallback(() => {
        setFormData(INITIAL_FORM_STATE);
        setEditingId(null);
        setShowForm(false);
    }, []);

    // Edit Mode
    const openEditForm = useCallback((caseStudy) => {
        setFormData({ ...INITIAL_FORM_STATE, ...caseStudy });
        setEditingId(caseStudy.id);
        setShowForm(true);
    }, []);

    // KPI Management
    const addKPI = () => setFormData(prev => ({ ...prev, kpis: [...prev.kpis, { label: '', value: '' }] }));
    const updateKPI = (index, field, value) => {
        const newKpis = [...formData.kpis];
        newKpis[index][field] = value;
        setFormData(prev => ({ ...prev, kpis: newKpis }));
    };
    const removeKPI = (index) => {
        setFormData(prev => ({ ...prev, kpis: prev.kpis.filter((_, i) => i !== index) }));
    };

    // Image Helper
    const handleUpload = async (e, field) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        try {
            setUploading(true);
            setError('');

            // Validate all files first
            files.forEach(validateImageFile);

            // Upload all files concurrently
            const uploadPromises = files.map(file => uploadToImgBB(file));
            const uploadedUrls = await Promise.all(uploadPromises);

            if (field === 'galleryImages') {
                setFormData(prev => ({
                    ...prev,
                    galleryImages: [...prev.galleryImages, ...uploadedUrls]
                }));
                setSuccess(`✅ ${files.length} images uploaded!`);
            } else {
                // For single image fields, only take the first one
                setFormData(prev => ({ ...prev, [field]: uploadedUrls[0] }));
                setSuccess('✅ Image uploaded!');
            }
        } catch (err) {
            console.error('Upload error:', err);
            setError(err.message);
        } finally {
            setUploading(false);
            e.target.value = ''; // Reset input
        }
    };

    // Submission
    const handleSubmit = async () => {
        setSaving(true);
        try {
            const data = { ...formData, updatedAt: serverTimestamp() };
            if (editingId) {
                await updateDoc(doc(db, CONSTANTS.COLLECTION_NAME, editingId), data);
                setSuccess('Updated successfully');
            } else {
                data.createdAt = serverTimestamp();
                await addDoc(collection(db, CONSTANTS.COLLECTION_NAME), data);
                setSuccess('Created successfully');
            }
            resetForm();
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Delete this case study?')) {
            await deleteDoc(doc(db, CONSTANTS.COLLECTION_NAME, id));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Advanced Case Study System</h2>
                <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-green-500 text-black px-4 py-2 rounded-lg font-bold">
                    {showForm ? 'Cancel' : 'New Case Study'}
                </button>
            </div>

            {/* Messages */}
            {error && <div className="bg-red-900/30 text-red-400 p-4 rounded-lg">{error}</div>}
            {success && <div className="bg-green-900/30 text-green-400 p-4 rounded-lg">{success}</div>}

            {showForm ? (
                <div className="bg-black/80 backdrop-blur border border-green-500/20 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-white mb-6 border-b border-gray-800 pb-4">
                        {editingId ? 'Edit Case Study' : 'Create New Case Study'}
                    </h3>

                    {/* 1. Hero Module */}
                    <FormSection title="1. Hero Module" icon={Layout} defaultOpen={true}>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-gray-400">Title</label>
                                <input className="w-full bg-gray-900 border border-gray-700 p-2 rounded text-white"
                                    value={formData.title} onChange={e => handleInputChange('title', e.target.value)} />
                            </div>
                            <div>
                                <label className="text-sm text-gray-400">Subtitle</label>
                                <input className="w-full bg-gray-900 border border-gray-700 p-2 rounded text-white"
                                    value={formData.subtitle} onChange={e => handleInputChange('subtitle', e.target.value)} />
                            </div>
                            <div>
                                <label className="text-sm text-gray-400 block mb-2">Service Categories (Select all that apply)</label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {Object.values(SERVICES).map(s => {
                                        const isSelected = formData.services?.includes(s) || formData.service === s;
                                        return (
                                            <button
                                                key={s}
                                                type="button"
                                                onClick={() => {
                                                    const currentServices = formData.services || [];
                                                    const newServices = currentServices.includes(s)
                                                        ? currentServices.filter(item => item !== s)
                                                        : [...currentServices, s];

                                                    // Update both array and primary legacy field
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        services: newServices,
                                                        service: newServices[0] || ''
                                                    }));
                                                }}
                                                className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${isSelected
                                                    ? 'bg-green-500 text-black border-green-500'
                                                    : 'bg-gray-900 text-gray-400 border-gray-700 hover:border-gray-500'
                                                    }`}
                                            >
                                                {getServiceDisplayName(s)}
                                                {isSelected && <span className="ml-1">✓</span>}
                                            </button>
                                        );
                                    })}
                                </div>
                                <div className="text-xs text-gray-500">
                                    Primary: {formData.service ? getServiceDisplayName(formData.service) : 'None'}
                                </div>
                            </div>
                            <div>
                                <label className="text-sm text-gray-400">Industry</label>
                                <input className="w-full bg-gray-900 border border-gray-700 p-2 rounded text-white"
                                    value={formData.industry} onChange={e => handleInputChange('industry', e.target.value)} />
                            </div>
                            <div>
                                <label className="text-sm text-gray-400">Client Name</label>
                                <input className="w-full bg-gray-900 border border-gray-700 p-2 rounded text-white"
                                    value={formData.client} onChange={e => handleInputChange('client', e.target.value)} />
                            </div>
                            <div>
                                <label className="text-sm text-gray-400">Duration</label>
                                <input className="w-full bg-gray-900 border border-gray-700 p-2 rounded text-white"
                                    value={formData.duration} onChange={e => handleInputChange('duration', e.target.value)} />
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-sm text-gray-400">Main Hero Image URL (Recommended: 1920x1080px, Max 5MB)</label>
                                <div className="flex gap-2">
                                    <input className="flex-1 bg-gray-900 border border-gray-700 p-2 rounded text-white"
                                        value={formData.heroImage || formData.image}
                                        onChange={e => {
                                            handleInputChange('heroImage', e.target.value);
                                            handleInputChange('image', e.target.value); // Sync for compatibility
                                        }}
                                        placeholder="https://..." />
                                    <div className="relative overflow-hidden">
                                        <button className="bg-gray-700 px-4 py-2 rounded text-white">Upload</button>
                                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleUpload(e, 'heroImage')} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FormSection>

                    {/* 2. Brand Identity */}
                    <FormSection title="2. Brand Identity Module" icon={Users}>
                        <div>
                            <label className="text-sm text-gray-400">Brand DNA / Bio</label>
                            <textarea className="w-full bg-gray-900 border border-gray-700 p-2 rounded text-white h-24"
                                value={formData.brandBio} onChange={e => handleInputChange('brandBio', e.target.value)} />
                        </div>
                        <div>
                            <label className="text-sm text-gray-400">Visual Identity Description</label>
                            <textarea className="w-full bg-gray-900 border border-gray-700 p-2 rounded text-white h-24"
                                value={formData.visualIdentity} onChange={e => handleInputChange('visualIdentity', e.target.value)} />
                        </div>
                    </FormSection>

                    {/* 3. Market Reality */}
                    <FormSection title="3. Market Reality Module" icon={BarChart}>
                        <div>
                            <label className="text-sm text-gray-400">Market Map / Context</label>
                            <textarea className="w-full bg-gray-900 border border-gray-700 p-2 rounded text-white h-20"
                                value={formData.marketMap} onChange={e => handleInputChange('marketMap', e.target.value)} />
                        </div>
                        <div>
                            <label className="text-sm text-gray-400">Consumer Insights</label>
                            <textarea className="w-full bg-gray-900 border border-gray-700 p-2 rounded text-white h-20"
                                value={formData.insights} onChange={e => handleInputChange('insights', e.target.value)} />
                        </div>
                    </FormSection>

                    {/* 4. Growth Block */}
                    <FormSection title="4. Growth Block (Challenges)" icon={Target}>
                        <div>
                            <label className="text-sm text-gray-400">Core Challenges</label>
                            <textarea className="w-full bg-gray-900 border border-gray-700 p-2 rounded text-white h-24"
                                value={formData.challenges} onChange={e => handleInputChange('challenges', e.target.value)} />
                        </div>
                        <div>
                            <label className="text-sm text-gray-400">Bottlenecks</label>
                            <textarea className="w-full bg-gray-900 border border-gray-700 p-2 rounded text-white h-24"
                                value={formData.bottlenecks} onChange={e => handleInputChange('bottlenecks', e.target.value)} />
                        </div>
                    </FormSection>

                    {/* 5. Strategic Shift */}
                    <FormSection title="5. Strategic Shift" icon={Lightbulb}>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-gray-400">Old Strategy</label>
                                <textarea className="w-full bg-gray-900 border border-gray-700 p-2 rounded text-white h-32"
                                    value={formData.oldStrategy} onChange={e => handleInputChange('oldStrategy', e.target.value)} />
                            </div>
                            <div>
                                <label className="text-sm text-gray-400">New Strategy (The Fix)</label>
                                <textarea className="w-full bg-gray-900 border border-gray-700 p-2 rounded text-white h-32 border-l-2 border-l-green-500"
                                    value={formData.newStrategy} onChange={e => handleInputChange('newStrategy', e.target.value)} />
                            </div>
                        </div>
                    </FormSection>

                    {/* 6. System Build */}
                    <FormSection title="6. System Build" icon={Settings}>
                        <div>
                            <label className="text-sm text-gray-400">Channel Ecosystem</label>
                            <textarea className="w-full bg-gray-900 border border-gray-700 p-2 rounded text-white h-24"
                                value={formData.ecosystem} onChange={e => handleInputChange('ecosystem', e.target.value)} />
                        </div>
                        <div>
                            <label className="text-sm text-gray-400">Automation Flows</label>
                            <textarea className="w-full bg-gray-900 border border-gray-700 p-2 rounded text-white h-24"
                                value={formData.automation} onChange={e => handleInputChange('automation', e.target.value)} />
                        </div>
                    </FormSection>

                    {/* 8. Market Impact */}
                    <FormSection title="8. Market Impact (KPIs)" icon={TrendingUp}>
                        <div className="mb-4">
                            <label className="text-sm text-gray-400">Revenue Impact Summary</label>
                            <input className="w-full bg-gray-900 border border-gray-700 p-2 rounded text-white"
                                value={formData.revenueImpact} onChange={e => handleInputChange('revenueImpact', e.target.value)}
                                placeholder="e.g. +$1.2M in 6 months" />
                        </div>

                        <label className="text-sm text-gray-400 block mb-2">Key Performance Indicators</label>
                        {formData.kpis.map((kpi, idx) => (
                            <div key={idx} className="flex gap-2 mb-2">
                                <input placeholder="Label (e.g. ROAS)" className="flex-1 bg-gray-900 border border-gray-700 p-2 rounded text-white"
                                    value={kpi.label} onChange={e => updateKPI(idx, 'label', e.target.value)} />
                                <input placeholder="Value (e.g. 4.5x)" className="flex-1 bg-gray-900 border border-gray-700 p-2 rounded text-white"
                                    value={kpi.value} onChange={e => updateKPI(idx, 'value', e.target.value)} />
                                <button onClick={() => removeKPI(idx)} className="text-red-400"><X /></button>
                            </div>
                        ))}
                        <button onClick={addKPI} className="text-sm text-green-400 flex items-center gap-1 mt-2">
                            <PlusCircle size={14} /> Add Metric
                        </button>
                    </FormSection>

                    {/* 9. Visual Proof */}
                    <FormSection title="9. Visual Proof (Gallery)" icon={ImageIcon}>
                        <div className="grid grid-cols-3 gap-4 mb-4">
                            {formData.galleryImages?.map((img, idx) => (
                                <div key={idx} className="relative aspect-video bg-gray-800 rounded overflow-hidden">
                                    <img src={img} className="w-full h-full object-cover" />
                                    <button onClick={() => {
                                        const newImages = formData.galleryImages.filter((_, i) => i !== idx);
                                        setFormData(prev => ({ ...prev, galleryImages: newImages }));
                                    }} className="absolute top-1 right-1 bg-red-500 rounded-full p-1"><X size={12} text="white" /></button>
                                </div>
                            ))}
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Add Images (Multiple allowed, Rec: 1920x1080px)</label>
                            <div className="relative inline-block">
                                <button className="bg-gray-700 px-4 py-2 rounded text-white flex items-center gap-2">
                                    <Upload size={16} /> Upload Images (Multiple)
                                </button>
                                <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={e => handleUpload(e, 'galleryImages')} />
                            </div>
                        </div>
                    </FormSection>

                    {/* 10. Testimonial */}
                    <FormSection title="10. Testimonial" icon={MessageSquare}>
                        <div className="space-y-4">
                            <textarea placeholder="Quote..." className="w-full bg-gray-900 border border-gray-700 p-2 rounded text-white h-20"
                                value={formData.testimonialQuote} onChange={e => handleInputChange('testimonialQuote', e.target.value)} />
                            <div className="grid grid-cols-2 gap-4">
                                <input placeholder="Author Name" className="bg-gray-900 border border-gray-700 p-2 rounded text-white"
                                    value={formData.testimonialAuthor} onChange={e => handleInputChange('testimonialAuthor', e.target.value)} />
                                <input placeholder="Role / Company" className="bg-gray-900 border border-gray-700 p-2 rounded text-white"
                                    value={formData.testimonialRole} onChange={e => handleInputChange('testimonialRole', e.target.value)} />
                            </div>
                        </div>
                    </FormSection>

                    {/* 11. Conversion */}
                    <FormSection title="11. Conversion Module" icon={Zap}>
                        <div>
                            <label className="text-sm text-gray-400">Booking / Contact Link</label>
                            <input className="w-full bg-gray-900 border border-gray-700 p-2 rounded text-white"
                                value={formData.bookingLink} onChange={e => handleInputChange('bookingLink', e.target.value)}
                                placeholder="https://cal.com/..." />
                        </div>
                    </FormSection>

                    <div className="flex gap-4 pt-6 mt-6 border-t border-gray-800">
                        <button onClick={handleSubmit} disabled={saving} className="flex-1 bg-green-500 hover:bg-green-600 text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2">
                            {saving ? <Loader className="animate-spin" /> : <Save size={20} />}
                            {editingId ? 'Update Case Study' : 'Publish Case Study'}
                        </button>
                        <button onClick={resetForm} className="bg-gray-800 text-white px-6 rounded-lg font-bold">Cancel</button>
                    </div>
                </div>
            ) : (
                <div className="grid gap-4">
                    {caseStudies.map(cs => (
                        <div key={cs.id} className="bg-gray-900/50 border border-gray-800 p-4 rounded-xl flex justify-between items-center">
                            <div className="flex gap-4 items-center">
                                {cs.heroImage && <img src={cs.heroImage} className="w-16 h-16 rounded object-cover" />}
                                <div>
                                    <h4 className="font-bold text-white text-lg">{cs.title}</h4>
                                    <div className="flex gap-2 text-sm text-gray-400">
                                        <span>{getServiceDisplayName(cs.service)}</span>
                                        <span>•</span>
                                        <span>{cs.client}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => openEditForm(cs)} className="p-2 bg-blue-500/20 text-blue-400 rounded"><Edit size={18} /></button>
                                <button onClick={() => handleDelete(cs.id)} className="p-2 bg-red-500/20 text-red-400 rounded"><Trash2 size={18} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
