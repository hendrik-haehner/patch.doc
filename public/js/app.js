const App = {
  selectedModuleId: null,
  _patchSort:  'manual',   // manual | alpha | date
  _moduleSort: 'manual',   // manual | alpha | cat
  _dragSrcId: null,        // patch id being dragged

  cyclePatchSort() {
    const modes  = ['manual', 'alpha', 'date'];
    const labels = { manual: 'A↓', alpha: 'A↓', date: '📅' };
    const icons  = { manual: 'A↓', alpha: 'Z↑', date: 'A↓' };
    // cycle: manual→alpha→date→manual
    const next = { manual: 'alpha', alpha: 'date', date: 'manual' };
    this._patchSort = next[this._patchSort];
    const btn = document.getElementById('patch-sort-btn');
    if (btn) {
      const display = { manual: 'A↓', alpha: 'Z↑', date: '⏱' };
      btn.textContent = display[this._patchSort];
      btn.classList.toggle('active', this._patchSort !== 'manual');
    }
    this.renderPatchList();
  },

  cycleModuleSort() {
    const next = { manual: 'alpha', alpha: 'cat', cat: 'manual' };
    this._moduleSort = next[this._moduleSort];
    const btn = document.getElementById('module-sort-btn');
    if (btn) {
      const display = { manual: 'A↓', alpha: 'Z↑', cat: '⬡↓' };
      btn.textContent = display[this._moduleSort];
      btn.classList.toggle('active', this._moduleSort !== 'manual');
    }
    this.renderModuleLibrary();
  },

  _sortedPatches() {
    const patches = [...Store.state.patches];
    if (this._patchSort === 'alpha') return patches.sort((a,b) => a.title.localeCompare(b.title));
    if (this._patchSort === 'date')  return patches.sort((a,b) => new Date(b.updatedAt||0) - new Date(a.updatedAt||0));
    return patches; // manual = original order
  },

  _sortedModules() {
    const modules = [...Store.state.modules];
    if (this._moduleSort === 'alpha') return modules.sort((a,b) => a.name.localeCompare(b.name));
    if (this._moduleSort === 'cat')   return modules.sort((a,b) => a.cat.localeCompare(b.cat) || a.name.localeCompare(b.name));
    return modules; // manual = original order
  },

  async init() {
    // Show loading indicator
    document.body.style.opacity = '0.4';
    try {
      await Store.loadFromServer();
    } catch(e) {
      console.warn('Server load failed, using defaults:', e);
      Store.load();
    }
    this._cleanupAccidentalBlackColors();
    document.body.style.opacity = '1';
    // Show username in topbar (desktop + touch menu)
    const unEl = document.getElementById('topbar-username');
    if (unEl && Store.username) unEl.textContent = Store.username;
    const unElD = document.getElementById('topbar-username-desktop');
    if (unElD && Store.username) unElD.textContent = Store.username;
    // Show admin link for admins
    if (Store.isAdmin) {
      document.querySelectorAll('.admin-link').forEach(el => el.style.display = 'flex');
    }
    this.fullRender();
    // Init touch patch dropdown
    this._updateTouchPatchDropdown();
    this._bindGlobal();
    Patch.initSnap();
    this.initModuleSection();
    Mobile.init();
    Undo.init();
    // Restore desktop sidebar collapsed state
    try {
      if (localStorage.getItem('patchdoc_sidebar_collapsed') === '1') {
        const layout = document.getElementById('layout');
        const btn    = document.getElementById('sidebar-desktop-toggle');
        const icon   = btn?.querySelector('i');
        if (layout) layout.classList.add('sidebar-collapsed');
        if (icon) icon.className = 'ti ti-layout-sidebar-right';
      }
    } catch(e) {}

  },

  // One-time cleanup: an earlier version of the module color picker fell
  // back to "#000000" (the native <input type="color"> default) instead
  // of leaving the color unset when no color was deliberately chosen.
  // This clears any module color that's exactly black — a real, deliberate
  // black would be unusual for a Eurorack module color choice, and the
  // false positives this fixes vastly outnumber any legitimate ones.
  _cleanupAccidentalBlackColors() {
    let fixed = 0;
    Store.state.modules.forEach(m => {
      if (m.color === '#000000') {
        m.color = null;
        fixed++;
      }
    });
    if (fixed > 0) {
      Store.saveNow();
      console.log(`Cleaned up ${fixed} module(s) with an accidental black color.`);
      this.setStatus(`cleaned up ${fixed} module color${fixed !== 1 ? 's' : ''}`);
    }
  },


  _bindGlobal() {
    // Save immediately when page is closed or refreshed
    // beforeunload and visibilitychange beacon removed —
    // every mutating action already calls saveNow() immediately,
    // so beaconing on unload is redundant and risks overwriting
    // a newer state saved by another device.
    document.addEventListener('keydown', e => {
      const tag = document.activeElement?.tagName;
      const typing = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
      if (e.key === 'Escape') {
        if (document.querySelector('.modal-bg.open')) this.closeModal();
        return;
      }
      if (typing) return;
      switch(e.key.toLowerCase()) {
        case 'a': this.addSelectedToPatch(); break;
        case 'n': this.newPatch(); break;
        case 's': if (e.metaKey || e.ctrlKey) { e.preventDefault(); IO.exportPatch(); } break;
        case 'p': if (e.metaKey || e.ctrlKey) { e.preventDefault(); IO.exportPDF(); } break;
        case 'delete':
        case 'backspace': {
          // del selected module from patch if one is focused
          break;
        }
        case '1': this.switchTab('patch'); break;
        case '2': this.switchTab('notes'); break;
        case '3': this.switchTab('params'); break;
        case '4': this.switchTab('io'); break;
        case 'z': if (e.metaKey || e.ctrlKey) { Undo.undo(); } break;
        case 'y': if (e.metaKey || e.ctrlKey) { Undo.redo(); } break;
      }
    });
  },

  fullRender() {
    this.renderPatchList();
    this.renderModuleLibrary();
    this.renderPatchHeader();
    Patch.render();
    this.renderParams();
    IO.updatePreview();
    this.updateHPSum();
    this.renderConnections();
    // Re-render media/manuals only if their tab is currently visible
    const activeTab = document.querySelector('.tab-btn.active')?.dataset.tab;
    if (activeTab === 'media')   Media.render();
    if (activeTab === 'manuals') Manuals.render();
  },

  _touchMenuOpen: false,

  toggleTouchMenu() {
    this._touchMenuOpen = !this._touchMenuOpen;
    const menu = document.getElementById('touch-menu-dropdown');
    const btn  = document.getElementById('touch-menu-btn');
    if (menu) menu.classList.toggle('open', this._touchMenuOpen);
    if (btn)  btn.classList.toggle('active', this._touchMenuOpen);
    if (this._touchMenuOpen) {
      // Close on outside click
      setTimeout(() => {
        document.addEventListener('click', this._closeTouchMenuOutside, { once: true });
      }, 10);
    }
  },

  closeTouchMenu() {
    this._touchMenuOpen = false;
    const menu = document.getElementById('touch-menu-dropdown');
    const btn  = document.getElementById('touch-menu-btn');
    if (menu) menu.classList.remove('open');
    if (btn)  btn.classList.remove('active');
  },

  _closeTouchMenuOutside(e) {
    const menu = document.getElementById('touch-menu-dropdown');
    const btn  = document.getElementById('touch-menu-btn');
    if (menu && !menu.contains(e.target) && e.target !== btn) {
      App.closeTouchMenu();
    }
  },

  _patchSearchQuery: '',
  _activeTagFilter: null,
  _templatesCollapsed: false,

  toggleTemplatesCollapsed() {
    this._templatesCollapsed = !this._templatesCollapsed;
    this.renderPatchList();
  },

  renderTagFilters() {
    const el = document.getElementById('patch-tag-filters');
    if (!el) return;
    // Collect all unique tags across all patches
    const allTags = [...new Set(
      Store.state.patches.flatMap(p => p.tags || [])
    )].sort();
    if (!allTags.length) { el.innerHTML = ''; return; }
    el.innerHTML = '<div class="tag-filter-wrap">' +
      allTags.map(t => `<span class="tag-filter-chip ${this._activeTagFilter === t ? 'active' : ''}"
        onclick="App.toggleTagFilter('${t.replace(/'/g, "\'")}')">${t}</span>`).join('') +
      '</div>';
  },

  toggleTagFilter(tag) {
    this._activeTagFilter = this._activeTagFilter === tag ? null : tag;
    this.renderTagFilters();
    this.renderPatchList();
  },

  reorderPatch(fromId, toId) {
    if (fromId === toId) return;
    const patches = Store.state.patches;
    const fromIdx = patches.findIndex(p => p.id === fromId);
    const toIdx   = patches.findIndex(p => p.id === toId);
    if (fromIdx === -1 || toIdx === -1) return;
    const [moved] = patches.splice(fromIdx, 1);
    patches.splice(toIdx, 0, moved);
    Undo.snapshot();
    Store.save();
    this.renderPatchList();
  },

  _onPatchDragStart(e, id) {
    // Only allow drag in manual sort mode
    if (this._patchSort !== 'manual') return;
    this._dragSrcId = id;
    e.dataTransfer.effectAllowed = 'move';
    e.currentTarget.classList.add('dragging');
  },

  _onPatchDragOver(e, id) {
    if (!this._dragSrcId || this._dragSrcId === id) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    // Show drop indicator
    document.querySelectorAll('.patch-item').forEach(el => el.classList.remove('drag-over'));
    e.currentTarget.classList.add('drag-over');
  },

  _onPatchDrop(e, id) {
    e.preventDefault();
    document.querySelectorAll('.patch-item').forEach(el => {
      el.classList.remove('drag-over', 'dragging');
    });
    if (this._dragSrcId && this._dragSrcId !== id) {
      this.reorderPatch(this._dragSrcId, id);
    }
    this._dragSrcId = null;
  },

  _onPatchDragEnd() {
    document.querySelectorAll('.patch-item').forEach(el => {
      el.classList.remove('drag-over', 'dragging');
    });
    this._dragSrcId = null;
  },

  togglePatchSearch() {
    const wrap = document.getElementById('patch-search-wrap');
    const input = document.getElementById('patch-search');
    const btn   = document.getElementById('patch-search-btn');
    if (!wrap) return;
    const visible = wrap.style.display !== 'none';
    wrap.style.display = visible ? 'none' : 'block';
    if (!visible) {
      input?.focus();
      btn?.classList.add('active');
    } else {
      this._patchSearchQuery = '';
      if (input) input.value = '';
      btn?.classList.remove('active');
      this.renderPatchList();
    }
  },

  filterPatches(q) {
    this._patchSearchQuery = q.toLowerCase();
    this.renderPatchList();
  },

  _updateTouchPatchDropdown() {
    const sel = document.getElementById('touch-patch-select');
    if (!sel) return;
    const patches = this._sortedPatches();
    const active  = Store.state.activePatchId;
    sel.innerHTML = patches.map(p =>
      `<option value="${p.id}" ${p.id === active ? 'selected' : ''}>
        ${p.isTemplate ? '★ ' : ''}${p.title}
      </option>`
    ).join('');
  },

  renderPatchList() {
    const list = document.getElementById('patch-list');
    const active = Store.state.activePatchId;
    const q = this._patchSearchQuery || '';
    const tag = this._activeTagFilter;
    const allPatches = this._sortedPatches().filter(p => {
      const matchesQ = !q || p.title.toLowerCase().includes(q) || (p.tags||[]).some(t => t.toLowerCase().includes(q));
      const matchesTag = !tag || (p.tags||[]).includes(tag);
      return matchesQ && matchesTag;
    });
    const draggable = this._patchSort === 'manual';

    const renderPatch = (p, isTemplate) => {
      const dragAttrs = draggable && !isTemplate ? `draggable="true"
           ondragstart="App._onPatchDragStart(event,'${p.id}')"
           ondragover="App._onPatchDragOver(event,'${p.id}')"
           ondrop="App._onPatchDrop(event,'${p.id}')"
           ondragend="App._onPatchDragEnd()"` : '';
      return `
      <div class="patch-item ${p.id === active ? 'active' : ''} ${draggable && !isTemplate ? 'draggable-patch' : ''} ${isTemplate ? 'patch-template' : ''}"
           ${dragAttrs}
           onclick="App.switchPatch('${p.id}')"
           ondblclick="App.renamePatch('${p.id}', event)">
        <span class="patch-title-text" id="ptitle-${p.id}">${isTemplate ? '★ ' : ''}${p.title}</span>
        <span class="patch-meta">${p.patchModules.length}m · ${p.cables.length}c</span>
        <span class="patch-actions">
          ${isTemplate
            ? `<button class="patch-action-btn template-use" onclick="App.newFromTemplate('${p.id}',event)" title="New patch from template" aria-label="New from template">⎘</button>
               <button class="patch-action-btn template-unmark" onclick="App.toggleTemplate('${p.id}',event)" title="Remove template mark" aria-label="Remove template">★</button>`
            : `<button class="patch-action-btn" onclick="App.toggleTemplate('${p.id}',event)" title="Mark as template" aria-label="Mark as template">☆</button>
               <button class="patch-action-btn" onclick="App.sharePatch('${p.id}',event)" title="Share patch" aria-label="Share patch">⇪</button>
               <button class="patch-action-btn" onclick="App.duplicatePatch('${p.id}',event)" title="Duplicate" aria-label="Duplicate">⎘</button>
               <button class="patch-action-btn danger" onclick="App.deletePatch('${p.id}',event)" title="Delete" aria-label="Delete">×</button>`
          }
        </span>

      </div>`;
    };

    const templates = allPatches.filter(p => p.isTemplate);
    const regular   = allPatches.filter(p => !p.isTemplate);

    const tc = this._templatesCollapsed;
    list.innerHTML =
      (templates.length ? `
        <div class="patch-template-divider clickable" onclick="App.toggleTemplatesCollapsed()">
          TEMPLATES <span style="font-size:14px;margin-left:6px;line-height:1">${tc ? '▸' : '▾'}</span>
        </div>
        ${tc ? '' : templates.map(p => renderPatch(p, true)).join('')}
        <div class="patch-template-divider">PATCHES</div>` : '') +
      regular.map(p => renderPatch(p, false)).join('');

    // Render shared patches section below
    this._renderSharedPatches();
    // Keep touch dropdown in sync
    this._updateTouchPatchDropdown();
    // Update tag filters
    this.renderTagFilters();
  },

  async _renderSharedPatches() {
    const wrap = document.getElementById('shared-patches-wrap');
    if (!wrap) return;
    let entries = [];
    try {
      const res = await fetch('/api/shared');
      if (res.ok) entries = await res.json();
    } catch(e) { wrap.innerHTML = ''; return; }

    if (!entries.length) { wrap.innerHTML = ''; return; }

    const me = Store.username;
    wrap.innerHTML = `
      <div class="patch-template-divider" style="margin-top:4px">SHARED</div>
      ${entries.map(e => {
        const own = e.sharedBy === me;
        return `
        <div class="patch-item shared-patch-item ${own ? 'shared-own' : ''}">
          <span class="patch-title-text">⇪ ${e.patch.title || 'Untitled'}</span>
          <span class="patch-meta" style="font-size:9px;color:var(--success)">${own ? 'you' : 'from ' + e.sharedBy}</span>
          <span class="patch-actions">
            ${!own ? `<button class="patch-action-btn" onclick="App.claimPatch('${e.id}',event)" title="Copy to my patches" aria-label="Claim">⎘</button>` : ''}
            <button class="patch-action-btn danger" onclick="App.deleteSharedPatch('${e.id}',event)" title="Remove" aria-label="Remove">×</button>
          </span>
        </div>`;
      }).join('')}`;
  },

  renamePatch(id, e) {
    if (e) e.stopPropagation();
    const span = document.getElementById('ptitle-' + id);
    if (!span) return;
    const old = span.textContent;
    const input = document.createElement('input');
    input.value = old;
    input.className = 'patch-rename-input';
    input.onclick = ev => ev.stopPropagation();
    span.replaceWith(input);
    input.focus(); input.select();
    const done = () => {
      const val = input.value.trim() || old;
      Store.updatePatch(id, { title: val });
      this.renderPatchList();
      if (id === Store.state.activePatchId) {
        document.getElementById('patch-title').value = val;
      }
    };
    input.addEventListener('blur', done);
    input.addEventListener('keydown', ev => {
      if (ev.key === 'Enter') { done(); }
      if (ev.key === 'Escape') { this.renderPatchList(); }
      ev.stopPropagation();
    });
  },

  toggleModuleSection() {
    const body = document.getElementById('module-section-body');
    const btn  = document.getElementById('module-section-collapse-btn');
    if (!body || !btn) return;
    const collapsed = body.style.display === 'none';
    body.style.display = collapsed ? 'flex' : 'none';
    btn.textContent = collapsed ? '▾' : '▸';
    try { localStorage.setItem('patchdoc_module_section_collapsed', collapsed ? '0' : '1'); } catch(e) {}
  },

  initModuleSection() {
    let collapsed = false;
    try { collapsed = localStorage.getItem('patchdoc_module_section_collapsed') === '1'; } catch(e) {}
    if (collapsed) {
      const body = document.getElementById('module-section-body');
      const btn  = document.getElementById('module-section-collapse-btn');
      if (body) body.style.display = 'none';
      if (btn)  btn.textContent = '▸';
    }
  },

  // Desktop sidebar toggle — collapses/expands the sidebar by toggling
  // a CSS class on #layout that sets grid-template-columns to 0px.
  _sidebarTab: 'patches',

  switchSidebarTab(tab) {
    this._sidebarTab = tab;
    document.getElementById('sidebar-panel-patches').style.display = tab === 'patches' ? 'flex' : 'none';
    const modPanel = document.getElementById('sidebar-panel-modules');
    if (modPanel) modPanel.style.display = tab === 'modules' ? 'flex' : 'none';
    document.getElementById('sidebar-tab-patches').classList.toggle('active', tab === 'patches');
    document.getElementById('sidebar-tab-modules').classList.toggle('active', tab === 'modules');
    // Show correct action button
    const newPatch = document.getElementById('sidebar-new-patch-btn');
    const newMod   = document.getElementById('sidebar-new-module-btn');
    if (newPatch) newPatch.style.display = tab === 'patches' ? '' : 'none';
    if (newMod)   newMod.style.display   = tab === 'modules' ? '' : 'none';
  },

  toggleDesktopSidebar() {
    const layout  = document.getElementById('layout');
    const btn     = document.getElementById('sidebar-desktop-toggle');
    const icon    = btn?.querySelector('i');
    if (!layout) return;
    const collapsed = layout.classList.toggle('sidebar-collapsed');
    try { localStorage.setItem('patchdoc_sidebar_collapsed', collapsed ? '1' : '0'); } catch(e) {}
    if (icon) icon.className = collapsed ? 'ti ti-layout-sidebar-right' : 'ti ti-layout-sidebar';
  },

  // In touch mode the sidebar (patches + module library) is hidden by
  // default to save space — this opens it as a full-screen overlay.
  toggleTouchSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    sidebar.classList.toggle('touch-sidebar-open');
  },

  _populateModuleFilters() {
    const makerSel = document.getElementById('module-filter-maker');
    const catSel   = document.getElementById('module-filter-cat');
    if (!makerSel || !catSel) return;

    const curMaker = makerSel.value;
    const curCat   = catSel.value;

    const makers = [...new Set(Store.state.modules.map(m => m.maker))].sort();
    const cats   = [...new Set(Store.state.modules.map(m => m.cat))].sort();

    makerSel.innerHTML = '<option value="">all makers</option>' +
      makers.map(mk => `<option value="${mk}" ${mk === curMaker ? 'selected' : ''}>${mk}</option>`).join('');
    catSel.innerHTML = '<option value="">all types</option>' +
      cats.map(ct => `<option value="${ct}" ${ct === curCat ? 'selected' : ''}>${ct}</option>`).join('');
  },

  renderModuleLibrary() {
    // Rebuild filter dropdown options only if the set of makers/categories
    // actually changed — avoids resetting the dropdown selection while typing.
    const makerSel = document.getElementById('module-filter-maker');
    if (makerSel) {
      const knownMakers = [...new Set(Store.state.modules.map(m => m.maker))].length;
      if (makerSel.options.length - 1 !== knownMakers) this._populateModuleFilters();
    }

    const q     = (document.getElementById('module-search')?.value || '').toLowerCase();
    const maker = document.getElementById('module-filter-maker')?.value || '';
    const cat   = document.getElementById('module-filter-cat')?.value || '';
    const list  = document.getElementById('module-list');
    const mods  = this._sortedModules().filter(m =>
      (!q || m.name.toLowerCase().includes(q) || m.maker.toLowerCase().includes(q) || m.cat.toLowerCase().includes(q)) &&
      (!maker || m.maker === maker) &&
      (!cat   || m.cat   === cat)
    );
    if (!mods.length) {
      list.innerHTML = '<div style="font-size:10px;color:var(--text2);padding:6px 10px">no results</div>';
      return;
    }
    if (this._moduleSort === 'cat') {
      // Group by category with headers
      let html = '';
      let lastCat = null;
      mods.forEach(m => {
        if (m.cat !== lastCat) {
          html += `<div class="module-cat-header">${m.cat}</div>`;
          lastCat = m.cat;
        }
        html += `<div class="module-item ${this.selectedModuleId === m.id ? 'active' : ''}"
           onclick="App.selectModule(${m.id})">
          <span class="module-dot" style="background:${CAT_COLORS[m.cat] || '#888'}"></span>
          <span class="module-name">${m.name}</span>
          <span class="module-hp">${m.hp}hp</span>
          <button class="module-edit-btn" onclick="App.openModal(${m.id}, event)" aria-label="edit module" title="edit module"><i class="ti ti-pencil" aria-hidden="true"></i></button>
          <button class="module-del-btn" onclick="App.deleteModule(${m.id}, event)" aria-label="delete module" title="delete from library">×</button>
        </div>`;
      });
      list.innerHTML = html;
    } else {
      list.innerHTML = mods.map(m => `
        <div class="module-item ${this.selectedModuleId === m.id ? 'active' : ''}"
             onclick="App.selectModule(${m.id})">
          <span class="module-dot" style="background:${CAT_COLORS[m.cat] || '#888'}"></span>
          <span class="module-name">${m.name}</span>
          <span class="module-hp">${m.hp}hp</span>
          <button class="module-edit-btn" onclick="App.openModal(${m.id}, event)" aria-label="edit module" title="edit module"><i class="ti ti-pencil" aria-hidden="true"></i></button>
          <button class="module-del-btn" onclick="App.deleteModule(${m.id}, event)" aria-label="delete module" title="delete from library">×</button>
        </div>`).join('');
    }
  },

  renderPatchHeader() {
    const p = Store.getActivePatch();
    document.getElementById('patch-title').value = p.title || '';
    document.getElementById('notes-textarea').value = p.notes || '';
    const tagsEl = document.getElementById('patch-tags');
    if (tagsEl) tagsEl.value = (p.tags || []).join(', ');
    this._renderPatchPhoto();
  },

  _renderPatchPhoto() {
    const p   = Store.getActivePatch();
    const wrap = document.getElementById('photo-preview');
    if (!wrap) return;
    if (p.photo) {
      wrap.innerHTML = `<img src="${p.photo}" style="max-width:100%;max-height:160px;border-radius:4px;display:block" alt="patch photo">
        <button onclick="App.removePhoto()" class="tool-btn danger" style="margin-top:5px;font-size:10px">remove photo</button>`;
    } else {
      wrap.innerHTML = '<span style="font-size:10px;color:var(--text2)">no photo</span>';
    }
  },

  onPhotoUpload(input) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      Store.updatePatch(Store.state.activePatchId, { photo: e.target.result });
      Undo.snapshot();
      this._renderPatchPhoto();
    };
    reader.readAsDataURL(file);
  },

  removePhoto() {
    Store.updatePatch(Store.state.activePatchId, { photo: null });
    Undo.snapshot();
    this._renderPatchPhoto();
  },

  selectModule(id) {
    this.selectedModuleId = id;
    this.renderModuleLibrary();
  },

  switchPatch(id) {
    Store.setActivePatch(id);
    // Clear patch search so the new patch is always visible in the list
    this._patchSearchQuery = '';
    const searchInput = document.getElementById('patch-search');
    if (searchInput) searchInput.value = '';
    this.fullRender();
    this.setStatus('switched to ' + Store.getActivePatch().title);
    // Close the touch-mode sidebar overlay after picking a patch
    document.getElementById('sidebar')?.classList.remove('touch-sidebar-open');
  },

  newPatch() {
    const title = prompt('Patch name:', 'New Patch');
    if (title === null) return;
    Store.newPatch(title.trim() || undefined);
    Undo.snapshot();
    this.fullRender();
    this.setStatus('new patch created');
  },

  deletePatch(id) {
    const p = Store.state.patches.find(x => x.id === id);
    if (!p) return;
    const msg = p.isTemplate
      ? `Delete template "${p.title}"? This cannot be undone.`
      : `Delete "${p.title}"?`;
    if (!confirm(msg)) return;
    if (!Store.deletePatch(id)) { alert('Cannot delete last patch.'); return; }
    Undo.snapshot();
    this.fullRender();
    this.setStatus('patch deleted');
  },

  duplicatePatch(id) {
    Store.duplicatePatch(id);
    this.fullRender();
    this.setStatus('patch duplicated');
  },

  async sharePatch(id, e) {
    if (e) e.stopPropagation();
    const p = Store.state.patches.find(x => x.id === id);
    if (!p) return;
    try {
      const res = await fetch('/api/shared', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patch: p })
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      this.setStatus('⇪ patch shared');
      this._renderSharedPatches();
    } catch(e) { this.setStatus('share failed: ' + e.message); }
  },

  async claimPatch(sharedId, e) {
    if (e) e.stopPropagation();
    try {
      const res = await fetch(`/api/shared/${sharedId}/claim`);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const { patch, sharedBy } = await res.json();
      patch.id = 'patch_' + Date.now();
      patch.title = patch.title + ' (from ' + sharedBy + ')';
      patch.isTemplate = false;
      patch.createdAt = new Date().toISOString();
      patch.updatedAt = new Date().toISOString();
      Store.state.patches.push(patch);
      Store.state.activePatchId = patch.id;
      Undo.snapshot();
      Store.saveNow();
      this.fullRender();
      this.setStatus('patch copied to your library');
    } catch(e) { this.setStatus('claim failed: ' + e.message); }
  },

  async deleteSharedPatch(sharedId, e) {
    if (e) e.stopPropagation();
    if (!confirm('Remove this shared patch?')) return;
    try {
      await fetch(`/api/shared/${sharedId}`, { method: 'DELETE' });
      this._renderSharedPatches();
      this.setStatus('shared patch removed');
    } catch(e) { this.setStatus('remove failed: ' + e.message); }
  },

  toggleTemplate(id, e) {
    if (e) e.stopPropagation();
    const p = Store.state.patches.find(x => x.id === id);
    if (!p) return;
    Store.updatePatch(id, { isTemplate: !p.isTemplate });
    Undo.snapshot();
    Store.saveNow();
    this.renderPatchList();
    this.setStatus(p.isTemplate ? 'template mark removed' : '⭐ marked as template');
  },

  newFromTemplate(id, e) {
    if (e) e.stopPropagation();
    const src = Store.state.patches.find(x => x.id === id);
    if (!src) return;
    const title = prompt('Name for new patch:', src.title + ' (copy)');
    if (title === null) return;
    const copy = JSON.parse(JSON.stringify(src));
    copy.id = 'patch_' + Date.now();
    copy.title = title.trim() || src.title + ' (copy)';
    copy.isTemplate = false;
    copy.createdAt = new Date().toISOString();
    copy.updatedAt = new Date().toISOString();
    // Reset cable colors so new patch gets fresh colors
    copy.cableColorIdx = 0;
    Store.state.patches.push(copy);
    Store.state.activePatchId = copy.id;
    Undo.snapshot();
    Store.saveNow();
    this.fullRender();
    this.setStatus('patch created from template');
  },

  onTitleChange(val) {
    Store.updatePatch(Store.state.activePatchId, { title: val });
    this.renderPatchList();
  },

  onNotesChange(val) {
    Store.updatePatch(Store.state.activePatchId, { notes: val });
  },

  onTagsChange(val) {
    const tags = val.split(',').map(t => t.trim()).filter(Boolean);
    Store.updatePatch(Store.state.activePatchId, { tags });
    this.renderPatchList();
    this.showTagSuggestions();
  },

  showTagSuggestions() {
    const input = document.getElementById('patch-tags');
    const box   = document.getElementById('tag-suggestions');
    if (!input || !box) return;

    // Get the last typed tag (after last comma)
    const parts = input.value.split(',');
    const current = parts[parts.length - 1].trim().toLowerCase();

    // Collect all existing tags from all patches
    const currentTags = new Set(
      parts.slice(0, -1).map(t => t.trim()).filter(Boolean)
    );
    const allTags = [...new Set(
      Store.state.patches.flatMap(p => p.tags || [])
    )].filter(t => !currentTags.has(t) && (!current || t.toLowerCase().includes(current)));

    if (!allTags.length) { box.style.display = 'none'; return; }

    box.style.display = 'block';
    box.innerHTML = allTags.map(t => `
      <div class="tag-suggestion-item" onmousedown="App.selectTagSuggestion('${t.replace(/'/g,"\'")}')">
        ${t}
      </div>`).join('');
  },

  hideTagSuggestions() {
    const box = document.getElementById('tag-suggestions');
    if (box) box.style.display = 'none';
  },

  selectTagSuggestion(tag) {
    const input = document.getElementById('patch-tags');
    if (!input) return;
    const parts = input.value.split(',');
    parts[parts.length - 1] = ' ' + tag;
    input.value = parts.join(',') + ', ';
    input.focus();
    this.onTagsChange(input.value);
    this.hideTagSuggestions();
  },

  addSelectedToPatch() {
    if (!this.selectedModuleId) { this.setStatus('select a module first'); return; }
    Patch.addToPatch(this.selectedModuleId);
    this.updateHPSum();
  },

  updateHPSum() {
    const patch = Store.getActivePatch();
    const total = patch.patchModules.reduce((sum, pm) => {
      const m = Store.state.modules.find(x => x.id === pm.moduleId);
      return sum + (m ? (m.hp || 0) : 0);
    }, 0);
    const el = document.getElementById('hp-sum');
    if (el) el.textContent = total + 'hp';
  },

  setStatus(msg, timeout = 3500) {
    const el = document.getElementById('patch-status');
    if (!el) return;
    el.textContent = msg;
    clearTimeout(el._t);
    if (timeout > 0) {
      el._t = setTimeout(() => { el.textContent = ''; }, timeout);
    }
  },

  switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    const btn = document.querySelector('[data-tab="' + tab + '"]');
    if (btn) btn.classList.add('active');
    const view = document.getElementById(tab + '-view');
    if (view) view.classList.add('active');
    this.closeTouchMenu();
    if (tab === 'params') this.renderParams();
    if (tab === 'connections') this.renderConnections();
    if (tab === 'io') IO.updatePreview();
    if (tab === 'rack') this.renderRackView();
    if (tab === 'media') Media.render();
    if (tab === 'manuals') Manuals.render();
  },

  // Tap a module in the canvas (touch mode) → jump to its parameters
  // and briefly highlight the card so it's easy to spot.
  jumpToModuleParams(pmId) {
    this.switchTab('params');
    setTimeout(() => {
      const card = document.getElementById('param-card-' + pmId);
      if (!card) return;
      card.scrollIntoView({ behavior: 'smooth', block: 'start' });
      card.classList.add('param-card-flash');
      setTimeout(() => card.classList.remove('param-card-flash'), 1500);
    }, 60); // wait for switchTab's render to finish
  },

  renderParams() {
    const patch = Store.getActivePatch();
    const c = document.getElementById('params-content');
    if (!c) return;
    if (!patch.patchModules.length) {
      c.innerHTML = '<p class="empty-hint">add modules to patch first</p>';
      return;
    }
    c.innerHTML = patch.patchModules.map(pm => {
      const m = Store.state.modules.find(x => x.id === pm.moduleId);
      if (!m) return '';
      const key  = pm.id;
      const defs = m.paramDefs || [];
      if (!patch.params[key]) patch.params[key] = {};
      const vals = patch.params[key];

      // Rows from paramDefs (typed controls)
      const defRows = defs.map(d => {
        const val = vals[d.name] !== undefined ? vals[d.name] : (d.default ?? '');
        const markCol = Patch._markColor(key, d.name);
        const markStyle = markCol ? `border-left:3px solid ${markCol};padding-left:7px` : '';
        if (d.type === 'knob') {
          const step = ((d.max||100)-(d.min||0)) >= 10 ? 1 : 0.1;
          const displayVal = step === 1 ? Math.round(val) : (Math.round(val * 10) / 10);
          return `<div class="param-row" style="${markStyle}">
            <span class="param-name" style="${markCol ? 'color:'+markCol : ''}" onclick="Patch.cycleMarkColor(${key},'${d.name}',event)" title="click to mark">${d.name}</span>
            <input class="param-input" type="number" value="${displayVal}"
              min="${d.min ?? 0}" max="${d.max ?? 100}" step="${step}"
              oninput="App.setParam(${key},'${d.name}',parseFloat(this.value)||0)" />
            <span class="param-type" style="font-size:9px;color:var(--text2)">${d.min ?? 0}–${d.max ?? 100}</span>
          </div>`;
        }
        if (d.type === 'toggle') {
          const on = val === true || val === 'true' || val === 1;
          return `<div class="param-row" style="${markStyle}">
            <span class="param-name" style="${markCol ? 'color:'+markCol : ''}" onclick="Patch.cycleMarkColor(${key},'${d.name}',event)" title="click to mark">${d.name}</span>
            <select class="param-input" onchange="App.setParam(${key},'${d.name}',this.value==='true')">
              <option value="false" ${!on?'selected':''}>off</option>
              <option value="true"  ${on?'selected':''}>on</option>
            </select>
            <span class="param-type" style="font-size:9px;color:var(--text2)">toggle</span>
          </div>`;
        }
        if (d.type === 'enum') {
          const opts = (d.options||'').split(',').map(s=>s.trim()).filter(Boolean);
          return `<div class="param-row" style="${markStyle}">
            <span class="param-name" style="${markCol ? 'color:'+markCol : ''}" onclick="Patch.cycleMarkColor(${key},'${d.name}',event)" title="click to mark">${d.name}</span>
            <select class="param-input" onchange="App.setParam(${key},'${d.name}',this.value)">
              ${opts.map(o=>`<option value="${o}" ${o===val?'selected':''}>${o}</option>`).join('')}
            </select>
            <span class="param-type" style="font-size:9px;color:var(--text2)">enum</span>
          </div>`;
        }
        if (d.type === 'text') {
          return `<div class="param-row" style="${markStyle}">
            <span class="param-name" style="${markCol ? 'color:'+markCol : ''}" onclick="Patch.cycleMarkColor(${key},'${d.name}',event)" title="click to mark">${d.name}</span>
            <input class="param-input" type="text" value="${val||''}"
              oninput="App.setParam(${key},'${d.name}',this.value)" placeholder="—" />
            <span class="param-type" style="font-size:9px;color:var(--text2)">text</span>
          </div>`;
        }
        return '';
      }).join('');

      // Extra free-text rows (not from paramDefs)
      const defNames = new Set(defs.map(d => d.name));
      const freeRows = Object.keys(vals).filter(k => !defNames.has(k)).map(p => {
        const fMarkCol = Patch._markColor(key, p);
        const fMarkStyle = fMarkCol ? `border-left:3px solid ${fMarkCol};padding-left:7px` : '';
        return `
        <div class="param-row" style="${fMarkStyle}">
          <span class="param-name" style="${fMarkCol ? 'color:'+fMarkCol : ''}" onclick="Patch.cycleMarkColor(${key},'${p}',event)" title="click to mark">${p}</span>
          <input class="param-input" type="text" value="${vals[p] || ''}"
            oninput="App.setParam(${key},'${p}',this.value)" placeholder="value..." />
          <button class="param-del" onclick="App.deleteParam(${key},'${p}')" aria-label="delete">×</button>
        </div>`;}).join('');

      return `
        <div class="param-module-card" id="param-card-${key}">
          <div class="param-module-header">
            <span class="module-dot" style="background:${CAT_COLORS[m.cat]};width:7px;height:7px;border-radius:50%;display:inline-block;flex-shrink:0"></span>
            <span>${m.name}${pm.instance > 1 ? ' #'+pm.instance : ''}</span>
            <span class="param-maker">${m.maker}</span>
          </div>
          ${defRows}${freeRows}
          <div class="add-param-row">
            <input class="param-input" type="text" id="np-${key}" placeholder="new parameter..."
              onkeydown="if(event.key==='Enter')App.addParam(${key})" />
            <button class="tool-btn" onclick="App.addParam(${key})">+ add</button>
          </div>
        </div>`;
    }).join('');
  },

  // Dropdown-based connections editor — lets you add modules, create
  // cables, and re-route existing ones entirely through select menus.
  // Used on both desktop and touch devices: more reliable than tiny
  // click-targets on touchscreens, and a fast alternative to canvas
  // click-click cable creation on desktop too.

  renderConnections() {
    const patch = Store.getActivePatch();
    const c = document.getElementById('connections-content');
    if (!c) return;

    const modName = pmId => {
      const pm = patch.patchModules.find(p => p.id === pmId);
      if (!pm) return '?';
      const m = Store.state.modules.find(x => x.id === pm.moduleId);
      if (!m) return '?';
      return m.name + (pm.instance > 1 ? ' #' + pm.instance : '');
    };
    const moduleOf = pmId => {
      const pm = patch.patchModules.find(p => p.id === pmId);
      return pm ? Store.state.modules.find(x => x.id === pm.moduleId) : null;
    };

    // ── "Add module to patch" picker ──
    const libraryOptions = this._sortedModules()
      .map(m => `<option value="${m.id}">${m.name} — ${m.maker}</option>`).join('');
    const addModuleHTML = `
      <div class="conn-add-module-row">
        <select id="conn-add-module-select">
          <option value="">add module to patch…</option>
          ${libraryOptions}
        </select>
        <button class="tool-btn" onclick="App.connAddModule()">+ add</button>
      </div>`;

    // ── Module overview strip (touch mode only) ──
    const moduleChipsHTML = patch.patchModules.length ? `
      <div class="conn-module-chips" id="conn-module-chips">
        ${[...patch.patchModules]
          .sort((a,b) => modName(a).localeCompare(modName(b)))
          .map(pm => {
            const m = moduleOf(pm.id);
            const col = m ? (CAT_COLORS[m.cat] || '#888') : '#888';
            const cableCount = patch.cables.filter(c => c.fromPm === pm.id || c.toPm === pm.id).length;
            return `<div class="conn-module-chip" style="border-color:${col}">
              <span class="conn-module-chip-dot" style="background:${col}"></span>
              <span class="conn-module-chip-name">${modName(pm.id)}</span>
              ${cableCount ? `<span class="conn-module-chip-count">${cableCount}</span>` : ''}
              <button class="conn-del" onclick="App.connRemoveModule(${pm.id},event)" aria-label="remove">×</button>
            </div>`;
          }).join('')}
      </div>` : '';

    if (!patch.patchModules.length) {
      c.innerHTML = addModuleHTML + '<p class="empty-hint">add a module to start patching</p>';
      return;
    }

    // ── Per-module block: existing connections (editable) + add-connection form ──
    const sortedModuleIds = [...patch.patchModules]
      .map(pm => pm.id)
      .sort((a, b) => modName(a).localeCompare(modName(b)));

    const blocksHTML = sortedModuleIds.map(pmId => {
      const m = moduleOf(pmId);
      if (!m) return '';
      const outCables = patch.cables.filter(c2 => c2.fromPm === pmId);
      const inCables  = patch.cables.filter(c2 => c2.toPm === pmId);

      // Other modules available as connection targets (for the "add" form)
      // Include self (pmId) for self-patching — shown as "ModuleName (self)" in dropdowns
      const otherModuleIds = patch.patchModules.map(p => p.id).filter(id => id !== pmId);
      const allTargetIds   = patch.patchModules.map(p => p.id); // incl. self

      const editableRow = (cab, fixedSide) => {
        // fixedSide: 'out' → this module is the source, target end is editable
        //            'in'  → this module is the target, source end is editable
        if (fixedSide === 'out') {
          const targetOptions = allTargetIds.map(tid => {
            const tm = moduleOf(tid);
            if (!tm) return '';
            const label = tid === pmId ? modName(tid) + ' (self)' : modName(tid);
            return `<option value="${tid}" ${tid === cab.toPm ? 'selected' : ''}>${label}</option>`;
          }).join('');
          const tm = moduleOf(cab.toPm);
          const portOptions = (tm?.inputs || []).map(p => {
            const name = Patch._portName(p);
            return `<option value="${name}" ${name === cab.toPort ? 'selected' : ''}>${name}</option>`;
          }).join('');
          return `
            <div class="conn-edit-row">
              <span class="conn-dot" style="background:${cab.color}"></span>
              <span class="conn-fixed-port">${cab.fromPort}</span>
              <span class="conn-arrow">→</span>
              <select class="conn-mini-select" onchange="App.connChangeTarget(${cab.id},'toPm',this.value)">${targetOptions}</select>
              <select class="conn-mini-select" onchange="App.connChangeTarget(${cab.id},'toPort',this.value)">${portOptions}</select>
              <button class="conn-del" onclick="App.removeConnection(${cab.id})" aria-label="remove connection">×</button>
            </div>`;
        } else {
          const sourceOptions = allTargetIds.map(sid => {
            const sm = moduleOf(sid);
            if (!sm) return '';
            return `<option value="${sid}" ${sid === cab.fromPm ? 'selected' : ''}>${modName(sid)}</option>`;
          }).join('');
          const sm = moduleOf(cab.fromPm);
          const portOptions = (sm?.outputs || []).map(p => {
            const name = Patch._portName(p);
            return `<option value="${name}" ${name === cab.fromPort ? 'selected' : ''}>${name}</option>`;
          }).join('');
          return `
            <div class="conn-edit-row">
              <span class="conn-dot" style="background:${cab.color}"></span>
              <select class="conn-mini-select" onchange="App.connChangeTarget(${cab.id},'fromPm',this.value)">${sourceOptions}</select>
              <select class="conn-mini-select" onchange="App.connChangeTarget(${cab.id},'fromPort',this.value)">${portOptions}</select>
              <span class="conn-arrow">→</span>
              <span class="conn-fixed-port">${cab.toPort}</span>
              <button class="conn-del" onclick="App.removeConnection(${cab.id})" aria-label="remove connection">×</button>
            </div>`;
        }
      };

      // "Add new connection" mini-form — from this module's output to another module's input
      const outputOptions = (m.outputs || []).map(p => {
        const name = Patch._portName(p);
        return `<option value="${name}">${name}</option>`;
      }).join('');
      const targetModOptions = allTargetIds.map(tid => {
        const label = tid === pmId ? modName(tid) + ' (self)' : modName(tid);
        return `<option value="${tid}">${label}</option>`;
      }).join('');

      const addFormHTML = otherModuleIds.length ? `
        <div class="conn-add-row">
          <select id="conn-new-fromport-${pmId}" class="conn-mini-select">${outputOptions || '<option value="">no outputs</option>'}</select>
          <span class="conn-arrow">→</span>
          <select id="conn-new-tomod-${pmId}" class="conn-mini-select" onchange="App.connRefreshTargetPorts(${pmId})">${targetModOptions}</select>
          <select id="conn-new-toport-${pmId}" class="conn-mini-select"></select>
          <button class="tool-btn" onclick="App.connAddCable(${pmId})">+ connect</button>
        </div>` : '<div class="conn-empty-hint">add a module to create connections</div>';

      return `<div class="conn-group">
        <div class="conn-group-header">
          ${modName(pmId)}
          <button class="conn-del" style="margin-left:auto" onclick="App.connRemoveModule(${pmId})" title="remove module from patch" aria-label="remove module">×</button>
        </div>
        ${inCables.length ? `<div class="conn-subheader">IN</div>${inCables.map(cab => editableRow(cab, 'in')).join('')}` : ''}
        ${outCables.length ? `<div class="conn-subheader">OUT</div>${outCables.map(cab => editableRow(cab, 'out')).join('')}` : ''}
        <div class="conn-subheader">ADD CONNECTION</div>
        ${addFormHTML}
      </div>`;
    }).join('');

    c.innerHTML = addModuleHTML + moduleChipsHTML + `
      <div style="font-size:11px;color:var(--text2);margin:10px 0 12px">
        ${patch.cables.length} connection${patch.cables.length !== 1 ? 's' : ''} total
      </div>
      ${blocksHTML}`;

    // Populate the "to port" dropdowns for each add-form with the
    // currently-selected target module's inputs
    sortedModuleIds.forEach(pmId => this.connRefreshTargetPorts(pmId));
  },

  connRefreshTargetPorts(pmId) {
    const toModSel  = document.getElementById('conn-new-tomod-' + pmId);
    const toPortSel = document.getElementById('conn-new-toport-' + pmId);
    if (!toModSel || !toPortSel) return;
    const targetPmId = parseInt(toModSel.value);
    const patch = Store.getActivePatch();
    const targetPm = patch.patchModules.find(p => p.id === targetPmId);
    const targetMod = targetPm ? Store.state.modules.find(x => x.id === targetPm.moduleId) : null;
    const inputs = targetMod?.inputs || [];
    toPortSel.innerHTML = inputs.map(p => {
      const name = Patch._portName ? Patch._portName(p) : (typeof p === 'object' ? p.name : p);
      return `<option value="${name}">${name}</option>`;
    }).join('') || '<option value="">no inputs</option>';
  },

  connAddModule() {
    const sel = document.getElementById('conn-add-module-select');
    const moduleId = parseInt(sel?.value);
    if (!moduleId) return;
    Patch.addToPatch(moduleId);
    this.renderConnections();
    Patch.render();
    this.setStatus('module added');
  },

  connRemoveModule(pmId) {
    if (!confirm('Remove this module and all its connections from the patch?')) return;
    Patch.removeFromPatch(pmId);
    this.renderConnections();
    Patch.render();
  },

  connAddCable(pmId) {
    const fromSel = document.getElementById('conn-new-fromport-' + pmId);
    const toModSel = document.getElementById('conn-new-tomod-' + pmId);
    const toPortSel = document.getElementById('conn-new-toport-' + pmId);
    if (!fromSel || !toModSel || !toPortSel) return;
    const fromPort = fromSel.value;
    const toPm = parseInt(toModSel.value);
    const toPort = toPortSel.value;
    if (!fromPort || !toPm || !toPort) { this.setStatus('select all fields first'); return; }
    const cable = Patch.createCable(pmId, fromPort, toPm, toPort);
    if (!cable) { this.setStatus('connection already exists'); return; }
    Undo.snapshot();
    this.renderConnections();
    Patch.render();
    this.setStatus('connected');
  },

  connChangeTarget(cableId, field, value) {
    const parsedValue = (field === 'toPm' || field === 'fromPm') ? parseInt(value) : value;
    const changes = { [field]: parsedValue };

    // When switching the module end of a cable, the previously selected
    // port likely doesn't exist on the new module — fall back to its
    // first available port so the cable stays in a valid state.
    if (field === 'toPm') {
      const m = Store.state.modules.find(x =>
        x.id === Store.getActivePatch().patchModules.find(p => p.id === parsedValue)?.moduleId
      );
      const firstPort = m?.inputs?.[0];
      if (firstPort) changes.toPort = Patch._portName(firstPort);
    }
    if (field === 'fromPm') {
      const m = Store.state.modules.find(x =>
        x.id === Store.getActivePatch().patchModules.find(p => p.id === parsedValue)?.moduleId
      );
      const firstPort = m?.outputs?.[0];
      if (firstPort) changes.fromPort = Patch._portName(firstPort);
    }

    const ok = Patch.updateCable(cableId, changes);
    if (!ok) { this.setStatus('that connection already exists'); }
    else Undo.snapshot();
    this.renderConnections();
    Patch.render();
  },

  removeConnection(cableId) {
    Patch.removeCable(cableId);
    Undo.snapshot();
    this.renderConnections();
    Patch.render();
  },

  setParam(pmId, name, val) {
    const patch = Store.getActivePatch();
    if (!patch.params[pmId]) patch.params[pmId] = {};
    patch.params[pmId][name] = val;
    Store.updatePatch(patch.id, { params: patch.params });
    Patch.render();
    // Debounced snapshot — knobs fire rapidly, we only want one undo step
    clearTimeout(this._paramUndoTimer);
    this._paramUndoTimer = setTimeout(() => Undo.snapshot(), 800);
  },

  addParam(pmId) {
    const inp = document.getElementById('np-' + pmId);
    const name = inp.value.trim();
    if (!name) return;
    const patch = Store.getActivePatch();
    if (!patch.params[pmId]) patch.params[pmId] = {};
    patch.params[pmId][name] = '';
    Store.updatePatch(patch.id, { params: patch.params });
    inp.value = '';
    this.renderParams();
    Patch.render();
  },

  deleteParam(pmId, name) {
    const patch = Store.getActivePatch();
    if (patch.params[pmId]) delete patch.params[pmId][name];
    Store.updatePatch(patch.id, { params: patch.params });
    this.renderParams();
    Patch.render();
  },

  _guessSigType(name) {
    const s = name.toLowerCase();
    if (/gate|trig|tr$|clock|clk|sync|eoc|eof/.test(s)) return 'gate';
    if (/cv|mod|lfo|env|pitch|v\/oct|freq|harm|timbre|morph|level|fm|am|exp|v.oct/.test(s)) return 'cv';
    return 'audio';
  },

  _renderColorSwatches(current) {
    const wrap = document.getElementById('m-color-swatches');
    if (!wrap) return;
    wrap.innerHTML = MODULE_COLOR_PALETTE.map(hex => `
      <button type="button" class="color-swatch ${hex === current ? 'active' : ''}"
        style="background:${hex}" title="${hex}" aria-label="select color ${hex}"
        onclick="App.pickModuleColor('${hex}')"></button>`).join('') +
      `<button type="button" class="color-swatch color-swatch-none ${!current ? 'active' : ''}"
        title="no color" aria-label="no color" onclick="App.pickModuleColor('')">×</button>`;
  },

  pickModuleColor(hex) {
    const input = document.getElementById('m-color');
    if (hex) {
      input.value = hex;
      input.dataset.cleared = '';
    } else {
      input.dataset.cleared = '1'; // explicit "no color" — input itself can't represent empty
    }
    this._renderColorSwatches(hex);
  },

  openModal(editId, e) {
    if (e) e.stopPropagation();
    window._editModuleId = editId || null;
    const m = editId ? Store.state.modules.find(x => x.id === editId) : null;
    // ports stored as {name, sigType} objects or plain strings (legacy)
    window._tempInputs  = m ? m.inputs.map(p  => typeof p === 'object' ? p : { name: p, sigType: this._guessSigType(p) }) : [{name:'v/oct',sigType:'cv'},{name:'cv',sigType:'cv'},{name:'gate',sigType:'gate'}];
    window._tempOutputs = m ? m.outputs.map(p => typeof p === 'object' ? p : { name: p, sigType: this._guessSigType(p) }) : [{name:'out',sigType:'audio'},{name:'aux',sigType:'audio'}];
    window._tempParamDefs = m ? JSON.parse(JSON.stringify(m.paramDefs || [])) : [];
    document.getElementById('m-color').value      = m ? (m.color || '') : '';
    document.getElementById('m-color').dataset.cleared = (m && m.color) ? '' : '1';
    this._renderColorSwatches(m ? (m.color || '') : '');
    document.getElementById('m-param-cols').value = m ? (m.paramCols || 3) : 3;
    document.getElementById('m-p12p').value  = m ? (m.power12p || '') : '';
    document.getElementById('m-p12n').value  = m ? (m.power12n || '') : '';
    document.getElementById('m-p5').value    = m ? (m.power5   || '') : '';
    document.getElementById('m-name').value  = m ? m.name  : '';
    document.getElementById('m-maker').value = m ? m.maker : '';
    document.getElementById('m-hp').value    = m ? m.hp    : 8;
    document.getElementById('m-cat').value   = m ? m.cat   : 'oscillator';
    document.getElementById('module-modal-title').textContent = m ? 'edit module' : 'add module';
    document.getElementById('module-modal-save-btn').textContent = m ? 'save changes' : 'add to library';
    this._renderIOTags();
    this._renderParamDefs();
    document.getElementById('module-modal-bg').classList.add('open');
    document.getElementById('m-name').focus();

    // Manual upload only makes sense for an already-saved module (it needs
    // a stable module id for the server-side folder) — hidden when creating
    // a brand-new module that doesn't have an id yet.
    const manualsField = document.getElementById('modal-manuals-field');
    if (manualsField) {
      manualsField.style.display = editId ? 'block' : 'none';
      if (editId) Manuals.renderInModal(editId);
    }
  },

  closeModal() {
    document.getElementById('module-modal-bg').classList.remove('open');
    window._editModuleId = null;
    ['m-name','m-maker'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('m-hp').value = 8;
  },

  _sigBadge(sigType) {
    const colors = { audio: 'var(--text2)', cv: 'var(--accent)', gate: 'var(--success)' };
    return `<span style="font-size:8px;color:${colors[sigType]||'var(--text2)'}">${sigType}</span>`;
  },

  _renderIOTags() {
    const render = (arr, dir) => arr.map((p, i) => `
      <div class="io-port-row" draggable="true"
        ondragstart="App._ioDragStart('${dir}',${i},event)"
        ondragover="App._ioDragOver('${dir}',${i},event)"
        ondrop="App._ioDrop('${dir}',${i},event)"
        ondragend="App._ioDragEnd(event)"
        id="io-row-${dir}-${i}">
        <span class="io-port-handle" title="drag to reorder">⠿</span>
        <input class="io-port-name-input" type="text" value="${p.name}"
          onchange="App.renameIO('${dir}',${i},this.value)"
          onclick="event.stopPropagation()" />
        <button class="io-sig-badge io-sig-${p.sigType||'audio'}"
          onclick="App.cycleSigType('${dir}',${i})"
          title="click to change signal type">${p.sigType||'audio'}</button>
        <button class="io-tag-del" onclick="App.removeIO('${dir}',${i})">×</button>
      </div>`).join('');
    document.getElementById('inputs-builder').innerHTML  = render(window._tempInputs,  'in');
    document.getElementById('outputs-builder').innerHTML = render(window._tempOutputs, 'out');
    window._ioDragInfo = null;
  },

  _ioDragStart(dir, i, e) {
    window._ioDragInfo = { dir, idx: i };
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => document.getElementById(`io-row-${dir}-${i}`)?.classList.add('dragging'), 0);
  },

  _ioDragOver(dir, i, e) {
    e.preventDefault();
    if (!window._ioDragInfo || window._ioDragInfo.dir !== dir) return; // no cross-column drag
    e.dataTransfer.dropEffect = 'move';
    document.querySelectorAll('.io-port-row').forEach(r => r.classList.remove('drag-over'));
    document.getElementById(`io-row-${dir}-${i}`)?.classList.add('drag-over');
  },

  _ioDrop(dir, i, e) {
    e.preventDefault();
    const info = window._ioDragInfo;
    if (!info || info.dir !== dir || info.idx === i) return;
    const arr  = dir === 'in' ? window._tempInputs : window._tempOutputs;
    const item = arr.splice(info.idx, 1)[0];
    arr.splice(i, 0, item);
    this._renderIOTags();
  },

  _ioDragEnd(e) {
    document.querySelectorAll('.io-port-row').forEach(r => {
      r.classList.remove('dragging', 'drag-over');
    });
    window._ioDragInfo = null;
  },

  renameIO(dir, idx, name) {
    const arr = dir === 'in' ? window._tempInputs : window._tempOutputs;
    if (arr[idx]) arr[idx].name = name.trim() || arr[idx].name;
  },

  cycleSigType(dir, idx) {
    const arr   = dir === 'in' ? window._tempInputs : window._tempOutputs;
    const types = ['audio', 'cv', 'gate'];
    const cur   = arr[idx].sigType || 'audio';
    arr[idx].sigType = types[(types.indexOf(cur) + 1) % types.length];
    this._renderIOTags();
  },

  updateIOSigGuess(dir) {
    const field = document.getElementById(dir === 'in' ? 'input-add-field' : 'output-add-field');
    const sel   = document.getElementById(dir === 'in' ? 'input-sig-type' : 'output-sig-type');
    if (sel) sel.value = this._guessSigType(field.value);
  },

  addIO(dir) {
    const field   = document.getElementById(dir === 'in' ? 'input-add-field' : 'output-add-field');
    const sigSel  = document.getElementById(dir === 'in' ? 'input-sig-type' : 'output-sig-type');
    const v       = field.value.trim();
    if (!v) return;
    const sigType = sigSel ? sigSel.value : this._guessSigType(v);
    const port    = { name: v, sigType };
    if (dir === 'in') window._tempInputs.push(port); else window._tempOutputs.push(port);
    field.value = '';
    if (sigSel) sigSel.value = 'audio';
    this._renderIOTags();
  },

  removeIO(dir, idx) {
    if (dir === 'in') window._tempInputs.splice(idx, 1);
    else              window._tempOutputs.splice(idx, 1);
    this._renderIOTags();
  },

  saveModule() {
    const name = document.getElementById('m-name').value.trim();
    if (!name) { document.getElementById('m-name').focus(); return; }
    const mod = {
      maker:      document.getElementById('m-maker').value.trim() || 'Unknown',
      name,
      hp:         parseInt(document.getElementById('m-hp').value) || 8,
      cat:        document.getElementById('m-cat').value,
      inputs:     window._tempInputs.map(p  => typeof p === 'object' ? p : { name: p, sigType: 'audio' }),
      outputs:    window._tempOutputs.map(p => typeof p === 'object' ? p : { name: p, sigType: 'audio' }),
      paramDefs:  window._tempParamDefs || [],
      color:      document.getElementById('m-color').dataset.cleared === '1' ? null : (document.getElementById('m-color').value || null),
      paramCols:  parseInt(document.getElementById('m-param-cols').value) || 3,
      power12p:   parseFloat(document.getElementById('m-p12p').value) || 0,
      power12n:   parseFloat(document.getElementById('m-p12n').value) || 0,
      power5:     parseFloat(document.getElementById('m-p5').value)   || 0
    };
    if (window._editModuleId) {
      const existing = Store.state.modules.find(x => x.id === window._editModuleId);
      if (existing) {
        Object.assign(existing, mod);
        Store._saveModules(); // shared module library — must save separately
        Store.save();
        Undo.snapshot();
        this.fullRender();
        this.closeModal();
        this.setStatus(name + ' updated');
        return;
      }
    }
    Store.addModule(mod);
    Undo.snapshot();
    this.renderModuleLibrary();
    this.closeModal();
    this.setStatus(name + ' added to library');
  },

  _renderParamDefs() {
    const container = document.getElementById('param-defs-list');
    if (!container) return;
    const defs = window._tempParamDefs || [];
    container.innerHTML = defs.map((d, i) => d.type === 'divider' ? `
      <div class="pdef-row pdef-row-divider" draggable="true"
        ondragstart="App._pdefDragStart(${i}, event)"
        ondragover="App._pdefDragOver(${i}, event)"
        ondrop="App._pdefDrop(${i}, event)"
        ondragend="App._pdefDragEnd(event)"
        id="pdef-row-${i}">
        <span class="pdef-handle">⠿</span>
        <span class="pdef-divider-preview">─────────────────</span>
        <button class="pdef-del" onclick="App.removeParamDef(${i},event)">×</button>
      </div>` : `
      <div class="pdef-row" draggable="true"
        ondragstart="App._pdefDragStart(${i}, event)"
        ondragover="App._pdefDragOver(${i}, event)"
        ondrop="App._pdefDrop(${i}, event)"
        ondragend="App._pdefDragEnd(event)"
        id="pdef-row-${i}">
        <span class="pdef-handle" title="drag to reorder">⠿</span>
        <span class="pdef-type pdef-type-${d.type}">${d.type}</span>
        <span class="pdef-name">${d.name}</span>
        <span class="pdef-detail">${d.type==='knob' ? d.min+'–'+d.max : d.type==='enum' ? (d.options||'').substring(0,20) : ''}</span>
        <button class="pdef-edit" onclick="App.editParamDef(${i},event)" title="edit">✎</button>
        <button class="pdef-del" onclick="App.removeParamDef(${i},event)">×</button>
      </div>`).join('') || '<div class="pdef-empty">no parameters defined</div>';
    window._pdefDragIdx = null;
  },

  editParamDef(i, e) {
    if (e) e.stopPropagation();
    const d = window._tempParamDefs[i];
    if (!d) return;
    // Fill the add-form with existing values
    document.getElementById('pdef-name').value = d.name;
    document.getElementById('pdef-type').value = d.type;
    this.onParamDefTypeChange();
    if (d.type === 'knob') {
      document.getElementById('pdef-min').value     = d.min ?? 0;
      document.getElementById('pdef-max').value     = d.max ?? 100;
      document.getElementById('pdef-default').value = d.default ?? 0;
    }
    if (d.type === 'toggle') {
      document.getElementById('pdef-toggle-default').value = d.default ? 'on' : 'off';
    }
    if (d.type === 'enum') {
      document.getElementById('pdef-options').value = d.options || '';
    }
    // Remove old entry — user clicks + to re-add with changes
    window._tempParamDefs.splice(i, 1);
    this._renderParamDefs();
    document.getElementById('pdef-name').focus();
    document.getElementById('pdef-name').select();
  },

  _pdefDragStart(i, e) {
    window._pdefDragIdx = i;
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => document.getElementById('pdef-row-' + i)?.classList.add('dragging'), 0);
  },

  _pdefDragOver(i, e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    document.querySelectorAll('.pdef-row').forEach(r => r.classList.remove('drag-over'));
    document.getElementById('pdef-row-' + i)?.classList.add('drag-over');
  },

  _pdefDrop(i, e) {
    e.preventDefault();
    const from = window._pdefDragIdx;
    if (from === null || from === i) return;
    const defs = window._tempParamDefs;
    const item = defs.splice(from, 1)[0];
    defs.splice(i, 0, item);
    this._renderParamDefs();
  },

  _pdefDragEnd(e) {
    document.querySelectorAll('.pdef-row').forEach(r => {
      r.classList.remove('dragging', 'drag-over');
    });
    window._pdefDragIdx = null;
  },

  addParamDef(e) {
    if (e) e.stopPropagation();
    const name = document.getElementById('pdef-name').value.trim();
    const type = document.getElementById('pdef-type').value;
    if (!name) { document.getElementById('pdef-name').focus(); return; }
    const def = { name, type };
    if (type === 'knob') {
      def.min     = parseFloat(document.getElementById('pdef-min').value) || 0;
      def.max     = parseFloat(document.getElementById('pdef-max').value) || 100;
      def.default = parseFloat(document.getElementById('pdef-default').value) || def.min;
    }
    if (type === 'toggle') {
      def.default = document.getElementById('pdef-toggle-default').value === 'on';
    }
    if (type === 'enum') {
      def.options = document.getElementById('pdef-options').value.trim();
      def.default = def.options.split(',')[0]?.trim() || '';
    }
    if (type === 'text') {
      def.default = '';
    }
    window._tempParamDefs.push(def);
    document.getElementById('pdef-name').value = '';
    this._renderParamDefs();
  },

  addDivider(e) {
    if (e) e.stopPropagation();
    window._tempParamDefs.push({ type: 'divider', name: '' });
    this._renderParamDefs();
  },

  removeParamDef(i, e) {
    if (e) e.stopPropagation();
    window._tempParamDefs.splice(i, 1);
    this._renderParamDefs();
  },

  onParamDefTypeChange() {
    const type = document.getElementById('pdef-type').value;
    document.getElementById('pdef-knob-fields').style.display   = type === 'knob'   ? 'grid'  : 'none';
    document.getElementById('pdef-toggle-fields').style.display = type === 'toggle' ? 'flex'  : 'none';
    document.getElementById('pdef-enum-fields').style.display   = type === 'enum'   ? 'block' : 'none';
    // text type has no extra fields
  },

  renderRackView() {
    const patch   = Store.getActivePatch();
    const modules = Store.state.modules;
    const el = document.getElementById('rack-content');
    if (!el) return;

    const CAT = { oscillator:'#8f86e8',filter:'#2aaa7a',envelope:'#d4963a',lfo:'#4a9fd4',vca:'#c45c82',sequencer:'#c8612a',effects:'#7aaa2a',utility:'#7a8a78','guitar pedal':'#c87850',placeholder:'#a0a0a0',other:'#7a8a78' };
    const HP_PX = 14; // pixels per HP unit
    const RACK_HP = 104;

    // Power consumption
    let plus12 = 0, minus12 = 0, plus5 = 0;
    const rows = [];
    let rowHP = 0, rowMods = [];

    patch.patchModules.forEach(pm => {
      const m = modules.find(x => x.id === pm.moduleId);
      if (!m) return;
      if (rowHP + m.hp > RACK_HP) { rows.push(rowMods); rowMods = []; rowHP = 0; }
      rowMods.push({ pm, m });
      rowHP += m.hp;
      plus12  += m.power12p || 0;
      minus12 += m.power12n || 0;
      plus5   += m.power5   || 0;
    });
    if (rowMods.length) rows.push(rowMods);

    const totalHP = patch.patchModules.reduce((s, pm) => {
      const m = modules.find(x => x.id === pm.moduleId);
      return s + (m ? m.hp : 0);
    }, 0);

    el.innerHTML = `
      <div style="margin-bottom:10px;display:flex;align-items:center;gap:12px;flex-wrap:wrap">
        <span style="font-size:11px;color:var(--text1)">${totalHP}hp total · ${Math.ceil(totalHP/RACK_HP)} row(s)</span>
        ${plus12||minus12||plus5 ? `
        <span style="font-size:10px;color:var(--text2)">
          +12V: <strong style="color:var(--text0)">${plus12}mA</strong> ·
          −12V: <strong style="color:var(--text0)">${minus12}mA</strong> ·
          +5V: <strong style="color:var(--text0)">${plus5}mA</strong>
        </span>` : '<span style="font-size:10px;color:var(--text2)">add power data to modules to see consumption</span>'}
      </div>
      ${rows.map(row => `
        <div class="rack-row">
          ${row.map(({pm, m}) => {
            const col = m.color || CAT[m.cat] || '#888';
            const w   = m.hp * HP_PX;
            return `<div class="rack-module" style="width:${w}px;border-top:3px solid ${col}" title="${m.maker} ${m.name} · ${m.hp}hp">
              <div class="rack-mod-name">${m.name}${pm.instance > 1 ? '<small>#'+pm.instance+'</small>' : ''}</div>
              <div class="rack-mod-hp">${m.hp}hp</div>
            </div>`;
          }).join('')}
          <div class="rack-gap" style="flex:1;min-width:0"></div>
        </div>`).join('')}
      ${!patch.patchModules.length ? '<p class="empty-hint">add modules to patch first</p>' : ''}`;
  },

  deleteModule(id, e) {
    if (e) e.stopPropagation();
    const m = Store.state.modules.find(x => x.id === id);
    const inPatches = Store.state.patches.filter(p => p.patchModules.find(pm => pm.moduleId === id)).length;
    const warning = inPatches > 0 ? `\n⚠ Used in ${inPatches} patch(es) — will be removed there too.` : '';
    if (!confirm('Delete "' + (m ? m.name : 'module') + '" from library?' + warning)) return;
    Store.deleteModule(id);
    if (this.selectedModuleId === id) this.selectedModuleId = null;
    this.fullRender();
    this.setStatus((m ? m.name : 'module') + ' deleted from library');
  }
};

window.addEventListener('DOMContentLoaded', () => App.init().catch(e => console.error('Init failed:', e)));
