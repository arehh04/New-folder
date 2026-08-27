import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrderModel } from '../types';

export interface OrderConfirmationModalProps {
  order: (OrderModel & { estimatedDelivery?: string }) | null;
  onClose?: () => void;
}

export const OrderConfirmationModal: FC<OrderConfirmationModalProps> = ({ order, onClose }) => {
  const navigate = useNavigate();

  if (!order) return null;

  const handleReturnHome = (): void => {
    if (onClose) onClose();
    navigate('/');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity" />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border-2 border-royalty-yellow animate-in zoom-in-95 duration-200">
          
          {/* Royal Seal Header */}
          <div className="bg-gradient-to-r from-royalty-purple-dark via-royalty-purple to-royalty-wine p-8 text-center text-white relative">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-royalty-yellow/50 flex items-center justify-center text-3xl mx-auto mb-3 shadow-inner">
              👑
            </div>
            <span className="text-xs uppercase tracking-[0.25em] text-royalty-yellow font-bold block mb-1">
              Royal Ledger Confirmation
            </span>
            <h2 className="text-2xl font-black tracking-tight text-white">
              Order Sovereignly Authorized!
            </h2>
            <p className="text-xs text-royalty-nude/80 mt-1 font-medium">
              Your patron transaction has been registered in the Royal Ledger.
            </p>
          </div>

          {/* Details Content */}
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Order Reference Box */}
            <div className="bg-royalty-nude/60 border border-royalty-nude-dark p-4 rounded-2xl flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  Royal Order Identifier
                </span>
                <span className="text-lg font-black text-royalty-wine">
                  #{order.orderId}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  Estimated Dispatch
                </span>
                <span className="text-xs font-bold text-emerald-700">
                  {order.estimatedDelivery || '2–3 Business Days'}
                </span>
              </div>
            </div>

            {/* Summary Items */}
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-3">
                Acquired Artifacts ({order.items.length})
              </span>
              <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs py-1.5 border-b border-royalty-nude last:border-0">
                    <span className="font-semibold text-slate-700 truncate max-w-[240px]">
                      {item.title} <span className="text-slate-400 font-normal">x{item.quantity}</span>
                    </span>
                    <span className="font-mono font-bold text-royalty-wine">
                      ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Ledger Summary */}
            <div className="pt-4 border-t border-royalty-nude space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{order.formattedSubtotal}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Privilege Discount</span>
                  <span>-{order.formattedDiscount}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-royalty-purple pt-2 border-t border-royalty-nude">
                <span>Total Capital</span>
                <span className="text-royalty-wine">{order.formattedTotal}</span>
              </div>
            </div>

            {/* Actions */}
            <button
              type="button"
              onClick={handleReturnHome}
              className="w-full bg-gradient-to-r from-royalty-wine to-royalty-purple hover:brightness-110 text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-lg transition-all uppercase tracking-widest text-xs cursor-pointer border border-royalty-yellow/40"
            >
              ⚜️ Return to Sovereign Catalog
            </button>

          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationModal;
