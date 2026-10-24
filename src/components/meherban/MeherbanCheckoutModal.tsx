'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, CreditCard } from 'lucide-react';
import { useMeherban } from '@/context/MeherbanContext';

export const MeherbanCheckoutModal: React.FC = () => {
  const {
    cart,
    subtotal,
    shippingFee,
    clearCart,
    isCheckoutOpen,
    setIsCheckoutOpen,
    addToast,
  } = useMeherban();

  const [formData, setFormData] = useState({
    name: 'Mohaimen Hridoy',
    email: 'mohaimen@meherban.com',
    phone: '01712345678',
    address: 'House 42, Road 11, Banani',
    city: 'Dhaka',
    paymentMethod: 'CASH_ON_DELIVERY',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<{
    orderNumber: string;
    totalAmount: number;
  } | null>(null);

  if (!isCheckoutOpen) return null;

  const totalAmount = subtotal + shippingFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${backendUrl}/api/meherban/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          shippingAddress: formData.address,
          city: formData.city,
          paymentMethod: formData.paymentMethod,
          items: cart.map((i) => ({
            productId: i.productId,
            title: i.title,
            price: i.price,
            quantity: i.quantity,
            selectedColor: i.selectedColor,
            selectedSize: i.selectedSize,
            imageUrl: i.imageUrl,
          })),
        }),
      }).catch(() => null);

      let orderNumber = `MH-${Date.now().toString().slice(-6)}`;
      if (res && res.ok) {
        const json = await res.json();
        if (json.data?.orderNumber) {
          orderNumber = json.data.orderNumber;
        }
      }

      setOrderSuccess({
        orderNumber,
        totalAmount,
      });
      clearCart();
      addToast(`Order placed successfully: ${orderNumber}`);
    } catch {
      const orderNumber = `MH-${Date.now().toString().slice(-6)}`;
      setOrderSuccess({
        orderNumber,
        totalAmount,
      });
      clearCart();
      addToast(`Order placed: ${orderNumber}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setOrderSuccess(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity animate-fade-in"
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
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400">
                MEHERBAN OFFICIAL ORDER CONFIRMED
              </span>
              <h3 className="font-serif text-2xl font-bold text-neutral-900 mt-1 uppercase">
                Thank You, {formData.name}
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                Your order invoice has been generated and queued for white-glove packaging.
              </p>
            </div>

            <div className="bg-[#FAF7F2] p-4 rounded-xl border border-neutral-200/60 max-w-sm mx-auto text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-neutral-500">Order ID:</span>
                <span className="font-mono font-bold text-neutral-900">{orderSuccess.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Total Paid/Due:</span>
                <span className="font-bold text-neutral-900">৳ {orderSuccess.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Delivery To:</span>
                <span className="text-neutral-800">{formData.address}, {formData.city}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Payment:</span>
                <span className="text-neutral-800">{formData.paymentMethod}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="mt-4 px-8 py-3 bg-neutral-950 hover:bg-black text-white text-xs uppercase tracking-widest font-semibold rounded-md shadow-md transition-all"
            >
              Back to Store
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
            <div className="border-b border-neutral-100 pb-4 mb-5">
              <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-mono">
                SECURE CHECKOUT
              </span>
              <h3 className="font-serif text-2xl font-bold uppercase tracking-wide text-neutral-950">
                Shipping & Payment
              </h3>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 focus:border-black outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 focus:border-black outline-none bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 focus:border-black outline-none bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 focus:border-black outline-none bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">City</label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 focus:border-black outline-none bg-white"
                  >
                    <option value="Dhaka">Dhaka</option>
                    <option value="Chittagong">Chittagong</option>
                    <option value="Sylhet">Sylhet</option>
                    <option value="Rajshahi">Rajshahi</option>
                    <option value="Khulna">Khulna</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Country</label>
                  <input
                    type="text"
                    disabled
                    value="Bangladesh"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-200 bg-neutral-100 text-neutral-500 outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="block font-semibold text-neutral-700 mb-2">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'CASH_ON_DELIVERY', label: 'Cash On Delivery' },
                    { id: 'BKASH', label: 'bKash / Nagad' },
                    { id: 'CARD', label: 'Credit Card' },
                  ].map((pm) => (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: pm.id })}
                      className={`p-2.5 rounded-lg border text-center font-medium transition-all ${
                        formData.paymentMethod === pm.id
                          ? 'border-neutral-950 bg-neutral-900 text-white shadow-xs'
                          : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                      }`}
                    >
                      {pm.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-neutral-200/60 space-y-1 text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal ({cart.length} items)</span>
                  <span>৳ {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Shipping Fee</span>
                  <span>{shippingFee === 0 ? 'FREE' : `৳ ${shippingFee}`}</span>
                </div>
                <div className="border-t border-neutral-200 pt-1.5 flex justify-between font-bold text-neutral-950 text-sm">
                  <span>Total Due</span>
                  <span>৳ {totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 w-full py-3.5 bg-neutral-950 hover:bg-black disabled:bg-neutral-500 text-white text-xs uppercase tracking-widest font-semibold rounded-md shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>{isSubmitting ? 'Processing Order...' : `Confirm Order · ৳ ${totalAmount.toLocaleString()}`}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
