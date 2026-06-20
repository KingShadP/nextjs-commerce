import { isAdminAuthenticated, verifyAdminApiToken } from "lib/admin-auth";
import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

const allowedTypes = new Set([
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/webm",
]);

function slug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const hasToken = verifyAdminApiToken(req.headers.get("authorization"));
  const hasSession = await isAdminAuthenticated();

  if (!hasToken && !hasSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "BLOB_READ_WRITE_TOKEN is not configured." },
      { status: 503 },
    );
  }

  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file." }, { status: 400 });
  }

  if (!allowedTypes.has(file.type)) {
    return NextResponse.json(
      { error: "Only image and web video uploads are supported." },
      { status: 415 },
    );
  }

  const scope = slug(formData.get("scope")?.toString() || "media");
  const filename = slug(file.name || "upload");
  const pathname = `admin/${scope}/${Date.now()}-${filename}`;
  const blob = await put(pathname, file, {
    access: "public",
    contentType: file.type,
  });

  return NextResponse.json({
    url: blob.url,
    pathname: blob.pathname,
    contentType: blob.contentType,
  });
}
