import { NextResponse } from "next/server";
import { scanState } from "../../scan/scanState";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ channelId: string }> }
) {
  const { channelId } = await params;

  return NextResponse.json({
    success: true,
    data: scanState[channelId] || null,
  });
}