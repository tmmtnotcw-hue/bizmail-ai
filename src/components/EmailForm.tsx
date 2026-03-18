"use client";

import { RECIPIENTS, TONES } from "@/lib/prompts";
import type { Recipient, Tone } from "@/lib/prompts";

interface EmailFormProps {
  recipient: Recipient;
  tone: Tone;
  keyPoints: string;
  onRecipientChange: (recipient: Recipient) => void;
  onToneChange: (tone: Tone) => void;
  onKeyPointsChange: (keyPoints: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  disabled: boolean;
}

export default function EmailForm({
  recipient,
  tone,
  keyPoints,
  onRecipientChange,
  onToneChange,
  onKeyPointsChange,
  onSubmit,
  isLoading,
  disabled,
}: EmailFormProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
        2. 詳細を入力
      </h2>

      {/* 送信先 */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          送信先
        </label>
        <div className="flex flex-wrap gap-2">
          {RECIPIENTS.map((r) => (
            <button
              key={r.id}
              onClick={() => onRecipientChange(r.id)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                recipient === r.id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* トーン */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          トーン
        </label>
        <div className="flex flex-wrap gap-2">
          {TONES.map((t) => (
            <button
              key={t.id}
              onClick={() => onToneChange(t.id)}
              className={`rounded-lg px-4 py-2 text-sm transition-all ${
                tone === t.id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              <span className="font-medium">{t.label}</span>
              <span className="ml-1 text-xs opacity-75">({t.description})</span>
            </button>
          ))}
        </div>
      </div>

      {/* 要点 */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          要点（伝えたいポイントを入力）
        </label>
        <textarea
          value={keyPoints}
          onChange={(e) => onKeyPointsChange(e.target.value)}
          placeholder="例：先日の会議のお礼、次回の日程調整をお願いしたい"
          rows={4}
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-400"
        />
      </div>

      {/* 生成ボタン */}
      <button
        onClick={onSubmit}
        disabled={disabled || isLoading || !keyPoints.trim()}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
      >
        {isLoading ? (
          <>
            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            生成中...
          </>
        ) : (
          <>
            ✨ メールを生成する
          </>
        )}
      </button>
    </div>
  );
}
