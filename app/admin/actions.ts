"use server";

import {
  createAdminSession,
  destroyAdminSession,
  isAdminAuthenticated,
  verifyAdminPasscode,
} from "lib/admin-auth";
import {
  defaultSiteDesign,
  normalizeHomepageSectionOrder,
  normalizeMediaLibrary,
  normalizePageCreatives,
  normalizeProductCreatives,
  saveSiteDesignSettings,
  type SiteDesignSettings,
} from "lib/site-design";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const colorPattern = /^#[0-9a-f]{6}$/i;

function text(formData: FormData, key: string, fallback: string) {
  const value = formData.get(key)?.toString().trim();
  return value || fallback;
}

function number(
  formData: FormData,
  key: string,
  fallback: number,
  min: number,
  max: number,
) {
  const value = Number(formData.get(key));
  return Number.isFinite(value)
    ? Math.min(max, Math.max(min, value))
    : fallback;
}

function color(formData: FormData, key: string, fallback: string) {
  const value = formData.get(key)?.toString() || "";
  return colorPattern.test(value) ? value.toUpperCase() : fallback;
}

function imageUrl(formData: FormData, key: string, fallback: string) {
  const value = formData.get(key)?.toString().trim() || "";
  return value.startsWith("/") || value.startsWith("https://")
    ? value
    : fallback;
}

function sectionOrder(formData: FormData) {
  const values = formData
    .get("homepageSectionOrder")
    ?.toString()
    .split(",")
    .map((value) => value.trim());
  return normalizeHomepageSectionOrder(values);
}

function mediaLibrary(formData: FormData) {
  return normalizeMediaLibrary(
    defaultSiteDesign.mediaLibrary.map((asset, index) => ({
      id: text(formData, `media${index}Id`, asset.id),
      label: text(formData, `media${index}Label`, asset.label),
      url: imageUrl(formData, `media${index}Url`, asset.url),
      alt: text(formData, `media${index}Alt`, asset.alt),
      kind:
        formData.get(`media${index}Kind`)?.toString() === "video"
          ? "video"
          : "image",
    })),
  );
}

function pageCreatives(formData: FormData) {
  return normalizePageCreatives(
    defaultSiteDesign.pageCreatives.map((page, index) => ({
      handle: text(formData, `page${index}Handle`, page.handle),
      eyebrow: text(formData, `page${index}Eyebrow`, page.eyebrow),
      title: text(formData, `page${index}Title`, page.title),
      heroImage: imageUrl(formData, `page${index}HeroImage`, page.heroImage),
      intro: text(formData, `page${index}Intro`, page.intro),
      ctaText: text(formData, `page${index}CtaText`, page.ctaText),
      ctaHref: imageUrl(formData, `page${index}CtaHref`, page.ctaHref),
    })),
  );
}

function productCreatives(formData: FormData) {
  return normalizeProductCreatives(
    defaultSiteDesign.productCreatives.map((product, index) => ({
      handle: text(formData, `product${index}Handle`, product.handle),
      badge: text(formData, `product${index}Badge`, product.badge),
      heroImage: imageUrl(
        formData,
        `product${index}HeroImage`,
        product.heroImage,
      ),
      hoverImage: imageUrl(
        formData,
        `product${index}HoverImage`,
        product.hoverImage || product.heroImage,
      ),
      galleryImages: text(
        formData,
        `product${index}GalleryImages`,
        product.galleryImages.join(","),
      )
        .split(",")
        .map((url) => url.trim()),
      detailNote: text(
        formData,
        `product${index}DetailNote`,
        product.detailNote,
      ),
    })),
  );
}

export async function loginAdmin(formData: FormData) {
  const passcode = formData.get("passcode")?.toString() || "";

  if (!verifyAdminPasscode(passcode)) {
    redirect("/admin/login?error=invalid");
  }

  await createAdminSession();
  redirect("/admin/design");
}

export async function logoutAdmin() {
  await destroyAdminSession();
  redirect("/admin/login");
}

export type SaveDesignState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function saveDesign(
  _previousState: SaveDesignState,
  formData: FormData,
): Promise<SaveDesignState> {
  if (!(await isAdminAuthenticated())) {
    return { status: "error", message: "Your admin session expired." };
  }

  const settings: SiteDesignSettings = {
    brandName: text(formData, "brandName", defaultSiteDesign.brandName),
    brandDescriptor: text(
      formData,
      "brandDescriptor",
      defaultSiteDesign.brandDescriptor,
    ),
    logoUrl: imageUrl(formData, "logoUrl", defaultSiteDesign.logoUrl),
    showHeaderLogo: formData.get("showHeaderLogo") === "on",
    announcement: text(
      formData,
      "announcement",
      defaultSiteDesign.announcement,
    ),
    accentColor: color(formData, "accentColor", defaultSiteDesign.accentColor),
    backgroundColor: color(
      formData,
      "backgroundColor",
      defaultSiteDesign.backgroundColor,
    ),
    foregroundColor: color(
      formData,
      "foregroundColor",
      defaultSiteDesign.foregroundColor,
    ),
    heroImageOpacity: number(
      formData,
      "heroImageOpacity",
      defaultSiteDesign.heroImageOpacity,
      0,
      0.8,
    ),
    overlayStrength: number(
      formData,
      "overlayStrength",
      defaultSiteDesign.overlayStrength,
      0.25,
      0.95,
    ),
    motionIntensity: number(
      formData,
      "motionIntensity",
      defaultSiteDesign.motionIntensity,
      0,
      1.5,
    ),
    fogEnabled: formData.get("fogEnabled") === "on",
    lightSweepEnabled: formData.get("lightSweepEnabled") === "on",
    floorReflectionEnabled: formData.get("floorReflectionEnabled") === "on",
    grainEnabled: formData.get("grainEnabled") === "on",
    roomImages: [
      imageUrl(formData, "roomImage0", defaultSiteDesign.roomImages[0]),
      imageUrl(formData, "roomImage1", defaultSiteDesign.roomImages[1]),
      imageUrl(formData, "roomImage2", defaultSiteDesign.roomImages[2]),
    ],
    heroSlides: defaultSiteDesign.heroSlides.map((slide, index) => ({
      imgSrc: imageUrl(formData, `heroSlide${index}Image`, slide.imgSrc),
      subtitle: text(formData, `heroSlide${index}Subtitle`, slide.subtitle),
      title: text(formData, `heroSlide${index}Title`, slide.title),
      primaryBtnText: text(
        formData,
        `heroSlide${index}ButtonText`,
        slide.primaryBtnText,
      ),
      primaryBtnHref: imageUrl(
        formData,
        `heroSlide${index}ButtonHref`,
        slide.primaryBtnHref,
      ),
    })),
    mediaLibrary: mediaLibrary(formData),
    pageCreatives: pageCreatives(formData),
    productCreatives: productCreatives(formData),
    homepageSectionOrder: sectionOrder(formData),
    updatedAt: new Date().toISOString(),
  };

  try {
    await saveSiteDesignSettings(settings);
    revalidatePath("/", "layout");
    return { status: "success", message: "Storefront design published." };
  } catch (error) {
    console.error("Unable to save site design", error);
    return {
      status: "error",
      message:
        "Design could not be saved. Check the configured storage connection.",
    };
  }
}
