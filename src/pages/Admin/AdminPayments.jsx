import React, { useState, useEffect } from 'react';
import { CreditCard, Banknote, ShieldCheck } from 'lucide-react';
import { api } from '../../services/api';

export const AdminPayments = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAdminOrders().then((res) => {
      if (Array.isArray(res)) setOrders(res);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="border-b border-obsidian-800 pb-4">
        <h2 className="text-xl font-bold text-white font-serif">Payments & Cash On Delivery (COD) Journal</h2>
        <p className="text-xs text-gray-400 mt-0.5">Track online gateway transactions, UPI QR scans, and COD collection status</p>
      </div>

      <div className="glass-panel rounded-2xl border border-obsidian-700 overflow-hidden">
        <table className="w-full text-xs text-left text-gray-300">
          <thead className="bg-obsidian-900 text-gold-400 font-semibold uppercase tracking-wider border-b border-obsidian-700">
            <tr>
              <th className="py-3 px-4">Order Ref</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Payment Method</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-obsidian-800">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-obsidian-850/50">
                <td className="py-3.5 px-4 font-mono font-bold text-white">{o.order_number}</td>
                <td className="py-3.5 px-4 font-semibold text-gray-200">{o.customer_name}</td>
                <td className="py-3.5 px-4 text-gray-400">{o.payment_method}</td>
                <td className="py-3.5 px-4 font-bold text-white">₹{o.grand_total?.toLocaleString()}</td>
                <td className="py-3.5 px-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    o.payment_status?.includes('Paid') || o.payment_status?.includes('Collected')
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {o.payment_status}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-mono text-gray-500">{new Date(o.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
