export default function Loading() {
  return <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8"><div className="h-10 w-48 animate-pulse rounded bg-zinc-200" /><div className="mt-5 h-80 animate-pulse rounded bg-zinc-100" /><div className="mt-6 grid gap-5 md:grid-cols-2">{[1, 2].map((item) => <div key={item} className="h-28 animate-pulse rounded bg-zinc-100" />)}</div></div>;
}
