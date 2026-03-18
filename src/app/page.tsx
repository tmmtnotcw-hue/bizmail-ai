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
import { createClient } from "@/lib/supabase";
import type { Scene, Recipient, Tone } from "@/lib/prompts";
import type { SavedTemplate, UserProfile } from "@/lib/supabase";

export default function Home() {
  const [scene, setScene] = useState<Scene | null>(null);
  const [recipient, setRecipient] = useState<Recipient>("client");
  const [tone, setTone] = useState<Tone>("standard");
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
      // Apply defaults from profile
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
          // Pass user profile info for personalized generation
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

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-950">
      <Header
        onLoginClick={() => setShowAuthModal(true)}
        onProfileClick={() => setShowProfileSettings(true)}
        onTemplatesClick={() => setShowTemplateManager(true)}
      />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
        {/* Hero */}
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            ビジネスメールを
            <span className="text-blue-600 dark:text-blue-400">AI</span>
            が瞬時に作成
          </h2>
          <p className="text-base text-gray-600 dark:text-gray-400">
            シーンを選んで要点を入力するだけ。敬語も定型表現もおまかせ。
          </p>
          {!isLoggedIn && (
            <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">
              <button onClick={() => setShowAuthModal(true)} className="text-blue-600 hover:underline dark:text-blue-400">
                ログイン
              </button>
              するとテンプレート保存やプロフィール設定が使えます
            </p>
          )}
          {isLoggedIn && userProfile?.display_name && (
            <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">
              👋 {userProfile.display_name}さん、こんにちは！
            </p>
          )}
        </div>

        <div className="space-y-8">
          {/* Step 1: シーン選択 */}
          <SceneSelector selected={scene} onSelect={setScene} />

          {/* Step 2: フォーム（シーン選択後に表示） */}
          {scene && (
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
              isLoading={isLoading}
              isLoggedIn={isLoggedIn}
            />
          )}
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
    </div>
  );
}
