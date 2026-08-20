// Custom theme editor — lets users tweak the app's ~19 CSS color tokens
// with a live-applied color+alpha picker per token, grouped like the
// theme's own definition in style.css. Persisted to localStorage only
// (same as the theme toggle itself), not synced via Store — it's a
// per-browser display preference, not patch data.

const ThemeEditor = (() => {
  const KEY = 'patchdoc_custom_theme';

  const TOKENS = [
    { key: 'bg0',            label: 'Hintergrund 0',            group: 'Hintergründe' },
    { key: 'bg1',            label: 'Hintergrund 1',            group: 'Hintergründe' },
    { key: 'bg2',            label: 'Hintergrund 2',            group: 'Hintergründe' },
    { key: 'bg3',            label: 'Hintergrund 3',            group: 'Hintergründe' },
    { key: 'chrome-bg',      label: 'Chrome (Topbar/Sidebar)',  group: 'Hintergründe' },
    { key: 'canvas-bg',      label: 'Canvas',                   group: 'Hintergründe' },
    { key: 'module-bg',      label: 'Modul-Hintergrund',        group: 'Hintergründe' },
    { key: 'text0',          label: 'Text (primär)',            group: 'Text' },
    { key: 'text1',          label: 'Text (sekundär)',          group: 'Text' },
    { key: 'text2',          label: 'Text (schwach)',           group: 'Text' },
    { key: 'border',         label: 'Rahmen (fein)',            group: 'Rahmen' },
    { key: 'border2',        label: 'Rahmen (stark)',           group: 'Rahmen' },
    { key: 'module-border',  label: 'Modul-Rahmen',             group: 'Rahmen' },
    { key: 'accent',         label: 'Akzent',                   group: 'Akzent' },
    { key: 'accent-bg',      label: 'Akzent-Hintergrund',       group: 'Akzent' },
    { key: 'accent-border',  label: 'Akzent-Rahmen',            group: 'Akzent' },
    { key: 'success',        label: 'Erfolg',                   group: 'Status' },
    { key: 'danger',         label: 'Fehler',                   group: 'Status' },
    { key: 'dot-color',      label: 'Punktraster',              group: 'Sonstiges' },
  ];
  const TOKEN_KEYS = TOKENS.map(t => t.key);
  const GROUPS = [...new Set(TOKENS.map(t => t.group))];

  // Mirrors the :root/[data-theme="studio"] and [data-theme="studio-light"]
  // blocks in style.css — used to seed a fresh custom theme and for the
  // "start from dark/light" reset buttons. Not read from the DOM because a
  // reset must work even for the theme that isn't currently active.
  const PRESETS = {
    studio: {
      bg0: '#1e1e1e', bg1: '#262626', bg2: '#2e2e2e', bg3: '#383838',
      'chrome-bg': '#161616', 'canvas-bg': '#252523', 'module-bg': '#1a1a1a',
      border: 'rgba(255,255,255,0.07)', border2: 'rgba(255,255,255,0.14)',
      'module-border': 'rgba(255,255,255,0.26)',
      text0: '#e8e8e8', text1: '#9a9a9a', text2: '#6a6a6a',
      accent: '#4772b3', 'accent-bg': 'rgba(71,114,179,0.14)', 'accent-border': 'rgba(71,114,179,0.45)',
      'dot-color': '#383838', success: '#6fa85c', danger: '#c4584a',
    },
    'studio-light': {
      bg0: '#f4f4f4', bg1: '#ebebeb', bg2: '#e0e0e0', bg3: '#d2d2d2',
      'chrome-bg': '#d8d8d8', 'canvas-bg': '#f8f8f6', 'module-bg': '#e4e4e2',
      border: 'rgba(0,0,0,0.1)', border2: 'rgba(0,0,0,0.2)', 'module-border': 'rgba(0,0,0,0.2)',
      text0: '#1c1c1c', text1: '#5c5c5c', text2: '#8c8c8c',
      accent: '#2f5d9e', 'accent-bg': 'rgba(47,93,158,0.1)', 'accent-border': 'rgba(47,93,158,0.4)',
      'dot-color': '#b4b4b4', success: '#4f7a3e', danger: '#a8402f',
    },
  };

  let _custom = null; // in-memory cache of the saved/edited token map

  function _load() {
    if (_custom) return _custom;
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) { _custom = JSON.parse(raw); return _custom; }
    } catch(e) {}
    _custom = { ...PRESETS.studio };
    return _custom;
  }

  function _save() {
    try { localStorage.setItem(KEY, JSON.stringify(_custom)); } catch(e) {}
  }

  function _rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, '0')).join('');
  }
  function _hexToRgb(hex) {
    const h = hex.replace('#', '');
    return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) };
  }
  // Splits any token's CSS color string into a plain hex (for <input
  // type="color">, which has no alpha channel) and a separate 0–1 alpha —
  // the two are recombined into one rgba()/hex string by _compose().
  function _hexAlpha(cssVal) {
    if (!cssVal) return { hex: '#000000', alpha: 1 };
    const m = cssVal.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)/);
    if (m) {
      const [, r, g, b, a] = m;
      return { hex: _rgbToHex(+r, +g, +b), alpha: a !== undefined ? +a : 1 };
    }
    if (/^#[0-9a-f]{6}$/i.test(cssVal)) return { hex: cssVal, alpha: 1 };
    if (/^#[0-9a-f]{3}$/i.test(cssVal)) {
      const h = cssVal.slice(1).split('').map(c => c + c).join('');
      return { hex: '#' + h, alpha: 1 };
    }
    return { hex: '#000000', alpha: 1 }; // unrecognized format — safe fallback
  }
  function _compose(hex, alpha) {
    if (alpha >= 1) return hex;
    const { r, g, b } = _hexToRgb(hex);
    return `rgba(${r},${g},${b},${Math.round(alpha * 100) / 100})`;
  }

  function applyCustomVars() {
    const c = _load();
    TOKEN_KEYS.forEach(k => {
      document.documentElement.style.setProperty('--' + k, c[k] || PRESETS.studio[k]);
    });
  }
  function clearCustomVars() {
    TOKEN_KEYS.forEach(k => document.documentElement.style.removeProperty('--' + k));
  }

  function setColor(key, hex) {
    const c = _load();
    const { alpha } = _hexAlpha(c[key]);
    c[key] = _compose(hex, alpha);
    _save();
    applyCustomVars();
    _syncJson();
  }
  function setAlpha(key, alphaPct) {
    const c = _load();
    const { hex } = _hexAlpha(c[key]);
    c[key] = _compose(hex, Math.max(0, Math.min(100, Number(alphaPct) || 0)) / 100);
    _save();
    applyCustomVars();
    _syncJson();
  }

  function resetFrom(presetName) {
    if (!PRESETS[presetName]) return;
    _custom = { ...PRESETS[presetName] };
    _save();
    applyCustomVars();
    _render();
    App.setStatus('custom theme reset from ' + (presetName === 'studio' ? 'dark' : 'light'));
  }

  function exportJson() {
    return JSON.stringify(_load(), null, 2);
  }

  function importJson(json) {
    try {
      const data = JSON.parse(json);
      const next = { ..._load() };
      let changed = 0;
      TOKEN_KEYS.forEach(k => { if (typeof data[k] === 'string') { next[k] = data[k]; changed++; } });
      if (!changed) throw new Error('no known tokens found');
      _custom = next;
      _save();
      applyCustomVars();
      _render();
      App.setStatus('custom theme imported (' + changed + ' token(s))');
    } catch(e) {
      App.setStatus('invalid theme JSON: ' + e.message);
    }
  }

  function _syncJson() {
    const el = document.getElementById('theme-editor-json');
    if (el) el.value = exportJson();
  }

  function _render() {
    const body = document.getElementById('theme-editor-body');
    if (!body) return;
    const c = _load();
    body.innerHTML = GROUPS.map(group => `
      <div class="theme-editor-group">
        <div class="theme-editor-group-label">${group}</div>
        ${TOKENS.filter(t => t.group === group).map(t => {
          const { hex, alpha } = _hexAlpha(c[t.key]);
          return `
          <div class="theme-editor-row">
            <span class="theme-editor-row-label">${t.label}</span>
            <input type="color" value="${hex}" oninput="ThemeEditor.setColor('${t.key}', this.value)" aria-label="${t.label}">
            <input type="number" class="theme-editor-alpha" min="0" max="100" value="${Math.round(alpha * 100)}"
                   oninput="ThemeEditor.setAlpha('${t.key}', this.value)" aria-label="${t.label} Deckkraft">
            <span class="theme-editor-alpha-unit">%</span>
          </div>`;
        }).join('')}
      </div>
    `).join('');
    _syncJson();
  }

  function open() {
    _load();
    document.getElementById('theme-editor-modal').classList.add('open');
    _render();
    Theme.setCustom(); // switches the app to the custom theme so edits preview live
  }
  function close() {
    document.getElementById('theme-editor-modal').classList.remove('open');
  }

  return { open, close, applyCustomVars, clearCustomVars, setColor, setAlpha, resetFrom, exportJson, importJson };
})();
