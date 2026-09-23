import React, { useState, useEffect } from 'react';
import { User, Package, MapPin, RefreshCw, LogOut, ShieldCheck, Printer, Truck, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { OrderTracking } from './OrderTracking';
import { ReturnsExchanges } from './ReturnsExchanges';
import { useToast } from '../context/ToastContext';

export const Account = ({ initialTab = 'orders', onNavigate }) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Address Modal State
  const [showAddAddr, setShowAddAddr] = useState(false);
  const [fullName, setFullName] = useState(user ? user.name : '');
  const [phone, setPhone] = useState(user ? user.phone || '' : '');
  const [line1, setLine1] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pin, setPin] = useState('');

  const { addToast } = useToast();

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const [pRes, oRes] = await Promise.all([api.getProfile(), api.getMyOrders()]);
      if (pRes.addresses) setAddresses(pRes.addresses);
      if (Array.isArray(oRes)) setOrders(oRes);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfileData();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Authentication Required</h2>
        <p className="text-xs text-gray-400">Please sign in to access your customer account dashboard.</p>
        <button
          onClick={() => onNavigate('Auth', { mode: 'login' })}
          className="bg-gold-500 text-obsidian-950 font-bold text-xs px-6 py-3 rounded-xl uppercase tracking-wider"
        >
          Sign In
        </button>
      </div>
    );
  }

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await api.saveAddress({
        full_name: fullName,
        phone,
        address_line1: line1,
        city,
        state,
        pin_code: pin,
        is_default: addresses.length === 0 ? 1 : 0
      });
      if (res.addresses) {
        setAddresses(res.addresses);
        addToast('Address saved successfully!', 'success');
        setShowAddAddr(false);
      }
    } catch (e) {
      addToast('Failed to save address', 'error');
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      const res = await api.deleteAddress(id);
      if (res.addresses) {
        setAddresses(res.addresses);
        addToast('Address removed', 'info');
      }
    } catch (e) {
      addToast('Failed to delete address', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Account Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-obsidian-700 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gold-500 text-obsidian-950 font-bold font-serif text-2xl flex items-center justify-center">
            {user.name.charAt(0)}
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-white">{user.name}</h1>
            <p className="text-xs text-gray-400">{user.email} • Patron Member</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="bg-obsidian-850 hover:bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-semibold px-4 py-2 rounded-xl transition-colors flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-obsidian-800 space-x-6 text-xs uppercase tracking-wider font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'orders' ? 'border-gold-500 text-gold-400' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('tracking')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'tracking' ? 'border-gold-500 text-gold-400' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Order Tracking</span>
        </button>

        <button
          onClick={() => setActiveTab('returns')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'returns' ? 'border-gold-500 text-gold-400' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <RefreshCw className="w-4 h-4" />
          <span>Returns & Exchanges</span>
        </button>

        <button
          onClick={() => setActiveTab('addresses')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'addresses' ? 'border-gold-500 text-gold-400' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Address Book ({addresses.length})</span>
        </button>
      </div>

      {/* TAB CONTENT AREAS */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="py-16 text-center text-xs text-gray-500 glass-panel rounded-2xl">
              No orders placed yet. Explore our haute couture collection!
            </div>
          ) : (
            orders.map((o) => (
              <div key={o.id} className="glass-panel p-6 rounded-2xl border border-obsidian-700 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-obsidian-700 pb-3 gap-2">
                  <div>
                    <span className="font-mono font-bold text-gold-400 text-sm">{o.order_number}</span>
                    <p className="text-[11px] text-gray-400">Placed on {new Date(o.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                      {o.delivery_status}
                    </span>
                    <span className="text-xs font-bold text-white">₹{o.grand_total?.toLocaleString()}</span>
                  </div>
                </div>

                {/* Items */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {o.items?.map((item) => (
                    <div key={item.id} className="flex gap-3 text-xs bg-obsidian-850 p-2.5 rounded-xl border border-obsidian-800">
                      <div className="flex-1">
                        <p className="font-bold text-white line-clamp-1">{item.product_name}</p>
                        <p className="text-[11px] text-gray-400">{item.color} • Size: {item.size} • Qty: {item.quantity}</p>
                      </div>
                      <span className="font-bold text-gold-400">₹{item.total?.toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2 border-t border-obsidian-800">
                  <button
                    onClick={() => {
                      setActiveTab('tracking');
                    }}
                    className="bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Track Package</span>
                  </button>

                  <button
                    onClick={() => onNavigate('Invoice', { orderId: o.id })}
                    className="bg-obsidian-850 hover:bg-obsidian-800 text-gray-300 font-semibold text-xs px-4 py-2 rounded-xl border border-obsidian-700 flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5 text-gold-400" />
                    <span>Invoice</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'tracking' && <OrderTracking onNavigate={onNavigate} />}

      {activeTab === 'returns' && <ReturnsExchanges onNavigate={onNavigate} />}

      {activeTab === 'addresses' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Your Shipping Addresses</h3>
            <button
              onClick={() => setShowAddAddr(!showAddAddr)}
              className="bg-gold-500 text-obsidian-950 font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Address</span>
            </button>
          </div>

          {showAddAddr && (
            <form onSubmit={handleSaveAddress} className="glass-panel p-6 rounded-2xl border border-obsidian-700 space-y-4 text-xs">
              <h4 className="font-bold text-white">Add Delivery Location</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input type="text" placeholder="Full Name *" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="bg-obsidian-850 border border-obsidian-700 text-white rounded-xl p-3" />
                <input type="tel" placeholder="Mobile Number *" required value={phone} onChange={(e) => setPhone(e.target.value)} className="bg-obsidian-850 border border-obsidian-700 text-white rounded-xl p-3" />
                <input type="text" placeholder="Street Address *" required value={line1} onChange={(e) => setLine1(e.target.value)} className="sm:col-span-2 bg-obsidian-850 border border-obsidian-700 text-white rounded-xl p-3" />
                <input type="text" placeholder="City *" required value={city} onChange={(e) => setCity(e.target.value)} className="bg-obsidian-850 border border-obsidian-700 text-white rounded-xl p-3" />
                <input type="text" placeholder="State *" required value={state} onChange={(e) => setState(e.target.value)} className="bg-obsidian-850 border border-obsidian-700 text-white rounded-xl p-3" />
                <input type="text" placeholder="PIN Code *" required value={pin} onChange={(e) => setPin(e.target.value)} className="bg-obsidian-850 border border-obsidian-700 text-white rounded-xl p-3" />
              </div>
              <button type="submit" className="bg-gold-500 text-obsidian-950 font-bold text-xs px-6 py-2.5 rounded-xl uppercase">Save Address</button>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div key={addr.id} className="p-4 bg-obsidian-850 rounded-xl border border-obsidian-700 space-y-2 text-xs relative">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white">{addr.full_name}</span>
                  <button onClick={() => handleDeleteAddress(addr.id)} className="text-gray-500 hover:text-rose-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-gray-300">{addr.address_line1}, {addr.city}, {addr.state} - {addr.pin_code}</p>
                <p className="text-gray-500">{addr.phone}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
