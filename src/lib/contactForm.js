// src/utils/ContactUsForm.js
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

export async function submitContactForm(formData) {
  try {
    // Reject if honeypot field is filled (bot detection)
    if (formData._gotcha) return { success: false, error: 'Invalid submission' };

    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!EMAIL_RE.test(String(formData.email || ''))) {
      return { success: false, error: 'Invalid email address' };
    }

    // Enforce field length limits before writing to Firestore
    const trim = (v, max) => String(v || '').trim().slice(0, max);

    const contactData = {
      firstName: trim(formData.firstName, 100),
      lastName:  trim(formData.lastName, 100),
      email:     trim(formData.email, 254),
      company:   trim(formData.company, 200),
      budget:    trim(formData.budget, 50),
      services:  Array.isArray(formData.services) ? formData.services.slice(0, 10) : [formData.services].filter(Boolean),
      message:   trim(formData.message, 2000),
      consent:   Boolean(formData.consent),
      submittedAt: serverTimestamp(),
      status: 'new',
      source: 'website'
    };

    // Add to Firestore 'contacts' collection
    const docRef = await addDoc(collection(db, 'contacts'), contactData);

    return { success: true, id: docRef.id };
    
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return { success: false, error: error.message };
  }
}