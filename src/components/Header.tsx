"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

interface HeaderProps {
  onLoginClick: () => void;
  onProfileClick: () => void;
  onTemplatesClick: () => void;
  onHistoryClick?: () => void;
}

export default function Header({ onLoginClick, onProfileClick, onTemplatesClick, onHistoryClick }: HeaderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
    setMenuOpen(false);
  };

  return (
    <header className="w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/80">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-xl text-white shadow-md">
            ✉️
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              BizMail AI
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              AIビジネスメール作成支援
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <span className="h-6 w-6 rounded-full bg-blue-600 text-center text-xs leading-6 text-white">
                  {user.email?.[0]?.toUpperCase() || "U"}
                </span>
                <span className="hidden sm:inline">{user.email?.split("@")[0]}</span>
                <span className="text-xs">▼</span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-xl border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
                  <button
                    onClick={() => { onProfileClick(); setMenuOpen(false); }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    ⚙️ プロフィール設定
                  </button>
                  <button
                    onClick={() => { onTemplatesClick(); setMenuOpen(false); }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    📁 テンプレート一覧
                  </button>
                  {onHistoryClick && (
                    <button
                      onClick={() => { onHistoryClick(); setMenuOpen(false); }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      📜 生成履歴
                    </button>
                  )}
                  <hr className="my-1 border-gray-200 dark:border-gray-700" />
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                  >
                    🚪 ログアウト
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onLoginClick}
              className="rounded-full bg-blue-600 px-4 py-1.5 text-sm font-medium text-white transition-all hover:bg-blue-700"
            >
              ログイン
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
