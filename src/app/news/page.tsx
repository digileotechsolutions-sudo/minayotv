import type { Metadata } from "next";
import { NewsBrowser } from "@/components/news-browser";
import { articles, categories } from "@/lib/news";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Latest News",
  description: "The latest independent news, reporting, and analysis from Kenya, Africa, and around the world.",
  alternates: { canonical: "/news" },
  openGraph: {
    title: "Latest News | Pulse Daily",
    description: "The latest independent news, reporting, and analysis from Kenya, Africa, and around the world.",
    type: "website",
    url: absoluteUrl("/news"),
    images: [{ url: absoluteUrl("/opengraph-image"), width: 1200, height: 630, alt: "Latest reporting from Pulse Daily" }],
  },
  twitter: { card: "summary_large_image", title: "Latest News | Pulse Daily", description: "The latest independent news, reporting, and analysis from Kenya, Africa, and around the world.", images: [absoluteUrl("/opengraph-image")] },
};

export default function NewsPage() {
  const published = articles
    .filter((article) => article.status === "published")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return <NewsBrowser initialArticles={published} categories={categories} />;
}
