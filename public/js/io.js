const IO = {

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

    // Build canvas SVG snapshot — returns {svg, wPx, hPx}
    const canvasData = this._snapshotCanvas(patch, modules);

    // Calculate print page size from SVG content dimensions.
    // We scale the SVG to 2x resolution (96dpi → ~192dpi effective),
    // then derive mm dimensions so the page is exactly one page tall.
    const PX_PER_MM = 96 / 25.4;     // 96dpi
    const SCALE     = 2.0;            // 2x resolution for crisp zoom
    const PAD_MM    = 22;             // header + padding
    const svgWmm = (canvasData.wPx * SCALE) / PX_PER_MM;
    const svgHmm = (canvasData.hPx * SCALE) / PX_PER_MM;
    const pageWmm = Math.max(210, svgWmm + 24).toFixed(1);
    const pageHmm = Math.max(148, svgHmm + PAD_MM + 20).toFixed(1);

    // Build params HTML
    const paramsHTML = this._buildParamsHTML(patch, modules);

    // Build notes HTML
    const notesHTML = (patch.notes || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/\n/g,'<br>');

    // Build connections HTML
    const connectionsHTML = this._buildConnectionsHTML(patch, modules);

    const dateStr = new Date().toLocaleDateString('de-DE', {day:'2-digit',month:'2-digit',year:'numeric'});

    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${patch.title || 'patch'} — PATCH.doc</title>
<style>
  :root {
    --patch-page-w: ${pageWmm}mm;
    --patch-page-h: ${pageHmm}mm;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
    font-size: 9pt;
    color: #1a1a18;
    background: #fff;
  }

  /* ── page 1: patch canvas — sized to content ── */
  .sheet-patch {
    page: patchpage;
    width: var(--patch-page-w, 297mm);
    height: var(--patch-page-h, 210mm);
    padding: 10mm 12mm;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  @page patchpage {
    size: var(--patch-page-w, 297mm) var(--patch-page-h, 210mm);
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
    padding: 4mm; overflow: hidden;
    flex: 1; display: flex; flex-direction: column;
  }
  .canvas-svg-wrap { flex: 1; overflow: hidden; display: flex; align-items: flex-start; }
  .canvas-svg-wrap svg { width: 100%; height: 100%; display: block; }

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

  /* tags */
  .patch-tags { margin-top: 3mm; display: flex; gap: 3pt; flex-wrap: wrap; }
  .patch-tag { font-size: 7pt; padding: 1pt 5pt; border-radius: 3pt; background: #f0f0ee; color: #666; }

  /* ── page 3: connections — A4 portrait ── */
  .sheet-conn {
    page: connpage;
    width: 210mm; min-height: 297mm;
    padding: 14mm 16mm;
    page-break-before: always;
  }
  @page connpage { size: A4 portrait; margin: 0; }

  .conn-table { width: 100%; border-collapse: collapse; font-size: 8pt; margin-top: 3mm; }
  .conn-table th {
    text-align: left; font-size: 7pt; letter-spacing: 0.1em; color: #aaa;
    font-weight: 600; padding: 2pt 4pt; border-bottom: 0.5pt solid #ddd;
  }
  .conn-table td { padding: 3pt 4pt; border-bottom: 0.3pt solid #f0f0f0; vertical-align: middle; }
  .conn-table tr:last-child td { border-bottom: none; }
  .conn-swatch { display: inline-block; width: 8pt; height: 8pt; border-radius: 50%; vertical-align: middle; margin-right: 4pt; }
  .conn-mod { font-weight: 600; color: #222; }
  .conn-port { color: #555; }
  .conn-arrow { color: #bbb; padding: 0 4pt; }
  .conn-mod-group { font-size: 7pt; letter-spacing: 0.1em; font-weight: 700; color: #aaa;
    padding: 5pt 4pt 2pt; text-transform: uppercase; }
</style>
</head>
<body>

<!-- PAGE 1 — patch canvas, A3 landscape -->
<div class="sheet-patch">
  <div class="page-header">
    <h1>${patch.title || 'Untitled Patch'}</h1>
    <div style="text-align:right">
      <div class="brand">▣ PATCH.doc</div>
      <div class="meta">${dateStr} · ${patch.patchModules.length} module(s) · ${patch.cables.length} cable(s)</div>
    </div>
  </div>

  <div class="canvas-section">
    <div class="section-label">patch canvas</div>
    <div class="canvas-svg-wrap">${canvasData.svg}</div>
  </div>
</div>

<!-- PAGE 2 — parameters + notes, A4 portrait -->
<div class="sheet-params">
  <div class="page-header">
    <h1>${patch.title || 'Untitled Patch'}</h1>
    <div style="text-align:right">
      <div class="brand">▣ PATCH.doc</div>
      <div class="meta">${dateStr}</div>
    </div>
  </div>

  <div class="section-label">parameters</div>
  <div class="params-section">
    ${paramsHTML}
  </div>

  ${(patch.tags||[]).length ? `<div class="patch-tags">${(patch.tags||[]).map(t=>'<span class="patch-tag">'+t+'</span>').join('')}</div>` : ''}

  <div class="notes-section">
    <div class="section-label">notes</div>
    <div class="notes-text">${notesHTML || '<span style="color:#ccc">—</span>'}</div>
  </div>
</div>

<!-- PAGE 3 — connections, A4 portrait -->
<div class="sheet-conn">
  <div class="page-header">
    <h1>${patch.title || 'Untitled Patch'}</h1>
    <div style="text-align:right">
      <div class="brand">&#9635; PATCH.doc</div>
      <div class="meta">${dateStr} &middot; ${patch.cables.length} connection(s)</div>
    </div>
  </div>
  <div class="section-label">connections</div>
  ${connectionsHTML}
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
      effects:'#7aaa2a', utility:'#7a8a78', 'guitar pedal':'#c87850', placeholder:'#a0a0a0', other:'#7a8a78'
    };
    // Use same golden-angle color function as patch.js
    const _cc = idx => { const h=(idx*137.508)%360, s=idx%2===0?72:58; return `hsl(${h.toFixed(1)},${s}%,52%)`; };

    const SCALE = 2.0; // 2x resolution for crisp PDF zoom

    if (!patch.patchModules.length) {
      const svg = '<svg width="800" height="200" viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg"><text x="20" y="40" font-family="monospace" font-size="12" fill="#ccc">no modules in patch</text></svg>';
      return { svg, wPx: 400, hPx: 100 };
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

    // Port name helper — ports can be strings or {name, sigType} objects
    const pn = p => (typeof p === 'object' && p !== null) ? p.name : p;

    // Port center helper (SVG-space)
    const portCenters = {};
    patch.patchModules.forEach(pm => {
      const lay = pmLayouts[pm.id];
      if (!lay) return;
      const { m } = lay;
      m.inputs.forEach((port, i) => {
        portCenters[`${pm.id}-in-${pn(port)}`] = {
          x: pm.x + 10,
          y: pm.y + HEADER_H + i * PORT_H + PORT_H / 2
        };
      });
      m.outputs.forEach((port, i) => {
        portCenters[`${pm.id}-out-${pn(port)}`] = {
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

      const col = c.color || _cc(idx);
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
          ${m.inputs.map((port, i) => {
            const name = pn(port);
            const py = y + HEADER_H + i * PORT_H + PORT_H / 2;
            const connected = patch.cables.some(c => c.toPm === pm.id && c.toPort === name);
            const jackFill  = connected ? (patch.cables.find(c => c.toPm === pm.id && c.toPort === name)?.color || col) : '#eee';
            return `<circle cx="${x+10}" cy="${py}" r="4" fill="${jackFill}" stroke="${col}" stroke-width="1"/>
              <text x="${x+18}" y="${py+3}" font-family="monospace" font-size="7" fill="#888">${name}</text>`;
          }).join('')}
          ${m.outputs.map((port, i) => {
            const name = pn(port);
            const py = y + HEADER_H + i * PORT_H + PORT_H / 2;
            const connected = patch.cables.some(c => c.fromPm === pm.id && c.fromPort === name);
            const jackFill  = connected ? (patch.cables.find(c => c.fromPm === pm.id && c.fromPort === name)?.color || col) : '#eee';
            return `<circle cx="${x+MW-10}" cy="${py}" r="4" fill="${jackFill}" stroke="${col}" stroke-width="1"/>
              <text x="${x+MW-18}" y="${py+3}" font-family="monospace" font-size="7" fill="#888" text-anchor="end">${name}</text>`;
          }).join('')}
        </g>`;
    });

    // Render at 2x resolution: physical pixel size = W*SCALE x H*SCALE,
    // but viewBox stays at W x H so all coordinates are unchanged.
    const svgW = Math.round(W * SCALE);
    const svgH = Math.round(H * SCALE);
    const svg = `<svg width="${svgW}" height="${svgH}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg"
      style="background:#fafaf8;border-radius:3pt">
      <rect width="${W}" height="${H}" fill="#fafaf8"/>
      ${cableSVG}${modSVG}
    </svg>`;
    return { svg, wPx: W, hPx: H };
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
      const MARK_HEX = { green:'#4aaa60', yellow:'#d4c030', red:'#e05555' };
      const rows = allKeys.map(k => {
        const def = defs.find(d => d.name === k);
        let val = vals[k] !== undefined ? vals[k] : (def?.default ?? '—');
        const typ = def ? def.type : 'text';
        if (typ === 'knob' && typeof val === 'number') {
          const range = (def?.max ?? 100) - (def?.min ?? 0);
          val = range >= 10 ? Math.round(val) : Math.round(val * 10) / 10;
        }
        const disp = val === true ? 'on' : val === false ? 'off' : String(val);
        const markId  = patch.marks?.[pm.id]?.[k];
        const markHex = markId ? (MARK_HEX[markId] || null) : null;
        const markDot = markHex ? `<span style="display:inline-block;width:6pt;height:6pt;border-radius:50%;background:${markHex};margin-right:4pt;vertical-align:middle"></span>` : '';
        const nameStyle = markHex ? `color:${markHex};font-weight:700` : '';
        return `<div class="param-line" style="${markHex ? 'border-left:2.5pt solid '+markHex+';padding-left:5pt' : ''}">
          <span class="param-n" style="${nameStyle}">${markDot}${k}</span>
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

  _buildConnectionsHTML(patch, modules) {
    const CAT = {
      oscillator:'#8f86e8', filter:'#2aaa7a', envelope:'#d4963a',
      lfo:'#4a9fd4', vca:'#c45c82', sequencer:'#c8612a',
      effects:'#7aaa2a', utility:'#7a8a78', other:'#7a8a78'
    };

    if (!patch.cables.length) {
      return '<p style="color:#ccc;font-size:8pt">no connections</p>';
    }

    const modName = pmId => {
      const pm = patch.patchModules.find(p => p.id === pmId);
      if (!pm) return '?';
      const m = modules.find(x => x.id === pm.moduleId);
      return m ? m.name + (pm.instance > 1 ? ' #' + pm.instance : '') : '?';
    };
    const modColor = pmId => {
      const pm = patch.patchModules.find(p => p.id === pmId);
      if (!pm) return '#888';
      const m = modules.find(x => x.id === pm.moduleId);
      return m ? (CAT[m.cat] || '#888') : '#888';
    };

    // Group cables by source module
    const sortedPmIds = [...new Set(patch.cables.map(c => c.fromPm))]
      .sort((a, b) => modName(a).localeCompare(modName(b)));

    const rows = sortedPmIds.map(pmId => {
      const outCables = patch.cables.filter(c => c.fromPm === pmId);
      const col = modColor(pmId);
      return `
        <tr><td colspan="5" class="conn-mod-group">
          <span style="display:inline-block;width:6pt;height:6pt;border-radius:50%;background:${col};vertical-align:middle;margin-right:3pt"></span>
          ${modName(pmId)}
        </td></tr>
        ${outCables.map(c => `
        <tr>
          <td><span class="conn-swatch" style="background:${c.color || '#888'}"></span></td>
          <td class="conn-port">${c.fromPort}</td>
          <td class="conn-arrow">→</td>
          <td class="conn-mod">${modName(c.toPm)}</td>
          <td class="conn-port">${c.toPort}</td>
        </tr>`).join('')}`;
    }).join('');

    return `<table class="conn-table">
      <thead><tr>
        <th style="width:14pt"></th>
        <th>from port</th>
        <th style="width:20pt"></th>
        <th>to module</th>
        <th>to port</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
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

  _parse(raw, filename) {
    try {
      const data = JSON.parse(raw);

      // Full PATCH.doc backup
      if (data.version && data.patches && Array.isArray(data.patches)) {
        if (!confirm('Import full backup? This replaces ALL current data.')) return;
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
