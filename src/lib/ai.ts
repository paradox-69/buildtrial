export class AiError extends Error {
  status: number;
  constructor(message: string, status = 502) {
    super(message);
    this.status = status;
  }
}

export function extractJson(text: string): string {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end <= start) {
    throw new AiError("The AI answer was not in the expected format. Please try again.");
  }
  return text.slice(start, end + 1);
}

export async function askForJson(system: string, user: string): Promise<unknown> {
  const key = process.env.GROQ_API_KEY;
  const model = process.env.GROQ_MODEL || "llama-3.1-8b-instant";
  if (!key) throw new AiError("The AI service is not set up yet.", 500);

  let res: Response;
  try {
    res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        response_format: { type: "json_object" },
        max_tokens: 2000,
        temperature: 0.4,
      }),
      signal: AbortSignal.timeout(25000),
    });
  } catch {
    throw new AiError("The AI service took too long to answer. Please try again.");
  }

  if (!res.ok) {
    console.error("Groq request failed:", res.status, (await res.text().catch(() => "")).slice(0, 300));
    throw new AiError("The AI service is busy right now. Please try again in a minute.");
  }

  const body = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const text = body.choices?.[0]?.message?.content ?? "";

  try {
    return JSON.parse(extractJson(text));
  } catch (e) {
    if (e instanceof AiError) throw e;
    throw new AiError("The AI answer could not be read. Please try again.");
  }
}