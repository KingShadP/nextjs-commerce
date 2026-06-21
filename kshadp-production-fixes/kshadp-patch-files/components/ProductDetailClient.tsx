"use client";

import React, { useState, useEffect } from "react";
import { Product, ProductVariant } from "lib/shopify/types";
import { useCart } from "components/cart/cart-context";
import { addItem } from "components/cart/actions";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  Ruler,
  Check,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({
  product,
}: ProductDetailClientProps) {
  const { addCartItem } = useCart();

  // Extract colors from options
  const colorOption = product.options.find(
    (o) =>
      o.name.toLowerCase() === "color" || o.name.toLowerCase() === "colour",
  );
  const colorNames = colorOption ? colorOption.values : ["Onyx"];
  const colors = colorNames.map((colName) => {
    let hex = "#A39382"; // default clay
    const lower = colName.toLowerCase();
    if (lower === "onyx") hex = "#12100E";
    else if (lower === "concrete" || lower === "grey" || lower === "gray")
      hex = "#A8A39D";
    else if (lower === "cocoa" || lower === "brown") hex = "#5C4F44";
    else if (lower === "sand" || lower === "cream") hex = "#E6DEC9";
    else if (lower === "clay") hex = "#AC9E8F";
    return { name: colName, hex };
  });

  // Extract sizes
  const sizeOption = product.options.find(
    (o) => o.name.toLowerCase() === "size",
  );
  const sizes = sizeOption ? sizeOption.values : ["S", "M", "L", "XL"];

  // Image & Price details
  const imgUrl = product.featuredImage?.url || product.images[0]?.url || "";
  const gallery = product.images.map((img) => img.url);
  const price = product.priceRange.minVariantPrice.amount;
  const currency = product.priceRange.minVariantPrice.currencyCode;

  const [selectedColor, setSelectedColor] = useState(colors[0]?.name || "Onyx");
  const [selectedSize, setSelectedSize] = useState("");
  const [activeImg, setActiveImg] = useState(imgUrl);
  const [adding, setAdding] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);

  // Accordion Toggles
  const [openAccordion, setOpenAccordion] = useState<string | null>("fabric");

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Synchronize active image with selected color index if available
  useEffect(() => {
    const colIdx = colors.findIndex((c) => c.name === selectedColor);
    if (colIdx !== -1 && gallery[colIdx]) {
      setActiveImg(gallery[colIdx]);
    } else {
      setActiveImg(imgUrl);
    }
  }, [selectedColor, colors, gallery, imgUrl]);

  const handleAddToBag = async () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    setAdding(true);

    // Find variant matching selected size and color
    const variant = product.variants.find((v) => {
      const isColorMatch = v.selectedOptions.some(
        (o) =>
          (o.name.toLowerCase() === "color" ||
            o.name.toLowerCase() === "colour") &&
          o.value.toLowerCase() === selectedColor.toLowerCase(),
      );
      const isSizeMatch = v.selectedOptions.some(
        (o) =>
          o.name.toLowerCase() === "size" &&
          o.value.toLowerCase() === selectedSize.toLowerCase(),
      );
      return isColorMatch && isSizeMatch;
    });

    const targetVariant = variant || product.variants[0];
    if (targetVariant) {
      addCartItem(targetVariant, product);
      await addItem(null, targetVariant.id);

      setAdding(false);
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2000);
    } else {
      setAdding(false);
    }
  };

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  const getCollectionPath = () => {
    if (
      product.handle.includes("boxer") ||
      product.handle.includes("underwear")
    ) {
      return { title: "Underwear", href: "/search/underwear" };
    }
    if (
      product.handle.includes("hoodie") ||
      product.handle.includes("pants") ||
      product.handle.includes("tee")
    ) {
      return { title: "Loungewear", href: "/search/loungewear" };
    }
    return { title: "Shapewear", href: "/search/compression" };
  };

  const collectionInfo = getCollectionPath();

  // Plain-language fit guidance based on selected size, rather than
  // pseudo-technical "tension" readouts.
  const getFitGuidance = (size: string) => {
    if (!size) return "Select a size";
    if (size === "XXS" || size === "XS") return "Snug, contouring fit";
    if (size === "S" || size === "M" || size === "L")
      return "Balanced, true-to-size fit";
    return "Relaxed, easy fit";
  };

  const creativeNote = product.tags
    .find((tag) => tag.startsWith("creative-note:"))
    ?.replace("creative-note:", "");

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 md:py-16 space-y-12 select-none">
      {/* Breadcrumb Navigation - Low Profile HUD style */}
      <div className="flex items-center gap-2 font-sans text-[8.5px] text-skims-sand/40 uppercase tracking-[2px] select-none text-left">
        <Link href="/" className="hover:text-white transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3 h-3" />
        <Link
          href={collectionInfo.href}
          className="hover:text-white transition-colors"
        >
          {collectionInfo.title}
        </Link>
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

            <div className="absolute top-6 left-6 font-sans text-[7px] text-skims-sand/30 tracking-[3px] uppercase">
              Product Detail 01
            </div>
          </div>

          {/* Secondary Details Image Frames */}
          {gallery.slice(1).map((img, idx) => (
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

              <div className="absolute top-6 left-6 font-sans text-[7px] text-skims-sand/35 tracking-[3px] uppercase">
                Product Detail 0{idx + 2}
              </div>
            </div>
          ))}
        </div>

        {/* Right Side: Product Info Panel */}
        <div className="w-full lg:w-[42%] lg:sticky lg:top-24 space-y-8 text-left font-sans">
          {/* Header Specifications */}
          <div className="space-y-4">
            <span className="font-sans text-[8px] text-skims-accent tracking-[4px] uppercase block">
              Product Details
            </span>
            <h1 className="font-serif text-3xl md:text-4.5xl text-white tracking-wide uppercase leading-tight font-light">
              {product.title}
            </h1>

            <div className="flex items-center gap-6 border-b border-white/5 pb-6">
              <div className="text-2xl text-white font-medium font-sans">
                ${price}
              </div>
            </div>

            <p className="font-sans text-[13px] text-skims-sand/65 leading-relaxed font-light select-text pt-2">
              {product.description}
            </p>
            {creativeNote ? (
              <div className="border border-skims-accent/20 bg-skims-accent/5 px-4 py-3 text-[10px] uppercase tracking-[0.2em] text-skims-accent">
                {creativeNote}
              </div>
            ) : null}
          </div>

          {/* 1. Color selection */}
          <div className="space-y-3 bg-white/[0.01] border border-white/5 p-4 rounded-2xl">
            <div className="flex justify-between items-center text-[9px] uppercase tracking-[2px] text-skims-sand/50 font-bold">
              <span>Color:</span>
              <span className="text-white font-bold">{selectedColor}</span>
            </div>
            <div className="flex gap-3 pt-1">
              {colors.map((color) => {
                const isSelected = selectedColor === color.name;
                return (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all cursor-pointer relative ${
                      isSelected
                        ? "border-skims-accent scale-110 shadow-[0_0_8px_rgba(197,168,128,0.4)]"
                        : "border-white/10 hover:border-white/30"
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

          {/* 2. Size selection */}
          <div className="space-y-4 bg-white/[0.01] border border-white/5 p-4 rounded-2xl">
            <div className="flex justify-between items-center text-[9px] uppercase tracking-[2px] text-skims-sand/50 font-bold">
              <span>Size:</span>
              <button className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer text-skims-accent">
                <Ruler className="w-3.5 h-3.5" />
                <span>SIZE GUIDE</span>
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2 text-xs">
              {sizes.map((size) => {
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

            {/* Plain-language fit readout */}
            <div className="border-t border-white/5 pt-3 flex justify-between items-center text-[7.5px] font-sans text-skims-sand/40">
              <span className="text-white/20">Fit:</span>
              <span
                className={
                  selectedSize ? "text-skims-accent font-bold" : "text-white/20"
                }
              >
                {getFitGuidance(selectedSize)}
              </span>
            </div>

            {sizeError && (
              <p className="text-[9px] text-red-400 uppercase tracking-[1.5px] animate-pulse">
                ⚠️ Please select a size to proceed.
              </p>
            )}
          </div>

          {/* Add to Bag */}
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
                  Adding to bag...
                </>
              ) : addedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  Added to Bag ✓
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  Add to Bag
                </>
              )}
            </motion.button>
          </div>

          {/* Sizing & Material Accordion Systems */}
          <div className="border-t border-white/10 pt-6 space-y-4 font-sans">
            {/* Accordion 1: Fabric & Materials */}
            <div className="border border-white/5 bg-white/[0.01] rounded-xl overflow-hidden">
              <button
                onClick={() => toggleAccordion("fabric")}
                className="w-full p-4 flex justify-between items-center text-[9px] tracking-[2px] uppercase text-white hover:bg-white/[0.02] cursor-pointer"
              >
                <span>Fabric & Materials</span>
                {openAccordion === "fabric" ? (
                  <ChevronUp className="w-4 h-4 text-skims-accent" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
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
                      <p>
                        Made from a soft cotton-modal blend that keeps its
                        shape wear after wear.
                      </p>
                      <ul className="list-disc pl-4 font-sans text-[9px] space-y-1 text-skims-accent/80">
                        <li>Smooth, flat seams to prevent chafing</li>
                        <li>
                          High stretch recovery — keeps its shape over time
                        </li>
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Accordion 2: Fit Guide */}
            <div className="border border-white/5 bg-white/[0.01] rounded-xl overflow-hidden">
              <button
                onClick={() => toggleAccordion("fit")}
                className="w-full p-4 flex justify-between items-center text-[9px] tracking-[2px] uppercase text-white hover:bg-white/[0.02] cursor-pointer"
              >
                <span>Fit Guide</span>
                {openAccordion === "fit" ? (
                  <ChevronUp className="w-4 h-4 text-skims-accent" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
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
                        Fits true to size. For a snugger, more contoured
                        fit, we recommend sizing down one size. Stretches up
                        to 2.5x for a comfortable, supportive fit.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Accordion 3: Shipping & Returns */}
            <div className="border border-white/5 bg-white/[0.01] rounded-xl overflow-hidden">
              <button
                onClick={() => toggleAccordion("shipping")}
                className="w-full p-4 flex justify-between items-center text-[9px] tracking-[2px] uppercase text-white hover:bg-white/[0.02] cursor-pointer"
              >
                <span>Shipping & Returns</span>
                {openAccordion === "shipping" ? (
                  <ChevronUp className="w-4 h-4 text-skims-accent" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
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
                        We ship worldwide in eco-friendly packaging. Free
                        standard shipping on orders over $150. Returns
                        accepted within 14 days of delivery.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Add to Bag Bar */}
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
              <img
                src={activeImg}
                alt={product.title}
                className="w-9 h-11 object-cover border border-white/10 hidden sm:block"
              />
              <div>
                <h4 className="font-serif text-[11px] uppercase tracking-wide text-white font-medium">
                  {product.title}
                </h4>
                <p className="text-[8.5px] text-skims-sand/40 uppercase tracking-[1px] mt-0.5 font-sans">
                  ${price} / {selectedColor}{" "}
                  {selectedSize ? `/ Size ${selectedSize}` : ""}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {!selectedSize ? (
                <div className="flex items-center gap-1 hidden sm:flex">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className="w-7 h-7 text-[8px] border border-white/10 hover:border-skims-accent text-white flex items-center justify-center font-bold font-sans transition-colors"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              ) : null}

              <button
                onClick={handleAddToBag}
                disabled={adding}
                className={`px-6 py-2.5 bg-skims-accent hover:bg-white text-black font-sans font-bold text-[9px] tracking-[2px] uppercase transition-all duration-300 rounded-full ${
                  addedSuccess ? "bg-green-400" : ""
                }`}
              >
                {adding ? "Adding..." : addedSuccess ? "Added ✓" : "Add to Bag"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
