import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { absoluteUrl, siteUrl } from "@/lib/site";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Pulse Daily — Independent News & Analysis", template: "%s | Pulse Daily" },
  description: "Independent reporting, sharp analysis, and reliable stories from Kenya, Africa, and the world.",
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "en_KE", siteName: "Pulse Daily", title: "Pulse Daily — Independent News & Analysis", description: "Independent reporting and context for a changing world.", url: siteUrl, images: [{ url: absoluteUrl("/opengraph-image"), width: 1200, height: 630, alt: "Pulse Daily — Independent News & Analysis" }] },
  twitter: { card: "summary_large_image", creator: "@pulsedaily", title: "Pulse Daily", description: "Independent reporting and context for a changing world.", images: [absoluteUrl("/opengraph-image")] },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}><body className="min-h-full flex flex-col bg-white text-zinc-950">{children}</body></html>;
}
