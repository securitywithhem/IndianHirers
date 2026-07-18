import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/shared/Providers";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "Indian Hires | Premium Crockery & Utensil Rentals",
  description: "25 years of trusted crockery, cutlery, and event rental service for hotels, caterers, and event planners.",
  metadataBase: new URL("https://indianhires.com"),
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
          "min-h-screen bg-background text-foreground antialiased font-body",
          inter.variable,
          playfair.variable
        )}
      >
        <Providers>
          {/* Header, MobileBottomBar will go here in Phase 1 */}
          {children}
          {/* Footer, FloatingWhatsApp will go here in Phase 1 */}
        </Providers>
      </body>
    </html>
  );
}
