import React, { useState } from 'react';
import { FileSpreadsheet, Upload, Download, AlertCircle, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const AdminImportExport = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const { addToast } = useToast();

  const handleImport = async (e) => {
    e.preventDefault();
    if (!file) {
      addToast('Please select an Excel (.xlsx) file to upload', 'error');
      return;
    }

    setUploading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.uploadProductsExcel(formData);
      if (res.success) {
        setResult(res);
        addToast(`Excel import complete! Processed ${res.success_count} products.`, 'success');
      } else {
        addToast(res.error || 'Excel import failed', 'error');
      }
    } catch (e) {
      addToast('Failed to process Excel file', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleExport = (type) => {
    window.open(`/api/reports/export/${type}`, '_blank');
    addToast(`Exporting ${type} report to .xlsx format...`, 'info');
  };

  return (
    <div className="space-y-10">
      
      <div className="border-b border-obsidian-800 pb-4">
        <h2 className="text-xl font-bold text-white font-serif">Excel Import & Export Engine (.xlsx)</h2>
        <p className="text-xs text-gray-400 mt-0.5">Bulk import product catalog & inventory levels or export real-time business reports</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* EXCEL IMPORT BOX */}
        <div className="glass-panel p-6 rounded-2xl border border-obsidian-700 space-y-4">
          <div className="flex items-center gap-2 border-b border-obsidian-700 pb-3">
            <Upload className="w-5 h-5 text-gold-500" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Bulk Import Products via Excel</h3>
          </div>

          <form onSubmit={handleImport} className="space-y-4 text-xs">
            <div className="border-2 border-dashed border-obsidian-700 hover:border-gold-500 rounded-xl p-6 text-center space-y-2 cursor-pointer bg-obsidian-850">
              <FileSpreadsheet className="w-10 h-10 text-gold-500 mx-auto" />
              <p className="font-semibold text-white">Select Excel File (.xlsx)</p>
              <p className="text-[11px] text-gray-400">Supported columns: SKU, Name, Price, MRP, Stock</p>
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={(e) => setFile(e.target.files[0])}
                className="mt-2 text-xs text-gray-400 mx-auto"
              />
            </div>

            <button
              type="submit"
              disabled={uploading || !file}
              className="w-full bg-gold-500 hover:bg-gold-400 disabled:bg-obsidian-800 disabled:text-gray-600 text-obsidian-950 font-bold text-xs py-3.5 rounded-xl uppercase tracking-widest shadow-lg"
            >
              {uploading ? 'Validating Row-by-Row...' : 'Start Excel Import'}
            </button>
          </form>

          {/* Validation Result Display */}
          {result && (
            <div className="p-4 bg-obsidian-850 rounded-xl border border-obsidian-700 space-y-2 text-xs">
              <div className="flex justify-between items-center text-emerald-400 font-bold">
                <span>✓ Processed {result.total_rows} Rows</span>
                <span>{result.success_count} Successful</span>
              </div>
              {result.error_count > 0 && (
                <div className="pt-2 border-t border-obsidian-800 text-rose-400 space-y-1">
                  <p className="font-bold">Row Validation Errors ({result.error_count}):</p>
                  {result.errors.map((err, idx) => (
                    <p key={idx} className="text-[11px]">• Row {err.row}: {err.error}</p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* EXCEL EXPORT BOX */}
        <div className="glass-panel p-6 rounded-2xl border border-obsidian-700 space-y-4">
          <div className="flex items-center gap-2 border-b border-obsidian-700 pb-3">
            <Download className="w-5 h-5 text-gold-500" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Export Real-Time Reports to .xlsx</h3>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <button
              onClick={() => handleExport('orders')}
              className="p-4 bg-obsidian-850 hover:bg-obsidian-800 border border-obsidian-700 rounded-xl text-left space-y-1"
            >
              <FileSpreadsheet className="w-5 h-5 text-gold-400" />
              <p className="font-bold text-white">Orders Report</p>
              <p className="text-[11px] text-gray-500">Order number, total, status</p>
            </button>

            <button
              onClick={() => handleExport('products')}
              className="p-4 bg-obsidian-850 hover:bg-obsidian-800 border border-obsidian-700 rounded-xl text-left space-y-1"
            >
              <FileSpreadsheet className="w-5 h-5 text-gold-400" />
              <p className="font-bold text-white">Products Report</p>
              <p className="text-[11px] text-gray-500">SKU, pricing, rating</p>
            </button>

            <button
              onClick={() => handleExport('inventory')}
              className="p-4 bg-obsidian-850 hover:bg-obsidian-800 border border-obsidian-700 rounded-xl text-left space-y-1"
            >
              <FileSpreadsheet className="w-5 h-5 text-gold-400" />
              <p className="font-bold text-white">Inventory Matrix</p>
              <p className="text-[11px] text-gray-500">Product + Color + Size stock</p>
            </button>

            <button
              onClick={() => handleExport('customers')}
              className="p-4 bg-obsidian-850 hover:bg-obsidian-800 border border-obsidian-700 rounded-xl text-left space-y-1"
            >
              <FileSpreadsheet className="w-5 h-5 text-gold-400" />
              <p className="font-bold text-white">Customer History</p>
              <p className="text-[11px] text-gray-500">Patron spend & order counts</p>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
