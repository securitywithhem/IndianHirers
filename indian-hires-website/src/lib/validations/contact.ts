import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(2, "Please enter your full name.").max(80),
  phone: z
    .string()
    .min(10, "Enter a valid phone number.")
    .max(15, "Enter a valid phone number.")
    .regex(/^[0-9+\-\s()]+$/, "Enter a valid phone number."),
  eventDate: z.string().optional(),
  message: z
    .string()
    .min(10, "Please tell us a bit more about your event (min 10 characters).")
    .max(1000, "Message is too long."),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
