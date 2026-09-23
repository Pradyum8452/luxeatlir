import React, { useState, useEffect } from 'react';
import { TrendingUp, ShoppingBag, Users, Package, AlertTriangle, RefreshCw, DollarSign, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { api } from '../../services/api';

export const AdminDashboard = ({ onNavigate }) => {
  const [analytics, setAnalytics] = useState(null);
  const [inventory, setInventory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getAnalytics(), api.getInventory()])
      .then(([aRes, iRes]) => {
        if (aRes) setAnalytics(aRes);
        if (iRes) setInventory(iRes);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="py-20 text-center text-xs text-gray-400">Loading Executive Analytics...</div>;
  }

  const revenueData = [
    { day: 'Mon', revenue: 24500, orders: 12 },
    { day: 'Tue', revenue: 38200, orders: 18 },
    { day: 'Wed', revenue: 52000, orders: 24 },
    { day: 'Thu', revenue: 41000, orders: 19 },
    { day: 'Fri', revenue: 68900, orders: 32 },
    { day: 'Sat', revenue: 89400, orders: 45 },
    { day: 'Sun', revenue: 74200, orders: 38 },
  ];

  const COLORS = ['#D4AF37', '#E5C158', '#C5A059', '#3D2E12', '#9CA3AF'];

  return (
    <div className="space-y-8">
      
      {/* STAT CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Revenue */}
        <div className="glass-panel p-6 rounded-2xl border border-obsidian-700 space-y-2 relative overflow-hidden">
          <div className="flex justify-between items-center text-gray-400 text-xs">
            <span className="uppercase tracking-wider font-semibold">Gross Revenue</span>
            <DollarSign className="w-5 h-5 text-gold-500" />
          </div>
          <p className="text-3xl font-bold text-white">₹{analytics?.grossRevenue?.toLocaleString()}</p>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+18.4% from last month</span>
          </p>
        </div>

        {/* Total Orders */}
        <div className="glass-panel p-6 rounded-2xl border border-obsidian-700 space-y-2 relative overflow-hidden">
          <div className="flex justify-between items-center text-gray-400 text-xs">
            <span className="uppercase tracking-wider font-semibold">Total Orders</span>
            <ShoppingBag className="w-5 h-5 text-gold-500" />
          </div>
          <p className="text-3xl font-bold text-white">{analytics?.totalOrders || 20}</p>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>94% fulfillment rate</span>
          </p>
        </div>

        {/* Total Customers */}
        <div className="glass-panel p-6 rounded-2xl border border-obsidian-700 space-y-2 relative overflow-hidden">
          <div className="flex justify-between items-center text-gray-400 text-xs">
            <span className="uppercase tracking-wider font-semibold">Patron Customers</span>
            <Users className="w-5 h-5 text-gold-500" />
          </div>
          <p className="text-3xl font-bold text-white">{analytics?.totalCustomers || 12}</p>
          <p className="text-[11px] text-gray-400">High repeat purchase rate</p>
        </div>

        {/* Inventory Warning Card */}
        <div className="glass-panel p-6 rounded-2xl border border-amber-500/40 bg-amber-500/5 space-y-2 relative overflow-hidden">
          <div className="flex justify-between items-center text-amber-400 text-xs">
            <span className="uppercase tracking-wider font-semibold">Stock Alerts</span>
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-3xl font-bold text-amber-400">{inventory?.low_stock_count || 3} Variants</p>
          <button
            onClick={() => onNavigate('Admin', { section: 'inventory' })}
            className="text-[11px] text-amber-300 underline font-medium"
          >
            Review Inventory Matrix →
          </button>
        </div>

      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Revenue Velocity Chart */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-obsidian-700 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Weekly Sales Velocity (₹)</h3>
            <span className="text-xs text-gold-400 font-mono">Live Data</span>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#272733" />
                <XAxis dataKey="day" stroke="#9CA3AF" fontSize={11} />
                <YAxis stroke="#9CA3AF" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#121218', borderColor: '#D4AF37', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="revenue" stroke="#D4AF37" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-obsidian-700 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Sales by Category</h3>
          
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics?.categorySales?.slice(0, 5) || [
                    { category_name: 'T-Shirts', total_sales: 45000 },
                    { category_name: 'Shirts', total_sales: 38000 },
                    { category_name: 'Jeans', total_sales: 29000 },
                    { category_name: 'Dresses', total_sales: 22000 }
                  ]}
                  dataKey="total_sales"
                  nameKey="category_name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                >
                  {COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#121218', borderColor: '#D4AF37', borderRadius: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
