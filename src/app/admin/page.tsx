'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Package,
  ShoppingBag,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  XCircle,
  TrendingUp,
  AlertTriangle,
  Lock,
  LogOut,
  Phone,
  MessageCircle,
  Search,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Zap,
  Users,
  Store,
  Clock,
  Truck,
  Copy,
  Printer,
  X,
  Mail,
  UserCheck,
  UserX,
  Upload,
  Loader2,
  Check,
} from 'lucide-react';
import { useMeherban } from '@/context/MeherbanContext';
import { MeherbanProduct, MeherbanOrder, MeherbanSeller, ColorSwatch } from '@/types/meherban';

export default function AdminPage() {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductAvailability,
    updateProductStockQuantity,
    orders,
    updateOrderStatus,
    sellers,
    addSeller,
    toggleSellerStatus,
    authRole,
    adminLogin,
    logout,
    addToast,
    categories,
  } = useMeherban();

  // Authentication State
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);

  // Active Tab: 'products' | 'orders' | 'sellers' | 'boost'
  const [activeTab, setActiveTab] = useState<'sellers' | 'products' | 'orders' | 'boost'>('products');

  // Product Filters
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('ALL');
  const [productStockFilter, setProductStockFilter] = useState<'ALL' | 'IN_STOCK' | 'OUT_OF_STOCK'>('ALL');
  const [productSellerFilter, setProductSellerFilter] = useState('ALL');

  // Order Filters
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');
  const [orderSellerFilter, setOrderSellerFilter] = useState('ALL');

  // Product Add / Edit Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  // Add Seller Modal State
  const [isAddSellerModalOpen, setIsAddSellerModalOpen] = useState(false);
  const [sellerForm, setSellerForm] = useState({
    name: '',
    shopName: '',
    email: '',
    phone: '',
    password: 'seller123',
    isActive: true,
  });

  const initialFormState = {
    title: '',
    subtitle: '',
    description: '',
    price: '',
    originalPrice: '',
    categoryName: 'Men',
    sellerId: 'seller-1',
    images: [''],
    colorSwatches: [
      { name: 'Black', hex: '#111111', inStock: true, stockQuantity: 15 },
      { name: 'Grey', hex: '#666666', inStock: true, stockQuantity: 10 },
    ] as ColorSwatch[],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    stockQuantity: '25',
    badge: 'NEW',
    isTrending: true,
    isFeatured: true,
  };

  const [productForm, setProductForm] = useState(initialFormState);
  const [deletingProduct, setDeletingProduct] = useState<MeherbanProduct | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Color Variants State for Custom Colors
  const [customColorName, setCustomColorName] = useState('');
  const [customColorHex, setCustomColorHex] = useState('#111111');
  const [imageUrlInput, setImageUrlInput] = useState('');

  // 15 Standard Brand Color Swatch Presets (Black, White, Navy Blue, Royal Blue, Sky Blue, Red, Maroon, Pink, Baby Pink, Purple, Lavender, Green, Olive Green, Beige, Brown)
  const POPULAR_COLORS = [
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Navy Blue', hex: '#000080' },
    { name: 'Royal Blue', hex: '#4169E1' },
    { name: 'Sky Blue', hex: '#87CEEB' },
    { name: 'Red', hex: '#FF0000' },
    { name: 'Maroon', hex: '#800000' },
    { name: 'Pink', hex: '#FFC0CB' },
    { name: 'Baby Pink', hex: '#F4C2C2' },
    { name: 'Purple', hex: '#800080' },
    { name: 'Lavender', hex: '#E6E6FA' },
    { name: 'Green', hex: '#008000' },
    { name: 'Olive Green', hex: '#808000' },
    { name: 'Beige', hex: '#F5F5DC' },
    { name: 'Brown', hex: '#8B4513' },
  ];

  // Standard Fashion Sizes
  const STANDARD_SIZES = ['S', 'M', 'L', 'XL', 'XXL', 'Free Size'];

  // All Available Dynamic & Standard Categories (Case-insensitive deduplication)
  const availableCategories = Array.from(
    new Map(
      [
        'Men',
        'Women',
        'Unisex',
        'Accessories',
        'Clothing',
        ...(categories || []).map((c) => c.name),
        ...products.map((p) => p.categoryName),
      ]
        .filter(Boolean)
        .map((cat) => {
          const lower = cat.trim().toLowerCase();
          const std = ['Men', 'Women', 'Unisex', 'Accessories', 'Clothing'].find(
            (s) => s.toLowerCase() === lower
          );
          return [lower, std || cat.trim()];
        })
    ).values()
  );

  // Toggle Preset Color Swatch
  const handleToggleColorPreset = (color: { name: string; hex: string }) => {
    const exists = productForm.colorSwatches.some(
      (c) => c.name.toLowerCase() === color.name.toLowerCase()
    );
    if (exists) {
      setProductForm((prev) => ({
        ...prev,
        colorSwatches: prev.colorSwatches.filter(
          (c) => c.name.toLowerCase() !== color.name.toLowerCase()
        ),
      }));
    } else {
      setProductForm((prev) => ({
        ...prev,
        colorSwatches: [
          ...prev.colorSwatches,
          { name: color.name, hex: color.hex, inStock: true, stockQuantity: 10 },
        ],
      }));
    }
  };

  // Add Custom Color Swatch
  const handleAddCustomColor = () => {
    if (!customColorName.trim()) {
      addToast('অনুগ্রহ করে কালারের একটি নাম লিখুন (যেমন: Royal Blue)', 'error');
      return;
    }
    const newColor: ColorSwatch = {
      name: customColorName.trim(),
      hex: customColorHex,
      inStock: true,
      stockQuantity: 10,
    };
    setProductForm((prev) => ({
      ...prev,
      colorSwatches: [
        ...prev.colorSwatches.filter((c) => c.name.toLowerCase() !== newColor.name.toLowerCase()),
        newColor,
      ],
    }));
    setCustomColorName('');
    addToast(`"${newColor.name}" কালার ভ্যারিয়েন্ট যুক্ত হয়েছে!`, 'success');
  };

  // Toggle Individual Color In-Stock / Unavailable Status
  const handleToggleColorStock = (colorName: string) => {
    setProductForm((prev) => ({
      ...prev,
      colorSwatches: prev.colorSwatches.map((c) => {
        if (c.name.toLowerCase() === colorName.toLowerCase()) {
          const newInStock = !(c.inStock !== false);
          return {
            ...c,
            inStock: newInStock,
            stockQuantity: newInStock && (!c.stockQuantity || c.stockQuantity <= 0) ? 10 : c.stockQuantity,
          };
        }
        return c;
      }),
    }));
  };

  // Update Individual Color Stock Quantity
  const handleUpdateColorQuantity = (colorName: string, quantity: number) => {
    const validQty = Math.max(0, quantity);
    setProductForm((prev) => ({
      ...prev,
      colorSwatches: prev.colorSwatches.map((c) => {
        if (c.name.toLowerCase() === colorName.toLowerCase()) {
          return {
            ...c,
            stockQuantity: validQty,
            inStock: validQty > 0 ? (c.inStock !== false) : false,
          };
        }
        return c;
      }),
    }));
  };

  // Remove Color Swatch
  const handleRemoveColor = (nameToRemove: string) => {
    setProductForm((prev) => ({
      ...prev,
      colorSwatches: prev.colorSwatches.filter((c) => c.name !== nameToRemove),
    }));
  };

  // Toggle Size
  const handleToggleSize = (size: string) => {
    const exists = productForm.sizes.includes(size);
    if (exists) {
      setProductForm((prev) => ({
        ...prev,
        sizes: prev.sizes.filter((s) => s !== size),
      }));
    } else {
      setProductForm((prev) => ({
        ...prev,
        sizes: [...prev.sizes, size],
      }));
    }
  };

  // Add Image via Direct URL
  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setProductForm((prev) => {
      const current = prev.images.filter((img) => img.trim().length > 0);
      return {
        ...prev,
        images: [...current, imageUrlInput.trim()],
      };
    });
    setImageUrlInput('');
    addToast('ছবির লিঙ্ক যুক্ত হয়েছে!', 'success');
  };

  // Client-Side Canvas Image Compression to prevent payload limits and optimize loading
  const compressImageFile = (file: File, maxWidth = 1200, quality = 0.82): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxWidth) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxWidth) / height);
              height = maxWidth;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(event.target?.result as string);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          try {
            resolve(canvas.toDataURL('image/jpeg', quality));
          } catch {
            resolve(event.target?.result as string);
          }
        };
        img.onerror = () => resolve(event.target?.result as string);
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  };

  const uploadSingleImage = async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
      const res = await fetch(`${apiUrl}/meherban/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.data?.url) {
        return data.data.url;
      }
    } catch {}

    // Fallback to client-side compressed base64
    return await compressImageFile(file);
  };

  // Multiple Product Images Upload Handler (Supports 1 or many photos)
  const handleMultipleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingImage(true);
    addToast(`${files.length}টি ছবি প্রসেস ও আপলোড হচ্ছে...`, 'info');

    try {
      const validFiles = Array.from(files).filter((file) => file.type.startsWith('image/'));
      if (validFiles.length === 0) {
        addToast('অনুগ্রহ করে শুধুমাত্র ছবি (JPG, PNG, WebP) ফাইল নির্বাচন করুন।', 'error');
        return;
      }

      const uploadedUrls: string[] = [];
      for (const file of validFiles) {
        const url = await uploadSingleImage(file);
        if (url) uploadedUrls.push(url);
      }

      setProductForm((prev) => {
        const currentValid = prev.images.filter((img) => img.trim().length > 0);
        return {
          ...prev,
          images: [...currentValid, ...uploadedUrls],
        };
      });

      addToast(`${uploadedUrls.length}টি ছবি সফলভাবে গ্যালারিতে যুক্ত হয়েছে!`, 'success');
    } catch {
      addToast('ছবি আপলোডে সমস্যা হয়েছে। আবার চেষ্টা করুন।', 'error');
    } finally {
      setIsUploadingImage(false);
      e.target.value = '';
    }
  };

  // Remove Image by Index
  const handleRemoveImage = (indexToRemove: number) => {
    setProductForm((prev) => {
      const filtered = prev.images.filter((_, idx) => idx !== indexToRemove);
      return {
        ...prev,
        images: filtered.length > 0 ? filtered : [''],
      };
    });
    addToast('ছবিটি সরানো হয়েছে।', 'info');
  };

  // Set as Cover / Primary Image
  const handleSetPrimaryImage = (indexToPrimary: number) => {
    setProductForm((prev) => {
      const target = prev.images[indexToPrimary];
      const rest = prev.images.filter((_, idx) => idx !== indexToPrimary);
      return {
        ...prev,
        images: [target, ...rest],
      };
    });
    addToast('মূল কভার ছবি হিসেবে সেট করা হয়েছে!', 'success');
  };

  const isAdminLoggedIn = authRole === 'ADMIN';

  // Handle Admin Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = adminLogin(passwordInput);
    if (!success) {
      setAuthError(true);
    } else {
      setAuthError(false);
      setPasswordInput('');
    }
  };

  // Open Modal for New Product
  const handleOpenAddModal = () => {
    setEditingProductId(null);
    setProductForm(initialFormState);
    setIsCustomCategory(false);
    setIsProductModalOpen(true);
  };

  // Open Modal for Edit Product
  const handleOpenEditModal = (p: MeherbanProduct) => {
    setEditingProductId(p.id);
    setIsCustomCategory(!availableCategories.includes(p.categoryName));
    setProductForm({
      title: p.title,
      subtitle: p.subtitle || '',
      description: p.description,
      price: String(p.price),
      originalPrice: p.originalPrice ? String(p.originalPrice) : '',
      categoryName: p.categoryName,
      sellerId: p.sellerId || 'seller-1',
      images: p.images.length > 0 ? p.images : [''],
      colorSwatches: p.colorSwatches.length > 0 ? p.colorSwatches.map((c) => ({
        name: c.name,
        hex: c.hex,
        inStock: c.inStock !== false,
        stockQuantity: c.stockQuantity !== undefined ? c.stockQuantity : 10,
      })) : [{ name: 'Black', hex: '#111111', inStock: true, stockQuantity: 15 }],
      sizes: p.sizes.length > 0 ? p.sizes : ['Standard'],
      inStock: p.inStock,
      stockQuantity: String(p.stockQuantity ?? 20),
      badge: p.badge || '',
      isTrending: p.isTrending,
      isFeatured: p.isFeatured,
    });
    setIsProductModalOpen(true);
  };

  // Save Add / Edit Product
  const handleProductFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.title.trim() || !productForm.price || !productForm.description.trim()) {
      addToast('অনুগ্রহ করে পণ্যের নাম, দাম এবং বিবরণ লিখুন।', 'error');
      return;
    }

    const selectedSeller = sellers.find((s) => s.id === productForm.sellerId) || sellers[0] || {
      id: 'seller-1',
      shopName: 'Meherban Apparel Store',
    };
    const cleanedImages = productForm.images.filter((img) => img.trim().length > 0);
    const finalImages = cleanedImages.length > 0 ? cleanedImages : [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    ];

    const cleanCat = (productForm.categoryName || 'Women').trim();
    const stdMatch = ['Men', 'Women', 'Unisex', 'Accessories', 'Clothing'].find(
      (s) => s.toLowerCase() === cleanCat.toLowerCase()
    );
    const finalCategoryName = stdMatch || cleanCat;

    if (editingProductId) {
      await updateProduct(editingProductId, {
        title: productForm.title,
        subtitle: productForm.subtitle,
        description: productForm.description,
        price: Number(productForm.price),
        originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : Number(productForm.price),
        categoryName: finalCategoryName,
        images: finalImages,
        colorSwatches: productForm.colorSwatches,
        sizes: productForm.sizes,
        inStock: productForm.inStock,
        stockQuantity: Number(productForm.stockQuantity) || 0,
        badge: productForm.badge || undefined,
        isTrending: productForm.isTrending,
        isFeatured: productForm.isFeatured,
        sellerId: selectedSeller.id,
        sellerName: selectedSeller.shopName,
      });
    } else {
      await addProduct({
        title: productForm.title,
        subtitle: productForm.subtitle,
        description: productForm.description,
        price: Number(productForm.price),
        originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : Number(productForm.price),
        categoryName: finalCategoryName,
        images: finalImages,
        colorSwatches: productForm.colorSwatches,
        sizes: productForm.sizes,
        inStock: productForm.inStock,
        stockQuantity: Number(productForm.stockQuantity) || 20,
        badge: productForm.badge || undefined,
        isTrending: productForm.isTrending,
        isFeatured: productForm.isFeatured,
        sellerId: selectedSeller.id,
        sellerName: selectedSeller.shopName,
      });
    }

    setIsProductModalOpen(false);
  };

  // Add New Seller Handler
  const handleAddSellerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellerForm.name.trim() || !sellerForm.shopName.trim() || !sellerForm.email.trim()) {
      addToast('অনুগ্রহ করে সেলারের নাম, শপের নাম এবং ইমেইল পূরণ করুন।', 'error');
      return;
    }

    addSeller({
      name: sellerForm.name,
      shopName: sellerForm.shopName,
      email: sellerForm.email,
      phone: sellerForm.phone || '01700-000000',
      isActive: true,
    });

    setIsAddSellerModalOpen(false);
    setSellerForm({
      name: '',
      shopName: '',
      email: '',
      phone: '',
      password: 'seller123',
      isActive: true,
    });
  };

  const handleConfirmDelete = async () => {
    if (deletingProduct) {
      await deleteProduct(deletingProduct.id);
      setDeletingProduct(null);
    }
  };

  // WhatsApp Customer
  const handleWhatsAppCustomer = (order: MeherbanOrder) => {
    const text = `হ্যালো ${order.customerName}! MEHERBAN সেন্ট্রাল সাপোর্ট থেকে যোগাযোগ করছি।\nআপনার অর্ডার #${order.orderNumber} (মোট ৳${order.totalAmount}) কনফার্ম করতে চাচ্ছি।\nঠিকানা: ${order.shippingAddress}, ${order.city}\nআমরা কি আপনার পার্সেলটি পাঠিয়ে দিব?`;
    const encoded = encodeURIComponent(text);
    const phoneDigits = order.customerPhone.replace(/[^\d]/g, '');
    const fullPhone = phoneDigits.startsWith('880') ? phoneDigits : `88${phoneDigits}`;
    window.open(`https://wa.me/${fullPhone}?text=${encoded}`, '_blank');
  };

  // Metrics
  const totalProductsCount = products.length;
  const inStockProductsCount = products.filter((p) => p.inStock && (p.stockQuantity === undefined || p.stockQuantity > 0)).length;
  const totalOrdersCount = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.orderStatus !== 'CANCELLED' ? o.totalAmount : 0), 0);
  const pendingOrdersCount = orders.filter((o) => o.orderStatus === 'PENDING').length;
  const totalSellersCount = sellers.length;
  const activeSellersCount = sellers.filter((s) => s.isActive).length;

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      productSearch.trim() === '' ||
      p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.categoryName.toLowerCase().includes(productSearch.toLowerCase());

    const matchesCategory =
      productCategoryFilter === 'ALL' ||
      p.categoryName.toUpperCase() === productCategoryFilter.toUpperCase();

    const isAvailable = p.inStock && (p.stockQuantity === undefined || p.stockQuantity > 0);
    const matchesStock =
      productStockFilter === 'ALL' ||
      (productStockFilter === 'IN_STOCK' && isAvailable) ||
      (productStockFilter === 'OUT_OF_STOCK' && !isAvailable);

    const matchesSeller =
      productSellerFilter === 'ALL' || p.sellerId === productSellerFilter;

    return matchesSearch && matchesCategory && matchesStock && matchesSeller;
  });

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const q = orderSearch.toLowerCase().trim();
    const matchesSearch =
      q === '' ||
      o.orderNumber.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.customerPhone.includes(q);

    const matchesStatus = orderStatusFilter === 'ALL' || o.orderStatus === orderStatusFilter;
    const matchesSeller = orderSellerFilter === 'ALL' || o.sellerId === orderSellerFilter;

    return matchesSearch && matchesStatus && matchesSeller;
  });

  // If Not Authenticated as Admin, show Admin Login Screen
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-[#F4F4F0] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-neutral-200/90 p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-neutral-950 text-white rounded-2xl mx-auto flex items-center justify-center shadow-md">
              <ShieldCheck className="w-7 h-7 text-amber-400" />
            </div>
            <h1 className="font-serif text-2xl font-bold uppercase tracking-wider text-neutral-950">
              SUPER ADMIN HUB
            </h1>
            <p className="text-xs text-neutral-500">
              সিস্টেম অ্যাডমিন পোর্টাল (সকল সেলার, ইনভেন্টরি ও কেন্দ্রীয় নিয়ন্ত্রণ)
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1.5">
                সুপার অ্যাডমিন পাসওয়ার্ড
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="পাসওয়ার্ড লিখুন"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setAuthError(false);
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:border-black outline-none bg-white text-sm text-neutral-900 font-sans"
                />
                <Lock className="w-4 h-4 text-neutral-400 absolute right-3.5 top-3.5" />
              </div>
              {authError && (
                <p className="text-rose-600 text-[11px] mt-1.5 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> ভুল পাসওয়ার্ড! সঠিক পাসওয়ার্ড দিয়ে আবার চেষ্টা করুন।
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-neutral-950 hover:bg-black text-white text-xs uppercase tracking-widest font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>লগইন করুন (Enter Super Admin)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
            <Link href="/" className="hover:text-black transition-colors">
              &larr; লাইভ শপ
            </Link>
            <span className="font-mono text-[10px] text-neutral-400">MEHERBAN ROOT</span>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Super Admin Dashboard
  return (
    <div className="min-h-screen bg-[#F6F6F2] text-neutral-900">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-neutral-950 text-white border-b border-neutral-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-serif text-lg tracking-widest font-bold uppercase block leading-none">
                  MEHERBAN
                </span>
                <span className="text-[10px] tracking-wider text-amber-400 uppercase font-mono">
                  Super Admin Console · Platform Owner
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <Link
                href="/seller"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 transition-colors border border-emerald-500/30"
                title="Switch to Seller Dashboard"
              >
                <Store className="w-3.5 h-3.5" />
                <span>সেলার প্যানেল</span>
              </Link>

              <Link
                href="/"
                target="_blank"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-neutral-200 transition-colors"
                title="Open live customer storefront"
              >
                <span>লাইভ শপ</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">লগআউট</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-xs">
            <div className="flex items-center justify-between text-neutral-500 mb-1">
              <span className="text-xs font-medium">নিবন্ধিত সেলার</span>
              <Users className="w-4 h-4 text-neutral-700" />
            </div>
            <div className="text-2xl font-bold font-mono text-neutral-950">{totalSellersCount}</div>
            <div className="text-[11px] text-emerald-600 mt-0.5">{activeSellersCount} টি সক্রিয় শপ</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-xs">
            <div className="flex items-center justify-between text-neutral-500 mb-1">
              <span className="text-xs font-medium">প্ল্যাটফর্মের মোট পণ্য</span>
              <Package className="w-4 h-4 text-neutral-700" />
            </div>
            <div className="text-2xl font-bold font-mono text-neutral-950">{totalProductsCount}</div>
            <div className="text-[11px] text-neutral-500 mt-0.5">{inStockProductsCount} টি স্টকে আছে</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-xs">
            <div className="flex items-center justify-between text-neutral-500 mb-1">
              <span className="text-xs font-medium">মোট অর্ডার</span>
              <ShoppingBag className="w-4 h-4 text-neutral-700" />
            </div>
            <div className="text-2xl font-bold font-mono text-neutral-950">{totalOrdersCount}</div>
            <div className="text-[11px] text-neutral-500 mt-0.5">সব সেলার মিলিয়ে</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-xs">
            <div className="flex items-center justify-between text-neutral-500 mb-1">
              <span className="text-xs font-medium text-amber-700">পেন্ডিং অর্ডার</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-bold font-mono text-amber-800">{pendingOrdersCount}</div>
            <div className="text-[11px] text-amber-700 mt-0.5">অ্যাকশন প্রয়োজন</div>
          </div>

          <div className="col-span-2 lg:col-span-1 bg-white p-4 rounded-xl border border-neutral-200/80 shadow-xs">
            <div className="flex items-center justify-between text-neutral-500 mb-1">
              <span className="text-xs font-medium text-neutral-700">প্ল্যাটফর্ম রেভিনিউ</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold font-sans text-neutral-950">৳ {totalRevenue.toLocaleString()}</div>
            <div className="text-[11px] text-neutral-500 mt-0.5">মোট জিএমভি (GMV)</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-neutral-300 pb-2 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'products'
                ? 'bg-neutral-950 text-white shadow-md'
                : 'bg-white text-neutral-600 hover:text-black border border-neutral-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>সকল পণ্য ও স্টক ({products.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap relative ${
              activeTab === 'orders'
                ? 'bg-neutral-950 text-white shadow-md'
                : 'bg-white text-neutral-600 hover:text-black border border-neutral-200'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>সকল অর্ডার ({orders.length})</span>
            {pendingOrdersCount > 0 && (
              <span className="w-5 h-5 bg-amber-500 text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                {pendingOrdersCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sellers')}
            className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'sellers'
                ? 'bg-neutral-950 text-white shadow-md'
                : 'bg-white text-neutral-600 hover:text-black border border-neutral-200'
            }`}
          >
            <Store className="w-4 h-4 text-amber-500" />
            <span>নিযুক্ত মার্চেন্ট প্রোফাইল</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('boost')}
            className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'boost'
                ? 'bg-neutral-950 text-white shadow-md'
                : 'bg-white text-neutral-600 hover:text-black border border-neutral-200'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>বুস্টিং ও প্ল্যাটফর্ম সেটিংস</span>
          </button>
        </div>

        {/* TAB 1: DESIGNATED SINGLE SELLER */}
        {activeTab === 'sellers' && (
          <div className="space-y-4">
            <div className="bg-amber-50 p-4 rounded-xl border border-amber-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-full">
                  SINGLE MERCHANT STORE MODEL
                </span>
                <h3 className="font-bold text-sm text-neutral-900 mt-1">
                  MEHERBAN একমাত্র মার্চেন্ট অ্যাকাউন্ট
                </h3>
                <p className="text-xs text-neutral-600 mt-0.5">
                  এই স্টোরে কোনো অতিরিক্ত সেলার থাকবে না। সমস্ত প্রোডাক্ট ক্যাটালগ ও ফ্রন্টপেজ মিডিয়া এই একমাত্র সেলার পোর্টাল থেকে পরিচালিত হয়।
                </p>
              </div>

              <Link
                href="/seller"
                className="py-2 px-3.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-1.5 shrink-0"
              >
                <Store className="w-4 h-4" />
                <span>সেলার পোর্টালে প্রবেশ করুন</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sellers.map((seller) => {
                const sellerProductCount = products.filter((p) => p.sellerId === seller.id).length;
                const sellerOrderCount = orders.filter((o) => o.sellerId === seller.id).length;

                return (
                  <div
                    key={seller.id}
                    className="bg-white rounded-xl border border-neutral-200/90 shadow-xs p-5 space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-base text-neutral-950 font-serif">
                          {seller.shopName}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            seller.isActive
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {seller.isActive ? 'Active' : 'Suspended'}
                        </span>
                      </div>

                      <div className="space-y-1 text-xs text-neutral-600">
                        <div className="flex items-center gap-2">
                          <Users className="w-3.5 h-3.5 text-neutral-400" />
                          <span>মালিক: <strong className="text-neutral-900">{seller.name}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-neutral-400" />
                          <span>{seller.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-neutral-400" />
                          <span>{seller.phone}</span>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-neutral-100 grid grid-cols-2 gap-2 text-center text-xs">
                        <div className="bg-neutral-50 p-2 rounded-lg">
                          <span className="text-[10px] text-neutral-500 block">মোট পণ্য</span>
                          <span className="font-bold text-neutral-950 font-mono">{sellerProductCount}</span>
                        </div>
                        <div className="bg-neutral-50 p-2 rounded-lg">
                          <span className="text-[10px] text-neutral-500 block">মোট অর্ডার</span>
                          <span className="font-bold text-neutral-950 font-mono">{sellerOrderCount}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleSellerStatus(seller.id)}
                        className={`w-full py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                          seller.isActive
                            ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {seller.isActive ? (
                          <>
                            <UserX className="w-3.5 h-3.5" />
                            <span>অ্যাকাউন্ট স্থগিত করুন (Suspend)</span>
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>পুনরায় সক্রিয় করুন (Activate)</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: ALL PRODUCTS WITH SELLER BADGES */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="flex flex-1 items-center gap-2 flex-wrap">
                <div className="relative flex-1 min-w-[200px] max-w-sm">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="পণ্য খুঁজুন..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-neutral-300 focus:border-black outline-none bg-neutral-50"
                  />
                </div>

                <select
                  value={productSellerFilter}
                  onChange={(e) => setProductSellerFilter(e.target.value)}
                  className="px-3 py-2 text-xs rounded-lg border border-neutral-300 focus:border-black outline-none bg-white font-medium"
                >
                  <option value="ALL">সকল সেলারের পণ্য</option>
                  {sellers.map((s) => (
                    <option key={s.id} value={s.id}>{s.shopName}</option>
                  ))}
                </select>

                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="px-3 py-2 text-xs rounded-lg border border-neutral-300 focus:border-black outline-none bg-white font-medium"
                >
                  <option value="ALL">সকল ক্যাটাগরি ({products.length})</option>
                  {availableCategories.map((cat) => {
                    const count = products.filter(
                      (p) => p.categoryName.toLowerCase() === cat.toLowerCase()
                    ).length;
                    return (
                      <option key={cat} value={cat}>
                        {cat} ({count})
                      </option>
                    );
                  })}
                </select>

                <select
                  value={productStockFilter}
                  onChange={(e) => setProductStockFilter(e.target.value as any)}
                  className="px-3 py-2 text-xs rounded-lg border border-neutral-300 focus:border-black outline-none bg-white font-medium"
                >
                  <option value="ALL">সকল স্টক স্ট্যাটাস</option>
                  <option value="IN_STOCK">✅ স্টকে আছে</option>
                  <option value="OUT_OF_STOCK">❌ স্টক শেষ (Unavailable)</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleOpenAddModal}
                className="py-2.5 px-4 bg-neutral-950 hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md transition-all flex items-center justify-center gap-2 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>নতুন পণ্য যোগ করুন</span>
              </button>
            </div>

            <div className="bg-white rounded-xl border border-neutral-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-neutral-100/80 text-neutral-600 font-semibold uppercase text-[10px] tracking-wider border-b border-neutral-200">
                      <th className="p-3.5">পণ্য</th>
                      <th className="p-3.5">সেলার / শপ</th>
                      <th className="p-3.5">মূল্য</th>
                      <th className="p-3.5 text-center">স্টক সুইচ</th>
                      <th className="p-3.5 text-center">পরিমাণ</th>
                      <th className="p-3.5 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200/70">
                    {filteredProducts.map((p) => {
                      const isAvailable = p.inStock && (p.stockQuantity === undefined || p.stockQuantity > 0);
                      return (
                        <tr key={p.id} className="hover:bg-neutral-50/80 transition-colors">
                          <td className="p-3.5">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.images[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'}
                                alt={p.title}
                                className={`w-12 h-12 object-cover rounded-lg border border-neutral-200 bg-neutral-100 shrink-0 ${
                                  !isAvailable ? 'grayscale-40 opacity-70' : ''
                                }`}
                              />
                              <div>
                                <span className="font-bold text-neutral-950 text-sm">{p.title}</span>
                                <p className="text-[11px] text-neutral-500 line-clamp-1">{p.subtitle || p.description}</p>
                              </div>
                            </div>
                          </td>

                          <td className="p-3.5">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-medium text-[11px] border border-emerald-200">
                              <Store className="w-3 h-3 text-emerald-600" />
                              <span>{p.sellerName || 'Meherban Store'}</span>
                            </span>
                          </td>

                          <td className="p-3.5 font-bold font-sans text-sm text-neutral-950">
                            ৳ {p.price.toLocaleString()}
                          </td>

                          <td className="p-3.5 text-center">
                            <button
                              type="button"
                              onClick={() => toggleProductAvailability(p.id)}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs ${
                                isAvailable
                                  ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300'
                                  : 'bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-300'
                              }`}
                            >
                              <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                              <span>{isAvailable ? 'In Stock' : 'Unavailable'}</span>
                            </button>
                          </td>

                          <td className="p-3.5 text-center">
                            <div className="inline-flex items-center border border-neutral-300 rounded-lg overflow-hidden bg-white shadow-xs">
                              <button
                                type="button"
                                onClick={() => updateProductStockQuantity(p.id, Math.max(0, (p.stockQuantity ?? 20) - 1))}
                                className="px-2 py-1 bg-neutral-50 hover:bg-neutral-200 text-neutral-700 font-bold"
                              >
                                -
                              </button>
                              <span className="px-3 py-1 text-xs font-bold font-mono text-neutral-900">
                                {p.stockQuantity ?? 20}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateProductStockQuantity(p.id, (p.stockQuantity ?? 20) + 1)}
                                className="px-2 py-1 bg-neutral-50 hover:bg-neutral-200 text-neutral-700 font-bold"
                              >
                                +
                              </button>
                            </div>
                          </td>

                          <td className="p-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenEditModal(p)}
                                className="p-1.5 rounded-lg border border-neutral-200 hover:border-black text-neutral-700 hover:text-black"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeletingProduct(p)}
                                className="p-1.5 rounded-lg border border-rose-200 hover:border-rose-400 bg-rose-50 text-rose-600 hover:text-rose-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ALL ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="flex flex-1 items-center gap-2 flex-wrap">
                <div className="relative flex-1 min-w-[200px] max-w-sm">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="অর্ডার আইডি বা ফোন বা নাম দিয়ে খুঁজুন..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-neutral-300 focus:border-black outline-none bg-neutral-50"
                  />
                </div>

                <select
                  value={orderSellerFilter}
                  onChange={(e) => setOrderSellerFilter(e.target.value)}
                  className="px-3 py-2 text-xs rounded-lg border border-neutral-300 focus:border-black outline-none bg-white font-medium"
                >
                  <option value="ALL">সকল সেলারের অর্ডার</option>
                  {sellers.map((s) => (
                    <option key={s.id} value={s.id}>{s.shopName}</option>
                  ))}
                </select>

                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="px-3 py-2 text-xs rounded-lg border border-neutral-300 focus:border-black outline-none bg-white font-medium"
                >
                  <option value="ALL">সকল স্ট্যাটাস</option>
                  <option value="PENDING">🕒 Pending</option>
                  <option value="CONFIRMED">✅ Confirmed</option>
                  <option value="SHIPPED">🚚 Shipped</option>
                  <option value="DELIVERED">🎉 Delivered</option>
                  <option value="CANCELLED">❌ Cancelled</option>
                </select>
              </div>

              <div className="text-xs text-neutral-500 font-medium">
                অর্ডার সংখ্যা: <strong className="text-black">{filteredOrders.length}</strong>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {filteredOrders.map((ord) => {
                const sellerInfo = sellers.find((s) => s.id === ord.sellerId);

                return (
                  <div
                    key={ord.id}
                    className="bg-white rounded-xl border border-neutral-200/90 shadow-sm p-4 sm:p-5 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-base text-neutral-950">
                          #{ord.orderNumber}
                        </span>
                        <span className="text-[11px] text-neutral-500">
                          {new Date(ord.createdAt).toLocaleString('bn-BD', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-medium text-[11px] border border-emerald-200">
                          {sellerInfo?.shopName || 'Meherban Store'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-neutral-500 font-medium">স্ট্যাটাস:</span>
                        <select
                          value={ord.orderStatus}
                          onChange={(e) => updateOrderStatus(ord.orderNumber, e.target.value as any)}
                          className="text-xs font-bold px-3 py-1.5 rounded-lg border outline-none bg-white cursor-pointer"
                        >
                          <option value="PENDING">🕒 Pending</option>
                          <option value="CONFIRMED">✅ Confirmed</option>
                          <option value="PROCESSING">⚙️ Processing</option>
                          <option value="SHIPPED">🚚 Shipped</option>
                          <option value="DELIVERED">🎉 Delivered</option>
                          <option value="CANCELLED">❌ Cancelled</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1.5 bg-[#FAF9F6] p-3.5 rounded-xl border border-neutral-200/60">
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-500">গ্রাহক:</span>
                          <span className="font-bold text-neutral-900 text-sm">{ord.customerName}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-500">ফোন:</span>
                          <span className="font-bold font-mono text-neutral-900 text-sm">{ord.customerPhone}</span>
                        </div>
                        <div className="flex items-start justify-between">
                          <span className="text-neutral-500 shrink-0">ঠিকানা:</span>
                          <span className="text-neutral-800 text-right font-medium max-w-[260px]">
                            {ord.shippingAddress}, {ord.city}
                          </span>
                        </div>

                        <div className="pt-2 flex items-center gap-2">
                          <a
                            href={`tel:${ord.customerPhone}`}
                            className="flex-1 py-2 px-3 bg-neutral-900 hover:bg-black text-white rounded-lg text-center font-bold flex items-center justify-center gap-1.5"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>কল করুন</span>
                          </a>
                          <button
                            type="button"
                            onClick={() => handleWhatsAppCustomer(ord)}
                            className="flex-1 py-2 px-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg text-center font-bold flex items-center justify-center gap-1.5"
                          >
                            <MessageCircle className="w-3.5 h-3.5 fill-white" />
                            <span>WhatsApp</span>
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2 bg-[#FAF9F6] p-3.5 rounded-xl border border-neutral-200/60">
                        <span className="text-neutral-500 font-bold uppercase text-[10px] tracking-wider block">
                          অর্ডারকৃত পণ্য ({ord.items.length})
                        </span>
                        <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                          {ord.items.map((it, idx) => (
                            <div key={idx} className="flex items-center gap-2.5">
                              <img
                                src={it.imageUrl || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'}
                                alt={it.title}
                                className="w-9 h-9 object-cover rounded-md border border-neutral-200 shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-neutral-900 truncate">{it.title}</p>
                                <p className="text-[10px] text-neutral-500">
                                  Size: {it.selectedSize || 'Standard'} · Color: {it.selectedColor || 'Standard'} · Qty: {it.quantity}
                                </p>
                              </div>
                              <span className="font-bold font-sans text-neutral-900">
                                ৳ {(it.price * it.quantity).toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="pt-2 border-t border-neutral-200 flex justify-between items-center text-xs">
                          <span className="text-neutral-600">ডেলিভারি: ৳{ord.shippingFee}</span>
                          <span className="font-bold text-sm text-neutral-950 font-sans">
                            মোট: ৳ {ord.totalAmount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: PLATFORM BOOST SETTINGS */}
        {activeTab === 'boost' && (
          <div className="bg-white p-6 sm:p-8 rounded-xl border border-neutral-200/80 shadow-xs space-y-6">
            <div className="border-b border-neutral-100 pb-4">
              <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-mono">
                PLATFORM CONFIGURATION
              </span>
              <h2 className="font-serif text-2xl font-bold uppercase text-neutral-950 mt-0.5">
                সুপার অ্যাডমিন প্ল্যাটফর্ম সেটিংস
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
                <h3 className="font-bold text-amber-950 text-sm flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  সেলার একাউন্ট ও পারমিশন কন্ট্রোল
                </h3>
                <p className="text-amber-900/90 leading-relaxed">
                  সুপার অ্যাডমিন হিসেবে আপনি যেকোনো নতুন সেলার যুক্ত করতে পারবেন এবং প্রয়োজনে যেকোনো সেলারের শপ ১-ক্লিকে স্থগিত (Suspend) করতে পারবেন।
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                <h3 className="font-bold text-emerald-950 text-sm flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  ডেলিভারি চার্জ পলিসি
                </h3>
                <p className="text-emerald-900/90 leading-relaxed">
                  ঢাকার ভেতরে ৳৬০, ঢাকার বাইরে ৳১২০ এবং ৳১৯৯৯-এর বেশি অর্ডারে ফ্রি ডেলিভারি চালু আছে। এটি সব সেলারের পণ্যে স্বয়ংক্রিয়ভাবে প্রযোজ্য।
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ADD SELLER MODAL */}
      {isAddSellerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            onClick={() => setIsAddSellerModalOpen(false)}
          />

          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 z-10 border border-neutral-200 space-y-4 animate-fade-in text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-serif text-lg font-bold uppercase text-neutral-950">
                নতুন সেলার নিবন্ধন করুন
              </h3>
              <button
                type="button"
                onClick={() => setIsAddSellerModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-black"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSellerSubmit} className="space-y-3">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  শপের নাম (Shop Name) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: Urban Streetwear BD"
                  value={sellerForm.shopName}
                  onChange={(e) => setSellerForm({ ...sellerForm, shopName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:border-black outline-none bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  সেলার মালিকের নাম <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: তারিকুল ইসলাম"
                  value={sellerForm.name}
                  onChange={(e) => setSellerForm({ ...sellerForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:border-black outline-none bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  লগইন ইমেইল <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="seller@example.com"
                  value={sellerForm.email}
                  onChange={(e) => setSellerForm({ ...sellerForm, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:border-black outline-none bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  মোবাইল নম্বর
                </label>
                <input
                  type="tel"
                  placeholder="01712-000000"
                  value={sellerForm.phone}
                  onChange={(e) => setSellerForm({ ...sellerForm, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:border-black outline-none bg-white"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddSellerModalOpen(false)}
                  className="flex-1 py-2.5 rounded-lg border border-neutral-300 font-semibold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-neutral-950 text-white rounded-lg font-bold"
                >
                  সেলার যুক্ত করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD / EDIT PRODUCT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            onClick={() => setIsProductModalOpen(false)}
          />

          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10 border border-neutral-200 animate-fade-in max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50 shrink-0">
              <h3 className="font-serif text-lg font-bold uppercase text-neutral-900">
                {editingProductId ? 'পণ্য এডিট করুন' : 'নতুন পণ্য যোগ করুন'}
              </h3>
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-black rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProductFormSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    পণ্যের নাম <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.title}
                    onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 focus:border-black outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    সেলার নির্বাচন করুন <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={productForm.sellerId}
                    onChange={(e) => setProductForm({ ...productForm, sellerId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 focus:border-black outline-none bg-white font-medium"
                  >
                    {sellers.map((s) => (
                      <option key={s.id} value={s.id}>{s.shopName} ({s.name})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    বিক্রয় মূল্য ৳ <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:border-black outline-none bg-white font-sans"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    আসল মূল্য ৳
                  </label>
                  <input
                    type="number"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:border-black outline-none bg-white font-sans"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    স্টক সংখ্যা
                  </label>
                  <input
                    type="number"
                    value={productForm.stockQuantity}
                    onChange={(e) => setProductForm({ ...productForm, stockQuantity: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:border-black outline-none bg-white font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-semibold text-neutral-700">ক্যাটাগরি</label>
                    <button
                      type="button"
                      onClick={() => setIsCustomCategory(!isCustomCategory)}
                      className="text-[10px] text-amber-700 hover:text-black font-semibold underline"
                    >
                      {isCustomCategory ? 'লিস্ট থেকে বাছুন' : '+ নতুন ক্যাটাগরি'}
                    </button>
                  </div>

                  {isCustomCategory ? (
                    <input
                      type="text"
                      placeholder="নতুন ক্যাটাগরির নাম (যেমন: Panjabi)"
                      value={productForm.categoryName}
                      onChange={(e) => setProductForm({ ...productForm, categoryName: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-amber-500 focus:border-black outline-none bg-white font-medium text-neutral-900"
                    />
                  ) : (
                    <select
                      value={productForm.categoryName}
                      onChange={(e) => {
                        if (e.target.value === '__NEW__') {
                          setIsCustomCategory(true);
                          setProductForm({ ...productForm, categoryName: '' });
                        } else {
                          setProductForm({ ...productForm, categoryName: e.target.value });
                        }
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:border-black outline-none bg-white font-medium text-neutral-900"
                    >
                      {availableCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                      <option value="__NEW__">+ নতুন ক্যাটাগরি লিখুন...</option>
                    </select>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">স্টক স্ট্যাটাস</label>
                  <button
                    type="button"
                    onClick={() => setProductForm({ ...productForm, inStock: !productForm.inStock })}
                    className={`w-full py-2 rounded-lg font-bold text-xs transition-colors ${
                      productForm.inStock
                        ? 'bg-emerald-600 text-white'
                        : 'bg-rose-600 text-white'
                    }`}
                  >
                    {productForm.inStock ? 'In Stock (স্টকে আছে)' : 'Unavailable (স্টক শেষ)'}
                  </button>
                </div>
              </div>

              {/* Product Multi-Image Upload & Gallery (একাধিক ছবি আপলোড) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block font-semibold text-neutral-800 text-xs">
                      পণ্যের ছবিসমূহ (Gallery - একাধিক ছবি যোগ করতে পারবেন) <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[11px] text-neutral-500">
                      প্রথম ছবিটি কভার ছবি হিসেবে প্রদর্শিত হবে।
                    </span>
                  </div>
                  <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-medium">
                    {productForm.images.filter((img) => img.trim().length > 0).length}টি ছবি যুক্ত আছে
                  </span>
                </div>

                {/* Uploaded Gallery Grid */}
                {productForm.images.filter((img) => img.trim().length > 0).length > 0 ? (
                  <div className="space-y-2.5">
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                      {productForm.images
                        .filter((img) => img.trim().length > 0)
                        .map((imgUrl, idx) => (
                          <div
                            key={idx}
                            className={`relative group aspect-square rounded-xl overflow-hidden border-2 bg-neutral-100 transition-all ${
                              idx === 0 ? 'border-amber-500 shadow-xs' : 'border-neutral-200'
                            }`}
                          >
                            <img
                              src={imgUrl}
                              alt={`Product image ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />

                            {/* Cover Badge */}
                            {idx === 0 ? (
                              <span className="absolute top-1.5 left-1.5 bg-amber-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs select-none">
                                কভার ছবি (Cover)
                              </span>
                            ) : null}

                            {/* Hover Actions Overlay */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1">
                              {idx !== 0 && (
                                <button
                                  type="button"
                                  onClick={() => handleSetPrimaryImage(idx)}
                                  className="w-full py-1 bg-white hover:bg-neutral-100 text-neutral-900 rounded text-[10px] font-bold shadow-xs transition-colors"
                                >
                                  কভার বানান
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(idx)}
                                className="w-full py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-[10px] font-bold flex items-center justify-center gap-1 shadow-xs transition-colors"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>মুছুন</span>
                              </button>
                            </div>
                          </div>
                        ))}

                      {/* Add More Photos Upload Tile */}
                      <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-neutral-300 hover:border-amber-500 bg-neutral-50/70 hover:bg-amber-50/40 rounded-xl cursor-pointer transition-all p-2 text-center group">
                        {isUploadingImage ? (
                          <Loader2 className="w-5 h-5 animate-spin text-amber-600" />
                        ) : (
                          <>
                            <div className="w-8 h-8 rounded-full bg-neutral-200 group-hover:bg-amber-200 flex items-center justify-center text-neutral-700 group-hover:text-amber-800 transition-colors mb-1">
                              <Plus className="w-4 h-4 stroke-[2.5]" />
                            </div>
                            <span className="text-[10px] font-bold text-neutral-800">
                              + আরো ছবি দিন
                            </span>
                            <span className="text-[8px] text-neutral-500">
                              একাধিক নির্বাচনযোগ্য
                            </span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          disabled={isUploadingImage}
                          onChange={handleMultipleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                ) : (
                  /* Empty State: Big Multi-Image Upload Box */
                  <label className="relative flex flex-col items-center justify-center p-6 sm:p-8 border-2 border-dashed border-neutral-300 hover:border-amber-500 bg-neutral-50/70 hover:bg-amber-50/30 rounded-xl cursor-pointer transition-all group text-center">
                    {isUploadingImage ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-7 h-7 animate-spin text-amber-600" />
                        <span className="text-xs font-semibold text-neutral-700">ডিভাইস থেকে ছবি আপলোড হচ্ছে...</span>
                      </div>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-full bg-neutral-200/80 group-hover:bg-amber-100 flex items-center justify-center text-neutral-700 group-hover:text-amber-700 transition-colors mb-2.5">
                          <Upload className="w-6 h-6 stroke-[1.8]" />
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-neutral-800 group-hover:text-amber-950">
                          মোবাইল গ্যালারি বা ল্যাপটপ থেকে ছবি সিলেক্ট করুন
                        </span>
                        <span className="text-[10px] text-neutral-500 mt-1">
                          একসাথে একাধিক ছবি নির্বাচন করতে পারেন (JPG, PNG, WebP)
                        </span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      disabled={isUploadingImage}
                      onChange={handleMultipleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}

                {/* Optional Direct Image URL Input */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="url"
                    placeholder="অথবা ছবির অনলাইন লিঙ্ক (URL) পেস্ট করুন..."
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-neutral-300 focus:border-black outline-none bg-white text-neutral-900"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-900 text-white text-xs font-semibold rounded-lg shrink-0 transition-colors"
                  >
                    লিঙ্ক যোগ করুন
                  </button>
                </div>
              </div>

              {/* Color Variants & Per-Color Stock Section (কালার ভ্যারিয়েন্ট ও স্টক ব্যবস্থাপনা) */}
              <div className="p-3.5 bg-neutral-50/90 rounded-xl border border-neutral-200 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block font-semibold text-neutral-900 text-xs">
                      কালার ভ্যারিয়েন্ট ও স্টক সংখ্যা (Color Variants & Stock) <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[11px] text-neutral-500">
                      কোন কালার স্টকে আছে বা শেষ এবং কয়টা আছে তা আলাদাভাবে নির্ধারণ করুন।
                    </span>
                  </div>
                  <span className="text-[10px] text-neutral-600 bg-neutral-200/70 px-2 py-0.5 rounded-full font-mono">
                    {productForm.colorSwatches.length}টি কালার যুক্ত
                  </span>
                </div>

                {/* Per-Color Stock & Status Manager Card List */}
                <div className="space-y-2">
                  {productForm.colorSwatches.length === 0 ? (
                    <div className="p-3.5 bg-white rounded-xl border border-dashed border-neutral-300 text-center text-xs text-neutral-400">
                      কোনো কালার সিলেক্ট করা হয়নি। নিচের প্যালেট থেকে সিলেক্ট করুন অথবা কাস্টম কালার যোগ করুন।
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {productForm.colorSwatches.map((color) => {
                        const isInStock = color.inStock !== false;
                        const qty = color.stockQuantity !== undefined ? color.stockQuantity : 10;
                        return (
                          <div
                            key={color.name}
                            className={`p-2.5 rounded-xl border flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5 transition-all ${
                              isInStock
                                ? 'bg-white border-neutral-200 shadow-2xs'
                                : 'bg-rose-50/40 border-rose-200/80'
                            }`}
                          >
                            {/* Color Dot & Name */}
                            <div className="flex items-center gap-2.5 min-w-[130px]">
                              <span
                                className="w-5 h-5 rounded-full border border-neutral-300 shadow-xs shrink-0"
                                style={{ backgroundColor: color.hex }}
                              />
                              <div>
                                <span className="font-bold text-neutral-900 text-xs block leading-tight">
                                  {color.name}
                                </span>
                                <span className="text-[10px] font-mono text-neutral-400">
                                  {color.hex}
                                </span>
                              </div>
                            </div>

                            {/* In Stock / Unavailable Toggle Button */}
                            <button
                              type="button"
                              onClick={() => handleToggleColorStock(color.name)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 shadow-2xs ${
                                isInStock
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                                  : 'bg-rose-100 text-rose-800 border border-rose-300 hover:bg-rose-200'
                              }`}
                              title="ক্লিক করে স্ট্যাটাস পরিবর্তন করুন"
                            >
                              <span className={`w-2 h-2 rounded-full ${isInStock ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                              <span>{isInStock ? 'স্টকে আছে' : 'স্টক শেষ (Unavailable)'}</span>
                            </button>

                            {/* Color Stock Quantity */}
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="text-[11px] font-semibold text-neutral-600">কয়টা আছে:</span>
                              <input
                                type="number"
                                min="0"
                                value={qty}
                                onChange={(e) =>
                                  handleUpdateColorQuantity(color.name, parseInt(e.target.value) || 0)
                                }
                                className="w-16 px-2 py-1 text-center font-bold text-xs rounded-lg border border-neutral-300 focus:border-black outline-none bg-white text-neutral-900"
                              />
                              <span className="text-[11px] text-neutral-500">টি</span>
                            </div>

                            {/* Remove Color */}
                            <button
                              type="button"
                              onClick={() => handleRemoveColor(color.name)}
                              className="p-1.5 text-neutral-400 hover:text-rose-600 rounded-lg hover:bg-neutral-100 transition-colors shrink-0"
                              title="কালারটি সরান"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Preset Fashion Color Swatches Palette */}
                <div className="space-y-1.5 pt-2 border-t border-neutral-200/70">
                  <span className="text-[11px] font-semibold text-neutral-700 block">
                    জনপ্রিয় কালার প্যালেট (১-ক্লিকে যোগ বা রিমুভ করুন):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {POPULAR_COLORS.map((col) => {
                      const isSelected = productForm.colorSwatches.some(
                        (c) => c.name.toLowerCase() === col.name.toLowerCase()
                      );
                      return (
                        <button
                          key={col.name}
                          type="button"
                          onClick={() => handleToggleColorPreset(col)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs transition-all ${
                            isSelected
                              ? 'bg-neutral-900 text-white font-bold ring-1 ring-neutral-900 shadow-2xs'
                              : 'bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200'
                          }`}
                        >
                          <span
                            className="w-3 h-3 rounded-full border border-neutral-300 shadow-2xs"
                            style={{ backgroundColor: col.hex }}
                          />
                          <span>{col.name}</span>
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Color Creator */}
                <div className="pt-2 border-t border-neutral-200/70 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-semibold text-neutral-700">কাস্টম কালার:</span>
                  <input
                    type="color"
                    value={customColorHex}
                    onChange={(e) => setCustomColorHex(e.target.value)}
                    className="w-7 h-7 rounded border border-neutral-300 cursor-pointer p-0.5 bg-white"
                    title="কালার কোড বাছুন"
                  />
                  <input
                    type="text"
                    placeholder="কালারের নাম (যেমন: Royal Blue)"
                    value={customColorName}
                    onChange={(e) => setCustomColorName(e.target.value)}
                    className="px-2.5 py-1 text-xs rounded-lg border border-neutral-300 focus:border-black outline-none bg-white text-neutral-900 w-44"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomColor}
                    className="px-3 py-1 bg-neutral-900 hover:bg-black text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors"
                  >
                    + কালার যুক্ত করুন
                  </button>
                </div>
              </div>

              {/* Size Variants Section (সাইজ অপশন) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block font-semibold text-neutral-700 text-xs">
                    সাইজ অপশন (Sizes)
                  </label>
                  <span className="text-[10px] text-neutral-500 font-mono">
                    {productForm.sizes.join(', ') || 'None'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {STANDARD_SIZES.map((sz) => {
                    const isSelected = productForm.sizes.includes(sz);
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => handleToggleSize(sz)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-neutral-900 text-white shadow-2xs'
                            : 'bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-300'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  পণ্যের বিবরণ <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg border border-neutral-300 focus:border-black outline-none bg-white text-xs resize-none"
                />
              </div>

              <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2.5 rounded-lg border border-neutral-300 font-semibold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-neutral-950 text-white rounded-lg font-bold"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setDeletingProduct(null)}
          />
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 z-10 border border-neutral-200 text-center space-y-4 animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-neutral-950">
                পণ্যটি ডিলিট করতে চান?
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                &quot;{deletingProduct.title}&quot; মুছে ফেলা হবে।
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingProduct(null)}
                className="flex-1 py-2.5 rounded-lg border border-neutral-300 text-neutral-700 text-xs font-semibold"
              >
                না
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
              >
                হ্যাঁ, ডিলিট করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
