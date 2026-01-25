# Deployment & Security Guide

## 🚨 CRITICAL SECURITY TASKS (Do These First!)

### 1. Rotate Your API Keys IMMEDIATELY

Your API keys are currently exposed in the `.env` file. Follow these steps:

#### Rotate OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Delete the old key: `sk-proj-Ge8J...`
3. Create a new key and save it

#### Rotate ImgBB API Key  
1. Go to https://api.imgbb.com/
2. Generate a new API key
3. Replace the old key: `eb9be247...`

#### Update .env File
1. Copy `.env.example` to `.env`
2. Fill in your NEW API keys
3. **NEVER commit `.env` to git!**

### 2. Deploy Firebase Security Rules

1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `hydrafoxdesigns`
3. Go to **Firestore Database** → **Rules**
4. Copy the content from `firebaseSecurityRules.rules`
5. Paste into the Firebase Console
6. Click **Publish**

These rules ensure:
- ✅ Anyone can read published content
- ✅ Only authenticated admins can create/edit/delete
- ❌ Draft content is not publicly accessible

### 3. Verify Git Security

Check that sensitive files are not tracked:

```bash
# Should return "would be ignored"
git check-ignore .env

# If .env is tracked, remove it:
git rm --cached .env
git commit -m "Remove .env from tracking"
```

## 📦 Deployment Steps

### Prerequisites

1. **Install dependencies** (if not already done):
```bash
npm install
```

2. **Test locally**:
```bash
npm run dev
```

Visit:
- http://localhost:4321/ - Main site
- http://localhost:4321/admin - Admin dashboard

### Deploy to Production

#### Option 1: Netlify (Recommended for Hybrid Apps)

1. **Install Netlify Adapter**:
```bash
npm install @astrojs/netlify
```

2. **Update `astro.config.mjs`**:
```javascript
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';

export default defineConfig({
  // ... existing config
  output: 'hybrid',
  adapter: netlify()
});
```

3. **Deploy**:
```bash
netlify deploy --prod
```

4. **Set Environment Variables** in Netlify Dashboard:
   - Go to Site settings → Environment variables
   - Add all variables from your `.env` file

#### Option 2: Vercel

1. **Install Vercel Adapter**:
```bash
npm install @astrojs/vercel
```

2. **Update `astro.config.mjs`**:
```javascript
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  // ... existing config
  output: 'hybrid',
  adapter: vercel()
});
```

3. **Deploy**:
```bash
vercel --prod
```

4. **Set Environment Variables** in Vercel Dashboard

#### Option 3: Firebase Hosting (Static with Manual Rebuild)

If you want to stay fully static:

1. Keep `output: 'static'` in `astro.config.mjs`
2. Build: `npm run build`
3. Deploy: `firebase deploy --only hosting`

**Note**: With static mode, you'll need to rebuild and redeploy every time you add content via the admin panel.

## 🔧 Database Migration

### Add Existing Projects to Firebase

You currently have 3 projects in `ProjectShowcase.js`:

1. Go to `/admin` page
2. Click **Projects** tab
3. Manually add each project using the admin interface:
   - **Disgraced Online Store**
   - **Portfolio Website**  
   - **Medical Appointment Website**

### Create Your First Case Study

1. Go to `/admin` page
2. Click **Case Studies** tab
3. Create a case study for one of your completed projects
4. Select the appropriate service category
5. Fill in Challenge, Solution, and Results sections

## 🎨 Content Management Workflow

### Adding a Blog Post

1. Visit `/admin`
2. Click **Blog Posts** tab
3. Fill in title, description, content
4. Upload cover image
5. Add tags and category
6. Click **Publish Post**
7. **View instantly** on your blog page - no rebuild needed!

### Adding a Project

1. Visit `/admin`
2. Click **Projects** tab
3. Fill in project details
4. Add technologies
5. Upload project image
6. Click **Create Project**
7. **Appears immediately** on ProjectPage

### Adding a Case Study

1. Visit `/admin`
2. Click **Case Studies** tab
3. Select service category (UX/UI Design, Web Development, etc.)
4. Fill in client, challenge, solution, results
5. Upload main image and gallery images
6. Add technologies used
7. Toggle "Featured" if you want it on homepage
8. Click **Create Case Study**
9. **Appears immediately** on services page and case studies page

## 🔐 Admin Access

### Setting Up Authentication

Check that `AdminAuth.jsx` component exists and implements Firebase Authentication properly.

Default admin setup:
1. Enable Email/Password authentication in Firebase Console
2. Create admin user in Firebase Console → Authentication
3. Use those credentials to log in at `/admin`

## 🐛 Troubleshooting

### "Projects not showing up"

- Check Firebase Console → Firestore → `projects` collection
- Verify status is set to `"published"`
- Check browser console for errors

### "Permission denied" errors

- Ensure Firebase security rules are deployed
- Verify you're authenticated when accessing admin panel
- Check browser console for specific error messages

### "Images not uploading"

- Verify ImgBB API key is correct in `.env`
- Check file size (must be < 5MB)
- Ensure file type is allowed (JPG, PNG, GIF, WEBP, SVG)

### Build errors

```bash
# Clear cache and rebuild
rm -rf .astro dist node_modules package-lock.json
npm install
npm run build
```

## 📊 Monitoring

### Firebase Usage

Monitor your Firebase usage in the Firebase Console:
- Firestore reads/writes
- Authentication users
- Hosting bandwidth

### Performance

The hybrid mode enables:
- ✅ Real-time content updates without rebuilding
- ✅ Fast initial page loads (static generation)
- ✅ Dynamic data for admin-managed content

## 🚀 Next Steps

1. ✅ Rotate API keys
2. ✅ Deploy Firebase security rules
3. ✅ Migrate existing projects to Firestore
4. ✅ Create at least one case study for each service
5. ✅ Test the admin panel thoroughly
6. ✅ Deploy to production
7. ✅ Set environment variables on hosting platform
8. ✅ Test production deployment

## 📞 Support

If you encounter issues:
1. Check Firebase Console for quota limits
2. Review browser console for JavaScript errors
3. Verify all environment variables are set correctly
4. Ensure Firebase security rules are published

---

**Remember**: Your content is now managed in real-time via Firebase. No more rebuilding the site for every content update! 🎉
