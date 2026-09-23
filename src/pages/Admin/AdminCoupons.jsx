import React, { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [code, setCode] = useState('');
  const [type, setType] = useState('percentage');
  const [val, setVal] = useState('');
  const [minOrder, setMinOrder] = useState('1000');
  const [maxDiscount, setMaxDiscount] = useState('2000');
  const [usageLimit, setUsageLimit] = useState('500');

  const { addToast } = useToast();

  const fetchCoupons = () => {
    setLoading(true);
    api.getAdminCoupons().then((res) => {
      if (Array.isArray(res)) setCoupons(res);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!code || !val) return;

    try {
      const res = await api.createCoupon({
        code,
        type,
        discount_value: Number(val),
        min_order_amount: Number(minOrder),
        max_discount_amount: Number(maxDiscount),
        usage_limit: Number(usageLimit)
      });

      if (res.success) {
        addToast(`Coupon "${code.toUpperCase()}" created!`, 'success');
        setCode('');
        setVal('');
        fetchCoupons();
      } else {
        addToast(res.error || 'Failed to create coupon', 'error');
      }
    } catch (e) {
      addToast('Error creating coupon', 'error');
    }
  };

  const handleDelete = async (id) => {
    await api.deleteCoupon(id);
    addToast('Coupon deleted', 'info');
    fetchCoupons();
  };

  return (
    <div className="space-y-8">
      
      <div className="border-b border-obsidian-800 pb-4">
        <h2 className="text-xl font-bold text-white font-serif">Coupons & Promotional Discount Engine</h2>
        <p className="text-xs text-gray-400 mt-0.5">Create percentage, flat discount, festival, and minimum-order promotion codes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Creator Form */}
        <div className="glass-panel p-6 rounded-2xl border border-obsidian-700 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Plus className="w-4 h-4 text-gold-500" />
            <span>Create New Coupon</span>
          </h3>

          <form onSubmit={handleCreate} className="space-y-4 text-xs">
            <div>
              <label className="block text-gray-400 mb-1">Coupon Code *</label>
              <input
                type="text"
                required
                placeholder="e.g. FESTIVE20"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="w-full bg-obsidian-850 border border-obsidian-700 text-white rounded-xl p-3 uppercase font-mono font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-400 mb-1">Discount Type *</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-obsidian-850 border border-obsidian-700 text-white rounded-xl p-3"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="flat">Flat Amount (₹)</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Value (% or ₹) *</label>
                <input
                  type="number"
                  required
                  placeholder="20"
                  value={val}
                  onChange={(e) => setVal(e.target.value)}
                  className="w-full bg-obsidian-850 border border-obsidian-700 text-white rounded-xl p-3"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-400 mb-1">Min Order (₹)</label>
                <input
                  type="number"
                  value={minOrder}
                  onChange={(e) => setMinOrder(e.target.value)}
                  className="w-full bg-obsidian-850 border border-obsidian-700 text-white rounded-xl p-3"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Max Discount Cap (₹)</label>
                <input
                  type="number"
                  value={maxDiscount}
                  onChange={(e) => setMaxDiscount(e.target.value)}
                  className="w-full bg-obsidian-850 border border-obsidian-700 text-white rounded-xl p-3"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs py-3.5 rounded-xl uppercase tracking-widest shadow-xl"
            >
              Activate Coupon
            </button>
          </form>
        </div>

        {/* Coupons Table */}
        <div className="lg:col-span-2 glass-panel rounded-2xl border border-obsidian-700 overflow-hidden">
          <table className="w-full text-xs text-left text-gray-300">
            <thead className="bg-obsidian-900 text-gold-400 font-semibold uppercase tracking-wider border-b border-obsidian-700">
              <tr>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Value</th>
                <th className="py-3 px-4">Min Order</th>
                <th className="py-3 px-4">Times Used</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-obsidian-800">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-obsidian-850/50">
                  <td className="py-3.5 px-4 font-mono font-bold text-white">{c.code}</td>
                  <td className="py-3.5 px-4 capitalize text-gray-400">{c.type}</td>
                  <td className="py-3.5 px-4 font-bold text-gold-400">
                    {c.type === 'percentage' ? `${c.discount_value}%` : `₹${c.discount_value}`}
                  </td>
                  <td className="py-3.5 px-4 text-gray-300">₹{c.min_order_amount}</td>
                  <td className="py-3.5 px-4 font-mono text-gray-400">{c.times_used} / {c.usage_limit}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button onClick={() => handleDelete(c.id)} className="text-rose-400 hover:text-rose-300">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
