import React, { useState, useEffect } from 'react';
import { Layers, Plus, Trash2, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = () => {
    setLoading(true);
    api.getCategories().then((res) => {
      if (Array.isArray(res)) setCategories(res);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-obsidian-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white font-serif">Category & Taxonomy Management</h2>
          <p className="text-xs text-gray-400 mt-0.5">Organize fashion collections into high-level categories</p>
        </div>
        <button onClick={fetchCategories} className="bg-obsidian-850 p-2 rounded-xl text-gray-400 hover:text-white border border-obsidian-700">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((c) => (
          <div key={c.id} className="glass-panel p-4 rounded-2xl border border-obsidian-700 flex items-center gap-3">
            <img src={c.image_url} alt={c.name} className="w-12 h-14 object-cover rounded-xl border border-obsidian-700" />
            <div>
              <h4 className="font-bold text-sm text-white">{c.name}</h4>
              <p className="text-[11px] text-gold-400">{c.gender}</p>
              <p className="text-[10px] text-gray-500 font-mono">/{c.slug}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
