import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

// Database types
export interface UserProfile {
  id: string;
  user_id: string;
  display_name: string;
  company_name: string;
  department: string;
  position: string;
  signature: string;
  default_tone: "formal" | "standard" | "casual";
  default_recipient: "boss" | "colleague" | "client" | "customer";
  created_at: string;
  updated_at: string;
}

export interface SavedTemplate {
  id: string;
  user_id: string;
  name: string;
  scene: string;
  recipient: string;
  tone: string;
  key_points: string;
  subject: string;
  body: string;
  created_at: string;
}
