import { NextResponse } from "next/server";
import { scanState } from "../../_api_scan_backup/scanState";

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