import { NextRequest } from "next/server";
import { verifyAuth } from "@/lib/middleware/auth";

export const dynamic = "force-dynamic";

// In-memory SSE registry: projectId → Set of response controllers
const clients = new Map<string, Set<ReadableStreamDefaultController>>();

export function notifyProject(projectId: string, payload: object) {
  const room = clients.get(projectId);
  if (!room) return;
  const data = `data: ${JSON.stringify(payload)}\n\n`;
  for (const ctrl of room) {
    try { ctrl.enqueue(new TextEncoder().encode(data)); } catch { room.delete(ctrl); }
  }
}

export async function GET(req: NextRequest) {
  const auth = await verifyAuth(req);
  if (!auth) return new Response("Unauthorized", { status: 401 });
  if (auth.accountType === "Engine") return new Response(
    JSON.stringify({ success: false, message: "Upgrade to a membership plan to access this feature.", code: "ENGINE_ONLY" }),
    { status: 403, headers: { "Content-Type": "application/json" } }
  );

  const projectId = new URL(req.url).searchParams.get("projectId");
  if (!projectId) return new Response("projectId required", { status: 400 });

  let controller: ReadableStreamDefaultController;

  const stream = new ReadableStream({
    start(ctrl) {
      controller = ctrl;
      if (!clients.has(projectId)) clients.set(projectId, new Set());
      clients.get(projectId)!.add(ctrl);

      // Heartbeat every 25s to keep connection alive
      const hb = setInterval(() => {
        try { ctrl.enqueue(new TextEncoder().encode(": heartbeat\n\n")); }
        catch { clearInterval(hb); }
      }, 25000);

      req.signal.addEventListener("abort", () => {
        clearInterval(hb);
        clients.get(projectId)?.delete(ctrl);
        try { ctrl.close(); } catch {}
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type":  "text/event-stream",
      "Cache-Control": "no-cache",
      Connection:      "keep-alive",
    },
  });
}
