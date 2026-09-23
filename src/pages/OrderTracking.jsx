import React, { useState, useEffect } from 'react';
import { Search, CheckCircle2, Clock, MapPin, Truck, Package, ShieldCheck, Printer } from 'lucide-react';
import { api } from '../services/api';

export const OrderTracking = ({ initialOrderNumber = '', onNavigate }) => {
  const [orderNum, setOrderNum] = useState(initialOrderNumber);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const STEPS = [
    'Order Placed',
    'Confirmed',
    'Processing',
    'Packed',
    'Shipped',
    'In Transit',
    'Out for Delivery',
    'Delivered'
  ];

  const handleTrack = async (e) => {
    if (e) e.preventDefault();
    if (!orderNum.trim()) return;

    setLoading(true);
    setError('');
    try {
      const res = await api.trackOrder(orderNum.trim());
      if (res.order) {
        setData(res);
      } else {
        setError(res.error || 'Order not found');
        setData(null);
      }
    } catch (err) {
      setError('Failed to fetch tracking details');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderNumber) {
      handleTrack();
    }
  }, [initialOrderNumber]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
      
      <div className="text-center space-y-2">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-wide">Live Order & Delivery Tracking</h1>
        <p className="text-xs text-gray-400">Enter your Order Reference Number (e.g. ORD-2026-000001) or Tracking Code</p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleTrack} className="flex gap-2 max-w-lg mx-auto">
        <input
          type="text"
          placeholder="e.g. ORD-2026-000001 or LX-TRK-98761"
          value={orderNum}
          onChange={(e) => setOrderNum(e.target.value)}
          required
          className="flex-1 bg-obsidian-850 border border-obsidian-700 text-xs text-white uppercase placeholder-gray-500 rounded-xl px-4 py-3 focus:outline-none focus:border-gold-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs px-6 py-3 rounded-xl uppercase tracking-widest transition-colors"
        >
          {loading ? 'Searching...' : 'Track'}
        </button>
      </form>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs text-center max-w-lg mx-auto">
          {error}
        </div>
      )}

      {/* Tracking Details Card */}
      {data && data.order && (
        <div className="glass-panel p-8 rounded-2xl border border-obsidian-700 space-y-8 animate-fade-in">
          
          {/* Top Status Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-obsidian-700 pb-6 gap-4">
            <div>
              <span className="text-[10px] font-mono text-gold-500 uppercase tracking-widest">ORDER REFERENCE</span>
              <h2 className="text-2xl font-bold text-white font-mono">{data.order.order_number}</h2>
              <p className="text-xs text-gray-400 mt-1">Placed on {new Date(data.order.created_at).toLocaleDateString()}</p>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full inline-block">
                Current Status: {data.order.delivery_status}
              </span>
              <p className="text-xs text-gray-400">Tracking ID: <span className="font-mono text-white">{data.order.tracking_number}</span></p>
            </div>
          </div>

          {/* VISUAL STEP PROGRESS BAR */}
          <div className="py-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-6">Delivery Timeline Progression</h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {STEPS.map((step, idx) => {
                const currentIdx = STEPS.indexOf(data.order.delivery_status);
                const isPassed = currentIdx !== -1 && idx <= currentIdx;
                const isCurrent = currentIdx === idx;

                return (
                  <div
                    key={step}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      isCurrent
                        ? 'border-gold-500 bg-gold-500/20 text-gold-400 shadow-lg scale-105'
                        : isPassed
                        ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                        : 'border-obsidian-800 bg-obsidian-950 text-gray-600'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full flex items-center justify-center mx-auto mb-2 text-xs font-bold">
                      {isPassed ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : idx + 1}
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-wider leading-tight">{step}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Timeline Events Log */}
          {data.timeline && data.timeline.length > 0 && (
            <div className="border-t border-obsidian-700 pt-6">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Status Update Logs</h3>
              <div className="space-y-3">
                {data.timeline.map((event) => (
                  <div key={event.id} className="flex items-start gap-3 text-xs bg-obsidian-850 p-3 rounded-xl border border-obsidian-800">
                    <Clock className="w-4 h-4 text-gold-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-white">{event.status}</span>
                        <span className="text-[10px] text-gray-500 font-mono">{new Date(event.created_at).toLocaleString()}</span>
                      </div>
                      <p className="text-gray-400 mt-0.5">{event.notes}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ordered Items Summary & Print Invoice */}
          <div className="border-t border-obsidian-700 pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Ordered Items</h4>
              <p className="text-xs text-gray-400 mt-1">{data.items?.length} products • Total: ₹{data.order.grand_total?.toLocaleString()}</p>
            </div>

            <button
              onClick={() => onNavigate('Invoice', { orderId: data.order.id })}
              className="bg-obsidian-850 hover:bg-obsidian-800 border border-obsidian-700 text-gold-400 font-semibold text-xs px-4 py-2 rounded-xl flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>View & Print Invoice</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
