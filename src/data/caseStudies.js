// src/data/caseStudies.js
import {
    collection,
    getDocs,
    query,
    orderBy,
    where
} from "firebase/firestore";
import { db } from "../lib/firebase";

const COLLECTION_NAME = "caseStudies";

// Service types mapping
export const SERVICES = {
    UX_UI_DESIGN: 'ux-ui-design',
    WEB_DEVELOPMENT: 'web-development',
    MOBILE_APP: 'mobile-app',
    BRANDING: 'branding',
    DIGITAL_MARKETING: 'digital-marketing',
    VIDEO_EDITING: 'video-editing',
    PRODUCT_DESIGN: 'product-design',
    MOTION_DESIGN: 'motion-design'
};

/**
 * Fetch all published case studies from Firebase
 * @returns {Promise<Array>} Array of case study objects
 */
export async function getCaseStudies() {
    try {
        console.log('🚀 Fetching case studies from Firebase...');

        if (!db) {
            throw new Error('Firebase database not initialized');
        }

        const caseStudiesCollection = collection(db, COLLECTION_NAME);

        // Query only published case studies
        let querySnapshot;
        try {
            const q = query(
                caseStudiesCollection,
                where("status", "==", "published"),
                orderBy("createdAt", "desc")
            );
            querySnapshot = await getDocs(q);
        } catch (orderError) {
            console.log('⚠️ Could not order case studies, fetching without ordering:', orderError.message);
            const q = query(caseStudiesCollection, where("status", "==", "published"));
            querySnapshot = await getDocs(q);
        }

        console.log(`📊 Found ${querySnapshot.size} case studies`);

        if (querySnapshot.empty) {
            console.warn('⚠️ No case studies found in database');
            return [];
        }

        const caseStudies = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            caseStudies.push({
                id: doc.id,
                title: data.title || 'Untitled Case Study',
                subtitle: data.subtitle || '', // New
                service: data.service || '',
                client: data.client || '',
                industry: data.industry || '', // New
                duration: data.duration || '',

                // Images
                image: data.image || 'https://via.placeholder.com/800x600', // Main listing image
                heroImage: data.heroImage || data.image, // New dedicated hero image
                images: data.images || [], // Old field
                galleryImages: data.galleryImages || data.images || [], // New field, fallback to old

                // Modules
                brandBio: data.brandBio || '',
                visualIdentity: data.visualIdentity || '',
                marketPos: data.marketPos || '',
                persona: data.persona || '',

                marketMap: data.marketMap || '',
                competitors: data.competitors || '',
                insights: data.insights || '',

                challenge: data.challenge || '', // Old
                challenges: data.challenges || data.challenge || '', // New
                bottlenecks: data.bottlenecks || '',

                solution: data.solution || '', // Old
                oldStrategy: data.oldStrategy || '',
                newStrategy: data.newStrategy || data.solution || '', // New, fallback

                ecosystem: data.ecosystem || '',
                automation: data.automation || '',

                results: data.results || '',
                revenueImpact: data.revenueImpact || '',
                kpis: data.kpis || [],

                technologies: data.technologies || [],

                // Testimonials
                testimonialQuote: data.testimonialQuote || '',
                testimonialAuthor: data.testimonialAuthor || '',
                testimonialRole: data.testimonialRole || '',

                // Conversion
                bookingLink: data.bookingLink || '',

                slug: data.slug || doc.id,
                featured: data.featured || false,
                status: data.status || 'published',
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
            });
        });

        console.log(`✅ Successfully fetched ${caseStudies.length} case studies`);
        return caseStudies;

    } catch (error) {
        console.error('💥 Error in getCaseStudies:', error);
        console.error('💥 Error stack:', error.stack);
        return [];
    }
}

/**
 * Get case studies filtered by service
 * @param {string} service - Service type (use SERVICES constants)
 * @returns {Promise<Array>} Array of case studies for that service
 */
export async function getCaseStudiesByService(service) {
    try {
        const caseStudies = await getCaseStudies();
        return caseStudies.filter(cs => cs.service === service);
    } catch (error) {
        console.error('💥 Error in getCaseStudiesByService:', error);
        return [];
    }
}

/**
 * Get featured case studies
 * @param {number} limit - Maximum number of case studies to return
 * @returns {Promise<Array>} Array of featured case studies
 */
export async function getFeaturedCaseStudies(limit = 3) {
    try {
        const caseStudies = await getCaseStudies();
        return caseStudies
            .filter(cs => cs.featured)
            .slice(0, limit);
    } catch (error) {
        console.error('💥 Error in getFeaturedCaseStudies:', error);
        return [];
    }
}

/**
 * Get a single case study by slug
 * @param {string} slug - Case study slug
 * @returns {Promise<Object|null>} Case study object or null
 */
export async function getCaseStudyBySlug(slug) {
    try {
        const caseStudies = await getCaseStudies();
        const caseStudy = caseStudies.find(cs => cs.slug === slug);

        if (!caseStudy) {
            console.warn(`⚠️ No case study found with slug: ${slug}`);
            return null;
        }

        console.log(`✅ Found case study:`, caseStudy.title);
        return caseStudy;
    } catch (error) {
        console.error('💥 Error in getCaseStudyBySlug:', error);
        return null;
    }
}

/**
 * Get human-readable service name
 * @param {string} serviceKey - Service key (e.g., 'ux-ui-design')
 * @returns {string} Human-readable service name
 */
export function getServiceDisplayName(serviceKey) {
    const names = {
        [SERVICES.UX_UI_DESIGN]: 'UX/UI Design',
        [SERVICES.WEB_DEVELOPMENT]: 'Web Development',
        [SERVICES.MOBILE_APP]: 'Mobile App',
        [SERVICES.BRANDING]: 'Branding',
        [SERVICES.DIGITAL_MARKETING]: 'Digital Marketing',
        [SERVICES.VIDEO_EDITING]: 'Video Editing',
        [SERVICES.PRODUCT_DESIGN]: 'Product Design',
        [SERVICES.MOTION_DESIGN]: 'Motion Design'
    };
    return names[serviceKey] || serviceKey;
}
