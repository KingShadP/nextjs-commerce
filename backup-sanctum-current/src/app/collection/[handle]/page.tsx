import React from "react";
import { fetchCollections, fetchProducts } from "@/lib/shopify";
import CollectionCatalogClient from "@/components/CollectionCatalogClient";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const revalidate = 60;

export async function generateStaticParams() {
  const collections = await fetchCollections();
  return collections.map((col) => ({
    handle: col.handle,
  }));
}

interface CollectionPageProps {
  params: Promise<{ handle: string }>;
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { handle } = await params;
  const collections = await fetchCollections();
  
  // Find current collection
  const collection = collections.find((col) => col.handle === handle);
  
  // Fetch products in this collection
  const products = await fetchProducts(handle);

  if (!collection) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center space-y-6 font-mono select-none">
        <h2 className="font-serif text-3xl text-white uppercase tracking-wider">Collection Not Found</h2>
        <p className="text-skims-sand/55 text-xs">The requested fit classification coordinates do not exist.</p>
        <Link
          href="/"
          className="inline-block px-8 py-3 bg-skims-accent text-black font-sans font-bold text-[10px] tracking-[3px] uppercase hover:bg-white transition-colors"
        >
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 md:py-16 space-y-12 select-none">
      
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 font-mono text-[8.5px] text-skims-sand/40 uppercase tracking-[2px] select-none">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-skims-accent">{collection.title}</span>
      </div>

      {/* Collection Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end border-b border-white/10 pb-8 gap-6 text-left relative">
        <div className="absolute top-0 right-0 w-24 h-[1px] bg-skims-accent/30" />
        <div className="space-y-3 max-w-2xl">
          <span className="font-mono text-[8px] text-skims-accent tracking-[4px] uppercase block">
            CLASSIFICATION SPEC // ATELIER CORE
          </span>
          <h1 className="font-serif text-3xl md:text-5xl text-white tracking-wide uppercase font-light">
            {collection.title}
          </h1>
          <p className="font-sans text-xs md:text-sm text-skims-sand/65 font-light leading-relaxed">
            {collection.description}
          </p>
        </div>

        <div className="flex items-center gap-4 text-right font-mono text-[8.5px] text-skims-sand/35 uppercase tracking-[2px]">
          <div>
            <span className="text-white/70 block">GRID RATIO:</span>
            <span>{products.length} AVAILABLE ACQUISITIONS</span>
          </div>
        </div>
      </div>

      {/* Products Catalog Workspace (Client Component) */}
      <CollectionCatalogClient products={products} />

      {/* Footer Navigation helper */}
      <div className="border-t border-white/5 pt-16 flex justify-between items-center font-mono text-[9px] uppercase tracking-[3.5px]">
        <Link href="/" className="text-skims-sand/55 hover:text-skims-accent transition-colors">
          &lt; Return to main catalog
        </Link>
        <span className="text-white/20 select-text">KSHADP MENSWEAR // CL-SPEC</span>
      </div>

    </div>
  );
}
