import type { Metadata, Viewport } from "next";
import "./globals.css";
import { fontBody, fontDisplay } from "./fonts";
import { cn } from "@/lib/utils";
import { env } from "@/lib/env";
import { localBusinessJsonLd, shell, siteMetadata } from "@/content/site";
import { Providers } from "@/components/Providers";
import { shareImages } from "@/components/shared/pageMetadata";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomBar } from "@/components/layout/MobileBottomBar";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";

const images = shareImages();

/*
 * Site-wide defaults. Each page sets its own title, description, canonical and
 * robots with `pageMetadata()` (src/components/shared/pageMetadata.ts).
 *
 * No canonical and no og:url here on purpose: a value set in the root layout
 * is inherited by every page that does not override it, and would point them
 * all at the home page. There is no fallback domain either — `metadataBase`
 * exists only when NEXT_PUBLIC_SITE_URL is set.
 */
export const metadata: Metadata = {
  metadataBase: env.siteUrl ? new URL(env.siteUrl) : undefined,
  title: {
    default: siteMetadata.defaultTitle,
    template: siteMetadata.titleTemplate,
  },
  description: siteMetadata.description,
  keywords: siteMetadata.keywords,
  applicationName: siteMetadata.siteName,
  openGraph: {
    type: "website",
    locale: siteMetadata.locale,
    siteName: siteMetadata.siteName,
    title: siteMetadata.defaultTitle,
    description: siteMetadata.description,
    ...(images ? { images } : {}),
  },
  twitter: {
    card: images ? "summary_large_image" : "summary",
    title: siteMetadata.defaultTitle,
    description: siteMetadata.description,
    ...(images ? { images: images.map((image) => image.url) } : {}),
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  // check-tokens-ignore: meta theme-color cannot reference a CSS variable (maroon-950)
  themeColor: "#290F0A",
  /* Lets env(safe-area-inset-*) report the real insets on notched phones. */
  viewportFit: "cover",
};

/* `<` is escaped so no string in the schema can close the script element. */
const jsonLd = JSON.stringify(localBusinessJsonLd()).replace(/</g, "\\u003c");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={siteMetadata.lang} className={cn(fontDisplay.variable, fontBody.variable)}>
      {/*
        Bottom padding below `md` is exactly the mobile bottom bar's height
        (4rem + the safe-area inset), so the bar never covers the footer's
        last line.
      */}
      <body className="min-h-dvh bg-background font-body text-foreground antialiased pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0">
        {/*
          Skip link: a real 48px button that waits above the viewport and drops
          in just below the header when focused, clear of the logo. It is moved
          with a transform rather than `sr-only`/`not-sr-only`, which would
          reset its padding.
        */}
        <a
          href="#main-content"
          className="type-button focus-ring fixed left-4 top-header z-drawer mt-2 inline-flex min-h-12 -translate-y-[calc(100%+var(--header-h)+1rem)] items-center rounded-lg bg-primary px-6 py-3 text-primary-foreground focus-visible:translate-y-0"
        >
          {shell.skipLink}
        </a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
        <Providers>
          <Header />
          {/*
            The header is fixed and overlays the maroon band that opens every
            page, so <main> has no top padding: that first band carries
            `pt-header` itself (<PageHero>, or <Band underHeader> on the home
            hero). See src/components/shared/README.md → Header offset.
          */}
          <main id="main-content" tabIndex={-1} className="outline-none">
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
