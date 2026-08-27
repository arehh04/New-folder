/**
 * Centralized Formatting Utilities
 * Standardizes currency, date, and percentage presentation across the entire application.
 */

/**
 * Format any number into a formatted USD string (e.g. $129.99)
 * @param {number|string} amount 
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount) {
  const val = Number(amount) || 0;
  return `$${val.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

/**
 * Format date string into readable sovereign format (e.g. Aug 26, 2026, 04:30 PM)
 * @param {string|Date} dateInput 
 * @param {Object} customOptions 
 * @returns {string} Formatted date string
 */
export function formatDate(dateInput, customOptions = {}) {
  if (!dateInput) return 'N/A';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return 'N/A';

  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };

  return d.toLocaleDateString('en-US', { ...defaultOptions, ...customOptions });
}

/**
 * Format discount percentage string (e.g. 15% OFF)
 * @param {number} pct 
 * @returns {string} Formatted discount string
 */
export function formatDiscount(pct) {
  const val = Number(pct) || 0;
  return val > 0 ? `${Math.round(val)}% OFF` : '';
}
