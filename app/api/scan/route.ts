import { scanState } from "./scanState";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const channel_id = body.channel_id;

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

    scanState[channel_id] = {
      stage: "Initialising Scan",
      detail: "Preparing orchestration pipeline",
      progress: 5,
      complete: false,
    };

    // FIRE AND FORGET
    fetch(
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
    ).catch((err) => {
      console.error("Orchestration error:", err);

      scanState[channel_id] = {
        stage: "Scan Failed",
        detail: err.message || "Unknown error",
        progress: 100,
        complete: true,
        error: err.message || "Unknown error",
      };
    });

    return NextResponse.json({
      success: true,
      started: true,
      channel_id,
    });

  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}
