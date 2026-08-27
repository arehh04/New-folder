import { FC } from 'react';

export interface OrderTimelineProps {
  currentStep?: number;
  status?: string;
}

export const OrderTimeline: FC<OrderTimelineProps> = ({ currentStep = 2, status = '' }) => {
  const steps = [
    { title: 'Authorized', subtitle: 'Royal Seal Affixed', icon: '👑' },
    { title: 'Vault Sealed', subtitle: 'White-Glove Auth', icon: '⚜️' },
    { title: 'Courier Dispatch', subtitle: 'In Sovereign Transit', icon: '🚀' },
    { title: 'Delivered', subtitle: 'Estate Reception', icon: '🏰' }
  ];

  return (
    <div className="w-full py-4">
      {/* Progress Bar Track */}
      <div className="relative flex justify-between items-center mb-6">
        
        {/* Background Line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-royalty-nude-dark -translate-y-1/2 z-0"></div>
        
        {/* Active Filled Line */}
        <div 
          className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-royalty-wine via-royalty-purple to-royalty-yellow -translate-y-1/2 z-0 transition-all duration-500"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        ></div>

        {/* Step Nodes */}
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;

          return (
            <div key={index} className="relative z-10 flex flex-col items-center">
              <div 
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-royalty-purple text-royalty-yellow border-2 border-royalty-yellow shadow-md scale-105'
                    : isActive 
                      ? 'bg-royalty-wine text-white border-2 border-royalty-yellow ring-4 ring-royalty-yellow/30 shadow-lg scale-110 animate-pulse'
                      : 'bg-white text-slate-400 border-2 border-royalty-nude-dark'
                }`}
              >
                {isCompleted ? '✓' : step.icon}
              </div>

              <div className="absolute top-11 text-center whitespace-nowrap">
                <span className={`block text-[11px] font-extrabold uppercase tracking-wider ${
                  isActive ? 'text-royalty-purple' : isCompleted ? 'text-slate-700' : 'text-slate-400'
                }`}>
                  {step.title}
                </span>
                <span className="text-[9px] text-slate-400 font-medium hidden sm:block">
                  {step.subtitle}
                </span>
              </div>
            </div>
          );
        })}

      </div>

      <div className="pt-8 text-center">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-royalty-nude/70 border border-royalty-nude-dark text-[11px] font-bold text-royalty-purple">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          Live Sovereign Status: <span className="text-royalty-wine font-extrabold">{status || 'In Sovereign Transit'}</span>
        </span>
      </div>
    </div>
  );
};

export default OrderTimeline;
