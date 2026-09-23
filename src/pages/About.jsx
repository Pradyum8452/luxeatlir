import React from 'react';
import { Award, ShieldCheck, Sparkles, Heart } from 'lucide-react';

export const About = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-16">
      <div className="text-center space-y-3">
        <span className="text-xs font-mono text-gold-500 tracking-[0.3em] uppercase">HAUTE COUTURE HOUSE</span>
        <h1 className="font-serif text-4xl sm:text-6xl font-extrabold text-white">THE STORY OF LUXE ATELIER</h1>
        <p className="text-sm text-gray-400 max-w-2xl mx-auto font-light">
          An independent D2C luxury house built on the values of architectural minimalism, rare organic textiles, and precision tailoring.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="relative h-96 rounded-2xl overflow-hidden border border-gold-500/30 shadow-2xl">
          <img src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800" alt="Atelier" className="w-full h-full object-cover" />
        </div>

        <div className="space-y-4 text-xs text-gray-300 leading-relaxed font-light">
          <h2 className="font-serif text-2xl font-bold text-white">Our Brand Vision & Philosophy</h2>
          <p>
            Luxe Atelier was founded to bridge the gap between bespoke Italian tailoring and modern streetwear silhouettes. We reject fast fashion throwaway culture, preferring instead to craft garments that age gracefully alongside their wearer.
          </p>
          <p>
            From our 300 GSM combed French Terry cotton tees to our Kurabo shuttle-loom Japanese selvedge denim, every fabric is selected for its tactile richness and longevity.
          </p>
        </div>
      </div>
    </div>
  );
};
