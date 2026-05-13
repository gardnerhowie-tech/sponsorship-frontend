import { scanState } from "./scanState";
import { NextResponse } from "next/server";
import { google } from "googleapis";

const SHEET_ID = "14tYjvqaTJeNBe0AwhxIEPj6RjfKdudhV5QzRFfpAf0E";
const SHEET_NAME = "CHANNEL_MASTER";

function updateScanState(
  channelId: string,
  stage: string,
  detail: string,
  progress: number
) {
  scanState[channelId] = {
    stage,
    detail,
    progress,
    complete: false,
  };
}

function applyTelemetry(channelId: string, text: string) {
  if (text.includes("→ STEP 1: Comment Analysis")) {
    updateScanState(
      channelId,
      "Comment Analysis",
      "Fetching and classifying audience comments",
      15
    );
  }

  const commentFetchMatch = text.match(/STEP 1 COMPLETE.*Total comments:\s*(\d+)/i);

  if (commentFetchMatch) {
    updateScanState(
      channelId,
      "Audience Corpus Retrieved",
      `Collected ${commentFetchMatch[1]} audience comments`,
      25
    );
  }

  const batchMatch = text.match(/Batch\s+(\d+)\/(\d+)/i);

  if (batchMatch) {
    const current = Number(batchMatch[1]);
    const total = Number(batchMatch[2]);

    const progress = 30 + Math.round((current / total) * 35);

    updateScanState(
      channelId,
      "Behavioural Analysis",
      `Processing behavioural batch ${current} of ${total}`,
      Math.min(progress, 65)
    );
  }

  if (text.includes("STEP 3 COMPLETE")) {
    updateScanState(
      channelId,
      "Behavioural Analysis Complete",
      "Audience trust patterns classified",
      68
    );
  }

  if (text.includes("→ STEP 2: Host Responsiveness")) {
    updateScanState(
      channelId,
      "Host Responsiveness",
      "Measuring host replies and audience interaction",
      72
    );
  }

  if (text.includes("Host Responsiveness took")) {
    updateScanState(
      channelId,
      "Host Responsiveness Complete",
      "Host interaction signal completed",
      78
    );
  }

  if (text.includes("→ STEP 3: YouTube Enrichment")) {
    updateScanState(
      channelId,
      "Audience Metrics",
      "Collecting subscriber, view, and engagement metrics",
      82
    );
  }

  if (text.includes("YouTube enrichment complete")) {
    updateScanState(
      channelId,
      "Audience Metrics Complete",
      "Audience context collected",
      88
    );
  }

  if (text.includes("→ STEP 4: Execution Layer")) {
    updateScanState(
      channelId,
      "Trust Aggregation",
      "Combining trust signals into final classification",
      92
    );
  }

  if (text.includes("Execution Layer took")) {
    updateScanState(
      channelId,
      "Building Intelligence Profile",
      "Writing final profile to CHANNEL_MASTER",
      96
    );
  }

  if (text.includes("✅ Scan complete")) {
    updateScanState(
      channelId,
      "Finalising",
      "Preparing profile page",
      99
    );
  }
}

export async function POST(req: Request) {
  let channel_id = "";

  try {
    const body = await req.json();

    channel_id = body.channel_id;

    if (!channel_id) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing channel_id",
        },
        {
          status: 400,
        }
      );
    }

    console.log("================================");
    console.log("RUNNING FULL SCAN");
    console.log("CHANNEL:", channel_id);
    console.log("================================");

    scanState[channel_id] = {
      stage: "Initialising Scan",
      detail: "Preparing orchestration pipeline",
      progress: 5,
      complete: false,
    };

    const orchestrationResponse = await fetch(
  "https://sponsorship-orchestration-production.up.railway.app/scan",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      channel_id,
    }),
  }
);

if (!orchestrationResponse.ok) {
  throw new Error("Failed to start orchestration scan");
}

await new Promise((resolve) =>
  setTimeout(resolve, 15000)
);

    scanState[channel_id] = {
      stage: "Reading Intelligence Profile",
      detail: "Loading final CHANNEL_MASTER row",
      progress: 98,
      complete: false,
    };

    const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },

  scopes: [
    "https://www.googleapis.com/auth/spreadsheets",
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
      throw new Error("CHANNEL_MASTER empty");
    }

    const headers = rows[0];
    const dataRows = rows.slice(1);

    const match = dataRows.find((row) => row[0] === channel_id);

    if (!match) {
      throw new Error("Channel not found in CHANNEL_MASTER");
    }

    const result: Record<string, any> = {};

    headers.forEach((header, index) => {
      result[header] = match[index];
    });

    scanState[channel_id] = {
      stage: "Complete",
      detail: "Intelligence profile assembled successfully",
      progress: 100,
      complete: true,
    };

    return NextResponse.json({
      success: true,
      data: result,
    });

  } catch (error: any) {
    console.error("\n========== API ERROR ==========\n");
    console.error(error);

    if (channel_id) {
      scanState[channel_id] = {
        stage: "Scan Failed",
        detail: error.message || "Unknown error",
        progress: 100,
        complete: true,
        error: error.message || "Unknown error",
      };
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Scan failed",
      },
      {
        status: 500,
      }
    );
  }
}