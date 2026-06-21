"use client";

import { Dialog, Transition } from "@headlessui/react";
import { ShoppingBag, X, Loader2 } from "lucide-react";
import Price from "components/price";
import { DEFAULT_OPTION } from "lib/constants";
import { createUrl } from "lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { createCartAndSetCookie, redirectToCheckout } from "./actions";
import { useCart } from "./cart-context";
import { DeleteItemButton } from "./delete-item-button";
import { EditItemQuantityButton } from "./edit-item-quantity-button";
import OpenCart from "./open-cart";

type MerchandiseSearchParams = {
  [key: string]: string;
};

export default function CartModal() {
  const { cart, updateCartItem } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const quantityRef = useRef(cart?.totalQuantity);
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const cartTotal = Number(cart?.cost?.subtotalAmount?.amount || 0);
  const FREE_SHIPPING_THRESHOLD = 150;
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cartTotal);
  const freeShippingProgress = Math.min(
    100,
    (cartTotal / FREE_SHIPPING_THRESHOLD) * 100,
  );

  useEffect(() => {
    if (!cart) {
      createCartAndSetCookie();
    }
  }, [cart]);

  useEffect(() => {
    if (
      cart?.totalQuantity &&
      cart?.totalQuantity !== quantityRef.current &&
      cart?.totalQuantity > 0
    ) {
      if (!isOpen) {
        setIsOpen(true);
      }
      quantityRef.current = cart?.totalQuantity;
    }
  }, [isOpen, cart?.totalQuantity, quantityRef]);

  return (
    <>
      <button
        aria-label="Open cart"
        onClick={openCart}
        className="focus:outline-hidden"
      >
        <OpenCart quantity={cart?.totalQuantity} />
      </button>
      <Transition show={isOpen}>
        <Dialog onClose={closeCart} className="relative z-50 font-sans">
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="opacity-0 backdrop-blur-none"
            enterTo="opacity-100 backdrop-blur-[2px]"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="opacity-100 backdrop-blur-[2px]"
            leaveTo="opacity-0 backdrop-blur-none"
          >
            <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="fixed bottom-0 right-0 top-0 flex h-full w-full flex-col border-l border-white/10 bg-[#0D0C0B] p-6 text-white shadow-2xl md:w-[450px]">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-5 h-5 text-skims-accent" />
                  <p className="font-serif text-lg tracking-[3px] uppercase text-white font-medium">
                    Your Bag
                  </p>
                  <span className="text-[10px] text-skims-sand/50">
                    ({cart?.totalQuantity || 0})
                  </span>
                </div>
                <button
                  aria-label="Close cart"
                  onClick={closeCart}
                  className="text-skims-sand/60 hover:text-white p-2 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free Shipping Meter */}
              {cart && cart.lines.length > 0 && (
                <div className="py-4 border-b border-white/5 text-[9px] tracking-[2px] uppercase">
                  {amountToFreeShipping > 0 ? (
                    <p className="mb-2 text-skims-sand/80">
                      You are{" "}
                      <span className="text-skims-accent font-bold">
                        ${amountToFreeShipping.toFixed(2)}
                      </span>{" "}
                      away from Free Shipping!
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

              {/* Cart Items or Empty State */}
              {!cart || cart.lines.length === 0 ? (
                <div className="mt-20 flex w-full flex-col items-center justify-center overflow-hidden text-center gap-4 opacity-55">
                  <ShoppingBag className="w-12 h-12 text-skims-sand/30 stroke-[1px]" />
                  <p className="text-[11px] tracking-[3px] uppercase text-skims-sand">
                    Your shopping bag is empty.
                  </p>
                  <button
                    onClick={closeCart}
                    className="mt-2 px-6 py-2 border border-skims-sand/20 hover:border-skims-accent text-skims-sand hover:text-white text-[9px] uppercase tracking-[2px] cursor-pointer"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="flex h-full flex-col justify-between overflow-hidden">
                  <ul className="grow overflow-auto py-4 pr-1 space-y-6 no-scrollbar">
                    {cart.lines
                      .sort((a, b) =>
                        a.merchandise.product.title.localeCompare(
                          b.merchandise.product.title,
                        ),
                      )
                      .map((item, i) => {
                        const merchandiseSearchParams =
                          {} as MerchandiseSearchParams;

                        item.merchandise.selectedOptions.forEach(
                          ({ name, value }) => {
                            if (value !== DEFAULT_OPTION) {
                              merchandiseSearchParams[name.toLowerCase()] =
                                value;
                            }
                          },
                        );

                        const merchandiseUrl = createUrl(
                          `/product/${item.merchandise.product.handle}`,
                          new URLSearchParams(merchandiseSearchParams),
                        );

                        return (
                          <li
                            key={i}
                            className="flex w-full flex-col border-b border-white/5 pb-6 items-stretch"
                          >
                            <div className="relative flex w-full flex-row justify-between items-stretch">
                              <div className="flex flex-row gap-4">
                                <div className="relative h-20 w-16 overflow-hidden border border-white/10 bg-black flex-shrink-0">
                                  <Image
                                    className="h-full w-full object-cover"
                                    width={64}
                                    height={80}
                                    alt={
                                      item.merchandise.product.featuredImage
                                        .altText ||
                                      item.merchandise.product.title
                                    }
                                    src={
                                      item.merchandise.product.featuredImage.url
                                    }
                                  />
                                </div>
                                <div className="flex flex-col justify-between text-left">
                                  <div>
                                    <Link
                                      href={merchandiseUrl}
                                      onClick={closeCart}
                                      className="font-serif text-sm tracking-wide text-white uppercase font-light hover:text-skims-accent transition-colors"
                                    >
                                      {item.merchandise.product.title}
                                    </Link>
                                    {item.merchandise.title !==
                                    DEFAULT_OPTION ? (
                                      <p className="text-[8.5px] tracking-[1px] text-skims-sand/40 uppercase mt-1">
                                        {item.merchandise.title}
                                      </p>
                                    ) : null}
                                  </div>

                                  {/* Quantity Controls */}
                                  <div className="flex items-center border border-white/10 bg-black/40 w-fit mt-2">
                                    <EditItemQuantityButton
                                      item={item}
                                      type="minus"
                                      optimisticUpdate={updateCartItem}
                                    />
                                    <span className="text-[10px] px-2 text-white font-bold min-w-4 text-center">
                                      {item.quantity}
                                    </span>
                                    <EditItemQuantityButton
                                      item={item}
                                      type="plus"
                                      optimisticUpdate={updateCartItem}
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-col justify-between items-end">
                                <DeleteItemButton
                                  item={item}
                                  optimisticUpdate={updateCartItem}
                                />
                                <Price
                                  className="text-right text-xs text-white"
                                  amount={item.cost.totalAmount.amount}
                                  currencyCode={
                                    item.cost.totalAmount.currencyCode
                                  }
                                />
                              </div>
                            </div>
                          </li>
                        );
                      })}
                  </ul>

                  {/* Summary & Checkout */}
                  <div className="pt-4 border-t border-white/10 bg-[#0D0C0B]">
                    <div className="space-y-3 mb-6 text-[10px] uppercase tracking-[2px]">
                      <div className="flex justify-between text-skims-sand/60">
                        <p>Taxes</p>
                        <Price
                          className="text-right text-white"
                          amount={cart.cost.totalTaxAmount.amount}
                          currencyCode={cart.cost.totalTaxAmount.currencyCode}
                        />
                      </div>
                      <div className="flex justify-between text-skims-sand/60">
                        <p>Shipping</p>
                        <p className="text-right">Calculated at checkout</p>
                      </div>
                      <div className="border-t border-white/5 pt-3 flex justify-between text-white font-bold text-sm">
                        <p>Total</p>
                        <Price
                          className="text-right text-skims-accent font-bold"
                          amount={cart.cost.totalAmount.amount}
                          currencyCode={cart.cost.totalAmount.currencyCode}
                        />
                      </div>
                    </div>
                    <form action={redirectToCheckout}>
                      <CheckoutButton />
                    </form>
                  </div>
                </div>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}

function CheckoutButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="w-full py-4 bg-skims-accent hover:bg-white text-black font-sans font-bold text-[10px] tracking-[3px] uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(197,168,128,0.25)]"
      type="submit"
      disabled={pending}
    >
      {pending ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          PROCEEDING...
        </>
      ) : (
        "PROCEED TO CHECKOUT"
      )}
    </button>
  );
}
