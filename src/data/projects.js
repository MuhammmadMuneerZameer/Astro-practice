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
    console.log('🚀 Fetching projects from Firebase...');
    
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
      console.log('⚠️ Could not order projects, fetching without ordering:', orderError.message);
      const q = query(projectsCollection, where("status", "==", "published"));
      querySnapshot = await getDocs(q);
    }
    
    console.log(`📊 Found ${querySnapshot.size} projects`);

    if (querySnapshot.empty) {
      console.warn('⚠️ No projects found in database');
      return [];
    }

    const projects = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      projects.push({
        id: doc.id,
        title: data.title || 'Untitled Project',
        description: data.description || '',
        image: data.image || 'https://via.placeholder.com/800x600',
        technologies: data.technologies || [],
        link: data.link || '#',
        slug: data.slug || doc.id,
        status: data.status || 'published',
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      });
    });

    console.log(`✅ Successfully fetched ${projects.length} projects`);
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
    
    if (!project) {
      console.warn(`⚠️ No project found with slug: ${slug}`);
      return null;
    }
    
    console.log(`✅ Found project:`, project.title);
    return project;
  } catch (error) {
    console.error('💥 Error in getProjectBySlug:', error);
    return null;
  }
}

/**
 * Get projects by technology
 * @param {string} tech - Technology name
 * @returns {Promise<Array>} Array of projects using that technology
 */
export async function getProjectsByTechnology(tech) {
  try {
    const projects = await getProjects();
    return projects.filter(p => 
      p.technologies && p.technologies.includes(tech)
    );
  } catch (error) {
    console.error('💥 Error in getProjectsByTechnology:', error);
    return [];
  }
}
