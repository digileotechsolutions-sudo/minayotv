"use client";

import { FormEvent, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase";

const DEMO_AUTH_KEY = "pulse-daily-demo-auth";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const client = getSupabaseBrowser();

  const continueDemo = () => {
    localStorage.setItem(DEMO_AUTH_KEY, "enabled");
    window.location.href = "/admin";
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!client) {
      setMessage("Supabase is not configured, but demo mode is available below.");
      return;
    }
    const { error } = await client.auth.signInWithPassword({ email, password });
    setMessage(error?.message ?? "Signed in. Redirecting…");
    if (!error) window.location.href = "/admin";
  };

  return <main className="grid min-h-screen bg-zinc-950 px-5 py-16 text-white place-items-center"><section className="w-full max-w-md border border-zinc-800 bg-zinc-900 p-7 sm:p-10"><p className="text-xs font-black uppercase tracking-[0.22em] text-red-400">Pulse Daily</p><h1 className="mt-5 text-4xl font-black tracking-[-0.05em]">Admin access</h1><p className="mt-3 text-sm leading-6 text-zinc-400">{client ? "Sign in with an authorized administrator account." : "Supabase is not configured for this local install, so demo mode is enabled."}</p>{!client && <button type="button" onClick={continueDemo} className="mt-6 h-12 w-full bg-red-600 font-bold hover:bg-red-500">Continue in demo mode</button>}<form onSubmit={submit} className="mt-8 space-y-5"><label className="block"><span className="mb-2 block text-xs font-bold uppercase tracking-wider">Email</span><input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="h-12 w-full border border-zinc-700 bg-zinc-950 px-3 outline-none focus:border-red-500" /></label><label className="block"><span className="mb-2 block text-xs font-bold uppercase tracking-wider">Password</span><input type="password" required value={password} onChange={(event) => setPassword(event.target.value)} className="h-12 w-full border border-zinc-700 bg-zinc-950 px-3 outline-none focus:border-red-500" /></label><button className="h-12 w-full bg-red-600 font-bold hover:bg-red-500">{client ? "Sign in" : "Try demo sign in"}</button></form>{message && <p role="status" className="mt-4 text-sm text-zinc-300">{message}</p>}</section></main>;
}
