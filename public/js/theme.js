// PATCH.doc theme system — auto / dark / light, plus an optional user-edited
// "custom" theme (see themeeditor.js) reachable only via the theme editor,
// not the toggle cycle — a still-unseeded custom theme would otherwise be
// one accidental click away.
// Toggle cycles: auto → dark → light → auto

const Theme = (() => {
  const KEY = 'patchdoc_theme';
  const STATES = ['auto', 'studio', 'studio-light']; // toggle() cycle
  const ALL_STATES = [...STATES, 'custom']; // valid persisted values
  const ICONS  = { auto: 'ti-brightness-auto', studio: 'ti-moon', 'studio-light': 'ti-sun', custom: 'ti-palette' };
  const TITLES = { auto: 'Theme: auto (follows OS)', studio: 'Theme: dark', 'studio-light': 'Theme: light', custom: 'Theme: custom' };

  function _osPrefersDark() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function _savedState() {
    try {
      const saved = localStorage.getItem(KEY);
      if (ALL_STATES.includes(saved)) return saved;
    } catch(e) {}
    return 'auto';
  }

  function _effectiveTheme(state) {
    if (state === 'auto') return _osPrefersDark() ? 'studio' : 'studio-light';
    return state;
  }

  function _updateIcon(state) {
    const icon = document.getElementById('theme-icon');
    if (icon) icon.className = 'ti ' + (ICONS[state] || 'ti-brightness-auto');
    const btn = document.getElementById('theme-toggle-btn');
    if (btn) btn.title = TITLES[state] || 'Theme';
  }

  function apply(state) {
    const theme = _effectiveTheme(state);
    document.documentElement.setAttribute('data-theme', theme);
    // themeeditor.js loads after theme.js, so on the very first (pre-DOM,
    // avoid-flash) apply() call below ThemeEditor may not exist yet —
    // [data-theme="custom"] has a static dark-theme fallback in style.css
    // for exactly that instant, corrected moments later by init().
    if (theme === 'custom' && typeof ThemeEditor !== 'undefined') {
      ThemeEditor.applyCustomVars();
    } else if (theme !== 'custom' && typeof ThemeEditor !== 'undefined') {
      ThemeEditor.clearCustomVars();
    }
    _updateIcon(state);
    const brandImg = document.getElementById('brand-icon');
    if (brandImg) {
      const themeIcon = `./icon-${theme}.png`;
      const testImg = new Image();
      testImg.onload  = () => { brandImg.src = themeIcon; };
      testImg.onerror = () => { brandImg.src = './icon-32.png'; };
      testImg.src = themeIcon;
    }
  }

  function toggle() {
    const current = _savedState();
    const idx  = STATES.indexOf(current); // -1 if current is 'custom' — wraps to 'auto'
    const next = STATES[(idx + 1) % STATES.length];
    try { localStorage.setItem(KEY, next); } catch(e) {}
    apply(next);
  }

  // Activates the custom theme explicitly — only entry point into it, see
  // the file-top comment for why it's excluded from toggle()'s cycle.
  function setCustom() {
    try { localStorage.setItem(KEY, 'custom'); } catch(e) {}
    apply('custom');
  }

  function init() {
    apply(_savedState());
    // React to OS changes when in auto mode
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (_savedState() === 'auto') apply('auto');
    });
  }

  return { init, apply, toggle, setCustom };
})();

// Apply theme immediately (before DOM ready) to avoid flash
Theme.apply((() => {
  try {
    const saved = localStorage.getItem('patchdoc_theme');
    if (['auto', 'studio', 'studio-light', 'custom'].includes(saved)) return saved;
  } catch(e) {}
  return 'auto';
})());
