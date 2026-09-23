import React, { useState, useEffect } from 'react';
import { ShoppingBag, Eye, CheckCircle2, AlertTriangle, Truck, Printer, Search, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const AdminOrders = ({ onNavigate }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusInput, setStatusInput] = useState('Confirmed');
  const [notesInput, setNotesInput] = useState('');
  const [override, setOverride] = useState(false);
  const [updating, setUpdating] = useState(false);

  const { addToast } = useToast();

  const fetchOrders = () => {
    setLoading(true);
    api.getAdminOrders().then((res) => {
      if (Array.isArray(res)) setOrders(res);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const WORKFLOW_STEPS = [
    'Order Placed',
    'Confirmed',
    'Processing',
    'Packed',
    'Shipped',
    'In Transit',
    'Out for Delivery',
    'Delivered',
    'Payment Collected',
    'Payment Received',
    'Cancelled'
  ];

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setUpdating(true);
    try {
      const res = await api.updateOrderStatus(selectedOrder.id, {
        status: statusInput,
        notes: notesInput,
        override
      });

      if (res.success) {
        addToast(`Order ${selectedOrder.order_number} status updated to ${statusInput}!`, 'success');
        setSelectedOrder(null);
        fetchOrders();
      } else {
        addToast(res.error || 'Status update failed', 'error');
      }
    } catch (err) {
      addToast('Failed to update order status', 'error');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex justify-between items-center border-b border-obsidian-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white font-serif">Order Management & Workflow Progression Engine</h2>
          <p className="text-xs text-gray-400 mt-0.5">Manage customer orders, track courier dispatches, and execute status state transitions</p>
        </div>
        <button onClick={fetchOrders} className="bg-obsidian-850 p-2 rounded-xl text-gray-400 hover:text-white border border-obsidian-700">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Orders Table */}
      <div className="glass-panel rounded-2xl border border-obsidian-700 overflow-hidden">
        <table className="w-full text-xs text-left text-gray-300">
          <thead className="bg-obsidian-900 text-gold-400 font-semibold uppercase tracking-wider border-b border-obsidian-700">
            <tr>
              <th className="py-3 px-4">Order Ref</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Grand Total</th>
              <th className="py-3 px-4">Payment Method</th>
              <th className="py-3 px-4">Payment Status</th>
              <th className="py-3 px-4">Delivery Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-obsidian-800">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-obsidian-850/50 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-white">{o.order_number}</td>
                <td className="py-3.5 px-4">
                  <p className="font-semibold text-white">{o.customer_name}</p>
                  <p className="text-[11px] text-gray-500">{o.customer_email}</p>
                </td>
                <td className="py-3.5 px-4 font-bold text-white">₹{o.grand_total?.toLocaleString()}</td>
                <td className="py-3.5 px-4 text-gray-400">{o.payment_method}</td>
                <td className="py-3.5 px-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    o.payment_status?.includes('Paid') || o.payment_status?.includes('Collected')
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {o.payment_status}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-gold-500/10 text-gold-400 border border-gold-500/20">
                    {o.delivery_status}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right space-x-2">
                  <button
                    onClick={() => {
                      setSelectedOrder(o);
                      setStatusInput(o.delivery_status);
                    }}
                    className="bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Manage Workflow
                  </button>
                  <button
                    onClick={() => onNavigate('Invoice', { orderId: o.id })}
                    className="bg-obsidian-850 hover:bg-obsidian-800 border border-obsidian-700 text-gray-300 p-1.5 rounded-lg"
                    title="Invoice"
                  >
                    <Printer className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Workflow Progression Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-obsidian-900 border border-gold-500/30 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-6 animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-obsidian-700 pb-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-white">Order {selectedOrder.order_number} Workflow Control</h3>
                <p className="text-xs text-gray-400">Current Status: <strong className="text-gold-400">{selectedOrder.delivery_status}</strong></p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            {/* Order Items Summary */}
            <div className="bg-obsidian-850 p-4 rounded-xl border border-obsidian-800 space-y-2 text-xs">
              <h4 className="font-bold text-white uppercase tracking-wider">Line Items</h4>
              {selectedOrder.items?.map((item) => (
                <div key={item.id} className="flex justify-between text-gray-300">
                  <span>{item.product_name} ({item.color}, {item.size}) x {item.quantity}</span>
                  <span className="font-bold text-white">₹{item.total?.toLocaleString()}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  Transition Order Status To:
                </label>
                <select
                  value={statusInput}
                  onChange={(e) => setStatusInput(e.target.value)}
                  className="w-full bg-obsidian-850 border border-obsidian-700 text-white rounded-xl p-3 focus:outline-none focus:border-gold-500"
                >
                  {WORKFLOW_STEPS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Status Log Note
                </label>
                <input
                  type="text"
                  placeholder="e.g. Package handed over to BlueDart courier facility"
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  className="w-full bg-obsidian-850 border border-obsidian-700 text-white rounded-xl p-3 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="override-check"
                  checked={override}
                  onChange={(e) => setOverride(e.target.checked)}
                  className="accent-gold-500"
                />
                <label htmlFor="override-check" className="text-gray-400 text-xs cursor-pointer">
                  Admin Override (Allow non-sequential status regression)
                </label>
              </div>

              <button
                type="submit"
                disabled={updating}
                className="w-full bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs py-3.5 rounded-xl uppercase tracking-widest shadow-xl"
              >
                {updating ? 'Updating Order Status...' : 'Apply Status Update & Dispatch Notification'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
