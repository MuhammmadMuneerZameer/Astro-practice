// Script to add sample blog posts to Firebase Firestore
// Run with: node scripts/add-sample-blogs.js

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

// Load environment variables from .env
import 'dotenv/config';

const firebaseConfig = {
  apiKey: process.env.PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.PUBLIC_FIREBASE_MEASURMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const sampleBlogs = [
  {
    title: "How to Use Astro with Firebase",
    slug: "astro-firebase-setup",
    content: `# How to Use Astro with Firebase

Astro is a modern static site generator that's perfect for building fast, content-focused websites. When combined with Firebase, you get a powerful backend-as-a-service solution that can handle authentication, database operations, and file storage.

## Getting Started

First, you'll need to install the necessary dependencies:

\`\`\`bash
npm install firebase
\`\`\`

## Configuration

Create a Firebase configuration file in your Astro project:

\`\`\`javascript
// src/lib/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  // Your config here
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
\`\`\`

## Benefits

- **Fast Performance**: Astro's static generation with Firebase's real-time capabilities
- **Easy Authentication**: Built-in user management
- **Scalable Database**: Firestore handles scaling automatically
- **File Storage**: Firebase Storage for images and assets

This combination is perfect for blogs, portfolios, and content-driven websites.`,
    description: "Learn how to connect Astro with Firebase for powerful static sites with dynamic capabilities.",
    image: "https://images.pexels.com/photos/998641/pexels-photo-998641.jpeg",
    tag: "Tutorial",
    category: "Development",
    date: "15 January",
    status: "published"
  },
  {
    title: "Mastering Astro for Static Site Generation",
    slug: "astro-static-site-guide",
    content: `# Mastering Astro for Static Site Generation

Astro is revolutionizing how we build static websites. With its unique "islands architecture," Astro delivers the best of both worlds: the performance of static sites with the interactivity of modern web applications.

## What Makes Astro Special?

### Islands Architecture
Astro's islands architecture allows you to build mostly static HTML with small, interactive "islands" of JavaScript. This means:

- **Faster Loading**: Only the JavaScript you need is loaded
- **Better SEO**: Content is server-rendered by default
- **Framework Agnostic**: Use React, Vue, Svelte, or vanilla JS

### Zero JavaScript by Default
Unlike traditional SPAs, Astro ships zero JavaScript by default. Components are rendered to static HTML, and JavaScript is only added when explicitly requested.

## Getting Started

\`\`\`bash
npm create astro@latest my-astro-site
cd my-astro-site
npm run dev
\`\`\`

## Key Features

- **Component Islands**: Mix and match different frameworks
- **Built-in Optimizations**: Image optimization, CSS bundling, and more
- **Content Collections**: Type-safe content management
- **Deployment Ready**: Works with Vercel, Netlify, and more

Astro is perfect for content-heavy sites like blogs, documentation, and marketing pages.`,
    description: "Learn how Astro outperforms other static site generators with islands architecture and zero-JS approach.",
    image: "https://images.pexels.com/photos/11035310/pexels-photo-11035310.jpeg",
    tag: "Featured",
    category: "Development",
    date: "12 January",
    status: "published"
  },
  {
    title: "Firebase Authentication in Astro Projects",
    slug: "astro-firebase-auth",
    content: `# Firebase Authentication in Astro Projects

Adding user authentication to your Astro site with Firebase is straightforward and powerful. This guide will walk you through setting up Firebase Auth with your Astro project.

## Why Firebase Auth?

Firebase Authentication provides:

- **Multiple Providers**: Email/password, Google, GitHub, and more
- **Security**: Built-in security features and best practices
- **Scalability**: Handles millions of users effortlessly
- **Easy Integration**: Simple APIs for all major frameworks

## Setup Process

### 1. Enable Authentication

In your Firebase Console:
1. Go to Authentication
2. Click "Get Started"
3. Choose your sign-in methods

### 2. Install Dependencies

\`\`\`bash
npm install firebase
\`\`\`

### 3. Configure Firebase

\`\`\`javascript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
\`\`\`

## Implementation Example

\`\`\`javascript
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";

async function handleLogin(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("User logged in:", userCredential.user);
  } catch (error) {
    console.error("Login error:", error.message);
  }
}
\`\`\`

## Security Considerations

- Always validate user input
- Use Firebase Security Rules
- Implement proper error handling
- Consider rate limiting for sensitive operations

Firebase Auth makes user management simple and secure for your Astro applications.`,
    description: "Secure your Astro apps with Firebase Authentication and learn best practices for user management.",
    image: "https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg",
    tag: "Security",
    category: "Development",
    date: "10 January",
    status: "published"
  }
];

async function addSampleBlogs() {
  try {
    console.log("🚀 Adding sample blog posts to Firebase...");

    for (const blog of sampleBlogs) {
      const blogData = {
        ...blog,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, "post"), blogData);
      console.log(`✅ Added blog: "${blog.title}" with ID: ${docRef.id}`);
    }

    console.log("🎉 All sample blogs added successfully!");
    console.log("📝 You can now visit your blog page to see the posts.");

  } catch (error) {
    console.error("❌ Error adding blogs:", error);
  }
}

// Run the script
addSampleBlogs();
