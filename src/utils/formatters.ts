/**
 * Centralized TypeScript Formatting Utilities
 * Standardizes currency, date, and percentage presentation across the entire application.
 */

/**
 * Format any number into a formatted USD string (e.g. $129.99)
 * @param amount - Numerical or string amount to format
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number | string | undefined | null): string {
  const val = Number(amount) || 0;
  return `$${val.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

/**
 * Format date string into readable sovereign format (e.g. Aug 26, 2026, 04:30 PM)
 * @param dateInput - Date object or ISO string
 * @param customOptions - Intl.DateTimeFormatOptions override
 * @returns Formatted date string
 */
export function formatDate(
  dateInput?: string | Date | null, 
  customOptions: Intl.DateTimeFormatOptions = {}
): string {
  if (!dateInput) return 'N/A';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return 'N/A';

  const defaultOptions: Intl.DateTimeFormatOptions = {
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
 * @param pct - Discount percentage
 * @returns Formatted discount string
 */
export function formatDiscount(pct?: number | string | null): string {
  const val = Number(pct) || 0;
  return val > 0 ? `${Math.round(val)}% OFF` : '';
}
