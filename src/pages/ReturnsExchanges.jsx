import React, { useState, useEffect } from 'react';
import { RefreshCw, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

export const ReturnsExchanges = ({ onNavigate }) => {
  const [orders, setOrders] = useState([]);
  const [myReturns, setMyReturns] = useState([]);
  const [loading, setLoading] = useState(true);

  // Return Form State
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [type, setType] = useState('Size Exchange');
  const [reason, setReason] = useState('Need different size');
  const [submitting, setSubmitting] = useState(false);

  const { addToast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [oList, rList] = await Promise.all([api.getMyOrders(), api.getMyReturns()]);
      if (Array.isArray(oList)) setOrders(oList.filter((o) => o.delivery_status === 'Delivered'));
      if (Array.isArray(rList)) setMyReturns(rList);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOrderId) {
      addToast('Please select an eligible delivered order', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.submitReturn({
        order_id: Number(selectedOrderId),
        type,
        reason,
        items: [{ name: 'Returned Item' }]
      });

      if (res.success) {
        addToast(`Return request ${res.return_number} submitted!`, 'success');
        setSelectedOrderId('');
        await fetchData();
      } else {
        addToast(res.error || 'Failed to submit return request', 'error');
      }
    } catch (e) {
      addToast('Error submitting request', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
      <div className="border-b border-obsidian-800 pb-4">
        <h1 className="font-serif text-3xl font-bold text-white tracking-wide">Returns & Size Exchange Concierge</h1>
        <p className="text-xs text-gray-400 mt-1">15-day complimentary doorstep pickup and quality-controlled exchanges</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Request Form */}
        <div className="glass-panel p-6 rounded-2xl border border-obsidian-700 space-y-5">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Submit Return / Exchange</h3>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-gray-400 mb-1">Select Delivered Order *</label>
              <select
                value={selectedOrderId}
                onChange={(e) => setSelectedOrderId(e.target.value)}
                required
                className="w-full bg-obsidian-850 border border-obsidian-700 text-white rounded-xl p-3 focus:outline-none focus:border-gold-500"
              >
                <option value="">-- Select Order --</option>
                {orders.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.order_number} (₹{o.grand_total})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-400 mb-1">Request Type *</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-obsidian-850 border border-obsidian-700 text-white rounded-xl p-3 focus:outline-none focus:border-gold-500"
              >
                <option value="Size Exchange">Size Exchange</option>
                <option value="Color Exchange">Color Exchange</option>
                <option value="Return for Refund">Return for Refund</option>
                <option value="Wrong Product Received">Wrong Product Received</option>
                <option value="Defective / Damaged Item">Defective / Damaged Item</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-400 mb-1">Reason for Return *</label>
              <textarea
                required
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Explain reason for return or size needed..."
                className="w-full bg-obsidian-850 border border-obsidian-700 text-white rounded-xl p-3 focus:outline-none focus:border-gold-500"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs py-3.5 rounded-xl uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{submitting ? 'Submitting...' : 'Submit Request'}</span>
            </button>
          </form>
        </div>

        {/* Existing Returns Log */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Your Return Requests ({myReturns.length})</h3>

          {myReturns.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-500 bg-obsidian-850 rounded-2xl border border-obsidian-800">
              No active return or exchange requests.
            </div>
          ) : (
            <div className="space-y-3">
              {myReturns.map((r) => (
                <div key={r.id} className="p-4 bg-obsidian-850 rounded-xl border border-obsidian-700/80 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-gold-400">{r.return_number}</span>
                    <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full text-[10px]">
                      {r.status}
                    </span>
                  </div>
                  <p className="text-gray-300">Order: <span className="font-mono text-white">{r.order_number}</span> • {r.type}</p>
                  <p className="text-gray-400 text-[11px] italic">"{r.reason}"</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
