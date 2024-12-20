import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://bxikxspysgxnnjotopli.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4aWt4c3B5c2d4bm5qb3RvcGxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIzODM2MTUsImV4cCI6MjA0Nzk1OTYxNX0.XZqeWPM7YKmQ7X9pSuWUS-tB7nabei47Hvo0qGervGU";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'health-tracker-auth',
    storage: window.localStorage
  }
});