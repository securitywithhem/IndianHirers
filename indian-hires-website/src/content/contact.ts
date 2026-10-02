/**
 * Contact page (`/contact`) content: heading, the contact details panel, the
 * map, and everything the enquiry form says — labels, placeholders, helper
 * text, validation errors and toasts.
 *
 * Phone numbers, WhatsApp, email and the map embed URL are NOT here. They come
 * from env vars (`src/lib/env.ts`); build links with `src/lib/links.ts`. This
 * file has no fallback numbers or addresses of its own — the address is the
 * single brand definition in site.ts.
 */
import { env } from "@/lib/env";
import { brand, whatsappMessages } from "./site";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ContactLabel {
  label: string;
}

export interface ContactDetails {
  /** Primary phone — value and href from env.phone. */
  phone: ContactLabel;
  /** Second phone — value and href from env.phoneAlt. */
  phoneAlt: ContactLabel;
  /** WhatsApp — href from `whatsappUrl(message)`; `action` is the link text. */
  whatsapp: ContactLabel & { action: string; message: string };
  /** Email — value and href from env.email. */
  email: ContactLabel;
  address: ContactLabel & { lines: string[] };
  /** Carried over from the previous site — owner to confirm it is still current. */
  hours: ContactLabel & { value: string };
  /** Carried over from the previous site — owner to confirm it is still current. */
  serviceAreas: ContactLabel & { value: string };
}

export interface ContactMap {
  /** title attribute of the map iframe. */
  title: string;
  /** Link text shown under the map, and on its own when no embed URL is set. */
  openLabel: string;
  /** Free-text place query for `mapSearchUrl(query)`. */
  query: string;
}

export interface FormField {
  label: string;
  placeholder: string;
  required: boolean;
  /** Helper text under the field; null when there is none. */
  helper: string | null;
}

export interface FormToast {
  title: string;
  description: string;
}

export interface ContactFormErrors {
  nameTooShort: string;
  nameTooLong: string;
  phoneInvalid: string;
  messageTooShort: string;
  messageTooLong: string;
}

/** Shown in place of the form when it cannot send (`hasEnquiryForm` is false). */
export interface FormUnavailable {
  heading: string;
  /** One sentence. WhatsApp and call buttons follow it. */
  body: string;
}

export interface ContactFormContent {
  heading: string;
  lead: string;
  /**
   * The panel shown INSTEAD of the form — heading, lead and fields are not
   * rendered at all — while `hasEnquiryForm` is false.
   */
  unavailable: FormUnavailable;
  /** Visible marker after a required field's label. */
  requiredMark: string;
  /** Screen-reader text that goes with the marker. */
  requiredNote: string;
  /** Appended to an optional field's label. */
  optionalNote: string;
  /** One line above the fields explaining the marker. */
  requiredLegend: string;
  fields: {
    name: FormField;
    phone: FormField;
    eventDate: FormField;
    message: FormField;
  };
  submit: string;
  sending: string;
  errors: ContactFormErrors;
  toasts: {
    success: FormToast;
    error: FormToast;
    /** Shown when no Web3Forms key is set. Visitor-safe: points to WhatsApp and phone. */
    notConfigured: FormToast;
  };
  /** Label of the hidden spam-trap field (never seen by people). */
  honeypotLabel: string;
  /** Web3Forms payload text. */
  submission: {
    subject: string;
    fromName: string;
    /** Sent as the event date when the visitor leaves it blank. */
    eventDateNotGiven: string;
  };
}

export interface ContactContent {
  eyebrow: string;
  heading: string;
  /** Page lead while the enquiry form is shown. It mentions the form. */
  lead: string;
  /** Page lead while `hasEnquiryForm` is false. It does not mention a form. */
  leadWithoutForm: string;
  /** Heading of the details panel. */
  detailsHeading: string;
  details: ContactDetails;
  map: ContactMap;
  form: ContactFormContent;
}

/** Length limits shared by the zod schema and the error messages. */
export interface ContactLimits {
  nameMin: number;
  nameMax: number;
  phoneMin: number;
  phoneMax: number;
  messageMin: number;
  messageMax: number;
}

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

