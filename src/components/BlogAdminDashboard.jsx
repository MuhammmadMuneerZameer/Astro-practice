import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, Edit, Save, X, AlertCircle, FileText, Calendar, Tag, Image, Type, Hash, Upload, Link2, ImagePlus } from 'lucide-react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function BlogAdminDashboard() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadMethod, setUploadMethod] = useState('url');
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    description: '',
    image: '',
    date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long' }),
    slug: '',
    tag: '',
    category: ''
  });

  // 🔥 Real-time listener - this is the key change!
  useEffect(() => {
    console.log('Setting up real-time listener...');
    
    // Create query with ordering (optional)
    const blogsCollection = collection(db, 'post');
    let q;
    
    try {
      // Try to order by createdAt
      q = query(blogsCollection, orderBy('createdAt', 'desc'));
    } catch (err) {
      // If ordering fails, just use the collection without ordering
      console.log('Ordering by createdAt failed, using unordered collection');
      q = blogsCollection;
    }

    // Set up real-time listener
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        console.log('📡 Real-time update received! Document count:', snapshot.size);
        
        const blogsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setBlogs(blogsList);
        setLoading(false);
        setError('');
      },
      (err) => {
        console.error('Error in real-time listener:', err);
        setError('Failed to load blogs. Please check your Firebase connection.');
        setLoading(false);
      }
    );

    // Cleanup listener on unmount
    return () => {
      console.log('Cleaning up real-time listener...');
      unsubscribe();
    };
  }, []); // Empty dependency array - set up once on mount

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      ...(field === 'title' ? { slug: generateSlug(value) } : {})
    }));
    
    if (field === 'image' && value) {
      setImagePreview(value);
    }
  };

  const handleImageUploadToImgbb = async (file) => {
    const IMGBB_API_KEY = import.meta.env.PUBLIC_IMGBB_API_KEY;
    
    if (!IMGBB_API_KEY) {
      setError('ImgBB API key not configured. Please add PUBLIC_IMGBB_API_KEY to your .env file or use direct URL method.');
      return null;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      
      if (data.success) {
        return data.data.url;
      } else {
        throw new Error(data.error.message || 'Upload failed');
      }
    } catch (err) {
      console.error('ImgBB upload error:', err);
      throw err;
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (jpg, png, gif, etc.)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      setError('');

      const imageUrl = await handleImageUploadToImgbb(file);
      
      if (imageUrl) {
        setFormData(prev => ({ ...prev, image: imageUrl }));
        setImagePreview(imageUrl);
        setSuccess('Image uploaded successfully!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(`Failed to upload image: ${err.message}. Try using direct URL method instead.`);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image: '' }));
    setImagePreview('');
  };

  const insertImageAtCursor = (imageUrl) => {
    const textarea = document.getElementById('contentTextarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = formData.content;
    const before = text.substring(0, start);
    const after = text.substring(end);
    
    const imageText = `\n${imageUrl}\n`;
    const newContent = before + imageText + after;
    
    setFormData(prev => ({ ...prev, content: newContent }));
    
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + imageText.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const handleContentImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      setError('');

      const imageUrl = await handleImageUploadToImgbb(file);
      
      if (imageUrl) {
        insertImageAtCursor(imageUrl);
        setSuccess('Image inserted into content!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(`Failed to upload image: ${err.message}`);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return false;
    }
    if (!formData.content.trim()) {
      setError('Content is required');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return false;
    }
    if (!formData.image.trim()) {
      setError('Cover image is required');
      return false;
    }
    if (!formData.slug.trim()) {
      setError('Slug is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    try {
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
        const blogRef = doc(db, 'post', editingId);
        await updateDoc(blogRef, blogData);
        setSuccess('✅ Blog post updated successfully! (Real-time update)');
      } else {
        blogData.createdAt = serverTimestamp();
        await addDoc(collection(db, 'post'), blogData);
        setSuccess('✅ Blog post published successfully! (Real-time update)');
      }

      // No need to manually fetch blogs - the real-time listener will update automatically!
      resetForm();
      setShowForm(false);
    } catch (err) {
      console.error('Error saving blog:', err);
      setError(`Failed to save blog post: ${err.message}`);
    }
  };

  const handleEdit = (blog) => {
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
    setImagePreview(blog.image || '');
    setEditingId(blog.id);
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'post', id));
      setSuccess('✅ Blog post deleted successfully! (Real-time update)');
      // No need to manually fetch blogs - the real-time listener will update automatically!
    } catch (err) {
      console.error('Error deleting blog:', err);
      setError(`Failed to delete blog post: ${err.message}`);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      description: '',
      image: '',
      date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long' }),
      slug: '',
      tag: '',
      category: ''
    });
    setImagePreview('');
    setEditingId(null);
    setError('');
    setUploadMethod('url');
  };

  const cancelEdit = () => {
    resetForm();
    setShowForm(false);
    setSuccess('');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Rest of your JSX remains exactly the same... */}
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
            onClick={() => {
              setShowForm(!showForm);
              if (showForm) resetForm();
            }}
            className="group relative inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-white font-semibold rounded-full bg-green-500 hover:bg-green-600 shadow-lg transition-all duration-300 overflow-hidden text-sm sm:text-base"
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
            <AlertCircle className="text-green-400 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-green-200">{success}</p>
            <button onClick={() => setSuccess('')} className="ml-auto text-green-400 hover:text-green-300">
              <X size={18} />
            </button>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-red-200">{error}</p>
            <button onClick={() => setError('')} className="ml-auto text-red-400 hover:text-red-300">
              <X size={18} />
            </button>
          </div>
        )}

        {/* Form section - keeping your existing form code */}
        {showForm && (
          <div className="bg-black/80 backdrop-blur-lg rounded-xl p-8 mb-8 border border-green-500/20 shadow-2xl">
            {/* Your existing form JSX here - I'm keeping it as is */}
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <FileText className="text-green-400" size={24} />
              </div>
              <h2 className="text-3xl font-bold text-white">
                {editingId ? 'Edit Post' : 'Create New Post'}
              </h2>
            </div>
            {/* Rest of your form... */}
          </div>
        )}

        {/* Blog List */}
        <div className="bg-black/80 backdrop-blur-lg rounded-xl border border-green-500/20 overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-green-500/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <FileText className="text-green-400" size={24} />
              </div>
              <h2 className="text-3xl font-bold text-white">
                Published Posts ({blogs.length}) 
                <span className="text-sm text-green-400 ml-2">🔴 Live</span>
              </h2>
            </div>
          </div>
          
          <div className="divide-y divide-green-500/10">
            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-flex items-center gap-3 text-gray-400">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
                  Loading blog posts...
                </div>
              </div>
            ) : blogs.length === 0 ? (
              <div className="p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="p-4 bg-green-500/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <FileText className="text-green-400" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No blog posts yet</h3>
                  <p className="text-gray-400 mb-6">Create your first blog post to get started!</p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="group relative inline-flex items-center justify-center px-6 py-3 text-white font-semibold rounded-full bg-green-500 hover:bg-green-600 shadow-lg transition-all duration-300 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <PlusCircle size={18} />
                      Create First Post
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid gap-0">
                {blogs.map(blog => (
                  <div key={blog.id} className="p-6 hover:bg-green-500/5 transition-all duration-300 group">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {blog.image && (
                        <div className="lg:w-32 lg:h-32 w-full h-48 flex-shrink-0">
                          <img 
                            src={blog.image} 
                            alt={blog.title}
                            className="w-full h-full object-cover rounded-lg shadow-lg group-hover:shadow-green-500/20 transition-shadow duration-300"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-300 transition-colors duration-300">
                              {blog.title}
                            </h3>
                            <p className="text-gray-300 mb-4 line-clamp-2 leading-relaxed">
                              {blog.description}
                            </p>
                            <div className="flex flex-wrap gap-3 text-sm">
                              <span className="flex items-center gap-1 text-gray-400">
                                <Calendar size={14} />
                                {blog.date}
                              </span>
                              <span className="flex items-center gap-1 text-gray-400">
                                <Hash size={14} />
                                /{blog.slug}
                              </span>
                              {blog.tag && (
                                <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-xs font-medium">
                                  {blog.tag}
                                </span>
                              )}
                              {blog.category && (
                                <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-medium">
                                  {blog.category}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            <button
                              onClick={() => handleEdit(blog)}
                              className="group/btn p-3 bg-green-500/20 hover:bg-green-500/30 text-green-400 hover:text-green-300 rounded-lg transition-all duration-300 border border-green-500/30 hover:border-green-500/50"
                              title="Edit Post"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(blog.id)}
                              className="group/btn p-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 rounded-lg transition-all duration-300 border border-red-500/30 hover:border-red-500/50"
                              title="Delete Post"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}