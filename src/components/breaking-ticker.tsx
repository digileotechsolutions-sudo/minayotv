"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type BreakingItem = {
  id: string;
  title: string;
  slug: string;
  status: string;
  live?: boolean;
  expiresAt?: string;
};

const STORAGE_KEY = "pulse-daily-admin-content-v2";

export function BreakingTicker() {
  const [items, setItems] = useState<BreakingItem[]>([]);

  useEffect(() => {
    const update = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
          setItems([]);
          return;
        }
        const content: unknown = JSON.parse(stored);
        if (!Array.isArray(content)) {
          setItems([]);
          return;
        }
        const now = Date.now();
        setItems((content as BreakingItem[]).filter((item) =>
          item.status === "Published"
          && item.live === true
          && (!item.expiresAt || new Date(item.expiresAt).getTime() > now),
        ));
      } catch (error) {
        console.error("Unable to load breaking news from the local newsroom store.", error);
        setItems([]);
      }
    };
    update();
    window.addEventListener("storage", update);
    window.addEventListener("pulse-daily-content-updated", update);
    const timer = window.setInterval(update, 60_000);
    return () => {
      window.removeEventListener("storage", update);
      window.removeEventListener("pulse-daily-content-updated", update);
      window.clearInterval(timer);
    };
  }, []);

  if (!items.length) return null;
  const loop = [...items, ...items];

  return (
    <section className="public-breaking" id="breaking-news" aria-label="Breaking news">
      <div className="public-breaking-label"><span />BREAKING NEWS</div>
      <div className="public-breaking-track">
        <div className="public-breaking-marquee">
          {loop.map((item, index) => <Link key={`${item.id}-${index}`} href={`/news/${item.slug}`} className="public-breaking-item">
            {item.live && <span className="public-live-badge">LIVE</span>}
            {item.title}<span aria-hidden="true">↗</span>
          </Link>)}
        </div>
      </div>
      <Link href="/news" className="public-breaking-all">All updates <span>→</span></Link>
    </section>
  );
}
