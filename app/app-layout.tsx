import AppChrome from "components/AppChrome";
import { CartProvider } from "components/cart/cart-context";
import CinematicEnvironment from "components/CinematicEnvironment";
import { Outfit, Playfair_Display } from "next/font/google";
import { getCart } from "lib/shopify";
import { getSiteDesignSettings } from "lib/site-design";
import { CSSProperties, ReactNode } from "react";
import "./globals.css";
import { baseUrl } from "lib/utils";
import SmoothScrollProvider from "components/SmoothScrollProvider";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600", "700"],
});

const { SITE_NAME } = process.env;

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "KSHADP | Men's Shapewear, Underwear & Loungewear",
    template: `%s | ${SITE_NAME ?? "KSHADP"}`,
  },
  description:
    "Shop KSHADP — premium shapewear, underwear, and loungewear for men. Engineered support, everyday comfort. Free shipping on orders over $150.",
  keywords:
    "shapewear for men, mens compression underwear, ribbed boxer briefs, modal loungewear, mens shapewear, kshadp, dragon series",
  robots: {
    follow: true,
    index: true,
  },
  openGraph: {
    type: "website",
    siteName: "KSHADP",
    title: "KSHADP | Men's Shapewear, Underwear & Loungewear",
    description:
      "Premium shapewear, underwear, and loungewear for men. Engineered support, everyday comfort. Free shipping on orders over $150.",
    // OG image is auto-generated from app/opengraph-image.tsx —
    // no manual images array needed here.
  },
  twitter: {
    card: "summary_large_image",
    title: "KSHADP | Men's Shapewear, Underwear & Loungewear",
    description:
      "Premium shapewear, underwear, and loungewear for men. Engineered support, everyday comfort.",
  },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Don't await the fetch, pass the Promise to the context provider
  const cart = getCart();
  const design = await getSiteDesignSettings();
  const designVariables = {
    "--background": design.backgroundColor,
    "--foreground": design.foregroundColor,
    "--skims-accent": design.accentColor,
    "--hero-image-opacity": design.heroImageOpacity,
    "--overlay-strength": design.overlayStrength,
  } as CSSProperties;

  return (
    <html
      lang="en"
      className={`${outfit.variable} ${playfair.variable} h-full antialiased`}
    >
      <body
        style={designVariables}
        className="min-h-full flex flex-col bg-background text-foreground relative selection:bg-skims-accent/30 selection:text-white overflow-x-hidden"
      >
        <SmoothScrollProvider>
          <CartProvider cartPromise={cart}>
            <CinematicEnvironment settings={design} />
            <AppChrome settings={design}>{children}</AppChrome>
          </CartProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
