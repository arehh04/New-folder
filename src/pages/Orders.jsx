import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import OrderTimeline from '../components/OrderTimeline';
import { orderBusiness } from '../business/orderBusiness';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Orders() {
  const { isAuthenticated, openLoginModal } = useAuth();
  const { addToCart, showToast } = useCart();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    setLoading(true);
    orderBusiness.fetchUserOrders()
      .then(data => {
        setOrders(data);
        if (data.length > 0) {
          setExpandedOrderId(data[0].orderId);
        }
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isAuthenticated]);

  const handleReorder = (items) => {
    for (const item of items) {
      addToCart(item, item.quantity || 1);
    }
    showToast(`👑 Transferred ${items.length} items to your Royal Vault`);
  };

  return (
    <div className="orders-page min-h-screen bg-royalty-nude flex flex-col font-sans selection:bg-royalty-yellow/30 selection:text-royalty-purple">
      <Header />

      <main className="flex-grow max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 pb-6 border-b border-royalty-nude-dark">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-royalty-purple text-royalty-yellow text-xs font-bold uppercase tracking-widest mb-2 shadow-xs">
              <span>📜</span> Sovereign Ledger
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-royalty-purple tracking-tight">
              Patron Order Archives
            </h1>
            <p className="text-slate-500 text-xs mt-1">
              Review certified order receipts and track live royal consignments.
            </p>
          </div>

          <Link
            to="/"
            className="bg-white hover:bg-royalty-nude border border-royalty-nude-dark text-royalty-purple font-bold text-xs uppercase tracking-widest py-3 px-6 rounded-full transition-colors shadow-xs"
          >
            ← Return to Curations
          </Link>
        </div>

        {/* Unauthenticated State */}
        {!isAuthenticated ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-royalty-nude-dark shadow-sm">
            <span className="text-5xl block mb-4">👑</span>
            <h3 className="text-2xl font-black text-royalty-purple mb-2">Sovereign Identification Required</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
              Please sign in with your sovereign credentials to inspect your personalized order history and tracking ledgers.
            </p>
            <button
              onClick={openLoginModal}
              className="bg-royalty-wine hover:bg-royalty-wine-hover text-white font-extrabold py-3.5 px-8 rounded-full uppercase tracking-widest text-xs shadow-md transition-all cursor-pointer"
            >
              Sign In to Inspect Ledger
            </button>
          </div>
        ) : loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="w-14 h-14 border-4 border-royalty-nude-dark border-t-royalty-wine rounded-full animate-spin mb-4"></div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-royalty-purple">
              Retrieving Sovereign Ledgers...
            </p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-red-200 shadow-sm text-red-700 text-sm font-semibold">
            ⚠️ {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-royalty-nude-dark shadow-sm">
            <span className="text-6xl block mb-4">📜</span>
            <h3 className="text-2xl font-black text-royalty-purple mb-2">No Past Orders Found</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto mb-8">
              Your royal acquisition ledger is currently pristine. Explore our vault curations to authorize your inaugural acquisition.
            </p>
            <Link
              to="/"
              className="bg-gradient-to-r from-royalty-wine to-royalty-purple hover:brightness-110 text-white font-extrabold py-4 px-8 rounded-full uppercase tracking-widest text-xs shadow-lg transition-all"
            >
              👑 Discover Curations
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const isExpanded = expandedOrderId === order.orderId;

              return (
                <div
                  key={order.orderId}
                  className="bg-white rounded-3xl border border-royalty-nude-dark shadow-sm overflow-hidden transition-all duration-200"
                >
                  {/* Order Card Header */}
                  <div
                    onClick={() => setExpandedOrderId(isExpanded ? null : order.orderId)}
                    className="p-6 bg-gradient-to-r from-royalty-nude/40 to-white hover:bg-royalty-nude/60 cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-black text-royalty-purple">
                          {order.orderId}
                        </span>
                        <span className="bg-royalty-wine/10 text-royalty-wine text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          {order.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium mt-1">
                        Authorized on {order.formattedDate}
                      </p>
                    </div>

                    <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="text-right">
                        <span className="text-xs text-slate-400 block uppercase font-bold">Grand Total</span>
                        <span className="text-lg font-black text-royalty-wine">
                          {order.formattedTotal}
                        </span>
                      </div>
                      <span className="text-royalty-purple text-sm font-bold">
                        {isExpanded ? '▲' : '▼'}
                      </span>
                    </div>
                  </div>

                  {/* Expandable Order Details & Tracking */}
                  {isExpanded && (
                    <div className="p-6 sm:p-8 border-t border-royalty-nude-dark bg-white space-y-8 animate-in fade-in duration-200">
                      
                      {/* Live Package Tracking Timeline */}
                      <div className="bg-royalty-nude/30 border border-royalty-nude-dark rounded-2xl p-6">
                        <h4 className="text-xs font-black uppercase tracking-widest text-royalty-purple mb-4">
                          🚀 Sovereign Tracking & Dispatch Progress
                        </h4>
                        <OrderTimeline
                          currentStep={order.timelineStep}
                          status={order.status}
                        />
                      </div>

                      {/* Items & Shipping Breakdown */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        
                        {/* Items List */}
                        <div className="lg:col-span-7 space-y-3">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                            Acquired Artifacts ({order.items?.length || 0})
                          </h4>
                          {order.items?.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-4 p-3 bg-royalty-nude/20 rounded-2xl border border-royalty-nude-dark"
                            >
                              <img
                                src={item.thumbnail}
                                alt={item.title}
                                className="w-14 h-14 object-contain rounded-xl bg-white p-1 border border-royalty-nude-dark"
                              />
                              <div className="flex-1">
                                <h5 className="font-extrabold text-xs text-royalty-purple truncate">
                                  {item.title}
                                </h5>
                                <p className="text-[11px] text-slate-500 font-semibold">
                                  Qty: {item.quantity} × ${Number(item.price).toFixed(2)}
                                </p>
                              </div>
                              <span className="font-extrabold text-xs text-royalty-wine">
                                ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Summary & Destination */}
                        <div className="lg:col-span-5 bg-royalty-nude/40 border border-royalty-nude-dark rounded-2xl p-6 space-y-4 text-xs font-semibold text-slate-700">
                          <h4 className="text-xs font-black uppercase tracking-widest text-royalty-purple">
                            Consignment Details
                          </h4>
                          
                          <div className="space-y-1 text-[11px]">
                            <p className="text-slate-400 font-bold uppercase">Estate Destination:</p>
                            <p className="font-bold text-slate-800">{order.customer?.fullName}</p>
                            <p>{order.shippingAddress?.street}</p>
                            <p>{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
                            <p>{order.shippingAddress?.country}</p>
                          </div>

                          <div className="border-t border-royalty-nude pt-3 space-y-1.5 text-xs">
                            <div className="flex justify-between">
                              <span className="text-slate-500">Subtotal</span>
                              <span>{order.formattedSubtotal}</span>
                            </div>
                            {Number(order.discount) > 0 && (
                              <div className="flex justify-between text-royalty-wine">
                                <span>Sovereign Discount</span>
                                <span>{order.formattedDiscount}</span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span className="text-slate-500">Dispatch</span>
                              <span className="text-emerald-700 uppercase font-bold">COMPLIMENTARY</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-royalty-nude text-sm font-black text-royalty-purple">
                              <span>Grand Total</span>
                              <span className="text-royalty-wine">{order.formattedTotal}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleReorder(order.items)}
                            className="w-full bg-royalty-purple hover:bg-royalty-purple-dark text-royalty-yellow font-extrabold py-3 px-4 rounded-xl text-xs uppercase tracking-widest transition-colors cursor-pointer shadow-xs"
                          >
                            👑 Reorder to Vault
                          </button>
                        </div>

                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
