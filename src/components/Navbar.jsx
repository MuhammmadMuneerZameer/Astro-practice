import React, { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav
      style={{
        background: "var(--color-primary)",
        color: "var(--color-text)",
      }}
      className="px-6 py-3 flex items-center justify-between relative"
    >
      <div class="flex gap-3">
        <div className="font-bold text-lg">Hydra Fox</div>
      <button
  className=" px-2  py-1 rounded transition font-medium flex items-center justify-center"
  style={{
    background: "var(--color-card)",
    color: "var(--color-text)",
  }}
  onClick={() => {
    document.documentElement.classList.toggle("dark");
  }}
  aria-label="Toggle Theme"
>
  {/* Sun/Moon Icon */}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
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
        className="md:hidden flex flex-col justify-center items-center w-10 h-10 focus:outline-none"
        aria-label="Toggle Menu"
        onClick={() => setOpen(!open)}
      >
        <span
          className={`block h-0.5 w-6 transition-transform duration-300`}
          style={{ background: "var(--color-text)" }}
          {...(open ? { style: { ...{ background: "var(--color-text)" }, transform: "rotate(45deg) translateY(8px)" } } : {})}
        ></span>
        <span
          className={`block h-0.5 w-6 my-1 transition-opacity duration-300`}
          style={{
            background: "var(--color-text)",
            opacity: open ? 0 : 1,
          }}
        ></span>
        <span
          className={`block h-0.5 w-6 transition-transform duration-300`}
          style={{ background: "var(--color-text)" }}
          {...(open ? { style: { ...{ background: "var(--color-text)" }, transform: "rotate(-45deg) translateY(-8px)" } } : {})}
        ></span>
      </button>
      {/* Desktop Menu */}
      <ul className="hidden md:flex items-center gap-6">
        <li>
          <a href="/" style={{ color: "var(--color-text)" }} className="hover:text-blue-300">
            Home
          </a>
        </li>
        <li>
          <a href="/aboutUs" style={{ color: "var(--color-text)" }} className="hover:text-blue-300">
            About Us
          </a>
        </li>
        <li>
          <a href="/blog" style={{ color: "var(--color-text)" }} className="hover:text-blue-300">
            Blogs
          </a>
        </li>
        <li className="relative group">
          <button className="hover:text-blue-300 focus:outline-none" style={{ color: "var(--color-text)" }}>
            Services
          </button>
          <ul className="absolute left-0 mt-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity min-w-[140px] z-10"
            style={{ background: "var(--color-card)", color: "var(--color-primary)" }}>
            <li>
              <a href="/services/web" className="block px-4 py-2 hover:bg-blue-100">
                Web Development
              </a>
            </li>
            <li>
              <a href="/services/app" className="block px-4 py-2 hover:bg-blue-100">
                App Development
              </a>
            </li>
            <li>
              <a href="/services/seo" className="block px-4 py-2 hover:bg-blue-100">
                SEO
              </a>
            </li>
          </ul>
        </li>
        <li>
          <a href="/product" style={{ color: "var(--color-text)" }} className="hover:text-blue-300">
            Products
          </a>
        </li>
      </ul>
      <a
        href="/book-call"
        className="hidden md:inline-block font-semibold rounded px-4 py-2 transition"
        style={{
          background: "var(--color-accent)",
          color: "var(--color-primary)",
        }}
      >
        Book A Call
      </a>
      {/* Mobile Menu */}
      <div
        className={`absolute top-full left-0 w-full transition-all duration-300 z-20 ${
          open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        }`}
        style={{ background: "var(--color-primary)" }}
      >
        <ul className="flex flex-col items-center gap-4 py-4">
          <li>
            <a href="/" style={{ color: "var(--color-text)" }} className="hover:text-blue-300 block">
              Home
            </a>
          </li>
          <li>
            <a href="/aboutUs" style={{ color: "var(--color-text)" }} className="hover:text-blue-300 block">
              About Us
            </a>
          </li>
          <li>
            <a href="/blog" style={{ color: "var(--color-text)" }} className="hover:text-blue-300 block">
              Blogs
            </a>
          </li>
          <li className="relative group w-full text-center">
            <button className="hover:text-blue-300 focus:outline-none w-full" style={{ color: "var(--color-text)" }}>
              Services
            </button>
            <ul className="rounded shadow-lg mt-2"
              style={{ background: "var(--color-card)", color: "var(--color-primary)" }}>
              <li>
                <a href="/services/web" className="block px-4 py-2 hover:bg-blue-100">
                  Web Development
                </a>
              </li>
              <li>
                <a href="/services/app" className="block px-4 py-2 hover:bg-blue-100">
                  App Development
                </a>
              </li>
              <li>
                <a href="/services/seo" className="block px-4 py-2 hover:bg-blue-100">
                  SEO
                </a>
              </li>
            </ul>
          </li>
          <li>
            <a href="/product" style={{ color: "var(--color-text)" }} className="hover:text-blue-300 block">
              Products
            </a>
          </li>
          <li>
            <a
              href="/book-call"
              className="font-semibold rounded px-4 py-2 transition block"
              style={{
                background: "var(--color-accent)",
                color: "var(--color-primary)",
              }}
            >
              Book A Call
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}