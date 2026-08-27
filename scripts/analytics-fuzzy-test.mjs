/**
 * FUZZY SEARCH & EXECUTIVE ANALYTICS AUTOMATED TEST
 * Validates typo-tolerant search, live suggestions, CSV export, and sales velocity metrics.
 * Run with: node scripts/analytics-fuzzy-test.mjs
 */

const BASE_URL = 'http://localhost:5000/api';

async function runAnalyticsFuzzyTest() {
  console.log('📊 ================================================================');
  console.log('✨  ID10T MAISON DE LUXE - FUZZY SEARCH & ANALYTICS TEST SUITE');
  console.log('📊 ================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  // -------------------------------------------------------------
  // 1. Fuzzy Search & Typo-Tolerance Tests
  // -------------------------------------------------------------
  console.log('🔍 [TEST 1: FUZZY SEARCH & TYPO-TOLERANT RETRIEVAL]');
  // Query with typo "chanell"
  const typoRes = await fetch(`${BASE_URL}/products?search=chanell`, {
    headers: { 'x-test-suite': 'true' }
  });
  const typoData = await typoRes.json();
  const typoItems = typoData.data?.items || typoData.products || [];

  assert(typoRes.status === 200, 'Fuzzy search endpoint returned HTTP 200');
  assert(typoItems.length > 0, `Fuzzy search successfully matched ${typoItems.length} artifact(s) for typo "chanell"`);
  assert(typoData.didYouMean === 'Chanel' || typoData.data?.didYouMean === 'Chanel', `Did You Mean suggested "Chanel" for typo "chanell"`);

  // Query with typo "diro"
  const diroRes = await fetch(`${BASE_URL}/products?search=diro`, {
    headers: { 'x-test-suite': 'true' }
  });
  const diroData = await diroRes.json();
  const diroItems = diroData.data?.items || diroData.products || [];
  assert(diroItems.length > 0, `Fuzzy search matched ${diroItems.length} item(s) for typo "diro"`);

  // -------------------------------------------------------------
  // 2. Live Suggestions & Autocomplete API
  // -------------------------------------------------------------
  console.log('\n🔍 [TEST 2: LIVE AUTOCOMPLETE & SUGGESTIONS]');
  const suggestRes = await fetch(`${BASE_URL}/products/search/suggestions?q=mascaraa`, {
    headers: { 'x-test-suite': 'true' }
  });
  const suggestData = await suggestRes.json();
  const suggestions = suggestData.data?.suggestions || [];

  assert(suggestRes.status === 200, 'Suggestions endpoint returned HTTP 200');
  assert(suggestions.length > 0, `Returned ${suggestions.length} autocomplete candidate(s) for "mascaraa"`);

  // -------------------------------------------------------------
  // 3. Admin Authentication & Sales Velocity Analytics
  // -------------------------------------------------------------
  console.log('\n📈 [TEST 3: EXECUTIVE SALES VELOCITY ANALYTICS]');
  const adminLogin = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-test-suite': 'true' },
    body: JSON.stringify({ username: 'emilys', password: 'emilyspass' })
  });
  const adminCookie = adminLogin.headers.get('set-cookie');

  const velocityRes = await fetch(`${BASE_URL}/admin/analytics/sales-velocity`, {
    headers: { 'Cookie': adminCookie, 'x-test-suite': 'true' }
  });
  const velocityData = await velocityRes.json();
  const velocity = velocityData.data || velocityData;

  assert(velocityRes.status === 200, 'Sales velocity endpoint responded with HTTP 200');
  assert(velocity.totalVaultValuation > 0, `Total Vault Valuation computed: $${velocity.totalVaultValuation}`);
  assert(Array.isArray(velocity.categoryRevenue), 'Category revenue distribution array returned');
  assert(Array.isArray(velocity.topSellingArtifacts), 'Top-selling artifacts list parsed');

  // -------------------------------------------------------------
  // 4. One-Click Orders CSV Export
  // -------------------------------------------------------------
  console.log('\n📄 [TEST 4: ONE-CLICK ORDERS CSV EXPORT]');
  const ordersCsvRes = await fetch(`${BASE_URL}/admin/export/orders-csv`, {
    headers: { 'Cookie': adminCookie, 'x-test-suite': 'true' }
  });
  const ordersCsvText = await ordersCsvRes.text();

  assert(ordersCsvRes.status === 200, 'Orders CSV endpoint responded with HTTP 200');
  assert(ordersCsvRes.headers.get('content-type')?.includes('text/csv'), 'Content-Type header is text/csv');
  assert(ordersCsvText.includes('"Order ID"') && ordersCsvText.includes('"Grand Total ($)"'), 'CSV includes valid order headers');

  // -------------------------------------------------------------
  // 5. One-Click Inventory Valuation CSV Export
  // -------------------------------------------------------------
  console.log('\n📄 [TEST 5: ONE-CLICK INVENTORY VALUATION CSV EXPORT]');
  const invCsvRes = await fetch(`${BASE_URL}/admin/export/inventory-csv`, {
    headers: { 'Cookie': adminCookie, 'x-test-suite': 'true' }
  });
  const invCsvText = await invCsvRes.text();

  assert(invCsvRes.status === 200, 'Inventory CSV endpoint responded with HTTP 200');
  assert(invCsvRes.headers.get('content-type')?.includes('text/csv'), 'Content-Type header is text/csv');
  assert(invCsvText.includes('"SKU / ID"') && invCsvText.includes('"Total Valuation ($)"'), 'CSV includes valid inventory headers');

  console.log('\n📊 ================================================================');
  console.log(`✨  TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log('📊 ================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runAnalyticsFuzzyTest();
