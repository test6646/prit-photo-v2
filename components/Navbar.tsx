"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function Navbar() {

  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: "HOME", id: "home" },
    { label: "ABOUT", id: "about" },
    { label: "STORIES", id: "stories" },
    { label: "SERVICES", id: "services" },
    { label: "TESTIMONIALS", id: "testimonials" },
    { label: "CONTACT", id: "contact" },
    { label: "FAQs", id: "faqs" },
  ];

  const scrollToSection = (id: string) => {
    setIsOpen(false);

    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
        document.body.style.overflow = "auto";
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const textVariants = {
    initial: { y: "0%" },
    hover: { y: "-100%" },
  };

  const secondaryTextVariants = {
    initial: { y: "100%" },
    hover: { y: "0%" },
  };

  const hoverTransition = {
    type: "spring",
    stiffness: 520,
    damping: 32,
  };

  return (
    <>
      {/* NAVBAR */}
      <nav
        className="
        fixed left-1/2 -translate-x-1/2
        z-50 w-full
        backdrop-blur-lg
        bg-[var(--background)]/80
        py-3
        border-b-1
        "
      >
        <div className="flex items-center justify-between px-5 sm:px-7 md:px-10 h-[64px]">

          {/* LOGO */}
          <button
            onClick={() => scrollToSection("home")}
            className="
            flex items-center gap-2
            text-xl sm:text-2xl
            font-semibold
            tracking-tight
            [font-family:blauer]
            "
          >
            <span className="text-[var(--accent)] text-2xl">*</span>
            PRIT PHOTO
          </button>

          {/* DESKTOP MENU */}
          <div
            className="
            hidden md:flex
            items-center
            gap-8 lg:gap-7
            text-[13px]
            tracking-[1.4px]
            [font-family:blauer]
            "
          >

            {menuItems.map((item) => (

              <motion.button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="group relative overflow-hidden h-[20px] flex items-center"
                initial="initial"
                whileHover="hover"
              >

                <motion.span
                  variants={textVariants}
                  transition={hoverTransition}
                  className="block"
                >
                  {item.label}
                </motion.span>

                <motion.span
                  variants={secondaryTextVariants}
                  transition={hoverTransition}
                  className="absolute inset-0 text-[var(--accent)] flex items-center"
                >
                  {item.label}
                </motion.span>

              </motion.button>

            ))}

          </div>

          <Link
            href="/admin"
            className="hidden md:block hover:text-[var(--silver)] transition-colors border-1 border-[var(--silver)]/50 p-3 rounded-full text-sm"
          >
            <svg fill="currentColor" width="25px" height="25px" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg">
              <path d="M983.727 5.421 1723.04 353.62c19.765 9.374 32.414 29.252 32.414 51.162v601.525c0 489.6-424.207 719.774-733.779 887.943l-34.899 18.975c-8.47 4.517-17.731 6.889-27.105 6.889-9.262 0-18.523-2.372-26.993-6.89l-34.9-18.974C588.095 1726.08 164 1495.906 164 1006.306V404.78c0-21.91 12.65-41.788 32.414-51.162L935.727 5.42c15.134-7.228 32.866-7.228 48 0ZM757.088 383.322c-176.075 0-319.285 143.323-319.285 319.398 0 176.075 143.21 319.285 319.285 319.285 1.92 0 3.84 0 5.76-.113l58.504 58.503h83.689v116.781h116.781v83.803l91.595 91.482h313.412V1059.05l-350.57-350.682c.114-1.807.114-3.727.114-5.647 0-176.075-143.21-319.398-319.285-319.398Zm0 112.942c113.732 0 206.344 92.724 205.327 216.62l-3.953 37.271 355.426 355.652v153.713h-153.713l-25.412-25.299v-149.986h-116.78v-116.78H868.108l-63.812-63.7-47.209 5.309c-113.732 0-206.344-92.5-206.344-206.344 0-113.732 92.612-206.456 206.344-206.456Zm4.98 124.98c-46.757 0-84.705 37.948-84.705 84.706s37.948 84.706 84.706 84.706c46.757 0 84.706-37.948 84.706-84.706s-37.949-84.706-84.706-84.706Z" fillRule="evenodd" />
            </svg>
          </Link>

          {/* MOBILE BUTTON */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            <motion.div
              animate={{ rotate: isOpen ? 90 : 0 }}
              transition={{ duration: 0.25 }}
            >

              {isOpen ? (

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>

              ) : (

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>

              )}

            </motion.div>
          </button>

        </div>
      </nav>


      {/* MOBILE MENU */}
      <AnimatePresence>

        {isOpen && (

          <motion.div
            initial={{ y: "-120%" }}
            animate={{ y: 0 }}
            exit={{ y: "-120%" }}
            transition={{
              type: "spring",
              stiffness: 240,
              damping: 28,
            }}
            className="
            fixed inset-0 z-40
            bg-[var(--background)]/95
            backdrop-blur-2xl
            flex flex-col items-center justify-center
            "
          >

            <ul className="flex flex-col items-center gap-6 text-3xl uppercase tracking-widest [font-family:blauer]">

              {menuItems.map((item) => (

                <li key={item.id}>
                  <button
                    onClick={() => scrollToSection(item.id)}
                    className="hover:text-[var(--accent)] transition-colors"
                  >
                    {item.label}
                  </button>
                </li>

              ))}

              <li>
                <Link
            href="/admin"
            className="md:hidden block hover:text-[var(--silver)] transition-colors border-1 border-[var(--silver)]/50 p-3 rounded-full text-sm"
          >
            <svg fill="currentColor" width="25px" height="25px" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg">
              <path d="M983.727 5.421 1723.04 353.62c19.765 9.374 32.414 29.252 32.414 51.162v601.525c0 489.6-424.207 719.774-733.779 887.943l-34.899 18.975c-8.47 4.517-17.731 6.889-27.105 6.889-9.262 0-18.523-2.372-26.993-6.89l-34.9-18.974C588.095 1726.08 164 1495.906 164 1006.306V404.78c0-21.91 12.65-41.788 32.414-51.162L935.727 5.42c15.134-7.228 32.866-7.228 48 0ZM757.088 383.322c-176.075 0-319.285 143.323-319.285 319.398 0 176.075 143.21 319.285 319.285 319.285 1.92 0 3.84 0 5.76-.113l58.504 58.503h83.689v116.781h116.781v83.803l91.595 91.482h313.412V1059.05l-350.57-350.682c.114-1.807.114-3.727.114-5.647 0-176.075-143.21-319.398-319.285-319.398Zm0 112.942c113.732 0 206.344 92.724 205.327 216.62l-3.953 37.271 355.426 355.652v153.713h-153.713l-25.412-25.299v-149.986h-116.78v-116.78H868.108l-63.812-63.7-47.209 5.309c-113.732 0-206.344-92.5-206.344-206.344 0-113.732 92.612-206.456 206.344-206.456Zm4.98 124.98c-46.757 0-84.705 37.948-84.705 84.706s37.948 84.706 84.706 84.706c46.757 0 84.706-37.948 84.706-84.706s-37.949-84.706-84.706-84.706Z" fillRule="evenodd" />
            </svg>
          </Link>
              </li>

            </ul>

            <p className="absolute bottom-10 text-xs tracking-widest text-[var(--text-muted)] [font-family:blauer]">
              PRIT PHOTO • 2026
            </p>

          </motion.div>

        )}

      </AnimatePresence>

      {/* NAVBAR SPACER */}
      <div className="h-[90px] md:h-[100px]" />

    </>
  );
}