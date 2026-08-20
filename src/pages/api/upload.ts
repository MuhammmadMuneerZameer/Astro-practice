import type { APIRoute } from 'astro';

export const prerender = false;

const json = (body: object, status: number) =>
    new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

async function verifyAdminToken(token: string): Promise<boolean> {
    const firebaseApiKey = import.meta.env.PUBLIC_FIREBASE_API_KEY;
    if (!firebaseApiKey) return false;

    // Validate token with Firebase Auth REST API
    const res = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseApiKey}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idToken: token }) }
    ).catch(() => null);

    if (!res?.ok) return false;

    // Decode JWT payload to read custom claims (token already validated above)
    try {
        const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
        return payload?.admin === true;
    } catch {
        return false;
    }
}

export const POST: APIRoute = async ({ request }) => {
    const authHeader = request.headers.get('Authorization') ?? '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

    if (!token || !(await verifyAdminToken(token))) {
        return json({ success: false, error: 'Unauthorized' }, 401);
    }

    const apiKey = import.meta.env.IMGBB_API_KEY;

    if (!apiKey) {
        return json({ success: false, error: 'Upload service not configured' }, 500);
    }

    let incoming: FormData;
    try {
        incoming = await request.formData();
    } catch {
        return json({ success: false, error: 'Invalid request body' }, 400);
    }

    const file = incoming.get('image');
    if (!file || !(file instanceof File)) {
        return json({ success: false, error: 'No image file provided' }, 400);
    }

    if (file.size > 5 * 1024 * 1024) {
        return json({ success: false, error: 'File exceeds 5 MB limit' }, 413);
    }

    const imgbbForm = new FormData();
    imgbbForm.append('image', file);

    let imgbbRes: Response;
    try {
        imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, { method: 'POST', body: imgbbForm });
    } catch {
        return json({ success: false, error: 'Failed to reach upload service' }, 502);
    }

    if (!imgbbRes.ok) return json({ success: false, error: `Upload failed: ${imgbbRes.status}` }, imgbbRes.status);

    const data = await imgbbRes.json();
    if (!data.success) return json({ success: false, error: 'Upload failed' }, 400);

    return json({ success: true, url: data.data.url }, 200);
};
