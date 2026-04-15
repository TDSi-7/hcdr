export type QuizEventType =
  | "results_viewed"
  | "connect_clicked"
  | "guide_clicked"
  | "start_over_clicked"
  | "contact_submitted";

export async function trackQuizEvent(payload: {
  sessionId: string;
  eventType: QuizEventType;
  profile?: "A" | "B" | "C" | null;
  answers?: Record<number, string>;
}) {
  try {
    await fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true
    });
  } catch {
    // Best-effort only; avoid blocking quiz flow.
  }
}
