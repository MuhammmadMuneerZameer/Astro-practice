// src/data/taxonomy.js
// Central source of truth for SEO hierarchy

/**
 * SERVICE TAXONOMY
 * Parent Services -> Sub-Services
 */
export const SERVICE_HIERARCHY = {
    branding: {
        name: 'Branding',
        slug: 'branding',
        description: 'Build a brand that commands premium pricing and instant recognition.',
        subservices: {
            'brand-strategy': {
                name: 'Brand Strategy',
                slug: 'brand-strategy',
                description: 'Define your market position, messaging, and competitive advantage.'
            },
            'brand-identity': {
                name: 'Brand Identity',
                slug: 'brand-identity',
                description: 'Create a cohesive visual system that communicates your brand values.'
            },
            'logo-design': {
                name: 'Logo Design',
                slug: 'logo-design',
                description: 'Design a memorable mark that becomes synonymous with your brand.'
            },
            'brand-guidelines': {
                name: 'Brand Guidelines',
                slug: 'brand-guidelines',
                description: 'Document your brand standards for consistent application.'
            }
        }
    },
    design: {
        name: 'Design',
        slug: 'design',
        description: 'User-centered design that converts visitors into customers.',
        subservices: {
            'ux-design': {
                name: 'UX Design',
                slug: 'ux-design',
                description: 'Research-driven user experience that removes friction from your funnel.'
            },
            'ui-design': {
                name: 'UI Design',
                slug: 'ui-design',
                description: 'Beautiful interfaces that guide users toward conversion.'
            },
            'product-design': {
                name: 'Product Design',
                slug: 'product-design',
                description: 'End-to-end digital product design from concept to launch.'
            }
        }
    },
    marketing: {
        name: 'Marketing',
        slug: 'marketing',
        description: 'Data-driven marketing that puts your brand in front of buyers.',
        subservices: {
            'digital-marketing': {
                name: 'Digital Marketing',
                slug: 'digital-marketing',
                description: 'Targeted campaigns that drive qualified traffic.'
            },
            'social-media': {
                name: 'Social Media',
                slug: 'social-media',
                description: 'Build an engaged community around your brand.'
            },
            'content-strategy': {
                name: 'Content Strategy',
                slug: 'content-strategy',
                description: 'Create content that ranks, converts, and establishes authority.'
            }
        }
    },
    web: {
        name: 'Web Development',
        slug: 'web',
        description: 'Fast, scalable websites that rank and convert.',
        subservices: {
            'website-development': {
                name: 'Website Development',
                slug: 'website-development',
                description: 'Custom-built websites optimized for speed and SEO.'
            },
            'ecommerce': {
                name: 'E-commerce Development',
                slug: 'ecommerce',
                description: 'Online stores built for conversion and scale.'
            },
            'web-applications': {
                name: 'Web Applications',
                slug: 'web-applications',
                description: 'Custom web apps that solve complex business problems.'
            }
        }
    }
};

/**
 * INDUSTRY TAXONOMY
 * Industries we serve with specialized expertise
 */
export const INDUSTRIES = {
    'home-decor-brands': {
        name: 'Home Decor Brands',
        slug: 'home-decor-brands',
        description: 'Branding and design for furniture, interiors, and lifestyle products.',
        challenges: [
            'Standing out in a visually competitive market',
            'Communicating quality and craftsmanship online',
            'Building aspirational brand perception'
        ]
    },
    'real-estate-brands': {
        name: 'Real Estate Brands',
        slug: 'real-estate-brands',
        description: 'Brand identity and marketing for developers, agents, and property companies.',
        challenges: [
            'Building trust in high-value transactions',
            'Differentiating in a commoditized market',
            'Generating qualified leads consistently'
        ]
    },
    'food-beverage-brands': {
        name: 'Food & Beverage Brands',
        slug: 'food-beverage-brands',
        description: 'Packaging, branding, and digital presence for F&B companies.',
        challenges: [
            'Creating appetite appeal through design',
            'Shelf presence and packaging differentiation',
            'Building brand loyalty in impulse categories'
        ]
    },
    'startups': {
        name: 'Startups',
        slug: 'startups',
        description: 'Launch-ready branding and MVPs for early-stage companies.',
        challenges: [
            'Building credibility with limited history',
            'Rapid iteration and market validation',
            'Maximizing impact with constrained budgets'
        ]
    }
};

/**
 * RESOURCE CATEGORIES
 * Blog/Article categorization
 */
export const RESOURCE_CATEGORIES = {
    branding: {
        name: 'Branding',
        slug: 'branding',
        description: 'Insights on building and growing powerful brands.'
    },
    design: {
        name: 'Design',
        slug: 'design',
        description: 'UX, UI, and visual design best practices.'
    },
    marketing: {
        name: 'Marketing',
        slug: 'marketing',
        description: 'Digital marketing strategies and tactics.'
    },
    web: {
        name: 'Web Development',
        slug: 'web',
        description: 'Technical insights for modern web development.'
    }
};

// Helper functions

export function getServiceBySlug(slug) {
    return SERVICE_HIERARCHY[slug] || null;
}

export function getSubserviceBySlug(serviceSlug, subserviceSlug) {
    const service = SERVICE_HIERARCHY[serviceSlug];
    if (!service) return null;
    return service.subservices[subserviceSlug] || null;
}

export function getIndustryBySlug(slug) {
    return INDUSTRIES[slug] || null;
}

export function getAllServices() {
    return Object.values(SERVICE_HIERARCHY);
}

export function getAllIndustries() {
    return Object.values(INDUSTRIES);
}

export function getResourceCategoryBySlug(slug) {
    return RESOURCE_CATEGORIES[slug] || null;
}

export function getAllResourceCategories() {
    return Object.values(RESOURCE_CATEGORIES);
}
