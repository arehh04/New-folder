import { useNavigate } from 'react-router-dom';

export default function OrderConfirmationModal({ order, onClose }) {
  const navigate = useNavigate();

  if (!order) return null;

  const handleReturnHome = () => {
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
                  {order.estimatedDelivery}
                </span>
              </div>
            </div>

            {/* Summary Items */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Acquired Artifacts ({order.items?.length})
              </h4>
              <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs py-2 border-b border-royalty-nude">
                    <div className="flex items-center gap-3">
                      <img 
                        src={item.thumbnail} 
                        alt={item.title} 
                        className="w-8 h-8 rounded-lg object-contain bg-royalty-nude p-1 border border-royalty-nude-dark" 
                      />
                      <span className="font-bold text-royalty-purple line-clamp-1 max-w-[12rem]">
                        {item.title} (x{item.quantity})
                      </span>
                    </div>
                    <span className="font-bold text-slate-800">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Address & Payment Info */}
            <div className="text-xs text-slate-600 bg-white border border-royalty-nude-dark p-4 rounded-2xl space-y-1">
              <p><strong>Patron:</strong> {order.customer?.fullName} ({order.customer?.email})</p>
              <p><strong>Destination:</strong> {order.shippingAddress?.street}, {order.shippingAddress?.city} {order.shippingAddress?.postalCode}</p>
              <p><strong>Courier:</strong> {order.deliveryMethod}</p>
              <div className="pt-2 mt-2 border-t border-royalty-nude flex justify-between font-extrabold text-sm text-royalty-purple">
                <span>Grand Total Settled:</span>
                <span className="text-royalty-wine">${order.total?.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleReturnHome}
              className="w-full bg-gradient-to-r from-royalty-wine to-royalty-purple hover:brightness-110 text-white font-extrabold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl uppercase tracking-widest text-xs border border-royalty-yellow/40 transition-all cursor-pointer"
            >
              👑 Return to Curations
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}
