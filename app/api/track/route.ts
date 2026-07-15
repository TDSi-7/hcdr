import { NextRequest, NextResponse } from "next/server";
import { normalizeQuizAnswers } from "@/lib/quiz-validation";
import { getProfile } from "@/lib/result-logic";
import { insertSupabaseRow } from "@/lib/supabase-admin";

type TrackBody = {
  sessionId?: string;
  eventType?: string;
  profile?: "A" | "B" | "C" | null;
  answers?: Record<number, string>;
};

function clean(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim().replace(/[<>]/g, "");
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as TrackBody;
    const sessionId = clean(body.sessionId);
    const eventType = clean(body.eventType);
    let profile = clean(body.profile ?? "");
    const answers = body.answers ?? {};

    if (!sessionId || !eventType) {
      return NextResponse.json({ error: "Missing sessionId or eventType" }, { status: 400 });
    }

    const validatedAnswers = eventType === "results_viewed" ? normalizeQuizAnswers(answers) : null;
    if (eventType === "results_viewed") {
      if (!validatedAnswers) {
        console.warn("Skipping results event for incomplete or invalid answers.");
        return NextResponse.json({ ok: true });
      }
      profile = getProfile(validatedAnswers);
    }

    const eventsTable = process.env.SUPABASE_EVENTS_TABLE || "quiz_events";
    try {
      await insertSupabaseRow(eventsTable, {
        session_id: sessionId,
        event_type: eventType,
        profile: profile || null
      });
    } catch (eventsError) {
      // Events table is optional for now; do not block quiz completion capture.
      console.warn("Event insert failed (non-blocking):", eventsError);
    }

    if (validatedAnswers) {
      const quizTables = Array.from(
        new Set([
          process.env.SUPABASE_QUIZ_TABLE || "quiz_responses",
          "catheter_quiz_completion",
          "quiz_responses"
        ])
      );
      const baseQuizPayload: Record<string, unknown> = {
        session_id: sessionId,
        event_type: eventType,
        result_profile: profile,
        q1: validatedAnswers[1],
        q2: validatedAnswers[2],
        q3: validatedAnswers[3],
        q4: validatedAnswers[4],
        q5: validatedAnswers[5],
        q6: validatedAnswers[6],
        q7: validatedAnswers[7],
        q8: validatedAnswers[8],
        q9: validatedAnswers[9]
      };
      const variants = [
        baseQuizPayload,
        (() => {
          const v = { ...baseQuizPayload };
          delete v.event_type;
          return v;
        })(),
        (() => {
          const v = { ...baseQuizPayload };
          delete v.session_id;
          return v;
        })(),
        (() => {
          const v = { ...baseQuizPayload };
          delete v.event_type;
          delete v.session_id;
          return v;
        })()
      ];
      let saved = false;
      const errors: string[] = [];
      for (const table of quizTables) {
        for (const payload of variants) {
          try {
            await insertSupabaseRow(table, payload);
            saved = true;
            break;
          } catch (err) {
            errors.push(`${table}: ${String(err)}`);
          }
        }
        if (saved) break;
      }
      if (!saved) {
        console.warn("Quiz completion insert failed (non-blocking):", errors.join(" | "));
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    // Tracking is best-effort and must never break user flow.
    console.warn("Error tracking event (non-blocking):", error);
    return NextResponse.json({ ok: true });
  }
}
