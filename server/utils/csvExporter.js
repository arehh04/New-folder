/**
 * CSV EXPORT ENGINE
 * Serializes Order and Inventory records to RFC-4180 compliant CSV format.
 */

/**
 * Escape and quote a single CSV cell
 */
function escapeCell(val) {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

/**
 * Export Orders to CSV string
 * @param {Array<Object>} orders 
 * @returns {string}
 */
export function exportOrdersToCSV(orders = []) {
  const headers = [
    'Order ID',
    'Date Placed',
    'Customer Name',
    'Customer Email',
    'Delivery Street',
    'City',
    'Postal Code',
    'Country',
    'Delivery Method',
    'Payment Method',
    'Items Summary',
    'Item Count',
    'Subtotal ($)',
    'Discount ($)',
    'Grand Total ($)',
    'Fulfillment Status',
    'Estimated Delivery'
  ];

  const rows = orders.map(o => {
    const itemsSummary = (o.items || [])
      .map(i => `${i.title || i.displayName} (x${i.quantity}) - $${Number(i.price).toFixed(2)}`)
      .join('; ');
    const itemCount = (o.items || []).reduce((sum, i) => sum + (Number(i.quantity) || 1), 0);

    return [
      escapeCell(o.orderId),
      escapeCell(o.createdAt ? new Date(o.createdAt).toLocaleString() : 'N/A'),
      escapeCell(o.customer?.fullName || 'Sovereign Patron'),
      escapeCell(o.customer?.email || 'patron@royalvault.com'),
      escapeCell(o.shippingAddress?.street || '100 Palace Gardens'),
      escapeCell(o.shippingAddress?.city || 'London'),
      escapeCell(o.shippingAddress?.postalCode || 'SW1A 1AA'),
      escapeCell(o.shippingAddress?.country || 'United Kingdom'),
      escapeCell(o.deliveryMethod || 'Royal Dispatch'),
      escapeCell(o.paymentMethod || 'Vault Insured Credit'),
      escapeCell(itemsSummary),
      escapeCell(itemCount),
      escapeCell(Number(o.subtotal || 0).toFixed(2)),
      escapeCell(Number(o.discount || 0).toFixed(2)),
      escapeCell(Number(o.total || 0).toFixed(2)),
      escapeCell(o.status || 'Dispatched'),
      escapeCell(o.estimatedDelivery || 'N/A')
    ].join(',');
  });

  // Include UTF-8 BOM (\uFEFF) for clean Excel formatting
  return '\uFEFF' + [headers.map(escapeCell).join(','), ...rows].join('\r\n');
}

/**
 * Export Inventory & Valuation to CSV string
 * @param {Array<Object>} products 
 * @returns {string}
 */
export function exportInventoryToCSV(products = []) {
  const headers = [
    'SKU / ID',
    'Artifact Title',
    'Brand',
    'Category',
    'Unit Price ($)',
    'Stock Count',
    'Total Valuation ($)',
    'Rating',
    'Reviews Count',
    'Stock Status'
  ];

  const rows = products.map(p => {
    const unitPrice = Number(p.price || 0);
    const stock = Number(p.stock || 0);
    const valuation = unitPrice * stock;
    const stockStatus = stock === 0 ? 'DEPLETED / CRITICAL' : stock <= 5 ? 'LOW STOCK ALERT' : 'OPTIMAL';

    return [
      escapeCell(p.id),
      escapeCell(p.title),
      escapeCell(p.brand || 'Maison de Luxe'),
      escapeCell(p.category),
      escapeCell(unitPrice.toFixed(2)),
      escapeCell(stock),
      escapeCell(valuation.toFixed(2)),
      escapeCell(p.rating || 0),
      escapeCell((p.reviews || []).length),
      escapeCell(stockStatus)
    ].join(',');
  });

  return '\uFEFF' + [headers.map(escapeCell).join(','), ...rows].join('\r\n');
}
