import React, { useState, useEffect } from 'react';
import { Star, CheckCircle2, XCircle, Trash2 } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchReviews = () => {
    setLoading(true);
    api.getAdminReviews().then((res) => {
      if (Array.isArray(res)) setReviews(res);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    await api.updateReviewStatus(id, status);
    addToast(`Review status updated to ${status}`, 'success');
    fetchReviews();
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-obsidian-800 pb-4">
        <h2 className="text-xl font-bold text-white font-serif">Product Review Moderation Center</h2>
        <p className="text-xs text-gray-400 mt-0.5">Moderate verified buyer customer reviews and star ratings</p>
      </div>

      <div className="glass-panel rounded-2xl border border-obsidian-700 overflow-hidden">
        <table className="w-full text-xs text-left text-gray-300">
          <thead className="bg-obsidian-900 text-gold-400 font-semibold uppercase tracking-wider border-b border-obsidian-700">
            <tr>
              <th className="py-3 px-4">Product</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Rating</th>
              <th className="py-3 px-4">Review Comment</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-obsidian-800">
            {reviews.map((r) => (
              <tr key={r.id} className="hover:bg-obsidian-850/50">
                <td className="py-3.5 px-4 font-bold text-white">{r.product_name}</td>
                <td className="py-3.5 px-4 text-gray-300">{r.user_name}</td>
                <td className="py-3.5 px-4 font-bold text-gold-400">★ {r.rating}.0</td>
                <td className="py-3.5 px-4 text-gray-300 max-w-xs">{r.comment}</td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {r.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right space-x-2">
                  <button onClick={() => handleUpdateStatus(r.id, 'Approved')} className="text-emerald-400 hover:text-emerald-300 font-bold">Approve</button>
                  <button onClick={() => handleUpdateStatus(r.id, 'Hidden')} className="text-amber-400 hover:text-amber-300 font-bold">Hide</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
