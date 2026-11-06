export interface ColorSwatch {
  name: string;
  hex: string;
}

export interface MeherbanProduct {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  categoryName: string;
  images: string[];
  colorSwatches: ColorSwatch[];
  sizes: string[];
  inStock: boolean;
  stockQuantity?: number;
  isTrending: boolean;
  isFeatured: boolean;
  badge?: string;
  sellerId?: string;
  sellerName?: string;
}

export interface MeherbanSeller {
  id: string;
  name: string;
  email: string;
  phone: string;
  shopName: string;
  isActive: boolean;
  joinedAt: string;
}

export type AuthRole = 'ADMIN' | 'SELLER' | null;

export interface MeherbanCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  imageUrl: string;
  tagline: string;
  count: number;
}

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  quantity: number;
  selectedColor: string;
  selectedSize: string;
  imageUrl: string;
}

export interface WishlistItem {
  productId: string;
  title: string;
  price: number;
  categoryName: string;
  imageUrl: string;
}

export interface MeherbanOrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  imageUrl?: string;
}

export interface MeherbanOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  totalAmount: number;
  shippingFee: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  notes?: string;
  createdAt: string;
  items: MeherbanOrderItem[];
  sellerId?: string;
}

export interface HeroSlide {
  id: number;
  tagline: string;
  headlineLine1: string;
  headlineLine2: string;
  subcategories: string;
  imageUrl: string;
  ctaPrimary: string;
  ctaSecondary: string;
}

export interface PromoBanner {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  cta: string;
  bgClass: string;
  imageUrl: string;
}

export interface InstagramPost {
  id: string;
  imageUrl: string;
  likes: string;
  tag: string;
}
