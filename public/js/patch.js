const CAT_COLORS = {
  oscillator: '#8f86e8', filter: '#2aaa7a', envelope: '#d4963a',
  lfo: '#4a9fd4', vca: '#c45c82', sequencer: '#c8612a',
  effects: '#7aaa2a', utility: '#7a8a78', other: '#7a8a78'
};
const CABLE_COLORS = ['#8f86e8','#2aaa7a','#c8612a','#4a9fd4','#c45c82','#d4963a','#7aaa2a','#a07060'];

const MARK_COLORS = [
  { id:'red',    hex:'#e05555', label:'rot'    },
  { id:'orange', hex:'#e08c30', label:'orange' },
  { id:'yellow', hex:'#d4c030', label:'gelb'   },
  { id:'green',  hex:'#4aaa60', label:'grün'   },
  { id:'blue',   hex:'#4a8fd4', label:'blau'   },
  { id:'pink',   hex:'#d44aaa', label:'pink'   },
];

// Curated module-color swatches shown in the module editor. Picked to
// read clearly as a tinted border/background across all themes — both
// the warm/organic synth themes and the neutral Studio (Blender/Ableton
// inspired) dark & light themes.
const MODULE_COLOR_PALETTE = [
  '#8f86e8', // violet  (default oscillator hue)
  '#4a8fd4', // blue
  '#4ac4c4', // cyan
  '#2aaa7a', // green
  '#7aaa2a', // lime
  '#d4c030', // yellow
  '#d4963a', // amber
  '#e08c30', // orange
  '#c8612a', // rust
  '#e05555', // red
  '#d44aaa', // pink
  '#a05ad4', // purple
  '#4772b3', // studio blue
  '#6fa85c', // studio green
  '#9a9a9a', // neutral grey
  '#c4a880', // warm sand
];

let pendingPort = null;
let _markMenuOpen = null;
let snapEnabled = false;
let cablesVisible = true;
let _selectedCableId = null;
let _cablePopupPinnedFor = null; // cable id the popup is pinned open for (via click), or null
const GRID = 24;

let _zoom = 1.0;
const ZOOM_MIN = 0.25, ZOOM_MAX = 2.0, ZOOM_STEP = 0.1;

function _applyZoom() {
  const canvas = document.getElementById('patch-canvas');
  if (canvas) { canvas.style.transform = `scale(${_zoom})`; canvas.style.transformOrigin = '0 0'; }
  const el = document.getElementById('statusbar-zoom-level');
  if (el) el.textContent = Math.round(_zoom * 100) + '%';
}

