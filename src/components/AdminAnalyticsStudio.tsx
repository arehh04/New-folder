import { useState, useEffect, FC } from 'react';
import { adminService } from '../services/adminService';
import { formatCurrency } from '../utils/formatters';
import { SalesVelocityMetrics } from '../types';

export const AdminAnalyticsStudio: FC = () => {
  const [velocityData, setVelocityData] = useState<SalesVelocityMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [exportingOrders, setExportingOrders] = useState<boolean>(false);
  const [exportingInventory, setExportingInventory] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchVelocity = async (): Promise<void> => {
    try {
      const data = await adminService.getSalesVelocity();
      setVelocityData(data);
    } catch (err) {
      console.error('Failed to load sales velocity:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVelocity();
  }, []);

  const handleExportOrders = async (): Promise<void> => {
    setExportingOrders(true);
    try {
      await adminService.downloadOrdersCSV();
      showLocalToast('📄 Royal Orders Ledger exported to CSV');
    } catch (err: any) {
      alert(`CSV Export failed: ${err.message}`);
    } finally {
      setExportingOrders(false);
    }
  };

  const handleExportInventory = async (): Promise<void> => {
    setExportingInventory(true);
    try {
      await adminService.downloadInventoryCSV();
      showLocalToast('📊 Inventory Valuation exported to CSV');
    } catch (err: any) {
      alert(`CSV Export failed: ${err.message}`);
    } finally {
      setExportingInventory(false);
    }
  };

  const showLocalToast = (msg: string): void => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-royalty-nude-dark shadow-sm animate-pulse flex items-center justify-center min-h-[240px]">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-royalty-yellow border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
            Synthesizing Vault Analytics...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-royalty-nude-dark shadow-sm space-y-8 relative overflow-hidden">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 bg-royalty-purple text-royalty-yellow px-5 py-3.5 rounded-2xl shadow-2xl border border-royalty-yellow/50 z-50 text-xs font-bold animate-in fade-in slide-in-from-bottom-4 duration-200">
          {toastMessage}
        </div>
      )}

      {/* Header with Export Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-royalty-nude">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-royalty-wine/10 text-royalty-wine text-xs font-bold uppercase tracking-widest mb-2">
            <span>📈</span> Executive Intelligence & CSV Studio
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-royalty-purple">
            Sales Velocity & Vault Capitalization
          </h3>
        </div>

        {/* 1-Click CSV Export Action Buttons */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleExportOrders}
            disabled={exportingOrders}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-royalty-nude hover:bg-royalty-nude-dark text-royalty-purple border border-royalty-nude-dark rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
            title="Download RFC-4180 compliant CSV ledger of all orders"
          >
            <span>📄</span>
            <span>{exportingOrders ? 'Generating...' : 'Export Orders (CSV)'}</span>
          </button>
          <button
            type="button"
            onClick={handleExportInventory}
            disabled={exportingInventory}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-royalty-wine hover:bg-royalty-wine-hover text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
            title="Download complete inventory valuation report in CSV"
          >
            <span>📊</span>
            <span>{exportingInventory ? 'Calculating...' : 'Export Valuation (CSV)'}</span>
          </button>
        </div>
      </div>

      {/* Valuation Ticker Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 bg-gradient-to-br from-royalty-nude/40 to-white border border-royalty-nude-dark rounded-2xl">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">
            Total Capitalized Vault Value
          </span>
          <div className="text-3xl sm:text-4xl font-black text-royalty-wine">
            {velocityData?.formattedValuation || formatCurrency(velocityData?.totalInventoryValuation || 0)}
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">
            Across {velocityData?.totalVaultUnits || 0} total on-hand physical units
          </span>
        </div>

        <div className="p-6 bg-gradient-to-br from-royalty-nude/40 to-white border border-royalty-nude-dark rounded-2xl">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">
            Distinct Catalog SKUs
          </span>
          <div className="text-3xl sm:text-4xl font-black text-royalty-purple">
            {velocityData?.distinctArtifactCount || 0}
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">
            Enshrined active luxury treasures
          </span>
        </div>

        <div className="p-6 bg-gradient-to-br from-royalty-nude/40 to-white border border-royalty-nude-dark rounded-2xl">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">
            Top Velocity Categories
          </span>
          <div className="text-3xl sm:text-4xl font-black text-emerald-700">
            {velocityData?.categoryDistribution?.length || 0}
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">
            Active sovereign market verticals
          </span>
        </div>
      </div>

      {/* Category Distribution & Velocity Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Category Revenue Distribution Bars */}
        <div className="space-y-4">
          <h4 className="font-extrabold text-royalty-purple text-sm uppercase tracking-wider flex items-center gap-2">
            <span>⚜️</span> Category Revenue Distribution
          </h4>
          <div className="space-y-3">
            {velocityData?.categoryDistribution?.map((cat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span className="capitalize">{cat.category}</span>
                  <span className="text-royalty-wine">
                    {cat.formattedRevenue} ({cat.percentage}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-royalty-nude rounded-full overflow-hidden border border-royalty-nude-dark/40">
                  <div
                    className="h-full bg-gradient-to-r from-royalty-wine to-royalty-yellow rounded-full transition-all duration-700"
                    style={{ width: `${Math.max(4, cat.percentage)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Selling Artifacts Table */}
        <div className="space-y-4">
          <h4 className="font-extrabold text-royalty-purple text-sm uppercase tracking-wider flex items-center gap-2">
            <span>👑</span> Top Velocity Artifacts (Volume & Revenue)
          </h4>
          <div className="border border-royalty-nude-dark rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-royalty-nude/60 text-slate-600 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="p-3">Artifact</th>
                  <th className="p-3 text-center">Units Sold</th>
                  <th className="p-3 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-royalty-nude">
                {velocityData?.topSellingArtifacts?.map((art, idx) => (
                  <tr key={idx} className="hover:bg-royalty-nude/20 transition-colors">
                    <td className="p-3 font-semibold text-royalty-purple truncate max-w-[180px]">
                      {art.title}
                    </td>
                    <td className="p-3 text-center font-mono font-bold text-slate-700">
                      {art.unitsSold}x
                    </td>
                    <td className="p-3 text-right font-mono font-extrabold text-royalty-wine">
                      {art.formattedRevenue}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminAnalyticsStudio;
