import { articles } from "@/lib/news";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const items = articles
    .filter((article) => article.status === "published")
    .map(
      (article) =>
        `<item><title><![CDATA[${article.title}]]></title><link>${absoluteUrl(`/news/${article.slug}`)}</link><guid isPermaLink="true">${absoluteUrl(`/news/${article.slug}`)}</guid><pubDate>${new Date(article.date).toUTCString()}</pubDate><description><![CDATA[${article.summary}]]></description><category><![CDATA[${article.category}]]></category></item>`,
    )
    .join("");

  const xml = `<rss version="2.0"><channel><title>Pulse Daily</title><link>${absoluteUrl("/")}</link><description>Independent reporting and analysis</description>${items}</channel></rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
