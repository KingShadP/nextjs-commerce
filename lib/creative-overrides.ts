import type { Product } from "lib/shopify/types";
import type {
  PageCreativeSettings,
  ProductCreativeSettings,
  SiteDesignSettings,
} from "lib/site-design-schema";

export function findProductCreative(
  design: SiteDesignSettings,
  handle: string,
): ProductCreativeSettings | undefined {
  return design.productCreatives.find(
    (creative) => creative.handle.toLowerCase() === handle.toLowerCase(),
  );
}

export function findPageCreative(
  design: SiteDesignSettings,
  handle: string,
): PageCreativeSettings | undefined {
  return design.pageCreatives.find(
    (creative) => creative.handle.toLowerCase() === handle.toLowerCase(),
  );
}

export function applyProductCreative(
  product: Product,
  design: SiteDesignSettings,
): Product {
  const creative = findProductCreative(design, product.handle);
  if (!creative) return product;

  const heroImage = creative.heroImage || product.featuredImage?.url || "";
  const galleryUrls = [
    heroImage,
    creative.hoverImage,
    ...creative.galleryImages,
    ...product.images.map((image) => image.url),
  ].filter(Boolean);

  const uniqueGalleryUrls = Array.from(new Set(galleryUrls));
  const fallbackImage = product.featuredImage || product.images[0];
  const images = uniqueGalleryUrls.map((url, index) => ({
    url,
    altText:
      index === 0
        ? `${product.title} creative hero`
        : `${product.title} creative image ${index + 1}`,
    width: fallbackImage?.width || 1200,
    height: fallbackImage?.height || 1600,
  }));

  return {
    ...product,
    featuredImage: images[0] || product.featuredImage,
    images: images.length ? images : product.images,
    tags: Array.from(
      new Set([
        ...product.tags,
        ...(creative.badge ? [`creative:${creative.badge}`] : []),
        ...(creative.detailNote
          ? [`creative-note:${creative.detailNote}`]
          : []),
      ]),
    ),
  };
}

export function applyProductCreatives(
  products: Product[],
  design: SiteDesignSettings,
): Product[] {
  return products.map((product) => applyProductCreative(product, design));
}
