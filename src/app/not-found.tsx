import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="public-news-page">
      <SiteHeader />
      <section className="public-article-not-found">
        <span>404</span>
        <h1>Page not found</h1>
        <p>The page may have moved or the address may be incorrect.</p>
        <div><Link href="/">Go to homepage</Link><Link href="/news">Browse latest news</Link></div>
      </section>
      <SiteFooter />
    </main>
  );
}
