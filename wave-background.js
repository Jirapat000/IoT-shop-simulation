(() => {
  const canvas = document.querySelector('.wave-canvas');
  const ctx = canvas?.getContext('2d');
  if (!ctx) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  // Strands and glow read the theme tokens (theme.css) so the canvas always
  // belongs to the active theme; they are re-read whenever it changes.
  let palette = [];
  let glowStops = [];
  function readTheme() {
    const css = getComputedStyle(document.documentElement);
    const token = (name, fallback) => (css.getPropertyValue(name).trim() || fallback);
    palette = [token('--wave-a', '#3F72AF'), token('--wave-b', '#759dcf'), token('--wave-c', '#a9c1e4'), token('--tip', '#72cdbb')];
    glowStops = [token('--wave-glow-a', 'rgba(63,114,175,.16)'), token('--wave-glow-b', 'rgba(117,157,207,.08)'), 'rgba(0,0,0,0)'];
  }
  readTheme();
  let width = 0;
  let height = 0;
  let time = 0;
  let frame = 0;
  let lastFrame = 0;
  let staticPaint = 0;
  const pointer = { x: 0, y: 0, targetX: 0, targetY: 0, strength: 0, targetStrength: 0 };

  const hash = (x, y) => {
    const value = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
    return value - Math.floor(value);
  };
  const smooth = x => x * x * (3 - 2 * x);
  const noise = (x, y) => {
    const ix = Math.floor(x), iy = Math.floor(y);
    const fx = smooth(x - ix), fy = smooth(y - iy);
    const top = hash(ix, iy) * (1 - fx) + hash(ix + 1, iy) * fx;
    const bottom = hash(ix, iy + 1) * (1 - fx) + hash(ix + 1, iy + 1) * fx;
    return top * (1 - fy) + bottom * fy;
  };

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.35);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (reducedMotion.matches) paint();
  }

  function paint() {
    ctx.clearRect(0, 0, width, height);
    const audioLevel = Math.max(0, Math.min(1, window.iotHubAudioLevel || 0));
    const step = Math.max(9, width / 150);
    const strands = 6;

    for (let line = 0; line < strands; line++) {
      const gradient = ctx.createLinearGradient(0, 0, width, height * .12);
      palette.forEach((color, i) => gradient.addColorStop(i / (palette.length - 1), color));
      ctx.beginPath();
      for (let x = 0; x <= width; x += step) {
        const broad = noise(x * .0025 + line * 3.7, time * .28 + line * .8);
        const fine = noise(x * .007 + line * 1.9, time * .42 + 12 + line * 1.3);
        const naturalY = height * .55 + (line - 2.5) * 23 + (broad - .5) * height * (.2 + audioLevel * .13) + (fine - .5) * height * (.07 + audioLevel * .045);
        const dx = x - pointer.x;
        const pull = pointer.strength * Math.exp(-(dx * dx) / 52000);
        const ripple = Math.sin(dx * .035 - time * (3 + audioLevel * 4)) * (13 + audioLevel * 25) * pull;
        const y = naturalY + (pointer.y - naturalY) * pull * .22 + ripple;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = gradient;
      ctx.globalAlpha = .3 + audioLevel * .12;
      ctx.lineWidth = 12 + audioLevel * 4;
      ctx.stroke();
      ctx.globalAlpha = .78;
      ctx.lineWidth = 1.7;
      ctx.stroke();
    }
    if (pointer.strength > .01) {
      const glow = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 210);
      glow.addColorStop(0, glowStops[0]);
      glow.addColorStop(.42, glowStops[1]);
      glow.addColorStop(1, glowStops[2]);
      ctx.fillStyle = glow;
      ctx.globalAlpha = pointer.strength;
      ctx.fillRect(pointer.x - 210, pointer.y - 210, 420, 420);
    }
    ctx.globalAlpha = 1;
  }

  function animate(now) {
    if (document.hidden) return;
    frame = requestAnimationFrame(animate);
    if (now - lastFrame < 40) return;
    const delta = Math.min(now - lastFrame, 80);
    time += delta * .00022;
    lastFrame = now;
    pointer.x += (pointer.targetX - pointer.x) * .16;
    pointer.y += (pointer.targetY - pointer.y) * .16;
    pointer.strength += (pointer.targetStrength - pointer.strength) * .12;
    paint();
  }

  function setPointer(event) {
    pointer.targetX = event.clientX;
    pointer.targetY = event.clientY;
    pointer.targetStrength = 1;
    if (reducedMotion.matches) {
      pointer.x = pointer.targetX;
      pointer.y = pointer.targetY;
      pointer.strength = 1;
      if (!staticPaint) staticPaint = requestAnimationFrame(() => { staticPaint = 0; paint(); });
    }
  }

  function clearPointer() {
    pointer.targetStrength = 0;
    if (reducedMotion.matches) {
      pointer.strength = 0;
      if (!staticPaint) staticPaint = requestAnimationFrame(() => { staticPaint = 0; paint(); });
    }
  }

  function start() {
    cancelAnimationFrame(frame);
    if (reducedMotion.matches) paint();
    else if (!document.hidden) frame = requestAnimationFrame(animate);
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('pointermove', setPointer, { passive: true });
  window.addEventListener('pointerdown', setPointer, { passive: true });
  window.addEventListener('pointerleave', clearPointer, { passive: true });
  document.addEventListener('visibilitychange', start);
  reducedMotion.addEventListener?.('change', start);
  document.addEventListener('themechange', () => { readTheme(); paint(); });
  requestAnimationFrame(() => {
    if (!reducedMotion.matches) start();
    else paint();
  });
})();
