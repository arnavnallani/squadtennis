import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL  = 'https://ngxfkwlpnkxdhjetqtkv.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5neGZrd2xwbmt4ZGhqZXRxdGt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNzgzNzQsImV4cCI6MjA4ODc1NDM3NH0.AwA3e4FrWkZ7xNb0LjM0nKHdfFdIwgij2eKuq0kj3HQ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);
