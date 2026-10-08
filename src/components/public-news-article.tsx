"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, ReactNode, useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { Article } from "@/lib/news";
import { articles, getArticleBySlug } from "@/lib/news";
import { ArrowIcon } from "@/components/icons";
import { BreakingTicker } from "@/components/breaking-ticker";
import { Newsletter } from "@/components/newsletter";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { absoluteUrl } from "@/lib/site";

const STORAGE_KEY = "pulse-daily-admin-content-v2";
const fallbackImage = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1400&q=80";
type CmsStory = { id: string; kind: string; title: string; slug: string; excerpt: string; category: string; author: string; status: string; date: string; updatedAt?: string; image?: string; imageAlt?: string; imageCaption?: string; body?: string; keyTakeaways?: string[]; tags?: string[]; comments?: boolean; live?: boolean; expiresAt?: string; seoTitle?: string; metaDescription?: string; source?: string; location?: string };
type ReaderComment = { id: string; name: string; message: string; createdAt: string; status: "Approved" | "Pending review" };
const subscribeFocusMode = (callback: () => void) => {
  window.addEventListener("pulse-reading-focus-change", callback);
  return () => window.removeEventListener("pulse-reading-focus-change", callback);
};
const getFocusMode = () => sessionStorage.getItem("pulse-reading-focus") === "true";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "long", timeStyle: "short" }).format(new Date(value));
}

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g).filter(Boolean);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*")) return <em key={index}>{part.slice(1, -1)}</em>;
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const safeHref = /^(https?:\/\/|\/|#)/i.test(link[2]) ? link[2] : "#";
      return <a key={index} href={safeHref}>{link[1]}</a>;
    }
    return part;
  });
}

function StoryBlocks({ blocks }: { blocks: string[] }) {
  const rendered: ReactNode[] = [];
  let list: string[] = [];
  let leadRendered = false;
  const flushList = () => {
    if (list.length) rendered.push(<ul key={`list-${rendered.length}`}>{list.map((item, index) => <li key={index}>{renderInline(item)}</li>)}</ul>);
    list = [];
  };
  blocks.forEach((block, index) => {
    const value = block.trim();
    if (!value) return;
    const heading = value.match(/^#{2,4}\s+(.+)$/);
    const bullet = value.match(/^(?:[-*]|\d+\.)\s+(.+)$/);
    const image = value.match(/^!\[([^\]]*)\]\((https?:\/\/[^)]+)\)$/);
    const video = value.match(/^<video\s+src=["'](https?:\/\/[^"']+)["'][^>]*>(?:<\/video>)?$/i);
    if (bullet) {
      list.push(bullet[1]);
      return;
    }
    flushList();
    if (heading) rendered.push(<h2 key={index}>{renderInline(heading[1])}</h2>);
    else if (value.startsWith(">")) rendered.push(<blockquote key={index}>{renderInline(value.replace(/^>\s?/, ""))}</blockquote>);
    else if (image) rendered.push(<figure className="public-article-inline-media" key={index}><Image src={image[2]} alt={image[1]} width={1200} height={800} sizes="(max-width: 720px) 100vw, 720px" /><figcaption>{image[1]}</figcaption></figure>);
    else if (video) rendered.push(<figure className="public-article-inline-media" key={index}><video controls preload="metadata" src={video[1]} aria-label="Article video" /></figure>);
    else if (value.startsWith("|") && value.includes("---")) rendered.push(<p key={index}>{renderInline(value.split("\n").filter((row) => !/^\|\s*:?-+/.test(row)).join(" · ").replace(/\|/g, " · "))}</p>);
    else {
      const isLead = !leadRendered;
      leadRendered = true;
      rendered.push(<p className={isLead ? "article-lead" : undefined} key={index}>{renderInline(value)}</p>);
    }
  });
  flushList();
  return <>{rendered}</>;
}

