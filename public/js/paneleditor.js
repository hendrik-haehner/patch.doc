// ── Panel layout editor (module modal → "edit panel layout") ──────────────
//
// Positions ports/params that already exist on the module form onto a
// CSS-grid front-panel layout (module.panel — see PANEL-LAYOUT-SPEC.md).
// Does not create ports or parameters itself; it only arranges refs that
// App.openModal() already staged in window._tempInputs/_tempOutputs/
// _tempParamDefs. Mirrors the drag/drop conventions already used for I/O
// reordering (App._ioDragStart etc.) and param-def reordering
// (App._pdefDragStart etc.).

const CELL_W = 50, CELL_H = 44, CELL_GAP = 4;

const PanelEditor = {

  open() {
    if (!window._tempPanel) {
      window._tempPanel = { cols: 4, rows: 6, elements: [] };
    }
    window._panelPool = window._panelPool || [];
    window._panelSelectedIdx = null;
    window._panelEditorSnapshot = JSON.stringify({
      panel: window._tempPanel,
      pool: window._panelPool,
    });
    const nameField = document.getElementById('m-name');
    document.getElementById('panel-editor-module-name').textContent = (nameField && nameField.value) || 'new module';
    document.getElementById('panel-editor-cols').value = window._tempPanel.cols;
    document.getElementById('panel-editor-rows').value = window._tempPanel.rows;
    this._renderPool();
    this._renderGrid();
    this._renderInspector();
    document.getElementById('panel-editor-modal-bg').classList.add('open');
  },

  cancel() {
    const snap = JSON.parse(window._panelEditorSnapshot || '{"panel":null,"pool":[]}');
    window._tempPanel = snap.panel;
    window._panelPool = snap.pool;
    this._close();
  },

  done() {
    this._close();
    App.updatePanelSummary();
  },

  removePanel() {
    if (!confirm('Remove panel layout for this module?')) return;
    window._tempPanel = null;
    window._panelPool = [];
    this._close();
    App.updatePanelSummary();
  },

  _close() {
    document.getElementById('panel-editor-modal-bg').classList.remove('open');
    window._panelSelectedIdx = null;
  },

  // ── grid size ────────────────────────────────────────────────────────────

  setCols(v) {
    window._tempPanel.cols = Math.max(1, parseInt(v) || 1);
    this._reflow();
  },

  setRows(v) {
    window._tempPanel.rows = Math.max(1, parseInt(v) || 1);
    this._reflow();
  },

  // Elements that no longer fit after a shrink are unplaced rather than
  // clipped or left with out-of-bounds coordinates.
  _reflow() {
    const panel = window._tempPanel;
    const kept = [];
    panel.elements.forEach(el => {
      const w = el.w || 1, h = el.h || 1;
      if (el.col + w <= panel.cols && el.row + h <= panel.rows) kept.push(el);
      else this._returnToPool(el);
    });
    panel.elements = kept;
    window._panelSelectedIdx = null;
    this._renderPool();
    this._renderGrid();
    this._renderInspector();
  },

  _returnToPool(el) {
    if (['label', 'divider', 'divider-h', 'divider-v', 'button'].includes(el.type)) {
      window._panelPool.push({ localId: this._uid(), type: el.type, text: el.text || '' });
    }
    // ports/params need no bookkeeping — they reappear in the pool
    // automatically since it's computed from refs not currently placed.
  },

  // ── pool (unplaced chips) ───────────────────────────────────────────────

  addSpecial(type) {
    window._panelPool = window._panelPool || [];
    window._panelPool.push({
      localId: this._uid(), type,
      text: type === 'label' ? 'label' : type === 'button' ? 'button' : '',
    });
    this._renderPool();
  },

  _renderPool() {
    const el = document.getElementById('panel-editor-pool-list');
    if (!el) return;
    const panel = window._tempPanel;
    const placedInput  = new Set(panel.elements.filter(e => e.type === 'input').map(e => e.ref));
    const placedOutput = new Set(panel.elements.filter(e => e.type === 'output').map(e => e.ref));
    // Keyed by type+ref, not just ref — a knob and an enum can share a
    // name (e.g. both called "Freq"), and placing one must not hide the
    // other's pool chip.
    const placedParam = new Set(panel.elements
      .filter(e => !['input', 'output', 'label', 'divider', 'divider-h', 'divider-v', 'button'].includes(e.type))
      .map(e => e.type + ' ' + e.ref));

    const chips = [];
    (window._tempInputs || []).forEach(p => {
      if (!placedInput.has(p.name)) chips.push(this._chip({ kind: 'port', type: 'input', ref: p.name, label: p.name, badge: 'input' }));
    });
    (window._tempOutputs || []).forEach(p => {
      if (!placedOutput.has(p.name)) chips.push(this._chip({ kind: 'port', type: 'output', ref: p.name, label: p.name, badge: 'output' }));
    });
    (window._tempParamDefs || []).filter(d => d.type !== 'divider').forEach(d => {
      if (!placedParam.has(d.type + ' ' + d.name)) chips.push(this._chip({ kind: 'param', type: d.type, ref: d.name, label: d.name, badge: d.type }));
    });
    (window._panelPool || []).forEach(p => {
      chips.push(this._chip({ kind: 'special', type: p.type, localId: p.localId, label: p.text || this._specialLabel(p.type), badge: p.type }));
    });

    el.innerHTML = chips.join('') || '<div class="panel-editor-pool-empty">everything placed</div>';
  },

  _chip({ kind, type, ref, localId, label, badge }) {
    return `<div class="panel-editor-chip" draggable="true"
      data-kind="${kind}" data-type="${type}"
      data-ref="${ref != null ? this._attrEsc(ref) : ''}" data-local-id="${localId || ''}"
      ondragstart="PanelEditor.poolDragStart(event)"
      ondragend="PanelEditor.dragEnd(event)">
      <span class="panel-editor-chip-badge panel-editor-chip-badge-${type}">${badge}</span>
      <span class="panel-editor-chip-label">${this._attrEsc(label)}</span>
    </div>`;
  },

  // ── grid ─────────────────────────────────────────────────────────────────

  _renderGrid() {
    const wrap = document.getElementById('panel-editor-grid');
    if (!wrap) return;
    const panel = window._tempPanel;
    wrap.style.gridTemplateColumns = `repeat(${panel.cols}, ${CELL_W}px)`;
    wrap.style.gridAutoRows = CELL_H + 'px';

    let html = '';
    for (let r = 0; r < panel.rows; r++) {
      for (let c = 0; c < panel.cols; c++) {
        // Explicit grid-column/grid-row, not auto-placement — otherwise
        // these compete for slots with the explicitly-positioned placed
        // elements below, and any empty cell displaced by a collision
        // overflows into a new implicit row past the declared row count.
        html += `<div class="panel-editor-empty-cell" data-col="${c}" data-row="${r}" style="grid-column:${c + 1};grid-row:${r + 1}"></div>`;
      }
    }
    html += panel.elements.map((e, i) => this._elementChip(e, i)).join('');
    wrap.innerHTML = html;
  },

  _elementChip(e, i) {
    const pos = `grid-column:${e.col + 1} / span ${e.w || 1};grid-row:${e.row + 1} / span ${e.h || 1}`;
    const label = (e.type === 'label' || e.type === 'button') ? (e.text || '')
      : (e.type === 'divider' || e.type === 'divider-h') ? '──' : e.type === 'divider-v' ? '│' : (e.ref || '');
    const selected = window._panelSelectedIdx === i ? ' selected' : '';
    return `<div class="panel-editor-placed panel-editor-chip-badge-${e.type}${selected}" style="${pos}" draggable="true"
      onclick="PanelEditor.selectElement(${i},event)"
      ondragstart="PanelEditor.gridDragStart(${i},event)"
      ondragend="PanelEditor.dragEnd(event)"
      title="${this._attrEsc(label)}">
      <span class="panel-editor-chip-label">${this._attrEsc(label)}</span>
    </div>`;
  },

  selectElement(i, e) {
    if (e) e.stopPropagation();
    window._panelSelectedIdx = i;
    this._renderGrid();
    this._renderInspector();
  },

  deselectAll() {
    window._panelSelectedIdx = null;
    this._renderGrid();
    this._renderInspector();
  },

  gridDragStart(i, e) {
    window._panelDragInfo = { source: 'grid', index: i };
    e.dataTransfer.effectAllowed = 'move';
    // Anchor the drag ghost's top-left corner to the cursor, matching how
    // _cellFromEvent() reads the drop cell — otherwise the ghost trails
    // wherever inside the chip you happened to grab it, and the cell that
    // lights up doesn't match what looks like it's under the ghost.
    e.dataTransfer.setDragImage(e.currentTarget, 0, 0);
    // currentTarget is only valid for the duration of this handler — grab
    // it now, not inside the timeout (it'd be null by the next tick).
    const el = e.currentTarget;
    setTimeout(() => el.classList.add('dragging'), 0);
  },

  poolDragStart(e) {
    const d = e.currentTarget.dataset;
    window._panelDragInfo = {
      source: 'pool', kind: d.kind, type: d.type,
      ref: d.ref || null, localId: d.localId || null,
    };
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setDragImage(e.currentTarget, 0, 0);
    const el = e.currentTarget;
    setTimeout(() => el.classList.add('dragging'), 0);
  },

  dragEnd(e) {
    e.currentTarget.classList.remove('dragging');
    document.querySelectorAll('.panel-editor-empty-cell.drag-over,.panel-editor-empty-cell.drag-over-invalid')
      .forEach(c => c.classList.remove('drag-over', 'drag-over-invalid'));
  },

  _cellFromEvent(e) {
    const grid = document.getElementById('panel-editor-grid');
    const rect = grid.getBoundingClientRect();
    const col = Math.floor((e.clientX - rect.left) / (CELL_W + CELL_GAP));
    const row = Math.floor((e.clientY - rect.top)  / (CELL_H + CELL_GAP));
    return { col, row };
  },

  onGridDragOver(e) {
    e.preventDefault();
    const info  = window._panelDragInfo;
    const panel = window._tempPanel;
    const { col, row } = this._cellFromEvent(e);
    document.querySelectorAll('.panel-editor-empty-cell.drag-over,.panel-editor-empty-cell.drag-over-invalid')
      .forEach(c => c.classList.remove('drag-over', 'drag-over-invalid'));
    if (col < 0 || row < 0 || col >= panel.cols || row >= panel.rows) return;
    const cell = document.querySelector(`.panel-editor-empty-cell[data-col="${col}"][data-row="${row}"]`);
    if (!cell) return;
    let w = 1, h = 1, excludeIdx = -1;
    if (info && info.source === 'grid') {
      const el = panel.elements[info.index];
      if (el) { w = el.w || 1; h = el.h || 1; excludeIdx = info.index; }
    }
    const free = this._cellsFree(panel.elements, col, row, w, h, excludeIdx);
    cell.classList.add(free ? 'drag-over' : 'drag-over-invalid');
  },

  onGridDrop(e) {
    e.preventDefault();
    document.querySelectorAll('.panel-editor-empty-cell.drag-over,.panel-editor-empty-cell.drag-over-invalid')
      .forEach(c => c.classList.remove('drag-over', 'drag-over-invalid'));
    const info = window._panelDragInfo;
    if (!info) return;
    const panel = window._tempPanel;
    const { col, row } = this._cellFromEvent(e);
    if (col < 0 || row < 0 || col >= panel.cols || row >= panel.rows) { window._panelDragInfo = null; return; }

    if (info.source === 'pool') {
      if (!this._cellsFree(panel.elements, col, row, 1, 1, -1)) { App.setStatus('panel: cell occupied'); window._panelDragInfo = null; return; }
      const newEl = { type: info.type, ref: info.ref, col, row, w: 1, h: 1 };
      if (info.type === 'label' || info.type === 'button') {
        const src = (window._panelPool || []).find(p => p.localId === info.localId);
        newEl.text = src ? src.text : (info.type === 'label' ? 'label' : 'button');
      }
      panel.elements.push(newEl);
      if (info.kind === 'special') {
        window._panelPool = window._panelPool.filter(p => p.localId !== info.localId);
      }
    } else if (info.source === 'grid') {
      const el = panel.elements[info.index];
      if (!el) { window._panelDragInfo = null; return; }
      if (!this._cellsFree(panel.elements, col, row, el.w || 1, el.h || 1, info.index)) { App.setStatus('panel: cell occupied'); window._panelDragInfo = null; return; }
      el.col = col; el.row = row;
    }
    window._panelDragInfo = null;
    this._renderPool();
    this._renderGrid();
    this._renderInspector();
  },

  onPoolDragOver(e) { e.preventDefault(); },

  onPoolDrop(e) {
    e.preventDefault();
    const info = window._panelDragInfo;
    if (!info || info.source !== 'grid') return; // a pool chip dropped back on the pool is a no-op
    window._panelDragInfo = null;
    this.unplace(info.index);
  },

  unplace(i) {
    const panel = window._tempPanel;
    const el = panel.elements[i];
    if (!el) return;
    panel.elements.splice(i, 1);
    this._returnToPool(el);
    window._panelSelectedIdx = null;
    this._renderPool();
    this._renderGrid();
    this._renderInspector();
  },

  _cellsFree(elements, col, row, w, h, excludeIdx) {
    for (let i = 0; i < elements.length; i++) {
      if (i === excludeIdx) continue;
      const e = elements[i];
      const ew = e.w || 1, eh = e.h || 1;
      const overlap = col < e.col + ew && col + w > e.col && row < e.row + eh && row + h > e.row;
      if (overlap) return false;
    }
    return true;
  },

  // ── inspector (selected element's text / size / remove) ────────────────

  _renderInspector() {
    const bar = document.getElementById('panel-editor-inspector');
    if (!bar) return;
    const i = window._panelSelectedIdx;
    const panel = window._tempPanel;
    const el = (i != null && panel) ? panel.elements[i] : null;
    if (!el) { bar.style.display = 'none'; return; }
    bar.style.display = 'flex';
    const badge = document.getElementById('panel-editor-inspector-badge');
    badge.textContent = el.type;
    badge.className = 'panel-editor-chip-badge panel-editor-chip-badge-' + el.type;
    document.getElementById('panel-editor-inspector-name').textContent = el.ref || this._specialLabel(el.type);
    const textInput = document.getElementById('panel-editor-inspector-text');
    if (el.type === 'label' || el.type === 'button') {
      textInput.style.display = 'block';
      textInput.value = el.text || '';
    } else {
      textInput.style.display = 'none';
    }
    document.getElementById('panel-editor-inspector-w').value = el.w || 1;
    document.getElementById('panel-editor-inspector-h').value = el.h || 1;
  },

  setSelectedText(val) {
    const i = window._panelSelectedIdx;
    const el = window._tempPanel.elements[i];
    if (!el) return;
    el.text = val;
    this._renderGrid();
  },

  setSelectedSize(dim, val) {
    const i = window._panelSelectedIdx;
    const panel = window._tempPanel;
    const el = panel.elements[i];
    if (!el) return;
    const v = Math.max(1, parseInt(val) || 1);
    const w = dim === 'w' ? v : (el.w || 1);
    const h = dim === 'h' ? v : (el.h || 1);
    if (el.col + w > panel.cols || el.row + h > panel.rows) { App.setStatus('panel: too big for grid'); this._renderInspector(); return; }
    if (!this._cellsFree(panel.elements, el.col, el.row, w, h, i)) { App.setStatus('panel: overlaps another element'); this._renderInspector(); return; }
    el.w = w; el.h = h;
    this._renderGrid();
  },

  unplaceSelected() {
    const i = window._panelSelectedIdx;
    if (i == null) return;
    this.unplace(i);
  },

  // ── save-time cleanup ────────────────────────────────────────────────────

  // Drops any placed element whose ref no longer matches a current port/
  // param (e.g. renamed or removed after it was placed on the panel), and
  // treats a panel with nothing placed on it as "no panel" so a module
  // never renders as a blank box in panel view.
  sanitize(panel, inputs, outputs, paramDefs) {
    if (!panel) return null;
    const inputNames = new Set((inputs || []).map(p => p.name));
    const outputNames = new Set((outputs || []).map(p => p.name));
    // Keyed by type+name, not just name — a knob and an enum can share a
    // name, so matching by name alone could keep an element referencing a
    // paramDef of the wrong type that just happens to share its name.
    const paramKeys = new Set((paramDefs || []).filter(d => d.type !== 'divider').map(d => d.type + ' ' + d.name));
    const elements = panel.elements.filter(e => {
      if (['label', 'divider', 'divider-h', 'divider-v', 'button'].includes(e.type)) return true;
      if (e.type === 'input')  return inputNames.has(e.ref);
      if (e.type === 'output') return outputNames.has(e.ref);
      return paramKeys.has(e.type + ' ' + e.ref);
    });
    if (!elements.length) return null;
    return { cols: panel.cols, rows: panel.rows, elements };
  },

  _uid() {
    return 'p' + Math.random().toString(36).slice(2, 9);
  },

  _specialLabel(type) {
    if (type === 'divider-v') return 'v-divider';
    if (type === 'divider' || type === 'divider-h') return 'h-divider';
    return type;
  },

  _attrEsc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  },
};
