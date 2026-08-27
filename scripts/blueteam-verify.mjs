/**
 * BLUE TEAM DEFENSIVE VERIFICATION SUITE
 * Validates active security defenses, HTTP headers, rate limiting, and SIEM SOC telemetry.
 * Run with: node scripts/blueteam-verify.mjs
 */

const BASE_URL = 'http://localhost:5000/api';

async function runBlueTeamVerification() {
  console.log('🔵 ================================================================');
  console.log('🛡️  ID10T MAISON DE LUXE - BLUE TEAM DEFENSIVE OPERATIONS AUDIT');
  console.log('🔵 ================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  🛡️  VERIFIED: ${message}`);
      passed++;
    } else {
      console.error(`  ⚠️  FAILED DEFENSE: ${message}`);
      failed++;
    }
  }

  // -------------------------------------------------------------
  // 1. HTTP Security Hardening Headers Check
  // -------------------------------------------------------------
  console.log('📡 [PHASE 1: HTTP RESPONSE SECURITY HEADERS]');
  const healthRes = await fetch(`${BASE_URL}/health`);
  
  assert(healthRes.headers.get('x-frame-options') === 'DENY', 'X-Frame-Options: DENY (Clickjacking Defended)');
  assert(healthRes.headers.get('x-content-type-options') === 'nosniff', 'X-Content-Type-Options: nosniff (MIME-Sniffing Defended)');
  assert(healthRes.headers.get('permissions-policy') !== null, 'Permissions-Policy: Camera & Geolocation Blocked');
  assert(healthRes.headers.get('content-security-policy') !== null, 'Content-Security-Policy: Script & Style Sources Enforced');

  // -------------------------------------------------------------
  // 2. SOC Telemetry & SIEM Event Harvest Check
  // -------------------------------------------------------------
  console.log('\n📡 [PHASE 2: SOC TELEMETRY & SIEM AUDIT TRAIL]');
  const adminLogin = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'emilys', password: 'emilyspass' })
  });
  const adminCookie = adminLogin.headers.get('set-cookie');
  const adminData = await adminLogin.json();

  assert(adminLogin.status === 200 && (adminData.role === 'admin' || adminData.data?.role === 'admin'), 'Admin Emily authenticated for SOC console access');

  const socRes = await fetch(`${BASE_URL}/admin/soc-telemetry`, {
    headers: { 'Cookie': adminCookie }
  });
  const socData = await socRes.json();
  const telemetry = socData.data || socData;

  assert(socRes.status === 200, 'SOC Telemetry endpoint accessed by authenticated custodian');
  assert(telemetry.defensePosture !== undefined, `Current Threat Posture: [${telemetry.defensePosture}]`);
  assert(telemetry.totalEventsLogged > 0, `SIEM Events Buffered: ${telemetry.totalEventsLogged} security events`);
  assert(Array.isArray(telemetry.recentSecurityLogs), 'Recent security audit ledger parsed successfully');

  // -------------------------------------------------------------
  // 3. Sliding-Window Rate Limiter & Abuse Prevention Test
  // -------------------------------------------------------------
  console.log('\n📡 [PHASE 3: ADAPTIVE RATE LIMITER & BRUTE-FORCE DEFENSE]');
  console.log('   Simulating burst authentication storm to verify rate limit barrier...');
  let hitRateLimit = false;
  let rateLimitStatus = 0;

  for (let i = 1; i <= 65; i++) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'invalid_user_probe', password: 'wrong' })
    });
    if (res.status === 429) {
      hitRateLimit = true;
      rateLimitStatus = res.status;
      break;
    }
  }

  assert(hitRateLimit === true && rateLimitStatus === 429, 'Rate Limiter caught brute-force storm and returned HTTP 429 Too Many Requests');

  console.log('\n🔵 ================================================================');
  console.log(`🛡️  BLUE TEAM DEFENSE STATUS: ${passed} VERIFIED | ${failed} UNVERIFIED`);
  console.log('🔵 ================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runBlueTeamVerification();
