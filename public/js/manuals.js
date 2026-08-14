const Manuals = {

  _cache: {}, // moduleId -> [{id, name, type, size, url}]

  // Prefetch manual lists for a specific set of modules (e.g. the modules
  // currently in the open patch) without fetching the entire library.
  // Used by the canvas to decide whether to show a manual-link icon on
  // each module's header. Skips modules already in the cache.
  async prefetchFor(moduleIds) {
    if (window.PATCHDOC_STATIC && !IO.isTauri()) return; // no server, nothing to fetch
    const missing = moduleIds.filter(id => !(id in this._cache));
    if (!missing.length) return;
    if (IO.isTauri()) {
      await Promise.all(missing.map(async id => {
        const m = Store.state.modules.find(x => x.id === id);
        this._cache[id] = m ? await this._tauriEntriesFor(m) : [];
      }));
      return;
    }
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

    // The server variant needs /api/manuals/*; the plain GitHub Pages
    // build has no server. The Tauri desktop build is ALSO PATCHDOC_STATIC
    // (no server), but has real filesystem access via window.__TAURI__,
    // so it gets the real feature instead of this notice.
    if (window.PATCHDOC_STATIC && !IO.isTauri()) {
      el.innerHTML = `<div style="padding:24px 0;text-align:center">
        <div style="font-size:32px;margin-bottom:12px;opacity:0.4">📄</div>
        <div style="font-size:13px;color:var(--text1);margin-bottom:8px">
          Manual upload/links are not available in the browser version.
        </div>
        <div style="font-size:12px;color:var(--text2);line-height:1.6">
          For PDF manuals or manual links, use the self-hosted Docker version.<br>
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
    if (IO.isTauri()) {
      await Promise.all(modules.map(async m => { this._cache[m.id] = await this._tauriEntriesFor(m); }));
    } else {
      await Promise.all(modules.map(async m => {
        try {
          const res = await fetch(`/api/manuals/${m.id}`);
          this._cache[m.id] = await res.json();
        } catch(e) {
          this._cache[m.id] = [];
        }
      }));
    }

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
    const entries = this._cache[m.id] || [];
    const tauriAttr = IO.isTauri() ? ` onclick="event.preventDefault();Manuals.uploadTauri(${m.id})"` : '';
    return `<div class="manual-module-row">
      <div class="manual-module-header">
        <span class="module-dot" style="background:${CAT_COLORS[m.cat] || '#888'}"></span>
        <span class="manual-module-name">${m.name}</span>
        <span class="manual-module-maker">${m.maker}</span>
        <label class="btn-action" style="cursor:pointer;margin-left:auto;flex-shrink:0"${tauriAttr}>
          <i class="ti ti-file-plus" aria-hidden="true"></i> add PDF
          <input type="file" accept="application/pdf" style="display:none"
            onchange="Manuals.upload(event, ${m.id})">
        </label>
      </div>
      ${entries.length ? `
        <div class="manual-file-list">
          ${entries.map(f => this._fileRow(f, m.id)).join('')}
        </div>` : `<div class="manual-empty-hint">no manual uploaded yet</div>`}
      <div class="manual-link-add-row">
        <input type="text" class="manual-link-name-input" id="manual-link-name-${m.id}" placeholder="name (optional)">
        <input type="text" class="manual-link-url-input" id="manual-link-url-${m.id}" placeholder="https://… (manual web page)"
          onkeydown="if(event.key==='Enter')Manuals.addLink(${m.id})">
        <button class="io-add-btn" onclick="Manuals.addLink(${m.id})" title="add manual link" aria-label="add manual link">+ link</button>
      </div>
      <div id="manual-viewer-${m.id}" class="manual-viewer" style="display:none"></div>
    </div>`;
  },

  _fileRow(f, moduleId) {
    if (f.kind === 'link') {
      return `<div class="manual-file-row">
        <i class="ti ti-link" aria-hidden="true"></i>
        <a href="${f.url}" target="_blank" rel="noopener" class="manual-file-name">${f.name}</a>
        <span class="manual-file-size">link</span>
        <button class="conn-del" onclick="Manuals.deleteFile(${moduleId},'${f.id}')" aria-label="delete manual link">×</button>
      </div>`;
    }
    const size = f.size > 1024*1024
      ? (f.size/1024/1024).toFixed(1) + ' MB'
      : (f.size/1024).toFixed(0) + ' KB';
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

  // ── Tauri desktop build: real files on disk, metadata in module.manuals ──
  // (an id-keyed dict — file entries hold {kind:'file',name,type,size},
  // link entries hold {kind:'link',name,url} with no on-disk file at all.)
  // Mirrors how media.js does it for patch.media, just keyed by module
  // instead of patch since a module's manual is shared across all patches.

  async _tauriEntriesFor(m) {
    const manuals = m?.manuals || {};
    const ids = Object.keys(manuals);
    if (!ids.length) return [];
    const dir = await this._manualsDirFor(m.id);
    return ids.map(id => {
      const e = manuals[id];
      if (e.kind === 'link') return { kind: 'link', id, name: e.name, url: e.url };
      return {
        kind: 'file', id, name: e.name, type: e.type || 'application/pdf', size: e.size,
        url: window.__TAURI__.core.convertFileSrc(`${dir}/${id}`),
      };
    });
  },

  async _manualsDirFor(moduleId) {
    return await window.__TAURI__.core.invoke('local_data_dir', { category: 'manuals', id: moduleId });
  },

  _uid() {
    return (window.crypto?.randomUUID ? crypto.randomUUID() : Date.now() + '-' + Math.random().toString(36).slice(2));
  },

  _saveModuleManuals(moduleId, manuals) {
    const m = Store.state.modules.find(x => x.id === moduleId);
    if (!m) return;
    m.manuals = manuals;
    Store._saveModules();
    Store.saveNow();
  },

  async _addTauriLink(moduleId, name, url) {
    const m = Store.state.modules.find(x => x.id === moduleId);
    if (!m) return;
    const manuals = { ...(m.manuals || {}) };
    const id = 'link_' + this._uid();
    manuals[id] = { kind: 'link', name: (name || url), url };
    this._saveModuleManuals(moduleId, manuals);
  },

  // Picks + reads a PDF through Tauri's dialog+fs plugins (a plain
  // <input type="file"> opens the native picker fine in this WKWebView
  // build, but its FileList stays empty after picking — see io.js) and
  // writes it into this module's manuals directory. Returns whether a
  // file was actually picked and saved, so callers know whether to
  // re-render.
  async _uploadTauriFile(moduleId) {
    const picked = await window.__TAURI__.dialog.open({
      multiple: false,
      filters: [{ name: 'PDF', extensions: ['pdf'] }],
    });
    if (!picked) return false; // user canceled
    const srcPath = Array.isArray(picked) ? picked[0] : picked;
    const name = srcPath.split(/[\\/]/).pop();
    const bytes = await window.__TAURI__.fs.readFile(srcPath);
    const dir = await this._manualsDirFor(moduleId);
    const id = this._uid() + '.pdf';
    await window.__TAURI__.fs.writeFile(`${dir}/${id}`, bytes);
    const m = Store.state.modules.find(x => x.id === moduleId);
    const manuals = { ...(m?.manuals || {}), [id]: { kind: 'file', name, type: 'application/pdf', size: bytes.length } };
    this._saveModuleManuals(moduleId, manuals);
    return true;
  },

  async _deleteTauriFile(moduleId, fileId) {
    const m = Store.state.modules.find(x => x.id === moduleId);
    if (!m) return;
    const manuals = { ...(m.manuals || {}) };
    const entry = manuals[fileId];
    delete manuals[fileId];
    if (entry && entry.kind !== 'link') {
      try {
        const dir = await this._manualsDirFor(moduleId);
        await window.__TAURI__.fs.remove(`${dir}/${fileId}`);
      } catch (err) {
        console.error('PATCH.doc manual delete error (Tauri):', err);
      }
    }
    this._saveModuleManuals(moduleId, manuals);
  },

  async uploadTauri(moduleId) {
    try {
      if (await this._uploadTauriFile(moduleId)) { App.setStatus('manual uploaded'); this.render(); }
    } catch (err) {
      console.error('PATCH.doc manual upload error (Tauri):', err);
      App.setStatus('manual upload failed: ' + (err.message || err));
    }
  },

  async addLink(moduleId) {
    const nameInput = document.getElementById('manual-link-name-' + moduleId);
    const urlInput  = document.getElementById('manual-link-url-' + moduleId);
    const url = urlInput.value.trim();
    if (!url) { urlInput.focus(); return; }
    if (IO.isTauri()) {
      if (!/^https?:\/\//i.test(url)) { App.setStatus('link failed: a valid http(s) URL is required'); return; }
      await this._addTauriLink(moduleId, nameInput.value.trim(), url);
      App.setStatus('manual link added');
      this.render();
      return;
    }
    try {
      const res = await fetch(`/api/manuals/${moduleId}/link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nameInput.value.trim(), url })
      });
      const data = await res.json();
      if (!res.ok) { App.setStatus('link failed: ' + (data.error || 'unknown error')); return; }
      App.setStatus('manual link added');
      this.render();
    } catch(e) { App.setStatus('link failed: ' + e.message); }
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
    if (!(await IO.confirmAsync('Delete this manual?'))) return;
    if (IO.isTauri()) { await this._deleteTauriFile(moduleId, fileId); this.render(); return; }
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
    let entries = [];
    if (IO.isTauri()) {
      const m = Store.state.modules.find(x => x.id === moduleId);
      entries = m ? await this._tauriEntriesFor(m) : [];
    } else {
      try {
        const res = await fetch(`/api/manuals/${moduleId}`);
        entries = await res.json();
      } catch(e) {
        el.innerHTML = '<span style="color:var(--danger)">could not load manuals</span>';
        return;
      }
    }
    this._cache[moduleId] = entries;
    const tauriAttr = IO.isTauri() ? ` onclick="event.preventDefault();Manuals.uploadTauriFromModal(${moduleId})"` : '';
    el.innerHTML = `
      ${entries.map(f => `
        <div class="manual-file-row" style="padding:4px 0">
          <i class="ti ${f.kind === 'link' ? 'ti-link' : 'ti-file-type-pdf'}" aria-hidden="true"></i>
          <a href="${f.url}" target="_blank" rel="noopener" class="manual-file-name">${f.name}</a>
          <button class="conn-del" onclick="Manuals.deleteFromModal(${moduleId},'${f.id}')" aria-label="delete manual">×</button>
        </div>`).join('')}
      <label class="btn-action" style="cursor:pointer;margin-top:4px;display:inline-flex"${tauriAttr}>
        <i class="ti ti-file-plus" aria-hidden="true"></i> ${entries.some(f => f.kind !== 'link') ? 'add another PDF' : 'upload PDF'}
        <input type="file" accept="application/pdf" style="display:none"
          onchange="Manuals.uploadFromModal(event, ${moduleId})">
      </label>
      <div class="manual-link-add-row" style="margin-top:6px">
        <input type="text" class="manual-link-name-input" id="modal-manual-link-name-${moduleId}" placeholder="name (optional)">
        <input type="text" class="manual-link-url-input" id="modal-manual-link-url-${moduleId}" placeholder="https://… (manual web page)"
          onkeydown="if(event.key==='Enter')Manuals.addLinkFromModal(${moduleId})">
        <button class="io-add-btn" onclick="Manuals.addLinkFromModal(${moduleId})" title="add manual link" aria-label="add manual link">+ link</button>
      </div>`;
  },

  async uploadTauriFromModal(moduleId) {
    try {
      if (await this._uploadTauriFile(moduleId)) this.renderInModal(moduleId);
    } catch (err) {
      console.error('PATCH.doc manual upload error (Tauri):', err);
      App.setStatus('manual upload failed: ' + (err.message || err));
    }
  },

  async addLinkFromModal(moduleId) {
    const nameInput = document.getElementById('modal-manual-link-name-' + moduleId);
    const urlInput  = document.getElementById('modal-manual-link-url-' + moduleId);
    const url = urlInput.value.trim();
    if (!url) { urlInput.focus(); return; }
    if (IO.isTauri()) {
      if (!/^https?:\/\//i.test(url)) { App.setStatus('link failed: a valid http(s) URL is required'); return; }
      await this._addTauriLink(moduleId, nameInput.value.trim(), url);
      this.renderInModal(moduleId);
      return;
    }
    try {
      const res = await fetch(`/api/manuals/${moduleId}/link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nameInput.value.trim(), url })
      });
      const data = await res.json();
      if (!res.ok) { App.setStatus('link failed: ' + (data.error || 'unknown error')); return; }
      this.renderInModal(moduleId);
    } catch(e) { App.setStatus('link failed: ' + e.message); }
  },

  async deleteFromModal(moduleId, fileId) {
    if (!(await IO.confirmAsync('Delete this manual?'))) return;
    if (IO.isTauri()) { await this._deleteTauriFile(moduleId, fileId); this.renderInModal(moduleId); return; }
    await fetch(`/api/manuals/${moduleId}/${fileId}`, { method: 'DELETE' });
    this.renderInModal(moduleId);
  }
};
