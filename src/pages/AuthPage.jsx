import React, { useState } from 'react';
import { Lock, Mail, User, Phone, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const AuthPage = ({ mode = 'login', onNavigate }) => {
  const [isLogin, setIsLogin] = useState(mode === 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, register } = useAuth();
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isLogin) {
        const res = await login(email, password);
        if (res.success) {
          addToast(`Welcome back, ${res.user.name}!`, 'success');
          if (res.user.role === 'admin') {
            onNavigate('Admin');
          } else {
            onNavigate('Home');
          }
        } else {
          addToast(res.error || 'Login failed', 'error');
        }
      } else {
        const res = await register({ name, email, password, phone });
        if (res.success) {
          addToast('Account created successfully!', 'success');
          onNavigate('Home');
        } else {
          addToast(res.error || 'Registration failed', 'error');
        }
      }
    } catch (err) {
      addToast('Authentication error', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="font-serif text-3xl font-bold text-white tracking-widest uppercase">
          <span className="text-gold-500 font-normal">LUXE</span> ATELIER
        </h1>
        <p className="text-xs text-gray-400">Sign in to access your bespoke customer portal & order history</p>
      </div>

      <div className="glass-panel p-8 rounded-2xl border border-obsidian-700 shadow-2xl space-y-6">
        {/* Toggle Login vs Register */}
        <div className="flex border-b border-obsidian-700 text-xs font-semibold uppercase tracking-wider">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 pb-3 text-center transition-colors ${
              isLogin ? 'border-b-2 border-gold-500 text-gold-400' : 'text-gray-500 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 pb-3 text-center transition-colors ${
              !isLogin ? 'border-b-2 border-gold-500 text-gold-400' : 'text-gray-500 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {!isLogin && (
            <div>
              <label className="block text-gray-400 mb-1">Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-obsidian-850 border border-obsidian-700 text-white rounded-xl py-2.5 pl-9 pr-3 focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-gray-400 mb-1">Email Address *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-obsidian-850 border border-obsidian-700 text-white rounded-xl py-2.5 pl-9 pr-3 focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-gray-400 mb-1">Mobile Phone *</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-obsidian-850 border border-obsidian-700 text-white rounded-xl py-2.5 pl-9 pr-3 focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-gray-400 mb-1">Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-obsidian-850 border border-obsidian-700 text-white rounded-xl py-2.5 pl-9 pr-3 focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs py-3.5 rounded-xl uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-xl"
          >
            <span>{isLogin ? 'Sign In to Account' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Credentials Reminder */}
        <div className="pt-4 border-t border-obsidian-700/60 text-[11px] text-gray-400 space-y-1">
          <p className="font-semibold text-gold-400 uppercase tracking-wider">Demo Credentials:</p>
          <p>• Admin: <code className="text-white">admin@luxeatelier.com</code> / <code className="text-white">admin123</code></p>
          <p>• Customer: <code className="text-white">alex.morgan@gmail.com</code> / <code className="text-white">user123</code></p>
        </div>
      </div>
    </div>
  );
};
