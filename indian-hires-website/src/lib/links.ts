import { env } from "@/lib/env";

/**
 * URL assembly for the three ways a visitor reaches the business.
 *
 * Message text comes from the builders in `src/content/site.ts` (plain
 * strings); this file only turns a string into a link. Nothing here contains
 * copy.
 */

/** Internal route used when a contact detail is not configured. */
const CONTACT_ROUTE = "/contact";

/**
 * WhatsApp click-to-chat link with a prefilled message.
 * Falls back to the contact page if no WhatsApp number is configured, so the
 * link is never dead.
 */
export function whatsappUrl(message: string): string {
  if (!env.whatsapp) return CONTACT_ROUTE;
  return `https://wa.me/${env.whatsapp}?text=${encodeURIComponent(message)}`;
}

/** `tel:` link. Defaults to the primary phone. Spaces and dashes are stripped. */
export function telUrl(phone: string = env.phone): string {
  const dialable = phone.replace(/[^\d+]/g, "");
  if (!dialable) return CONTACT_ROUTE;
  return `tel:${dialable}`;
}

/** `mailto:` link. Defaults to the business email; subject is optional. */
export function mailtoUrl(email: string = env.email, subject?: string): string {
  if (!email) return CONTACT_ROUTE;
  return subject
    ? `mailto:${email}?subject=${encodeURIComponent(subject)}`
    : `mailto:${email}`;
}

/** Google Maps search link for a free-text place query (no API key needed). */
export function mapSearchUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/**
 * Display form of an Indian phone number taken from env:
 * `+91XXXXXXXXXX` → `+91 XXXXX XXXXX`; a bare 10-digit number → `XXXXX XXXXX`.
 * Anything else is returned unchanged. Returns "" for an empty value.
 */
export function formatPhone(phone: string = env.phone): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  return phone.trim();
}

/** Absolute URL for a site path, or the path itself when no site URL is set. */
export function absoluteUrl(path: string): string {
  return env.siteUrl ? `${env.siteUrl}${path}` : path;
}
