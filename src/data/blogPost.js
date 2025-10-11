// src/data/blogPost.js
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";

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
      console.log(`📄 Document data:`, data);

      const post = {
        id: doc.id,
        title: data.title || 'Untitled',
        slug: data.slug || doc.id,
        content: data.content || '',
        image: data.coverImage || data.image || 'https://via.placeholder.com/400x300',
        description: data.excerpt || data.description || 'No description available',
        tag: data.tag || null,
        category: data.category || null,
        date: data.date || null,
        status: data.status || 'published',
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };

      console.log(`✅ Processed post:`, post);
      posts.push(post);
    });

    console.log('🎉 Final posts array:', posts);
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