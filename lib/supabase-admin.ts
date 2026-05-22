export class SupabaseInsertError extends Error {
  constructor(
    message: string,
    readonly table: string,
    readonly status: number,
    readonly responseBody: string
  ) {
    super(message);
    this.name = "SupabaseInsertError";
  }
}

function getSupabaseConfig() {
  const defaultUrl = "https://sowufofobpspqmjviehl.supabase.co";
  const url = (process.env.SUPABASE_URL || defaultUrl).trim().replace(/\/+$/, "");
  const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();

  if (!url || !serviceRoleKey) {
    throw new Error("Missing Supabase server credentials");
  }

  if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(url)) {
    throw new Error(`Invalid SUPABASE_URL format: ${url}`);
  }

  return { url, serviceRoleKey };
}

export async function insertSupabaseRow(table: string, row: Record<string, unknown>) {
  const { url, serviceRoleKey } = getSupabaseConfig();
  let response: Response;
  try {
    response = await fetch(`${url}/rest/v1/${table}`, {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal"
      },
      body: JSON.stringify(row)
    });
  } catch (error) {
    throw new Error(
      `Supabase network request failed (${table}) to ${url}. ${error instanceof Error ? error.message : String(error)}`
    );
  }

  if (!response.ok) {
    const message = await response.text();
    throw new SupabaseInsertError(`Supabase insert failed (${table}): ${message}`, table, response.status, message);
  }
}

export function isSupabaseMissingColumnError(error: unknown): boolean {
  const message = error instanceof SupabaseInsertError ? error.responseBody : error instanceof Error ? error.message : "";
  return (
    /\bPGRST204\b/i.test(message) ||
    /\b42703\b/i.test(message) ||
    /column .* (does not exist|not found|could not be found)/i.test(message) ||
    /could not find .* column/i.test(message)
  );
}

export function isSupabaseMissingTableError(error: unknown): boolean {
  const message = error instanceof SupabaseInsertError ? error.responseBody : error instanceof Error ? error.message : "";
  return /\b42P01\b/i.test(message) || /\bPGRST205\b/i.test(message) || /relation .* does not exist/i.test(message);
}
