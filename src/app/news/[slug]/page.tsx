import type { Metadata } from "next";
import { PublicNewsArticle } from "@/components/public-news-article";
import { articles, getArticleBySlug } from "@/lib/news";
import { absoluteUrl } from "@/lib/site";

export function generateStaticParams() {
  return articles.filter((article) => article.status === "published").map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article || article.status !== "published") return { title: "News story not found", robots: { index: false, follow: false } };
  const canonical = article.canonicalUrl || `/news/${article.slug}`;
  const socialTitle = article.socialTitle || article.seoTitle || article.title;
  const socialDescription = article.socialDescription || article.metaDescription || article.summary;
  return {
    title: article.seoTitle || article.title,
    description: article.metaDescription || article.summary,
    keywords: article.tags,
    alternates: { canonical },
    openGraph: {
      title: socialTitle,
      description: socialDescription,
      type: "article",
      url: absoluteUrl(canonical),
      siteName: "Pulse Daily",
      publishedTime: article.date,
      modifiedTime: article.updatedAt ?? article.date,
      authors: [article.author],
      images: [{ url: article.image, width: 1200, height: 630, alt: article.imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      creator: "@pulsedaily",
      title: socialTitle,
      description: socialDescription,
      images: [{ url: article.image, alt: article.imageAlt }],
    },
  };
}

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug) ?? null;
  const breadcrumbSchema = article ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "News", item: absoluteUrl("/news") },
      { "@type": "ListItem", position: 3, name: article.category, item: absoluteUrl(`/categories/${article.category.toLowerCase()}`) },
      { "@type": "ListItem", position: 4, name: article.title, item: absoluteUrl(`/news/${article.slug}`) },
    ],
  } : null;
  return <>{breadcrumbSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c") }} />}<PublicNewsArticle slug={slug} initialArticle={article} /></>;
}
