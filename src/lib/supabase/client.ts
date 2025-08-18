import { log } from "@/utils/helpers";
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {

  log("warning", {
    server: false,
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  });

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

export const supabase = createClient();
