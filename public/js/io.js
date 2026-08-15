const IO = {

  async exportCanvasPNG() {
    const feedback = document.getElementById('png-feedback');
    if (feedback) { feedback.textContent = 'generating…'; feedback.style.color = 'var(--text2)'; }

    try {
      // Load dom-to-image-more (supports modern CSS like color-mix)
      if (!window.domtoimage) {
        await new Promise((resolve, reject) => {
          const s = document.createElement('script');
          s.src = 'https://cdnjs.cloudflare.com/ajax/libs/dom-to-image-more/3.3.0/dom-to-image-more.min.js';
          s.onload = resolve; s.onerror = reject;
          document.head.appendChild(s);
        });
      }

      const canvas = document.getElementById('patch-canvas');
      if (!canvas) throw new Error('canvas not found');

      // Make patch-canvas temporarily visible without switching tab
      const patchView = document.getElementById('patch-view');
      const wasHidden = patchView && !patchView.classList.contains('active');
      if (wasHidden) {
        patchView.style.display = 'flex';
        patchView.style.position = 'fixed';
        patchView.style.left = '-9999px';
        patchView.style.top = '0';
      }

      const patchTitle = (Store.getActivePatch()?.title || 'patch').replace(/[^a-z0-9]/gi, '_');

      // Get content bounds from modules
      const modules = canvas.querySelectorAll('.patch-module');
      let minX = Infinity, minY = Infinity, maxX = 0, maxY = 0;
      modules.forEach(m => {
        const x = parseFloat(m.style.left) || 0;
        const y = parseFloat(m.style.top)  || 0;
        minX = Math.min(minX, x); minY = Math.min(minY, y);
        maxX = Math.max(maxX, x + m.offsetWidth);
        maxY = Math.max(maxY, y + m.offsetHeight);
      });

      if (!isFinite(minX)) { minX = 0; minY = 0; maxX = 800; maxY = 600; }
      const pad = 40;
      minX = Math.max(0, minX - pad);
      minY = Math.max(0, minY - pad);
      const W = Math.min(maxX - minX + pad * 2, canvas.scrollWidth);
      const H = Math.min(maxY - minY + pad * 2, canvas.scrollHeight);

      const bgColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--canvas-bg').trim() || '#f0eeea';

      // Fix module widths: force explicit px width so dom-to-image renders correctly
      const moduleEls = canvas.querySelectorAll('.patch-module');
      moduleEls.forEach(m => {
        const w = m.offsetWidth;
        m.dataset._origW = m.style.width;
        m.style.width = w + 'px';
        // Also fix text-overflow: ellipsis elements — expand them
        m.querySelectorAll('*').forEach(el => {
          if (getComputedStyle(el).textOverflow === 'ellipsis') {
            el.dataset._origOv = el.style.overflow;
            el.dataset._origWs = el.style.whiteSpace;
            el.style.overflow = 'visible';
            el.style.whiteSpace = 'normal';
          }
        });
      });

      const dataUrl = await domtoimage.toPng(canvas, {
        bgcolor: bgColor,
        width: W,
        height: H,
        style: {
          transform: `translate(-${minX}px, -${minY}px)`,
          transformOrigin: '0 0',
        },
        quality: 1,
      });

      // Restore module widths and text styles
      moduleEls.forEach(m => {
        m.style.width = m.dataset._origW || '';
        m.querySelectorAll('*').forEach(el => {
          if (el.dataset._origOv !== undefined) {
            el.style.overflow  = el.dataset._origOv;
            el.style.whiteSpace = el.dataset._origWs;
            delete el.dataset._origOv;
            delete el.dataset._origWs;
          }
        });
      });

      if (wasHidden) {
        patchView.style.display = '';
        patchView.style.position = '';
        patchView.style.left = '';
        patchView.style.top = '';
      }

      const link = document.createElement('a');
      link.download = patchTitle + '.png';
      link.href = dataUrl;
      link.click();

      if (feedback) { feedback.textContent = '✓ PNG saved'; feedback.style.color = 'var(--success)'; }
      setTimeout(() => { if (feedback) feedback.textContent = ''; }, 3000);

    } catch(e) {
      console.error('PNG export error:', e);
      if (feedback) { feedback.textContent = '✗ ' + e.message; feedback.style.color = 'var(--danger)'; }
    }
  },

  // ── Export ──────────────────────────────────────────────────────────────

  exportAll() {
    this._download(Store.exportAll(), 'patchdoc_backup.json');
    this._feedback('export', 'ok', 'full backup downloaded');
  },

  exportPatch() {
    const patch = Store.getActivePatch();
    const slug  = (patch.title || 'patch').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    this._download(Store.exportPatch(patch.id), slug + '.json');
    this._feedback('export', 'ok', patch.title + ' exported');
  },

  copyPatch() {
    navigator.clipboard.writeText(Store.exportPatch(Store.getActivePatch().id))
      .then(() => this._feedback('export', 'ok', 'copied to clipboard'))
      .catch(() => this._feedback('export', 'err', 'clipboard unavailable — use download'));
  },

  // ── PDF Export ─────────────────────────────────────────────────────────

  exportPDF() {
    const patch   = Store.getActivePatch();
    const modules = Store.state.modules;

    // Build canvas SVG snapshot
    const canvasSVG = this._snapshotCanvas(patch, modules);

    // Build params HTML
    const paramsHTML = this._buildParamsHTML(patch, modules);

    // Build notes HTML
    const notesHTML = (patch.notes || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/\n/g,'<br>');

    const dateStr = new Date().toLocaleDateString('de-DE', {day:'2-digit',month:'2-digit',year:'numeric'});

    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${patch.title || 'patch'} — PATCH.doc</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
    font-size: 9pt;
    color: #1a1a18;
    background: #fff;
  }

  /* ── page 1: patch canvas — A3 landscape ── */
  .sheet-patch {
    page: patchpage;
    width: 420mm; min-height: 297mm;
    padding: 14mm 16mm;
  }
  @page patchpage {
    size: A3 landscape;
    margin: 0;
  }

  /* ── page 2: parameters + notes — A4 portrait ── */
  .sheet-params {
    page: paramspage;
    width: 210mm; min-height: 297mm;
    padding: 14mm 16mm;
    page-break-before: always;
  }
  @page paramspage {
    size: A4 portrait;
    margin: 0;
  }

  .page-header {
    display: flex; align-items: baseline; justify-content: space-between;
    border-bottom: 1pt solid #ccc; padding-bottom: 4mm; margin-bottom: 6mm;
  }
  .page-header h1 { font-size: 16pt; font-weight: 600; letter-spacing: 0.02em; }
  .page-header .meta { font-size: 8pt; color: #888; }
  .brand { font-size: 9pt; color: #888; letter-spacing: 0.1em; }

  .section-label {
    font-size: 7pt; letter-spacing: 0.12em; color: #aaa;
    font-weight: 600; margin-bottom: 3mm; text-transform: uppercase;
  }

  /* canvas section (page 1) */
  .canvas-section {
    border: 0.5pt solid #ddd; border-radius: 4pt;
    padding: 5mm; overflow: hidden;
  }
  .canvas-svg-wrap { width: 100%; overflow: hidden; }
  .canvas-svg-wrap svg { max-width: 100%; height: auto; display: block; }

  /* params section (page 2) */
  .params-section {
    columns: 2; column-gap: 8mm;
  }
  .module-card {
    margin-bottom: 5mm; break-inside: avoid;
  }
  .module-card-header {
    display: flex; align-items: center; gap: 4pt;
    border-bottom: 0.5pt solid #eee; padding-bottom: 2mm; margin-bottom: 2mm;
    font-weight: 600; font-size: 8.5pt;
  }
  .mod-dot { width: 7pt; height: 7pt; border-radius: 50%; flex-shrink: 0; }
  .mod-maker { font-size: 7pt; color: #aaa; font-weight: 400; margin-left: auto; }
  .param-line {
    display: flex; justify-content: space-between; align-items: center;
    padding: 1.5pt 0; border-bottom: 0.3pt solid #f0f0f0; font-size: 8pt;
  }
  .param-line:last-child { border-bottom: none; }
  .param-n { color: #555; }
  .param-v { font-weight: 600; color: #1a1a18; }
  .param-t { font-size: 7pt; color: #bbb; margin-left: 4pt; }

  /* notes section (page 2, below params) */
  .notes-section {
    margin-top: 8mm; border-top: 0.5pt solid #ddd; padding-top: 5mm;
  }
  .notes-text { font-size: 8.5pt; line-height: 1.7; color: #333; white-space: pre-wrap; }
</style>
</head>
<body>

<!-- PAGE 1 — patch canvas, A3 landscape -->
<div class="sheet-patch">
  <div class="page-header">
    <h1>${patch.title || 'Untitled Patch'}</h1>
    <div style="text-align:right">
      <div class="brand">◉ PATCH.doc</div>
      <div class="meta">${dateStr} · ${patch.patchModules.length} module(s) · ${patch.cables.length} cable(s)</div>
    </div>
  </div>

  <div class="canvas-section">
    <div class="section-label">patch canvas</div>
    <div class="canvas-svg-wrap">${canvasSVG}</div>
  </div>
</div>

<!-- PAGE 2 — parameters + notes, A4 portrait -->
<div class="sheet-params">
  <div class="page-header">
    <h1>${patch.title || 'Untitled Patch'}</h1>
    <div style="text-align:right">
      <div class="brand">◉ PATCH.doc</div>
      <div class="meta">${dateStr}</div>
    </div>
  </div>

  <div class="section-label">parameters</div>
  <div class="params-section">
    ${paramsHTML}
  </div>

  <div class="notes-section">
    <div class="section-label">notes</div>
    <div class="notes-text">${notesHTML || '<span style="color:#ccc">—</span>'}</div>
  </div>
</div>

<script>window.onload = () => { window.print(); }</script>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url  = URL.createObjectURL(blob);
    const win  = window.open(url, '_blank');
    if (!win) {
      this._feedback('export', 'err', 'popup blocked — please allow popups for this site');
      return;
    }
    setTimeout(() => URL.revokeObjectURL(url), 10000);
    this._feedback('export', 'ok', 'PDF-Druckdialog wird geöffnet…');
  },

  _snapshotCanvas(patch, modules) {
    const CAT = {
      oscillator:'#8f86e8', filter:'#2aaa7a', envelope:'#d4963a',
      lfo:'#4a9fd4', vca:'#c45c82', sequencer:'#c8612a',
      effects:'#7aaa2a', utility:'#7a8a78', other:'#7a8a78'
    };
    const CABLE_COLORS = ['#8f86e8','#2aaa7a','#c8612a','#4a9fd4','#c45c82','#d4963a','#7aaa2a','#a07060'];

    if (!patch.patchModules.length) {
      return '<svg width="400" height="100"><text x="20" y="40" font-family="monospace" font-size="12" fill="#ccc">no modules in patch</text></svg>';
    }

    const MW = 130, PORT_H = 14, HEADER_H = 22, PAD = 8;

    // Calculate module heights and port positions
    const pmLayouts = {};
    patch.patchModules.forEach(pm => {
      const m = modules.find(x => x.id === pm.moduleId);
      if (!m) return;
      const rows = Math.max(m.inputs.length, m.outputs.length);
      const h    = HEADER_H + rows * PORT_H + PAD;
      pmLayouts[pm.id] = { pm, m, h, rows };
    });

    // Canvas bounds — must also account for cable sag, which can extend
    // below the lowest module if two distant modules are connected.
    const xs  = patch.patchModules.map(pm => pm.x);
    const ys  = patch.patchModules.map(pm => pm.y);
    const maxModX = Math.max(...xs) + MW + 20;
    const maxModY = Math.max(...ys) + Math.max(...Object.values(pmLayouts).map(l => l.h)) + 20;
    const W = Math.max(400, maxModX);
    let H = Math.max(200, maxModY);

    // Port center helper (SVG-space)
    const portCenters = {};
    patch.patchModules.forEach(pm => {
      const lay = pmLayouts[pm.id];
      if (!lay) return;
      const { m } = lay;
      m.inputs.forEach((p, i) => {
        const name = Patch._portName(p);
        portCenters[`${pm.id}-in-${name}`] = {
          x: pm.x + 10,
          y: pm.y + HEADER_H + i * PORT_H + PORT_H / 2
        };
      });
      m.outputs.forEach((p, i) => {
        const name = Patch._portName(p);
        portCenters[`${pm.id}-out-${name}`] = {
          x: pm.x + MW - 10,
          y: pm.y + HEADER_H + i * PORT_H + PORT_H / 2
        };
      });
    });

    // Draw cables — also track the deepest point any cable curve reaches,
    // so the canvas can be expanded to fit cables that sag below the
    // lowest module (happens when connecting distant modules).
    let cableSVG = '';
    let maxCableY = 0;
    patch.cables.forEach((c, idx) => {
      const from = portCenters[`${c.fromPm}-out-${c.fromPort}`];
      const to   = portCenters[`${c.toPm}-in-${c.toPort}`];
      if (!from || !to) return;
      const totalDx = to.x - from.x;
      const totalDy = to.y - from.y;
      let pathD, maxY;

      if (totalDx < 0) {
        // Target is to the left of the source — loop vertically instead
        // of swinging backward. Matches the live canvas rendering's
        // proportional STUB/loopAmount scaling (scaled-down constants
        // for the smaller PDF coordinate space).
        const dist  = Math.sqrt(totalDx * totalDx + totalDy * totalDy);
        const scale = Math.min(1, dist / 400);
        const loopDir = totalDy >= 0 ? 1 : -1;
        const STUB = 30 + 160 * scale;
        const loopAmount = Math.max(34, Math.abs(totalDy) * 0.24) * Math.max(0.55, scale);
        const cp1 = { x: from.x + STUB, y: from.y + loopAmount * loopDir };
        const cp2 = { x: to.x   - STUB, y: to.y   + loopAmount * loopDir };
        pathD = `M${from.x},${from.y} C${cp1.x},${cp1.y} ${cp2.x},${cp2.y} ${to.x},${to.y}`;
        maxY = Math.max(cp1.y, cp2.y);
      } else {
        const dist = Math.sqrt(totalDx * totalDx + totalDy * totalDy);
        const rawSag = 40 + Math.abs(totalDy) * 0.15;
        const sag = Math.min(rawSag, 100); // capped, matches the live canvas rendering
        const rawBow = Math.abs(totalDx) * 0.5;
        const bow = Math.min(rawBow, 90); // capped, matches the live canvas rendering

        // STUB capped relative to available space — prevents control point
        // crossover/loops on short or mostly-horizontal cables.
        const halfDx = totalDx / 2;
        const STUB = Math.min(28, halfDx * 0.8);
        const blend = Math.min(1, dist / 200);
        const cp1 = { x: from.x + STUB + bow * 0.3 * blend, y: from.y + sag * blend };
        const cp2 = { x: to.x   - STUB - bow * 0.3 * blend, y: to.y   + sag * blend };
        pathD = `M${from.x},${from.y} C${cp1.x},${cp1.y} ${cp2.x},${cp2.y} ${to.x},${to.y}`;
        maxY = Math.max(cp1.y, cp2.y);
      }

      const col = c.color || CABLE_COLORS[idx % CABLE_COLORS.length];
      cableSVG += `<path d="${pathD}"
        stroke="${col}" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.8"/>`;
      // control points define the curve's reach — track the lower of the two
      maxCableY = Math.max(maxCableY, maxY);
    });
    if (maxCableY + 20 > H) H = maxCableY + 20;

    // Draw modules
    let modSVG = '';
    patch.patchModules.forEach(pm => {
      const lay = pmLayouts[pm.id];
      if (!lay) return;
      const { m, h } = lay;
      const col = CAT[m.cat] || '#888';
      const x = pm.x, y = pm.y;

      modSVG += `
        <g>
          <rect x="${x}" y="${y}" width="${MW}" height="${h}"
            rx="4" fill="white" stroke="#ddd" stroke-width="0.8"/>
          <rect x="${x}" y="${y}" width="${MW}" height="${HEADER_H}"
            rx="4" fill="#f7f7f5" stroke="none"/>
          <rect x="${x}" y="${y + HEADER_H - 2}" width="${MW}" height="2" fill="#f7f7f5"/>
          <circle cx="${x+9}" cy="${y+11}" r="4" fill="${col}"/>
          <text x="${x+18}" y="${y+14}" font-family="monospace" font-size="9" font-weight="600" fill="#222">
            ${m.name}${pm.instance > 1 ? ' #'+pm.instance : ''}
          </text>
          <text x="${x+MW-5}" y="${y+14}" font-family="monospace" font-size="7" fill="#aaa" text-anchor="end">
            ${m.maker.split(' ').pop()}
          </text>
          ${m.inputs.map((p, i) => {
            const name = Patch._portName(p);
            const py = y + HEADER_H + i * PORT_H + PORT_H / 2;
            const connected = patch.cables.some(c => c.toPm === pm.id && c.toPort === name);
            const jackFill  = connected ? (patch.cables.find(c => c.toPm === pm.id && c.toPort === name)?.color || col) : '#eee';
            return `<circle cx="${x+10}" cy="${py}" r="4" fill="${jackFill}" stroke="${col}" stroke-width="1"/>
              <text x="${x+18}" y="${py+3}" font-family="monospace" font-size="7" fill="#888">${name}</text>`;
          }).join('')}
          ${m.outputs.map((p, i) => {
            const name = Patch._portName(p);
            const py = y + HEADER_H + i * PORT_H + PORT_H / 2;
            const connected = patch.cables.some(c => c.fromPm === pm.id && c.fromPort === name);
            const jackFill  = connected ? (patch.cables.find(c => c.fromPm === pm.id && c.fromPort === name)?.color || col) : '#eee';
            return `<circle cx="${x+MW-10}" cy="${py}" r="4" fill="${jackFill}" stroke="${col}" stroke-width="1"/>
              <text x="${x+MW-18}" y="${py+3}" font-family="monospace" font-size="7" fill="#888" text-anchor="end">${name}</text>`;
          }).join('')}
        </g>`;
    });

    return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg"
      style="background:#fafaf8;border-radius:3pt">
      <rect width="${W}" height="${H}" fill="#fafaf8"/>
      ${cableSVG}${modSVG}
    </svg>`;
  },

  _buildParamsHTML(patch, modules) {
    const CAT = {
      oscillator:'#8f86e8', filter:'#2aaa7a', envelope:'#d4963a',
      lfo:'#4a9fd4', vca:'#c45c82', sequencer:'#c8612a',
      effects:'#7aaa2a', utility:'#7a8a78', other:'#7a8a78'
    };
    if (!patch.patchModules.length) return '<p style="color:#ccc;font-size:8pt">—</p>';

    return patch.patchModules.map(pm => {
      const m = modules.find(x => x.id === pm.moduleId);
      if (!m) return '';
      const col  = CAT[m.cat] || '#888';
      const vals = patch.params[pm.id] || {};
      const defs = m.paramDefs || [];
      const allKeys = [
        ...defs.map(d => d.name),
        ...Object.keys(vals).filter(k => !defs.find(d => d.name === k))
      ];
      if (!allKeys.length) return '';
      const rows = allKeys.map(k => {
        const def = defs.find(d => d.name === k);
        let val = vals[k] !== undefined ? vals[k] : (def?.default ?? '—');
        const typ = def ? def.type : 'text';
        // Round knob values for display — handles any legacy unrounded data too
        if (typ === 'knob' && typeof val === 'number') {
          const range = (def?.max ?? 100) - (def?.min ?? 0);
          val = range >= 10 ? Math.round(val) : Math.round(val * 10) / 10;
        }
        const disp = val === true ? 'on' : val === false ? 'off' : String(val);
        return `<div class="param-line">
          <span class="param-n">${k}</span>
          <span><span class="param-v">${disp}</span><span class="param-t">${typ}</span></span>
        </div>`;
      }).join('');
      return `<div class="module-card">
        <div class="module-card-header">
          <span class="mod-dot" style="background:${col}"></span>
          <span>${m.name}${pm.instance > 1 ? ' #'+pm.instance : ''}</span>
          <span class="mod-maker">${m.maker}</span>
        </div>
        ${rows}
      </div>`;
    }).filter(Boolean).join('');
  },

  // ── Import dispatcher ───────────────────────────────────────────────────

  importFromText() {
    const raw = document.getElementById('import-textarea').value.trim();
    if (!raw) { this._feedback('import', 'err', 'nothing pasted'); return; }
    this._parse(raw);
  },

  loadFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => this._parse(ev.target.result, file.name);
    reader.readAsText(file);
    e.target.value = '';
  },

  // The desktop build's WKWebView opens the native file picker fine, but
  // the picked file's contents don't reliably come back through the
  // browser File/FileReader APIs — `input.files` ends up empty. Tauri
  // injects `window.__TAURI__` into every page it hosts, so we use that
  // to route file loading through its own dialog+fs plugins instead,
  // only when actually running inside the desktop app.
  isTauri() {
    return typeof window.__TAURI__ !== 'undefined';
  },

  // Tauri's dialog plugin unconditionally overrides window.confirm with an
  // async stub the moment the plugin is registered (see its init-iife.js)
  // — and in the currently pinned plugin version that stub calls an IPC
  // command ("confirm") the Rust side never actually registers, so it
  // just rejects instead of showing anything. Routing through the
  // plugin's own working `dialog.confirm()` API sidesteps that bug. Every
  // confirm() call site in the app must go through this (not the global
  // confirm()) and must be awaited — in Tauri, confirm() no longer
  // returns a boolean synchronously, so `if (!confirm(...))` alone would
  // silently skip the cancel branch and proceed with whatever
  // destructive action it was guarding.
  async confirmAsync(message) {
    if (this.isTauri()) {
      try {
        return await window.__TAURI__.dialog.confirm(message);
      } catch (err) {
        console.error('PATCH.doc confirm dialog error (Tauri):', err);
        return false; // fail closed — never treat an error as "confirmed"
      }
    }
    return confirm(message);
  },

  async loadFileTauri() {
    try {
      const path = await window.__TAURI__.dialog.open({
        multiple: false,
        filters: [{ name: 'JSON', extensions: ['json'] }],
      });
      if (!path) return; // user canceled
      const content = await window.__TAURI__.fs.readTextFile(path);
      const filename = path.split(/[\\/]/).pop();
      this._parse(content, filename);
    } catch (err) {
      console.error('PATCH.doc import error (Tauri file dialog):', err);
      this._feedback('import', 'err', err.message || String(err));
    }
  },

  async _parse(raw, filename) {
    try {
      const data = JSON.parse(raw);

      // Full PATCH.doc backup
      if (data.version && data.patches && Array.isArray(data.patches)) {
        if (!(await this.confirmAsync('Import full backup? This replaces ALL current data.'))) return;
        Store.importAll(raw);
        App.fullRender();
        this._feedback('import', 'ok', 'backup loaded · ' + data.patches.length + ' patch(es)');
        document.getElementById('import-textarea').value = '';
        return;
      }

      // Single PATCH.doc patch
      if (data.version && data.patch) {
        const p = Store.importPatch(raw);
        App.fullRender();
        this._feedback('import', 'ok', '"' + p.title + '" added to library');
        document.getElementById('import-textarea').value = '';
        return;
      }

      // ModularGrid JSON format
      if (this._isModularGridJSON(data)) {
        this._importModularGridJSON(data, filename);
        document.getElementById('import-textarea').value = '';
        return;
      }

      throw new Error('unrecognized format — expected PATCH.doc JSON or ModularGrid rack JSON');

    } catch(err) {
      console.error('PATCH.doc import error:', err);
      this._feedback('import', 'err', err.message + (err.stack ? ' (see console)' : ''));
    }
  },

  // ── ModularGrid JSON Import ─────────────────────────────────────────────

  /*
   * ModularGrid Unicorn rack JSON format (via rack-url.json):
   *
   * {
   *   "response": {
   *     "success": true,
   *     "rack": {
   *       "name": "My Rack",
   *       "rows": [
   *         {
   *           "modules": [
   *             {
   *               "id": 12345,
   *               "name": "Plaits",
   *               "manufacturer": { "name": "Mutable Instruments" },
   *               "hp": 12,
   *               "category": { "name": "Sound Source" },
   *               "position": 0,
   *               "row": 0
   *             }
   *           ]
   *         }
   *       ]
   *     }
   *   }
   * }
   *
   * Alternative flat format sometimes seen:
   * {
   *   "modules": [
   *     { "id": 12345, "name": "Plaits", "manufacturer": "Mutable Instruments",
   *       "hp": 12, "functions": ["VCO"] }
   *   ]
   * }
   */

  _isModularGridJSON(data) {
    // Real MG format: { response: { success, result: { Rack, Module: [...] } } }
    if (data.response && data.response.result && data.response.result.Module) return true;
    // Older format: { response: { rack: { rows: [...] } } }
    if (data.response && data.response.rack) return true;
    // Flat: { modules: [...] }
    if (Array.isArray(data.modules) && data.modules.length > 0) {
      const m = data.modules[0];
      if (m.manufacturer !== undefined || m.hp !== undefined || m.te !== undefined) return true;
    }
    // Direct array
    if (Array.isArray(data) && data.length > 0 && (data[0].hp !== undefined || data[0].te !== undefined)) return true;
    return false;
  },

  _importModularGridJSON(data, filename) {
    let rackName = 'ModularGrid Rack';
    let rawModules = [];

    // Format 1 (real): { response: { result: { Rack: { name }, Module: [...] } } }
    if (data.response && data.response.result && data.response.result.Module) {
      const result = data.response.result;
      rackName = (result.Rack && result.Rack.name) || rackName;
      rawModules = Array.isArray(result.Module) ? result.Module : [result.Module];
    }
    // Format 2 (older): { response: { rack: { name, rows: [{ modules: [...] }] } } }
    else if (data.response && data.response.rack) {
      const rack = data.response.rack;
      rackName = rack.name || rackName;
      (rack.rows || []).forEach(row => {
        (row.modules || []).forEach(m => rawModules.push(m));
      });
    }
    // Format 3: { name, modules: [...] }
    else if (data.modules) {
      rackName = data.name || (filename ? filename.replace(/\.json$/i, '') : rackName);
      rawModules = data.modules;
    }
    // Format 4: flat array
    else if (Array.isArray(data)) {
      rawModules = data;
    }

    if (!rawModules.length) {
      this._feedback('import', 'err', 'no modules found in ModularGrid export');
      return;
    }

    // Map MG categories to our categories
    const CAT_MAP = {
      'sound source': 'oscillator', 'vco': 'oscillator', 'oscillator': 'oscillator',
      'filter': 'filter', 'vcf': 'filter',
      'envelope': 'envelope', 'adsr': 'envelope', 'eg': 'envelope',
      'lfo': 'lfo', 'modulation': 'lfo',
      'vca': 'vca', 'amplifier': 'vca',
      'sequencer': 'sequencer', 'sequence': 'sequencer',
      'effect': 'effects', 'effects': 'effects', 'reverb': 'effects', 'delay': 'effects',
      'utility': 'utility', 'multiple': 'utility', 'mixer': 'utility',
    };

    const mapCat = (raw) => {
      if (!raw) return 'other';
      const key = (typeof raw === 'object' ? raw.name : raw).toLowerCase();
      for (const [k, v] of Object.entries(CAT_MAP)) {
        if (key.includes(k)) return v;
      }
      return 'other';
    };

    const getMaker = (m) => {
      // Real MG format uses Manufacturer object or manufacturer_name string
      if (m.Manufacturer && m.Manufacturer.name) return m.Manufacturer.name;
      if (m.manufacturer_name) return m.manufacturer_name;
      if (m.manufacturer) return typeof m.manufacturer === 'object' ? (m.manufacturer.name || 'Unknown') : m.manufacturer;
      return 'Unknown';
    };

    const getHP = (m) => {
      // Real MG format uses 'te' (Teileinheit = HP)
      return parseInt(m.te || m.hp) || 8;
    };

    const getCat = (m) => {
      // Real MG format: m.Category array or object
      if (m.Category) {
        const cats = Array.isArray(m.Category) ? m.Category : [m.Category];
        for (const c of cats) {
          const name = typeof c === 'object' ? c.name : c;
          if (name) return mapCat(name);
        }
      }
      return mapCat(m.category || (m.functions && m.functions[0]) || '');
    };

    // Convert MG modules to PATCH.doc modules, deduplicating against existing library
    let added = 0, skipped = 0;
    const patchModuleIds = [];

    rawModules.forEach(m => {
      const name   = m.name || 'Unknown Module';
      const maker  = getMaker(m);
      const hp     = getHP(m);
      const cat    = getCat(m);

      // Check for duplicates by name+maker
      const exists = Store.state.modules.find(
        x => x.name.toLowerCase() === name.toLowerCase() &&
             x.maker.toLowerCase() === maker.toLowerCase()
      );

      let moduleId;
      if (exists) {
        moduleId = exists.id;
        skipped++;
      } else {
        // Build sensible default I/O from MG data if available, else use defaults
        const inputs  = this._buildPorts(m, 'inputs')  || ['cv', 'gate', 'v/oct'];
        const outputs = this._buildPorts(m, 'outputs') || ['out'];

        const newMod = Store.addModule({ maker, name, hp, cat, inputs, outputs });
        moduleId = newMod.id;
        added++;
      }
      patchModuleIds.push(moduleId);
    });

    // Create a new patch with all imported modules laid out on canvas
    const patch = Store.newPatch(rackName);

    // Count instances per moduleId for duplicate labelling
    const instanceCount = {};
    const patchMods = patchModuleIds.map((moduleId, idx) => {
      instanceCount[moduleId] = (instanceCount[moduleId] || 0) + 1;
      return {
        moduleId,
        id: Date.now() + idx,
        instance: instanceCount[moduleId],
        paramsOpen: false,
        x: 20 + (idx % 4) * 160,
        y: 20 + Math.floor(idx / 4) * 220
      };
    });
    Store.updatePatch(patch.id, { patchModules: patchMods, tags: [], photo: null });

    try { Undo.snapshot(); } catch(e) {}
    App.fullRender();
    this._feedback('import', 'ok',
      `"${rackName}" imported · ${added} new module(s) added · ${skipped} already in library · ${patchModuleIds.length} on canvas`
    );
  },

  _buildPorts(mgModule, direction) {
    // MG sometimes includes i/o counts or names
    const raw = mgModule[direction] || mgModule[direction === 'inputs' ? 'ins' : 'outs'];
    if (!raw) return null;
    if (Array.isArray(raw)) return raw.map(p => typeof p === 'object' ? (p.name || p.label || '?') : String(p));
    if (typeof raw === 'number') {
      return Array.from({ length: raw }, (_, i) => direction === 'inputs' ? 'in' + (raw > 1 ? i+1 : '') : 'out' + (raw > 1 ? i+1 : ''));
    }
    return null;
  },

  // ── Helpers ─────────────────────────────────────────────────────────────

  _download(json, filename) {
    const blob = new Blob([json], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  _feedback(which, type, msg) {
    const el = document.getElementById(which + '-feedback');
    if (!el) return;
    el.className = 'feedback ' + type;
    el.textContent = (type === 'ok' ? '✓ ' : '✗ ') + msg;
    clearTimeout(el._t);
    el._t = setTimeout(() => { el.className = 'feedback'; }, 5000);
  },

  updatePreview() {
    const el = document.getElementById('json-preview');
    if (el) {
      const s = Store.state;
      const patch = Store.getActivePatch();
      el.textContent = JSON.stringify({
        version: s.version,
        modules: s.modules.length + ' in library',
        patches: s.patches.length + ' total',
        active: { title: patch.title, modules: patch.patchModules.length, cables: patch.cables.length }
      }, null, 2);
    }

    const mg = document.getElementById('mg-example-box');
    if (mg && !mg._filled) {
      mg._filled = true;
      mg.textContent = JSON.stringify({
        response: {
          success: true,
          rack: {
            name: "My Rack",
            rows: [{
              modules: [
                { id: 11887, name: "Plaits", manufacturer: { name: "Mutable Instruments" }, hp: 12, category: { name: "Sound Source" } },
                { id: 10711, name: "Rings",  manufacturer: { name: "Mutable Instruments" }, hp: 14, category: { name: "Filter" } },
                { id: 8423,  name: "Maths",  manufacturer: { name: "Make Noise" },          hp: 20, category: { name: "Envelope Follower" } }
              ]
            }]
          }
        }
      }, null, 2);
    }
  }
};
