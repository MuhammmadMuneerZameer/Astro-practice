// src/data/blogPost.js
import { collection, getDocs } from "firebase/firestore";
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
    const querySnapshot = await getDocs(blogsCollection);
    console.log('📊 Query snapshot:', querySnapshot);
    console.log('📊 Document count:', querySnapshot.size);

    if (querySnapshot.empty) {
      console.warn('⚠️ No documents found in blogs collection');
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
        image: data.coverImage || 'https://via.placeholder.com/400x300',
        description: data.excerpt || 'No description available',
        tag: data.tag || null,
        category: data.category || null,
        date: data.date || null,
      };

      console.log(`✅ Processed post:`, post);
      posts.push(post);
    });

    console.log('🎉 Final posts array:', posts);
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