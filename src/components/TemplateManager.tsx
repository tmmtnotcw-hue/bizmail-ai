"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import type { SavedTemplate } from "@/lib/supabase";
import { SCENES } from "@/lib/prompts";

interface TemplateManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onUseTemplate: (template: SavedTemplate) => void;
}

export default function TemplateManager({ isOpen, onClose, onUseTemplate }: TemplateManagerProps) {
  const [templates, setTemplates] = useState<SavedTemplate[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadTemplates();
    }
  }, [isOpen]);

  const loadTemplates = async () => {
    const supabase = createClient();
    if (!supabase) return;

    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("saved_templates")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (data) {
      setTemplates(data);
    }
    setLoading(false);
  };

  const deleteTemplate = async (id: string) => {
    const supabase = createClient();
    if (!supabase) return;

    await supabase.from("saved_templates").delete().eq("id", id);
    setTemplates(templates.filter((t) => t.id !== id));
  };

  const getSceneLabel = (sceneId: string) => {
    const scene = SCENES.find((s) => s.id === sceneId);
    return scene ? `${scene.icon} ${scene.label}` : sceneId;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="mx-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            📁 保存済みテンプレート
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
        ) : templates.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-4xl">📭</p>
            <p className="mt-3 text-gray-500 dark:text-gray-400">
              保存済みのテンプレートはありません
            </p>
            <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
              メール生成後に「テンプレートとして保存」で追加できます
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {templates.map((template) => (
              <div
                key={template.id}
                className="rounded-xl border border-gray-200 p-4 transition-all hover:shadow-md dark:border-gray-700"
              >
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{getSceneLabel(template.scene)}</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {template.name}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(template.created_at).toLocaleDateString("ja-JP")}
                  </span>
                </div>

                <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">
                  件名: {template.subject}
                </p>
                <p className="mb-3 line-clamp-2 text-xs text-gray-500 dark:text-gray-500">
                  {template.body}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onUseTemplate(template);
                      onClose();
                    }}
                    className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                  >
                    このテンプレートを使う
                  </button>
                  <button
                    onClick={() => deleteTemplate(template.id)}
                    className="rounded-lg border border-red-200 px-4 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30"
                  >
                    削除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
