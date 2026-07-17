import assert from "node:assert/strict";
import test from "node:test";
import { NextRequest } from "next/server";
import { POST } from "../app/api/submit/route";

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

const validSubmission = {
  firstName: "Ada",
  lastName: "Lovelace",
  email: "ada@example.com",
  phone: "07123456789",
  currentProvider: "Fittleworth",
  answers: validAnswers,
  profile: "A",
  guideConsent: false,
  referralConsent: true
};

function requestFor(body: unknown) {
  return new NextRequest("http://localhost/api/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
}

test("rejects stale quiz answers before attempting a database write", async (t) => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => {
    throw new Error("database write should not be attempted");
  };
  t.after(() => {
    globalThis.fetch = originalFetch;
  });

  const response = await POST(
    requestFor({
      ...validSubmission,
      answers: { ...validAnswers, 9: undefined }
    })
  );

  assert.equal(response.status, 400);
  assert.match((await response.json()).error, /complete the current quiz/i);
});

test("fallback inserts retain answers, computed profile, provider and consent", async (t) => {
  const originalFetch = globalThis.fetch;
  const originalUrl = process.env.SUPABASE_URL;
  const originalKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const payloads: Array<Record<string, unknown>> = [];

  process.env.SUPABASE_URL = "https://example.supabase.co";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "test-key";
  globalThis.fetch = async (_input, init) => {
    payloads.push(JSON.parse(String(init?.body)) as Record<string, unknown>);
    const status = payloads.length < 3 ? 400 : 201;
    return new Response(status === 201 ? null : "unknown column", { status });
  };
  t.after(() => {
    globalThis.fetch = originalFetch;
    if (originalUrl === undefined) delete process.env.SUPABASE_URL;
    else process.env.SUPABASE_URL = originalUrl;
    if (originalKey === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    else process.env.SUPABASE_SERVICE_ROLE_KEY = originalKey;
  });

  const response = await POST(requestFor(validSubmission));

  assert.equal(response.status, 200);
  assert.equal(payloads.length, 3);
  for (const payload of payloads) {
    for (let question = 1; question <= 9; question += 1) {
      assert.equal(typeof payload[`q${question}`], "string");
      assert.notEqual(payload[`q${question}`], "");
    }
    assert.equal(payload.result_profile, "C");
    assert.equal(payload.current_provider, "Fittleworth");
    assert.equal(payload.guide_consent, false);
    assert.equal(payload.referral_consent, true);
  }
});
