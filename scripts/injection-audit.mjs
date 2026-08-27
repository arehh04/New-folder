/**
 * SQL / NoSQL INJECTION PENETRATION AUDIT
 * Executes offensive SQL and NoSQL injection payloads against authentication, catalog, search, and order routes.
 * Run with: node scripts/injection-audit.mjs
 */

const BASE_URL = 'http://localhost:5000/api';

async function runInjectionAudit() {
  console.log('💉 ================================================================');
  console.log('⚔️  ID10T MAISON DE LUXE - SQL & NoSQL INJECTION PENETRATION SUITE');
  console.log('💉 ================================================================\n');

  let passed = 0;
  let failed = 0;

  function assertDefense(testName, isDefended, details) {
    if (isDefended) {
      console.log(`  🛡️  DEFENDED: [${testName}]`);
      console.log(`     └─ Reason: ${details}\n`);
      passed++;
    } else {
      console.error(`  🚨 VULNERABILITY DETECTED: [${testName}]`);
      console.error(`     └─ Breach: ${details}\n`);
      failed++;
    }
  }

  // -------------------------------------------------------------
  // 1. NoSQL Authentication Bypass via $gt / $ne Object Injection
  // -------------------------------------------------------------
  console.log('🎯 [PHASE 1: NoSQL AUTHENTICATION OPERATOR INJECTION]');
  try {
    const nosqlLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-test-suite': 'true' },
      body: JSON.stringify({
        username: { $gt: '' },
        password: { $gt: '' }
      })
    });
    const nosqlData = await nosqlLoginRes.json();

    // Must be rejected (400 or 401) and MUST NOT return an authenticated session or 500 unhandled crash
    const isBypassed = nosqlLoginRes.status === 200 && (nosqlData.role || nosqlData.data?.role);
    assertDefense(
      'NoSQL Auth Bypass ({ $gt: "" } Object Injection)',
      !isBypassed && nosqlLoginRes.status < 500,
      `Server rejected object payload with HTTP ${nosqlLoginRes.status} (${nosqlData.message || nosqlData.error?.code})`
    );
  } catch (e) {
    assertDefense('NoSQL Auth Bypass ({ $gt: "" })', false, `Unhandled Server Crash: ${e.message}`);
  }

  // -------------------------------------------------------------
  // 2. Classic SQL Injection Login Bypass (' OR 1=1 --)
  // -------------------------------------------------------------
  console.log('🎯 [PHASE 2: CLASSIC SQL INJECTION IN LOGIN]');
  try {
    const sqliLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-test-suite': 'true' },
      body: JSON.stringify({
        username: "admin' OR '1'='1' --",
        password: "' OR '1'='1"
      })
    });
    const sqliData = await sqliLoginRes.json();

    assertDefense(
      "Classic SQLi Auth Bypass (admin' OR '1'='1' --)",
      sqliLoginRes.status === 401 || sqliLoginRes.status === 400,
      `Bcrypt verification and Bloom filter rejected SQL string with HTTP ${sqliLoginRes.status} (${sqliData.message || sqliData.error?.code})`
    );
  } catch (e) {
    assertDefense('Classic SQLi Auth Bypass', false, e.message);
  }

  // -------------------------------------------------------------
  // 3. NoSQL Parameter Pollution in Product Search ($regex / $where)
  // -------------------------------------------------------------
  console.log('🎯 [PHASE 3: NoSQL SEARCH PARAMETER POLLUTION]');
  try {
    // Attempting query parameter object pollution
    const searchRes = await fetch(`${BASE_URL}/products?search[$regex]=.*&x-test-suite=true`, {
      headers: { 'x-test-suite': 'true' }
    });
    const searchData = await searchRes.json();

    assertDefense(
      'NoSQL Regex Object Parameter Pollution in /products?search',
      searchRes.status === 200 && Array.isArray(searchData.data?.items || searchData.products),
      `Server handled/sanitized query parameter object safely (HTTP ${searchRes.status})`
    );
  } catch (e) {
    assertDefense('NoSQL Regex Search Pollution', false, e.message);
  }

  // -------------------------------------------------------------
  // 4. SQL UNION SELECT in Search Query Parameter
  // -------------------------------------------------------------
  console.log('🎯 [PHASE 4: SQL UNION INJECTION IN SEARCH]');
  try {
    const unionRes = await fetch(`${BASE_URL}/products?search=${encodeURIComponent("' UNION SELECT * FROM users --")}`, {
      headers: { 'x-test-suite': 'true' }
    });
    const unionData = await unionRes.json();
    const items = unionData.data?.items || unionData.products || [];

    // Check if any passwords or user objects leaked into product items
    const leakedUsers = items.some(item => item.passwordHash || item.password || item.username);
    assertDefense(
      'SQL UNION Data Exfiltration in Product Search',
      !leakedUsers,
      !leakedUsers ? `Clean response: 0 internal user credentials leaked in catalog (HTTP ${unionRes.status})` : 'CRITICAL: User credentials leaked!'
    );
  } catch (e) {
    assertDefense('SQL UNION Data Exfiltration', false, e.message);
  }

  // -------------------------------------------------------------
  // 5. NoSQL IDOR / Wildcard in Order Lookup (/api/orders/:id)
  // -------------------------------------------------------------
  console.log('🎯 [PHASE 5: NoSQL OPERATOR INJECTION IN ORDER LOOKUP]');
  try {
    const nosqlOrderRes = await fetch(`${BASE_URL}/orders/${encodeURIComponent('{"$ne":null}')}`, {
      headers: { 'x-test-suite': 'true' }
    });
    const nosqlOrderData = await nosqlOrderRes.json();

    assertDefense(
      'NoSQL Wildcard Order Exfiltration (/orders/{"$ne":null})',
      nosqlOrderRes.status === 404 || nosqlOrderRes.status === 403,
      `Server safely rejected wildcard lookup with HTTP ${nosqlOrderRes.status} (${nosqlOrderData.message || nosqlOrderData.error?.code})`
    );
  } catch (e) {
    assertDefense('NoSQL Wildcard Order Exfiltration', false, e.message);
  }

  // -------------------------------------------------------------
  // 6. Time-Based Blind Injection Probe ($where: sleep)
  // -------------------------------------------------------------
  console.log('🎯 [PHASE 6: TIME-BASED BLIND INJECTION PROBE]');
  try {
    const startTime = Date.now();
    const timeRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-test-suite': 'true' },
      body: JSON.stringify({
        username: { $where: 'sleep(3000)' },
        email: 'attacker@evil.com',
        password: 'password123'
      })
    });
    const duration = Date.now() - startTime;
    const timeData = await timeRes.json();

    const isTimeDelayed = duration >= 3000;
    assertDefense(
      'Time-Based Blind NoSQL Injection ($where Sleep Attack)',
      !isTimeDelayed && timeRes.status < 500,
      `Request completed in ${duration}ms (no thread sleep triggered), responded with HTTP ${timeRes.status}`
    );
  } catch (e) {
    assertDefense('Time-Based Blind NoSQL Injection', false, e.message);
  }

  console.log('💉 ================================================================');
  console.log(`⚔️  INJECTION AUDIT RESULTS: ${passed} DEFENDED | ${failed} VULNERABLE`);
  console.log('💉 ================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runInjectionAudit();