export function PublicNewsArticle({ slug, initialArticle }: { slug: string; initialArticle: Article | null }) {
  const [article, setArticle] = useState<Article | null>(initialArticle);
  const [notFound, setNotFound] = useState(false);
  const [commentsEnabled, setCommentsEnabled] = useState(true);
  const [shareMessage, setShareMessage] = useState("");
  const [commentName, setCommentName] = useState("");
  const [commentMessage, setCommentMessage] = useState("");
  const [commentStatus, setCommentStatus] = useState("");
  const [comments, setComments] = useState<ReaderComment[]>([]);
  const [readingProgress, setReadingProgress] = useState(0);
  const focusMode = useSyncExternalStore(subscribeFocusMode, getFocusMode, () => false);
  const articleRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const updateReadingState = () => {
      const article = articleRef.current;
      if (!article) return;
      const rect = article.getBoundingClientRect();
      const total = article.offsetHeight - window.innerHeight;
      const passed = Math.min(total, Math.max(0, -rect.top));
      setReadingProgress(total > 0 ? Math.round((passed / total) * 100) : 0);
    };
    updateReadingState();
    window.addEventListener("scroll", updateReadingState, { passive: true });
    window.addEventListener("resize", updateReadingState);
    return () => {
      window.removeEventListener("scroll", updateReadingState);
      window.removeEventListener("resize", updateReadingState);
    };
  }, [article]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const stories = JSON.parse(saved) as CmsStory[];
          const matchingStory = stories.find((story) => story.slug === slug);
          const found = matchingStory
            && (matchingStory.kind === "news" || matchingStory.kind === "breaking")
            && matchingStory.status === "Published"
            && (matchingStory.kind !== "breaking" || (matchingStory.live === true && (!matchingStory.expiresAt || new Date(matchingStory.expiresAt).getTime() > Date.now())))
            ? matchingStory
            : null;
          if (found) {
            const body = found.body?.split(/\n{2,}/).map((paragraph) => paragraph.trim()).filter(Boolean) ?? [];
            setArticle({
              id: `cms-${found.id}`,
              slug: found.slug,
              title: found.title,
              summary: found.excerpt,
              excerpt: found.excerpt,
              content: body.length ? body : [found.excerpt],
              category: found.category as Article["category"],
              author: found.author,
              authorRole: "Pulse Daily contributor",
              date: found.date,
              readTime: `${Math.max(1, Math.ceil((body.join(" ").split(/\s+/).length || 200) / 200))} min read`,
              image: found.image || fallbackImage,
              imageAlt: found.imageAlt || found.title,
              imageCaption: found.imageCaption,
              source: found.source,
              location: found.location,
              updatedAt: found.updatedAt,
              keyTakeaways: found.keyTakeaways,
              isBreaking: found.kind === "breaking",
              tags: found.tags ?? [],
              status: "published",
            });
            if (found.comments) {
              const savedComments = localStorage.getItem(`pulse-comments-${slug}`);
              if (savedComments) setComments((JSON.parse(savedComments) as ReaderComment[]).filter((comment) => comment.status === "Approved"));
            }
            setCommentsEnabled(found.comments ?? true);
            setNotFound(false);
            return;
          }
          if (matchingStory) {
            setArticle(null);
            setNotFound(true);
            return;
          }
        }
        const fallback = getArticleBySlug(slug);
        if (fallback?.status === "published") {
          setArticle(fallback);
          setNotFound(false);
        } else {
          setArticle(null);
          setNotFound(true);
        }
      } catch (error) {
        console.error("Unable to load this story from the local newsroom store.", error);
        const fallback = getArticleBySlug(slug);
        setArticle(fallback?.status === "published" ? fallback : null);
        setNotFound(!fallback || fallback.status !== "published");
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [slug]);

  const related = useMemo(() => article ? articles
    .filter((item) => item.status === "published" && item.slug !== article.slug)
    .map((item) => ({ item, score: Number(item.category === article.category) + item.tags.filter((tag) => article.tags.includes(tag)).length }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ item }) => item) : [], [article]);
  const trending = useMemo(() => article ? articles
    .filter((item) => item.status === "published" && item.slug !== article.slug)
    .map((item) => ({ item, score: Number(item.category === article.category) * 3 + item.tags.filter((tag) => article.tags.includes(tag)).length * 2 + Number(Boolean(item.trending)) }))
    .sort((a, b) => b.score - a.score || new Date(b.item.date).getTime() - new Date(a.item.date).getTime())
    .slice(0, 5)
    .map(({ item }) => item) : [], [article]);

  const share = useCallback(async (service: string) => {
    const url = window.location.href;
    const encoded = encodeURIComponent(url);
    const title = encodeURIComponent(article?.title ?? "");
    const destinations: Record<string, string> = {
      WhatsApp: `https://wa.me/?text=${title}%20${encoded}`,
      Facebook: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
      X: `https://twitter.com/intent/tweet?text=${title}&url=${encoded}`,
      LinkedIn: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`,
    };

    if (service === "Copy link") {
      try {
        await navigator.clipboard.writeText(url);
        setShareMessage("Link copied");
      } catch {
        setShareMessage("Copy unavailable — use your browser’s address bar");
      }
      window.setTimeout(() => setShareMessage(""), 2800);
      return;
    }
    window.open(destinations[service], "_blank", "noopener,noreferrer,width=680,height=520");
  }, [article]);

  useEffect(() => {
    const shareFromHeader = () => void share("Copy link");
    window.addEventListener("pulse-share-story", shareFromHeader);
    return () => window.removeEventListener("pulse-share-story", shareFromHeader);
  }, [share]);

  const submitComment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!article || !commentName.trim() || !commentMessage.trim()) return;
    const pending = { id: crypto.randomUUID(), name: commentName.trim(), message: commentMessage.trim(), createdAt: new Date().toISOString(), status: "Pending review" as const };
    const saved = localStorage.getItem(`pulse-comments-${slug}`);
    const existing = saved ? JSON.parse(saved) as ReaderComment[] : [];
    localStorage.setItem(`pulse-comments-${slug}`, JSON.stringify([pending, ...existing]));
    setCommentName("");
    setCommentMessage("");
    setCommentStatus("Thanks for joining the conversation. Your comment is awaiting moderation.");
  };
  const toggleFocusMode = () => {
    sessionStorage.setItem("pulse-reading-focus", String(!focusMode));
    window.dispatchEvent(new Event("pulse-reading-focus-change"));
  };

  if (notFound) return <main className="public-news-page"><SiteHeader /><section className="public-article-not-found"><span>404</span><h1>Article not found</h1><p>The story may have been moved or removed.</p><div><Link href="/news">Back to News</Link><Link href="/news">View latest news</Link></div></section><SiteFooter /></main>;
  if (!article) return <main className="public-news-page"><SiteHeader /><div className="public-article-loading" role="status" aria-label="Loading story"><span /><span /><span /><span /></div><SiteFooter /></main>;

  const readMinutes = Math.max(1, Math.ceil(article.content.join(" ").split(/\s+/).filter(Boolean).length / 200));
  const articleUrl = absoluteUrl(`/news/${article.slug}`);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.summary,
    image: [article.image],
    datePublished: article.date,
    dateModified: article.updatedAt || article.date,
    author: { "@type": "Person", name: article.author },
    articleSection: article.category,
    mainEntityOfPage: articleUrl,
    publisher: { "@type": "Organization", name: "Pulse Daily" },
  };

  return (
    <main className={`public-news-page ${focusMode ? "reading-focus-mode" : ""}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <div className="public-reading-progress" style={{ width: `${readingProgress}%` }} aria-hidden="true" />
      <SiteHeader />
      <BreakingTicker />
      <div className="public-article-breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/news">News</Link><span>/</span><Link href={`/categories/${article.category.toLowerCase()}`}>{article.category}</Link></div>
      <header className="public-article-heading">
        {article.isBreaking && <span className="public-article-breaking-label">LIVE BREAKING</span>}
        <Link className="news-category-label" href={`/categories/${article.category.toLowerCase()}`}>{article.category}</Link>
        <h1>{article.title}</h1>
        <p>{article.summary}</p>
        <div className="public-article-byline"><span className="public-author-avatar">{article.author.split(" ").map((part) => part[0]).join("")}</span><span><strong>{article.author}</strong><small>{article.authorRole}</small></span><i /><span className="public-article-dates"><time dateTime={article.date}>Published {formatDate(article.date)}</time>{article.updatedAt && <time dateTime={article.updatedAt}>Updated {formatDate(article.updatedAt)}</time>}</span><span className="byline-read-time">{readMinutes} min read</span><button className="byline-share" onClick={() => void share("Copy link")}>Share ↗</button></div>
      </header>
      <figure className="public-article-hero-image"><Image src={article.image || fallbackImage} alt={article.imageAlt || article.title} fill priority sizes="(max-width: 720px) 100vw, 1200px" className="news-image" /><figcaption>{article.imageCaption || article.imageAlt || article.title}</figcaption></figure>
      <div className="public-article-reading-layout">
        <article className="public-article-body" ref={articleRef}>
          <div className="public-article-tools"><button onClick={toggleFocusMode} aria-pressed={focusMode}>{focusMode ? "Exit focus mode" : "Focus reading"}</button><span>{readMinutes} min read</span></div>
          {article.keyTakeaways?.length ? <section className="public-article-takeaways"><h2>Key takeaways</h2><ul>{article.keyTakeaways.map((takeaway, index) => <li key={index}>{takeaway}</li>)}</ul></section> : null}
          <div className="public-article-prose"><StoryBlocks blocks={article.content} /></div>
          {(article.location || article.source) && <p className="public-article-attribution">{[article.location, article.source && `Source: ${article.source}`].filter(Boolean).join(" · ")}</p>}
          <div className="public-article-tags"><strong>Topics</strong>{article.tags.map((tag) => <Link key={tag} href={`/search?q=${encodeURIComponent(tag)}`}>#{tag}</Link>)}</div>
          <section className="public-article-engagement" aria-label="Share this story"><div><span className="news-section-kicker">PASS IT ON</span><h2>Share this story</h2></div><div className="public-article-share">{["WhatsApp", "Facebook", "X", "LinkedIn", "Copy link"].map((service) => <button key={service} aria-label={`Share on ${service}`} onClick={() => void share(service)}>{service === "Copy link" ? "↗" : service[0]}</button>)}{shareMessage && <small role="status">{shareMessage}</small>}</div></section>
          <section className="public-author-card"><span className="public-author-avatar large">{article.author.split(" ").map((part) => part[0]).join("")}</span><div><span>ABOUT THE AUTHOR</span><h2>{article.author}</h2><p>{article.authorRole}. Reporting on the people, ideas, and events shaping our region.</p><Link href={`/search?q=${encodeURIComponent(article.author)}`}>More stories by {article.author} <ArrowIcon /></Link></div></section>
        </article>
        <aside className="public-article-discovery"><span className="news-section-kicker">STAY INFORMED</span><h2>Trending now</h2>{trending.map((item, index) => <Link className="public-trending-story" href={`/news/${item.slug}`} key={item.id}><b>{String(index + 1).padStart(2, "0")}</b><span><small>{item.category}</small><strong>{item.title}</strong></span></Link>)}<button className="public-focus-toggle" onClick={toggleFocusMode} aria-pressed={focusMode}>{focusMode ? "Exit focus reading" : "Focus reading"}</button></aside>
      </div>
      <section className="public-related-news"><div><span className="news-section-kicker">KEEP READING</span><h2>More on this story</h2></div><div className="public-related-grid">{related.map((item) => <article key={item.id}><Link href={`/news/${item.slug}`}><Image src={item.image} alt="" width={420} height={260} sizes="(max-width: 720px) 120px, 180px" /><div className="public-related-copy"><span>{item.category}</span><h3>{item.title}</h3><time dateTime={item.date}>{new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(item.date))}</time></div></Link></article>)}</div></section>
      {commentsEnabled && <section className="public-comments">
        <div className="public-comments-inner"><div><span className="news-section-kicker">COMMUNITY</span><h2>Comments <small>{comments.length}</small></h2><p className="public-moderation-note">Comments are reviewed by our editors before appearing publicly.</p></div>
          <form onSubmit={submitComment}><h3>Join the conversation</h3><label>Your name<input required value={commentName} onChange={(event) => setCommentName(event.target.value)} /></label><label>Your comment<textarea required rows={4} value={commentMessage} onChange={(event) => setCommentMessage(event.target.value)} /></label><button type="submit">Submit for review</button>{commentStatus && <p role="status">{commentStatus}</p>}</form>
          <div className="public-reader-comments">{comments.map((comment) => <article key={comment.id}><span className="reader-comment-avatar" aria-hidden="true">{comment.name.trim().charAt(0).toUpperCase()}</span><div><strong>{comment.name}</strong><span>{new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(comment.createdAt))}</span><p>{comment.message}</p></div></article>)}</div>
        </div>
      </section>}
      <Newsletter />
      <SiteFooter />
    </main>
  );
}
