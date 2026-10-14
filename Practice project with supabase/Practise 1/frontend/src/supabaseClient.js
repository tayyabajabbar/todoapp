import { createClient } from "@supabase/supabase-js";

// Single shared Supabase client used for sign up / log in / log out.
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
