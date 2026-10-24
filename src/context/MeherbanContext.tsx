'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, MeherbanProduct, WishlistItem } from '@/types/meherban';
import { MEHERBAN_PRODUCTS } from '@/lib/meherbanData';

export type DeviceViewMode = 'responsive' | 'desktop' | 'mobile';

interface ToastMessage {
  id: string;
  text: string;
  type?: 'success' | 'info';
}

interface MeherbanContextType {
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

  wishlist: WishlistItem[];
  toggleWishlist: (product: MeherbanProduct) => void;
  isWishlisted: (productId: string) => boolean;
  wishlistCount: number;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;

  quickViewProduct: MeherbanProduct | null;
  openQuickView: (product: MeherbanProduct) => void;
  closeQuickView: () => void;

  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;

  deviceView: DeviceViewMode;
  setDeviceView: (mode: DeviceViewMode) => void;

  activeCategory: string;
  setActiveCategory: (cat: string) => void;

  toasts: ToastMessage[];
  addToast: (text: string) => void;
  removeToast: (id: string) => void;
}

const MeherbanContext = createContext<MeherbanContextType | undefined>(undefined);

export const MeherbanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<MeherbanProduct | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [deviceView, setDeviceView] = useState<DeviceViewMode>('responsive');
  const [activeCategory, setActiveCategory] = useState<string>('Home');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('meherban_cart');
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem('meherban_wishlist');
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('meherban_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('meherban_wishlist', JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  const addToast = (text: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, text }]);
    setTimeout(() => {
      removeToast(id);
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addToCart = (
    product: MeherbanProduct,
    size?: string,
    color?: string,
    qty: number = 1
  ) => {
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
            imageUrl: product.images[0],
          },
        ];
      }
    });

    addToast(`Added "${product.title}" to cart`);
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
          imageUrl: product.images[0],
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

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlist.length;
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const freeShippingThreshold = 1999;
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 120;

  return (
    <MeherbanContext.Provider
      value={{
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

        deviceView,
        setDeviceView,

        activeCategory,
        setActiveCategory,

        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}

      {/* Floating Toast Alerts */}
      <div className="fixed bottom-20 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="bg-neutral-900/95 backdrop-blur-md text-white text-xs px-4 py-2.5 rounded-lg shadow-xl border border-neutral-700 pointer-events-auto flex items-center gap-2 animate-fade-in"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
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
