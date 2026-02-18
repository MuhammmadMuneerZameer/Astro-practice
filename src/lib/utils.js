// Helper function to convert category names to URL-safe slugs
export function categoryToSlug(category) {
    if (!category) return 'general';
    let slug = category.toLowerCase();
    slug = slug.replace(/\//g, '-');     // Replace forward slashes
    slug = slug.replace(/\\/g, '-');     // Replace backslashes  
    slug = slug.replace(/\s+/g, '-');    // Replace spaces
    slug = slug.replace(/-+/g, '-');     // Replace multiple hyphens
    slug = slug.replace(/^-/, '');       // Remove leading hyphen
    slug = slug.replace(/-$/, '');       // Remove trailing hyphen
    return slug.trim();
}

// Parse blog content and convert to formatted HTML
export function parseBlogContent(content) {
    if (!content) return '';

    const lines = content.split('\n');
    let html = '';
    let inList = false;
    let listType = null;

    // Position keywords for images
    const positionKeywords = ['left', 'right', 'center', 'full'];

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        const trimmed = line.trim();

        // Skip empty lines but add paragraph break
        if (!trimmed) {
            if (inList) {
                html += listType === 'ul' ? '</ul>' : '</ol>';
                inList = false;
                listType = null;
            }
            continue;
        }

        // Headers (## Heading)
        if (trimmed.startsWith('### ')) {
            if (inList) { html += listType === 'ul' ? '</ul>' : '</ol>'; inList = false; }
            const text = processInlineFormatting(trimmed.substring(4));
            html += `<h3 class="text-2xl font-bold text-white mt-12 mb-4">${text}</h3>`;
            continue;
        }
        if (trimmed.startsWith('## ')) {
            if (inList) { html += listType === 'ul' ? '</ul>' : '</ol>'; inList = false; }
            const text = processInlineFormatting(trimmed.substring(3));
            html += `<h2 class="text-3xl font-bold text-white mt-14 mb-6">${text}</h2>`;
            continue;
        }
        if (trimmed.startsWith('# ')) {
            if (inList) { html += listType === 'ul' ? '</ul>' : '</ol>'; inList = false; }
            const text = processInlineFormatting(trimmed.substring(2));
            html += `<h1 class="text-4xl font-bold text-white mt-16 mb-8">${text}</h1>`;
            continue;
        }

        // Blockquotes (> text)
        if (trimmed.startsWith('> ')) {
            if (inList) { html += listType === 'ul' ? '</ul>' : '</ol>'; inList = false; }
            const text = processInlineFormatting(trimmed.substring(2));
            html += `<blockquote class="border-l-4 border-green-500 pl-6 py-4 my-8 bg-gray-900/30 rounded-r-lg italic text-gray-300">${text}</blockquote>`;
            continue;
        }

        // Horizontal rule
        if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
            if (inList) { html += listType === 'ul' ? '</ul>' : '</ol>'; inList = false; }
            html += `<hr class="border-gray-800 my-12" />`;
            continue;
        }

        // Unordered lists (- item or * item)
        if (trimmed.match(/^[-*]\s+/)) {
            const text = processInlineFormatting(trimmed.replace(/^[-*]\s+/, ''));
            if (!inList || listType !== 'ul') {
                if (inList) html += listType === 'ul' ? '</ul>' : '</ol>';
                html += `<ul class="list-disc list-inside space-y-3 my-6 text-gray-300 ml-4">`;
                inList = true;
                listType = 'ul';
            }
            html += `<li class="leading-relaxed">${text}</li>`;
            continue;
        }

        // Ordered lists (1. item)
        if (trimmed.match(/^\d+\.\s+/)) {
            const text = processInlineFormatting(trimmed.replace(/^\d+\.\s+/, ''));
            if (!inList || listType !== 'ol') {
                if (inList) html += listType === 'ul' ? '</ul>' : '</ol>';
                html += `<ol class="list-decimal list-inside space-y-3 my-6 text-gray-300 ml-4">`;
                inList = true;
                listType = 'ol';
            }
            html += `<li class="leading-relaxed">${text}</li>`;
            continue;
        }

        // Close lists if we're in one
        if (inList) {
            html += listType === 'ul' ? '</ul>' : '</ol>';
            inList = false;
            listType = null;
        }

        // Images - Plain URL
        if (trimmed.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
            html += `<figure class="my-10"><img src="${trimmed}" alt="Blog content image" class="w-full h-auto rounded-xl shadow-lg" loading="lazy" /></figure>`;
            continue;
        }

        // Images - Markdown format with position ![position](url) or ![position:caption](url)
        if (trimmed.match(/^!\[.*?\]\(.+?\)$/)) {
            const match = trimmed.match(/!\[(.*?)\]\((.+?)\)/);
            if (match) {
                const altText = match[1] || '';
                const url = match[2];
                const lowerAlt = altText.toLowerCase();

                let position = 'full';
                let caption = altText;

                for (const pos of positionKeywords) {
                    if (lowerAlt === pos || lowerAlt.startsWith(pos + ':')) {
                        position = pos;
                        caption = lowerAlt === pos ? '' : altText.substring(pos.length + 1).trim();
                        break;
                    }
                }

                let figureClass = 'my-10 ';
                if (position === 'left') figureClass += 'float-left mr-8 mb-4 max-w-[45%] clear-left';
                else if (position === 'right') figureClass += 'float-right ml-8 mb-4 max-w-[45%] clear-right';
                else if (position === 'center') figureClass += 'mx-auto max-w-[85%]';
                else figureClass += 'w-full clear-both';

                html += `<figure class="${figureClass}">
                    <img src="${url}" alt="${caption || 'Blog content image'}" class="w-full h-auto rounded-xl shadow-lg" loading="lazy" />
                    ${caption ? `<figcaption class="text-center text-gray-500 text-sm mt-3 italic">${caption}</figcaption>` : ''}
                </figure>`;
                continue;
            }
        }

        // Regular paragraph
        const text = processInlineFormatting(trimmed);
        html += `<p class="text-gray-300 text-lg leading-relaxed mb-6">${text}</p>`;
    }

    // Close any open list
    if (inList) {
        html += listType === 'ul' ? '</ul>' : '</ol>';
    }

    return html;
}

// Process inline formatting (bold, italic, links, code)
function processInlineFormatting(text) {
    // Escape HTML first
    text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Bold (**text** or __text__)
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
    text = text.replace(/__(.+?)__/g, '<strong class="text-white font-semibold">$1</strong>');

    // Italic (*text* or _text_)
    text = text.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>');
    text = text.replace(/_(.+?)_/g, '<em class="italic">$1</em>');

    // Inline code (`code`)
    text = text.replace(/`([^`]+)`/g, '<code class="bg-gray-800 text-green-400 px-2 py-0.5 rounded text-sm font-mono">$1</code>');

    // Links [text](url)
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-green-400 hover:text-green-300 underline underline-offset-2 transition-colors" target="_blank" rel="noopener noreferrer">$1</a>');

    return text;
}
