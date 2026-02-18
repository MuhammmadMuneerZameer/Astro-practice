// src/components/OptimizedBlogList.tsx
import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { categoryToSlug } from '../lib/utils';

// Define the Post type
export interface Post {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  tag?: string | null;
  category?: string | null;
  date: string;
  content?: string;
  status?: string;
}

interface OptimizedBlogListProps {
  initialPosts?: Post[];
  maxPosts?: number;
}


export default function OptimizedBlogList({
  initialPosts = [],
  maxPosts = 100
}: OptimizedBlogListProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch if browser supports Firebase (prevents SSR errors)
    if (typeof window === 'undefined') return;

    console.log('🔥 Initializing real-time blog updates...');
    setLoading(true);

    const blogsCollection = collection(db, 'post');

    // Use limit to prevent fetching too many docs
    let q;
    try {
      q = query(blogsCollection, orderBy('createdAt', 'desc'), limit(maxPosts));
    } catch (err) {
      console.warn('⚠️ Ordering failed, using unordered query');
      q = query(blogsCollection, limit(maxPosts));
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        console.log(`✅ Real-time update: ${snapshot.size} posts`);

        const postsList: Post[] = snapshot.docs
          .map(doc => {
            const data = doc.data();
            // Clean slug: remove leading/trailing slashes
            const cleanSlug = (data.slug || doc.id).replace(/^\/+|\/+$/g, '');
            return {
              id: doc.id,
              slug: cleanSlug,
              title: data.title || 'Untitled',
              description: data.description || data.excerpt || '',
              image: data.image || data.coverImage || 'https://via.placeholder.com/400x300',
              tag: data.tag || null,
              category: data.category || null,
              date: data.date || new Date().toLocaleDateString(),
              content: data.content || '',
              status: data.status || 'published',
            };
          })
          // Only show published posts with valid slugs
          .filter(post => post.status === 'published' && post.slug && post.slug.length > 0);

        setPosts(postsList);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('❌ Firebase error:', err);
        setError('Unable to load latest posts');
        setLoading(false);
        // Keep showing initial posts on error
      }
    );

    return () => unsubscribe();
  }, [maxPosts]);

  // Show initial posts immediately, then update with real-time data
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Real-time indicator */}
      {/* {!loading && posts.length > 0 && (
        <div className="col-span-full mb-4 p-2 bg-gray-900 rounded text-xs text-gray-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live updates active</span>
          </div>
          <span>{posts.length} posts</span>
        </div>
      )} */}

      {error && (
        <div className="col-span-full p-3 bg-yellow-900/20 border border-yellow-500/30 rounded text-yellow-300 text-sm">
          {error} - Showing cached content
        </div>
      )}

      {posts.map((post) => (
        <a
          key={post.id}
          href={`/resources/${categoryToSlug(post.category)}/${post.slug}/`}
          className="block hover:opacity-80 transition duration-200"
        >
          <div className="bg-black rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow h-full flex flex-col  hover:border-green-500/30">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-48 object-cover"
              loading="lazy"
            />
            <div className="p-4 flex flex-col flex-grow">
              {post.tag && (
                <span className="text-xs bg-purple-500 text-white px-2 py-1 rounded w-fit mb-2">
                  {post.tag}
                </span>
              )}
              <h3 className="text-white text-lg font-semibold leading-tight mb-2">
                {post.title}
              </h3>
              <p className="text-gray-300 text-sm mt-auto line-clamp-3">
                {post.description}
              </p>
            </div>
          </div>
        </a>
      ))}

      {posts.length === 0 && !loading && (
        <div className="col-span-full text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="p-4 bg-green-500/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No posts available</h3>
            <p className="text-gray-400 mb-6">Create your first blog post to get started!</p>
            <a
              href="/admin"
              className="inline-block bg-green-500 hover:bg-green-600 text-black px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Create First Post
            </a>
          </div>
        </div>
      )}
    </div>
  );
}