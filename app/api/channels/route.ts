import { NextResponse } from "next/server";
import { google } from "googleapis";

const SHEET_ID = "14tYjvqaTJeNBe0AwhxIEPj6RjfKdudhV5QzRFfpAf0E";
const SHEET_NAME = "CHANNEL_MASTER";

export async function GET() {
  try {

    const auth = new google.auth.GoogleAuth({
      keyFile:
        "/Users/macbook/Desktop/sponsorship matching/Host Responsiveness/sheets-service-account.json",

      scopes: [
        "https://www.googleapis.com/auth/spreadsheets.readonly",
      ],
    });

    const sheets = google.sheets({
      version: "v4",
      auth,
    });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A:Z`,
    });

    const rows = response.data.values || [];

    if (rows.length < 2) {
      return NextResponse.json({
        success: true,
        data: [],
      });
    }

    const headers = rows[0];

    const dataRows = rows.slice(1);

    const channels = dataRows.map((row) => {
      const obj: Record<string, any> = {};

      headers.forEach((header, index) => {
        obj[header] = row[index];
      });

      return obj;
    });

    return NextResponse.json({
      success: true,
      data: channels,
    });

  } catch (error: any) {

    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch channels",
      },
      {
        status: 500,
      }
    );
  }
}