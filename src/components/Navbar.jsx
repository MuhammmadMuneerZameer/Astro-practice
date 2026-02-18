import React, { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const toggle = () => {
    setOpen(!open);
    console.log(open)
  }

  return (
    <nav className="fixed top-2 sm:top-4 md:top-6 left-1/2 transform -translate-x-1/2 z-50">
      <div
        className="w-[95vw] sm:w-[90vw] max-w-[720px] rounded-full border backdrop-blur-md px-3 sm:px-4 py-2 flex justify-between items-center shadow-md transition-all duration-300"
        style={{
          background: "rgba(0, 0, 0, 0.6)",
          borderColor: "rgba(255, 255, 255, 0.2)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2">
          <a href="/" className="flex items-center gap-2">
            <img
              src="/images/hfd-logo-withoutBg.png"
              alt="Hydra Fox Designs Logo"
              className="w-6 h-6 sm:w-7 sm:h-7 object-contain"
            />
          </a>
        </div>

        {/* Hamburger Icon (Mobile Only) */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-6 h-6 focus:outline-none z-50 gap-2 mr-3"
          onClick={() => toggle()}
          aria-label="Toggle Menu"
        >
          <span
            className={`h-0.5 w-full bg-white transform transition-all duration-300 ease-in-out ${open ? "rotate-45 translate-y-[10px] translate-x-[-2.5px]" : ""
              }`}
          />
          <span
            className={`h-0.5 w-full bg-white transition-all duration-300 ease-in-out ${open ? "opacity-0" : "opacity-100"
              }`}
          />
          <span
            className={`h-0.5 w-full bg-white transform transition-all duration-300 ease-in-out ${open ? "-rotate-45 -translate-y-[9px] translate-x-[-2.5px]" : ""
              }`}
          />
        </button>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-6 text-white text-sm font-medium">
          {/* <li><a href="/" className="hover:text-green-400">Home</a></li> */}
          <li><a href="/services/" className="hover:text-[var(--color-accent)]">Services</a></li>
          <li><a href="/work/" className="hover:text-[var(--color-accent)]">Work</a></li>
          <li><a href="/industries/" className="hover:text-[var(--color-accent)]">Industries</a></li>
          <li><a href="/resources/" className="hover:text-[var(--color-accent)]">Resources</a></li>
          <li><a href="/about/" className="hover:text-[var(--color-accent)]">About</a></li>
        </ul>

        {/* CTA Button */}
        <a
          href="/contact/"
          className="hidden md:flex items-center justify-center w-max h-8 px-4 gap-2 border border-[var(--color-accent)] rounded-full text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-black transition"
        >lets Connect
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out mt-2 overflow-hidden w-[95vw] sm:w-[90vw] max-w-[720px] mx-auto rounded-xl border backdrop-blur-md px-4 ${open ? "max-h-[400px] opacity-100 py-4" : "max-h-0 opacity-0 py-0"
          }`}
        style={{
          background: "rgba(0, 0, 0, 0.6)",
          borderColor: "rgba(255, 255, 255, 0.2)",
        }}
      >
        <ul className="flex flex-col items-center gap-4 text-white text-sm font-medium">
          <li><a href="/" className="hover:text-[var(--color-accent)]">Home</a></li>
          <li><a href="/services/" className="hover:text-[var(--color-accent)]">Services</a></li>
          <li><a href="/work/" className="hover:text-[var(--color-accent)]">Work</a></li>
          <li><a href="/industries/" className="hover:text-[var(--color-accent)]">Industries</a></li>
          <li><a href="/resources/" className="hover:text-[var(--color-accent)]">Resources</a></li>
          <li><a href="/about/" className="hover:text-[var(--color-accent)]">About</a></li>
          <li><a href="/contact/" className="hover:text-[var(--color-accent)]">Contact</a></li>
        </ul>
      </div>
    </nav>
  );
}
