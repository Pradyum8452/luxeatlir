import React, { useState } from 'react';
import { X, Ruler } from 'lucide-react';

export const SizeGuideModal = ({ onClose }) => {
  const [unit, setUnit] = useState('inches');

  const measurements = [
    { size: 'XS', chestIn: '34-36', chestCm: '86-91', waistIn: '28-30', waistCm: '71-76', shoulderIn: '16.5', shoulderCm: '42', lengthIn: '27', lengthCm: '68.5', sleeveIn: '24.5', sleeveCm: '62' },
    { size: 'S', chestIn: '36-38', chestCm: '91-96', waistIn: '30-32', waistCm: '76-81', shoulderIn: '17.2', shoulderCm: '43.5', lengthIn: '28', lengthCm: '71', sleeveIn: '25.0', sleeveCm: '63.5' },
    { size: 'M', chestIn: '38-40', chestCm: '96-101', waistIn: '32-34', waistCm: '81-86', shoulderIn: '18.0', shoulderCm: '45.5', lengthIn: '29', lengthCm: '73.5', sleeveIn: '25.5', sleeveCm: '65' },
    { size: 'L', chestIn: '40-42', chestCm: '101-106', waistIn: '34-36', waistCm: '86-91', shoulderIn: '18.8', shoulderCm: '47.5', lengthIn: '30', lengthCm: '76', sleeveIn: '26.0', sleeveCm: '66' },
    { size: 'XL', chestIn: '42-44', chestCm: '106-111', waistIn: '36-38', waistCm: '91-96', shoulderIn: '19.5', shoulderCm: '49.5', lengthIn: '31', lengthCm: '78.5', sleeveIn: '26.5', sleeveCm: '67.5' },
    { size: 'XXL', chestIn: '44-46', chestCm: '111-116', waistIn: '38-40', waistCm: '96-101', shoulderIn: '20.2', shoulderCm: '51.5', lengthIn: '32', lengthCm: '81', sleeveIn: '27.0', sleeveCm: '68.5' },
    { size: 'XXXL', chestIn: '46-48', chestCm: '116-121', waistIn: '40-42', waistCm: '101-106', shoulderIn: '21.0', shoulderCm: '53.5', lengthIn: '33', lengthCm: '83.5', sleeveIn: '27.5', sleeveCm: '70' },
  ];

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-obsidian-900 border border-gold-500/30 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative animate-fade-in max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white p-1">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4 text-gold-500">
          <Ruler className="w-5 h-5" />
          <h2 className="font-serif text-xl font-bold text-white tracking-wide">LUXE ATELIER — Master Size Guide</h2>
        </div>

        <p className="text-xs text-gray-400 mb-6">
          All measurements are taken directly from the garment laid flat. For an oversized fit as styled in our campaign imagery, we recommend selecting your true size.
        </p>

        {/* Unit Toggle */}
        <div className="flex justify-end mb-4">
          <div className="bg-obsidian-850 p-1 rounded-lg border border-obsidian-700 flex text-xs">
            <button
              onClick={() => setUnit('inches')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                unit === 'inches' ? 'bg-gold-500 text-obsidian-950 font-bold' : 'text-gray-400 hover:text-white'
              }`}
            >
              Inches (in)
            </button>
            <button
              onClick={() => setUnit('cm')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                unit === 'cm' ? 'bg-gold-500 text-obsidian-950 font-bold' : 'text-gray-400 hover:text-white'
              }`}
            >
              Centimeters (cm)
            </button>
          </div>
        </div>

        {/* Size Table */}
        <div className="overflow-x-auto border border-obsidian-700 rounded-xl mb-6">
          <table className="w-full text-xs text-left text-gray-300">
            <thead className="bg-obsidian-850 text-gold-400 font-semibold uppercase tracking-wider border-b border-obsidian-700">
              <tr>
                <th className="py-3 px-4">Size</th>
                <th className="py-3 px-4">Chest</th>
                <th className="py-3 px-4">Waist</th>
                <th className="py-3 px-4">Shoulder</th>
                <th className="py-3 px-4">Length</th>
                <th className="py-3 px-4">Sleeve</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-obsidian-800">
              {measurements.map((m) => (
                <tr key={m.size} className="hover:bg-obsidian-850/50">
                  <td className="py-2.5 px-4 font-bold text-white">{m.size}</td>
                  <td className="py-2.5 px-4">{unit === 'inches' ? m.chestIn : m.chestCm}</td>
                  <td className="py-2.5 px-4">{unit === 'inches' ? m.waistIn : m.waistCm}</td>
                  <td className="py-2.5 px-4">{unit === 'inches' ? m.shoulderIn : m.shoulderCm}</td>
                  <td className="py-2.5 px-4">{unit === 'inches' ? m.lengthIn : m.lengthCm}</td>
                  <td className="py-2.5 px-4">{unit === 'inches' ? m.sleeveIn : m.sleeveCm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Measuring Tips */}
        <div className="bg-obsidian-850 p-4 rounded-xl border border-obsidian-800 text-xs text-gray-400 space-y-1.5">
          <h4 className="font-semibold text-white uppercase tracking-wider">How to Measure Yourself:</h4>
          <p>• <strong>Chest:</strong> Measure around the fullest part of your chest, keeping tape horizontal.</p>
          <p>• <strong>Waist:</strong> Measure around natural waistline, keeping tape comfortably loose.</p>
          <p>• <strong>Shoulder:</strong> Measure from edge of shoulder socket to edge of opposite shoulder socket across back.</p>
        </div>
      </div>
    </div>
  );
};
