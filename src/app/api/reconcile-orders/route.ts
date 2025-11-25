// This endpoint is kept for backward compatibility but the dashboard
// now calls the Convex mutation directly for better performance and
// direct Clerk authentication integration.

import { NextResponse } from "next/server";

export async function POST(): Promise<Response> {
  return NextResponse.json(
    {
      success: false,
      message: "Use the Convex mutation directly from the client.",
    },
    { status: 410 },
  );
}
