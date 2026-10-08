"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import type { Article, Category } from "@/lib/news";
import { ArrowIcon, SearchIcon } from "@/components/icons";
import { BreakingTicker } from "@/components/breaking-ticker";
import { Newsletter } from "@/components/newsletter";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

type CmsStory = {
  id: string;
  kind: "news" | "blog" | "breaking";
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  author: string;
  status: string;
  date: string;
  views?: number;
  featured?: boolean;
  trending?: boolean;
  image?: string;
  tags?: string[];
  body?: string;
  live?: boolean;
  expiresAt?: string;
};

const STORAGE_KEY = "pulse-daily-admin-content-v2";
const PAGE_SIZE = 6;
const fallbackImage = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1400&q=80";
const formatDate = (date: string) => new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(date));
const readingTime = (content: string[]) => `${Math.max(1, Math.ceil(content.join(" ").split(/\s+/).length / 200))} min read`;

function fromCms(story: CmsStory): Article {
  const content = story.body?.split(/\n{2,}/).map((part) => part.trim()).filter(Boolean) ?? [];
  return {
    id: `cms-${story.id}`,
    slug: story.slug,
    title: story.title,
    summary: story.excerpt,
    excerpt: story.excerpt,
    content: content.length ? content : [story.excerpt],
    category: story.category as Category,
    author: story.author,
    authorRole: "Pulse Daily contributor",
    date: story.date,
    readTime: readingTime(content.length ? content : [story.excerpt]),
    image: story.image || fallbackImage,
    imageAlt: story.title,
    tags: story.tags ?? [],
    featured: story.featured,
    trending: story.trending ? 1 : undefined,
    status: "published",
  };
}

function NewsImage({ article, priority = false, className = "" }: { article: Article; priority?: boolean; className?: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={`news-image-frame ${className}`}>
      {!failed ? <Image
        src={article.image || fallbackImage}
        alt={article.imageAlt || article.title}
        fill
        priority={priority}
        sizes={priority ? "(max-width: 900px) 100vw, 65vw" : "(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 340px"}
        className="news-image"
        onError={() => setFailed(true)}
      /> : <div className="news-image-fallback" aria-label="Image unavailable"><span>Pulse Daily</span><strong>{article.category}</strong></div>}
    </div>
  );
}

function ArticleMeta({ article }: { article: Article }) {
  return <p className="news-article-meta"><span>{article.author}</span><i />{formatDate(article.date)}<i />{article.readTime}</p>;
}

function StoryCard({ article, featured = false }: { article: Article; featured?: boolean }) {
  return (
    <article className={`news-story-card ${featured ? "is-featured" : ""}`}>
      <Link href={article.id.startsWith("cms-") || article.id.startsWith("news-") ? `/news/${article.slug}` : `/articles/${article.slug}`} className="news-card-image-link" aria-label={`Read ${article.title}`}>
        <NewsImage article={article} />
        {article.featured && <span className="news-featured-label">FEATURED</span>}
      </Link>
      <div className="news-card-copy">
        <Link href={`/categories/${article.category.toLowerCase()}`} className="news-category-label">{article.category}</Link>
        <h3><Link href={article.id.startsWith("cms-") || article.id.startsWith("news-") ? `/news/${article.slug}` : `/articles/${article.slug}`}>{article.title}</Link></h3>
        <p className="news-card-excerpt">{article.excerpt || article.summary}</p>
        <ArticleMeta article={article} />
      </div>
    </article>
  );
}

