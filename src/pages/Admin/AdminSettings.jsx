import React, { useState, useEffect } from 'react';
import { Settings, Save, ShieldCheck, Key, Truck } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const AdminSettings = () => {
  const [settings, setSettings] = useState({
    brand_name: 'LUXE ATELIER',
    business_address: '7th Floor, Atelier House, Marine Drive, Mumbai 400020',
    gst_number: '27AAAAA0000A1Z5',
    gst_rate: '12',
    shipping_fee: '0',
    free_shipping_min: '1999',
    return_window_days: '15',
    low_stock_threshold: '5',
    cod_enabled: 'true',
    sms_api_mode: 'TEST_MODE',
    email_api_mode: 'TEST_MODE'
  });

  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    api.getSettings().then((res) => {
      if (res.settingsMap) setSettings((prev) => ({ ...prev, ...res.settingsMap }));
    });
  }, []);

  const handleChange = (key, val) => {
    setSettings((prev) => ({ ...prev, [key]: val }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.saveSettings(settings);
      if (res.success) {
        addToast('System settings saved successfully!', 'success');
      } else {
        addToast(res.error || 'Failed to save settings', 'error');
      }
    } catch (e) {
      addToast('Error saving configuration', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      <div className="border-b border-obsidian-800 pb-4">
        <h2 className="text-xl font-bold text-white font-serif">Brand & Integration System Settings</h2>
        <p className="text-xs text-gray-400 mt-0.5">Configure tax GST rates, shipping thresholds, COD status, and integration API test modes</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        
        {/* Brand Details */}
        <div className="glass-panel p-6 rounded-2xl border border-obsidian-700 space-y-4">
          <h3 className="font-bold text-white uppercase tracking-wider">Brand Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 mb-1">Brand Name *</label>
              <input type="text" value={settings.brand_name} onChange={(e) => handleChange('brand_name', e.target.value)} className="w-full bg-obsidian-850 border border-obsidian-700 text-white rounded-xl p-3" />
            </div>

            <div>
              <label className="block text-gray-400 mb-1">GST Registration Number *</label>
              <input type="text" value={settings.gst_number} onChange={(e) => handleChange('gst_number', e.target.value)} className="w-full bg-obsidian-850 border border-obsidian-700 text-white rounded-xl p-3" />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-gray-400 mb-1">Business Atelier Address *</label>
              <input type="text" value={settings.business_address} onChange={(e) => handleChange('business_address', e.target.value)} className="w-full bg-obsidian-850 border border-obsidian-700 text-white rounded-xl p-3" />
            </div>
          </div>
        </div>

        {/* E-Commerce Policies */}
        <div className="glass-panel p-6 rounded-2xl border border-obsidian-700 space-y-4">
          <h3 className="font-bold text-white uppercase tracking-wider">E-Commerce & Threshold Rules</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-400 mb-1">GST Tax Rate (%)</label>
              <input type="number" value={settings.gst_rate} onChange={(e) => handleChange('gst_rate', e.target.value)} className="w-full bg-obsidian-850 border border-obsidian-700 text-white rounded-xl p-3" />
            </div>

            <div>
              <label className="block text-gray-400 mb-1">Free Shipping Order Min (₹)</label>
              <input type="number" value={settings.free_shipping_min} onChange={(e) => handleChange('free_shipping_min', e.target.value)} className="w-full bg-obsidian-850 border border-obsidian-700 text-white rounded-xl p-3" />
            </div>

            <div>
              <label className="block text-gray-400 mb-1">Low Stock Warning Limit</label>
              <input type="number" value={settings.low_stock_threshold} onChange={(e) => handleChange('low_stock_threshold', e.target.value)} className="w-full bg-obsidian-850 border border-obsidian-700 text-white rounded-xl p-3" />
            </div>
          </div>
        </div>

        {/* Integrations API Modes */}
        <div className="glass-panel p-6 rounded-2xl border border-obsidian-700 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-white uppercase tracking-wider">Integration API Test Modes</h3>
            <span className="text-[10px] text-gold-400 font-mono border border-gold-500/30 px-2 py-0.5 rounded-full bg-gold-500/10">
              [CLEARLY LABELLED TEST MODE]
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 mb-1">Bulk SMS Gateway API</label>
              <select value={settings.sms_api_mode} onChange={(e) => handleChange('sms_api_mode', e.target.value)} className="w-full bg-obsidian-850 border border-obsidian-700 text-white rounded-xl p-3">
                <option value="TEST_MODE">TEST / MOCK LOG DISPATCH MODE</option>
                <option value="PRODUCTION">LIVE SMS GATEWAY API</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-400 mb-1">Bulk Email SMTP API</label>
              <select value={settings.email_api_mode} onChange={(e) => handleChange('email_api_mode', e.target.value)} className="w-full bg-obsidian-850 border border-obsidian-700 text-white rounded-xl p-3">
                <option value="TEST_MODE">TEST / MOCK EMAIL DISPATCH MODE</option>
                <option value="PRODUCTION">LIVE SMTP GATEWAY API</option>
              </select>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs py-4 rounded-xl uppercase tracking-widest shadow-2xl flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving Settings...' : 'Save Configuration'}</span>
        </button>

      </form>

    </div>
  );
};
