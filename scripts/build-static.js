#!/usr/bin/env node
// Builds a server-free copy of the app into _site/, for GitHub Pages.
//
// Copies public/ as-is (skipping OS/NAS junk files that shouldn't be
// published) and switches the app into browser-only mode — no login, no
// /api/* calls, patches saved to localStorage instead — by injecting
// `window.PATCHDOC_STATIC = true` before store.js loads. See the
// PATCHDOC_STATIC checks in store.js/patch.js/manuals.js/media.js/app.js
// for what that flag actually changes.

const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'public');
const OUT = path.join(__dirname, '..', '_site');

const SKIP = new Set(['.DS_Store', '@eaDir']);

function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue;
    const s = path.join(src, entry.name);
    const d = path.join(dst, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

fs.rmSync(OUT, { recursive: true, force: true });
copyDir(SRC, OUT);

const indexPath = path.join(OUT, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');
const marker = '<script src="js/store.js"></script>';
if (!html.includes(marker)) {
  throw new Error('build-static: could not find store.js script tag to patch — did index.html change?');
}
html = html.replace(marker, '<script>window.PATCHDOC_STATIC = true;</script>\n' + marker);
fs.writeFileSync(indexPath, html);

console.log('Static build written to', OUT);
