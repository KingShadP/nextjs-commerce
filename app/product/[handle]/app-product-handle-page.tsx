import Footer from "components/layout/footer";
import ProductDetailClient from "components/ProductDetailClient";
import ProductCard from "components/ProductCard";
import {
  applyProductCreative,
  applyProductCreatives,
} from "lib/creative-overrides";
import { HIDDEN_PRODUCT_TAG } from "lib/constants";
import { getProduct, getProductRecommendations } from "lib/shopify";
import { getMockProducts } from "lib/mock";
import { getSiteDesignSettings } from "lib/site-design";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export async function generateMetadata(props: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  let product = await getProduct(params.handle);
  const design = await getSiteDesignSettings();

  if (!product) {
    const mockProducts = getMockProducts();
    product = mockProducts.find((p) => p.handle === params.handle);
  }

  if (!product) return notFound();
  product = applyProductCreative(product, design);

  const { url, width, height, altText: alt } = product.featuredImage || {};
  const indexable = !product.tags.includes(HIDDEN_PRODUCT_TAG);

  return {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description,
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: {
        index: indexable,
        follow: indexable,
      },
    },
    openGraph: url
      ? {
          images: [
            {
              url,
              width,
              height,
              alt,
            },
          ],
        }
      : null,
  };
}

export default async function ProductPage(props: {
  params: Promise<{ handle: string }>;
}) {
  const params = await props.params;
  let product = await getProduct(params.handle);
  const design = await getSiteDesignSettings();

  if (!product) {
    const mockProducts = getMockProducts();
    product = mockProducts.find((p) => p.handle === params.handle);
  }

  if (!product) return notFound();
  product = applyProductCreative(product, design);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.featuredImage?.url || "",
    offers: {
      "@type": "AggregateOffer",
      availability: product.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      highPrice: product.priceRange.maxVariantPrice.amount,
      lowPrice: product.priceRange.minVariantPrice.amount,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd),
        }}
      />

      <div className="w-full">
        <Suspense
          fallback={
            <div className="h-screen flex items-center justify-center font-sans text-xs uppercase text-skims-sand/40">
              Loading product...
            </div>
          }
        >
          <ProductDetailClient product={product} />
        </Suspense>

        <div className="max-w-7xl mx-auto px-6 border-t border-white/5 mt-16 pt-16">
          <Suspense fallback={null}>
            <RelatedProducts id={product.id} design={design} />
          </Suspense>
        </div>
      </div>
      <Footer />
    </>
  );
}

async function RelatedProducts({
  id,
  design,
}: {
  id: string;
  design: Awaited<ReturnType<typeof getSiteDesignSettings>>;
}) {
  let relatedProducts = await getProductRecommendations(id);

  if (!relatedProducts || relatedProducts.length === 0) {
    // Fall back to a few mock recommendations
    const mockProducts = getMockProducts();
    relatedProducts = mockProducts.filter((p) => p.id !== id).slice(0, 4);
  }
  relatedProducts = applyProductCreatives(relatedProducts, design);

  if (!relatedProducts.length) return null;

  return (
    <div className="pb-24 space-y-8">
      <div className="flex justify-between items-end border-b border-white/5 pb-4">
        <div className="space-y-1 text-left">
          <span className="font-sans text-[8px] text-skims-accent tracking-[3px] uppercase">
            You Might Also Like
          </span>
          <h2 className="font-serif text-2xl md:text-3xl text-white tracking-wide uppercase font-light">
            Related Products
          </h2>
        </div>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 pt-1">
        {relatedProducts.map((product) => (
          <li key={product.handle} className="w-full">
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </div>
  );
}
