import type { Product, Collection, ProductVariant } from "lib/shopify/types";

export const MOCK_RAW_PRODUCTS = [
  {
    id: "SKM-M-01",
    handle: "onyx-ribbed-boxer-brief",
    title: "Ribbed Boxer Brief",
    description:
      "Engineered with a supportive ribbed texture and moisture-wicking premium stretch modal. Fits close to the body, keeping shape and support all day.",
    price: "28.00",
    imgUrl:
      "https://images.unsplash.com/photo-1582830359871-d915b3997841?q=80&w=800&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1582830359871-d915b3997841?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop",
    ],
    specs: [
      "95% Modal / 5% Elastane",
      "Breathable ribbed knit",
      "Supportive contoured pouch",
      "No-roll elastic waistband",
    ],
    colors: [
      { name: "Onyx", hex: "#12100E" },
      { name: "Concrete", hex: "#A8A39D" },
      { name: "Cocoa", hex: "#5C4F44" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    variants: [
      { id: "v-box-1", title: "Onyx / S", price: "28.00" },
      { id: "v-box-2", title: "Onyx / M", price: "28.00" },
      { id: "v-box-3", title: "Onyx / L", price: "28.00" },
      { id: "v-box-4", title: "Concrete / M", price: "28.00" },
      { id: "v-box-5", title: "Cocoa / L", price: "28.00" },
    ],
  },
  {
    id: "SKM-M-02",
    handle: "sands-stretch-muscle-tank",
    title: "Stretch Muscle Tank",
    description:
      "Designed to contour and define. Made with a heavyweight compressive cotton blend that smooths and shapes the torso. Perfect as a base layer or worn solo as premium casual wear.",
    price: "36.00",
    imgUrl:
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?q=80&w=800&auto=format&fit=crop",
    ],
    specs: [
      "88% Cotton / 12% Spandex",
      "Torso contour compression",
      "Low-profile flatlock seams",
      "Extended hem length",
    ],
    colors: [
      { name: "Sand", hex: "#E6DEC9" },
      { name: "Onyx", hex: "#12100E" },
      { name: "Clay", hex: "#AC9E8F" },
    ],
    sizes: ["S", "M", "L", "XL"],
    variants: [
      { id: "v-tank-1", title: "Sand / M", price: "36.00" },
      { id: "v-tank-2", title: "Onyx / L", price: "36.00" },
      { id: "v-tank-3", title: "Clay / M", price: "36.00" },
    ],
  },
  {
    id: "SKM-M-03",
    handle: "cocoa-fleece-lounge-hoodie",
    title: "Fleece Lounge Hoodie",
    description:
      "An ultra-plush oversized pullover crafted from brushed-back heavyweight fleece. Tailored with dropped shoulders and a double-lined hood, creating a structured aesthetic with ultimate comfort.",
    price: "88.00",
    imgUrl:
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop",
    ],
    specs: [
      "80% Cotton / 20% Polyester",
      "420 GSM heavy fleece",
      "Oversized silhouette",
      "Kangaroo pocket",
    ],
    colors: [
      { name: "Cocoa", hex: "#5C4F44" },
      { name: "Concrete", hex: "#A8A39D" },
      { name: "Onyx", hex: "#12100E" },
    ],
    sizes: ["S", "M", "L", "XL"],
    variants: [
      { id: "v-hood-1", title: "Cocoa / M", price: "88.00" },
      { id: "v-hood-2", title: "Concrete / L", price: "88.00" },
      { id: "v-hood-3", title: "Onyx / XL", price: "88.00" },
    ],
  },
  {
    id: "SKM-M-04",
    handle: "concrete-knit-sleep-pants",
    title: "Knit Sleep Pants",
    description:
      "Crafted from fluid knit modal with a silk-like finish. Designed for absolute comfort with a loose fit, straight leg, and pockets. Ideal for sleep or everyday lounging.",
    price: "56.00",
    imgUrl:
      "https://images.unsplash.com/photo-1506152983158-b4a74a01c721?q=80&w=800&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1506152983158-b4a74a01c721?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?q=80&w=800&auto=format&fit=crop",
    ],
    specs: [
      "93% Modal / 7% Spandex",
      "Fluid straight-leg cut",
      "Side-seam pockets",
      "Tonal drawcord waist",
    ],
    colors: [
      { name: "Concrete", hex: "#A8A39D" },
      { name: "Sand", hex: "#E6DEC9" },
      { name: "Onyx", hex: "#12100E" },
    ],
    sizes: ["S", "M", "L", "XL"],
    variants: [
      { id: "v-pant-1", title: "Concrete / M", price: "56.00" },
      { id: "v-pant-2", title: "Sand / M", price: "56.00" },
      { id: "v-pant-3", title: "Onyx / L", price: "56.00" },
    ],
  },
  {
    id: "SKM-M-05",
    handle: "clay-lounge-tee",
    title: "Lounge Crewneck Tee",
    description:
      "The ultimate luxury base tee. Cut in a classic crewneck profile with high-recovery ribbing at the neck. Woven from breathable cotton-modal fibers that feel cool against the skin.",
    price: "34.00",
    imgUrl:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop",
    ],
    specs: [
      "50% Pima Cotton / 50% Modal",
      "Midweight breathability",
      "Double-needle stitched hems",
      "Preshrunk luxury finish",
    ],
    colors: [
      { name: "Clay", hex: "#AC9E8F" },
      { name: "Sand", hex: "#E6DEC9" },
      { name: "Onyx", hex: "#12100E" },
    ],
    sizes: ["S", "M", "L", "XL"],
    variants: [
      { id: "v-tee-1", title: "Clay / M", price: "34.00" },
      { id: "v-tee-2", title: "Sand / L", price: "34.00" },
      { id: "v-tee-3", title: "Onyx / L", price: "34.00" },
    ],
  },
  {
    id: "SKM-M-06",
    handle: "compression-muscle-ls",
    title: "Compression Sleeve Longsleeve",
    description:
      "High-performance compression longsleeve built to support and define. Dual-vent underarm mesh and seamless shoulder construction keep you cool and unrestricted through any activity.",
    price: "48.00",
    imgUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?q=80&w=800&auto=format&fit=crop",
    ],
    specs: [
      "82% Nylon / 18% Elastane",
      "High-recovery stretch",
      "Seamless shoulder construction",
      "Breathable mesh underarm panels",
    ],
    colors: [
      { name: "Onyx", hex: "#12100E" },
      { name: "Concrete", hex: "#A8A39D" },
    ],
    sizes: ["S", "M", "L", "XL"],
    variants: [
      { id: "v-ls-1", title: "Onyx / M", price: "48.00" },
      { id: "v-ls-2", title: "Onyx / L", price: "48.00" },
      { id: "v-ls-3", title: "Concrete / M", price: "48.00" },
    ],
  },
];

