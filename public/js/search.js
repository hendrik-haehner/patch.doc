// ── Global Module Search ───────────────────────────────────────────────────
// Spotlight-style modal: Cmd/Ctrl+F opens it, typing filters all modules
// and shows which patches use them. Clicking a result switches to that patch.

const GlobalSearch = (() => {

  function open() {
    const modal = document.getElementById('global-search-modal');
    const input = document.getElementById('global-search-input');
    if (!modal) return;
    modal.classList.add('open');
    input.value = '';
    _renderResults('');
    requestAnimationFrame(() => input.focus());
  }

  function close() {
    const modal = document.getElementById('global-search-modal');
    if (modal) modal.classList.remove('open');
  }

  function search(q) {
    _renderResults(q.toLowerCase().trim());
  }

  function _renderResults(q) {
    const el = document.getElementById('global-search-results');
    if (!el) return;

    const modules  = Store.state.modules;
    const patches  = Store.state.patches;

    // Build index: moduleId → [{ patch, pmId }]
    const usage = {};
    patches.forEach(patch => {
      patch.patchModules.forEach(pm => {
        if (!usage[pm.moduleId]) usage[pm.moduleId] = [];
        usage[pm.moduleId].push({ patch, pmId: pm.id });
      });
    });

    // Filter modules by query
    const filtered = !q
      ? modules.slice().sort((a, b) => a.name.localeCompare(b.name))
      : modules.filter(m =>
          m.name.toLowerCase().includes(q) ||
          m.maker.toLowerCase().includes(q) ||
          (m.cat || '').toLowerCase().includes(q)
        ).sort((a, b) => {
          // Exact name match first, then starts-with, then contains
          const an = a.name.toLowerCase(), bn = b.name.toLowerCase();
          if (an === q) return -1; if (bn === q) return 1;
          if (an.startsWith(q) && !bn.startsWith(q)) return -1;
          if (bn.startsWith(q) && !an.startsWith(q)) return 1;
          return an.localeCompare(bn);
        });

    if (!filtered.length) {
      el.innerHTML = '<div class="gs-empty">Kein Modul gefunden</div>';
      return;
    }

    el.innerHTML = filtered.map(m => {
      const color   = CAT_COLORS[m.cat] || '#888';
      const patches = usage[m.id] || [];
      const patchHTML = patches.length
        ? patches.map(({ patch }) => `
            <span class="gs-patch-tag" onclick="GlobalSearch._goTo('${patch.id}');event.stopPropagation()">
              ${patch.isTemplate ? '⭐ ' : ''}${_esc(patch.title)}
            </span>`).join('')
        : '<span class="gs-unused">nicht verwendet</span>';

      return `
        <div class="gs-row" onclick="GlobalSearch._focusModule(${m.id})">
          <span class="gs-dot" style="background:${color}"></span>
          <div class="gs-info">
            <span class="gs-name">${_highlight(m.name, q)}</span>
            <span class="gs-maker">${_esc(m.maker)}</span>
            ${m.hp ? `<span class="gs-hp">${m.hp}hp</span>` : ''}
          </div>
          <div class="gs-patches">${patchHTML}</div>
        </div>`;
    }).join('');
  }

  function _goTo(patchId) {
    App.switchPatch(patchId);
    close();
  }

  function _focusModule(moduleId) {
    // Switch to the module library and highlight the module
    App.switchTab('patch');
    close();
    // Scroll to module in sidebar if visible
    const el = document.querySelector(`[data-module-id="${moduleId}"]`);
    if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); el.classList.add('flash'); setTimeout(() => el.classList.remove('flash'), 1200); }
  }

  function _highlight(text, q) {
    if (!q) return _esc(text);
    const idx = text.toLowerCase().indexOf(q);
    if (idx === -1) return _esc(text);
    return _esc(text.slice(0, idx)) +
      '<mark class="gs-mark">' + _esc(text.slice(idx, idx + q.length)) + '</mark>' +
      _esc(text.slice(idx + q.length));
  }

  function _esc(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function init() {
    // Cmd+F / Ctrl+F → open search
    document.addEventListener('keydown', e => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault();
        open();
      }
      if (e.key === 'Escape') close();
    });
  }

  return { open, close, search, _goTo, _focusModule, init };
})();

window.addEventListener('DOMContentLoaded', () => GlobalSearch.init());
