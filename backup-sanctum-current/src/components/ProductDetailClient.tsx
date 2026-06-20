"use client";

import React, { useState, useEffect } from "react";
import { Product } from "@/lib/shopify";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronDown, ChevronUp, ShoppingBag, Ruler, Check, ChevronRight } from "lucide-react";
import Link from "next/link";

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { addToCart } = useCart();
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || "Onyx");
  const [selectedSize, setSelectedSize] = useState("");
  const [activeImg, setActiveImg] = useState(product.imgUrl);
  const [adding, setAdding] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);

  // Accordion Toggles
  const [openAccordion, setOpenAccordion] = useState<string | null>("fabric");

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar past 500px of scroll depth
      setShowStickyBar(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Synchronize active image with selected color index if available
  useEffect(() => {
    const colIdx = product.colors.findIndex((c) => c.name === selectedColor);
    if (colIdx !== -1 && product.gallery[colIdx]) {
      setActiveImg(product.gallery[colIdx]);
    } else {
      setActiveImg(product.imgUrl);
    }
  }, [selectedColor, product]);

  const handleAddToBag = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    setAdding(true);

    setTimeout(() => {
      addToCart(product, selectedSize, selectedColor);
      setAdding(false);
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2000);
    }, 800);
  };

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  const getCollectionPath = () => {
    if (product.handle.includes("boxer") || product.handle.includes("underwear")) {
      return { title: "Underwear", href: "/collection/underwear" };
    }
    if (product.handle.includes("hoodie") || product.handle.includes("pants") || product.handle.includes("tee")) {
      return { title: "Loungewear", href: "/collection/loungewear" };
    }
    return { title: "Compression", href: "/collection/compression" };
  };

  const collectionInfo = getCollectionPath();

  // Dynamic tension outputs based on selected size for spatial HUD feeling
  const getTensionLog = (size: string) => {
    if (!size) return "[SELECTION: PENDING CALIBRATION]";
    if (size === "XXS" || size === "XS") return "[CALIB: HIGH_TENSION_SHAPE // 3.2X STRETCH RECOVERY]";
    if (size === "S" || size === "M" || size === "L") return "[CALIB: CONFORMING_MID_SUPPORT // 2.5X STRETCH RECOVERY]";
    return "[CALIB: RELAXED_BASE_STRUCTURE // 1.8X STRETCH RECOVERY]";
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 md:py-16 space-y-12 select-none">
      
      {/* Breadcrumb Navigation - Low Profile HUD style */}
      <div className="flex items-center gap-2 font-mono text-[8.5px] text-skims-sand/40 uppercase tracking-[2px] select-none text-left">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href={collectionInfo.href} className="hover:text-white transition-colors">{collectionInfo.title}</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-skims-accent">{product.title}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
        
        {/* Left Side: Dynamic Spatial Photo Frame stack */}
        <div className="w-full lg:w-[58%] grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Main Visualizer Image Frame with Corner HUD Reticles */}
          <div className="md:col-span-2 aspect-[3/4] border border-white/10 bg-black overflow-hidden relative">
            <img
              src={activeImg}
              alt={`${product.title} main view`}
              className="w-full h-full object-cover filter brightness-[0.9] contrast-[1.03]"
            />
            {/* Corner bracket styling */}
            <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-skims-accent/50 pointer-events-none" />
            <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-skims-accent/50 pointer-events-none" />
            <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-skims-accent/50 pointer-events-none" />
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-skims-accent/50 pointer-events-none" />

            <div className="absolute top-6 left-6 font-mono text-[7px] text-skims-sand/30 tracking-[3px] uppercase">
              ANGLE_GRID // 01_FOCAL
            </div>
            <div className="absolute bottom-6 right-6 font-mono text-[6.5px] text-skims-accent/40 tracking-[2px] uppercase">
              SHA-256 SECURED // KSH-OS
            </div>
          </div>

          {/* Secondary Details Image Frames */}
          {product.gallery.slice(1).map((img, idx) => (
            <div
              key={idx}
              className="aspect-[3/4] border border-white/5 bg-black overflow-hidden relative"
            >
              <img
                src={img}
                alt={`${product.title} view ${idx + 2}`}
                className="w-full h-full object-cover filter brightness-[0.85]"
              />
              <div className="absolute top-4 left-4 w-3.5 h-3.5 border-t border-l border-white/20 pointer-events-none" />
              <div className="absolute bottom-4 right-4 w-3.5 h-3.5 border-b border-r border-white/20 pointer-events-none" />

              <div className="absolute top-6 left-6 font-mono text-[7px] text-skims-sand/35 tracking-[3px] uppercase">
                ANGLE_GRID // 0{idx + 2}_MACRO
              </div>
            </div>
          ))}
        </div>

        {/* Right Side: Configuration HUD Ledger */}
        <div className="w-full lg:w-[42%] lg:sticky lg:top-24 space-y-8 text-left font-mono">
          
          {/* Header Specifications */}
          <div className="space-y-4">
            <span className="font-mono text-[8px] text-skims-accent tracking-[4px] uppercase block">
              // ACTIVE ANATOMICAL SPECIFICATION //
            </span>
            <h1 className="font-serif text-3xl md:text-4.5xl text-white tracking-wide uppercase leading-tight font-light">
              {product.title}
            </h1>
            
            <div className="flex items-center gap-6 border-b border-white/5 pb-6">
              <div className="text-2xl text-white font-medium font-mono">
                ${product.price}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-skims-sand/40">
                <div className="flex text-skims-accent">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-skims-accent stroke-none" />
                  ))}
                </div>
                <span>4.9 (142 calibration records)</span>
              </div>
            </div>

            <p className="font-sans text-[13px] text-skims-sand/65 leading-relaxed font-light select-text pt-2">
              {product.description}
            </p>
          </div>

          {/* 1. Hue/Alloy Calibration */}
          <div className="space-y-3 bg-white/[0.01] border border-white/5 p-4 rounded-2xl">
            <div className="flex justify-between items-center text-[9px] uppercase tracking-[2px] text-skims-sand/50 font-bold">
              <span>HUE ALLOY VALUE:</span>
              <span className="text-white font-bold">{selectedColor}</span>
            </div>
            <div className="flex gap-3 pt-1">
              {product.colors.map((color) => {
                const isSelected = selectedColor === color.name;
                return (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all cursor-pointer relative ${
                      isSelected ? "border-skims-accent scale-110 shadow-[0_0_8px_rgba(197,168,128,0.4)]" : "border-white/10 hover:border-white/30"
                    }`}
                    title={color.name}
                  >
                    <span
                      className="w-5 h-5 rounded-full"
                      style={{ backgroundColor: color.hex }}
                    />
                    {isSelected && (
                      <span className="absolute -inset-1 border border-skims-accent/20 rounded-full animate-ping" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Sizing Contour Calibration */}
          <div className="space-y-4 bg-white/[0.01] border border-white/5 p-4 rounded-2xl">
            <div className="flex justify-between items-center text-[9px] uppercase tracking-[2px] text-skims-sand/50 font-bold">
              <span>SIZE CALIBRATION MATRIX:</span>
              <button className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer text-skims-accent">
                <Ruler className="w-3.5 h-3.5" />
                <span>SIZE GUIDE</span>
              </button>
            </div>
            
            <div className="grid grid-cols-4 gap-2 text-xs">
              {product.sizes.map((size) => {
                const isSelected = selectedSize === size;
                return (
                  <button
                    key={size}
                    onClick={() => {
                      setSelectedSize(size);
                      setSizeError(false);
                    }}
                    className={`py-3 border text-center transition-all cursor-pointer font-bold rounded-lg ${
                      isSelected
                        ? "border-skims-accent bg-skims-accent text-black"
                        : "border-white/10 text-white hover:border-white/30 bg-black/20"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
            
            {/* Real-time structural feedback readout */}
            <div className="border-t border-white/5 pt-3 flex justify-between items-center text-[7.5px] font-mono text-skims-sand/40">
              <span className="text-white/20">STATUS LOG:</span>
              <span className={selectedSize ? "text-skims-accent font-bold" : "text-white/20"}>
                {getTensionLog(selectedSize)}
              </span>
            </div>
            
            {sizeError && (
              <p className="text-[9px] text-red-400 uppercase tracking-[1.5px] animate-pulse">
                ⚠️ ERROR: SELECT SIZING GAUGE COORD TO INITIATE.
              </p>
            )}
          </div>

          {/* Add to Bag System Trigger */}
          <div className="pt-2">
            <motion.button
              onClick={handleAddToBag}
              disabled={adding}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-4.5 font-sans font-bold text-[10px] tracking-[3px] uppercase transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer shadow-xl rounded-full ${
                addedSuccess
                  ? "bg-green-400 text-black shadow-[0_4px_20px_rgba(74,222,128,0.2)]"
                  : "bg-skims-accent hover:bg-white text-black hover:shadow-[0_4px_30px_rgba(197,168,128,0.25)]"
              }`}
            >
              {adding ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent animate-spin rounded-full" />
                  ADDING TO LEDGER...
                </>
              ) : addedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  ACQUISITION SECURED ✓
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  SECURE DOCK DISPATCH
                </>
              )}
            </motion.button>
          </div>

          {/* Sizing & Material Accordion Systems */}
          <div className="border-t border-white/10 pt-6 space-y-4">
            
            {/* Accordion 1: Material ledger */}
            <div className="border border-white/5 bg-white/[0.01] rounded-xl overflow-hidden">
              <button
                onClick={() => toggleAccordion("fabric")}
                className="w-full p-4 flex justify-between items-center text-[9px] tracking-[2px] uppercase text-white hover:bg-white/[0.02] cursor-pointer"
              >
                <span>[LEDGER_01] FABRIC & RAW MATERIALS WEAVE</span>
                {openAccordion === "fabric" ? <ChevronUp className="w-4 h-4 text-skims-accent" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              <AnimatePresence>
                {openAccordion === "fabric" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 pt-0 text-[11.5px] font-sans text-skims-sand/65 leading-relaxed font-light space-y-2 select-text border-t border-white/5 pt-4">
                      <p>Woven from dynamic long-staple cotton-modal fibers to achieve a soft touch with shape recovery properties.</p>
                      <ul className="list-disc pl-4 font-mono text-[9px] space-y-1 text-skims-accent/80">
                        {product.specs.map((spec, i) => (
                          <li key={i}>{spec}</li>
                        ))}
                        <li>Flatlock cooling friction-free seams</li>
                        <li>High stretch recovery index</li>
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Accordion 2: Tension fit */}
            <div className="border border-white/5 bg-white/[0.01] rounded-xl overflow-hidden">
              <button
                onClick={() => toggleAccordion("fit")}
                className="w-full p-4 flex justify-between items-center text-[9px] tracking-[2px] uppercase text-white hover:bg-white/[0.02] cursor-pointer"
              >
                <span>[LEDGER_02] BIOMETRIC CONTENSION GAUGE</span>
                {openAccordion === "fit" ? <ChevronUp className="w-4 h-4 text-skims-accent" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              <AnimatePresence>
                {openAccordion === "fit" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 pt-0 text-[11.5px] font-sans text-skims-sand/65 leading-relaxed font-light select-text border-t border-white/5 pt-4">
                      <p>
                        Fits true to size. For maximum torso compression and definition contouring, we recommend sizing down one frame. Designed to stretch up to 2.5x its static shape.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Accordion 3: Logistics dispatch */}
            <div className="border border-white/5 bg-white/[0.01] rounded-xl overflow-hidden">
              <button
                onClick={() => toggleAccordion("shipping")}
                className="w-full p-4 flex justify-between items-center text-[9px] tracking-[2px] uppercase text-white hover:bg-white/[0.02] cursor-pointer"
              >
                <span>[LEDGER_03] ATELIER LOGISTICS DISPATCH</span>
                {openAccordion === "shipping" ? <ChevronUp className="w-4 h-4 text-skims-accent" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              <AnimatePresence>
                {openAccordion === "shipping" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 pt-0 text-[11.5px] font-sans text-skims-sand/65 leading-relaxed font-light select-text border-t border-white/5 pt-4">
                      <p>
                        Worldwide dispatch in secure, biodegradable matte packaging. Free standard shipping is auto-applied to all orders exceeding $150. Returns accepted within 14 days of receipt delivery.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

        </div>

      </div>

      {/* Sticky Bottom Add to Bag Bar - Overlapping Protection */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="fixed bottom-0 left-0 right-0 z-30 bg-[#0A0908]/90 backdrop-blur-md border-t border-white/10 py-3.5 px-6 flex items-center justify-between gap-4 max-w-7xl mx-auto shadow-[0_-10px_30px_rgba(0,0,0,0.85)]"
          >
            <div className="flex items-center gap-4 text-left">
              <img src={activeImg} alt={product.title} className="w-9 h-11 object-cover border border-white/10 hidden sm:block" />
              <div>
                <h4 className="font-serif text-[11px] uppercase tracking-wide text-white font-medium">{product.title}</h4>
                <p className="text-[8.5px] text-skims-sand/40 uppercase tracking-[1px] mt-0.5">
                  ${product.price} / {selectedColor} {selectedSize ? `/ Size ${selectedSize}` : ""}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {!selectedSize ? (
                <div className="flex items-center gap-1 hidden sm:flex">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className="w-7 h-7 text-[8px] border border-white/10 hover:border-skims-accent text-white flex items-center justify-center font-bold font-mono transition-colors"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              ) : null}
              
              <button
                onClick={handleAddToBag}
                disabled={adding}
                className={`px-6 py-2.5 bg-skims-accent hover:bg-white text-black font-mono font-bold text-[9px] tracking-[2px] uppercase transition-all duration-300 rounded-full ${
                  addedSuccess ? "bg-green-400" : ""
                }`}
              >
                {adding ? "ADDING..." : addedSuccess ? "ADDED ✓" : "SECURE DISPATCH"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
