import type { APIRoute } from 'astro';

// This endpoint runs server-side only — IMGBB_API_KEY never reaches the browser.
// The PUBLIC_IMGBB_API_KEY env var is no longer needed in the three admin panels.
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    const apiKey = import.meta.env.IMGBB_API_KEY;

    if (!apiKey) {
        return new Response(
            JSON.stringify({ success: false, error: 'Upload service not configured' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }

    let incoming: FormData;
    try {
        incoming = await request.formData();
    } catch {
        return new Response(
            JSON.stringify({ success: false, error: 'Invalid request body' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const file = incoming.get('image');
    if (!file || !(file instanceof File)) {
        return new Response(
            JSON.stringify({ success: false, error: 'No image file provided' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
        return new Response(
            JSON.stringify({ success: false, error: 'File exceeds 5 MB limit' }),
            { status: 413, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const imgbbForm = new FormData();
    imgbbForm.append('image', file);

    let imgbbRes: Response;
    try {
        imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
            method: 'POST',
            body: imgbbForm,
        });
    } catch {
        return new Response(
            JSON.stringify({ success: false, error: 'Failed to reach upload service' }),
            { status: 502, headers: { 'Content-Type': 'application/json' } }
        );
    }

    if (!imgbbRes.ok) {
        return new Response(
            JSON.stringify({ success: false, error: `Upload failed: ${imgbbRes.status}` }),
            { status: imgbbRes.status, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const data = await imgbbRes.json();
    if (!data.success) {
        return new Response(
            JSON.stringify({ success: false, error: data.error?.message ?? 'Upload failed' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    return new Response(
        JSON.stringify({ success: true, url: data.data.url }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
};
