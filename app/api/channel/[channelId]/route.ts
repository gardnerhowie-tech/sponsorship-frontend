import { NextResponse } from "next/server";
import { google } from "googleapis";

const SHEET_ID =
  "14tYjvqaTJeNBe0AwhxIEPj6RjfKdudhV5QzRFfpAf0E";

const SHEET_NAME =
  "CHANNEL_MASTER";

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

    if (rows.length < 2) {

      throw new Error(
        "CHANNEL_MASTER empty"
      );
    }

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

      return NextResponse.json(
        {
          success: false,
          error:
            "Channel not found",
        },
        {
          status: 404,
        }
      );
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

    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          error.message ||
          "Failed to fetch channel",
      },
      {
        status: 500,
      }
    );
  }
}