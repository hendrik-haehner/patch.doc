const Media = {

  async render() {
    const patch = Store.getActivePatch();
    const el    = document.getElementById('media-content');
    if (!el) return;

    // The server variant needs /api/media/*; the plain GitHub Pages build
    // has no server at all. The Tauri desktop build is ALSO PATCHDOC_STATIC
    // (no server), but has real filesystem access via window.__TAURI__, so
    // it gets the real feature instead of this notice.
    if (window.PATCHDOC_STATIC && !IO.isTauri()) {
      el.innerHTML = `<div style="padding:24px 0;text-align:center">
        <div style="font-size:32px;margin-bottom:12px;opacity:0.4">📷</div>
        <div style="font-size:13px;color:var(--text1);margin-bottom:8px">
          Photo/audio upload is not available in the browser version.
        </div>
        <div style="font-size:12px;color:var(--text2);line-height:1.6">
          For media attachments, use the self-hosted Docker version.<br>
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

    let files = [];
    try {
      files = IO.isTauri() ? await this._listTauri(patch) : await this._listServer(patch);
    } catch(e) {
      el.innerHTML = '<div style="font-size:11px;color:var(--danger)">could not load media</div>';
      return;
    }

    const photos = files.filter(f => f.type.startsWith('image/'));
    const audio  = files.filter(f => f.type.startsWith('audio/'));

    const tauriUploadAttr = kind => IO.isTauri()
      ? ` onclick="event.preventDefault();Media.uploadTauri('${patch.id}','${kind}')"` : '';

    el.innerHTML = `
      <div class="media-upload-row">
        <label class="btn-action primary" style="cursor:pointer"${tauriUploadAttr('image')}>
          <i class="ti ti-photo-plus" aria-hidden="true"></i> add photo
          <input type="file" accept="image/*" multiple style="display:none"
            onchange="Media.upload(event, '${patch.id}')">
        </label>
        <label class="btn-action primary" style="cursor:pointer"${tauriUploadAttr('audio')}>
          <i class="ti ti-music-plus" aria-hidden="true"></i> add audio
          <input type="file" accept="audio/*" multiple style="display:none"
            onchange="Media.upload(event, '${patch.id}')">
        </label>
        <span id="media-upload-status" style="font-size:11px;color:var(--text2)"></span>
      </div>

      ${photos.length ? `
      <div class="media-section">
        <div class="media-section-label">PHOTOS</div>
        <div class="media-photo-grid" id="photo-grid">
          ${photos.map(f => this._photoCard(f, patch.id)).join('')}
        </div>
      </div>` : ''}

      ${audio.length ? `
      <div class="media-section">
        <div class="media-section-label">AUDIO</div>
        <div class="media-audio-list">
          ${audio.map(f => this._audioCard(f, patch.id)).join('')}
        </div>
      </div>` : ''}

      ${!files.length ? '<div class="media-empty">no media yet — upload photos or audio recordings of your patch</div>' : ''}
    `;
  },

  async _listServer(patch) {
    const res = await fetch(`/api/media/${patch.id}`);
    return await res.json();
  },

  // Metadata lives in the patch itself (patch.media, an id-keyed dict —
  // synced/persisted exactly like everything else in Store), the actual
  // bytes live on disk under this app's data directory. Listing never
  // touches the filesystem: it's just reading that dict. Display (img/
  // audio src) resolves straight to an asset:// URL Tauri can stream from
  // disk directly — no need to read bytes into JS for that.
  async _listTauri(patch) {
    const meta = patch.media || {};
    const dir = await this._tauriDir(patch.id);
    return Object.entries(meta).map(([id, m]) => ({
      id, name: m.name, type: m.type, size: m.size,
      url: window.__TAURI__.core.convertFileSrc(`${dir}/${id}`),
    }));
  },

  async _tauriDir(patchId) {
    // Once NAS sync is active (see nassync.js), media lives under the
    // shared NAS folder instead of this device's own app-data dir.
    if (typeof NasSync !== 'undefined' && NasSync.isEnabled()) {
      return await NasSync.ensureMediaDir(patchId);
    }
    // Patch ids are already strings, but the Rust side takes a String and
    // won't silently coerce a number — stringify defensively either way.
    return await window.__TAURI__.core.invoke('local_data_dir', { category: 'media', id: String(patchId) });
  },

  _mimeFor(ext) {
    return {
      png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', webp: 'image/webp',
      mp3: 'audio/mpeg', wav: 'audio/wav', m4a: 'audio/mp4', aac: 'audio/aac', ogg: 'audio/ogg', flac: 'audio/flac',
    }[ext] || 'application/octet-stream';
  },

  _uid() {
    return (window.crypto?.randomUUID ? crypto.randomUUID() : Date.now() + '-' + Math.random().toString(36).slice(2));
  },

  _photoCard(f, patchId) {
    return `<div class="media-photo-card" id="photo-${f.id}">
      <img src="${f.url}" alt="${f.name}" onclick="Media.lightbox('${f.url}', '${f.name}')">
      <div class="media-card-footer">
        <input class="media-name-input" type="text" value="${f.name}"
          onchange="Media.rename('${patchId}','${f.id}',this.value,'${f.type}')"
          onclick="event.stopPropagation()">
        <button class="media-del-btn" onclick="Media.deleteFile('${patchId}','${f.id}')" aria-label="delete">×</button>
      </div>
    </div>`;
  },

  _audioCard(f, patchId) {
    const size = f.size > 1024*1024
      ? (f.size/1024/1024).toFixed(1) + ' MB'
      : (f.size/1024).toFixed(0) + ' KB';
    return `<div class="media-audio-card" id="audio-${f.id}">
      <div class="media-audio-info">
        <i class="ti ti-file-music" aria-hidden="true"></i>
        <input class="media-name-input" type="text" value="${f.name}"
          onchange="Media.rename('${patchId}','${f.id}',this.value,'${f.type}')"
          onclick="event.stopPropagation()">
        <span class="media-size">${size}</span>
        <button class="media-del-btn" onclick="Media.deleteFile('${patchId}','${f.id}')" aria-label="delete">×</button>
      </div>
      <audio controls src="${f.url}" style="width:100%;margin-top:6px;height:32px"></audio>
    </div>`;
  },

  upload(event, patchId) {
    const files  = Array.from(event.target.files);
    const status = document.getElementById('media-upload-status');
    if (!files.length) return;

    let done = 0;
    const uploadNext = (i) => {
      if (i >= files.length) {
        if (status) status.textContent = `✓ ${done} file${done !== 1 ? 's' : ''} uploaded`;
        setTimeout(() => { if (status) status.textContent = ''; }, 3000);
        this.render();
        return;
      }
      const file = files[i];
      if (status) status.textContent = `uploading ${i + 1}/${files.length}: ${file.name}…`;

      const form = new FormData();
      form.append('file', file);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', `/api/media/${patchId}`);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable && status) {
          const pct = Math.round(e.loaded / e.total * 100);
          status.textContent = `uploading ${i + 1}/${files.length}: ${pct}%`;
        }
      };

      xhr.onload = () => {
        if (xhr.status !== 200) {
          if (status) status.textContent = `upload failed: HTTP ${xhr.status}`;
          return;
        }
        try {
          const uploaded = JSON.parse(xhr.responseText);
          // Save metadata
          fetch(`/api/media/${patchId}/${uploaded.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: file.name, type: file.type })
          }).then(() => {
            done++;
            uploadNext(i + 1);
          });
        } catch(e) {
          if (status) status.textContent = 'upload failed: ' + e.message;
        }
      };

      xhr.onerror = () => {
        if (status) status.textContent = 'upload failed: network error';
      };

      xhr.send(form);
    };

    uploadNext(0);
  },

  // Tauri counterpart of upload() — same "add photo"/"add audio" buttons,
  // but a plain <input type="file"> can't be used here (its FileList
  // stays empty after picking in this WKWebView build, see io.js), so
  // this reads each picked file through Tauri's dialog+fs plugins and
  // writes it into this patch's media directory.
  async uploadTauri(patchId, kind) {
    const status = document.getElementById('media-upload-status');
    try {
      const filters = kind === 'image'
        ? [{ name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'gif', 'webp'] }]
        : [{ name: 'Audio', extensions: ['mp3', 'wav', 'm4a', 'aac', 'ogg', 'flac'] }];
      const picked = await window.__TAURI__.dialog.open({ multiple: true, filters });
      if (!picked) return; // user canceled
      const paths = Array.isArray(picked) ? picked : [picked];
      const dir = await this._tauriDir(patchId);
      const patch = Store.state.patches.find(p => p.id === patchId);
      const media = { ...(patch.media || {}) };

      for (let i = 0; i < paths.length; i++) {
        const srcPath = paths[i];
        const name = srcPath.split(/[\\/]/).pop();
        if (status) status.textContent = `uploading ${i + 1}/${paths.length}: ${name}…`;
        const bytes = await window.__TAURI__.fs.readFile(srcPath);
        const ext = (name.split('.').pop() || '').toLowerCase();
        const id = this._uid() + '.' + ext;
        await window.__TAURI__.fs.writeFile(`${dir}/${id}`, bytes);
        media[id] = { name, type: this._mimeFor(ext), size: bytes.length };
      }

      Store.updatePatch(patchId, { media });
      if (status) {
        status.textContent = `✓ ${paths.length} file${paths.length !== 1 ? 's' : ''} uploaded`;
        setTimeout(() => { if (status) status.textContent = ''; }, 3000);
      }
      this.render();
    } catch (err) {
      console.error('PATCH.doc media upload error (Tauri):', err);
      if (status) status.textContent = 'upload failed: ' + (err.message || err);
    }
  },

  async rename(patchId, fileId, name, type) {
    if (IO.isTauri()) {
      const patch = Store.state.patches.find(p => p.id === patchId);
      if (!patch?.media?.[fileId]) return;
      const media = { ...patch.media, [fileId]: { ...patch.media[fileId], name } };
      Store.updatePatch(patchId, { media });
      return;
    }
    await fetch(`/api/media/${patchId}/${fileId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, type })
    });
  },

  async deleteFile(patchId, fileId) {
    if (!(await IO.confirmAsync('Delete this file?'))) return;
    if (IO.isTauri()) {
      try {
        const dir = await this._tauriDir(patchId);
        await window.__TAURI__.fs.remove(`${dir}/${fileId}`);
      } catch (err) {
        console.error('PATCH.doc media delete error (Tauri):', err);
      }
      const patch = Store.state.patches.find(p => p.id === patchId);
      if (patch?.media) {
        const media = { ...patch.media };
        delete media[fileId];
        Store.updatePatch(patchId, { media });
      }
      this.render();
      return;
    }
    await fetch(`/api/media/${patchId}/${fileId}`, { method: 'DELETE' });
    this.render();
  },

  lightbox(url, name) {
    const lb = document.createElement('div');
    lb.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:1000;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:12px;cursor:zoom-out';
    lb.onclick = () => lb.remove();
    const img = document.createElement('img');
    img.src = url;
    img.style.cssText = 'max-width:90vw;max-height:85vh;border-radius:6px;object-fit:contain';
    const caption = document.createElement('div');
    caption.textContent = name;
    caption.style.cssText = 'font-size:12px;color:rgba(255,255,255,0.6);font-family:var(--font)';
    lb.appendChild(img);
    lb.appendChild(caption);
    document.body.appendChild(lb);
  }
};
