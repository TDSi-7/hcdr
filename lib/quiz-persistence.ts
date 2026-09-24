type Payload = Record<string, unknown>;

function without(payload: Payload, ...keys: string[]): Payload {
  const variant = { ...payload };
  for (const key of keys) {
    delete variant[key];
  }
  return variant;
}

/**
 * Retry a lead insert only by dropping optional metadata.
 * q1–q9, result_profile, provider, and consent columns are required and stay on every variant.
 */
export function getLeadPayloadVariants(payload: Payload): Payload[] {
  return [
    payload,
    without(payload, "source"),
    without(payload, "source", "catheter_type"),
    without(payload, "source", "catheter_type", "session_id")
  ];
}

/** Quiz-completion fallbacks may omit metadata, but never the answers the row exists to capture. */
export function getQuizPayloadVariants(payload: Payload): Payload[] {
  return [payload, without(payload, "event_type"), without(payload, "event_type", "session_id")];
}
