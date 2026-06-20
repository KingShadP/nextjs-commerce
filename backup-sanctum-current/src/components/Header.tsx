"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Search, User, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const { cartCount, setIsCartOpen } = useCart();
  const [activeAnn, setActiveAnn] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();

  const announcements = [
    "COMPLIMENTARY DISPATCH ON ALL ORDERS OVER $150",
    "THE GIRAGON COLLECTION // CORE FOUNDATIONS ACTIVE NOW",
    "SUBSCRIBE FOR PRE-ACCESS KEYS TO UPCOMING RELEASES"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveAnn((prev) => (prev + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const navLinks = [
    { label: "Shop All", shortLabel: "ALL", href: "/" },
    { label: "Compression", shortLabel: "COMP", href: "/collection/compression" },
    { label: "Loungewear", shortLabel: "LNGE", href: "/collection/loungewear" },
    { label: "Underwear", shortLabel: "UNDR", href: "/collection/underwear" }
  ];

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#C5A880] text-black py-2 text-[7.5px] font-mono tracking-[4px] uppercase text-center font-bold">
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
      <div className="fixed top-12 left-1/2 -translate-x-1/2 z-40 pointer-events-none select-none flex flex-col items-center gap-1 opacity-60">
        <div className="flex items-center gap-2">
          <img src="/logo-outline.png" alt="KSHADP outline" className="w-5 h-5 filter invert animate-float" />
          <span className="font-serif text-[11px] text-white tracking-[6px] uppercase font-light">KSHADP</span>
        </div>
        <span className="font-mono text-[5.5px] text-skims-accent tracking-[3px] uppercase">// ATELIER CORES //</span>
      </div>

      {/* Atelier OS Floating Bottom Navigation Dock */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] sm:w-auto max-w-xl">
        <motion.nav 
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          className="glass-panel rounded-full px-4 sm:px-6 py-2.5 flex items-center justify-between sm:justify-start gap-4 sm:gap-6 shadow-[0_12px_40px_rgba(0,0,0,0.85)] border border-white/10"
        >
          {/* Nav Links Group */}
          <div className="flex items-center gap-2 sm:gap-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-2.5 py-1.5 transition-all text-left"
                >
                  <span className="hidden sm:inline font-mono text-[9px] tracking-[2px] uppercase text-skims-sand/65 hover:text-white font-medium transition-colors">
                    {link.label}
                  </span>
                  <span className="inline sm:hidden font-mono text-[8.5px] tracking-[1px] uppercase text-skims-sand/65 hover:text-white font-bold transition-colors">
                    {link.shortLabel}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="dockActiveIndicator"
                      className="absolute inset-0 bg-white/5 rounded-full -z-10 border border-white/5"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Separator Line */}
          <div className="w-[1px] h-6 bg-white/15 hidden sm:block" />

          {/* Core System Brand Trigger in Dock Center */}
          <Link href="/" className="group flex items-center justify-center p-1 relative">
            <motion.div
              whileHover={{ rotate: 180, scale: 1.1 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-skims-accent/30 bg-black/40 flex items-center justify-center overflow-hidden hover:border-skims-accent/80 transition-colors"
            >
              <img
                src="/logo-outline.png"
                alt="Brand Mark"
                className="w-4 h-4 sm:w-4.5 sm:h-4.5 filter invert opacity-80 group-hover:opacity-100 transition-opacity"
              />
            </motion.div>
            {/* Pulsing indicator */}
            <span className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-skims-accent rounded-full animate-ping" />
            <span className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-skims-accent rounded-full" />
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
              aria-label="Toggle search console"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Account Profile Link */}
            <Link
              href="/account"
              className="p-2 rounded-full hover:bg-white/5 hover:text-white transition-all hidden sm:block"
              aria-label="Access client account ledger"
            >
              <User className="w-4 h-4" />
            </Link>

            {/* Shopping Cart Trigger */}
            <motion.button
              onClick={() => setIsCartOpen(true)}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 rounded-full hover:bg-white/5 hover:text-white transition-all cursor-pointer"
              aria-label="Open secure checkout bag"
            >
              <ShoppingBag className="w-4 h-4 text-skims-accent" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 bg-[#C5A880] text-black text-[7.5px] w-4 h-4 rounded-full flex items-center justify-center font-sans font-bold border border-[#0B0A09]"
                >
                  {cartCount}
                </motion.span>
              )}
            </motion.button>
          </div>
        </motion.nav>
      </div>

      {/* Frosted System Search Panel Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <>
            {/* Search Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSearchOpen(false)}
              className="fixed inset-0 z-30 bg-black/60 backdrop-blur-md"
            />
            {/* Search Input Card */}
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
                  placeholder="SEARCH DOCK: SCAN ITEMS, HOODIES, CORE SERIES..."
                  className="flex-grow bg-transparent border-none text-[10px] font-mono tracking-widest text-white focus:outline-none placeholder:text-skims-sand/20 uppercase"
                />
                {searchQuery ? (
                  <button onClick={() => setSearchQuery("")} className="text-white/40 hover:text-white">
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <span className="text-[6.5px] font-mono text-white/25 tracking-[1px]">// KSH-OS</span>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
