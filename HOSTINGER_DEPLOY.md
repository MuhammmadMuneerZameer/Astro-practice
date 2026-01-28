# Hostinger Deployment Guide (Shared/Free Hosting Compatible)

Great news! I have configured your project to work on **standard Hostinger Shared Hosting** (the cheaper/free option) while **KEEPING the AI Chat working**.

## How it works
- The site is now a **Static Site** (HTML/JS/CSS).
- The AI Chat now uses a simple **PHP file** (`chat.php`) instead of a Node.js server. Hostinger supports PHP on all plans by default.

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

## 📝 Important: Updating Blogs & Content
Since this is now a **Static Site**, new content works a bit differently:

1.  **Adding Content:** You can still use the Admin Panel locally to add Blogs, Projects, or Case Studies (managed via Firebase).
2.  **Publishing:** For the new content to appear on the live site, you must **Rebuild and Re-upload** the site (Steps 2-4 above).
    *   *Why?* Static sites generate all the pages (like `/blog/my-new-post`) at the moment you run `npm run build`. They don't check the database while the user is browsing.

Your site is now live, and the ChatBot will work using the PHP file to talk to OpenAI.
