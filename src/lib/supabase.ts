import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database'; // 👈 추가된 부분

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log("🔎 URL 확인:", supabaseUrl);
console.log("🔎 KEY 확인:", supabaseAnonKey);

// 👇 createClient 뒤에 <Database>를 붙여줍니다!
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);