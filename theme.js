/* Theme switch: light / dark / follow-the-OS.
   Follows the same shape as the existing #bgm-toggle control — a .neu button in
   .nav-actions carrying aria-pressed and an aria-label — and stores the choice
   under the same localStorage namespace the language toggle uses.

   index.html applies the stored theme with a tiny inline script before first
   paint, so this file only has to wire the button and keep things in sync.
   Anything that paints with its own colours (the wave canvas, the intro scene,
   the 3D detail viewer) listens for the `themechange` event. */
(() => {
  const KEY = 'iothub-theme';
  const root = document.documentElement;
  const query = matchMedia('(prefers-color-scheme: dark)');
  const button = document.querySelector('#theme-toggle');
  const meta = document.querySelector('meta[name="theme-color"]');

  const systemTheme = () => (query.matches ? 'dark' : 'light');
  const stored = () => {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  };
  // An explicit choice wins; otherwise the OS decides.
  const resolved = () => {
    const s = stored();
    return s === 'light' || s === 'dark' ? s : systemTheme();
  };

  // Paint the browser chrome to match, so the mobile address bar follows too.
  const themeColor = theme => {
    if (!meta) return;
    meta.setAttribute('content', getComputedStyle(root).getPropertyValue('--bg-start').trim() || '#f2f4f8');
  };

  function apply(theme, persist) {
    root.dataset.theme = theme;
    if (persist !== undefined) {
      try {
        if (persist === null) localStorage.removeItem(KEY);
        else localStorage.setItem(KEY, persist);
      } catch (e) { /* private mode — the theme still applies for this visit */ }
    }
    themeColor(theme);
    if (button) {
      const dark = theme === 'dark';
      button.setAttribute('aria-pressed', String(dark));
      button.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
      button.title = dark ? 'สลับเป็นโหมดสว่าง · Light' : 'สลับเป็นโหมดมืด · Dark';
    }
    document.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
  }

  // Adopt the theme the inline head script already set, without re-announcing it.
  apply(root.dataset.theme === 'dark' ? 'dark' : 'light', undefined);

  if (button) {
    button.addEventListener('click', () => {
      // Once the visitor picks, their choice sticks even if the OS later changes.
      apply(root.dataset.theme === 'dark' ? 'light' : 'dark', root.dataset.theme === 'dark' ? 'light' : 'dark');
    });
  }

  // Only follow the OS while no explicit choice has been made.
  const onSystem = () => { if (stored() !== 'light' && stored() !== 'dark') apply(systemTheme(), undefined); };
  if (query.addEventListener) query.addEventListener('change', onSystem);
  else query.addListener(onSystem); // Safari < 14

  window.iothubTheme = {
    get: resolved,
    set: theme => apply(theme === 'dark' ? 'dark' : 'light', theme),
    follow: () => apply(systemTheme(), null),
  };
})();