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
      setStatus("error");
    }
  };

  return (
    <section className="bg-black border-t border-white/10 px-4 md:px-8 py-24">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-16">

        {/* Left — editorial heading */}
        <div className="max-w-xl">
          <p className="text-[#00f19f] text-xs font-bold tracking-[0.2em] uppercase mb-4">Newsletter</p>
          <h2 className="text-5xl md:text-6xl font-heading font-bold text-white leading-none mb-6">
            Stay in the loop.
          </h2>
          <p className="text-gray-500 text-base leading-relaxed">
            Get the latest insights, case studies, and design thinking delivered to your inbox. No spam.
          </p>
        </div>

        {/* Right — minimal form */}
        <div className="w-full max-w-md">
          <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
            <div className="border-b border-white/20 focus-within:border-[#00f19f] transition-colors duration-300">
              <input
                type="text"
                placeholder="Your name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full py-3 bg-transparent text-white placeholder-gray-600 text-base focus:outline-none"
              />
            </div>
            <div className="border-b border-white/20 focus-within:border-[#00f19f] transition-colors duration-300">
              <input
                type="email"
                placeholder="Your email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-3 bg-transparent text-white placeholder-gray-600 text-base focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="group self-start inline-flex items-center gap-3 text-white text-sm font-medium hover:text-[#00f19f] transition-colors duration-300 mt-2"
            >
              {status === "loading" ? "Subscribing..." : "Subscribe now"}
              <span className="w-10 h-10 rounded-full border border-white/30 group-hover:border-[#00f19f] group-hover:bg-[#00f19f] flex items-center justify-center transition-all duration-500">
                <svg className="w-4 h-4 text-white group-hover:text-black -rotate-45 group-hover:rotate-0 transition-all duration-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </button>

            {status === "success" && (
              <p className="text-[#00f19f] text-sm">You're subscribed!</p>
            )}
            {status === "error" && (
              <p className="text-red-400 text-sm">
                Email already subscribed or an error occurred.
              </p>
            )}
          </form>
        </div>

      </div>
    </section>
  );
}
