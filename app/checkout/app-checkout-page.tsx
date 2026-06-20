import { getCart } from "lib/shopify";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

// This page no longer collects card details itself. It hands off to
// Shopify's hosted, PCI-compliant checkout using the real cart checkout URL.
// (The cart drawer's "Proceed to Checkout" button already does this via
// redirectToCheckout() in components/cart/actions.ts — this route exists
// as a fallback in case someone lands on /checkout directly.)
export default async function CheckoutPage() {
  const cart = await getCart();

  if (cart?.checkoutUrl && cart.lines.length > 0) {
    redirect(cart.checkoutUrl);
  }

  redirect("/");
}
