import React, { useState, useEffect } from 'react';
import { Printer, ArrowLeft, Download, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';

export const InvoiceView = ({ orderId, onNavigate }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      api.getInvoice(orderId).then((res) => {
        if (res.order) setData(res);
        setLoading(false);
      });
    }
  }, [orderId]);

  if (loading) {
    return <div className="py-20 text-center text-xs text-gray-400">Generating invoice document...</div>;
  }

  if (!data) {
    return <div className="py-20 text-center text-xs text-rose-400">Invoice not found for order #{orderId}</div>;
  }

  const { invoice_number, invoice_date, brand, customer, order, items } = data;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      
      {/* Top Bar (Hide during print) */}
      <div className="flex justify-between items-center print:hidden">
        <button onClick={() => onNavigate('Account')} className="text-xs text-gold-400 hover:underline flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Account</span>
        </button>

        <button
          onClick={handlePrint}
          className="bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs px-6 py-2.5 rounded-xl uppercase tracking-wider flex items-center gap-2 shadow-lg"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Download PDF Invoice</span>
        </button>
      </div>

      {/* Printable Invoice Container */}
      <div id="printable-invoice" className="bg-white text-gray-900 p-8 sm:p-12 rounded-2xl shadow-2xl border border-gray-200 text-xs space-y-8 print:p-0 print:border-none print:shadow-none">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b border-gray-300 pb-6">
          <div>
            <h1 className="font-serif text-3xl font-extrabold tracking-widest text-black">
              LUXE ATELIER
            </h1>
            <p className="text-[10px] tracking-widest text-gray-500 uppercase font-mono mt-0.5">HAUTE COUTURE PVT. LTD.</p>
            <p className="text-gray-600 mt-2 max-w-xs">{brand.address}</p>
            <p className="text-gray-600 font-mono mt-1">GSTIN: {brand.gst}</p>
          </div>

          <div className="text-right">
            <span className="text-lg font-bold text-gray-900 uppercase font-mono">TAX INVOICE</span>
            <p className="font-mono text-gray-700 font-semibold mt-1">#{invoice_number}</p>
            <p className="text-gray-500 mt-1">Date: {new Date(invoice_date).toLocaleDateString()}</p>
            <p className="text-gray-500">Payment: <strong className="text-gray-900">{order.payment_method}</strong></p>
          </div>
        </div>

        {/* Customer & Billing Address */}
        <div className="grid grid-cols-2 gap-8 bg-gray-50 p-4 rounded-xl border border-gray-200">
          <div>
            <h3 className="font-bold text-gray-900 uppercase tracking-wider text-[11px] mb-1">Billed & Shipped To:</h3>
            <p className="font-semibold text-gray-900">{customer.name}</p>
            <p className="text-gray-600">{customer.address.address_line1} {customer.address.address_line2}</p>
            <p className="text-gray-600">{customer.address.city}, {customer.address.state} - {customer.address.pin_code}</p>
            <p className="text-gray-600 mt-1">Phone: {customer.phone}</p>
          </div>

          <div className="text-right">
            <h3 className="font-bold text-gray-900 uppercase tracking-wider text-[11px] mb-1">Order Summary:</h3>
            <p className="text-gray-600">Order Ref: <strong className="font-mono text-gray-900">{order.order_number}</strong></p>
            <p className="text-gray-600">Status: <strong className="text-emerald-700">{order.payment_status}</strong></p>
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-900 text-gray-900 uppercase font-semibold text-[10px] tracking-wider">
              <th className="py-2">Item Description</th>
              <th className="py-2">Color</th>
              <th className="py-2">Size</th>
              <th className="py-2 text-right">Price</th>
              <th className="py-2 text-center">Qty</th>
              <th className="py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id} className="py-3">
                <td className="py-3 font-semibold text-gray-900">{item.product_name}</td>
                <td className="py-3 text-gray-600">{item.color}</td>
                <td className="py-3 text-gray-600 font-bold">{item.size}</td>
                <td className="py-3 text-right text-gray-700">₹{item.price?.toLocaleString()}</td>
                <td className="py-3 text-center text-gray-700">{item.quantity}</td>
                <td className="py-3 text-right font-bold text-gray-900">₹{item.total?.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Total Calculations */}
        <div className="flex justify-end pt-4 border-t border-gray-300">
          <div className="w-64 space-y-1.5 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{order.subtotal?.toLocaleString()}</span>
            </div>

            {order.discount_amount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Discount ({order.coupon_code})</span>
                <span>-₹{order.discount_amount?.toLocaleString()}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>GST (12%)</span>
              <span>₹{order.tax_amount?.toLocaleString()}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span>{order.shipping_fee === 0 ? 'FREE' : `₹${order.shipping_fee}`}</span>
            </div>

            <div className="flex justify-between text-base font-extrabold text-black pt-2 border-t-2 border-gray-900">
              <span>Grand Total</span>
              <span>₹{order.grand_total?.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="pt-8 border-t border-gray-200 text-[10px] text-gray-500 text-center">
          <p>This is a computer-generated tax invoice issued by Luxe Atelier Pvt. Ltd.</p>
          <p className="mt-1">For support or 15-day return concierge, contact concierge@luxeatelier.com</p>
        </div>

      </div>

    </div>
  );
};
