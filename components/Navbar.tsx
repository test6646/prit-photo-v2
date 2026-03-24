"use client";

import React, { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: 'Home',     href: '#home'    },
    { label: 'Albums',   href: '#albums'  },
    { label: 'About',    href: '#about'   },
    { label: 'Contact',  href: '#contact' },
  ];

  return (
    <>
      {/* Main Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--background)] border-b border-[var(--silver-soft)] text-[var(--text)]">
        <div className="mx-auto px-5 sm:px-8 lg:px-12 max-w-7xl">
          <div className="flex h-16 sm:h-20 items-center justify-between">
            {/* Logo - always visible */}
            <div className="text-2xl sm:text-3xl font-semibold tracking-tight [font-family:blauer]">
              * PRIT PHOTO
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-10 lg:gap-12 uppercase text-sm tracking-wider [font-family:blauer]">
              {menuItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="relative py-2 transition-colors hover:text-[var(--accent)] group"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                  <span className="absolute left-0 bottom-1 h-[0.5px] w-0 bg-[var(--accent)] transition-all duration-200 group-hover:w-full" />
                </a>
              ))}
            </div>

            {/* Mobile Hamburger / Close button */}
            <button
              className="md:hidden p-2 -mr-2 text-[var(--text)] focus:outline-none"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? (
                // Close (X) SVG
                <svg
                  className="h-7 w-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                // Hamburger (≡) SVG
                <svg
                  className="h-7 w-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Full-screen Menu Overlay */}
      <div
        className={`
          fixed inset-0 z-40 bg-[var(--background)] flex flex-col items-center justify-center
          transition-all duration-500 ease-in-out
          ${isOpen 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 -translate-y-full pointer-events-none'}
        `}
      >
        <button
          className="absolute top-6 right-6 p-4 text-[var(--text)] md:hidden focus:outline-none"
          onClick={() => setIsOpen(false)}
          aria-label="Close menu"
        >
          <svg
            className="h-8 w-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <ul className="flex flex-col items-center gap-10 sm:gap-12 text-2xl sm:text-4xl uppercase tracking-widest [font-family:blauer]">
          {menuItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="relative inline-block py-3 px-6 hover:text-[var(--accent)] transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Spacer so content doesn't hide under fixed navbar */}
      <div className="h-16 sm:h-20" />
    </>
  );
}