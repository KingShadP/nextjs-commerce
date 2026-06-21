export type HeroSlideSettings = {
  imgSrc: string;
  subtitle: string;
  title: string;
  primaryBtnText: string;
  primaryBtnHref: string;
};

export type MediaAssetSettings = {
  id: string;
  label: string;
  url: string;
  alt: string;
  kind: "image" | "video";
};

export type PageCreativeSettings = {
  handle: string;
  eyebrow: string;
  title: string;
  heroImage: string;
  intro: string;
  ctaText: string;
  ctaHref: string;
};

export type ProductCreativeSettings = {
  handle: string;
  badge: string;
  heroImage: string;
  hoverImage: string;
  galleryImages: string[];
  detailNote: string;
};

export type HomepageSectionKey =
  | "ticker"
  | "features"
  | "lookbook"
  | "featured"
  | "newsletter"
  | "ethos";

export type SiteDesignSettings = {
  brandName: string;
  brandDescriptor: string;
  logoUrl: string;
  showHeaderLogo: boolean;
  announcement: string;
  accentColor: string;
  backgroundColor: string;
  foregroundColor: string;
  heroImageOpacity: number;
  overlayStrength: number;
  motionIntensity: number;
  fogEnabled: boolean;
  lightSweepEnabled: boolean;
  floorReflectionEnabled: boolean;
  grainEnabled: boolean;
  roomImages: [string, string, string];
  heroSlides: HeroSlideSettings[];
  mediaLibrary: MediaAssetSettings[];
  pageCreatives: PageCreativeSettings[];
  productCreatives: ProductCreativeSettings[];
  homepageSectionOrder: HomepageSectionKey[];
  updatedAt: string;
};

// Labels shown inside the admin design studio for each homepage section.
export const homepageSectionLabels: Record<HomepageSectionKey, string> = {
  ticker: "Marquee ticker",
  features: "Features grid",
  lookbook: "Lookbook section",
  featured: "Featured collection",
  newsletter: "Newsletter signup",
  ethos: "Brand philosophy",
};

export const defaultHomepageSectionOrder: HomepageSectionKey[] = [
  "ticker",
  "features",
  "lookbook",
  "featured",
  "newsletter",
  "ethos",
];

export const defaultHeroSlides: HeroSlideSettings[] = [
  {
    imgSrc: "/slide-dragon-1.jpg",
    subtitle: "The Dragon Series | Limited Edition",
    title: "MEDITERRANEAN ORANGE COTTON FLEECE.",
    primaryBtnText: "Shop Orange",
    primaryBtnHref: "/search?q=orange",
  },
  {
    imgSrc: "/slide-dragon-2.jpg",
    subtitle: "The Dragon Series | Limited Edition",
    title: "OBSIDIAN BLACK POST-ACTIVE KNIT.",
    primaryBtnText: "Shop Obsidian",
    primaryBtnHref: "/search?q=black",
  },
  {
    imgSrc: "/slide-dragon-3.jpg",
    subtitle: "The Dragon Series | Limited Edition",
    title: "CREAM ALABASTER HEAVYWEIGHT SWEATER.",
    primaryBtnText: "Shop Alabaster",
    primaryBtnHref: "/search?q=cream",
  },
  {
    imgSrc: "/slide-dragon-4.jpg",
    subtitle: "The Dragon Series | Limited Edition",
    title: "CORAL PINK CONTUSION SWEATSHIRT.",
    primaryBtnText: "Shop Coral",
    primaryBtnHref: "/search?q=coral",
  },
  {
    imgSrc: "/slide-dragon-5.jpg",
    subtitle: "The Dragon Series | Limited Edition",
    title: "PASTEL SUNLIGHT HEAVY COTTON CREW.",
    primaryBtnText: "Shop Sunlight",
    primaryBtnHref: "/search?q=yellow",
  },
];

export const defaultMediaLibrary: MediaAssetSettings[] = [
  {
    id: "campaign-dragon",
    label: "Dragon campaign still",
    url: "/slide-dragon-1.jpg",
    alt: "Dragon campaign product atmosphere",
    kind: "image",
  },
  {
    id: "room-1",
    label: "Room image 1",
    url: "/cinematic_room_1.jpg",
    alt: "Dark architectural room",
    kind: "image",
  },
  {
    id: "product-study",
    label: "Product study",
    url: "/slide-dragon-3.jpg",
    alt: "Product campaign study",
    kind: "image",
  },
];

