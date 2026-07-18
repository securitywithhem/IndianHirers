"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Our Story", href: "/founders" },
  { label: "What We Rent", href: "/products" },
  { label: "Gallery", href: "/gallery" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    // Check initial scroll position
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };
    
    if (isMobileMenuOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen]);

  // Prevent background scrolling when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/90 backdrop-blur-md shadow-sm text-ink py-4" /* Tailwind's backdrop-blur includes -webkit-backdrop-filter for Safari */
          : "bg-transparent text-white py-6"
      )}
    >
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="font-heading font-bold text-xl md:text-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon rounded"
        >
          Indian Hires
        </Link>

        {/* Desktop Nav */}
        <nav aria-label="Primary" className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative font-body font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon rounded py-1",
                  "after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-gold after:transition-all",
                  isActive
                    ? "text-gold-text after:w-full"
                    : "hover:after:w-full after:w-0"
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/contact"
            className="bg-gold text-white rounded-full px-5 py-2 font-body font-medium hover:scale-105 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon focus-visible:ring-offset-2"
          >
            Enquire Now
          </Link>
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="lg:hidden p-2 -mr-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon rounded"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Drawer */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden transition-all duration-300",
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        )}
      >
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/40"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />

        {/* Drawer Content */}
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
          className={cn(
            "fixed top-0 right-0 h-full w-[80%] max-w-sm bg-background shadow-xl flex flex-col p-6 transition-transform duration-300 ease-in-out text-ink",
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex items-center justify-between mb-8">
            <span className="font-heading font-bold text-xl">Indian Hires</span>
            <button
              className="p-2 -mr-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon rounded text-ink"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex flex-col gap-6" aria-label="Mobile">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "text-lg font-body font-medium w-fit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon rounded",
                    isActive ? "text-gold-text" : "hover:text-gold-text transition-colors"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            
            <div className="mt-4">
              <Link
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="inline-block bg-gold text-white rounded-full px-6 py-3 font-body font-medium hover:scale-105 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon focus-visible:ring-offset-2"
              >
                Enquire Now
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
