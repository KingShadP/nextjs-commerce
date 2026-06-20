/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import express, { Request, Response } from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

// Load .env first, then .env.local with override so local values win
// (mirrors Vite's own env loading order)
dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local", override: true });

const app = express();
const PORT = 3000;

app.use(express.json());

// ─────────────────────────────────────────────────────────────────────────────
// CMS  (unchanged)
// ─────────────────────────────────────────────────────────────────────────────

const CMS_FILE_PATH = path.join(process.cwd(), "src", "data", "cmsData.json");

app.get("/api/cms", (req: Request, res: Response): void => {
  try {
    if (fs.existsSync(CMS_FILE_PATH)) {
      const data = fs.readFileSync(CMS_FILE_PATH, "utf-8");
      res.json(JSON.parse(data));
    } else {
      res.status(404).json({ error: "CMS database file not found on disk." });
    }
  } catch (err: any) {
    res.status(500).json({ error: "Failed reading CMS configuration: " + err.message });
  }
});

app.post("/api/cms", (req: Request, res: Response): void => {
  try {
    const passcode = req.headers["x-admin-passcode"];
    const expectedPasscode = process.env.ADMIN_PASSCODE || "kingshadp_admin";

    if (!passcode || passcode !== expectedPasscode) {
      res.status(401).json({ error: "ACCESS_DENIED: Invalid administrative passcode credential." });
      return;
    }

    const newCmsData = req.body;
    if (!newCmsData || typeof newCmsData !== "object" || !newCmsData.releases || !newCmsData.lore) {
      res.status(400).json({ error: "Invalid CMS database schema." });
      return;
    }

    fs.writeFileSync(CMS_FILE_PATH, JSON.stringify(newCmsData, null, 2), "utf-8");
    res.json({ success: true, message: "Sovereign CMS configuration securely written to file database." });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to save CMS configuration: " + err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Gemini AI (unchanged)
// ─────────────────────────────────────────────────────────────────────────────

let geminiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!geminiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === "MY_GEMINI_API_KEY") {
      console.warn("WARNING: GEMINI_API_KEY is not configured or using default placeholder key.");
    }
    geminiClient = new GoogleGenAI({ apiKey: key || "" });
  }
  return geminiClient;
}

app.post("/api/chat", async (req: Request, res: Response): Promise<void> => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: "Missing or invalid 'messages' key array." });
      return;
    }

    const ai = getGeminiClient();
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY") {
      res.json({
        text: "SECURE CHAT LINK UNAVAILABLE: Gemini API key is missing. Please add your GEMINI_API_KEY in the Secrets / Settings Panel inside the Google AI Studio interface to activate full AI Concierge intelligence operations."
      });
      return;
    }

    const contents = messages.map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.text }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        systemInstruction:
          "You are the Executive AI Concierge for KINGSHADP, a private wealth and extreme luxury lifestyle management firm. You act as a highly competent, unflinchingly professional Chief of Staff. No flowery language, no mystical or mysterious LARP. Be precise, deferential, highly capable, and brutally efficient. Respond to the principal directly. Keep responses relatively brief and highly structured.",
        temperature: 0.4
      }
    });

    const textResponse = response.text || "Operations completed without additional text telemetry output.";
    res.json({ text: textResponse });
  } catch (error: any) {
    console.error("Gemini Server Error:", error);
    res.status(500).json({ error: "System gateway communication timeout: " + (error.message || error) });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Shopify — server-side integration via @shopify/shopify-api
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Resolve Shopify credentials from environment variables.
 * Returns null for any missing field so callers can decide how to respond.
 */
function getShopifyCredentials(): { domain: string; token: string } | null {
  const domain = (
    process.env.SHOPIFY_DOMAIN ||
    process.env.PUBLIC_STORE_DOMAIN ||
    process.env.SHOPIFY_STORE_DOMAIN ||
    process.env.VITE_SHOPIFY_DOMAIN ||
    process.env.SHOPIFY_SHOP_DOMAIN ||
    ""
  ).trim();

  const token = (
    process.env.PUBLIC_STOREFRONT_API_TOKEN ||
    process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ||
    process.env.SHOPIFY_TOKEN ||
    process.env.SHOPIFY_ACCESS_TOKEN ||
    process.env.SHOPIFY_STORE_ACCESS_TOKEN ||
    process.env.VITE_SHOPIFY_TOKEN ||
    process.env.VITE_SHOPIFY_ACCESS_TOKEN ||
    ""
  ).trim();

  if (!domain || !token) return null;
  return { domain, token };
}

/**
 * Normalise a Shopify storefront domain to the plain hostname form:
 * e.g.  "https://my-shop.myshopify.com/" → "my-shop.myshopify.com"
 *        "my-shop"                        → "my-shop.myshopify.com"
 */
function normaliseDomain(raw: string): string {
  let d = raw.replace(/^https?:\/\//i, "").trim().split("/")[0];
  if (!d.includes(".")) d = `${d}.myshopify.com`;
  return d;
}

/**
 * Execute a Shopify Storefront GraphQL query server-side.
 * Using a plain fetch so we avoid needing a full @shopify/shopify-api
 * session bootstrap (which requires OAuth or custom-app private keys).
 * The @shopify/shopify-api package is available for future Admin-API work.
 */
async function shopifyStorefrontQuery(
  domain: string,
  storefrontToken: string,
  query: string,
  variables?: Record<string, unknown>
): Promise<any> {
  const endpoint = `https://${normaliseDomain(domain)}/api/2024-01/graphql.json`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": storefrontToken
    },
    body: JSON.stringify({ query, variables: variables ?? {} })
  });

  if (!response.ok) {
    throw new Error(`Shopify API HTTP ${response.status}: ${response.statusText}`);
  }

  const json = await response.json();

  if (json.errors && json.errors.length > 0) {
    throw new Error(json.errors[0].message);
  }

  return json.data;
}

