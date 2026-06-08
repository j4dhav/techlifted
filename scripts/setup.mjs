#!/usr/bin/env node
/**
 * TechLiftED one-shot setup helper.
 * - Installs dependencies for backend + frontend (+ root).
 * - Creates .env files from .env.example where missing.
 * Run from the repo root: `npm run setup` (or `node scripts/setup.mjs`).
 */
import { execSync } from 'node:child_process';
import { existsSync, copyFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function run(cmd, cwd) {
  console.log(`\n› ${cmd}  (in ${cwd.replace(root, '.')})`);
  execSync(cmd, { cwd, stdio: 'inherit' });
}

function ensureEnv(dir) {
  const example = join(dir, '.env.example');
  const target = join(dir, '.env');
  if (existsSync(example) && !existsSync(target)) {
    copyFileSync(example, target);
    console.log(`  created ${target.replace(root, '.')} (fill in your values)`);
  }
}

console.log('TechLiftED setup — installing dependencies and preparing env files.');

run('npm install', root);
run('npm install', join(root, 'backend'));
run('npm install', join(root, 'frontend'));

ensureEnv(join(root, 'backend'));
ensureEnv(join(root, 'frontend'));

console.log(`
✓ Setup complete.

Next steps:
  1. Fill in backend/.env  (ADMIN_TOKEN, Google Sheets, Twilio — see README).
  2. (Optional) Fill in frontend/.env for production / WhatsApp link.
  3. Start both servers:   npm run dev
       Frontend → http://localhost:5173
       Backend  → http://localhost:4000
`);
