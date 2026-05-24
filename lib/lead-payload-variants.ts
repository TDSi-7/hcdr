type Payload = Record<string, unknown>;

const recentLeadColumnSets: string[][] = [
  [],
  ["source"],
  ["catheter_type"],
  ["q9"],
  ["source", "catheter_type", "q9"],
  ["source", "catheter_type"],
  ["source", "q9"],
  ["catheter_type", "q9"]
];

const legacyLeadColumnSets: string[][] = [
  [],
  ["session_id", "result_profile"],
  ["session_id", "result_profile", "current_provider", "guide_consent"],
  [
    "session_id",
    "result_profile",
    "guide_consent",
    "q1",
    "q2",
    "q3",
    "q4",
    "q5",
    "q6",
    "q7",
    "q8"
  ],
  [
    "session_id",
    "result_profile",
    "guide_consent",
    "q1",
    "q2",
    "q3",
    "q4",
    "q5",
    "q6",
    "q7",
    "q8",
    "current_provider"
  ]
];

function omitColumns(payload: Payload, columns: string[]): Payload {
  const variant = { ...payload };
  for (const column of columns) {
    delete variant[column];
  }
  return variant;
}

function variantSignature(payload: Payload): string {
  return Object.keys(payload).sort().join("|");
}

export function buildLeadPayloadVariants(leadPayload: Payload): Payload[] {
  const variants: Payload[] = [];
  const seen = new Set<string>();

  for (const legacyColumns of legacyLeadColumnSets) {
    for (const recentColumns of recentLeadColumnSets) {
      const variant = omitColumns(leadPayload, [...recentColumns, ...legacyColumns]);
      const signature = variantSignature(variant);
      if (!seen.has(signature)) {
        seen.add(signature);
        variants.push(variant);
      }
    }
  }

  return variants;
}
