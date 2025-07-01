import { supabase } from '../services/supabaseClient';
import { User, Order } from '../types';

// Lấy thông tin user từ Supabase
export const getUserProfile = async (userId: string): Promise<User | null> => {
  // Truy vấn bảng users theo id
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) return null;
  return data as User;
};

// Cập nhật thông tin user lên Supabase
export const updateUserProfile = async (userId: string, updates: Partial<User>) => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data as User;
};

// Lấy wishlist của user
export const getUserWishlist = async (userId: string) => {
  const { data, error } = await supabase
    .from('wishlist')
    .select('*')
    .eq('user_id', userId);
  if (error) return [];
  return data;
};

// Xóa sản phẩm khỏi wishlist
export const removeWishlistItem = async (userId: string, productId: string) => {
  const { error } = await supabase
    .from('wishlist')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId);
  if (error) throw error;
};

// Lấy danh sách đơn hàng của user
export const getUserOrders = async (userId: string): Promise<Order[]> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('customerEmail', userId);
  if (error) return [];
  return data as Order[];
};
