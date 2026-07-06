// ── Undo / Redo ────────────────────────────────────────────────────────────
// Snapshots the full state (patches + modules) before every mutating operation.
// Max 50 steps to keep memory reasonable.

const Undo = (() => {
  const MAX   = 50;
  let history = [];
  let cursor  = -1;
  let _paused = false;

  function snapshot() {
    if (_paused) return;
    const snap = JSON.stringify({
      patches:       Store.state.patches,
      activePatchId: Store.state.activePatchId,
      modules:       Store.state.modules,
      nextModuleId:  Store.state.nextModuleId,
      nextPatchNum:  Store.state.nextPatchNum,
    });
    // Drop redo history on new action
    history = history.slice(0, cursor + 1);
    history.push(snap);
    if (history.length > MAX) history.shift();
    cursor = history.length - 1;
    _updateButtons();
  }

  function undo() {
    if (cursor <= 0) { App.setStatus('nothing to undo'); return; }
    cursor--;
    _restore(history[cursor]);
    App.setStatus('undo');
  }

  function redo() {
    if (cursor >= history.length - 1) { App.setStatus('nothing to redo'); return; }
    cursor++;
    _restore(history[cursor]);
    App.setStatus('redo');
  }

  function _restore(snap) {
    _paused = true;
    const s = JSON.parse(snap);
    Store.state.patches       = s.patches;
    Store.state.activePatchId = s.activePatchId;
    Store.state.modules       = s.modules;
    Store.state.nextModuleId  = s.nextModuleId;
    Store.state.nextPatchNum  = s.nextPatchNum;
    Store.save();
    App.fullRender();
    _paused = false;
    _updateButtons();
  }

  function _updateButtons() {
    const canUndo = cursor > 0;
    const canRedo = cursor < history.length - 1;
    // Main toolbar buttons
    const u = document.getElementById('undo-btn');
    const r = document.getElementById('redo-btn');
    if (u) u.style.opacity = canUndo ? '1' : '0.35';
    if (r) r.style.opacity = canRedo ? '1' : '0.35';
    // Connections tab touch buttons
    const cu = document.getElementById('conn-undo-btn');
    const cr = document.getElementById('conn-redo-btn');
    if (cu) cu.style.opacity = canUndo ? '1' : '0.35';
    if (cr) cr.style.opacity = canRedo ? '1' : '0.35';
  }

  // Take initial snapshot after first render
  function init() {
    snapshot();
    _updateButtons();
  }

  return { snapshot, undo, redo, init };
})();
