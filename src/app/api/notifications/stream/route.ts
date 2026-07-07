import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import { Notification } from "@/lib/models/Notification";
import { verifyAuth } from "@/lib/middleware/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = await verifyAuth(req);
  if (!auth) return new Response("Unauthorized", { status: 401 });

  const userId = auth.userId;
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      // Send initial notification count
      try {
        await connectDB();
        const count = await Notification.countDocuments({
          user: userId,
          $or: [{ read: false }, { isRead: false }],
        });
        send({ type: "count", count });
      } catch {
        send({ type: "count", count: 0 });
      }

      // Heartbeat every 25s to keep connection alive
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(": heartbeat\n\n"));
        } catch {
          clearInterval(heartbeat);
        }
      }, 25000);

      // Poll every 30 seconds and push updated count
      const interval = setInterval(async () => {
        try {
          const count = await Notification.countDocuments({
            user: userId,
            $or: [{ read: false }, { isRead: false }],
          });
          send({ type: "count", count });
        } catch {
          // Silent fail — client stays on last known count
        }
      }, 30000);

      // Cleanup on disconnect
      req.signal.addEventListener("abort", () => {
        clearInterval(heartbeat);
        clearInterval(interval);
        try { controller.close(); } catch {}
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
