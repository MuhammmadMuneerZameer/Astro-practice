// Image optimization utilities for the website
// These can be used in components for better image loading

/**
 * Generate srcset for responsive images
 * @param {string} src - Original image source
 * @param {number[]} widths - Array of widths to generate
 * @returns {string} srcset string
 */
export function generateSrcSet(src, widths = [320, 640, 768, 1024, 1280]) {
    // For external URLs, return just the original
    if (src.startsWith('http')) {
        return src;
    }

    // For local images, you'd typically have a build-time image processor
    // For now, return the original (Astro's built-in image optimization handles this)
    return src;
}

/**
 * Get optimized image props for lazy loading
 * @param {string} src - Image source
 * @param {string} alt - Alt text
 * @param {object} options - Additional options
 * @returns {object} Props object for img element
 */
export function getOptimizedImageProps(src, alt, options = {}) {
    const {
        loading = 'lazy',
        decoding = 'async',
        fetchPriority = 'auto',
        className = '',
    } = options;

    return {
        src,
        alt,
        loading,
        decoding,
        fetchPriority,
        className,
    };
}

/**
 * Preload critical images
 * Call this on pages where specific images are above the fold
 * @param {string[]} urls - Array of image URLs to preload
 */
export function preloadImages(urls) {
    if (typeof document === 'undefined') return;

    urls.forEach(url => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = url;
        document.head.appendChild(link);
    });
}

/**
 * Intersection Observer for lazy loading images
 * Use this for images that need custom lazy loading behavior
 */
export function createImageObserver(callback, options = {}) {
    if (typeof IntersectionObserver === 'undefined') {
        return null;
    }

    const defaultOptions = {
        root: null,
        rootMargin: '50px 0px',
        threshold: 0.01,
        ...options,
    };

    return new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                callback(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, defaultOptions);
}

/**
 * Convert image URL to WebP (for supported services)
 * Some CDNs support on-the-fly WebP conversion
 * @param {string} url - Original image URL
 * @returns {string} WebP URL if supported
 */
export function toWebP(url) {
    // If using Cloudinary, Imgix, or similar, convert here
    // Example for Cloudinary:
    // if (url.includes('cloudinary.com')) {
    //   return url.replace('/upload/', '/upload/f_webp/');
    // }

    return url;
}

/**
 * Get placeholder data URL for skeleton loading
 * @param {number} width 
 * @param {number} height 
 * @param {string} color 
 * @returns {string} Data URL
 */
export function getPlaceholderDataUrl(width = 1, height = 1, color = '#1f2937') {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect fill="${color}" width="${width}" height="${height}"/></svg>`;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
}
