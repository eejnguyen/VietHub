import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { unit_slug, lesson_slug, status, score } = body;

    if (!unit_slug || !lesson_slug) {
      return NextResponse.json(
        { error: "unit_slug and lesson_slug required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("lesson_progress")
      .upsert(
        {
          user_id: user.id,
          unit_slug,
          lesson_slug,
          status: status || "in_progress",
          score: score ?? null,
          completed_at: status === "completed" ? new Date().toISOString() : null,
          attempts: 1,
        },
        { onConflict: "user_id,unit_slug,lesson_slug" }
      )
      .select()
      .single();

    if (error) {
      console.error("Progress update error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("lesson_progress")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
