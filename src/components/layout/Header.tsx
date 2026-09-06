"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { brand } from "@/config/brand.config";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    closeMobileMenu();
    if (href.startsWith("#")) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: shouldReduceMotion ? "auto" : "smooth" });
      }
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 h-16 transition-all duration-300 ${
          isScrolled
            ? "backdrop-blur-md bg-ivory/80 border-b border-stone/20"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 md:px-8 h-full flex items-center justify-between">
          <Link href="/" className="font-serif text-lg font-bold tracking-wide text-graphite">
            {brand.name}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {brand.nav.map((item) => (
              <Link
                key={item.label}
                href={item.href.startsWith("#") ? `/${item.href}` : item.href}
                onClick={(e) => handleLinkClick(e, item.href)}
                className="text-sm uppercase tracking-widest font-sans text-graphite/80 hover:text-graphite transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 -mr-2 text-graphite z-[60] relative"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label="Menü"
          >
            <div className="w-6 h-5 flex flex-col justify-between items-end">
              <span className={`w-6 h-0.5 bg-current transition-transform duration-300 ${isMobileMenuOpen ? "rotate-45 translate-y-2.5" : ""}`} />
              <span className={`w-6 h-0.5 bg-current transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-0" : "opacity-100"}`} />
              <span className={`w-6 h-0.5 bg-current transition-transform duration-300 ${isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </div>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as const }}
            className="fixed inset-0 z-50 bg-cream flex flex-col items-center justify-center pt-16 md:hidden"
          >
            <nav className="flex flex-col items-center space-y-8">
              {brand.nav.map((item) => (
                <Link
                  key={item.label}
                  href={item.href.startsWith("#") ? `/${item.href}` : item.href}
                  onClick={(e) => handleLinkClick(e, item.href)}
                  className="font-serif text-3xl text-graphite hover:text-champagne transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="absolute bottom-12 flex space-x-6">
              {brand.social.map((social) => (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm uppercase tracking-widest text-graphite/60 hover:text-graphite transition-colors"
                >
                  {social.platform}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
