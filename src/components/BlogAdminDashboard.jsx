import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  PlusCircle, Trash2, Edit, Save, X, AlertCircle,
  FileText, Calendar, Tag, Image, Type, Hash,
  Upload, Link2, ImagePlus, Loader, Check, Eye,
  AlignLeft, AlignCenter, AlignRight, Maximize2
} from 'lucide-react';

import {
  collection, addDoc, updateDoc, deleteDoc, doc,
  onSnapshot, serverTimestamp, query, orderBy
} from 'firebase/firestore';
import { db } from '../lib/firebase';

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================
const CONSTANTS = {
  COLLECTION_NAME: 'post',
  MAX_FILE_SIZE: 5 * 1024 * 1024,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
  MESSAGE_TIMEOUT: 3000,
  IMGBB_API_KEY: import.meta.env.PUBLIC_IMGBB_API_KEY || 'demo_key'
};

const INITIAL_FORM_STATE = {
  title: '',
  content: '',
  description: '',
  image: '',
  date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long' }),
  slug: '',
  tag: '',
  category: ''
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
class BlogUtils {
  static generateSlug(title) {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  static validateImageFile(file) {
    if (!file) throw new Error('No file selected');
    if (!CONSTANTS.ALLOWED_IMAGE_TYPES.includes(file.type)) {
      throw new Error('Invalid file type. Please upload JPG, PNG, GIF, WEBP, or SVG');
    }
    if (file.size > CONSTANTS.MAX_FILE_SIZE) {
      throw new Error(`File size must be less than ${CONSTANTS.MAX_FILE_SIZE / (1024 * 1024)}MB`);
    }
    return true;
  }

  static validateFormData(formData) {
    const errors = [];
    if (!formData.title?.trim()) errors.push('Title is required');
    if (!formData.content?.trim()) errors.push('Content is required');
    if (!formData.description?.trim()) errors.push('Description is required');
    if (!formData.image?.trim()) errors.push('Cover image is required');
    if (!formData.slug?.trim()) errors.push('Slug is required');
    return { isValid: errors.length === 0, errors };
  }

  static async uploadToImgBB(file) {
    if (!CONSTANTS.IMGBB_API_KEY || CONSTANTS.IMGBB_API_KEY === 'demo_key') {
      return new Promise((resolve) => {
        setTimeout(() => resolve('https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800'), 1500);
      });
    }

    const formData = new FormData();
    formData.append('image', file);
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${CONSTANTS.IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) throw new Error(`Upload failed with status: ${response.status}`);
    const data = await response.json();
    if (!data.success) throw new Error(data.error?.message || 'Upload failed');
    return data.data.url;
  }

  static insertTextAtCursor(textarea, text) {
    if (!textarea) return '';
    const start = textarea.selectionStart || 0;
    const end = textarea.selectionEnd || 0;
    const currentValue = textarea.value || '';
    const before = currentValue.substring(0, start);
    const after = currentValue.substring(end);
    return {
      newValue: before + text + after,
      newCursorPosition: start + text.length
    };
  }

  static parseContent(text) {
    const lines = text.split('\n');
    const parsed = [];

    // Position keywords that can be used in image alt text
    const positionKeywords = ['left', 'right', 'center', 'full'];

    for (const line of lines) {
      const trimmed = line.trim();

      // Check for plain image URLs
      if (trimmed.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
        parsed.push({ type: 'image', url: trimmed, position: 'full' });
      }
      // Check for markdown image format with position: ![position](url) or ![position:caption](url)
      else if (trimmed.match(/^!\[.*?\]\(.+?\)$/)) {
        const match = trimmed.match(/!\[(.*?)\]\((.+?)\)/);
        if (match) {
          const altText = match[1] || '';
          const url = match[2];

          // Check if alt text starts with a position keyword
          const lowerAlt = altText.toLowerCase();
          let position = 'full'; // default position
          let caption = altText;

          for (const pos of positionKeywords) {
            if (lowerAlt === pos || lowerAlt.startsWith(pos + ':')) {
              position = pos;
              // Extract caption after position:
              caption = lowerAlt === pos ? '' : altText.substring(pos.length + 1).trim();
              break;
            }
          }

          parsed.push({ type: 'image', url, alt: caption, position });
        }
      }
      // Regular text content
      else if (trimmed) {
        parsed.push({ type: 'text', content: trimmed });
      }
    }
    return parsed;
  }

}

// ============================================================================
// PREVIEW COMPONENT
// ============================================================================
const BlogPreview = ({ formData, onClose }) => {
  const parsedContent = BlogUtils.parseContent(formData.content);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/95 backdrop-blur-sm">
      <div className="min-h-screen px-4 py-8">
        <button onClick={onClose} className="fixed top-4 right-4 z-50 p-3 bg-gray-800 hover:bg-gray-700 rounded-full text-white transition-all shadow-lg">
          <X size={24} />
        </button>

        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 flex items-center gap-3">
            <Eye className="text-yellow-400 flex-shrink-0" size={20} />
            <div>
              <p className="text-yellow-200 font-semibold">Preview Mode</p>
              <p className="text-yellow-300/80 text-sm">This is how your blog post will appear to readers</p>
            </div>
          </div>
        </div>

        <article className="max-w-4xl mx-auto bg-black border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-4 sm:px-6 py-12 sm:py-20">
            <header className="mb-8 sm:mb-12">
              <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
                {formData.tag && (
                  <span className="bg-green-500/20 text-green-300 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium border border-green-500/30">
                    {formData.tag}
                  </span>
                )}
                {formData.category && (
                  <span className="bg-blue-500/20 text-blue-300 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium border border-blue-500/30">
                    {formData.category}
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight tracking-tight">
                {formData.title || 'Untitled Post'}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm sm:text-base border-t border-gray-800 pt-4 sm:pt-6">
                <time className="flex items-center gap-2">
                  <Calendar size={16} />
                  {formData.date}
                </time>
                <span className="text-gray-600">•</span>
                <span className="flex items-center gap-2">
                  <FileText size={16} />
                  {Math.ceil(formData.content.split(' ').length / 200)} min read
                </span>
              </div>
            </header>

            {formData.image && (
              <div className="mb-12 sm:mb-16 rounded-xl overflow-hidden bg-gray-900 shadow-2xl">
                <img src={formData.image} alt={formData.title} className="w-full h-auto object-cover" />
              </div>
            )}

            {formData.description && (
              <div className="mb-8 p-6 bg-gray-900/50 border-l-4 border-green-500 rounded-r-lg">
                <p className="text-gray-300 text-lg leading-relaxed italic">{formData.description}</p>
              </div>
            )}

            <div className="prose-custom space-y-6">
              {parsedContent.length > 0 ? (
                parsedContent.map((item, index) => (
                  item.type === 'image' ? (
                    <figure
                      key={index}
                      className={`my-8 sm:my-12 ${item.position === 'left' ? 'float-left mr-6 mb-4 max-w-[50%] clear-left' :
                        item.position === 'right' ? 'float-right ml-6 mb-4 max-w-[50%] clear-right' :
                          item.position === 'center' ? 'mx-auto max-w-[80%]' :
                            'w-full clear-both' // full width (default)
                        }`}
                    >
                      <img
                        src={item.url}
                        alt={item.alt || 'Blog content image'}
                        className="w-full h-auto rounded-xl object-cover shadow-lg"
                      />
                      {item.alt && (
                        <figcaption className="text-center text-gray-400 text-sm mt-3">
                          {item.alt}
                        </figcaption>
                      )}
                      {item.position && item.position !== 'full' && (
                        <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-blue-500/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          {item.position}
                        </div>
                      )}
                    </figure>
                  ) : (

                    <p key={index} className="text-gray-300 text-lg leading-relaxed">{item.content}</p>
                  )
                ))
              ) : (
                <p className="text-gray-400 italic">No content yet. Start writing to see your blog post preview.</p>
              )}
            </div>
          </div>
        </article>

        <div className="max-w-4xl mx-auto mt-8 p-4 bg-gray-900 rounded-lg border border-gray-800 flex justify-between items-center">
          <p className="text-gray-400 text-sm">End of preview</p>
          <button onClick={onClose} className="px-6 py-2 bg-green-500 hover:bg-green-600 text-black font-semibold rounded-lg transition-colors">
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// CUSTOM HOOKS
// ============================================================================
const useAutoHideMessage = (delay = CONSTANTS.MESSAGE_TIMEOUT) => {
  const timeoutRef = useRef(null);

  const setMessage = useCallback((setter, message) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setter(message);
    if (message) {
      timeoutRef.current = setTimeout(() => setter(''), delay);
    }
  }, [delay]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return setMessage;
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function BlogAdminDashboard() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadMethod, setUploadMethod] = useState('url');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [imagePosition, setImagePosition] = useState('full'); // Image position: full, left, right, center


  const contentTextareaRef = useRef(null);
  const setAutoHideSuccess = useAutoHideMessage();
  const setAutoHideError = useAutoHideMessage();

  useEffect(() => {
    console.log('🔥 Initializing Firebase listener...');
    const blogsCollection = collection(db, CONSTANTS.COLLECTION_NAME);
    let queryRef;

    try {
      queryRef = query(blogsCollection, orderBy('createdAt', 'desc'));
    } catch (err) {
      console.warn('⚠️ Ordered query failed, using unordered collection:', err.message);
      queryRef = blogsCollection;
    }

    const unsubscribe = onSnapshot(
      queryRef,
      (snapshot) => {
        console.log(`✅ Loaded ${snapshot.size} blog posts`);
        const blogsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBlogs(blogsList);
        setLoading(false);
        setError('');
      },
      (err) => {
        console.error('❌ Firebase listener error:', err);
        setAutoHideError(setError, 'Failed to load blogs. Please check your Firebase connection.');
        setLoading(false);
      }
    );

    return () => {
      console.log('🧹 Cleaning up Firebase listener');
      unsubscribe();
    };
  }, [setAutoHideError]);

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => {
      const updates = { [field]: value };
      if (field === 'title') {
        updates.slug = BlogUtils.generateSlug(value);
      }
      return { ...prev, ...updates };
    });
  }, []);

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_STATE);
    setEditingId(null);
    setUploadMethod('url');
    setError('');
    setSuccess('');
  }, []);

  const openEditForm = useCallback((blog) => {
    setFormData({
      title: blog.title || '',
      content: blog.content || '',
      description: blog.description || '',
      image: blog.image || '',
      date: blog.date || '',
      slug: blog.slug || '',
      tag: blog.tag || '',
      category: blog.category || ''
    });
    setEditingId(blog.id);
    setShowForm(true);
    setError('');
    setSuccess('');
  }, []);

  const toggleForm = useCallback(() => {
    if (showForm) resetForm();
    setShowForm(prev => !prev);
  }, [showForm, resetForm]);

  const handleCoverImageUpload = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setError('');
      BlogUtils.validateImageFile(file);
      const imageUrl = await BlogUtils.uploadToImgBB(file);
      setFormData(prev => ({ ...prev, image: imageUrl }));
      setAutoHideSuccess(setSuccess, '✅ Cover image uploaded successfully!');
    } catch (err) {
      console.error('❌ Cover image upload error:', err);
      setAutoHideError(setError, `Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }, [setAutoHideSuccess, setAutoHideError]);

  // Handle multiple content images upload
  const handleContentImageUpload = useCallback(async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      setUploading(true);
      setError('');

      // Validate all files first
      for (const file of files) {
        BlogUtils.validateImageFile(file);
      }

      // Upload all images and collect URLs
      const uploadPromises = files.map(async (file, index) => {
        try {
          setSuccess(`Uploading image ${index + 1} of ${files.length}...`);
          const url = await BlogUtils.uploadToImgBB(file);
          return { success: true, url, name: file.name };
        } catch (err) {
          return { success: false, error: err.message, name: file.name };
        }
      });

      const results = await Promise.all(uploadPromises);

      // Separate successful and failed uploads
      const successfulUploads = results.filter(r => r.success);
      const failedUploads = results.filter(r => !r.success);

      // Insert all successful images into content with position markup
      if (successfulUploads.length > 0) {
        const textarea = contentTextareaRef.current;
        // Format images with position: ![position](url)
        const imageMarkdown = successfulUploads
          .map(r => `\n![${imagePosition}](${r.url})`)
          .join('\n') + '\n';

        if (textarea) {
          const { newValue, newCursorPosition } = BlogUtils.insertTextAtCursor(textarea, imageMarkdown);
          setFormData(prev => ({ ...prev, content: newValue }));
          setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(newCursorPosition, newCursorPosition);
          }, 0);
        }
      }


      // Show appropriate message
      if (failedUploads.length === 0) {
        setAutoHideSuccess(setSuccess, `✅ ${successfulUploads.length} image${successfulUploads.length > 1 ? 's' : ''} uploaded successfully!`);
      } else if (successfulUploads.length === 0) {
        setAutoHideError(setError, `Failed to upload all images`);
      } else {
        setAutoHideSuccess(setSuccess, `✅ ${successfulUploads.length} uploaded, ${failedUploads.length} failed`);
      }

    } catch (err) {
      console.error('❌ Content image upload error:', err);
      setAutoHideError(setError, `Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }, [setAutoHideSuccess, setAutoHideError, imagePosition]);



  const handleRemoveImage = useCallback(() => {
    setFormData(prev => ({ ...prev, image: '' }));
  }, []);

  const handleSubmit = useCallback(async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const validation = BlogUtils.validateFormData(formData);
      if (!validation.isValid) {
        setAutoHideError(setError, validation.errors.join(', '));
        return;
      }

      const blogData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        description: formData.description.trim(),
        image: formData.image.trim(),
        date: formData.date,
        slug: formData.slug.trim(),
        tag: formData.tag.trim() || '',
        category: formData.category.trim() || '',
        updatedAt: serverTimestamp(),
        status: 'published'
      };

      if (editingId) {
        const blogRef = doc(db, CONSTANTS.COLLECTION_NAME, editingId);
        await updateDoc(blogRef, blogData);
        setAutoHideSuccess(setSuccess, '✅ Blog post updated successfully!');
      } else {
        blogData.createdAt = serverTimestamp();
        await addDoc(collection(db, CONSTANTS.COLLECTION_NAME), blogData);
        setAutoHideSuccess(setSuccess, '✅ Blog post published successfully!');
      }

      resetForm();
      setShowForm(false);

    } catch (err) {
      console.error('❌ Save error:', err);
      setAutoHideError(setError, `Failed to save: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }, [formData, editingId, resetForm, setAutoHideSuccess, setAutoHideError]);

  const handleDelete = useCallback(async (id) => {
    if (!window.confirm('⚠️ Are you sure you want to delete this blog post? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteDoc(doc(db, CONSTANTS.COLLECTION_NAME, id));
      setAutoHideSuccess(setSuccess, '✅ Blog post deleted successfully!');
    } catch (err) {
      console.error('❌ Delete error:', err);
      setAutoHideError(setError, `Failed to delete: ${err.message}`);
    }
  }, [setAutoHideSuccess, setAutoHideError]);

  return (
    <div className="min-h-screen bg-black text-white">
      {showPreview && <BlogPreview formData={formData} onClose={() => setShowPreview(false)} />}

      <section className="relative w-full h-[300px] flex flex-col items-center justify-center bg-black text-white">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-green-500/5 via-transparent to-green-400/5"></div>

        <div className="relative z-10 px-4 mt-24 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-6 pt-24 text-green-300">
            Blog Admin Dashboard
          </h1>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto text-sm sm:text-base">
            Manage your blog posts with real-time updates 🔥
          </p>

          <button
            onClick={toggleForm}
            disabled={saving || uploading}
            className="group relative inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-white font-semibold rounded-full bg-green-500 hover:bg-green-600 shadow-lg transition-all duration-300 overflow-hidden text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="relative z-10 flex items-center gap-2">
              {showForm ? <X size={20} /> : <PlusCircle size={20} />}
              {showForm ? 'Cancel' : 'Create New Post'}
            </span>
          </button>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-20">
        {success && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6 flex items-start gap-3">
            <Check className="text-green-400 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-green-200 flex-1">{success}</p>
            <button onClick={() => setSuccess('')} className="ml-auto text-green-400 hover:text-green-300">
              <X size={18} />
            </button>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-red-200 flex-1">{error}</p>
            <button onClick={() => setError('')} className="ml-auto text-red-400 hover:text-red-300">
              <X size={18} />
            </button>
          </div>
        )}

        {showForm && (
          <div className="bg-black/80 backdrop-blur-lg rounded-xl p-8 mb-8 border border-green-500/20 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <FileText className="text-green-400" size={24} />
                </div>
                <h2 className="text-3xl font-bold text-white">
                  {editingId ? 'Edit Post' : 'Create New Post'}
                </h2>
              </div>

              <button
                onClick={() => setShowPreview(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-all font-medium"
              >
                <Eye size={18} />
                Preview
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
                  <Type size={16} />
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter an engaging title..."
                  className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-white placeholder-gray-400"
                  disabled={saving || uploading}
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
                  <Hash size={16} />
                  Slug (URL-friendly)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  placeholder="auto-generated-from-title"
                  className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-white placeholder-gray-400 font-mono text-sm"
                  disabled={saving || uploading}
                />
                <p className="text-xs text-gray-400 mt-1">
                  Auto-generated from title. Customize if needed.
                </p>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
                  <FileText size={16} />
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Write a compelling description..."
                  rows={3}
                  className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-white placeholder-gray-400 resize-none"
                  disabled={saving || uploading}
                  required
                />
                <p className="text-xs text-gray-400 mt-1">
                  {formData.description.length} characters
                </p>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
                  <Image size={16} />
                  Cover Image *
                </label>

                <div className="flex gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setUploadMethod('url')}
                    disabled={saving || uploading}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50 ${uploadMethod === 'url'
                      ? 'bg-green-500 text-black'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                  >
                    <Link2 size={14} className="inline mr-1" />
                    Image URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadMethod('upload')}
                    disabled={saving || uploading}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50 ${uploadMethod === 'upload'
                      ? 'bg-green-500 text-black'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
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
                    required
                  />
                ) : (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverImageUpload}
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
                    <img
                      src={formData.image}
                      alt="Cover preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 rounded-full text-white"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-white">
                    <FileText size={16} />
                    Content *
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {/* Image Position Selector */}
                    <div className="flex items-center gap-1 bg-gray-800/50 rounded-lg p-1">
                      <span className="text-xs text-gray-400 px-2 hidden sm:inline">Position:</span>
                      <button
                        type="button"
                        onClick={() => setImagePosition('full')}
                        className={`p-1.5 rounded transition-all ${imagePosition === 'full' ? 'bg-green-500 text-black' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
                        title="Full Width"
                      >
                        <Maximize2 size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setImagePosition('left')}
                        className={`p-1.5 rounded transition-all ${imagePosition === 'left' ? 'bg-green-500 text-black' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
                        title="Align Left"
                      >
                        <AlignLeft size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setImagePosition('center')}
                        className={`p-1.5 rounded transition-all ${imagePosition === 'center' ? 'bg-green-500 text-black' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
                        title="Align Center"
                      >
                        <AlignCenter size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setImagePosition('right')}
                        className={`p-1.5 rounded transition-all ${imagePosition === 'right' ? 'bg-green-500 text-black' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
                        title="Align Right"
                      >
                        <AlignRight size={14} />
                      </button>
                    </div>

                    {/* Add Images Button */}
                    <label className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg cursor-pointer text-sm font-medium transition-all">
                      <ImagePlus size={14} />
                      {uploading ? 'Uploading...' : 'Add Images'}
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleContentImageUpload}
                        className="hidden"
                        disabled={uploading || saving}
                      />
                    </label>
                  </div>
                </div>

                <textarea
                  ref={contentTextareaRef}
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  placeholder="Write your blog content here. Add image URLs on separate lines or use markdown format: ![alt text](image-url)"
                  rows={15}
                  className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-white placeholder-gray-400 resize-none font-mono text-sm"
                  disabled={saving || uploading}
                />
                <p className="text-xs text-gray-400 mt-1">
                  {formData.content.split(' ').filter(w => w).length} words • {formData.content.length} characters
                  <span className="ml-4 text-gray-500">• Image positions: ![full], ![left], ![center], ![right] or ![position:caption]</span>
                </p>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
                    <Calendar size={16} />
                    Date
                  </label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    placeholder="e.g., 15 November"
                    className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-white placeholder-gray-400"
                    disabled={saving || uploading}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
                    <Tag size={16} />
                    Tag
                  </label>
                  <input
                    type="text"
                    value={formData.tag}
                    onChange={(e) => handleInputChange('tag', e.target.value)}
                    placeholder="e.g., Technology"
                    className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-white placeholder-gray-400"
                    disabled={saving || uploading}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
                    <Hash size={16} />
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    placeholder="e.g., Tutorial"
                    className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-white placeholder-gray-400"
                    disabled={saving || uploading}
                  />
                </div>
              </div>

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
                      {editingId ? 'Update Post' : 'Publish Post'}
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

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader className="animate-spin text-green-400 mb-4" size={48} />
            <p className="text-gray-400">Loading blog posts...</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-800 mb-6">
              <FileText className="text-gray-400" size={40} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">No Blog Posts Yet</h3>
            <p className="text-gray-400 mb-8">Create your first blog post to get started!</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-black font-semibold rounded-lg transition-all"
            >
              <PlusCircle size={20} />
              Create Your First Post
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                All Posts <span className="text-gray-400 text-lg">({blogs.length})</span>
              </h2>
            </div>

            <div className="grid gap-6">
              {blogs.map((blog) => (
                <div
                  key={blog.id}
                  className="bg-black/60 backdrop-blur-lg border border-gray-800 rounded-xl overflow-hidden hover:border-green-500/30 transition-all group"
                >
                  <div className="flex flex-col md:flex-row">
                    {blog.image && (
                      <div className="md:w-64 h-48 md:h-auto flex-shrink-0">
                        <img
                          src={blog.image}
                          alt={blog.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div className="flex-1 p-6">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {blog.tag && (
                          <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-xs font-medium border border-green-500/30">
                            {blog.tag}
                          </span>
                        )}
                        {blog.category && (
                          <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-medium border border-blue-500/30">
                            {blog.category}
                          </span>
                        )}
                      </div>

                      <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">
                        {blog.title}
                      </h3>

                      <p className="text-gray-400 mb-4 line-clamp-2">
                        {blog.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {blog.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText size={14} />
                          {Math.ceil(blog.content.split(' ').length / 200)} min read
                        </span>
                        {blog.slug && (
                          <span className="flex items-center gap-1 font-mono text-xs">
                            <Hash size={14} />
                            {blog.slug}
                          </span>
                        )}
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => openEditForm(blog)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-all font-medium"
                        >
                          <Edit size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(blog.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-all font-medium"
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

      <footer className="border-t border-gray-800 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-400 text-sm">
            Blog Admin Dashboard • Built with React & Firebase
          </p>
        </div>
      </footer>
    </div>
  );
}