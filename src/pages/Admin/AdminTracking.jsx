import React, { useState, useEffect } from 'react';
import { Truck, MapPin, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';

export const AdminTracking = () => {
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
        <h2 className="text-xl font-bold text-white font-serif">Delivery & Logistics Tracking Console</h2>
        <p className="text-xs text-gray-400 mt-0.5">Courier tracking ID assignments and express dispatch logistics</p>
      </div>

      <div className="glass-panel rounded-2xl border border-obsidian-700 overflow-hidden">
        <table className="w-full text-xs text-left text-gray-300">
          <thead className="bg-obsidian-900 text-gold-400 font-semibold uppercase tracking-wider border-b border-obsidian-700">
            <tr>
              <th className="py-3 px-4">Tracking ID</th>
              <th className="py-3 px-4">Order Ref</th>
              <th className="py-3 px-4">Destination City</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Est. Delivery</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-obsidian-800">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-obsidian-850/50">
                <td className="py-3.5 px-4 font-mono font-bold text-gold-400">{o.tracking_number}</td>
                <td className="py-3.5 px-4 font-mono text-gray-400">{o.order_number}</td>
                <td className="py-3.5 px-4 text-gray-200">{o.address?.city || 'Mumbai'}</td>
                <td className="py-3.5 px-4 font-bold text-emerald-400">{o.delivery_status}</td>
                <td className="py-3.5 px-4 text-gray-400">{o.estimated_delivery || '5-7 Days'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
