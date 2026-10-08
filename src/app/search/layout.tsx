import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Pulse Daily",
  description: "Search news, topics, and reporting from Pulse Daily.",
  robots: { index: false, follow: true },
};

export default function SearchLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
