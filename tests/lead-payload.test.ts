import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildLeadPayloadVariants, requiredLeadColumns } from "../lib/lead-payload";

describe("lead payload variants", () => {
  it("preserves required quiz, profile, consent, and contact fields in every fallback", () => {
    const leadPayload = {
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
      q3: "1-2 times",
      q4: "Discomfort",
      q5: "No",
      q6: "At home",
      q7: "Comfort",
      q8: "Home delivery",
      q9: "5",
      result_profile: "C",
      guide_consent: false,
      referral_consent: true
    };

    const variants = buildLeadPayloadVariants(leadPayload);

    assert.equal(variants.length, 4);
    for (const variant of variants) {
      for (const column of requiredLeadColumns) {
        assert.ok(column in variant, `${column} was dropped from ${JSON.stringify(variant)}`);
      }
    }
  });
});
