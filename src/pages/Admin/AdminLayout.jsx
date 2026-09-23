import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  Warehouse,
  Users,
  CreditCard,
  TrendingUp,
  FileText,
  Truck,
  RefreshCw,
  Tag,
  Star,
  MessageSquare,
  Mail,
  BarChart3,
  FileSpreadsheet,
  Bell,
  Settings,
  ShieldAlert,
  LogOut,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export const AdminLayout = ({ activeSection = 'dashboard', onNavigate, children }) => {
  const { user, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(3);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationList, setNotificationList] = useState([]);

  useEffect(() => {
    api.getNotifications().then((res) => {
      if (res.notifications) setNotificationList(res.notifications);
      if (res.unreadCount !== undefined) setUnreadCount(res.unreadCount);
    });
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders Workflow', icon: ShoppingBag },
    { id: 'products', label: 'Products Catalog', icon: Package },
    { id: 'categories', label: 'Categories', icon: Layers },
    { id: 'inventory', label: 'Inventory Matrix', icon: Warehouse },
    { id: 'customers', label: 'Customer Directory', icon: Users },
    { id: 'payments', label: 'Payments & COD', icon: CreditCard },
    { id: 'revenue', label: 'Revenue Analytics', icon: TrendingUp },
    { id: 'invoices', label: 'Invoices Generator', icon: FileText },
    { id: 'tracking', label: 'Delivery Tracking', icon: Truck },
    { id: 'returns', label: 'Returns & Exchanges', icon: RefreshCw },
    { id: 'coupons', label: 'Coupons Engine', icon: Tag },
    { id: 'reviews', label: 'Review Moderation', icon: Star },
    { id: 'sms', label: 'Bulk SMS System', icon: MessageSquare },
    { id: 'email', label: 'Bulk Email System', icon: Mail },
    { id: 'reports', label: 'Financial Reports', icon: BarChart3 },
    { id: 'importexport', label: 'Excel Import / Export', icon: FileSpreadsheet },
    { id: 'settings', label: 'Brand Settings', icon: Settings },
    { id: 'audit', label: 'Audit Logs', icon: ShieldAlert },
  ];

  return (
    <div className="min-h-screen bg-obsidian-950 text-gray-100 flex font-sans">
      
      {/* ADMIN SIDEBAR (30 Navigation items) */}
      <aside className="w-64 bg-obsidian-900 border-r border-obsidian-800 flex flex-col justify-between flex-shrink-0">
        <div>
          {/* Logo Header */}
          <div className="p-6 border-b border-obsidian-800 cursor-pointer" onClick={() => onNavigate('Home')}>
            <h1 className="font-serif text-xl font-bold tracking-widest text-white flex items-center gap-2">
              <span className="text-gold-500 font-normal">LUXE</span> ADMIN
            </h1>
            <p className="text-[9px] tracking-[0.3em] text-gold-500/80 font-mono uppercase mt-0.5">BACK-OFFICE SUITE</p>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 max-h-[calc(100vh-160px)] overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate('Admin', { section: item.id })}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-gold-500 text-obsidian-950 font-bold shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-obsidian-850'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Info & Store Front Link */}
        <div className="p-4 border-t border-obsidian-800 space-y-2">
          <button
            onClick={() => onNavigate('Home')}
            className="w-full bg-obsidian-850 hover:bg-obsidian-800 border border-gold-500/30 text-gold-400 font-semibold text-xs py-2 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>View Storefront</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header */}
        <header className="h-16 border-b border-obsidian-800 bg-obsidian-900/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-40">
          <h2 className="font-serif text-lg font-bold text-white capitalize">
            {activeSection} Console
          </h2>

          <div className="flex items-center space-x-4">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 text-gray-400 hover:text-gold-400 transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 bg-gold-500 text-obsidian-950 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 glass-panel rounded-2xl shadow-2xl p-4 z-50 text-xs border border-obsidian-700 space-y-3">
                  <div className="flex justify-between items-center border-b border-obsidian-700 pb-2">
                    <h4 className="font-bold text-white">System Notifications</h4>
                    <span className="text-[10px] text-gold-400 font-mono">{unreadCount} Unread</span>
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {notificationList.map((n) => (
                      <div key={n.id} className="p-2.5 bg-obsidian-850 rounded-xl border border-obsidian-800">
                        <p className="font-bold text-white">{n.title}</p>
                        <p className="text-gray-400 text-[11px] mt-0.5">{n.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Admin Profile */}
            <div className="flex items-center gap-3 pl-4 border-l border-obsidian-800">
              <div className="w-8 h-8 rounded-full bg-gold-500 text-obsidian-950 font-bold font-serif flex items-center justify-center text-sm">
                A
              </div>
              <div className="hidden sm:block text-xs">
                <p className="font-bold text-white">{user?.name || 'Administrator'}</p>
                <p className="text-[10px] text-gray-500">Super Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-8">
          {children}
        </main>
      </div>

    </div>
  );
};
