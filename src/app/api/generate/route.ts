import { NextRequest, NextResponse } from "next/server";
import { buildPrompt, getMockResponse } from "@/lib/prompts";
import { generateEmail } from "@/lib/openai";
import type { Scene, Recipient, Tone, UserProfileInfo } from "@/lib/prompts";

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10; // 10 requests per day
const DAY_MS = 24 * 60 * 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + DAY_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT) {
    return false;
  }

  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "本日の利用回数上限（10回）に達しました。明日また利用してください。" },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { scene, recipient, tone, keyPoints, userProfile } = body as {
      scene: Scene;
      recipient: Recipient;
      tone: Tone;
      keyPoints: string;
      userProfile?: UserProfileInfo | null;
    };

    if (!scene || !recipient || !tone || !keyPoints) {
      return NextResponse.json(
        { error: "必須項目が不足しています" },
        { status: 400 }
      );
    }

    const prompt = buildPrompt(scene, recipient, tone, keyPoints, userProfile);

    let result: { subject: string; body: string };

    try {
      result = await generateEmail(prompt);
    } catch (error: unknown) {
      if (error instanceof Error && error.message === "MOCK_MODE") {
        // APIキー未設定の場合はモックレスポンスを返す
        result = getMockResponse(scene, recipient, tone);
        // モックでもプロフィール情報を反映
        if (userProfile?.displayName) {
          result.body = result.body.replace(/\[あなたの名前\]/g, userProfile.displayName);
        }
        if (userProfile?.signature) {
          const lastNamePlaceholder = userProfile.displayName || "[あなたの名前]";
          result.body = result.body.replace(
            new RegExp(`\n\n${lastNamePlaceholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`),
            `\n\n${userProfile.signature}`
          );
        }
      } else {
        throw error;
      }
    }

    return NextResponse.json({
      subject: result.subject,
      body: result.body,
      isMock: !process.env.OPENAI_API_KEY,
    });
  } catch (error) {
    console.error("Generate API error:", error);
    return NextResponse.json(
      { error: "メールの生成中にエラーが発生しました。もう一度お試しください。" },
      { status: 500 }
    );
  }
}
