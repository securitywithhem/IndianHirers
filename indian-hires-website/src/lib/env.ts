/**
 * The only place the app reads `process.env`. Components and content files
 * import `env`; they never touch `process.env` themselves.
 *
 * Every fallback is the empty string. A missing variable must show up as a
 * missing value, never as a plausible-looking wrong phone number or address.
 *
 * Each `process.env.NEXT_PUBLIC_*` is written out in full because Next.js
 * inlines them by static text replacement at build time.
 */
export interface Env {
  /** Web3Forms access key for the enquiry form. Empty → form shows the visitor-safe fallback. */
  web3FormsKey: string;
  /** Primary phone, international format, e.g. +91XXXXXXXXXX. */
  phone: string;
  /** Second phone, international format. */
  phoneAlt: string;
  /** WhatsApp number, digits only with country code (wa.me format). */
  whatsapp: string;
  email: string;
  /** Google Maps embed URL for the contact page iframe. */
  mapEmbedUrl: string;
  /** Canonical origin, no trailing slash, e.g. https://example.com. */
  siteUrl: string;
}

export const env: Env = {
  web3FormsKey: process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "",
  phone: process.env.NEXT_PUBLIC_PHONE || "",
  phoneAlt: process.env.NEXT_PUBLIC_PHONE_ALT || "",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || "",
  email: process.env.NEXT_PUBLIC_EMAIL || "",
  mapEmbedUrl: process.env.NEXT_PUBLIC_MAP_EMBED_URL || "",
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/+$/, ""),
};

// Development only. Nothing is logged in production builds.
if (process.env.NODE_ENV === "development") {
  const missingKeys: string[] = [];

  if (!env.web3FormsKey) missingKeys.push("NEXT_PUBLIC_WEB3FORMS_KEY");
  if (!env.phone) missingKeys.push("NEXT_PUBLIC_PHONE");
  if (!env.phoneAlt) missingKeys.push("NEXT_PUBLIC_PHONE_ALT");
  if (!env.whatsapp) missingKeys.push("NEXT_PUBLIC_WHATSAPP");
  if (!env.email) missingKeys.push("NEXT_PUBLIC_EMAIL");
  if (!env.mapEmbedUrl) missingKeys.push("NEXT_PUBLIC_MAP_EMBED_URL");
  if (!env.siteUrl) missingKeys.push("NEXT_PUBLIC_SITE_URL");

  if (missingKeys.length > 0) {
    console.warn(
      `Missing environment variables: ${missingKeys.join(", ")}. Check .env.local (see .env.example).`
    );
  }
}
