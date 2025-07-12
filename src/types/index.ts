export interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  parentId?: string;
  status: 'active' | 'inactive';
  image?: string;
  productCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  nameTranslations?: {
    en: string;
    vi: string;
    zh: string;
  };
  price: number;
  originalPrice?: number;
  description: string;
  descriptionTranslations?: {
    en: string;
    vi: string;
    zh: string;
  };
  category: string;
  images: string[];
  colors: string[];
  colorsTranslations?: {
    en: string[];
    vi: string[];
    zh: string[];
  };
  sizes: string[];
  sizesTranslations?: {
    en: string[];
    vi: string[];
    zh: string[];
  };
  rating: number;
  reviews: number;
  inStock: boolean;
  features: string[];
  featuresTranslations?: {
    en: string[];
    vi: string[];
    zh: string[];
  };
  specifications: Record<string, string>;
  specificationsTranslations?: {
    en: Record<string, string>;
    vi: Record<string, string>;
    zh: Record<string, string>;
  };
  model3d?: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  shippingAddress: string;
}

export interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: 'admin' | 'editor' | 'customer';
  avatar?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  isActive?: boolean;
  isEmailVerified?: boolean;
  preferences?: {
    language: string;
    currency: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
  addresses?: Array<{
    id: string;
    type: 'home' | 'work' | 'other';
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
    isDefault: boolean;
  }>;
  createdAt?: string;
  updatedAt?: string;
  lastLoginAt?: string | null;
}