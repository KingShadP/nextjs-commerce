"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CartModal from "components/cart/modal";
import type { SiteDesignSettings } from "lib/site-design-schema";

export default function Header({
  settings,
}: {
  settings: SiteDesignSettings;
}) {
  const [activeAnn, setActiveAnn] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();

  const announcements = [
    settings.announcement,
    "NEW: THE DRAGON SERIES IS HERE",
    "SIGN UP FOR EARLY ACCESS TO NEW RELEASES",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveAnn((prev) => (prev + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Real shop-by-category navigation instead of a single "Shop All" link.
  // Hrefs match the collection handles already used as fallbacks in
  // lib/mock.ts and app/search/[collection]/page.tsx.
  const navLinks = [
    { label: "Shop All", shortLabel: "SHOP", href: "/" },
    { label: "Shapewear", shortLabel: "SHAPE", href: "/search/compression" },
    { label: "Underwear", shortLabel: "UNDIES", href: "/search/underwear" },
    { label: "Loungewear", shortLabel: "LOUNGE", href: "/search/loungewear" },
  ];

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#C5A880] text-black py-2 text-[7.5px] font-sans tracking-[4px] uppercase text-center font-bold">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeAnn}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
          >
            {announcements[activeAnn]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Brand Watermark Logo - Top Center Floating */}
      <div className="fixed top-12 left-1/2 -translate-x-1/2 z-40 pointer-events-none select-none flex flex-col items-center gap-1 opacity-80">
        <div className="flex items-center gap-2">
          {settings.showHeaderLogo ? (
            <img
              src={settings.logoUrl}
              alt={`${settings.brandName} logo`}
              className="w-5 h-5 animate-float"
            />
          ) : null}
          <span className="font-serif text-[12px] text-white tracking-[6px] uppercase font-medium">
            {settings.brandName}
          </span>
        </div>
        <span className="font-sans text-[6px] text-skims-accent tracking-[3px] uppercase">
          {settings.brandDescriptor}
        </span>
      </div>

      {/* Floating Bottom Navigation Dock */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] sm:w-auto max-w-2xl">
        <motion.nav
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          className="glass-panel rounded-full px-4 sm:px-6 py-2.5 flex items-center justify-between sm:justify-start gap-3 sm:gap-5 shadow-[0_12px_40px_rgba(0,0,0,0.85)] border border-white/10"
        >
          {/* Nav Links Group */}
          <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-2 py-1.5 transition-all text-left whitespace-nowrap"
                >
                  <span className="hidden sm:inline font-sans text-[9px] tracking-[2px] uppercase text-skims-sand/65 hover:text-white font-medium transition-colors">
                    {link.label}
                  </span>
                  <span className="inline sm:hidden font-sans text-[8.5px] tracking-[1px] uppercase text-skims-sand/65 hover:text-white font-bold transition-colors">
                    {link.shortLabel}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="dockActiveIndicator"
                      className="absolute inset-0 bg-white/5 rounded-full -z-10 border border-white/5"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Separator Line */}
          <div className="w-[1px] h-6 bg-white/15 hidden sm:block" />

          {/* Brand Trigger in Dock Center */}
          <Link
            href="/"
            className="group flex items-center justify-center p-1 relative"
          >
            <motion.div
              whileHover={{ rotate: 180, scale: 1.1 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-skims-accent/30 bg-black/40 flex items-center justify-center overflow-hidden hover:border-skims-accent/80 transition-colors"
            >
              {settings.showHeaderLogo ? (
                <img
                  src={settings.logoUrl}
                  alt={`${settings.brandName} home`}
                  className="w-4 h-4 sm:w-4.5 sm:h-4.5 opacity-80 group-hover:opacity-100 transition-opacity"
                />
              ) : (
                <span className="font-serif text-[10px] text-skims-accent">
                  {settings.brandName.slice(0, 1)}
                </span>
              )}
            </motion.div>
          </Link>

          {/* Separator Line */}
          <div className="w-[1px] h-6 bg-white/15" />

          {/* Action Control Panel */}
          <div className="flex items-center gap-1 sm:gap-2 text-skims-sand">
            {/* Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className={`p-2 rounded-full hover:bg-white/5 hover:text-white transition-all cursor-pointer ${
                searchOpen ? "bg-white/10 text-white" : ""
              }`}
              aria-label="Toggle search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Shopping Cart Trigger */}
            <CartModal />
          </div>
        </motion.nav>
      </div>

      {/* Search Panel Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSearchOpen(false)}
              className="fixed inset-0 z-30 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-lg glass-panel-accent p-4 rounded-3xl shadow-2xl"
            >
              <div className="flex items-center bg-black/40 border border-white/10 px-4 py-2.5 rounded-full hover:border-skims-accent/40 transition-colors">
                <Search className="w-4 h-4 text-skims-sand/40 mr-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchQuery.trim()) {
                      setSearchOpen(false);
                      window.location.href = `/search?q=${encodeURIComponent(
                        searchQuery.trim(),
                      )}`;
                    }
                  }}
                  placeholder="Search products..."
                  className="flex-grow bg-transparent border-none text-[10px] font-sans tracking-widest text-white focus:outline-none placeholder:text-skims-sand/30 uppercase"
                />
                {searchQuery ? (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-white/40 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : null}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
