import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

function getClient() {
  return new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY ?? "",
    baseURL: "https://openrouter.ai/api/v1",
  });
}

const SYSTEM_PROMPT = `You are Lamid AI — a smart assistant for Lamid Consulting's platform. You help users navigate services, answer questions, and recommend the right path.

About Lamid Consulting:
Lamid is an AI-powered consulting marketplace with three layers:

LAYER 1 — Legacy Service Portals:
- BIZ / BEST Portal (/biz): SME & startup empowerment — business launch, growth strategy, innovation, sustainability.
- HCD Portal (/hcd): Human Capital Development — leadership training, recruitment, capacity building.
- SDC Portal (/sustainableDev): Sustainable Development Consulting — community transformation, NGO consulting.

LAYER 2 — Public Consulting Marketplace (/jobs):
- Organizations post projects, consultants get matched via AI
- Built-in workspace: chat, milestones, documents, invoicing, escrow payments
- Three service tiers: Freelancer, Enterprise, Concierge

LAYER 3 — AI Operating System:
- Smart matching, automated scoping, AI project manager
- Diagnostics for SMEs and NGOs
- AI-generated reports and quality assurance

Guidelines:
- Be concise, helpful, and professional
- Always suggest the most relevant page or action
- Keep responses under 120 words unless a detailed explanation is needed`;

export async function POST(req: NextRequest) {
  try {
    const { messages, stream = false } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
    }

    const payload = {
      model:       "openai/gpt-4o-mini",
      messages: [
        { role: "system" as const, content: SYSTEM_PROMPT },
        ...messages.slice(-10),
      ],
      temperature: 0.7,
      max_tokens:  300,
    };

    // ── Streaming response ───────────────────────────────────────
    if (stream) {
      const encoder = new TextEncoder();

      const readable = new ReadableStream({
        async start(controller) {
          try {
            const completion = await getClient().chat.completions.create({
              ...payload,
              stream: true,
            });

            for await (const chunk of completion) {
              const text = chunk.choices[0]?.delta?.content ?? "";
              if (text) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
              }
            }
            controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          } catch (err) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: "Stream error" })}\n\n`));
          } finally {
            controller.close();
          }
        },
      });

      return new Response(readable, {
        headers: {
          "Content-Type":  "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection":    "keep-alive",
        },
      });
    }

    // ── Non-streaming fallback ──────────────────────────────────
    const response = await getClient().chat.completions.create(payload);
    const reply    = response.choices[0]?.message?.content
      ?? "I'm sorry, I couldn't process that. Please try again.";

    return NextResponse.json({ reply });
  } catch (error) {
    return NextResponse.json({ error: "AI service unavailable." }, { status: 500 });
  }
}
