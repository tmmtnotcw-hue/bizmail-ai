"use client";

import { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import SceneSelector from "@/components/SceneSelector";
import EmailForm from "@/components/EmailForm";
import EmailResult from "@/components/EmailResult";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import ProfileSettings from "@/components/ProfileSettings";
import TemplateManager from "@/components/TemplateManager";
import HistoryPanel from "@/components/HistoryPanel";
import { createClient } from "@/lib/supabase";
import { LANGUAGES } from "@/lib/prompts";
import type { Scene, Recipient, Tone, Language } from "@/lib/prompts";
import type { SavedTemplate, UserProfile } from "@/lib/supabase";

export default function Home() {
  const [scene, setScene] = useState<Scene | null>(null);
  const [recipient, setRecipient] = useState<Recipient>("client");
  const [tone, setTone] = useState<Tone>("standard");
  const [language, setLanguage] = useState<Language>("ja");
  const [keyPoints, setKeyPoints] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    subject: string;
    body: string;
    isMock: boolean;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Auth & user state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [showTemplateManager, setShowTemplateManager] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const loadUserProfile = useCallback(async () => {
    const supabase = createClient();
    if (!supabase) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setIsLoggedIn(false);
      setUserProfile(null);
      return;
    }

    setIsLoggedIn(true);

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (data) {
      setUserProfile(data);
      if (data.default_tone) setTone(data.default_tone as Tone);
      if (data.default_recipient) setRecipient(data.default_recipient as Recipient);
    }
  }, []);

  useEffect(() => {
    loadUserProfile();

    const supabase = createClient();
    if (!supabase) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      loadUserProfile();
    });

    return () => subscription.unsubscribe();
  }, [loadUserProfile]);

  // Save to history
  const saveToHistory = async (subject: string, body: string) => {
    if (!isLoggedIn || !scene) return;

    const supabase = createClient();
    if (!supabase) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("generation_history").insert({
      user_id: user.id,
      scene,
      recipient,
      tone,
      language,
      key_points: keyPoints,
      subject,
      body,
    });
  };

  const handleGenerate = async () => {
    if (!scene || !keyPoints.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scene,
          recipient,
          tone,
          keyPoints,
          language,
          userProfile: userProfile ? {
            displayName: userProfile.display_name,
            companyName: userProfile.company_name,
            department: userProfile.department,
            position: userProfile.position,
            signature: userProfile.signature,
          } : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "エラーが発生しました");
        return;
      }

      setResult(data);

      // Auto-save to history
      await saveToHistory(data.subject, data.body);
    } catch {
      setError("通信エラーが発生しました。もう一度お試しください。");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveTemplate = async () => {
    if (!result || !scene) return;

    const supabase = createClient();
    if (!supabase) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const templateName = prompt("テンプレート名を入力してください：");
    if (!templateName) return;

    const { error: saveError } = await supabase.from("saved_templates").insert({
      user_id: user.id,
      name: templateName,
      scene,
      recipient,
      tone,
      key_points: keyPoints,
      subject: result.subject,
      body: result.body,
    });

    if (saveError) {
      setError("テンプレートの保存に失敗しました");
    } else {
      alert("テンプレートを保存しました！");
    }
  };

  const handleUseTemplate = (template: SavedTemplate) => {
    setScene(template.scene as Scene);
    setRecipient(template.recipient as Recipient);
    setTone(template.tone as Tone);
    setKeyPoints(template.key_points);
    setResult({
      subject: template.subject,
      body: template.body,
      isMock: false,
    });
  };

  // Gmail draft link
  const openGmailDraft = () => {
    if (!result) return;
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(result.subject)}&body=${encodeURIComponent(result.body)}`;
    window.open(gmailUrl, "_blank");
  };

  // Reuse from history
  const handleReuseHistory = (item: { scene: string; recipient: string; tone: string; key_points: string; subject: string; body: string }) => {
    setScene(item.scene as Scene);
    setRecipient(item.recipient as Recipient);
    setTone(item.tone as Tone);
    setKeyPoints(item.key_points);
    setResult({
      subject: item.subject,
      body: item.body,
      isMock: false,
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-950">
      <Header
        onLoginClick={() => setShowAuthModal(true)}
        onProfileClick={() => setShowProfileSettings(true)}
        onTemplatesClick={() => setShowTemplateManager(true)}
        onHistoryClick={() => setShowHistory(true)}
      />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
        {/* Hero */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-block rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
            完全無料 ・ 登録なしで使える
          </div>
          <h2 className="mb-4 text-3xl font-bold leading-tight text-gray-900 dark:text-white sm:text-5xl">
            ビジネスメールを
            <br className="sm:hidden" />
            <span className="text-blue-600 dark:text-blue-400">AI</span>
            が<span className="underline decoration-blue-400 decoration-4 underline-offset-4">10秒</span>で作成
          </h2>
          <p className="mx-auto max-w-xl text-lg text-gray-600 dark:text-gray-400">
            シーンを選んで要点を入力するだけ。
            <br className="hidden sm:block" />
            敬語・定型表現・署名まで、プロ品質のメールが瞬時に完成。
          </p>

          {isLoggedIn && userProfile?.display_name ? (
            <div className="mt-4">
              <p className="text-sm text-blue-600 dark:text-blue-400">
                👋 {userProfile.display_name}さん、こんにちは！
              </p>
              <button
                onClick={() => setShowHistory(true)}
                className="mt-1 text-xs text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
              >
                📜 生成履歴を見る
              </button>
            </div>
          ) : (
            <p className="mt-3 text-sm text-gray-400 dark:text-gray-500">
              <button onClick={() => setShowAuthModal(true)} className="text-blue-600 hover:underline dark:text-blue-400">
                無料アカウント作成
              </button>
              でテンプレート保存・生成履歴・プロフィール設定が使えます
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="mb-10 grid grid-cols-3 gap-4 rounded-2xl bg-gray-50 p-6 dark:bg-gray-900">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">8</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">対応シーン</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">2</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">対応言語</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">10秒</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">で完成</p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Step 1: シーン選択 */}
          <SceneSelector selected={scene} onSelect={setScene} />

          {/* Step 2: フォーム（シーン選択後に表示） */}
          {scene && (
            <>
              {/* 言語切替 */}
              <div>
                <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                  言語
                </h2>
                <div className="flex gap-2">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => setLanguage(lang.id)}
                      className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                        language === lang.id
                          ? "bg-blue-600 text-white shadow-sm"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                      }`}
                    >
                      {lang.label}
                      <span className="ml-1 text-xs opacity-75">({lang.description})</span>
                    </button>
                  ))}
                </div>
              </div>

              <EmailForm
                recipient={recipient}
                tone={tone}
                keyPoints={keyPoints}
                onRecipientChange={setRecipient}
                onToneChange={setTone}
                onKeyPointsChange={setKeyPoints}
                onSubmit={handleGenerate}
                isLoading={isLoading}
                disabled={!scene}
              />
            </>
          )}

          {/* エラー表示 */}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Step 3: 結果表示 */}
          {result && (
            <EmailResult
              subject={result.subject}
              body={result.body}
              isMock={result.isMock}
              onRegenerate={handleGenerate}
              onSaveTemplate={handleSaveTemplate}
              onOpenGmail={openGmailDraft}
              isLoading={isLoading}
              isLoggedIn={isLoggedIn}
            />
          )}
        </div>

        {/* Features Section */}
        <div className="mt-16 mb-8">
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-900 dark:text-white">
            BizMail AI が選ばれる理由
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 p-6 text-center dark:border-gray-800">
              <div className="mb-3 text-3xl">🎯</div>
              <h3 className="mb-2 font-bold text-gray-900 dark:text-white">適切な敬語</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                送信先に合わせた敬語レベルを自動調整。上司、取引先、顧客それぞれに最適な表現を使用。
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 p-6 text-center dark:border-gray-800">
              <div className="mb-3 text-3xl">⚡</div>
              <h3 className="mb-2 font-bold text-gray-900 dark:text-white">10秒で完成</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                要点を箇条書きで入力するだけ。件名も本文もAIが瞬時に生成。メール作成の時間を90%削減。
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 p-6 text-center dark:border-gray-800">
              <div className="mb-3 text-3xl">🌐</div>
              <h3 className="mb-2 font-bold text-gray-900 dark:text-white">日英対応</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                日本語・英語のビジネスメールに対応。海外とのやり取りもワンクリックで切り替え。
              </p>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="mb-8 rounded-2xl bg-blue-50 p-8 dark:bg-blue-950/20">
          <h2 className="mb-6 text-center text-2xl font-bold text-gray-900 dark:text-white">
            使い方は3ステップ
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">1</div>
              <h3 className="mb-1 font-bold text-gray-900 dark:text-white">シーンを選ぶ</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">お礼・依頼・お詫びなど8つのシーンから選択</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">2</div>
              <h3 className="mb-1 font-bold text-gray-900 dark:text-white">要点を入力</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">伝えたいポイントを箇条書きでOK</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">3</div>
              <h3 className="mb-1 font-bold text-gray-900 dark:text-white">コピー＆送信</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">生成されたメールをコピーまたはGmailで直接開く</p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-8">
          <h2 className="mb-6 text-center text-2xl font-bold text-gray-900 dark:text-white">
            よくある質問
          </h2>
          <div className="space-y-4">
            {[
              { q: "本当に無料で使えますか？", a: "はい、完全無料です。アカウント登録なしでもメール生成が可能です。アカウントを作成すると、テンプレート保存や生成履歴などの追加機能が使えます。" },
              { q: "生成されたメールの品質は大丈夫ですか？", a: "最新のAI（GPT-4o-mini）を使用しており、ビジネスメールとして適切な敬語表現と構成で生成されます。送信前に内容をご確認いただくことをお勧めします。" },
              { q: "入力した内容は保存されますか？", a: "ログインしていない場合、入力内容はサーバーに保存されません。ログインユーザーのみ、生成履歴が保存されます（いつでも削除可能）。" },
              { q: "英語メールも作れますか？", a: "はい、日本語と英語の両方に対応しています。言語切替ボタンで簡単に切り替えられます。日本語で要点を入力しても、自然な英語メールが生成されます。" },
            ].map((faq, i) => (
              <details key={i} className="group rounded-xl border border-gray-200 dark:border-gray-800">
                <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-gray-900 dark:text-white">
                  {faq.q}
                  <span className="text-gray-400 transition-transform group-open:rotate-180">▼</span>
                </summary>
                <p className="border-t border-gray-100 px-4 py-3 text-sm text-gray-600 dark:border-gray-800 dark:text-gray-400">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </main>

      <Footer />

      {/* Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={loadUserProfile}
      />
      <ProfileSettings
        isOpen={showProfileSettings}
        onClose={() => setShowProfileSettings(false)}
        onSave={loadUserProfile}
      />
      <TemplateManager
        isOpen={showTemplateManager}
        onClose={() => setShowTemplateManager(false)}
        onUseTemplate={handleUseTemplate}
      />
      <HistoryPanel
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        onReuse={handleReuseHistory}
      />
    </div>
  );
}
