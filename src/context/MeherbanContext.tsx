'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  CartItem,
  MeherbanProduct,
  WishlistItem,
  MeherbanOrder,
  MeherbanSeller,
  AuthRole,
  HeroSlide,
  PromoBanner,
  InstagramPost,
  MeherbanCategory,
  ColorSwatch,
} from '@/types/meherban';
import {
  MEHERBAN_PRODUCTS,
  DEFAULT_HERO_SLIDES,
  DEFAULT_PROMO_BANNERS,
  MEHERBAN_CATEGORIES,
  INSTAGRAM_POSTS,
} from '@/lib/meherbanData';

export type DeviceViewMode = 'responsive' | 'desktop' | 'mobile' | 'split';

interface ToastMessage {
  id: string;
  text: string;
  type?: 'success' | 'info' | 'error';
}

interface NewProductInput {
  title: string;
  subtitle?: string;
  description: string;
  price: number;
  originalPrice?: number;
  categoryName: string;
  images: string[];
  colorSwatches: ColorSwatch[];
  sizes: string[];
  inStock: boolean;
  stockQuantity: number;
  badge?: string;
  isTrending?: boolean;
  isFeatured?: boolean;
  sellerId?: string;
  sellerName?: string;
}

// Single Seller Store Model (একমাত্র ১ জন বিক্রেতা / স্টোর ওনার)
const DEFAULT_SELLERS: MeherbanSeller[] = [
  {
    id: 'seller-1',
    name: 'Mohaimen Hridoy (Merchant)',
    email: 'seller@meherban.com',
    phone: '01778607894',
    shopName: 'MEHERBAN Official Store',
    isActive: true,
    joinedAt: '2026-01-15T10:00:00Z',
  },
];

interface MeherbanContextType {
  // Products Management
  products: MeherbanProduct[];
  addProduct: (product: NewProductInput) => Promise<MeherbanProduct>;
  updateProduct: (id: string, updatedData: Partial<MeherbanProduct>) => Promise<MeherbanProduct | null>;
  deleteProduct: (id: string) => Promise<boolean>;
  toggleProductAvailability: (id: string) => Promise<void>;
  updateProductStockQuantity: (id: string, qty: number) => Promise<void>;
  getProductById: (idOrSlug: string) => MeherbanProduct | undefined;

