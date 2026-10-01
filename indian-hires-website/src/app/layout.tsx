import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/Providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomBar } from "@/components/layout/MobileBottomBar";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://indianhires.com"),
  title: {
    default: "IndianHirers | Premium Crockery & Banquet Rental Partner — Vadodara, Gujarat",
    template: "%s | IndianHirers",
  },
  description:
    "25 years of trusted crockery, cutlery & banquet equipment rental for hotels and caterers. Serving Vadodara, expanding across Gujarat. B2B rental partner, not a retailer.",
  keywords: [
    "crockery rental",
    "catering equipment rental",
    "event rentals India",
    "banquet crockery hire",
    "utensil rental for events",
  ],
  authors: [{ name: "IndianHirers" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: "IndianHirers",
    title: "IndianHirers | Premium Crockery & Banquet Rental Partner — Vadodara, Gujarat",
    description:
      "25 years of trusted crockery, cutlery & banquet equipment rental for hotels and caterers. Serving Vadodara, expanding across Gujarat. B2B rental partner, not a retailer.",
    // TODO: replace with real 1200x630 OG image
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "IndianHirers — Premium Event Crockery Rentals" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "IndianHirers | Premium Crockery & Banquet Rental Partner — Vadodara, Gujarat",
    description: "25 years of trusted crockery, cutlery & banquet equipment rental for hotels and caterers.",
    images: ["/og-image.jpg"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};
export const viewport: Viewport = {
  themeColor: "#800020",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* 
        The Heading convention is to use className="font-heading" for h1-h6 tags.
      */}
      <body
        className={cn(
          "min-h-screen bg-background text-foreground antialiased font-body pb-20 md:pb-0",
          inter.variable,
          playfair.variable
        )}
      >
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-maroon text-white px-4 py-2 rounded z-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
          Skip to content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "IndianHirers",
              description:
                "25 years of trusted crockery, cutlery & banquet equipment rental for hotels and caterers. Serving Vadodara, expanding across Gujarat. B2B rental partner, not a retailer.",
              telephone: process.env.NEXT_PUBLIC_PHONE,
              email: process.env.NEXT_PUBLIC_EMAIL,
              url: process.env.NEXT_PUBLIC_SITE_URL,
              areaServed: "IN",
            }),
          }}
        />
        <Providers>
          <Header />
          {/* TODO: Home page hero might want the header overlapping. If so, override pt-20 with negative margin or adjust here later. */}
          <main id="main-content" className="pt-20">
            {children}
          </main>
          <Footer />
          <MobileBottomBar />
          <FloatingWhatsApp />
        </Providers>
      </body>
    </html>
  );
}
