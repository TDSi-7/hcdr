type Payload = Record<string, unknown>;

function without(payload: Payload, ...keys: string[]): Payload {
  const variant = { ...payload };
  for (const key of keys) {
    delete variant[key];
  }
  return variant;
}

/** Fall back only by removing optional metadata. Never drop quiz/consent/profile fields. */
export function getLeadPayloadVariants(payload: Payload): Payload[] {
  return [
    payload,
    without(payload, "source"),
    without(payload, "source", "catheter_type"),
    without(payload, "source", "catheter_type", "session_id")
  ];
}

/** Schema fallbacks may omit metadata, but never the answers this row exists to capture. */
export function getQuizPayloadVariants(payload: Payload): Payload[] {
  return [payload, without(payload, "event_type"), without(payload, "event_type", "session_id")];
}
