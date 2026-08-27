import { useState, useEffect, FC } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import OrderTimeline from '../components/OrderTimeline';
import { orderBusiness, UIOrderModel } from '../business/orderBusiness';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { OrderItemModel } from '../types';

export const Orders: FC = () => {
  const { isAuthenticated, openLoginModal } = useAuth();
  const { addToCart, showToast } = useCart();

  const [orders, setOrders] = useState<UIOrderModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | number | null>(null);

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
      .catch((err: any) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isAuthenticated]);

  const handleReorder = (items: OrderItemModel[]): void => {
    for (const item of items) {
      addToCart(item as any, item.quantity || 1);
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
              Patron Acquisitions & Records
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Complete dispatch archives and white-glove consignment status.
            </p>
          </div>

          <Link
            to="/"
            className="px-4 py-2.5 bg-royalty-nude hover:bg-royalty-nude-dark text-royalty-purple border border-royalty-nude-dark rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
          >
            ← Explore Curations
          </Link>
        </div>

        {/* State: Not Logged In */}
        {!isAuthenticated ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-royalty-nude-dark shadow-sm">
            <span className="text-6xl mb-4 block">👑</span>
            <h3 className="text-2xl font-bold text-royalty-purple mb-2">Authentication Required</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
              Sign in with your sovereign credentials to access your permanent consignment history.
            </p>
            <button
              type="button"
              onClick={openLoginModal}
              className="bg-gradient-to-r from-royalty-wine to-royalty-purple text-white font-bold py-3.5 px-8 rounded-full text-xs uppercase tracking-widest transition-all shadow-md cursor-pointer"
            >
              Sign In to Sanctuary
            </button>
          </div>
        ) : loading ? (
          <div className="bg-white rounded-3xl p-16 border border-royalty-nude-dark shadow-sm flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-3 border-royalty-yellow border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-royalty-purple">
              Retrieving Royal Ledger Archives...
            </p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-red-200 shadow-sm">
            <span className="text-5xl mb-3 block">⚠️</span>
            <h3 className="text-xl font-bold text-red-600 mb-2">Archive Query Error</h3>
            <p className="text-slate-600 text-xs mb-4">{error}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-royalty-nude-dark shadow-sm">
            <span className="text-6xl mb-4 block">📜</span>
            <h3 className="text-2xl font-bold text-royalty-purple mb-2">No Past Acquisitions Recorded</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
              Your royal acquisition register is pristine. Begin acquiring handpicked artifacts today.
            </p>
            <Link
              to="/"
              className="inline-block bg-royalty-wine hover:bg-royalty-wine-hover text-white font-bold py-3.5 px-8 rounded-full text-xs uppercase tracking-widest shadow-md transition-all"
            >
              Explore Sovereign Collection
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const isExpanded = expandedOrderId === order.orderId;

              return (
                <div
                  key={order.orderId}
                  className="bg-white rounded-3xl border border-royalty-nude-dark overflow-hidden shadow-xs hover:border-royalty-yellow/60 transition-all"
                >
                  {/* Order Card Summary Banner */}
                  <div
                    onClick={() => setExpandedOrderId(isExpanded ? null : order.orderId)}
                    className="p-6 sm:p-7 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer hover:bg-royalty-nude/20 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-royalty-purple text-royalty-yellow border border-royalty-yellow/40 flex items-center justify-center text-xl shadow-xs">
                        👑
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-black text-royalty-purple">
                            #{order.orderId}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-royalty-nude text-royalty-wine border border-royalty-nude-dark">
                            {order.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">
                          Consigned on {order.formattedDate} • {order.items?.length || 0} Artifacts
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-royalty-nude">
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                          Total Valuation
                        </span>
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
                            type="button"
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
};

export default Orders;
