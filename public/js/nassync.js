// NAS sync — lets the Tauri desktop app read/write its data straight from a
// self-hosted PATCH.doc server's /data folder (mounted as a normal network
// share, e.g. SMB/NFS from a NAS) instead of the WebView's own localStorage.
// No server-side code is involved: server.js already reads state.json/
// modules.json fresh off disk on every request (no in-memory cache), so
// writing into the same files from here is picked up immediately by anyone
// using the web app against that server.
//
// Mirrors the server's own /data layout exactly:
//   <root>/modules.json          — shared module library
//   <root>/manuals/<moduleId>/   — shared PDF manuals
//   <root>/users/<username>/state.json  — your patches
//   <root>/users/<username>/media/<patchId>/ — your photos/audio
//
// The user picks <root> once via the dialog plugin with {recursive:true},
// which grants this app filesystem scope for everything nested under it —
// tauri-plugin-persisted-scope (see lib.rs) remembers that grant across
// restarts, so this is a one-time setup, not a per-session re-pick.
//
// Only the *pointer* (root path + username) lives in localStorage — same as
// the theme toggle or the AI module draft's API key, a per-device
// preference, never synced. The actual data lives entirely in the shared
// files this points at.

const NasSync = (() => {
  const ROOT_KEY = 'patchdoc_nas_sync_root';
  const USER_KEY = 'patchdoc_nas_sync_username';

  const _stateMtime   = { current: null };
  const _modulesMtime = { current: null };

  function root()     { try { return localStorage.getItem(ROOT_KEY) || ''; } catch(e) { return ''; } }
  function username()  { try { return localStorage.getItem(USER_KEY) || ''; } catch(e) { return ''; } }

  function isEnabled() {
    return typeof IO !== 'undefined' && IO.isTauri() && !!root() && !!username();
  }

  function _join(...parts) { return parts.filter(Boolean).join('/'); }
  function statePath()          { return _join(root(), 'users', username(), 'state.json'); }
  function modulesPath()        { return _join(root(), 'modules.json'); }
  function mediaDir(patchId)    { return _join(root(), 'users', username(), 'media', String(patchId)); }
  function manualsDir(moduleId) { return _join(root(), 'manuals', String(moduleId)); }

  async function ensureMediaDir(patchId) {
    const dir = mediaDir(patchId);
    await window.__TAURI__.fs.mkdir(dir, { recursive: true });
    return dir;
  }
  async function ensureManualsDir(moduleId) {
    const dir = manualsDir(moduleId);
    await window.__TAURI__.fs.mkdir(dir, { recursive: true });
    return dir;
  }

  async function _statMtime(path) {
    try {
      const info = await window.__TAURI__.fs.stat(path);
      return info.mtime ? info.mtime.getTime() : null;
    } catch(e) { return null; }
  }

  async function _readJSON(path, mtimeRef) {
    const exists = await window.__TAURI__.fs.exists(path);
    if (!exists) { mtimeRef.current = null; return null; }
    const raw = await window.__TAURI__.fs.readTextFile(path);
    mtimeRef.current = await _statMtime(path);
    return JSON.parse(raw);
  }

  // The one real hazard of two writers (this app + the NAS web app) sharing
  // one file: if the file changed on disk since we last read it, someone
  // else's write is sitting there — silently overwriting it would lose
  // those changes. This isn't a merge, just "refuse and say so" instead.
  async function _writeJSON(path, data, mtimeRef) {
    if (mtimeRef.current != null) {
      const diskTime = await _statMtime(path);
      if (diskTime != null && diskTime > mtimeRef.current) {
        throw new Error('changed on disk since last load — reload the app to pick up the other change first');
      }
    }
    const dir = path.slice(0, path.lastIndexOf('/'));
    await window.__TAURI__.fs.mkdir(dir, { recursive: true });
    await window.__TAURI__.fs.writeTextFile(path, JSON.stringify(data, null, 2));
    mtimeRef.current = await _statMtime(path);
  }

  async function readState()          { return _readJSON(statePath(), _stateMtime); }
  async function readModules()        { return _readJSON(modulesPath(), _modulesMtime); }
  async function writeState(data)     { return _writeJSON(statePath(), data, _stateMtime); }
  async function writeModules(data)   { return _writeJSON(modulesPath(), data, _modulesMtime); }

  // Copies any existing local (pre-NAS-sync, $APPDATA-based) patch media
  // into the newly-chosen shared location, once — otherwise switching over
  // looks like every photo just vanished. Only meaningful on first
  // activation (an existing NAS state.json means this root+user was
  // already set up before, so its media should already be there). Module
  // manuals are handled separately by _mergeModuleLibraries/
  // _applyModuleFileCopies below — unlike patches, the module library is
  // shared, so it needs actual matching, not a flat "first time only" copy.
  async function _migrateLocalFiles(localState) {
    for (const patch of localState.patches || []) {
      const ids = Object.keys(patch.media || {});
      if (!ids.length) continue;
      const oldDir = await window.__TAURI__.core.invoke('local_data_dir', { category: 'media', id: String(patch.id) });
      const newDir = await ensureMediaDir(patch.id);
      for (const id of ids) {
        try {
          const bytes = await window.__TAURI__.fs.readFile(`${oldDir}/${id}`);
          await window.__TAURI__.fs.writeFile(`${newDir}/${id}`, bytes);
        } catch(e) { console.warn('NasSync: could not migrate media file', id, e); }
      }
    }
  }

  function _normKey(m) { return (m.name || '').trim().toLowerCase() + '|' + (m.maker || '').trim().toLowerCase(); }
  function _manualKey(entry) { return entry.kind + '|' + (entry.name || '').trim().toLowerCase(); }

  // The module library (modules.json) is shared across every user of a NAS
  // root, so by the time anyone activates NAS sync from the desktop app it
  // very likely already exists — e.g. from using the self-hosted server's
  // web app. Rather than either "local wins" or "NAS wins" (either one
  // makes whatever's only on the losing side look like it vanished), match
  // modules by name+maker (same approach as Manuals.importFromNAS(), which
  // already has to solve the same "two independent id sequences" problem)
  // and add whatever's only on this device — additive only, nothing
  // already on the NAS side is ever removed or overwritten.
  //
  // This only merges module identity (name, maker, ports, paramDefs,
  // panel, color, …) — manuals are handled entirely separately by
  // _migrateManualsToShared below, since (see manuals.js's Tauri-build
  // comment) the server keeps those in per-module sidecar files, not in
  // modules.json at all; a module.manuals field here would just be dead
  // weight nothing ever reads back.
  //
  // Patches (state.json) deliberately aren't merged this way: a patch's id
  // is just this device's own patch counter, so two devices' patch #3 are
  // no more likely to be "the same patch" than two random numbers — unlike
  // a module's name+maker, there's no reliable identity to match on.
  function _mergeModuleLibraries(localModules, nasModules, nasNextModuleId) {
    const nasByKey = new Map(nasModules.map(m => [_normKey(m), m]));
    const usedIds = new Set(nasModules.map(m => m.id));
    let nextId = Number(nasNextModuleId) || 24;
    for (const m of nasModules) nextId = Math.max(nextId, m.id + 1);

    const result = nasModules.map(m => { const { manuals, ...rest } = m; return rest; });
    // Every local module's id in the *final* merged list — whether it kept
    // its own id, adopted a matched NAS module's id, or got a fresh one to
    // dodge a collision. Manual migration and patch remapping both need
    // this, for every module, not just the ones that actually changed.
    const localToFinalId = new Map();
    // Subset of the above where the id actually changed — local patches
    // placing that module by its old id need to follow, or it'd just
    // disappear from the patch on next render.
    const idMap = new Map();
    let changed = false;

    for (const local of localModules || []) {
      const match = nasByKey.get(_normKey(local));
      if (!match) {
        // Nothing by this name+maker on the NAS side yet — add it as a new
        // module, keeping its own id unless that id's already taken.
        let newId = local.id;
        if (usedIds.has(newId)) { newId = nextId++; } else { nextId = Math.max(nextId, newId + 1); }
        usedIds.add(newId);
        localToFinalId.set(local.id, newId);
        if (newId !== local.id) idMap.set(local.id, newId);
        const { manuals, ...rest } = local;
        result.push({ ...rest, id: newId });
        changed = true;
        continue;
      }
      // Matched by name+maker — the NAS copy stays the module of record
      // (its id, ports, params etc. are untouched).
      localToFinalId.set(local.id, match.id);
      if (match.id !== local.id) idMap.set(local.id, match.id);
    }

    return { modules: result, nextModuleId: nextId, idMap, localToFinalId, changed };
  }

  // Local patches place modules by id — if _mergeModuleLibraries gave a
  // module a different id (matched an existing NAS module, or resolved an
  // id collision), any patch referencing the old id needs to follow, or
  // that module would just silently vanish from the patch on next render.
  function _remapPatchModuleIds(patches, idMap) {
    if (!idMap.size) return patches;
    return (patches || []).map(patch => ({
      ...patch,
      patchModules: (patch.patchModules || []).map(pm =>
        idMap.has(pm.moduleId) ? { ...pm, moduleId: idMap.get(pm.moduleId) } : pm
      ),
    }));
  }

  // Folds this device's local-only manuals (module.manuals — see
  // manuals.js) into the shared sidecar-file format at each module's
  // *final* (post-merge) id — additive only, deduped by kind+name so
  // re-adding "the same" PDF on both sides doesn't show up twice. Must run
  // after modules.json is written (so a failure here can't leave manuals
  // pointing at a module list that was never saved), which is also why
  // this lives here rather than inside _mergeModuleLibraries — it needs
  // the settled final ids, not just the plan for them.
  async function _migrateManualsToShared(localModules, localToFinalId) {
    for (const local of localModules || []) {
      const entries = Object.entries(local.manuals || {});
      if (!entries.length) continue;
      const targetId = localToFinalId.get(local.id);
      const newDir = await ensureManualsDir(targetId);
      const meta  = await Manuals._readSidecarJSON(`${newDir}/.meta.json`);
      const links = await Manuals._readSidecarJSON(`${newDir}/.links.json`);
      const already = new Set([
        ...Object.values(meta).map(v => _manualKey({ kind: 'file', name: v.name })),
        ...Object.values(links).map(v => _manualKey({ kind: 'link', name: v.name })),
      ]);
      let metaChanged = false, linksChanged = false, oldDir = null;
      for (const [fileId, entry] of entries) {
        const k = _manualKey(entry);
        if (already.has(k)) continue;
        already.add(k);
        if (entry.kind === 'link') {
          links[fileId] = { name: entry.name, url: entry.url };
          linksChanged = true;
          continue;
        }
        try {
          if (!oldDir) oldDir = await window.__TAURI__.core.invoke('local_data_dir', { category: 'manuals', id: String(local.id) });
          const bytes = await window.__TAURI__.fs.readFile(`${oldDir}/${fileId}`);
          await window.__TAURI__.fs.writeFile(`${newDir}/${fileId}`, bytes);
          meta[fileId] = { name: entry.name, type: entry.type || 'application/pdf' };
          metaChanged = true;
        } catch(e) { console.warn('NasSync: could not migrate manual file', fileId, e); }
      }
      if (metaChanged)  await Manuals._writeSidecarJSON(`${newDir}/.meta.json`, meta);
      if (linksChanged) await Manuals._writeSidecarJSON(`${newDir}/.links.json`, links);
    }
  }

  function _setStatus(text, kind) {
    const el = document.getElementById('nas-sync-status');
    if (!el) return;
    el.textContent = text;
    el.style.color = kind === 'err' ? 'var(--danger)' : (kind === 'ok' ? 'var(--success)' : 'var(--text2)');
  }

  // Colors the topbar icon when active — called at app startup (App.init)
  // and again right after activate()/deactivate() so the icon reflects the
  // current state immediately instead of only after the next app restart.
  function updateTopbarButton() {
    const btn = document.getElementById('nas-sync-btn');
    if (!btn) return;
    const active = isEnabled();
    // --success (a literal green), not --accent (the UI's own theme color,
    // which is blue by default) — this is a connected/synced indicator,
    // the same "green = good" convention as any other sync status icon,
    // not a themed selection highlight like the active tab uses.
    btn.style.borderColor = active ? 'var(--success)' : '';
    btn.style.color       = active ? 'var(--success)' : '';
    btn.title = active ? 'NAS sync (active)' : 'NAS sync';
  }

  function open() {
    document.getElementById('nas-sync-root').value = root();
    document.getElementById('nas-sync-username').value = username();
    _setStatus(isEnabled() ? 'active — syncing with this folder' : 'not active', isEnabled() ? 'ok' : '');
    document.getElementById('nas-sync-modal').classList.add('open');
  }
  function close() {
    document.getElementById('nas-sync-modal').classList.remove('open');
  }

  async function chooseFolder() {
    try {
      // {recursive:true} is what grants fs scope for everything nested
      // under the picked folder, not just the top-level path — same
      // mechanism Manuals.importFromNAS() already relies on.
      const dir = await window.__TAURI__.dialog.open({ directory: true, recursive: true });
      if (!dir) return; // user canceled
      document.getElementById('nas-sync-root').value = dir;
    } catch(err) {
      _setStatus('folder picker failed: ' + (err.message || err), 'err');
    }
  }

  async function activate() {
    const rootPath = document.getElementById('nas-sync-root').value.trim();
    const user     = document.getElementById('nas-sync-username').value.trim();
    if (!rootPath || !user) { _setStatus('pick a folder and enter your NAS username first', 'err'); return; }

    _setStatus('connecting…', '');
    try { localStorage.setItem(ROOT_KEY, rootPath); localStorage.setItem(USER_KEY, user); } catch(e) {}
    _stateMtime.current = null;
    _modulesMtime.current = null;

    try {
      // Manual PDFs and media (photos/audio) load through window.__TAURI__.
      // core.convertFileSrc's asset:// protocol, not the fs plugin — that
      // has its own scope, separate from the fs scope the folder picker
      // already granted above, and it isn't extended automatically just by
      // picking a folder. Without this, thumbnails/audio/PDF previews for
      // anything under the NAS root silently fail to load.
      await window.__TAURI__.core.invoke('allow_nas_asset_scope', { path: rootPath });
      const localState = JSON.parse(JSON.stringify(Store.state));
      const existingState   = await readState();
      const existingModules = await readModules();

      const merged = _mergeModuleLibraries(
        localState.modules,
        (existingModules && existingModules.modules) || [],
        (existingModules && existingModules.nextModuleId) || localState.nextModuleId
      );
      if (!existingModules || merged.changed) {
        await writeModules({ modules: merged.modules, nextModuleId: merged.nextModuleId });
      }

      if (!existingState) {
        // A module the merge just matched onto an existing NAS module (or
        // renumbered to dodge an id collision) needs every local patch
        // that places it by its old id updated to match — otherwise it'd
        // just disappear from the patch, looking like data loss all over
        // again but for placed modules instead of manuals.
        await writeState({
          version: localState.version,
          patches: _remapPatchModuleIds(localState.patches, merged.idMap),
          activePatchId: localState.activePatchId, nextPatchNum: localState.nextPatchNum,
        });
      }
      // else: this NAS root already has patches under this username —
      // those stay authoritative (see _mergeModuleLibraries above for why
      // patches, unlike the module library just above, aren't merged).

      if (!existingState) await _migrateLocalFiles(localState);
      await _migrateManualsToShared(localState.modules, merged.localToFinalId);

      // Manuals._cache is keyed by module id and never expires on its own
      // — reusing an id across the activation (same module, now possibly
      // with different/merged manuals) would otherwise keep showing
      // whatever was cached from before this activation, with no way for
      // the user to tell the two apart short of restarting the app.
      if (typeof Manuals !== 'undefined') Manuals._cache = {};
      await Store.loadFromServer();
      App.fullRender();
      updateTopbarButton();
      _setStatus('active — syncing with this folder', 'ok');
      App.setStatus('NAS sync active');
    } catch(err) {
      console.error('NasSync activation failed:', err);
      _setStatus('failed: ' + (err.message || err), 'err');
      try { localStorage.removeItem(ROOT_KEY); localStorage.removeItem(USER_KEY); } catch(e) {}
      updateTopbarButton();
    }
  }

  // Non-destructive — just stops using the shared files, doesn't touch or
  // delete them. Falls back to whatever this device's own localStorage
  // last had before NAS sync was turned on.
  async function deactivate() {
    try { localStorage.removeItem(ROOT_KEY); localStorage.removeItem(USER_KEY); } catch(e) {}
    _stateMtime.current = null;
    _modulesMtime.current = null;
    if (typeof Manuals !== 'undefined') Manuals._cache = {}; // see activate() for why
    await Store.loadFromServer();
    App.fullRender();
    updateTopbarButton();
    _setStatus('not active', '');
    App.setStatus('NAS sync deactivated — back to local storage on this device');
  }

  return {
    isEnabled, root, username,
    statePath, modulesPath, mediaDir, manualsDir, ensureMediaDir, ensureManualsDir,
    readState, readModules, writeState, writeModules,
    open, close, chooseFolder, activate, deactivate, updateTopbarButton,
    _mergeModuleLibraries, // exposed for tests only
  };
})();
