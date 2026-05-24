import assert from "node:assert/strict";
import test from "node:test";
import { buildLeadPayloadVariants } from "../lib/lead-payload-variants.ts";

const fullPayload = {
  session_id: "session-1",
  first_name: "Ada",
  last_name: "Lovelace",
  email: "ada@example.com",
  phone: "07123456789",
  current_provider: "Provider",
  catheter_type: "Intermittent catheter (ISC)",
  source: "results_top",
  q1: "Less than 3 months",
  q2: "Intermittent catheter (ISC)",
  q3: "3-4 times",
  q4: "Discomfort",
  q5: "Happy",
  q6: "At work",
  q7: "Comfort",
  q8: "Home delivery",
  q9: "Satisfied",
  result_profile: "B",
  guide_consent: true,
  referral_consent: true
};

function keys(payload: Record<string, unknown>): Set<string> {
  return new Set(Object.keys(payload));
}

test("lead payload variants preserve new columns when only q9 is missing", () => {
  const variants = buildLeadPayloadVariants(fullPayload);
  const q9OnlyIndex = variants.findIndex((variant) => {
    const variantKeys = keys(variant);
    return !variantKeys.has("q9") && variantKeys.has("source") && variantKeys.has("catheter_type");
  });
  const allRecentColumnsIndex = variants.findIndex((variant) => {
    const variantKeys = keys(variant);
    return !variantKeys.has("q9") && !variantKeys.has("source") && !variantKeys.has("catheter_type");
  });

  assert.deepEqual(variants[0], fullPayload);
  assert.notEqual(q9OnlyIndex, -1);
  assert.notEqual(allRecentColumnsIndex, -1);
  assert.ok(q9OnlyIndex < allRecentColumnsIndex);
});

test("lead payload variants combine legacy fallbacks with minimal recent column removals", () => {
  const variants = buildLeadPayloadVariants(fullPayload);
  const legacyAndQ9Index = variants.findIndex((variant) => {
    const variantKeys = keys(variant);
    return (
      !variantKeys.has("session_id") &&
      !variantKeys.has("result_profile") &&
      !variantKeys.has("q9") &&
      variantKeys.has("source") &&
      variantKeys.has("catheter_type")
    );
  });

  assert.notEqual(legacyAndQ9Index, -1);
});

test("lead payload variants do not contain duplicate column sets", () => {
  const variants = buildLeadPayloadVariants(fullPayload);
  const signatures = variants.map((variant) => Object.keys(variant).sort().join("|"));

  assert.equal(new Set(signatures).size, signatures.length);
});
