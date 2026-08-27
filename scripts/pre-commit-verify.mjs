#!/usr/bin/env node

/**
 * ====================================================================
 * 🛡️ ID10T MAISON DE LUXE — PRE-COMMIT INTEGRITY & QUALITY GATE
 * ====================================================================
 * Automatically executes before any git commit to verify:
 * 1. TypeScript Strict Typecheck (Zero Errors Allowed)
 * 2. Vite Production Bundle Compilation
 * 3. Fast Architecture & Security Sanity Check
 */

import { execSync } from 'child_process';

console.log('\n👑 ================================================================');
console.log('⚜️  ID10T MAISON DE LUXE — PRE-COMMIT QUALITY GATE VERIFICATION');
console.log('👑 ================================================================\n');

function runStep(name, command) {
  process.stdout.write(`⏳ [GATE] Running ${name}... `);
  try {
    execSync(command, { stdio: 'pipe', encoding: 'utf-8' });
    console.log('✅ PASSED');
    return true;
  } catch (error) {
    console.log('❌ FAILED\n');
    console.error(`🚨 [GATE BLOCKED] ${name} encountered errors:\n`);
    if (error.stdout) console.error(error.stdout);
    if (error.stderr) console.error(error.stderr);
    return false;
  }
}

let allPassed = true;

// Step 1: TypeScript Strict Typecheck
if (!runStep('TypeScript Strict Typecheck (tsc --noEmit)', 'npm run typecheck')) {
  allPassed = false;
}

// Step 2: Vite Production Bundle Compilation
if (!runStep('Vite Production Bundle Compilation (vite build)', 'npm run build')) {
  allPassed = false;
}

// Step 3: Fast Core API Sanity Test
if (!runStep('Backend Integration & RBAC Sanity (npm run test:api)', 'npm run test:api')) {
  allPassed = false;
}

console.log('\n----------------------------------------------------------------');
if (allPassed) {
  console.log('✨ [ROYAL SEAL APPROVED] All quality gates passed! Commit authorized. 🛡️\n');
  process.exit(0);
} else {
  console.error('⛔ [COMMIT REJECTED] Fix the issues above before committing to the royal repository.\n');
  process.exit(1);
}
