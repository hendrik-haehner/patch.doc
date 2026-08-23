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
    window._panelSelectedIndices = new Set();
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

  async removePanel() {
    if (!(await IO.confirmAsync('Remove panel layout for this module?'))) return;
    window._tempPanel = null;
    window._panelPool = [];
    this._close();
    App.updatePanelSummary();
  },

  _close() {
    document.getElementById('panel-editor-modal-bg').classList.remove('open');
    window._panelSelectedIndices = new Set();
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
    window._panelSelectedIndices = new Set();
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
      if (!placedParam.has(d.type + ' ' + d.name)) {
        const note = d.type === 'knob' && d.display === 'clock' ? 'clock'
                   : (d.type === 'knob' || d.type === 'fader') && d.display === 'freq' ? 'Hz'
                   : '';
        chips.push(this._chip({ kind: 'param', type: d.type, ref: d.name, label: d.name, badge: d.type, note }));
      }
    });
    (window._panelPool || []).forEach(p => {
      chips.push(this._chip({ kind: 'special', type: p.type, localId: p.localId, label: p.text || this._specialLabel(p.type), badge: p.type }));
    });

    el.innerHTML = chips.join('') || '<div class="panel-editor-pool-empty">everything placed</div>';
  },

  _chip({ kind, type, ref, localId, label, badge, note }) {
    return `<div class="panel-editor-chip" draggable="true"
      data-kind="${kind}" data-type="${type}"
      data-ref="${ref != null ? this._attrEsc(ref) : ''}" data-local-id="${localId || ''}"
      ondragstart="PanelEditor.poolDragStart(event)"
      ondragend="PanelEditor.dragEnd(event)">
      <span class="panel-editor-chip-badge panel-editor-chip-badge-${type}">${badge}</span>
      <span class="panel-editor-chip-label">${this._attrEsc(label)}</span>
      ${note ? `<span class="panel-editor-chip-note">${this._attrEsc(note)}</span>` : ''}
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
    const selected = (window._panelSelectedIndices && window._panelSelectedIndices.has(i)) ? ' selected' : '';
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
    window._panelSelectedIndices = window._panelSelectedIndices || new Set();
    const sel = window._panelSelectedIndices;
    if (e && (e.shiftKey || e.ctrlKey || e.metaKey)) {
      if (sel.has(i)) sel.delete(i); else sel.add(i);
    } else {
      sel.clear();
      sel.add(i);
    }
    this._renderGrid();
    this._renderInspector();
  },

  deselectAll() {
    window._panelSelectedIndices = new Set();
    this._renderGrid();
    this._renderInspector();
  },

  gridDragStart(i, e) {
    const sel = window._panelSelectedIndices || new Set();
    // Dragging a chip that's part of a multi-selection moves the whole
    // group together; dragging any other chip is a plain single-item move
    // (and doesn't disturb the current selection).
    if (sel.has(i) && sel.size > 1) {
      window._panelDragInfo = { source: 'grid-multi', indices: [...sel], anchorIndex: i };
    } else {
      window._panelDragInfo = { source: 'grid', index: i };
    }
    e.dataTransfer.effectAllowed = 'move';
    // Anchor the drag ghost's top-left corner to the cursor, matching how
    // _cellFromEvent() reads the drop cell — otherwise the ghost trails
    // wherever inside the chip you happened to grab it, and the cell that
    // lights up doesn't match what looks like it's under the ghost.
    e.dataTransfer.setDragImage(e.currentTarget, 0, 0);
    // currentTarget is only valid for the duration of this handler — grab
    // it now, not inside the timeout (it'd be null by the next tick).
    const el = e.currentTarget;
    setTimeout(() => {
      el.classList.add('dragging');
      document.querySelectorAll('.panel-editor-placed.selected').forEach(chip => chip.classList.add('dragging'));
    }, 0);
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
    document.querySelectorAll('.panel-editor-placed.dragging').forEach(chip => chip.classList.remove('dragging'));
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

    if (info && info.source === 'grid-multi') {
      const targets = this._groupTargets(info, col, row);
      if (!targets) return;
      const valid = this._groupMoveValid(info, col, row);
      targets.forEach(t => {
        if (!t) return;
        for (let rr = 0; rr < t.h; rr++) {
          for (let cc = 0; cc < t.w; cc++) {
            const cell = document.querySelector(`.panel-editor-empty-cell[data-col="${t.nc + cc}"][data-row="${t.nr + rr}"]`);
            if (cell) cell.classList.add(valid ? 'drag-over' : 'drag-over-invalid');
          }
        }
      });
      return;
    }

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

  // Position each grouped element would land at if the dragged (anchor)
  // element's top-left corner were dropped on (col,row) — offsets are
  // taken relative to the anchor so the group keeps its shape.
  _groupTargets(info, col, row) {
    const panel = window._tempPanel;
    const anchorEl = panel.elements[info.anchorIndex];
    if (!anchorEl) return null;
    const dCol = col - anchorEl.col, dRow = row - anchorEl.row;
    return info.indices.map(idx => {
      const el = panel.elements[idx];
      if (!el) return null;
      return { idx, nc: el.col + dCol, nr: el.row + dRow, w: el.w || 1, h: el.h || 1 };
    });
  },

  _groupMoveValid(info, col, row) {
    const panel = window._tempPanel;
    const targets = this._groupTargets(info, col, row);
    if (!targets || targets.some(t => !t)) return false;
    const excludeSet = new Set(info.indices);
    return targets.every(t =>
      t.nc >= 0 && t.nr >= 0 && t.nc + t.w <= panel.cols && t.nr + t.h <= panel.rows &&
      this._cellsFree(panel.elements, t.nc, t.nr, t.w, t.h, excludeSet)
    );
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
      // A fader defaults taller than wide (1x3) instead of the usual 1x1 —
      // real slide-pots have far more travel than a knob's diameter, and a
      // 1x1 fader would render as a barely-usable nub (see _renderControl's
      // 70px floor). Still just a normal element afterward — the existing
      // inspector resize/move UI works on it unmodified.
      const defaultH = info.type === 'fader' ? 3 : 1;
      if (row + defaultH > panel.rows) { App.setStatus('panel: not enough rows here for a fader (needs ' + defaultH + ')'); window._panelDragInfo = null; return; }
      if (!this._cellsFree(panel.elements, col, row, 1, defaultH, -1)) { App.setStatus('panel: cell occupied'); window._panelDragInfo = null; return; }
      const newEl = { type: info.type, ref: info.ref, col, row, w: 1, h: defaultH };
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
    } else if (info.source === 'grid-multi') {
      if (!this._groupMoveValid(info, col, row)) { App.setStatus('panel: overlaps another element'); window._panelDragInfo = null; return; }
      const targets = this._groupTargets(info, col, row);
      targets.forEach(t => {
        const el = panel.elements[t.idx];
        el.col = t.nc; el.row = t.nr;
      });
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
    if (!info) return;
    window._panelDragInfo = null;
    // a pool chip dropped back on the pool is a no-op
    if (info.source === 'grid') this.unplace(info.index);
    else if (info.source === 'grid-multi') this.unplaceMany(info.indices);
  },

  unplace(i) {
    const panel = window._tempPanel;
    const el = panel.elements[i];
    if (!el) return;
    panel.elements.splice(i, 1);
    this._returnToPool(el);
    window._panelSelectedIndices = new Set();
    this._renderPool();
    this._renderGrid();
    this._renderInspector();
  },

  unplaceMany(indices) {
    const panel = window._tempPanel;
    // Descending order so removing one element doesn't shift the indices
    // of the others still queued for removal.
    const sorted = [...new Set(indices)].sort((a, b) => b - a);
    sorted.forEach(i => {
      const el = panel.elements[i];
      if (!el) return;
      panel.elements.splice(i, 1);
      this._returnToPool(el);
    });
    window._panelSelectedIndices = new Set();
    this._renderPool();
    this._renderGrid();
    this._renderInspector();
  },

  // excludeIdx may be a single index or a Set of indices to ignore (e.g.
  // the elements of a group that's being moved together).
  _cellsFree(elements, col, row, w, h, excludeIdx) {
    const excludeSet = excludeIdx instanceof Set ? excludeIdx : null;
    for (let i = 0; i < elements.length; i++) {
      if (excludeSet ? excludeSet.has(i) : i === excludeIdx) continue;
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
    const sel = window._panelSelectedIndices || new Set();
    const panel = window._tempPanel;
    const empty = document.getElementById('panel-editor-inspector-empty');
    const count = document.getElementById('panel-editor-inspector-count');
    const badge = document.getElementById('panel-editor-inspector-badge');
    const name = document.getElementById('panel-editor-inspector-name');
    const wLabel = document.getElementById('panel-editor-inspector-w-label');
    const hLabel = document.getElementById('panel-editor-inspector-h-label');
    const removeBtn = document.getElementById('panel-editor-inspector-remove-btn');
    const textInput = document.getElementById('panel-editor-inspector-text');
    const hideAll = () => {
      empty.style.display = 'none';
      count.style.display = 'none';
      badge.style.display = 'none';
      name.style.display = 'none';
      wLabel.style.display = 'none';
      hLabel.style.display = 'none';
      removeBtn.style.display = 'none';
      textInput.style.display = 'none';
    };

    if (sel.size === 0 || !panel) { hideAll(); empty.style.display = 'inline'; return; }

    if (sel.size > 1) {
      hideAll();
      count.style.display = 'inline';
      count.textContent = sel.size + ' selected';
      removeBtn.style.display = 'inline-block';
      return;
    }

    const i = sel.values().next().value;
    const el = panel.elements[i];
    if (!el) { hideAll(); empty.style.display = 'inline'; return; }
    hideAll();
    badge.style.display = 'inline';
    name.style.display = 'inline';
    wLabel.style.display = 'inline';
    hLabel.style.display = 'inline';
    removeBtn.style.display = 'inline-block';
    badge.textContent = el.type;
    badge.className = 'panel-editor-chip-badge panel-editor-chip-badge-' + el.type;
    name.textContent = el.ref || this._specialLabel(el.type);
    if (el.type === 'label' || el.type === 'button') {
      textInput.style.display = 'block';
      textInput.value = el.text || '';
    }
    document.getElementById('panel-editor-inspector-w').value = el.w || 1;
    document.getElementById('panel-editor-inspector-h').value = el.h || 1;
  },

  setSelectedText(val) {
    const sel = window._panelSelectedIndices;
    if (!sel || sel.size !== 1) return;
    const el = window._tempPanel.elements[sel.values().next().value];
    if (!el) return;
    el.text = val;
    this._renderGrid();
  },

  setSelectedSize(dim, val) {
    const sel = window._panelSelectedIndices;
    if (!sel || sel.size !== 1) return;
    const i = sel.values().next().value;
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
    const sel = window._panelSelectedIndices;
    if (!sel || sel.size === 0) return;
    if (sel.size === 1) this.unplace(sel.values().next().value);
    else this.unplaceMany([...sel]);
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
