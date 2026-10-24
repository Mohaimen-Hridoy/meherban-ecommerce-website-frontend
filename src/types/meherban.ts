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
  categoryName: 'Men' | 'Women' | 'Unisex' | 'Accessories' | 'Clothing';
  images: string[];
  colorSwatches: ColorSwatch[];
  sizes: string[];
  inStock: boolean;
  isTrending: boolean;
  isFeatured: boolean;
  badge?: string;
}

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
