// src/data/blogPost.js
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";

// Sanitize content to prevent Astro compiler crashes
function sanitizeContent(content) {
  if (!content || typeof content !== 'string') return '';

  // Remove null bytes and other problematic characters
  let sanitized = content.replace(/\0/g, '');

  // Ensure HTML entities are properly formed
  // Fix common malformed entities that can crash the parser
  sanitized = sanitized.replace(/&(?![a-zA-Z0-9#]+;)/g, '&amp;');

  // Remove any script/style tags that could cause issues
  sanitized = sanitized.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  sanitized = sanitized.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

  // Fix unclosed tags that can cause parser state issues
  // These are common culprits for "originalIM was set twice" error
  const selfClosingTags = ['br', 'hr', 'img', 'input', 'meta', 'link', 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr'];
  selfClosingTags.forEach(tag => {
    // Convert <tag> to <tag /> for self-closing tags
    const regex = new RegExp(`<(${tag})([^>]*?)(?<!/)>`, 'gi');
    sanitized = sanitized.replace(regex, `<$1$2 />`);
  });

  return sanitized;
}

export async function getPosts() {
  try {
    console.log('🚀 Starting Firebase fetch...');
    console.log('🔍 Database instance:', db);


    // Check if db is properly initialized
    if (!db) {
      throw new Error('Firebase database not initialized');
    }

    console.log('📦 Getting collection reference...');
    const blogsCollection = collection(db, "post");
    console.log('📦 Collection reference:', blogsCollection);

    console.log('🔄 Fetching documents...');
    // Add query to order by createdAt (newest first) - optional, can remove if causing issues
    let querySnapshot;
    try {
      const q = query(blogsCollection, orderBy("createdAt", "desc"));
      querySnapshot = await getDocs(q);
    } catch (orderError) {
      console.log('⚠️ Could not order by createdAt, fetching without ordering:', orderError.message);
      querySnapshot = await getDocs(blogsCollection);
    }

    console.log('📊 Query snapshot:', querySnapshot);
    console.log('📊 Document count:', querySnapshot.size);

    if (querySnapshot.empty) {
      console.warn('⚠️ No documents found in post collection');
      return [];
    }

    const posts = [];
    querySnapshot.forEach((doc) => {
      console.log(`📄 Processing document ${doc.id}`);
      const data = doc.data();

      // Skip draft posts or posts without valid slugs
      if (data.status && data.status !== 'published') {
        console.log(`⏭️ Skipping draft post: ${doc.id}`);
        return;
      }

      if (!data.slug || data.slug.trim() === '') {
        console.log(`⚠️ Skipping post without slug: ${doc.id}`);
        return;
      }

      const post = {
        id: doc.id,
        title: data.title || 'Untitled',
        // Clean slug: remove leading/trailing slashes
        slug: data.slug.replace(/^\/+|\/+$/g, ''),
        content: sanitizeContent(data.content || ''),

        image: data.coverImage || data.image || 'https://via.placeholder.com/400x300',
        description: data.excerpt || data.description || 'No description available',
        tag: data.tag || null,
        category: data.category || null,
        date: data.date || null,
        status: data.status || 'published',
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };

      console.log(`✅ Processed post:`, post.slug);
      posts.push(post);
    });

    console.log('🎉 Final posts array:', posts.length, 'published posts');
    console.log(`✅ Successfully fetched ${posts.length} posts`);
    return posts;

  } catch (error) {
    console.error('💥 Error in getPosts:', error);
    console.error('💥 Error stack:', error.stack);

    // Return mock data for debugging
    console.log('🔧 Returning mock data for debugging...');
    return [
      {
        id: 'mock-1',
        title: 'Mock Post 1',
        slug: 'mock-post-1',
        content: 'This is mock content',
        image: 'https://via.placeholder.com/400x300',
        description: 'This is a mock post for debugging',
        tag: 'Debug',
        category: 'Test',
        date: '2024-01-01',
      }
    ];
  }
}

// Optional: Get a single post by slug
export async function getPostBySlug(slug) {
  try {
    const posts = await getPosts();
    const post = posts.find(p => p.slug === slug);

    if (!post) {
      console.warn(`⚠️ No post found with slug: ${slug}`);
      return null;
    }

    console.log(`✅ Found post:`, post);
    return post;
  } catch (error) {
    console.error('💥 Error in getPostBySlug:', error);
    return null;
  }
}

// Optional: Get posts by category
export async function getPostsByCategory(category) {
  try {
    const posts = await getPosts();
    return posts.filter(p => p.category === category);
  } catch (error) {
    console.error('💥 Error in getPostsByCategory:', error);
    return [];
  }
}

// Optional: Get posts by tag
export async function getPostsByTag(tag) {
  try {
    const posts = await getPosts();
    return posts.filter(p => p.tag === tag);
  } catch (error) {
    console.error('💥 Error in getPostsByTag:', error);
    return [];
  }
}