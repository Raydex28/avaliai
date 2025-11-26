import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("[v0] Supabase environment variables missing in browser client")
    console.warn("[v0] App will use fallback data until database is configured")
  }

  return createBrowserClient(supabaseUrl || "", supabaseAnonKey || "")
}
