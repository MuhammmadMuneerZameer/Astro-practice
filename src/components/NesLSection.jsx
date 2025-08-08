import { useState } from "react";
import { db } from '../lib/firebase.js';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc
} from 'firebase/firestore';

export default function NesLSection() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !name) return;

    setStatus("loading");

    try {
      const colRef = collection(db, "subscribers");

      // Check if email already exists
      const q = query(colRef, where("email", "==", email));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        setStatus("error");
        return;
      }

      // Add subscriber to Firestore
      await addDoc(colRef, {
        name,
        email,
        subscribedAt: new Date(),
      });

      setEmail("");
      setName("");
      setStatus("success");
    } catch (err) {
      console.error("Firebase Error:", err);
      setStatus("error");
    }
  };

  return (
    <section className="py-20 px-4 overflow-x-hidden bg-gradient-to-r from-black to-gray-900 text-white">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left Text Content */}
        <div className="max-w-xl">
          <h2 className="text-4xl font-bold leading-tight text-green-300">
            Join our newsletter <br /> & stay updated.
          </h2>
          <p className="mt-4 text-[var(--color-text-light)]">
            Get the latest content in your inbox every week. We don’t spam.
          </p>
        </div>

        {/* Right Form */}
        <div className="bg-black p-6 rounded-lg w-full max-w-md shadow-md py-[10vh]">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Enter Your Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-full border border-gray-700 bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            />
            <input
              type="email"
              placeholder="Enter Your Email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-full border border-gray-700 bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            />

            <button
              type="submit"
              className="w-full py-4 my-4 px-4 hero-button rounded-full bg-black/80 backdrop-blur-sm shadow-green-200 shadow-md transition-all hover:text-black ease-in-out duration-300 overflow-hidden text-white font-medium hover:bg-[var(--color-accent-hover)]"
            >
              {status === "loading" ? "Subscribing..." : "Subscribe Now"}
            </button>

            {status === "success" && (
              <p className="text-green-400 text-sm">You're subscribed! 🎉</p>
            )}
            {status === "error" && (
              <p className="text-red-400 text-sm">
                Email already subscribed or error occurred.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
