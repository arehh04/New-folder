import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AdminAnalyticsStudio from '../components/AdminAnalyticsStudio';
import { adminBusiness } from '../business/adminBusiness';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function AdminDashboard() {
  const { currentUser, isAuthenticated, openLoginModal } = useAuth();
  const { showToast } = useCart();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const fetchAdminData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminBusiness.getDashboardData();
      setDashboard(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && currentUser?.role === 'admin') {
      fetchAdminData();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, currentUser]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    try {
      await adminBusiness.updateOrderStatus(orderId, newStatus);
      showToast(`👑 Order #${orderId} updated to "${newStatus}"`);
      await fetchAdminData();
    } catch (err) {
      alert(`⚠️ Update failed: ${err.message}`);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  if (!isAuthenticated || currentUser?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-royalty-nude flex flex-col font-sans">
        <Header />
        <main className="flex-grow flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center border border-royalty-nude-dark shadow-xl">
            <span className="text-5xl block mb-4">🛡️</span>
            <h2 className="text-2xl font-black text-royalty-purple mb-2">Restricted Royal Sanctuary</h2>
            <p className="text-slate-500 text-xs mb-6">
              Access to this sanctuary is restricted exclusively to authenticated store custodians (Admins).
            </p>
            <button
              onClick={openLoginModal}
              className="bg-royalty-wine hover:bg-royalty-wine-hover text-white text-xs font-bold uppercase tracking-widest py-3 px-8 rounded-full shadow-sm cursor-pointer"
            >
              👑 Authenticate as Admin (Emily)
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="admin-dashboard min-h-screen bg-royalty-nude flex flex-col font-sans selection:bg-royalty-yellow/30 selection:text-royalty-purple">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
        
        {/* Page Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-royalty-nude-dark">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-royalty-wine text-white text-xs font-bold uppercase tracking-widest mb-2 shadow-xs">
              <span>⚜️</span> Custodian Sanctuary
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-royalty-purple tracking-tight">
              Vault Analytics & Operations
            </h1>
            <p className="text-slate-500 text-xs mt-1">
              Executive oversight for Id10T Maison de Luxe revenues, inventories, and consignments.
            </p>
          </div>

          <button
            onClick={fetchAdminData}
            className="bg-white hover:bg-royalty-nude border border-royalty-nude-dark text-royalty-purple font-extrabold text-xs uppercase tracking-widest py-3 px-6 rounded-full transition-colors shadow-xs cursor-pointer flex items-center gap-2"
          >
            <span>🔄</span> Refresh Telemetry
          </button>
        </div>

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center">
            <div className="w-14 h-14 border-4 border-royalty-nude-dark border-t-royalty-wine rounded-full animate-spin mb-4"></div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-royalty-purple">
              Aggregating Vault Telemetry...
            </p>
          </div>
        ) : error ? (
          <div className="p-6 bg-red-50 border border-red-200 rounded-3xl text-red-700 text-sm font-semibold text-center">
            ⚠️ {error}
          </div>
        ) : dashboard && (
          <div className="space-y-12">
            
            {/* KPI Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Gross Revenue */}
              <div className="bg-gradient-to-br from-royalty-purple-dark to-royalty-purple text-white p-6 rounded-3xl border border-royalty-yellow/40 shadow-lg relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 text-7xl opacity-10 font-serif">⚜️</div>
                <span className="text-[10px] uppercase tracking-widest font-extrabold text-royalty-yellow block mb-1">
                  Gross Vault Revenue
                </span>
                <h3 className="text-3xl font-black text-gold-gradient">
                  {dashboard.metrics.totalRevenueFormatted}
                </h3>
                <p className="text-[11px] text-royalty-nude/70 mt-2 font-medium">
                  {dashboard.metrics.totalOrders} total authorized orders
                </p>
              </div>

              {/* Average Order Value */}
              <div className="bg-white p-6 rounded-3xl border border-royalty-nude-dark shadow-sm">
                <span className="text-[10px] uppercase tracking-widest font-extrabold text-slate-400 block mb-1">
                  Average Order Value
                </span>
                <h3 className="text-3xl font-black text-royalty-purple">
                  {dashboard.metrics.avgOrderValueFormatted}
                </h3>
                <p className="text-[11px] text-slate-500 mt-2 font-medium">
                  {dashboard.metrics.totalItemsSold} total items consigned
                </p>
              </div>

              {/* Total Vault Artifacts */}
              <div className="bg-white p-6 rounded-3xl border border-royalty-nude-dark shadow-sm">
                <span className="text-[10px] uppercase tracking-widest font-extrabold text-slate-400 block mb-1">
                  Catalog Artifacts
                </span>
                <h3 className="text-3xl font-black text-royalty-wine">
                  {dashboard.metrics.totalArtifacts} Items
                </h3>
                <p className="text-[11px] text-slate-500 mt-2 font-medium">
                  Across {Object.keys(dashboard.metrics.categoryCounts).length} royal categories
                </p>
              </div>

              {/* Low Stock Depletion Alerts */}
              <div className="bg-white p-6 rounded-3xl border border-royalty-nude-dark shadow-sm">
                <span className="text-[10px] uppercase tracking-widest font-extrabold text-amber-600 block mb-1">
                  Stock Depletion Warnings
                </span>
                <h3 className="text-3xl font-black text-amber-600">
                  {dashboard.metrics.lowStockCount} Artifacts
                </h3>
                <p className="text-[11px] text-slate-500 mt-2 font-medium">
                  Units $\le 5$ requiring replenishment
                </p>
              </div>

            </div>

            {/* Executive Sales Velocity & Valuation Studio */}
            <AdminAnalyticsStudio />

            {/* Low-Stock Inventory Alerts Section */}
            {dashboard.alerts.length > 0 && (
              <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-6 sm:p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <h3 className="text-lg font-black text-amber-900">
                      Inventory Depletion Warnings
                    </h3>
                    <p className="text-xs text-amber-800 font-medium">
                      The following sovereign curations have reached critical inventory thresholds.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dashboard.alerts.map(item => (
                    <div
                      key={item.id}
                      className="bg-white p-4 rounded-2xl border border-amber-200 flex items-center justify-between gap-4 shadow-xs"
                    >
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-12 h-12 object-contain rounded-xl bg-royalty-nude/30 p-1"
                      />
                      <div className="flex-1 min-w-0">
                        <h5 className="font-extrabold text-xs text-royalty-purple truncate">
                          {item.title}
                        </h5>
                        <p className="text-[11px] text-slate-400 font-bold">{item.formattedPrice}</p>
                      </div>
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        item.stock === 0 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {item.stock === 0 ? 'Depleted (0)' : `${item.stock} left`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Orders & Fulfillment Dispatch Manager */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-royalty-nude-dark shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-black text-royalty-purple">
                    Recent Consignment Dispatches
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Update package dispatch milestones in real-time across the sovereign tracking network.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-royalty-nude text-slate-400 uppercase tracking-widest text-[10px] font-extrabold">
                      <th className="pb-3">Order ID</th>
                      <th className="pb-3">Patron</th>
                      <th className="pb-3">Authorized Date</th>
                      <th className="pb-3">Total Amount</th>
                      <th className="pb-3">Fulfillment Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-royalty-nude">
                    {dashboard.recentOrders.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="py-8 text-center text-slate-400 font-semibold">
                          No orders authorized yet in royal ledger archives.
                        </td>
                      </tr>
                    ) : (
                      dashboard.recentOrders.map(order => (
                        <tr key={order.orderId} className="hover:bg-royalty-nude/20 transition-colors">
                          <td className="py-4 font-mono font-black text-royalty-purple">
                            {order.orderId}
                          </td>
                          <td className="py-4 font-bold text-slate-800">
                            {order.customer?.fullName || 'Sovereign Patron'}
                          </td>
                          <td className="py-4 text-slate-500 font-medium">
                            {order.formattedDate}
                          </td>
                          <td className="py-4 font-black text-royalty-wine">
                            {order.formattedTotal}
                          </td>
                          <td className="py-4">
                            <select
                              value={order.status}
                              disabled={updatingOrderId === order.orderId}
                              onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                              className="bg-royalty-nude/60 border border-royalty-nude-dark font-extrabold text-[11px] text-royalty-purple px-3 py-1.5 rounded-xl outline-none focus:border-royalty-yellow cursor-pointer"
                            >
                              <option value="Order Authorized">👑 Order Authorized</option>
                              <option value="Vault Sealed & Authenticated">⚜️ Vault Sealed</option>
                              <option value="Dispatched via Sovereign Courier">🚀 In Transit via Courier</option>
                              <option value="Delivered to Estate">🏰 Delivered to Estate</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
