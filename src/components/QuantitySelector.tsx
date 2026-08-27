import { useState, useEffect, FC } from 'react';

export interface QuantitySelectorProps {
  initialValue?: number;
  min?: number;
  max?: number;
  onChange?: (quantity: number) => void;
}

/**
 * Royal Quantity Selector / Step Controller
 */
export const QuantitySelector: FC<QuantitySelectorProps> = ({ 
  initialValue = 1, 
  min = 1, 
  max = 99, 
  onChange 
}) => {
  const [count, setCount] = useState<number>(initialValue);

  useEffect(() => {
    setCount(initialValue);
  }, [initialValue]);

  const handleDecrement = (): void => {
    if (count > min) {
      const newCount = count - 1;
      setCount(newCount);
      if (onChange) onChange(newCount);
    }
  };

  const handleIncrement = (): void => {
    if (count < max) {
      const newCount = count + 1;
      setCount(newCount);
      if (onChange) onChange(newCount);
    }
  };

  return (
    <div className="flex items-center bg-royalty-nude/60 border border-royalty-nude-dark rounded-xl p-1 shadow-xs">
      <button 
        type="button"
        onClick={handleDecrement}
        disabled={count <= min}
        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white hover:bg-royalty-yellow-light text-royalty-purple font-extrabold text-sm border border-royalty-nude-dark disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
        aria-label="Decrease quantity"
      >
        -
      </button>
      <span className="w-10 text-center font-extrabold text-sm text-royalty-purple font-mono">
        {count}
      </span>
      <button 
        type="button"
        onClick={handleIncrement}
        disabled={count >= max}
        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white hover:bg-royalty-yellow-light text-royalty-purple font-extrabold text-sm border border-royalty-nude-dark disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
};

export default QuantitySelector;
