import { createClient } from '@supabase/supabase-js';

// Khởi tạo client Supabase với thông tin xác thực
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL và API Key không được để trống. Vui lòng kiểm tra cấu hình.');
}

// Tạo và xuất instance Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;

/**
 * Lưu ý bảo mật:
 * - Trong môi trường sản xuất, hãy sử dụng biến môi trường để lưu trữ các khóa API
 * - Ví dụ: import.meta.env.VITE_SUPABASE_URL và import.meta.env.VITE_SUPABASE_ANON_KEY
 * - Đảm bảo rằng các khóa bí mật không được commit vào mã nguồn
 */