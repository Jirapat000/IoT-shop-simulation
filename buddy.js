(() => {
  const root = document.getElementById('iot-buddy');
  if (!root) return;
  const panel = document.getElementById('buddy-panel');
  const avatar = document.getElementById('buddy-avatar');
  const tip = document.getElementById('buddy-tip');
  const tipText = document.getElementById('buddy-tip-text');
  const panelMessage = document.getElementById('buddy-panel-message');
  const contextLabel = document.getElementById('buddy-context');
  const restore = document.getElementById('buddy-restore');
  const storageKey = 'iotHubBuddyPrefs';
  let prefs = {};
  try { prefs = JSON.parse(localStorage.getItem(storageKey) || '{}'); } catch (_) {}
  let current = { key: 'home', title: 'หน้าแรก', message: 'สวัสดี! วันนี้อยากเรียนรู้เรื่อง IoT อะไรดี?', action: 'เริ่มจากเลือกบอร์ดหรือดูบทเรียนที่สนใจได้เลยครับ' };
  let tipTimer;

  function save() { try { localStorage.setItem(storageKey, JSON.stringify(prefs)); } catch (_) {} }
  function setPosition() {
    if (!prefs.position) return;
    root.style.left = `${Math.max(4, Math.min(innerWidth - 80, prefs.position.x))}px`;
    root.style.top = `${Math.max(4, Math.min(innerHeight - 80, prefs.position.y))}px`;
    root.style.right = 'auto'; root.style.bottom = 'auto';
  }
  setPosition();
  panel.hidden = true;
  restore.hidden = !prefs.hidden;
  root.hidden = !!prefs.hidden;

  const contexts = [
    ['#home', { key:'home', title:'หน้าแรก', message:'สวัสดี! วันนี้อยากเรียนรู้เรื่อง IoT อะไรดี?', action:'เริ่มจากเลือกบอร์ดหรือดูบทเรียนที่สนใจได้เลยครับ' }],
    ['.category-section', { key:'categories', title:'หมวดหมู่อุปกรณ์', message:'ลองเลือกประเภทบอร์ดหรือเซนเซอร์ให้ตรงกับโปรเจกต์ก่อนนะครับ', action:'แตะการ์ดหมวดหมู่เพื่อกรองอุปกรณ์ที่เกี่ยวข้องได้เลย' }],
    ['#products', { key:'products', title:'รายการอุปกรณ์', message:'หน้านี้รวมบอร์ดและอุปกรณ์สำหรับเริ่มทำโปรเจกต์ครับ', action:'ใช้ช่องค้นหาและตัวกรอง แล้วเปิดการ์ดเพื่อดูรายละเอียดกับความเข้ากันได้' }],
    ['#learn', { key:'learn', title:'บทเรียน IoT', message:'ลองทำตามทีละขั้นได้เลยครับ เริ่มจากพื้นฐานแล้วค่อยต่อยอด', action:'เตรียมบอร์ดและเซนเซอร์ตามรายการในบทเรียน แล้วทำตามลำดับขั้น' }],
    ['#shops', { key:'shops', title:'ร้านค้า', message:'ก่อนสั่งซื้อ ลองเช็กแรงดันไฟและความเข้ากันได้กับบอร์ดก่อนนะครับ', action:'เว็บนี้เป็นแหล่งข้อมูล ไม่ได้ขายสินค้าโดยตรง ตรวจราคาและสต็อกที่ร้านค้าก่อนสั่งซื้อ' }]
  ];
  const nodes = contexts.map(([selector, data]) => [document.querySelector(selector), data]).filter(([node]) => node);
  function useContext(data, announce = false) {
    if (current.key === data.key && !announce) return;
    current = data;
    contextLabel.textContent = data.title;
    panelMessage.textContent = data.action;
    root.dataset.state = data.key === 'shops' ? 'warning' : data.key === 'home' ? 'welcome' : 'idle';
    if (announce && !prefs.hidden && !sessionStorage.getItem(`buddy-seen-${data.key}`)) {
      say(data.message, data.key === 'shops' ? 'warning' : data.key === 'home' ? 'welcome' : 'explaining');
      sessionStorage.setItem(`buddy-seen-${data.key}`, '1');
    }
  }
  function say(text, state = 'explaining') {
    clearTimeout(tipTimer);
    tipText.textContent = text;
    document.querySelector('.buddy-tip-state').textContent = state === 'thinking' ? '…' : state === 'warning' ? '!' : state === 'success' ? '✦' : '✧';
    root.dataset.state = state;
    tip.hidden = false;
    tipTimer = setTimeout(() => { tip.hidden = true; root.dataset.state = 'idle'; }, 7000);
  }
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const data = nodes.find(([node]) => node === visible.target)?.[1];
      if (data) useContext(data, true);
    }, { threshold: [.35, .6] });
    nodes.forEach(([node]) => observer.observe(node));
  }
  function hashContext() {
    const id = location.hash || '#home';
    const data = nodes.find(([node]) => `#${node.id}` === id)?.[1];
    if (data) useContext(data, false);
  }
  addEventListener('hashchange', hashContext);
  hashContext();
  if (!prefs.hidden && !sessionStorage.getItem('buddy-welcomed')) {
    setTimeout(() => { if (current.key === 'home') say(current.message, 'welcome'); }, 1000);
    sessionStorage.setItem('buddy-welcomed', '1');
  }

  avatar.addEventListener('click', () => {
    if (dragged) return;
    panel.hidden = !panel.hidden;
    if (!panel.hidden) { tip.hidden = true; panelMessage.textContent = current.action; }
  });
  document.getElementById('buddy-close').addEventListener('click', () => { panel.hidden = true; });
  document.getElementById('buddy-minimize').addEventListener('click', () => { panel.hidden = true; });
  document.getElementById('buddy-tip-close').addEventListener('click', () => { tip.hidden = true; clearTimeout(tipTimer); });
  document.getElementById('buddy-hide').addEventListener('click', () => {
    root.hidden = true; restore.hidden = false; prefs.hidden = true; save();
  });
  restore.addEventListener('click', () => { root.hidden = false; restore.hidden = true; prefs.hidden = false; save(); });
  root.querySelector('.buddy-actions').addEventListener('click', event => {
    const action = event.target.closest('[data-buddy-action]')?.dataset.buddyAction;
    if (!action) return;
    const content = document.querySelector('#detail-content');
    const dialog = document.querySelector('#detail-dialog');
    if (action === 'products') {
      panel.hidden = true;
      document.querySelector('#products')?.scrollIntoView({ behavior: 'smooth' });
      say('พาไปดูรายการอุปกรณ์แล้วครับ ลองค้นหาชื่อบอร์ดหรือเซนเซอร์ได้เลย', 'success');
      return;
    }
    if (dialog?.open && content?.innerText.trim()) {
      panelMessage.textContent = `กำลังดู ${content.querySelector('h2')?.textContent || 'รายละเอียดอุปกรณ์'} อยู่ครับ ตรวจแรงดันและอินเทอร์เฟซก่อนนำไปต่อใช้งาน`;
      say(action === 'howto' ? 'เริ่มจากตรวจแรงดันไฟและขาที่รองรับ แล้วต่อวงจรตามคู่มือของอุปกรณ์ครับ' : 'รายละเอียดในหน้านี้ช่วยเช็กการใช้งานร่วมกันได้ ลองดูหัวข้อแรงดันไฟและอินเทอร์เฟซครับ', action === 'howto' ? 'warning' : 'explaining');
      return;
    }
    const text = action === 'recommend' ? current.message : action === 'explain' ? current.action : current.key === 'learn' ? 'เลือกบทเรียนที่ต้องการ แล้วเตรียมอุปกรณ์ตามรายการก่อนเริ่มทำทีละขั้นครับ' : current.key === 'shops' ? 'เปรียบเทียบรุ่นและตรวจแรงดันไฟ ราคา และสต็อกที่ร้านค้าก่อนสั่งซื้อนะครับ' : 'เลือกอุปกรณ์จากรายการ แล้วเปิดดูสเปกเพื่อเช็กความเข้ากันได้กับโปรเจกต์ครับ';
    panelMessage.textContent = text;
    say(text, action === 'howto' && current.key === 'shops' ? 'warning' : 'explaining');
  });

  let pointerStart = null, dragged = false;
  avatar.addEventListener('pointerdown', event => {
    pointerStart = { x:event.clientX, y:event.clientY, left:root.getBoundingClientRect().left, top:root.getBoundingClientRect().top, id:event.pointerId };
    dragged = false; avatar.setPointerCapture(event.pointerId);
  });
  avatar.addEventListener('pointermove', event => {
    if (!pointerStart || pointerStart.id !== event.pointerId) return;
    const dx = event.clientX - pointerStart.x, dy = event.clientY - pointerStart.y;
    if (Math.abs(dx) + Math.abs(dy) < 8 && !dragged) return;
    dragged = true;
    root.style.left = `${Math.max(4, Math.min(innerWidth - root.offsetWidth - 4, pointerStart.left + dx))}px`;
    root.style.top = `${Math.max(4, Math.min(innerHeight - root.offsetHeight - 4, pointerStart.top + dy))}px`;
    root.style.right = 'auto'; root.style.bottom = 'auto';
  });
  avatar.addEventListener('pointerup', () => {
    if (dragged) {
      const rect = root.getBoundingClientRect(); prefs.position = { x:rect.left, y:rect.top }; save();
      setTimeout(() => { dragged = false; }, 80);
    }
    pointerStart = null;
  });
  addEventListener('resize', () => { if (prefs.position) { prefs.position.x = Math.min(innerWidth - 80, prefs.position.x); prefs.position.y = Math.min(innerHeight - 80, prefs.position.y); save(); setPosition(); } });
})();
