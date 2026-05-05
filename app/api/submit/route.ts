import { NextRequest, NextResponse } from "next/server";
import { quizLabelByQuestionAndValue } from "@/lib/quiz-data";
import { insertSupabaseRow } from "@/lib/supabase-admin";

type SubmissionBody = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  currentProvider?: string;
  answers: Record<number, string>;
  profile: "A" | "B" | "C" | null;
  guideConsent: boolean;
  referralConsent: boolean;
  sessionId?: string;
  source?: string | null;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ukPhoneRegex = /^(\+44|0)\d{9,10}$/;
const allowedSources = new Set(["results_top", "results_bottom"]);

function clean(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim().replace(/[<>]/g, "");
}

function answerLabel(questionId: number, answerValue: string | undefined) {
  if (!answerValue) return "";
  return quizLabelByQuestionAndValue[questionId]?.[answerValue] ?? answerValue;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as SubmissionBody;

    const firstName = clean(body.firstName);
    const lastName = clean(body.lastName);
    const email = clean(body.email);
    const phone = clean(body.phone).replace(/\s+/g, "");
    const currentProvider = clean(body.currentProvider);

    if (!firstName || !lastName || !email || !phone || !currentProvider || !body.referralConsent) {
      return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
    }
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format." }, { status: 400 });
    }
    if (!ukPhoneRegex.test(phone)) {
      return NextResponse.json({ error: "Invalid UK phone number format." }, { status: 400 });
    }

    const answers = body.answers ?? {};
    const profile = body.profile ?? "";
    const sessionId = clean(body.sessionId);
    const rawSource = clean(body.source ?? "");
    const source = allowedSources.has(rawSource) ? rawSource : "";
    const catheterType = answerLabel(2, answers[2]);
    const leadsTables = Array.from(
      new Set([process.env.SUPABASE_LEADS_TABLE || "catheter_leads", "catheter_leads"])
    );
    const eventsTable = process.env.SUPABASE_EVENTS_TABLE || "quiz_events";
    const leadPayload: Record<string, unknown> = {
      session_id: sessionId || null,
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      current_provider: currentProvider,
      catheter_type: catheterType || null,
      source: source || null,
      q1: answerLabel(1, answers[1]),
      q2: answerLabel(2, answers[2]),
      q3: answerLabel(3, answers[3]),
      q4: answerLabel(4, answers[4]),
      q5: answerLabel(5, answers[5]),
      q6: answerLabel(6, answers[6]),
      q7: answerLabel(7, answers[7]),
      q8: answerLabel(8, answers[8]),
      q9: answerLabel(9, answers[9]),
      result_profile: profile || null,
      guide_consent: Boolean(body.guideConsent),
      referral_consent: Boolean(body.referralConsent)
    };

    // Attempt inserts in order from richest to most stripped-down so we still
    // succeed if some columns don't yet exist on the Supabase table.
    const payloadVariants: Array<Record<string, unknown>> = [
      leadPayload,
      (() => {
        const v = { ...leadPayload };
        delete v.source;
        return v;
      })(),
      (() => {
        const v = { ...leadPayload };
        delete v.source;
        delete v.catheter_type;
        delete v.q9;
        return v;
      })(),
      (() => {
        const v = { ...leadPayload };
        delete v.source;
        delete v.catheter_type;
        delete v.q9;
        delete v.session_id;
        delete v.result_profile;
        return v;
      })(),
      (() => {
        const v = { ...leadPayload };
        delete v.source;
        delete v.catheter_type;
        delete v.q9;
        delete v.session_id;
        delete v.result_profile;
        delete v.current_provider;
        delete v.guide_consent;
        return v;
      })(),
      (() => {
        const v = { ...leadPayload };
        delete v.source;
        delete v.catheter_type;
        delete v.session_id;
        delete v.result_profile;
        delete v.guide_consent;
        delete v.q1;
        delete v.q2;
        delete v.q3;
        delete v.q4;
        delete v.q5;
        delete v.q6;
        delete v.q7;
        delete v.q8;
        delete v.q9;
        return v;
      })(),
      (() => {
        const v = { ...leadPayload };
        delete v.source;
        delete v.catheter_type;
        delete v.session_id;
        delete v.result_profile;
        delete v.guide_consent;
        delete v.q1;
        delete v.q2;
        delete v.q3;
        delete v.q4;
        delete v.q5;
        delete v.q6;
        delete v.q7;
        delete v.q8;
        delete v.q9;
        delete v.current_provider;
        return v;
      })()
    ];

    let inserted = false;
    const failures: string[] = [];
    for (const table of leadsTables) {
      for (const payload of payloadVariants) {
        try {
          await insertSupabaseRow(table, payload);
          inserted = true;
          break;
        } catch (err) {
          failures.push(`${table}: ${String(err)}`);
        }
      }
      if (inserted) break;
    }

    if (!inserted) {
      throw new Error(`Lead insert failed across all attempts. ${failures.join(" | ")}`);
    }

    if (sessionId) {
      const eventBase = {
        session_id: sessionId,
        event_type: "contact_submitted",
        profile: profile || null
      };
      try {
        await insertSupabaseRow(eventsTable, { ...eventBase, source: source || null });
      } catch (firstEventError) {
        try {
          // Retry without the source column in case the table schema doesn't have it yet.
          await insertSupabaseRow(eventsTable, eventBase);
        } catch (eventError) {
          // Event logging is best-effort and should never block lead submission.
          console.warn("Event tracking failed (non-blocking):", firstEventError, eventError);
        }
      }
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error submitting form:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to submit. Please try again later." },
      { status: 500 }
    );
  }
}
