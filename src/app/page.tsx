import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArticleCard } from "@/components/article-card";
import { BreakingTicker } from "@/components/breaking-ticker";
import { Newsletter } from "@/components/newsletter";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { articles } from "@/lib/news";
import { ArrowIcon } from "@/components/icons";
import { absoluteUrl } from "@/lib/site";

const categorySections = ["Kenya", "Africa", "World", "Politics", "Business", "Technology", "Sports", "Entertainment"] as const;

export const metadata: Metadata = {
  title: "Kenya, Africa & World News",
  description: "Independent news, breaking stories, and sharp analysis from Kenya, Africa, and around the world.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Pulse Daily — Independent News & Analysis",
    description: "Independent news, breaking stories, and sharp analysis from Kenya, Africa, and around the world.",
    type: "website",
    url: absoluteUrl("/"),
    images: [{ url: absoluteUrl("/opengraph-image"), width: 1200, height: 630, alt: "Pulse Daily — Independent News & Analysis" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pulse Daily — Independent News & Analysis",
    description: "Independent news, breaking stories, and sharp analysis from Kenya, Africa, and around the world.",
    images: [absoluteUrl("/opengraph-image")],
  },
};

export default function Home() {
  const publishedArticles = articles.filter((article) => article.status === "published");
  const featured = publishedArticles.filter((article) => article.featured);
  const lead = featured[0];
  const latest = publishedArticles.slice(0, 9);
  const trending = [...publishedArticles].filter((article) => article.trending).sort((a, b) => (a.trending ?? 99) - (b.trending ?? 99));

  const websiteSchema = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": `${absoluteUrl("/")}#organization`, name: "Pulse Daily", url: absoluteUrl("/"), logo: absoluteUrl("/opengraph-image") },
      { "@type": "WebSite", "@id": `${absoluteUrl("/")}#website`, name: "Pulse Daily", url: absoluteUrl("/"), publisher: { "@id": `${absoluteUrl("/")}#organization` }, potentialAction: { "@type": "SearchAction", target: `${absoluteUrl("/search")}?q={search_term_string}`, "query-input": "required name=search_term_string" } },
    ],
  };

  return <main><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema).replace(/</g, "\\u003c") }} /><SiteHeader /><BreakingTicker />
    <section className="mx-auto max-w-7xl px-5 py-7 sm:px-8"><div className="mb-5 flex items-center justify-between border-b border-zinc-900 pb-3"><p className="text-[11px] font-black uppercase tracking-[0.22em]">Top stories</p><span className="text-xs text-zinc-500">Updated 06:00 EAT</span></div></section>
    <section className="mx-auto grid max-w-7xl gap-7 px-5 pb-16 sm:px-8 lg:grid-cols-[minmax(0,1.65fr)_minmax(300px,.75fr)]">
      <article className="group"><Link href={`/news/${lead.slug}`} className="relative block aspect-[16/10] overflow-hidden bg-zinc-100 sm:aspect-[16/9]"><Image src={lead.image} alt={lead.imageAlt} fill priority sizes="(max-width: 1024px) 100vw, 63vw" className="object-cover transition duration-700 group-hover:scale-[1.025]" /><div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" /><div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-8"><p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-red-300">{lead.category} · Lead story</p><h1 className="max-w-4xl text-3xl font-black leading-[1.02] tracking-[-0.045em] sm:text-5xl lg:text-6xl">{lead.title}</h1><p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-200 sm:text-base">{lead.summary}</p><div className="mt-5 flex items-center gap-3 text-xs text-zinc-300"><span>{lead.author}</span><span>·</span><span>{new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(lead.date))}</span></div></div></Link></article>
      <aside className="flex flex-col gap-4 lg:border-l lg:pl-7"><div className="flex items-center justify-between border-b border-zinc-200 pb-3"><p className="text-xs font-black uppercase tracking-[0.18em]">More to explore</p><span className="h-2 w-2 rounded-full bg-red-600" /></div>{featured.slice(1, 4).map((article) => <Link key={article.id} href={`/news/${article.slug}`} className="group grid grid-cols-[140px_1fr] gap-4 border-b border-zinc-200 pb-4"><div className="relative aspect-[4/3] overflow-hidden bg-zinc-100"><Image src={article.image} alt={article.imageAlt} fill sizes="140px" className="object-cover transition duration-500 group-hover:scale-105" /></div><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-red-600">{article.category}</p><h2 className="mt-1 line-clamp-3 text-base font-bold leading-snug tracking-[-0.02em] text-zinc-950">{article.title}</h2></div></Link>)}</aside>
    </section>
    <section id="trending" className="border-y border-zinc-200 bg-zinc-50"><div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[minmax(0,1fr)_330px]"><div><div className="mb-7 flex items-end justify-between"><div><p className="text-xs font-black uppercase tracking-[0.2em] text-red-600">Fresh reporting</p><h2 className="mt-2 text-4xl font-black tracking-[-0.05em]">Latest News</h2></div><Link href="/news" className="hidden items-center gap-2 text-sm font-bold hover:text-red-600 sm:flex">View all <ArrowIcon className="h-4 w-4" /></Link></div><div className="grid gap-x-8 md:grid-cols-2">{latest.map((article) => <ArticleCard key={article.id} article={article} />)}</div></div><aside><div className="sticky top-28"><h2 className="border-b border-zinc-900 pb-3 text-sm font-black uppercase tracking-[0.18em]">Trending now</h2><ol className="divide-y divide-zinc-200">{trending.slice(0, 8).map((article, index) => <li key={article.id} className="group grid grid-cols-[34px_1fr] gap-3 py-5"><span className="text-3xl font-black tracking-[-0.06em] text-zinc-200">0{index + 1}</span><Link href={`/news/${article.slug}`}><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-red-600">{article.category}</p><h3 className="mt-1 text-base font-bold leading-snug text-zinc-950 transition group-hover:text-red-600">{article.title}</h3></Link></li>)}</ol></div></aside></div></section>
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8"><div className="mb-8"><p className="text-xs font-black uppercase tracking-[0.2em] text-red-600">Browse the newsroom</p><h2 className="mt-2 text-4xl font-black tracking-[-0.05em]">Explore by category</h2></div><div className="grid gap-px overflow-hidden border border-zinc-200 bg-zinc-200 sm:grid-cols-2 lg:grid-cols-4">{categorySections.map((category) => <Link key={category} href={`/categories/${category.toLowerCase()}`} className="group flex min-h-36 flex-col justify-between bg-white p-5 transition hover:bg-zinc-950 hover:text-white"><span className="text-xs font-bold uppercase tracking-[0.18em] text-red-600">{category}</span><span className="flex items-end justify-between"><span className="text-2xl font-black tracking-[-0.04em]">{category}</span><ArrowIcon className="h-5 w-5 transition group-hover:translate-x-1" /></span></Link>)}</div></section>
    <Newsletter /><SiteFooter /></main>;
}
