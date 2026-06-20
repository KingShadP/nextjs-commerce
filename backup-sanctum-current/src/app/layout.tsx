import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";
import SovereignWebGLStage from "@/components/SovereignWebGLStage";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KSHADP | Men's Shapewear, Underwear & Loungewear",
  description: "Explore the Giragon Collection. Premium support contours, ribbed underwear, and plush heavyweight loungewear sets engineered for men. Designed by KingShadP.",
  keywords: "shapewear for men, compression underwear, ribbed boxers, modal loungewear, sleepwear, kshadp, giragon collection",
  openGraph: {
    title: "KSHADP | Men's Shapewear, Underwear & Loungewear",
    description: "Explore the Giragon Collection. Premium support contours, ribbed underwear, and plush heavyweight loungewear sets engineered for men.",
    images: [{ url: "/logo-full.png" }],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0A0908] text-[#F5F3EF] relative selection:bg-[#C5A880]/30 selection:text-white overflow-x-hidden">
        <CartProvider>
          {/* Animated 3D WebGL Backdrop */}
          <SovereignWebGLStage isLowPerformance={false} />

          {/* Brand Scanline Volumetric Sweep */}
          <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden opacity-[0.015]">
            <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#C5A880] to-transparent animate-scanline" />
          </div>

          {/* Navigation & Cart Drawer */}
          <Header />
          <CartDrawer />
          
          {/* Page Contents */}
          <main className="flex-grow pt-7 relative z-20">
            {children}
          </main>
        </CartProvider>
      </body>
    </html>
  );
}
