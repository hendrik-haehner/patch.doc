#!/usr/bin/env node
// One-off bulk fix: sets every manual's *display* name (manual-meta.json's
// `name` field) to its module's name — never touches the actual PDF file on
// disk, which keeps its internal crypto filename exactly as it always has.
// Run this directly against your server's /data folder (the same one your
// docker-compose.yml mounts), not against this repo checkout.
//
// Usage:
//   node scripts/rename-manuals-to-module-name.js /path/to/data           # dry run, prints the plan
//   node scripts/rename-manuals-to-module-name.js /path/to/data --apply   # actually writes manual-meta.json
//
// Safe to re-run — it's idempotent (recomputes names from modules.json
// every time) and only touches the `name` field, never `type` or the files
// themselves. Reads the old .meta.json name if that's all a module has yet;
// always writes the new manual-meta.json name (see server.js's own
// _readSidecarJSON/_writeSidecarJSON for why: the desktop app's NAS-sync
// mode can't write dotfiles into a runtime-granted scope, so as of 1.3.26
// this app no longer uses .meta.json/.links.json for anything new).

const fs = require('fs');
const path = require('path');

const dataDir = process.argv[2];
const apply = process.argv.includes('--apply');

if (!dataDir) {
  console.error('Usage: node rename-manuals-to-module-name.js /path/to/data [--apply]');
  process.exit(1);
}

const modulesFile = path.join(dataDir, 'modules.json');
const manualsDir = path.join(dataDir, 'manuals');

if (!fs.existsSync(modulesFile)) {
  console.error(`No modules.json found at ${modulesFile} — is this your /data folder?`);
  process.exit(1);
}
if (!fs.existsSync(manualsDir)) {
  console.error(`No manuals/ folder found at ${manualsDir} — nothing to do.`);
  process.exit(1);
}

const { modules } = JSON.parse(fs.readFileSync(modulesFile, 'utf8'));
const moduleById = new Map(modules.map(m => [String(m.id), m]));

function readMeta(dir) {
  const primary = path.join(dir, 'manual-meta.json');
  const fallback = path.join(dir, '.meta.json');
  try { if (fs.existsSync(primary)) return JSON.parse(fs.readFileSync(primary, 'utf8')); } catch (e) {}
  try { if (fs.existsSync(fallback)) return JSON.parse(fs.readFileSync(fallback, 'utf8')); } catch (e) {}
  return {};
}

let totalRenamed = 0, totalSkippedNoModule = 0, totalSkippedEmpty = 0;

for (const moduleId of fs.readdirSync(manualsDir)) {
  const dir = path.join(manualsDir, moduleId);
  if (!fs.statSync(dir).isDirectory()) continue;

  const mod = moduleById.get(moduleId);
  if (!mod) {
    console.warn(`skip: module ${moduleId} has a manuals folder but no entry in modules.json`);
    totalSkippedNoModule++;
    continue;
  }

  const files = fs.readdirSync(dir).filter(f =>
    !['manual-meta.json', 'manual-links.json', '.meta.json', '.links.json'].includes(f)
    && fs.statSync(path.join(dir, f)).isFile()
  ).sort();

  if (!files.length) { totalSkippedEmpty++; continue; }

  const meta = readMeta(dir);
  files.forEach((filename, i) => {
    const newName = files.length === 1 ? `${mod.name}.pdf` : `${mod.name} (${i + 1}).pdf`;
    const oldName = meta[filename]?.name || filename;
    if (oldName !== newName) {
      console.log(`[${moduleId}] ${mod.name}: "${oldName}" -> "${newName}"`);
      totalRenamed++;
    }
    meta[filename] = { ...meta[filename], name: newName, type: meta[filename]?.type || 'application/pdf' };
  });

  if (apply) {
    fs.writeFileSync(path.join(dir, 'manual-meta.json'), JSON.stringify(meta, null, 2));
  }
}

console.log(`\n${totalRenamed} manual(s) ${apply ? 'renamed' : 'would be renamed'}.`);
if (totalSkippedNoModule) console.log(`${totalSkippedNoModule} folder(s) skipped — no matching module in modules.json.`);
if (!apply) console.log('Dry run only — rerun with --apply to actually write manual-meta.json.');
