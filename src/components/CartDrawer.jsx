import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

export default function CartDrawer() {
  const { 
    cartItems, 
    isCartOpen, 
    closeCart, 
    removeFromCart, 
    updateQuantity, 
    getCartSubtotal,
    clearCart 
  } = useCart();
  
  const navigate = useNavigate();

  const subtotal = getCartSubtotal();
  const freeShippingThreshold = 150;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal.raw);
  const shippingProgress = Math.min(100, (subtotal.raw / freeShippingThreshold) * 100);

  if (!isCartOpen) return null;

  const handleProceedToCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={closeCart}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300 cursor-pointer"
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-royalty-nude-dark transform transition-all duration-300 ease-in-out">
          
          {/* Drawer Header */}
          <div className="px-6 py-5 bg-royalty-purple text-white flex items-center justify-between border-b border-royalty-yellow/30">
            <div className="flex items-center gap-3">
              <span className="text-2xl text-royalty-yellow">👑</span>
              <div>
                <h2 className="text-lg font-extrabold uppercase tracking-widest text-royalty-yellow">
                  Royal Vault
                </h2>
                <p className="text-xs text-royalty-nude/80 font-medium">
                  {cartItems.length} curated {cartItems.length === 1 ? 'treasure' : 'treasures'}
                </p>
              </div>
            </div>
            <button 
              onClick={closeCart}
              className="text-royalty-nude/80 hover:text-white text-2xl font-light w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              ✕
            </button>
          </div>

          {/* Complimentary Shipping Progress Bar */}
          <div className="bg-royalty-purple-dark px-6 py-3 border-b border-royalty-purple">
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-royalty-nude/90">
                {amountToFreeShipping === 0 
                  ? '✨ Complimentary Royal Dispatch Unlocked!' 
                  : `Add $${amountToFreeShipping.toFixed(2)} for Free Royal Delivery`}
              </span>
              <span className="text-royalty-yellow">{Math.round(shippingProgress)}%</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full gold-shimmer transition-all duration-500 rounded-full"
                style={{ width: `${shippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 rounded-full bg-royalty-nude flex items-center justify-center text-4xl mb-4 border border-royalty-nude-dark">
                  ⚜️
                </div>
                <h3 className="text-xl font-bold text-royalty-purple mb-2">Your Vault is Empty</h3>
                <p className="text-slate-500 text-sm max-w-xs mb-8">
                  Acquire sovereign artifacts and premium essentials from our curated collection.
                </p>
                <button
                  onClick={closeCart}
                  className="bg-royalty-wine hover:bg-royalty-wine-hover text-white font-bold py-3 px-8 rounded-full text-xs uppercase tracking-widest transition-all shadow-md hover:shadow-lg cursor-pointer"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div 
                  key={item.id}
                  className="flex gap-4 p-3.5 bg-royalty-nude/30 border border-royalty-nude-dark rounded-2xl relative group hover:border-royalty-yellow/50 transition-colors"
                >
                  <img 
                    src={item.thumbnail} 
                    alt={item.displayName || item.title}
                    className="w-20 h-20 object-contain bg-white rounded-xl p-2 border border-royalty-nude-dark shrink-0" 
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <Link 
                          to={`/product/${item.id}`}
                          onClick={closeCart}
                          className="font-bold text-sm text-royalty-purple truncate hover:text-royalty-wine transition-colors"
                        >
                          {item.displayName || item.title}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-400 hover:text-red-500 text-sm p-1 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          ✕
                        </button>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        {item.displayBrand || item.category}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity selector */}
                      <div className="flex items-center border border-royalty-nude-dark bg-white rounded-lg overflow-hidden shadow-xs">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-royalty-nude text-xs font-bold transition-colors cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-royalty-purple">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-royalty-nude text-xs font-bold transition-colors cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-extrabold text-sm text-royalty-wine">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-royalty-nude-dark bg-white space-y-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Vault Subtotal</span>
                  <span className="font-bold text-slate-900">{subtotal.formatted}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Royal Dispatch</span>
                  <span className="font-medium text-emerald-700">
                    {amountToFreeShipping === 0 ? 'COMPLIMENTARY' : '$12.00'}
                  </span>
                </div>
                <div className="pt-2 border-t border-royalty-nude-dark flex justify-between text-base font-extrabold text-royalty-purple">
                  <span>Estimated Total</span>
                  <span className="text-xl text-royalty-wine">
                    ${(subtotal.raw + (amountToFreeShipping === 0 ? 0 : 12)).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleProceedToCheckout}
                  className="w-full bg-gradient-to-r from-royalty-wine to-royalty-purple hover:brightness-110 text-white font-extrabold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 uppercase tracking-widest text-xs flex items-center justify-center gap-2 border border-royalty-yellow/40 cursor-pointer"
                >
                  <span>👑 Proceed to Royal Checkout</span>
                </button>
                <div className="flex justify-between items-center px-1">
                  <button
                    onClick={clearCart}
                    className="text-xs text-slate-400 hover:text-red-500 transition-colors underline cursor-pointer"
                  >
                    Clear Vault
                  </button>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    🔒 256-Bit Vault Encryption
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
