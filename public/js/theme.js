// PATCH.doc theme system — 3 states: auto / dark / light
// Toggle cycles: auto → dark → light → auto

const Theme = (() => {
  const KEY = 'patchdoc_theme';
  const STATES = ['auto', 'studio', 'studio-light'];
  const ICONS  = { auto: 'ti-brightness-auto', studio: 'ti-moon', 'studio-light': 'ti-sun' };
  const TITLES = { auto: 'Theme: auto (follows OS)', studio: 'Theme: dark', 'studio-light': 'Theme: light' };

  function _osPrefersDark() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function _savedState() {
    try {
      const saved = localStorage.getItem(KEY);
      if (STATES.includes(saved)) return saved;
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
    const idx  = STATES.indexOf(current);
    const next = STATES[(idx + 1) % STATES.length];
    try { localStorage.setItem(KEY, next); } catch(e) {}
    apply(next);
  }

  function init() {
    apply(_savedState());
    // React to OS changes when in auto mode
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (_savedState() === 'auto') apply('auto');
    });
  }

  return { init, apply, toggle };
})();

// Apply theme immediately (before DOM ready) to avoid flash
Theme.apply((() => {
  try {
    const saved = localStorage.getItem('patchdoc_theme');
    if (['auto', 'studio', 'studio-light'].includes(saved)) return saved;
  } catch(e) {}
  return 'auto';
})());
