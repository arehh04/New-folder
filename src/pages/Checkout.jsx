import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderBusiness } from '../business/orderBusiness';
import Header from '../components/Header';
import Footer from '../components/Footer';
import OrderConfirmationModal from '../components/OrderConfirmationModal';

export default function Checkout() {
  const { cartItems, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Form State
  const [fullName, setFullName] = useState(currentUser?.fullName || 'Lady Guinevere');
  const [email, setEmail] = useState(currentUser?.email || 'patron@royalvault.com');
  const [street, setStreet] = useState('100 Sovereign Boulevard');
  const [city, setCity] = useState('London');
  const [postalCode, setPostalCode] = useState('SW1A 1AA');
  const [country, setCountry] = useState('United Kingdom');
  const [deliveryMethod, setDeliveryMethod] = useState('standard'); // 'standard' (0) or 'express' (15)
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8899');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('777');
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState('');
  const [promoError, setPromoError] = useState(null);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const deliveryFee = deliveryMethod === 'express' ? 15.00 : 0.00;
  const totals = orderBusiness.calculateOrderTotals(cartItems, appliedPromo, deliveryFee);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCodeInput.trim().toUpperCase() === 'ROYAL10') {
      setAppliedPromo('ROYAL10');
      setPromoError(null);
    } else {
      setPromoError('Invalid royal seal code. Try "ROYAL10"');
    }
  };

  const handleAuthorizeOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert('Your Royal Vault is empty. Please select artifacts first.');
      navigate('/');
      return;
    }

    setIsProcessing(true);
    try {
      const orderPayload = {
        items: cartItems,
        customer: { fullName, email },
        shippingAddress: { street, city, postalCode, country },
        deliveryMethod: deliveryMethod === 'express' ? 'Same-Day Sovereign Courier' : 'Complimentary Royal Dispatch',
        paymentMethod: 'Vault-Encrypted Card (•••• 8899)',
        subtotal: totals.subtotal,
        discount: totals.discount,
        total: totals.grandTotal
      };

      const result = await orderBusiness.processCheckoutOrder(orderPayload);
      clearCart();
      setConfirmedOrder(result);
    } catch (err) {
      alert(`⚠️ Order authorization failed: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="checkout-page min-h-screen bg-royalty-nude flex flex-col font-sans selection:bg-royalty-yellow/30 selection:text-royalty-purple">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 w-full">
        
        {/* Title */}
        <div className="mb-10 text-center sm:text-left">
          <Link to="/" className="text-xs font-bold text-slate-500 hover:text-royalty-wine uppercase tracking-widest flex items-center gap-1 mb-2">
            ← Return to Curations
          </Link>
          <h1 className="text-3xl sm:text-5xl font-black text-royalty-purple tracking-tight">
            Royal Vault Checkout
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Complete your sovereign acquisition with end-to-end 256-bit vault protection.
          </p>
        </div>

        {cartItems.length === 0 && !confirmedOrder ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-royalty-nude-dark shadow-sm">
            <span className="text-6xl mb-4 block">🛍️</span>
            <h3 className="text-2xl font-bold text-royalty-purple mb-2">Your Vault is Currently Empty</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
              Add curations to your vault before proceeding to the checkout chamber.
            </p>
            <Link
              to="/"
              className="inline-block bg-royalty-wine hover:bg-royalty-wine-hover text-white font-bold py-3.5 px-8 rounded-full text-xs uppercase tracking-widest transition-all shadow-md"
            >
              Explore Sovereign Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left Column: Forms */}
            <form onSubmit={handleAuthorizeOrder} className="lg:col-span-7 space-y-8">
              
              {/* Section 1: Patron & Destination */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-royalty-nude-dark shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-royalty-nude pb-3">
                  <span className="text-xl">👑</span>
                  <h3 className="text-base font-extrabold uppercase tracking-wider text-royalty-purple">
                    Patron & Shipping Destination
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Patron Full Name
                    </label>
                    <input 
                      type="text" 
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-royalty-nude/40 border border-royalty-nude-dark rounded-xl text-sm font-semibold text-slate-800 outline-none focus:border-royalty-yellow"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Dispatch Email
                    </label>
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 bg-royalty-nude/40 border border-royalty-nude-dark rounded-xl text-sm font-semibold text-slate-800 outline-none focus:border-royalty-yellow"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Street Address / Palace Suite
                  </label>
                  <input 
                    type="text" 
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full px-4 py-2.5 bg-royalty-nude/40 border border-royalty-nude-dark rounded-xl text-sm font-semibold text-slate-800 outline-none focus:border-royalty-yellow"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      City
                    </label>
                    <input 
                      type="text" 
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2.5 bg-royalty-nude/40 border border-royalty-nude-dark rounded-xl text-sm font-semibold text-slate-800 outline-none focus:border-royalty-yellow"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Postal Code
                    </label>
                    <input 
                      type="text" 
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full px-3 py-2.5 bg-royalty-nude/40 border border-royalty-nude-dark rounded-xl text-sm font-semibold text-slate-800 outline-none focus:border-royalty-yellow"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Country
                    </label>
                    <input 
                      type="text" 
                      required
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-3 py-2.5 bg-royalty-nude/40 border border-royalty-nude-dark rounded-xl text-sm font-semibold text-slate-800 outline-none focus:border-royalty-yellow"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Delivery Method */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-royalty-nude-dark shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-royalty-nude pb-3">
                  <span className="text-xl">⚜️</span>
                  <h3 className="text-base font-extrabold uppercase tracking-wider text-royalty-purple">
                    Courier Dispatch Speed
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label 
                    className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      deliveryMethod === 'standard' 
                        ? 'border-royalty-wine bg-royalty-nude/40 shadow-xs' 
                        : 'border-royalty-nude-dark hover:border-slate-300'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="delivery" 
                      checked={deliveryMethod === 'standard'}
                      onChange={() => setDeliveryMethod('standard')}
                      className="mt-1" 
                    />
                    <div>
                      <span className="font-extrabold text-sm text-royalty-purple block">
                        Complimentary Royal Dispatch
                      </span>
                      <span className="text-xs text-slate-500 block">2–3 Days • Velvet Wrapped</span>
                      <span className="text-xs font-bold text-emerald-700 mt-1 block">FREE ($0.00)</span>
                    </div>
                  </label>

                  <label 
                    className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      deliveryMethod === 'express' 
                        ? 'border-royalty-wine bg-royalty-nude/40 shadow-xs' 
                        : 'border-royalty-nude-dark hover:border-slate-300'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="delivery" 
                      checked={deliveryMethod === 'express'}
                      onChange={() => setDeliveryMethod('express')}
                      className="mt-1" 
                    />
                    <div>
                      <span className="font-extrabold text-sm text-royalty-purple block">
                        Same-Day Sovereign Courier
                      </span>
                      <span className="text-xs text-slate-500 block">White-Glove Armed Delivery</span>
                      <span className="text-xs font-bold text-royalty-wine mt-1 block">+$15.00</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Section 3: Vault Payment */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-royalty-nude-dark shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-royalty-nude pb-3">
                  <span className="text-xl">💳</span>
                  <h3 className="text-base font-extrabold uppercase tracking-wider text-royalty-purple">
                    Vault-Encrypted Payment
                  </h3>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Card Number (Demo Pre-filled)
                  </label>
                  <input 
                    type="text" 
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-4 py-2.5 bg-royalty-nude/40 border border-royalty-nude-dark rounded-xl text-sm font-semibold text-slate-800 outline-none focus:border-royalty-yellow"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Expiration Date
                    </label>
                    <input 
                      type="text" 
                      required
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full px-4 py-2.5 bg-royalty-nude/40 border border-royalty-nude-dark rounded-xl text-sm font-semibold text-slate-800 outline-none focus:border-royalty-yellow"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Vault CVV
                    </label>
                    <input 
                      type="text" 
                      required
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="123"
                      className="w-full px-4 py-2.5 bg-royalty-nude/40 border border-royalty-nude-dark rounded-xl text-sm font-semibold text-slate-800 outline-none focus:border-royalty-yellow"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-royalty-wine to-royalty-purple hover:brightness-110 text-white font-extrabold py-5 px-8 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 uppercase tracking-widest text-sm border border-royalty-yellow/40 transition-all cursor-pointer flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Transacting with Royal Vault Ledger...</span>
                  </>
                ) : (
                  <span>👑 Authorize Sovereign Order ({totals.formattedGrandTotal})</span>
                )}
              </button>

            </form>

            {/* Right Column: Order Ledger Summary */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Order Box */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-royalty-nude-dark shadow-sm space-y-6 sticky top-24">
                <div className="flex justify-between items-center border-b border-royalty-nude pb-4">
                  <h3 className="font-extrabold uppercase tracking-wider text-sm text-royalty-purple">
                    Vault Ledger ({cartItems.length} Artifacts)
                  </h3>
                  <Link to="/" className="text-xs font-bold text-royalty-wine hover:underline">
                    Edit Vault
                  </Link>
                </div>

                {/* Items List */}
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-xs gap-3">
                      <div className="flex items-center gap-3">
                        <img 
                          src={item.thumbnail} 
                          alt={item.displayName || item.title} 
                          className="w-10 h-10 object-contain rounded-lg bg-royalty-nude p-1 border border-royalty-nude-dark shrink-0" 
                        />
                        <div>
                          <p className="font-bold text-royalty-purple line-clamp-1 max-w-[10rem]">
                            {item.displayName || item.title}
                          </p>
                          <p className="text-[10px] text-slate-400 font-semibold">
                            Qty: {item.quantity} × ${Number(item.price).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <span className="font-extrabold text-slate-800">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Promo Code Box */}
                <div className="pt-4 border-t border-royalty-nude">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={promoCodeInput}
                      onChange={(e) => setPromoCodeInput(e.target.value)}
                      placeholder="Royal Code: ROYAL10"
                      className="flex-1 px-3 py-2 bg-royalty-nude/50 border border-royalty-nude-dark rounded-xl text-xs font-bold uppercase text-royalty-purple outline-none focus:border-royalty-yellow"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="bg-royalty-purple hover:bg-royalty-purple-dark text-royalty-yellow font-bold px-4 py-2 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {appliedPromo && (
                    <p className="text-[11px] font-bold text-emerald-700 mt-1.5 flex items-center gap-1">
                      ✨ Sovereign Discount (10%) Applied!
                    </p>
                  )}
                  {promoError && (
                    <p className="text-[11px] font-bold text-red-600 mt-1.5">
                      ⚠️ {promoError}
                    </p>
                  )}
                </div>

                {/* Calculation Breakdown */}
                <div className="pt-4 border-t border-royalty-nude space-y-2 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Artifacts Subtotal</span>
                    <span className="font-bold text-slate-800">{totals.formattedSubtotal}</span>
                  </div>
                  {totals.discount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>Sovereign Privilege (10%)</span>
                      <span>{totals.formattedDiscount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Courier Dispatch</span>
                    <span className="font-bold text-slate-800">{totals.formattedDeliveryFee}</span>
                  </div>
                  <div className="pt-3 mt-3 border-t border-royalty-nude flex justify-between text-base font-black text-royalty-purple">
                    <span>Grand Total</span>
                    <span className="text-2xl text-royalty-wine">{totals.formattedGrandTotal}</span>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

      </main>

      {/* Confirmation Modal */}
      <OrderConfirmationModal 
        order={confirmedOrder} 
        onClose={() => setConfirmedOrder(null)} 
      />

      <Footer />
    </div>
  );
}
