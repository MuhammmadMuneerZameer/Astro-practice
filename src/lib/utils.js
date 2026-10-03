import { generateSlug } from './adminUtils';

export function categoryToSlug(category) {
    if (!category) return 'general';
    return generateSlug(category.replace(/[/\\]/g, '-'));
}
