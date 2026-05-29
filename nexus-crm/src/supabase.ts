import { createClient } from '@supabase/supabase-js';

const readBrowserSetting = (key: string): string => {
  if (typeof window === 'undefined' || !window.localStorage) return '';
  try {
    return window.localStorage.getItem(key) || '';
  } catch (error) {
    console.warn(`Unable to read ${key} from browser storage:`, error);
    return '';
  }
};

const envUrl = ((import.meta as any).env?.VITE_SUPABASE_URL as string) || '';
const envAnonKey = ((import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string) || '';

export const supabaseUrl = readBrowserSetting('VITE_SUPABASE_URL') || envUrl;
export const supabaseAnonKey = readBrowserSetting('VITE_SUPABASE_ANON_KEY') || envAnonKey;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Guarded client configuration prevents a blank env from crashing local repair mode.
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 5,
        },
      },
    })
  : null;
