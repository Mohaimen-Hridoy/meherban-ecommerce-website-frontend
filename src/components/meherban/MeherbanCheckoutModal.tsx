'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, ShoppingBag, Truck, MessageCircle, PhoneCall, ArrowRight, ShieldCheck } from 'lucide-react';
import { useMeherban } from '@/context/MeherbanContext';

export const MeherbanCheckoutModal: React.FC = () => {
  const {
    cart,
    subtotal,
    isCheckoutOpen,
    setIsCheckoutOpen,
    placeCustomerOrder,
    expressCheckoutProduct,
    setExpressCheckoutProduct,
    addToast,
  } = useMeherban();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    area: 'dhaka_inside', // 'dhaka_inside' | 'dhaka_outside'
    paymentMethod: 'CASH_ON_DELIVERY',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<{
    orderNumber: string;
    totalAmount: number;
    phone: string;
    name: string;
    address: string;
    city: string;
  } | null>(null);

  if (!isCheckoutOpen) return null;

  // Delivery charge calculation
  const deliveryCharge =
    subtotal >= 1999 ? 0 : formData.area === 'dhaka_inside' ? 60 : 120;
  const grandTotal = subtotal + deliveryCharge;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      addToast('অনুগ্রহ করে আপনার নাম, মোবাইল নম্বর এবং ঠিকানা পূরণ করুন।', 'error');
      return;
    }

    // Bangladeshi Phone Number Validation: 013, 014, 015, 016, 017, 018, 019 followed by 8 digits
    const cleanedPhone = formData.phone.replace(/[\s\-\+]/g, '').replace(/^88/, '');
    const bdPhoneRegex = /^01[3-9]\d{8}$/;
    if (!bdPhoneRegex.test(cleanedPhone)) {
      addToast('অনুগ্রহ করে সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 01712345678)', 'error');
      return;
    }

    if (cart.length === 0) {
      addToast('আপনার কার্ট খালি!', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const city = formData.area === 'dhaka_inside' ? 'Dhaka (Inside)' : 'Outside Dhaka';
      const result = await placeCustomerOrder({
        customerName: formData.name.trim(),
        customerPhone: cleanedPhone,
        customerEmail: formData.email ? formData.email.trim() : undefined,
        shippingAddress: formData.address.trim(),
        city,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
        items: cart,
      });

      if (result.success) {
        setOrderSuccess({
          orderNumber: result.orderNumber,
          totalAmount: result.totalAmount,
          phone: cleanedPhone,
          name: formData.name.trim(),
          address: formData.address.trim(),
          city,
        });
        setExpressCheckoutProduct(null);

        // Fire Meta Pixel Purchase Event for Facebook & Instagram ad boost attribution
        if (typeof window !== 'undefined' && (window as any).fbq) {
          (window as any).fbq('track', 'Purchase', {
            value: result.totalAmount,
            currency: 'BDT',
            content_type: 'product',
            order_id: result.orderNumber,
          });
        }
      }
    } catch {
      addToast('অর্ডার করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setOrderSuccess(null);
    setExpressCheckoutProduct(null);
  };

  const openWhatsAppConfirmation = () => {
    if (!orderSuccess) return;
    const msg = `হ্যালো MEHERBAN! আমি ফেসবুক/ইনস্টাগ্রাম থেকে অর্ডার করেছি।\nঅর্ডার নম্বর: ${orderSuccess.orderNumber}\nমোট মূল্য: ৳${orderSuccess.totalAmount}\nনাম: ${orderSuccess.name}\nফোন: ${orderSuccess.phone}\nঠিকানা: ${orderSuccess.address}, ${orderSuccess.city}\nদয়া করে অর্ডারটি দ্রুত কনফার্ম ও ডেলিভারি দিন। ধন্যবাদ!`;
    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/8801778607894?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={handleClose}
      />

      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10 animate-fade-in border border-neutral-200">
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-black flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {orderSuccess ? (
          /* Order Confirmation View */
          <div className="p-6 sm:p-8 text-center space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-10 h-10 stroke-[2.2]" />
            </div>

            <div>
              <span className="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-widest rounded-full mb-1">
                অর্ডার সফল হয়েছে! (Order Placed)
              </span>
              <h3 className="font-serif text-2xl font-bold text-neutral-900 uppercase">
                ধন্যবাদ, {orderSuccess.name}!
              </h3>
              <p className="text-xs text-neutral-600 mt-1">
                আপনার অর্ডারটি গ্রহণ করা হয়েছে। আমাদের কাস্টমার প্রতিনিধি শীঘ্রই আপনাকে ফোন দিয়ে অর্ডার কনফার্ম করবে।
              </p>
            </div>

            <div className="bg-[#FAF7F2] p-4 rounded-xl border border-neutral-200/80 text-left text-xs space-y-2">
              <div className="flex justify-between border-b border-neutral-200/60 pb-1.5">
                <span className="text-neutral-500 font-medium">অর্ডার আইডি:</span>
                <span className="font-mono font-bold text-neutral-950 text-sm">{orderSuccess.orderNumber}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-200/60 pb-1.5">
                <span className="text-neutral-500 font-medium">মোট প্রদেয় টাকা:</span>
                <span className="font-bold text-neutral-950 text-sm">৳ {orderSuccess.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-200/60 pb-1.5">
                <span className="text-neutral-500 font-medium">ডেলিভারি ঠিকানা:</span>
                <span className="text-neutral-900 font-medium text-right max-w-[240px] truncate">{orderSuccess.address}, {orderSuccess.city}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 font-medium">পেমেন্ট মেথড:</span>
                <span className="text-neutral-900 font-medium">ক্যাশ অন ডেলিভারি (পণ্য দেখে মূল্য পরিশোধ)</span>
              </div>
            </div>

            {/* Quick WhatsApp Action Button */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                type="button"
                onClick={openWhatsAppConfirmation}
                className="flex-1 py-3 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>WhatsApp-এ দ্রুত কনফার্ম করুন</span>
              </button>

              <button
                type="button"
                onClick={handleClose}
                className="py-3 px-6 bg-neutral-950 hover:bg-black text-white text-xs uppercase tracking-wider font-semibold rounded-lg shadow-md transition-all"
              >
                শপিং চালিয়ে যান
              </button>
            </div>

            <div className="text-[11px] text-neutral-500 pt-2 flex items-center justify-center gap-3">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> ১০০% অরিজিনাল পণ্য
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-neutral-700" /> ২-৩ দিনে দ্রুত ডেলিভারি
              </span>
            </div>
          </div>
        ) : (
          /* Checkout Form (100% Guest, No Login Required) */
          <form onSubmit={handleSubmit} className="p-5 sm:p-7 max-h-[88vh] overflow-y-auto">
            <div className="border-b border-neutral-100 pb-3 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold block">
                    FAST GUEST CHECKOUT
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold uppercase tracking-wide text-neutral-950">
                    অর্ডার ফর্ম (Order Now)
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                    লগইন এর প্রয়োজন নেই
                  </span>
                </div>
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                পণ্যটি পেতে নিচের ফর্মটি সঠিক তথ্য দিয়ে পূরণ করে &quot;অর্ডার কনফার্ম করুন&quot; বাটনে ক্লিক করুন।
              </p>
            </div>

            {/* Selected Items Mini Preview */}
            <div className="mb-4 bg-[#FAF9F6] p-3 rounded-xl border border-neutral-200/70">
              <div className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>অর্ডারকৃত পণ্য ({cart.length})</span>
                <span className="font-mono text-neutral-900">৳ {subtotal.toLocaleString()}</span>
              </div>
              <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-2.5 text-xs">
                    <img
                      src={item.imageUrl || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'}
                      alt={item.title}
                      className="w-10 h-10 object-cover rounded-md bg-white border border-neutral-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-neutral-900 truncate">{item.title}</p>
                      <p className="text-[10px] text-neutral-500">
                        {item.selectedSize} · {item.selectedColor} · Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="font-bold text-neutral-900 shrink-0">
                      ৳ {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Information Inputs */}
            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-neutral-800 mb-1">
                  আপনার নাম (Full Name) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: রহিম আহমেদ"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 focus:border-black focus:ring-1 focus:ring-black outline-none bg-white transition-all text-neutral-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-800 mb-1">
                  মোবাইল নম্বর (Phone Number) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="যেমন: 01712-345678"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 focus:border-black focus:ring-1 focus:ring-black outline-none bg-white transition-all text-neutral-900 font-sans"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-800 mb-1">
                  সম্পূর্ণ ঠিকানা (Full Delivery Address) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="বাসা নং, রোড নং, এলাকা / থানা, জেলা..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg border border-neutral-300 focus:border-black focus:ring-1 focus:ring-black outline-none bg-white transition-all text-neutral-900 resize-none"
                />
              </div>

              {/* Delivery Area Selection */}
              <div>
                <label className="block font-semibold text-neutral-800 mb-1.5">
                  ডেলিভারি এরিয়া নির্বাচন করুন <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, area: 'dhaka_inside' })}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      formData.area === 'dhaka_inside'
                        ? 'border-neutral-950 bg-neutral-900 text-white shadow-xs'
                        : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                    }`}
                  >
                    <div className="font-semibold text-xs">ঢাকার ভেতরে</div>
                    <div className={`text-[10px] mt-0.5 ${formData.area === 'dhaka_inside' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                      চার্জ: ৳৬০ (২৪-৪৮ ঘণ্টা)
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, area: 'dhaka_outside' })}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      formData.area === 'dhaka_outside'
                        ? 'border-neutral-950 bg-neutral-900 text-white shadow-xs'
                        : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                    }`}
                  >
                    <div className="font-semibold text-xs">ঢাকার বাইরে</div>
                    <div className={`text-[10px] mt-0.5 ${formData.area === 'dhaka_outside' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                      চার্জ: ৳১২০ (২-৩ দিন)
                    </div>
                  </button>
                </div>
              </div>

              {/* Payment Method - Strictly Cash on Delivery */}
              <div>
                <label className="block font-semibold text-neutral-800 mb-1.5">
                  পেমেন্ট পদ্ধতি
                </label>
                <div className="p-3 rounded-xl border-2 border-neutral-950 bg-neutral-900 text-white shadow-xs flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-xs flex items-center gap-1.5">
                        <span>ক্যাশ অন ডেলিভারি (Cash on Delivery)</span>
                        <span className="text-[10px] bg-emerald-500/30 text-emerald-300 px-1.5 py-0.5 rounded font-mono">একমাত্র মেথড</span>
                      </div>
                      <div className="text-[11px] text-neutral-300 mt-0.5">
                        পণ্য হাতে পেয়ে দেখে ডেলিভারি ম্যানকে টাকা পরিশোধ করবেন। কোনো অগ্রিম পেমেন্টের প্রয়োজন নেই।
                      </div>
                    </div>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 ml-2" />
                </div>
              </div>

              {/* Optional Note */}
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  অর্ডার নোট (Optional)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: অফিস টাইমে ডেলিভারি দিবেন..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg border border-neutral-300 focus:border-black outline-none bg-white text-neutral-900"
                />
              </div>

              {/* Total Calculation Breakdown */}
              <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-neutral-200/80 space-y-1.5 text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>পণ্যের মূল্য</span>
                  <span>৳ {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>ডেলিভারি চার্জ</span>
                  <span>{deliveryCharge === 0 ? 'FREE (৳১৯৯৯+ অফার)' : `৳ ${deliveryCharge}`}</span>
                </div>
                <div className="border-t border-neutral-200 pt-1.5 flex justify-between font-bold text-neutral-950 text-sm">
                  <span>মোট প্রদেয় টাকা</span>
                  <span className="text-base text-neutral-950 font-sans">৳ {grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Confirm Order Button */}
            <button
              type="submit"
              disabled={isSubmitting || cart.length === 0}
              className="mt-5 w-full py-3.5 bg-neutral-950 hover:bg-black disabled:bg-neutral-400 text-white text-sm uppercase tracking-wider font-bold rounded-lg shadow-xl transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <span>{isSubmitting ? 'অর্ডার প্রসেস হচ্ছে...' : `অর্ডার কনফার্ম করুন · ৳ ${grandTotal.toLocaleString()}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-center text-[10px] text-neutral-500 mt-2.5">
              অর্ডার কনফার্ম করার জন্য কোনো অ্যাকাউন্টে সাইন-আপ করতে হবে না।
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
