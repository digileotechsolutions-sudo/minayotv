import type { MetadataRoute } from "next";
import { articles, categories } from "@/lib/news";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const published = articles
    .filter((article) => article.status === "published")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const newestStoryDate = published[0] ? new Date(published[0].date) : undefined;
  const lastModifiedForCategory = (category: string) => {
    const latest = published.find((article) => article.category === category);
    return latest ? new Date(latest.updatedAt || latest.date) : undefined;
  };

  return [
    { url: absoluteUrl("/"), lastModified: newestStoryDate, changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/news"), lastModified: newestStoryDate, changeFrequency: "hourly", priority: 0.95 },
    ...categories.map((category) => ({
      url: absoluteUrl(`/categories/${category.toLowerCase()}`),
      lastModified: lastModifiedForCategory(category),
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    ...published.map((article) => ({
      url: absoluteUrl(`/news/${article.slug}`),
      lastModified: new Date(article.updatedAt || article.date),
      changeFrequency: "daily" as const,
      priority: 0.9,
    })),
  ];
}
