// Detects touch-primary devices (pointer: coarse) and adapts the UI into
// a touch-friendly mode: hides desktop-only tabs/toolbar, makes the patch
// canvas pan/zoom-only, and turns the connections tab into a dropdown-based
// editor so patches can be built without drag gestures.

const Mobile = (() => {
  function isTouch() {
    return window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  }

  function init() {
    if (!isTouch()) return;
    document.documentElement.setAttribute('data-touch-mode', '1');

    // Hide desktop-only tabs
    ['rack', 'io'].forEach(tab => {
      const btn = document.querySelector('.tab-btn[data-tab="' + tab + '"]');
      if (btn) btn.style.display = 'none';
    });

    // If a hidden tab was active by default, switch to patch
    const active = document.querySelector('.tab-btn.active');
    if (active && (active.dataset.tab === 'rack' || active.dataset.tab === 'io')) {
      App.switchTab('patch');
    }
  }

  return { isTouch, init };
})();
