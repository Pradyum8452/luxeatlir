import React from 'react';
import { HelpCircle } from 'lucide-react';

export const FAQ = () => {
  const faqs = [
    { q: "What is the return and exchange window?", a: "We offer a complimentary 15-day exchange and return policy for all unworn garments with original tags intact." },
    { q: "How do I choose the correct size?", a: "Refer to our master Size Guide available on every product page for precise Chest, Waist, Shoulder, and Sleeve measurements." },
    { q: "Are all products 100% authentic haute couture?", a: "Yes. Every piece is handcrafted in limited batches using 300 GSM French Terry, Kurabo Japanese selvedge denim, and mulberry silk." },
    { q: "How long does shipping take?", a: "Orders placed before 2:00 PM are dispatched same-day. Delivery takes 3-5 business days across India." }
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="font-serif text-3xl font-bold text-white tracking-wide">Frequently Asked Questions</h1>
        <p className="text-xs text-gray-400">Everything you need to know about Luxe Atelier policies</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="glass-panel p-5 rounded-2xl border border-obsidian-700 space-y-2 text-xs">
            <h3 className="font-bold text-white text-sm">{faq.q}</h3>
            <p className="text-gray-300 leading-relaxed font-light">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
