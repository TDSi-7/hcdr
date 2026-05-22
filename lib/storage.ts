import { coerceQuizAnswers, hasCompleteQuizAnswers } from "@/lib/quiz-validation";

export const QUIZ_ANSWERS_KEY = "hcdr_quiz_answers";
export const QUIZ_PROFILE_KEY = "hcdr_quiz_profile";
export const QUIZ_SESSION_KEY = "hcdr_quiz_session_id";
export const QUIZ_ANSWERS_SCHEMA_VERSION = 2;

type StoredAnswers = {
  version: number;
  answers: Record<number, string>;
};

export function loadAnswers(): Record<number, string> {
  if (typeof window === "undefined") {
    return {};
  }
  const raw = window.sessionStorage.getItem(QUIZ_ANSWERS_KEY);
  if (!raw) {
    return {};
  }
  try {
    const parsed = JSON.parse(raw) as StoredAnswers | Record<number, string> | null;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }

    if ("version" in parsed && parsed.version === QUIZ_ANSWERS_SCHEMA_VERSION) {
      return coerceQuizAnswers(parsed.answers);
    }

    // Pre-version storage was raw answers. Only accept it if it already matches
    // the current 9-question schema; older 8-question sessions must restart.
    if (!("version" in parsed) && hasCompleteQuizAnswers(parsed)) {
      return coerceQuizAnswers(parsed);
    }

    return {};
  } catch {
    return {};
  }
}

export function saveAnswers(answers: Record<number, string>): void {
  if (typeof window === "undefined") {
    return;
  }
  window.sessionStorage.setItem(
    QUIZ_ANSWERS_KEY,
    JSON.stringify({ version: QUIZ_ANSWERS_SCHEMA_VERSION, answers })
  );
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
