import { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { formatCurrency } from '../utils/formatters';

export default function AdminAnalyticsStudio() {
  const [velocityData, setVelocityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exportingOrders, setExportingOrders] = useState(false);
  const [exportingInventory, setExportingInventory] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const fetchVelocity = async () => {
    try {
      const res = await adminService.getSalesVelocity();
      setVelocityData(res.data || res);
    } catch (err) {
      console.error('Failed to load sales velocity:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVelocity();
  }, []);

  const handleExportOrders = async () => {
    setExportingOrders(true);
    try {
      await adminService.downloadOrdersCSV();
      showLocalToast('📄 Royal Orders Ledger exported to CSV');
    } catch (err) {
      alert(`CSV Export failed: ${err.message}`);
    } finally {
      setExportingOrders(false);
    }
  };

  const handleExportInventory = async () => {
    setExportingInventory(true);
    try {
      await adminService.downloadInventoryCSV();
      showLocalToast('📊 Inventory Valuation exported to CSV');
    } catch (err) {
      alert(`CSV Export failed: ${err.message}`);
    } finally {
      setExportingInventory(false);
    }
  };

  const showLocalToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-royalty-nude-dark shadow-sm animate-pulse flex items-center justify-center min-h-[240px]">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-royalty-yellow border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs font-serif text-slate-400">Harvesting Executive Velocity & Valuation...</p>
        </div>
      </div>
    );
  }

  const categoryTotalRev = (velocityData?.categoryRevenue || []).reduce((sum, c) => sum + (c.revenue || 0), 0);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-royalty-wine text-royalty-yellow border border-royalty-yellow/40 px-5 py-3 rounded-2xl shadow-2xl z-50 text-xs font-serif font-bold animate-slideUp flex items-center gap-2">
          <span>⚜️</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Studio Card */}
      <div className="bg-white rounded-3xl p-8 border border-royalty-nude-dark shadow-sm">
        {/* Header & Export Action Hub */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">📈</span>
              <h3 className="text-xl font-bold font-serif text-royalty-purple">
                Executive Sales Velocity & Valuation Studio
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Real-time asset turnover metrics, category revenue shares, and RFC-4180 audit exports.
            </p>
          </div>

          {/* One-Click Export Hub */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportOrders}
              disabled={exportingOrders}
              className="flex items-center gap-2 bg-royalty-nude hover:bg-royalty-nude-dark text-royalty-purple border border-royalty-nude-dark px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer disabled:opacity-50"
              title="Download full order records as Excel-compatible CSV"
            >
              <span>{exportingOrders ? '⏳' : '📥'}</span>
              <span>{exportingOrders ? 'Exporting...' : 'Export Orders (CSV)'}</span>
            </button>

            <button
              onClick={handleExportInventory}
              disabled={exportingInventory}
              className="flex items-center gap-2 bg-royalty-wine hover:bg-royalty-purple text-royalty-yellow px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer disabled:opacity-50"
              title="Download inventory levels, pricing, and stock valuation as CSV"
            >
              <span>{exportingInventory ? '⏳' : '📊'}</span>
              <span>{exportingInventory ? 'Exporting...' : 'Export Inventory Valuation (CSV)'}</span>
            </button>
          </div>
        </div>

        {/* Studio Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6">
          {/* Total Vault Inventory Valuation */}
          <div className="bg-gradient-to-br from-royalty-purple to-royalty-wine text-white rounded-2xl p-6 shadow-md relative overflow-hidden flex flex-col justify-between">
            <div className="absolute -right-6 -bottom-6 text-7xl opacity-10 select-none">
              💎
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-royalty-yellow/80">
                Live Catalog Capitalization
              </span>
              <h4 className="text-xs text-royalty-nude/80 font-serif mt-1">
                Total Vault Inventory Valuation
              </h4>
              <div className="text-3xl font-black font-mono text-royalty-yellow mt-3">
                {formatCurrency(velocityData?.totalVaultValuation || 0)}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-royalty-nude/80">
              <span>Inventory Health:</span>
              <span className="bg-emerald-500/20 text-emerald-300 font-mono text-[11px] px-2 py-0.5 rounded-full border border-emerald-400/30">
                {velocityData?.inventoryTurnoverHealth || 'OPTIMAL'}
              </span>
            </div>
          </div>

          {/* Category Revenue Distribution */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-500 mb-4 flex items-center justify-between">
              <span>Revenue by Category</span>
              <span className="font-mono text-royalty-wine font-bold">{formatCurrency(categoryTotalRev)}</span>
            </h4>

            <div className="space-y-4">
              {(velocityData?.categoryRevenue || []).length === 0 ? (
                <p className="text-xs text-slate-400 italic">No revenue recorded yet.</p>
              ) : (
                (velocityData?.categoryRevenue || []).map(cat => {
                  const sharePct = categoryTotalRev > 0 ? ((cat.revenue / categoryTotalRev) * 100).toFixed(1) : 0;
                  return (
                    <div key={cat.category} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-medium text-slate-700">
                        <span className="capitalize">{cat.category}</span>
                        <div className="text-right font-mono text-slate-500 text-[11px]">
                          <span>{formatCurrency(cat.revenue)}</span>
                          <span className="ml-1 text-slate-400">({sharePct}%)</span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-royalty-wine to-royalty-yellow h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, Math.max(5, Number(sharePct)))}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Top Selling Artifacts */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-500 mb-3">
              Top Velocity Artifacts
            </h4>
            <div className="divide-y divide-slate-100">
              {(velocityData?.topSellingArtifacts || []).length === 0 ? (
                <p className="text-xs text-slate-400 italic py-2">No product sales data yet.</p>
              ) : (
                (velocityData?.topSellingArtifacts || []).map((art, idx) => (
                  <div key={art.id} className="py-2 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 truncate pr-2">
                      <span className="w-5 h-5 bg-royalty-nude text-royalty-wine rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 font-mono">
                        {idx + 1}
                      </span>
                      <span className="font-serif truncate font-medium text-slate-700">{art.title}</span>
                    </div>
                    <div className="text-right shrink-0 font-mono">
                      <span className="text-slate-800 font-bold">{art.unitsSold} sold</span>
                      <span className="text-[10px] text-slate-400 block">{formatCurrency(art.revenue)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
