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

const allowedEventTypes = new Set([
  "results_viewed",
  "connect_clicked",
  "guide_clicked",
  "start_over_clicked",
  "contact_submitted"
]);

function clean(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim().replace(/[<>]/g, "");
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as TrackBody;
    const sessionId = clean(body.sessionId);
    const eventType = clean(body.eventType);
    const answers = normalizeQuizAnswers(body.answers);
    const profile = answers ? getProfile(answers) : clean(body.profile ?? "");

    if (!sessionId || !eventType) {
      return NextResponse.json({ error: "Missing sessionId or eventType" }, { status: 400 });
    }
    if (!allowedEventTypes.has(eventType)) {
      return NextResponse.json({ error: "Invalid eventType" }, { status: 400 });
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

    if (eventType === "results_viewed") {
      if (!answers) {
        return NextResponse.json({ error: "Missing or invalid quiz answers" }, { status: 400 });
      }
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
        q1: answers[1] ?? null,
        q2: answers[2] ?? null,
        q3: answers[3] ?? null,
        q4: answers[4] ?? null,
        q5: answers[5] ?? null,
        q6: answers[6] ?? null,
        q7: answers[7] ?? null,
        q8: answers[8] ?? null,
        q9: answers[9] ?? null
      };
      const variant1 = baseQuizPayload;
      const variant2 = { ...baseQuizPayload };
      delete variant2.event_type;
      const variants = [variant1, variant2];
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
