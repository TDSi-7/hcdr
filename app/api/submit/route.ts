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
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ukPhoneRegex = /^(\+44|0)\d{9,10}$/;

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
    const leadsTable = process.env.SUPABASE_LEADS_TABLE || "catheter_leads";
    const eventsTable = process.env.SUPABASE_EVENTS_TABLE || "quiz_events";
    const leadPayload: Record<string, unknown> = {
      session_id: sessionId || null,
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      current_provider: currentProvider,
      q1: answerLabel(1, answers[1]),
      q2: answerLabel(2, answers[2]),
      q3: answerLabel(3, answers[3]),
      q4: answerLabel(4, answers[4]),
      q5: answerLabel(5, answers[5]),
      q6: answerLabel(6, answers[6]),
      q7: answerLabel(7, answers[7]),
      q8: answerLabel(8, answers[8]),
      result_profile: profile || null,
      guide_consent: Boolean(body.guideConsent),
      referral_consent: Boolean(body.referralConsent)
    };

    try {
      await insertSupabaseRow(leadsTable, leadPayload);
    } catch (leadInsertError) {
      // Fallback for leaner schemas: drop optional metadata fields first.
      const fallbackPayload = { ...leadPayload };
      delete fallbackPayload.session_id;
      delete fallbackPayload.result_profile;
      delete fallbackPayload.current_provider;
      delete fallbackPayload.guide_consent;
      try {
        await insertSupabaseRow(leadsTable, fallbackPayload);
      } catch (fallbackLeadError) {
        throw new Error(
          `Lead insert failed for table ${leadsTable}. First attempt: ${String(leadInsertError)}. Fallback attempt: ${String(fallbackLeadError)}`
        );
      }
    }

    if (sessionId) {
      try {
        await insertSupabaseRow(eventsTable, {
          session_id: sessionId,
          event_type: "contact_submitted",
          profile: profile || null
        });
      } catch (eventError) {
        // Event logging is best-effort and should never block lead submission.
        console.warn("Event tracking failed (non-blocking):", eventError);
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
