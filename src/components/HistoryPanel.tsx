"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { SCENES } from "@/lib/prompts";

interface HistoryItem {
  id: string;
  scene: string;
  recipient: string;
  tone: string;
  language: string;
  key_points: string;
  subject: string;
  body: string;
  created_at: string;
}

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onReuse: (item: HistoryItem) => void;
}

export default function HistoryPanel({ isOpen, onClose, onReuse }: HistoryPanelProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) loadHistory();
  }, [isOpen]);

  const loadHistory = async () => {
    const supabase = createClient();
    if (!supabase) return;

    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const { data } = await supabase
      .from("generation_history")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (data) setHistory(data);
    setLoading(false);
  };

  const deleteItem = async (id: string) => {
    const supabase = createClient();
    if (!supabase) return;
    await supabase.from("generation_history").delete().eq("id", id);
    setHistory(history.filter((h) => h.id !== id));
  };

  const copyToClipboard = async (subject: string, body: string) => {
    await navigator.clipboard.writeText(`件名: ${subject}\n\n${body}`);
  };

  const getSceneInfo = (sceneId: string) => {
    const scene = SCENES.find((s) => s.id === sceneId);
    return scene ? { icon: scene.icon, label: scene.label } : { icon: "📧", label: sceneId };
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "たった今";
    if (minutes < 60) return `${minutes}分前`;
    if (hours < 24) return `${hours}時間前`;
    if (days < 7) return `${days}日前`;
    return date.toLocaleDateString("ja-JP");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="mx-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            📜 生成履歴
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
        ) : history.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-4xl">📭</p>
            <p className="mt-3 text-gray-500 dark:text-gray-400">
              まだ生成履歴がありません
            </p>
            <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
              メールを生成すると自動的に保存されます
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item) => {
              const sceneInfo = getSceneInfo(item.scene);
              const isExpanded = expandedId === item.id;

              return (
                <div
                  key={item.id}
                  className="rounded-xl border border-gray-200 p-4 transition-all hover:shadow-md dark:border-gray-700"
                >
                  <div
                    className="flex cursor-pointer items-center justify-between"
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{sceneInfo.icon}</span>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.subject}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {sceneInfo.label} · {formatDate(item.created_at)}
                          {item.language === "en" && (
                            <span className="ml-1 rounded bg-blue-100 px-1 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                              EN
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <span className="text-gray-400">{isExpanded ? "▲" : "▼"}</span>
                  </div>

                  {isExpanded && (
                    <div className="mt-3 space-y-3">
                      <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                        <p className="mb-1 text-xs font-medium text-gray-500">要点</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{item.key_points}</p>
                      </div>
                      <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                        <p className="mb-1 text-xs font-medium text-gray-500">本文</p>
                        <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 dark:text-gray-300">
                          {item.body}
                        </pre>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => copyToClipboard(item.subject, item.body)}
                          className="rounded-lg bg-gray-900 px-4 py-1.5 text-xs font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900"
                        >
                          📋 コピー
                        </button>
                        <button
                          onClick={() => { onReuse(item); onClose(); }}
                          className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                        >
                          🔄 同じ条件で再生成
                        </button>
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="rounded-lg border border-red-200 px-4 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400"
                        >
                          削除
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
