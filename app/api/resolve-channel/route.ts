import { NextResponse } from "next/server";
import { google } from "googleapis";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY!;

const youtube = google.youtube({
  version: "v3",
  auth: YOUTUBE_API_KEY,
});

function extractVideoId(input: string) {

  const match = input.match(
    /(?:v=|youtu\.be\/)([^&\n?#]+)/i
  );

  return match?.[1] || null;
}

export async function POST(req: Request) {

  try {

    const body = await req.json();

    const rawInput = body.input?.trim();

    if (!rawInput) {
      throw new Error("Missing input");
    }

    // RAW CHANNEL ID

    if (rawInput.startsWith("UC")) {

      const channelRes = await youtube.channels.list({
        part: ["snippet"],
        id: [rawInput],
      });

      const channel = channelRes.data.items?.[0];

      if (!channel) {
        throw new Error("Channel not found");
      }

      return NextResponse.json({
        success: true,

        data: {
          channel_id: channel.id,
          channel_name: channel.snippet?.title,
          channel_thumbnail:
            channel.snippet?.thumbnails?.high?.url,
        },
      });
    }

    // HANDLE

    if (
      rawInput.startsWith("@") ||
      rawInput.includes("youtube.com/@")
    ) {

      const handle = rawInput
        .split("@")
        .pop()
        ?.split("/")[0]
        ?.split("?")[0];

      const searchRes = await youtube.search.list({
        part: ["snippet"],
        q: handle,
        type: ["channel"],
        maxResults: 1,
      });

      const channel = searchRes.data.items?.[0];

      if (!channel) {
        throw new Error("Handle not found");
      }

      return NextResponse.json({
        success: true,

        data: {
          channel_id:
            channel.snippet?.channelId,

          channel_name:
            channel.snippet?.channelTitle,

          channel_thumbnail:
            channel.snippet?.thumbnails?.high?.url,
        },
      });
    }

    // VIDEO URL

    if (
      rawInput.includes("youtube.com/watch") ||
      rawInput.includes("youtu.be/")
    ) {

      const videoId = extractVideoId(rawInput);

      if (!videoId) {
        throw new Error("Invalid video URL");
      }

      const videoRes = await youtube.videos.list({
        part: ["snippet"],
        id: [videoId],
      });

      const video = videoRes.data.items?.[0];

      if (!video) {
        throw new Error("Video not found");
      }

      const channelId =
        video.snippet?.channelId;

      const channelRes = await youtube.channels.list({
        part: ["snippet"],
        id: [channelId!],
      });

      const channel = channelRes.data.items?.[0];

      if (!channel) {
        throw new Error("Channel not found");
      }

      return NextResponse.json({
        success: true,

        data: {
          channel_id: channel.id,
          channel_name: channel.snippet?.title,
          channel_thumbnail:
            channel.snippet?.thumbnails?.high?.url,
        },
      });
    }

    throw new Error("Unsupported input format");

  } catch (err: any) {

    console.error(err);

    return NextResponse.json(
      {
        success: false,
        error: err.message,
      },
      {
        status: 500,
      }
    );
  }
}