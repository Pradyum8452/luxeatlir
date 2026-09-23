import React, { useState } from 'react';
import { Mail, Instagram, Facebook, Twitter, ShieldCheck, Truck, RefreshCw, Award } from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

export const Footer = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { addToast } = useToast();

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    try {
      const res = await api.subscribeNewsletter({ email });
      addToast(res.message || 'Thank you for joining our newsletter!', 'success');
      setEmail('');
    } catch (e) {
      addToast('Failed to subscribe', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="bg-obsidian-950 text-gray-400 border-t border-obsidian-700/80 pt-16 pb-12">
      {/* Brand Value Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-8 border-y border-obsidian-800">
          <div className="flex items-center gap-4">
            <Truck className="w-8 h-8 text-gold-500 flex-shrink-0" />
            <div>
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Express Shipping</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">Complimentary over ₹1,999</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <RefreshCw className="w-8 h-8 text-gold-500 flex-shrink-0" />
            <div>
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Hassle-Free Returns</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">15-day exchange guarantee</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Award className="w-8 h-8 text-gold-500 flex-shrink-0" />
            <div>
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Bespeak Craftsmanship</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">100% organic luxury fabrics</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ShieldCheck className="w-8 h-8 text-gold-500 flex-shrink-0" />
            <div>
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Secure Payment</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">Encrypted UPI & Card Gateways</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-5 gap-10">
        
        {/* Brand Column */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="font-serif text-2xl font-bold tracking-widest text-white">
            <span className="text-gold-500 font-normal">LUXE</span> ATELIER
          </h2>
          <p className="text-xs leading-relaxed text-gray-400 pr-6">
            Luxe Atelier is an independent D2C haute couture house combining timeless Italian tailoring, Japanese shuttle-loom denim, and organic silks for the modern aesthetic purist.
          </p>
          <div className="pt-2">
            <p className="text-xs font-semibold text-white uppercase tracking-wider mb-2">Join the Community</p>
            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
              <input
                type="email"
                placeholder="Enter your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-obsidian-850 border border-obsidian-700 text-xs text-white placeholder-gray-500 rounded-lg px-3 py-2 flex-grow focus:outline-none focus:border-gold-500"
              />
              <button
                type="submit"
                disabled={submitting}
                className="bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-semibold text-xs px-4 py-2 rounded-lg transition-colors flex-shrink-0"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-white uppercase tracking-widest">Collections</h3>
          <ul className="space-y-2 text-xs">
            <li><button onClick={() => onNavigate('Catalog', { gender: 'Men' })} className="hover:text-gold-400 transition-colors">Men's Apparel</button></li>
            <li><button onClick={() => onNavigate('Catalog', { gender: 'Women' })} className="hover:text-gold-400 transition-colors">Women's Couture</button></li>
            <li><button onClick={() => onNavigate('Catalog', { gender: 'Unisex' })} className="hover:text-gold-400 transition-colors">Unisex Essentials</button></li>
            <li><button onClick={() => onNavigate('Catalog', { collection: 'bestsellers' })} className="hover:text-gold-400 transition-colors">Best Sellers</button></li>
            <li><button onClick={() => onNavigate('Catalog', { collection: 'new' })} className="hover:text-gold-400 transition-colors">New Season Arrivals</button></li>
          </ul>
        </div>

        {/* Support */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-white uppercase tracking-widest">Client Services</h3>
          <ul className="space-y-2 text-xs">
            <li><button onClick={() => onNavigate('Account', { tab: 'tracking' })} className="hover:text-gold-400 transition-colors">Order Tracking</button></li>
            <li><button onClick={() => onNavigate('Account', { tab: 'returns' })} className="hover:text-gold-400 transition-colors">Returns & Exchanges</button></li>
            <li><button onClick={() => onNavigate('FAQ')} className="hover:text-gold-400 transition-colors">Size Guide & Care</button></li>
            <li><button onClick={() => onNavigate('Contact')} className="hover:text-gold-400 transition-colors">Contact Concierge</button></li>
            <li><button onClick={() => onNavigate('FAQ')} className="hover:text-gold-400 transition-colors">Frequently Asked Questions</button></li>
          </ul>
        </div>

        {/* Corporate */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-white uppercase tracking-widest">Atelier House</h3>
          <ul className="space-y-2 text-xs">
            <li><button onClick={() => onNavigate('About')} className="hover:text-gold-400 transition-colors">Our Brand Vision</button></li>
            <li><button onClick={() => onNavigate('About')} className="hover:text-gold-400 transition-colors">Craftsmanship & Sustainability</button></li>
            <li><button onClick={() => onNavigate('Contact')} className="hover:text-gold-400 transition-colors">Flagship Stores</button></li>
            <li><button onClick={() => onNavigate('FAQ')} className="hover:text-gold-400 transition-colors">Privacy Policy & Terms</button></li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-obsidian-800 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
        <p>© 2026 LUXE ATELIER PVT. LTD. ALL RIGHTS RESERVED.</p>
        <div className="flex items-center space-x-6 text-gray-400">
          <a href="#instagram" className="hover:text-gold-400 transition-colors"><Instagram className="w-4 h-4" /></a>
          <a href="#facebook" className="hover:text-gold-400 transition-colors"><Facebook className="w-4 h-4" /></a>
          <a href="#twitter" className="hover:text-gold-400 transition-colors"><Twitter className="w-4 h-4" /></a>
        </div>
      </div>
    </footer>
  );
};
