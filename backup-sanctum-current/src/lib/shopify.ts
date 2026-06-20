/**
 * Shopify Storefront API client and mock database for SKIMS Mens
 */

export interface ProductVariant {
  id: string;
  title: string;
  available: boolean;
  price: string;
  currency: string;
}

export interface Product {
  id: string;
  shopifyId?: string;
  handle: string;
  title: string;
  description: string;
  price: string;
  currency: string;
  imgUrl: string;
  gallery: string[];
  specs: string[];
  colors: { name: string; hex: string; imgUrl?: string }[];
  sizes: string[];
  variants?: ProductVariant[];
}

export interface Collection {
  id: string;
  title: string;
  handle: string;
  description: string;
  imgUrl: string;
}

// ── MOCK DATABASE FOR SKIMS MENS (Premium Editorial Aesthetics) ────────────────
export const MOCK_PRODUCTS: Product[] = [
  {
    id: "SKM-M-01",
    handle: "onyx-ribbed-boxer-brief",
    title: "Ribbed Boxer Brief",
    description: "Engineered with a supportive ribbed texture and moisture-wicking premium stretch modal. Fits close to the body, keeping shape and support all day. Part of the SKIMS Mens Core Foundations collection.",
    price: "28.00",
    currency: "USD",
    imgUrl: "https://images.unsplash.com/photo-1582830359871-d915b3997841?q=80&w=1200&auto=format&fit=crop", // Minimalist concrete apparel look
    gallery: [
      "https://images.unsplash.com/photo-1582830359871-d915b3997841?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop", // Male model fit reference placeholder
      "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=1200&auto=format&fit=crop"
    ],
    specs: ["95% Modal / 5% Elastane", "Breathable Ribbed knit", "Supportive contoured pouch", "No-roll elastic waistband"],
    colors: [
      { name: "Onyx", hex: "#12100E" },
      { name: "Concrete", hex: "#A8A39D" },
      { name: "Cocoa", hex: "#5C4F44" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL", "3XL"],
    variants: [
      { id: "v-box-1", title: "Onyx / S", available: true, price: "28.00", currency: "USD" },
      { id: "v-box-2", title: "Onyx / M", available: true, price: "28.00", currency: "USD" },
      { id: "v-box-3", title: "Onyx / L", available: true, price: "28.00", currency: "USD" },
      { id: "v-box-4", title: "Concrete / M", available: true, price: "28.00", currency: "USD" },
      { id: "v-box-5", title: "Cocoa / L", available: true, price: "28.00", currency: "USD" }
    ]
  },
  {
    id: "SKM-M-02",
    handle: "sands-stretch-muscle-tank",
    title: "Stretch Muscle Tank",
    description: "Designed to contour and definition. Made with a heavy-weight compressive cotton blend that smooths and shapes the torso. Perfect as a base layer or worn solo as premium casual wear.",
    price: "36.00",
    currency: "USD",
    imgUrl: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1200&auto=format&fit=crop", // Male model in studio
    gallery: [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?q=80&w=1200&auto=format&fit=crop"
    ],
    specs: ["88% Cotton / 12% Spandex", "Torso contour compression", "Low profile flatlock seams", "Extended hem length"],
    colors: [
      { name: "Sand", hex: "#E6DEC9" },
      { name: "Onyx", hex: "#12100E" },
      { name: "Clay", hex: "#AC9E8F" }
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    variants: [
      { id: "v-tank-1", title: "Sand / M", available: true, price: "36.00", currency: "USD" },
      { id: "v-tank-2", title: "Onyx / L", available: true, price: "36.00", currency: "USD" },
      { id: "v-tank-3", title: "Clay / M", available: true, price: "36.00", currency: "USD" }
    ]
  },
  {
    id: "SKM-M-03",
    handle: "cocoa-fleece-lounge-hoodie",
    title: "Fleece Lounge Hoodie",
    description: "An ultra-plush oversized pullover crafted from brushed back heavyweight fleece. Tailored with dropped shoulders and a double-lined hood, creating a structured aesthetic with ultimate comfort.",
    price: "88.00",
    currency: "USD",
    imgUrl: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1200&auto=format&fit=crop", // Warm studio lounge
    gallery: [
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1200&auto=format&fit=crop"
    ],
    specs: ["80% Cotton / 20% Polyester", "420 GSM heavy fleece", "Oversized silhouette", "Kangaroo pocket with hidden pouch"],
    colors: [
      { name: "Cocoa", hex: "#5C4F44" },
      { name: "Concrete", hex: "#A8A39D" },
      { name: "Onyx", hex: "#12100E" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    variants: [
      { id: "v-hood-1", title: "Cocoa / M", available: true, price: "88.00", currency: "USD" },
      { id: "v-hood-2", title: "Concrete / L", available: true, price: "88.00", currency: "USD" },
      { id: "v-hood-3", title: "Onyx / XL", available: true, price: "88.00", currency: "USD" }
    ]
  },
  {
    id: "SKM-M-04",
    handle: "concrete-knit-sleep-pants",
    title: "Knit Sleep Pants",
    description: "Crafted from fluid knit modal with a silk-like finish. Designed for absolute comfort with a loose fit, straight leg, and pockets. Ideal for sleep or elite loungewear.",
    price: "56.00",
    currency: "USD",
    imgUrl: "https://images.unsplash.com/photo-1506152983158-b4a74a01c721?q=80&w=1200&auto=format&fit=crop", // Luxury relax apparel
    gallery: [
      "https://images.unsplash.com/photo-1506152983158-b4a74a01c721?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?q=80&w=1200&auto=format&fit=crop"
    ],
    specs: ["93% Modal / 7% Spandex", "Fluid straight leg cut", "Side-seam pockets", "Tonal drawcord waist"],
    colors: [
      { name: "Concrete", hex: "#A8A39D" },
      { name: "Sand", hex: "#E6DEC9" },
      { name: "Onyx", hex: "#12100E" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    variants: [
      { id: "v-pant-1", title: "Concrete / M", available: true, price: "56.00", currency: "USD" },
      { id: "v-pant-2", title: "Sand / M", available: true, price: "56.00", currency: "USD" },
      { id: "v-pant-3", title: "Onyx / L", available: true, price: "56.00", currency: "USD" }
    ]
  },
  {
    id: "SKM-M-05",
    handle: "clay-lounge-tee",
    title: "Lounge Crewneck Tee",
    description: "The ultimate luxury base tee. Cut in a classic crewneck profile with high-recovery ribbing at the neck. Woven from breathable cotton-modal fibers that feel cool against the skin.",
    price: "34.00",
    currency: "USD",
    imgUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1200&auto=format&fit=crop", // studio portrait t-shirt
    gallery: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1200&auto=format&fit=crop"
    ],
    specs: ["50% Pima Cotton / 50% Modal", "Midweight breathability", "Double needle stitched hems", "Preshrunk luxury finish"],
    colors: [
      { name: "Clay", hex: "#AC9E8F" },
      { name: "Sand", hex: "#E6DEC9" },
      { name: "Onyx", hex: "#12100E" }
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL", "3XL"],
    variants: [
      { id: "v-tee-1", title: "Clay / M", available: true, price: "34.00", currency: "USD" },
      { id: "v-tee-2", title: "Sand / L", available: true, price: "34.00", currency: "USD" },
      { id: "v-tee-3", title: "Onyx / L", available: true, price: "34.00", currency: "USD" }
    ]
  },
  {
    id: "SKM-M-06",
    handle: "compression-muscle-ls",
    title: "Compression Sleeve Longsleeve",
    description: "High-performance compression longsleeve engineered to lock down body core heat and outline chest definitions. Built with dual-vent underarm meshes and seamless shoulder joints.",
    price: "48.00",
    currency: "USD",
    imgUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1200&auto=format&fit=crop", // Athletic male posing
    gallery: [
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?q=80&w=1200&auto=format&fit=crop"
    ],
    specs: ["82% Nylon / 18% Elastane", "High-recovery stretch matrix", "Seamless shoulder geometry", "Breathable mesh joints"],
    colors: [
      { name: "Onyx", hex: "#12100E" },
      { name: "Concrete", hex: "#A8A39D" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    variants: [
      { id: "v-ls-1", title: "Onyx / M", available: true, price: "48.00", currency: "USD" },
      { id: "v-ls-2", title: "Onyx / L", available: true, price: "48.00", currency: "USD" },
      { id: "v-ls-3", title: "Concrete / M", available: true, price: "48.00", currency: "USD" }
    ]
  }
];

export const MOCK_COLLECTIONS: Collection[] = [
  {
    id: "col-new",
    title: "New Arrivals",
    handle: "new-arrivals",
    description: "The latest high-compression support shapes and premium loungewear sets for the active male.",
    imgUrl: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "col-shape",
    title: "Supportive Compression",
    handle: "compression",
    description: "Advanced shaping garments designed to smooth, define, and compress with comfort.",
    imgUrl: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "col-lounge",
    title: "Premium Loungewear",
    handle: "loungewear",
    description: "Heavyweight hoodies, modal tees, and relaxed sleep pants in tonal nude and dark colorways.",
    imgUrl: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "col-underwear",
    title: "Foundation Underwear",
    handle: "underwear",
    description: "Ergonomic modal ribbed boxers, trunks, and briefs engineered for everyday support.",
    imgUrl: "https://images.unsplash.com/photo-1582830359871-d915b3997841?q=80&w=1200&auto=format&fit=crop"
  }
];

// ── SHOPIFY API UTILITY ACTIONS ──────────────────────────────────────────────

function getCredentials() {
  const domain = (process.env.SHOPIFY_DOMAIN || "").trim();
  const token = (process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || process.env.PUBLIC_STOREFRONT_API_TOKEN || "").trim();
  
  if (!domain || !token || domain.includes("placeholder") || token.includes("placeholder")) {
    return null;
  }
  return { domain, token };
}

async function shopifyQuery(query: string, variables = {}) {
  const creds = getCredentials();
  if (!creds) return null;

  const endpoint = `https://${creds.domain}/api/2024-01/graphql.json`;
  
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": creds.token
      },
      body: JSON.stringify({ query, variables }),
      next: { revalidate: 60 } // Cache results for 60 seconds
    });

    if (!response.ok) {
      throw new Error(`Shopify storefront HTTP error: ${response.status}`);
    }

    const json = await response.json();
    if (json.errors && json.errors.length > 0) {
      throw new Error(json.errors[0].message);
    }
    return json.data;
  } catch (e) {
    console.error("Shopify Storefront fetch failed:", e);
    return null;
  }
}

export async function fetchCollections(): Promise<Collection[]> {
  const query = `
    query GetCollections {
      collections(first: 10) {
        edges {
          node {
            id
            title
            handle
            description
            image {
              url
            }
          }
        }
      }
    }
  `;

  const data = await shopifyQuery(query);
  if (!data) return MOCK_COLLECTIONS;

  const edges = data?.collections?.edges ?? [];
  if (edges.length === 0) return MOCK_COLLECTIONS;

  return edges.map((edge: any) => {
    const node = edge.node;
    return {
      id: node.id,
      title: node.title,
      handle: node.handle,
      description: node.description || "",
      imgUrl: node.image?.url || "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=600"
    };
  });
}

export async function fetchProducts(collectionHandle?: string): Promise<Product[]> {
  const query = collectionHandle ? `
    query GetCollectionProducts($handle: String!) {
      collection(handle: $handle) {
        products(first: 20) {
          edges {
            node {
              id
              title
              description
              handle
              vendor
              images(first: 5) {
                edges {
                  node {
                    url
                  }
                }
              }
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              variants(first: 20) {
                edges {
                  node {
                    id
                    title
                    availableForSale
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  ` : `
    query GetProducts {
      products(first: 20) {
        edges {
          node {
            id
            title
            description
            handle
            vendor
            images(first: 5) {
              edges {
                node {
                  url
                }
              }
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            variants(first: 20) {
              edges {
                node {
                  id
                  title
                  availableForSale
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const variables = collectionHandle ? { handle: collectionHandle } : {};
  const data = await shopifyQuery(query, variables);

  let edges = [];
  if (collectionHandle) {
    edges = data?.collection?.products?.edges ?? [];
  } else {
    edges = data?.products?.edges ?? [];
  }

  if (!data || edges.length === 0) {
    // If filtering, filter mock products for compatibility
    if (collectionHandle) {
      if (collectionHandle === "compression") {
        return MOCK_PRODUCTS.filter(p => p.handle.includes("tank") || p.handle.includes("ls"));
      } else if (collectionHandle === "loungewear") {
        return MOCK_PRODUCTS.filter(p => p.handle.includes("hoodie") || p.handle.includes("pants") || p.handle.includes("tee"));
      } else if (collectionHandle === "underwear") {
        return MOCK_PRODUCTS.filter(p => p.handle.includes("boxer"));
      }
    }
    return MOCK_PRODUCTS;
  }

  return edges.map((edge: any) => {
    const node = edge.node;
    const price = node.priceRange?.minVariantPrice;
    const imgUrls = (node.images?.edges ?? []).map((e: any) => e.node.url);
    const mainImg = imgUrls[0] || "https://images.unsplash.com/photo-1582830359871-d915b3997841?q=80&w=600";
    
    const variants = (node.variants?.edges ?? []).map((v: any) => ({
      id: v.node.id,
      title: v.node.title,
      available: v.node.availableForSale,
      price: v.node.price?.amount || "0.00",
      currency: v.node.price?.currencyCode || "USD"
    }));

    // Generate sizes and colors based on Shopify variants for client selectors
    const sizes = Array.from(new Set<string>(variants.map((v: any) => {
      // Tries to extract size from titles like "Onyx / M" or "L"
      const parts = v.title.split("/");
      return parts[parts.length - 1].trim();
    })));

    const colorSet = new Set<string>();
    const colors = (variants as any[]).map(v => {
      const parts = v.title.split("/");
      if (parts.length > 1) {
        return parts[0].trim();
      }
      return "Default";
    }).filter(colName => {
      if (colorSet.has(colName)) return false;
      colorSet.add(colName);
      return true;
    }).map(colName => {
      // Map basic skin colors to codes
      let hex = "#A39382"; // Default clay
      if (colName.toLowerCase() === "onyx") hex = "#12100E";
      else if (colName.toLowerCase() === "concrete" || colName.toLowerCase() === "grey" || colName.toLowerCase() === "gray") hex = "#A8A39D";
      else if (colName.toLowerCase() === "cocoa" || colName.toLowerCase() === "brown") hex = "#5C4F44";
      else if (colName.toLowerCase() === "sand" || colName.toLowerCase() === "cream") hex = "#E6DEC9";
      else if (colName.toLowerCase() === "clay") hex = "#AC9E8F";
      return { name: colName, hex };
    });

    return {
      id: node.id.split("/").pop() || node.handle,
      shopifyId: node.id,
      handle: node.handle,
      title: node.title,
      description: node.description || `Premium menswear support armor manufactured by ${node.vendor || "the atelier"}.`,
      price: price?.amount || "0.00",
      currency: price?.currencyCode || "USD",
      imgUrl: mainImg,
      gallery: imgUrls.length > 0 ? imgUrls : [mainImg],
      specs: [`Vendor: ${node.vendor || "SKIMS MENS"}`],
      colors: colors.length > 0 ? colors : [{ name: "Onyx", hex: "#12100E" }],
      sizes: sizes.length > 0 ? sizes : ["S", "M", "L", "XL"],
      variants
    };
  });
}

export async function createCheckout(lineItems: { variantId: string; quantity: number }[]): Promise<string | null> {
  const mutation = `
    mutation CheckoutCreate($input: CheckoutCreateInput!) {
      checkoutCreate(input: $input) {
        checkout {
          webUrl
        }
        checkoutUserErrors {
          message
        }
      }
    }
  `;

  const variables = {
    input: {
      lineItems: lineItems.map((li) => ({
        variantId: li.variantId.startsWith("gid://") ? li.variantId : `gid://shopify/ProductVariant/${li.variantId}`,
        quantity: li.quantity
      }))
    }
  };

  const data = await shopifyQuery(mutation, variables);
  const userErrors = data?.checkoutCreate?.checkoutUserErrors ?? [];
  if (userErrors.length > 0) {
    console.error("Checkout creation errors:", userErrors);
    return null;
  }

  return data?.checkoutCreate?.checkout?.webUrl ?? null;
}
