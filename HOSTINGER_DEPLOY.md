# Hostinger Deployment Guide (Shared/Free Hosting Compatible)

Great news! I have configured your project to work on **standard Hostinger Shared Hosting** (the cheaper/free option) while **KEEPING the AI Chat working** AND enabling **instant blog publishing**.

## How it works
- The site is a **Static Site** (HTML/JS/CSS).
- The AI Chat uses a simple **PHP file** (`chat.php`) instead of a Node.js server.
- **NEW:** Blog posts can now be published **instantly** without rebuilding!

---

## 🚀 Instant Blog Publishing (NEW!)

Your site now has a **hybrid blog system**:

### How It Works

| Blog State | What Happens |
|------------|--------------|
| **New blog** (just created in admin) | Loads dynamically via JavaScript from Firebase |
| **After rebuild** | Blog becomes a static HTML page (best for SEO) |

### Publishing Workflow

```
1. CREATE blog in Admin Panel
        ↓
2. Blog is LIVE INSTANTLY! ✅
   (visitors can see it right away)
        ↓
3. When convenient: rebuild & upload
        ↓
4. Blog is now STATIC (best SEO) ✅
```

### SEO Notes
- **Static pages** (after rebuild): Google indexes immediately, fastest load
- **Dynamic pages** (before rebuild): Google can still index, may take slightly longer

> 💡 **Tip:** For important articles (cornerstone content), rebuild right after publishing. For regular posts, batch rebuilds weekly.

---

## Deployment Steps

### Step 1: Add your API Key (Securely)
1. Open `public/api/secure_secrets.php`.
2. This file is **ignored by Git**, so it's safe to put your key here on your local computer.
3. Paste your OpenAI Key inside the quotes: `$OPENAI_API_KEY = 'sk-...'`.
4. **Note:** If you already pasted the key directly into `chat.php`, that works too, but be careful not to share that file with others.

### Step 2: Build the Site
1. Run the build command in VS Code:
   ```bash
   npm run build
   ```

### Step 3: Compress
1. Go to the `dist` folder.
2. Select **ALL** files inside `dist`.
3. Right-click → **Compress to ZIP file**.

### Step 4: Upload
1. Go to Hostinger **File Manager**.
2. Open `public_html`.
3. Drag and drop your zip file.
4. Extract it.
5. **IMPORTANT:** Ensure `api/secure_secrets.php` was included in the upload (it should be inside the `dist` folder after build because it's in `public`).
   - If you don't see it on the server, just manually create `public_html/api/secure_secrets.php` on Hostinger and paste the content with your key.

---

## 📝 Content Management Summary

| Content Type | How to Add | When Visible | Best For SEO |
|--------------|------------|--------------|--------------|
| **Blogs** | Admin Panel | **Instantly!** | After rebuild |
| **Projects** | Admin Panel | After rebuild | After rebuild |
| **Case Studies** | Admin Panel | After rebuild | After rebuild |

---

## Troubleshooting

### New blog not loading?
1. Make sure the post status is set to **"published"** in the admin panel
2. Check that the slug matches the URL you're visiting
3. Check browser console for any Firebase errors

### 404 page showing instead of blog?
- The dynamic loader checks for `/resources/[category]/[slug]/` pattern
- Make sure your blog has a category assigned
- Try clearing your browser cache

---

Your site is now live, the ChatBot works via PHP, and new blogs appear instantly! 🎉
