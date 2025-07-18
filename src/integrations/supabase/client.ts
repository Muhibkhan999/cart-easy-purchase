// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://iyckkjpdizonbgmxfczc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5Y2tranBkaXpvbmJnbXhmY3pjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxNDQxMDgsImV4cCI6MjA2NzcyMDEwOH0.hXRZeesNrdm7hvPVro0MrtdPgcjOSDp45DMVlX68Iew";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});