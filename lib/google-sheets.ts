import { google } from "googleapis";

function getPrivateKey() {
  const key = process.env.GOOGLE_SHEETS_PRIVATE_KEY;
  return key ? key.replace(/\\n/g, "\n") : "";
}

export async function appendRowToSheet(row: (string | boolean)[], range = "Sheet1!A:S") {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const privateKey = getPrivateKey();

  if (!spreadsheetId || !clientEmail || !privateKey) {
    throw new Error("Google Sheets credentials are missing");
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"]
  });

  const sheets = google.sheets({ version: "v4", auth });
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: "RAW",
    requestBody: {
      values: [row]
    }
  });
}
