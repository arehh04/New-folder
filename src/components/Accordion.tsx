import { useState, ReactNode, FC } from 'react';

export interface AccordionProps {
  title: string;
  defaultOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
  children: ReactNode;
}

/**
 * Royal Accordion / Collapsible Panel
 */
export const Accordion: FC<AccordionProps> = ({ 
  title, 
  defaultOpen = false, 
  onToggle, 
  children 
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);

  const handleToggle = (): void => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (onToggle) onToggle(newState);
  };

  return (
    <div className="border border-royalty-nude-dark rounded-2xl overflow-hidden bg-white shadow-xs mb-4 transition-all">
      <button 
        type="button"
        onClick={handleToggle}
        className="w-full flex justify-between items-center p-4 sm:p-5 bg-royalty-nude/40 hover:bg-royalty-nude/80 transition-colors text-left cursor-pointer"
        aria-expanded={isOpen}
      >
        <span className="font-extrabold text-royalty-purple uppercase tracking-widest text-xs flex items-center gap-2">
          <span>⚜️</span> {title}
        </span>
        <span className={`transform transition-transform duration-300 text-royalty-wine font-bold text-xs ${isOpen ? 'rotate-180 text-royalty-yellow' : 'rotate-0'}`}>
          ▼
        </span>
      </button>
      
      {isOpen && (
        <div className="p-5 text-slate-600 text-sm leading-relaxed border-t border-royalty-nude-dark bg-white animate-fadeIn">
          {children}
        </div>
      )}
    </div>
  );
};

export default Accordion;
