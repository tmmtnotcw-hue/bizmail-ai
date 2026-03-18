"use client";

import { useState } from "react";

interface EmailResultProps {
  subject: string;
  body: string;
  isMock: boolean;
  onRegenerate: () => void;
  onSaveTemplate?: () => void;
  isLoading: boolean;
  isLoggedIn: boolean;
}

export default function EmailResult({
  subject,
  body,
  isMock,
  onRegenerate,
  onSaveTemplate,
  isLoading,
  isLoggedIn,
}: EmailResultProps) {
  const [copiedSubject, setCopiedSubject] = useState(false);
  const [copiedBody, setCopiedBody] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  const copyToClipboard = async (text: string, type: "subject" | "body" | "all") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "subject") {
        setCopiedSubject(true);
        setTimeout(() => setCopiedSubject(false), 2000);
      } else if (type === "body") {
        setCopiedBody(true);
        setTimeout(() => setCopiedBody(false), 2000);
      } else {
        setCopiedAll(true);
        setTimeout(() => setCopiedAll(false), 2000);
      }
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          3. 生成結果
        </h2>
        {isMock && (
          <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
            デモモード（APIキー未設定）
          </span>
        )}
      </div>

      {/* 件名 */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
            件名
          </span>
          <button
            onClick={() => copyToClipboard(subject, "subject")}
            className="rounded-lg px-3 py-1 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/30"
          >
            {copiedSubject ? "✓ コピー済み" : "コピー"}
          </button>
        </div>
        <p className="text-base font-medium text-gray-900 dark:text-white">{subject}</p>
      </div>

      {/* 本文 */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
            本文
          </span>
          <button
            onClick={() => copyToClipboard(body, "body")}
            className="rounded-lg px-3 py-1 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/30"
          >
            {copiedBody ? "✓ コピー済み" : "コピー"}
          </button>
        </div>
        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-800 dark:text-gray-200">
          {body}
        </pre>
      </div>

      {/* アクションボタン */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() =>
            copyToClipboard(`件名: ${subject}\n\n${body}`, "all")
          }
          className="flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
        >
          {copiedAll ? "✓ コピー済み" : "📋 全体をコピー"}
        </button>
        <button
          onClick={onRegenerate}
          disabled={isLoading}
          className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          🔄 別バージョンを生成
        </button>
        {isLoggedIn && onSaveTemplate && (
          <button
            onClick={onSaveTemplate}
            className="flex items-center gap-2 rounded-xl border border-green-300 bg-white px-5 py-2.5 text-sm font-medium text-green-700 transition-all hover:bg-green-50 dark:border-green-700 dark:bg-gray-900 dark:text-green-400 dark:hover:bg-green-950/30"
          >
            💾 テンプレート保存
          </button>
        )}
      </div>
    </div>
  );
}
