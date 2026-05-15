import { NextRequest, NextResponse } from "next/server";
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

function omitKeys(source: Record<string, unknown>, keys: string[]) {
  const copy = { ...source };
  for (const key of keys) {
    delete copy[key];
  }
  return copy;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as TrackBody;
    const sessionId = clean(body.sessionId);
    const eventType = clean(body.eventType);
    const profile = clean(body.profile ?? "");
    const answers = body.answers ?? {};

    if (!sessionId || !eventType) {
      return NextResponse.json({ error: "Missing sessionId or eventType" }, { status: 400 });
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
      const legacyQuizPayload: Record<string, unknown> = {
        session_id: sessionId,
        event_type: eventType,
        q1: answers[1] ?? null,
        q2: answers[3] ?? null,
        q3: answers[4] ?? null,
        q4: answers[5] ?? null,
        q5: answers[6] ?? null,
        q6: answers[7] ?? null,
        q7: answers[8] ?? null,
        q8: answers[9] ?? null
      };
      const minimalWithSession = {
        session_id: sessionId,
        event_type: eventType
      };
      const minimalEventOnly = {
        event_type: eventType
      };
      const variants = [
        baseQuizPayload,
        omitKeys(baseQuizPayload, ["event_type"]),
        omitKeys(baseQuizPayload, ["event_type", "session_id"]),
        legacyQuizPayload,
        omitKeys(legacyQuizPayload, ["event_type"]),
        omitKeys(legacyQuizPayload, ["event_type", "session_id"]),
        minimalWithSession,
        minimalEventOnly
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
