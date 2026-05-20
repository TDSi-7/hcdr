export const REQUIRED_QUIZ_QUESTION_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
export const QUIZ_ANSWERS_KEY = "hcdr_quiz_answers_v2";
export const QUIZ_PROFILE_KEY = "hcdr_quiz_profile_v2";
export const QUIZ_SESSION_KEY = "hcdr_quiz_session_id";

const LEGACY_QUIZ_ANSWERS_KEY = "hcdr_quiz_answers";
const LEGACY_QUIZ_PROFILE_KEY = "hcdr_quiz_profile";

export function hasCompleteQuizAnswers(answers: Record<number, string>): boolean {
  return REQUIRED_QUIZ_QUESTION_IDS.every((questionId) => {
    const answer = answers[questionId];
    return typeof answer === "string" && answer.trim().length > 0;
  });
}

export function loadAnswers(): Record<number, string> {
  if (typeof window === "undefined") {
    return {};
  }
  const raw = window.sessionStorage.getItem(QUIZ_ANSWERS_KEY);
  if (!raw) {
    return {};
  }
  try {
    return JSON.parse(raw) as Record<number, string>;
  } catch {
    return {};
  }
}

export function saveAnswers(answers: Record<number, string>): void {
  if (typeof window === "undefined") {
    return;
  }
  window.sessionStorage.setItem(QUIZ_ANSWERS_KEY, JSON.stringify(answers));
}

export function saveProfile(profile: "A" | "B" | "C"): void {
  if (typeof window === "undefined") {
    return;
  }
  window.sessionStorage.setItem(QUIZ_PROFILE_KEY, profile);
}

export function loadProfile(): "A" | "B" | "C" | null {
  if (typeof window === "undefined") {
    return null;
  }
  const value = window.sessionStorage.getItem(QUIZ_PROFILE_KEY);
  if (value === "A" || value === "B" || value === "C") {
    return value;
  }
  return null;
}

export function clearQuizState(): void {
  if (typeof window === "undefined") {
    return;
  }
  window.sessionStorage.removeItem(QUIZ_ANSWERS_KEY);
  window.sessionStorage.removeItem(QUIZ_PROFILE_KEY);
  window.sessionStorage.removeItem(LEGACY_QUIZ_ANSWERS_KEY);
  window.sessionStorage.removeItem(LEGACY_QUIZ_PROFILE_KEY);
  window.sessionStorage.removeItem(QUIZ_SESSION_KEY);
}

export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") {
    return "server";
  }
  const existing = window.sessionStorage.getItem(QUIZ_SESSION_KEY);
  if (existing) {
    return existing;
  }
  const generated = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  window.sessionStorage.setItem(QUIZ_SESSION_KEY, generated);
  return generated;
}