export const defaultPageCreatives: PageCreativeSettings[] = [
  {
    handle: "about",
    eyebrow: "Our story",
    title: "About KSHADP",
    heroImage: "/cinematic_room_2.jpg",
    intro:
      "Premium shapewear, underwear, and loungewear for men — engineered for support and everyday comfort.",
    ctaText: "Shop collection",
    ctaHref: "/search",
  },
  {
    handle: "contact",
    eyebrow: "Get in touch",
    title: "Contact Us",
    heroImage: "/cinematic_room_3.jpg",
    intro:
      "Questions about an order, sizing, or returns? We're here to help.",
    ctaText: "Shop all",
    ctaHref: "/search",
  },
];

export const defaultProductCreatives: ProductCreativeSettings[] = [
  {
    handle: "dragon-anatomy-t-shirt-vintage-scientific-illustration-tee",
    badge: "Dragon edit",
    heroImage: "/slide-dragon-1.jpg",
    hoverImage: "/slide-dragon-2.jpg",
    galleryImages: ["/slide-dragon-1.jpg", "/slide-dragon-2.jpg"],
    detailNote:
      "Custom creative direction controlled from the admin console.",
  },
  {
    handle: "embroidered-chest-dragon-hoodie-minimal-crest-fleece-pullover",
    badge: "Crest study",
    heroImage: "/slide-dragon-4.jpg",
    hoverImage: "/slide-dragon-5.jpg",
    galleryImages: ["/slide-dragon-4.jpg", "/slide-dragon-5.jpg"],
    detailNote:
      "Use product handles to override PDP and catalog imagery.",
  },
];

export function normalizeHomepageSectionOrder(
  input?: string[] | HomepageSectionKey[],
): HomepageSectionKey[] {
  const allowed = new Set(defaultHomepageSectionOrder);
  const ordered = (input || []).filter(
    (key): key is HomepageSectionKey =>
      typeof key === "string" && allowed.has(key as HomepageSectionKey),
  );
  return [
    ...ordered,
    ...defaultHomepageSectionOrder.filter((key) => !ordered.includes(key)),
  ];
}

export function normalizeMediaLibrary(
  input?: Partial<MediaAssetSettings>[],
): MediaAssetSettings[] {
  const assets = input?.length ? input : defaultMediaLibrary;
  return assets
    .slice(0, 12)
    .map(
      (asset, index): MediaAssetSettings => ({
        id: asset.id || `media-${index + 1}`,
        label: asset.label || `Media ${index + 1}`,
        url:
          asset.url ||
          defaultMediaLibrary[index % defaultMediaLibrary.length]!.url,
        alt: asset.alt || asset.label || `Media ${index + 1}`,
        kind: asset.kind === "video" ? "video" : "image",
      }),
    )
    .filter((asset) => asset.url);
}

export function normalizePageCreatives(
  input?: Partial<PageCreativeSettings>[],
): PageCreativeSettings[] {
  const pages = input?.length ? input : defaultPageCreatives;
  return pages
    .slice(0, 10)
    .map((page, index) => ({
      handle:
        page.handle ||
        defaultPageCreatives[index % defaultPageCreatives.length]!.handle,
      eyebrow: page.eyebrow || "Page",
      title: page.title || "About KSHADP",
      heroImage:
        page.heroImage ||
        defaultPageCreatives[index % defaultPageCreatives.length]!.heroImage,
      intro: page.intro || "",
      ctaText: page.ctaText || "Explore",
      ctaHref: page.ctaHref || "/search",
    }))
    .filter((page) => page.handle);
}

export function normalizeProductCreatives(
  input?: Partial<ProductCreativeSettings>[],
): ProductCreativeSettings[] {
  const products = input?.length ? input : defaultProductCreatives;
  return products
    .slice(0, 16)
    .map((product, index) => ({
      handle:
        product.handle ||
        defaultProductCreatives[index % defaultProductCreatives.length]!
          .handle,
      badge: product.badge || "New",
      heroImage:
        product.heroImage ||
        defaultProductCreatives[index % defaultProductCreatives.length]!
          .heroImage,
      hoverImage: product.hoverImage || product.heroImage || "",
      galleryImages: (product.galleryImages || [])
        .map((url) => url.trim())
        .filter(Boolean)
        .slice(0, 6),
      detailNote: product.detailNote || "",
    }))
    .filter((product) => product.handle);
}
