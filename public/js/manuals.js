const Manuals = {

  _cache: {}, // moduleId -> [{id, name, type, size, url}]

  // Prefetch manual lists for a specific set of modules (e.g. the modules
  // currently in the open patch) without fetching the entire library.
  // Used by the canvas to decide whether to show a manual-link icon on
  // each module's header. Skips modules already in the cache.
  async prefetchFor(moduleIds) {
    if (window.PATCHDOC_STATIC) return; // no server, nothing to fetch
    const missing = moduleIds.filter(id => !(id in this._cache));
    if (!missing.length) return;
    await Promise.all(missing.map(async id => {
      try {
        const res = await fetch(`/api/manuals/${id}`);
        this._cache[id] = await res.json();
      } catch(e) {
        this._cache[id] = [];
      }
    }));
  },

  async render() {
    const el = document.getElementById('manuals-content');
    if (!el) return;

    if (window.PATCHDOC_STATIC) {
      el.innerHTML = `<div style="padding:24px 0;text-align:center">
        <div style="font-size:32px;margin-bottom:12px;opacity:0.4">📄</div>
        <div style="font-size:13px;color:var(--text1);margin-bottom:8px">
          Manual upload is not available in the browser version.
        </div>
        <div style="font-size:12px;color:var(--text2);line-height:1.6">
          For PDF manuals, use the self-hosted Docker version.<br>
          <a href="https://github.com/hendrik-haehner/patch.doc/blob/main/INSTALL.md"
             target="_blank" rel="noopener"
             style="color:var(--accent);text-decoration:none">
            View installation guide →
          </a>
        </div>
      </div>`;
      return;
    }

    el.innerHTML = '<div style="font-size:11px;color:var(--text2)">loading…</div>';

    const modules = [...Store.state.modules].sort((a, b) => a.name.localeCompare(b.name));

    // Fetch manual lists for all modules in parallel
    await Promise.all(modules.map(async m => {
      try {
        const res = await fetch(`/api/manuals/${m.id}`);
        this._cache[m.id] = await res.json();
      } catch(e) {
        this._cache[m.id] = [];
      }
    }));

    const q = (document.getElementById('manuals-search')?.value || '').toLowerCase();
    const filtered = modules.filter(m =>
      !q || m.name.toLowerCase().includes(q) || m.maker.toLowerCase().includes(q)
    );

    el.innerHTML = `
      <input id="manuals-search" type="text" placeholder="search modules…"
        value="${q}"
        oninput="Manuals._onSearchInput()"
        style="width:100%;font-size:12px;padding:7px 10px;margin-bottom:12px;
               border:0.5px solid var(--border2);border-radius:var(--radius);
               background:var(--bg0);color:var(--text0);font-family:var(--font);outline:none">
      <div class="manuals-list">
        ${filtered.map(m => this._moduleRow(m)).join('') || '<p class="empty-hint">no modules found</p>'}
      </div>`;
  },

  // Debounced re-render on search input — re-rendering the whole list on
  // every keystroke would otherwise refetch manual lists unnecessarily.
  _onSearchInput() {
    clearTimeout(this._searchDebounce);
    this._searchDebounce = setTimeout(() => this._filterOnly(), 150);
  },

  // Re-applies the search filter without refetching manual data from the
  // server — keeps typing responsive and the input focused.
  _filterOnly() {
    const search = document.getElementById('manuals-search');
    const list = document.getElementById('manuals-content')?.querySelector('.manuals-list');
    if (!search || !list) return;
    const q = search.value.toLowerCase();
    const modules = [...Store.state.modules].sort((a, b) => a.name.localeCompare(b.name));
    const filtered = modules.filter(m =>
      !q || m.name.toLowerCase().includes(q) || m.maker.toLowerCase().includes(q)
    );
    list.innerHTML = filtered.map(m => this._moduleRow(m)).join('') || '<p class="empty-hint">no modules found</p>';
  },

  _moduleRow(m) {
    const files = this._cache[m.id] || [];
    return `<div class="manual-module-row">
      <div class="manual-module-header">
        <span class="module-dot" style="background:${CAT_COLORS[m.cat] || '#888'}"></span>
        <span class="manual-module-name">${m.name}</span>
        <span class="manual-module-maker">${m.maker}</span>
        <label class="btn-action" style="cursor:pointer;margin-left:auto;flex-shrink:0">
          <i class="ti ti-file-plus" aria-hidden="true"></i> add PDF
          <input type="file" accept="application/pdf" style="display:none"
            onchange="Manuals.upload(event, ${m.id})">
        </label>
      </div>
      ${files.length ? `
        <div class="manual-file-list">
          ${files.map(f => this._fileRow(f, m.id)).join('')}
        </div>` : `<div class="manual-empty-hint">no manual uploaded yet</div>`}
      <div id="manual-viewer-${m.id}" class="manual-viewer" style="display:none"></div>
    </div>`;
  },

  _fileRow(f, moduleId) {
    const size = f.size > 1024*1024
      ? (f.size/1024/1024).toFixed(1) + ' MB'
      : (f.size/1024).toFixed(0) + ' KB';
    const viewerId = 'manual-viewer-' + moduleId + '-' + f.id;
    return `<div class="manual-file-row">
      <i class="ti ti-file-type-pdf" aria-hidden="true"></i>
      <a href="javascript:void(0)" class="manual-file-name" onclick="Manuals.toggleViewer(${moduleId},'${f.id}','${f.url}')">${f.name}</a>
      <span class="manual-file-size">${size}</span>
      <a href="${f.url}" target="_blank" rel="noopener" class="manual-open-external" title="open in new tab" aria-label="open in new tab">
        <i class="ti ti-external-link" aria-hidden="true"></i>
      </a>
      <button class="conn-del" onclick="Manuals.deleteFile(${moduleId},'${f.id}')" aria-label="delete manual">×</button>
    </div>`;
  },

  // Toggle an inline PDF preview directly under the module's manual list.
  // Clicking the same file again collapses it; clicking a different file
  // in the same module swaps the preview rather than stacking multiple.
  toggleViewer(moduleId, fileId, url) {
    const viewer = document.getElementById('manual-viewer-' + moduleId);
    if (!viewer) return;
    const isOpenForThis = viewer.dataset.fileId === fileId && viewer.style.display !== 'none';
    if (isOpenForThis) {
      viewer.style.display = 'none';
      viewer.innerHTML = '';
      viewer.dataset.fileId = '';
      return;
    }
    viewer.dataset.fileId = fileId;
    viewer.style.display = 'block';
    viewer.innerHTML = `
      <div class="manual-viewer-bar">
        <span>PDF preview</span>
        <button class="conn-del" onclick="Manuals.toggleViewer(${moduleId},'${fileId}','${url}')" aria-label="close preview">×</button>
      </div>
      <iframe src="${url}" class="manual-viewer-frame" title="PDF manual preview"></iframe>`;
  },

  upload(event, moduleId) {
    const file = event.target.files[0];
    if (!file) return;

    const form = new FormData();
    form.append('file', file);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `/api/manuals/${moduleId}`);

    xhr.onload = () => {
      if (xhr.status !== 200) {
        App.setStatus('manual upload failed: HTTP ' + xhr.status);
        return;
      }
      try {
        const uploaded = JSON.parse(xhr.responseText);
        fetch(`/api/manuals/${moduleId}/${uploaded.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: file.name, type: file.type })
        }).then(() => {
          App.setStatus('manual uploaded');
          this.render();
        });
      } catch(e) {
        App.setStatus('manual upload failed: ' + e.message);
      }
    };
    xhr.onerror = () => App.setStatus('manual upload failed: network error');
    xhr.send(form);
  },

  async deleteFile(moduleId, fileId) {
    if (!confirm('Delete this manual?')) return;
    await fetch(`/api/manuals/${moduleId}/${fileId}`, { method: 'DELETE' });
    this.render();
  },

  // Returns the manual count for a module — used to show a small badge
  // in the module library / patch canvas without a full fetch.
  countFor(moduleId) {
    return (this._cache[moduleId] || []).length;
  },

  // Compact manuals list+upload for the module editor modal — same data,
  // smaller layout than the full manuals tab.
  async renderInModal(moduleId) {
    const el = document.getElementById('modal-manuals-content');
    if (!el) return;
    el.innerHTML = '<span style="color:var(--text2)">loading…</span>';
    let files = [];
    try {
      const res = await fetch(`/api/manuals/${moduleId}`);
      files = await res.json();
    } catch(e) {
      el.innerHTML = '<span style="color:var(--danger)">could not load manuals</span>';
      return;
    }
    this._cache[moduleId] = files;
    el.innerHTML = `
      ${files.map(f => `
        <div class="manual-file-row" style="padding:4px 0">
          <i class="ti ti-file-type-pdf" aria-hidden="true"></i>
          <a href="${f.url}" target="_blank" rel="noopener" class="manual-file-name">${f.name}</a>
          <button class="conn-del" onclick="Manuals.deleteFromModal(${moduleId},'${f.id}')" aria-label="delete manual">×</button>
        </div>`).join('')}
      <label class="btn-action" style="cursor:pointer;margin-top:4px;display:inline-flex">
        <i class="ti ti-file-plus" aria-hidden="true"></i> ${files.length ? 'add another PDF' : 'upload PDF'}
        <input type="file" accept="application/pdf" style="display:none"
          onchange="Manuals.uploadFromModal(event, ${moduleId})">
      </label>`;
  },

  uploadFromModal(event, moduleId) {
    const file = event.target.files[0];
    if (!file) return;
    const form = new FormData();
    form.append('file', file);
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `/api/manuals/${moduleId}`);
    xhr.onload = () => {
      if (xhr.status !== 200) { App.setStatus('manual upload failed'); return; }
      try {
        const uploaded = JSON.parse(xhr.responseText);
        fetch(`/api/manuals/${moduleId}/${uploaded.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: file.name, type: file.type })
        }).then(() => this.renderInModal(moduleId));
      } catch(e) { App.setStatus('manual upload failed: ' + e.message); }
    };
    xhr.onerror = () => App.setStatus('manual upload failed: network error');
    xhr.send(form);
  },

  async deleteFromModal(moduleId, fileId) {
    if (!confirm('Delete this manual?')) return;
    await fetch(`/api/manuals/${moduleId}/${fileId}`, { method: 'DELETE' });
    this.renderInModal(moduleId);
  }
};
