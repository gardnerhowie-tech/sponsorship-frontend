import { NextResponse } from "next/server";
import { google } from "googleapis";

const SHEET_ID =
  "14tYjvqaTJeNBe0AwhxIEPj6RjfKdudhV5QzRFfpAf0E";

const SHEET_NAME =
  "TRUST_INDEX_HISTORY";

export async function GET(
  req: Request,
  context: {
    params: Promise<{
      channelId: string;
    }>;
  }
) {

  try {

    const { channelId } =
      await context.params;

    const auth =
      new google.auth.GoogleAuth({

        keyFile:
          "/Users/macbook/Desktop/sponsorship matching/Host Responsiveness/sheets-service-account.json",

        scopes: [
          "https://www.googleapis.com/auth/spreadsheets.readonly",
        ],
      });

    const sheets =
      google.sheets({
        version: "v4",
        auth,
      });

    const response =
      await sheets.spreadsheets.values.get({

        spreadsheetId: SHEET_ID,

        range: `${SHEET_NAME}!A:Z`,
      });

    const rows =
      response.data.values || [];

    if (rows.length < 2) {

      return NextResponse.json({
        success: true,
        history: [],
      });
    }

    const headers = rows[0];

    const dataRows = rows.slice(1);

    const matches = dataRows
      .filter((row) => row[0] === channelId)
      .map((row) => {

        const result:
          Record<string, any> = {};

        headers.forEach(
          (header, index) => {

            result[header] =
              row[index];
          }
        );

        return result;
      });

    return NextResponse.json({
      success: true,
      history: matches,
    });

  } catch (error: any) {

    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          error.message ||
          "Failed to fetch history",
      },
      {
        status: 500,
      }
    );
  }
}