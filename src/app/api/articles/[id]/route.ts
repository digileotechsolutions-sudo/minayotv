import { NextResponse } from "next/server";
import { getSupabaseAdmin, getSupabaseBrowser } from "@/lib/supabase";

async function requireAdmin(request: Request) {
  const client = getSupabaseBrowser();
  if (!client) return { error: NextResponse.json({ error: "Supabase not configured" }, { status: 503 }) };
  const accessToken = request.headers.get("authorization")?.replace("Bearer ", "") ?? request.headers.get("cookie")?.match(/supabase-auth-token=([^;]+)/)?.[1];
  if (!accessToken) return { error: NextResponse.json({ error: "Authentication required" }, { status: 401 }) };
  const { data: userData, error } = await client.auth.getUser(accessToken);
  if (error || !userData.user) return { error: NextResponse.json({ error: "Authentication required" }, { status: 401 }) };
  const admin = getSupabaseAdmin();
  if (!admin) return { error: NextResponse.json({ error: "Supabase not configured" }, { status: 503 }) };
  const { data: profile } = await admin.from("users").select("role").eq("id", userData.user.id).single();
  if (profile?.role !== "admin" && profile?.role !== "editor") return { error: NextResponse.json({ error: "Administrator access required" }, { status: 403 }) };
  return { admin };
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) { const authorized = await requireAdmin(request); if ("error" in authorized) return authorized.error; const { id } = await params; const { error } = await authorized.admin!.from("articles").delete().eq("id", id); if (error) return NextResponse.json({ error: error.message }, { status: 500 }); return NextResponse.json({ ok: true }); }
