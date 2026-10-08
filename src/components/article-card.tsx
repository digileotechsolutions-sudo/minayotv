import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/news";

export function ArticleCard({ article, compact = false }: { article: Article; compact?: boolean }) {
  return (
    <article className={`group border-b border-zinc-200 py-5 ${compact ? "grid gap-3 sm:grid-cols-[220px_1fr]" : ""}`}>
      <Link href={`/news/${article.slug}`} className={`relative block overflow-hidden bg-zinc-100 ${compact ? "aspect-[16/10] sm:aspect-auto" : "aspect-[16/10]"}`}>
        <Image src={article.image} alt={article.imageAlt} fill sizes={compact ? "220px" : "(max-width: 768px) 100vw, 50vw"} className="object-cover transition duration-500 group-hover:scale-105" />
      </Link>
      <div className={compact ? "flex flex-col justify-center" : "pt-4"}>
        <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-red-600">
          <span>{article.category}</span><span className="h-1 w-1 rounded-full bg-zinc-400" /><span className="font-medium normal-case tracking-normal text-zinc-500">{article.readTime}</span>
        </div>
        <Link href={`/news/${article.slug}`} className="text-xl font-bold leading-tight tracking-[-0.025em] text-zinc-950 transition hover:text-red-600 sm:text-2xl">{article.title}</Link>
        {!compact && <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-600">{article.excerpt}</p>}
        <p className="mt-3 text-xs text-zinc-500">By {article.author} · {new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(article.date))}</p>
      </div>
    </article>
  );
}
