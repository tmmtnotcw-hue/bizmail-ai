import OpenAI from "openai";

let openaiClient: OpenAI | null = null;

export function getOpenAIClient(): OpenAI | null {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiClient;
}

export async function generateEmail(prompt: string): Promise<{ subject: string; body: string }> {
  const client = getOpenAIClient();

  if (!client) {
    throw new Error("MOCK_MODE");
  }

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "あなたは日本語ビジネスメールの専門家です。指示に従ってJSONのみを出力してください。",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 1000,
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("AIからの応答が空でした");
  }

  const parsed = JSON.parse(content);
  return {
    subject: parsed.subject || "件名なし",
    body: parsed.body || "本文を生成できませんでした",
  };
}
