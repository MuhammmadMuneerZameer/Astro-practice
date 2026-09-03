import React, { useState, useEffect, useCallback } from 'react';
import {
    PlusCircle, Trash2, Edit, Save, X, Loader,
    Check, MessageSquare, Eye, EyeOff
} from 'lucide-react';
import {
    collection, addDoc, updateDoc, deleteDoc, doc,
    onSnapshot, serverTimestamp, query, orderBy
} from 'firebase/firestore';
import { db } from '../lib/firebase';

const COLLECTION = 'testimonials';
const MSG_TIMEOUT = 3000;

const BLANK = {
    quote: '',
    name: '',
    title: '',
    company: '',
    platform: 'Direct',
    platformHref: '',
    metricValue: '',
    metricLabel: '',
    active: true,
    order: 0,
};

const PLATFORMS = ['Direct', 'Clutch', 'Google', 'LinkedIn', 'Facebook', 'Other'];

function StatusMessage({ message, type }) {
    if (!message) return null;
    return (
        <div className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium ${
            type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20'
            : type === 'error'   ? 'bg-red-500/10 text-red-400 border border-red-500/20'
            : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
        }`}>
            {type === 'success' ? <Check size={16} /> : type === 'error' ? <X size={16} /> : <Loader size={16} className="animate-spin" />}
            {message}
        </div>
    );
}

function FieldLabel({ children, required }) {
    return (
        <label className="block text-xs font-mono tracking-widest text-gray-500 uppercase mb-1.5">
            {children}{required && <span className="text-green-400 ml-1">*</span>}
        </label>
    );
}

function Input({ value, onChange, placeholder, type = 'text' }) {
    return (
        <input
            type={type}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-gray-900 border border-gray-700 focus:border-green-500 rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-600 outline-none transition-colors"
        />
    );
}

function TextArea({ value, onChange, placeholder, rows = 4 }) {
    return (
        <textarea
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            className="w-full bg-gray-900 border border-gray-700 focus:border-green-500 rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-600 outline-none transition-colors resize-vertical"
        />
    );
}

function TestimonialForm({ initial, onSave, onCancel, saving }) {
    const [form, setForm] = useState(initial || BLANK);

    const set = useCallback((key, val) => setForm(f => ({ ...f, [key]: val })), []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.quote.trim() || !form.name.trim()) return;
        onSave(form);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <FieldLabel required>Quote</FieldLabel>
                <TextArea
                    value={form.quote}
                    onChange={v => set('quote', v)}
                    placeholder="The verbatim quote from the client..."
                    rows={3}
                />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
                <div>
                    <FieldLabel required>Full Name</FieldLabel>
                    <Input value={form.name} onChange={v => set('name', v)} placeholder="Grace Younger" />
                </div>
                <div>
                    <FieldLabel>Title / Role</FieldLabel>
                    <Input value={form.title} onChange={v => set('title', v)} placeholder="Founder" />
                </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
                <div>
                    <FieldLabel>Company / Brand</FieldLabel>
                    <Input value={form.company} onChange={v => set('company', v)} placeholder="Brand Name" />
                </div>
                <div>
                    <FieldLabel>Platform</FieldLabel>
                    <select
                        value={form.platform}
                        onChange={e => set('platform', e.target.value)}
                        className="w-full bg-gray-900 border border-gray-700 focus:border-green-500 rounded-lg px-4 py-2.5 text-white text-sm outline-none transition-colors"
                    >
                        {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>
            </div>

            <div>
                <FieldLabel>Review URL (link to original — leave empty if not public)</FieldLabel>
                <Input
                    value={form.platformHref}
                    onChange={v => set('platformHref', v)}
                    placeholder="https://clutch.co/profile/..."
                    type="url"
                />
            </div>

            <div className="border border-white/10 rounded-xl p-4 bg-gray-900/30">
                <p className="text-xs font-mono tracking-widest text-gray-500 uppercase mb-4">Result metric (optional)</p>
                <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <FieldLabel>Number / Value</FieldLabel>
                        <Input value={form.metricValue} onChange={v => set('metricValue', v)} placeholder="3.1×  or  +42%  or  $120K/mo" />
                    </div>
                    <div>
                        <FieldLabel>What it means</FieldLabel>
                        <Input value={form.metricLabel} onChange={v => set('metricLabel', v)} placeholder="blended MER after 90 days" />
                    </div>
                </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
                <div>
                    <FieldLabel>Display order (lower = first)</FieldLabel>
                    <Input
                        value={String(form.order)}
                        onChange={v => set('order', Number(v) || 0)}
                        placeholder="0"
                        type="number"
                    />
                </div>
                <div className="flex items-end pb-0.5">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={form.active}
                            onChange={e => set('active', e.target.checked)}
                            className="accent-green-500 w-4 h-4"
                        />
                        <span className="text-sm text-gray-300">Visible on site</span>
                    </label>
                </div>
            </div>

            <div className="flex gap-3 pt-2">
                <button
                    type="submit"
                    disabled={saving || !form.quote.trim() || !form.name.trim()}
                    className="flex items-center gap-2 px-5 py-2.5 bg-green-500 hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold rounded-lg text-sm transition-colors"
                >
                    {saving ? <Loader size={15} className="animate-spin" /> : <Save size={15} />}
                    {saving ? 'Saving…' : 'Save testimonial'}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium rounded-lg text-sm transition-colors"
                >
                    <X size={15} />
                    Cancel
                </button>
            </div>
        </form>
    );
}

function TestimonialCard({ item, onEdit, onDelete, onToggleActive, deleting, toggling }) {
    return (
        <div className={`border rounded-xl p-6 transition-colors ${item.active ? 'border-white/10 bg-gray-900/20' : 'border-white/5 bg-gray-900/10 opacity-60'}`}>
            <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1 min-w-0">
                    {item.metricValue && (
                        <p className="font-bold text-2xl text-green-400 leading-none mb-1 tabular-nums">
                            {item.metricValue}
                            {item.metricLabel && <span className="text-gray-600 text-xs font-normal ml-2 font-mono">{item.metricLabel}</span>}
                        </p>
                    )}
                    <p className="text-gray-300 text-sm leading-relaxed mt-2 line-clamp-3">"{item.quote}"</p>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono tracking-widest uppercase ${item.active ? 'bg-green-500/10 text-green-400' : 'bg-gray-700 text-gray-500'}`}>
                        {item.active ? 'Live' : 'Hidden'}
                    </span>
                </div>
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-white/5 pt-4">
                <div>
                    <p className="text-white text-sm font-semibold">{item.name}</p>
                    <p className="text-gray-500 text-xs mt-0.5">
                        {[item.title, item.company].filter(Boolean).join(', ')}
                        {item.platform && <span className="ml-2 font-mono opacity-50">· {item.platform}</span>}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onToggleActive(item)}
                        disabled={toggling === item.id}
                        title={item.active ? 'Hide from site' : 'Show on site'}
                        className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                    >
                        {toggling === item.id
                            ? <Loader size={14} className="animate-spin" />
                            : item.active ? <EyeOff size={14} /> : <Eye size={14} />
                        }
                    </button>
                    <button
                        onClick={() => onEdit(item)}
                        className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                    >
                        <Edit size={14} />
                    </button>
                    <button
                        onClick={() => onDelete(item.id)}
                        disabled={deleting === item.id}
                        className="p-2 rounded-lg bg-red-900/30 hover:bg-red-900/60 text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                    >
                        {deleting === item.id ? <Loader size={14} className="animate-spin" /> : <Trash2 size={14} />}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function TestimonialAdminPanel() {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(null);
    const [toggling, setToggling] = useState(null);
    const [message, setMessage] = useState({ text: '', type: '' });

    const showMsg = (text, type = 'success') => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: '', type: '' }), MSG_TIMEOUT);
    };

    useEffect(() => {
        const q = query(collection(db, COLLECTION), orderBy('order', 'asc'));
        const unsub = onSnapshot(q, snap => {
            setTestimonials(snap.docs.map(d => ({ id: d.id, ...d.data() })));
            setLoading(false);
        }, () => setLoading(false));
        return unsub;
    }, []);

    const handleSave = async (form) => {
        setSaving(true);
        try {
            const data = {
                quote:        form.quote.trim(),
                name:         form.name.trim(),
                title:        form.title.trim(),
                company:      form.company.trim(),
                platform:     form.platform,
                platformHref: form.platformHref.trim() || null,
                metricValue:  form.metricValue.trim() || null,
                metricLabel:  form.metricLabel.trim() || null,
                active:       form.active,
                order:        Number(form.order) || 0,
                updatedAt:    serverTimestamp(),
            };
            if (editing) {
                await updateDoc(doc(db, COLLECTION, editing.id), data);
                showMsg('Testimonial updated.');
            } else {
                await addDoc(collection(db, COLLECTION), { ...data, createdAt: serverTimestamp() });
                showMsg('Testimonial added.');
            }
            setShowForm(false);
            setEditing(null);
        } catch {
            showMsg('Save failed. Check your connection.', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this testimonial? This cannot be undone.')) return;
        setDeleting(id);
        try {
            await deleteDoc(doc(db, COLLECTION, id));
            showMsg('Testimonial deleted.');
        } catch {
            showMsg('Delete failed.', 'error');
        } finally {
            setDeleting(null);
        }
    };

    const handleToggleActive = async (item) => {
        setToggling(item.id);
        try {
            await updateDoc(doc(db, COLLECTION, item.id), { active: !item.active, updatedAt: serverTimestamp() });
        } catch {
            showMsg('Update failed.', 'error');
        } finally {
            setToggling(null);
        }
    };

    const openEdit = (item) => {
        setEditing(item);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelForm = () => {
        setShowForm(false);
        setEditing(null);
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <MessageSquare size={20} className="text-green-400" />
                        Testimonials
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        {testimonials.filter(t => t.active).length} live · {testimonials.length} total
                    </p>
                </div>
                {!showForm && (
                    <button
                        onClick={() => { setEditing(null); setShowForm(true); }}
                        className="flex items-center gap-2 px-5 py-2.5 bg-green-500 hover:bg-green-400 text-black font-bold rounded-lg text-sm transition-colors"
                    >
                        <PlusCircle size={16} />
                        Add testimonial
                    </button>
                )}
            </div>

            <StatusMessage message={message.text} type={message.type} />

            {/* Add / Edit form */}
            {showForm && (
                <div className="border border-green-500/20 bg-green-500/5 rounded-xl p-6">
                    <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-widest">
                        {editing ? 'Edit testimonial' : 'New testimonial'}
                    </h3>
                    <TestimonialForm
                        initial={editing ? {
                            ...editing,
                            platformHref: editing.platformHref || '',
                            metricValue:  editing.metricValue  || '',
                            metricLabel:  editing.metricLabel  || '',
                        } : undefined}
                        onSave={handleSave}
                        onCancel={cancelForm}
                        saving={saving}
                    />
                </div>
            )}

            {/* List */}
            {loading ? (
                <div className="flex items-center gap-3 text-gray-500 py-12 justify-center">
                    <Loader size={20} className="animate-spin" />
                    Loading testimonials…
                </div>
            ) : testimonials.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-white/10 rounded-xl">
                    <MessageSquare size={32} className="text-gray-700 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No testimonials yet.</p>
                    <p className="text-gray-600 text-xs mt-1">Add your first one above.</p>
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                    {testimonials.map(item => (
                        <TestimonialCard
                            key={item.id}
                            item={item}
                            onEdit={openEdit}
                            onDelete={handleDelete}
                            onToggleActive={handleToggleActive}
                            deleting={deleting}
                            toggling={toggling}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
