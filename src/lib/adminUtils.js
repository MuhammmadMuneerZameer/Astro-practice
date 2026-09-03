import { getAuth } from 'firebase/auth';
import { app } from './firebase';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export function generateSlug(title) {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

export function validateImageFile(file) {
    if (!file) throw new Error('No file selected');
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        throw new Error('Invalid file type. Please upload JPG, PNG, GIF, WEBP, or SVG');
    }
    if (file.size > MAX_FILE_SIZE) {
        throw new Error(`File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
    }
    return true;
}

export async function uploadToImgBB(file) {
    const token = await getAuth(app).currentUser?.getIdToken() ?? '';
    const formData = new FormData();
    formData.append('image', file);
    const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
    });

    if (!response.ok) throw new Error(`Upload failed with status: ${response.status}`);
    const data = await response.json();
    if (!data.success) throw new Error(data.error || 'Upload failed');
    return data.url;
}
