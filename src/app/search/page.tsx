"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArticleCard } from "@/components/article-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { articles, categories } from "@/lib/news";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [category, setCategory] = useState("All");
  const results = useMemo(() => articles.filter((article) => article.status === "published").filter((article) => { const matchesQuery = !query || [article.title, article.category, article.author, article.summary, ...article.tags].join(" ").toLowerCase().includes(query.toLowerCase()); const matchesCategory = category === "All" || article.category === category; return matchesQuery && matchesCategory; }), [query, category]);
  return <main><SiteHeader /><section className="mx-auto max-w-7xl px-5 py-14 sm:px-8"><p className="text-xs font-black uppercase tracking-[0.2em] text-red-600">Search the newsroom</p><h1 className="mt-3 text-5xl font-black tracking-[-0.055em] sm:text-6xl">Find what matters.</h1><form className="mt-8 flex flex-col gap-3 sm:flex-row" onSubmit={(event) => event.preventDefault()}><label htmlFor="search" className="sr-only">Search articles</label><input id="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search headlines, topics, authors…" className="h-14 flex-1 border-b-2 border-zinc-900 bg-transparent px-1 text-lg outline-none" /><button className="h-14 bg-zinc-950 px-7 font-bold text-white">Search</button></form><div className="mt-8 flex flex-wrap gap-2">{["All", ...categories].map((item) => <button key={item} onClick={() => setCategory(item)} className={`rounded-full border px-4 py-2 text-xs font-bold ${category === item ? "border-red-600 bg-red-600 text-white" : "border-zinc-300 hover:border-zinc-950"}`}>{item}</button>)}</div><div className="mt-12 flex items-center justify-between border-b border-zinc-900 pb-4"><p className="font-bold">{results.length} results</p><p className="text-xs text-zinc-500">Sorted by relevance</p></div><div>{results.length ? <div className="grid gap-0 md:grid-cols-2">{results.map((article) => <ArticleCard key={article.id} article={article} />)}</div> : <div className="py-20 text-center"><h2 className="text-2xl font-black">No stories found</h2><p className="mt-2 text-zinc-600">Try another keyword or choose a different category.</p></div>}</div></section><SiteFooter /></main>;
}
