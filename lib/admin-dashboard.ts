import { getCollections, getProducts } from "lib/shopify";
import { getSiteDesignSettings } from "lib/site-design";

type IntegrationStatus = "connected" | "missing" | "error";

export type AdminDashboardProduct = {
  title: string;
  handle: string;
  availableForSale: boolean;
  price: string;
  imageUrl?: string;
  updatedAt: string;
};

export type AdminDashboardSummary = {
  storefront: {
    shopifyDomain: string;
    shopifyStatus: IntegrationStatus;
    shopifyMessage: string;
    blobStatus: IntegrationStatus;
    blobMessage: string;
  };
  metrics: {
    products: number;
    activeProducts: number;
    collections: number;
    homepageSections: number;
  };
  design: {
    brandName: string;
    accentColor: string;
    updatedAt: string;
  };
  products: AdminDashboardProduct[];
};

function formatMoney(amount: string, currencyCode: string) {
  const value = Number(amount);

  if (!Number.isFinite(value)) {
    return `${amount} ${currencyCode}`;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(value);
}

function getShopifyConfigStatus(): Pick<
  AdminDashboardSummary["storefront"],
  "shopifyDomain" | "shopifyStatus" | "shopifyMessage"
> {
  const shopifyDomain = process.env.SHOPIFY_STORE_DOMAIN || "";
  const hasToken = Boolean(process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN);

  if (!shopifyDomain || !hasToken) {
    return {
      shopifyDomain: shopifyDomain || "Not configured",
      shopifyStatus: "missing",
      shopifyMessage: "Add Shopify domain and Storefront API token.",
    };
  }

  return {
    shopifyDomain,
    shopifyStatus: "connected",
    shopifyMessage: "Storefront API credentials are configured.",
  };
}

export async function getAdminDashboardSummary(): Promise<AdminDashboardSummary> {
  const shopifyConfig = getShopifyConfigStatus();
  const design = await getSiteDesignSettings();
  const [productsResult, collectionsResult] = await Promise.allSettled([
    shopifyConfig.shopifyStatus === "connected"
      ? getProducts({ sortKey: "CREATED_AT", reverse: true })
      : Promise.resolve([]),
    getCollections(),
  ]);

  const products =
    productsResult.status === "fulfilled" ? productsResult.value : [];
  const collections =
    collectionsResult.status === "fulfilled" ? collectionsResult.value : [];
  const shopifyStatus =
    productsResult.status === "rejected"
      ? "error"
      : shopifyConfig.shopifyStatus;

  return {
    storefront: {
      ...shopifyConfig,
      shopifyStatus,
      shopifyMessage:
        productsResult.status === "rejected"
          ? "Shopify credentials are present, but the Storefront API request failed."
          : shopifyConfig.shopifyMessage,
      blobStatus: process.env.BLOB_READ_WRITE_TOKEN ? "connected" : "missing",
      blobMessage: process.env.BLOB_READ_WRITE_TOKEN
        ? "Design settings publish to Vercel Blob."
        : "Design settings publish to local .data during development.",
    },
    metrics: {
      products: products.length,
      activeProducts: products.filter((product) => product.availableForSale)
        .length,
      collections: Math.max(collections.length - 1, 0),
      homepageSections: design.homepageSectionOrder.length,
    },
    design: {
      brandName: design.brandName,
      accentColor: design.accentColor,
      updatedAt: design.updatedAt,
    },
    products: products.slice(0, 5).map((product) => ({
      title: product.title,
      handle: product.handle,
      availableForSale: product.availableForSale,
      price: formatMoney(
        product.priceRange.minVariantPrice.amount,
        product.priceRange.minVariantPrice.currencyCode,
      ),
      imageUrl: product.featuredImage?.url,
      updatedAt: product.updatedAt,
    })),
  };
}
