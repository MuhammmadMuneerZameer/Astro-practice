// src/components/DynamicBlogLoader.jsx
// Loads blog posts dynamically from Firebase for URLs not built statically
import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

// Firebase config (uses same env vars as the rest of the app)
const firebaseConfig = {
    apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
    authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.PUBLIC_FIREBASE_APP_ID,
};

// Category display names
const CATEGORY_NAMES = {
    branding: 'Branding',
    design: 'Design',
    marketing: 'Marketing',
    web: 'Web Development',
};

export default function DynamicBlogLoader() {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [relatedPosts, setRelatedPosts] = useState([]);

    useEffect(() => {
        const loadPost = async () => {
            try {
                // Parse URL to get category and slug
                const path = window.location.pathname;
                const match = path.match(/^\/resources\/([^\/]+)\/([^\/]+)\/?$/);

                if (!match) {
                    setNotFound(true);
                    setLoading(false);
                    return;
                }

                const [, category, slug] = match;

                // Initialize Firebase
                const app = initializeApp(firebaseConfig, 'dynamic-blog-loader');
                const db = getFirestore(app);

                // Query for the post by slug
                const postsRef = collection(db, 'post');
                const q = query(postsRef, where('slug', '==', slug));
                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) {
                    setNotFound(true);
                    setLoading(false);
                    return;
                }

                // Get the post data
                const doc = querySnapshot.docs[0];
                const data = doc.data();

                const foundPost = {
                    id: doc.id,
                    title: data.title || 'Untitled',
                    slug: data.slug || doc.id,
                    content: data.content || '',
                    image: data.coverImage || data.image || null,
                    description: data.excerpt || data.description || '',
                    tag: data.tag || null,
                    category: data.category || category,
                    date: data.date || null,
                    status: data.status || 'published',
                };

                // Only show published posts
                if (foundPost.status !== 'published') {
                    setNotFound(true);
                    setLoading(false);
                    return;
                }

                setPost(foundPost);

                // Update page title
                document.title = `${foundPost.title} | Hydra Fox Designs`;

                // Fetch related posts (same category, different post)
                try {
                    const relatedQuery = query(
                        postsRef,
                        where('category', '==', foundPost.category),
                        where('status', '==', 'published')
                    );
                    const relatedSnapshot = await getDocs(relatedQuery);
                    const related = [];
                    relatedSnapshot.forEach((doc) => {
                        const d = doc.data();
                        if (d.slug !== foundPost.slug) {
                            related.push({
                                id: doc.id,
                                title: d.title,
                                slug: d.slug,
                                image: d.coverImage || d.image,
                                category: d.category,
                            });
                        }
                    });
                    setRelatedPosts(related.slice(0, 3));
                } catch (err) {
                    console.log('Could not fetch related posts:', err);
                }

                setLoading(false);
            } catch (error) {
                console.error('Error loading post:', error);
                setNotFound(true);
                setLoading(false);
            }
        };

        loadPost();
    }, []);

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading article...</p>
                </div>
            </div>
        );
    }

    // 404 state
    if (notFound) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center -mt-20">
                <div className="text-center px-4">
                    <h1 className="text-9xl font-bold text-green-500 mb-4 animate-pulse">404</h1>
                    <h2 className="text-2xl md:text-4xl text-white font-bold mb-6">Article Not Found</h2>
                    <p className="text-gray-400 mb-8 max-w-md mx-auto">
                        This article doesn't exist or hasn't been published yet.
                    </p>
                    <div className="flex gap-4 justify-center flex-wrap">
                        <a
                            href="/resources/"
                            className="inline-flex items-center justify-center px-8 py-3 bg-green-500 hover:bg-green-600 text-black font-bold rounded-full transition-all duration-300"
                        >
                            Browse Resources
                        </a>
                        <a
                            href="/"
                            className="inline-flex items-center justify-center px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-full transition-all duration-300"
                        >
                            Return Home
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    // Get category info
    const categoryName = CATEGORY_NAMES[post.category] || post.category;
    const categoryPath = `/resources/${post.category}/`;

    // Format date
    const formatDate = (dateStr) => {
        if (!dateStr) return null;
        try {
            return new Date(dateStr).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return null;
        }
    };

    return (
        <article className="bg-black text-white">
            {/* Breadcrumb */}
            <nav className="bg-black pt-24 pb-4 px-6">
                <div className="max-w-7xl mx-auto">
                    <ol className="flex items-center gap-2 text-sm text-gray-400 flex-wrap">
                        <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
                        <li className="text-gray-600">/</li>
                        <li><a href="/resources/" className="hover:text-white transition-colors">Resources</a></li>
                        <li className="text-gray-600">/</li>
                        <li><a href={categoryPath} className="hover:text-white transition-colors capitalize">{categoryName}</a></li>
                        <li className="text-gray-600">/</li>
                        <li className="text-white font-medium truncate max-w-[200px]">{post.title}</li>
                    </ol>
                </div>
            </nav>

            {/* Article Header */}
            <header className="px-6 pb-12">
                <div className="max-w-3xl mx-auto">
                    {post.category && (
                        <a
                            href={categoryPath}
                            className="inline-block px-4 py-2 bg-green-500/10 text-green-400 rounded-full text-sm font-medium mb-6 border border-green-500/20 hover:bg-green-500/20 transition-colors capitalize"
                        >
                            {categoryName}
                        </a>
                    )}
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                        {post.title}
                    </h1>
                    <p className="text-gray-400 text-xl leading-relaxed">
                        {post.description}
                    </p>
                    {post.date && (
                        <p className="text-gray-500 text-sm mt-6">
                            {formatDate(post.date)}
                        </p>
                    )}
                </div>
            </header>

            {/* Featured Image */}
            {post.image && (
                <div className="px-6 pb-12">
                    <div className="max-w-4xl mx-auto">
                        <div className="aspect-video rounded-2xl overflow-hidden bg-gray-900">
                            <img
                                src={post.image}
                                alt={post.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Article Content */}
            <div className="px-6 pb-20">
                <div className="max-w-3xl mx-auto">
                    <div
                        className="prose prose-lg prose-invert prose-green max-w-none dynamic-blog-content"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </div>
            </div>

            {/* Tags */}
            {post.tag && (
                <div className="px-6 pb-12 border-t border-gray-800 pt-12">
                    <div className="max-w-3xl mx-auto">
                        <div className="flex flex-wrap gap-2">
                            <span className="text-gray-500 text-sm">Tags:</span>
                            <span className="px-3 py-1 bg-gray-900 text-gray-400 rounded-full text-sm">
                                {post.tag}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Related Articles */}
            {relatedPosts.length > 0 && (
                <section className="px-6 py-16 border-t border-gray-800">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            {relatedPosts.map(related => (
                                <a
                                    key={related.id}
                                    href={`/resources/${related.category || 'general'}/${related.slug}/`}
                                    className="group block"
                                >
                                    <div className="aspect-[16/10] rounded-xl overflow-hidden mb-4 bg-gray-900">
                                        {related.image && (
                                            <img
                                                src={related.image}
                                                alt={related.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        )}
                                    </div>
                                    <h3 className="text-lg font-bold group-hover:text-green-400 transition-colors line-clamp-2">
                                        {related.title}
                                    </h3>
                                </a>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Back Links */}
            <section className="px-6 py-12 border-t border-gray-800">
                <div className="max-w-7xl mx-auto flex flex-wrap gap-6 justify-center text-sm">
                    <a href={categoryPath} className="text-green-400 hover:text-green-300 capitalize">
                        ← More {categoryName} Articles
                    </a>
                    <a href="/resources/" className="text-green-400 hover:text-green-300">
                        All Resources
                    </a>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-gradient-to-b from-black to-gray-900 text-white px-6 py-24 border-t border-gray-800">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-4xl font-bold mb-6">Ready to Put This Into Practice?</h2>
                    <p className="text-gray-400 text-lg mb-10">
                        Let's discuss how we can help you implement these strategies.
                    </p>
                    <a
                        href="/contact/"
                        className="inline-flex items-center gap-2 px-10 py-4 bg-green-500 hover:bg-green-600 text-black font-bold rounded-full transition-colors"
                    >
                        Get in Touch
                    </a>
                </div>
            </section>

            {/* Styles for dynamic content */}
            <style>{`
        .dynamic-blog-content h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-top: 3rem;
          margin-bottom: 1rem;
          color: white;
        }
        .dynamic-blog-content h3 {
          font-size: 1.25rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
          color: white;
        }
        .dynamic-blog-content p {
          color: #d1d5db;
          margin-bottom: 1.5rem;
          line-height: 1.75;
        }
        .dynamic-blog-content ul, .dynamic-blog-content ol {
          margin: 1.5rem 0;
          padding-left: 1.5rem;
          color: #d1d5db;
        }
        .dynamic-blog-content li {
          margin-bottom: 0.5rem;
        }
        .dynamic-blog-content a {
          color: #4ade80;
          text-decoration: underline;
        }
        .dynamic-blog-content a:hover {
          color: #86efac;
        }
        .dynamic-blog-content blockquote {
          border-left: 4px solid #22c55e;
          padding-left: 1.5rem;
          margin: 2rem 0;
          font-style: italic;
          color: #9ca3af;
        }
        .dynamic-blog-content code {
          background: #111827;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          color: #4ade80;
          font-size: 0.875rem;
        }
        .dynamic-blog-content pre {
          background: #111827;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1.5rem 0;
        }
        .dynamic-blog-content img {
          border-radius: 0.75rem;
          margin: 2rem 0;
        }
      `}</style>
        </article>
    );
}
