import { quizQuestions } from "./quiz-data";

export const QUIZ_ANSWERS_KEY = "hcdr_quiz_answers";
export const QUIZ_PROFILE_KEY = "hcdr_quiz_profile";
export const QUIZ_SESSION_KEY = "hcdr_quiz_session_id";

const CURRENT_QUIZ_STORAGE_VERSION = "v2";
const VERSIONED_QUIZ_ANSWERS_KEY = `${QUIZ_ANSWERS_KEY}_${CURRENT_QUIZ_STORAGE_VERSION}`;
const VERSIONED_QUIZ_PROFILE_KEY = `${QUIZ_PROFILE_KEY}_${CURRENT_QUIZ_STORAGE_VERSION}`;

export function isValidQuizAnswerSet(value: unknown): value is Record<number, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const answers = value as Record<number, unknown>;
  return quizQuestions.every((question) => {
    const answer = answers[question.id];
    return typeof answer === "string" && question.options.some((option) => option.value === answer);
  });
}

export function loadAnswers(): Record<number, string> {
  if (typeof window === "undefined") {
    return {};
  }
  const raw = window.sessionStorage.getItem(VERSIONED_QUIZ_ANSWERS_KEY);
  if (!raw) {
    return {};
  }
  try {
    const parsed = JSON.parse(raw);
    if (!isValidQuizAnswerSet(parsed)) {
      clearQuizState();
      return {};
    }
    return parsed;
  } catch {
    clearQuizState();
    return {};
  }
}

export function saveAnswers(answers: Record<number, string>): void {
  if (typeof window === "undefined") {
    return;
  }
  window.sessionStorage.setItem(VERSIONED_QUIZ_ANSWERS_KEY, JSON.stringify(answers));
}

export function saveProfile(profile: "A" | "B" | "C"): void {
  if (typeof window === "undefined") {
    return;
  }
  window.sessionStorage.setItem(VERSIONED_QUIZ_PROFILE_KEY, profile);
}

export function loadProfile(): "A" | "B" | "C" | null {
  if (typeof window === "undefined") {
    return null;
  }
  const value = window.sessionStorage.getItem(VERSIONED_QUIZ_PROFILE_KEY);
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
  window.sessionStorage.removeItem(VERSIONED_QUIZ_ANSWERS_KEY);
  window.sessionStorage.removeItem(VERSIONED_QUIZ_PROFILE_KEY);
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