  // Cart
  cart: CartItem[];
  addToCart: (product: MeherbanProduct, size?: string, color?: string, qty?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  shippingFee: number;
  freeShippingThreshold: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Express / Fast Buy Now for Instagram & Facebook Ad traffic
  directBuyNow: (product: MeherbanProduct, size?: string, color?: string, qty?: number) => void;
  expressCheckoutProduct: MeherbanProduct | null;
  setExpressCheckoutProduct: (product: MeherbanProduct | null) => void;

  // Wishlist
  wishlist: WishlistItem[];
  toggleWishlist: (product: MeherbanProduct) => void;
  isWishlisted: (productId: string) => boolean;
  wishlistCount: number;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;

  // Quick View
  quickViewProduct: MeherbanProduct | null;
  openQuickView: (product: MeherbanProduct) => void;
  closeQuickView: () => void;

  // Search & Checkout Modals
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;

  // Guest Order Management
  orders: MeherbanOrder[];
  placeCustomerOrder: (orderData: {
    customerName: string;
    customerPhone: string;
    shippingAddress: string;
    city: string;
    customerEmail?: string;
    paymentMethod: string;
    notes?: string;
    items?: CartItem[];
  }) => Promise<{ success: boolean; orderNumber: string; totalAmount: number }>;
  updateOrderStatus: (orderNumber: string, status: MeherbanOrder['orderStatus']) => Promise<void>;

  // Role Separation: Admin vs Seller Accounts
  authRole: AuthRole;
  currentSeller: MeherbanSeller | null;
  sellers: MeherbanSeller[];
  adminLogin: (password: string) => boolean;
  sellerLogin: (email: string, password: string) => boolean;
  logout: () => void;
  addSeller: (seller: Omit<MeherbanSeller, 'id' | 'joinedAt'>) => void;
  toggleSellerStatus: (sellerId: string) => void;
  isAdminLoggedIn: boolean;
  isSellerLoggedIn: boolean;
  adminLogout: () => void;

  // Device & Layout View
  deviceView: DeviceViewMode;
  setDeviceView: (mode: DeviceViewMode) => void;

  // Navigation Filter
  activeCategory: string;
  setActiveCategory: (cat: string) => void;

  // Notifications
  toasts: ToastMessage[];
  addToast: (text: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;

  // Frontpage Media Controls (Hero Sliders, Collections, Promo Banners, Instagram)
  heroSlides: HeroSlide[];
  promoBanners: PromoBanner[];
  categories: MeherbanCategory[];
  instagramPosts: InstagramPost[];
  updateHeroSlide: (id: number, data: Partial<HeroSlide>) => void;
  updatePromoBanner: (id: string, data: Partial<PromoBanner>) => void;
  updateCategory: (id: string, data: Partial<MeherbanCategory>) => void;
  updateInstagramPost: (id: string, data: Partial<InstagramPost>) => void;
  resetFrontpageMedia: () => void;
}

const MeherbanContext = createContext<MeherbanContextType | undefined>(undefined);

export const MeherbanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<MeherbanProduct[]>(MEHERBAN_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [orders, setOrders] = useState<MeherbanOrder[]>([]);
  const [sellers, setSellers] = useState<MeherbanSeller[]>(DEFAULT_SELLERS);
  const [authRole, setAuthRole] = useState<AuthRole>(null);
  const [currentSeller, setCurrentSeller] = useState<MeherbanSeller | null>(null);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<MeherbanProduct | null>(null);
  const [expressCheckoutProduct, setExpressCheckoutProduct] = useState<MeherbanProduct | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [deviceView, setDeviceView] = useState<DeviceViewMode>('responsive');
  const [activeCategory, setActiveCategory] = useState<string>('Home');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Frontpage Media States (controlled by single seller)
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(DEFAULT_HERO_SLIDES);
  const [promoBanners, setPromoBanners] = useState<PromoBanner[]>(DEFAULT_PROMO_BANNERS);
  const [categories, setCategories] = useState<MeherbanCategory[]>(MEHERBAN_CATEGORIES);
  const [instagramPosts, setInstagramPosts] = useState<InstagramPost[]>(INSTAGRAM_POSTS);

  // Persistence guard: prevents initial default state from wiping localStorage on mount
  const isStorageLoaded = useRef(false);

  const getBackendUrl = () => {
    let url = process.env.NEXT_PUBLIC_API_URL || '';
    if (!url || url.includes('localhost')) {
      if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
        url = 'https://meherban-ecommerce-website-backend.vercel.app';
      } else {
        url = url || 'http://localhost:5000';
      }
    }
    url = url.replace(/\/api\/v1\/?$/, '');
    url = url.replace(/\/$/, '');
    return url;
  };

  const addToast = useCallback((text: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Initial Load from LocalStorage and Backend API
  useEffect(() => {
    try {
      // 1. Load user custom products (permanent, never auto-removed)
      const savedCustom = localStorage.getItem('meherban_custom_products');
      let customProducts: MeherbanProduct[] = [];
      if (savedCustom) {
        try {
          const parsedCustom = JSON.parse(savedCustom);
          if (Array.isArray(parsedCustom)) {
            customProducts = parsedCustom;
          }
        } catch {}
      }

      // 2. Load general product catalog
      const savedProducts = localStorage.getItem('meherban_products');
      let catalogProducts: MeherbanProduct[] = MEHERBAN_PRODUCTS;
      if (savedProducts) {
        try {
          const parsed = JSON.parse(savedProducts);
          if (Array.isArray(parsed) && parsed.length > 0) {
            catalogProducts = parsed;
          }
        } catch {}
      }

      // 3. Guarantee user-created custom products are ALWAYS retained at top
      const customIds = new Set(customProducts.map((p) => p.id));
      const catalogWithoutCustom = catalogProducts.filter((p) => !customIds.has(p.id));
      const mergedProducts = [...customProducts, ...catalogWithoutCustom];

      setProducts(mergedProducts);
      isStorageLoaded.current = true;
      try {
        localStorage.setItem('meherban_products', JSON.stringify(mergedProducts));
      } catch {}

      const savedCart = localStorage.getItem('meherban_cart');
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem('meherban_wishlist');
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

      const savedOrders = localStorage.getItem('meherban_orders');
      if (savedOrders) setOrders(JSON.parse(savedOrders));

      const savedSellers = localStorage.getItem('meherban_sellers');
      if (savedSellers) setSellers(JSON.parse(savedSellers));

      const savedRole = localStorage.getItem('meherban_auth_role');
      if (savedRole === 'ADMIN' || savedRole === 'SELLER') {
        setAuthRole(savedRole as AuthRole);
      }

      const savedSeller = localStorage.getItem('meherban_current_seller');
      if (savedSeller) setCurrentSeller(JSON.parse(savedSeller));

      // Load customized frontpage media (controlled by single seller)
      const savedMedia = localStorage.getItem('meherban_frontpage_media');
      if (savedMedia) {
        try {
          const parsedMedia = JSON.parse(savedMedia);
          if (Array.isArray(parsedMedia.heroSlides) && parsedMedia.heroSlides.length > 0) {
            setHeroSlides(parsedMedia.heroSlides);
          }
          if (Array.isArray(parsedMedia.promoBanners) && parsedMedia.promoBanners.length > 0) {
            setPromoBanners(parsedMedia.promoBanners);
          }
          if (Array.isArray(parsedMedia.categories) && parsedMedia.categories.length > 0) {
            setCategories(parsedMedia.categories);
          }
          if (Array.isArray(parsedMedia.instagramPosts) && parsedMedia.instagramPosts.length > 0) {
            setInstagramPosts(parsedMedia.instagramPosts);
          }
        } catch {}
      }
    } catch {}

    // Sync products and orders with backend API (Neon PostgreSQL)
    const fetchApiData = async () => {
      try {
        const url = getBackendUrl();
        const [prodRes, orderRes] = await Promise.allSettled([
          fetch(`${url}/api/v1/meherban/products`, { signal: AbortSignal.timeout(5000) }),
          fetch(`${url}/api/v1/meherban/admin/orders`, { signal: AbortSignal.timeout(5000) }),
        ]);

        if (prodRes.status === 'fulfilled' && prodRes.value.ok) {
          const data = await prodRes.value.json();
          if (data.data && Array.isArray(data.data) && data.data.length > 0) {
            setProducts((prev) => {
              // Retrieve persistent custom products
              let persistentCustom: MeherbanProduct[] = [];
              try {
                const s = localStorage.getItem('meherban_custom_products');
                if (s) persistentCustom = JSON.parse(s);
              } catch {}

              const customIds = new Set(persistentCustom.map((p) => p.id));
              const dbProducts = data.data as MeherbanProduct[];
              const dbIds = new Set(dbProducts.map((p) => p.id));

              // Retain any items in prev that are custom or not yet returned by DB
              const localUnique = prev.filter((p) => customIds.has(p.id) || !dbIds.has(p.id));
              const combinedMap = new Map<string, MeherbanProduct>();
              persistentCustom.forEach((p) => combinedMap.set(p.id, p));
              localUnique.forEach((p) => combinedMap.set(p.id, p));
              dbProducts.forEach((p) => {
                if (!combinedMap.has(p.id)) combinedMap.set(p.id, p);
              });

              const merged = Array.from(combinedMap.values());
              try {
                localStorage.setItem('meherban_products', JSON.stringify(merged));
              } catch {}
              return merged;
            });
          }
        }

        if (orderRes.status === 'fulfilled' && orderRes.value.ok) {
          const data = await orderRes.value.json();
          if (data.data && Array.isArray(data.data)) {
            setOrders(data.data);
            localStorage.setItem('meherban_orders', JSON.stringify(data.data));
          }
        }
      } catch {}
    };

    fetchApiData();
  }, []);

  // Sync to LocalStorage (Guarded: NEVER overwrite on mount!)
  useEffect(() => {
    try {
      localStorage.setItem('meherban_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('meherban_wishlist', JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  useEffect(() => {
    if (!isStorageLoaded.current) return;
    try {
      localStorage.setItem('meherban_products', JSON.stringify(products));
    } catch {}
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('meherban_orders', JSON.stringify(orders));
    } catch {}
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('meherban_sellers', JSON.stringify(sellers));
    } catch {}
  }, [sellers]);

  // Auth Operations: Separate Admin vs Seller
  const adminLogin = (password: string): boolean => {
    if (password === 'admin123' || password === 'meherban2026') {
      setAuthRole('ADMIN');
      setCurrentSeller(null);
      try {
        localStorage.setItem('meherban_auth_role', 'ADMIN');
        localStorage.removeItem('meherban_current_seller');
      } catch {}
      addToast('স্বাগতম সুপার অ্যাডমিন! সিস্টেম অ্যাডমিন প্যানেলে প্রবেশ করেছেন।', 'success');
      return true;
    } else {
      addToast('ভুল অ্যাডমিন পাসওয়ার্ড!', 'error');
      return false;
    }
  };

  const sellerLogin = (email: string, password: string): boolean => {
    const matched = sellers.find(
      (s) => s.email.toLowerCase() === email.toLowerCase()
    );

    // Allow demo seller login or verified credentials
    if (
      (matched && password === 'seller123') ||
      (email.toLowerCase() === 'seller@meherban.com' && (password === 'seller123' || password === 'admin123'))
    ) {
      const activeSeller = matched || DEFAULT_SELLERS[0];
      if (!activeSeller.isActive) {
        addToast('এই সেলার অ্যাকাউন্টটি অ্যাডমিন দ্বারা নিষ্ক্রিয় করা হয়েছে।', 'error');
        return false;
      }
      setAuthRole('SELLER');
      setCurrentSeller(activeSeller);
      try {
        localStorage.setItem('meherban_auth_role', 'SELLER');
        localStorage.setItem('meherban_current_seller', JSON.stringify(activeSeller));
      } catch {}
      addToast(`স্বাগতম ${activeSeller.shopName}! সেলার ড্যাশবোর্ডে প্রবেশ করেছেন।`, 'success');
      return true;
    } else {
      addToast('ভুল সেলার ইমেইল বা পাসওয়ার্ড!', 'error');
      return false;
    }
  };

  const logout = () => {
    setAuthRole(null);
    setCurrentSeller(null);
    try {
      localStorage.removeItem('meherban_auth_role');
      localStorage.removeItem('meherban_current_seller');
    } catch {}
    addToast('লগআউট সফল হয়েছে।');
  };

  // Admin Seller Management
  const addSeller = (sellerInput: Omit<MeherbanSeller, 'id' | 'joinedAt'>) => {
    const newSeller: MeherbanSeller = {
      ...sellerInput,
      id: `seller-${Date.now()}`,
      joinedAt: new Date().toISOString(),
    };
    setSellers((prev) => [newSeller, ...prev]);
    addToast(`নতুন সেলার "${newSeller.shopName}" নিবন্ধিত হয়েছে!`, 'success');
  };

  const toggleSellerStatus = (sellerId: string) => {
    setSellers((prev) =>
      prev.map((s) => (s.id === sellerId ? { ...s, isActive: !s.isActive } : s))
    );
    addToast('সেলার স্ট্যাটাস পরিবর্তন করা হয়েছে।', 'info');
  };

  // Products CRUD Operations for Seller & Admin
  const addProduct = async (input: NewProductInput): Promise<MeherbanProduct> => {
    const cleanSlug = input.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s\u0980-\u09FF-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const slug = (cleanSlug || 'product') + `-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    const effectiveSellerId = input.sellerId || (currentSeller ? currentSeller.id : 'seller-1');
    const effectiveSellerName = input.sellerName || (currentSeller ? currentSeller.shopName : 'Meherban Apparel Store');

    const cleanCat = (input.categoryName || 'Women').trim();
    const standardMatch = ['Men', 'Women', 'Unisex', 'Accessories', 'Clothing'].find(
      (c) => c.toLowerCase() === cleanCat.toLowerCase()
    );
    const categoryName = standardMatch || cleanCat;

    const newProd: MeherbanProduct = {
      id: `prod-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: input.title,
      slug,
      subtitle: input.subtitle || '',
      description: input.description,
      price: Number(input.price),
      originalPrice: input.originalPrice ? Number(input.originalPrice) : Number(input.price),
      rating: 5.0,
      reviewCount: 1,
      categoryName,
      images: input.images.length > 0 ? input.images : ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'],
      colorSwatches: input.colorSwatches.length > 0 ? input.colorSwatches : [{ name: 'Black', hex: '#000000', inStock: true, stockQuantity: 20 }],
      sizes: input.sizes.length > 0 ? input.sizes : ['Standard'],
      inStock: input.inStock,
      stockQuantity: Number(input.stockQuantity) || 25,
      isTrending: !!input.isTrending,
      isFeatured: !!input.isFeatured,
      badge: input.badge || (input.isTrending ? 'TRENDING' : undefined),
      sellerId: effectiveSellerId,
      sellerName: effectiveSellerName,
    };

    // 1. Permanently store in meherban_custom_products (never wiped)
    try {
      const existingCustom: MeherbanProduct[] = JSON.parse(
        localStorage.getItem('meherban_custom_products') || '[]'
      );
      const updatedCustom = [newProd, ...existingCustom.filter((p) => p.id !== newProd.id)];
      localStorage.setItem('meherban_custom_products', JSON.stringify(updatedCustom));
    } catch {}

    // 2. Update reactive product state
    setProducts((prev) => {
      const updated = [newProd, ...prev.filter((p) => p.id !== newProd.id)];
      try {
        localStorage.setItem('meherban_products', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    addToast(`"${newProd.title}" সফলভাবে যোগ হয়েছে!`, 'success');

    try {
      const url = getBackendUrl();
      await fetch(`${url}/api/v1/meherban/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProd),
      });
    } catch {}

    return newProd;
  };

  const updateProduct = async (id: string, updatedData: Partial<MeherbanProduct>): Promise<MeherbanProduct | null> => {
    let updatedProduct: MeherbanProduct | null = null;

    setProducts((prev) => {
      const updated = prev.map((item) => {
        if (item.id === id) {
          let cat = item.categoryName;
          if (updatedData.categoryName) {
            const cleanCat = updatedData.categoryName.trim();
            const standardMatch = ['Men', 'Women', 'Unisex', 'Accessories', 'Clothing'].find(
              (c) => c.toLowerCase() === cleanCat.toLowerCase()
            );
            cat = standardMatch || cleanCat;
          }

          const merged: MeherbanProduct = {
            ...item,
            ...updatedData,
            categoryName: cat,
            price: updatedData.price !== undefined ? Number(updatedData.price) : item.price,
            originalPrice: updatedData.originalPrice !== undefined ? Number(updatedData.originalPrice) : item.originalPrice,
            stockQuantity: updatedData.stockQuantity !== undefined ? Number(updatedData.stockQuantity) : item.stockQuantity,
          };
          if (merged.stockQuantity === 0 && updatedData.inStock === undefined) {
            merged.inStock = false;
          }
          updatedProduct = merged;
          return merged;
        }
        return item;
      });

      try {
        localStorage.setItem('meherban_products', JSON.stringify(updated));
      } catch {}

      return updated;
    });

    // Also update custom products if present
    try {
      const existingCustom: MeherbanProduct[] = JSON.parse(
        localStorage.getItem('meherban_custom_products') || '[]'
      );
      const cIdx = existingCustom.findIndex((p) => p.id === id);
      if (cIdx !== -1 && updatedProduct) {
        existingCustom[cIdx] = updatedProduct;
        localStorage.setItem('meherban_custom_products', JSON.stringify(existingCustom));
      }
    } catch {}

    if (updatedProduct) {
      addToast(`"${(updatedProduct as MeherbanProduct).title}" আপডেট সম্পন্ন!`, 'success');

      try {
        const url = getBackendUrl();
        await fetch(`${url}/api/v1/meherban/products/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedData),
        });
      } catch {}
    }

    return updatedProduct;
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    const prod = products.find((p) => p.id === id);

    // Remove from custom products
    try {
      const existingCustom: MeherbanProduct[] = JSON.parse(
        localStorage.getItem('meherban_custom_products') || '[]'
      );
      const filteredCustom = existingCustom.filter((p) => p.id !== id);
      localStorage.setItem('meherban_custom_products', JSON.stringify(filteredCustom));
    } catch {}

    setProducts((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      try {
        localStorage.setItem('meherban_products', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    addToast(prod ? `"${prod.title}" ডিলিট করা হয়েছে!` : 'প্রোডাক্ট ডিলিট করা হয়েছে!', 'info');

    try {
      const url = getBackendUrl();
      await fetch(`${url}/api/v1/meherban/products/${id}`, {
        method: 'DELETE',
      });
    } catch {}

    return true;
  };

  const toggleProductAvailability = async (id: string) => {
    const prod = products.find((p) => p.id === id);
    if (!prod) return;

    const newInStock = !prod.inStock;
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, inStock: newInStock } : p))
    );

    if (newInStock) {
      addToast(`"${prod.title}" এখন Available / স্টকে আছে`, 'success');
    } else {
      addToast(`"${prod.title}" Unavailable / স্টক আউট করা হয়েছে`, 'info');
    }

    try {
      const url = getBackendUrl();
      await fetch(`${url}/api/v1/meherban/products/${id}/stock`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inStock: newInStock }),
      });
    } catch {}
  };

