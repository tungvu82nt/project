import React, { useContext, useState, useEffect, useRef, useCallback } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { getUserProfile, updateUserProfile, getUserWishlist, removeWishlistItem, getUserOrders } from '../api/userApi';
import { Order } from '../types';

interface AccountProps {
  activeTab?: 'profile' | 'orders' | 'wishlist' | 'settings';
}

// Định nghĩa type cho item đơn hàng
interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

// Component hiển thị hồ sơ người dùng
const Account: React.FC<AccountProps> = ({ activeTab: propActiveTab }) => {
  const auth = useContext(AuthContext);
  const { formatCurrency, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist' | 'settings'>(propActiveTab || 'profile');
  const [profileData, setProfileData] = useState({
    name: auth?.user?.name || '',
    email: auth?.user?.email || '',
    phone: '', // Không có trong User, để trống
    address: '' // Không có trong User, để trống
  });
  const [avatar, setAvatar] = useState(auth?.user?.avatar || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [orders, setOrders] = useState([
    {
      id: 'ORD-2023-0001',
      date: '15/06/2023',
      total: 1299000,
      status: 'Delivered',
      items: [
        { name: 'Yapee 3D Headphones', qty: 1, price: 1299000 }
      ]
    }
  ]);
  const [wishlist, setWishlist] = useState([
    { id: 'prod-1', name: 'Yapee 3D Headphones', added: '01/07/2025' }
  ]);
  const [showOrderDetail, setShowOrderDetail] = useState<string|null>(null);
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  // Khi load trang, fetch lại dữ liệu user, wishlist, orders từ Supabase
  useEffect(() => {
    (async () => {
      if (!auth?.user?.id) return;
      // Lấy profile từ DB
      const user = await getUserProfile(auth.user.id);
      if (user) {
        setProfileData({
          name: user.name || '',
          email: user.email || '',
          phone: (user as { phone?: string }).phone || '',
          address: (user as { address?: string }).address || ''
        });
        setAvatar(user.avatar || '');
      }
      // Lấy wishlist từ DB
      const wishlistData = await getUserWishlist(auth.user.id);
      setWishlist(wishlistData.map((item: { product_id: string; name: string; added: string }) => ({
        id: item.product_id,
        name: item.name,
        added: item.added
      })));
      // Lấy orders từ DB
      const ordersData = await getUserOrders(auth.user.email);
      setOrders(ordersData.map((order: Order) => ({
        id: order.id,
        date: order.createdAt,
        total: order.total,
        status: order.status,
        items: order.items.map((item: OrderItem) => ({
          name: item.name,
          qty: item.qty,
          price: item.price
        }))
      })));
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // Nếu propActiveTab thay đổi (do route), cập nhật tab
  useEffect(() => {
    if (propActiveTab) setActiveTab(propActiveTab);
  }, [propActiveTab]);

  // Kiểm tra xem người dùng đã đăng nhập chưa
  useEffect(() => {
    if (!auth?.user) {
      navigate('/login', { state: { from: '/account' } });
    }
  }, [auth?.user, navigate]);
  if (!auth?.user) {
    return null;
  }

  // Cập nhật profile/avatar lên Supabase
  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!auth.user) return;
    setLoading(true);
    try {
      await updateUserProfile(auth.user.id, {
        name: profileData.name,
        avatar
      });
      setLoading(false);
      alert('Cập nhật thông tin thành công!');
    } catch {
      setLoading(false);
      alert('Có lỗi khi cập nhật!');
    }
  };
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!auth.user) return;
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        setAvatar(ev.target?.result as string);
        await updateUserProfile(auth.user!.id, { avatar: ev.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // Đổi mật khẩu
  const handlePasswordChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!passwordForm.current || !passwordForm.new || !passwordForm.confirm) {
      alert('Please fill all password fields.');
      return;
    }
    if (passwordForm.new !== passwordForm.confirm) {
      alert('New passwords do not match.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setPasswordForm({ current: '', new: '', confirm: '' });
      alert('Password updated successfully!');
    }, 800);
  };

  // Wishlist: xóa khỏi DB
  const handleRemoveWishlist = useCallback(async (id: string) => {
    if (!auth.user) return;
    await removeWishlistItem(auth.user.id, id);
    setWishlist(prev => prev.filter(item => item.id !== id));
  }, [auth.user]);
  // Đơn hàng
  const handleViewOrder = useCallback((id: string) => {
    setShowOrderDetail(id);
  }, []);
  const handleCloseOrderDetail = useCallback(() => setShowOrderDetail(null), []);

  // Đăng xuất
  const handleLogout = () => {
    auth.logout();
    navigate('/');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Thông tin người dùng */}
        <div className="md:col-span-1 p-6 border rounded-lg bg-white">
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4 relative group cursor-pointer" onClick={() => fileInputRef.current?.click()} title="Change avatar">
              {avatar ? (
                <img src={avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-primary">{auth.user.name.charAt(0)}</span>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center rounded-full transition">
                <span className="text-xs text-white opacity-0 group-hover:opacity-100 transition">Change</span>
              </div>
              <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleAvatarChange} />
            </div>
            <h2 className="text-xl font-semibold">{auth.user.name}</h2>
            <p className="text-gray-500">{auth.user.email}</p>
            <button onClick={handleLogout} className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded">
              Log out
            </button>
          </div>
        </div>
        {/* Nội dung chi tiết */}
        <div className="md:col-span-2">
          <div>
            <div className="grid grid-cols-4 mb-6 border-b">
              <button className={`py-2 ${activeTab === 'profile' ? 'border-b-2 border-primary font-bold' : ''}`} onClick={() => setActiveTab('profile')}>
                My Profile
              </button>
              <button className={`py-2 ${activeTab === 'orders' ? 'border-b-2 border-primary font-bold' : ''}`} onClick={() => setActiveTab('orders')}>
                My Orders
              </button>
              <button className={`py-2 ${activeTab === 'wishlist' ? 'border-b-2 border-primary font-bold' : ''}`} onClick={() => setActiveTab('wishlist')}>
                My Wishlist
              </button>
              <button className={`py-2 ${activeTab === 'settings' ? 'border-b-2 border-primary font-bold' : ''}`} onClick={() => setActiveTab('settings')}>
                Settings
              </button>
            </div>
            {/* Tab Thông tin cá nhân */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="p-6 border rounded-lg bg-white">
                  <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Full Name</label>
                        <input
                          className="w-full border rounded px-3 py-2"
                          value={profileData.name}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfileData({...profileData, name: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <input
                          className="w-full border rounded px-3 py-2"
                          type="email"
                          value={profileData.email}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfileData({...profileData, email: e.target.value})}
                          required
                          disabled
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Phone</label>
                      <input
                        className="w-full border rounded px-3 py-2"
                        value={profileData.phone}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfileData({...profileData, phone: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Address</label>
                      <input
                        className="w-full border rounded px-3 py-2"
                        value={profileData.address}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfileData({...profileData, address: e.target.value})}
                      />
                    </div>
                    <button type="submit" className="w-full md:w-auto bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded">
                      Save Changes
                    </button>
                  </form>
                </div>
              </div>
            )}
            {/* Tab Lịch sử đơn hàng */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="p-6 border rounded-lg bg-white">
                  <h3 className="text-xl font-semibold mb-4">Order History</h3>
                  <div className="space-y-4">
                    {orders.length === 0 && <div className="text-center py-8 text-gray-500">No orders yet.</div>}
                    {orders.map(order => (
                      <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">Order Number: #{order.id}</span>
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">{order.status}</span>
                        </div>
                        <div className="text-sm text-gray-500 mb-2">Order Date: {order.date}</div>
                        <div className="text-sm mb-2">Total: {formatCurrency(order.total)}</div>
                        <button className="text-primary underline text-sm p-0 h-auto bg-transparent" type="button" onClick={() => handleViewOrder(order.id)}>
                          View Details
                        </button>
                      </div>
                    ))}
                    {/* Chi tiết đơn hàng */}
                    {showOrderDetail && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                        <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
                          <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={handleCloseOrderDetail}>×</button>
                          <h4 className="text-lg font-bold mb-2">Order #{showOrderDetail}</h4>
                          {orders.filter(o => o.id === showOrderDetail).map(order => (
                            <div key={order.id}>
                              <div className="mb-2 text-sm text-gray-500">Date: {order.date}</div>
                              <ul className="mb-2">
                                {order.items.map((item, idx) => (
                                  <li key={idx}>{item.name} x{item.qty} - {formatCurrency(item.price)}</li>
                                ))}
                              </ul>
                              <div className="font-medium">Total: {formatCurrency(order.total)}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            {/* Tab Wishlist */}
            {activeTab === 'wishlist' && (
              <div className="space-y-6">
                <div className="p-6 border rounded-lg bg-white">
                  <h3 className="text-xl font-semibold mb-4">My Wishlist</h3>
                  <div className="space-y-4">
                    {wishlist.length === 0 && <div className="text-center py-8 text-gray-500">No wishlist items yet.</div>}
                    {wishlist.map(item => (
                      <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow flex items-center justify-between">
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-gray-500">Added: {item.added}</div>
                        </div>
                        <button className="text-red-500 hover:underline text-sm p-0 h-auto bg-transparent" type="button" onClick={() => handleRemoveWishlist(item.id)}>
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {/* Tab Cài đặt */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="p-6 border rounded-lg bg-white">
                  <h3 className="text-xl font-semibold mb-4">Change Password</h3>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Current Password</label>
                      <input className="w-full border rounded px-3 py-2" type="password" required value={passwordForm.current} onChange={e => setPasswordForm(f => ({...f, current: e.target.value}))} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">New Password</label>
                      <input className="w-full border rounded px-3 py-2" type="password" required value={passwordForm.new} onChange={e => setPasswordForm(f => ({...f, new: e.target.value}))} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Confirm New Password</label>
                      <input className="w-full border rounded px-3 py-2" type="password" required value={passwordForm.confirm} onChange={e => setPasswordForm(f => ({...f, confirm: e.target.value}))} />
                    </div>
                    <button type="submit" className="w-full md:w-auto bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded" disabled={loading}>
                      {loading ? 'Updating...' : 'Update Password'}
                    </button>
                  </form>
                </div>
                <div className="p-6 border rounded-lg bg-white">
                  <h3 className="text-xl font-semibold mb-4">Language</h3>
                  <select
                    className="w-full border rounded px-3 py-2"
                    value={language}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setLanguage(e.target.value as 'vi' | 'en' | 'zh')}
                  >
                    <option value="vi">Tiếng Việt</option>
                    <option value="en">English</option>
                    <option value="zh">中文</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;