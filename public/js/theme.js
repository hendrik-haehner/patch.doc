// PATCH.doc theme system — 2 themes (Studio dark / Studio Light)
// Simple toggle, no picker menu: one click switches between them.

const Theme = (() => {
  const KEY = 'patchdoc_theme';
  const VALID = ['studio', 'studio-light'];
  const ICONS = { studio: 'ti-moon', 'studio-light': 'ti-sun' };

  function _osPrefersDark() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function _effective() {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved && VALID.includes(saved)) return saved;
    } catch(e) {}
    return _osPrefersDark() ? 'studio' : 'studio-light';
  }

  function apply(theme) {
    if (!VALID.includes(theme)) theme = 'studio';
    document.documentElement.setAttribute('data-theme', theme);
    // Update icon on button — moon for dark, sun for light
    const icon = document.getElementById('theme-icon');
    if (icon) icon.className = 'ti ' + (ICONS[theme] || 'ti-moon');
    // Update topbar brand icon if theme-specific version exists
    const brandImg = document.getElementById('brand-icon');
    if (brandImg) {
      const themeIcon = `./icon-${theme}.png`;
      const testImg = new Image();
      testImg.onload  = () => { brandImg.src = themeIcon; };
      testImg.onerror = () => { brandImg.src = './icon-32.png'; };
      testImg.src = themeIcon;
    }
  }

  function set(theme) {
    try { localStorage.setItem(KEY, theme); } catch(e) {}
    apply(theme);
  }

  // Click handler for the topbar button — directly flips between the
  // two themes, no menu involved.
  function toggle() {
    const next = _effective() === 'studio' ? 'studio-light' : 'studio';
    set(next);
  }

  function init() {
    apply(_effective());
    // OS theme change (only if no manual override)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      try { if (!localStorage.getItem(KEY)) apply(_effective()); } catch(e) {}
    });
  }

  return { init, apply, set, toggle };
})();

// Apply theme immediately (before DOM ready) to avoid flash
Theme.apply((() => {
  try {
    const saved = localStorage.getItem('patchdoc_theme');
    const valid = ['studio', 'studio-light'];
    if (saved && valid.includes(saved)) return saved;
  } catch(e) {}
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'studio' : 'studio-light';
})());
