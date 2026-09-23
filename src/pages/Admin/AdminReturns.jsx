import React, { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle2, XCircle, Truck, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const AdminReturns = () => {
  const [returnsList, setReturnsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReturn, setSelectedReturn] = useState(null);

  const [statusInput, setStatusInput] = useState('Approved');
  const [pickupDate, setPickupDate] = useState('');
  const [qcPassed, setQcPassed] = useState(true);
  const [notes, setNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const { addToast } = useToast();

  const fetchReturns = () => {
    setLoading(true);
    api.getAdminReturns().then((res) => {
      if (Array.isArray(res)) setReturnsList(res);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedReturn) return;
    setUpdating(true);
    try {
      const res = await api.updateReturnStatus(selectedReturn.id, {
        status: statusInput,
        pickup_date: pickupDate,
        quality_check_passed: qcPassed,
        notes
      });

      if (res.success) {
        addToast(`Return ${selectedReturn.return_number} updated to ${statusInput}!`, 'success');
        setSelectedReturn(null);
        fetchReturns();
      } else {
        addToast(res.error || 'Update failed', 'error');
      }
    } catch (e) {
      addToast('Error updating return status', 'error');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex justify-between items-center border-b border-obsidian-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white font-serif">Returns & Size Exchange Approval Center</h2>
          <p className="text-xs text-gray-400 mt-0.5">Approve returns, schedule pickup logistics, perform quality inspection restock</p>
        </div>
        <button onClick={fetchReturns} className="bg-obsidian-850 p-2 rounded-xl text-gray-400 hover:text-white border border-obsidian-700">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="glass-panel rounded-2xl border border-obsidian-700 overflow-hidden">
        <table className="w-full text-xs text-left text-gray-300">
          <thead className="bg-obsidian-900 text-gold-400 font-semibold uppercase tracking-wider border-b border-obsidian-700">
            <tr>
              <th className="py-3 px-4">Return Ref</th>
              <th className="py-3 px-4">Order Ref</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Reason</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-obsidian-800">
            {returnsList.map((r) => (
              <tr key={r.id} className="hover:bg-obsidian-850/50 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-gold-400">{r.return_number}</td>
                <td className="py-3.5 px-4 font-mono text-gray-300">{r.order_number}</td>
                <td className="py-3.5 px-4 font-semibold text-white">{r.customer_name}</td>
                <td className="py-3.5 px-4 text-gray-300">{r.type}</td>
                <td className="py-3.5 px-4 text-gray-400 max-w-xs truncate">{r.reason}</td>
                <td className="py-3.5 px-4">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {r.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => {
                      setSelectedReturn(r);
                      setStatusInput(r.status);
                    }}
                    className="bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold px-3 py-1.5 rounded-lg"
                  >
                    Process Return
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedReturn && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-obsidian-900 border border-gold-500/30 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-fade-in">
            <div className="flex justify-between items-center border-b border-obsidian-700 pb-3">
              <h3 className="font-serif text-lg font-bold text-white">Process Return #{selectedReturn.return_number}</h3>
              <button onClick={() => setSelectedReturn(null)} className="text-gray-400">✕</button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-400 mb-1">Return Workflow Status</label>
                <select
                  value={statusInput}
                  onChange={(e) => setStatusInput(e.target.value)}
                  className="w-full bg-obsidian-850 border border-obsidian-700 text-white rounded-xl p-3"
                >
                  <option value="Approved">Approved</option>
                  <option value="Pickup Scheduled">Pickup Scheduled</option>
                  <option value="Product Received">Product Received</option>
                  <option value="Quality Check Passed">Quality Check Passed (Restock Inventory)</option>
                  <option value="Quality Check Failed">Quality Check Failed (Damaged)</option>
                  <option value="Refund Processed">Refund Processed</option>
                  <option value="Completed">Completed</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Pickup Scheduled Date</label>
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full bg-obsidian-850 border border-obsidian-700 text-white rounded-xl p-3"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="qc-pass"
                  checked={qcPassed}
                  onChange={(e) => setQcPassed(e.target.checked)}
                  className="accent-gold-500"
                />
                <label htmlFor="qc-pass" className="text-gray-300">
                  Quality Inspection Passed (Automatically restock item into inventory matrix)
                </label>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Status Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Courier pickup assigned to Delhivery"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-obsidian-850 border border-obsidian-700 text-white rounded-xl p-3"
                />
              </div>

              <button
                type="submit"
                disabled={updating}
                className="w-full bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs py-3.5 rounded-xl uppercase tracking-wider"
              >
                {updating ? 'Saving...' : 'Update Return & Execute Inventory Action'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
