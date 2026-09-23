import React, { useState } from 'react';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';

import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { ProductDetail } from './pages/ProductDetail';
import { Checkout } from './pages/Checkout';
import { OrderConfirmation } from './pages/OrderConfirmation';
import { OrderTracking } from './pages/OrderTracking';
import { Wishlist } from './pages/Wishlist';
import { Account } from './pages/Account';
import { ReturnsExchanges } from './pages/ReturnsExchanges';
import { AuthPage } from './pages/AuthPage';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { FAQ } from './pages/FAQ';
import { InvoiceView } from './components/InvoiceView';

// Admin Console Imports
import { AdminLayout } from './pages/Admin/AdminLayout';
import { AdminDashboard } from './pages/Admin/AdminDashboard';
import { AdminOrders } from './pages/Admin/AdminOrders';
import { AdminProducts } from './pages/Admin/AdminProducts';
import { AdminCategories } from './pages/Admin/AdminCategories';
import { AdminInventory } from './pages/Admin/AdminInventory';
import { AdminCustomers } from './pages/Admin/AdminCustomers';
import { AdminPayments } from './pages/Admin/AdminPayments';
import { AdminRevenue } from './pages/Admin/AdminRevenue';
import { AdminInvoices } from './pages/Admin/AdminInvoices';
import { AdminTracking } from './pages/Admin/AdminTracking';
import { AdminReturns } from './pages/Admin/AdminReturns';
import { AdminCoupons } from './pages/Admin/AdminCoupons';
import { AdminReviews } from './pages/Admin/AdminReviews';
import { AdminMarketing } from './pages/Admin/AdminMarketing';
import { AdminReports } from './pages/Admin/AdminReports';
import { AdminImportExport } from './pages/Admin/AdminImportExport';
import { AdminSettings } from './pages/Admin/AdminSettings';
import { AdminAuditLogs } from './pages/Admin/AdminAuditLogs';

const MainApp = () => {
  const [currentTab, setCurrentTab] = useState('Home');
  const [navParams, setNavParams] = useState({});

  const handleNavigate = (tab, params = {}) => {
    setCurrentTab(tab);
    setNavParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render Admin Back-Office Console layout
  if (currentTab === 'Admin') {
    const adminSection = navParams.section || 'dashboard';
    return (
      <AdminLayout activeSection={adminSection} onNavigate={handleNavigate}>
        {adminSection === 'dashboard' && <AdminDashboard onNavigate={handleNavigate} />}
        {adminSection === 'orders' && <AdminOrders onNavigate={handleNavigate} />}
        {adminSection === 'products' && <AdminProducts />}
        {adminSection === 'categories' && <AdminCategories />}
        {adminSection === 'inventory' && <AdminInventory />}
        {adminSection === 'customers' && <AdminCustomers />}
        {adminSection === 'payments' && <AdminPayments />}
        {adminSection === 'revenue' && <AdminRevenue />}
        {adminSection === 'invoices' && <AdminInvoices onNavigate={handleNavigate} />}
        {adminSection === 'tracking' && <AdminTracking />}
        {adminSection === 'returns' && <AdminReturns />}
        {adminSection === 'coupons' && <AdminCoupons />}
        {adminSection === 'reviews' && <AdminReviews />}
        {adminSection === 'sms' && <AdminMarketing />}
        {adminSection === 'email' && <AdminMarketing />}
        {adminSection === 'reports' && <AdminReports />}
        {adminSection === 'importexport' && <AdminImportExport />}
        {adminSection === 'settings' && <AdminSettings />}
        {adminSection === 'audit' && <AdminAuditLogs />}
      </AdminLayout>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian-900 text-gray-100 flex flex-col justify-between selection:bg-gold-500 selection:text-obsidian-950">
      <div>
        <Navbar onNavigate={handleNavigate} currentTab={currentTab} />
        
        <main>
          {currentTab === 'Home' && <Home onNavigate={handleNavigate} />}
          {currentTab === 'Catalog' && <Catalog initialParams={navParams} onNavigate={handleNavigate} />}
          {currentTab === 'ProductDetail' && <ProductDetail slug={navParams.slug} onNavigate={handleNavigate} />}
          {currentTab === 'Checkout' && <Checkout initialCoupon={navParams.appliedCoupon} onNavigate={handleNavigate} />}
          {currentTab === 'OrderConfirmation' && <OrderConfirmation orderData={navParams.order} onNavigate={handleNavigate} />}
          {currentTab === 'OrderTracking' && <OrderTracking initialOrderNumber={navParams.orderNumber} onNavigate={handleNavigate} />}
          {currentTab === 'Wishlist' && <Wishlist onNavigate={handleNavigate} />}
          {currentTab === 'Account' && <Account initialTab={navParams.tab || 'orders'} onNavigate={handleNavigate} />}
          {currentTab === 'ReturnsExchanges' && <ReturnsExchanges onNavigate={handleNavigate} />}
          {currentTab === 'Auth' && <AuthPage mode={navParams.mode} onNavigate={handleNavigate} />}
          {currentTab === 'Invoice' && <InvoiceView orderId={navParams.orderId} onNavigate={handleNavigate} />}
          {currentTab === 'About' && <About />}
          {currentTab === 'Contact' && <Contact />}
          {currentTab === 'FAQ' && <FAQ />}
        </main>
      </div>

      <CartDrawer onNavigate={handleNavigate} />
      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <MainApp />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