const Patch = {

  // ── Port helpers ──────────────────────────────────────────────────────────
  _portName(p) { return typeof p === 'object' ? p.name : p; },

  // Panel-layout feature (see PANEL-LAYOUT-SPEC.md). Modules with a `panel`
  // field render as a front-panel-style grid instead of the list layout when
  // this is true; modules without one are unaffected either way. Defaults
  // on, user-toggleable via togglePanelMode()/persisted — see initPanelMode().
  _panelMode: true,

  // ── Render ───────────────────────────────────────────────────────────────

  render() {
    const patch  = Store.getActivePatch();
    const canvas = document.getElementById('patch-canvas');
    canvas.querySelectorAll('.patch-module').forEach(e => e.remove());

    patch.patchModules.forEach(pm => {
      const m = Store.state.modules.find(x => x.id === pm.moduleId);
      if (!m) return;
      const col      = m.color || CAT_COLORS[m.cat] || '#888';
      const catCol   = CAT_COLORS[m.cat] || '#888';
      const defs     = m.paramDefs || [];
      const vals     = (patch.params[pm.id] || {});
      const usePanel = !!(m.panel && this._panelMode);

      const el = document.createElement('div');
      el.className = 'patch-module';
      el.dataset.pmid = pm.id;
      el.style.left     = pm.x + 'px';
      el.style.top      = pm.y + 'px';
      el.style.setProperty('--mod-color', col);
      if (m.color) el.classList.add('has-custom-color');

      // Header is identical in both layouts. Collapse only applies to the
      // list layout — a panel mixes ports and controls in one grid, and
      // hiding ports would break cable rendering (jack lookup needs a
      // visible, laid-out element), so panel modules skip the collapse
      // button entirely rather than half-support it.
      const headerHtml = `
        <div class="pm-header">
          <div class="pm-header-main">
            <span class="pm-maker" style="color:${catCol}">${m.maker}</span>
            <a class="pm-manual-link" id="manual-icon-${pm.id}" href="#" target="_blank" rel="noopener"
               title="open manual" aria-label="open manual" style="display:none"
               onclick="event.stopPropagation()">
              <i class="ti ti-file-type-pdf" aria-hidden="true"></i>
            </a>
            ${!usePanel && defs.length ? `<button class="pm-collapse-btn" onclick="Patch.toggleCollapse(${pm.id},event)" title="${pm.collapsed ? 'show parameters' : 'hide parameters'}" aria-label="toggle parameters">${pm.collapsed ? '▾' : '▴'}</button>` : ''}
            <button class="pm-remove" onclick="Patch.removeFromPatch(${pm.id})" aria-label="remove">×</button>
          </div>
          <div class="pm-name">${m.name}${pm.instance > 1 ? '<span class="pm-instance">#' + pm.instance + '</span>' : ''}</div>
        </div>`;

      if (usePanel) {
        // Min-width based on panel grid columns (50px/cell + padding).
        // Only a floor, same as the list layout — content can grow beyond it.
        // 50px/col + the grid's own 4px gaps between columns (cols-1 of them)
        // + .pm-panel's 12px padding + .patch-module's 2px border. The old
        // flat "+20" didn't scale with column count, so it only fell short
        // on wide panels (8 cols = 28px of gaps alone) — narrower ones like
        // the 3-4 column test panels never showed it.
        el.style.minWidth = (m.panel.cols * 50 + (m.panel.cols - 1) * 4 + 20) + 'px';
        el.innerHTML = headerHtml + this._renderPanel(pm, m, vals, col);
      } else {
        // Min-width based on param columns: 52px per column + base 30px
        const cols = m.paramCols || 3;
        el.style.minWidth = (cols * 62 + 30) + 'px';

        // Group defs into separate rows
        const toggleDefs = defs.filter(d => d.type === 'toggle');
        const enumDefs   = defs.filter(d => d.type === 'enum' || d.type === 'text');
        const knobDefs   = defs.filter(d => d.type === 'knob' || d.type === 'fader');

        // Build sortedDefs with sentinel dividers
        const sortedDefs = [
          ...toggleDefs,
          ...(toggleDefs.length && enumDefs.length   ? [{ _divider: true }] : []),
          ...enumDefs,
          ...((toggleDefs.length || enumDefs.length) && knobDefs.length ? [{ _divider: true }] : []),
          ...knobDefs
        ];

        el.innerHTML = headerHtml + `
        <div class="pm-ports">
          <div class="pm-col">
            <div class="pm-col-label">IN</div>
            ${m.inputs.map(inp => `
              <div class="port input" onclick="Patch.clickPort(${pm.id},'in','${Patch._portName(inp)}',event)" title="${Patch._portName(inp)}">
                <span class="port-jack" id="jack-${pm.id}-in-${Patch._portName(inp)}" style="border-color:${col}55"></span>
                <span class="port-name">${Patch._portName(inp)}</span>
              </div>`).join('')}
          </div>
          <div class="pm-col pm-col-out">
            <div class="pm-col-label right">OUT</div>
            ${m.outputs.map(outp => `
              <div class="port output" onclick="Patch.clickPort(${pm.id},'out','${Patch._portName(outp)}',event)" title="${Patch._portName(outp)}">
                <span class="port-name">${Patch._portName(outp)}</span>
                <span class="port-jack" id="jack-${pm.id}-out-${Patch._portName(outp)}" style="border-color:${col}55"></span>
              </div>`).join('')}
          </div>
        </div>
        ${sortedDefs.length && !pm.collapsed ? `<div class="pm-controls" id="pcontrols-${pm.id}" style="grid-template-columns:repeat(${m.paramCols||3},1fr)">${sortedDefs.map(d => d._divider ? `<div class="pm-controls-divider" style="grid-column:1/-1"></div>` : this._renderControl(pm.id, d, vals[d.name], col)).join('')}</div>` : ''}`;
      }

      this._makeDraggable(el, pm);
      canvas.appendChild(el);
      defs.forEach(d => { if (!d._divider) this._bindControl(el, pm.id, d, vals[d.name]); });
    });

    this.renderCables();
    this.updateJacks();
    this._showManualIcons(patch);
  },

  // ── Panel-mode rendering ─────────────────────────────────────────────────
  // Renders a module's optional `panel` layout (front-panel-style grid) —
  // see PANEL-LAYOUT-SPEC.md. Deliberately reuses the exact same control
  // markup (_renderControl) and port markup as the list layout, so cable
  // rendering, jack lookup (_getPortCenter/updateJacks) and control binding
  // (_bindControl, matched by JSON-stringified paramDef) all keep working
  // completely unmodified regardless of which layout a module uses.

  _renderPanel(pm, m, vals, col) {
    const { cols, rows, elements = [] } = m.panel;
    const cellsHtml = elements.map(e => this._renderPanelElement(pm, m, e, vals, col)).join('');
    const colTemplate = this._panelColTemplate(cols, elements);
    return `<div class="pm-panel" style="grid-template-columns:${colTemplate};grid-template-rows:repeat(${rows},auto)">${cellsHtml}</div>`;
  },

  // A column that's used only by vertical dividers (never by a port, knob,
  // label etc.) renders narrow instead of claiming a full --pm-cell-w slot
  // — a divider is a thin line, not a control, and a full-width column next
  // to it wastes most of its own width as dead space. Columns with any
  // other content, or with nothing at all, keep the normal cell width. The
  // panel editor's own grid stays uniform on purpose — this only affects
  // the final rendered view, not the placement UI.
  _panelColTemplate(cols, elements) {
    const touchedBy = Array.from({ length: cols }, () => []);
    elements.forEach(e => {
      const w = e.w || 1;
      for (let c = e.col; c < e.col + w && c < cols; c++) touchedBy[c].push(e.type);
    });
    return touchedBy
      .map(types => (types.length && types.every(t => t === 'divider-v')) ? '14px' : 'var(--pm-cell-w,50px)')
      .join(' ');
  },

  _renderPanelElement(pm, m, e, vals, col) {
    const pos  = `grid-column:${e.col + 1} / span ${e.w || 1};grid-row:${e.row + 1} / span ${e.h || 1}`;
    const wrap = (inner, extraClass = '') => `<div class="pm-panel-cell${extraClass ? ' ' + extraClass : ''}" style="${pos}">${inner}</div>`;

    if (e.type === 'label') return wrap(`<div class="pm-panel-label">${e.text || ''}</div>`);
    // 'divider' is the pre-rename type string — still read for panels saved
    // before the horizontal/vertical split, alongside the current 'divider-h'.
    // Dividers stay plain lines — no tinted/rounded cell backdrop, that's
    // reserved for actual content.
    if (e.type === 'divider' || e.type === 'divider-h') return wrap(`<div class="pm-panel-divider-h"></div>`, 'pm-panel-cell-plain');
    // .pm-panel's align-items:center only sizes a cell to its own content,
    // so a vertical divider's height:100% has nothing definite to resolve
    // against unless its own cell is told to stretch to the row's height.
    if (e.type === 'divider-v') return wrap(`<div class="pm-panel-divider-v"></div>`, 'pm-panel-cell-stretch pm-panel-cell-plain');
    if (e.type === 'button')    return wrap(`<div class="pm-panel-button" title="${e.text || ''}">${e.text || ''}</div>`);

    if (e.type === 'input' || e.type === 'output') {
      const dir = e.type === 'input' ? 'in' : 'out';
      return wrap(`
        <div class="port ${e.type}" onclick="Patch.clickPort(${pm.id},'${dir}','${e.ref}',event)" title="${e.ref}">
          <span class="port-jack" id="jack-${pm.id}-${dir}-${e.ref}" style="border-color:${col}55"></span>
          <span class="port-name">${e.ref}</span>
        </div>`);
    }

    // knob / switch / enum — same paramDef-driven control as the list layout.
    // Matched by name AND type — two paramDefs can share a name (e.g. a
    // knob and an enum both called "Freq"), and name alone would pick
    // whichever happens to come first in paramDefs, not necessarily the
    // one this panel element actually means.
    const def = (m.paramDefs || []).find(d => d.name === e.ref && d.type === e.type);
    if (!def) return wrap('');
    return wrap(this._renderControl(pm.id, def, vals[def.name], col, e.w || 1, e.h || 1));
  },

  // Fetch manual lists for every module currently in the patch (deduped
  // by the cache) and reveal the manual icon on modules that have one —
  // a link glyph for a link-type manual, a PDF glyph otherwise.
  async _showManualIcons(patch) {
    if (window.PATCHDOC_STATIC && !IO.isTauri()) return;
    const moduleIds = [...new Set(patch.patchModules.map(pm => pm.moduleId))];
    await Manuals.prefetchFor(moduleIds);
    patch.patchModules.forEach(pm => {
      const files = Manuals._cache[pm.moduleId] || [];
      if (!files.length) return;
      const icon = document.getElementById('manual-icon-' + pm.id);
      if (!icon) return;
      icon.href = files[0].url;
      icon.title = files.length > 1 ? files.length + ' manuals — open first' : 'open manual';
      icon.style.display = 'flex';
      const iconGlyph = icon.querySelector('i');
      if (iconGlyph) iconGlyph.className = 'ti ' + (files[0].kind === 'link' ? 'ti-link' : 'ti-file-type-pdf');
      // A plain <a href target="_blank"> silently does nothing in this
      // webview — no new-window handling wired up, no error either since
      // nothing actually throws (see manuals.js's _fileRow for the same
      // gap). Manuals.openTauri already handles both link/file entries and
      // NAS-vs-local paths (see there) — reuse it instead of duplicating.
      icon.onclick = IO.isTauri() ? (e) => {
        e.preventDefault();
        Manuals.openTauri(pm.moduleId, files[0].id);
      } : null;
    });
  },

  // ── Mark (performance highlight) ─────────────────────────────────────────

  _getMark(pmId, name) {
    const patch = Store.getActivePatch();
    return (patch.marks && patch.marks[pmId] && patch.marks[pmId][name]) || null;
  },

  _setMark(pmId, name, colorId) {
    const patch = Store.getActivePatch();
    if (!patch.marks) patch.marks = {};
    if (!patch.marks[pmId]) patch.marks[pmId] = {};
    if (colorId) patch.marks[pmId][name] = colorId;
    else delete patch.marks[pmId][name];
    Store.updatePatch(patch.id, { marks: patch.marks });
  },

  _markColor(pmId, name) {
    const id = this._getMark(pmId, name);
    if (!id) return null;
    return MARK_COLORS.find(c => c.id === id)?.hex || null;
  },

  openMarkMenu(pmId, name, anchorEl, e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    this.closeMarkMenu();
    const canvas  = document.getElementById('patch-canvas');
    const cr      = canvas.getBoundingClientRect();
    const ar      = anchorEl.getBoundingClientRect();
    const menu    = document.createElement('div');
    menu.className = 'mark-menu';
    // Same fix as _getPortCenter/_makeDraggable: the menu is a child of
    // #patch-canvas and inherits its zoom scale, so a screen-pixel delta
    // needs dividing by _zoom to land at the right canvas-local position.
    menu.style.left = (ar.left - cr.left) / _zoom + 'px';
    menu.style.top  = (ar.bottom - cr.top) / _zoom + 4 + 'px';
    const current = this._getMark(pmId, name);
    menu.innerHTML =
      MARK_COLORS.map(mc => `
        <button class="mark-swatch ${current === mc.id ? 'active' : ''}"
          style="background:${mc.hex}"
          onclick="Patch._setMark('${pmId}','${name}','${mc.id}');Patch.closeMarkMenu();Patch.render()"
          title="${mc.label}"></button>`).join('') +
      `<button class="mark-swatch mark-clear ${!current ? 'active' : ''}"
        onclick="Patch._setMark('${pmId}','${name}',null);Patch.closeMarkMenu();Patch.render()"
        title="keine Markierung">×</button>`;
    canvas.appendChild(menu);
    _markMenuOpen = menu;
    setTimeout(() => document.addEventListener('mousedown', Patch._markOutside, { once: true }), 0);
  },

  _markOutside(e) {
    if (_markMenuOpen && !_markMenuOpen.contains(e.target)) Patch.closeMarkMenu();
  },

  closeMarkMenu() {
    if (_markMenuOpen) { _markMenuOpen.remove(); _markMenuOpen = null; }
  },

  // ── Control rendering ────────────────────────────────────────────────────

  _safeId(pmId, name) {
    return `ctrl-${pmId}-${name.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
  },

  _renderControl(pmId, def, val, col, spanW = 1, spanH = 1) {
    const id = this._safeId(pmId, def.name);
    if (def.type === 'knob') {
      const min = def.min ?? 0, max = def.max ?? 100;
      const v   = val !== undefined ? parseFloat(val) : (def.default ?? min);
      const pct = (v - min) / (max - min);
      const markCol = this._markColor(pmId, def.name);
      const markRing = markCol ? `<circle cx="19" cy="19" r="18" fill="none" stroke="${markCol}" stroke-width="2" opacity="0.9"/>` : '';
      // A knob placed on a panel can span multiple cells (e.g. a 2x2 knob
      // for a "hero" parameter) \u2014 scale it to fill that footprint. At the
      // default 1x1 span this resolves to exactly 38px, the original fixed
      // size, so list-mode controls and existing single-cell panels are
      // pixel-identical to before.
      const cellSpan  = Math.max(1, Math.min(spanW, spanH));
      const svgSize   = cellSpan * 50 + (cellSpan - 1) * 4 - 12;
      const valFont   = Math.round(10 * (svgSize / 38));
      return `<div class="pm-knob-wrap${markCol ? ' marked' : ''}" data-pmid="${pmId}" data-def="${encodeURIComponent(JSON.stringify(def))}" data-val="${v}"
        title="${def.name}: ${this._fmtVal(v, def)} (${min} to ${max})"
        oncontextmenu="Patch.openMarkMenu('${pmId}','${def.name}',this,event)">
        ${this._knobSVG(id, pct, col, markRing, svgSize)}
        <div class="pm-ctrl-val" id="val-${id}" style="font-size:${valFont}px">${this._fmtDisplay(v, pct, def)}</div>
        <div class="pm-ctrl-label">${def.name}</div>
      </div>`;
    }
    if (def.type === 'fader') {
      const min = def.min ?? 0, max = def.max ?? 100;
      const v   = val !== undefined ? parseFloat(val) : (def.default ?? min);
      const pct = Math.max(0, Math.min(1, (v - min) / (max - min)));
      const markCol = this._markColor(pmId, def.name);
      // Only spanH drives the track's height — a fader is meant to stay
      // narrow even in a wide cell (real slide-pots are), so spanW just
      // centers it via .pm-fader-wrap's own layout instead of stretching
      // the track. Floor of 70px keeps a plain list-view fader (1x1, no
      // panel layout) usably tall rather than a squashed nub.
      const rowSpan = Math.max(1, spanH);
      const trackH  = Math.max(70, rowSpan * 50 + (rowSpan - 1) * 4 - 24);
      return `<div class="pm-fader-wrap${markCol ? ' marked' : ''}" data-pmid="${pmId}" data-def="${encodeURIComponent(JSON.stringify(def))}" data-val="${v}"
        title="${def.name}: ${this._fmtVal(v, def)} (${min} to ${max})"
        oncontextmenu="Patch.openMarkMenu('${pmId}','${def.name}',this,event)">
        <div class="pm-fader-track" id="track-${id}" style="height:${trackH}px${markCol ? ';box-shadow:0 0 0 2px ' + markCol : ''}">
          <div class="pm-fader-fill" id="fill-${id}" style="height:${(pct * 100).toFixed(2)}%;background:${col}"></div>
          <div class="pm-fader-thumb" id="thumb-${id}" style="bottom:${(pct * 100).toFixed(2)}%;border-color:${col}"></div>
        </div>
        <div class="pm-ctrl-val" id="val-${id}">${this._fmtDisplay(v, pct, def)}</div>
        <div class="pm-ctrl-label">${def.name}</div>
      </div>`;
    }
    if (def.type === 'toggle') {
      const on = val !== undefined ? (val === true || val === 'true' || val === 1) : (def.default === true || def.default === 'true');
      const markColT = this._markColor(pmId, def.name);
      return `<div class="pm-toggle-wrap${markColT ? ' marked' : ''}" title="${def.name}"
        oncontextmenu="Patch.openMarkMenu('${pmId}','${def.name}',this,event)">
        <div class="pm-toggle-btn ${on ? 'on' : ''}" id="${id}"
          style="${markColT ? 'box-shadow:0 0 0 2px '+markColT : ''}"
          onclick="Patch.setToggle('${pmId}','${def.name}',event)" onmousedown="event.stopPropagation()">
          <div class="pm-toggle-thumb"></div>
        </div>
        <div class="pm-ctrl-val" id="val-${id}">${on ? 'on' : 'off'}</div>
        <div class="pm-ctrl-label">${def.name}</div>
      </div>`;
    }
    if (def.type === 'enum') {
      const opts = (def.options || '').split(',').map(s => s.trim()).filter(Boolean);
      const cur  = val !== undefined ? val : (def.default || opts[0] || '');
      const markColE = this._markColor(pmId, def.name);
      return `<div class="pm-enum-wrap${markColE ? ' marked' : ''}" title="${def.name}"
        oncontextmenu="Patch.openMarkMenu('${pmId}','${def.name}',this,event)">
        <div class="pm-ctrl-label">${def.name}</div>
        <select class="pm-enum-select" id="${id}"
          style="${markColE ? 'border-color:'+markColE+';box-shadow:0 0 0 1.5px '+markColE+'44' : ''}"
          onchange="Patch.setEnum('${pmId}','${def.name}',this.value)"
          onmousedown="event.stopPropagation()" onclick="event.stopPropagation()">
          ${opts.map(o => `<option value="${o}" ${o === cur ? 'selected' : ''}>${o}</option>`).join('')}
        </select>
      </div>`;
    }
    if (def.type === 'text') {
      const cur = val !== undefined ? val : (def.default || '');
      return `<div class="pm-text-wrap">
        <div class="pm-ctrl-label full">${def.name}</div>
        <input class="pm-text-input" type="text" id="${id}"
          value="${cur.replace(/"/g,'&quot;')}" placeholder="—"
          onchange="Patch.setEnum('${pmId}','${def.name}',this.value)"
          onmousedown="event.stopPropagation()"
          onclick="event.stopPropagation()"
          onfocus="event.stopPropagation()" />
      </div>`;
    }
    return '';
  },

  _knobSVG(id, pct, col, markRing = '', size = 38) {
    // r=15, circumference=94.248, arc=270° → arc_length=70.686, gap=23.562
    const CIRC = 94.248, ARC = 70.686, GAP = 23.562;
    const deg  = pct * 270 - 135;  // tick rotation: -135° (min) to +135° (max)
    const dashoffset = (GAP + ARC * (1 - pct)).toFixed(2);
    // viewBox stays fixed at the original 38x38 coordinate space — width/
    // height alone scale the rendered size, so every internal circle/line
    // coordinate below keeps working unmodified at any size.
    return `<svg class="pm-knob-svg" width="${size}" height="${size}" viewBox="0 0 38 38" id="svg-${id}">
      <circle cx="19" cy="19" r="15" fill="none" stroke="var(--border2)" stroke-width="2.5"
        stroke-dasharray="${ARC} ${GAP}" stroke-linecap="round" transform="rotate(135 19 19)"/>
      <circle cx="19" cy="19" r="15" fill="none" stroke="${col}" stroke-width="2.5" stroke-linecap="round"
        stroke-dasharray="${CIRC}" stroke-dashoffset="${dashoffset}"
        transform="rotate(135 19 19)" id="arc-${id}"/>
      <circle cx="19" cy="19" r="9" fill="var(--bg2)" stroke="var(--border2)" stroke-width="1"/>
      <line x1="19" y1="12" x2="19" y2="15.5" stroke="var(--text1)" stroke-width="1.5" stroke-linecap="round"
        transform="rotate(${deg.toFixed(1)} 19 19)" id="tick-${id}"/>
      ${markRing}
    </svg>`;
  },

  _fmtVal(v, def) {
    const n = parseFloat(v);
    if (isNaN(n)) return v;
    const range = (def.max ?? 100) - (def.min ?? 0);
    return range >= 10 ? Math.round(n) : n.toFixed(1);
  },

  // Knob label text, in whichever of the three notations def.display picks
  // (raw number by default). "clock" and "freq" are alternate readouts of
  // the same underlying value, not a different value — the number in the
  // tooltip (see _renderControl) is always the plain _fmtVal figure.
  _fmtDisplay(v, pct, def) {
    if (def.display === 'clock') return this._fmtClock(pct);
    if (def.display === 'freq')  return this._fmtFreq(v);
    return this._fmtVal(v, def);
  },

  // Maps the knob's 0..1 position onto its physical sweep (-135deg..+135deg,
  // i.e. 270deg / 9 clock-hours) and reads that off as a clock position —
  // the "12 o'clock = centered" convention hardware pots are described by.
  // Quantized to 15-minute steps since this is a visual/verbal metaphor,
  // not a precision readout (the tooltip still has the exact number).
  _fmtClock(pct) {
    const hoursFrom12 = pct * 9 - 4.5;
    let totalMin = Math.round((12 + hoursFrom12) * 60 / 15) * 15;
    totalMin = ((totalMin % 720) + 720) % 720;
    let hh = Math.floor(totalMin / 60);
    const mm = totalMin % 60;
    if (hh === 0) hh = 12;
    return hh + ':' + String(mm).padStart(2, '0');
  },

  // Assumes the stored value already IS Hz (def.min/max define the knob's
  // own Hz range) — this only reformats it with audio-gear-style notation
  // (kHz above 1000, one decimal below 10) rather than remapping it.
  _fmtFreq(v) {
    const n = parseFloat(v);
    if (isNaN(n)) return v;
    const abs = Math.abs(n);
    if (abs >= 1000) return parseFloat((n / 1000).toFixed(1)) + ' kHz';
    if (abs < 10) return n.toFixed(1) + ' Hz';
    return Math.round(n) + ' Hz';
  },

  // Round a stored value the same way it is displayed — whole numbers for
  // large ranges, one decimal for small/fine ranges (e.g. 0–1 mix knobs).
  _roundVal(v, def) {
    const n = parseFloat(v);
    if (isNaN(n)) return v;
    const range = (def.max ?? 100) - (def.min ?? 0);
    return range >= 10 ? Math.round(n) : Math.round(n * 10) / 10;
  },

  _bindControl(el, pmId, def, initVal) {
    if (def.type === 'fader') { this._bindFader(el, pmId, def, initVal); return; }
    if (def.type !== 'knob') return;
    const id   = this._safeId(pmId, def.name);
    const wrap = el.querySelector(`[data-def="${encodeURIComponent(JSON.stringify(def))}"]`);
    if (!wrap) return;
    const min = def.min ?? 0, max = def.max ?? 100;
    let val   = initVal !== undefined ? parseFloat(initVal) : (def.default ?? min);
    let startY = 0, startVal = 0;

    const update = (v) => {
      val = Math.max(min, Math.min(max, v));
      const pct  = (val - min) / (max - min);
      const CIRC = 94.248, ARC = 70.686, GAP = 23.562;
      const arc   = document.getElementById(`arc-${id}`);
      const tick  = document.getElementById(`tick-${id}`);
      const valEl = document.getElementById(`val-${id}`);
      if (arc)   arc.setAttribute('stroke-dashoffset', (GAP + ARC * (1 - pct)).toFixed(2));
      if (tick)  tick.setAttribute('transform', `rotate(${(pct * 270 - 135).toFixed(1)} 19 19)`);
      if (valEl) valEl.textContent = this._fmtDisplay(val, pct, def);
    };

    // Use pointer capture — clean, no global listeners needed
    wrap.addEventListener('pointerdown', e => {
      if (e.button !== 0) return;
      e.stopPropagation();
      e.preventDefault();
      startY = e.clientY;
      startVal = val;
      wrap.setPointerCapture(e.pointerId);
      wrap.style.cursor = 'ns-resize';
    });

    wrap.addEventListener('pointermove', e => {
      if (!wrap.hasPointerCapture(e.pointerId)) return;
      const range = max - min;
      update(startVal + (startY - e.clientY) / 120 * range);
    });

    wrap.addEventListener('pointerup', e => {
      if (!wrap.hasPointerCapture(e.pointerId)) return;
      wrap.releasePointerCapture(e.pointerId);
      wrap.style.cursor = '';
      val = this._roundVal(val, def);
      update(val);
      this._saveParam(pmId, def.name, val);
    });

    wrap.addEventListener('dblclick', async e => {
      e.stopPropagation();
      const newVal = await IO.promptAsync(`${def.name} (${min} to ${max}):`, Math.round(val));
      if (newVal === null) return;
      const n = parseFloat(newVal);
      if (!isNaN(n)) {
        val = this._roundVal(Math.max(min, Math.min(max, n)), def);
        update(val);
        this._saveParam(pmId, def.name, val);
      }
    });
  },

  // Fader interaction is absolute (click/drag jumps straight to that
  // position on the track), unlike a knob's relative drag-anywhere — that's
  // the expected behavior for a slider (real hardware faders and every
  // software mixer work this way), whereas a knob's rotation has no fixed
  // point on screen to click "at" in the first place.
  _bindFader(el, pmId, def, initVal) {
    const id    = this._safeId(pmId, def.name);
    const wrap  = el.querySelector(`[data-def="${encodeURIComponent(JSON.stringify(def))}"]`);
    const track = document.getElementById(`track-${id}`);
    if (!wrap || !track) return;
    const min = def.min ?? 0, max = def.max ?? 100;
    let val   = initVal !== undefined ? parseFloat(initVal) : (def.default ?? min);

    const valueFromClientY = (clientY) => {
      const rect = track.getBoundingClientRect();
      const pct  = Math.max(0, Math.min(1, 1 - (clientY - rect.top) / rect.height));
      return min + pct * (max - min);
    };

    const update = (v) => {
      val = Math.max(min, Math.min(max, v));
      const pct   = (val - min) / (max - min);
      const fill  = document.getElementById(`fill-${id}`);
      const thumb = document.getElementById(`thumb-${id}`);
      const valEl = document.getElementById(`val-${id}`);
      if (fill)  fill.style.height  = (pct * 100).toFixed(2) + '%';
      if (thumb) thumb.style.bottom = (pct * 100).toFixed(2) + '%';
      if (valEl) valEl.textContent = this._fmtDisplay(val, pct, def);
    };

    track.addEventListener('pointerdown', e => {
      if (e.button !== 0) return;
      e.stopPropagation();
      e.preventDefault();
      track.setPointerCapture(e.pointerId);
      update(valueFromClientY(e.clientY));
    });

    track.addEventListener('pointermove', e => {
      if (!track.hasPointerCapture(e.pointerId)) return;
      update(valueFromClientY(e.clientY));
    });

    track.addEventListener('pointerup', e => {
      if (!track.hasPointerCapture(e.pointerId)) return;
      track.releasePointerCapture(e.pointerId);
      val = this._roundVal(val, def);
      update(val);
      this._saveParam(pmId, def.name, val);
    });

    track.addEventListener('dblclick', async e => {
      e.stopPropagation();
      const newVal = await IO.promptAsync(`${def.name} (${min} to ${max}):`, Math.round(val));
      if (newVal === null) return;
      const n = parseFloat(newVal);
      if (!isNaN(n)) {
        val = this._roundVal(Math.max(min, Math.min(max, n)), def);
        update(val);
        this._saveParam(pmId, def.name, val);
      }
    });
  },

  setToggle(pmId, name, e) {
    if (e) e.stopPropagation();
    const id  = `ctrl-${pmId}-${name}`;
    const btn = document.getElementById(id);
    const val = document.getElementById('val-' + id);
    if (!btn) return;
    const on = !btn.classList.contains('on');
    btn.classList.toggle('on', on);
    if (val) val.textContent = on ? 'on' : 'off';
    this._saveParam(pmId, name, on);
  },

  setEnum(pmId, name, value) {
    this._saveParam(pmId, name, value);
  },

  _saveParam(pmId, name, val) {
    const patch = Store.getActivePatch();
    if (!patch.params[pmId]) patch.params[pmId] = {};
    patch.params[pmId][name] = val;
    // Use direct store save without triggering full re-render
    Store.updatePatchSilent(patch.id, { params: patch.params });
  },

  // ── Draggable ────────────────────────────────────────────────────────────

  // Finds a cable's visible path element.
  _findCablePath(cableId) {
    const svg = document.getElementById('cable-svg');
    return svg?.querySelector('path[data-cable-id="' + cableId + '"]') || null;
  },

  _highlightCables(pmId, on) {
    const patch = Store.getActivePatch();
    const svg   = document.getElementById('cable-svg');
    if (!svg) return;
    const connectedIds = new Set(
      patch.cables.filter(c => c.fromPm === pmId || c.toPm === pmId).map(c => c.id)
    );
    if (!connectedIds.size) return;
    const { baseWidth, baseOpacity } = this._cableBaseStyle();
    patch.cables.forEach(c => {
      const path = this._findCablePath(c.id);
      if (!path) return;
      const isConnected = connectedIds.has(c.id);
      if (on) {
        if (isConnected) {
          path.setAttribute('stroke-width', baseWidth);
          path.setAttribute('opacity', '1');
          path.style.filter = 'drop-shadow(0 0 5px ' + c.color + ')';
        } else {
          path.setAttribute('opacity', '0.15');
        }
      } else {
        path.setAttribute('stroke-width', baseWidth);
        path.setAttribute('opacity', baseOpacity);
        path.style.filter = '';
      }
    });
  },

  _makeDraggable(el, pm) {
    el.addEventListener('mouseenter', () => this._highlightCables(pm.id, true));
    el.addEventListener('mouseleave', () => this._highlightCables(pm.id, false));

    // In touch/read mode, modules aren't draggable — the canvas is
    // pan/zoom only and tapping a module's header jumps to its parameters.
    if (Mobile.isTouch()) {
      const header = el.querySelector('.pm-header');
      if (header) {
        header.addEventListener('click', e => {
          if (e.target.closest('.pm-remove') || e.target.closest('.pm-collapse-btn') ||
              e.target.closest('.pm-manual-link')) return;
          App.jumpToModuleParams(pm.id);
        });
      }
      return;
    }

    el.addEventListener('mousedown', e => {
      if (e.target.closest('.port') || e.target.closest('.pm-remove') ||
          e.target.closest('.pm-collapse-btn') || e.target.closest('.pm-manual-link') ||
          e.target.closest('.pm-knob-wrap') || e.target.closest('.pm-toggle-btn') ||
          e.target.closest('.pm-enum-wrap') || e.target.closest('.pm-text-wrap') ||
          e.target.closest('.pm-fader-wrap')) return;
      e.preventDefault();
      // pm.x/pm.y are canvas-local (pre-scale) coordinates, but clientX/Y
      // are screen pixels — dividing by _zoom converts the mouse position
      // into the same space so drag distance tracks the cursor 1:1 at any
      // zoom level instead of over/undershooting it.
      const sx = e.clientX / _zoom - pm.x, sy = e.clientY / _zoom - pm.y;
      el.classList.add('dragging');
      const onMove = ev => {
        pm.x = this._snap(Math.max(0, ev.clientX / _zoom - sx));
        pm.y = this._snap(Math.max(0, ev.clientY / _zoom - sy));
        el.style.left = pm.x + 'px';
        el.style.top  = pm.y + 'px';
        this.renderCables();
        this._highlightCables(pm.id, true);
      };
      const onUp = () => {
        el.classList.remove('dragging');
        this._highlightCables(pm.id, false);
        Store.updatePatch(Store.state.activePatchId, { patchModules: Store.getActivePatch().patchModules });
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
      };
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });
  },

  // ── Snap ─────────────────────────────────────────────────────────────────

  toggleSnap() {
    snapEnabled = !snapEnabled;
    try { localStorage.setItem('patchdoc_snap', snapEnabled ? '1' : '0'); } catch(e) {}
    const btn = document.getElementById('snap-btn');
    if (btn) {
      btn.textContent = snapEnabled ? 'snap on' : 'snap off';
      btn.style.borderColor = snapEnabled ? 'var(--accent-border)' : '';
      btn.style.color       = snapEnabled ? 'var(--accent)' : '';
    }
    App.setStatus(snapEnabled ? 'grid snap on (' + GRID + 'px)' : 'grid snap off');
  },

  zoomIn()    { _zoom = Math.min(ZOOM_MAX, Math.round((_zoom + ZOOM_STEP) * 10) / 10); _applyZoom(); },
  zoomOut()   { _zoom = Math.max(ZOOM_MIN, Math.round((_zoom - ZOOM_STEP) * 10) / 10); _applyZoom(); },
  zoomReset() { _zoom = 1.0; _applyZoom(); },

  initSnap() {
    try { snapEnabled = localStorage.getItem('patchdoc_snap') === '1'; } catch(e) {}
    const btn = document.getElementById('snap-btn');
    if (btn && snapEnabled) {
      btn.textContent = 'snap on';
      btn.style.borderColor = 'var(--accent-border)';
      btn.style.color       = 'var(--accent)';
    }
  },

  // ── Panel/list layout toggle (step 2 of PANEL-LAYOUT-SPEC.md) ──────────────
  // Modules without a `panel` field always render as list, regardless of
  // this — the check is `m.panel && this._panelMode` in render().

  togglePanelMode() {
    this._panelMode = !this._panelMode;
    try { localStorage.setItem('patchdoc_panel_mode', this._panelMode ? '1' : '0'); } catch(e) {}
    this._updatePanelModeBtn();
    this.render();
    App.setStatus(this._panelMode ? 'panel view — modules with a panel layout show their front panel' : 'list view');
  },

  initPanelMode() {
    try {
      const saved = localStorage.getItem('patchdoc_panel_mode');
      if (saved !== null) this._panelMode = saved === '1';
    } catch(e) {}
    this._updatePanelModeBtn();
  },

  _updatePanelModeBtn() {
    const btn = document.getElementById('panel-mode-btn');
    if (btn) {
      btn.textContent = this._panelMode ? 'panel view' : 'list view';
      btn.style.borderColor = this._panelMode ? 'var(--accent-border)' : '';
      btn.style.color       = this._panelMode ? 'var(--accent)' : '';
    }
    // Cables draw above modules (and thinner) in panel mode, so they read as
    // patch cords crossing real jacks instead of vanishing behind the panel.
    document.getElementById('patch-canvas')?.classList.toggle('panel-mode', !!this._panelMode);
  },

  // ── Cable visibility (helps untangle dense patches) ────────────────────────

  toggleCablesVisible() {
    cablesVisible = !cablesVisible;
    const svg = document.getElementById('cable-svg');
    if (svg) svg.style.display = cablesVisible ? '' : 'none';
    const btn = document.getElementById('hide-cables-btn');
    if (btn) {
      btn.style.borderColor = cablesVisible ? '' : 'var(--accent-border)';
      btn.style.color       = cablesVisible ? '' : 'var(--accent)';
      btn.textContent       = cablesVisible ? '⌁ cables' : '⌁ cables (hidden)';
    }
    App.setStatus(cablesVisible ? 'cables visible' : 'cables hidden — ports still clickable to remove via re-show');
  },

  _snap(v) { return snapEnabled ? Math.round(v / GRID) * GRID : v; },

  // Force-align all modules in the current patch to the grid, regardless
  // of whether snap-while-dragging is currently enabled.
  alignToGrid() {
    const patch = Store.getActivePatch();
    if (!patch.patchModules.length) { App.setStatus('no modules to align'); return; }
    patch.patchModules.forEach(pm => {
      pm.x = Math.round(pm.x / GRID) * GRID;
      pm.y = Math.round(pm.y / GRID) * GRID;
    });
    Store.updatePatch(patch.id, { patchModules: patch.patchModules });
    Undo.snapshot();
    this.render();
    App.setStatus('aligned ' + patch.patchModules.length + ' module(s) to grid (' + GRID + 'px)');
  },

  // Pack all modules tightly into rows (like a hardware rack), wrapping to
  // a new row once the visible canvas width is exceeded. Order is preserved
  // top-to-bottom, left-to-right based on current position. The gap between
  // modules (and rows) is user-configurable in HP, see setCompactGap() —
  // widths still come from each module's actual rendered size, so gaps and
  // offsets between differently-sized panels are expected, not a bug.
  _HP_PX: 12, // approximate on-screen px per HP, for the rack-gap control only
  _compactGapHp: 2,

  setCompactGap(hp) {
    const v = Math.max(0, Math.min(20, Number(hp) || 0));
    this._compactGapHp = v;
    try { localStorage.setItem('patchdoc_compact_gap_hp', String(v)); } catch(e) {}
    const input = document.getElementById('compact-gap-input');
    if (input && Number(input.value) !== v) input.value = v;
  },

  initCompactGap() {
    try {
      const saved = localStorage.getItem('patchdoc_compact_gap_hp');
      if (saved !== null) this._compactGapHp = Number(saved) || 0;
    } catch(e) {}
    const input = document.getElementById('compact-gap-input');
    if (input) input.value = this._compactGapHp;
  },

  compactLayout() {
    const patch = Store.getActivePatch();
    if (!patch.patchModules.length) { App.setStatus('no modules to compact'); return; }

    const GAP = Math.round(this._compactGapHp * this._HP_PX); // rack gap, in px
    const wrapEl = document.getElementById('patch-canvas-wrap');
    const rowWidth = Math.max(600, (wrapEl ? wrapEl.clientWidth : 1200) - 40);

    // Sort by current visual order: row first (y, bucketed), then x
    const sorted = [...patch.patchModules].sort((a, b) => {
      const rowA = Math.round(a.y / 100), rowB = Math.round(b.y / 100);
      if (rowA !== rowB) return rowA - rowB;
      return a.x - b.x;
    });

    let x = GAP, y = GAP, rowH = 0;
    sorted.forEach(pm => {
      const el = document.querySelector('.patch-module[data-pmid="' + pm.id + '"]');
      const w  = el ? el.offsetWidth  : 150;
      const h  = el ? el.offsetHeight : 120;

      if (x + w > rowWidth && x > GAP) {
        // wrap to next row
        x = GAP;
        y += rowH + GAP;
        rowH = 0;
      }
      pm.x = x;
      pm.y = y;
      x += w + GAP;
      rowH = Math.max(rowH, h);
    });

    Store.updatePatch(patch.id, { patchModules: patch.patchModules });
    Undo.snapshot();
    this.render();
    App.setStatus('compacted ' + sorted.length + ' module(s) into rows');
  },

  // ── Patch management ──────────────────────────────────────────────────────

  addToPatch(moduleId) {
    const patch = Store.getActivePatch();
    const idx       = patch.patchModules.length;
    const instances = patch.patchModules.filter(p => p.moduleId === moduleId).length;
    patch.patchModules.push({
      moduleId, id: Date.now(), paramsOpen: false,
      instance: instances + 1,
      x: 20 + (idx % 4) * 160,
      y: 20 + Math.floor(idx / 4) * 220
    });
    Store.updatePatch(patch.id, { patchModules: patch.patchModules });
    Undo.snapshot();
    this.render();
    const m = Store.state.modules.find(x => x.id === moduleId);
    App.setStatus((m ? m.name : 'module') + (instances > 0 ? ' #' + (instances + 1) : '') + ' added');
  },

  removeFromPatch(pmId) {
    const patch = Store.getActivePatch();
    patch.patchModules = patch.patchModules.filter(pm => pm.id !== pmId);
    patch.cables       = patch.cables.filter(c => c.fromPm !== pmId && c.toPm !== pmId);
    if (patch.marks) delete patch.marks[pmId];
    Store.updatePatch(patch.id, { patchModules: patch.patchModules, cables: patch.cables, marks: patch.marks });
    this.render();
  },

  toggleCollapse(pmId, e) {
    if (e) e.stopPropagation();
    const patch = Store.getActivePatch();
    const pm = patch.patchModules.find(p => p.id === pmId);
    if (!pm) return;
    pm.collapsed = !pm.collapsed;
    Store.updatePatch(patch.id, { patchModules: patch.patchModules });
    Undo.snapshot();
    this.render();
  },

  toggleAllCollapse() {
    const patch = Store.getActivePatch();
    if (!patch.patchModules.length) return;
    // If any module is expanded (and has params), collapse all. Otherwise expand all.
    const modules = Store.state.modules;
    const collapsibleModules = patch.patchModules.filter(pm => {
      const m = modules.find(x => x.id === pm.moduleId);
      return m && (m.paramDefs || []).length;
    });
    if (!collapsibleModules.length) return;
    const anyExpanded = collapsibleModules.some(pm => !pm.collapsed);
    collapsibleModules.forEach(pm => { pm.collapsed = anyExpanded; });
    Store.updatePatch(patch.id, { patchModules: patch.patchModules });
    Undo.snapshot();
    this.render();
    const btn = document.getElementById('collapse-all-btn');
    if (btn) btn.innerHTML = anyExpanded ? '▾ params' : '▴ params';
  },

  // ── Ports & cables ────────────────────────────────────────────────────────

  // Shared cable-creation logic, used both by canvas click-click and by
  // the mobile dropdown-based connection editor.
  createCable(fromPmId, fromPort, toPmId, toPort) {
    const patch = Store.getActivePatch();
    if (patch.cables.find(c => c.fromPm === fromPmId && c.fromPort === fromPort && c.toPm === toPmId && c.toPort === toPort)) {
      return null; // already exists
    }
    const color = CABLE_COLORS[patch.cableColorIdx++ % CABLE_COLORS.length];
    const cable = { id: Date.now(), fromPm: fromPmId, fromPort, toPm: toPmId, toPort, color };
    patch.cables.push(cable);
    Store.updatePatch(patch.id, { cables: patch.cables, cableColorIdx: patch.cableColorIdx });
    Undo.snapshot();
    return cable;
  },

  // Re-route an existing cable to a new target (used by the mobile
  // connections editor when changing a dropdown selection).
  updateCable(cableId, changes) {
    const patch = Store.getActivePatch();
    const cable = patch.cables.find(c => c.id === cableId);
    if (!cable) return false;
    // Prevent creating a duplicate of another existing cable
    const next = { ...cable, ...changes };
    const dup = patch.cables.find(c =>
      c.id !== cableId && c.fromPm === next.fromPm && c.fromPort === next.fromPort &&
      c.toPm === next.toPm && c.toPort === next.toPort
    );
    if (dup) return false;
    Object.assign(cable, changes);
    Store.updatePatch(patch.id, { cables: patch.cables });
    Undo.snapshot();
    return true;
  },

  clickPort(pmId, dir, portName, e) {
    e.stopPropagation();
    // In touch/read mode, cables are created via the connections tab
    // dropdowns instead of click-click on ports.
    if (Mobile.isTouch()) {
      App.setStatus('use the connections tab to add cables on touch devices');
      return;
    }
    const patch = Store.getActivePatch();
    if (!pendingPort) {
      pendingPort = { pmId, dir, portName };
      document.getElementById('jack-' + pmId + '-' + dir + '-' + portName)?.classList.add('pending');
      App.setStatus('connecting ' + portName + ' → click target port  (same port to cancel)');
      return;
    }
    document.querySelectorAll('.port-jack.pending').forEach(j => j.classList.remove('pending'));
    if (pendingPort.pmId === pmId && pendingPort.dir === dir && pendingPort.portName === portName) {
      pendingPort = null; App.setStatus('cancelled'); return;
    }
    if (pendingPort.dir === dir) {
      pendingPort = { pmId, dir, portName };
      document.getElementById('jack-' + pmId + '-' + dir + '-' + portName)?.classList.add('pending');
      App.setStatus('need ' + (dir === 'out' ? 'an input' : 'an output') + ' port');
      return;
    }
    const from = pendingPort.dir === 'out' ? pendingPort : { pmId, dir, portName };
    const to   = pendingPort.dir === 'in'  ? pendingPort : { pmId, dir, portName };
    this.createCable(from.pmId, from.portName, to.pmId, to.portName);
    pendingPort = null;
    this.renderCables(); this.updateJacks();
    App.setStatus(patch.cables.length + ' cable' + (patch.cables.length !== 1 ? 's' : ''));
  },

  _getPortCenter(pmId, dir, portName) {
    const jack = document.getElementById('jack-' + pmId + '-' + dir + '-' + portName);
    if (!jack) return null;
    const canvas = document.getElementById('patch-canvas');
    const cr = canvas.getBoundingClientRect();
    const jr = jack.getBoundingClientRect();
    // getBoundingClientRect() is post-zoom (screen) pixels, but cable-svg
    // lives inside #patch-canvas and inherits its CSS scale — so a screen-
    // pixel delta used as-is gets scaled a second time by that ancestor
    // transform. Dividing by _zoom converts back to the canvas's own
    // (pre-scale) coordinate space, which is what the SVG path needs.
    return { x: (jr.left - cr.left + jr.width / 2) / _zoom, y: (jr.top - cr.top + jr.height / 2) / _zoom };
  },

  // Builds the SVG path "d" string for a cable between two port centers.
  // Cables leave/arrive with a flat, stub-like departure near the jack
  // before bending into the sag — regardless of cable length — by
  // starting the control points as a horizontal continuation of the jack
  // direction, then blending toward the full sag based on distance.
  //
  // Special case: if the target port lies to the LEFT of the source
  // (totalDx < 0), a normal horizontal bow can't work — output jacks
  // always face right and input jacks always face left, so the cable
  // would have to swing backward and arrive from the wrong side. Instead
  // it loops vertically (down or up, whichever matches the target's
  // relative height) so it always approaches each jack from the correct
  // fixed direction.
  _cablePath(from, to, totalDx, totalDy) {
    if (totalDx < 0) {
      // Cable loops vertically instead of bowing backward (output jacks
      // always face right, input jacks always face left — a backward
      // cable can't just curve horizontally without arriving from the
      // wrong side). Single bezier for guaranteed smoothness at any
      // distance or angle (a three-segment version was tried first but
      // its joins created a visible kink on short/flat cables).
      //
      // Both STUB (how far the curve travels horizontally before the
      // loop "takes over") and loopAmount scale down together for short
      // cables, keeping their ratio consistent — that's what keeps the
      // curve a clean loop instead of a crossed-over knot, while still
      // giving long cables a clearly visible flat departure.
      const dist  = Math.sqrt(totalDx * totalDx + totalDy * totalDy);
      const scale = Math.min(1, dist / 500); // reaches full size by 500px distance
      const loopDir = totalDy >= 0 ? 1 : -1;
      const STUB = 40 + 210 * scale; // 40 (short cables) up to 250 (long cables)
      const loopAmount = Math.max(45, Math.abs(totalDy) * 0.3) * Math.max(0.55, scale);
      const cp1 = { x: from.x + STUB, y: from.y + loopAmount * loopDir };
      const cp2 = { x: to.x   - STUB, y: to.y   + loopAmount * loopDir };
      return `M${from.x},${from.y} C${cp1.x},${cp1.y} ${cp2.x},${cp2.y} ${to.x},${to.y}`;
    }

    const dist = Math.sqrt(totalDx * totalDx + totalDy * totalDy);
    const rawSag = 60 + Math.abs(totalDy) * 0.2;
    const sag = Math.min(rawSag, 140);
    const rawBow = Math.abs(totalDx) * 0.5;
    const bow = Math.min(rawBow, 110);

    // STUB is capped relative to the available horizontal space so the
    // two control points can never cross past each other on short or
    // mostly-horizontal cables — that crossing was causing visible
    // loops/kinks at medium-short distances (~50-150px).
    const halfDx = totalDx / 2;
    const STUB = Math.min(36, halfDx * 0.8);
    const blend = Math.min(1, dist / 220); // 0 = very short cable, 1 = full sag kicks in
    const cp1 = { x: from.x + STUB + bow * 0.3 * blend, y: from.y + sag * blend };
    const cp2 = { x: to.x   - STUB - bow * 0.3 * blend, y: to.y   + sag * blend };
    return `M${from.x},${from.y} C${cp1.x},${cp1.y} ${cp2.x},${cp2.y} ${to.x},${to.y}`;
  },

  // Panel mode draws cables above modules (see .panel-mode CSS), so they
  // need to stay translucent or they'd bury the jacks and controls they
  // cross — but same width as list mode, and width never changes on
  // highlight/hover, only opacity (hoverWidth === baseWidth on purpose).
  // Shared by renderCables() and _highlightCables() so un-hovering a
  // module resets cables to the right mode's baseline instead of the
  // other mode's.
  _cableBaseStyle() {
    return this._panelMode
      ? { baseWidth: '2.5', hoverWidth: '2.5', baseOpacity: '0.15', hoverOpacity: '0.4' }
      : { baseWidth: '2.5', hoverWidth: '2.5', baseOpacity: '0.85', hoverOpacity: '1' };
  },

  renderCables() {
    const patch = Store.getActivePatch();
    const svg   = document.getElementById('cable-svg');
    svg.innerHTML = '';
    // Remove any leftover overlay from an earlier render — cables now
    // always render in the single SVG below modules, as originally
    // intended. (A per-cable overlay above modules was tried to keep
    // backward loops visible when they pass behind another module, but
    // that made cables draw over module content they have nothing to
    // do with, which looked worse than the occasional partial overlap.)
    document.getElementById('cable-svg-overlay')?.remove();

    const { baseWidth, hoverWidth, baseOpacity, hoverOpacity } = this._cableBaseStyle();
    patch.cables.forEach(c => {
      const from = this._getPortCenter(c.fromPm, 'out', c.fromPort);
      const to   = this._getPortCenter(c.toPm,   'in',  c.toPort);
      if (!from || !to) return;
      const totalDx = to.x - from.x;
      const totalDy = to.y - from.y;
      const d = this._cablePath(from, to, totalDx, totalDy);
      // hit area (wider invisible path for easier clicking)
      const hit = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      hit.setAttribute('d', d); hit.setAttribute('stroke', 'transparent');
      hit.setAttribute('stroke-width', '12'); hit.setAttribute('fill', 'none');
      hit.style.cursor = 'pointer';
      hit.style.pointerEvents = 'stroke'; // SVG container is click-through; only this path intercepts clicks
      hit.addEventListener('click', (e) => this.onCableClick(c.id, e));
      hit.addEventListener('mouseenter', (e) => {
        vis.setAttribute('opacity', hoverOpacity); vis.setAttribute('stroke-width', hoverWidth);
        this.showCablePopup(c.id, e, false);
      });
      hit.addEventListener('mouseleave', () => {
        vis.setAttribute('opacity', c.id === _selectedCableId ? hoverOpacity : baseOpacity);
        vis.setAttribute('stroke-width', baseWidth);
        this.maybeHideCablePopup(c.id);
      });
      // visible path
      const vis = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      vis.setAttribute('d', d); vis.setAttribute('stroke', c.color);
      vis.setAttribute('stroke-width', baseWidth); vis.setAttribute('fill', 'none');
      vis.setAttribute('stroke-linecap', 'round');
      vis.setAttribute('opacity', c.id === _selectedCableId ? hoverOpacity : baseOpacity);
      if (c.mod) vis.setAttribute('stroke-dasharray', '7,5');
      vis.setAttribute('data-cable-id', c.id);
      vis.style.pointerEvents = 'none';
      vis.title = c.fromPort + ' → ' + c.toPort;
      svg.appendChild(vis);
      svg.appendChild(hit);
    });
  },

  removeCable(id) {
    const patch = Store.getActivePatch();
    patch.cables = patch.cables.filter(c => c.id !== id);
    Store.updatePatch(patch.id, { cables: patch.cables });
    Undo.snapshot();
    if (_selectedCableId === id) this.deselectCable();
    this.renderCables(); this.updateJacks();
    App.setStatus('cable removed');
  },

  // ── Cable modulation (amount / phase / polarity) ───────────────────────
  // Optional, per-cable metadata for documenting a modulation connection
  // (e.g. an LFO into a CV input) precisely enough to reproduce it later —
  // not just *that* it's connected, but how strong, in what phase, and
  // which direction. A cable with this set renders dashed on the canvas.

  deleteSelectedCable() {
    if (_selectedCableId == null) return;
    this.removeCable(_selectedCableId);
  },

  selectCable(id) {
    _selectedCableId = id;
    const btn = document.getElementById('delete-cable-btn');
    if (btn) btn.style.display = '';
    this.renderCables(); this.updateJacks();
  },

  deselectCable() {
    _selectedCableId = null;
    const btn = document.getElementById('delete-cable-btn');
    if (btn) btn.style.display = 'none';
    this.hideCablePopup();
    this.renderCables(); this.updateJacks();
  },

  onCableClick(id, e) {
    e.stopPropagation();
    this.selectCable(id);
    this.showCablePopup(id, e, true);
  },

  _cableById(id) {
    return Store.getActivePatch().cables.find(c => c.id === id);
  },

  // "65%" only means something if you know what 100% is — an oscillator's
  // exponential (1V/oct) pitch input and its linear FM input respond to
  // the same voltage completely differently, so the sensible unit for
  // "amount" depends on which input a cable actually lands on. Rather than
  // have the app try to know that, the unit is just another field the
  // person documenting the patch picks — this only supplies a reasonable
  // starting guess from the destination port's name, always overridable.
  _AMOUNT_UNITS: {
    '%':            { label: '%',      min: 0, max: 100,  step: 1   },
    semitones:      { label: 'semi',   min: 0, max: 60,   step: 1   },
    quartertones:   { label: '¼tone',  min: 0, max: 120,  step: 1   },
    octaves:        { label: 'oct',    min: 0, max: 5,    step: 0.1 },
    Hz:             { label: 'Hz',     min: 0, max: 2000, step: 1   },
    V:              { label: 'V',      min: 0, max: 10,   step: 0.1 },
  },

  _suggestAmountUnit(portName) {
    const p = (portName || '').toLowerCase();
    if (p.includes('fm')) return 'Hz';
    if (p.includes('oct') || p.includes('pitch')) return 'semitones';
    return '%';
  },

  // Fills in defaults and clamps `amount` to whatever unit is active, in
  // one place both setCableMod and the popup's renderer share — needed for
  // two cases: a fresh cable defaults amount to 50 regardless of which
  // unit ends up picked (switching straight to e.g. "V", max 10, would
  // otherwise leave an invalid 50V stored/displayed), and a cable saved
  // before units existed has no amountUnit field at all, which must
  // default to '%' specifically — the only unit that existed back then —
  // rather than run the port-name suggestion against an old value that
  // was never meant to be semitones/Hz/etc. Suggestion only ever applies
  // to a cable that's never had mod data before.
  _normalizeMod(rawMod, toPort) {
    const wasSet = !!rawMod;
    const defaults = {
      amount: 50,
      amountUnit: wasSet ? '%' : this._suggestAmountUnit(toPort),
      phase: 0,
      polarity: 'bipolar',
    };
    const mod = { ...defaults, ...(rawMod || {}) };
    mod.amountUnit = this._AMOUNT_UNITS[mod.amountUnit] ? mod.amountUnit : '%';
    const range = this._AMOUNT_UNITS[mod.amountUnit];
    mod.amount = Math.min(range.max, Math.max(range.min, Number(mod.amount) || 0));
    return mod;
  },

  setCableMod(id, field, value) {
    const patch = Store.getActivePatch();
    const cable = patch.cables.find(c => c.id === id);
    if (!cable) return;
    const wasSet = !!cable.mod;
    const next = this._normalizeMod(cable.mod, cable.toPort);
    next[field] = value;
    // Re-clamp after applying the edit — matters when `field` was
    // 'amountUnit' itself, since the previous amount may not fit the
    // newly-picked unit's range.
    const range = this._AMOUNT_UNITS[next.amountUnit] || this._AMOUNT_UNITS['%'];
    next.amount = Math.min(range.max, Math.max(range.min, Number(next.amount) || 0));
    cable.mod = next;
    Store.updatePatch(patch.id, { cables: patch.cables });
    Undo.snapshot();
    if (!wasSet) this.renderCables(); // dash style only needs a redraw the first time
  },

  clearCableMod(id) {
    const patch = Store.getActivePatch();
    const cable = patch.cables.find(c => c.id === id);
    if (!cable || !cable.mod) return;
    delete cable.mod;
    Store.updatePatch(patch.id, { cables: patch.cables });
    Undo.snapshot();
    this.hideCablePopup();
    this.renderCables();
  },

  // Rebuilds the popup's fields for a given cable without touching its
  // position — used both by showCablePopup (first open) and by
  // onAmountUnitChange (switching units needs a fresh min/max/step on the
  // amount input, which is simplest as a full re-render of just the
  // content).
  _renderCablePopupContent(popup, cable, pinned) {
    const id = cable.id;
    const mod = this._normalizeMod(cable.mod, cable.toPort);
    const unit = mod.amountUnit;
    const range = this._AMOUNT_UNITS[unit];

    popup.innerHTML = `
      <div class="cable-mod-popup-header">
        <span>${cable.fromPort} → ${cable.toPort}</span>
        ${pinned ? '<button class="conn-del" onclick="Patch.clearCableMod(' + id + ')" title="remove modulation data" aria-label="remove modulation data">×</button>' : ''}
      </div>
      <div class="cable-mod-popup-row">
        <label>amount</label>
        <input type="number" min="${range.min}" max="${range.max}" step="${range.step}" value="${mod.amount}" ${pinned ? '' : 'readonly'}
          onchange="Patch.setCableMod(${id},'amount',parseFloat(this.value)||0)">
        <select class="cable-mod-popup-unit-select" ${pinned ? '' : 'disabled'} onchange="Patch.onAmountUnitChange(${id},this.value)" title="unit — pick whatever's meaningful for this input (semitones/quartertones for pitch CV, Hz for linear FM, % otherwise)">
          ${Object.entries(this._AMOUNT_UNITS).map(([key, u]) =>
            `<option value="${key}" ${key === unit ? 'selected' : ''}>${u.label}</option>`
          ).join('')}
        </select>
      </div>
      <div class="cable-mod-popup-row">
        <label>phase</label>
        <input type="number" min="0" max="360" value="${mod.phase}" ${pinned ? '' : 'readonly'}
          onchange="Patch.setCableMod(${id},'phase',parseFloat(this.value)||0)">
        <span class="cable-mod-popup-unit">°</span>
      </div>
      <div class="cable-mod-popup-row">
        <label>polarity</label>
        <select ${pinned ? '' : 'disabled'} onchange="Patch.setCableMod(${id},'polarity',this.value)">
          <option value="bipolar" ${mod.polarity === 'bipolar' ? 'selected' : ''}>bipolar (±)</option>
          <option value="unipolar" ${mod.polarity === 'unipolar' ? 'selected' : ''}>unipolar (+)</option>
        </select>
      </div>`;
  },

  onAmountUnitChange(id, unit) {
    this.setCableMod(id, 'amountUnit', unit);
    const popup = document.getElementById('cable-mod-popup');
    const cable = this._cableById(id);
    if (popup && cable) this._renderCablePopupContent(popup, cable, true);
  },

  // Shows the floating amount/phase/polarity popup near the cursor.
  // pinned=false (hover): a quick read-only-looking preview, only for
  // cables that already have mod data, auto-closes on mouseleave.
  // pinned=true (click): always shown, fields are live-editable, stays
  // open until something else is clicked.
  showCablePopup(id, e, pinned) {
    const cable = this._cableById(id);
    if (!cable) return;
    if (!pinned && !cable.mod) return; // nothing to preview yet
    if (!pinned && _cablePopupPinnedFor != null) return; // a pinned popup takes priority

    let popup = document.getElementById('cable-mod-popup');
    if (!popup) {
      popup = document.createElement('div');
      popup.id = 'cable-mod-popup';
      popup.addEventListener('mouseenter', () => { popup.dataset.hovering = '1'; });
      popup.addEventListener('mouseleave', () => {
        delete popup.dataset.hovering;
        if (_cablePopupPinnedFor == null) this.hideCablePopup();
      });
      document.body.appendChild(popup);
    }
    _cablePopupPinnedFor = pinned ? id : _cablePopupPinnedFor;

    popup.dataset.cableId = id;
    this._renderCablePopupContent(popup, cable, pinned);

    // Position near the cursor, clamped so it can't run off the right/
    // bottom edge — popup width/height are fixed in CSS, so fixed
    // estimates are fine here without waiting on a layout pass.
    const x = Math.min(e.clientX + 14, window.innerWidth - 230);
    const y = Math.min(e.clientY + 14, window.innerHeight - 160);
    popup.style.left = x + 'px';
    popup.style.top  = y + 'px';
    popup.classList.add('open');
    popup.classList.toggle('pinned', pinned);

    if (pinned) {
      // Close when clicking anywhere outside the popup or the cable itself.
      setTimeout(() => document.addEventListener('click', this._cablePopupOutsideHandler, { once: true }), 0);
      popup.querySelector('input')?.focus();
    }
  },

  _cablePopupOutsideHandler(e) {
    const popup = document.getElementById('cable-mod-popup');
    if (popup && popup.contains(e.target)) {
      document.addEventListener('click', Patch._cablePopupOutsideHandler, { once: true });
      return;
    }
    Patch.deselectCable();
  },

  maybeHideCablePopup(id) {
    if (_cablePopupPinnedFor != null) return; // pinned popups only close via outside-click or delete
    // Delayed check — the popup's own mouseenter (which sets `hovering`)
    // hasn't necessarily fired yet the instant the cursor leaves the cable
    // on its way toward the popup, so hiding synchronously here could beat
    // the user to it.
    setTimeout(() => {
      if (_cablePopupPinnedFor != null) return;
      const popup = document.getElementById('cable-mod-popup');
      if (popup && popup.dataset.hovering) return;
      this.hideCablePopup();
    }, 120);
  },

  hideCablePopup() {
    _cablePopupPinnedFor = null;
    document.removeEventListener('click', this._cablePopupOutsideHandler);
    document.getElementById('cable-mod-popup')?.classList.remove('open', 'pinned');
  },

  updateJacks() {
    const patch = Store.getActivePatch();
    document.querySelectorAll('.port-jack').forEach(j => {
      j.classList.remove('connected'); j.style.background = ''; j.style.borderColor = '';
    });
    patch.cables.forEach(c => {
      const fj = document.getElementById('jack-' + c.fromPm + '-out-' + c.fromPort);
      const tj = document.getElementById('jack-' + c.toPm   + '-in-'  + c.toPort);
      if (fj) { fj.classList.add('connected'); fj.style.background = c.color; fj.style.borderColor = c.color; }
      if (tj) { tj.classList.add('connected'); tj.style.background = c.color; tj.style.borderColor = c.color; }
    });
  },

  clearCables() {
    const patch = Store.getActivePatch();
    patch.cables = [];
    Store.updatePatch(patch.id, { cables: [] });
    this.renderCables(); this.updateJacks();
    App.setStatus('cables cleared');
  },

  clearAll() {
    const patch = Store.getActivePatch();
    patch.patchModules = []; patch.cables = [];
    Store.updatePatch(patch.id, { patchModules: [], cables: [] });
    this.render();
    App.updateHPSum();
    App.setStatus('patch cleared');
  }
};
