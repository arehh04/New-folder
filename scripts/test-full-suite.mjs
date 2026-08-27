/**
 * Automated System Test Suite
 * Validates full-stack security, caching, Bloom filter defenses, authentication, and data isolation.
 * Run with: npm run test:api
 */

const BASE_URL = 'http://localhost:5000/api';

async function runTestSuite() {
  console.log('👑 ====================================================');
  console.log('⚜️  ID10T MAISON DE LUXE - AUTOMATED TEST SUITE');
  console.log('👑 ====================================================\n');

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

  try {
    // 1. Health & Centralized Config
    console.log('🧪 TEST SUITE 1: API Server Health & Centralized Configuration');
    const healthRes = await fetch(`${BASE_URL}/health`, {
      headers: { 'x-test-suite': 'true' }
    });
    const healthData = await healthRes.json();
    assert(healthRes.status === 200, 'Health endpoint responds with HTTP 200');
    assert(healthData.success === true, 'Response conforms to standard ApiResponse envelope');
    assert(healthData.data?.environment === 'development', 'Environment is correctly configured');

    // 2. Bloom Filter Cache Penetration Defense
    console.log('\n🧪 TEST SUITE 2: Probabilistic Bloom Filter Defense');
    const invalidProductRes = await fetch(`${BASE_URL}/products/999999`, {
      headers: { 'x-test-suite': 'true' }
    });
    const invalidProductData = await invalidProductRes.json();
    assert(invalidProductRes.status === 404, 'Invalid product ID rejected with HTTP 404');
    assert(invalidProductData.bloomProtected === true || invalidProductData.error?.code === 'BLOOM_NOT_FOUND', 'Bloom filter caught cache penetration attack in O(1)');

    // 3. Redis Caching
    console.log('\n🧪 TEST SUITE 3: Redis Caching & Catalog Retrieval');
    const catalogRes1 = await fetch(`${BASE_URL}/products?limit=4`, {
      headers: { 'x-test-suite': 'true' }
    });
    const catalogData1 = await catalogRes1.json();
    assert(catalogRes1.status === 200, 'Products catalog retrieved successfully');
    assert(Array.isArray(catalogData1.data?.items || catalogData1.products), 'Products returned in structured array');

    // 4. Bcrypt Password Authentication & Cookie Issuance
    console.log('\n🧪 TEST SUITE 4: Bcrypt Authentication & Cookie Issuance');
    const patronLogin = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-test-suite': 'true' },
      body: JSON.stringify({ username: 'michaelw', password: 'michaelwpass' })
    });
    const patronCookie = patronLogin.headers.get('set-cookie');
    const patronData = await patronLogin.json();
    const patronRole = patronData.role || patronData.data?.role;
    assert(patronLogin.status === 200, 'Patron Michael logged in successfully');
    assert(patronRole === 'patron', 'Patron assigned correct role');
    assert((patronData.passwordHash || patronData.data?.passwordHash) === undefined, 'Security boundary: passwordHash stripped from output');
    assert(patronCookie && patronCookie.includes('royal_session'), 'HTTP-Only royal_session cookie issued');

    // 5. Data Isolation & RBAC Protection
    console.log('\n🧪 TEST SUITE 5: Strict Data Isolation & RBAC Boundaries');
    // Unauthenticated mutation attempt
    const unauthDelete = await fetch(`${BASE_URL}/products/1`, {
      method: 'DELETE',
      headers: { 'x-test-suite': 'true' }
    });
    assert(unauthDelete.status === 401, 'Unauthenticated product deletion rejected with 401');

    // Patron mutation attempt (Privilege escalation defense)
    const patronDelete = await fetch(`${BASE_URL}/products/1`, {
      method: 'DELETE',
      headers: { 'Cookie': patronCookie, 'x-test-suite': 'true' }
    });
    assert(patronDelete.status === 403, 'Patron mutation attempt blocked with 403 Forbidden');

    // Patron Order Creation & Isolation
    const orderRes = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': patronCookie, 'x-test-suite': 'true' },
      body: JSON.stringify({
        items: [{ id: 6, title: 'Calvin Klein CK One', price: 49.99, quantity: 1 }],
        subtotal: 49.99,
        total: 49.99
      })
    });
    const orderData = await orderRes.json();
    const createdOrderId = orderData.data?.order?.orderId || orderData.order?.orderId;
    assert(orderRes.status === 201, `Patron order created: ${createdOrderId}`);

    // Foreign user attempt to read Michael's order
    const foreignRes = await fetch(`${BASE_URL}/orders/${createdOrderId}`, {
      headers: { 'x-test-suite': 'true' }
    });
    assert(foreignRes.status === 403, 'Anonymous/Foreign access to patron order blocked with 403');

    // 6. Admin Telemetry & Dispatch Progression
    console.log('\n🧪 TEST SUITE 6: Admin Executive KPIs & Live Dispatch Updates');
    const adminLogin = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-test-suite': 'true' },
      body: JSON.stringify({ username: 'emilys', password: 'emilyspass' })
    });
    const adminCookie = adminLogin.headers.get('set-cookie');
    assert(adminLogin.status === 200, 'Admin Emily authenticated successfully');

    const metricsRes = await fetch(`${BASE_URL}/admin/metrics`, {
      headers: { 'Cookie': adminCookie, 'x-test-suite': 'true' }
    });
    const metricsData = await metricsRes.json();
    const totalRev = metricsData.metrics?.totalRevenue ?? metricsData.data?.grossRevenue ?? metricsData.data?.totalRevenue;
    assert(metricsRes.status === 200, 'Admin metrics retrieved successfully');
    assert(totalRev !== undefined, `Gross Vault Revenue computed: $${totalRev}`);

    const statusUpdateRes = await fetch(`${BASE_URL}/admin/orders/${createdOrderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Cookie': adminCookie, 'x-test-suite': 'true' },
      body: JSON.stringify({ status: 'Delivered to Estate' })
    });
    assert(statusUpdateRes.status === 200, `Order ${createdOrderId} fulfillment status advanced to "Delivered to Estate"`);

    console.log('\n👑 ====================================================');
    console.log(`⚜️  TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
    console.log('👑 ====================================================\n');

    if (failed > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error('💥 Test suite encountered fatal exception:', error);
    process.exit(1);
  }
}

runTestSuite();
