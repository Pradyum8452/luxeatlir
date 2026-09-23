import React, { useState } from 'react';
import { X, ShoppingBag, Trash2, Plus, Minus, Tag, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

export const CartDrawer = ({ onNavigate }) => {
  const { cart, isOpen, setIsOpen, updateQuantity, removeItem } = useCart();
  const { addToast } = useToast();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);

  if (!isOpen) return null;

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      const res = await api.validateCoupon(couponCode, cart.subtotal);
      if (res.valid) {
        setAppliedCoupon(res);
        addToast(`Coupon "${res.code}" applied! Saved ₹${res.discount_amount}`, 'success');
      } else {
        addToast(res.error || 'Invalid coupon', 'error');
      }
    } catch (err) {
      addToast('Failed to validate coupon code', 'error');
    } finally {
      setCouponLoading(false);
    }
  };

  const discountAmount = appliedCoupon ? appliedCoupon.discount_amount : 0;
  const discountedSubtotal = Math.max(0, cart.subtotal - discountAmount);
  const taxAmount = Math.round(discountedSubtotal * 0.12);
  const shippingFee = cart.subtotal > 1999 ? 0 : 150;
  const grandTotal = discountedSubtotal + taxAmount + shippingFee;

  const handleProceedCheckout = () => {
    setIsOpen(false);
    onNavigate('Checkout', { appliedCoupon });
  };

  return (
    <div className="fixed inset-0 z-[999] overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-obsidian-950 border-l border-obsidian-700/80 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-6 border-b border-obsidian-700/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-gold-500" />
              <h2 className="font-serif text-xl font-bold text-white tracking-wide">Shopping Bag ({cart.itemCount})</h2>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <ShoppingBag className="w-12 h-12 text-gray-600 mx-auto" />
                <p className="text-sm font-medium text-gray-400">Your shopping bag is currently empty.</p>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onNavigate('Catalog');
                  }}
                  className="bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs px-6 py-2.5 rounded-xl uppercase tracking-wider transition-colors"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              cart.items.map((item) => (
                <div key={item.cart_item_id} className="flex gap-4 p-3 bg-obsidian-850 rounded-xl border border-obsidian-700/60 relative">
                  <img
                    src={item.image_url}
                    alt={item.product_name}
                    className="w-20 h-24 object-cover rounded-lg border border-obsidian-700"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <h4 className="text-xs font-semibold text-white line-clamp-1">{item.product_name}</h4>
                        <button onClick={() => removeItem(item.cart_item_id)} className="text-gray-500 hover:text-rose-400 p-0.5">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-1">
                        <span className="flex items-center gap-1">
                          <span className="w-2.5 h-2.5 rounded-full border border-gray-600" style={{ backgroundColor: item.color_hex }} />
                          {item.color_name}
                        </span>
                        <span>•</span>
                        <span className="font-bold text-gray-200">Size: {item.size}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-obsidian-700 rounded-lg bg-obsidian-900">
                        <button
                          onClick={() => updateQuantity(item.cart_item_id, item.quantity - 1)}
                          className="p-1 text-gray-400 hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.cart_item_id, item.quantity + 1)}
                          className="p-1 text-gray-400 hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-sm font-bold text-gold-400">₹{item.total_price?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Calculations & Checkout Button */}
          {cart.items.length > 0 && (
            <div className="p-6 border-t border-obsidian-700/80 bg-obsidian-900 space-y-4">
              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Coupon code (e.g. WELCOME10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="w-full bg-obsidian-850 border border-obsidian-700 text-xs text-white uppercase rounded-xl py-2 pl-9 pr-3 focus:outline-none focus:border-gold-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={couponLoading}
                  className="bg-obsidian-800 hover:bg-obsidian-700 text-gold-400 font-semibold text-xs px-4 py-2 rounded-xl border border-gold-500/30 transition-colors"
                >
                  Apply
                </button>
              </form>

              {appliedCoupon && (
                <div className="flex items-center justify-between text-xs text-gold-400 bg-gold-500/10 p-2 rounded-lg border border-gold-500/20">
                  <span>Coupon ({appliedCoupon.code}) Applied</span>
                  <button onClick={() => setAppliedCoupon(null)} className="text-gray-400 hover:text-white">Remove</button>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-gray-400 pt-2 border-t border-obsidian-800">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="text-gray-200">₹{cart.subtotal?.toLocaleString()}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-gold-400">
                    <span>Coupon Discount</span>
                    <span>-₹{discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Estimated GST (12%)</span>
                  <span className="text-gray-200">₹{taxAmount.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-gray-200">{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
                </div>

                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-obsidian-800">
                  <span>Grand Total</span>
                  <span className="text-gold-400">₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleProceedCheckout}
                className="w-full bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs py-3.5 rounded-xl uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-xl"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-500">
                <ShieldCheck className="w-3.5 h-3.5 text-gold-500" />
                <span>256-Bit Encrypted Secure Checkout</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
