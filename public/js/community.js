// Read-only browse/import of the shared community module library (see
// community-modules/README.md at the repo root). Fetched straight from
// GitHub's raw content CDN, so it needs no server of its own and works
// identically in the browser build, the Tauri desktop app, and
// self-hosted instances — this is plain fetch(), not gated by IO.isTauri()
// anywhere in this file.
const Community = {

  URL: 'https://raw.githubusercontent.com/hendrik-haehner/patch.doc/main/community-modules/index.json',

  _cache: null,   // full fetched list, null until the first successful fetch
  _visible: [],   // currently filtered/rendered list, index-aligned with the DOM

  async open() {
    document.getElementById('community-modal-bg').classList.add('open');
    const search = document.getElementById('community-search');
    if (search) search.value = '';
    if (this._cache) { this._render(); return; }
    await this._fetch();
  },

  close() {
    document.getElementById('community-modal-bg').classList.remove('open');
  },

  async _fetch() {
    const list = document.getElementById('community-list');
    list.innerHTML = '<div style="font-size:11px;color:var(--text2);padding:12px 2px">loading…</div>';
    try {
      const res = await fetch(this.URL, { cache: 'no-store', signal: AbortSignal.timeout(10000) });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      this._cache = Array.isArray(data) ? data : [];
      this._render();
    } catch (err) {
      console.error('PATCH.doc community fetch error:', err);
      list.innerHTML = `<div style="font-size:11px;color:var(--danger);padding:12px 2px">
        could not load community modules — check your internet connection.<br>
        <button class="io-add-btn" style="margin-top:8px" onclick="Community._fetch()">retry</button>
      </div>`;
    }
  },

  // Debounced re-filter on search input — the list is already fetched, so
  // this never refetches, just narrows what's shown.
  onSearchInput() {
    clearTimeout(this._searchDebounce);
    this._searchDebounce = setTimeout(() => this._render(), 150);
  },

  _render() {
    const list = document.getElementById('community-list');
    if (!list || !this._cache) return;
    const q = (document.getElementById('community-search')?.value || '').toLowerCase();
    const filtered = this._cache.filter(m =>
      !q || (m.name || '').toLowerCase().includes(q) ||
             (m.maker || '').toLowerCase().includes(q) ||
             (m.cat || '').toLowerCase().includes(q)
    );
    this._visible = filtered;

    if (!filtered.length) {
      list.innerHTML = this._cache.length
        ? '<div style="font-size:11px;color:var(--text2);padding:12px 2px">no matches</div>'
        : `<div style="font-size:11px;color:var(--text2);padding:12px 2px;line-height:1.6">
             no community modules yet — be the first to contribute!<br>
             <a href="https://github.com/hendrik-haehner/patch.doc/tree/main/community-modules"
                target="_blank" rel="noopener" style="color:var(--accent);text-decoration:none">
               see community-modules/README.md →
             </a>
           </div>`;
      return;
    }

    const norm = s => (s || '').trim().toLowerCase();
    list.innerHTML = filtered.map((m, i) => {
      const already = Store.state.modules.some(x =>
        norm(x.name) === norm(m.name) && norm(x.maker) === norm(m.maker)
      );
      return `<div class="module-item" style="cursor:default">
        <span class="module-dot" style="background:${CAT_COLORS[m.cat] || '#888'}"></span>
        <span class="module-name">${m.name}</span>
        <span class="module-hp">${m.hp || '?'}hp</span>
        ${already
          ? '<span style="font-size:10px;color:var(--text2);flex-shrink:0;margin-left:auto">in library</span>'
          : `<button class="io-add-btn" style="flex-shrink:0;margin-left:auto" onclick="Community.import(${i})">import</button>`}
      </div>`;
    }).join('');
  },

  import(i) {
    const src = this._visible[i];
    if (!src || !src.name) return;

    const inputs  = Array.isArray(src.inputs)  ? src.inputs.map(p  => ({ name: Patch._portName(p) })) : [];
    const outputs = Array.isArray(src.outputs) ? src.outputs.map(p => ({ name: Patch._portName(p) })) : [];
    const paramDefs = Array.isArray(src.paramDefs) ? JSON.parse(JSON.stringify(src.paramDefs)) : [];

    const mod = {
      maker: src.maker || 'Unknown',
      name: src.name,
      hp: parseInt(src.hp) || 8,
      cat: src.cat || 'other',
      inputs, outputs, paramDefs,
      color: src.color || null,
      paramCols: parseInt(src.paramCols) || 3,
      power12p: parseFloat(src.power12p) || 0,
      power12n: parseFloat(src.power12n) || 0,
      power5: parseFloat(src.power5) || 0,
      panel: (src.panel && Array.isArray(src.panel.elements))
        ? (PanelEditor.sanitize(JSON.parse(JSON.stringify(src.panel)), inputs, outputs, paramDefs) || undefined)
        : undefined,
    };

    Store.addModule(mod);
    Undo.snapshot();
    App.renderModuleLibrary();
    App.setStatus(mod.name + ' imported from community');
    this._render();
  },
};
