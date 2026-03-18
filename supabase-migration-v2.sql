-- BizMail AI v2 Migration: 生成履歴テーブル追加
-- Run this SQL in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS generation_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  scene TEXT NOT NULL,
  recipient TEXT NOT NULL,
  tone TEXT NOT NULL,
  language TEXT DEFAULT 'ja' CHECK (language IN ('ja', 'en')),
  key_points TEXT DEFAULT '',
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE generation_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own history" ON generation_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own history" ON generation_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own history" ON generation_history
  FOR DELETE USING (auth.uid() = user_id);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_history_user_id ON generation_history(user_id);
CREATE INDEX IF NOT EXISTS idx_history_created_at ON generation_history(created_at DESC);
