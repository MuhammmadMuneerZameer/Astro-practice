import { useState } from "react";
import { db } from '../lib/firebase.js';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc
} from 'firebase/firestore';

export default function AuditSection() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [store, setStore] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !name) return;

    setStatus("loading");

    try {
      const colRef = collection(db, "subscribers");

      const q = query(colRef, where("email", "==", email));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        setStatus("duplicate");
        return;
      }

      await addDoc(colRef, {
        name,
        email,
        store: store || '',
        type: 'audit_request',
        subscribedAt: new Date(),
      });

      setEmail("");
      setName("");
      setStore("");
      setStatus("success");
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <section id="audit" className="bg-black border-t border-white/10 px-4 md:px-8 py-24">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-16">

        {/* Left — value proposition */}
        <div className="max-w-xl">
          <p className="text-[#00f19f] text-xs font-bold tracking-[0.2em] uppercase mb-4">Free Audit</p>
          <h2 className="text-5xl md:text-6xl font-heading font-bold text-white leading-none mb-6">
            Get a free ecommerce growth audit.
          </h2>
          <p className="text-gray-500 text-base leading-relaxed mb-8">
            We review your Shopify store, ad account structure, email flows, and attribution
            setup — then send you the three biggest gaps costing you contribution margin.
            No pitch. No sales call required. Just the audit.
          </p>
          <ul className="space-y-3">
            {[
              'Shopify conversion rate & UX gaps',
              'Paid media MER analysis & attribution health',
              'Klaviyo flow coverage & AOV opportunities',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-400 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00f19f] flex-shrink-0 mt-1.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Right — minimal form */}
        <div className="w-full max-w-md">
          {status === "success" ? (
            <div className="border border-[#00f19f]/20 rounded-2xl p-8 bg-[#00f19f]/5">
              <p className="text-[#00f19f] font-bold text-lg mb-2">Audit request received.</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                We'll review your store and send the audit within 48 hours.
                Check your inbox — including spam, just in case.
              </p>
            </div>
          ) : (
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
              <div className="border-b border-white/20 focus-within:border-[#00f19f] transition-colors duration-300">
                <input
                  type="url"
                  placeholder="Your Shopify store URL (optional)"
                  value={store}
                  onChange={(e) => setStore(e.target.value)}
                  className="w-full py-3 bg-transparent text-white placeholder-gray-600 text-base focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="group self-start inline-flex items-center gap-3 text-white text-sm font-medium hover:text-[#00f19f] transition-colors duration-300 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "loading" ? "Sending request…" : "Get my free audit"}
                <span className="w-10 h-10 rounded-full border border-white/30 group-hover:border-[#00f19f] group-hover:bg-[#00f19f] flex items-center justify-center transition-all duration-500">
                  <svg className="w-4 h-4 text-white group-hover:text-black -rotate-45 group-hover:rotate-0 transition-all duration-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </button>

              {status === "duplicate" && (
                <p className="text-yellow-400 text-sm">
                  That email already has an audit request in. Check your inbox.
                </p>
              )}
              {status === "error" && (
                <p className="text-red-400 text-sm">
                  Something went wrong. Email us directly at{" "}
                  <a href="mailto:muneerzameer@hydrafoxdesigns.com" className="underline">
                    muneerzameer@hydrafoxdesigns.com
                  </a>
                </p>
              )}
            </form>
          )}
        </div>

      </div>
    </section>
  );
}
