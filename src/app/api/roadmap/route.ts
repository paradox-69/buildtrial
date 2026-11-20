import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { askForJson, AiError } from "../../../lib/ai";
import { SYSTEM_PROMPT, buildUserMessage, parseRoadmap } from "../../../lib/roadmap";

export const maxDuration = 30; // seconds; the AI call can take a while

const fail = (error: string, status: number) => NextResponse.json({ error }, { status });

export async function POST(req: Request) {
  // 1. Who is calling? The browser sends the user's login token.
  const token = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (!token) return fail("Please log in again.", 401);

  // This client acts AS the user, so Row Level Security still applies to every query below.
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: auth, error: authError } = await supabase.auth.getUser(token);
  if (authError || !auth.user) return fail("Please log in again.", 401);

  // 2. Check the input.
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return fail("Invalid request.", 400);
  }
  const projectId = typeof body.projectId === "string" ? body.projectId : "";
  const idea = typeof body.idea === "string" ? body.idea.trim().slice(0, 1500) : "";
  const teamSize = Math.round(Number(body.teamSize));
  const weeks = Math.round(Number(body.weeks));
  if (!projectId) return fail("Invalid request.", 400);
  if (idea.length < 15) return fail("Please describe your idea in a little more detail (at least a sentence or two).", 400);
  if (!(teamSize >= 1 && teamSize <= 10)) return fail("Team size must be between 1 and 10.", 400);
  if (!(weeks >= 2 && weeks <= 40)) return fail("Duration must be between 2 and 40 weeks.", 400);

  // 3. Does this project belong to the user? (RLS returns nothing for other people's projects.)
  const { data: project } = await supabase.from("projects").select("id, title, type").eq("id", projectId).maybeSingle();
  if (!project) return fail("Project not found.", 404);

  // 4. Daily limit (kept in the database).
  const { data: allowed, error: quotaError } = await supabase.rpc("use_ai_quota");
  if (quotaError) return fail("Could not check your daily limit. Please try again.", 500);
  if (!allowed) return fail("You have reached today's limit of 10 roadmaps. Please try again tomorrow.", 429);

  // 5. Ask the AI, check the answer, save it.
  try {
    const raw = await askForJson(SYSTEM_PROMPT, buildUserMessage({ title: project.title, type: project.type, idea, teamSize, weeks }));
    const roadmap = parseRoadmap(raw);
    if (!roadmap) return fail("The AI answer was incomplete. Please try again.", 502);
    roadmap.generated_at = new Date().toISOString();

    const { error: saveError } = await supabase.from("projects").update({ roadmap_json: roadmap }).eq("id", projectId);
    if (saveError) return fail("Could not save the roadmap. Please try again.", 500);
    return NextResponse.json({ roadmap });
  } catch (e) {
    if (e instanceof AiError) return fail(e.message, e.status);
    console.error(e);
    return fail("Something went wrong. Please try again.", 500);
  }
}
