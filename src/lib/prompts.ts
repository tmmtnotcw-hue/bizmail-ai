export type Scene =
  | "thanks"
  | "request"
  | "apology"
  | "reminder"
  | "report"
  | "decline"
  | "greeting"
  | "inquiry";

export type Recipient = "boss" | "colleague" | "client" | "customer";
export type Tone = "formal" | "standard" | "casual";
export type Language = "ja" | "en";

export const LANGUAGES: { id: Language; label: string; description: string }[] = [
  { id: "ja", label: "日本語", description: "日本語ビジネスメール" },
  { id: "en", label: "English", description: "英語ビジネスメール" },
];

export const SCENES: { id: Scene; label: string; icon: string; description: string }[] = [
  { id: "thanks", label: "お礼", icon: "🙏", description: "感謝を伝えるメール" },
  { id: "request", label: "依頼", icon: "📩", description: "お願い・依頼のメール" },
  { id: "apology", label: "お詫び", icon: "🙇", description: "謝罪・お詫びのメール" },
  { id: "reminder", label: "催促", icon: "⏰", description: "リマインド・催促のメール" },
  { id: "report", label: "報告", icon: "📊", description: "進捗・結果の報告メール" },
  { id: "decline", label: "断り", icon: "🚫", description: "丁寧にお断りするメール" },
  { id: "greeting", label: "挨拶", icon: "👋", description: "着任・異動・年始等の挨拶" },
  { id: "inquiry", label: "問い合わせ", icon: "❓", description: "質問・問い合わせメール" },
];

export const RECIPIENTS: { id: Recipient; label: string }[] = [
  { id: "boss", label: "上司" },
  { id: "colleague", label: "同僚" },
  { id: "client", label: "取引先" },
  { id: "customer", label: "顧客" },
];

export const TONES: { id: Tone; label: string; description: string }[] = [
  { id: "formal", label: "フォーマル", description: "最も丁寧な表現" },
  { id: "standard", label: "標準", description: "一般的なビジネスレベル" },
  { id: "casual", label: "ややカジュアル", description: "社内向けのくだけた表現" },
];

const SCENE_LABELS: Record<Scene, string> = {
  thanks: "お礼",
  request: "依頼",
  apology: "お詫び",
  reminder: "催促",
  report: "報告",
  decline: "お断り",
  greeting: "挨拶",
  inquiry: "問い合わせ",
};

const RECIPIENT_LABELS: Record<Recipient, string> = {
  boss: "上司",
  colleague: "同僚",
  client: "取引先",
  customer: "顧客",
};

const TONE_INSTRUCTIONS: Record<Tone, string> = {
  formal:
    "最も丁寧な敬語を使用してください。「させていただく」「ご高配を賜り」など格式の高い表現を使ってください。",
  standard:
    "一般的なビジネス敬語を使用してください。「いたします」「お願いいたします」など標準的な表現を使ってください。",
  casual:
    "社内メールとして自然な、ややカジュアルな敬語を使用してください。「です・ます」調で堅すぎない表現にしてください。",
};

export interface UserProfileInfo {
  displayName?: string;
  companyName?: string;
  department?: string;
  position?: string;
  signature?: string;
}

export function buildPrompt(
  scene: Scene,
  recipient: Recipient,
  tone: Tone,
  keyPoints: string,
  userProfile?: UserProfileInfo | null,
  language: Language = "ja"
): string {
  const hasProfile = userProfile && (userProfile.displayName || userProfile.companyName);

  if (language === "en") {
    const SCENE_LABELS_EN: Record<Scene, string> = {
      thanks: "Thank you", request: "Request", apology: "Apology",
      reminder: "Follow-up/Reminder", report: "Report", decline: "Decline",
      greeting: "Greeting/Introduction", inquiry: "Inquiry",
    };
    const RECIPIENT_LABELS_EN: Record<Recipient, string> = {
      boss: "Superior/Manager", colleague: "Colleague", client: "Business partner", customer: "Customer",
    };
    const TONE_LABELS_EN: Record<Tone, string> = {
      formal: "Very formal and professional", standard: "Standard business tone", casual: "Semi-casual, friendly but professional",
    };

    const profileSectionEN = hasProfile
      ? `\n## Sender Info\n- Name: ${userProfile.displayName || "[Your Name]"}\n- Company: ${userProfile.companyName || ""}\n- Department: ${userProfile.department || ""}\n- Title: ${userProfile.position || ""}`
      : "";

    return `You are an expert in writing professional business emails in English. Create a business email based on the following conditions.

## Conditions
- Scene: ${SCENE_LABELS_EN[scene]}
- Recipient: ${RECIPIENT_LABELS_EN[recipient]}
- Tone: ${TONE_LABELS_EN[tone]}
- Key points: ${keyPoints}
${profileSectionEN}

## Output format
Output ONLY the following JSON format. No other text.
{
  "subject": "Subject line here",
  "body": "Email body here"
}

## Rules
- Keep subject line concise (under 10 words)
- Use appropriate line breaks
- Use "[Recipient's Name]" as placeholder for the recipient's name
- Use "${hasProfile && userProfile.displayName ? userProfile.displayName : "[Your Name]"}" as the sender's name
- Write a natural, professional business email
- Output ONLY JSON`;
  }

  // Japanese prompt (original)
  const profileSection = hasProfile
    ? `
## 送信者情報
- 名前: ${userProfile.displayName || "[あなたの名前]"}
- 会社名: ${userProfile.companyName || ""}
- 部署: ${userProfile.department || ""}
- 役職: ${userProfile.position || ""}
${userProfile.signature ? `- 署名:\n${userProfile.signature}` : ""}`
    : "";

  const signatureRule = hasProfile && userProfile.signature
    ? `- メール末尾に以下の署名を付けてください:\n${userProfile.signature}`
    : "- 署名は「[あなたの名前]」としてください";

  const nameRule = hasProfile && userProfile.displayName
    ? `- 送信者名は「${userProfile.displayName}」を使用してください`
    : "- 送信者名は「[あなたの名前]」としてください";

  return `あなたは日本語ビジネスメールの専門家です。以下の条件でビジネスメールを作成してください。

## 条件
- シーン: ${SCENE_LABELS[scene]}
- 送信先: ${RECIPIENT_LABELS[recipient]}
- トーン: ${TONE_INSTRUCTIONS[tone]}
- 要点: ${keyPoints}
${profileSection}

## 出力形式
必ず以下のJSON形式で出力してください。他の文章は一切含めないでください。
{
  "subject": "件名をここに",
  "body": "本文をここに"
}

## ルール
- 件名は簡潔に（20文字以内推奨）
- 本文は適切な改行を入れる
- 宛名は「○○様」とし、具体名は「[相手の名前]」としてください
${nameRule}
${signatureRule}
- 自然で実用的なビジネスメールにしてください
- JSON以外の出力はしないでください`;
}

