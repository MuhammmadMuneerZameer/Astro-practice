import React, { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const toggle=() => {
    setOpen(!open); 
    console.log(open)
  }

  return (
    <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
      <div
        className="w-[90vw] max-w-[720px] rounded-full border backdrop-blur-md px-4 py-2 flex justify-between items-center shadow-md transition-all duration-300"
        style={{
          background: "rgba(0, 0, 0, 0.6)",
          borderColor: "rgba(255, 255, 255, 0.2)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img
            src="/images/hfd-logo-withoutBg.png"
            alt="Hydra Fox Designs Logo"
            className="w-7 h-7 object-contain"
          />
        </div>

        {/* Hamburger Icon (Mobile Only) */}
        <button
          className="md:hidden flex flex-col justify-between w-6 h-5 focus:outline-none z-50"
          onClick={() => toggle()}
          aria-label="Toggle Menu"
        >
          <span
            className={`h-0.5 w-full bg-white transform transition duration-300 ${
              open ? "rotate-45 translate-y-2.5 " : ""
            }`}
          />
          <span
            className={`h-0.5 w-full bg-white transition-opacity duration-300 ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`h-0.5 w-full bg-white transform transition duration-300 ${
              open ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-6 text-white text-sm font-medium">
          <li><a href="/" className="hover:text-green-400">Home</a></li>
          <li><a href="/services" className="hover:text-green-400">Services</a></li>
          <li><a href="/aboutUs" className="hover:text-green-400">About Us</a></li>
          <li><a href="/blog" className="hover:text-green-400">Blog</a></li>
          <li><a href="/ContactUs" className="hover:text-green-400">Contact Us</a></li>
        </ul>

        {/* CTA Button */}
        <a
          href="/ContactUs"
          className="hidden md:flex items-center justify-center w-8 h-8 border border-green-400 rounded-full text-green-400 hover:bg-green-400 hover:text-black transition"
        >
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
  className={`md:hidden transition-all duration-300 ease-in-out mt-2 overflow-hidden w-[90vw] max-w-[720px] mx-auto rounded-xl border backdrop-blur-md px-4 ${
    open ? "max-h-[400px] opacity-100 py-4" : "max-h-0 opacity-0 py-0"
  }`}
  style={{
    background: "rgba(0, 0, 0, 0.6)",
    borderColor: "rgba(255, 255, 255, 0.2)",
  }}
>
        <ul className="flex flex-col items-center gap-4 text-white text-sm font-medium">
          <li><a href="/" className="hover:text-green-400">Home</a></li>
          <li><a href="/services" className="hover:text-green-400">Services</a></li>
          <li><a href="/aboutUs" className="hover:text-green-400">About Us</a></li>
          <li><a href="/blog" className="hover:text-green-400">Blog</a></li>
          <li><a href="/ContactUs" className="hover:text-green-400">Contact Us</a></li>
        </ul>
      </div>
    </nav>
  );
}
