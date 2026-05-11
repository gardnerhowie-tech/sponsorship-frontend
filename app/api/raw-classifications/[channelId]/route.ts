import { NextResponse } from "next/server";
import { google } from "googleapis";

const SHEET_ID =
  "1pAAeI8iD8VcO2flmAu02kxhIo9nsSkWj4RxphejRZvI";

const SHEET_NAME =
  "RAW_COMMENT_CLASSIFICATIONS";

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

        credentials: JSON.parse(
          process.env
            .GOOGLE_SERVICE_ACCOUNT || "{}"
        ),

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

        spreadsheetId:
          SHEET_ID,

        range:
          `${SHEET_NAME}!A:Z`,
      });

    const rows =
      response.data.values || [];

    const headers =
      rows[0];

    const dataRows =
      rows.slice(1);

    const match =
      dataRows.find(
        (row) =>
          row[0] === channelId
      );

    if (!match) {

      return NextResponse.json({
        success: false,
      });
    }

    const result:
      Record<string, any> = {};

    headers.forEach(
      (header, index) => {

        result[header] =
          match[index];
      }
    );

    return NextResponse.json({
      success: true,
      data: result,
    });

  } catch (error: any) {

    return NextResponse.json({
      success: false,

      error:
        error.message ||
        "Failed to fetch classifications",
    });
  }
}