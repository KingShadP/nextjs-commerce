"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { HeroSlideSettings } from "lib/site-design-schema";

export default function HeroSlideshow({
  slides,
}: {
  slides: HeroSlideSettings[];
}) {
  const [current, setCurrent] = useState(0);
  const activeSlides = slides.length ? slides : [];

  useEffect(() => {
    if (activeSlides.length < 2) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % activeSlides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

  const handlePrev = () => {
    if (!activeSlides.length) return;
    setCurrent(
      (prev) => (prev - 1 + activeSlides.length) % activeSlides.length,
    );
  };

  const handleNext = () => {
    if (!activeSlides.length) return;
    setCurrent((prev) => (prev + 1) % activeSlides.length);
  };

  const slide = activeSlides[current] || activeSlides[0];
  if (!slide) return null;

  return (
    <section className="relative h-[95vh] w-full overflow-hidden bg-transparent border-b border-white/5">
      {/* Background Slideshow Canvas */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={slide.imgSrc}
              alt={slide.title}
              className="hero-campaign-image w-full h-full object-cover filter brightness-[0.6] contrast-[1.1]"
            />
          </motion.div>
        </AnimatePresence>

        {/* Luxury Overlays */}
        <div className="hero-text-safety absolute inset-0 bg-gradient-to-t from-[#0A0908] via-transparent to-[#0A0908]/90" />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
      </div>

      {/* Floating HUD Labels */}
      <div className="absolute top-12 left-6 sm:left-12 font-sans text-[7px] text-skims-sand/20 tracking-[3px] uppercase hidden sm:block">
        Honolulu, Hawaii / KSHADP
      </div>
      <div className="absolute top-12 right-6 sm:right-12 font-sans text-[7px] text-skims-sand/20 tracking-[3px] uppercase hidden sm:block">
        Dragon Series / 2026
      </div>

      {/* Hero Content Overlay */}
      <div className="relative z-10 h-full max-w-5xl mx-auto px-6 flex flex-col justify-center items-center text-center">
        {/* Text Slideshow */}
        <div className="space-y-6 max-w-3xl min-h-[140px] flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4"
            >
              <p className="font-sans text-[9px] md:text-[11px] text-skims-accent tracking-[6px] uppercase font-semibold">
                {slide.subtitle}
              </p>
              <h1 className="font-serif text-3.5xl md:text-5.5xl font-light text-white tracking-[4px] uppercase leading-tight">
                {slide.title}
              </h1>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Action Controls */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto font-sans text-[9.5px] tracking-[4px] font-bold">
          <Link
            href={slide.primaryBtnHref || "/"}
            className="px-12 py-4.5 bg-skims-accent text-black uppercase transition-all duration-500 hover:bg-white text-center shadow-[0_4px_20px_rgba(197,168,128,0.25)] hover:scale-[1.02]"
          >
            {slide.primaryBtnText}
          </Link>
          <a
            href="#featured-selections"
            className="px-12 py-4.5 bg-black/40 border border-white/10 hover:border-skims-accent text-white hover:text-skims-accent transition-all duration-500 backdrop-blur-md text-center hover:scale-[1.02]"
          >
            Explore Featured
          </a>
        </div>
      </div>

      {/* Manual Slide Toggles */}
      <div className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2">
        <button
          onClick={handlePrev}
          className="p-3 bg-black/35 hover:bg-white/10 text-white rounded-full border border-white/5 transition-all hover:scale-105 cursor-pointer"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>
      <div className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2">
        <button
          onClick={handleNext}
          className="p-3 bg-black/35 hover:bg-white/10 text-white rounded-full border border-white/5 transition-all hover:scale-105 cursor-pointer"
          aria-label="Next slide"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {activeSlides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className="group flex flex-col items-center p-2 cursor-pointer"
            aria-label={`Go to slide ${idx + 1}`}
          >
            <div
              className={`h-0.5 rounded-full transition-all duration-500 ${
                current === idx
                  ? "w-10 bg-skims-accent"
                  : "w-4 bg-white/20 group-hover:bg-white/55"
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
