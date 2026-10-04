// Lucky Hub — IOT888 arcade (100% simulated: fictional credits in localStorage,
// no real money, no prizes, no network). One page = one game; this router
// initialises whichever game the current page declares via <body data-game="">.
// Pages: lucky.html (lobby+credits) · game-slot / game-race / game-bingo / game-plinko.
(function () {
  'use strict';

  const $ = id => document.getElementById(id);
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const GAME = document.body.dataset.game || '';

  /* ================= shared credits + toast ================= */
  const START_CREDIT = 1000;
  let credit = START_CREDIT;
  try {
    const saved = localStorage.getItem('lucky-credit');
    if (saved !== null) credit = Math.max(0, parseInt(saved, 10) || 0);
  } catch (e) { /* storage blocked */ }

  const creditEl = $('credit-value');
  let creditSeen = false, bumpTimer = 0;
  function renderCredit() {
    if (!creditEl) return;
    creditEl.textContent = credit.toLocaleString('en-US');
    // Balance nudge (21st.dev Number Ticker) — only when the value changes.
    if (creditSeen) {
      const pill = creditEl.closest('.lucky-credit');
      if (pill) {
        pill.classList.remove('bump'); void pill.offsetWidth; pill.classList.add('bump');
        clearTimeout(bumpTimer); bumpTimer = setTimeout(() => pill.classList.remove('bump'), 480);
      }
    }
    creditSeen = true;
  }
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

  const toastEl = $('lucky-toast');
  let toastTimer = 0;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toastEl.hidden = true; }, 2600);
  }
  function say(el, cls, msg) {
    if (!el) return;
    el.textContent = msg;
    el.classList.remove('win', 'lose');
    if (cls) el.classList.add(cls);
  }

  const resetBtn = $('lucky-reset');
  if (resetBtn) resetBtn.addEventListener('click', () => { setCredit(START_CREDIT); toast('เติมเครดิต 1,000 แล้ว'); });
  renderCredit();

  // Card spotlight: the glow follows the cursor (Aceternity Card Spotlight).
  document.querySelectorAll('.game-card').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  /* ================= shared bet chips: stake chosen per round ================= */
  const BETS = [10, 50, 100, 500];
  function wireChips(boxId, values, initial, onChange) {
    const box = $(boxId);
    let val = values.includes(initial) ? initial : values[0];
    if (box) {
      box.innerHTML = values.map(v => `<button type="button" class="bet-chip${v === val ? ' on' : ''}" data-v="${v}">${v}</button>`).join('');
      box.addEventListener('click', e => {
        const btn = e.target.closest('.bet-chip'); if (!btn) return;
        val = +btn.dataset.v;
        box.querySelectorAll('.bet-chip').forEach(c => c.classList.toggle('on', c === btn));
        onChange && onChange(val);
      });
    }
    onChange && onChange(val); // sync labels with the initial value
    return () => val;
  }
  function loadBet(game) {
    let b = 0;
    try { b = parseInt(localStorage.getItem('lucky-bet-' + game), 10) || 0; } catch (e) { }
    return BETS.includes(b) ? b : 50;
  }
  function wireBet(game, boxId, totalId, onChange) {
    return wireChips(boxId, BETS, loadBet(game), v => {
      try { localStorage.setItem('lucky-bet-' + game, String(v)); } catch (e) { }
      const t = $(totalId); if (t) t.textContent = 'ต่อรอบ ' + v;
      onChange && onChange(v);
    });
  }

  /* ================= slot machine — IoT equipment reels ================= */
  if (GAME === 'slot') {
    const SYM = [
      { type: 'board', label: 'UNO R3' },
      { type: 'esp32', label: 'ESP32' },
      { type: 'nano', label: 'NANO' },
      { type: 'ultra', label: 'HC-SR04' },
      { type: 'relay', label: 'RELAY' },
      { type: 'servo', label: 'SERVO' }
    ];
    const reels = [$('slot-r0'), $('slot-r1'), $('slot-r2')];
    const slotOut = $('slot-out'), slotBtn = $('slot-btn');
    const svg = t => window.boardSvg ? window.boardSvg(t) : '';
    let rounds = 1;
    const syncSlotLabel = () => {
      const bet = getBet();
      slotBtn.textContent = rounds > 1 ? `หมุน ×${rounds} (รวม ${bet * rounds})` : `หมุน (${bet})`;
    };
    let getBet = () => 50; // placeholder until wireBet returns
    getBet = wireBet('slot', 'slot-bets', 'slot-total', syncSlotLabel);
    wireChips('slot-rounds', [1, 5, 10], 1, v => { rounds = v; syncSlotLabel(); });
    syncSlotLabel();

    // Set the idle faces so the machine never looks empty.
    reels.forEach((r, i) => { r.querySelector('.slot-face').innerHTML = svg(SYM[i % SYM.length].type); });

    let slotBusy = false;
    slotBtn.addEventListener('click', async () => {
      if (slotBusy) return;
      slotBusy = true; slotBtn.disabled = true;
      const bet = getBet();
      for (let round = 1; round <= rounds; round++) {
      if (!spend(bet)) { toast(round === 1 ? 'เครดิตไม่พอ — ลดเดิมพันหรือกดรีเซ็ต' : `เครดิตไม่พอ — หยุดที่รอบ ${round - 1}/${rounds}`); break; }
      say(slotOut, null, rounds > 1 ? `รอบ ${round}/${rounds}…` : 'กำลังหมุน…');
      reels.forEach(r => { r.classList.remove('bounce', 'gold'); r.classList.add('spinning'); });

      // Odds tuned for swings: ~1.5% triple at ×35, ~22% pair at ×2, rest loses (RTP ≈ 96.5%).
      const res = [0, 0, 0].map(() => Math.floor(Math.random() * SYM.length));
      const roll = Math.random();
      if (roll < .015) { const s = Math.floor(Math.random() * SYM.length); res[0] = res[1] = res[2] = s; }
      else if (roll < .235) {
        const a = Math.floor(Math.random() * SYM.length);
        let b = Math.floor(Math.random() * SYM.length); if (b === a) b = (b + 1) % SYM.length;
        res[0] = res[1] = a; res[2] = b;
        if (Math.random() < .5) { res[1] = res[2]; res[2] = a; }
      }

      // Tumble random IoT parts on every reel until its stop moment.
      const tumble = setInterval(() => {
        reels.forEach(r => {
          if (!r.classList.contains('spinning')) return;
          r.querySelector('.slot-face').innerHTML = svg(SYM[Math.floor(Math.random() * SYM.length)].type);
        });
      }, 90);

      for (let i = 0; i < 3; i++) {
        await sleep(520);
        const r = reels[i];
        r.classList.remove('spinning');
        r.querySelector('.slot-face').innerHTML = svg(SYM[res[i]].type);
        r.classList.add('bounce');
        await sleep(120);
      }
      clearInterval(tumble);
      reels.forEach(r => r.classList.remove('spinning'));
      await sleep(260);

      const [a, b, c] = res;
      if (a === b && b === c) {
        const w = bet * 35; pay(w);
        reels.forEach(r => r.classList.add('gold'));
        say(slotOut, 'win', `${SYM[a].label} ×3 แจ็คพอต! +${w}`);
        toast('แจ็คพอต ' + SYM[a].label + ' ×3! +' + w);
      } else if (a === b || b === c || a === c) {
        const w = bet * 2; pay(w);
        say(slotOut, 'win', `คู่ ${SYM[a === b ? 0 : 2].label}! +${w}`);
      } else say(slotOut, 'lose', 'ไม่ตรงกัน');
      if (round < rounds) await sleep(300);
      }
      slotBtn.disabled = false; slotBusy = false;
    });
  }

  /* ================= horse race ================= */
  if (GAME === 'race') {
    // Horse photos (in the order they were supplied) replace emoji sprites.
    const HORSES = [
      { name: 'ม้าเมฆา', img: 'assets/horses/horse1.png', w: .40, pay: 2.2 },
      { name: 'ม้าสายฟ้า', img: 'assets/horses/horse2.png', w: .30, pay: 3.2 },
      { name: 'ม้าทะยาน', img: 'assets/horses/horse3.png', w: .20, pay: 4.5 },
      { name: 'ม้ามืดฟ้า', img: 'assets/horses/horse4.png', w: .10, pay: 9 }
    ];
    const racePick = $('race-pick'), raceTrack = $('race-track'), raceOut = $('race-out'), raceBtn = $('race-btn');
    let raceHorse = 0, raceBusy = false;
    const getBet = wireBet('race', 'race-bets', 'race-total', v => { raceBtn.textContent = `เริ่มแข่ง (${v})`; });

    racePick.innerHTML = HORSES.map((h, i) =>
      `<button type="button" class="race-horse${i === 0 ? ' on' : ''}" role="radio" aria-checked="${i === 0}" data-i="${i}"><img class="race-thumb" src="${h.img}" alt="">${h.name} <small>×${h.pay}</small></button>`).join('');
    racePick.addEventListener('click', e => {
      const btn = e.target.closest('.race-horse'); if (!btn || raceBusy) return;
      raceHorse = +btn.dataset.i;
      racePick.querySelectorAll('.race-horse').forEach(b => { b.classList.toggle('on', b === btn); b.setAttribute('aria-checked', b === btn); });
    });
    raceTrack.innerHTML = HORSES.map((h, i) =>
      `<span class="race-lane" style="top:${i * 32}px"><span class="race-horse-sprite" id="horse-${i}"><img src="${h.img}" alt="${h.name}"></span></span>`).join('');
    const sprites = HORSES.map((_, i) => $('horse-' + i));

    raceBtn.addEventListener('click', async () => {
      if (raceBusy) return;
      const bet = getBet();
      if (!spend(bet)) return;
      raceBusy = true; raceBtn.disabled = true;
      say(raceOut, null, 'กำลังแข่ง…');
      sprites.forEach(s => s.classList.remove('win'));

      // Weighted winner: the favourite (40%) wins most often.
      let r = Math.random(), winner = 0;
      for (let i = 0; i < HORSES.length; i++) { r -= HORSES[i].w; if (r <= 0) { winner = i; break; } }

      const DUR = 2600;
      const finish = HORSES.map((_, i) => i === winner ? DUR * (.92 + Math.random() * .08) : DUR * (1.05 + Math.random() * .4));
      const trackW = raceTrack.clientWidth - 46;
      const t0 = performance.now();
      // setTimeout stepping (not rAF) so the race keeps running in background tabs.
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

      if (winner === raceHorse) { const w = Math.round(bet * HORSES[winner].pay); pay(w); say(raceOut, 'win', `${HORSES[winner].name} เข้าเส้นชัย! +${w}`); toast('ม้าของคุณชนะ +' + w); }
      else say(raceOut, 'lose', `${HORSES[winner].name} ชนะ — เสียโอกาส`);
      raceBtn.disabled = false; raceBusy = false;
    });
  }

  /* ================= bingo ================= */
  if (GAME === 'bingo') {
    const cardEl = $('bingo-card'), bingoOut = $('bingo-out'), bingoBtn = $('bingo-btn'),
      bingoNew = $('bingo-new'), lastEl = $('bingo-last');
    const getBet = wireBet('bingo', 'bingo-bets', 'bingo-total', v => { bingoBtn.textContent = `เจาะสลาก (${v})`; });
    const HEADS = ['B', 'I', 'N', 'G', 'O'];
    let bag = [], hits = [], claimed = { line1: false, line2: false, full: false };

    const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]]; } return a; };
    const colLetter = n => HEADS[Math.floor((n - 1) / 15)];

    function newCard() {
      // Column c draws 5 unique numbers from its 15-number range (classic US bingo).
      const cols = [0, 1, 2, 3, 4].map(c => shuffle(Array.from({ length: 15 }, (_, i) => c * 15 + i + 1)).slice(0, 5));
      hits = Array(25).fill(false);
      hits[12] = true; // free star center
      bag = shuffle(Array.from({ length: 75 }, (_, i) => i + 1));
      claimed = { line1: false, line2: false, full: false };
      renderCard(cols);
      lastEl.textContent = '– –';
      say(bingoOut, null, 'การ์ดใหม่พร้อมแล้ว');
    }

    function renderCard(cols) {
      let html = HEADS.map(h => `<span class="bingo-cell head">${h}</span>`).join('');
      for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) {
        const i = r * 5 + c;
        if (i === 12) html += `<span class="bingo-cell hit star" data-i="12">⭐</span>`;
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

    function applyDraw(n, bet) {
      const cell = [...cardEl.children].find(c => c.textContent.trim() === String(n) && c.dataset.i !== undefined);
      if (cell) { hits[+cell.dataset.i] = true; cell.classList.add('hit'); }
      lastEl.textContent = `${colLetter(n)}-${n}`;
      const lines = countLines(), full = hits.every(Boolean);
      say(bingoOut, null, `ออกเลข ${n} · เส้น ${lines}${full ? ' · เต็มการ์ด!' : ''}`);
      // Payouts from a 200k-game simulation: E[first line] ≈ 41 draws, full ≈ 73.
      // Cumulative ×38 / ×47 / ×70 => RTP ≈ 92–96% with big early-vs-late swings.
      if (lines >= 1 && !claimed.line1) { claimed.line1 = true; const w = bet * 38; pay(w); say(bingoOut, 'win', `บิงโก 1 เส้น! +${w}`); toast('บิงโก 1 เส้น! +' + w); }
      if (lines >= 2 && !claimed.line2) { claimed.line2 = true; const w = bet * 9; pay(w); say(bingoOut, 'win', `2 เส้น! +${w} (รวม ×47)`); toast('ครบ 2 เส้น! +' + w); }
      if (full && !claimed.full) { claimed.full = true; const w = bet * 23; pay(w); say(bingoOut, 'win', `เต็มการ์ด! +${w} รวม ×70`); toast('เต็มการ์ด! รวมได้ ×70'); }
      return { lines, full };
    }

    bingoBtn.addEventListener('click', () => {
      if (!bag.length) { toast('สลากหมดแล้ว — กด "การ์ดใหม่"'); return; }
      const bet = getBet();
      if (!spend(bet)) return;
      const n = bag.splice(Math.floor(Math.random() * bag.length), 1)[0];
      applyDraw(n, bet);
    });
    bingoNew.addEventListener('click', newCard);
    newCard();

    // Test-only hook: draw a specific number without charging.
    window.__luckyForceDraw = n => {
      const idx = bag.indexOf(n);
      if (idx < 0) return false;
      bag.splice(idx, 1);
      return applyDraw(n, getBet());
    };
  }

  /* ================= plinko (เกมบลิ้ง) ================= */
  if (GAME === 'plinko') {
    // Left -> right, matching the page copy: ×4 ×0 ×2 ×0 ×4 — 64% lose, 25% double,
    // 11% quad; binomial edge probability keeps RTP ≈ 93%.
    const BUCKETS = [
      { label: '×4', mult: 4 }, { label: '×0', mult: 0 }, { label: '×2', mult: 2 },
      { label: '×0', mult: 0 }, { label: '×4', mult: 4 }
    ];
    const cv = $('plinko-canvas'), ctx = cv.getContext('2d');
    const plinkoOut = $('plinko-out'), plinkoBtn = $('plinko-btn');
    const getBet = wireBet('plinko', 'plinko-bets', 'plinko-total', v => { plinkoBtn.textContent = `โยนเหรียญ (${v})`; });
    const ROWS = 7, DROP_X = cv.width / 2;
    const pegs = [];
    for (let r = 0; r < ROWS; r++) {
      const count = 3 + r, gapX = (cv.width - 80) / (count - 1);
      for (let i = 0; i < count; i++) pegs.push({ x: 40 + i * gapX, y: 36 + r * 40 });
    }
    const bucketW = cv.width / 5;
    let hitBucket = -1, drop = null, plinkoBusy = false, cols = null;

    function readColors() {
      const cs = getComputedStyle(document.body); // cyberpunk tokens are scoped to body[data-lucky]
      cols = {
        peg: cs.getPropertyValue('--line-strong').trim() || 'rgba(0,240,255,.3)',
        ink: cs.getPropertyValue('--ink').trim() || '#eaf7ff',
        accent: cs.getPropertyValue('--accent').trim() || '#00f0ff'
      };
    }
    function drawBoard() {
      if (!cols) readColors();
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.fillStyle = cols.peg;
      pegs.forEach(p => { ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, 7); ctx.fill(); });
      BUCKETS.forEach((b, i) => {
        const x = i * bucketW + 6, w = bucketW - 12, y = cv.height - 42;
        ctx.fillStyle = i === hitBucket ? cols.accent : 'rgba(127,127,127,.16)';
        ctx.strokeStyle = i === hitBucket ? cols.accent : cols.peg;
        ctx.beginPath(); ctx.roundRect(x, y, w, 34, 8); ctx.fill(); ctx.stroke();
        ctx.fillStyle = i === hitBucket ? '#06040f' : cols.ink;
        ctx.font = 'bold 15px "DM Sans", sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(b.label, x + w / 2, y + 17);
      });
      if (drop) { ctx.fillStyle = cols.accent; ctx.beginPath(); ctx.arc(drop.x, drop.y, 9, 0, 7); ctx.fill(); }
    }

    plinkoBtn.addEventListener('click', async () => {
      if (plinkoBusy) return;
      const bet = getBet();
      if (!spend(bet)) return;
      plinkoBusy = true; plinkoBtn.disabled = true;
      say(plinkoOut, null, 'เหรียญกำลังร่วง…');
      hitBucket = -1;

      // 10 coin flips -> binomial pyramid; map symmetrically to the 5 buckets.
      const flips = Array.from({ length: 10 }, () => Math.random() < .5 ? 0 : 1).reduce((a, b) => a + b, 0);
      const bucket = Math.max(0, Math.min(4, flips <= 2 ? 0 : flips <= 4 ? 1 : flips === 5 ? 2 : flips <= 7 ? 3 : 4));

      const targetX = bucket * bucketW + bucketW / 2;
      const t0 = performance.now(), DUR = 1500;
      // setTimeout stepping (not rAF) so the coin keeps falling in background tabs.
      await new Promise(resolve => {
        (function frame() {
          const t = Math.min(1, (performance.now() - t0) / DUR);
          const y = 20 + t * (cv.height - 95);
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
      if (b.mult > 0) { const w = bet * b.mult; pay(w); say(plinkoOut, 'win', `ลงถัง ${b.label}! +${w}`); toast('ลงถัง ' + b.label + ' +' + w); }
      else say(plinkoOut, 'lose', 'ลงถัง ×0');
      setTimeout(() => { hitBucket = -1; drawBoard(); }, 1200);
      plinkoBtn.disabled = false; plinkoBusy = false;
    });
    drawBoard();
  }

  // Debug/test hooks.
  window.__lucky = { credit: () => credit, setCredit, spend, pay, game: GAME };
})();
