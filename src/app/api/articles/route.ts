import { NextResponse } from "next/server";
import { getSupabaseAdmin, getSupabaseBrowser } from "@/lib/supabase";

async function requireAdmin(request: Request) {
  const client = getSupabaseBrowser();
  if (!client) return { error: NextResponse.json({ error: "Supabase not configured" }, { status: 503 }) };
  const authHeader = request.headers.get("authorization");
  const cookie = request.headers.get("cookie");
  const accessToken = authHeader?.replace("Bearer ", "") ?? cookie?.match(/supabase-auth-token=([^;]+)/)?.[1];
  if (!accessToken) return { error: NextResponse.json({ error: "Authentication required" }, { status: 401 }) };
  const { data: userData, error } = await client.auth.getUser(accessToken);
  if (error || !userData.user) return { error: NextResponse.json({ error: "Authentication required" }, { status: 401 }) };
  const admin = getSupabaseAdmin();
  if (!admin) return { error: NextResponse.json({ error: "Supabase not configured" }, { status: 503 }) };
  const { data: profile } = await admin.from("users").select("role").eq("id", userData.user.id).single();
  if (profile?.role !== "admin" && profile?.role !== "editor") return { error: NextResponse.json({ error: "Administrator access required" }, { status: 403 }) };
  return { user: userData.user, admin };
}

export async function GET(request: Request) { const authorized = await requireAdmin(request); if ("error" in authorized) return authorized.error; const { data, error } = await authorized.admin!.from("articles").select("*").order("date", { ascending: false }); if (error) return NextResponse.json({ error: error.message }, { status: 500 }); return NextResponse.json(data); }
export async function POST(request: Request) { const authorized = await requireAdmin(request); if ("error" in authorized) return authorized.error; const body = await request.json(); const { data, error } = await authorized.admin!.from("articles").insert({ ...body, date: new Date().toISOString(), status: body.status ?? "draft" }).select().single(); if (error) return NextResponse.json({ error: error.message }, { status: 500 }); return NextResponse.json(data, { status: 201 }); }
