// Lucky Hub — simulated betting games: slot machine, horse race, bingo, plinko.
// 100% entertainment: credits are fictional numbers in localStorage, no real money,
// no prizes, no network calls. House edges are tuned for a light simulation feel.
(function () {
  'use strict';

  const $ = id => document.getElementById(id);
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  /* ================= credits ================= */
  const START_CREDIT = 1000;
  let credit = START_CREDIT;
  try {
    const saved = localStorage.getItem('lucky-credit');
    if (saved !== null) credit = Math.max(0, parseInt(saved, 10) || 0);
  } catch (e) { /* storage blocked */ }

  const creditEl = $('credit-value');
  function renderCredit() { creditEl.textContent = credit.toLocaleString('en-US'); }
  function setCredit(v) {
    credit = Math.max(0, Math.round(v));
    try { localStorage.setItem('lucky-credit', String(credit)); } catch (e) { }
    renderCredit();
  }
  function spend(n) {
    if (credit < n) { toast('เครดิตไม่พอ — กดปุ่ม "รีเซ็ต" เพื่อเติมฟรี'); return false; }
    setCredit(credit - n);
    return true;
  }
  function pay(n) { setCredit(credit + n); }

  /* ================= toast + result line ================= */
  const toastEl = $('lucky-toast');
  let toastTimer = 0;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toastEl.hidden = true; }, 2600);
  }
  function say(el, cls, msg) {
    el.textContent = msg;
    el.classList.remove('win', 'lose');
    if (cls) el.classList.add(cls);
  }

  $('lucky-reset').addEventListener('click', () => { setCredit(START_CREDIT); toast('เติมเครดิตกลับเป็น 1,000 แล้ว'); });
  renderCredit();

  /* ================= 1) slot machine ================= */
  const SYM = ['🍒', '🍋', '🔔', '⭐', '7️⃣'];
  const SLOT_COST = 50;
  const reels = [$('slot-r0'), $('slot-r1'), $('slot-r2')];
  const slotOut = $('slot-out'), slotBtn = $('slot-btn');
  let slotBusy = false;

  slotBtn.addEventListener('click', async () => {
    if (slotBusy) return;
    if (!spend(SLOT_COST)) return;
    slotBusy = true; slotBtn.disabled = true;
    say(slotOut, null, 'กำลังหมุน…');
    reels.forEach(r => { r.classList.remove('bounce'); r.classList.add('spinning'); });

    // Friendly odds: ~1.5% triple, ~22% pair, rest pure random (RTP ≈ 96%).
    const res = [0, 0, 0].map(() => Math.floor(Math.random() * SYM.length));
    const roll = Math.random();
    if (roll < .015) { const s = Math.floor(Math.random() * SYM.length); res[0] = res[1] = res[2] = s; }
    else if (roll < .235) {
      const a = Math.floor(Math.random() * SYM.length);
      let b = Math.floor(Math.random() * SYM.length); if (b === a) b = (b + 1) % SYM.length;
      res[0] = res[1] = a; res[2] = b;
      if (Math.random() < .5) { res[1] = res[2]; res[2] = a; } // vary pair position
    }

    for (let i = 0; i < 3; i++) {
      await sleep(380);
      reels[i].classList.remove('spinning');
      reels[i].querySelector('.slot-face').textContent = SYM[res[i]];
      reels[i].classList.add('bounce');
    }
    await sleep(320);

    const [a, b, c] = res;
    if (a === b && b === c) { const w = SLOT_COST * 20; pay(w); say(slotOut, 'win', `${SYM[a]}${SYM[a]}${SYM[a]} แจ็คพอต! +${w}`); toast('🎰 แจ็คพอต! +' + w); }
    else if (a === b || b === c || a === c) { const w = SLOT_COST * 3; pay(w); say(slotOut, 'win', `คู่! +${w}`); }
    else say(slotOut, 'lose', 'ไม่ตรงกัน 😿');
    slotBtn.disabled = false; slotBusy = false;
  });

  /* ================= 2) horse race ================= */
  const HORSES = [
    { name: 'ม้าเมฆา', emoji: '🐎', w: .40, pay: 2.5 },
    { name: 'ม้าสายฟ้า', emoji: '🐴', w: .30, pay: 3.5 },
    { name: 'ม้าทะยาน', emoji: '🐎', w: .20, pay: 5 },
    { name: 'ม้ามืดฟ้า', emoji: '🐴', w: .10, pay: 10 }
  ];
  const RACE_COST = 100;
  const racePick = $('race-pick'), raceTrack = $('race-track'), raceOut = $('race-out'), raceBtn = $('race-btn');
  let raceHorse = 0, raceBusy = false;

  raceHorse = 0;
  racePick.innerHTML = HORSES.map((h, i) =>
    `<button type="button" class="race-horse${i === 0 ? ' on' : ''}" role="radio" aria-checked="${i === 0}" data-i="${i}">${h.emoji} ${h.name} <small>×${h.pay}</small></button>`).join('');
  racePick.addEventListener('click', e => {
    const btn = e.target.closest('.race-horse'); if (!btn || raceBusy) return;
    raceHorse = +btn.dataset.i;
    racePick.querySelectorAll('.race-horse').forEach(b => { b.classList.toggle('on', b === btn); b.setAttribute('aria-checked', b === btn); });
  });
  raceTrack.innerHTML = HORSES.map((h, i) =>
    `<span class="race-lane" style="top:${i * 29}px"><span class="race-horse-sprite" id="horse-${i}">${h.emoji}</span></span>`).join('');
  const sprites = HORSES.map((_, i) => $('horse-' + i));

  raceBtn.addEventListener('click', async () => {
    if (raceBusy) return;
    if (!spend(RACE_COST)) return;
    raceBusy = true; raceBtn.disabled = true;
    say(raceOut, null, 'กำลังแข่ง…');
    sprites.forEach(s => s.classList.remove('win'));

    // Weighted winner + staggered finish times so the favourite usually leads.
    let r = Math.random(), winner = 0;
    for (let i = 0; i < HORSES.length; i++) { r -= HORSES[i].w; if (r <= 0) { winner = i; break; } }

    const DUR = 2600;
    // setTimeout stepping (not rAF) so the race keeps running in background tabs.
    const finish = HORSES.map((_, i) => i === winner ? DUR * (.92 + Math.random() * .08) : DUR * (1.05 + Math.random() * .4));
    const trackW = raceTrack.clientWidth - 46;
    const t0 = performance.now();
    await new Promise(resolve => {
      (function frame() {
        const t = performance.now() - t0;
        let done = true;
        sprites.forEach((sp, i) => {
          const p = Math.min(1, t / finish[i]);
          const ease = 1 - Math.pow(1 - p, 2.2);                 // fast start, long fight
          const wobble = Math.sin(t / 130 + i * 2.1) * .018;      // lead changes
          const pos = Math.max(0, Math.min(1, ease + (p < 1 ? wobble : 0)));
          sp.style.left = (8 + pos * trackW) + 'px';
          if (p < 1) done = false;
          if (p >= 1 && i === winner) sp.classList.add('win');
        });
        if (!done) setTimeout(frame, 16); else resolve();
      })();
    });

    if (winner === raceHorse) { const w = Math.round(RACE_COST * HORSES[winner].pay); pay(w); say(raceOut, 'win', `${HORSES[winner].emoji} ${HORSES[winner].name} เข้าเส้นชัย! +${w}`); toast('🐎 ม้าของคุณชนะ +' + w); }
    else say(raceOut, 'lose', `${HORSES[winner].emoji} ${HORSES[winner].name} ชนะ — เสียโอกาส`);
    raceBtn.disabled = false; raceBusy = false;
  });

  /* ================= 3) bingo ================= */
  const BINGO_COST = 75;
  const cardEl = $('bingo-card'), bingoOut = $('bingo-out'), bingoBtn = $('bingo-btn'), bingoNew = $('bingo-new');
  const HEADS = ['B', 'I', 'N', 'G', 'O'];
  let bag = [], hits = [], claimed = { line1: false, line2: false, full: false };

  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]]; } return a; };

  function newCard() {
    // Column c draws 5 unique numbers from its 15-number range (classic US bingo).
    const cols = [0, 1, 2, 3, 4].map(c => shuffle(Array.from({ length: 15 }, (_, i) => c * 15 + i + 1)).slice(0, 5));
    hits = Array(25).fill(false);
    hits[12] = true; // free star center
    bag = shuffle(Array.from({ length: 75 }, (_, i) => i + 1));
    claimed = { line1: false, line2: false, full: false };
    renderCard(cols);
    say(bingoOut, null, 'การ์ดใหม่พร้อมแล้ว');
  }

  function renderCard(cols) {
    let html = HEADS.map(h => `<span class="bingo-cell head">${h}</span>`).join('');
    for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) {
      const i = r * 5 + c;
      if (i === 12) html += `<span class="bingo-cell hit" data-i="12">⭐</span>`;
      else html += `<span class="bingo-cell" data-i="${i}">${cols[c][r]}</span>`;
    }
    cardEl.innerHTML = html;
  }

  function countLines() {
    let lines = 0;
    for (let r = 0; r < 5; r++) if ([0, 1, 2, 3, 4].every(c => hits[r * 5 + c])) lines++;
    for (let c = 0; c < 5; c++) if ([0, 1, 2, 3, 4].every(r => hits[r * 5 + c])) lines++;
    if ([0, 6, 12, 18, 24].every(i => hits[i])) lines++;
    if ([4, 8, 12, 16, 20].every(i => hits[i])) lines++;
    return lines;
  }

  bingoBtn.addEventListener('click', () => {
    if (!bag.length) { toast('สลากหมดแล้ว — กด "การ์ดใหม่"'); return; }
    if (!spend(BINGO_COST)) return;
    const n = bag.splice(Math.floor(Math.random() * bag.length), 1)[0];
    const idx = [...cardEl.children].findIndex(cell => cell.textContent.trim() === String(n) && cell.dataset.i !== undefined);
    if (idx >= 0) {
      hits[+cardEl.children[idx].dataset.i] = true;
      cardEl.children[idx].classList.add('hit');
    }
    const lines = countLines(), full = hits.every(Boolean);
    say(bingoOut, null, `ออกเลข ${n} · เส้น ${lines}${full ? ' · เต็มการ์ด!' : ''}`);
    if (lines >= 1 && !claimed.line1) { claimed.line1 = true; pay(BINGO_COST * 3); say(bingoOut, 'win', `บิงโก 1 เส้น! +${BINGO_COST * 3}`); toast('🎱 บิงโก 1 เส้น! +' + BINGO_COST * 3); }
    if (lines >= 2 && !claimed.line2) { claimed.line2 = true; pay(BINGO_COST * 5); say(bingoOut, 'win', `2 เส้น! +${BINGO_COST * 5}`); toast('🎱 ครบ 2 เส้น! +' + BINGO_COST * 5); }
    if (full && !claimed.full) { claimed.full = true; pay(BINGO_COST * 19); say(bingoOut, 'win', `เต็มการ์ด! +${BINGO_COST * 19} รวม ×30`); toast('🎱 เต็มการ์ด! รวมได้ ×30'); }
  });
  bingoNew.addEventListener('click', () => { if (!bingoNew.disabled) newCard(); });
  newCard();

  /* ================= 4) plinko (เกมบลิ้ง) ================= */
  const PLINKO_COST = 40;
  const BUCKETS = [
    { label: '×5', mult: 5 }, { label: '×1', mult: 1 }, { label: '×0', mult: 0 },
    { label: '×1', mult: 1 }, { label: '×5', mult: 5 }
  ];
  const cv = $('plinko-canvas'), ctx = cv.getContext('2d');
  const plinkoOut = $('plinko-out'), plinkoBtn = $('plinko-btn');
  const ROWS = 7, DROP_X = cv.width / 2;
  const pegs = [];
  for (let r = 0; r < ROWS; r++) {
    const count = 3 + r, gapX = (cv.width - 80) / (count - 1);
    for (let i = 0; i < count; i++) pegs.push({ x: 40 + i * gapX, y: 36 + r * 40 });
  }
  const bucketW = cv.width / 5;
  let hitBucket = -1, drop = null, plinkoBusy = false, themeCols = null;

  function readTheme() {
    const cs = getComputedStyle(document.documentElement);
    themeCols = { peg: cs.getPropertyValue('--line-strong').trim() || '#94a3b8', ink: cs.getPropertyValue('--ink').trim() || '#112D4E', accent: cs.getPropertyValue('--accent').trim() || '#3F72AF' };
  }
  function drawBoard() {
    if (!themeCols) readTheme();
    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.fillStyle = themeCols.peg;
    pegs.forEach(p => { ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, 7); ctx.fill(); });
    BUCKETS.forEach((b, i) => {
      const x = i * bucketW + 6, w = bucketW - 12, y = cv.height - 42;
      ctx.fillStyle = i === hitBucket ? themeCols.accent : 'rgba(127,127,127,.16)';
      ctx.strokeStyle = i === hitBucket ? themeCols.accent : themeCols.peg;
      ctx.beginPath(); ctx.roundRect(x, y, w, 34, 8); ctx.fill(); ctx.stroke();
      ctx.fillStyle = i === hitBucket ? '#fff' : themeCols.ink;
      ctx.font = 'bold 15px DM Sans, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(b.label, x + w / 2, y + 17);
    });
    if (drop) { ctx.fillStyle = themeCols.accent; ctx.beginPath(); ctx.arc(drop.x, drop.y, 9, 0, 7); ctx.fill(); }
  }
  document.addEventListener('themechange', () => { themeCols = null; if (!drop) drawBoard(); });

  plinkoBtn.addEventListener('click', async () => {
    if (plinkoBusy) return;
    if (!spend(PLINKO_COST)) return;
    plinkoBusy = true; plinkoBtn.disabled = true;
    say(plinkoOut, null, 'เหรียญกำลังร่วง…');
    hitBucket = -1;

    // 10 coin flips -> binomial pyramid; map to the 5 buckets symmetrically.
    const flips = Array.from({ length: 10 }, () => Math.random() < .5 ? 0 : 1).reduce((a, b) => a + b, 0);
    const bucket = Math.max(0, Math.min(4, flips <= 2 ? 0 : flips <= 4 ? 1 : flips === 5 ? 2 : flips <= 7 ? 3 : 4));

    const targetX = bucket * bucketW + bucketW / 2;
    // setTimeout stepping (not rAF) so the coin keeps falling in background tabs.
    const t0 = performance.now(), DUR = 1500;
    await new Promise(resolve => {
      (function frame() {
        const t = Math.min(1, (performance.now() - t0) / DUR);
        const y = 20 + t * (cv.height - 95);
        // drift from center toward the chosen bucket with plinko-style zigzag
        const drift = (targetX - DROP_X) * t;
        const zig = Math.sin(t * 16) * 26 * (1 - t);
        drop = { x: DROP_X + drift + zig, y };
        drawBoard();
        if (t < 1) setTimeout(frame, 16); else { drop = null; resolve(); }
      })();
    });

    hitBucket = bucket;
    drawBoard();
    const b = BUCKETS[bucket];
    if (b.mult > 0) { const w = PLINKO_COST * b.mult; pay(w); say(plinkoOut, 'win', `ลงถัง ${b.label}! +${w}`); toast('🪙 ลงถัง ' + b.label + ' +' + w); }
    else say(plinkoOut, 'lose', 'ลงถัง ×0 😿');
    setTimeout(() => { hitBucket = -1; drawBoard(); }, 1200);
    plinkoBtn.disabled = false; plinkoBusy = false;
  });
  drawBoard();

  // Debug/test hooks. forceDraw processes a bingo number without charging (tests only).
  function forceDraw(n) {
    const idx = bag.indexOf(n);
    if (idx < 0) return false;
    bag.splice(idx, 1);
    const cell = [...cardEl.children].find(c => c.textContent.trim() === String(n) && c.dataset.i !== undefined);
    if (cell) { hits[+cell.dataset.i] = true; cell.classList.add('hit'); }
    const lines = countLines(), full = hits.every(Boolean);
    if (lines >= 1 && !claimed.line1) { claimed.line1 = true; pay(BINGO_COST * 3); }
    if (lines >= 2 && !claimed.line2) { claimed.line2 = true; pay(BINGO_COST * 5); }
    if (full && !claimed.full) { claimed.full = true; pay(BINGO_COST * 19); }
    say(bingoOut, null, `ออกเลข ${n} · เส้น ${lines}`);
    return { n, lines, full };
  }
  window.__lucky = { credit: () => credit, setCredit, spend, pay, forceDraw, bingoState: () => ({ left: bag.length, hits: hits.filter(Boolean).length, claimed: { ...claimed } }) };
})();
