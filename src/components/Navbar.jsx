import React, { useState } from 'react';
import { Search, Heart, ShoppingBag, User, Menu, X, ShieldCheck, ChevronDown, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export const Navbar = ({ onNavigate, currentTab = 'Home' }) => {
  const { user, isAdmin, logout } = useAuth();
  const { cart, setIsOpen: setCartOpen } = useCart();
  const { wishlistCount } = useWishlist();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navLinks = [
    { name: 'Home', tab: 'Home' },
    { name: 'Men', tab: 'Catalog', gender: 'Men' },
    { name: 'Women', tab: 'Catalog', gender: 'Women' },
    { name: 'Unisex', tab: 'Catalog', gender: 'Unisex' },
    { name: 'New Arrivals', tab: 'Catalog', collection: 'new' },
    { name: 'Best Sellers', tab: 'Catalog', collection: 'bestsellers' },
    { name: 'Sale', tab: 'Catalog', collection: 'sale' },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('Catalog', { search: searchQuery });
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-obsidian-950/90 backdrop-blur-md border-b border-obsidian-700/60">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-obsidian-950 via-gold-900/40 to-obsidian-950 text-gold-400 py-1.5 px-4 text-center text-xs tracking-widest font-medium border-b border-gold-500/10 flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 animate-pulse text-gold-500" />
        <span>COMPLIMENTARY EXPRESS SHIPPING ON ORDERS OVER ₹1,999</span>
        <span className="hidden md:inline">• USE CODE <strong className="text-white">WELCOME10</strong> FOR 10% OFF</span>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Mobile menu icon */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-300 hover:text-gold-400 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Brand Logo */}
          <div className="flex-shrink-0 cursor-pointer" onClick={() => onNavigate('Home')}>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-widest text-white flex items-center gap-2">
              <span className="text-gold-500 font-normal">LUXE</span> ATELIER
            </h1>
            <p className="text-[9px] tracking-[0.3em] text-gold-500/80 font-mono text-center uppercase">HAUTE COUTURE</p>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => onNavigate(link.tab, { gender: link.gender, collection: link.collection })}
                className={`text-xs tracking-widest uppercase font-medium transition-colors hover:text-gold-400 py-2 relative ${
                  currentTab === link.tab ? 'text-gold-500' : 'text-gray-300'
                }`}
              >
                {link.name}
              </button>
            ))}
          </nav>

          {/* Right Icons (Search, Wishlist, Cart, Account) */}
          <div className="flex items-center space-x-5">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative">
              <input
                type="text"
                placeholder="Search catalog..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-obsidian-850 border border-obsidian-700 text-xs text-gray-200 placeholder-gray-500 rounded-full py-1.5 pl-3 pr-8 focus:outline-none focus:border-gold-500 transition-all w-36 sm:w-48"
              />
              <button type="submit" className="absolute right-2.5 text-gray-400 hover:text-gold-400">
                <Search className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Wishlist */}
            <button
              onClick={() => onNavigate('Wishlist')}
              className="relative text-gray-300 hover:text-gold-400 transition-colors p-1"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold-500 text-obsidian-950 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Cart Drawer Toggle */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative text-gray-300 hover:text-gold-400 transition-colors p-1"
              title="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {cart.itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold-500 text-obsidian-950 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {cart.itemCount}
                </span>
              )}
            </button>

            {/* Account / Login / Admin Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center space-x-1 text-gray-300 hover:text-gold-400 transition-colors p-1"
              >
                <User className="w-5 h-5" />
                <ChevronDown className="w-3 h-3 text-gray-500" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 glass-panel rounded-xl shadow-2xl py-2 z-50 text-xs border border-obsidian-700">
                  {user ? (
                    <>
                      <div className="px-4 py-2 border-b border-obsidian-700">
                        <p className="font-semibold text-white truncate">{user.name}</p>
                        <p className="text-gray-400 truncate text-[11px]">{user.email}</p>
                      </div>

                      {isAdmin && (
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onNavigate('Admin');
                          }}
                          className="w-full text-left px-4 py-2.5 text-gold-400 font-medium hover:bg-gold-500/10 flex items-center gap-2"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>Admin Dashboard</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onNavigate('Account');
                        }}
                        className="w-full text-left px-4 py-2.5 text-gray-300 hover:bg-obsidian-800"
                      >
                        My Account & Orders
                      </button>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onNavigate('Account', { tab: 'tracking' });
                        }}
                        className="w-full text-left px-4 py-2.5 text-gray-300 hover:bg-obsidian-800"
                      >
                        Order Tracking
                      </button>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onNavigate('Account', { tab: 'returns' });
                        }}
                        className="w-full text-left px-4 py-2.5 text-gray-300 hover:bg-obsidian-800"
                      >
                        Returns & Exchanges
                      </button>

                      <div className="border-t border-obsidian-700 my-1"></div>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-4 py-2.5 text-rose-400 hover:bg-rose-500/10"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onNavigate('Auth', { mode: 'login' });
                        }}
                        className="w-full text-left px-4 py-2.5 text-gold-400 font-medium hover:bg-gold-500/10"
                      >
                        Sign In / Register
                      </button>
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onNavigate('Account', { tab: 'tracking' });
                        }}
                        className="w-full text-left px-4 py-2.5 text-gray-300 hover:bg-obsidian-800"
                      >
                        Track Guest Order
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-obsidian-950 border-b border-obsidian-700 px-4 pt-2 pb-6 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative mb-4">
            <input
              type="text"
              placeholder="Search catalog..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-obsidian-850 border border-obsidian-700 text-sm text-gray-200 rounded-lg py-2 pl-3 pr-10"
            />
            <button type="submit" className="absolute right-3 top-2.5 text-gray-400">
              <Search className="w-4 h-4" />
            </button>
          </form>

          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate(link.tab, { gender: link.gender, collection: link.collection });
                }}
                className="text-left text-xs uppercase tracking-widest font-medium text-gray-300 hover:text-gold-400 p-2 rounded bg-obsidian-850/50"
              >
                {link.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
