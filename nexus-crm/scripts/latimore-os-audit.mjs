#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => readFileSync(path.join(root, file), 'utf8');
const exists = (file) => existsSync(path.join(root, file));
const checks = [];

function check(name, pass, detail) {
  checks.push({ name, pass, detail });
}

const packageJson = JSON.parse(read('package.json'));
check('package has dev script', Boolean(packageJson.scripts?.dev), 'Required for local Termux/Vite operation.');
check('package has lint script', Boolean(packageJson.scripts?.lint), 'Required for TypeScript verification.');
check('package has build script', Boolean(packageJson.scripts?.build), 'Required for production deployment.');
check('package has audit:latimore script', Boolean(packageJson.scripts?.['audit:latimore']), 'Required for Latimore OS repeatable checks.');

const envExample = exists('.env.example') ? read('.env.example') : '';
check('env documents auth provider', envExample.includes('VITE_AUTH_PROVIDER'), 'Expected VITE_AUTH_PROVIDER="local" or "firebase".');
check('env documents data provider', envExample.includes('VITE_DATA_PROVIDER'), 'Expected VITE_DATA_PROVIDER="local", "firebase", or "supabase".');
check('env avoids committed secrets', !/AIza[0-9A-Za-z_-]{20,}|eyJhbGciOi|service_role/i.test(envExample), 'No obvious API/JWT/service-role secret pattern detected.');

const supabaseSource = exists('src/supabase.ts') ? read('src/supabase.ts') : '';
check('Supabase client is guarded', supabaseSource.includes('isSupabaseConfigured') && supabaseSource.includes('typeof window'), 'Prevents blank env/localStorage access from crashing repair mode.');

const dbService = exists('src/services/dbService.ts') ? read('src/services/dbService.ts') : '';
check('db service supports local fallback', dbService.includes('subscribeLocal') && dbService.includes('addLocal'), 'Required to keep CRM operational when cloud backends fail.');
check('Supabase missing keys falls local', dbService.includes('wantsSupabase && !isSupabaseConfigured'), 'Prevents accidental Firebase/Firestore fallback when Supabase env is incomplete.');
check('Supabase write fallback enabled', dbService.includes('Supabase add failed') && dbService.includes('Supabase update failed') && dbService.includes('Supabase delete failed'), 'Runtime Supabase failures save/update/delete locally.');

check('Latimore skill stack doc exists', exists('docs/LATIMORE_OS_SKILL_STACK.md'), 'Documents imported skill strategy.');
check('CRM operational runbook exists', exists('docs/NEXUS_CRM_OPERATIONAL_RUNBOOK.md'), 'Documents run/repair/deploy path.');
check('Supabase schema exists', exists('supabase/nexus_crm_schema.sql'), 'Provides tables required by Supabase mode.');
check('Codebase audit skill exists', exists('.claude/skills/latimore-os-codebase-audit/SKILL.md'), 'Provides repeatable codebase workflow.');
check('CRM ops skill exists', exists('.claude/skills/latimore-os-crm-ops/SKILL.md'), 'Provides repeatable CRM workflow.');
check('Research-to-content skill exists', exists('.claude/skills/latimore-os-research-to-content/SKILL.md'), 'Provides repeatable content/research workflow.');

const passed = checks.filter((item) => item.pass).length;
const failed = checks.length - passed;
const report = [
  '# Latimore OS Audit Report',
  '',
  `Generated: ${new Date().toISOString()}`,
  '',
  `Result: ${passed}/${checks.length} checks passed${failed ? `, ${failed} failed` : ''}.`,
  '',
  '| Check | Status | Detail |',
  '|---|---:|---|',
  ...checks.map((item) => `| ${item.name} | ${item.pass ? 'PASS' : 'FAIL'} | ${item.detail.replace(/\|/g, '\\|')} |`),
  '',
].join('\n');

writeFileSync(path.join(root, 'LATIMORE_OS_AUDIT_REPORT.md'), report);
console.log(report);
if (failed > 0) process.exitCode = 1;
