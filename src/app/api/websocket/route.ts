import { NextResponse } from "next/server";
import { io } from "socket.io-client";

export async function GET(req: Request) {
  return NextResponse.json({
    status: "ok",
    message: "WebSocket server is running on the custom Next.js server",
  });
}
