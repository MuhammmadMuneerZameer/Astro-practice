import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getAuth } from 'firebase/auth';
import { app } from '../lib/firebase';
import {
    PlusCircle, Trash2, Edit, Save, X, AlertCircle,
    Upload, Link2, Loader, Check, Image as ImageIcon,
    ExternalLink, Tag, Hash
} from 'lucide-react';
import {
    collection, addDoc, updateDoc, deleteDoc, doc,
    onSnapshot, serverTimestamp, query, orderBy
} from 'firebase/firestore';
import { db } from '../lib/firebase';

const CONSTANTS = {
    COLLECTION_NAME: 'projects',
    MAX_FILE_SIZE: 5 * 1024 * 1024,
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
    MESSAGE_TIMEOUT: 3000,
};

const INITIAL_FORM_STATE = {
    title: '',
    description: '',
    image: '',
    technologies: [],
    link: '',
    slug: '',
    status: 'published'
};

// Utility functions
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

export default function ProjectAdminPanel() {
    const [projects, setProjects] = useState([]);
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

    // Auto-hide messages
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess(''), CONSTANTS.MESSAGE_TIMEOUT);
            return () => clearTimeout(timer);
        }
    }, [success]);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(''), CONSTANTS.MESSAGE_TIMEOUT);
            return () => clearTimeout(timer);
        }
    }, [error]);

    // Firebase real-time listener
    useEffect(() => {
        const projectsCollection = collection(db, CONSTANTS.COLLECTION_NAME);
        let queryRef;

        try {
            queryRef = query(projectsCollection, orderBy('createdAt', 'desc'));
        } catch (err) {
            queryRef = projectsCollection;
        }

        const unsubscribe = onSnapshot(
            queryRef,
            (snapshot) => {
                const projectsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setProjects(projectsList);
                setLoading(false);
                setError('');
            },
            (err) => {
                console.error('❌ Firebase listener error:', err);
                setError('Failed to load projects. Please check your Firebase connection.');
                setLoading(false);
            }
        );

        return () => {
            unsubscribe();
        };
    }, []);

    const handleInputChange = useCallback((field, value) => {
        setFormData(prev => {
            const updates = { [field]: value };
            if (field === 'title') {
                updates.slug = generateSlug(value);
            }
            return { ...prev, ...updates };
        });
    }, []);

    const resetForm = useCallback(() => {
        setFormData(INITIAL_FORM_STATE);
        setEditingId(null);
        setUploadMethod('url');
        setTechInput('');
        setError('');
        setSuccess('');
    }, []);

    const openEditForm = useCallback((project) => {
        setFormData({
            title: project.title || '',
            description: project.description || '',
            image: project.image || '',
            technologies: project.technologies || [],
            link: project.link || '',
            slug: project.slug || '',
            status: project.status || 'published'
        });
        setEditingId(project.id);
        setShowForm(true);
        setError('');
        setSuccess('');
    }, []);

    const toggleForm = useCallback(() => {
        if (showForm) resetForm();
        setShowForm(prev => !prev);
    }, [showForm, resetForm]);

    const handleImageUpload = useCallback(async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);
            setError('');
            validateImageFile(file);
            const imageUrl = await uploadToImgBB(file);
            setFormData(prev => ({ ...prev, image: imageUrl }));
            setSuccess('✅ Image uploaded successfully!');
        } catch (err) {
            console.error('❌ Image upload error:', err);
            setError(`Upload failed: ${err.message}`);
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    }, []);

    const handleAddTechnology = useCallback(() => {
        if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
            setFormData(prev => ({
                ...prev,
                technologies: [...prev.technologies, techInput.trim()]
            }));
            setTechInput('');
        }
    }, [techInput, formData.technologies]);

    const handleRemoveTechnology = useCallback((tech) => {
        setFormData(prev => ({
            ...prev,
            technologies: prev.technologies.filter(t => t !== tech)
        }));
    }, []);

    const handleSubmit = useCallback(async () => {
        try {
            setSaving(true);
            setError('');
            setSuccess('');

            if (!formData.title.trim()) {
                setError('Title is required');
                return;
            }
            if (!formData.description.trim()) {
                setError('Description is required');
                return;
            }
            if (!formData.image.trim()) {
                setError('Image is required');
                return;
            }

            const projectData = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                image: formData.image.trim(),
                technologies: formData.technologies,
                link: formData.link.trim() || '#',
                slug: formData.slug.trim(),
                status: formData.status,
                updatedAt: serverTimestamp()
            };

            if (editingId) {
                const projectRef = doc(db, CONSTANTS.COLLECTION_NAME, editingId);
                await updateDoc(projectRef, projectData);
                setSuccess('✅ Project updated successfully!');
            } else {
                projectData.createdAt = serverTimestamp();
                await addDoc(collection(db, CONSTANTS.COLLECTION_NAME), projectData);
                setSuccess('✅ Project created successfully!');
            }

            resetForm();
            setShowForm(false);

        } catch (err) {
            console.error('❌ Save error:', err);
            setError(`Failed to save: ${err.message}`);
        } finally {
            setSaving(false);
        }
    }, [formData, editingId, resetForm]);

    const handleDelete = useCallback(async (id) => {
        if (!window.confirm('⚠️ Are you sure you want to delete this project? This action cannot be undone.')) {
            return;
        }

        try {
            await deleteDoc(doc(db, CONSTANTS.COLLECTION_NAME, id));
            setSuccess('✅ Project deleted successfully!');
        } catch (err) {
            console.error('❌ Delete error:', err);
            setError(`Failed to delete: ${err.message}`);
        }
    }, []);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Projects Management</h2>
                <button
                    onClick={toggleForm}
                    disabled={saving || uploading}
                    className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-black font-semibold rounded-lg transition-all disabled:opacity-50"
                >
                    {showForm ? <X size={20} /> : <PlusCircle size={20} />}
                    {showForm ? 'Cancel' : 'Add Project'}
                </button>
            </div>

            {/* Messages */}
            {success && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 flex items-start gap-3">
                    <Check className="text-green-400 flex-shrink-0 mt-0.5" size={20} />
                    <p className="text-green-200 flex-1">{success}</p>
                    <button onClick={() => setSuccess('')} className="text-green-400 hover:text-green-300">
                        <X size={18} />
                    </button>
                </div>
            )}

            {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
                    <p className="text-red-200 flex-1">{error}</p>
                    <button onClick={() => setError('')} className="text-red-400 hover:text-red-300">
                        <X size={18} />
                    </button>
                </div>
            )}

            {/* Form */}
            {showForm && (
                <div className="bg-black/80 backdrop-blur-lg rounded-xl p-8 border border-green-500/20 shadow-2xl">
                    <h3 className="text-2xl font-bold text-white mb-6">
                        {editingId ? 'Edit Project' : 'Create New Project'}
                    </h3>

                    <div className="space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-semibold text-white mb-2">Title *</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                                placeholder="Enter project title..."
                                className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-white placeholder-gray-400"
                                disabled={saving || uploading}
                            />
                        </div>

                        {/* Slug */}
                        <div>
                            <label className="block text-sm font-semibold text-white mb-2">Slug (URL-friendly)</label>
                            <input
                                type="text"
                                value={formData.slug}
                                onChange={(e) => handleInputChange('slug', e.target.value)}
                                placeholder="auto-generated-from-title"
                                className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-white placeholder-gray-400 font-mono text-sm"
                                disabled={saving || uploading}
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold text-white mb-2">Description *</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                placeholder="Describe the project..."
                                rows={4}
                                className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-white placeholder-gray-400 resize-none"
                                disabled={saving || uploading}
                            />
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-semibold text-white mb-2">Project Image *</label>

                            <div className="flex gap-2 mb-3">
                                <button
                                    type="button"
                                    onClick={() => setUploadMethod('url')}
                                    disabled={saving || uploading}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50 ${uploadMethod === 'url' ? 'bg-green-500 text-black' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        }`}
                                >
                                    <Link2 size={14} className="inline mr-1" />
                                    Image URL
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setUploadMethod('upload')}
                                    disabled={saving || uploading}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50 ${uploadMethod === 'upload' ? 'bg-green-500 text-black' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        }`}
                                >
                                    <Upload size={14} className="inline mr-1" />
                                    Upload File
                                </button>
                            </div>

                            {uploadMethod === 'url' ? (
                                <input
                                    type="url"
                                    value={formData.image}
                                    onChange={(e) => handleInputChange('image', e.target.value)}
                                    placeholder="https://example.com/image.jpg"
                                    className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-white placeholder-gray-400"
                                    disabled={saving || uploading}
                                />
                            ) : (
                                <div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-500 file:text-black hover:file:bg-green-600 file:cursor-pointer disabled:opacity-50"
                                        disabled={uploading || saving}
                                    />
                                    <p className="text-xs text-gray-400 mt-1">
                                        {uploading ? 'Uploading...' : 'Max 5MB. Supports JPG, PNG, GIF, WEBP, SVG.'}
                                    </p>
                                </div>
                            )}

                            {formData.image && (
                                <div className="mt-4 relative">
                                    <img src={formData.image} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                                    <button
                                        onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                                        className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 rounded-full text-white"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Technologies */}
                        <div>
                            <label className="block text-sm font-semibold text-white mb-2">Technologies</label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={techInput}
                                    onChange={(e) => setTechInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTechnology())}
                                    placeholder="Add technology (e.g., React)"
                                    className="flex-1 px-4 py-3 bg-black/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-white placeholder-gray-400"
                                    disabled={saving || uploading}
                                />
                                <button
                                    type="button"
                                    onClick={handleAddTechnology}
                                    className="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all"
                                    disabled={saving || uploading}
                                >
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.technologies.map((tech, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm border border-blue-500/30"
                                    >
                                        {tech}
                                        <button onClick={() => handleRemoveTechnology(tech)} className="hover:text-blue-100">
                                            <X size={14} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Link */}
                        <div>
                            <label className="block text-sm font-semibold text-white mb-2">Project Link</label>
                            <input
                                type="url"
                                value={formData.link}
                                onChange={(e) => handleInputChange('link', e.target.value)}
                                placeholder="https://project-demo.com"
                                className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-white placeholder-gray-400"
                                disabled={saving || uploading}
                            />
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-sm font-semibold text-white mb-2">Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => handleInputChange('status', e.target.value)}
                                className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-white"
                                disabled={saving || uploading}
                            >
                                <option value="published">Published</option>
                                <option value="draft">Draft</option>
                            </select>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4 pt-6 border-t border-gray-700">
                            <button
                                onClick={handleSubmit}
                                disabled={saving || uploading}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-black font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? (
                                    <>
                                        <Loader className="animate-spin" size={20} />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save size={20} />
                                        {editingId ? 'Update Project' : 'Create Project'}
                                    </>
                                )}
                            </button>
                            <button
                                onClick={toggleForm}
                                disabled={saving || uploading}
                                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Projects List */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader className="animate-spin text-green-400 mb-4" size={48} />
                    <p className="text-gray-400">Loading projects...</p>
                </div>
            ) : projects.length === 0 ? (
                <div className="text-center py-20">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-800 mb-6">
                        <ImageIcon className="text-gray-400" size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">No Projects Yet</h3>
                    <p className="text-gray-400 mb-8">Create your first project to showcase your work!</p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-black font-semibold rounded-lg transition-all"
                    >
                        <PlusCircle size={20} />
                        Create Your First Project
                    </button>
                </div>
            ) : (
                <>
                    <div className="mb-6">
                        <h3 className="text-xl font-bold text-white">
                            All Projects <span className="text-gray-400">({projects.length})</span>
                        </h3>
                    </div>

                    <div className="grid gap-6">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                className="bg-black/60 backdrop-blur-lg border border-gray-800 rounded-xl overflow-hidden hover:border-green-500/30 transition-all group"
                            >
                                <div className="flex flex-col md:flex-row gap-6 p-6">
                                    {project.image && (
                                        <div className="md:w-48 h-32 flex-shrink-0">
                                            <img
                                                src={project.image}
                                                alt={project.title}
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        </div>
                                    )}

                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h4 className="text-xl font-bold text-white mb-2">{project.title}</h4>
                                                <p className="text-gray-400 text-sm mb-3">{project.description}</p>

                                                {project.technologies && project.technologies.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mb-2">
                                                        {project.technologies.map((tech, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs border border-blue-500/30"
                                                            >
                                                                {tech}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}

                                                {project.link && project.link !== '#' && (
                                                    <a
                                                        href={project.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 text-green-400 hover:text-green-300 text-sm"
                                                    >
                                                        <ExternalLink size={14} />
                                                        View Project
                                                    </a>
                                                )}
                                            </div>

                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${project.status === 'published'
                                                    ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                                                    : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                                                }`}>
                                                {project.status}
                                            </span>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => openEditForm(project)}
                                                className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-all text-sm"
                                            >
                                                <Edit size={16} />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(project.id)}
                                                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-all text-sm"
                                            >
                                                <Trash2 size={16} />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
