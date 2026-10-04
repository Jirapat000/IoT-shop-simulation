/**
 * learn-simulation.js
 * Interactive IoT Project Simulator & Real-world Step-by-Step Guide
 * Built for IoT Hub Thailand with UI Craft Clarity principles
 */

(() => {
  let activeSimulation = null;
  let currentLesson = 1;

  // Semantic Vector SVGs (Lucide style) strictly adhering to UI Craft Clarity (Pillar 11)
  const ICONS = {
    zap: `<svg class="ui-svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    thermometer: `<svg class="ui-svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>`,
    wifi: `<svg class="ui-svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>`,
    wifiOff: `<svg class="ui-svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="1" y1="1" x2="23" y2="23"/><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/><path d="M10.71 5.05A16 16 0 0 1 22.58 9"/><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>`,
    package: `<svg class="ui-svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`,
    cpu: `<svg class="ui-svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>`,
    code: `<svg class="ui-svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
    rocket: `<svg class="ui-svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>`,
    wrench: `<svg class="ui-svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
    copy: `<svg class="ui-svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`,
    check: `<svg class="ui-svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>`,
    alert: `<svg class="ui-svg alert-svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
    play: `<svg class="ui-svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3"/></svg>`,
    pause: `<svg class="ui-svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`,
    refresh: `<svg class="ui-svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21h5v-5"/></svg>`,
    terminal: `<svg class="ui-svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>`,
    clock: `<svg class="ui-svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    palette: `<svg class="ui-svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.563-2.512 5.563-5.563C22 6.5 17.5 2 12 2Z"/></svg>`,
    trash: `<svg class="ui-svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>`,
    activity: `<svg class="ui-svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
    droplets: `<svg class="ui-svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/></svg>`,
    power: `<svg class="ui-svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>`,
    globe: `<svg class="ui-svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
    lightbulb: `<svg class="ui-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>`
  };

  function stopActiveSimulation() {
    if (activeSimulation) {
      if (typeof activeSimulation.destroy === 'function') {
        activeSimulation.destroy();
      }
      activeSimulation = null;
    }
  }

  function getLocale() {
    return localStorage.getItem('iothub-locale') || 'th';
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  // ==========================================
  // Lesson 1: Arduino Uno - Blink LED
  // ==========================================
  function createLesson1Data(lang) {
    const isTh = lang === 'th';
    return {
      id: 1,
      num: '01',
      time: isTh ? '15 นาที' : '15 min',
      difficulty: isTh ? 'เริ่มต้น' : 'Beginner',
      board: 'Arduino Uno R3',
      title: isTh ? 'ทำ LED ให้กะพริบ' : 'Blink an LED (Arduino Uno)',
      subtitle: isTh
        ? 'ควบคุมฮาร์ดแวร์พื้นฐาน สั่งจ่ายไฟ 5V เพื่อกะพริบหลอด LED'
        : 'Your first hardware sketch. Pulse 5V on a digital pin to toggle an LED.',
      bom: [
        { name: isTh ? 'Arduino Uno R3 พร้อมสาย USB' : 'Arduino Uno R3 with USB cable', qty: '1 บอร์ด' },
        { name: isTh ? 'หลอด LED 5 มม.' : '5mm LED', qty: '1 หลอด' },
        { name: isTh ? 'ตัวต้านทาน 220 โอห์ม (220Ω)' : '220Ω Resistor', qty: '1 ตัว' },
        { name: isTh ? 'แผ่นทดลองวงจร (Breadboard)' : 'Breadboard', qty: '1 แผ่น' },
        { name: isTh ? 'สายไฟ Jumper ผู้-ผู้' : 'Male-to-Male Jumper Wires', qty: '2 เส้น' }
      ],
      wiringSteps: isTh ? [
        'เสียบหลอด LED บนแผ่นเบรดบอร์ด (ขายาวคือขั้วบวก Anode, ขาสั้นคือขั้วลบ Cathode)',
        'ต่อตัวต้านทาน 220Ω อนุกรมกับขาบวก (ขายาว) ของ LED เพื่อจำกัดกระแสไฟฟ้า',
        'ต่อสายไฟ Jumper จากอีกขาของตัวต้านทานเข้าขา D13 บนบอร์ด Arduino Uno',
        'ต่อสายไฟ Jumper จากขาลบ (ขาสั้น) ของ LED เข้าขา GND บนบอร์ด Arduino Uno'
      ] : [
        'Insert the LED into the breadboard (long leg = Anode +, short leg = Cathode -).',
        'Wire the 220Ω resistor in series with the positive Anode leg to limit forward current.',
        'Connect a jumper wire from the resistor to Arduino digital pin D13.',
        'Connect a jumper wire from the negative Cathode leg directly to Arduino GND.'
      ],
      wiringWarning: isTh
        ? 'ข้อควรระวัง: ต้องต่อตัวต้านทาน 220Ω อนุกรมกับ LED เสมอเพื่อป้องกันหลอดขาดจากกระแสเกิน'
        : 'Caution: Always connect a current-limiting resistor in series. Never hook an LED straight to 5V.',
      code: `// ==========================================
// โปรเจกต์ที่ 01: ทำ LED ให้กะพริบ (Arduino Uno)
// ==========================================
#define LED_PIN 13       // กำหนดขา LED (ขา 13 มี LED ประจำบอร์ด)
#define BLINK_DELAY 1000 // ความเร็วกะพริบ (1000ms = 1 วินาที)

void setup() {
  pinMode(LED_PIN, OUTPUT);
  Serial.begin(9600);
  Serial.println("Arduino Uno Blink Initialized!");
}

void loop() {
  digitalWrite(LED_PIN, HIGH); // จ่ายไฟ 5V -> หลอดติด
  Serial.println("LED Status: ON  [5.0V]");
  delay(BLINK_DELAY);

  digitalWrite(LED_PIN, LOW);  // ตัดไฟ 0V -> หลอดดับ
  Serial.println("LED Status: OFF [0.0V]");
  delay(BLINK_DELAY);
}`,
      stepsToRun: isTh ? [
        'เสียบสาย USB เชื่อมต่อ Arduino เข้ากับคอมพิวเตอร์',
        'เปิดโปรแกรม Arduino IDE และคัดลอกโค้ดด้านบนไปวาง',
        'เลือก Tools > Board เป็น "Arduino Uno"',
        'เลือก Tools > Port ให้ตรงกับพอร์ต COM ที่เชื่อมต่อ',
        'กดปุ่ม Upload (ลูกศรขวา ➔) แล้วรอสถานะ "Done uploading"',
        'เปิด Serial Monitor (Ctrl+Shift+M) ที่ความเร็ว 9600 baud เพื่อตรวจสอบสถานะ'
      ] : [
        'Connect Arduino to computer via USB cable.',
        'Open Arduino IDE and paste the code above.',
        'Select Tools > Board > "Arduino Uno".',
        'Select Tools > Port corresponding to your connected device.',
        'Click the Upload button (arrow ➔) and wait for "Done uploading".',
        'Open Serial Monitor (Ctrl+Shift+M) at 9600 baud to view real-time logs.'
      ],
      troubleshooting: isTh ? [
        'หลอด LED ไม่ติด: สลับขั้วขาของ LED หรือตรวจสอบจุดเชื่อมต่อขา GND',
        'อัปโหลดโค้ดไม่สำเร็จ: ตรวจสอบสาย USB ว่ารองรับการส่งข้อมูล และเลือกพอร์ต COM ให้ถูกต้อง'
      ] : [
        'LED does not illuminate: Check polarity or verify GND wire connection.',
        'Upload failed: Ensure USB cable supports data transfer and correct COM port is chosen.'
      ]
    };
  }

  // ==========================================
  // Lesson 2: DHT22 - Temperature & Humidity
  // ==========================================
  function createLesson2Data(lang) {
    const isTh = lang === 'th';
    return {
      id: 2,
      num: '02',
      time: isTh ? '25 นาที' : '25 min',
      difficulty: isTh ? 'เริ่มต้น' : 'Beginner',
      board: 'Arduino / ESP32',
      title: isTh ? 'อ่านค่าจากเซ็นเซอร์ DHT22' : 'Read Sensor (DHT22 Temp & Humidity)',
      subtitle: isTh
        ? 'ต่อเซ็นเซอร์วัดสภาพแวดล้อม อ่านค่าอุณหภูมิและความชื้นสัมพัทธ์ในอากาศ'
        : 'Wire an environmental sensor and stream temperature & relative humidity.',
      bom: [
        { name: isTh ? 'Arduino Uno / Nano หรือ ESP32' : 'Arduino Uno / Nano or ESP32 board', qty: '1 บอร์ด' },
        { name: isTh ? 'เซ็นเซอร์ DHT22 (AM2302)' : 'DHT22 (AM2302) Module', qty: '1 ตัว' },
        { name: isTh ? 'ตัวต้านทาน 10kΩ (เฉพาะแบบ 4 ขาเปล่า)' : '10kΩ Resistor (bare 4-pin)', qty: '1 ตัว' },
        { name: isTh ? 'สายไฟ Jumper เมีย-ผู้' : 'Female-to-Male Jumper Wires', qty: '3 เส้น' }
      ],
      wiringSteps: isTh ? [
        'ต่อขา VCC (+) ของ DHT22 เข้าขา 5V (หรือ 3.3V สำหรับ ESP32)',
        'ต่อขา DATA (สัญญาณ) ของ DHT22 เข้าขา Digital D4 ของบอร์ด',
        'ต่อขา GND (-) ของ DHT22 เข้าขา GND ของบอร์ด',
        'หมายเหตุ: หากใช้โมดูลสำเร็จรูป 3 ขาจะมีตัวต้านทาน Pull-up ในตัวแล้ว'
      ] : [
        'Connect DHT22 VCC (+) to MCU 5V (or 3.3V on ESP32).',
        'Connect DHT22 DATA to digital pin D4.',
        'Connect DHT22 GND (-) to MCU GND.',
        'Note: 3-pin breakout modules already integrate the pull-up resistor.'
      ],
      wiringWarning: isTh
        ? 'ข้อควรระวัง: DHT22 ใช้เวลาสุ่มวัดทุก 2 วินาที (0.5 Hz) การอ่านถี่กว่านี้จะได้ค่าซ้ำหรือ NaN'
        : 'Caution: DHT22 requires a 2-second sampling interval (0.5 Hz). Faster polling returns stale data or NaN.',
      code: `// ==========================================
// โปรเจกต์ที่ 02: อ่านค่าจากเซ็นเซอร์ DHT22
// ติดตั้ง Library: "DHT sensor library" โดย Adafruit
// ==========================================
#include <DHT.h>

#define DHTPIN  4       // ขาดิจิทัลที่ต่อกับขา DATA ของเซ็นเซอร์
#define DHTTYPE DHT22   // กำหนดรุ่นเซ็นเซอร์เป็น DHT22 (AM2302)

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600);
  Serial.println("DHT22 Sensor Demo Initialized");
  dht.begin();
}

void loop() {
  delay(2000); // เว้นระยะ 2 วินาทีระหว่างรอบการอ่าน

  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();

  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("Error: Failed to read from DHT22! Check wiring.");
    return;
  }

  float heatIndex = dht.computeHeatIndex(temperature, humidity, false);

  Serial.print("อุณหภูมิ: ");
  Serial.print(temperature, 1);
  Serial.print(" *C  | ความชื้น: ");
  Serial.print(humidity, 1);
  Serial.print(" %RH  | Heat Index: ");
  Serial.print(heatIndex, 1);
  Serial.println(" *C");
}`,
      stepsToRun: isTh ? [
        'เปิด Arduino IDE ไปที่ Sketch > Include Library > Manage Libraries...',
        'ค้นหา "DHT sensor library" โดย Adafruit แล้วกด Install (เลือก Install All)',
        'คัดลอกโค้ดด้านบนใส่ใน Arduino IDE',
        'ต่อสาย DATA ของ DHT22 เข้าขา D4',
        'กด Upload แล้วเปิด Serial Monitor (9600 baud) เพื่ออ่านค่าแบบเรียลไทม์'
      ] : [
        'Open Arduino IDE -> Sketch > Include Library > Manage Libraries...',
        'Search "DHT sensor library" by Adafruit and click Install All.',
        'Paste the code above into Arduino IDE.',
        'Wire DHT22 DATA to digital pin D4.',
        'Click Upload and open Serial Monitor (9600 baud) to monitor live telemetry.'
      ],
      troubleshooting: isTh ? [
        'ขึ้น "Failed to read": ตรวจสอบการเสียบขา DATA ที่ D4 และขั้วไฟเลี้ยง VCC/GND',
        'ค่าไม่ขยับ: ลองเป่าลมอุ่นใกล้ตะแกรงเซ็นเซอร์ ค่าความชื้นและอุณหภูมิจะตอบสนองทันที'
      ] : [
        'Shows "Failed to read": Verify DATA is plugged into D4 and power wires are tight.',
        'Values seem static: Gently exhale near the sensor mesh to verify responsive reading spikes.'
      ]
    };
  }

  // ==========================================
  // Lesson 3: ESP32 - Send Data Over Wi-Fi
  // ==========================================
  function createLesson3Data(lang) {
    const isTh = lang === 'th';
    return {
      id: 3,
      num: '03',
      time: isTh ? '40 นาที' : '40 min',
      difficulty: isTh ? 'ปานกลาง' : 'Intermediate',
      board: 'ESP32 DevKit V1',
      title: isTh ? 'ควบคุมผ่าน Wi-Fi (ESP32)' : 'Control over Wi-Fi (ESP32)',
      subtitle: isTh
        ? 'เชื่อมต่อ ESP32 กับ Wi-Fi และสร้างเว็บเซิร์ฟเวอร์เปิด-ปิดอุปกรณ์ไฟฟ้าจากมือถือ'
        : 'Connect ESP32 to Wi-Fi and host a local web dashboard to switch relays remotely.',
      bom: [
        { name: isTh ? 'บอร์ด ESP32 DevKit V1 พร้อมสาย USB' : 'ESP32 DevKit V1 board with USB cable', qty: '1 บอร์ด' },
        { name: isTh ? 'โมดูลรีเลย์ 5V หรือ LED ทดสอบ' : '5V Relay Module or Test LED', qty: '1 ตัว' },
        { name: isTh ? 'สายไฟ Jumper เมีย-ผู้' : 'Female-to-Male Jumper Wires', qty: '3 เส้น' },
        { name: isTh ? 'เครือข่าย Wi-Fi 2.4 GHz หรือ Hotspot มือถือ' : '2.4 GHz Wi-Fi Router or Hotspot', qty: '1 วง' }
      ],
      wiringSteps: isTh ? [
        'ต่อขา VIN (5V USB) ของบอร์ด ESP32 เข้าขา VCC ของโมดูลรีเลย์',
        'ต่อขา GND ของบอร์ด ESP32 เข้าขา GND ของโมดูลรีเลย์',
        'ต่อขา GPIO 4 ของบอร์ด ESP32 เข้าขา IN (สัญญาณสั่งงาน) ของโมดูลรีเลย์',
        'หมายเหตุ: หากใช้ LED แทนรีเลย์ ให้ต่อ GPIO 4 ผ่านตัวต้านทาน 220Ω เข้าขา Anode (+)'
      ] : [
        'Connect ESP32 VIN (5V feed) to Relay VCC.',
        'Connect ESP32 GND to Relay GND.',
        'Connect ESP32 GPIO 4 to Relay IN trigger pin.',
        'Note: If using an LED, connect GPIO 4 through a 220Ω resistor to the LED anode.'
      ],
      wiringWarning: isTh
        ? 'ข้อควรระวัง: ESP32 รองรับเฉพาะ Wi-Fi 2.4 GHz (ไม่รองรับ 5 GHz) ตรวจสอบคลื่น Wi-Fi ก่อนเชื่อมต่อ'
        : 'Caution: ESP32 only connects to 2.4 GHz Wi-Fi networks (not 5 GHz). Check your SSID frequency.',
      code: `// ==========================================
// โปรเจกต์ที่ 03: ESP32 สั่งงานเปิด-ปิดไฟผ่าน Wi-Fi Web Server
// ==========================================
#include <WiFi.h>
#include <WebServer.h>

#define RELAY_PIN 4 // ขาควบคุมรีเลย์หรือไฟ LED

const char* ssid     = "YOUR_WIFI_SSID";     // ใส่ชื่อ Wi-Fi ของคุณ
const char* password = "YOUR_WIFI_PASSWORD"; // ใส่รหัสผ่าน Wi-Fi ของคุณ

WebServer server(80); // สร้าง Web Server บนพอร์ต 80
bool relayState = false;

// ฟังก์ชันสร้างหน้าเว็บสำหรับสั่งงาน
void handleRoot() {
  String html = "<!DOCTYPE html><html><head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'>";
  html += "<title>ESP32 Smart Home</title>";
  html += "<style>body{font-family:sans-serif;background:#0f172a;color:#fff;text-align:center;padding:40px;}";
  html += ".card{background:#1e293b;border-radius:20px;padding:30px;max-width:360px;margin:auto;box-shadow:0 10px 30px rgba(0,0,0,0.5);}";
  html += ".btn{display:inline-block;padding:16px 36px;font-size:18px;font-weight:bold;border-radius:14px;text-decoration:none;margin-top:20px;}";
  html += ".btn-on{background:#10b981;color:#fff;} .btn-off{background:#ef4444;color:#fff;}</style></head><body>";
  html += "<div class='card'><h2>🏠 ESP32 Smart IoT</h2><p>สถานะไฟ: <strong>" + String(relayState ? "เปิด (ON)" : "ปิด (OFF)") + "</strong></p>";
  html += "<a class='btn " + String(relayState ? "btn-off" : "btn-on") + "' href='/toggle'>" + String(relayState ? "ปิดไฟ (TURN OFF)" : "เปิดไฟ (TURN ON)") + "</a></div>";
  html += "</body></html>";
  server.send(200, "text/html", html);
}

// ฟังก์ชันสลับสถานะเมื่อกดปุ่มบนหน้าเว็บ
void handleToggle() {
  relayState = !relayState;
  digitalWrite(RELAY_PIN, relayState ? HIGH : LOW);
  server.sendHeader("Location", "/");
  server.send(303);
}

void setup() {
  Serial.begin(115200);
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW);

  Serial.println("\\nConnecting to Wi-Fi...");
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\\n>>> Wi-Fi Connected! <<<");
  Serial.print("เปิดเบราว์เซอร์แล้วพิมพ์: http://");
  Serial.println(WiFi.localIP());

  server.on("/", handleRoot);
  server.on("/toggle", handleToggle);
  server.begin();
  Serial.println("Web Server Started! Ready for requests.");
}

void loop() {
  server.handleClient(); // รอรับคำขอจากผู้ใช้งาน
}`,
      stepsToRun: isTh ? [
        'แก้ไขชื่อ Wi-Fi (ssid) และรหัสผ่าน (password) ในโค้ดให้ตรงกับ Wi-Fi บ้านของคุณ',
        'ต่อสาย USB เข้ากับ ESP32 และเลือกบอร์ดเป็น "ESP32 Dev Module" ใน Arduino IDE',
        'กดปุ่ม Upload เพื่อเขียนโปรแกรมลงบอร์ด',
        'เปิด Serial Monitor (115200 baud) รอสักครู่จะเห็นข้อความแสดง IP Address เช่น "http://192.168.1.108"',
        'เปิดเบราว์เซอร์บนมือถือหรือคอมพิวเตอร์ที่ต่อ Wi-Fi วงเดียวกัน แล้วพิมพ์ IP Address นั้น',
        'กดปุ่มบนหน้าเว็บเพื่อสั่งเปิด-ปิดไฟได้ทันที!'
      ] : [
        'Edit the ssid and password variables in the sketch to match your 2.4 GHz Wi-Fi.',
        'Connect ESP32 via USB and select "ESP32 Dev Module" in Tools > Board.',
        'Upload the sketch to your ESP32.',
        'Open Serial Monitor at 115200 baud to find the assigned IP (e.g. http://192.168.1.108).',
        'Open any mobile browser connected to the same Wi-Fi and navigate to that IP.',
        'Tap the toggle button to switch the relay live!'
      ],
      troubleshooting: isTh ? [
        'ESP32 ไม่ยอมเชื่อมต่อ Wi-Fi: ตรวจสอบว่า Wi-Fi เป็น 2.4 GHz และรหัสผ่านถูกต้อง',
        'เข้าหน้าเว็บไม่ได้: ตรวจสอบว่ามือถือและ ESP32 เชื่อมต่อ Wi-Fi วงเดียวกันหรือไม่'
      ] : [
        'Cannot connect to Wi-Fi: Ensure router transmits 2.4 GHz and credentials have no typos.',
        'Web page does not load: Ensure your smartphone is connected to the exact same local Wi-Fi subnet.'
      ]
    };
  }

  // ==========================================
  // Mount Simulation Logic for Lesson 1 (Blink)
  // ==========================================
  function mountLesson1Sim(container, isTh = getLocale() === 'th') {
    let isRunning = true;
    let speed = 800; // ms
    let state = false;
    let timer = null;
    let color = 'red';

    const ledElem = container.querySelector('#sim1-led');
    const statusElem = container.querySelector('#sim1-status');
    const playBtn = container.querySelector('#sim1-play-btn');
    const speedSlider = container.querySelector('#sim1-speed-slider');
    const speedVal = container.querySelector('#sim1-speed-val');
    const colorSelect = container.querySelector('#sim1-color');
    const termLogs = container.querySelector('#sim1-logs');
    const clearTermBtn = container.querySelector('#sim1-clear-logs');

    function log(msg) {
      if (!termLogs) return;
      const now = new Date();
      const timeStr = `${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(Math.floor(now.getMilliseconds() / 100))}`;
      const line = document.createElement('div');
      line.className = 'term-line';
      line.innerHTML = `<span class="term-time">[${timeStr}]</span> <span class="term-msg">${msg}</span>`;
      termLogs.appendChild(line);
      termLogs.scrollTop = termLogs.scrollHeight;
    }

    function updateLed() {
      if (ledElem) {
        if (state) {
          ledElem.classList.add('on');
          ledElem.dataset.color = color;
        } else {
          ledElem.classList.remove('on');
        }
      }
      if (statusElem) {
        statusElem.textContent = state ? 'HIGH (5.0V)' : 'LOW (0.0V)';
        statusElem.className = 'sim-status-val ' + (state ? 'status-high' : 'status-low');
      }
    }

    function tick() {
      state = !state;
      updateLed();
      log(state ? `digitalWrite(13, HIGH); -> LED: ON [5.0V, 18.2mA]` : `digitalWrite(13, LOW);  -> LED: OFF [0.0V, 0.0mA]`);
      timer = setTimeout(tick, speed);
    }

    function start() {
      if (timer) clearTimeout(timer);
      isRunning = true;
      if (playBtn) playBtn.innerHTML = `${ICONS.pause} <span>${isTh ? 'หยุด' : 'Pause'}</span>`;
      tick();
    }

    function pause() {
      if (timer) clearTimeout(timer);
      timer = null;
      isRunning = false;
      if (playBtn) playBtn.innerHTML = `${ICONS.play} <span>${isTh ? 'เริ่ม' : 'Run'}</span>`;
    }

    if (playBtn) {
      playBtn.onclick = () => {
        if (isRunning) pause();
        else start();
      };
    }

    if (speedSlider) {
      speedSlider.oninput = (e) => {
        speed = Number(e.target.value);
        if (speedVal) speedVal.textContent = speed + ' ms';
        if (isRunning) {
          clearTimeout(timer);
          timer = setTimeout(tick, speed);
        }
      };
    }

    if (colorSelect) {
      colorSelect.onchange = (e) => {
        color = e.target.value;
        if (state && ledElem) ledElem.dataset.color = color;
      };
    }

    if (clearTermBtn) {
      clearTermBtn.onclick = () => {
        termLogs.innerHTML = '';
      };
    }

    log('Arduino Uno R3 ATmega328P Initialized.');
    log('pinMode(13, OUTPUT) ready.');
    start();

    return {
      destroy: () => {
        if (timer) clearTimeout(timer);
      }
    };
  }

  // ==========================================
  // Mount Simulation Logic for Lesson 2 (DHT22)
  // ==========================================
  function mountLesson2Sim(container, isTh) {
    let temp = 28.5;
    let hum = 65.0;
    let autoInterval = null;

    const tempSlider = container.querySelector('#sim2-temp-slider');
    const humSlider = container.querySelector('#sim2-hum-slider');
    const tempDisp = container.querySelector('#sim2-temp-val');
    const humDisp = container.querySelector('#sim2-hum-val');
    const oledTemp = container.querySelector('#sim2-oled-temp');
    const oledHum = container.querySelector('#sim2-oled-hum');
    const oledStatus = container.querySelector('#sim2-oled-status');
    const termLogs = container.querySelector('#sim2-logs');
    const readBtn = container.querySelector('#sim2-read-btn');
    const autoBtn = container.querySelector('#sim2-auto-btn');
    const clearTermBtn = container.querySelector('#sim2-clear-logs');

    function log(msg) {
      if (!termLogs) return;
      const now = new Date();
      const timeStr = `${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      const line = document.createElement('div');
      line.className = 'term-line';
      line.innerHTML = `<span class="term-time">[${timeStr}]</span> <span class="term-msg">${msg}</span>`;
      termLogs.appendChild(line);
      termLogs.scrollTop = termLogs.scrollHeight;
    }

    function sample() {
      if (oledTemp) oledTemp.textContent = temp.toFixed(1) + ' °C';
      if (oledHum) oledHum.textContent = hum.toFixed(1) + ' %RH';

      if (oledStatus) {
        if (temp > 35) {
          oledStatus.innerHTML = `<span class="status-indicator-dot alert-dot"></span> <span>${isTh ? 'อุณหภูมิสูง (HOT)' : 'High Temp (HOT)'}</span>`;
          oledStatus.className = 'oled-status alert';
        } else if (temp < 15) {
          oledStatus.innerHTML = `<span class="status-indicator-dot warn-dot"></span> <span>${isTh ? 'อุณหภูมิต่ำ (COLD)' : 'Low Temp (COLD)'}</span>`;
          oledStatus.className = 'oled-status warning';
        } else {
          oledStatus.innerHTML = `<span class="status-indicator-dot normal-dot"></span> <span>${isTh ? 'ปกติ (COMFORT)' : 'Comfort (NORMAL)'}</span>`;
          oledStatus.className = 'oled-status normal';
        }
      }

      log(`DHT22 (AM2302) -> 40 bits verified -> Temp: ${temp.toFixed(1)} *C | Hum: ${hum.toFixed(1)} %RH`);
    }

    if (tempSlider) {
      tempSlider.oninput = (e) => {
        temp = Number(e.target.value);
        if (tempDisp) tempDisp.textContent = temp.toFixed(1) + ' °C';
        sample();
      };
    }

    if (humSlider) {
      humSlider.oninput = (e) => {
        hum = Number(e.target.value);
        if (humDisp) humDisp.textContent = hum.toFixed(1) + ' %RH';
        sample();
      };
    }

    if (readBtn) {
      readBtn.onclick = () => {
        sample();
      };
    }

    if (autoBtn) {
      autoBtn.onclick = () => {
        if (autoInterval) {
          clearInterval(autoInterval);
          autoInterval = null;
          autoBtn.innerHTML = `${ICONS.refresh} <span>${isTh ? 'อ่านอัตโนมัติ (ปิด)' : 'Auto Read (Off)'}</span>`;
          autoBtn.classList.remove('active');
        } else {
          autoInterval = setInterval(sample, 2000);
          autoBtn.innerHTML = `${ICONS.refresh} <span>${isTh ? 'อ่านอัตโนมัติทุก 2s' : 'Auto 2s'}</span>`;
          autoBtn.classList.add('active');
          sample();
        }
      };
    }

    if (clearTermBtn) {
      clearTermBtn.onclick = () => {
        termLogs.innerHTML = '';
      };
    }

    log('DHT22 Sensor communication initiated on GPIO 4.');
    sample();

    return {
      destroy: () => {
        if (autoInterval) clearInterval(autoInterval);
      }
    };
  }

  // ==========================================
  // Mount Simulation Logic for Lesson 3 (ESP32 Wi-Fi)
  // ==========================================
  function mountLesson3Sim(container, isTh) {
    let isConnected = true;
    let relayOn = false;

    const wifiBtn = container.querySelector('#sim3-wifi-btn');
    const wifiStatus = container.querySelector('#sim3-wifi-status');
    const ipDisp = container.querySelector('#sim3-ip-val');
    const lampElem = container.querySelector('#sim3-lamp');
    const relayElem = container.querySelector('#sim3-relay');
    const phoneToggle = container.querySelector('#sim3-phone-toggle');
    const phoneState = container.querySelector('#sim3-phone-state');
    const termLogs = container.querySelector('#sim3-logs');
    const clearTermBtn = container.querySelector('#sim3-clear-logs');

    function log(msg) {
      if (!termLogs) return;
      const now = new Date();
      const timeStr = `${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      const line = document.createElement('div');
      line.className = 'term-line';
      line.innerHTML = `<span class="term-time">[${timeStr}]</span> <span class="term-msg">${msg}</span>`;
      termLogs.appendChild(line);
      termLogs.scrollTop = termLogs.scrollHeight;
    }

    function updateRelayState() {
      if (relayElem) {
        if (relayOn) relayElem.classList.add('active');
        else relayElem.classList.remove('active');
      }
      if (lampElem) {
        if (relayOn) lampElem.classList.add('lit');
        else lampElem.classList.remove('lit');
      }
      if (phoneToggle) {
        phoneToggle.textContent = relayOn ? (isTh ? 'ปิดไฟ' : 'Turn Off') : (isTh ? 'เปิดไฟ' : 'Turn On');
        phoneToggle.className = 'mock-btn ' + (relayOn ? 'btn-red' : 'btn-green');
      }
      if (phoneState) {
        phoneState.innerHTML = `<span class="status-indicator-dot ${relayOn ? 'active-dot' : 'inactive-dot'}"></span> <span>${relayOn ? (isTh ? 'เปิดใช้งาน' : 'Active') : (isTh ? 'ปิดอยู่' : 'Off')}</span>`;
        phoneState.className = 'mock-state ' + (relayOn ? 'state-on' : 'state-off');
      }
    }

    if (phoneToggle) {
      phoneToggle.onclick = () => {
        if (!isConnected) {
          log('[Error] ESP32 ออฟไลน์ • เชื่อมต่อ Wi-Fi ก่อนสั่งงานอุปกรณ์');
          if (wifiBtn) {
            wifiBtn.classList.add('pulse-attention');
            setTimeout(() => wifiBtn.classList.remove('pulse-attention'), 1400);
          }
          return;
        }
        relayOn = !relayOn;
        log(`[HTTP GET /toggle] Client: 192.168.1.42 -> Relay GPIO 4: ${relayOn ? 'HIGH' : 'LOW'}`);
        log(`[Device] Lamp Status: ${relayOn ? 'ON (220V Flowing)' : 'OFF'}`);
        updateRelayState();
      };
    }

    if (wifiBtn) {
      wifiBtn.onclick = () => {
        if (isConnected) {
          isConnected = false;
          wifiStatus.innerHTML = `<span class="status-indicator-dot inactive-dot"></span> <span>${isTh ? 'ตัดการเชื่อมต่อ' : 'Disconnected'}</span>`;
          wifiStatus.className = 'wifi-status-badge disconnected';
          ipDisp.textContent = '—';
          wifiBtn.innerHTML = `${ICONS.wifi} <span>${isTh ? 'เชื่อมต่อ Wi-Fi' : 'Connect'}</span>`;
          log('[WiFi] Disconnected from network.');
        } else {
          wifiStatus.innerHTML = `<span class="status-indicator-dot warn-dot"></span> <span>${isTh ? 'กำลังเชื่อมต่อ...' : 'Connecting...'}</span>`;
          wifiStatus.className = 'wifi-status-badge connecting';
          log('[WiFi] Connecting to SSID: Home_WiFi_2.4G ...');
          setTimeout(() => {
            isConnected = true;
            wifiStatus.innerHTML = `<span class="status-indicator-dot active-dot"></span> <span>${isTh ? 'เชื่อมต่อแล้ว' : 'Connected'}</span>`;
            wifiStatus.className = 'wifi-status-badge connected';
            ipDisp.textContent = '192.168.1.108';
            wifiBtn.innerHTML = `${ICONS.power} <span>${isTh ? 'ตัดการเชื่อมต่อ' : 'Disconnect'}</span>`;
            log('[WiFi] Connected! IP: 192.168.1.108 (RSSI: -54 dBm)');
            log('[Web Server] Listening on http://192.168.1.108:80');
          }, 700);
        }
      };
    }

    if (clearTermBtn) {
      clearTermBtn.onclick = () => {
        termLogs.innerHTML = '';
      };
    }

    log('ESP32 Dual-Core Xtensa LX6 Booted.');
    log('[WiFi] Connected to Home_WiFi_2.4G. IP: 192.168.1.108');
    log('[HTTP Server] Ready at http://192.168.1.108');
    updateRelayState();

    return {
      destroy: () => {}
    };
  }

  // ==========================================
  // Render Full Lesson Modal Content
  // ==========================================
  function renderLessonModal(lessonNum) {
    currentLesson = lessonNum;
    const lang = getLocale();
    const isTh = lang === 'th';

    let data;
    if (lessonNum === 1) data = createLesson1Data(lang);
    else if (lessonNum === 2) data = createLesson2Data(lang);
    else data = createLesson3Data(lang);

    const dialog = document.getElementById('lesson-dialog');
    const content = document.getElementById('lesson-content');
    if (!dialog || !content) return;

    stopActiveSimulation();

    // Generate BOM list
    const bomHtml = data.bom.map(b => `
      <div class="bom-chip">
        <span class="bom-icon">${ICONS.package}</span>
        <div><strong>${b.name}</strong><small>${b.qty}</small></div>
      </div>
    `).join('');

    // Generate Wiring steps
    const wiringStepsHtml = data.wiringSteps.map((step, idx) => `
      <div class="step-guide-item">
        <span class="step-guide-num">${idx + 1}</span>
        <p>${step}</p>
      </div>
    `).join('');

    // Generate Execution Steps
    const stepsToRunHtml = data.stepsToRun.map((step, idx) => `
      <li class="run-step-item">
        <strong>${isTh ? 'ขั้นที่' : 'Step'} ${idx + 1}:</strong> ${step}
      </li>
    `).join('');

    // Generate Troubleshooting
    const troubleHtml = data.troubleshooting.map(t => `
      <li class="trouble-item"><span class="trouble-bullet">${ICONS.wrench}</span> <span>${t}</span></li>
    `).join('');

    // Simulator HTML template per lesson
    let simHtml = '';
    if (lessonNum === 1) {
      simHtml = `
        <div class="sim-workbench" id="sim-container-1">
          <div class="sim-header">
            <div class="sim-title-wrap">
              <span class="sim-badge">LIVE SIMULATOR</span>
              <h4>Arduino Uno + LED Circuit</h4>
            </div>
            <div class="sim-actions-top">
              <button type="button" class="sim-btn-play" id="sim1-play-btn">${ICONS.pause} <span>${isTh ? 'หยุด' : 'Pause'}</span></button>
            </div>
          </div>

          <div class="sim-canvas sim1-canvas">
            <!-- Virtual Arduino Board Graphic -->
            <div class="virtual-mcu-board uno-board">
              <div class="board-brand">ARDUINO <b>UNO</b></div>
              <div class="pin-header-visual">
                <span class="pin-dot">GND</span>
                <span class="pin-dot active-pin">D13</span>
              </div>
            </div>

            <!-- Virtual Breadboard & Wire Connection -->
            <div class="circuit-wire wire-d13"></div>
            <div class="circuit-wire wire-gnd"></div>

            <div class="virtual-breadboard">
              <div class="virtual-resistor" title="220Ω Resistor">
                <span class="res-band b1"></span>
                <span class="res-band b2"></span>
                <span class="res-band b3"></span>
                <small>220Ω</small>
              </div>

              <div class="virtual-led-container">
                <div class="virtual-led on" id="sim1-led" data-color="red">
                  <div class="led-dome"></div>
                  <div class="led-glow"></div>
                </div>
                <span class="led-label">LED Pin 13</span>
              </div>
            </div>

            <div class="sim-live-indicator">
              <span>Pin 13 Logic:</span>
              <strong class="sim-status-val status-high" id="sim1-status">HIGH (5.0V)</strong>
            </div>
          </div>

          <!-- Controls Bar -->
          <div class="sim-controls-panel">
            <div class="ctrl-group">
              <label for="sim1-speed-slider">
                <span class="label-with-icon">${ICONS.clock} ${isTh ? 'ความเร็ว' : 'Interval'}:</span>
                <b id="sim1-speed-val">800 ms</b>
              </label>
              <input type="range" id="sim1-speed-slider" min="150" max="2000" step="50" value="800">
            </div>

            <div class="ctrl-group">
              <label for="sim1-color" class="label-with-icon">${ICONS.palette} ${isTh ? 'สีหลอด LED' : 'LED Color'}:</label>
              <select id="sim1-color" class="sim-select">
                <option value="red" selected>${isTh ? 'แดง (Red)' : 'Red'}</option>
                <option value="green">${isTh ? 'เขียว (Green)' : 'Green'}</option>
                <option value="blue">${isTh ? 'น้ำเงิน (Blue)' : 'Blue'}</option>
                <option value="amber">${isTh ? 'ส้มอำพัน (Amber)' : 'Amber'}</option>
              </select>
            </div>
          </div>

          <!-- Virtual Serial Terminal -->
          <div class="sim-terminal">
            <div class="term-header">
              <span class="term-title-wrap">${ICONS.terminal} <span>Serial Monitor (9600 baud)</span></span>
              <button type="button" class="term-clear" id="sim1-clear-logs">${ICONS.trash} <span>${isTh ? 'ล้าง' : 'Clear'}</span></button>
            </div>
            <div class="term-body" id="sim1-logs"></div>
          </div>
        </div>
      `;
    } else if (lessonNum === 2) {
      simHtml = `
        <div class="sim-workbench" id="sim-container-2">
          <div class="sim-header">
            <div class="sim-title-wrap">
              <span class="sim-badge">LIVE SIMULATOR</span>
              <h4>DHT22 Sensor + OLED Display</h4>
            </div>
            <div class="sim-actions-top">
              <button type="button" class="sim-btn-sample" id="sim2-read-btn">${ICONS.activity} <span>${isTh ? 'อ่านค่า' : 'Read'}</span></button>
              <button type="button" class="sim-btn-auto" id="sim2-auto-btn">${ICONS.refresh} <span>${isTh ? 'อ่านอัตโนมัติ (ปิด)' : 'Auto Read (Off)'}</span></button>
            </div>
          </div>

          <div class="sim-canvas sim2-canvas">
            <!-- Simulated Sensor -->
            <div class="virtual-dht22-sensor">
              <div class="dht-grill">
                <span></span><span></span><span></span><span></span>
              </div>
              <div class="dht-label">DHT22 / AM2302</div>
              <div class="dht-pins">
                <span>VCC</span><span>DATA</span><span>GND</span>
              </div>
            </div>

            <!-- Virtual OLED Screen Display -->
            <div class="virtual-oled">
              <div class="oled-glass">
                <div class="oled-title">ROOM ENVIRONMENT</div>
                <div class="oled-metric">
                  <span class="oled-label">TEMP:</span>
                  <strong class="oled-value" id="sim2-oled-temp">28.5 °C</strong>
                </div>
                <div class="oled-metric">
                  <span class="oled-label">HUMI:</span>
                  <strong class="oled-value" id="sim2-oled-hum">65.0 %RH</strong>
                </div>
                <div class="oled-status normal" id="sim2-oled-status">
                  <span class="status-indicator-dot normal-dot"></span>
                  <span>${isTh ? 'ปกติ (COMFORT)' : 'Comfort (NORMAL)'}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Environment Simulation Sliders -->
          <div class="sim-controls-panel">
            <div class="ctrl-group">
              <label for="sim2-temp-slider">
                <span class="label-with-icon">${ICONS.thermometer} ${isTh ? 'จำลองอุณหภูมิ' : 'Simulate Temp'}:</span>
                <b id="sim2-temp-val">28.5 °C</b>
              </label>
              <input type="range" id="sim2-temp-slider" min="-5" max="50" step="0.5" value="28.5">
            </div>

            <div class="ctrl-group">
              <label for="sim2-hum-slider">
                <span class="label-with-icon">${ICONS.droplets} ${isTh ? 'จำลองความชื้น' : 'Simulate Humidity'}:</span>
                <b id="sim2-hum-val">65.0 %RH</b>
              </label>
              <input type="range" id="sim2-hum-slider" min="10" max="98" step="1" value="65">
            </div>
          </div>

          <!-- Virtual Serial Terminal -->
          <div class="sim-terminal">
            <div class="term-header">
              <span class="term-title-wrap">${ICONS.terminal} <span>Serial Monitor (9600 baud)</span></span>
              <button type="button" class="term-clear" id="sim2-clear-logs">${ICONS.trash} <span>${isTh ? 'ล้าง' : 'Clear'}</span></button>
            </div>
            <div class="term-body" id="sim2-logs"></div>
          </div>
        </div>
      `;
    } else {
      simHtml = `
        <div class="sim-workbench" id="sim-container-3">
          <div class="sim-header">
            <div class="sim-title-wrap">
              <span class="sim-badge">LIVE SIMULATOR</span>
              <h4>ESP32 Wi-Fi & Smart Relay Dashboard</h4>
            </div>
            <div class="sim-actions-top">
              <button type="button" class="sim-btn-play" id="sim3-wifi-btn">${ICONS.power} <span>${isTh ? 'ตัดการเชื่อมต่อ' : 'Disconnect'}</span></button>
            </div>
          </div>

          <div class="sim-canvas sim3-canvas">
            <!-- Simulated Wi-Fi Network & ESP32 -->
            <div class="virtual-network-wrap">
              <div class="virtual-router">
                <span class="router-antenna">${ICONS.wifi}</span>
                <strong>Wi-Fi Router</strong>
                <small>SSID: Home_WiFi_2.4G</small>
              </div>

              <div class="network-link-wave"></div>

              <div class="virtual-mcu-board esp32-board">
                <div class="board-brand">ESP32 <b>DEVKIT</b></div>
                <div class="wifi-status-badge connected" id="sim3-wifi-status">
                  <span class="status-indicator-dot active-dot"></span>
                  <span>${isTh ? 'เชื่อมต่อแล้ว' : 'Connected'}</span>
                </div>
                <div class="ip-tag">IP: <b id="sim3-ip-val">192.168.1.108</b></div>
              </div>
            </div>

            <!-- Virtual Relay and Lamp -->
            <div class="virtual-appliance-wrap">
              <div class="virtual-relay-module" id="sim3-relay">
                <div class="relay-coil">RELAY 5V</div>
                <span class="relay-indicator"></span>
              </div>
              <div class="virtual-lamp-fixture">
                <div class="virtual-lamp" id="sim3-lamp">
                  <div class="lamp-bulb">${ICONS.lightbulb}</div>
                  <div class="lamp-glow"></div>
                </div>
                <span class="lamp-label">${isTh ? 'หลอดไฟ 220V' : 'Mains Lamp'}</span>
              </div>
            </div>

            <!-- Virtual Mobile Web Controller Screen -->
            <div class="virtual-mobile-screen">
              <div class="mock-browser-bar">${ICONS.globe} <span>http://192.168.1.108</span></div>
              <div class="mock-phone-body">
                <div class="mock-icon">${ICONS.zap}</div>
                <h5>ESP32 Smart Home</h5>
                <span class="mock-state state-off" id="sim3-phone-state">
                  <span class="status-indicator-dot inactive-dot"></span>
                  <span>${isTh ? 'ปิดอยู่' : 'Off'}</span>
                </span>
                <button type="button" class="mock-btn btn-green" id="sim3-phone-toggle">${isTh ? 'เปิดไฟ' : 'Turn On'}</button>
              </div>
            </div>
          </div>

          <!-- Virtual Serial Terminal -->
          <div class="sim-terminal">
            <div class="term-header">
              <span class="term-title-wrap">${ICONS.terminal} <span>ESP32 Serial Log (115200 baud)</span></span>
              <button type="button" class="term-clear" id="sim3-clear-logs">${ICONS.trash} <span>${isTh ? 'ล้าง' : 'Clear'}</span></button>
            </div>
            <div class="term-body" id="sim3-logs"></div>
          </div>
        </div>
      `;
    }

    content.innerHTML = `
      <div class="lesson-modal-layout">
        <!-- Top Navigation Bar for Switching Lessons -->
        <header class="lesson-modal-header">
          <div class="lesson-picker-tabs">
            <button type="button" class="lesson-pill ${lessonNum === 1 ? 'active' : ''}" data-lesson="1">
              <span class="pill-icon">${ICONS.zap}</span>
              <span class="pill-num">01</span>
              <span>${isTh ? 'ทำ LED ให้กะพริบ' : 'Blink LED (Uno)'}</span>
            </button>
            <button type="button" class="lesson-pill ${lessonNum === 2 ? 'active' : ''}" data-lesson="2">
              <span class="pill-icon">${ICONS.thermometer}</span>
              <span class="pill-num">02</span>
              <span>${isTh ? 'อ่านค่าเซ็นเซอร์ DHT22' : 'Read Sensor (DHT22)'}</span>
            </button>
            <button type="button" class="lesson-pill ${lessonNum === 3 ? 'active' : ''}" data-lesson="3">
              <span class="pill-icon">${ICONS.wifi}</span>
              <span class="pill-num">03</span>
              <span>${isTh ? 'ควบคุมผ่าน Wi-Fi' : 'Control over Wi-Fi'}</span>
            </button>
          </div>
        </header>

        <!-- Main Lesson Content Grid (Simulator Left, Tutorial Right) -->
        <div class="lesson-grid">
          <!-- Column 1: Interactive Live Simulator -->
          <section class="lesson-sim-column" aria-label="Interactive Simulator">
            <div class="lesson-hero-header">
              <div class="lesson-meta-chips">
                <span class="lesson-meta-tag tag-primary">LESSON ${data.num}</span>
                <span class="lesson-meta-tag">${data.time}</span>
                <span class="lesson-meta-tag tag-board">${data.board}</span>
              </div>
              <h2>${data.title}</h2>
              <p class="lesson-lead">${data.subtitle}</p>
            </div>

            <!-- Live Simulator Mount -->
            ${simHtml}
          </section>

          <!-- Column 2: Step-by-Step Practical Real Guide -->
          <section class="lesson-guide-column" aria-label="Step-by-step Guide">
            <!-- Step 1: BOM -->
            <div class="guide-card">
              <h3 class="guide-card-title">
                <span class="card-icon">${ICONS.package}</span>
                <span>${isTh ? 'รายการอุปกรณ์' : 'Required Components'}</span>
              </h3>
              <div class="bom-grid">
                ${bomHtml}
              </div>
              <div class="bom-cart-action-wrap">
                <button type="button" class="button button-accent bom-buy-lesson-btn" id="bom-buy-lesson-btn">
                  ${ICONS.cart}
                  <span>${isTh ? 'สั่งซื้ออุปกรณ์ในบทเรียนนี้' : 'Add Lesson Parts to Cart'}</span>
                </button>
              </div>
            </div>

            <!-- Step 2: Wiring Assembly -->
            <div class="guide-card">
              <h3 class="guide-card-title">
                <span class="card-icon">${ICONS.cpu}</span>
                <span>${isTh ? 'ขั้นตอนต่อวงจรจริง' : 'Circuit Assembly Steps'}</span>
              </h3>
              <div class="wiring-steps-list">
                ${wiringStepsHtml}
              </div>
              <div class="wiring-alert-box">
                <span class="alert-icon-wrap">${ICONS.alert}</span>
                <span>${data.wiringWarning}</span>
              </div>
            </div>

            <!-- Step 3: Arduino Code -->
            <div class="guide-card">
              <div class="guide-card-header-flex">
                <h3 class="guide-card-title">
                  <span class="card-icon">${ICONS.code}</span>
                  <span>${isTh ? 'โค้ดโปรแกรม' : 'Arduino Sketch'}</span>
                </h3>
                <button type="button" class="lesson-copy-code-btn" id="lesson-copy-btn">
                  <span class="copy-icon-slot">${ICONS.copy}</span>
                  <span id="lesson-copy-label">${isTh ? 'คัดลอก' : 'Copy'}</span>
                </button>
              </div>
              <div class="lesson-code-wrap">
                <pre class="lesson-code-pre"><code>${escapeHtml(data.code)}</code></pre>
              </div>
            </div>

            <!-- Step 4: How to Run -->
            <div class="guide-card">
              <h3 class="guide-card-title">
                <span class="card-icon">${ICONS.rocket}</span>
                <span>${isTh ? 'วิธีอัปโหลดและทดสอบ' : 'Upload & Test'}</span>
              </h3>
              <ol class="run-steps-list">
                ${stepsToRunHtml}
              </ol>
            </div>

            <!-- Step 5: Troubleshooting -->
            <div class="guide-card troubleshooting-card">
              <h3 class="guide-card-title">
                <span class="card-icon">${ICONS.wrench}</span>
                <span>${isTh ? 'ปัญหาที่พบบ่อย' : 'Troubleshooting FAQ'}</span>
              </h3>
              <ul class="trouble-list">
                ${troubleHtml}
              </ul>
            </div>
          </section>
        </div>
      </div>
    `;

    // Hook top lesson switcher buttons
    content.querySelectorAll('.lesson-pill').forEach(btn => {
      btn.onclick = () => {
        const nextId = Number(btn.dataset.lesson);
        if (nextId !== currentLesson) {
          renderLessonModal(nextId);
        }
      };
    });

    // Hook code copy button (Dimension-locked & Idempotent per Pillar 10)
    const copyBtn = content.querySelector('#lesson-copy-btn');
    if (copyBtn) {
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(data.code).then(() => {
          const lbl = content.querySelector('#lesson-copy-label');
          const slot = content.querySelector('.copy-icon-slot');
          if (lbl) lbl.textContent = isTh ? 'คัดลอกแล้ว' : 'Copied';
          if (slot) slot.innerHTML = ICONS.check;
          copyBtn.classList.add('copied');
          setTimeout(() => {
            if (lbl) lbl.textContent = isTh ? 'คัดลอก' : 'Copy';
            if (slot) slot.innerHTML = ICONS.copy;
            copyBtn.classList.remove('copied');
          }, 2000);
        }).catch(err => {
          console.error('Copy failed', err);
        });
      };
    }

    // Hook buy all lesson parts button
    const buyLessonBtn = content.querySelector('#bom-buy-lesson-btn');
    if (buyLessonBtn) {
      buyLessonBtn.onclick = () => {
        if (!window.IoTCart) return;
        if (lessonNum === 1) {
          window.IoTCart.add('uno-r3', 1, false);
        } else if (lessonNum === 2) {
          window.IoTCart.add('esp32-devkit', 1, false);
          window.IoTCart.add('dht22', 1, false);
        } else if (lessonNum === 3) {
          window.IoTCart.add('esp32-devkit', 1, false);
          window.IoTCart.add('relay-4ch', 1, false);
        }
        dialog.close();
        window.IoTCart.open();
      };
    }

    // Mount simulator logic
    if (lessonNum === 1) {
      activeSimulation = mountLesson1Sim(content, isTh);
    } else if (lessonNum === 2) {
      activeSimulation = mountLesson2Sim(content, isTh);
    } else {
      activeSimulation = mountLesson3Sim(content, isTh);
    }

    // Open modal
    if (!dialog.open) {
      dialog.showModal();
    }
  }

  // ==========================================
  // Public Interface
  // ==========================================
  window.openLesson = function(lessonNum = 1) {
    renderLessonModal(Number(lessonNum) || 1);
  };

  // Close handlers
  const dialog = document.getElementById('lesson-dialog');
  if (dialog) {
    dialog.addEventListener('close', () => {
      stopActiveSimulation();
    });
  }

  // Wire buttons in DOM when ready
  function initLearnSection() {
    const startBtn = document.getElementById('start-learn-btn');
    if (startBtn) {
      startBtn.onclick = (e) => {
        e.preventDefault();
        window.openLesson(1);
      };
    }

    document.querySelectorAll('.path-step[data-lesson]').forEach(step => {
      step.onclick = () => {
        const lId = step.dataset.lesson || 1;
        window.openLesson(lId);
      };
      step.onkeydown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const lId = step.dataset.lesson || 1;
          window.openLesson(lId);
        }
      };
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLearnSection);
  } else {
    initLearnSection();
  }
})();
