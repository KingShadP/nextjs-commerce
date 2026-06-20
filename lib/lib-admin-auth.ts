import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const cookieName = "kshadp-admin";
const sessionDurationSeconds = 60 * 60 * 12;

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSCODE || "";
}

function sign(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("hex");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
}

export function verifyAdminPasscode(passcode: string) {
  const expected = process.env.ADMIN_PASSCODE || "";
  return Boolean(expected && safeEqual(passcode, expected));
}

export function verifyAdminApiToken(authorization: string | null) {
  const expected = process.env.ADMIN_API_TOKEN || "";
  const token = authorization?.match(/^Bearer\s+(.+)$/i)?.[1]?.trim() || "";

  return Boolean(expected && token && safeEqual(token, expected));
}

export async function createAdminSession() {
  const expires = Math.floor(Date.now() / 1000) + sessionDurationSeconds;
  const payload = `admin.${expires}`;
  const value = `${payload}.${sign(payload)}`;
  const store = await cookies();

  store.set(cookieName, value, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: sessionDurationSeconds,
    path: "/",
  });
}

export async function destroyAdminSession() {
  (await cookies()).delete(cookieName);
}

export async function isAdminAuthenticated() {
  const value = (await cookies()).get(cookieName)?.value;
  if (!value || !getSecret()) return false;

  const parts = value.split(".");
  if (parts.length !== 3) return false;

  const [role, expiresValue, signature] = parts;
  const payload = `${role}.${expiresValue}`;
  const expires = Number(expiresValue);

  return (
    role === "admin" &&
    Number.isFinite(expires) &&
    expires > Math.floor(Date.now() / 1000) &&
    safeEqual(signature || "", sign(payload))
  );
}
