"use client";

import dynamic from "next/dynamic";
import type { ContactFormProps } from "./ContactForm";

/*
 * The form's JavaScript (react-hook-form, zod, the schema and its messages) is
 * its own chunk: the fields are in the server HTML, so nothing shifts, and they
 * become interactive when the chunk arrives instead of holding up the rest of
 * the page. `dynamic` must be called from a client module to split a client
 * component, hence this file.
 */
const ContactForm = dynamic(() => import("./ContactForm").then((module) => module.ContactForm));

export function ContactFormLazy(props: ContactFormProps) {
  return <ContactForm {...props} />;
}
