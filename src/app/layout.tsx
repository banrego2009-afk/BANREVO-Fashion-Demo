import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { brand } from "@/config/brand.config";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${brand.name} | ${brand.tagline}`,
  description: `Tíz női darab. Egy könnyed, kortárs kollekció, amely minden nézőpontból felfedezhető. — ${brand.name}`,
  openGraph: {
    title: `${brand.name} | ${brand.tagline}`,
    description: `Tíz női darab. Egy könnyed, kortárs kollekció. — ${brand.name}`,
    siteName: brand.name,
    locale: "hu_HU",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hu" className={`${playfair.variable} ${inter.variable}`}>
      <body className="flex min-h-screen flex-col font-sans">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
