import Link from "next/link";

const links = {
  About: ["Our newsroom", "Editors", "Careers"],
  Support: ["Contact", "Advertise", "Privacy policy", "Terms of use", "Editorial policy"],
};

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white px-5 py-14 sm:px-8">
      <div className="mx-auto max-w-7xl"><div className="grid gap-10 border-b border-zinc-200 pb-12 md:grid-cols-[1.5fr_1fr_1fr]"><div><Link href="/" className="text-3xl font-black tracking-[-0.06em]">Pulse <span className="text-red-600">Daily</span></Link><p className="mt-4 max-w-sm text-sm leading-6 text-zinc-600">Independent journalism for a world that deserves context, clarity, and a stronger point of view.</p></div>{Object.entries(links).map(([title, items]) => <div key={title}><h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em]">{title}</h3><ul className="space-y-2 text-sm text-zinc-600">{items.map((item) => <li key={item}><Link href="/" className="hover:text-red-600">{item}</Link></li>)}</ul></div>)}</div><div className="flex flex-col gap-4 pt-7 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between"><p>© 2026 Pulse Daily. All rights reserved.</p><div className="flex gap-5"><a href="/" aria-label="Instagram">Instagram</a><a href="/" aria-label="X">X</a><a href="/" aria-label="YouTube">YouTube</a></div></div></div>
    </footer>
  );
}
