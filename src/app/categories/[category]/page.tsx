import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/article-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { categories, getCategoryArticles } from "@/lib/news";
import { absoluteUrl } from "@/lib/site";

export function generateStaticParams() { return categories.map((category) => ({ category: category.toLowerCase() })); }
export function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  return params.then(({ category }) => {
    const valid = categories.find((item) => item.toLowerCase() === category);
    if (!valid) return { title: "Category not found", robots: { index: false, follow: false } };
    const title = `${valid} News`;
    const description = `Read the latest ${valid} news, reporting, analysis, and stories from Pulse Daily.`;
    const canonical = `/categories/${valid.toLowerCase()}`;
    return {
      title,
      description,
      alternates: { canonical },
      openGraph: { title: `${title} | Pulse Daily`, description, type: "website", url: absoluteUrl(canonical), images: [{ url: absoluteUrl("/opengraph-image"), width: 1200, height: 630, alt: `Pulse Daily ${valid} news` }] },
      twitter: { card: "summary_large_image", title: `${title} | Pulse Daily`, description, images: [absoluteUrl("/opengraph-image")] },
    };
  });
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const valid = categories.find((item) => item.toLowerCase() === category);
  if (!valid) notFound();
  const items = getCategoryArticles(valid);
  const categorySchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${valid} News`,
    description: `Latest ${valid} news, reporting, and analysis from Pulse Daily.`,
    url: absoluteUrl(`/categories/${valid.toLowerCase()}`),
    mainEntity: { "@type": "ItemList", itemListElement: items.filter((item) => item.status === "published").map((item, index) => ({ "@type": "ListItem", position: index + 1, url: absoluteUrl(`/news/${item.slug}`), name: item.title })) },
  };
  const featured = items.find((article) => article.featured) ?? items[0];
  const latest = items.filter((article) => article.id !== featured?.id);
  return <main><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(categorySchema).replace(/</g, "\\u003c") }} /><SiteHeader /><section className="border-b border-zinc-200"><div className="mx-auto max-w-7xl px-5 py-12 sm:px-8"><p className="text-xs font-black uppercase tracking-[0.22em] text-red-600">Pulse Daily / {valid}</p><h1 className="mt-3 text-5xl font-black tracking-[-0.06em] sm:text-7xl">{valid}</h1><p className="mt-4 max-w-xl text-zinc-600">Independent reporting, analysis, and context on the stories shaping {valid.toLowerCase()}.</p></div></section>{featured && <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8"><article className="grid gap-6 lg:grid-cols-[1.25fr_.75fr]"><div className="relative aspect-[16/10] overflow-hidden bg-zinc-100"><Image src={featured.image} alt={featured.imageAlt} fill sizes="100vw" className="object-cover" /></div><div className="flex flex-col justify-center"><p className="text-xs font-black uppercase tracking-[0.18em] text-red-600">Featured story</p><h2 className="mt-3 text-3xl font-black leading-tight tracking-[-0.04em] sm:text-4xl">{featured.title}</h2><p className="mt-3 text-zinc-600">{featured.summary}</p><Link href={`/news/${featured.slug}`} className="mt-5 font-bold text-red-600">Read the story →</Link></div></article></section>}<section className="border-t border-zinc-200 bg-zinc-50"><div className="mx-auto max-w-7xl px-5 py-14 sm:px-8"><div className="mb-8"><p className="text-xs font-black uppercase tracking-[0.18em]">Latest coverage</p><h2 className="mt-2 text-3xl font-black tracking-[-0.04em]">All stories</h2></div><div className="grid gap-x-10 md:grid-cols-2">{latest.map((article) => <ArticleCard key={article.id} article={article} />)}</div></div></section><section className="mx-auto max-w-7xl px-5 py-16 sm:px-8"><div className="rounded-lg bg-zinc-950 p-8 text-white"><p className="text-xs font-black uppercase tracking-[0.2em] text-red-400">Trending in {valid}</p><h2 className="mt-2 text-3xl font-black">The stories people are reading</h2><div className="mt-7 grid gap-5 md:grid-cols-3">{items.filter((item) => item.status === "published" && item.trending).slice(0, 3).map((article) => <Link key={article.id} href={`/news/${article.slug}`} className="border-t border-zinc-600 pt-4 font-bold">{article.title}</Link>)}</div></div></section><section className="border-t border-zinc-200 px-5 py-14 text-center sm:px-8"><p className="text-sm text-zinc-600">Showing {items.length} stories in {valid}</p><div className="mt-5 flex justify-center gap-2"><button className="h-10 w-10 border border-zinc-300">1</button><button className="h-10 w-10 border border-zinc-300">2</button></div></section><SiteFooter /></main>;
}
