// src/data/taxonomy.js
// Central source of truth for SEO hierarchy

/**
 * SERVICE TAXONOMY
 * Parent Services -> Sub-Services
 */
export const SERVICE_HIERARCHY = {
    'ecommerce-growth': {
        name: 'Ecommerce Growth',
        slug: 'ecommerce-growth',
        description: 'Cut your cost per acquisition and grow revenue that keeps — paid media managed to MER targets, Klaviyo retention, and creative that earns its spend.',
        subservices: {
            'paid-media': {
                name: 'Paid Media',
                slug: 'paid-media',
                description: 'Meta, Google, and TikTok campaigns managed to MER targets with Conversions API for attribution that holds as browser-side signals degrade.'
            },
            'email-sms': {
                name: 'Email & SMS Retention',
                slug: 'email-sms',
                description: 'Lifecycle infrastructure built in Klaviyo — flows, segmentation, and win-back campaigns that grow LTV and AOV without increasing ad spend. Retention is where margin lives; acquisition is just how you fill the top of the funnel.',
                deliverables: [
                    {
                        name: 'Welcome Series',
                        desc: '3–5 email sequence that converts new subscribers before they disengage. Timed to brand engagement signals, not arbitrary send intervals. Typically the second-highest revenue flow after abandoned checkout.'
                    },
                    {
                        name: 'Abandoned Checkout Recovery',
                        desc: '3-touch sequence targeting cart abandoners at 1, 12, and 24 hours. The highest-ROI flow in most Shopify stores — recovers revenue that is already committed by the buyer, just interrupted.'
                    },
                    {
                        name: 'Post-Purchase Flow',
                        desc: 'Upsell, cross-sell, and review request sequence timed to the natural product usage cycle — not arbitrary days after order. Increases AOV and generates social proof at the moment of highest satisfaction.'
                    },
                    {
                        name: 'Win-Back Campaign',
                        desc: 'Reactivation sequence for subscribers who have not engaged in 90–180 days, followed by hard suppression of non-responders. Protects deliverability and list health while recovering a meaningful percentage of lapsed customers.'
                    },
                    {
                        name: 'Segmentation Architecture',
                        desc: 'VIP, at-risk, first-purchase, and high-AOV segments built before any broadcast campaign launches — so every send goes to the right audience at the right cadence and protects sender reputation.'
                    },
                    {
                        name: 'Browse & Product Abandonment',
                        desc: 'Triggered flows for high-intent visitors who viewed products but did not add to cart. Often the second-highest revenue flow for traffic-heavy stores and requires no additional ad spend to activate.'
                    },
                ],
                outcomes: [
                    'Retention revenue as a % of total — target: 25–35% of monthly revenue from owned channels',
                    'Revenue per recipient (RPR) by flow — benchmark against Klaviyo industry average',
                    'List growth rate and unsubscribe rate — health indicators that predict deliverability',
                    'LTV:CAC ratio improvement over 90-day cohorts',
                ]
            },
            'cro-testing': {
                name: 'CRO & Landing Page Testing',
                slug: 'cro-testing',
                description: 'Systematic A/B testing on PDPs, checkout flows, and landing pages to raise conversion rate and lower blended CAC.'
            },
            'creative-strategy': {
                name: 'Creative Strategy',
                slug: 'creative-strategy',
                description: 'Ad creative and video content engineered for scroll-stop rate and click-through — tested against MER, not just aesthetics.'
            }
        }
    },
    'store-design-build': {
        name: 'Store Design & Build',
        slug: 'store-design-build',
        description: 'Shopify and Shopify Plus storefronts built for conversion rate, Core Web Vitals, and a post-purchase experience that increases LTV.',
        subservices: {
            'shopify-development': {
                name: 'Shopify Development',
                slug: 'shopify-development',
                description: 'Custom theme builds and storefront development engineered for page speed, mobile UX, and conversion rate — not just visual polish.'
            },
            'shopify-plus': {
                name: 'Shopify Plus',
                slug: 'shopify-plus',
                description: 'Checkout customization, custom apps, and enterprise-scale storefront builds for high-volume DTC brands.'
            },
            'ux-ui-design': {
                name: 'UX & UI Design',
                slug: 'ux-ui-design',
                description: 'User experience design that removes friction from the funnel — from PDP layout to checkout flow and post-purchase page.'
            },
            'product-photography': {
                name: 'Creative Direction',
                slug: 'product-photography',
                description: 'Art direction for product photography and brand visual language that converts in-feed and on-page across mobile and desktop.'
            }
        }
    },
    'growth-tools-automation': {
        name: 'Growth Tools & Automation',
        slug: 'growth-tools-automation',
        description: 'Server-side tracking, first-party data infrastructure, and marketing automation that make your stack more accurate and your decisions better.',
        subservices: {
            'server-side-tracking': {
                name: 'Server-Side Tracking',
                slug: 'server-side-tracking',
                description: 'Conversions API implementation and first-party data pipelines so attribution holds as browser-side signals continue to degrade.'
            },
            'analytics-reporting': {
                name: 'MER & Analytics Reporting',
                slug: 'analytics-reporting',
                description: 'Custom dashboards tracking MER, blended CAC, LTV:CAC, AOV, and retention rate — not just platform ROAS.'
            },
            'marketing-automation': {
                name: 'Marketing Automation',
                slug: 'marketing-automation',
                description: 'Automated flows, segmentation logic, and trigger-based campaigns that improve efficiency without adding headcount.'
            }
        }
    },
    'brand-content': {
        name: 'Brand & Content',
        slug: 'brand-content',
        description: 'Brand identity, video, and motion content that earns the margin premium to make paid acquisition sustainable and defensible.',
        subservices: {
            'brand-strategy-identity': {
                name: 'Brand Strategy & Identity',
                slug: 'brand-strategy-identity',
                description: 'Positioning, visual identity, and messaging that commands premium pricing and differentiates on brand, not price.'
            },
            'video-production': {
                name: 'Video Production',
                slug: 'video-production',
                description: 'Brand films, social reels, and ad creative — video that performs in-feed and builds trust off it.'
            },
            'motion-design': {
                name: 'Motion Design',
                slug: 'motion-design',
                description: 'Purposeful animation for ads, landing pages, and product demos that increase engagement and conversion rate.'
            },
            'content-creation': {
                name: 'Content Creation',
                slug: 'content-creation',
                description: 'UGC-style and studio content for paid media creative that stops the scroll and drives click-through at scale.'
            }
        }
    }
};

