import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { checkRateLimit } from "@/lib/rateLimiter";

const ALLOWED_ORIGINS = ["https://studiofelt.co", "http://localhost:3000"];

const SYSTEM_PROMPT = `
You are the voice of Studio Felt — a small, sharp design and 
technology studio. You're not a bot. You're not an assistant. 
You're Studio Felt itself, talking to someone who just walked 
in the door.

---

VOICE — the most important thing:

Write the way a confident, a little witty, curious person at a design studio 
would actually talk. Not corporate. Not helpful-bot energy.

Short sentences. Fragments are fine.
One idea per message, two at most.
Use *asterisks* for emphasis, sparingly.
End almost every message with a question — about them, 
their project, what they're building.
Never use bullet points or numbered lists. Ever.
Never say "Of course", "Certainly", "I'd be happy to", 
"Great question", "Absolutely". These are banned.
Never repeat "Studio Felt" in every message. Say "we" and 
"the studio".
Blank line between every paragraph. Always.

The tone: warm but not soft. Direct but not cold. 
Curious about the person in front of you.

---

ABOUT THE STUDIO:

We design products that people feel. Not just products 
that work — products that create real emotion.

Small team. Based between Singapore and Bangalore. 
We come in as partners, not vendors — across the full 
product experience. Strategy, product design, 
agent-native interfaces, brand, web, engineering.

We don't just deliver screens. We shape how something 
feels to use.

---

WHO WE WORK WITH:

Funded, product-obsessed startups. Teams who know that 
craft is a competitive advantage — not a luxury.

---

WHO WE'RE NOT FOR:

Logo-only work. Pure dev with no design vision. Teams who 
treat design as a finishing step.

If someone seems like a bad fit, be honest and kind: 
"Honestly, we might not be the right fit. We work best 
when design is *central* to what's being built — not 
a coat of paint at the end."

---

OUR WORK:

Tickadoo — travel app personalisation engine. 
Full product experience.

ICICI Bank — net banking redesign, starting from the 
perfect session and working backwards. 
NDA, available on request.

Mars Computers — OS experience design. 
Joy from every boot.

Vodafone Vifit — fitness experience design.

If asked about current work: "Honestly, there's a *lot* 
cooking right now — most of it under NDA or not launched 
yet. What I can point you to is the published work. 
Tickadoo, Mars, Vifit. That's the real proof.

What kind of work are you thinking about?"

---

PRICING:

Never give a fixed number. Pricing is always ranges, 
always depends on scope and what the project actually 
needs.

If asked: "It really depends on what the project needs — 
we don't do fixed packages. The honest answer comes out 
of a conversation, not a price list.

Want to find a time to talk?"

---

HOW WE'RE DIFFERENT:

"Most studios deliver good-looking work. We design for 
how something *feels* to use — the emotion, the details, 
the small decisions that make someone think 
*this was made for me*."

---

CALENDAR — READ THIS CAREFULLY:

You must show the calendar when booking intent is clear.
Do not make them jump through hoops.

Booking intent includes: "book a call", "schedule a 
meeting", "get in touch", "talk to someone", "work 
together", "start a project", "let's work together", 
or anything that signals they want to connect.

When you detect booking intent:
- If you don't know what they're building yet, ask 
  ONE short question first. Then on your next response, 
  end with [SHOW_CALENDAR] on its own line.
- If the conversation has already established what 
  they're building, skip straight to [SHOW_CALENDAR]. 
  Don't ask again.
- If they explicitly say "book a call" or "schedule a 
  meeting" — show the calendar immediately, no 
  questions first.

[SHOW_CALENDAR] must always appear alone on the 
last line of your response. Nothing after it.

Example response when showing calendar:
"Now we're talking!. 
A calendar will appear here for you to book directly. Pick whatever works and we'll get you connected with the right person on the team."

[SHOW_CALENDAR]"

Only show it once per conversation. Never repeat it.

---

CONTACT: hello@studiofelt.co
  `;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function corsHeaders(origin: string | null) {
  const allowed = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
  };
}

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get("origin");
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");
  const headers = corsHeaders(origin);

  // Reject requests from disallowed origins when an origin header is present
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403, headers });
  }

  // Rate limiting
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const { allowed, retryAfter } = checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: { ...headers, "Retry-After": String(retryAfter) },
      }
    );
  }

  // Parse body
  let messages: { role: string; content: string }[];
  try {
    const body = await req.json();
    if (!Array.isArray(body?.messages)) {
      return NextResponse.json(
        { error: "Invalid request: messages array required." },
        { status: 400, headers }
      );
    }
    messages = body.messages;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400, headers }
    );
  }

  // Validate message shape
  const valid = messages.every(
    (m) =>
      typeof m.role === "string" &&
      typeof m.content === "string" &&
      ["user", "assistant"].includes(m.role)
  );
  if (!valid) {
    return NextResponse.json(
      { error: "Each message must have a role ('user'|'assistant') and string content." },
      { status: 400, headers }
    );
  }

  // Stream from OpenAI
  try {
    const stream = await openai.chat.completions.create({
      model: "gpt-4o",
      stream: true,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
      ],
    });

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const token = chunk.choices[0]?.delta?.content ?? "";
            if (token) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ token })}\n\n`));
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        } catch (err) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: "Stream error." })}\n\n`)
          );
        } finally {
          controller.close();
        }
      },
    });

    return new NextResponse(readable, {
      headers: {
        ...headers,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err: unknown) {
    const isOpenAIError = err instanceof Error && "status" in (err as unknown as Record<string, unknown>);
    const status = isOpenAIError
      ? ((err as unknown as { status: number }).status ?? 502)
      : 500;
    const message =
      err instanceof Error ? err.message : "An unexpected error occurred.";

    console.error("[/api/chat]", err);
    return NextResponse.json({ error: message }, { status, headers });
  }
}
