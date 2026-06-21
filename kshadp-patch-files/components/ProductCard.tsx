"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Product, ProductVariant } from "lib/shopify/types";
import { useCart } from "components/cart/cart-context";
import { addItem } from "components/cart/actions";
import { motion, AnimatePresence } from "framer-motion";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addCartItem } = useCart();

  // Extract colors
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

  // Image assets
  const imgUrl = product.featuredImage?.url || product.images[0]?.url || "";
  const gallery = product.images.map((img) => img.url);

  const [selectedColor, setSelectedColor] = useState(colors[0]?.name || "Onyx");
  const [activeImg, setActiveImg] = useState(imgUrl);
  const [hovered, setHovered] = useState(false);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  // If a color has an associated image, update active image
  const handleColorChange = (colorName: string) => {
    setSelectedColor(colorName);
    const colIndex = colors.findIndex((c) => c.name === colorName);
    if (colIndex !== -1 && gallery[colIndex]) {
      setActiveImg(gallery[colIndex]);
    } else {
      setActiveImg(imgUrl);
    }
  };

  const handleQuickAdd = async (sizeName: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Find matching variant
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
          o.value.toLowerCase() === sizeName.toLowerCase(),
      );
      return isColorMatch && isSizeMatch;
    });

    const targetVariant = variant || product.variants[0];
    if (targetVariant) {
      addCartItem(targetVariant, product);
      await addItem(null, targetVariant.id);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    // Calculate rotation: max 8 degrees for clean 3D feel
    const rotateYVal = ((x - xc) / xc) * 8;
    const rotateXVal = -((y - yc) / yc) * 8;
    setRotateX(rotateXVal);
    setRotateY(rotateYVal);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  const price = product.priceRange.minVariantPrice.amount;
  const currency = product.priceRange.minVariantPrice.currencyCode;

  // Plain-language badge. Real per-product badges can still be set from the
  // admin design studio via the "creative:" tag — this is just the fallback.
  const badge =
    product.tags
      .find((tag) => tag.startsWith("creative:"))
      ?.replace("creative:", "") ||
    (product.handle.includes("boxer") || product.handle.includes("tank")
      ? "Limited Edition"
      : "Essential");

  return (
    <Link
      href={`/product/${product.handle}`}
      className="group flex flex-col justify-between text-left select-none outline-hidden perspective-1000"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Product Image Wrapper with 3D Tilt */}
      <motion.div
        className="relative aspect-[3/4] w-full bg-black border border-white/10 group-hover:border-skims-accent/40 transition-all duration-500 overflow-hidden flex items-center justify-center transform-style-3d"
        style={{
          transform: hovered
            ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(5px)`
            : "rotateX(0deg) rotateY(0deg) translateZ(0px)",
        }}
        onMouseMove={handleMouseMove}
      >
        {/* Badge */}
        <div className="absolute top-3 left-3 z-10 border border-skims-accent/30 bg-[#0A0908]/85 backdrop-blur-sm px-2.5 py-1 font-mono text-[6.5px] tracking-[2px] text-skims-accent uppercase font-bold select-none pointer-events-none">
          {badge}
        </div>

        {/* Crossfading hover images */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <motion.img
            src={activeImg}
            alt={product.title}
            className="absolute inset-0 w-full h-full object-cover filter brightness-[0.8]"
            animate={{
              scale: hovered ? 1.04 : 1,
              opacity: hovered && gallery[1] ? 0 : 1,
            }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
          {gallery[1] && (
            <motion.img
              src={gallery[1]}
              alt={`${product.title} angle detail`}
              className="absolute inset-0 w-full h-full object-cover filter brightness-[0.85]"
              initial={{ opacity: 0 }}
              animate={{
                scale: hovered ? 1.04 : 1,
                opacity: hovered ? 1 : 0,
              }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            />
          )}
        </div>

        {/* Scanline overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-skims-accent/5 to-transparent -translate-y-full group-hover:animate-scanline pointer-events-none mix-blend-overlay" />

        {/* Interactive Quick Add Sizes Flyup */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              className="absolute bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md border-t border-white/15 p-4 flex flex-col gap-2 z-20"
            >
              <div className="flex justify-between items-center text-[8px] font-mono tracking-[2px] uppercase text-skims-sand/40">
                <span>QUICK ADD</span>
                <span className="text-skims-accent font-bold">Select Size</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 font-mono text-[9px]">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={(e) => handleQuickAdd(size, e)}
                    className="py-1.5 border border-white/10 hover:border-skims-accent hover:bg-skims-accent hover:text-black transition-all text-white font-bold cursor-pointer"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Product Information */}
      <div className="mt-4 flex justify-between items-start gap-4">
        <div className="space-y-1.5 flex-grow">
          {/* Swatches Container */}
          <div
            className="flex gap-2 items-center select-none"
            onClick={(e) => e.stopPropagation()}
          >
            {colors.map((color) => {
              const isSelected = selectedColor === color.name;
              return (
                <button
                  key={color.name}
                  onClick={(e) => {
                    e.preventDefault();
                    handleColorChange(color.name);
                  }}
                  className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${
                    isSelected
                      ? "border-skims-accent scale-110"
                      : "border-transparent hover:scale-105"
                  }`}
                  title={color.name}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: color.hex }}
                  />
                </button>
              );
            })}
            <span className="text-[8px] font-mono tracking-[1.5px] text-skims-sand/30 uppercase ml-1">
              {selectedColor}
            </span>
          </div>

          <h3 className="font-serif text-base tracking-wide text-white uppercase font-light">
            {product.title}
          </h3>
        </div>

        {/* Price Tag */}
        <div className="text-right">
          <span className="font-mono text-sm text-white border-b border-skims-accent/20 group-hover:border-skims-accent pb-0.5 transition-colors">
            ${price}
          </span>
          <p className="text-[7.5px] font-mono text-skims-sand/35 uppercase tracking-[1px] mt-1">
            {currency}
          </p>
        </div>
      </div>
    </Link>
  );
}
