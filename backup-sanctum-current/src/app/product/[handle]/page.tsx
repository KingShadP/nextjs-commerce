import React from "react";
import { fetchProducts } from "@/lib/shopify";
import ProductDetailClient from "@/components/ProductDetailClient";
import Link from "next/link";

export const revalidate = 60;

export async function generateStaticParams() {
  const products = await fetchProducts();
  return products.map((product) => ({
    handle: product.handle,
  }));
}

interface ProductPageProps {
  params: Promise<{ handle: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params;
  const products = await fetchProducts();
  
  // Find the product by handle
  const product = products.find((p) => p.handle === handle);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center space-y-6 font-mono select-none">
        <h2 className="font-serif text-3xl text-white uppercase tracking-wider">Product Not Found</h2>
        <p className="text-skims-sand/50 text-xs">The requested garment coordinates do not exist in our catalog slots.</p>
        <Link
          href="/"
          className="inline-block px-8 py-3 bg-skims-accent text-black font-sans font-bold text-[10px] tracking-[3px] uppercase hover:bg-white transition-colors"
        >
          Return Home
        </Link>
      </div>
    );
  }

  return <ProductDetailClient product={product} />;
}