export function NewsBrowser({ initialArticles, categories: initialCategories }: { initialArticles: Article[]; categories: string[] }) {
  const [articles, setArticles] = useState(initialArticles);
  const [categories, setCategories] = useState(initialCategories);
  const [breakingStories, setBreakingStories] = useState<CmsStory[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"latest" | "popular">("latest");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [hasCmsData, setHasCmsData] = useState(false);
  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [subscribeMessage, setSubscribeMessage] = useState("");

  useEffect(() => {
    const update = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return;
        const parsed: unknown = JSON.parse(saved);
        if (!Array.isArray(parsed)) return;
        const cmsItems = parsed as CmsStory[];
        const cmsNews = cmsItems.filter((item) => item.kind === "news" && item.status === "Published");
        const current = cmsItems.filter((item) => item.kind === "breaking" && item.status === "Published" && item.live && (!item.expiresAt || new Date(item.expiresAt).getTime() > Date.now()));
        setArticles(cmsNews.map(fromCms).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        setBreakingStories(current);
        setCategories(Array.from(new Set([...initialCategories, ...cmsItems.map((item) => item.category)])).sort((a, b) => a.localeCompare(b)));
        setHasCmsData(true);
      } catch (error) {
        console.error("Unable to load the local newsroom content.", error);
      }
    };
    update();
    window.addEventListener("storage", update);
    window.addEventListener("pulse-daily-content-updated", update);
    return () => {
      window.removeEventListener("storage", update);
      window.removeEventListener("pulse-daily-content-updated", update);
    };
  }, [initialCategories]);

  const sortedArticles = useMemo(() => {
    const term = query.trim().toLowerCase();
    return articles.filter((article) => {
      const searchable = [article.title, article.summary, article.excerpt, article.category, article.author, ...article.tags].join(" ").toLowerCase();
      return (activeCategory === "All" || article.category.toLowerCase() === activeCategory.toLowerCase()) && (!term || searchable.includes(term));
    }).sort((a, b) => sort === "latest" ? new Date(b.date).getTime() - new Date(a.date).getTime() : Number(b.trending ?? 0) - Number(a.trending ?? 0));
  }, [activeCategory, articles, query, sort]);
  const featured = articles.filter((article) => article.featured).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] ?? articles[0];
  const secondary = articles.filter((article) => article.id !== featured?.id).slice(0, 3);
  const trending = [...articles].sort((a, b) => Number(b.trending ?? 0) - Number(a.trending ?? 0)).slice(0, 5);
  const popularCategories = categories.map((category) => ({ category, count: articles.filter((article) => article.category.toLowerCase() === category.toLowerCase()).length })).sort((a, b) => b.count - a.count).slice(0, 8);
  const visibleArticles = sortedArticles.slice(0, visibleCount);

  const selectCategory = (category: string) => {
    setActiveCategory(category);
    setVisibleCount(PAGE_SIZE);
  };
  const subscribe = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubscribeMessage("Thanks — you’re on the list.");
    setSubscribeEmail("");
  };

  return (
    <main className="public-news-page">
      <SiteHeader />
      <BreakingTicker />
      <nav className="news-category-nav" aria-label="News categories">
        <div className="news-category-nav-inner">
          {["All", ...categories].map((category) => <button key={category} type="button" aria-pressed={activeCategory === category} className={activeCategory === category ? "selected" : ""} onClick={() => selectCategory(category)}>{category}</button>)}
        </div>
      </nav>

      <section className="news-page-intro">
        <div className="news-kicker"><span />THE PULSE DAILY NEWSROOM</div>
        <div className="news-intro-row"><div><h1>News, with context.</h1><p>Independent reporting on the stories shaping Kenya, Africa, and the world.</p></div><form className="public-news-search" onSubmit={(event) => event.preventDefault()}><SearchIcon /><input value={query} onChange={(event) => { setQuery(event.target.value); setVisibleCount(PAGE_SIZE); }} aria-label="Search news" placeholder="Search news..." /><button aria-label="Search stories" type="submit"><ArrowIcon /></button></form></div>
      </section>

      {featured ? <section className="news-featured-section">
        <div className="news-section-heading"><div><span className="news-section-kicker">THE BIG STORY</span><h2>Featured News</h2></div><span className="news-updated"><i />Updated throughout the day</span></div>
        <div className={`news-featured-layout ${secondary.length ? "" : "has-no-secondary"}`}>
          <article className="news-lead-story">
            <Link href={featured.id.startsWith("cms-") || featured.id.startsWith("news-") ? `/news/${featured.slug}` : `/articles/${featured.slug}`} className="news-lead-image-link">
              <NewsImage article={featured} priority />
              <div className="news-lead-shade" />
              {featured.featured && <span className="news-lead-label">EDITOR’S PICK</span>}
              <div className="news-lead-content"><span className="news-category-label light">{featured.category}</span><h2>{featured.title}</h2><p>{featured.summary}</p><ArticleMeta article={featured} /><span className="news-read-story">Read full story <ArrowIcon /></span></div>
            </Link>
          </article>
          <div className="news-secondary-stories">{secondary.map((article, index) => <article className="news-secondary-card" key={article.id}><Link href={article.id.startsWith("cms-") || article.id.startsWith("news-") ? `/news/${article.slug}` : `/articles/${article.slug}`} className="news-secondary-image"><NewsImage article={article} /><span>0{index + 1}</span></Link><div><Link href={`/categories/${article.category.toLowerCase()}`} className="news-category-label">{article.category}</Link><h3><Link href={article.id.startsWith("cms-") || article.id.startsWith("news-") ? `/news/${article.slug}` : `/articles/${article.slug}`}>{article.title}</Link></h3><ArticleMeta article={article} /></div></article>)}</div>
        </div>
      </section> : <section className="news-empty-featured"><span className="news-empty-icon">PD</span><h2>No stories available</h2><p>Check back soon for the latest updates from our newsroom.</p></section>}

      <div className="news-content-layout">
        <section className="news-latest-section" id="latest">
          <div className="news-section-heading latest-heading"><div><span className="news-section-kicker">{query ? "SEARCH THE NEWSROOM" : activeCategory === "All" ? "THE LATEST" : `LATEST IN ${activeCategory.toUpperCase()}`}</span><h2>{query ? `Search results for “${query}”` : "Latest News"}</h2></div><label className="news-sort">Sort by <select value={sort} onChange={(event) => setSort(event.target.value as "latest" | "popular")}><option value="latest">Latest</option><option value="popular">Trending</option></select></label></div>
          {visibleArticles.length ? <div className="news-latest-grid">{visibleArticles.map((article) => <StoryCard key={article.id} article={article} />)}</div> : <div className="news-search-empty"><span><SearchIcon /></span><h3>{query ? "No news found" : "No stories available"}</h3><p>{query ? "Try another keyword or browse our latest stories." : hasCmsData ? "There are no published stories in this section yet." : "Check back soon for the latest updates."}</p>{(query || activeCategory !== "All") && <button onClick={() => { setQuery(""); selectCategory("All"); }}>Clear filters</button>}</div>}
          <div className="news-pagination-note">Showing <strong>{visibleArticles.length}</strong> of <strong>{sortedArticles.length}</strong> stories</div>
          {visibleCount < sortedArticles.length && <button className="news-load-more" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}>Load more stories <span>↓</span></button>}
        </section>

        <aside className="news-sidebar">
          <section className="news-sidebar-block">
            <div className="news-sidebar-heading"><span className="news-section-kicker">WHAT PEOPLE ARE READING</span><h2>Trending News</h2></div>
            <ol className="news-trending-list">{trending.map((article, index) => <li key={article.id}><span className="news-trending-number">{String(index + 1).padStart(2, "0")}</span><div><Link href={article.id.startsWith("cms-") || article.id.startsWith("news-") ? `/news/${article.slug}` : `/articles/${article.slug}`}>{article.title}</Link><small>{article.category} · {article.readTime}</small></div></li>)}</ol>
          </section>
          <section className="news-sidebar-block news-popular-block" id="categories">
            <div className="news-sidebar-heading"><span className="news-section-kicker">EXPLORE THE NEWSROOM</span><h2>Popular Categories</h2></div>
            <div className="news-popular-categories">{popularCategories.map(({ category, count }) => <button key={category} onClick={() => { selectCategory(category); document.getElementById("latest")?.scrollIntoView({ behavior: "smooth" }); }}><span>{category}</span><small>{count}</small></button>)}</div>
          </section>
          <section className="news-sidebar-subscribe"><span className="news-section-kicker">THE DAILY BRIEF</span><h2>News worth your time.</h2><p>Get our most important stories and essential context in your inbox.</p><form onSubmit={subscribe}><input type="email" required value={subscribeEmail} onChange={(event) => setSubscribeEmail(event.target.value)} aria-label="Email address for the daily brief" placeholder="Email address" /><button type="submit">Subscribe <ArrowIcon /></button>{subscribeMessage && <span role="status">{subscribeMessage}</span>}</form></section>
          {breakingStories.length > 0 && <section className="news-sidebar-breaking"><span className="news-section-kicker">LIVE DESK</span><h2>Breaking now</h2>{breakingStories.slice(0, 3).map((story) => <Link key={story.id} href={`/news/${story.slug}`}><span className="news-live-dot" />{story.title}</Link>)}</section>}
        </aside>
      </div>

      <section className="news-trending-mobile"><div className="news-section-heading"><div><span className="news-section-kicker">MOST READ</span><h2>Trending News</h2></div></div><div className="news-trending-mobile-list">{trending.slice(0, 3).map((article, index) => <Link key={article.id} href={article.id.startsWith("cms-") || article.id.startsWith("news-") ? `/news/${article.slug}` : `/articles/${article.slug}`}><b>{String(index + 1).padStart(2, "0")}</b><span>{article.title}</span><ArrowIcon /></Link>)}</div></section>
      <Newsletter />
      <SiteFooter />
    </main>
  );
}
