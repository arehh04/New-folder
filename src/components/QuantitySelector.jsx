import { useState, useEffect } from 'react';

/**
 * Royal Quantity Selector / Step Controller
 * @param {Object} props
 * @param {number} [props.initialValue=1]
 * @param {number} [props.min=1]
 * @param {number} [props.max=99]
 * @param {Function} props.onChange
 */
export default function QuantitySelector({ initialValue = 1, min = 1, max = 99, onChange }) {
  const [count, setCount] = useState(initialValue);

  useEffect(() => {
    setCount(initialValue);
  }, [initialValue]);

  const handleDecrement = () => {
    if (count > min) {
      const newCount = count - 1;
      setCount(newCount);
      if (onChange) onChange(newCount);
    }
  };

  const handleIncrement = () => {
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
}
