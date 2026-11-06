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
  Store,
  Zap,
  Truck,
  Copy,
  Printer,
  X,
  Mail,
  Eye,
  Upload,
  Image as ImageIcon,
  Loader2,
  Sparkles,
  Sliders,
  RefreshCw,
  Layers,
  Download,
} from 'lucide-react';
import { useMeherban } from '@/context/MeherbanContext';
import { MeherbanProduct, MeherbanOrder } from '@/types/meherban';

export default function SellerPage() {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductAvailability,
    updateProductStockQuantity,
    orders,
    updateOrderStatus,
    authRole,
    currentSeller,
    sellerLogin,
    logout,
    addToast,
    heroSlides,
    promoBanners,
    categories,
    instagramPosts,
    updateHeroSlide,
    updatePromoBanner,
    updateCategory,
    updateInstagramPost,
    resetFrontpageMedia,
  } = useMeherban();

  // Seller Login State
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);

  // Active Tab: 'products' | 'frontpage' | 'orders' | 'boost'
  const [activeTab, setActiveTab] = useState<'products' | 'frontpage' | 'orders' | 'boost'>('products');
  const [mediaSubTab, setMediaSubTab] = useState<'hero' | 'collections' | 'promos' | 'instagram'>('hero');

  // Product Filters
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('ALL');
  const [productStockFilter, setProductStockFilter] = useState<'ALL' | 'IN_STOCK' | 'OUT_OF_STOCK'>('ALL');

  // Order Filters
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');

  // Add / Edit Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const initialFormState = {
    title: '',
    subtitle: '',
    description: '',
    price: '',
    originalPrice: '',
    categoryName: 'Men',
    images: [''],
    colorSwatches: [
      { name: 'Black', hex: '#111111' },
      { name: 'Grey', hex: '#666666' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    stockQuantity: '25',
    badge: 'NEW',
    isTrending: true,
    isFeatured: true,
  };

  const [productForm, setProductForm] = useState(initialFormState);
  const [deletingProduct, setDeletingProduct] = useState<MeherbanProduct | null>(null);
  const [invoiceOrder, setInvoiceOrder] = useState<MeherbanOrder | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast('অনুগ্রহ করে শুধুমাত্র ছবি (JPG, PNG, WebP) ফাইল সিলেক্ট করুন।', 'error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      addToast('ছবির সাইজ সর্বোচ্চ 10MB হতে পারবে।', 'error');
      return;
    }

    setIsUploadingImage(true);
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
        setProductForm((prev) => ({
          ...prev,
          images: [data.data.url],
        }));
        const providerName = data.data.provider === 'cloudinary' ? 'Cloudinary' : 'সার্ভার';
        addToast(`ছবি সফলভাবে ${providerName}-এ আপলোড হয়েছে!`, 'success');
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          setProductForm((prev) => ({
            ...prev,
            images: [reader.result as string],
          }));
          addToast('ছবি প্রিভিউতে যুক্ত হয়েছে।', 'info');
        };
        reader.readAsDataURL(file);
      }
    } catch {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductForm((prev) => ({
          ...prev,
          images: [reader.result as string],
        }));
        addToast('ছবি প্রিভিউতে যুক্ত হয়েছে (লোকাল মোড)।', 'info');
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploadingImage(false);
      e.target.value = '';
    }
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

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  };

  const handleFrontpageImageUpload = async (
    file: File,
    onSuccess: (url: string) => void
  ) => {
    if (!file.type.startsWith('image/')) {
      addToast('অনুগ্রহ করে শুধুমাত্র ছবি ফাইল সিলেক্ট করুন।', 'error');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      addToast('ছবির সাইজ সর্বোচ্চ 10MB হতে পারবে।', 'error');
      return;
    }
    addToast('ছবি আপলোড হচ্ছে...', 'info');
    const url = await uploadSingleImage(file);
    onSuccess(url);
  };

  // Steadfast & Pathao Courier CSV Bulk Export
  const handleExportCourierCSV = () => {
    if (orders.length === 0) {
      addToast('এক্সপোর্ট করার মতো কোনো অর্ডার পাওয়া যায়নি।', 'error');
      return;
    }

    const headers = [
      'Order ID',
      'Customer Name',
      'Customer Phone',
      'Shipping Address',
      'City / Area',
      'COD Amount (BDT)',
      'Item Description',
      'Status',
    ];

    const rows = orders.map((ord) => [
      `"${ord.orderNumber}"`,
      `"${ord.customerName.replace(/"/g, '""')}"`,
      `"${ord.customerPhone}"`,
      `"${ord.shippingAddress.replace(/"/g, '""')}"`,
      `"${ord.city}"`,
      ord.totalAmount,
      `"${ord.items.map((i) => `${i.title} (${i.selectedSize || 'Free'}-${i.selectedColor || ''} x${i.quantity})`).join(' | ')}"`,
      `"${ord.orderStatus}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Meherban_Steadfast_Pathao_Orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addToast('Steadfast/Pathao কুরিয়ার বুকিং CSV সফলভাবে ডাউনলোড হয়েছে!', 'success');
  };

  const isSellerLoggedIn = authRole === 'SELLER' && currentSeller !== null;

  // Handle Seller Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = sellerLogin(emailInput, passwordInput);
    if (!success) {
      setAuthError(true);
    } else {
      setAuthError(false);
      setEmailInput('');
      setPasswordInput('');
    }
  };

  const handleDemoSellerLogin = () => {
    sellerLogin('seller@meherban.com', 'seller123');
  };

  // Open Modal for New Product
  const handleOpenAddModal = () => {
    setEditingProductId(null);
    setProductForm(initialFormState);
    setIsProductModalOpen(true);
  };

  // Open Modal for Edit Product
  const handleOpenEditModal = (p: MeherbanProduct) => {
    setEditingProductId(p.id);
    setProductForm({
      title: p.title,
      subtitle: p.subtitle || '',
      description: p.description,
      price: String(p.price),
      originalPrice: p.originalPrice ? String(p.originalPrice) : '',
      categoryName: p.categoryName,
      images: p.images.length > 0 ? p.images : [''],
      colorSwatches: p.colorSwatches.length > 0 ? p.colorSwatches : [{ name: 'Default', hex: '#111111' }],
      sizes: p.sizes.length > 0 ? p.sizes : ['Standard'],
      inStock: p.inStock,
      stockQuantity: String(p.stockQuantity ?? 20),
      badge: p.badge || '',
      isTrending: p.isTrending,
      isFeatured: p.isFeatured,
    });
    setIsProductModalOpen(true);
  };

  // Save Add / Edit
  const handleProductFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.title.trim() || !productForm.price || !productForm.description.trim()) {
      addToast('অনুগ্রহ করে পণ্যের নাম, দাম এবং বিবরণ লিখুন।', 'error');
      return;
    }

    const cleanedImages = productForm.images.filter((img) => img.trim().length > 0);
    const finalImages = cleanedImages.length > 0 ? cleanedImages : [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    ];

    if (editingProductId) {
      await updateProduct(editingProductId, {
        title: productForm.title,
        subtitle: productForm.subtitle,
        description: productForm.description,
        price: Number(productForm.price),
        originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : Number(productForm.price),
        categoryName: productForm.categoryName,
        images: finalImages,
        colorSwatches: productForm.colorSwatches,
        sizes: productForm.sizes,
        inStock: productForm.inStock,
        stockQuantity: Number(productForm.stockQuantity) || 0,
        badge: productForm.badge || undefined,
        isTrending: productForm.isTrending,
        isFeatured: productForm.isFeatured,
      });
    } else {
      await addProduct({
        title: productForm.title,
        subtitle: productForm.subtitle,
        description: productForm.description,
        price: Number(productForm.price),
        originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : Number(productForm.price),
        categoryName: productForm.categoryName,
        images: finalImages,
        colorSwatches: productForm.colorSwatches,
        sizes: productForm.sizes,
        inStock: productForm.inStock,
        stockQuantity: Number(productForm.stockQuantity) || 20,
        badge: productForm.badge || undefined,
        isTrending: productForm.isTrending,
        isFeatured: productForm.isFeatured,
        sellerId: currentSeller?.id,
        sellerName: currentSeller?.shopName,
      });
    }

    setIsProductModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (deletingProduct) {
      await deleteProduct(deletingProduct.id);
      setDeletingProduct(null);
    }
  };

  // WhatsApp Customer
  const handleWhatsAppCustomer = (order: MeherbanOrder) => {
    const text = `হ্যালো ${order.customerName}! ${currentSeller?.shopName || 'MEHERBAN'} থেকে যোগাযোগ করছি।\nআপনার অর্ডার #${order.orderNumber} (মোট ৳${order.totalAmount}) কনফার্ম করতে চাচ্ছি।\nঠিকানা: ${order.shippingAddress}, ${order.city}\nআমরা কি আপনার পার্সেলটি পাঠিয়ে দিব?`;
    const encoded = encodeURIComponent(text);
    const phoneDigits = order.customerPhone.replace(/[^\d]/g, '');
    const fullPhone = phoneDigits.startsWith('880') ? phoneDigits : `88${phoneDigits}`;
    window.open(`https://wa.me/${fullPhone}?text=${encoded}`, '_blank');
  };

  // Copy Courier Details for Steadfast / Pathao
  const copyCourierText = (order: MeherbanOrder) => {
    const courierText = `নাম: ${order.customerName}\nফোন: ${order.customerPhone}\nঠিকানা: ${order.shippingAddress}, ${order.city}\nকালেকশন পরিমাণ: ৳${order.totalAmount}\nপণ্য: ${order.items.map((i) => `${i.title} (${i.selectedSize || 'Free'}, Qty: ${i.quantity})`).join(', ')}`;
    navigator.clipboard.writeText(courierText);
    addToast('কুরিয়ারের জন্য তথ্য কপি করা হয়েছে (Steadfast/Pathao)!', 'success');
  };

  // Filter products for this seller (or all if demo)
  const sellerProducts = products.filter(
    (p) => !p.sellerId || p.sellerId === currentSeller?.id || currentSeller?.id === 'seller-1'
  );

  const sellerOrders = orders.filter(
    (o) => !o.sellerId || o.sellerId === currentSeller?.id || currentSeller?.id === 'seller-1'
  );

  // Metrics for Seller
  const totalSellerProducts = sellerProducts.length;
  const inStockSellerProducts = sellerProducts.filter((p) => p.inStock && (p.stockQuantity === undefined || p.stockQuantity > 0)).length;
  const outOfStockSellerProducts = totalSellerProducts - inStockSellerProducts;
  const totalSellerOrders = sellerOrders.length;
  const totalSellerRevenue = sellerOrders.reduce((sum, o) => sum + (o.orderStatus !== 'CANCELLED' ? o.totalAmount : 0), 0);
  const pendingSellerOrders = sellerOrders.filter((o) => o.orderStatus === 'PENDING').length;

  // Filtered Products for UI
  const filteredProducts = sellerProducts.filter((p) => {
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

    return matchesSearch && matchesCategory && matchesStock;
  });

  // Filtered Orders for UI
  const filteredOrders = sellerOrders.filter((o) => {
    const q = orderSearch.toLowerCase().trim();
    const matchesSearch =
      q === '' ||
      o.orderNumber.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.customerPhone.includes(q);

    const matchesStatus = orderStatusFilter === 'ALL' || o.orderStatus === orderStatusFilter;

    return matchesSearch && matchesStatus;
  });

  // If Not Authenticated as Seller, show Seller Login Screen
  if (!isSellerLoggedIn) {
    return (
      <div className="min-h-screen bg-[#F5F5F0] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-neutral-200/90 p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-emerald-950 text-white rounded-2xl mx-auto flex items-center justify-center shadow-md">
              <Store className="w-7 h-7 text-emerald-400" />
            </div>
            <h1 className="font-serif text-2xl font-bold uppercase tracking-wider text-neutral-950">
              SELLER PORTAL
            </h1>
            <p className="text-xs text-neutral-500">
              বিক্রেতা লগইন — আপনার পণ্যের স্টক ও অর্ডার নিয়ন্ত্রণ করুন
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1.5">
                সেলার ইমেইল (Seller Email)
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="seller@meherban.com"
                  value={emailInput}
                  onChange={(e) => {
                    setEmailInput(e.target.value);
                    setAuthError(false);
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:border-black outline-none bg-white text-sm text-neutral-900"
                />
                <Mail className="w-4 h-4 text-neutral-400 absolute right-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1.5">
                পাসওয়ার্ড (Password)
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
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
                  <AlertTriangle className="w-3.5 h-3.5" /> ভুল ইমেইল বা পাসওয়ার্ড! সঠিক তথ্য দিয়ে আবার চেষ্টা করুন।
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-neutral-950 hover:bg-black text-white text-xs uppercase tracking-widest font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>লগইন করুন (Enter Seller Hub)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
            <Link href="/" className="hover:text-black transition-colors">
              &larr; লাইভ শপ
            </Link>
            <Link href="/login" className="text-amber-700 font-semibold hover:underline">
              পোর্টাল লগইন &rarr;
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Seller Dashboard
  return (
    <div className="min-h-screen bg-[#F6F6F2] text-neutral-900">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-neutral-950 text-white border-b border-neutral-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <span className="font-serif text-base sm:text-lg tracking-wider font-bold uppercase block leading-none">
                  {currentSeller.shopName}
                </span>
                <span className="text-[10px] tracking-wider text-emerald-400 uppercase font-mono">
                  Verified Merchant · {currentSeller.name}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
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
              <span className="text-xs font-medium">আমার মোট পণ্য</span>
              <Package className="w-4 h-4 text-neutral-700" />
            </div>
            <div className="text-2xl font-bold font-mono text-neutral-950">{totalSellerProducts}</div>
            <div className="text-[11px] text-neutral-500 mt-0.5">ক্যাটালগ আইটেম</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-xs">
            <div className="flex items-center justify-between text-neutral-500 mb-1">
              <span className="text-xs font-medium text-emerald-700">স্টকে আছে</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-700">{inStockSellerProducts}</div>
            <div className="text-[11px] text-emerald-600 mt-0.5">বিক্রির জন্য প্রস্তুত</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-xs">
            <div className="flex items-center justify-between text-neutral-500 mb-1">
              <span className="text-xs font-medium text-rose-700">স্টক শেষ / বন্ধ</span>
              <XCircle className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-2xl font-bold font-mono text-rose-700">{outOfStockSellerProducts}</div>
            <div className="text-[11px] text-rose-600 mt-0.5">Unavailable মার্ক করা</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-xs">
            <div className="flex items-center justify-between text-neutral-500 mb-1">
              <span className="text-xs font-medium text-amber-700">পেন্ডিং অর্ডার</span>
              <ShoppingBag className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-bold font-mono text-amber-800">{pendingSellerOrders}</div>
            <div className="text-[11px] text-amber-700 mt-0.5">কনফার্ম করতে হবে</div>
          </div>

          <div className="col-span-2 lg:col-span-1 bg-white p-4 rounded-xl border border-neutral-200/80 shadow-xs">
            <div className="flex items-center justify-between text-neutral-500 mb-1">
              <span className="text-xs font-medium text-neutral-700">আমার মোট বিক্রি</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold font-sans text-neutral-950">৳ {totalSellerRevenue.toLocaleString()}</div>
            <div className="text-[11px] text-neutral-500 mt-0.5">{totalSellerOrders} টি অর্ডার</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-neutral-300 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'products'
                ? 'bg-neutral-950 text-white shadow-md'
                : 'bg-white text-neutral-600 hover:text-black border border-neutral-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>প্রোডাক্ট ও স্টক নিয়ন্ত্রণ ({sellerProducts.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('frontpage')}
            className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'frontpage'
                ? 'bg-neutral-950 text-white shadow-md'
                : 'bg-white text-neutral-600 hover:text-black border border-neutral-200'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-amber-500" />
            <span>ফ্রন্টপেজ ব্যানার ও ছবি কন্ট্রোল</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 relative ${
              activeTab === 'orders'
                ? 'bg-neutral-950 text-white shadow-md'
                : 'bg-white text-neutral-600 hover:text-black border border-neutral-200'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>গ্রাহকদের অর্ডার ({sellerOrders.length})</span>
            {pendingSellerOrders > 0 && (
              <span className="w-5 h-5 bg-amber-500 text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                {pendingSellerOrders}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('boost')}
            className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'boost'
                ? 'bg-neutral-950 text-white shadow-md'
                : 'bg-white text-neutral-600 hover:text-black border border-neutral-200'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>বিজ্ঞাপন ও বুস্টিং সুবিধা</span>
          </button>
        </div>

        {/* TAB 1: PRODUCT & STOCK MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="flex flex-1 items-center gap-2">
                <div className="relative flex-1 max-w-sm">
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
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="px-3 py-2 text-xs rounded-lg border border-neutral-300 focus:border-black outline-none bg-white font-medium"
                >
                  <option value="ALL">সকল ক্যাটাগরি</option>
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Unisex">Unisex</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Clothing">Clothing</option>
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
                className="py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>নতুন পণ্য যোগ করুন (Add Product)</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-xl border border-neutral-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-neutral-100/80 text-neutral-600 font-semibold uppercase text-[10px] tracking-wider border-b border-neutral-200">
                      <th className="p-3.5">পণ্য (Product)</th>
                      <th className="p-3.5">ক্যাটাগরি</th>
                      <th className="p-3.5">মূল্য (Price)</th>
                      <th className="p-3.5 text-center">স্টক স্ট্যাটাস (1-Click Toggle)</th>
                      <th className="p-3.5 text-center">পরিমাণ (Stock Qty)</th>
                      <th className="p-3.5 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200/70">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-neutral-400">
                          আপনার কোনো পণ্য পাওয়া যায়নি।
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((p) => {
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
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-neutral-950 text-sm">{p.title}</span>
                                    {p.badge && (
                                      <span className="px-1.5 py-0.2 bg-black text-white text-[8px] font-bold rounded-xs">
                                        {p.badge}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-neutral-500 line-clamp-1">{p.subtitle || p.description}</p>
                                </div>
                              </div>
                            </td>

                            <td className="p-3.5 font-medium text-neutral-700">
                              <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 text-[11px]">
                                {p.categoryName}
                              </span>
                            </td>

                            <td className="p-3.5">
                              <div className="font-bold font-sans text-neutral-950 text-sm">
                                ৳ {p.price.toLocaleString()}
                              </div>
                              {p.originalPrice > p.price && (
                                <div className="text-[10px] text-neutral-400 line-through">
                                  ৳ {p.originalPrice.toLocaleString()}
                                </div>
                              )}
                            </td>

                            {/* 1-Click Stock Toggle Switch */}
                            <td className="p-3.5 text-center">
                              <button
                                type="button"
                                onClick={() => toggleProductAvailability(p.id)}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs ${
                                  isAvailable
                                    ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300'
                                    : 'bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-300'
                                }`}
                                title="Click to toggle Available vs Unavailable"
                              >
                                <span
                                  className={`w-2 h-2 rounded-full ${
                                    isAvailable ? 'bg-emerald-600 animate-pulse' : 'bg-rose-600'
                                  }`}
                                />
                                <span>{isAvailable ? 'In Stock (স্টকে আছে)' : 'Unavailable (স্টক শেষ)'}</span>
                              </button>
                            </td>

                            {/* Stock Quantity Controls */}
                            <td className="p-3.5 text-center">
                              <div className="inline-flex items-center border border-neutral-300 rounded-lg overflow-hidden bg-white shadow-xs">
                                <button
                                  type="button"
                                  onClick={() => updateProductStockQuantity(p.id, Math.max(0, (p.stockQuantity ?? 20) - 1))}
                                  className="px-2 py-1 bg-neutral-50 hover:bg-neutral-200 text-neutral-700 font-bold transition-colors"
                                  title="Reduce stock"
                                >
                                  -
                                </button>
                                <span className="px-3 py-1 text-xs font-bold font-mono text-neutral-900">
                                  {p.stockQuantity ?? 20}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => updateProductStockQuantity(p.id, (p.stockQuantity ?? 20) + 1)}
                                  className="px-2 py-1 bg-neutral-50 hover:bg-neutral-200 text-neutral-700 font-bold transition-colors"
                                  title="Increase stock"
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
                                  className="p-1.5 rounded-lg border border-neutral-200 hover:border-black text-neutral-700 hover:text-black transition-colors"
                                  title="Edit Product"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeletingProduct(p)}
                                  className="p-1.5 rounded-lg border border-rose-200 hover:border-rose-400 bg-rose-50 text-rose-600 hover:text-rose-700 transition-colors"
                                  title="Delete Product"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FRONTPAGE MEDIA & BANNERS CONTROL */}
        {activeTab === 'frontpage' && (
          <div className="space-y-6">
            {/* Header Banner */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-neutral-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-bold">
                  STOREFRONT VISUAL STUDIO
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold uppercase tracking-tight text-neutral-950 mt-1">
                  ওয়েবসাইট ফ্রন্টপেজ ব্যানার ও ছবি নিয়ন্ত্রণ
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5 max-w-xl">
                  কাস্টমার যখন ফেসবুক বা ইনস্টাগ্রাম অ্যাড থেকে ওয়েবসাইটে আসবে, তখন হোমপেজের শুরুতে কোন ব্যানার, কালেকশন কার্ড ও ছবি দেখতে পাবে তা এখান থেকেই সরাসরি এডিট করুন।
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={resetFrontpageMedia}
                  className="px-3 py-2 rounded-lg border border-neutral-300 hover:bg-neutral-100 text-neutral-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  title="ডিফল্ট ছবি রিস্টোর করুন"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>ডিফল্ট রিস্টোর</span>
                </button>
                <Link
                  href="/"
                  target="_blank"
                  className="px-3.5 py-2 rounded-lg bg-neutral-950 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>লাইভ হোমপেজ দেখুন</span>
                </Link>
              </div>
            </div>

            {/* Sub-Tabs Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <button
                type="button"
                onClick={() => setMediaSubTab('hero')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  mediaSubTab === 'hero'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white text-neutral-600 hover:text-black border border-neutral-200'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>হিরো ব্যানার স্লাইডার ({heroSlides.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setMediaSubTab('collections')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  mediaSubTab === 'collections'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white text-neutral-600 hover:text-black border border-neutral-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>কালেকশন কার্ড ছবি ({categories.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setMediaSubTab('promos')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  mediaSubTab === 'promos'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white text-neutral-600 hover:text-black border border-neutral-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>প্রোমো ব্যানার কার্ড ({promoBanners.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setMediaSubTab('instagram')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  mediaSubTab === 'instagram'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white text-neutral-600 hover:text-black border border-neutral-200'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>ইনস্টাগ্রাম শোকেস ({instagramPosts.length})</span>
              </button>
            </div>

            {/* SUB-TAB 1: HERO SLIDERS */}
            {mediaSubTab === 'hero' && (
              <div className="space-y-4">
                {heroSlides.map((slide, idx) => (
                  <div
                    key={slide.id}
                    className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <h4 className="font-bold text-sm text-neutral-900">
                          হিরো ব্যানার স্লাইড #{idx + 1}: &quot;{slide.headlineLine1} {slide.headlineLine2}&quot;
                        </h4>
                      </div>
                      <span className="text-[10px] text-neutral-400 font-mono uppercase">
                        ID: {slide.id}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                      {/* Left: Image Preview & Upload */}
                      <div className="lg:col-span-5 space-y-2.5">
                        <label className="block text-xs font-semibold text-neutral-700">
                          ব্যানার ছবি (16:9 অথবা হাই-রেজুলিউশন ছবি)
                        </label>
                        <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-neutral-200 bg-neutral-900 shadow-inner group">
                          <img
                            src={slide.imageUrl}
                            alt={slide.headlineLine1}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white text-xs font-bold px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-xs">
                              বর্তমান ছবি
                            </span>
                          </div>
                        </div>

                        {/* Device File Upload Button (No URL link needed) */}
                        <div>
                          <label className="w-full py-2.5 px-3 bg-neutral-950 hover:bg-black text-white text-xs font-bold rounded-xl cursor-pointer flex items-center justify-center gap-2 transition-all shadow-xs">
                            <Upload className="w-4 h-4 text-amber-400" />
                            <span>মোবাইল বা ল্যাপটপ থেকে ছবি আপলোড করুন</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleFrontpageImageUpload(file, (url) => {
                                    updateHeroSlide(slide.id, { imageUrl: url });
                                  });
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>

                      {/* Right: Slide Text Controls */}
                      <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="sm:col-span-2">
                          <label className="block font-semibold text-neutral-700 mb-1">
                            ট্যাগলাইন (Tagline / Eyebrow Text)
                          </label>
                          <input
                            type="text"
                            value={slide.tagline}
                            onChange={(e) => updateHeroSlide(slide.id, { tagline: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:border-black outline-none"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-neutral-700 mb-1">
                            হেডলাইন লাইন ১ (Headline 1)
                          </label>
                          <input
                            type="text"
                            value={slide.headlineLine1}
                            onChange={(e) => updateHeroSlide(slide.id, { headlineLine1: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:border-black outline-none font-bold"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-neutral-700 mb-1">
                            হেডলাইন লাইন ২ (Headline 2)
                          </label>
                          <input
                            type="text"
                            value={slide.headlineLine2}
                            onChange={(e) => updateHeroSlide(slide.id, { headlineLine2: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:border-black outline-none font-bold"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block font-semibold text-neutral-700 mb-1">
                            সাব-ক্যাটাগরি বা হাইলাইটস
                          </label>
                          <input
                            type="text"
                            value={slide.subcategories}
                            onChange={(e) => updateHeroSlide(slide.id, { subcategories: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:border-black outline-none"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-neutral-700 mb-1">
                            বাটন টেক্সট (CTA Button)
                          </label>
                          <input
                            type="text"
                            value={slide.ctaPrimary}
                            onChange={(e) => updateHeroSlide(slide.id, { ctaPrimary: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:border-black outline-none font-semibold"
                          />
                        </div>

                        <div className="flex items-end">
                          <button
                            type="button"
                            onClick={() => addToast(`স্লাইড #${idx + 1} সফলভাবে সেভ করা হয়েছে!`, 'success')}
                            className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>আপডেট সম্পন্ন হয়েছে</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* SUB-TAB 2: COLLECTION CARDS */}
            {mediaSubTab === 'collections' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-neutral-900 uppercase">
                          {cat.name}
                        </span>
                        <span className="text-[10px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full font-mono">
                          {cat.count} টি আইটেম
                        </span>
                      </div>

                      <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100 group">
                        <img
                          src={cat.imageUrl}
                          alt={cat.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      <p className="text-[11px] text-neutral-500 line-clamp-2">
                        {cat.description}
                      </p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-neutral-100">
                      <label className="w-full py-2 px-3 bg-neutral-900 hover:bg-black text-white text-xs font-semibold rounded-lg cursor-pointer flex items-center justify-center gap-1.5 transition-colors shadow-xs">
                        <Upload className="w-3.5 h-3.5" />
                        <span>ছবি পরিবর্তন করুন</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleFrontpageImageUpload(file, (url) => {
                                updateCategory(cat.id, { imageUrl: url });
                              });
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* SUB-TAB 3: PROMO BANNERS */}
            {mediaSubTab === 'promos' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {promoBanners.map((promo) => (
                  <div
                    key={promo.id}
                    className="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200/80 shadow-xs space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b pb-2">
                        <span className="font-bold text-xs uppercase tracking-wider text-amber-700 font-mono">
                          {promo.category} PROMO
                        </span>
                        <span className="text-[10px] text-neutral-400 font-mono uppercase">
                          ID: {promo.id}
                        </span>
                      </div>

                      <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-neutral-200 bg-neutral-900 group">
                        <img
                          src={promo.imageUrl}
                          alt={promo.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      <div className="space-y-2 text-xs">
                        <div>
                          <label className="block font-semibold text-neutral-700 mb-0.5 text-[11px]">
                            প্রোমো টাইটেল
                          </label>
                          <input
                            type="text"
                            value={promo.title}
                            onChange={(e) => updatePromoBanner(promo.id, { title: e.target.value })}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 focus:border-black outline-none font-bold"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-neutral-700 mb-0.5 text-[11px]">
                            সাব-টাইটেল
                          </label>
                          <input
                            type="text"
                            value={promo.subtitle}
                            onChange={(e) => updatePromoBanner(promo.id, { subtitle: e.target.value })}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 focus:border-black outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-neutral-100">
                      <label className="w-full py-2 px-3 bg-neutral-900 hover:bg-black text-white text-xs font-semibold rounded-lg cursor-pointer flex items-center justify-center gap-1.5 transition-colors shadow-xs">
                        <Upload className="w-3.5 h-3.5" />
                        <span>প্রোমো ছবি আপলোড করুন</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleFrontpageImageUpload(file, (url) => {
                                updatePromoBanner(promo.id, { imageUrl: url });
                              });
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* SUB-TAB 4: INSTAGRAM SHOWCASE */}
            {mediaSubTab === 'instagram' && (
              <div className="space-y-4">
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-xs text-amber-900">
                  <span className="font-bold block mb-0.5">📸 ইনস্টাগ্রাম গ্যালারি ছবি নিয়ন্ত্রণ</span>
                  আপনার ইনস্টাগ্রাম ফিডের ৮টি ছবির স্লট নিচে দেওয়া হলো। যেকোনো ছবিতে ক্লিক করে আপনার নিজের কাপড়ের বা ব্র্যান্ডের ফটো আপলোড করে রিপ্লেস করতে পারেন।
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  {instagramPosts.map((post, idx) => (
                    <div
                      key={post.id}
                      className="bg-white p-3 rounded-xl border border-neutral-200/80 shadow-xs space-y-2 flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500">
                        <span>ছবি #{idx + 1}</span>
                        <span>{post.likes} likes</span>
                      </div>

                      <div className="relative aspect-square rounded-lg overflow-hidden border border-neutral-200 bg-neutral-100 group">
                        <img
                          src={post.imageUrl}
                          alt={post.tag}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      <div className="space-y-1.5 pt-1">
                        <label className="w-full py-1.5 px-2.5 bg-neutral-900 hover:bg-black text-white text-[11px] font-semibold rounded-lg cursor-pointer flex items-center justify-center gap-1 transition-colors">
                          <Upload className="w-3 h-3" />
                          <span>ছবি বদলান</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleFrontpageImageUpload(file, (url) => {
                                  updateInstagramPost(post.id, { imageUrl: url });
                                });
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SELLER'S ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="flex flex-1 items-center gap-2">
                <div className="relative flex-1 max-w-sm">
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

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleExportCourierCSV}
                  className="py-1.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                  title="Steadfast বা Pathao-তে বাল্ক বুকিং করার জন্য CSV ফাইল ডাউনলোড করুন"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>কুরিয়ার CSV এক্সপোর্ট</span>
                </button>

                <div className="text-xs text-neutral-500 font-medium">
                  অর্ডার সংখ্যা: <strong className="text-black">{filteredOrders.length}</strong>
                </div>
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="bg-white p-12 rounded-xl border border-neutral-200 text-center space-y-2">
                <ShoppingBag className="w-10 h-10 text-neutral-300 mx-auto" />
                <p className="font-serif text-base font-bold text-neutral-800">কোনো অর্ডার পাওয়া যায়নি</p>
                <p className="text-xs text-neutral-500">
                  গ্রাহকরা ফেসবুক/ইনস্টাগ্রাম থেকে অর্ডার করলে সরাসরি এখানে জমা পড়বে।
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-white rounded-xl border border-neutral-200/90 shadow-sm p-4 sm:p-5 space-y-4 hover:border-neutral-400 transition-all"
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
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-neutral-500 font-medium">স্ট্যাটাস:</span>
                        <select
                          value={ord.orderStatus}
                          onChange={(e) => updateOrderStatus(ord.orderNumber, e.target.value as any)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-lg border outline-none cursor-pointer ${
                            ord.orderStatus === 'PENDING'
                              ? 'bg-amber-50 text-amber-800 border-amber-300'
                              : ord.orderStatus === 'CONFIRMED'
                              ? 'bg-blue-50 text-blue-800 border-blue-300'
                              : ord.orderStatus === 'SHIPPED'
                              ? 'bg-purple-50 text-purple-800 border-purple-300'
                              : ord.orderStatus === 'DELIVERED'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : 'bg-neutral-100 text-neutral-600 border-neutral-300'
                          }`}
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
                      {/* Customer Info & Direct Action */}
                      <div className="space-y-1.5 bg-[#FAF9F6] p-3.5 rounded-xl border border-neutral-200/60">
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-500">গ্রাহকের নাম:</span>
                          <span className="font-bold text-neutral-900 text-sm">{ord.customerName}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-500">মোবাইল নম্বর:</span>
                          <span className="font-bold font-mono text-neutral-900 text-sm">{ord.customerPhone}</span>
                        </div>
                        <div className="flex items-start justify-between">
                          <span className="text-neutral-500 shrink-0">ঠিকানা:</span>
                          <span className="text-neutral-800 text-right font-medium max-w-[260px]">
                            {ord.shippingAddress}, {ord.city}
                          </span>
                        </div>
                        {ord.notes && (
                          <div className="flex items-start justify-between pt-1 border-t border-neutral-200">
                            <span className="text-neutral-500 shrink-0">নোট:</span>
                            <span className="text-amber-800 font-medium italic">{ord.notes}</span>
                          </div>
                        )}

                        {/* Action Buttons: Call, WhatsApp, Copy Courier Info */}
                        <div className="pt-2 grid grid-cols-3 gap-1.5">
                          <a
                            href={`tel:${ord.customerPhone}`}
                            className="py-2 px-2 bg-neutral-900 hover:bg-black text-white rounded-lg text-center font-bold flex items-center justify-center gap-1 transition-colors text-[11px]"
                          >
                            <Phone className="w-3 h-3" />
                            <span>কল করুন</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => handleWhatsAppCustomer(ord)}
                            className="py-2 px-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg text-center font-bold flex items-center justify-center gap-1 transition-colors text-[11px]"
                          >
                            <MessageCircle className="w-3 h-3 fill-white" />
                            <span>WhatsApp</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => copyCourierText(ord)}
                            className="py-2 px-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 rounded-lg text-center font-bold flex items-center justify-center gap-1 transition-colors text-[11px]"
                            title="Steadfast বা Pathao-র জন্য কপি করুন"
                          >
                            <Copy className="w-3 h-3" />
                            <span>কুরিয়ার কপি</span>
                          </button>
                        </div>
                      </div>

                      {/* Items List */}
                      <div className="space-y-2 bg-[#FAF9F6] p-3.5 rounded-xl border border-neutral-200/60">
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-500 font-bold uppercase text-[10px] tracking-wider">
                            অর্ডারকৃত পণ্য ({ord.items.length})
                          </span>
                          <button
                            type="button"
                            onClick={() => setInvoiceOrder(ord)}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-800 hover:text-black underline"
                          >
                            <Printer className="w-3 h-3" />
                            <span>স্লিপ দেখুন</span>
                          </button>
                        </div>

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
                          <span className="text-neutral-600">ডেলিভারি চার্জ: ৳{ord.shippingFee}</span>
                          <span className="font-bold text-sm text-neutral-950 font-sans">
                            মোট: ৳ {ord.totalAmount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: BOOST STRATEGY */}
        {activeTab === 'boost' && (
          <div className="bg-white p-6 sm:p-8 rounded-xl border border-neutral-200/80 shadow-xs space-y-6">
            <div className="border-b border-neutral-100 pb-4">
              <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-mono">
                MERCHANT AD ACCELERATION
              </span>
              <h2 className="font-serif text-2xl font-bold uppercase text-neutral-950 mt-0.5">
                সেলার বুস্টিং ও বিক্রয় বৃদ্ধি টিপস
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                <h3 className="font-bold text-emerald-950 text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  কাস্টমার লগইন ছাড়া সরাসরি অর্ডার
                </h3>
                <p className="text-emerald-900/90 leading-relaxed">
                  ফেসবুক ও ইনস্টাগ্রাম বিজ্ঞাপনে ট্র্যাফিক ড্রাইভ করলে কোনো কাস্টমারই পাসওয়ার্ড দিয়ে অ্যাকাউন্ট খুলতে চায় না। আমাদের স্টোরে কাস্টমার নাম ও মোবাইল নম্বর দিলেই অর্ডার হয়ে যায়, যার ফলে আপনার বিজ্ঞাপনের খরচ কমে এবং সেলস বাড়ে।
                </p>
              </div>

              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2">
                <h3 className="font-bold text-blue-950 text-sm flex items-center gap-1.5">
                  <Copy className="w-4 h-4 text-blue-600" />
                  ১-ক্লিক কুরিয়ার কপি (Steadfast / Pathao)
                </h3>
                <p className="text-blue-900/90 leading-relaxed">
                  প্রতিটি অর্ডারের নিচে &quot;কুরিয়ার কপি&quot; বাটনে ক্লিক করলেই সম্পূর্ণ তথ্য একসাথে কপি হয়ে যায়। আপনাকে বারবার টাইপ করে কুরিয়ার প্যানেলে সময় নষ্ট করতে হবে না।
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ADD / EDIT PRODUCT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
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
                    placeholder="যেমন: Minimalist Linen Shirt"
                    value={productForm.title}
                    onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 focus:border-black outline-none bg-white text-neutral-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    ধরন / সাব-টাইটেল
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: Pure Breathable Organic Fabric"
                    value={productForm.subtitle}
                    onChange={(e) => setProductForm({ ...productForm, subtitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 focus:border-black outline-none bg-white text-neutral-900"
                  />
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
                    placeholder="1499"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:border-black outline-none bg-white text-neutral-900 font-sans"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    আসল মূল্য ৳
                  </label>
                  <input
                    type="number"
                    placeholder="1899"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:border-black outline-none bg-white text-neutral-900 font-sans"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    স্টক সংখ্যা
                  </label>
                  <input
                    type="number"
                    placeholder="25"
                    value={productForm.stockQuantity}
                    onChange={(e) => setProductForm({ ...productForm, stockQuantity: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:border-black outline-none bg-white text-neutral-900 font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">ক্যাটাগরি</label>
                  <select
                    value={productForm.categoryName}
                    onChange={(e) => setProductForm({ ...productForm, categoryName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:border-black outline-none bg-white font-medium"
                  >
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Unisex">Unisex</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Clothing">Clothing</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">ব্যাজ</label>
                  <input
                    type="text"
                    placeholder="যেমন: HOT, SALE, NEW"
                    value={productForm.badge}
                    onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:border-black outline-none bg-white"
                  />
                </div>
              </div>

              {/* 1-Click Stock Toggle in Modal */}
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-neutral-900 block">স্টক স্ট্যাটাস</span>
                  <span className="text-[11px] text-neutral-500">
                    {productForm.inStock ? 'পণ্যটি স্টকে আছে (Available)' : 'পণ্যটি বন্ধ/স্টক শেষ (Unavailable)'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setProductForm({ ...productForm, inStock: !productForm.inStock })}
                  className={`px-3 py-1.5 rounded-full font-bold text-xs transition-colors ${
                    productForm.inStock
                      ? 'bg-emerald-600 text-white'
                      : 'bg-rose-600 text-white'
                  }`}
                >
                  {productForm.inStock ? 'In Stock' : 'Unavailable'}
                </button>
              </div>

              {/* Product Image Section (100% Direct Device Storage Upload) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-semibold text-neutral-800 text-xs">
                    পণ্যের ছবি (Device Storage থেকে আপলোড) <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-medium">
                    মোবাইল গ্যালারি বা ল্যাপটপ থেকে ছবি দিন
                  </span>
                </div>

                <div className="space-y-2">
                  {productForm.images[0] && productForm.images[0].trim().length > 0 ? (
                    <div className="flex items-center gap-3 p-3 bg-neutral-50 border border-neutral-200 rounded-xl">
                      <img
                        src={productForm.images[0]}
                        alt="Product preview"
                        className="w-16 h-16 object-cover rounded-lg border border-neutral-200 bg-white shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-neutral-900 truncate">
                          ছবি সফলভাবে যুক্ত হয়েছে
                        </p>
                        <p className="text-[10px] text-neutral-500 truncate mt-0.5">
                          {productForm.images[0].startsWith('data:')
                            ? 'ডিভাইস লোকাল স্টোরেজ ছবি'
                            : productForm.images[0]}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <label className="text-[11px] font-semibold text-neutral-800 hover:text-black underline cursor-pointer">
                            <span>অন্য ছবি দিন (Replace)</span>
                            <input
                              type="file"
                              accept="image/*"
                              disabled={isUploadingImage}
                              onChange={handleImageFileUpload}
                              className="hidden"
                            />
                          </label>
                          <span className="text-neutral-300">·</span>
                          <button
                            type="button"
                            onClick={() => setProductForm({ ...productForm, images: [''] })}
                            className="text-[11px] font-semibold text-rose-600 hover:text-rose-800 underline"
                          >
                            ছবি মুছে ফেলুন
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <label className="relative flex flex-col items-center justify-center p-6 sm:p-8 border-2 border-dashed border-neutral-300 hover:border-amber-500 bg-neutral-50/70 hover:bg-amber-50/30 rounded-xl cursor-pointer transition-all group">
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
                            মোবাইল গ্যালারি বা ল্যাপটপের স্টোরেজ থেকে ছবি সিলেক্ট করুন
                          </span>
                          <span className="text-[10px] text-neutral-500 mt-1">
                            JPG, PNG, WebP ফরম্যাট (ট্যাপ বা ফাইল চুজ করুন)
                          </span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        disabled={isUploadingImage}
                        onChange={handleImageFileUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  পণ্যের বিবরণ <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="ফ্যাব্রিক, কোয়ালিটি ও সাইজ বিবরণ..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg border border-neutral-300 focus:border-black outline-none bg-white text-xs resize-none"
                />
              </div>

              <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2.5 rounded-lg border border-neutral-300 text-neutral-700 font-semibold hover:bg-neutral-100"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-neutral-950 hover:bg-black text-white rounded-lg font-bold uppercase tracking-wider shadow-md"
                >
                  {editingProductId ? 'আপডেট সেভ করুন' : 'পণ্য যোগ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PARCEL INVOICE SLIP MODAL */}
      {invoiceOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            onClick={() => setInvoiceOrder(null)}
          />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 z-10 border border-neutral-300 text-xs space-y-4 animate-fade-in font-sans">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-serif text-lg font-bold uppercase text-neutral-950">
                  {currentSeller.shopName}
                </h3>
                <span className="text-[10px] text-neutral-500 font-mono">PARCEL DISPATCH SLIP</span>
              </div>
              <button
                type="button"
                onClick={() => setInvoiceOrder(null)}
                className="p-1 text-neutral-400 hover:text-black"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5 bg-neutral-50 p-3 rounded-lg border">
              <div className="flex justify-between font-mono font-bold text-neutral-900">
                <span>ORDER ID:</span>
                <span>#{invoiceOrder.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">গ্রাহক:</span>
                <span className="font-bold text-neutral-900">{invoiceOrder.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">ফোন:</span>
                <span className="font-bold font-mono text-neutral-900">{invoiceOrder.customerPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">ঠিকানা:</span>
                <span className="text-neutral-900 font-medium text-right">{invoiceOrder.shippingAddress}, {invoiceOrder.city}</span>
              </div>
            </div>

            <div className="border-t pt-2 space-y-1">
              <span className="font-bold text-[10px] uppercase text-neutral-500">পণ্য তালিকা:</span>
              {invoiceOrder.items.map((it, idx) => (
                <div key={idx} className="flex justify-between text-neutral-800">
                  <span>{it.title} (x{it.quantity})</span>
                  <span className="font-bold font-mono">৳{(it.price * it.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between pt-1 border-t text-sm font-bold text-neutral-950">
                <span>কালেকশন ক্যাশ (COD):</span>
                <span>৳{invoiceOrder.totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-neutral-950 text-white rounded-lg font-bold flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>প্রিন্ট করুন</span>
              </button>
              <button
                type="button"
                onClick={() => setInvoiceOrder(null)}
                className="px-4 py-2.5 border rounded-lg text-neutral-700"
              >
                বন্ধ করুন
              </button>
            </div>
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
                &quot;{deletingProduct.title}&quot; স্থায়ীভাবে মুছে ফেলা হবে।
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingProduct(null)}
                className="flex-1 py-2.5 rounded-lg border border-neutral-300 text-neutral-700 text-xs font-semibold hover:bg-neutral-100"
              >
                না, রাখুন
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md"
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