export function getMockResponse(scene: Scene, recipient: Recipient, tone: Tone): { subject: string; body: string } {
  const mockData: Record<Scene, { subject: string; body: string }> = {
    thanks: {
      subject: "先日のお打ち合わせのお礼",
      body: `[相手の名前]様

お疲れ様です。[あなたの名前]です。

先日はお忙しい中、お打ち合わせのお時間をいただき、誠にありがとうございました。

いただいたご意見を参考に、今後の進め方を検討してまいります。
何かご不明な点がございましたら、お気軽にお申し付けください。

引き続き、よろしくお願いいたします。

[あなたの名前]`,
    },
    request: {
      subject: "資料ご送付のお願い",
      body: `[相手の名前]様

お疲れ様です。[あなたの名前]です。

お忙しいところ恐れ入りますが、下記の資料をご送付いただけますでしょうか。

・プロジェクト概要資料
・スケジュール表

ご多忙のところ大変恐縮ですが、今週金曜日までにいただけますと幸いです。
何卒よろしくお願いいたします。

[あなたの名前]`,
    },
    apology: {
      subject: "納品遅延のお詫び",
      body: `[相手の名前]様

お疲れ様です。[あなたの名前]です。

この度は、納品が遅れてしまい、大変申し訳ございません。

現在、早急に対応を進めており、明日中には納品できる見込みです。
今後はこのようなことがないよう、スケジュール管理を徹底いたします。

ご迷惑をおかけし、重ねてお詫び申し上げます。
何卒ご容赦くださいますようお願いいたします。

[あなたの名前]`,
    },
    reminder: {
      subject: "ご確認のお願い（再送）",
      body: `[相手の名前]様

お疲れ様です。[あなたの名前]です。

先日お送りした件について、ご確認いただけましたでしょうか。
お忙しいところ恐れ入りますが、ご対応状況をお知らせいただけますと幸いです。

期日が近づいておりますので、ご確認のほどよろしくお願いいたします。

[あなたの名前]`,
    },
    report: {
      subject: "プロジェクト進捗のご報告",
      body: `[相手の名前]様

お疲れ様です。[あなたの名前]です。

現在のプロジェクト進捗についてご報告いたします。

【進捗状況】
・全体の70%が完了しております
・予定通り来週末の納品を見込んでおります

【課題】
・特に大きな問題は発生しておりません

ご不明な点がございましたら、お気軽にお問い合わせください。

[あなたの名前]`,
    },
    decline: {
      subject: "ご提案について",
      body: `[相手の名前]様

お疲れ様です。[あなたの名前]です。

この度はご提案いただき、誠にありがとうございます。
社内で慎重に検討いたしましたが、今回は見送らせていただきたく存じます。

大変恐縮ではございますが、何卒ご理解いただけますと幸いです。
また別の機会がございましたら、ぜひご相談させてください。

今後ともよろしくお願いいたします。

[あなたの名前]`,
    },
    greeting: {
      subject: "着任のご挨拶",
      body: `[相手の名前]様

はじめまして。この度、○○部に着任いたしました[あなたの名前]と申します。

前任の△△からの引き継ぎを受け、今後は私が担当させていただきます。
至らない点もあるかと存じますが、精一杯努めてまいります。

近日中にご挨拶にお伺いできればと存じます。
今後とも何卒よろしくお願いいたします。

[あなたの名前]`,
    },
    inquiry: {
      subject: "サービス内容に関するお問い合わせ",
      body: `[相手の名前]様

お世話になっております。[あなたの名前]と申します。

貴社のサービスについて、いくつかお伺いしたい点がございます。

1. 料金プランの詳細
2. 導入までの期間
3. サポート体制

お忙しいところ恐れ入りますが、ご回答いただけますと幸いです。
よろしくお願いいたします。

[あなたの名前]`,
    },
  };

  return mockData[scene];
}
