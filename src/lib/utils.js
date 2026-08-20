export function categoryToSlug(category) {
    if (!category) return 'general';
    return category
        .toLowerCase()
        .replace(/[/\\]/g, '-')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .trim();
}
