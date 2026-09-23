import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, PieChart, BarChart3 } from 'lucide-react';
import { api } from '../../services/api';

export const AdminRevenue = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAnalytics().then((res) => {
      if (res) setData(res);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="border-b border-obsidian-800 pb-4">
        <h2 className="text-xl font-bold text-white font-serif">Revenue & Financial Analytics Breakdown</h2>
        <p className="text-xs text-gray-400 mt-0.5">Gross revenue, net revenue, GST collected, shipping fees, and refunds summary</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-5 rounded-2xl border border-obsidian-700">
          <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Gross Revenue</span>
          <p className="text-3xl font-bold text-white mt-1">₹{data?.grossRevenue?.toLocaleString()}</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-obsidian-700">
          <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Total Discounts Given</span>
          <p className="text-3xl font-bold text-gold-400 mt-1">₹{data?.totalDiscounts?.toLocaleString()}</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-obsidian-700">
          <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">GST Collected (12%)</span>
          <p className="text-3xl font-bold text-white mt-1">₹{data?.totalTax?.toLocaleString()}</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-obsidian-700">
          <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Net Revenue</span>
          <p className="text-3xl font-bold text-emerald-400 mt-1">₹{data?.netRevenue?.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};
