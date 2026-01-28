import { createClient } from '@supabase/supabase-js';

// Safe access for both Vite (import.meta.env) and Node (process.env)
const env = (import.meta as any).env || process.env;

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    if (typeof window === 'undefined') {
        console.error('Missing Supabase environment variables in Node process');
    }
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