  const updateProductStockQuantity = async (id: string, qty: number) => {
    const safeQty = Math.max(0, qty);
    const newInStock = safeQty > 0;

    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              stockQuantity: safeQty,
              inStock: safeQty === 0 ? false : p.inStock,
            }
          : p
      )
    );

    try {
      const url = getBackendUrl();
      await fetch(`${url}/api/v1/meherban/products/${id}/stock`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stockQuantity: safeQty, inStock: newInStock }),
      });
    } catch {}
  };

  const getProductById = (idOrSlug: string) => {
    return products.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
  };

  // Cart Operations
  const addToCart = (
    product: MeherbanProduct,
    size?: string,
    color?: string,
    qty: number = 1
  ) => {
    if (!product.inStock) {
      addToast(`দুঃখিত, "${product.title}" বর্তমানে স্টক আউট!`, 'error');
      return;
    }

    const chosenSize = size || product.sizes[0] || 'Standard';
    const chosenColor = color || product.colorSwatches[0]?.name || 'Standard';
    const cartItemId = `${product.id}-${chosenSize}-${chosenColor}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.id === cartItemId
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      } else {
        return [
          ...prev,
          {
            id: cartItemId,
            productId: product.id,
            title: product.title,
            price: product.price,
            quantity: qty,
            selectedColor: chosenColor,
            selectedSize: chosenSize,
            imageUrl: product.images[0] || '',
          },
        ];
      }
    });

    addToast(`"${product.title}" ব্যাগে যুক্ত করা হয়েছে`);
  };

  const directBuyNow = (
    product: MeherbanProduct,
    size?: string,
    color?: string,
    qty: number = 1
  ) => {
    if (!product.inStock) {
      addToast(`দুঃখিত, "${product.title}" বর্তমানে স্টক আউট!`, 'error');
      return;
    }

    const chosenSize = size || product.sizes[0] || 'Standard';
    const chosenColor = color || product.colorSwatches[0]?.name || 'Standard';
    const cartItemId = `${product.id}-${chosenSize}-${chosenColor}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        return prev;
      }
      return [
        {
          id: cartItemId,
          productId: product.id,
          title: product.title,
          price: product.price,
          quantity: qty,
          selectedColor: chosenColor,
          selectedSize: chosenSize,
          imageUrl: product.images[0] || '',
        },
        ...prev,
      ];
    });

    setExpressCheckoutProduct(product);
    setIsCartOpen(false);
    setIsWishlistOpen(false);
    setQuickViewProduct(null);
    setIsCheckoutOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist Operations
  const toggleWishlist = (product: MeherbanProduct) => {
    const exists = wishlist.some((w) => w.productId === product.id);
    if (exists) {
      setWishlist((prev) => prev.filter((w) => w.productId !== product.id));
      addToast(`Removed from wishlist`);
    } else {
      setWishlist((prev) => [
        ...prev,
        {
          productId: product.id,
          title: product.title,
          price: product.price,
          categoryName: product.categoryName,
          imageUrl: product.images[0] || '',
        },
      ]);
      addToast(`Saved to wishlist`);
    }
  };

  const isWishlisted = (productId: string) => {
    return wishlist.some((w) => w.productId === productId);
  };

  const openQuickView = (product: MeherbanProduct) => {
    setQuickViewProduct(product);
  };

  const closeQuickView = () => {
    setQuickViewProduct(null);
  };

  // Customer Guest Order Placement (Facebook & Instagram Ads)
  const placeCustomerOrder = async (orderData: {
    customerName: string;
    customerPhone: string;
    shippingAddress: string;
    city: string;
    customerEmail?: string;
    paymentMethod: string;
    notes?: string;
    items?: CartItem[];
  }): Promise<{ success: boolean; orderNumber: string; totalAmount: number }> => {
    const itemsToOrder = orderData.items && orderData.items.length > 0 ? orderData.items : cart;

    if (itemsToOrder.length === 0) {
      addToast('কার্ট খালি! কোনো পণ্য নির্বাচন করুন।', 'error');
      return { success: false, orderNumber: '', totalAmount: 0 };
    }

    const itemsSubtotal = itemsToOrder.reduce((acc, i) => acc + i.price * i.quantity, 0);
    const isDhaka = orderData.city.toLowerCase().includes('dhaka');
    const shipping = itemsSubtotal >= 1999 ? 0 : isDhaka ? 60 : 120;
    const finalTotal = itemsSubtotal + shipping;
    const orderNumber = `MH-${Date.now().toString().slice(-6)}`;

    // Identify primary seller for this order
    const firstOrderedProduct = products.find((p) => p.id === itemsToOrder[0]?.productId);
    const orderSellerId = firstOrderedProduct?.sellerId || 'seller-1';

    // Decrement stock for ordered items
    setProducts((prev) =>
      prev.map((prod) => {
        const ordered = itemsToOrder.find((i) => i.productId === prod.id);
        if (ordered && prod.stockQuantity) {
          const newStock = Math.max(0, prod.stockQuantity - ordered.quantity);
          return {
            ...prod,
            stockQuantity: newStock,
            inStock: newStock > 0,
          };
        }
        return prod;
      })
    );

    const newOrder: MeherbanOrder = {
      id: `ord-${Date.now()}`,
      orderNumber,
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      customerEmail: orderData.customerEmail || 'guest@meherban.com',
      shippingAddress: orderData.shippingAddress,
      city: orderData.city,
      totalAmount: finalTotal,
      shippingFee: shipping,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: orderData.paymentMethod === 'CASH_ON_DELIVERY' ? 'PENDING' : 'PAID',
      orderStatus: 'PENDING',
      notes: orderData.notes,
      createdAt: new Date().toISOString(),
      sellerId: orderSellerId,
      items: itemsToOrder.map((i) => ({
        productId: i.productId,
        title: i.title,
        price: i.price,
        quantity: i.quantity,
        selectedColor: i.selectedColor,
        selectedSize: i.selectedSize,
        imageUrl: i.imageUrl,
      })),
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();

    try {
      const url = getBackendUrl();
      await fetch(`${url}/api/v1/meherban/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...orderData,
          items: newOrder.items,
          sellerId: orderSellerId,
        }),
      });
    } catch {}

    return {
      success: true,
      orderNumber,
      totalAmount: finalTotal,
    };
  };

  const updateOrderStatus = async (orderNumber: string, status: MeherbanOrder['orderStatus']) => {
    setOrders((prev) =>
      prev.map((o) => (o.orderNumber === orderNumber ? { ...o, orderStatus: status } : o))
    );
    addToast(`Order #${orderNumber} status changed to ${status}`, 'success');

    try {
      const url = getBackendUrl();
      await fetch(`${url}/api/v1/meherban/admin/orders/${orderNumber}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    } catch {}
  };

  // Frontpage Media Updaters (persists to localStorage)
  const persistMedia = (partial: {
    heroSlides?: HeroSlide[];
    promoBanners?: PromoBanner[];
    categories?: MeherbanCategory[];
    instagramPosts?: InstagramPost[];
  }) => {
    try {
      const existing = localStorage.getItem('meherban_frontpage_media');
      const parsed = existing ? JSON.parse(existing) : {};
      const updated = {
        heroSlides: partial.heroSlides || parsed.heroSlides || heroSlides,
        promoBanners: partial.promoBanners || parsed.promoBanners || promoBanners,
        categories: partial.categories || parsed.categories || categories,
        instagramPosts: partial.instagramPosts || parsed.instagramPosts || instagramPosts,
      };
      localStorage.setItem('meherban_frontpage_media', JSON.stringify(updated));
    } catch {}
  };

  const updateHeroSlide = (id: number, data: Partial<HeroSlide>) => {
    setHeroSlides((prev) => {
      const updated = prev.map((s) => (s.id === id ? { ...s, ...data } : s));
      persistMedia({ heroSlides: updated });
      return updated;
    });
    addToast('হিরো ব্যানার সফলভাবে আপডেট করা হয়েছে!', 'success');
  };

  const updatePromoBanner = (id: string, data: Partial<PromoBanner>) => {
    setPromoBanners((prev) => {
      const updated = prev.map((b) => (b.id === id ? { ...b, ...data } : b));
      persistMedia({ promoBanners: updated });
      return updated;
    });
    addToast('প্রোমো ব্যানার সফলভাবে আপডেট করা হয়েছে!', 'success');
  };

  const updateCategory = (id: string, data: Partial<MeherbanCategory>) => {
    setCategories((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, ...data } : c));
      persistMedia({ categories: updated });
      return updated;
    });
    addToast('কালেকশন কার্ড সফলভাবে আপডেট করা হয়েছে!', 'success');
  };

  const updateInstagramPost = (id: string, data: Partial<InstagramPost>) => {
    setInstagramPosts((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, ...data } : p));
      persistMedia({ instagramPosts: updated });
      return updated;
    });
    addToast('ইনস্টাগ্রাম ছবি সফলভাবে আপডেট করা হয়েছে!', 'success');
  };

  const resetFrontpageMedia = () => {
    setHeroSlides(DEFAULT_HERO_SLIDES);
    setPromoBanners(DEFAULT_PROMO_BANNERS);
    setCategories(MEHERBAN_CATEGORIES);
    setInstagramPosts(INSTAGRAM_POSTS);
    localStorage.removeItem('meherban_frontpage_media');
    addToast('ফ্রন্টপেজ মিডিয়া ডিফল্ট অবস্থায় ফিরিয়ে নেওয়া হয়েছে।', 'info');
  };

  // Calculations
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlist.length;
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const freeShippingThreshold = 1999;
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 60;

  return (
    <MeherbanContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductAvailability,
        updateProductStockQuantity,
        getProductById,

        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        subtotal,
        shippingFee,
        freeShippingThreshold,
        isCartOpen,
        setIsCartOpen,

        directBuyNow,
        expressCheckoutProduct,
        setExpressCheckoutProduct,

        wishlist,
        toggleWishlist,
        isWishlisted,
        wishlistCount,
        isWishlistOpen,
        setIsWishlistOpen,

        quickViewProduct,
        openQuickView,
        closeQuickView,

        isSearchOpen,
        setIsSearchOpen,

        isCheckoutOpen,
        setIsCheckoutOpen,

        orders,
        placeCustomerOrder,
        updateOrderStatus,

        authRole,
        currentSeller,
        sellers,
        adminLogin,
        sellerLogin,
        logout,
        addSeller,
        toggleSellerStatus,
        isAdminLoggedIn: authRole === 'ADMIN',
        isSellerLoggedIn: authRole === 'SELLER',
        adminLogout: logout,

        deviceView,
        setDeviceView,

        activeCategory,
        setActiveCategory,

        toasts,
        addToast,
        removeToast,

        // Frontpage Media Controls
        heroSlides,
        promoBanners,
        categories,
        instagramPosts,
        updateHeroSlide,
        updatePromoBanner,
        updateCategory,
        updateInstagramPost,
        resetFrontpageMedia,
      }}
    >
      {children}

      {/* Floating Toast Alerts */}
      <div className="fixed bottom-20 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`backdrop-blur-md text-white text-xs px-4 py-2.5 rounded-lg shadow-xl border pointer-events-auto flex items-center gap-2 animate-fade-in ${
              toast.type === 'error'
                ? 'bg-rose-950/95 border-rose-800'
                : toast.type === 'success'
                ? 'bg-emerald-950/95 border-emerald-800'
                : 'bg-neutral-900/95 border-neutral-700'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                toast.type === 'error'
                  ? 'bg-rose-400'
                  : toast.type === 'success'
                  ? 'bg-emerald-400'
                  : 'bg-amber-400'
              }`}
            />
            <span>{toast.text}</span>
          </div>
        ))}
      </div>
    </MeherbanContext.Provider>
  );
};

export const useMeherban = () => {
  const context = useContext(MeherbanContext);
  if (!context) {
    throw new Error('useMeherban must be used within a MeherbanProvider');
  }
  return context;
};
