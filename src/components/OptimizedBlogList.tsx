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
      {error && (
        <div className="col-span-full p-3 bg-yellow-900/20 border border-yellow-500/30 rounded text-yellow-300 text-sm">
          {error} - Showing cached content
        </div>
      )}

      {posts.map((post) => (
        <a
          key={post.id}
          href={`/resources/${categoryToSlug(post.category)}/${post.slug}/`}
          className="block group"
        >
          <div className="bg-black border border-white/10 group-hover:border-white/25 rounded-2xl overflow-hidden transition-colors duration-300 h-full flex flex-col">
            <div className="relative overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-52 object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
            <div className="p-5 flex flex-col flex-grow gap-3">
              {post.tag && (
                <span className="text-[#00f19f] text-[10px] font-bold tracking-[0.18em] uppercase line-clamp-1">
                  {post.tag.split(',')[0].trim()}
                </span>
              )}
              <h3 className="text-white font-heading font-bold text-lg leading-snug group-hover:text-[#00f19f] transition-colors duration-300 line-clamp-3">
                {post.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mt-auto">
                {post.description}
              </p>
              <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                <span className="text-gray-600 text-xs">{post.date}</span>
                <span className="ml-auto text-[#00f19f] text-xs font-medium group-hover:gap-2 transition-all">
                  Read →
                </span>
              </div>
            </div>
          </div>
        </a>
      ))}

      {posts.length === 0 && !loading && (
        <div className="col-span-full text-center py-20">
          <p className="text-gray-600 text-lg mb-4">No posts available yet.</p>
          <a href="/admin" className="text-[#00f19f] text-sm hover:underline">
            Create first post →
          </a>
        </div>
      )}
    </div>
  );
}