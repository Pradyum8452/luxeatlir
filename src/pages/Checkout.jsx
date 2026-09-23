import React, { useState, useEffect } from 'react';
import { ShieldCheck, Truck, CreditCard, Banknote, CheckCircle2, ArrowRight, Lock, QrCode, Building2, Smartphone, AlertCircle, Copy, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

export const Checkout = ({ initialCoupon, onNavigate }) => {
  const { cart, refreshCart } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddrId, setSelectedAddrId] = useState(null);

  // Address form fields
  const [fullName, setFullName] = useState(user ? user.name : '');
  const [phone, setPhone] = useState(user ? user.phone || '' : '');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pinCode, setPinCode] = useState('');

  // Payment Selection State
  const [paymentMode, setPaymentMode] = useState('ONLINE'); // 'ONLINE' or 'COD'
  const [onlineTab, setOnlineTab] = useState('QR'); // 'QR', 'CARD', 'NETBANKING'

  // Card details
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');

  // UPI details
  const [upiId, setUpiId] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Net Banking
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      api.getProfile().then((res) => {
        if (res.addresses && res.addresses.length > 0) {
          setAddresses(res.addresses);
          const def = res.addresses.find((a) => a.is_default) || res.addresses[0];
          populateAddressForm(def);
          setSelectedAddrId(def.id);
        }
      });
    }
  }, [user]);

  const populateAddressForm = (addr) => {
    setFullName(addr.full_name);
    setPhone(addr.phone);
    setAddressLine1(addr.address_line1);
    setAddressLine2(addr.address_line2 || '');
    setCity(addr.city);
    setState(addr.state);
    setPinCode(addr.pin_code);
  };

  const discountAmount = initialCoupon ? initialCoupon.discount_amount : 0;
  const discountedSubtotal = Math.max(0, cart.subtotal - discountAmount);
  const taxAmount = Math.round(discountedSubtotal * 0.12);
  const shippingFee = cart.subtotal > 1999 ? 0 : 150;
  const grandTotal = discountedSubtotal + taxAmount + shippingFee;

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();

    if (!fullName || !phone || !addressLine1 || !city || !state || !pinCode) {
      addToast('Please complete all required shipping address fields', 'error');
      return;
    }

    if (cart.items.length === 0) {
      addToast('Your cart is empty', 'error');
      onNavigate('Catalog');
      return;
    }

    if (paymentMode === 'ONLINE' && onlineTab === 'CARD') {
      if (!cardNumber || !cardExpiry || !cardCvv) {
        addToast('Please fill in card number, expiry date, and CVV', 'error');
        return;
      }
    }

    setSubmitting(true);
    try {
      const addressObj = {
        full_name: fullName,
        phone,
        address_line1: addressLine1,
        address_line2: addressLine2,
        city,
        state,
        pin_code: pinCode
      };

      const finalPaymentMethod =
        paymentMode === 'COD'
          ? 'Cash On Delivery (COD)'
          : `Online Payment (${onlineTab === 'QR' ? 'UPI QR Code' : onlineTab === 'CARD' ? 'Credit/Debit Card' : 'Net Banking'}) [TEST MODE]`;

      const res = await api.checkout({
        address: addressObj,
        payment_method: finalPaymentMethod,
        coupon_code: initialCoupon ? initialCoupon.code : ''
      });

      if (res.success) {
        addToast(`Order ${res.order_number} placed successfully!`, 'success');
        await refreshCart();
        onNavigate('OrderConfirmation', { order: res });
      } else {
        addToast(res.error || 'Failed to place order', 'error');
      }
    } catch (err) {
      addToast('An error occurred during checkout processing', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText('luxeatelier@upi');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="border-b border-obsidian-800 pb-4 flex justify-between items-end">
        <div>
          <h1 className="font-serif text-3xl font-bold text-white tracking-wide">Checkout Concierge</h1>
          <p className="text-xs text-gray-400 mt-1">Complete your delivery address and instant payment verification</p>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-gold-400 bg-gold-500/10 border border-gold-500/30 px-3 py-1.5 rounded-full font-mono">
          <ShieldCheck className="w-4 h-4 text-gold-500" />
          <span>256-Bit Encrypted Checkout</span>
        </div>
      </div>

      <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* SHIPPING & PAYMENT SELECTION COLUMN */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Saved Addresses (if logged in) */}
          {user && addresses.length > 0 && (
            <div className="glass-panel p-6 rounded-2xl border border-obsidian-700 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Saved Delivery Locations</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => {
                      setSelectedAddrId(addr.id);
                      populateAddressForm(addr);
                    }}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedAddrId === addr.id
                        ? 'border-gold-500 bg-gold-500/10 text-white shadow-lg'
                        : 'border-obsidian-700 bg-obsidian-850 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-xs text-white">{addr.full_name}</span>
                      {addr.is_default === 1 && (
                        <span className="text-[10px] text-gold-400 font-mono">Default</span>
                      )}
                    </div>
                    <p className="text-xs leading-relaxed text-gray-300">{addr.address_line1}, {addr.city}, {addr.state} - {addr.pin_code}</p>
                    <p className="text-[11px] text-gray-500 mt-1">{addr.phone}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Address Input Form */}
          <div className="glass-panel p-6 rounded-2xl border border-obsidian-700 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Delivery Address Details</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-obsidian-850 border border-obsidian-700 text-xs text-white rounded-xl p-3 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-obsidian-850 border border-obsidian-700 text-xs text-white rounded-xl p-3 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs text-gray-400 mb-1">Street Address / House No. *</label>
                <input
                  type="text"
                  required
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  className="w-full bg-obsidian-850 border border-obsidian-700 text-xs text-white rounded-xl p-3 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs text-gray-400 mb-1">Apartment, Suite, Landmark (Optional)</label>
                <input
                  type="text"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  className="w-full bg-obsidian-850 border border-obsidian-700 text-xs text-white rounded-xl p-3 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-obsidian-850 border border-obsidian-700 text-xs text-white rounded-xl p-3 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">State *</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full bg-obsidian-850 border border-obsidian-700 text-xs text-white rounded-xl p-3 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">PIN Code *</label>
                <input
                  type="text"
                  required
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  className="w-full bg-obsidian-850 border border-obsidian-700 text-xs text-white rounded-xl p-3 focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>
          </div>

          {/* PAYMENT METHOD SELECTION ENGINE */}
          <div className="glass-panel p-6 rounded-2xl border border-obsidian-700 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-obsidian-700 pb-3 gap-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Select Payment Option</h3>
              <span className="text-[10px] text-amber-400 font-mono bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-full w-fit">
                [TEST / DEMO GATEWAY MODE]
              </span>
            </div>

            {/* Payment Primary Mode Switch (Online vs COD) */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPaymentMode('ONLINE')}
                className={`p-4 rounded-xl border flex items-center justify-center gap-3 font-semibold text-xs transition-all ${
                  paymentMode === 'ONLINE'
                    ? 'border-gold-500 bg-gold-500/15 text-gold-400 shadow-xl'
                    : 'border-obsidian-700 bg-obsidian-850 text-gray-400 hover:border-gray-600'
                }`}
              >
                <CreditCard className="w-5 h-5 text-gold-500" />
                <span>Online Payment (UPI / QR / Card)</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMode('COD')}
                className={`p-4 rounded-xl border flex items-center justify-center gap-3 font-semibold text-xs transition-all ${
                  paymentMode === 'COD'
                    ? 'border-gold-500 bg-gold-500/15 text-gold-400 shadow-xl'
                    : 'border-obsidian-700 bg-obsidian-850 text-gray-400 hover:border-gray-600'
                }`}
              >
                <Banknote className="w-5 h-5 text-gold-500" />
                <span>Cash On Delivery (COD)</span>
              </button>
            </div>

            {/* ONLINE PAYMENT OPTIONS ACCORDION/TABS */}
            {paymentMode === 'ONLINE' && (
              <div className="bg-obsidian-850 rounded-2xl border border-obsidian-700 p-5 space-y-6">
                
                {/* Sub-tabs for QR Code, Card, Net Banking */}
                <div className="flex border-b border-obsidian-700 text-xs font-semibold uppercase tracking-wider">
                  <button
                    type="button"
                    onClick={() => setOnlineTab('QR')}
                    className={`flex-1 pb-3 text-center transition-colors flex items-center justify-center gap-2 ${
                      onlineTab === 'QR' ? 'border-b-2 border-gold-500 text-gold-400' : 'text-gray-500 hover:text-white'
                    }`}
                  >
                    <QrCode className="w-4 h-4" />
                    <span>UPI & QR Code</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOnlineTab('CARD')}
                    className={`flex-1 pb-3 text-center transition-colors flex items-center justify-center gap-2 ${
                      onlineTab === 'CARD' ? 'border-b-2 border-gold-500 text-gold-400' : 'text-gray-500 hover:text-white'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Credit / Debit Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOnlineTab('NETBANKING')}
                    className={`flex-1 pb-3 text-center transition-colors flex items-center justify-center gap-2 ${
                      onlineTab === 'NETBANKING' ? 'border-b-2 border-gold-500 text-gold-400' : 'text-gray-500 hover:text-white'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Net Banking</span>
                  </button>
                </div>

                {/* TAB 1: UPI & QR CODE */}
                {onlineTab === 'QR' && (
                  <div className="space-y-6 text-center">
                    <div className="bg-obsidian-950 p-6 rounded-2xl border border-gold-500/30 max-w-xs mx-auto space-y-3 shadow-2xl">
                      <p className="text-xs font-semibold text-gold-400 uppercase tracking-widest">Scan & Pay via Any UPI App</p>
                      
                      {/* Realistic Scannable QR Code Canvas / Image */}
                      <div className="bg-white p-4 rounded-xl border border-gold-500/40 inline-block shadow-inner">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=luxeatelier@upi%26pn=LUXE%20ATELIER%20HAUTE%20COUTURE%26am=${grandTotal}%26cu=INR`}
                          alt="Luxe Atelier UPI QR Code"
                          className="w-44 h-44 object-contain mx-auto"
                        />
                      </div>

                      <div className="flex items-center justify-center gap-3 pt-1">
                        <span className="text-[10px] font-bold text-gray-300 bg-obsidian-850 px-2 py-1 rounded border border-obsidian-700">GPay</span>
                        <span className="text-[10px] font-bold text-gray-300 bg-obsidian-850 px-2 py-1 rounded border border-obsidian-700">PhonePe</span>
                        <span className="text-[10px] font-bold text-gray-300 bg-obsidian-850 px-2 py-1 rounded border border-obsidian-700">Paytm</span>
                        <span className="text-[10px] font-bold text-gray-300 bg-obsidian-850 px-2 py-1 rounded border border-obsidian-700">BHIM</span>
                      </div>

                      <p className="text-[11px] font-bold text-white">Amount to Pay: <span className="text-gold-400 font-mono">₹{grandTotal.toLocaleString()}</span></p>
                    </div>

                    {/* Copy UPI ID */}
                    <div className="flex items-center justify-center gap-2 max-w-xs mx-auto text-xs">
                      <span className="text-gray-400">Merchant VPA:</span>
                      <code className="bg-obsidian-950 text-gold-400 px-2 py-1 rounded font-mono border border-obsidian-700">luxeatelier@upi</code>
                      <button
                        type="button"
                        onClick={copyUpiId}
                        className="p-1 text-gray-400 hover:text-white"
                        title="Copy UPI VPA"
                      >
                        {copiedUpi ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB 2: CREDIT / DEBIT CARD */}
                {onlineTab === 'CARD' && (
                  <div className="space-y-4 text-xs max-w-md mx-auto">
                    {/* Visual Card Preview */}
                    <div className="bg-gradient-to-tr from-obsidian-950 via-gold-900/60 to-obsidian-950 p-5 rounded-2xl border border-gold-500/40 text-white space-y-6 shadow-2xl relative">
                      <div className="flex justify-between items-center">
                        <span className="font-serif text-sm font-bold text-gold-400 tracking-widest">LUXE ATELIER CARD</span>
                        <span className="font-mono text-xs text-gray-300">VISA / MASTERCARD</span>
                      </div>
                      <p className="font-mono text-lg tracking-widest text-center text-gold-200">
                        {cardNumber ? cardNumber.replace(/(.{4})/g, '$1 ').trim() : '•••• •••• •••• ••••'}
                      </p>
                      <div className="flex justify-between text-[11px] font-mono text-gray-300">
                        <div>
                          <p className="text-[9px] text-gray-500 uppercase">Card Holder</p>
                          <p className="font-bold">{cardName || 'VALUED PATRON'}</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-gray-500 uppercase">Expires</p>
                          <p className="font-bold">{cardExpiry || 'MM/YY'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Card Inputs */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-gray-400 mb-1">Card Number *</label>
                        <input
                          type="text"
                          maxLength={16}
                          placeholder="4532 0000 0000 0000"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                          className="w-full bg-obsidian-950 border border-obsidian-700 text-white font-mono rounded-xl p-3 focus:border-gold-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-gray-400 mb-1">Expiry Date (MM/YY) *</label>
                          <input
                            type="text"
                            placeholder="12/28"
                            maxLength={5}
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full bg-obsidian-950 border border-obsidian-700 text-white font-mono rounded-xl p-3 focus:border-gold-500"
                          />
                        </div>

                        <div>
                          <label className="block text-gray-400 mb-1">CVV / CVC *</label>
                          <input
                            type="password"
                            maxLength={4}
                            placeholder="•••"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            className="w-full bg-obsidian-950 border border-obsidian-700 text-white font-mono rounded-xl p-3 focus:border-gold-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-400 mb-1">Name on Card *</label>
                        <input
                          type="text"
                          placeholder="Alex Morgan"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          className="w-full bg-obsidian-950 border border-obsidian-700 text-white rounded-xl p-3 focus:border-gold-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: NET BANKING */}
                {onlineTab === 'NETBANKING' && (
                  <div className="space-y-4 text-xs max-w-md mx-auto">
                    <label className="block text-gray-400 mb-1">Select Bank for Net Banking *</label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full bg-obsidian-950 border border-obsidian-700 text-white rounded-xl p-3.5 focus:border-gold-500"
                    >
                      <option value="HDFC Bank">HDFC Bank</option>
                      <option value="ICICI Bank">ICICI Bank</option>
                      <option value="State Bank of India (SBI)">State Bank of India (SBI)</option>
                      <option value="Axis Bank">Axis Bank</option>
                      <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                      <option value="Yes Bank">Yes Bank</option>
                    </select>
                    <p className="text-[11px] text-gray-400">You will be redirected to {selectedBank}'s secure NetBanking portal.</p>
                  </div>
                )}

              </div>
            )}

            {paymentMode === 'COD' && (
              <div className="p-4 bg-obsidian-850 rounded-xl border border-obsidian-700 text-xs text-gray-300 space-y-2">
                <p className="font-bold text-white">Cash On Delivery (COD) Selected</p>
                <p className="text-gray-400 text-[11px] leading-relaxed">
                  Pay cash upon doorstep package delivery. Please ensure exact cash is available upon arrival of our courier executive.
                </p>
              </div>
            )}

          </div>

        </div>

        {/* ORDER SUMMARY COLUMN */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-obsidian-700 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-obsidian-700 pb-3">Order Summary ({cart.itemCount} items)</h3>
            
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {cart.items.map((item) => (
                <div key={item.cart_item_id} className="flex gap-3 text-xs">
                  <img src={item.image_url} alt={item.product_name} className="w-12 h-14 object-cover rounded-lg border border-obsidian-700" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-white line-clamp-1">{item.product_name}</h4>
                    <p className="text-[11px] text-gray-400">{item.color_name} • Size: {item.size} • Qty: {item.quantity}</p>
                    <p className="font-bold text-gold-400 mt-0.5">₹{item.total_price?.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-xs text-gray-400 pt-4 border-t border-obsidian-700">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-gray-200">₹{cart.subtotal?.toLocaleString()}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-gold-400">
                  <span>Discount ({initialCoupon?.code})</span>
                  <span>-₹{discountAmount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>GST (12%)</span>
                <span className="text-gray-200">₹{taxAmount.toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-gray-200">{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
              </div>

              <div className="flex justify-between text-base font-bold text-white pt-3 border-t border-obsidian-700">
                <span>Total Amount</span>
                <span className="text-gold-400">₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs py-4 rounded-xl uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-2xl"
            >
              <Lock className="w-4 h-4" />
              <span>{submitting ? 'Processing Payment...' : 'Confirm & Complete Order'}</span>
            </button>
          </div>
        </div>

      </form>

    </div>
  );
};
