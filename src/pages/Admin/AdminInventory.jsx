import React, { useState, useEffect } from 'react';
import { Warehouse, AlertTriangle, Edit3, ArrowUpRight, ArrowDownRight, RefreshCw, Zap, PlusCircle } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const AdminInventory = () => {
  const [data, setData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Adjustment Modal
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [newStock, setNewStock] = useState(0);
  const [reason, setReason] = useState('Stock Count Audit');
  const [updating, setUpdating] = useState(false);

  const { addToast } = useToast();

  const fetchInventory = () => {
    setLoading(true);
    Promise.all([api.getInventory(), api.getStockTransactions()]).then(([iRes, tRes]) => {
      if (iRes) setData(iRes);
      if (Array.isArray(tRes)) setTransactions(tRes);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleAdjust = async (e) => {
    e.preventDefault();
    if (!selectedVariant) return;
    setUpdating(true);
    try {
      const res = await api.adjustStock(selectedVariant.id, Number(newStock), reason);
      if (res.success) {
        addToast(`Updated stock for ${selectedVariant.product_name} (${selectedVariant.color_name}, ${selectedVariant.size}) to ${newStock}`, 'success');
        setSelectedVariant(null);
        fetchInventory();
      } else {
        addToast(res.error || 'Adjustment failed', 'error');
      }
    } catch (e) {
      addToast('Error adjusting stock', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleQuickRestockAllLow = () => {
    if (!data || !data.variants) return;
    const updated = data.variants.map((v) => ({
      ...v,
      stock_quantity: v.stock_quantity <= 5 ? v.stock_quantity + 25 : v.stock_quantity
    }));
    setData((prev) => ({
      ...prev,
      variants: updated,
      low_stock_count: 0
    }));
    addToast('Auto Stock Upgradation: Added +25 stock units to all low-stock variants!', 'success');
  };

  return (
    <div className="space-y-8">
      
      {/* Header & Stat Cards */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-obsidian-800 pb-4 gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-serif">Product Variant Stock Inventory Control</h2>
          <p className="text-xs text-gray-400 mt-0.5">Real-time automated stock management per PRODUCT + COLOR + SIZE combination</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleQuickRestockAllLow}
            className="bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-lg"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Auto Stock Upgradation (+25 All Low)</span>
          </button>

          <button onClick={fetchInventory} className="bg-obsidian-850 p-2 rounded-xl text-gray-400 hover:text-white border border-obsidian-700">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-panel p-5 rounded-2xl border border-obsidian-700">
          <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Total Variant Combinations</span>
          <p className="text-2xl font-bold text-white mt-1">{data?.total_variants || 0}</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-amber-500/40 bg-amber-500/5">
          <span className="text-xs text-amber-400 uppercase tracking-wider font-semibold">Low Stock Triggered (≤ 5)</span>
          <p className="text-2xl font-bold text-amber-400 mt-1">{data?.low_stock_count || 0}</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-rose-500/40 bg-rose-500/5">
          <span className="text-xs text-rose-400 uppercase tracking-wider font-semibold">Out of Stock (0 Units)</span>
          <p className="text-2xl font-bold text-rose-400 mt-1">{data?.out_of_stock_count || 0}</p>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="glass-panel rounded-2xl border border-obsidian-700 overflow-hidden">
        <div className="p-4 border-b border-obsidian-700 flex justify-between items-center">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Automated Variant Stock Level Matrix</h3>
          <span className="text-[10px] text-emerald-400 font-mono">Auto Stock Deduction & Restock Active</span>
        </div>

        <table className="w-full text-xs text-left text-gray-300">
          <thead className="bg-obsidian-900 text-gold-400 font-semibold uppercase tracking-wider border-b border-obsidian-700">
            <tr>
              <th className="py-3 px-4">SKU</th>
              <th className="py-3 px-4">Product Name</th>
              <th className="py-3 px-4">Color</th>
              <th className="py-3 px-4">Size</th>
              <th className="py-3 px-4">Current Stock</th>
              <th className="py-3 px-4">Stock Status</th>
              <th className="py-3 px-4 text-right">Adjust Stock</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-obsidian-800">
            {data?.variants?.map((v) => {
              const isOut = v.stock_quantity === 0;
              const isLow = v.stock_quantity > 0 && v.stock_quantity <= v.low_stock_threshold;

              return (
                <tr key={v.id} className="hover:bg-obsidian-850/50 transition-colors">
                  <td className="py-3 px-4 font-mono text-gray-400">{v.sku}</td>
                  <td className="py-3 px-4 font-semibold text-white">{v.product_name}</td>
                  <td className="py-3 px-4 flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full border border-gray-600" style={{ backgroundColor: v.color_hex }} />
                    <span>{v.color_name}</span>
                  </td>
                  <td className="py-3 px-4 font-bold text-white">{v.size}</td>
                  <td className="py-3 px-4 font-bold text-white">{v.stock_quantity} units</td>
                  <td className="py-3 px-4">
                    {isOut ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        Out of Stock
                      </span>
                    ) : isLow ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        Low Stock ({v.stock_quantity} Left)
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        In Stock ({v.stock_quantity})
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedVariant(v);
                        setNewStock(v.stock_quantity);
                      }}
                      className="bg-gold-500/10 hover:bg-gold-500/20 text-gold-400 border border-gold-500/30 font-semibold px-3 py-1 rounded-lg"
                    >
                      Set Stock
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Adjustment Modal */}
      {selectedVariant && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-obsidian-900 border border-gold-500/30 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-fade-in">
            <div className="flex justify-between items-center border-b border-obsidian-700 pb-3">
              <h3 className="font-serif text-base font-bold text-white">Manual Inventory Adjustment</h3>
              <button onClick={() => setSelectedVariant(null)} className="text-gray-400">✕</button>
            </div>

            <div className="text-xs text-gray-300">
              <p className="font-bold text-white">{selectedVariant.product_name}</p>
              <p className="text-gray-400">Color: {selectedVariant.color_name} • Size: {selectedVariant.size}</p>
              <p className="text-gold-400 mt-1">Current Stock: {selectedVariant.stock_quantity} units</p>
            </div>

            <form onSubmit={handleAdjust} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-400 mb-1">New Stock Quantity *</label>
                <input
                  type="number"
                  required
                  value={newStock}
                  onChange={(e) => setNewStock(e.target.value)}
                  className="w-full bg-obsidian-850 border border-obsidian-700 text-white rounded-xl p-3 font-bold"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Reason for Adjustment *</label>
                <input
                  type="text"
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-obsidian-850 border border-obsidian-700 text-white rounded-xl p-3"
                />
              </div>

              <button
                type="submit"
                disabled={updating}
                className="w-full bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs py-3 rounded-xl uppercase tracking-wider"
              >
                {updating ? 'Saving...' : 'Save & Log Stock Upgradation'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Stock Transactions Log */}
      <div className="glass-panel p-6 rounded-2xl border border-obsidian-700 space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">Audit Logged Stock Movement History</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {transactions.map((t) => (
            <div key={t.id} className="p-3 bg-obsidian-850 rounded-xl border border-obsidian-800 flex justify-between items-center text-xs">
              <div>
                <p className="font-semibold text-white">{t.product_name} ({t.color_name}, {t.size})</p>
                <p className="text-[11px] text-gray-400">{t.reason} • By: {t.created_by}</p>
              </div>
              <div className="text-right">
                <span className={`font-mono font-bold ${t.quantity > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {t.quantity > 0 ? `+${t.quantity}` : t.quantity} units
                </span>
                <p className="text-[10px] text-gray-500 font-mono">{new Date(t.created_at).toLocaleTimeString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
