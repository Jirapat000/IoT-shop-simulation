// Lucky Hub — secret betting-simulator page. No real money, credits are fictional.
// Access: click the site logo 3 times quickly (triple-click shortcut).
// Loaded only on index.html; the game page loads lucky-game.js instead.
(function () {
  'use strict';

  const brand = document.querySelector('.brand');
  if (!brand) return;

  // ---- Triple-click detector on the logo ---------------------------------
  // A "click" counts only if the pointer barely moved between down and up, so
  // a drag never registers. Each accepted click restarts a 1.2s window; three
  // windows alive at once = triple click -> go to the simulator page.
  const WINDOW_MS = 1200;
  const MAX_TRAVEL = 12; // px of pointer travel still counted as a click
  let clicks = []; // timestamps of accepted clicks
  let travel = 0, downAt = 0;

  brand.addEventListener('pointerdown', (e) => { downAt = performance.now(); travel = 0; }, { passive: true });
  brand.addEventListener('pointermove', (e) => {
    if (!downAt) return;
    // pointermove has no origin here; approximate travel via movementX/Y sums
    travel += Math.abs(e.movementX || 0) + Math.abs(e.movementY || 0);
  }, { passive: true });
  brand.addEventListener('pointerup', () => { downAt = 0; }, { passive: true });

  brand.addEventListener('click', (e) => {
    if (travel > MAX_TRAVEL) return; // was a drag, not a deliberate click
    const t = performance.now();
    clicks = clicks.filter(c => t - c < WINDOW_MS);
    clicks.push(t);
    if (clicks.length >= 3) {
      clicks = [];
      goLucky();
    }
  });

  function goLucky() {
    try { sessionStorage.setItem('iothub-lucky-visited', '1'); } catch (err) { /* private mode */ }
    // Presence of this marker is what lucky.html accepts as "came from the home page".
    location.href = 'lucky.html';
  }

  // Exposed for debugging/tests only.
  window.__luckyAccess = { reset() { clicks = []; }, count() { return clicks.length; }, go: goLucky };
})();
