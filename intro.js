/* Opening cinematic — 16 s full-screen 3D intro.
   Phase plan:
     0.0–3.5  camera weaves through a drifting cloud of IoT devices
     3.5–6.5  dolly-zoom into the procedural ESP32 DevKit at the centre
     6.5–11.0 camera glides along the board (USB → GPIO → WROOM → LED) with hotspots + captions
    11.0–11.6 light flash while the camera rips backwards
    11.6–14.6 every device flies into a dot-matrix spelling of the word "IoT"
    14.5–15.9 a beam of light sweeps across and wipes the intro into the page
    14.5–16.0 the hero beneath reveals itself element by element
   Plays once per session (sessionStorage), skip button + Escape, ?intro=1 forces a replay,
   ?intro=0 disables, ?introT=<sec> seeks for debugging, ?introMute=1 silences the score.
   The score is synthesised live with the Web Audio API (no audio files) and is driven from the
   same clock as the camera, so pausing, seeking and skipping keep sound and picture together.
   Reduced motion / no WebGL → never plays. */
(() => {
  'use strict';

  /* ---------------- helpers ---------------- */
  const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
  const seg = (t, a, b) => clamp((t - a) / (b - a));
  const mix = (a, b, u) => a + (b - a) * u;
  const easeInOut = u => (u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);
  const easeOut = u => 1 - Math.pow(1 - u, 3);
  const easeOutBack = u => { const c1 = 1.2, c3 = c1 + 1; return 1 + c3 * Math.pow(u - 1, 3) + c1 * Math.pow(u - 1, 2); };
  const smooth = u => u * u * (3 - 2 * u);
  const DEG = Math.PI / 180;
  const rnd32 = seed => () => {
    seed = seed + 0x6D2B79F5 | 0;
    let x = Math.imul(seed ^ seed >>> 15, 1 | seed);
    x = x + Math.imul(x ^ x >>> 7, 61 | x) ^ x;
    return ((x ^ x >>> 14) >>> 0) / 4294967296;
  };
  const $ = id => document.getElementById(id);

  /* ---------------- timeline ---------------- */
  const T_APPROACH = [3.5, 6.5], T_LETTERS = [11.6, 14.6];
  // The hand-over: light ignites at 14.45, wipes left-to-right, and the intro is gone by 15.9.
  const T_SWEEP = [14.45, 15.9];
  const TOTAL = 16, LEAVE_AT = T_SWEEP[1] + .04, REVEAL_AT = 14.5, LETTER_DUR = 1.5;
  const CHIP_WINDOWS = [[6.65, 7.95], [7.95, 9.15], [9.15, 10.3], [10.3, 11.05]];
  const CHIP_COPY = {
    th: ['Micro-USB · จ่ายไฟและอัปโหลดโค้ด', 'แถว GPIO · ต่อเซ็นเซอร์ได้ 34 ขา', 'ESP-WROOM-32 · Wi-Fi + Bluetooth', 'LED สถานะและปุ่ม BOOT'],
    en: ['Micro-USB · power and upload', 'GPIO headers · 34 sensor pins', 'ESP-WROOM-32 · Wi-Fi + Bluetooth', 'Status LED and BOOT button']
  };
  const WORD = 'IoT', LETTER_DIST = 8, LETTER_FOV = 44;
  let allDevices = [];
  const CDN = 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

  /* ---------------- page reveal (runs with or without the intro) ---------------- */
  const REVEAL_SEL = '.section-heading,.category-card,.product-card,.learn-card,.path-step,.shops-card';
  function initReveal() {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const first = [...document.querySelectorAll(REVEAL_SEL)];
    if (!('IntersectionObserver' in window)) { first.forEach(el => el.classList.add('is-revealed')); return; }
    const reveal = el => {
      if (el.classList.contains('is-revealed')) return;
      el.classList.add('is-revealed');
      if (el.parentElement) el.parentElement.setAttribute('data-revealed', '');
      io.unobserve(el);
      // Drop the reveal styling once the transition is done so hover transitions keep working.
      const delay = parseInt(el.style.transitionDelay, 10) || 0;
      setTimeout(() => {
        if (!el.classList.contains('is-revealed')) return;
        el.classList.remove('will-reveal');
        el.style.transitionDelay = '';
      }, 750 + delay);
    };
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) reveal(e.target); });
    }, { threshold: .1, rootMargin: '0px 0px -6% 0px' });
    const register = el => {
      if (el.classList.contains('is-revealed') || el.classList.contains('will-reveal')) return;
      if (reduced) { el.classList.add('is-revealed'); return; }
      const idx = el.parentElement ? [...el.parentElement.children].indexOf(el) : 0;
      el.style.transitionDelay = Math.min(Math.max(idx, 0), 10) * 70 + 'ms';
      el.classList.add('will-reveal');
      io.observe(el);
    };
    first.forEach(register);
    // Viewport sweep: keeps the reveal working even when IntersectionObserver callbacks are
    // delayed (background tabs, heavy main thread) — plain rects never fail.
    let lastSweep = 0;
    const sweep = () => {
      const now = Date.now();
      if (now - lastSweep < 120) return;
      lastSweep = now;
      document.querySelectorAll('.will-reveal:not(.is-revealed)').forEach(el => {
        const r = el.getBoundingClientRect();
        // Anything at or above the fold counts as seen — including elements jumped past.
        if (r.top < innerHeight * .94) reveal(el);
      });
    };
    addEventListener('scroll', sweep, { passive: true });
    addEventListener('resize', sweep);
    sweep();
    setTimeout(sweep, 500);
    setTimeout(sweep, 1500);
    // Poll until everything has been revealed — covers environments where scroll/IO events lag.
    const poll = setInterval(() => {
      sweep();
      if (!document.querySelector('.will-reveal:not(.is-revealed)')) clearInterval(poll);
    }, 400);
    setTimeout(() => clearInterval(poll), 60000);
    // Cards are re-rendered by the catalog; keep newly injected ones in sync.
    ['product-list', 'category-grid'].forEach(id => {
      const host = $(id);
      if (!host || !('MutationObserver' in window)) return;
      new MutationObserver(muts => muts.forEach(m => m.addedNodes.forEach(n => {
        if (n.nodeType !== 1) return;
        const list = [];
        if (n.matches && n.matches(REVEAL_SEL)) list.push(n);
        if (n.querySelectorAll) n.querySelectorAll(REVEAL_SEL).forEach(x => list.push(x));
        list.forEach(el => {
          if (el.parentElement && el.parentElement.hasAttribute('data-revealed')) el.classList.add('is-revealed');
          else register(el);
        });
      }))).observe(host, { childList: true, subtree: true });
      sweep();
    });
  }

  /* ---------------- decision ---------------- */
  function hasWebGL() {
    try { const c = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl') || c.getContext('experimental-webgl'))); } catch (e) { return false; }
  }
  const store = {
    get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* private mode */ } }
  };

  initReveal();

  const overlay = $('intro');
  const params = new URLSearchParams(location.search);
  const want = params.get('intro');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canPlay = !!overlay && !reduced && hasWebGL();
  const startBtn = $('startIntro');

  // ?intro=0 or no capabilities → skip intro entirely
  if (!canPlay || want === '0') {
    document.body.classList.add('intro-done');
    if (startBtn) startBtn.hidden = true;
    return;
  }

  // Shared bootstrap: called once to actually begin the intro
  function beginIntro() {
    if (startBtn) startBtn.hidden = true;
    document.body.classList.add('intro-playing');
    overlay.hidden = false;
    // Keep keyboard focus out of the page hidden behind the overlay.
    pageBlocks.forEach(el => { el.inert = true; });
    startTime = performance.now();
    if (debugSeek > 0 && debugSeek < TOTAL) startTime = performance.now() - debugSeek * 1000;
    // Load Three.js and launch the animation loop
    watchdog = setTimeout(() => { if (!renderer && !dead) finish(false); }, 8000);
    (async () => {
      try {
        T = await import(CDN);
        if (dead) return;
        if (!skipped && frozenAt === null) startTime = performance.now() - (debugSeek > 0 ? debugSeek * 1000 : 0);
        build();
        raf = requestAnimationFrame(frame);
      } catch (err) {
        console.warn('Intro cinematic unavailable', err);
        finish(false);
      }
    })();
  }

  // ?intro=1 → auto-play immediately; otherwise show start button and wait
  if (want === '1') {
    if (startBtn) startBtn.hidden = true;
  } else {
    // Show the start button and wait for click
    if (startBtn) {
      startBtn.hidden = false;
      startBtn.addEventListener('click', () => { beginIntro(); }, { once: true });
    }
    // Don't auto-play — return here and wait for the button
    // But we still need to declare all the variables and functions below,
    // so we DON'T return; instead we gate the auto-launch at the bottom.
  }

  /* ---------------- intro ---------------- */
  const stage = $('intro-stage'), flashEl = $('intro-flash'), chipEl = $('intro-chip'), chipText = $('intro-chip-text'), skipBtn = $('intro-skip');
  const clipEl = $('intro-clip'), sweepEl = $('intro-sweep');
  const lang = document.documentElement.lang === 'en' ? 'en' : 'th';
  if (skipBtn) skipBtn.innerHTML = (lang === 'en' ? 'Skip' : 'ข้าม') + ' <span>→</span>';
  // pageBlocks is used by beginIntro() and finish() — declare but don't lock the page yet.
  const pageBlocks = [...document.body.children].filter(el => el !== overlay);

  let raf = 0, T = null, scene = null, camera = null, renderer = null, ro = null, refitFn = null, watchdog = 0;
  let startTime = performance.now(), pausedAt = 0, leaving = false, revealed = false, skipped = false, dead = false, frozenAt = null;
  // `rate` speeds the timeline up on skip, so the light sweep still plays — just quickly.
  let rate = 1;
  const timeNow = () => (frozenAt !== null ? frozenAt : ((pausedAt || performance.now()) - startTime) / 1000 * rate);
  const seek = t => { startTime = (pausedAt || performance.now()) - t * 1000 / rate; };
  const debugSeek = parseFloat(params.get('introT'));
  if (debugSeek > 0 && debugSeek < TOTAL) startTime = performance.now() - debugSeek * 1000;
  if (params.has('introT')) {
    // Debug hook (only with ?introT=): freeze/seek the timeline to capture phases deterministically.
    if (params.has('introFreeze') && debugSeek >= 0 && debugSeek < TOTAL) frozenAt = debugSeek;
    const renderNow = t => { try { update(t); if (renderer && scene) renderer.render(scene, camera); } catch (e) { console.warn(e); } };
    const project = (x, y, z) => { const v = new T.Vector3(x, y, z).project(camera); return [(v.x + 1) / 2, (1 - v.y) / 2]; };
    window.__intro = {
      seek: t => { const v = clamp(t, 0, TOTAL - .01); if (frozenAt !== null) { frozenAt = v; renderNow(v); } else seek(v); },
      freeze: t => { frozenAt = clamp(t, 0, TOTAL - .01); renderNow(frozenAt); },
      resume: () => { if (frozenAt !== null) { seek(frozenAt); frozenAt = null; } },
      tick: t => { if (t === undefined) { frame(); return +timeNow().toFixed(2); } frozenAt = null; seek(clamp(t, 0, TOTAL + 1)); frame(); return +timeNow().toFixed(2); },
      state: () => ({ t: +timeNow().toFixed(2), dead, revealed, leaving, skipped }),
      audio: () => Snd.state(),
      // Deterministic read-out of the scene at the current t (camera, timeline, letters as an ASCII map).
      snapshot: () => {
        const t = timeNow();
        updateCamera(t); updateDevices(t);
        const phase = t < 3.5 ? 'cloud' : t < 6.5 ? 'approach' : t < 11 ? 'board' : t < 11.6 ? 'flash' : t < 14.6 ? 'letters' : 'outro';
        const out = {
          t: +t.toFixed(2), phase,
          cam: [+camera.position.x.toFixed(2), +camera.position.y.toFixed(2), +camera.position.z.toFixed(2)],
          fov: +camera.fov.toFixed(1), aspect: +camera.aspect.toFixed(3),
          flash: +flashAt(t).toFixed(2),
          chip: chipEl.hidden ? null : chipText.textContent,
          cloud: devices.length, pool: pool.length, clones: clones.length
        };
        if (word) out.word = { pts: word.unit.length, aspect: +word.aspect.toFixed(2), scale: +word.scale.toFixed(2) };
        if (word && pool.length) {
          const W = 74, H = 24;
          const grid = Array.from({ length: H }, () => Array(W).fill(' '));
          let settled = 0;
          const tmp = new T.Vector3();
          for (const d of pool) {
            if (!d.letter) continue;
            const [u, v] = project(d.letter.px, d.letter.py, d.letter.pz);
            const cx = Math.round(u * (W - 1)), cy = Math.round(v * (H - 1));
            if (cx >= 0 && cx < W && cy >= 0 && cy < H) grid[cy][cx] = '#';
            tmp.set(d.letter.px, d.letter.py, d.letter.pz);
            if (d.group.position.distanceTo(tmp) < .3) settled++;
          }
          out.letters = { settled, of: pool.length, map: grid.map(r => r.join('').replace(/\s+$/, '')).join('\n') };
        }
        return out;
      }
    };
  }

  /* ---------------- audio: procedural score + SFX ----------------
     Everything is synthesised with the Web Audio API — no audio files, nothing to load.
     The score is driven from the same clock as the camera (tick(t)), so pausing, seeking
     and skipping keep picture and sound locked together, and the tail is always faded out
     when the intro ends or is abandoned. Autoplay policies are handled by resuming the
     context on the first user gesture; ?introMute=1 and the M key silence it. */
  const Snd = (() => {
    const st = { ctx: null, master: null, musicBus: null, sfxBus: null, verb: null, noise: null, pad: null, padLfo: null, padGain: null, padFilter: null, bass: null, bassGain: null, lastStep: 0, muted: params.get('introMute') === '1', ready: false, failed: false, cues: 0, step: 0, t: 0, kick: null, onVis: null };
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) { st.failed = true; return { tick() {}, attach() {}, detach() {}, fade() {}, toggleMute() {}, state: () => ({ ...st, ctx: null }) }; }
    const now = () => st.ctx.currentTime;
    const gain = (v = 0) => { const g = st.ctx.createGain(); g.gain.value = v; return g; };
    // short exponential-decay noise burst, reused for whooshes / risers
    const makeNoise = (dur, decay) => {
      const len = Math.floor(st.ctx.sampleRate * dur);
      const buf = st.ctx.createBuffer(1, len, st.ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
      return buf;
    };
    // soft plate-ish reverb: a short exponentially decaying noise impulse
    const makeVerb = () => {
      const dur = 2.4, len = Math.floor(st.ctx.sampleRate * dur);
      const buf = st.ctx.createBuffer(2, len, st.ctx.sampleRate);
      for (let c = 0; c < 2; c++) {
        const d = buf.getChannelData(c);
        for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2) * (1 - i / len * .2);
      }
      const v = st.ctx.createConvolver(); v.buffer = buf;
      const out = gain(.9); v.connect(out); out.connect(st.master);
      return { input: v, out };
    };
    const send = (node, amt) => { if (!st.verb || amt <= 0) return; const g = gain(amt); node.connect(g); g.connect(st.verb.input); };

    // tear down whatever a failed build() already started, then close its context
    function scrap() {
      try { (st.pad || []).forEach(o => o.stop()); } catch (e) { /* not started */ }
      try { st.padLfo && st.padLfo.stop(); } catch (e) { /* not started */ }
      try { st.bass && st.bass.stop(); } catch (e) { /* not started */ }
      const c = st.ctx;
      st.pad = []; st.padLfo = null; st.bass = null; st.ready = false; st.ctx = null;
      try { c && c.close(); } catch (e) { /* already closed */ }
    }

    function build() {
      if (st.ready || st.failed) return;
      try {
        // The context is created up front but only becomes audible once it is running:
        // browsers hand back a suspended one until the first user gesture.
        st.ctx = new AC({ latencyHint: 'interactive' });
        const c = st.ctx;
        // the bus is open at its normal level unless the intro was muted up front
        st.master = gain(st.muted ? .0001 : 1.02); st.master.connect(c.destination);
        // gentle bus compressor keeps the risers from clipping the mix
        const comp = c.createDynamicsCompressor();
        comp.threshold.value = -14; comp.knee.value = 22; comp.ratio.value = 3.4; comp.attack.value = .006; comp.release.value = .26;
        st.master.disconnect(); st.master.connect(comp); comp.connect(c.destination);
        st.verb = makeVerb();
        st.musicBus = gain(1); st.musicBus.connect(st.master); send(st.musicBus, .16);
        st.sfxBus = gain(1); st.sfxBus.connect(st.master); send(st.sfxBus, .3);
        st.noise = makeNoise(2.6, 1.4);

        // --- ambient pad: three detuned saws through a slow low-pass (the bed under everything)
        st.pad = []; st.padFilter = c.createBiquadFilter();
        st.padFilter.type = 'lowpass'; st.padFilter.frequency.value = 700; st.padFilter.Q.value = .7;
        st.padGain = gain(.0001); st.padFilter.connect(st.padGain); st.padGain.connect(st.musicBus);
        [110, 164.81, 220].forEach((f, i) => {   // A minor-ish stack, detuned for width
          const o = c.createOscillator(); o.type = 'sawtooth';
          o.frequency.value = f; o.detune.value = (i - 1) * 7;
          const g = gain(.22); o.connect(g); g.connect(st.padFilter); o.start(); st.pad.push(o);
        });
        const padLfo = st.padLfo = c.createOscillator(); padLfo.frequency.value = .08;
        const padLfoG = gain(260); padLfo.connect(padLfoG); padLfoG.connect(st.padFilter.frequency); padLfo.start();

        // --- sub bass, one note per bar
        st.bass = c.createOscillator(); st.bass.type = 'sine'; st.bass.frequency.value = 55;
        st.bassGain = gain(.0001); st.bass.connect(st.bassGain); st.bassGain.connect(st.musicBus); st.bass.start();
        st.ready = true;
      } catch (e) {
        // audio is never fatal, but a half-built graph must not be left running
        st.failed = true;
        scrap();
      }
    }

    // one-shot filtered noise sweep — the "camera moves past devices" whoosh
    function whoosh(t0, dur, f0, f1, vol, q) {
      if (!st.ready) return;
      const c = st.ctx, s = c.createBufferSource(); s.buffer = st.noise; s.loop = true;
      const f = c.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = q == null ? 1.4 : q;
      f.frequency.setValueAtTime(f0, t0); f.frequency.exponentialRampToValueAtTime(Math.max(f1, 40), t0 + dur);
      const g = gain(.0001); s.connect(f); f.connect(g); g.connect(st.sfxBus); send(g, .45);
      g.gain.setValueAtTime(.0001, t0);
      g.gain.exponentialRampToValueAtTime(vol, t0 + dur * .28);
      g.gain.exponentialRampToValueAtTime(.0001, t0 + dur);
      s.start(t0); s.stop(t0 + dur + .05);
    }
    // struck bell — caption pings and the letters locking in
    function bell(t0, freq, vol, dur) {
      if (!st.ready) return;
      const c = st.ctx, o = c.createOscillator(); o.type = 'triangle'; o.frequency.value = freq;
      const o2 = c.createOscillator(); o2.type = 'sine'; o2.frequency.value = freq * 2.01;
      const g = gain(.0001), g2 = gain(.28); o.connect(g); o2.connect(g2); g2.connect(g);
      g.connect(st.musicBus); send(g, .5);
      g.gain.setValueAtTime(.0001, t0);
      g.gain.exponentialRampToValueAtTime(vol, t0 + .012);
      g.gain.exponentialRampToValueAtTime(.0001, t0 + dur);
      o.start(t0); o2.start(t0); o.stop(t0 + dur + .05); o2.stop(t0 + dur + .05);
    }
    // deep impact for the flash at 11 s
    function impact(t0) {
      if (!st.ready) return;
      const c = st.ctx;
      const o = c.createOscillator(); o.type = 'sine';
      o.frequency.setValueAtTime(160, t0); o.frequency.exponentialRampToValueAtTime(38, t0 + .9);
      const g = gain(.0001); o.connect(g); g.connect(st.sfxBus); send(g, .35);
      g.gain.setValueAtTime(.0001, t0);
      g.gain.exponentialRampToValueAtTime(.5, t0 + .02);
      g.gain.exponentialRampToValueAtTime(.0001, t0 + 1.5);
      o.start(t0); o.stop(t0 + 1.6);
      whoosh(t0, 1.1, 5200, 700, .2, .8);      // bright shatter on top of the thump
    }

    /* ---- score map: one entry per musical/graphic event on the timeline ---- */
    const SCORE = [
      { t: 0, fn: () => bell(now(), 220, .12, 1.6) },                                    // opening shimmer
      { t: 2.4, fn: () => bell(now(), 330, .08, 1.1) },
      { t: 3.5, fn: () => whoosh(now(), 1.5, 300, 2600, .16) },                           // dolly in
      { t: 6.5, fn: () => whoosh(now(), 1.1, 2400, 420, .13) },                           // onto the board
      { t: 6.65, fn: () => bell(now(), 880, .1, .5) },                                   // caption pings
      { t: 7.95, fn: () => bell(now(), 1046.5, .1, .5) },
      { t: 9.15, fn: () => bell(now(), 1318.5, .1, .5) },
      { t: 10.3, fn: () => bell(now(), 1760, .1, .6) },
      { t: 9.6, fn: () => whoosh(now(), 1.45, 200, 5200, .1, 3.2) },                      // riser into the flash
      { t: 11, fn: () => impact(now()) },
      { t: 11.6, fn: () => bell(now(), 440, .1, 1.4) },                                  // letters start flying
      { t: 12.2, fn: () => bell(now(), 659.25, .09, 1.2) },
      { t: 12.8, fn: () => bell(now(), 880, .1, 1.2) },
      { t: 13.4, fn: () => { bell(now(), 1108.7, .11, 2.4); bell(now() + .09, 1318.5, .08, 2.2); } },
      { t: 14.45, fn: () => whoosh(now(), 1.5, 180, 4200, .16, 1.1) },                    // the light sweep
      { t: 15.1, fn: () => bell(now(), 220, .14, 2.6) }
    ];
    const cueIndex = t => { let i = 0; while (i < SCORE.length && SCORE[i].t <= t) i++; return i; };

    function tick(t) {
      if (!st.ready || st.muted) { st.t = t; return; }
      st.t = t;
      if (st.ctx.state === 'suspended') return;         // waiting for a gesture; nothing to do yet
      const n = now();
      // fire any cues crossed since the previous frame (handles seeks and dropped frames)
      const want = cueIndex(t);
      if (want !== st.step) {
        for (let i = st.step; i < want; i++) { try { SCORE[i].fn(); st.cues++; } catch (e) { /* audio is never fatal */ } }
        st.step = want;
      }
      // mix follows the picture: pad swells into the letters, filter opens for the sweep
      const swell = .5 * smooth(seg(t, 0, 3.2)) + .5 * smooth(seg(t, 11, 13.2)) * (1 - smooth(seg(t, 15.4, 16)));
      st.padGain.gain.setTargetAtTime(Math.max(.0001, .1 * swell), n, .18);
      st.padFilter.frequency.setTargetAtTime(620 + 900 * smooth(seg(t, 3.5, 11)) + 1500 * smooth(seg(t, 11.4, 13.4)), n, .3);
      // bass notes land every 2 s, ducked during the flash
      const beat = Math.floor(t / 2) * 2;
      if (beat !== st.lastStep) {
        st.lastStep = beat;
        const roots = [55, 55, 65.41, 73.42, 55, 49];
        st.bass.frequency.setTargetAtTime(roots[Math.floor(beat / 2) % roots.length], n, .12);
        st.bassGain.gain.setTargetAtTime(.0001, n, .02);
        st.bassGain.gain.exponentialRampToValueAtTime(.16, n + .04);
        st.bassGain.gain.exponentialRampToValueAtTime(.0001, n + 1.7);
      }
    }

    // fade the whole mix out (intro over) and stop the graph so nothing keeps running
    function fade(sec) {
      if (!st.ready) return;
      const n = now();
      st.master.gain.cancelScheduledValues(n);
      st.master.gain.setValueAtTime(Math.max(st.master.gain.value, .0001), n);
      st.master.gain.exponentialRampToValueAtTime(.0001, n + sec);
      setTimeout(() => {
        if (!st.ready) return;
        scrap();          // stops every oscillator and closes the context
      }, sec * 1000 + 260);
    }
    const GESTURES = ['pointerdown', 'keydown', 'touchstart', 'wheel'];
    function attach() {
      if (st.failed || st.kick) return;
      // build() waits for a real gesture: that is what lets the browser unlock the context
      const kick = () => { if (!st.ready) build(); if (st.ctx && st.ctx.state === 'suspended') st.ctx.resume().catch(() => {}); };
      st.kick = kick;
      GESTURES.forEach(e => addEventListener(e, kick, { passive: true }));
      st.onVis = () => {
        if (!st.ready || !st.ctx) return;
        if (document.hidden) st.ctx.suspend().catch(() => {});
        else st.ctx.resume().catch(() => {});
      };
      addEventListener('visibilitychange', st.onVis);
    }
    // stop listening for gestures once the intro is over, so a later click cannot
    // build a fresh graph that nothing would ever fade out or close
    function detach() {
      if (st.kick) GESTURES.forEach(e => removeEventListener(e, st.kick));
      if (st.onVis) removeEventListener('visibilitychange', st.onVis);
      st.kick = null; st.onVis = null;
    }
    function toggleMute() {
      st.muted = !st.muted;
      // Guard against missing audio graph (e.g., before build)
      if (!st.ready || !st.master) return st.muted;
      const n = now();
      st.master.gain.cancelScheduledValues(n);
      st.master.gain.setTargetAtTime(st.muted ? .0001 : 1.02, n, .08);
      return st.muted;
    }
    return {
      tick, fade, attach, detach, toggleMute,
      state: () => ({ ready: st.ready, muted: st.muted, ctxState: st.ctx ? st.ctx.state : 'none', cues: st.cues, t: +st.t.toFixed(2) })
    };
  })();

  const doSkip = () => {
    if (skipped || dead) return;
    skipped = true;
    rate = 6;                       // fast-forward the light sweep instead of hard-cutting
    seek(Math.min(timeNow(), T_SWEEP[0] - .12));
  };
  const onKey = e => { if (e.key === 'Escape') doSkip(); else if (e.key === 'm' || e.key === 'M') Snd.toggleMute(); };
  const onVis = () => {
    if (document.hidden) { pausedAt = performance.now(); }
    else if (pausedAt) { startTime += performance.now() - pausedAt; pausedAt = 0; }
  };
  if (skipBtn) skipBtn.addEventListener('click', doSkip);
  document.addEventListener('keydown', onKey);
  document.addEventListener('visibilitychange', onVis);
  Snd.attach();

  function finish(success) {
    if (dead) return;
    dead = true;
    if (raf) cancelAnimationFrame(raf);
    document.removeEventListener('keydown', onKey);
    document.removeEventListener('visibilitychange', onVis);
    if (ro) ro.disconnect();
    if (refitFn) { removeEventListener('resize', refitFn); refitFn = null; }
    clearTimeout(watchdog);
    Snd.detach();
    Snd.fade(.55);
    pageBlocks.forEach(el => { el.inert = false; });
    if (success) { store.set('iothub-intro-seen', '1'); overlay.remove(); }
    else overlay.hidden = true;
    document.body.classList.remove('intro-playing');
    document.body.classList.add('intro-done');
    if (renderer) {
      if (scene) {
        const geos = new Set(), mats = new Set();
        scene.traverse(o => {
          if (o.geometry) geos.add(o.geometry);
          if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => mats.add(m));
        });
        geos.forEach(g => g.dispose());
        mats.forEach(m => { if (m.map) m.map.dispose(); m.dispose(); });
      }
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) renderer.domElement.remove();
    }
  }

  // Auto-launch only when ?intro=1 was set; otherwise beginIntro() is triggered by the start button.
  if (want === '1') { beginIntro(); }

  /* ---------------- scene construction ---------------- */
  let devices = [], clones = [], hero = null, rings = [], lettersGlow = null, word = null, pool = [];
  let flyCurve, flyLook, boardCurve, boardLook, approachFrom, approachCtrl, approachTo, widePos;
  const ORIGIN = { x: 0, y: 0, z: 0 };

  function build() {
    clearTimeout(watchdog);
    const mobile = Math.min(innerWidth, innerHeight) <= 650;
    renderer = new T.WebGLRenderer({ alpha: true, antialias: (devicePixelRatio || 1) < 1.5, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, mobile ? 1.5 : 1.75));
    renderer.setSize(stage.clientWidth || innerWidth, stage.clientHeight || innerHeight);
    renderer.outputColorSpace = T.SRGBColorSpace;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    stage.appendChild(renderer.domElement);

    scene = new T.Scene();
    scene.fog = new T.Fog(themeHex('--scene-fog', '#112D4E'), 12, 42);
    camera = new T.PerspectiveCamera(46, (stage.clientWidth || innerWidth) / (stage.clientHeight || innerHeight), .02, 160);
    widePos = new T.Vector3(0, 1.7, 9.6);

    scene.add(new T.HemisphereLight(themeHex('--scene-key', '#dbe6f7'), themeHex('--scene-ground', '#112d4e'), 1.2));
    const key = new T.DirectionalLight(themeHex('--scene-key', '#f9f7f7'), 2.35); key.position.set(4, 7, 5); scene.add(key);
    const rim = new T.DirectionalLight(themeHex('--scene-rim', '#6f9ede'), 1.7); rim.position.set(-5, 3, -4); scene.add(rim);

    const unit = { box: new T.BoxGeometry(1, 1, 1), cyl: new T.CylinderGeometry(1, 1, 1, 20) };
    const Pal = palette(T);
    const glow = glowTexture(T);
    const rnd = rnd32(20261003);

    // -- hero ESP32 at the origin -------------------------------------------------
    hero = buildEsp32(T, unit, Pal, glow);
    hero.group.position.set(0, 0, 0);
    hero.group.rotation.y = .1;
    scene.add(hero.group);

    // -- drifting cloud -----------------------------------------------------------
    const kinds = ['esp32', 'board', 'sensor', 'ultra', 'relay', 'servo', 'nano', 'esp'];
    const count = mobile ? 24 : 42;
    for (let i = 0; i < count; i++) {
      const type = kinds[i % kinds.length];
      const g = makeDevice(T, unit, Pal, glow, type);
      const r = 2.7 + rnd() * 4.8;
      const th = rnd() * Math.PI * 2;
      let px = Math.cos(th) * r, py = (rnd() * 2 - 1) * 2.6, pz = Math.sin(th) * r;
      if (Math.hypot(px, py, pz) < 2.1) { const s = 2.1 / Math.hypot(px, py, pz || 1); px *= s; pz *= s; }
      const d = {
        group: g, baseScale: .5 + rnd() * .5, hero: false,
        cloud: [px, py, pz],
        drift: { ax: .1 + rnd() * .16, ay: .12 + rnd() * .2, az: .1 + rnd() * .16, sx: .25 + rnd() * .4, sy: .22 + rnd() * .4, sz: .25 + rnd() * .4, px: rnd() * 7, py: rnd() * 7, pz: rnd() * 7 },
        rot0: [(rnd() - .5) * 1.1, rnd() * Math.PI * 2, (rnd() - .5) * .8],
        rotSpd: [(rnd() - .5) * .22, (rnd() - .5) * .34, (rnd() - .5) * .2],
        letter: null
      };
      scene.add(g);
      devices.push(d);
    }
    devices.push({ group: hero.group, baseScale: 1, hero: true, cloud: [0, 0, 0], drift: null, rot0: [0, .1, 0], rotSpd: [0, 0, 0], letter: null, heroPart: true });

    // -- star field ---------------------------------------------------------------
    const starGeo = new T.BufferGeometry();
    const sp = new Float32Array(300 * 3);
    for (let i = 0; i < 300; i++) {
      const rr = 16 + rnd() * 26, t2 = rnd() * Math.PI * 2, ph = Math.acos(2 * rnd() - 1);
      sp[i * 3] = Math.sin(ph) * Math.cos(t2) * rr;
      sp[i * 3 + 1] = Math.cos(ph) * rr * .7;
      sp[i * 3 + 2] = Math.sin(ph) * Math.sin(t2) * rr;
    }
    starGeo.setAttribute('position', new T.BufferAttribute(sp, 3));
    const stars = new T.Points(starGeo, new T.PointsMaterial({ color: themeHex('--scene-key', '#f9f7f7'), size: .12, transparent: true, opacity: .7, fog: false, depthWrite: false }));
    scene.add(stars);
    scene.userData.stars = stars;

    // -- hotspot rings on the board (children of the hero group) ------------------
    const ringMat = () => new T.MeshBasicMaterial({ color: 0x9cc1ee, transparent: true, opacity: 0, blending: T.AdditiveBlending, depthWrite: false, fog: false });
    [[.73, .13, 0, .16], [.1, .13, .43, .13], [-.42, .24, 0, .18], [.08, .11, .33, .11]].forEach(([x, y, z, r], j) => {
      const m = new T.Mesh(new T.TorusGeometry(r, .014, 8, 40), ringMat());
      m.position.set(x, y, z); m.rotation.x = -Math.PI / 2;
      m.userData.j = j;
      hero.group.add(m);
      rings.push(m);
    });

    // -- letters glow backdrop ----------------------------------------------------
    lettersGlow = new T.Mesh(new T.PlaneGeometry(1, 1), new T.MeshBasicMaterial({ map: glow, color: 0x3f72af, transparent: true, opacity: 0, blending: T.AdditiveBlending, depthWrite: false, fog: false }));
    lettersGlow.position.z = -1.2;
    scene.add(lettersGlow);

    // -- camera paths -------------------------------------------------------------
    const V = (x, y, z) => new T.Vector3(x, y, z);
    flyCurve = new T.CatmullRomCurve3([V(.4, 1.8, 9), V(-4.2, .8, 6.6), V(3.6, -1.1, 4.6), V(-3, 1.7, 3.2), V(2.6, .6, 3.6), V(2.6, 1.1, 5.2)]);
    flyLook = new T.CatmullRomCurve3([V(-1.5, .6, 4), V(1.6, -.4, 2.6), V(-1.2, .9, 1.6), V(1.1, .3, 1), V(0, .3, .6), V(0, .2, .3)]);
    approachFrom = V(2.6, 1.1, 5.2); approachCtrl = V(2.2, 1.4, 3); approachTo = V(1.5, .62, 1.45);
    boardCurve = new T.CatmullRomCurve3([V(1.5, .62, 1.45), V(1.6, .68, 1.9), V(.6, .7, 2.1), V(-.7, .72, 2), V(-2.1, .75, .8), V(-2.3, .8, -1.1), V(-.8, .85, -2), V(1, .85, -1.9), V(2.3, .9, .6)]);
    boardLook = new T.CatmullRomCurve3([V(.73, .1, 0), V(.5, .12, .3), V(.1, .13, .43), V(-.3, .14, .4), V(-.42, .16, .1), V(-.42, .16, -.15), V(-.1, .13, -.3), V(.3, .11, .05), V(.1, .1, .1)]);

    // -- word sampling + letter assignment ---------------------------------------
    const buildWord = () => {
      word = sampleWord(T, WORD, mobile ? 50 : 76);
      pool = devices.slice();
      const cap = mobile ? 50 : 76;
      const need = Math.max(0, word.unit.length - pool.length);
      for (let i = 0; i < need; i++) {
        const src = devices[(i * 7 + 3) % (devices.length - 1)]; // never clone the hero
        const c = src.group.clone();
        c.position.set(0, -16 - i * .05, -14);
        scene.add(c);
        const cl = Object.assign({}, src, { group: c, letter: null, cloud: [0, -16 - i * .05, -14], drift: null, clone: true, rot0: [0, 0, 0], rotSpd: [0, 0, 0] });
        clones.push(cl);
        pool.push(cl);
      }
      allDevices = devices.concat(clones);
      assignLetters();
    };
    const ready = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
    Promise.race([ready, new Promise(r => setTimeout(r, 700))]).then(buildWord).catch(buildWord);

    const refit = () => {
      const w = stage.clientWidth, h = stage.clientHeight;
      if (!w || !h || !renderer) return;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      if (word) assignLetters();
    };
    ro = new ResizeObserver(refit);
    ro.observe(stage);
    addEventListener('resize', refit);
    refitFn = refit;
  }

  // Scene colours come from the theme tokens so the cinematic always matches the chrome.
  function themeHex(name, fallback) {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v ? parseInt(v.replace('#', ''), 16) : parseInt(fallback.slice(1), 16);
  }

  function palette(T) {
    const S = (c, m = 0, r = .5, extra) => new T.MeshStandardMaterial(Object.assign({ color: c, metalness: m, roughness: r }, extra));
    return {
      pcbGreen: S(0x3f72af, .1, .55), pcbBlue: S(0x1c67a2, .1, .5), pcbTeal: S(0x2a5a8f, .1, .55),
      pcbDeep: S(0x315f87, .1, .5), dark: S(0x141b21, .25, .45), darker: S(0x0d1216, .2, .5),
      gold: S(0xd6b462, .85, .3), steel: S(0xb9c3c5, .8, .3), can: S(0xc9d0cd, .75, .34),
      white: S(0xeceee6, 0, .6), gray: S(0x9aa3a4, .4, .5), blueBody: S(0x3475a4, .1, .5),
      blueDark: S(0x26557c, .1, .5), cream: S(0xf0efe4, 0, .6),
      led: S(0xdbe8fb, 0, .4, { emissive: 0x9fc4f5, emissiveIntensity: 1.7 })
    };
  }

  function glowTexture(T) {
    const c = document.createElement('canvas'); c.width = c.height = 64;
    const g = c.getContext('2d');
    const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(.35, 'rgba(255,255,255,.55)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grad; g.fillRect(0, 0, 64, 64);
    const tex = new T.CanvasTexture(c);
    tex.colorSpace = T.SRGBColorSpace;
    return tex;
  }

  /* ---------------- device factories ---------------- */
  function makeDevice(T, unit, Pal, glow, type) {
    const g = new T.Group();
    const B = (x, y, z, sx, sy, sz, m) => { const o = new T.Mesh(unit.box, m); o.position.set(x, y, z); o.scale.set(sx, sy, sz); g.add(o); return o; };
    const C = (x, y, z, r, d, m, rx = 0) => { const o = new T.Mesh(unit.cyl, m); o.position.set(x, y, z); o.scale.set(r, d, r); o.rotation.x = rx; g.add(o); return o; };
    if (type === 'board') {
      B(0, 0, 0, 1.25, .06, .98, Pal.pcbBlue);
      B(0, .05, -.44, .95, .05, .07, Pal.dark); B(0, .05, .44, .95, .05, .07, Pal.dark);
      B(0, .078, -.44, .9, .014, .03, Pal.gold); B(0, .078, .44, .9, .014, .03, Pal.gold);
      B(-.45, .06, -.18, .26, .12, .24, Pal.steel);
      B(-.45, .06, .3, .2, .13, .2, Pal.darker);
      B(.1, .055, 0, .32, .05, .26, Pal.dark);
      B(.4, .032, .3, .3, .006, .12, Pal.white);
    } else if (type === 'nano') {
      B(0, 0, 0, .9, .05, .36, Pal.pcbBlue);
      B(0, .04, -.15, .85, .05, .05, Pal.gold); B(0, .04, .15, .85, .05, .05, Pal.gold);
      B(.05, .055, 0, .3, .05, .2, Pal.dark);
      B(-.38, .05, 0, .16, .09, .15, Pal.steel);
      B(.3, .03, 0, .1, .01, .1, Pal.white);
    } else if (type === 'esp32' || type === 'esp') {
      const pcb = type === 'esp32' ? Pal.pcbGreen : Pal.pcbDeep;
      const w = type === 'esp32' ? 1.05 : .95, dpt = type === 'esp32' ? .54 : .5;
      B(0, 0, 0, w, .05, dpt, pcb);
      B(0, .04, -dpt * .44, w * .86, .05, .06, Pal.dark); B(0, .04, dpt * .44, w * .86, .05, .06, Pal.dark);
      B(0, .068, -dpt * .44, w * .8, .014, .03, Pal.gold); B(0, .068, dpt * .44, w * .8, .014, .03, Pal.gold);
      B(-w * .24, .07, 0, w * .48, .05, dpt * .82, Pal.darker);
      B(-w * .17, .115, 0, w * .3, .09, dpt * .76, Pal.can);
      B(w * .4, .05, 0, .2, .09, .16, Pal.steel);
      B(w * .08, .055, dpt * .36, .05, .04, .04, Pal.led);
    } else if (type === 'sensor') {
      B(0, .15, 0, .42, .5, .16, Pal.white);
      B(0, .3, .085, .34, .02, .01, Pal.gray); B(0, .22, .085, .34, .02, .01, Pal.gray);
      B(-.08, -.05, 0, .025, .2, .025, Pal.gold); B(.0, -.05, 0, .025, .2, .025, Pal.gold); B(.08, -.05, 0, .025, .2, .025, Pal.gold);
    } else if (type === 'ultra') {
      B(0, 0, 0, 1.1, .05, .49, Pal.pcbBlue);
      [-.26, .26].forEach(x => { C(x, .1, 0, .17, .13, Pal.steel, Math.PI / 2); C(x, .1, .07, .1, .02, Pal.gray, Math.PI / 2); });
      B(0, .06, .14, .2, .05, .12, Pal.dark);
      B(0, .06, -.16, .5, .04, .1, Pal.darker);
    } else if (type === 'relay') {
      B(0, 0, 0, 1.05, .05, .7, Pal.pcbTeal);
      for (let i = 0; i < 4; i++) B(-.25 + (i % 2) * .5, .13, -.13 + ((i / 2) | 0) * .3, .3, .24, .24, Pal.blueDark);
      B(0, .05, -.32, .9, .07, .06, Pal.darker); B(0, .05, .32, .9, .07, .06, Pal.darker);
      B(0, .03, 0, .9, .012, .5, Pal.white);
    } else {
      B(0, .2, 0, .5, .4, .44, Pal.blueBody);
      B(0, .42, 0, .3, .06, .3, Pal.blueDark);
      C(0, .48, 0, .09, .1, Pal.white);
      B(0, .54, .12, .34, .04, .06, Pal.white);
      B(-.15, .02, .16, .025, .2, .025, Pal.gold); B(0, .02, .16, .025, .2, .025, Pal.gold); B(.15, .02, .16, .025, .2, .025, Pal.gold);
    }
    return g;
  }

  function buildEsp32(T, unit, Pal, glow) {
    const g = new T.Group();
    const W = 1.7, H = 1.0, TH = .07, TOP = TH / 2;
    const B = (x, y, z, sx, sy, sz, m) => { const o = new T.Mesh(unit.box, m); o.position.set(x, y, z); o.scale.set(sx, sy, sz); g.add(o); return o; };
    const C = (x, y, z, r, d, m) => { const o = new T.Mesh(unit.cyl, m); o.position.set(x, y, z); o.scale.set(r, d, r); g.add(o); return o; };
    const modPcb = new T.MeshStandardMaterial({ color: 0x14345a, roughness: .5, metalness: .1 });

    B(0, 0, 0, W, TH, H, Pal.pcbGreen);
    // mounting holes
    [[-.78, -.44], [.78, -.44], [-.78, .44], [.78, .44]].forEach(([x, z]) => {
      C(x, TOP + .002, z, .07, .014, Pal.gold);
      C(x, TOP + .004, z, .045, .02, Pal.darker);
    });
    // GPIO headers (two 19-pin rows along the long edges)
    [-1, 1].forEach(s => {
      B(0, TOP + .04, s * .43, W * .92, .06, .07, Pal.dark);
      for (let i = 0; i < 19; i++) B(-.75 + i * (1.5 / 18), TOP + .1, s * .43, .028, .12, .028, Pal.gold);
    });
    // ESP-WROOM-32 module: PCB tongue with antenna + shield can
    B(-.42, TOP + .04, 0, .62, .08, .6, modPcb);
    for (let i = 0; i < 4; i++) B(-.62, TOP + .081, -.15 + i * .1, .2, .008, .045, Pal.gold);
    B(-.5, TOP + .081, 0, .12, .008, .03, Pal.gold);
    B(-.275, TOP + .1, 0, .36, .13, .58, Pal.can);
    B(-.275, TOP + .166, 0, .3, .006, .5, Pal.gray);
    // USB, buttons, LED, small components
    B(.73, TOP + .055, 0, .24, .11, .3, Pal.steel);
    B(.8, TOP + .05, 0, .08, .05, .2, Pal.darker);
    B(.36, TOP + .035, -.28, .12, .07, .12, Pal.dark); B(.36, TOP + .074, -.28, .1, .016, .1, Pal.steel);
    B(.36, TOP + .035, .28, .12, .07, .12, Pal.dark); B(.36, TOP + .074, .28, .1, .016, .1, Pal.steel);
    const led = B(.08, TOP + .03, .33, .06, .05, .04, Pal.led);
    B(.22, TOP + .03, -.06, .16, .06, .14, Pal.dark);
    B(.5, TOP + .03, .02, .14, .06, .12, Pal.dark);
    C(.5, TOP + .03, .2, .05, .06, Pal.darker);
    C(.5, TOP + .03, -.2, .05, .06, Pal.darker);
    B(-.02, TOP + .02, .1, .1, .04, .08, Pal.gray);
    // LED glow sprite
    const sm = new T.SpriteMaterial({ map: glow, color: 0xcfe0f8, transparent: true, opacity: .6, blending: T.AdditiveBlending, depthWrite: false, fog: false });
    const sprite = new T.Sprite(sm);
    sprite.position.set(.08, TOP + .05, .33); sprite.scale.set(.4, .4, 1);
    g.add(sprite);
    return { group: g, led, ledMat: sm };
  }

  /* ---------------- word "IoT" → dot matrix ---------------- */
  function sampleWord(T, text, cap) {
    const W = 512, H = 256;
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const g = c.getContext('2d', { willReadFrequently: true });
    g.fillStyle = '#fff';
    g.font = '900 176px "DM Sans","Noto Sans Thai",system-ui,sans-serif';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(text, W / 2, H / 2 + 6);
    const data = g.getImageData(0, 0, W, H).data;
    const grid = step => {
      const pts = [];
      for (let y = 0; y < H; y += step) for (let x = 0; x < W; x += step) if (data[(y * W + x) * 4 + 3] > 140) pts.push([x, y]);
      return pts;
    };
    let pts = null;
    for (let step = 5; step <= 46; step++) { const p = grid(step); if (p.length <= cap) { pts = p; break; } }
    if (!pts || !pts.length) pts = grid(46);
    let minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9;
    pts.forEach(([x, y]) => { minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y); });
    const bh = Math.max(1, maxY - minY), bw = Math.max(1, maxX - minX);
    const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
    const unit = pts.map(([x, y]) => [(x - cx) / bh, -(y - cy) / bh]);
    const rnd = rnd32(7);
    for (let i = unit.length - 1; i > 0; i--) { const j = (rnd() * (i + 1)) | 0; const tmp = unit[i]; unit[i] = unit[j]; unit[j] = tmp; }
    return { unit, aspect: bw / bh, spacing: Math.sqrt((bw / bh) / unit.length), scale: 1 };
  }

  function letterFit(aspect) {
    const vH = 2 * LETTER_DIST * Math.tan(LETTER_FOV * DEG / 2);
    const vW = vH * aspect;
    const margin = aspect < 1 ? .95 : .82;
    return Math.min(vW * margin / word.aspect, vH * .55);
  }

  function assignLetters() {
    if (!word || !camera) return;
    const fit = letterFit(camera.aspect);
    word.scale = fit;
    const spacingWorld = word.spacing * fit;
    const k = clamp(spacingWorld / 1.35, .1, 1.1);
    const rnd = rnd32(21);
    const n = Math.min(word.unit.length, pool.length);
    for (let i = 0; i < pool.length; i++) {
      const d = pool[i];
      const delay = (i % 14) * .05 + rnd() * .25;
      if (i < n) {
        const [ux, uy] = word.unit[i];
        d.letter = {
          px: ux * fit, py: uy * fit, pz: (rnd() - .5) * .3,
          rx: Math.PI / 2 + (rnd() - .5) * .6, ry: (rnd() - .5) * 1, rz: (rnd() - .5) * .5,
          s: d.baseScale * k * (d.hero ? .72 : 1),
          delay
        };
      } else {
        d.letter = { px: (rnd() - .5) * 10, py: -13 - rnd() * 4, pz: -6, rx: 0, ry: 0, rz: 0, s: d.baseScale * .4, delay };
      }
    }
    if (lettersGlow) {
      lettersGlow.position.z = -1.2;
      lettersGlow.scale.set(fit * word.aspect * 1.6, fit * 2.7, 1);
    }
  }

  /* ---------------- per-frame update ---------------- */
  allDevices = devices;
  const TMP_A = { x: 0, y: 0, z: 0 };
  function cloudPos(d, t, out) {
    let x = d.cloud[0], y = d.cloud[1], z = d.cloud[2];
    if (d.drift) {
      x += Math.sin(t * d.drift.sx + d.drift.px) * d.drift.ax;
      y += Math.sin(t * d.drift.sy + d.drift.py) * d.drift.ay;
      z += Math.cos(t * d.drift.sz + d.drift.pz) * d.drift.az;
    }
    if (!d.hero) {
      const p = 1 + .5 * easeInOut(seg(t, T_APPROACH[0], T_APPROACH[1]));
      x *= p; y *= p; z *= p;
    }
    out.x = x; out.y = y; out.z = z;
    return out;
  }
  const cloudRot = (d, t, i) => d.rot0[i] + t * d.rotSpd[i];

  function flashAt(t) {
    if (t < 11 || t > 11.95) return 0;
    if (t < 11.18) return seg(t, 11, 11.18);
    if (t < 11.35) return 1;
    return Math.pow(1 - seg(t, 11.35, 11.95), 1.6);
  }

  let pv = null, lv = null, qv = null;

  function updateCamera(t) {
    if (!pv) { pv = new T.Vector3(); lv = new T.Vector3(); qv = new T.Vector3(); }
    let fov = 46, bank = 0;
    if (t < 3.5) {
      const u = smooth(seg(t, 0, 3.5));
      flyCurve.getPoint(u, pv); flyLook.getPoint(u, lv);
      fov = 46; bank = Math.sin(u * Math.PI * 4) * .05;
    } else if (t < 6.5) {
      const u = easeInOut(seg(t, 3.5, 6.5));
      const k = 1 - u;
      pv.set(k * k * approachFrom.x + 2 * k * u * approachCtrl.x + u * u * approachTo.x,
             k * k * approachFrom.y + 2 * k * u * approachCtrl.y + u * u * approachTo.y,
             k * k * approachFrom.z + 2 * k * u * approachCtrl.z + u * u * approachTo.z);
      flyLook.getPoint(1, lv);
      lv.set(mix(lv.x, 0, u), mix(lv.y, .08, u), mix(lv.z, 0, u));
      fov = mix(46, 34, u);
    } else if (t < 11) {
      const u = seg(t, 6.5, 11);
      boardCurve.getPoint(u, pv); boardLook.getPoint(u, lv);
      fov = mix(34, 31, u); bank = Math.sin(u * Math.PI * 3) * .022;
    } else if (t < 11.6) {
      const u = easeInOut(seg(t, 11, 11.6));
      boardCurve.getPoint(1, qv); boardLook.getPoint(1, lv);
      pv.set(mix(qv.x, widePos.x, u), mix(qv.y, widePos.y, u), mix(qv.z, widePos.z, u));
      lv.set(mix(lv.x, 0, u), mix(lv.y, 0, u), mix(lv.z, 0, u));
      fov = mix(31, LETTER_FOV, u);
    } else {
      const u = easeOut(seg(t, 11.6, 13.4));
      const dolly = mix(LETTER_DIST, LETTER_DIST - .7, seg(t, 13.4, 16));
      pv.set(mix(widePos.x, 0, u), mix(widePos.y, 0, u), mix(widePos.z, dolly, u));
      lv.set(0, 0, 0);
      fov = LETTER_FOV;
    }
    camera.position.set(pv.x, pv.y, pv.z);
    camera.lookAt(lv.x, lv.y, lv.z);
    if (bank) camera.rotateZ(bank);
    if (Math.abs(camera.fov - fov) > .01) { camera.fov = fov; camera.updateProjectionMatrix(); }
  }

  function updateDevices(t) {
    const inLetters = t >= T_LETTERS[0];
    for (const d of allDevices) {
      const g = d.group;
      let x, y, z, rx, ry, rz, s = d.baseScale;
      if (inLetters && d.letter) {
        const start = T_LETTERS[0] + d.letter.delay;
        const u = (t - start) / LETTER_DUR;
        if (u <= 0) {
          cloudPos(d, t, TMP_A); x = TMP_A.x; y = TMP_A.y; z = TMP_A.z;
          rx = cloudRot(d, t, 0); ry = cloudRot(d, t, 1); rz = cloudRot(d, t, 2);
        } else if (u >= 1) {
          x = d.letter.px; y = d.letter.py; z = d.letter.pz;
          rx = d.letter.rx; ry = d.letter.ry; rz = d.letter.rz; s = d.letter.s;
        } else {
          const e = easeOutBack(clamp(u)), ec = clamp(u);
          cloudPos(d, start, TMP_A);
          x = mix(TMP_A.x, d.letter.px, e); y = mix(TMP_A.y, d.letter.py, e); z = mix(TMP_A.z, d.letter.pz, e);
          rx = mix(cloudRot(d, start, 0), d.letter.rx, ec);
          ry = mix(cloudRot(d, start, 1), d.letter.ry, ec);
          rz = mix(cloudRot(d, start, 2), d.letter.rz, ec);
          s = mix(d.baseScale, d.letter.s, ec);
        }
      } else {
        cloudPos(d, t, TMP_A); x = TMP_A.x; y = TMP_A.y; z = TMP_A.z;
        rx = cloudRot(d, t, 0); ry = cloudRot(d, t, 1); rz = cloudRot(d, t, 2);
      }
      g.position.set(x, y, z);
      g.rotation.set(rx, ry, rz);
      g.scale.setScalar(s);
    }
  }

  function update(t) {
    if (flashEl) flashEl.style.opacity = flashAt(t).toFixed(3);

    // caption chip
    if (chipEl) {
      const idx = CHIP_WINDOWS.findIndex(([a, b]) => t >= a && t < b);
      if (idx < 0) { if (!chipEl.hidden) chipEl.hidden = true; }
      else {
        const txt = CHIP_COPY[lang][idx];
        if (chipText.textContent !== txt) chipText.textContent = txt;
        if (chipEl.hidden) chipEl.hidden = false;
      }
    }

    updateCamera(t);
    updateDevices(t);

    // hotspot rings
    for (const r of rings) {
      const w0 = 6.6 + r.userData.j * 1.05;
      const u = seg(t, w0, w0 + 1.7);
      const on = t >= w0 && t <= w0 + 1.7;
      r.material.opacity = on ? Math.sin(Math.PI * u) * .9 : 0;
      const sc = on ? 1 + .3 * (1 - u) + .06 * Math.sin(t * 9) : 1;
      r.scale.setScalar(sc);
      r.visible = t < 11.6;
    }
    if (hero) hero.ledMat.opacity = .45 + .3 * Math.sin(t * 4);
    if (lettersGlow) {
      const op = .55 * easeOut(seg(t, 11.6, 13));
      lettersGlow.material.opacity = op;
      lettersGlow.visible = op > .01;
    }
    if (scene && scene.userData.stars) scene.userData.stars.rotation.y = t * .008;

    // -- finale: a beam of light wipes the overlay away and hands over to the page
    if (clipEl && sweepEl) {
      const u = seg(t, T_SWEEP[0], T_SWEEP[1]);
      if (u <= 0) {
        if (clipEl.style.clipPath) { clipEl.style.clipPath = ''; sweepEl.style.opacity = '0'; }
      } else {
        // smoothstep: the beam eases in off the left edge and accelerates across the letters
        const p = smooth(u);
        const x = mix(-18, 118, p);                       // beam position in % of viewport width
        const lead = clamp((x + 18) / 136);               // 0 at the left edge → 1 past the right
        const tilt = 9;                                   // beam lean, in % of width
        clipEl.style.clipPath = `polygon(${x}% 0%, 100% 0%, 100% 100%, ${x - tilt}% 100%)`;
        sweepEl.style.opacity = (smooth(seg(lead, 0, .12)) * (1 - smooth(seg(lead, .88, 1)))).toFixed(3);
        sweepEl.style.setProperty('--sweep-x', x.toFixed(2) + '%');
        sweepEl.style.setProperty('--sweep-lean', (-tilt) + 'vw');
      }
    }

    if (!revealed && t >= REVEAL_AT) { revealed = true; document.body.classList.add('intro-done'); }
    if (!leaving && t >= LEAVE_AT) { leaving = true; overlay.classList.add('is-leaving'); }
  }

  function frame() {
    raf = requestAnimationFrame(frame);
    if (dead) return;
    const t = timeNow();
    try { update(t); } catch (err) { console.warn('Intro frame failed', err); finish(false); return; }
    Snd.tick(t);
    renderer.render(scene, camera);
    if (t >= TOTAL) { if (!revealed) document.body.classList.add('intro-done'); finish(true); }
  }
})();
