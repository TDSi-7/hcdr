import assert from "node:assert/strict";
import test from "node:test";
import { NextRequest } from "next/server";
import { POST } from "../app/api/track/route";

const validAnswers = {
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

function requestFor(answers: Record<number, string>) {
  return new NextRequest("http://localhost/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: "session-1",
      eventType: "results_viewed",
      profile: "C",
      answers
    })
  });
}

test("quiz completion fallbacks never discard answer data", async (t) => {
  const originalFetch = globalThis.fetch;
  const originalUrl = process.env.SUPABASE_URL;
  const originalKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const payloads: Array<Record<string, unknown>> = [];

  process.env.SUPABASE_URL = "https://example.supabase.co";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "test-key";
  globalThis.fetch = async (_input, init) => {
    payloads.push(JSON.parse(String(init?.body)) as Record<string, unknown>);
    const status = payloads.length === 1 || payloads.length === 4 ? 201 : 400;
    return new Response(status === 201 ? null : "unknown column", { status });
  };
  t.after(() => {
    globalThis.fetch = originalFetch;
    if (originalUrl === undefined) delete process.env.SUPABASE_URL;
    else process.env.SUPABASE_URL = originalUrl;
    if (originalKey === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    else process.env.SUPABASE_SERVICE_ROLE_KEY = originalKey;
  });

  const response = await POST(requestFor(validAnswers));

  assert.equal(response.status, 200);
  assert.equal(payloads.length, 4);
  for (const payload of payloads.slice(1)) {
    for (let question = 1; question <= 9; question += 1) {
      assert.equal(payload[`q${question}`], validAnswers[question]);
    }
  }
});
