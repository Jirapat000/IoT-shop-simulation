(() => {
  const toggle = document.querySelector('#board-model-toggle');
  const board = document.querySelector('.board');
  if (!toggle || !board) return;

  const name = document.querySelector('#hero-board-name');
  const subtitle = document.querySelector('#hero-board-subtitle');
  const version = document.querySelector('#hero-board-version');
  const status = document.querySelector('#board-part-status');
  const partGroups = [
    ['.hole-a', 'Mounting hole A', 'รูยึดบอร์ด A', 'Mounting hole · case mounting point'],
    ['.hole-b', 'Mounting hole B', 'รูยึดบอร์ด B', 'Mounting hole · case mounting point'],
    ['.hole-c', 'Mounting hole C', 'รูยึดบอร์ด C', 'Mounting hole · case mounting point'],
    ['.hole-d', 'Mounting hole D', 'รูยึดบอร์ด D', 'Mounting hole · case mounting point'],
    ['.header-l', 'Left GPIO pin header', 'แถวขา GPIO ด้านซ้าย', 'GPIO pins · connect sensors and modules'],
    ['.header-r', 'Right GPIO pin header', 'แถวขา GPIO ด้านขวา', 'GPIO pins · connect sensors and modules'],
    ['.board-shield', 'ESP-WROOM-32 radio module', 'โมดูลวิทยุ ESP-WROOM-32', 'ESP-WROOM-32 · Wi-Fi and Bluetooth'],
    ['.module-antenna', 'PCB antenna', 'เสาอากาศบนแผ่นวงจร', 'PCB antenna · 2.4 GHz wireless'],
    ['.board-usb', 'Micro-USB port', 'พอร์ต Micro-USB', 'Micro-USB · power and upload sketches'],
    ['.board-chip', 'Voltage regulator', 'ชิปควบคุมแรงดันไฟฟ้า', 'Voltage regulator · supplies stable 3.3V'],
    ['.board-led', 'Power indicator LED', 'ไฟแสดงสถานะบนบอร์ด', 'Power LED · click to toggle it'],
    ['.button-en', 'EN reset button', 'ปุ่ม EN สำหรับรีเซ็ต', 'EN · restart the board'],
    ['.button-boot', 'BOOT button', 'ปุ่ม BOOT', 'BOOT · toggle bootloader mode'],
  ];
  const parts = partGroups.flatMap(([selector, label, thai, english]) =>
    [...board.querySelectorAll(selector)].map(element => {
      element.dataset.boardPart = selector.slice(1);
      element.setAttribute('role', 'button');
      element.setAttribute('aria-label', label);
      element.tabIndex = 0;
      return { element, selector, thai, english };
    })
  );

  function syncPartAccessibility() {
    const isModule = board.dataset.model === 'module';
    for (const part of parts) {
      const hidden = part.selector === '.module-antenna' ? !isModule : isModule && ['.hole-', '.header-', '.board-usb', '.board-chip', '.board-led', '.button-'].some(prefix => part.selector.startsWith(prefix));
      part.element.tabIndex = hidden ? -1 : 0;
      part.element.setAttribute('aria-hidden', String(hidden));
    }
  }

  function showStatus(thai, english) {
    if (status) status.textContent = document.documentElement.lang === 'en' ? english : thai;
  }

  function activatePart(element) {
    const part = parts.find(item => item.element === element);
    if (!part || element.getAttribute('aria-hidden') === 'true') return;

    element.classList.remove('is-part-active');
    void element.offsetWidth;
    element.classList.add('is-part-active');
    window.setTimeout(() => element.classList.remove('is-part-active'), 650);

    if (part.selector === '.board-led') {
      element.classList.toggle('is-led-off');
      const isOn = !element.classList.contains('is-led-off');
      showStatus(isOn ? 'ไฟสถานะติด · LED ON' : 'ไฟสถานะดับ · LED OFF', isOn ? 'Power LED · ON' : 'Power LED · OFF');
    } else if (part.selector === '.button-en') {
      board.classList.remove('is-resetting');
      void board.offsetWidth;
      board.classList.add('is-resetting');
      showStatus('รีเซ็ตบอร์ด · EN / RESET', 'Board reset · EN / RESET');
    } else if (part.selector === '.button-boot') {
      board.classList.toggle('is-boot-mode');
      const active = board.classList.contains('is-boot-mode');
      showStatus(active ? 'โหมดอัปโหลดเปิดอยู่ · BOOT MODE' : 'ออกจากโหมดอัปโหลด · RUN MODE', active ? 'Upload mode · BOOT' : 'Normal mode · RUN');
    } else {
      showStatus(part.thai, part.english);
    }
  }

  for (const part of parts) {
    part.element.addEventListener('click', () => activatePart(part.element));
    part.element.addEventListener('keydown', event => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      activatePart(part.element);
    });
  }
  syncPartAccessibility();

  toggle.addEventListener('click', () => {
    const showModule = board.dataset.model !== 'module';
    board.dataset.model = showModule ? 'module' : 'devkit';
    name.textContent = showModule ? 'ESP-WROOM-32' : 'ESP32';
    subtitle.textContent = showModule ? 'Wi-Fi · Bluetooth' : 'ESP-WROOM-32';
    version.textContent = showModule ? 'RF MODULE' : 'DEVKIT V1';
    toggle.setAttribute('aria-pressed', String(showModule));
    toggle.setAttribute('aria-label', showModule ? 'Switch back to ESP32 DevKit V1' : 'Switch to ESP-WROOM-32 module model');
    syncPartAccessibility();
    showStatus(showModule ? 'โมดูล ESP-WROOM-32 · Wi-Fi และ Bluetooth' : 'กลับสู่บอร์ด ESP32 DevKit V1', showModule ? 'ESP-WROOM-32 · Wi-Fi and Bluetooth module' : 'Back to ESP32 DevKit V1');
    board.classList.remove('is-switching');
    void board.offsetWidth;
    board.classList.add('is-switching');
    window.setTimeout(() => board.classList.remove('is-switching'), 500);
  });
})();
