import React, { useState, useEffect } from 'react';
import { BarChart3, Download, FileSpreadsheet } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const AdminReports = () => {
  const [data, setData] = useState(null);
  const { addToast } = useToast();

  useEffect(() => {
    api.getAnalytics().then((res) => {
      if (res) setData(res);
    });
  }, []);

  const handleExport = (type) => {
    window.open(`/api/reports/export/${type}`, '_blank');
    addToast(`Exporting ${type} report to Excel (.xlsx)...`, 'info');
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-obsidian-800 pb-4">
        <h2 className="text-xl font-bold text-white font-serif">Financial & Executive Reports Console</h2>
        <p className="text-xs text-gray-400 mt-0.5">Download real-time financial, revenue, and inventory ledgers in .xlsx format</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-obsidian-700 space-y-3">
          <FileSpreadsheet className="w-8 h-8 text-gold-500" />
          <h3 className="font-bold text-white">Full Orders Ledger Report</h3>
          <p className="text-xs text-gray-400">Export complete order transaction details, addresses, and payment statuses.</p>
          <button onClick={() => handleExport('orders')} className="w-full bg-gold-500 text-obsidian-950 font-bold text-xs py-2.5 rounded-xl uppercase">Download .XLSX</button>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-obsidian-700 space-y-3">
          <FileSpreadsheet className="w-8 h-8 text-gold-500" />
          <h3 className="font-bold text-white">Products Catalog & Pricing Report</h3>
          <p className="text-xs text-gray-400">Export product SKUs, pricing, discount percentages, and star ratings.</p>
          <button onClick={() => handleExport('products')} className="w-full bg-gold-500 text-obsidian-950 font-bold text-xs py-2.5 rounded-xl uppercase">Download .XLSX</button>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-obsidian-700 space-y-3">
          <FileSpreadsheet className="w-8 h-8 text-gold-500" />
          <h3 className="font-bold text-white">Inventory Variant Matrix Ledger</h3>
          <p className="text-xs text-gray-400">Export current variant stock levels (Product + Color + Size).</p>
          <button onClick={() => handleExport('inventory')} className="w-full bg-gold-500 text-obsidian-950 font-bold text-xs py-2.5 rounded-xl uppercase">Download .XLSX</button>
        </div>
      </div>
    </div>
  );
};
