import { normalizeQuizAnswers } from "@/lib/quiz-validation";

export const QUIZ_ANSWERS_KEY = "hcdr_quiz_answers";
export const QUIZ_PROFILE_KEY = "hcdr_quiz_profile";
export const QUIZ_SESSION_KEY = "hcdr_quiz_session_id";
export const QUIZ_SCHEMA_VERSION_KEY = "hcdr_quiz_schema_version";
export const QUIZ_SCHEMA_VERSION = "v5.1";

export function loadAnswers(): Record<number, string> {
  if (typeof window === "undefined") {
    return {};
  }
  if (window.sessionStorage.getItem(QUIZ_SCHEMA_VERSION_KEY) !== QUIZ_SCHEMA_VERSION) {
    clearQuizState();
    return {};
  }
  const raw = window.sessionStorage.getItem(QUIZ_ANSWERS_KEY);
  if (!raw) {
    return {};
  }
  try {
    const answers = normalizeQuizAnswers(JSON.parse(raw));
    if (!answers) {
      clearQuizState();
      return {};
    }
    return answers;
  } catch {
    clearQuizState();
    return {};
  }
}

export function saveAnswers(answers: Record<number, string>): void {
  if (typeof window === "undefined") {
    return;
  }
  const normalizedAnswers = normalizeQuizAnswers(answers);
  if (!normalizedAnswers) {
    clearQuizState();
    return;
  }
  window.sessionStorage.setItem(QUIZ_SCHEMA_VERSION_KEY, QUIZ_SCHEMA_VERSION);
  window.sessionStorage.setItem(QUIZ_ANSWERS_KEY, JSON.stringify(normalizedAnswers));
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
  window.sessionStorage.removeItem(QUIZ_SCHEMA_VERSION_KEY);
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
