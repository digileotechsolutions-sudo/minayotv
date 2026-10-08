"use client";

import { FormEvent, useState } from "react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const submit = (event: FormEvent) => {
    event.preventDefault();
    setMessage("You’re on the list. Your first edition is on its way.");
    setEmail("");
  };
  return (
    <section className="bg-zinc-950 px-5 py-16 text-white sm:px-8 lg:py-20">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-end">
        <div><p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-red-400">The Pulse Brief</p><h2 className="text-4xl font-black tracking-[-0.045em] sm:text-5xl">Stay informed.<br />Stay ahead.</h2><p className="mt-4 max-w-xl text-base leading-7 text-zinc-300">The essential stories, sharp analysis, and reliable context delivered every weekday morning.</p></div>
        <form onSubmit={submit} className="w-full">
          <label htmlFor="newsletter-email" className="sr-only">Email address</label>
          <div className="flex flex-col gap-3 sm:flex-row"><input id="newsletter-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Your email address" className="h-14 min-w-0 flex-1 border-b-2 border-zinc-500 bg-transparent px-1 text-lg text-white outline-none placeholder:text-zinc-500 focus:border-red-500" /><button className="h-14 bg-red-600 px-7 font-bold transition hover:bg-red-500">Subscribe</button></div>
          {message && <p role="status" className="mt-3 text-sm text-emerald-300">{message}</p>}
        </form>
      </div>
    </section>
  );
}
