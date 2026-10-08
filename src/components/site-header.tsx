"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { CloseIcon, MenuIcon, SearchIcon } from "@/components/icons";

const categories = [
  ["Kenya", "/categories/kenya"],
  ["Africa", "/categories/africa"],
  ["World", "/categories/world"],
  ["Politics", "/categories/politics"],
  ["Business", "/categories/business"],
  ["Technology", "/categories/technology"],
  ["Sports", "/categories/sports"],
  ["Entertainment", "/categories/entertainment"],
] as const;

const primaryLinks = [
  { label: "Home", href: "/" },
  { label: "News", href: "/news" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const articlePage = /^\/(?:news|articles)\/[^/]+/.test(pathname);
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const drawerRef = useRef<HTMLElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (menuOpen) drawerRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    if (searchOpen) searchRef.current?.focus();
    if (!menuOpen && !searchOpen && !categoriesOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setCategoriesOpen(false);
        setSearchOpen(false);
      }
      if (menuOpen && event.key === "Tab" && drawerRef.current) {
        const focusable = drawerRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!(event.target instanceof Element)) return;
      if (!event.target.closest(".floating-header")) {
        setCategoriesOpen(false);
        setSearchOpen(false);
      }
    };
    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOnOutsideClick);
    };
  }, [categoriesOpen, menuOpen, searchOpen]);

  const active = (href: string) => href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
  const categoryActive = pathname.startsWith("/categories/");
  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = query.trim();
    if (!value) {
      searchRef.current?.focus();
      return;
    }
    setSearchOpen(false);
    setMenuOpen(false);
    router.push(`/search?q=${encodeURIComponent(value)}`);
  };
  const shareArticle = () => window.dispatchEvent(new Event("pulse-share-story"));

  return (
    <>
      <div className={`floating-header-spacer ${articlePage ? "is-article-spacer" : ""}`} aria-hidden="true" />
      <header className={`floating-header ${articlePage ? "is-article-header" : ""}`}>
        <div className="floating-header-bar">
          <button className="floating-header-icon mobile-menu-trigger" onClick={() => setMenuOpen(true)} aria-label="Open navigation" aria-expanded={menuOpen} aria-controls="site-mobile-drawer">
            <MenuIcon />
          </button>
          {articlePage && <button className="article-back-link article-back-mobile" onClick={() => router.push("/news")} aria-label="Back to News">←</button>}
          {articlePage && <Link className="article-back-link" href="/news" aria-label="Back to News">← <span>News</span></Link>}
          <Link className="floating-header-logo" href="/" aria-label="Pulse Daily home">Pulse <span>Daily</span></Link>
          <nav className="floating-header-nav" aria-label="Primary navigation">
            {primaryLinks.map((item) => <Link key={item.href} href={item.href} onClick={() => setCategoriesOpen(false)} aria-current={active(item.href) ? "page" : undefined} className={active(item.href) ? "is-active" : ""}>{item.label}</Link>)}
            <div className="floating-categories">
              <button className={categoryActive ? "is-active" : ""} onClick={() => setCategoriesOpen((open) => !open)} aria-expanded={categoriesOpen} aria-controls="site-category-menu">Categories <span aria-hidden="true">⌄</span></button>
              {categoriesOpen && <div className="floating-category-menu" id="site-category-menu" role="menu" aria-label="News categories">{categories.map(([label, href]) => <Link key={href} href={href} onClick={() => setCategoriesOpen(false)} role="menuitem" aria-current={active(href) ? "page" : undefined}>{label}</Link>)}</div>}
            </div>
          </nav>
          <div className="floating-header-actions">
            <button className="floating-header-icon" onClick={() => { setSearchOpen((open) => !open); setCategoriesOpen(false); }} aria-label={searchOpen ? "Close search" : "Search stories"} aria-expanded={searchOpen} aria-controls="site-search-panel">
              {searchOpen ? <CloseIcon /> : <SearchIcon />}
            </button>
            {articlePage && <button className="article-header-share" onClick={shareArticle} aria-label="Share this story">Share</button>}
            {!articlePage && <button className="floating-header-icon mobile-menu-trigger mobile-more-trigger" onClick={() => setMenuOpen(true)} aria-label="Open more navigation"><span aria-hidden="true">⋮</span></button>}
          </div>
          {searchOpen && <form className="floating-search-panel" id="site-search-panel" role="search" onSubmit={submitSearch}>
            <SearchIcon aria-hidden="true" />
            <label className="sr-only" htmlFor="site-global-search">Search news, blogs and stories</label>
            <input ref={searchRef} id="site-global-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search news, blogs and stories..." autoComplete="off" />
            <button type="submit">Search</button>
          </form>}
        </div>
      </header>
      {menuOpen && <div className="floating-drawer-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setMenuOpen(false); }}>
        <nav className="floating-mobile-drawer" id="site-mobile-drawer" ref={drawerRef} role="dialog" aria-modal="true" aria-label="Site navigation">
          <div className="floating-drawer-heading"><Link className="floating-header-logo" href="/">Pulse <span>Daily</span></Link><button className="floating-header-icon" onClick={() => setMenuOpen(false)} aria-label="Close navigation"><CloseIcon /></button></div>
          <div className="floating-drawer-links">{primaryLinks.map((item) => <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} aria-current={active(item.href) ? "page" : undefined}>{item.label}</Link>)}</div>
          <section className="floating-drawer-categories"><h2>Explore categories</h2><div>{categories.map(([label, href]) => <Link key={href} href={href} onClick={() => setMenuOpen(false)} aria-current={active(href) ? "page" : undefined}>{label}</Link>)}</div></section>
          <Link className="floating-drawer-trending" href="/#trending" onClick={() => setMenuOpen(false)}>Trending stories <span>→</span></Link>
          <button className="floating-drawer-search" onClick={() => { setMenuOpen(false); setSearchOpen(true); }}><SearchIcon aria-hidden="true" /> Search the newsroom</button>
        </nav>
      </div>}
    </>
  );
}