export const contactLimits: ContactLimits = {
  nameMin: 2,
  nameMax: 80,
  phoneMin: 10,
  phoneMax: 15,
  messageMin: 10,
  messageMax: 1000,
};

/**
 * True when the enquiry form can actually send (a Web3Forms key is set).
 * False → do not render the form; show `contact.form.unavailable` with the
 * WhatsApp and call buttons, and use `contact.leadWithoutForm`. Derived.
 */
export const hasEnquiryForm: boolean = env.web3FormsKey !== "";

// Both carried over from the previous site — the owner is to confirm they
// are still current (docs/COPY_TO_CONFIRM.md §6). The previous site's list of
// service areas ended with a forward-looking phrase; only the named cities
// are kept.
const HOURS = "Mon–Sat: 9:00 AM – 7:00 PM";
const SERVICE_AREAS = "Vadodara · Ahmedabad · Surat · Bharuch · Anand";

const PHONE_INVALID = "Enter a valid phone number.";

export const contact: ContactContent = {
  eyebrow: "Contact",
  heading: "Get in touch",
  lead: "Have an event coming up? Message us on WhatsApp, call, or send the form below with your date and guest count.",
  leadWithoutForm:
    "Have an event coming up? Message us on WhatsApp or call us with your date and guest count.",
  detailsHeading: "Contact details",
  details: {
    phone: { label: "Phone" },
    phoneAlt: { label: "Second phone" },
    whatsapp: {
      label: "WhatsApp",
      action: "Message us on WhatsApp",
      message: whatsappMessages.general(),
    },
    email: { label: "Email" },
    address: { label: "Address", lines: brand.address.lines },
    hours: { label: "Hours", value: HOURS },
    serviceAreas: { label: "Service areas", value: SERVICE_AREAS },
  },
  map: {
    title: `Map showing ${brand.name} in Akota, ${brand.city}`,
    openLabel: "Open in Google Maps",
    query: `${brand.name}, ${brand.address.oneLine}`,
  },
  form: {
    heading: "Send an enquiry",
    lead: "Tell us about your event and we will reply as soon as we can during working hours.",
    unavailable: {
      heading: "Enquire by WhatsApp or phone",
      body: "The enquiry form is not available right now. Message us on WhatsApp or call us and we will take the details from you.",
    },
    requiredMark: "*",
    requiredNote: "(required)",
    optionalNote: "(optional)",
    requiredLegend: "Fields marked * are required.",
    fields: {
      name: {
        label: "Full name",
        placeholder: "Your full name",
        required: true,
        helper: null,
      },
      phone: {
        label: "Phone number",
        placeholder: "10-digit mobile number",
        required: true,
        helper: "We will call or WhatsApp you on this number.",
      },
      eventDate: {
        label: "Event date",
        placeholder: "",
        required: false,
        helper: "Leave blank if the date is not fixed yet.",
      },
      message: {
        label: "Tell us about your event",
        placeholder: "Number of guests, the pieces you need, the venue",
        required: true,
        helper: null,
      },
    },
    submit: "Send enquiry",
    sending: "Sending…",
    errors: {
      nameTooShort: "Please enter your full name.",
      nameTooLong: `Please keep your name under ${contactLimits.nameMax} characters.`,
      phoneInvalid: PHONE_INVALID,
      messageTooShort: `Please tell us a little more about your event (at least ${contactLimits.messageMin} characters).`,
      messageTooLong: `Please keep your message under ${contactLimits.messageMax} characters.`,
    },
    toasts: {
      success: {
        title: "Enquiry sent",
        description: "Thank you. We will get back to you as soon as we can.",
      },
      error: {
        title: "Your enquiry could not be sent",
        description:
          "Please try again, or reach us directly on WhatsApp or by phone.",
      },
      notConfigured: {
        title: "The form is not available right now",
        description: "Please message us on WhatsApp or call us instead.",
      },
    },
    honeypotLabel: "Leave this field empty",
    submission: {
      subject: `New enquiry from the ${brand.name} website`,
      fromName: `${brand.name} website`,
      eventDateNotGiven: "Not specified",
    },
  },
};
