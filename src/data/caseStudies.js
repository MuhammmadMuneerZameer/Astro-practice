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

let _caseStudiesCache = null;

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
const FETCH_TIMEOUT_MS = 8000;

function withTimeout(promise) {
    return Promise.race([
        promise,
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Firebase fetch timed out')), FETCH_TIMEOUT_MS)
        ),
    ]);
}

export async function getCaseStudies() {
    if (_caseStudiesCache !== null) return _caseStudiesCache;

    try {
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
            querySnapshot = await withTimeout(getDocs(q));
        } catch (orderError) {
            const q = query(caseStudiesCollection, where("status", "==", "published"));
            querySnapshot = await withTimeout(getDocs(q));
        }

        if (querySnapshot.empty) {
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
                services: data.services || (data.service ? [data.service] : []), // New multi-service
                client: data.client || '',
                industry: data.industry || '', // New
                duration: data.duration || '',

                // Images
                image: data.image || '/images/desktop-opt.webp',
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

                isOwnBrand: data.isOwnBrand || false,
                ownBrandNote: data.ownBrandNote || '',
                storeUrl: data.storeUrl || '',

                slug: data.slug || doc.id,
                featured: data.featured || false,
                status: data.status || 'published',
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
            });
        });

        _caseStudiesCache = caseStudies;
        return caseStudies;

    } catch (error) {
        console.error('💥 Error in getCaseStudies:', error);
        console.error('💥 Error stack:', error.stack);
        _caseStudiesCache = [];
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

        if (!caseStudy) return null;
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