/**
 * INDUSTRY TAXONOMY
 * Industries we serve with specialized expertise
 */
export const INDUSTRIES = {
    'ecommerce-dtc': {
        name: 'Ecommerce & DTC Brands',
        slug: 'ecommerce-dtc',
        description: 'Shopify development, paid media, and Klaviyo retention for direct-to-consumer brands that compete on contribution margin — not just top-line revenue.',
        challenges: [
            'Protecting margin as rising Meta CPMs compress MER and product parity erodes pricing power across every category',
            'Converting cold traffic profitably when blended CAC keeps climbing and browser-side attribution is increasingly unreliable without server-side tracking',
            'Increasing AOV and LTV:CAC through post-purchase email flows, subscription mechanics, and retention programs that turn single orders into recurring revenue'
        ]
    },
    'home-decor-brands': {
        name: 'Home Decor Brands',
        slug: 'home-decor-brands',
        description: 'Shopify stores, paid media creative, and Klaviyo retention systems for furniture, home goods, and lifestyle brands competing on aesthetic and customer experience.',
        challenges: [
            'Standing out in a visually saturated Meta and TikTok feed where creative quality directly determines CPM efficiency and thumb-stop rate',
            'Communicating material quality, scale, and craftsmanship through digital photography when buyers cannot touch the product before a high-consideration purchase',
            'Building a first-party data asset through email capture and Klaviyo post-purchase flows that reduces dependence on paid acquisition to hit MER targets'
        ]
    },
    'food-beverage-brands': {
        name: 'Food & Beverage Brands',
        slug: 'food-beverage-brands',
        description: 'Shopify DTC builds, performance creative, and email retention for F&B brands scaling from shelf to direct-to-consumer subscription.',
        challenges: [
            'Creating enough appetite appeal and purchase intent through digital creative to drive impulse conversion without the in-store sensory experience',
            'Translating one-time buyers into a repeatable subscription or reorder flow using Klaviyo win-back sequences that increase AOV and lifetime value',
            'Retaining customers in a category where taste fatigue and constant new entrants make post-purchase email nurture the primary lever for LTV growth'
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
