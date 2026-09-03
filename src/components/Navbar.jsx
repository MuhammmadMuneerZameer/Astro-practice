import React, { useState, useEffect } from "react";

const SERVICE_LINKS = [
  { label: "Ecommerce Growth", href: "/services/ecommerce-growth/" },
  { label: "Shopify Stores",   href: "/services/shopify/" },
  { label: "Growth Tools",     href: "/services/growth-tools/" },
  { label: "Brand & Content",  href: "/services/brand-content/" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [hidden, setHidden] = useState(() =>
    typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')
  );

  useEffect(() => {
    const check = () => setHidden(window.location.pathname.startsWith('/admin'));
    document.addEventListener('astro:page-load', check);
    return () => document.removeEventListener('astro:page-load', check);
  }, []);

  function handleLogoClick(e) {
    if (window.location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  if (hidden) return null;

  return (
    <nav className="fixed top-2 sm:top-4 md:top-6 left-1/2 -translate-x-1/2 z-50 w-[95vw] sm:w-[90vw] max-w-[900px]">

      {/* ── Main pill ──────────────────────────────────────────────────────────── */}
      <div
        className="rounded-full border backdrop-blur-md px-3 sm:px-4 py-2 flex justify-between items-center shadow-md transition-all duration-300"
        style={{ background: "rgba(0,0,0,0.6)", borderColor: "rgba(255,255,255,0.2)" }}
      >
        {/* Logo */}
        <a href="/" onClick={handleLogoClick} className="flex items-center gap-2 flex-shrink-0 cursor-pointer py-2 px-1 -my-2 -mx-1">
          <img
            src="/images/hfd-logo-withoutBg.png"
            alt="Hydra Fox Designs Logo"
            className="w-6 h-6 sm:w-7 sm:h-7 object-contain"
            width="28"
            height="28"
          />
        </a>

        {/* Hamburger (mobile only) */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-6 h-6 focus:outline-none z-50 gap-2 mr-3"
          onClick={() => setOpen(!open)}
          aria-label="Toggle Menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          <span className={`h-0.5 w-full bg-white transform transition-all duration-300 ease-in-out ${open ? "rotate-45 translate-y-[10px] translate-x-[-2.5px]" : ""}`} />
          <span className={`h-0.5 w-full bg-white transition-all duration-300 ease-in-out ${open ? "opacity-0" : "opacity-100"}`} />
          <span className={`h-0.5 w-full bg-white transform transition-all duration-300 ease-in-out ${open ? "-rotate-45 -translate-y-[9px] translate-x-[-2.5px]" : ""}`} />
        </button>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-5 text-white text-sm font-medium">
          <li>
            <a href="/ecommerce/" className="hover:text-[var(--color-accent)] transition-colors duration-200">
              Ecommerce
            </a>
          </li>
          <li>
            <a href="/work/" className="hover:text-[var(--color-accent)] transition-colors duration-200">
              Work
            </a>
          </li>

          {/* Services with hover dropdown */}
          <li className="relative group">
            <a
              href="/services/"
              className="flex items-center gap-1 hover:text-[var(--color-accent)] transition-colors duration-200"
            >
              Services
              <svg
                className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-all duration-200 group-hover:rotate-180"
                fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </a>

            {/* Dropdown panel — shown on group hover */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200">
              <div
                className="rounded-xl border py-1.5 min-w-[210px] shadow-xl"
                style={{ background: "rgba(6,6,6,0.92)", borderColor: "rgba(255,255,255,0.12)", backdropFilter: "blur(12px)" }}
              >
                {SERVICE_LINKS.map(({ label, href }) => (
                  <a
                    key={href}
                    href={href}
                    className="flex items-center gap-2 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/5 text-sm transition-colors duration-150"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#00f19f] flex-shrink-0 opacity-0 group-hover:opacity-100" />
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </li>

          <li>
            <a href="/pricing/" className="hover:text-[var(--color-accent)] transition-colors duration-200">
              Pricing
            </a>
          </li>
          <li>
            <a href="/resources/" className="hover:text-[var(--color-accent)] transition-colors duration-200">
              Resources
            </a>
          </li>
          <li>
            <a href="/about/" className="hover:text-[var(--color-accent)] transition-colors duration-200">
              About
            </a>
          </li>
        </ul>

        {/* Desktop CTA */}
        <a
          href="/audit/"
          className="hidden md:flex items-center justify-center w-max h-8 px-4 gap-2 bg-[var(--color-accent)] rounded-full text-black hover:bg-white transition text-sm font-bold flex-shrink-0"
        >
          Free audit
        </a>
      </div>

      {/* ── Mobile dropdown ────────────────────────────────────────────────────── */}
      <div
        id="mobile-menu"
        role="navigation"
        aria-label="Mobile navigation"
        className={`md:hidden transition-all duration-300 ease-in-out mt-2 overflow-hidden w-full rounded-xl border backdrop-blur-md px-4 ${open ? "max-h-[520px] opacity-100 py-4" : "max-h-0 opacity-0 py-0"}`}
        style={{ background: "rgba(0,0,0,0.85)", borderColor: "rgba(255,255,255,0.2)" }}
      >
        <ul className="flex flex-col gap-0 text-white text-sm font-medium">
          <li className="py-3 border-b border-white/5">
            <a href="/ecommerce/" className="block hover:text-[var(--color-accent)] transition-colors">Ecommerce</a>
          </li>
          <li className="py-3 border-b border-white/5">
            <a href="/work/" className="block hover:text-[var(--color-accent)] transition-colors">Work</a>
          </li>

          {/* Services accordion */}
          <li className="border-b border-white/5">
            <button
              onClick={() => setServicesOpen(!servicesOpen)}
              className="w-full flex items-center justify-between py-3 text-white hover:text-[var(--color-accent)] transition-colors"
              aria-expanded={servicesOpen}
            >
              <span>Services</span>
              <svg
                className={`w-3.5 h-3.5 opacity-50 transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`}
                fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {servicesOpen && (
              <ul className="pb-3 pl-3 border-l border-white/10 flex flex-col gap-3 mt-1">
                {SERVICE_LINKS.map(({ label, href }) => (
                  <li key={href}>
                    <a href={href} className="block text-gray-400 hover:text-white text-sm transition-colors">{label}</a>
                  </li>
                ))}
              </ul>
            )}
          </li>

          <li className="py-3 border-b border-white/5">
            <a href="/pricing/" className="block hover:text-[var(--color-accent)] transition-colors">Pricing</a>
          </li>
          <li className="py-3 border-b border-white/5">
            <a href="/resources/" className="block hover:text-[var(--color-accent)] transition-colors">Resources</a>
          </li>
          <li className="py-3 border-b border-white/5">
            <a href="/about/" className="block hover:text-[var(--color-accent)] transition-colors">About</a>
          </li>
          <li className="py-3 border-b border-white/5">
            <a href="/contact/" className="block hover:text-[var(--color-accent)] transition-colors">Contact</a>
          </li>
          <li className="pt-4">
            <a
              href="/audit/"
              className="inline-flex items-center justify-center w-full py-3 bg-[var(--color-accent)] rounded-full text-black font-bold text-sm transition-colors hover:bg-white"
            >
              Get a free audit
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
