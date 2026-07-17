import assert from "node:assert/strict";
import test from "node:test";
import { hasCompleteQuizAnswers } from "../lib/quiz-validation";
import { loadAnswers, QUIZ_ANSWERS_KEY, QUIZ_PROFILE_KEY } from "../lib/storage";

const currentAnswers = {
  1: "new",
  2: "isc",
  3: "1-2",
  4: "discomfort",
  5: "happy",
  6: "work",
  7: "comfort",
  8: "collect",
  9: "5"
};

test("accepts a complete current-schema answer map", () => {
  assert.equal(hasCompleteQuizAnswers(currentAnswers), true);
});

test("rejects an eight-question answer map from the previous quiz", () => {
  const staleAnswers = {
    1: "new",
    2: "1-2",
    3: "discomfort",
    4: "happy",
    5: "work",
    6: "comfort",
    7: "collect",
    8: "5"
  };

  assert.equal(hasCompleteQuizAnswers(staleAnswers), false);
});

test("rejects answers that do not belong to their question", () => {
  assert.equal(hasCompleteQuizAnswers({ ...currentAnswers, 2: "3-4" }), false);
});

test("clears persisted answers and profile when the stored schema is stale", (t) => {
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  const values = new Map<string, string>([
    [QUIZ_ANSWERS_KEY, JSON.stringify({ ...currentAnswers, 9: undefined })],
    [QUIZ_PROFILE_KEY, "C"]
  ]);
  const sessionStorage = {
    getItem: (key: string) => values.get(key) ?? null,
    removeItem: (key: string) => values.delete(key)
  };
  Object.defineProperty(globalThis, "window", {
    value: { sessionStorage },
    configurable: true
  });
  t.after(() => {
    if (originalWindow) Object.defineProperty(globalThis, "window", originalWindow);
    else Reflect.deleteProperty(globalThis, "window");
  });

  assert.deepEqual(loadAnswers(), {});
  assert.equal(values.has(QUIZ_ANSWERS_KEY), false);
  assert.equal(values.has(QUIZ_PROFILE_KEY), false);
});
