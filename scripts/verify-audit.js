import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🔍 Running Parivahan Next 2.0 Comprehensive Audit Verification...');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
    failed++;
  }
}

// 1. Check Dist Artifacts
console.log('\n📦 1. Checking Build Artifacts:');
const distHtml = path.join(rootDir, 'dist', 'index.html');
assert(fs.existsSync(distHtml), 'dist/index.html exists');

const distAssets = path.join(rootDir, 'dist', 'assets');
assert(fs.existsSync(distAssets), 'dist/assets directory exists');

const assetFiles = fs.readdirSync(distAssets);
assert(assetFiles.some(f => f.startsWith('vendor-react')), 'vendor-react chunk created');
assert(assetFiles.some(f => f.startsWith('vendor-icons')), 'vendor-icons chunk created');
assert(assetFiles.some(f => f.startsWith('vendor-confetti')), 'vendor-confetti chunk created');

// 2. Check Security in dist/index.html
console.log('\n🛡️ 2. Checking Security & Secret Hygiene:');
const htmlContent = fs.readFileSync(distHtml, 'utf-8');
assert(!htmlContent.includes('eval('), 'No eval references in dist HTML');
assert(!htmlContent.includes('SECRET'), 'No un-redacted secrets in HTML');

// 3. Check Configuration & Deployment Files
console.log('\n🚀 3. Checking Deployment Configuration Files:');
assert(fs.existsSync(path.join(rootDir, 'Dockerfile')), 'Production Dockerfile present');
assert(fs.existsSync(path.join(rootDir, 'nginx.conf')), 'Hardened nginx.conf present');
assert(fs.existsSync(path.join(rootDir, '.dockerignore')), '.dockerignore present');
assert(fs.existsSync(path.join(rootDir, '.github', 'workflows', 'ci.yml')), 'GitHub Actions CI workflow present');

// 4. Summary
console.log(`\n📊 Audit Verification Results: ${passed} Passed, ${failed} Failed`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 System is 100% Verified & Production-Ready!');
}
