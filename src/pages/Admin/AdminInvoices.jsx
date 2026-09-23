import React, { useState, useEffect } from 'react';
import { FileText, Printer, Search } from 'lucide-react';
import { api } from '../../services/api';

export const AdminInvoices = ({ onNavigate }) => {
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
        <h2 className="text-xl font-bold text-white font-serif">Tax Invoices Generator & Archive</h2>
        <p className="text-xs text-gray-400 mt-0.5">View and print official GST tax invoices for customer purchases</p>
      </div>

      <div className="glass-panel rounded-2xl border border-obsidian-700 overflow-hidden">
        <table className="w-full text-xs text-left text-gray-300">
          <thead className="bg-obsidian-900 text-gold-400 font-semibold uppercase tracking-wider border-b border-obsidian-700">
            <tr>
              <th className="py-3 px-4">Invoice Number</th>
              <th className="py-3 px-4">Order Ref</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Invoice Amount</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-obsidian-800">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-obsidian-850/50">
                <td className="py-3.5 px-4 font-mono font-bold text-white">INV-2026-{String(o.id).padStart(6, '0')}</td>
                <td className="py-3.5 px-4 font-mono text-gray-400">{o.order_number}</td>
                <td className="py-3.5 px-4 font-semibold text-gray-200">{o.customer_name}</td>
                <td className="py-3.5 px-4 font-bold text-gold-400">₹{o.grand_total?.toLocaleString()}</td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => onNavigate('Invoice', { orderId: o.id })}
                    className="bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 ml-auto"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>View Invoice</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