export const MOCK_RAW_COLLECTIONS = [
  {
    handle: "new-arrivals",
    title: "New Arrivals",
    description:
      "The latest shapewear and premium loungewear sets for men.",
    imgUrl:
      "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop",
  },
  {
    handle: "compression",
    title: "Shapewear",
    description:
      "Shaping garments designed to smooth, define, and support with comfort.",
    imgUrl:
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop",
  },
  {
    handle: "loungewear",
    title: "Loungewear",
    description:
      "Heavyweight hoodies, modal tees, and relaxed sleep pants in tonal colorways.",
    imgUrl:
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop",
  },
  {
    handle: "underwear",
    title: "Underwear",
    description:
      "Ribbed modal boxers and briefs engineered for everyday support.",
    imgUrl:
      "https://images.unsplash.com/photo-1582830359871-d915b3997841?q=80&w=800&auto=format&fit=crop",
  },
];

export function adaptMockProduct(
  p: (typeof MOCK_RAW_PRODUCTS)[0],
): Product {
  const options = [
    {
      id: `opt-${p.id}-color`,
      name: "Color",
      values: p.colors.map((c) => c.name),
    },
    {
      id: `opt-${p.id}-size`,
      name: "Size",
      values: p.sizes,
    },
  ];

  const reshapedVariants: ProductVariant[] = p.variants.map((v) => {
    const parts = v.title.split("/");
    const colorVal = parts[0]?.trim() || "Onyx";
    const sizeVal = parts[1]?.trim() || "M";

    return {
      id: v.id,
      title: v.title,
      availableForSale: true,
      selectedOptions: [
        { name: "Color", value: colorVal },
        { name: "Size", value: sizeVal },
      ],
      price: {
        amount: v.price,
        currencyCode: "USD",
      },
    };
  });

  return {
    id: p.id,
    handle: p.handle,
    availableForSale: true,
    title: p.title,
    description: p.description,
    descriptionHtml: `<p>${p.description}</p>`,
    options,
    priceRange: {
      minVariantPrice: { amount: p.price, currencyCode: "USD" },
      maxVariantPrice: { amount: p.price, currencyCode: "USD" },
    },
    variants: reshapedVariants,
    featuredImage: {
      url: p.imgUrl,
      altText: p.title,
      width: 600,
      height: 800,
    },
    images: p.gallery.map((url) => ({
      url,
      altText: p.title,
      width: 600,
      height: 800,
    })),
    seo: {
      title: p.title,
      description: p.description,
    },
    tags: ["mock", ...p.colors.map((c) => c.name.toLowerCase())],
    updatedAt: new Date().toISOString(),
  };
}

export function getMockProducts(): Product[] {
  return MOCK_RAW_PRODUCTS.map(adaptMockProduct);
}

export function getMockCollections(): Collection[] {
  return MOCK_RAW_COLLECTIONS.map((c) => ({
    handle: c.handle,
    title: c.title,
    description: c.description,
    seo: {
      title: c.title,
      description: c.description,
    },
    updatedAt: new Date().toISOString(),
    path: `/search/${c.handle}`,
  }));
}
