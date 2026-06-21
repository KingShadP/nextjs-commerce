"use client";

import React, { useState } from "react";
import { Product } from "lib/shopify/types";
import { useCart } from "components/cart/cart-context";
import { addItem } from "components/cart/actions";
import ProductCard from "components/ProductCard";
import { Eye, List } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CollectionCatalogClientProps {
  products: Product[];
}

export default function CollectionCatalogClient({
  products,
}: CollectionCatalogClientProps) {
  const { addCartItem } = useCart();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [categoryFilter, setCategoryFilter] = useState<
    "all" | "underwear" | "loungewear" | "shapewear"
  >("all");
  const [addedProductSize, setAddedProductSize] = useState<{
    [key: string]: boolean;
  }>({});

  // Filter items based on category keywords in the handle
  const filteredProducts = products.filter((p) => {
    if (categoryFilter === "all") return true;
    const handle = p.handle.toLowerCase();
    if (categoryFilter === "underwear") {
      return handle.includes("boxer") || handle.includes("underwear");
    }
    if (categoryFilter === "loungewear") {
      return (
        handle.includes("hoodie") ||
        handle.includes("pants") ||
        handle.includes("tee")
      );
    }
    if (categoryFilter === "shapewear") {
      return (
        handle.includes("tank") ||
        handle.includes("ls") ||
        handle.includes("compression")
      );
    }
    return true;
  });

  const handleQuickAdd = async (
    product: Product,
    size: string,
    color: string,
  ) => {
    // Find variant matching selected size and color
    const variant = product.variants.find((v) => {
      const isColorMatch = v.selectedOptions.some(
        (o) =>
          (o.name.toLowerCase() === "color" ||
            o.name.toLowerCase() === "colour") &&
          o.value.toLowerCase() === color.toLowerCase(),
      );
      const isSizeMatch = v.selectedOptions.some(
        (o) =>
          o.name.toLowerCase() === "size" &&
          o.value.toLowerCase() === size.toLowerCase(),
      );
      return isColorMatch && isSizeMatch;
    });

    const targetVariant = variant || product.variants[0];
    if (targetVariant) {
      addCartItem(targetVariant, product);

      const key = `${product.id}-${size}`;
      setAddedProductSize((prev) => ({ ...prev, [key]: true }));
      setTimeout(() => {
        setAddedProductSize((prev) => ({ ...prev, [key]: false }));
      }, 1500);

      await addItem(null, targetVariant.id);
    }
  };

  return (
    <div className="space-y-10 font-sans">
      {/* Category filter + view toggle */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 border border-white/5 select-none">
        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 text-[8.5px] tracking-[2px] uppercase font-bold">
          {[
            { id: "all", label: "All" },
            { id: "underwear", label: "Underwear" },
            { id: "loungewear", label: "Loungewear" },
            { id: "shapewear", label: "Shapewear" },
          ].map((tab) => {
            const isSelected = categoryFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCategoryFilter(tab.id as any)}
                className={`px-3 py-2 border rounded-full transition-all cursor-pointer ${
                  isSelected
                    ? "border-skims-accent bg-skims-accent/5 text-skims-accent shadow-[0_0_8px_rgba(197,168,128,0.25)]"
                    : "border-white/5 text-skims-sand/55 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Grid / List view toggle */}
        <div className="flex gap-2 bg-black/40 p-1 border border-white/10 rounded-full text-[8.5px] tracking-[1.5px] uppercase font-bold">
          <button
            onClick={() => setViewMode("grid")}
            className={`px-4 py-1.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === "grid"
                ? "bg-skims-accent text-black"
                : "text-skims-sand/40 hover:text-white"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Grid</span>
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`px-4 py-1.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === "list"
                ? "bg-skims-accent text-black"
                : "text-skims-sand/40 hover:text-white"
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>List</span>
          </button>
        </div>
      </div>

      {/* Product grid / list */}
      <AnimatePresence mode="wait">
        {filteredProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-24 text-center text-[9px] text-skims-sand/30 tracking-[3px] uppercase font-sans"
          >
            No products found matching this filter
          </motion.div>
        ) : viewMode === "grid" ? (
          <motion.div
            key="grid-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12"
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="list-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-3"
          >
            {filteredProducts.map((product) => {
              const colorOption = product.options.find(
                (o) =>
                  o.name.toLowerCase() === "color" ||
                  o.name.toLowerCase() === "colour",
              );
              const specColor = colorOption
                ? colorOption.values[0] || "Onyx"
                : "Onyx";

              const sizeOption = product.options.find(
                (o) => o.name.toLowerCase() === "size",
              );
              const specSizes = sizeOption
                ? sizeOption.values
                : ["S", "M", "L", "XL"];

              const specPrice = product.priceRange.minVariantPrice.amount;
              const currency =
                product.priceRange.minVariantPrice.currencyCode;
              const imgUrl =
                product.featuredImage?.url || product.images[0]?.url || "";

              return (
                <div
                  key={product.id}
                  className="flex items-center gap-4 sm:gap-6 bg-black/40 border border-white/5 hover:border-skims-accent/40 transition-colors rounded-xl p-4 text-left"
                >
                  <div className="w-16 h-20 sm:w-20 sm:h-24 bg-black border border-white/10 overflow-hidden flex-shrink-0">
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    ) : null}
                  </div>

                  <div className="flex-grow min-w-0 space-y-1">
                    <h3 className="font-serif text-sm sm:text-base text-white uppercase font-light truncate">
                      {product.title}
                    </h3>
                    <p className="text-[8px] text-skims-accent uppercase tracking-[1px]">
                      {specColor}
                    </p>
                    <p
                      className={`text-[8px] uppercase tracking-[1px] ${
                        product.availableForSale
                          ? "text-skims-sand/35"
                          : "text-red-400/70"
                      }`}
                    >
                      {product.availableForSale ? "In Stock" : "Out of Stock"}
                    </p>
                  </div>

                  <div className="hidden sm:flex gap-1.5 flex-shrink-0">
                    {specSizes.map((size) => {
                      const statusKey = `${product.id}-${size}`;
                      const isAdded = addedProductSize[statusKey];
                      return (
                        <button
                          key={size}
                          onClick={() =>
                            handleQuickAdd(product, size, specColor)
                          }
                          disabled={!product.availableForSale}
                          className={`w-9 h-9 text-[9px] border transition-all text-center font-bold cursor-pointer rounded disabled:opacity-30 disabled:cursor-not-allowed ${
                            isAdded
                              ? "bg-green-400 border-green-400 text-black"
                              : "border-white/10 text-white hover:border-skims-accent/60 hover:bg-skims-accent/5"
                          }`}
                        >
                          {isAdded ? "✓" : size}
                        </button>
                      );
                    })}
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="text-white text-sm font-bold">
                      ${specPrice}
                    </span>
                    <p className="text-[7px] text-skims-sand/30 uppercase tracking-[1px]">
                      {currency}
                    </p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
