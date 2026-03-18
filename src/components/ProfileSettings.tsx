"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { TONES, RECIPIENTS } from "@/lib/prompts";
import type { UserProfile } from "@/lib/supabase";
import type { Tone, Recipient } from "@/lib/prompts";

interface ProfileSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export default function ProfileSettings({ isOpen, onClose, onSave }: ProfileSettingsProps) {
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    display_name: "",
    company_name: "",
    department: "",
    position: "",
    signature: "",
    default_tone: "standard",
    default_recipient: "client",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadProfile();
    }
  }, [isOpen]);

  const loadProfile = async () => {
    const supabase = createClient();
    if (!supabase) return;

    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (data) {
      setProfile(data);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    const supabase = createClient();
    if (!supabase) return;

    setSaving(true);
    setMessage(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .upsert({
        user_id: user.id,
        display_name: profile.display_name || "",
        company_name: profile.company_name || "",
        department: profile.department || "",
        position: profile.position || "",
        signature: profile.signature || "",
        default_tone: profile.default_tone || "standard",
        default_recipient: profile.default_recipient || "client",
      });

    if (error) {
      setMessage("保存に失敗しました: " + error.message);
    } else {
      setMessage("保存しました！");
      onSave();
      setTimeout(() => {
        onClose();
        setMessage(null);
      }, 1000);
    }
    setSaving(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="mx-4 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            ⚙️ プロフィール設定
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            ✕
          </button>
        </div>

        {loading ? (
          <div className="py-8 text-center text-gray-500">読み込み中...</div>
        ) : (
          <div className="space-y-4">
            {/* 基本情報 */}
            <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
              <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                基本情報（メールに自動反映されます）
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs text-gray-500">お名前</label>
                  <input
                    value={profile.display_name || ""}
                    onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    placeholder="山田太郎"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs text-gray-500">会社名</label>
                    <input
                      value={profile.company_name || ""}
                      onChange={(e) => setProfile({ ...profile, company_name: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      placeholder="株式会社○○"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-gray-500">部署</label>
                    <input
                      value={profile.department || ""}
                      onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      placeholder="営業部"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs text-gray-500">役職</label>
                  <input
                    value={profile.position || ""}
                    onChange={(e) => setProfile({ ...profile, position: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    placeholder="主任"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs text-gray-500">メール署名</label>
                  <textarea
                    value={profile.signature || ""}
                    onChange={(e) => setProfile({ ...profile, signature: e.target.value })}
                    rows={4}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    placeholder={"━━━━━━━━━━━━━━━━\n株式会社○○ 営業部\n山田太郎\nTEL: 03-1234-5678\nEmail: yamada@example.com"}
                  />
                </div>
              </div>
            </div>

            {/* デフォルト設定 */}
            <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
              <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                デフォルト設定
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs text-gray-500">デフォルトのトーン</label>
                  <div className="flex gap-2">
                    {TONES.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setProfile({ ...profile, default_tone: t.id as Tone })}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                          profile.default_tone === t.id
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs text-gray-500">デフォルトの送信先</label>
                  <div className="flex gap-2">
                    {RECIPIENTS.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => setProfile({ ...profile, default_recipient: r.id as Recipient })}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                          profile.default_recipient === r.id
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* メッセージ */}
            {message && (
              <p className={`rounded-lg p-3 text-sm ${
                message.includes("失敗")
                  ? "bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400"
                  : "bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400"
              }`}>
                {message}
              </p>
            )}

            {/* 保存ボタン */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition-all hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "保存中..." : "💾 設定を保存"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
