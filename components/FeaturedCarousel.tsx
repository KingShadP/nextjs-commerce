"use client";

import React, { useRef, useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { Product } from "lib/shopify/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FeaturedCarouselProps {
  products: Product[];
}

export default function FeaturedCarousel({ products }: FeaturedCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const updateArrows = () => {
    const el = scrollRef.current;
    if (el) {
      setShowLeft(el.scrollLeft > 8);
      // Give 2px buffer for decimal scroll widths
      setShowRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", updateArrows, { passive: true });
      updateArrows();
      window.addEventListener("resize", updateArrows);
    }
    return () => {
      if (el) el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [products]);

  const scrollByAmount = (amount: number) => {
    const el = scrollRef.current;
    if (el) {
      el.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  // Desktop Mouse Drag to Scroll variables
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    isDragging.current = true;
    el.classList.remove("scroll-smooth"); // Disable smooth scroll physics during active drag
    startX.current = e.pageX - el.offsetLeft;
    scrollLeftStart.current = el.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!isDragging.current || !el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX.current) * 1.5; // Drag speed coefficient
    el.scrollLeft = scrollLeftStart.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    const el = scrollRef.current;
    if (el) el.classList.add("scroll-smooth"); // Restore smooth snapping physics
    isDragging.current = false;
  };

  return (
    <div className="relative w-full group/carousel">
      
      {/* Left Navigation Arrow */}
      <AnimatePresence>
        {showLeft && (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            onClick={() => scrollByAmount(-350)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/70 backdrop-blur-md border border-white/10 hover:border-skims-accent/60 text-white flex items-center justify-center cursor-pointer transition-colors shadow-[0_4px_20px_rgba(0,0,0,0.8)]"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 text-skims-accent" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Right Navigation Arrow */}
      <AnimatePresence>
        {showRight && (
          <motion.button
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            onClick={() => scrollByAmount(350)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/70 backdrop-blur-md border border-white/10 hover:border-skims-accent/60 text-white flex items-center justify-center cursor-pointer transition-colors shadow-[0_4px_20px_rgba(0,0,0,0.8)]"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 text-skims-accent" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Dynamic Grabbing Snap Scroll Container */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className="w-full overflow-x-auto flex gap-10 px-6 sm:px-12 md:px-24 pb-12 scroll-smooth snap-x snap-mandatory no-scrollbar cursor-grab active:cursor-grabbing select-none"
      >
        {products.map((product) => (
          <div key={product.id} className="w-[85vw] sm:w-[50vw] md:w-[36vw] lg:w-[28vw] flex-shrink-0 snap-start hover:scale-[1.01] transition-transform duration-500">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
