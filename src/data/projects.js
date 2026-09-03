// src/data/projects.js
import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  where 
} from "firebase/firestore";
import { db } from "../lib/firebase";

const COLLECTION_NAME = "projects";

/**
 * Fetch all published projects from Firebase
 * @returns {Promise<Array>} Array of project objects
 */
export async function getProjects() {
  try {
    if (!db) {
      throw new Error('Firebase database not initialized');
    }

    const projectsCollection = collection(db, COLLECTION_NAME);
    
    // Query only published projects, ordered by creation date
    let querySnapshot;
    try {
      const q = query(
        projectsCollection, 
        where("status", "==", "published"),
        orderBy("createdAt", "desc")
      );
      querySnapshot = await getDocs(q);
    } catch (orderError) {
      const q = query(projectsCollection, where("status", "==", "published"));
      querySnapshot = await getDocs(q);
    }
    
    if (querySnapshot.empty) {
      return [];
    }

    const projects = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      projects.push({
        id: doc.id,
        title: data.title || 'Untitled Project',
        description: data.description || '',
        image: data.image || '/images/desktop-opt.webp',
        technologies: data.technologies || [],
        link: data.link || '#',
        slug: data.slug || doc.id,
        status: data.status || 'published',
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      });
    });

    return projects;

  } catch (error) {
    console.error('💥 Error in getProjects:', error);
    console.error('💥 Error stack:', error.stack);
    
    // Return empty array instead of mock data in production
    return [];
  }
}

/**
 * Get a single project by slug
 * @param {string} slug - Project slug
 * @returns {Promise<Object|null>} Project object or null
 */
export async function getProjectBySlug(slug) {
  try {
    const projects = await getProjects();
    const project = projects.find(p => p.slug === slug);
    
    if (!project) return null;
    return project;
  } catch (error) {
    console.error('💥 Error in getProjectBySlug:', error);
    return null;
  }
}

