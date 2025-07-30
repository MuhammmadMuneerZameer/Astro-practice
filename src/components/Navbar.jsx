import React, { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav
      className=" absolute px-5 py-4 flex items-center justify-center items-center w-full md:space-between backdrop-blur-md border-b"
      style={{
        background: "rgba(255, 255, 255, 0.1)",
        borderColor: "rgba(255, 255, 255, 0.2)",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
      }}
    >
      <div className="flex items-center gap-3">
        <div className="font-bold text-lg text-white">Hydra Fox Designs</div>
        <button
          className="px-2 py-1 rounded-full transition-all duration-300 backdrop-blur-sm border"
          style={{
            background: "rgba(255, 255, 255, 0.15)",
            borderColor: "rgba(255, 255, 255, 0.3)",
            color: "white",
          }}
          onClick={() => {
            document.documentElement.classList.toggle("dark");
          }}
          aria-label="Toggle Theme"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.07l-.71.71M21 12h-1M4 12H3m16.95 7.07l-.71-.71M4.05 4.93l-.71-.71M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        </button>
      </div>
      
      {/* Hamburger Icon */}
      <button
        className="md:hidden flex flex-col justify-center items-center w-8 h-8 focus:outline-none"
        aria-label="Toggle Menu"
        onClick={() => setOpen(!open)}
      >
        <span
          className={`block h-0.5 w-5 transition-transform duration-300 bg-white`}
          style={{
            transform: open ? "rotate(45deg) translateY(4px)" : "none"
          }}
        ></span>
        <span
          className={`block h-0.5 w-5 my-1 transition-opacity duration-300 bg-white`}
          style={{
            opacity: open ? 0 : 1,
          }}
        ></span>
        <span
          className={`block h-0.5 w-5 transition-transform duration-300 bg-white`}
          style={{
            transform: open ? "rotate(-45deg) translateY(-4px)" : "none"
          }}
        ></span>
      </button>

      {/* Desktop Menu */}
      <ul className="hidden md:flex items-center gap-10 px-8">
        <li>
          <a href="/" className="text-white/90 hover:text-white transition-colors text-sm">
            Home
          </a>
        </li>
        <li>
          <a href="/aboutUs" className="text-white/90 hover:text-white transition-colors text-sm">
            About
          </a>
        </li>
        <li>
          <a href="/blog" className="text-white/90 hover:text-white transition-colors text-sm">
            Blog
          </a>
        </li>
        <li className="relative group">
          <button className="text-white/90 hover:text-white transition-colors text-sm focus:outline-none">
            Services
          </button>
          <ul 
            className="absolute left-0 mt-2 rounded-lg shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 min-w-[140px] z-10 backdrop-blur-md border"
            style={{ 
              background: "rgba(255, 255, 255, 0.1)",
              borderColor: "rgba(255, 255, 255, 0.2)",
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)"
            }}
          >
            <li>
              <a href="/services/web" className="block px-3 py-2 text-white/90 hover:text-white hover:bg-white/10 text-sm">
                Web Dev
              </a>
            </li>
            <li>
              <a href="/services/app" className="block px-3 py-2 text-white/90 hover:text-white hover:bg-white/10 text-sm">
                App Dev
              </a>
            </li>
            <li>
              <a href="/services/seo" className="block px-3 py-2 text-white/90 hover:text-white hover:bg-white/10 text-sm">
                SEO
              </a>
            </li>
          </ul>
        </li>
        <li>
          <a href="/product" className="text-white/90 hover:text-white transition-colors text-sm">
            Products
          </a>
        </li>
      </ul>

      <a
        href="/book-call"
        className="hidden md:inline-block font-medium rounded-full px-4 py-1.5 transition-all duration-300 text-sm backdrop-blur-sm border"
        style={{
          background: "rgba(255, 255, 255, 0.2)",
          borderColor: "rgba(255, 255, 255, 0.3)",
          color: "white",
        }}
      >
        Book Call
      </a>

      {/* Mobile Menu */}
      <div
        className={`absolute top-full left-0 w-full transition-all duration-300 z-20 backdrop-blur-md border-t ${
          open ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        }`}
        style={{ 
          background: "rgba(255, 255, 255, 0.1)",
          borderColor: "rgba(255, 255, 255, 0.2)",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)"
        }}
      >
        <ul className="flex flex-col items-center gap-3 py-4">
          <li><a href="/" className="text-white/90 hover:text-white transition-colors text-sm">Home</a></li>
          <li><a href="/aboutUs" className="text-white/90 hover:text-white transition-colors text-sm">About</a></li>
          <li><a href="/blog" className="text-white/90 hover:text-white transition-colors text-sm">Blog</a></li>
          <li className="text-center">
            <button className="text-white/90 hover:text-white transition-colors text-sm mb-2">Services</button>
            <div 
              className="rounded-lg backdrop-blur-sm border p-2"
              style={{ 
                background: "rgba(255, 255, 255, 0.1)",
                borderColor: "rgba(255, 255, 255, 0.2)"
              }}
            >
              <a href="/services/web" className="block px-3 py-1 text-white/90 hover:text-white text-sm">Web Dev</a>
              <a href="/services/app" className="block px-3 py-1 text-white/90 hover:text-white text-sm">App Dev</a>
              <a href="/services/seo" className="block px-3 py-1 text-white/90 hover:text-white text-sm">SEO</a>
            </div>
          </li>
          <li><a href="/product" className="text-white/90 hover:text-white transition-colors text-sm">Products</a></li>
          <li>
            <a
              href="/book-call"
              className="font-medium rounded-full px-4 py-1.5 transition-all duration-300 text-sm backdrop-blur-sm border"
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                borderColor: "rgba(255, 255, 255, 0.3)",
                color: "white",
              }}
            >
              Book Call
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}