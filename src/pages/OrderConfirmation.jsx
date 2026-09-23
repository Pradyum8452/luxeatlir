import React from 'react';
import { CheckCircle, Truck, FileText, ArrowRight, Package } from 'lucide-react';

export const OrderConfirmation = ({ orderData, onNavigate }) => {
  if (!orderData) {
    return (
      <div className="py-20 text-center text-gray-400">
        <h2 className="text-xl font-bold text-white">No Order Data Found</h2>
        <button onClick={() => onNavigate('Home')} className="mt-4 text-gold-400 hover:underline">Return Home</button>
      </div>
    );
  }

  const { order_number, grand_total, tracking_number } = orderData;

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-8">
      <div className="w-20 h-20 bg-gold-500/10 border border-gold-500/30 rounded-full flex items-center justify-center mx-auto text-gold-500 animate-bounce-short">
        <CheckCircle className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-mono text-gold-500 tracking-[0.3em] uppercase">PURCHASE SUCCESSFUL</span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white">Thank You for Your Order</h1>
        <p className="text-sm text-gray-400 max-w-lg mx-auto">
          Your order has been confirmed and submitted to our atelier team for precision packing and express dispatch.
        </p>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-obsidian-700 text-left space-y-4 max-w-md mx-auto">
        <div className="flex justify-between items-center text-xs border-b border-obsidian-700 pb-3">
          <span className="text-gray-400">Order Reference</span>
          <span className="font-mono font-bold text-gold-400">{order_number}</span>
        </div>

        <div className="flex justify-between items-center text-xs border-b border-obsidian-700 pb-3">
          <span className="text-gray-400">Total Paid</span>
          <span className="font-bold text-white">₹{grand_total?.toLocaleString()}</span>
        </div>

        <div className="flex justify-between items-center text-xs border-b border-obsidian-700 pb-3">
          <span className="text-gray-400">Tracking Code</span>
          <span className="font-mono text-gray-200">{tracking_number}</span>
        </div>

        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-400">Estimated Delivery</span>
          <span className="font-medium text-emerald-400">5-7 Business Days</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
        <button
          onClick={() => onNavigate('OrderTracking', { orderNumber: order_number })}
          className="bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs uppercase tracking-widest px-6 py-3.5 rounded-xl shadow-xl flex items-center gap-2"
        >
          <Truck className="w-4 h-4" />
          <span>Track Order Live</span>
        </button>

        <button
          onClick={() => onNavigate('Catalog')}
          className="bg-obsidian-850 hover:bg-obsidian-800 text-white font-bold text-xs uppercase tracking-widest px-6 py-3.5 rounded-xl border border-obsidian-700 flex items-center gap-2"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
