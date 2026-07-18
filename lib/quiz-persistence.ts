type Payload = Record<string, unknown>;

function without(payload: Payload, ...keys: string[]): Payload {
  const variant = { ...payload };
  for (const key of keys) {
    delete variant[key];
  }
  return variant;
}

export function getLeadPayloadVariants(payload: Payload): Payload[] {
  return [
    payload,
    without(payload, "source"),
    without(payload, "source", "catheter_type"),
    without(payload, "source", "catheter_type", "session_id")
  ];
}

export function getQuizPayloadVariants(payload: Payload): Payload[] {
  return [payload, without(payload, "event_type"), without(payload, "event_type", "session_id")];
}
