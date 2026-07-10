const optionalLeadColumns = ["source", "catheter_type", "session_id"] as const;

export const requiredLeadColumns = [
  "first_name",
  "last_name",
  "email",
  "phone",
  "current_provider",
  "q1",
  "q2",
  "q3",
  "q4",
  "q5",
  "q6",
  "q7",
  "q8",
  "q9",
  "result_profile",
  "guide_consent",
  "referral_consent"
] as const;

function withoutColumns(payload: Record<string, unknown>, columns: readonly string[]) {
  const variant = { ...payload };
  for (const column of columns) {
    delete variant[column];
  }
  return variant;
}

export function buildLeadPayloadVariants(leadPayload: Record<string, unknown>): Array<Record<string, unknown>> {
  return [
    leadPayload,
    withoutColumns(leadPayload, [optionalLeadColumns[0]]),
    withoutColumns(leadPayload, [optionalLeadColumns[0], optionalLeadColumns[1]]),
    withoutColumns(leadPayload, optionalLeadColumns)
  ];
}
