import { z } from "zod";
import { contact, contactLimits } from "@/content/contact";

/**
 * Enquiry form schema. The rules are here; every message a visitor can read
 * is in `src/content/contact.ts` (`contact.form.errors`), and the length
 * limits are shared through `contactLimits` so the two cannot disagree.
 */
const { errors } = contact.form;

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(contactLimits.nameMin, errors.nameTooShort)
    .max(contactLimits.nameMax, errors.nameTooLong),
  phone: z
    .string()
    .min(contactLimits.phoneMin, errors.phoneInvalid)
    .max(contactLimits.phoneMax, errors.phoneInvalid)
    .regex(/^[0-9+\-\s()]+$/, errors.phoneInvalid),
  eventDate: z.string().optional(),
  message: z
    .string()
    .min(contactLimits.messageMin, errors.messageTooShort)
    .max(contactLimits.messageMax, errors.messageTooLong),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
