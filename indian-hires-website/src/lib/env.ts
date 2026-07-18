export const env = {
  web3FormsKey: process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "",
  phone: process.env.NEXT_PUBLIC_PHONE || "",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || "",
  email: process.env.NEXT_PUBLIC_EMAIL || "",
  mapEmbedUrl: process.env.NEXT_PUBLIC_MAP_EMBED_URL || "",
};

// Check for missing environment variables in development
if (process.env.NODE_ENV === "development") {
  const missingKeys: string[] = [];
  
  if (!env.web3FormsKey) missingKeys.push("NEXT_PUBLIC_WEB3FORMS_KEY");
  if (!env.phone) missingKeys.push("NEXT_PUBLIC_PHONE");
  if (!env.whatsapp) missingKeys.push("NEXT_PUBLIC_WHATSAPP");
  if (!env.email) missingKeys.push("NEXT_PUBLIC_EMAIL");
  if (!env.mapEmbedUrl) missingKeys.push("NEXT_PUBLIC_MAP_EMBED_URL");

  if (missingKeys.length > 0) {
    console.warn(
      `⚠️ Missing environment variables: ${missingKeys.join(", ")}. Please check your .env.local file.`
    );
  }
}
