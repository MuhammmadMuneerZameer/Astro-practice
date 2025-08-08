// src/utils/ContactUsForm.js
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

export async function submitContactForm(formData) {
  try {
    const contactData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      company: formData.company || '',
      budget: formData.budget || '',
      services: Array.isArray(formData.services) ? formData.services : [formData.services].filter(Boolean),
      message: formData.message,
      consent: formData.consent,
      submittedAt: serverTimestamp(), // Use Firestore server timestamp
      status: 'new',
      source: 'website'
    };

    console.log('Submitting contact form:', contactData);

    // Add to Firestore 'contacts' collection
    const docRef = await addDoc(collection(db, 'contacts'), contactData);
    
    console.log('Contact form submitted with ID:', docRef.id);
    return { success: true, id: docRef.id };
    
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return { success: false, error: error.message };
  }
}