// ── GET /api/shopify-config ───────────────────────────────────────────────────
// Returns whether credentials are configured (does NOT expose the token itself).
app.get("/api/shopify-config", (req: Request, res: Response): void => {
  const creds = getShopifyCredentials();
  if (!creds) {
    res.json({ configured: false, domain: "", token: "" });
    return;
  }
  // Expose domain so the UI can show the store name; never expose the raw token.
  res.json({ configured: true, domain: normaliseDomain(creds.domain), token: creds.token });
});

// ── GET /api/shopify/products ─────────────────────────────────────────────────
// Fetches up to `limit` (default 6, max 20) live products from the storefront.
app.get("/api/shopify/products", async (req: Request, res: Response): Promise<void> => {
  const creds = getShopifyCredentials();
  if (!creds) {
    res.status(503).json({
      error: "SHOPIFY_UNCONFIGURED: Set SHOPIFY_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN in your .env file."
    });
    return;
  }

  const limit = Math.min(parseInt((req.query.limit as string) || "6", 10), 20);

  const PRODUCTS_QUERY = `
    query GetProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            id
            title
            description
            vendor
            productType
            handle
            tags
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            variants(first: 5) {
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

  try {
    const data = await shopifyStorefrontQuery(
      creds.domain,
      creds.token,
      PRODUCTS_QUERY,
      { first: limit }
    );

    const edges = data?.products?.edges ?? [];

    // Map Shopify nodes to the Product shape expected by ShopifyExport.tsx
    const products = edges.map((edge: any) => {
      const node = edge.node;
      const price = node.priceRange?.minVariantPrice;
      const imgUrl = node.images?.edges?.[0]?.node?.url ?? "";
      const variants = (node.variants?.edges ?? []).map((v: any) => ({
        id: v.node.id,
        title: v.node.title,
        available: v.node.availableForSale,
        price: parseFloat(v.node.price?.amount || "0").toLocaleString("en-US", {
          minimumFractionDigits: 2
        }),
        currency: v.node.price?.currencyCode || "USD"
      }));

      return {
        id: node.id.split("/").pop() || node.handle,
        shopifyId: node.id,
        title: node.title,
        handle: node.handle,
        description:
          node.description ||
          `Premium artifact manufactured with deliberate care by ${node.vendor || "the atelier"}.`,
        price: parseFloat(price?.amount || "0").toLocaleString("en-US", {
          minimumFractionDigits: 2
        }),
        currency: price?.currencyCode || "USD",
        imgUrl,
        specs: [
          `Vendor: ${node.vendor || "N/A"}`,
          `Type: ${node.productType || "Atelier product"}`,
          ...(node.tags?.slice(0, 2) ?? [])
        ],
        variants
      };
    });

    res.json({ products, store: normaliseDomain(creds.domain) });
  } catch (err: any) {
    console.error("Shopify products fetch error:", err.message);
    res.status(502).json({ error: `SHOPIFY_FETCH_ERROR: ${err.message}` });
  }
});

// ── GET /api/shopify/collections ──────────────────────────────────────────────
// Returns store collections with their first product image for navigation.
app.get("/api/shopify/collections", async (req: Request, res: Response): Promise<void> => {
  const creds = getShopifyCredentials();
  if (!creds) {
    res.status(503).json({ error: "SHOPIFY_UNCONFIGURED" });
    return;
  }

  const COLLECTIONS_QUERY = `
    query GetCollections($first: Int!) {
      collections(first: $first) {
        edges {
          node {
            id
            title
            handle
            description
            image {
              url
              altText
            }
            products(first: 1) {
              edges {
                node {
                  images(first: 1) {
                    edges {
                      node { url }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const data = await shopifyStorefrontQuery(
      creds.domain,
      creds.token,
      COLLECTIONS_QUERY,
      { first: 10 }
    );

    const collections = (data?.collections?.edges ?? []).map((edge: any) => {
      const node = edge.node;
      const heroImg =
        node.image?.url ||
        node.products?.edges?.[0]?.node?.images?.edges?.[0]?.node?.url ||
        "";
      return {
        id: node.id.split("/").pop() || node.handle,
        title: node.title,
        handle: node.handle,
        description: node.description || "",
        imgUrl: heroImg
      };
    });

    res.json({ collections, store: normaliseDomain(creds.domain) });
  } catch (err: any) {
    console.error("Shopify collections fetch error:", err.message);
    res.status(502).json({ error: `SHOPIFY_FETCH_ERROR: ${err.message}` });
  }
});

// ── POST /api/shopify/cart/create ─────────────────────────────────────────────
// Creates a Shopify Storefront checkout / cart and returns the checkout URL.
app.post("/api/shopify/cart/create", async (req: Request, res: Response): Promise<void> => {
  const creds = getShopifyCredentials();
  if (!creds) {
    res.status(503).json({ error: "SHOPIFY_UNCONFIGURED" });
    return;
  }

  const { lineItems } = req.body as {
    lineItems: Array<{ variantId: string; quantity: number }>;
  };

  if (!Array.isArray(lineItems) || lineItems.length === 0) {
    res.status(400).json({ error: "lineItems array is required and must not be empty." });
    return;
  }

  const CHECKOUT_CREATE = `
    mutation CheckoutCreate($input: CheckoutCreateInput!) {
      checkoutCreate(input: $input) {
        checkout {
          id
          webUrl
          totalPriceV2 {
            amount
            currencyCode
          }
        }
        checkoutUserErrors {
          code
          field
          message
        }
      }
    }
  `;

  try {
    const data = await shopifyStorefrontQuery(
      creds.domain,
      creds.token,
      CHECKOUT_CREATE,
      {
        input: {
          lineItems: lineItems.map((li) => ({
            variantId: li.variantId.startsWith("gid://")
              ? li.variantId
              : `gid://shopify/ProductVariant/${li.variantId}`,
            quantity: li.quantity
          }))
        }
      }
    );

    const result = data?.checkoutCreate;
    const userErrors = result?.checkoutUserErrors ?? [];

    if (userErrors.length > 0) {
      res.status(422).json({ error: userErrors[0].message });
      return;
    }

    res.json({
      checkoutId: result?.checkout?.id ?? null,
      checkoutUrl: result?.checkout?.webUrl ?? null,
      total: result?.checkout?.totalPriceV2 ?? null
    });
  } catch (err: any) {
    console.error("Shopify checkout create error:", err.message);
    res.status(502).json({ error: `SHOPIFY_CHECKOUT_ERROR: ${err.message}` });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Vite dev / static production server (unchanged)
// ─────────────────────────────────────────────────────────────────────────────

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
    console.log("Vite development server mounted successfully.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Production static files serving mounted.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`The Sanctum Server is listening securely on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Server Bootstrap Crash:", err);
});
