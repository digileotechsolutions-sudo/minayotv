"use client";

import { FormEvent, MouseEvent, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase";

type ContentKind = "news" | "blog" | "breaking";
type ContentStatus = "Draft" | "Pending" | "Scheduled" | "Published" | "Archived" | "Expired";
type Section =
  | "Dashboard"
  | "News"
  | "Blog"
  | "Breaking News"
  | "Categories"
  | "Tags"
  | "Media Library"
  | "Comments"
  | "Users / Authors"
  | "Analytics"
  | "SEO"
  | "Activity Log"
  | "Settings";
type SearchResult = { label: string; detail: string; section: Section; item?: ContentItem };

type ContentItem = {
  id: string;
  kind: ContentKind;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  author: string;
  status: ContentStatus;
  date: string;
  views: number;
  featured: boolean;
  trending: boolean;
  comments: boolean;
  image: string;
  body: string;
  tags: string[];
  imageCaption: string;
  imageAlt?: string;
  keyTakeaways?: string[];
  updatedAt?: string;
  location: string;
  source: string;
  live?: boolean;
  priority?: "High" | "Normal" | "Low";
  expiresAt?: string;
  seoTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  canonicalUrl?: string;
  socialTitle?: string;
  socialDescription?: string;
};

const STORE_KEY = "pulse-daily-admin-content-v2";
const DEMO_AUTH_KEY = "pulse-daily-demo-auth";
const categories = ["Kenya", "Africa", "World", "Politics", "Business", "Technology", "Sports", "Entertainment", "Lifestyle"];
const authors = ["Amina Otieno", "Daniel Mwangi", "Sofia Laurent", "Noah Bensley", "Elena Karanja"];
const navigation: { label: string; items: Section[] }[] = [
  { label: "WORKSPACE", items: ["Dashboard", "News", "Blog", "Breaking News"] },
  { label: "LIBRARY", items: ["Categories", "Tags", "Media Library", "Comments"] },
  { label: "INSIGHTS", items: ["Users / Authors", "Analytics", "SEO", "Activity Log"] },
  { label: "PREFERENCES", items: ["Settings"] },
];

const seedContent: ContentItem[] = [
  { id: "n-1", kind: "news", title: "Kenya election watch continues as turnout edges higher", slug: "kenya-election-watch", excerpt: "Polling stations still report strong turnout and late arrivals across Nairobi, Kisumu, and Mombasa.", category: "Kenya", author: "Amina Otieno", status: "Published", date: "2026-10-06T09:00:00.000Z", views: 18420, featured: true, trending: true, comments: true, image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=80", body: "", tags: ["Kenya", "Politics"], imageCaption: "", location: "Nairobi", source: "", seoTitle: "", metaDescription: "" },
  { id: "n-2", kind: "news", title: "African cities expand clean energy access ahead of climate summit", slug: "africa-new-energy", excerpt: "Urban planners are leaning into solar storage and transit electrification to meet rising demand.", category: "Africa", author: "Daniel Mwangi", status: "Draft", date: "2026-10-05T12:00:00.000Z", views: 0, featured: false, trending: false, comments: true, image: "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=900&q=80", body: "", tags: ["Africa", "Climate"], imageCaption: "", location: "Nairobi", source: "", seoTitle: "", metaDescription: "" },
  { id: "n-3", kind: "news", title: "Startup funding shifts toward practical AI tools", slug: "practical-ai-tools", excerpt: "Investors are backing automation products that solve real operational challenges.", category: "Technology", author: "Sofia Laurent", status: "Scheduled", date: "2026-10-08T08:30:00.000Z", views: 0, featured: false, trending: true, comments: true, image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=900&q=80", body: "", tags: ["Technology", "AI"], imageCaption: "", location: "", source: "", seoTitle: "", metaDescription: "" },
  { id: "b-1", kind: "blog", title: "The quiet craft of reporting from the field", slug: "craft-of-field-reporting", excerpt: "A correspondent's notebook on listening first and finding the human detail.", category: "Lifestyle", author: "Noah Bensley", status: "Published", date: "2026-10-04T13:20:00.000Z", views: 6340, featured: true, trending: false, comments: true, image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80", body: "", tags: ["Journalism", "Writing"], imageCaption: "", location: "", source: "", seoTitle: "", metaDescription: "" },
  { id: "b-2", kind: "blog", title: "Why local design deserves a global audience", slug: "local-design-global-audience", excerpt: "Independent makers are bringing a distinct point of view to the world stage.", category: "Business", author: "Elena Karanja", status: "Draft", date: "2026-10-03T11:15:00.000Z", views: 0, featured: false, trending: false, comments: true, image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80", body: "", tags: ["Design", "Business"], imageCaption: "", location: "", source: "", seoTitle: "", metaDescription: "" },
  { id: "x-1", kind: "breaking", title: "LIVE: Regional leaders open the Nairobi climate summit", slug: "nairobi-climate-summit-live", excerpt: "Delegations have arrived for the opening session at the Kenyatta International Convention Centre.", category: "Kenya", author: "Pulse Daily Desk", status: "Published", date: "2026-10-06T08:45:00.000Z", views: 9120, featured: true, trending: true, comments: false, image: "", body: "", tags: [], imageCaption: "", location: "", source: "", live: true, priority: "High", expiresAt: "2026-10-07T08:45" },
];

const blankForm = {
  title: "",
  slug: "",
  excerpt: "",
  category: "Kenya",
  author: authors[0],
  status: "Draft" as ContentStatus,
  date: new Date().toISOString().slice(0, 16),
  image: "",
  body: "",
  tags: "",
  imageCaption: "",
  imageAlt: "",
  keyTakeaways: "",
  location: "",
  source: "",
  featured: false,
  trending: false,
  comments: true,
  live: false,
  priority: "Normal" as "High" | "Normal" | "Low",
  expiresAt: "",
  seoTitle: "",
  metaDescription: "",
  focusKeyword: "",
  canonicalUrl: "",
  socialTitle: "",
  socialDescription: "",
};

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true as const };
  const paths: Record<string, ReactNode> = {
    Dashboard: <><rect x="3" y="3" width="8" height="8" rx="1.5" /><rect x="13" y="3" width="8" height="5" rx="1.5" /><rect x="13" y="10" width="8" height="11" rx="1.5" /><rect x="3" y="13" width="8" height="8" rx="1.5" /></>,
    News: <><path d="M4 4h16v16H4z" /><path d="M8 8h8M8 12h8M8 16h4" /></>,
    Blog: <><path d="M5 4h14v16H5z" /><path d="M8 8h8M8 12h8M8 16h5" /></>,
    "Breaking News": <><path d="m12 3 9 17H3L12 3Z" /><path d="M12 9v4M12 17h.01" /></>,
    Categories: <><rect x="3" y="4" width="8" height="7" rx="1.5" /><rect x="13" y="4" width="8" height="7" rx="1.5" /><rect x="3" y="13" width="8" height="7" rx="1.5" /><rect x="13" y="13" width="8" height="7" rx="1.5" /></>,
    Tags: <><path d="m20 13-7 7-10-10V3h7l10 10Z" /><circle cx="7.5" cy="7.5" r=".8" /></>,
    "Media Library": <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="8.5" cy="9" r="1.5" /><path d="m21 15-5-5L5 20" /></>,
    Comments: <><path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H5l-1 2v-5.2A7.5 7.5 0 1 1 20 11.5Z" /><path d="M8 11h.01M12 11h.01M16 11h.01" /></>,
    "Users / Authors": <><circle cx="9" cy="8" r="3" /><path d="M3.5 20a5.5 5.5 0 0 1 11 0M16 5.5a3 3 0 0 1 0 5.8M17 14a5 5 0 0 1 3.5 4.8" /></>,
    Analytics: <><path d="M4 20V4M4 20h17" /><path d="m7 15 4-4 3 2 6-7" /></>,
    SEO: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5M8 10.5h5M10.5 8v5" /></>,
    "Activity Log": <><path d="M4 12h4l2-6 4 12 2-6h4" /><path d="M3 4h18v16H3z" /></>,
    Settings: <><circle cx="12" cy="12" r="3" /><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.7 1l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.7-1l-1.7.7-1.4-2.4 1.4-1.1a8 8 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.7.7a8 8 0 0 1 1.7-1l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.7 1l1.7-.7 1.4 2.4-1.4 1.1a8 8 0 0 1 0 2Z" transform="translate(-1 -1) scale(1.08)" /></>,
    Search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" /></>,
    Plus: <><path d="M12 5v14M5 12h14" /></>,
    Close: <><path d="m6 6 12 12M18 6 6 18" /></>,
    Chevron: <path d="m9 18 6-6-6-6" />,
    Menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    More: <><circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /></>,
    Eye: <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" /><circle cx="12" cy="12" r="2.5" /></>,
    Calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    Arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    Upload: <><path d="M12 16V4m-4 4 4-4 4 4" /><path d="M4 16v4h16v-4" /></>,
    Bell: <><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
    Filter: <><path d="M4 6h16M7 12h10m-7 6h4" /></>,
    Logout: <><path d="M10 17l5-5-5-5M15 12H3" /><path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7" /></>,
  };
  return <svg {...common}>{paths[name] ?? <circle cx="12" cy="12" r="8" />}</svg>;
}

function StatusBadge({ status }: { status: ContentStatus }) {
  const classes: Record<ContentStatus, string> = {
    Published: "status-published",
    Draft: "status-draft",
    Scheduled: "status-scheduled",
    Pending: "status-pending",
    Archived: "status-archived",
    Expired: "status-expired",
  };
  return <span className={`admin-status ${classes[status]}`}><span />{status}</span>;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(date));
}

function countViews(value: number) {
  return value >= 1000 ? `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k` : value.toLocaleString();
}

export default function AdminDashboard() {
  const router = useRouter();
  const [content, setContent] = useState<ContentItem[]>(seedContent);
  const [isContentLoaded, setIsContentLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState<Section>("Dashboard");
  const [search, setSearch] = useState("");
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All status");
  const [categoryFilter, setCategoryFilter] = useState("All categories");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editorKind, setEditorKind] = useState<ContentKind | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(blankForm);
  const [toast, setToast] = useState("");
  const [categoryList, setCategoryList] = useState(categories);
  const [approvedComments, setApprovedComments] = useState(["cm-1"]);
  const [mediaFiles, setMediaFiles] = useState<{ name: string; url: string; size: string; type: string }[]>([]);
  const editorBodyRef = useRef<HTMLTextAreaElement>(null);
  const globalSearchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const demoEnabled = localStorage.getItem(DEMO_AUTH_KEY) === "enabled";
    const client = getSupabaseBrowser();
    if (!demoEnabled && !client) {
      router.replace("/admin/login");
      return;
    }
    try {
      const saved = localStorage.getItem(STORE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          queueMicrotask(() => {
            setContent(parsed as ContentItem[]);
            setIsContentLoaded(true);
          });
        } else {
          queueMicrotask(() => setIsContentLoaded(true));
        }
      } else {
        queueMicrotask(() => setIsContentLoaded(true));
      }
    } catch (error) {
      console.error("Unable to load locally saved newsroom content.", error);
      queueMicrotask(() => {
        setToast("Saved content could not be loaded.");
        setIsContentLoaded(true);
      });
    }
  }, [router]);

  useEffect(() => {
    if (typeof window !== "undefined" && isContentLoaded) {
      localStorage.setItem(STORE_KEY, JSON.stringify(content));
      window.dispatchEvent(new Event("pulse-daily-content-updated"));
    }
  }, [content, isContentLoaded]);

  useEffect(() => {
    const onQuickSearch = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (event.shiftKey) {
          setGlobalSearchOpen(false);
          setQuickActionsOpen((open) => !open);
        } else {
          setQuickActionsOpen(false);
          setGlobalSearchOpen(true);
          globalSearchRef.current?.focus();
        }
      }
    };
    window.addEventListener("keydown", onQuickSearch);
    return () => window.removeEventListener("keydown", onQuickSearch);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const updateScheduledContent = () => {
      const now = Date.now();
      const expired = content.some((item) => item.kind === "breaking" && item.status !== "Expired" && item.expiresAt && new Date(item.expiresAt).getTime() <= now);
      const publishable = content.some((item) => item.status === "Scheduled" && new Date(item.date).getTime() <= now);
      if (!expired && !publishable) return;
      setContent((current) => current.map((item) => {
        if (item.kind === "breaking" && item.status !== "Expired" && item.expiresAt && new Date(item.expiresAt).getTime() <= now) return { ...item, status: "Expired", live: false };
        if (item.status === "Scheduled" && new Date(item.date).getTime() <= now) return { ...item, status: "Published" };
        return item;
      }));
      setToast(expired ? "An expired breaking alert was moved to inactive." : "A scheduled story has been published.");
    };
    updateScheduledContent();
    const timer = window.setInterval(updateScheduledContent, 60_000);
    return () => window.clearInterval(timer);
  }, [content]);

  const news = content.filter((item) => item.kind === "news");
  const blogs = content.filter((item) => item.kind === "blog");
  const breaking = content.filter((item) => item.kind === "breaking");
  const filteredContent = useMemo(() => {
    let kind: ContentKind | null = null;
    if (activeSection === "News") kind = "news";
    if (activeSection === "Blog") kind = "blog";
    if (activeSection === "Breaking News") kind = "breaking";
    return content.filter((item) => {
      const matchesKind = !kind || item.kind === kind;
      const matchesSearch = `${item.title} ${item.author} ${item.category} ${item.slug}`.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All status" || item.status === statusFilter;
      const matchesCategory = categoryFilter === "All categories" || item.category === categoryFilter;
      return matchesKind && matchesSearch && matchesStatus && matchesCategory;
    });
  }, [activeSection, categoryFilter, content, search, statusFilter]);
  const globalResults = useMemo<SearchResult[]>(() => {
    const query = search.trim().toLowerCase();
    if (!query) return [];
    const matchingContent = content.filter((item) => `${item.title} ${item.author} ${item.category} ${item.slug}`.toLowerCase().includes(query)).slice(0, 5).map((item) => ({ label: item.title, detail: `${item.kind === "breaking" ? "Breaking news" : item.kind === "blog" ? "Blog post" : "News"} · ${item.author}`, section: (item.kind === "breaking" ? "Breaking News" : item.kind === "blog" ? "Blog" : "News") as Section, item }));
    const matchingCategories = categoryList.filter((item) => item.toLowerCase().includes(query)).slice(0, 2).map((item) => ({ label: item, detail: "Category", section: "Categories" as Section }));
    const matchingAuthors = authors.filter((item) => item.toLowerCase().includes(query)).slice(0, 2).map((item) => ({ label: item, detail: "Author", section: "Users / Authors" as Section }));
    const matchingTags = Array.from(new Set(content.flatMap((item) => item.tags))).filter((item) => item.toLowerCase().includes(query)).slice(0, 2).map((item) => ({ label: item, detail: "Tag", section: "Tags" as Section }));
    const matchingMedia = mediaFiles.filter((item) => item.name.toLowerCase().includes(query)).slice(0, 2).map((item) => ({ label: item.name, detail: "Media", section: "Media Library" as Section }));
    return [...matchingContent, ...matchingCategories, ...matchingTags, ...matchingAuthors, ...matchingMedia].slice(0, 7);
  }, [categoryList, content, mediaFiles, search]);

  const stats = [
    { label: "Total news articles", value: news.length.toString(), delta: "+12.8%", icon: "News", tint: "blue" },
    { label: "Total blog posts", value: blogs.length.toString(), delta: "+8.2%", icon: "Blog", tint: "violet" },
    { label: "Published articles", value: content.filter((item) => item.kind !== "breaking" && item.status === "Published").length.toString(), delta: "+4.6%", icon: "Arrow", tint: "green" },
    { label: "Draft articles", value: content.filter((item) => item.status === "Draft").length.toString(), delta: "Needs review", icon: "Blog", tint: "amber" },
    { label: "Scheduled posts", value: content.filter((item) => item.status === "Scheduled").length.toString(), delta: "Next: Oct 8", icon: "Calendar", tint: "cyan" },
    { label: "Active breaking news", value: breaking.filter((item) => item.live && item.status === "Published").length.toString(), delta: "Live now", icon: "Breaking News", tint: "red" },
    { label: "Total views", value: countViews(content.reduce((sum, item) => sum + item.views, 0)), delta: "+18.4%", icon: "Eye", tint: "indigo" },
    { label: "Comments", value: "248", delta: "18 awaiting review", icon: "Comments", tint: "orange" },
  ];

  const openEditor = (kind: ContentKind, article?: ContentItem) => {
    setEditorKind(kind);
    setEditingId(article?.id ?? null);
    setForm(article ? {
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      category: article.category,
      author: article.author,
      status: article.status,
      date: new Date(article.date).toISOString().slice(0, 16),
      image: article.image,
      body: article.body,
      tags: article.tags.join(", "),
      imageCaption: article.imageCaption,
      imageAlt: article.imageAlt ?? "",
      keyTakeaways: article.keyTakeaways?.join("\n") ?? "",
      location: article.location,
      source: article.source,
      featured: article.featured,
      trending: article.trending,
      comments: article.comments,
      live: article.live ?? false,
      priority: article.priority ?? "Normal",
      expiresAt: article.expiresAt ?? "",
      seoTitle: article.seoTitle ?? "",
      metaDescription: article.metaDescription ?? "",
      focusKeyword: article.focusKeyword ?? "",
      canonicalUrl: article.canonicalUrl ?? "",
      socialTitle: article.socialTitle ?? "",
      socialDescription: article.socialDescription ?? "",
    } : { ...blankForm, status: kind === "breaking" ? "Published" : "Draft", live: kind === "breaking" });
  };

  const closeEditor = () => {
    setEditorKind(null);
    setEditingId(null);
    setForm(blankForm);
  };

  const applyRichText = (format: string) => {
    const textarea = editorBodyRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = form.body.slice(start, end) || (format === "link" ? "link text" : format === "image" ? "image caption" : format === "video" ? "video" : "text");
    const wrappers: Record<string, [string, string]> = {
      bold: ["**", "**"],
      italic: ["*", "*"],
      heading: ["## ", "\n"],
      list: ["- ", ""],
      quote: ["> ", "\n"],
      link: ["[", "](https://)"],
      image: ["![", "](https://)"],
      video: ["<video src=\"", "\" controls></video>"],
      table: ["| Column 1 | Column 2 |\n| --- | --- |\n| ", " |  |"],
      center: ["::: center\n", "\n:::"],
    };
    const [before, after] = wrappers[format];
    const replacement = format === "list" ? selected.split("\n").map((line) => `- ${line}`).join("\n") : `${before}${selected}${after}`;
    const nextBody = `${form.body.slice(0, start)}${replacement}${form.body.slice(end)}`;
    setForm((current) => ({ ...current, body: nextBody }));
    window.requestAnimationFrame(() => {
      textarea.focus();
      const cursor = start + replacement.length;
      textarea.setSelectionRange(cursor, cursor);
    });
  };

  const saveContent = (event: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>, publishNow = false, forcedStatus?: ContentStatus) => {
    event.preventDefault();
    if (!editorKind) return;
    const title = form.title.trim();
    const slug = slugify(form.slug || title);
    if (!title || !slug) {
      setToast("A headline and valid slug are required.");
      return;
    }
    const publicationDate = new Date(form.date);
    if (Number.isNaN(publicationDate.getTime())) {
      setToast("Choose a valid publication date and time.");
      return;
    }
    if (form.expiresAt && Number.isNaN(new Date(form.expiresAt).getTime())) {
      setToast("Choose a valid expiration date and time.");
      return;
    }
    const duplicate = content.some((item) => item.slug === slug && item.id !== editingId);
    if (duplicate) {
      setToast("That slug is already in use. Choose a unique slug.");
      return;
    }
    const previous = content.find((item) => item.id === editingId);
    const item: ContentItem = {
      id: editingId ?? `${editorKind}-${Date.now()}`,
      kind: editorKind,
      title,
      slug,
      excerpt: form.excerpt.trim(),
      category: form.category,
      author: form.author,
      status: publishNow ? "Published" : forcedStatus ?? form.status,
      date: publicationDate.toISOString(),
      views: previous?.views ?? 0,
      featured: form.featured,
      trending: form.trending,
      comments: form.comments,
      image: form.image.trim(),
      body: form.body.trim(),
      tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      imageCaption: form.imageCaption.trim(),
      imageAlt: form.imageAlt.trim(),
      keyTakeaways: form.keyTakeaways.split("\n").map((takeaway) => takeaway.trim()).filter(Boolean),
      updatedAt: previous ? new Date().toISOString() : undefined,
      location: form.location.trim(),
      source: form.source.trim(),
      live: editorKind === "breaking" && form.live,
      priority: editorKind === "breaking" ? form.priority : undefined,
      expiresAt: editorKind === "breaking" ? form.expiresAt : undefined,
      seoTitle: form.seoTitle.trim(),
      metaDescription: form.metaDescription.trim(),
      focusKeyword: form.focusKeyword.trim(),
      canonicalUrl: form.canonicalUrl.trim(),
      socialTitle: form.socialTitle.trim(),
      socialDescription: form.socialDescription.trim(),
    };
    setContent((current) => editingId ? current.map((entry) => entry.id === editingId ? item : entry) : [item, ...current]);
    closeEditor();
    setToast(publishNow ? "Breaking news published and marked live." : `${editorKind === "breaking" ? "Breaking news" : editorKind === "blog" ? "Blog post" : "News article"} ${editingId ? "updated" : "saved"}.`);
  };

  const deleteContent = (id: string) => {
    const entry = content.find((item) => item.id === id);
    if (!entry || !window.confirm(`Delete “${entry.title}”? This action cannot be undone.`)) return;
    setContent((current) => current.filter((item) => item.id !== id));
    setToast("Content deleted.");
  };

  const signOut = () => {
    localStorage.removeItem(DEMO_AUTH_KEY);
    void getSupabaseBrowser()?.auth.signOut();
    router.replace("/admin/login");
  };

  const addCategory = () => {
    const name = window.prompt("Name your new category");
    if (!name?.trim()) return;
    if (categoryList.some((item) => item.toLowerCase() === name.trim().toLowerCase())) {
      setToast("That category already exists.");
      return;
    }
    setCategoryList((current) => [...current, name.trim()]);
    setToast("Category added.");
  };

  const addMedia = (files: FileList | null) => {
    if (!files?.length) return;
    const selected = Array.from(files);
    if (selected.some((file) => !file.type.startsWith("image/") && !file.type.startsWith("video/"))) {
      setToast("Choose image or video files only.");
      return;
    }
    setMediaFiles((current) => [...selected.map((file) => ({ name: file.name, url: URL.createObjectURL(file), size: `${(file.size / 1024 / 1024).toFixed(1)} MB`, type: file.type })), ...current]);
    setToast(`${selected.length} file${selected.length === 1 ? "" : "s"} added to this browser session.`);
  };

  const sectionTitle = activeSection === "Users / Authors" ? "Users & Authors" : activeSection;
  const renderContentRows = (items: ContentItem[], compact = false) => items.map((item) => (
    <div key={item.id} className={`admin-content-row ${compact ? "compact" : ""}`}>
      <div className="admin-story-thumb" style={{ backgroundImage: item.image ? `url("${item.image}")` : undefined }}>
        {!item.image && <Icon name={item.kind === "breaking" ? "Breaking News" : item.kind === "blog" ? "Blog" : "News"} />}
      </div>
      <div className="admin-story-main">
        <div className="admin-story-titleline">
          {item.kind === "breaking" && item.live && <span className="live-dot">LIVE</span>}
          <p className="admin-story-title">{item.title}</p>
        </div>
        <p className="admin-story-meta">{item.category} <span>·</span> {item.author} <span>·</span> {formatDate(item.date)}</p>
      </div>
      {!compact && <span className="admin-table-status"><StatusBadge status={item.status} /></span>}
      {!compact && <span className="admin-view-count"><Icon name="Eye" size={15} />{countViews(item.views)}</span>}
      <div className="admin-row-actions">
        <button title="Edit" aria-label={`Edit ${item.title}`} onClick={() => openEditor(item.kind, item)}><Icon name="More" /></button>
      </div>
    </div>
  ));

  return (
    <div className="admin-shell">
      {isDrawerOpen && <button className="admin-scrim" aria-label="Close navigation" onClick={() => setIsDrawerOpen(false)} />}
      <aside className={`admin-sidebar ${isDrawerOpen ? "is-open" : ""}`}>
        <Link href="/" className="admin-brand" aria-label="Pulse Daily home">
          <span className="admin-brand-mark">P<span>.</span></span>
          <span><strong>pulse<span>daily</span></strong><small>NEWSROOM CMS</small></span>
        </Link>
        <button className="admin-workspace" onClick={() => setActiveSection("Dashboard")}>
          <span className="workspace-avatar">PD</span><span><strong>Pulse Daily</strong><small>Editorial workspace</small></span><Icon name="Chevron" size={15} />
        </button>
        <nav className="admin-navigation" aria-label="Admin navigation">
          {navigation.map((group) => <div className="admin-nav-group" key={group.label}>
            <p className="admin-nav-label">{group.label}</p>
            {group.items.map((item) => <button key={item} className={`admin-nav-item ${activeSection === item ? "active" : ""}`} onClick={() => { setActiveSection(item); setIsDrawerOpen(false); setSearch(""); }}>
              <Icon name={item} size={18} /><span>{item}</span>
              {item === "Comments" && <span className="nav-counter">18</span>}
              {item === "Breaking News" && breaking.some((story) => story.live && story.status === "Published") && <span className="nav-live" />}
            </button>)}
          </div>)}
        </nav>
        <div className="admin-sidebar-bottom">
          <div className="sidebar-help"><span className="help-spark">✳</span><strong>Need a hand?</strong><p>Visit the newsroom help center.</p><button onClick={() => setToast("Help center is coming soon.")}>Open help center <Icon name="Arrow" size={14} /></button></div>
          <button className="admin-profile" onClick={signOut}><span className="profile-avatar">AO</span><span><strong>Amina Otieno</strong><small>Administrator</small></span><Icon name="Logout" size={17} /></button>
        </div>
      </aside>

      <div className="admin-workspace-main">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button className="admin-mobile-menu" aria-label="Open navigation" onClick={() => setIsDrawerOpen(true)}><Icon name="Menu" size={21} /></button>
            <div className="admin-breadcrumb"><span>Pulse Daily</span><Icon name="Chevron" size={14} /><strong>{sectionTitle}</strong></div>
          </div>
          <div className="admin-topbar-actions">
            <div className="admin-global-search-wrap">
              <label className="admin-global-search"><Icon name="Search" size={17} /><input ref={globalSearchRef} aria-label="Search all admin content" value={search} onFocus={() => setGlobalSearchOpen(true)} onChange={(event) => { setSearch(event.target.value); setGlobalSearchOpen(true); }} onKeyDown={(event) => { if (event.key === "Escape") setGlobalSearchOpen(false); }} placeholder="Search anything..." /><kbd>⌘ K</kbd></label>
              {globalSearchOpen && search.trim() && <div className="admin-search-results">{globalResults.length ? globalResults.map((result, index) => <button key={`${result.detail}-${result.label}-${index}`} onClick={() => { setActiveSection(result.section); setSearch(""); setGlobalSearchOpen(false); if (result.item) openEditor(result.item.kind, result.item); }}><span className="search-result-icon"><Icon name={result.detail.includes("Category") ? "Categories" : result.detail.includes("Author") ? "Users / Authors" : result.detail.includes("Tag") ? "Tags" : result.detail.includes("Media") ? "Media Library" : result.section} size={15} /></span><span><strong>{result.label}</strong><small>{result.detail}</small></span><Icon name="Chevron" size={14} /></button>) : <p>No results found for “{search}”</p>}</div>}
            </div>
            <div className="admin-quick-wrap">
              <button className="admin-quick-trigger" onClick={() => { setQuickActionsOpen((open) => !open); setGlobalSearchOpen(false); }}><Icon name="Plus" size={15} /><span>Quick actions</span></button>
              {quickActionsOpen && <div className="admin-quick-menu"><p>CREATE SOMETHING</p><button onClick={() => { setQuickActionsOpen(false); openEditor("news"); }}><Icon name="News" size={16} /><span><strong>Add news</strong><small>Create a news article</small></span></button><button onClick={() => { setQuickActionsOpen(false); openEditor("blog"); }}><Icon name="Blog" size={16} /><span><strong>Add blog post</strong><small>Write for the journal</small></span></button><button onClick={() => { setQuickActionsOpen(false); openEditor("breaking"); }}><Icon name="Breaking News" size={16} /><span><strong>Breaking news</strong><small>Publish a live alert</small></span></button><button onClick={() => { setQuickActionsOpen(false); setActiveSection("Media Library"); }}><Icon name="Media Library" size={16} /><span><strong>Media library</strong><small>Upload an image or video</small></span></button></div>}
            </div>
            <button className="admin-icon-button" aria-label="Notifications" onClick={() => setToast("You're all caught up.")}><Icon name="Bell" size={18} /><i /></button>
            <span className="admin-topbar-divider" />
            <span className="topbar-date">MON, OCT 06</span>
            <span className="profile-avatar small">AO</span>
          </div>
        </header>

        <main className="admin-main">
          <div className="admin-page-heading">
            <div><div className="admin-eyebrow"><span className="eyebrow-line" />MONDAY, OCTOBER 6, 2026</div><h1>{activeSection === "Dashboard" ? <>Good morning, Amina <span className="wave">✳</span></> : sectionTitle}</h1><p>{activeSection === "Dashboard" ? "Here’s what’s happening in your newsroom today." : `Manage your ${activeSection.toLowerCase()} workspace and publishing workflow.`}</p></div>
            <div className="admin-heading-actions">
              {activeSection === "Dashboard" ? <><button className="admin-button subtle" onClick={() => setToast("Dashboard summary exported.")}>Export report <Icon name="Arrow" size={16} /></button><button className="admin-button primary" onClick={() => openEditor("news")}><Icon name="Plus" size={17} />Create article</button></> :
                activeSection === "Categories" ? <button className="admin-button primary" onClick={addCategory}><Icon name="Plus" size={17} />Add category</button> :
                activeSection === "Media Library" ? <label className="admin-button primary file-picker"><Icon name="Upload" size={17} />Upload media<input type="file" accept="image/*,video/*" multiple onChange={(event) => addMedia(event.target.files)} /></label> :
                activeSection === "News" || activeSection === "Blog" ? <button className="admin-button primary" onClick={() => openEditor(activeSection === "News" ? "news" : "blog")}><Icon name="Plus" size={17} />Create {activeSection === "News" ? "news" : "blog post"}</button> :
                activeSection === "Breaking News" ? <button className="admin-button breaking-action" onClick={() => openEditor("breaking")}><Icon name="Plus" size={17} />BREAKING NEWS</button> :
                <button className="admin-button subtle" onClick={() => setToast("Your changes are saved automatically.")}>Last 30 days <Icon name="Calendar" size={16} /></button>}
            </div>
          </div>

          {activeSection === "Dashboard" ? <>
            <section className="admin-stats-grid" aria-label="Newsroom overview">
              {stats.map((stat) => <div className="admin-stat-card" key={stat.label}>
                <div className={`stat-icon ${stat.tint}`}><Icon name={stat.icon} size={19} /></div>
                <p>{stat.label}</p><div className="stat-number">{stat.value}</div><span className={`stat-delta ${stat.tint === "amber" ? "neutral" : ""}`}>{stat.tint !== "amber" && <span>↗ </span>}{stat.delta}</span>
              </div>)}
            </section>

            <section className="admin-quick-actions" aria-label="Quick actions">
              <div><span className="panel-kicker">YOUR WORKFLOW</span><strong>Quick actions</strong></div>
              <button onClick={() => openEditor("news")}><span className="quick-action-icon blue"><Icon name="News" size={17} /></span><span>Add News<small>New article</small></span><Icon name="Plus" size={14} /></button>
              <button onClick={() => openEditor("blog")}><span className="quick-action-icon violet"><Icon name="Blog" size={17} /></span><span>Add Blog Post<small>New story</small></span><Icon name="Plus" size={14} /></button>
              <button onClick={() => openEditor("breaking")}><span className="quick-action-icon red"><Icon name="Breaking News" size={17} /></span><span>Breaking News<small>Live update</small></span><Icon name="Plus" size={14} /></button>
              <button onClick={() => setActiveSection("Media Library")}><span className="quick-action-icon green"><Icon name="Media Library" size={17} /></span><span>Media Library<small>Manage assets</small></span><Icon name="Arrow" size={14} /></button>
            </section>

            <section className="admin-panel admin-performance">
              <div className="panel-heading">
                <div><span className="panel-kicker">AUDIENCE</span><h2>Content performance</h2></div>
                <div className="chart-legend"><span><i className="legend-blue" />Page views</span><span><i className="legend-pale" />Unique visitors</span><select aria-label="Performance range"><option>Last 7 days</option><option>Last 30 days</option><option>This year</option></select></div>
              </div>
              <div className="performance-summary"><strong>48,294</strong><span>total page views</span><em>↗ 18.4%</em><small>vs. previous 7 days</small></div>
              <div className="chart-area" role="img" aria-label="Page views have trended upward over the past seven days">
                <div className="chart-y-labels"><span>12k</span><span>9k</span><span>6k</span><span>3k</span><span>0</span></div>
                <div className="chart-plot"><div className="chart-gridlines"><i /><i /><i /><i /><i /></div>
                  <svg viewBox="0 0 820 170" preserveAspectRatio="none" aria-hidden="true" className="chart-svg">
                    <defs><linearGradient id="viewsFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#315ee8" stopOpacity=".17" /><stop offset="1" stopColor="#315ee8" stopOpacity="0" /></linearGradient></defs>
                    <path d="M0 133 C35 125 47 120 72 124 S110 112 137 114 S179 92 205 108 S247 96 273 103 S310 79 342 91 S378 76 410 86 S450 65 478 74 S514 84 546 69 S585 76 615 50 S659 66 684 47 S723 54 753 31 S793 44 820 14 L820 170 L0 170Z" fill="url(#viewsFill)" />
                    <path d="M0 133 C35 125 47 120 72 124 S110 112 137 114 S179 92 205 108 S247 96 273 103 S310 79 342 91 S378 76 410 86 S450 65 478 74 S514 84 546 69 S585 76 615 50 S659 66 684 47 S723 54 753 31 S793 44 820 14" fill="none" stroke="#315ee8" strokeWidth="3" vectorEffect="non-scaling-stroke" />
                    <path d="M0 148 C46 145 64 135 98 142 S160 128 194 136 S250 125 290 132 S344 112 376 124 S424 110 464 119 S526 108 564 118 S617 97 649 108 S712 85 752 98 S790 82 820 86" fill="none" stroke="#bdc9e9" strokeWidth="2" strokeDasharray="5 5" vectorEffect="non-scaling-stroke" />
                  </svg>
                  <div className="chart-x-labels"><span>Tue, Sep 30</span><span>Wed, Oct 1</span><span>Thu, Oct 2</span><span>Fri, Oct 3</span><span>Sat, Oct 4</span><span>Sun, Oct 5</span><span>Mon, Oct 6</span></div>
                </div>
              </div>
            </section>

            <div className="admin-dashboard-grid">
              <section className="admin-panel">
                <div className="panel-heading"><div><span className="panel-kicker">EDITORIAL</span><h2>Recent news</h2></div><button className="text-link" onClick={() => setActiveSection("News")}>View all <Icon name="Arrow" size={15} /></button></div>
                <div className="admin-content-list">{renderContentRows(news.slice(0, 4))}</div>
              </section>
              <section className="admin-panel breaking-panel">
                <div className="panel-heading"><div><span className="panel-kicker red-kicker">LIVE DESK</span><h2>Breaking news</h2></div><span className="live-pill"><i />{breaking.filter((item) => item.live).length} LIVE</span></div>
                <div className="breaking-live-card">
                  {breaking.filter((item) => item.live && item.status === "Published").slice(0, 1).map((item) => <div key={item.id}><span className="breaking-live-label"><i />ON AIR · {item.priority} PRIORITY</span><h3>{item.title}</h3><p>{item.excerpt}</p><div className="breaking-live-footer"><span>Updated {formatDate(item.date)}</span><button onClick={() => openEditor("breaking", item)}>Manage <Icon name="Arrow" size={14} /></button></div></div>)}
                  {!breaking.some((item) => item.live && item.status === "Published") && <div className="breaking-empty"><p>No active alerts right now.</p><button onClick={() => openEditor("breaking")}>Create breaking news <Icon name="Arrow" size={14} /></button></div>}
                </div>
                <button className="breaking-create-link" onClick={() => openEditor("breaking")}><Icon name="Plus" size={15} /> Publish a breaking update</button>
              </section>
              <section className="admin-panel">
                <div className="panel-heading"><div><span className="panel-kicker">FROM THE JOURNAL</span><h2>Recent blog posts</h2></div><button className="text-link" onClick={() => setActiveSection("Blog")}>View all <Icon name="Arrow" size={15} /></button></div>
                <div className="admin-content-list">{renderContentRows(blogs.slice(0, 3), true)}</div>
              </section>
              <section className="admin-panel">
                <div className="panel-heading"><div><span className="panel-kicker">UP NEXT</span><h2>Scheduled posts</h2></div><button className="text-link" onClick={() => { setActiveSection("News"); setStatusFilter("Scheduled"); }}>View calendar <Icon name="Arrow" size={15} /></button></div>
                <div className="admin-content-list">{renderContentRows(content.filter((item) => item.status === "Scheduled").slice(0, 3), true)}</div>
                {content.filter((item) => item.status === "Scheduled").length === 0 && <p className="admin-empty-note">Nothing scheduled yet. Draft a story and pick a publish time.</p>}
              </section>
            </div>

            <section className="admin-panel admin-most-viewed">
              <div className="panel-heading"><div><span className="panel-kicker">TOP STORIES</span><h2>Most viewed articles</h2></div><button className="text-link" onClick={() => setActiveSection("Analytics")}>View analytics <Icon name="Arrow" size={15} /></button></div>
              <div className="admin-most-viewed-table"><div className="admin-table-head"><span>ARTICLE</span><span>AUTHOR</span><span>PUBLISHED</span><span>VIEWS</span><span>STATUS</span></div>
                {[...content].filter((item) => item.kind !== "breaking" && item.status === "Published").sort((a, b) => b.views - a.views).slice(0, 4).map((item, index) => <div className="admin-table-row" key={item.id}><div className="rank-title"><b>{String(index + 1).padStart(2, "0")}</b><span>{item.title}</span></div><span>{item.author}</span><span>{formatDate(item.date)}</span><strong>{countViews(item.views)}</strong><StatusBadge status={item.status} /></div>)}
              </div>
            </section>
            <footer className="admin-footer"><span>© 2026 Pulse Daily newsroom</span><span>Autosaved locally <i /> All changes saved</span><button onClick={() => setActiveSection("Activity Log")}>View activity log <Icon name="Arrow" size={14} /></button></footer>
          </> :
          activeSection === "News" || activeSection === "Blog" || activeSection === "Breaking News" ? <section className="admin-panel admin-listing-panel">
            <div className="admin-listing-top"><div><span className="panel-kicker">{activeSection === "Breaking News" ? "LIVE DESK" : "CONTENT LIBRARY"}</span><h2>{activeSection === "Breaking News" ? "Breaking news desk" : `${activeSection} library`} <small>{filteredContent.length}</small></h2></div>
              {activeSection === "Breaking News" && <div className="breaking-note"><i /> Breaking updates appear instantly in the site alert banner.</div>}</div>
            <div className="admin-filterbar">
              <label className="admin-list-search"><Icon name="Search" size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={`Search ${activeSection.toLowerCase()}...`} /></label>
              <label><Icon name="Filter" size={15} /><select aria-label="Filter by status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option>All status</option>{["Draft", "Pending", "Scheduled", "Published", "Archived", "Expired"].map((status) => <option key={status}>{status}</option>)}</select></label>
              <label><select aria-label="Filter by category" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}><option>All categories</option>{categoryList.map((category) => <option key={category}>{category}</option>)}</select></label>
              <button className="admin-button subtle compact-filter" onClick={() => { setSearch(""); setStatusFilter("All status"); setCategoryFilter("All categories"); }}>Reset</button>
            </div>
            <div className="admin-table-scroll"><div className="admin-table-head content-head"><span>{activeSection === "Breaking News" ? "HEADLINE" : "TITLE"}</span><span>CATEGORY / AUTHOR</span><span>PUBLISH DATE</span><span>STATUS</span><span>VIEWS</span><span>ACTIONS</span></div>
              {filteredContent.map((item) => <div className="admin-table-row content-row" key={item.id}>
                <div className="listing-title"><div className="admin-story-thumb" style={{ backgroundImage: item.image ? `url("${item.image}")` : undefined }}>{!item.image && <Icon name={item.kind === "breaking" ? "Breaking News" : "Blog"} />}</div><div>{item.live && <span className="live-dot">LIVE</span>}<strong>{item.title}</strong><small>/{item.slug}</small></div></div>
                <span>{item.category}<small className="table-subline">{item.author}</small></span><span>{formatDate(item.date)}</span><StatusBadge status={item.status} /><strong>{countViews(item.views)}</strong>
                <div className="table-action-group"><button aria-label="Edit article" title="Edit" onClick={() => openEditor(item.kind, item)}>Edit</button><button aria-label="Delete article" title="Delete" onClick={() => deleteContent(item.id)}>Delete</button></div>
              </div>)}
              {filteredContent.length === 0 && <div className="admin-empty-state"><span><Icon name={activeSection === "Breaking News" ? "Breaking News" : "News"} size={25} /></span><h3>No content found</h3><p>Try another search or create something new for your newsroom.</p></div>}
            </div>
            <div className="admin-listing-footer">Showing <strong>{filteredContent.length}</strong> of {content.filter((item) => activeSection === "News" ? item.kind === "news" : activeSection === "Blog" ? item.kind === "blog" : item.kind === "breaking").length} items <span>Page 1 of 1</span></div>
          </section> :
          activeSection === "Categories" ? <section className="admin-panel admin-library-panel"><div className="panel-heading"><div><span className="panel-kicker">ORGANIZE CONTENT</span><h2>All categories</h2></div><span className="library-count">{categoryList.length} categories</span></div><div className="category-grid">{categoryList.map((category, index) => <div className="category-card" key={category}><span className={`category-art art-${index % 6}`}><Icon name={["News", "Analytics", "Blog", "Categories", "SEO", "Tags"][index % 6]} size={21} /></span><strong>{category}</strong><small>{content.filter((item) => item.category === category).length} articles · News &amp; Blog</small><button title={`Rename ${category}`} onClick={() => { const updated = window.prompt("Edit category name", category); if (updated?.trim() && !categoryList.includes(updated.trim())) { setCategoryList((current) => current.map((item) => item === category ? updated.trim() : item)); setToast("Category updated."); } }}>Edit <Icon name="More" size={15} /></button></div>)}</div></section> :
          activeSection === "Tags" ? <section className="admin-panel admin-library-panel"><div className="panel-heading"><div><span className="panel-kicker">DISCOVERY</span><h2>Tags</h2></div><button className="admin-button primary" onClick={() => { const name = window.prompt("Create a tag"); if (name?.trim()) setToast(`Tag “${name.trim()}” created.`); }}><Icon name="Plus" size={16} />Create tag</button></div><label className="admin-list-search tag-search"><Icon name="Search" size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search tags..." /></label><div className="tag-cloud">{Array.from(new Set(content.flatMap((item) => [item.category, ...item.title.split(" ").filter((word) => word.length > 5)]))).filter((tag) => tag.toLowerCase().includes(search.toLowerCase())).map((tag, index) => <button key={tag} className="tag-chip" onClick={() => setToast(`“${tag}” is used in ${index % 4 + 1} stories.`)}>#{tag}<span>{index % 4 + 1}</span></button>)}</div></section> :
          activeSection === "Media Library" ? <section className="admin-panel admin-library-panel"><div className="panel-heading"><div><span className="panel-kicker">ASSETS</span><h2>Media library</h2></div><span className="library-count">{mediaFiles.length} uploaded this session</span></div><label className="media-dropzone"><input type="file" accept="image/*,video/*" multiple onChange={(event) => addMedia(event.target.files)} /><span className="upload-icon"><Icon name="Upload" size={22} /></span><strong>Drop files here or <u>browse files</u></strong><small>Images and video · Uploads remain in this browser session</small></label><div className="media-grid">{mediaFiles.map((file, index) => <div className="media-card" key={`${file.name}-${index}`}><div className="media-preview">{file.type.startsWith("video/") ? <video src={file.url} controls /> : <Image src={file.url} alt="" width={640} height={400} unoptimized />}</div><div><strong>{file.name}</strong><small>{file.size} · just now</small></div><button onClick={() => { URL.revokeObjectURL(file.url); setMediaFiles((current) => current.filter((_, position) => position !== index)); setToast("Media removed."); }}>Delete</button></div>)}{!mediaFiles.length && <p className="admin-empty-note">Your media library is ready. Upload images to use them in content.</p>}</div></section> :
          activeSection === "Comments" ? <section className="admin-panel admin-library-panel"><div className="panel-heading"><div><span className="panel-kicker">COMMUNITY</span><h2>Comment moderation</h2></div><span className="pending-chip">18 awaiting review</span></div><label className="admin-list-search tag-search"><Icon name="Search" size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search comments..." /></label>{[{ id: "cm-1", name: "James Kariuki", article: "Kenya election watch continues as turnout edges higher", text: "Great reporting. The regional turnout numbers make for a fascinating read.", date: "Oct 6, 2026" }, { id: "cm-2", name: "Maya Wanjiku", article: "A new archive is preserving Africa’s rare ecosystems", text: "Would love to learn more about how local communities can contribute.", date: "Oct 5, 2026" }, { id: "cm-3", name: "Peter Njoroge", article: "The quiet craft of reporting from the field", text: "A thoughtful perspective from the newsroom. Thank you for sharing.", date: "Oct 5, 2026" }].filter((comment) => `${comment.name} ${comment.article} ${comment.text}`.toLowerCase().includes(search.toLowerCase())).map((comment) => <div className="comment-card" key={comment.id}><span className="comment-avatar">{comment.name.split(" ").map((part) => part[0]).join("")}</span><div className="comment-body"><div><strong>{comment.name}</strong><span>{comment.date}</span></div><p>{comment.text}</p><small>On: {comment.article}</small></div><div className="comment-actions">{approvedComments.includes(comment.id) ? <span className="approved-label">Approved</span> : <><button onClick={() => { setApprovedComments((current) => [...current, comment.id]); setToast("Comment approved."); }}>Approve</button><button onClick={() => setToast("Comment rejected.")}>Reject</button></>}</div></div>)}</section> :
          activeSection === "Users / Authors" ? <section className="admin-panel admin-library-panel"><div className="panel-heading"><div><span className="panel-kicker">TEAM ACCESS</span><h2>Users &amp; authors</h2></div><button className="admin-button primary" onClick={() => setToast("Invite links require an authenticated backend.")}><Icon name="Plus" size={16} />Invite user</button></div><div className="role-callout"><Icon name="Users / Authors" size={19} /><div><strong>Role-based newsroom access</strong><p>Super Admin · Administrator · Editor · Author · Reporter</p></div></div>{authors.map((name, index) => <div className="user-row" key={name}><span className="profile-avatar">{name.split(" ").map((part) => part[0]).join("")}</span><div><strong>{name}</strong><small>{name.toLowerCase().replace(" ", ".")}@pulsedaily.com</small></div><span className={`user-role role-${index}`}>{["Administrator", "Editor", "Reporter", "Author", "Editor"][index]}</span><span className="user-active"><i />Active</span><button onClick={() => setToast("User permissions require an authenticated backend.")}><Icon name="More" size={18} /></button></div>)}</section> :
          activeSection === "Analytics" ? <><div className="analytics-kpis">{[["Page views", "48,294", "+18.4%"], ["News views", "32,801", "+12.6%"], ["Blog views", "15,493", "+26.2%"], ["Avg. read time", "4m 18s", "+8.1%"]].map(([label, value, change]) => <div className="admin-stat-card" key={label}><p>{label}</p><div className="stat-number">{value}</div><span className="stat-delta">↗ {change} vs. last period</span></div>)}</div><section className="admin-panel analytics-panel"><div className="panel-heading"><div><span className="panel-kicker">AUDIENCE GROWTH</span><h2>Daily views</h2></div><select aria-label="Analytics period"><option>Last 7 days</option><option>Last 30 days</option><option>Last 12 months</option></select></div><div className="analytics-bars">{[42, 55, 47, 68, 61, 80, 73, 92, 67, 84, 75, 100, 88, 95].map((height, index) => <div key={index}><i style={{ height: `${height}%` }} /><span>{["T", "W", "T", "F", "S", "S", "M"][index % 7]}</span></div>)}</div><h3 className="analytics-subhead">Top-performing content</h3>{[...content].sort((a, b) => b.views - a.views).slice(0, 5).map((item, index) => <div className="analytics-rank" key={item.id}><b>0{index + 1}</b><span>{item.title}<small>{item.category} · {item.author}</small></span><strong>{countViews(item.views)} views</strong></div>)}</section></> :
          activeSection === "SEO" ? <section className="admin-panel admin-library-panel"><div className="panel-heading"><div><span className="panel-kicker">SEARCH VISIBILITY</span><h2>SEO overview</h2></div><span className="seo-score">SEO health <strong>86 / 100</strong></span></div><div className="seo-intro"><div className="seo-score-ring">86<span>/100</span></div><div><strong>Your newsroom is in good shape</strong><p>Complete meta descriptions and social previews on your latest stories to improve visibility.</p></div></div><div className="seo-audit">{content.filter((item) => item.kind !== "breaking").map((item) => <div className="seo-item" key={item.id}><span className={item.seoTitle && item.metaDescription ? "seo-check good" : "seo-check"}>{item.seoTitle && item.metaDescription ? "✓" : "!"}</span><div><strong>{item.title}</strong><small>{item.seoTitle ? "SEO title set" : "Missing SEO title"} · {item.metaDescription ? "Meta description set" : "Missing meta description"}</small></div><button onClick={() => openEditor(item.kind, item)}>Edit SEO</button></div>)}</div></section> :
          activeSection === "Activity Log" ? <section className="admin-panel admin-library-panel"><div className="panel-heading"><div><span className="panel-kicker">AUDIT TRAIL</span><h2>Recent activity</h2></div><span className="library-count">Today · October 6</span></div>{[{ action: "published", person: "Amina Otieno", what: "Kenya election watch continues as turnout edges higher", time: "09:12 AM", icon: "Published" }, { action: "updated", person: "Daniel Mwangi", what: "African cities expand clean energy access ahead of climate summit", time: "08:46 AM", icon: "News" }, { action: "published breaking news", person: "Amina Otieno", what: "Regional leaders open the Nairobi climate summit", time: "08:45 AM", icon: "Breaking News" }, { action: "created a draft", person: "Sofia Laurent", what: "Startup funding shifts toward practical AI tools", time: "Yesterday, 03:30 PM", icon: "Blog" }].map((event) => <div className="activity-row" key={event.what}><span className="activity-icon"><Icon name={event.icon} size={17} /></span><p><strong>{event.person}</strong> {event.action}<br /><span>{event.what}</span></p><time>{event.time}</time></div>)}</section> :
          <section className="admin-panel admin-library-panel"><div className="panel-heading"><div><span className="panel-kicker">WORKSPACE</span><h2>Settings</h2></div><button className="admin-button primary" onClick={() => setToast("Settings saved.")}>Save changes</button></div><div className="settings-section"><h3>Brand identity</h3><p>Customize your publication look and feel.</p><label>Publication name<input defaultValue="Pulse Daily" /></label><label>Primary brand color<span className="color-setting"><i />#315EE8<input type="color" defaultValue="#315ee8" /></span></label></div><div className="settings-section"><h3>Editorial defaults</h3><p>Set sensible defaults for newly created content.</p><label>Default author<select defaultValue={authors[0]}>{authors.map((author) => <option key={author}>{author}</option>)}</select></label><label>Default comments setting<select defaultValue="Enabled"><option>Enabled</option><option>Disabled</option></select></label></div><div className="settings-section"><h3>Publishing workflow</h3><p>Keep your publishing process organized.</p><div className="setting-toggle"><span><strong>Require editor review</strong><small>New author submissions start as pending.</small></span><input type="checkbox" defaultChecked /></div><div className="setting-toggle"><span><strong>Enable comments</strong><small>Allow reader discussion on published articles.</small></span><input type="checkbox" defaultChecked /></div></div></section>}
        </main>
      </div>

      {editorKind && <div className="admin-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeEditor(); }}>
        <section className="admin-editor-modal" role="dialog" aria-modal="true" aria-labelledby="editor-heading">
          <header><div><span className="panel-kicker">{editingId ? "EDIT CONTENT" : editorKind === "breaking" ? "LIVE DESK" : "NEW CONTENT"}</span><h2 id="editor-heading">{editingId ? "Edit" : "Create"} {editorKind === "breaking" ? "breaking news" : editorKind === "blog" ? "blog post" : "news article"}</h2></div><button className="admin-icon-button" aria-label="Close editor" onClick={closeEditor}><Icon name="Close" /></button></header>
          <form onSubmit={(event) => saveContent(event)}>
            <div className="editor-fields">
              <label className="editor-wide">Headline<input autoFocus required value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value, slug: !current.slug || current.slug === slugify(current.title) ? slugify(event.target.value) : current.slug }))} placeholder="Be clear, specific and compelling—never promise more than the story delivers" /><small>Use a concise, accurate headline that tells readers what happened.</small></label>
              <label className="editor-wide">Slug<div className="slug-input"><span>pulsedaily.com/</span><input required value={form.slug} onChange={(event) => setForm((current) => ({ ...current, slug: slugify(event.target.value) }))} placeholder="your-story-slug" /></div></label>
              <label className="editor-wide">Short excerpt<textarea required value={form.excerpt} onChange={(event) => setForm((current) => ({ ...current, excerpt: event.target.value }))} placeholder="A short summary for article cards and search results" rows={3} /></label>
              {editorKind !== "breaking" && <label className="editor-wide">Key takeaways<textarea value={form.keyTakeaways} onChange={(event) => setForm((current) => ({ ...current, keyTakeaways: event.target.value }))} placeholder={"Optional: add one key point per line\nWhat changed\nWho is affected"} rows={3} /></label>}
              <label>Category<select value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}>{categoryList.map((category) => <option key={category}>{category}</option>)}</select></label>
              <label>Author<select value={form.author} onChange={(event) => setForm((current) => ({ ...current, author: event.target.value }))}>{authors.map((author) => <option key={author}>{author}</option>)}</select></label>
              {editorKind !== "breaking" && <>
                <label className="editor-wide">Tags<input value={form.tags} onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value }))} placeholder="Separate tags with commas" /></label>
                <div className="editor-rich-content editor-wide"><span className="rich-label">Full content</span><div className="rich-toolbar" aria-label="Text formatting tools">{[["bold", "B"], ["italic", "I"], ["heading", "H2"], ["list", "List"], ["quote", "Quote"], ["link", "Link"], ["image", "Image"], ["video", "Video"], ["table", "Table"], ["center", "Center"]].map(([format, label]) => <button key={format} type="button" title={label} aria-label={`Insert ${label}`} onMouseDown={(event) => event.preventDefault()} onClick={() => applyRichText(format)}>{label}</button>)}</div><textarea ref={editorBodyRef} rows={8} value={form.body} onChange={(event) => setForm((current) => ({ ...current, body: event.target.value }))} placeholder="Write your story here..." /><small>Formatting is saved as Markdown and HTML-compatible text.</small></div>
              </>}
              <label className="editor-wide">Featured image URL<input value={form.image} onChange={(event) => setForm((current) => ({ ...current, image: event.target.value }))} placeholder="https://..." /></label>
              <label className="editor-wide">Image caption<input value={form.imageCaption} onChange={(event) => setForm((current) => ({ ...current, imageCaption: event.target.value }))} placeholder="Describe the featured image" /></label>
              <label className="editor-wide">Image alt text<input value={form.imageAlt} onChange={(event) => setForm((current) => ({ ...current, imageAlt: event.target.value }))} placeholder="Describe the image for readers using assistive technology" /></label>
              {editorKind === "news" && <><label>Location<input value={form.location} onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))} placeholder="City or region" /></label><label>Source<input value={form.source} onChange={(event) => setForm((current) => ({ ...current, source: event.target.value }))} placeholder="News source" /></label></>}
              <label>{editorKind === "breaking" ? "Publish date & time" : "Publish date"}<input type="datetime-local" value={form.date} onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))} /></label>
              {editorKind === "breaking" ? <><label>Status<select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as ContentStatus }))}>{["Draft", "Scheduled", "Published", "Archived", "Expired"].map((status) => <option key={status}>{status}</option>)}</select></label><label>Priority<select value={form.priority} onChange={(event) => setForm((current) => ({ ...current, priority: event.target.value as typeof current.priority }))}><option>High</option><option>Normal</option><option>Low</option></select></label><label className="editor-wide">Expiration date &amp; time<input type="datetime-local" value={form.expiresAt} onChange={(event) => setForm((current) => ({ ...current, expiresAt: event.target.value }))} /></label></> : <label>Status<select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as ContentStatus }))}>{["Draft", "Pending", "Scheduled", "Published", "Archived"].map((status) => <option key={status}>{status}</option>)}</select></label>}
              <div className="editor-toggles editor-wide">{(editorKind === "breaking" ? [["live", "Mark as LIVE"], ["featured", "Feature this alert"]] : [["featured", "Featured"], ["trending", "Trending"], ["comments", "Allow comments"]]).map(([key, label]) => <label key={key}><input type="checkbox" checked={Boolean(form[key as keyof typeof form])} onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.checked }))} />{label}</label>)}</div>
              {editorKind !== "breaking" && <details className="seo-details editor-wide"><summary>SEO &amp; social metadata <span>Optional</span></summary><div className="seo-edit-fields"><label>SEO title<input value={form.seoTitle} onChange={(event) => setForm((current) => ({ ...current, seoTitle: event.target.value }))} placeholder="Search result title" /></label><label>Meta description<textarea rows={2} value={form.metaDescription} onChange={(event) => setForm((current) => ({ ...current, metaDescription: event.target.value }))} placeholder="A concise search description" /></label><label>Focus keyword<input value={form.focusKeyword} onChange={(event) => setForm((current) => ({ ...current, focusKeyword: event.target.value }))} placeholder="Primary search phrase" /></label><label>Canonical URL<input value={form.canonicalUrl} onChange={(event) => setForm((current) => ({ ...current, canonicalUrl: event.target.value }))} placeholder="https://..." /></label><label>Social sharing title<input value={form.socialTitle} onChange={(event) => setForm((current) => ({ ...current, socialTitle: event.target.value }))} placeholder="Optional share headline" /></label><label>Social sharing description<textarea rows={2} value={form.socialDescription} onChange={(event) => setForm((current) => ({ ...current, socialDescription: event.target.value }))} placeholder="Optional share description" /></label></div></details>}
            </div>
            <footer><button type="button" className="admin-button subtle" onClick={closeEditor}>Cancel</button>{editorKind === "breaking" ? <button type="submit" className="admin-button subtle">Save alert</button> : <button type="button" className="admin-button subtle" onClick={(event) => saveContent(event, false, "Draft")}>Save as draft</button>}{editorKind === "breaking" && <button type="button" className="admin-button breaking-action" onClick={(event) => saveContent(event, true)}>PUBLISH NOW</button>}{editorKind !== "breaking" && <button type="button" className="admin-button primary" onClick={(event) => saveContent(event, true)}>Publish now</button>}{editorKind !== "breaking" && <button type="submit" className="admin-button primary">{form.status === "Scheduled" ? "Schedule post" : "Save changes"}</button>}</footer>
          </form>
        </section>
      </div>}
      {toast && <div className="admin-toast" role="status"><span>✓</span>{toast}<button aria-label="Dismiss notification" onClick={() => setToast("")}><Icon name="Close" size={15} /></button></div>}
    </div>
  );
}
