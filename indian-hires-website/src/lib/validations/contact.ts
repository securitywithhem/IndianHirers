import { z } from "zod";
import { contact, contactLimits } from "@/content/contact";

/**
 * Enquiry form schema. The rules are here; every message a visitor can read
 * is in `src/content/contact.ts` (`contact.form.errors`), and the length
 * limits are shared through `contactLimits` so the two cannot disagree.
 */
const { errors } = contact.form;

/** Spaces, dashes, dots and brackets people type between the digits. */
const PHONE_SEPARATORS = /[\s\-.()]/g;

/**
 * An Indian mobile number: ten digits starting 6–9, optionally after +91, 91
 * or a trunk 0. "87340 90908", "+91 87340-90908" and "087340 90908" pass.
 */
const INDIAN_MOBILE = /^(?:\+?91|0)?[6-9]\d{9}$/;

export function isIndianMobile(value: string): boolean {
  return INDIAN_MOBILE.test(value.replace(PHONE_SEPARATORS, ""));
}

export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(contactLimits.nameMin, errors.nameTooShort)
    .max(contactLimits.nameMax, errors.nameTooLong),
  phone: z.string().refine(isIndianMobile, errors.phoneInvalid),
  eventDate: z.string().optional(),
  message: z
    .string()
    .trim()
    .min(contactLimits.messageMin, errors.messageTooShort)
    .max(contactLimits.messageMax, errors.messageTooLong),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
