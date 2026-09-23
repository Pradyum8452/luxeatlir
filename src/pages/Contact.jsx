import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const { addToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    addToast('Thank you for contacting Concierge! We will respond within 2 hours.', 'success');
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      <div className="text-center space-y-2">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-wide">Client Concierge Contact</h1>
        <p className="text-xs text-gray-400">Our fashion advisors and support team are available 24/7</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-panel p-6 rounded-2xl border border-obsidian-700 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Atelier Headquarters</h3>
          <div className="space-y-3 text-xs text-gray-300">
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-gold-500" />
              <span>7th Floor, Atelier House, Marine Drive, Mumbai 400020</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-gold-500" />
              <span>concierge@luxeatelier.com</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-gold-500" />
              <span>+91 (022) 8877-6655</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-2xl border border-obsidian-700 space-y-4 text-xs">
          <div>
            <label className="block text-gray-400 mb-1">Your Name</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-obsidian-850 border border-obsidian-700 text-white rounded-xl p-3" />
          </div>
          <div>
            <label className="block text-gray-400 mb-1">Your Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-obsidian-850 border border-obsidian-700 text-white rounded-xl p-3" />
          </div>
          <div>
            <label className="block text-gray-400 mb-1">Message</label>
            <textarea required rows={4} value={message} onChange={(e) => setMessage(e.target.value)} className="w-full bg-obsidian-850 border border-obsidian-700 text-white rounded-xl p-3" />
          </div>
          <button type="submit" className="w-full bg-gold-500 text-obsidian-950 font-bold text-xs py-3.5 rounded-xl uppercase tracking-wider">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};
