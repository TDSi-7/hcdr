import { NextRequest, NextResponse } from "next/server";
import { isCompleteQuizAnswers } from "@/lib/quiz-data";
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
    const profile = clean(body.profile ?? "");
    const answers = body.answers ?? {};
    const completeAnswers = isCompleteQuizAnswers(answers) ? answers : null;

    if (!sessionId || !eventType) {
      return NextResponse.json({ error: "Missing sessionId or eventType" }, { status: 400 });
    }
    if (eventType === "results_viewed" && !completeAnswers) {
      return NextResponse.json({ error: "Incomplete quiz answers" }, { status: 400 });
    }

    const eventsTable = process.env.SUPABASE_EVENTS_TABLE || "quiz_events";
    const eventProfile = eventType === "results_viewed" && completeAnswers ? getProfile(completeAnswers) : profile;
    try {
      await insertSupabaseRow(eventsTable, {
        session_id: sessionId,
        event_type: eventType,
        profile: eventProfile || null
      });
    } catch (eventsError) {
      // Events table is optional for now; do not block quiz completion capture.
      console.warn("Event insert failed (non-blocking):", eventsError);
    }

    if (eventType === "results_viewed" && completeAnswers) {
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
        q1: completeAnswers[1],
        q2: completeAnswers[2],
        q3: completeAnswers[3],
        q4: completeAnswers[4],
        q5: completeAnswers[5],
        q6: completeAnswers[6],
        q7: completeAnswers[7],
        q8: completeAnswers[8],
        q9: completeAnswers[9]
      };
      const variant1 = baseQuizPayload;
      const variant2 = { ...baseQuizPayload };
      delete variant2.q9;
      const variant3 = { ...variant2 };
      delete variant3.event_type;
      const variant4 = { ...variant3 };
      delete variant4.session_id;
      const variant5 = {
        session_id: sessionId,
        event_type: eventType
      };
      const variant6 = {
        event_type: eventType
      };
      const variants = [variant1, variant2, variant3, variant4, variant5, variant6];
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
