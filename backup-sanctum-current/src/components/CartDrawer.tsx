"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { createCheckout, MOCK_PRODUCTS } from "@/lib/shopify";
import { X, Plus, Minus, Trash2, ShoppingBag, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, cartTotal, cartCount, addToCart } = useCart();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();

  const FREE_SHIPPING_THRESHOLD = 150; // $150 threshold
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cartTotal);
  const freeShippingProgress = Math.min(100, (cartTotal / FREE_SHIPPING_THRESHOLD) * 100);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsRedirecting(true);

    try {
      // Create line items for Shopify Checkout
      const lineItems = cart.map(item => ({
        variantId: item.variantId || "",
        quantity: item.quantity
      })).filter(item => item.variantId !== "");

      // If we have valid variant IDs and a Shopify domain, redirect to live checkout
      if (lineItems.length > 0) {
        const checkoutUrl = await createCheckout(lineItems);
        if (checkoutUrl) {
          window.location.href = checkoutUrl;
          return;
        }
      }

      // Standalone mode: redirect to local mock checkout page
      setIsCartOpen(false);
      router.push("/checkout");
    } catch (e) {
      console.error("Checkout redirection failed, falling back to mock page", e);
      setIsCartOpen(false);
      router.push("/checkout");
    } finally {
      setIsRedirecting(false);
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs"
          />

          {/* Cart Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 30 }}
            className="fixed inset-y-0 right-0 w-full sm:w-[450px] z-50 bg-[#0D0C0B] border-l border-white/10 flex flex-col justify-between shadow-2xl font-mono"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/40">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-skims-accent" />
                <h2 className="font-serif text-lg tracking-[3px] uppercase text-white font-medium">Your Bag</h2>
                <span className="text-[10px] text-skims-sand/50">({cartCount})</span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-skims-sand/60 hover:text-white p-2 transition-colors cursor-pointer"
                aria-label="Close cart drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress Meter */}
            {cart.length > 0 && (
              <div className="p-6 border-b border-white/5 bg-white/[0.02] text-[10px] tracking-[2px] uppercase">
                {amountToFreeShipping > 0 ? (
                  <p className="mb-2 text-skims-sand/80">
                    You are <span className="text-skims-accent font-bold">${amountToFreeShipping.toFixed(2)}</span> away from Free Shipping!
                  </p>
                ) : (
                  <p className="mb-2 text-green-400 font-bold">
                    ✓ Congratulations! You qualify for Free Shipping.
                  </p>
                )}
                <div className="w-full bg-white/10 h-1 rounded-none overflow-hidden">
                  <div
                    className="bg-skims-accent h-full transition-all duration-500"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-20 opacity-55">
                  <ShoppingBag className="w-12 h-12 text-skims-sand/30 stroke-[1px]" />
                  <p className="text-[11px] tracking-[3px] uppercase text-skims-sand">Your shopping bag is empty</p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="mt-2 px-6 py-2 border border-skims-sand/20 hover:border-skims-accent text-skims-sand hover:text-white text-[9px] uppercase tracking-[2px] cursor-pointer"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cart.map((item, idx) => {
                  const itemPrice = parseFloat(item.product.price.replace(/,/g, ""));
                  return (
                    <motion.div
                      key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex gap-4 border-b border-white/5 pb-6 items-stretch"
                    >
                      {/* Product Thumbnail */}
                      <div className="w-20 h-24 bg-black border border-white/10 overflow-hidden flex-shrink-0 relative">
                        <img
                          src={item.product.imgUrl}
                          alt={item.product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product details */}
                      <div className="flex-grow flex flex-col justify-between text-left">
                        <div className="space-y-1">
                          <div className="flex justify-between items-start">
                            <h3 className="font-serif text-sm tracking-wide text-white uppercase font-light">
                              {item.product.title}
                            </h3>
                            <button
                              onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedColor)}
                              className="text-white/30 hover:text-red-400 p-1 transition-colors cursor-pointer"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-[8.5px] tracking-[1px] text-skims-sand/40 uppercase">
                            Size: {item.selectedSize} / Color: {item.selectedColor}
                          </p>
                        </div>

                        {/* Quantity Counter & price */}
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center border border-white/10 bg-black/40">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity - 1)}
                              className="p-1 px-2.5 text-skims-sand hover:text-white transition-colors cursor-pointer"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-2.5 h-2.5" />
                            </button>
                            <span className="text-[10px] px-2 text-white font-bold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity + 1)}
                              className="p-1 px-2.5 text-skims-sand hover:text-white transition-colors cursor-pointer"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-2.5 h-2.5" />
                            </button>
                          </div>
                          <div className="text-xs text-white">
                            ${(itemPrice * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}

              {/* Complete the Look Cross-Sells */}
              {cart.length > 0 && (
                <div className="pt-6 border-t border-white/5 space-y-4">
                  <div className="flex justify-between items-center text-left">
                    <span className="font-mono text-[8.5px] text-skims-accent tracking-[2px] uppercase">
                      // COMPLETE THE LOOK //
                    </span>
                    <span className="text-[7.5px] text-skims-sand/35 tracking-[1px] font-mono uppercase">SUGGESTED EQUIPMENT</span>
                  </div>
                  <div className="space-y-3">
                    {(() => {
                      const cartProductIds = cart.map(item => item.product.id);
                      const recs = MOCK_PRODUCTS.filter(p => !cartProductIds.includes(p.id)).slice(0, 2);
                      const displayRecs = recs.length > 0 ? recs : MOCK_PRODUCTS.slice(0, 2);
                      return displayRecs.map((rec) => (
                        <div 
                          key={rec.id} 
                          className="bg-white/[0.02] border border-white/5 p-3 flex gap-3 items-center justify-between hover:border-white/10 transition-colors rounded-none"
                        >
                          <div className="flex gap-3 items-center text-left">
                            <div className="w-12 h-16 bg-black border border-white/5 overflow-hidden flex-shrink-0">
                              <img src={rec.imgUrl} alt={rec.title} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <h4 className="font-serif text-[11px] text-white uppercase tracking-wide font-light">{rec.title}</h4>
                              <p className="text-[9px] text-skims-accent font-mono mt-0.5">${rec.price}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => addToCart(rec, rec.sizes[0] || "M", rec.colors[0]?.name || "Onyx")}
                            className="px-3.5 py-1.5 border border-skims-accent/40 text-skims-accent hover:border-skims-accent hover:bg-skims-accent hover:text-black font-mono text-[8px] tracking-[1.5px] uppercase transition-all duration-300 cursor-pointer"
                          >
                            + ADD
                          </button>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Summary & Checkout */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-black/55 backdrop-blur-md">
                <div className="space-y-3 mb-6 text-xs uppercase tracking-[2px]">
                  <div className="flex justify-between text-skims-sand/60">
                    <span>Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-skims-sand/60">
                    <span>Shipping</span>
                    <span className="text-green-400">
                      {cartTotal >= FREE_SHIPPING_THRESHOLD ? "FREE" : "Calculated at next step"}
                    </span>
                  </div>
                  <div className="border-t border-white/5 pt-3 flex justify-between text-white font-bold text-sm">
                    <span>Estimated Total</span>
                    <span className="text-skims-accent">${cartTotal.toFixed(2)}</span>
                  </div>
                </div>

                <motion.button
                  onClick={handleCheckout}
                  disabled={isRedirecting}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-skims-accent hover:bg-white text-black font-sans font-bold text-[10px] tracking-[3px] uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(197,168,128,0.25)]"
                >
                  {isRedirecting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      SECURE ROUTING...
                    </>
                  ) : (
                    "PROCEED TO CHECKOUT"
                  )}
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
