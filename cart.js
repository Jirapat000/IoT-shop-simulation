/**
 * cart.js – Modern Slide-over Shopping Cart Drawer & Checkout System
 * Inspired by 21st.dev (@efferd/components/drawer/shopping-cart)
 * Follows 11 pillars of ui-craft-clarity (SKILL.md)
 */

(function () {
  'use strict';

  // SVG Icons (Lucide-based, currentColor reactive)
  const ICONS = {
    bag: `<svg class="ui-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
    cart: `<svg class="ui-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>`,
    plus: `<svg class="ui-svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
    minus: `<svg class="ui-svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
    trash: `<svg class="ui-svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>`,
    x: `<svg class="ui-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    arrowRight: `<svg class="ui-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,
    truck: `<svg class="ui-svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="13" x="1" y="6" rx="2"/><polygon points="17 9 21 9 23 13 23 19 17 19 17 9"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,
    tag: `<svg class="ui-svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/></svg>`,
    shieldCheck: `<svg class="ui-svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>`,
    check: `<svg class="ui-svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    lock: `<svg class="ui-svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
    creditCard: `<svg class="ui-svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>`,
    qrCode: `<svg class="ui-svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/></svg>`,
    printer: `<svg class="ui-svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6"/><rect width="12" height="8" x="6" y="14" rx="1"/></svg>`
  };

  // Available Promo Codes
  const PROMO_CODES = {
    'IOT10': { type: 'percent', value: 10, label: 'ลด 10% พิเศษสำหรับนักสร้างสรรค์' },
    'MAKER50': { type: 'fixed', value: 50, label: 'ส่วนลด 50฿ จาก IoT Hub' },
    'FREESHIP': { type: 'shipping', value: 100, label: 'จัดส่งฟรีทุกออเดอร์' },
    'WELCOME': { type: 'fixed', value: 20, label: 'ต้อนรับผู้ใช้ใหม่ ลด 20฿' }
  };

  const FREE_SHIPPING_THRESHOLD = 500;
  const DEFAULT_SHIPPING_FEE = 45;

  // Local State
  let cart = [];
  let appliedPromo = null;
  let isOpen = false;

  // Load from LocalStorage
  try {
    const savedCart = localStorage.getItem('iothub_cart');
    if (savedCart) cart = JSON.parse(savedCart);
    const savedPromo = localStorage.getItem('iothub_promo');
    if (savedPromo && PROMO_CODES[savedPromo]) appliedPromo = savedPromo;
  } catch (e) {
    console.error('Failed to load cart from storage', e);
  }

  function saveCart() {
    try {
      localStorage.setItem('iothub_cart', JSON.stringify(cart));
      if (appliedPromo) {
        localStorage.setItem('iothub_promo', appliedPromo);
      } else {
        localStorage.removeItem('iothub_promo');
      }
    } catch (e) {
      console.error('Failed to save cart to storage', e);
    }
  }

  // Helper to find product specs from global catalog
  function getProduct(id) {
    if (window.products && Array.isArray(window.products)) {
      return window.products.find(p => p.id === id);
    }
    return null;
  }

  // Computations
  function getSubtotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  function getTotalItems() {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  function getDiscount(subtotal) {
    if (!appliedPromo || !PROMO_CODES[appliedPromo]) return 0;
    const promo = PROMO_CODES[appliedPromo];
    if (promo.type === 'percent') {
      return Math.round((subtotal * promo.value) / 100);
    }
    if (promo.type === 'fixed') {
      return Math.min(subtotal, promo.value);
    }
    return 0;
  }

  function getShippingFee(subtotal) {
    if (cart.length === 0) return 0;
    if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
    if (appliedPromo === 'FREESHIP') return 0;
    return DEFAULT_SHIPPING_FEE;
  }

  function getNetTotal() {
    const subtotal = getSubtotal();
    const discount = getDiscount(subtotal);
    const shipping = getShippingFee(subtotal);
    return Math.max(0, subtotal - discount + shipping);
  }

  // DOM Elements Injection
  function initCartDOM() {
    // 1. Topbar cart trigger button injection if not present
    let topbarBtn = document.getElementById('cart-btn');
    if (!topbarBtn) {
      const navActions = document.querySelector('.nav-actions');
      if (navActions) {
        topbarBtn = document.createElement('button');
        topbarBtn.id = 'cart-btn';
        topbarBtn.className = 'language neu cart-nav-btn';
        topbarBtn.type = 'button';
        topbarBtn.setAttribute('aria-label', 'ตะกร้าสินค้า');
        topbarBtn.innerHTML = `
          <span class="cart-btn-icon">${ICONS.bag}</span>
          <span class="cart-btn-label">ตะกร้า</span>
          <span class="cart-badge" id="cart-badge" hidden>0</span>
        `;
        // Insert right before theme-toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
          navActions.insertBefore(topbarBtn, themeToggle);
        } else {
          navActions.appendChild(topbarBtn);
        }
      }
    }

    if (topbarBtn) {
      topbarBtn.onclick = (e) => {
        e.preventDefault();
        openCart();
      };
    }

    // 2. Cart Drawer Shell
    let drawerWrap = document.getElementById('cart-drawer-root');
    if (!drawerWrap) {
      drawerWrap = document.createElement('div');
      drawerWrap.id = 'cart-drawer-root';
      drawerWrap.className = 'cart-drawer-root';
      drawerWrap.innerHTML = `
        <div class="cart-backdrop" id="cart-backdrop"></div>
        <aside class="cart-drawer-panel" id="cart-panel" role="dialog" aria-modal="true" aria-label="ตะกร้าสินค้า">
          <!-- Mobile Pull Handle -->
          <div class="cart-mobile-handle" aria-hidden="true"><span></span></div>

          <!-- Drawer Header -->
          <header class="cart-header">
            <div class="cart-header-title">
              <span class="cart-icon-wrap">${ICONS.bag}</span>
              <div>
                <h2>ตะกร้าสินค้า</h2>
                <span class="cart-count-pill" id="cart-header-count">0 รายการ</span>
              </div>
            </div>
            <div class="cart-header-actions">
              <button type="button" class="cart-clear-btn" id="cart-clear-btn" title="ล้างตะกร้าทั้งหมด">ล้างทั้งหมด</button>
              <button type="button" class="cart-close-btn" id="cart-close-btn" aria-label="ปิดตะกร้า">${ICONS.x}</button>
            </div>
          </header>

          <!-- Free Shipping Progress Bar -->
          <div class="cart-shipping-banner" id="cart-shipping-banner">
            <div class="shipping-banner-text">
              <span class="shipping-icon">${ICONS.truck}</span>
              <span id="shipping-progress-text">ซื้อครบ 500฿ ส่งฟรีทั่วประเทศ!</span>
            </div>
            <div class="shipping-progress-track">
              <div class="shipping-progress-bar" id="shipping-progress-fill" style="width: 0%"></div>
            </div>
          </div>

          <!-- Items Scroll Area -->
          <div class="cart-items-wrap" id="cart-items-wrap"></div>

          <!-- Drawer Footer -->
          <footer class="cart-footer" id="cart-footer">
            <!-- Promo Code Accordion/Bar -->
            <div class="cart-promo-section">
              <div class="promo-input-row" id="promo-input-row">
                <div class="promo-input-box">
                  <span class="promo-tag-icon">${ICONS.tag}</span>
                  <input type="text" id="promo-code-input" placeholder="ใส่โค้ดส่วนลด (เช่น IOT10)" maxlength="15" autocomplete="off" autocorrect="off" autocapitalize="characters">
                </div>
                <button type="button" class="promo-apply-btn" id="promo-apply-btn">ใช้โค้ด</button>
              </div>
              <div class="applied-promo-tag" id="applied-promo-tag" hidden>
                <div class="promo-applied-info">
                  <span class="promo-check-icon">${ICONS.check}</span>
                  <div>
                    <strong id="promo-code-label">CODE</strong>
                    <span id="promo-desc-label">ส่วนลดพิเศษ</span>
                  </div>
                </div>
                <button type="button" class="promo-remove-btn" id="promo-remove-btn" aria-label="ยกเลิกโค้ด">${ICONS.x}</button>
              </div>
            </div>

            <!-- Price Breakdown -->
            <div class="cart-summary-box">
              <div class="summary-line">
                <span>ยอดรวมสินค้า</span>
                <span id="summary-subtotal">฿0</span>
              </div>
              <div class="summary-line discount-line" id="summary-discount-row" hidden>
                <span>ส่วนลดโค้ดโปรโมชั่น</span>
                <span id="summary-discount">-฿0</span>
              </div>
              <div class="summary-line">
                <span>ค่าจัดส่ง</span>
                <span id="summary-shipping">฿0</span>
              </div>
              <div class="summary-divider"></div>
              <div class="summary-line total-line">
                <span>ยอดชำระสุทธิ</span>
                <strong id="summary-total">฿0</strong>
              </div>
            </div>

            <!-- Checkout Primary Action -->
            <button type="button" class="cart-checkout-btn" id="cart-checkout-btn">
              <span class="checkout-btn-text">
                <span class="checkout-lock-icon">${ICONS.lock}</span>
                <span>ดำเนินการสั่งซื้อ</span>
              </span>
              <span class="checkout-btn-amount" id="checkout-total-pill">฿0</span>
              <span class="checkout-btn-arrow">${ICONS.arrowRight}</span>
            </button>

            <!-- Trust Badges -->
            <div class="cart-trust-badges">
              <span><span class="badge-dot active-dot"></span> รับประกัน 1 ปี</span>
              <span>·</span>
              <span>${ICONS.truck} จัดส่งด่วน 1-2 วัน</span>
              <span>·</span>
              <span>${ICONS.shieldCheck} ของแท้ 100%</span>
            </div>
          </footer>
        </aside>
      `;
      document.body.appendChild(drawerWrap);

      // Event bindings for drawer controls
      document.getElementById('cart-backdrop').onclick = closeCart;
      document.getElementById('cart-close-btn').onclick = closeCart;
      document.getElementById('cart-clear-btn').onclick = () => {
        if (cart.length === 0) return;
        if (confirm('ต้องการล้างสินค้าทั้งหมดในตะกร้าใช่หรือไม่?')) {
          cart = [];
          saveCart();
          renderCart();
        }
      };

      // Promo Apply
      document.getElementById('promo-apply-btn').onclick = () => {
        const inp = document.getElementById('promo-code-input');
        const code = (inp.value || '').trim().toUpperCase();
        if (!code) return;
        if (PROMO_CODES[code]) {
          appliedPromo = code;
          saveCart();
          inp.value = '';
          renderCart();
          showNotification(`ใช้โค้ด ${code} สำเร็จ! (${PROMO_CODES[code].label})`);
        } else {
          inp.classList.add('promo-input-error');
          setTimeout(() => inp.classList.remove('promo-input-error'), 1200);
          showNotification('โค้ดส่วนลดไม่ถูกต้อง (ลองใช้ IOT10, MAKER50 หรือ FREESHIP)');
        }
      };

      // Promo Remove
      document.getElementById('promo-remove-btn').onclick = () => {
        appliedPromo = null;
        saveCart();
        renderCart();
        showNotification('ยกเลิกโค้ดส่วนลดแล้ว');
      };

      // Checkout Button
      document.getElementById('cart-checkout-btn').onclick = () => {
        if (cart.length === 0) {
          showNotification('กรุณาเลือกสินค้าใส่ตะกร้าก่อนดำเนินการ');
          return;
        }
        closeCart();
        openCheckoutModal();
      };
    }

    // 3. Floating Bottom-Right Cart Pill
    let floatBtn = document.getElementById('floating-cart-btn');
    if (!floatBtn) {
      floatBtn = document.createElement('button');
      floatBtn.id = 'floating-cart-btn';
      floatBtn.className = 'floating-cart-pill';
      floatBtn.type = 'button';
      floatBtn.setAttribute('aria-label', 'เปิดตะกร้าสินค้า');
      floatBtn.hidden = true;
      floatBtn.innerHTML = `
        <span class="float-cart-icon">${ICONS.cart}</span>
        <span class="float-cart-amount" id="float-cart-amount">฿0</span>
        <span class="float-cart-count" id="float-cart-count">0</span>
      `;
      floatBtn.onclick = openCart;
      document.body.appendChild(floatBtn);
    }

    // 4. Checkout Dialog Shell
    let checkoutDialog = document.getElementById('checkout-dialog');
    if (!checkoutDialog) {
      checkoutDialog = document.createElement('dialog');
      checkoutDialog.id = 'checkout-dialog';
      checkoutDialog.className = 'checkout-dialog-modal neu-dialog';
      checkoutDialog.innerHTML = `
        <div class="checkout-modal-container">
          <header class="checkout-header">
            <div class="checkout-header-title">
              <span class="checkout-step-badge">1</span>
              <div>
                <h2>ดำเนินการสั่งซื้อ</h2>
                <small>กรอกข้อมูลจัดส่งและเลือกวิธีชำระเงิน</small>
              </div>
            </div>
            <button type="button" class="dialog-close-btn" id="checkout-close-btn" aria-label="ปิด">${ICONS.x}</button>
          </header>

          <form id="checkout-form" class="checkout-form">
            <div class="checkout-sections-grid">
              <!-- Left: Customer & Shipping Details -->
              <div class="checkout-col">
                <div class="checkout-section-card">
                  <h3 class="section-card-title">1. ข้อมูลผู้รับและสถานที่จัดส่ง</h3>
                  <div class="form-row two-cols">
                    <div class="form-field">
                      <label for="order-fullname">ชื่อ - นามสกุล *</label>
                      <input type="text" id="order-fullname" class="neu-input" required placeholder="สมชาย มุ่งมั่น">
                    </div>
                    <div class="form-field">
                      <label for="order-phone">เบอร์โทรศัพท์ *</label>
                      <input type="tel" id="order-phone" class="neu-input" required placeholder="081-234-5678" pattern="[0-9]{9,10}">
                    </div>
                  </div>
                  <div class="form-field">
                    <label for="order-address">ที่อยู่จัดส่ง (บ้านเลขที่, หมู่, ถนน, ซอย) *</label>
                    <textarea id="order-address" class="neu-input" rows="2" required placeholder="123/45 หมู่บ้านนวัตกรรม ซอย 8 ถ.สุขุมวิท"></textarea>
                  </div>
                  <div class="form-row three-cols">
                    <div class="form-field">
                      <label for="order-subdistrict">แขวง / ตำบล *</label>
                      <input type="text" id="order-subdistrict" class="neu-input" required placeholder="คลองเตย">
                    </div>
                    <div class="form-field">
                      <label for="order-district">เขต / อำเภอ *</label>
                      <input type="text" id="order-district" class="neu-input" required placeholder="คลองเตย">
                    </div>
                    <div class="form-field">
                      <label for="order-zipcode">รหัสไปรษณีย์ *</label>
                      <input type="text" id="order-zipcode" class="neu-input" required placeholder="10110" pattern="[0-9]{5}">
                    </div>
                  </div>
                </div>

                <div class="checkout-section-card">
                  <h3 class="section-card-title">2. เลือกผู้ให้บริการจัดส่ง</h3>
                  <div class="shipping-carrier-options">
                    <label class="carrier-option active">
                      <input type="radio" name="carrier" value="kerry" checked>
                      <div class="carrier-content">
                        <strong>Kerry Express</strong>
                        <small>จัดส่งด่วน 1-2 วันทำการ</small>
                      </div>
                      <span class="carrier-fee">฿45</span>
                    </label>
                    <label class="carrier-option">
                      <input type="radio" name="carrier" value="flash">
                      <div class="carrier-content">
                        <strong>Flash Express</strong>
                        <small>ครอบคลุมทั่วประเทศ 1-2 วัน</small>
                      </div>
                      <span class="carrier-fee">฿35</span>
                    </label>
                    <label class="carrier-option">
                      <input type="radio" name="carrier" value="ems">
                      <div class="carrier-content">
                        <strong>ไปรษณีย์ไทย EMS</strong>
                        <small>จัดส่งมาตรฐานรวดเร็ว</small>
                      </div>
                      <span class="carrier-fee">฿50</span>
                    </label>
                  </div>
                </div>
              </div>

              <!-- Right: Payment & Summary -->
              <div class="checkout-col">
                <div class="checkout-section-card">
                  <h3 class="section-card-title">3. วิธีการชำระเงิน</h3>
                  <div class="payment-method-selector">
                    <label class="payment-tab active">
                      <input type="radio" name="payment_method" value="promptpay" checked>
                      <span class="pay-icon">${ICONS.qrCode}</span>
                      <span>PromptPay QR</span>
                    </label>
                    <label class="payment-tab">
                      <input type="radio" name="payment_method" value="card">
                      <span class="pay-icon">${ICONS.creditCard}</span>
                      <span>บัตรเครดิต / เดบิต</span>
                    </label>
                    <label class="payment-tab">
                      <input type="radio" name="payment_method" value="cod">
                      <span class="pay-icon">${ICONS.truck}</span>
                      <span>เก็บเงินปลายทาง</span>
                    </label>
                  </div>

                  <!-- PromptPay Detail Box -->
                  <div class="payment-details-box" id="pay-box-promptpay">
                    <div class="promptpay-preview-pill">
                      <span class="active-dot"></span>
                      <span>สแกน QR Code พร้อมเพย์ หลังกดยืนยันคำสั่งซื้อ (ฟรีค่าธรรมเนียม)</span>
                    </div>
                  </div>

                  <!-- Card Details Box -->
                  <div class="payment-details-box" id="pay-box-card" hidden>
                    <div class="form-field">
                      <label>หมายเลขบัตรเครดิต</label>
                      <input type="text" class="neu-input" placeholder="4123 4567 8901 2345" maxlength="19">
                    </div>
                    <div class="form-row two-cols">
                      <div class="form-field">
                        <label>หมดอายุ (MM/YY)</label>
                        <input type="text" class="neu-input" placeholder="12/28" maxlength="5">
                      </div>
                      <div class="form-field">
                        <label>CVV</label>
                        <input type="password" class="neu-input" placeholder="•••" maxlength="3">
                      </div>
                    </div>
                  </div>

                  <!-- COD Details Box -->
                  <div class="payment-details-box" id="pay-box-cod" hidden>
                    <p class="cod-note">ชำระเงินสดกับพนักงานจัดส่งเมื่อได้รับสินค้า ณ จุดหมายปลายทาง</p>
                  </div>
                </div>

                <!-- Order Review Card -->
                <div class="checkout-section-card order-summary-card">
                  <h3 class="section-card-title">สรุปคำสั่งซื้อ</h3>
                  <div class="checkout-items-preview" id="checkout-items-preview"></div>
                  <div class="checkout-breakdown">
                    <div class="checkout-row">
                      <span>ยอดรวมสินค้า</span>
                      <span id="checkout-subtotal">฿0</span>
                    </div>
                    <div class="checkout-row discount" id="checkout-discount-row" hidden>
                      <span>ส่วนลด</span>
                      <span id="checkout-discount">-฿0</span>
                    </div>
                    <div class="checkout-row">
                      <span>ค่าจัดส่ง</span>
                      <span id="checkout-shipping">฿0</span>
                    </div>
                    <div class="checkout-divider"></div>
                    <div class="checkout-row total">
                      <strong>ยอดชำระสุทธิ</strong>
                      <strong class="total-highlight" id="checkout-net-total">฿0</strong>
                    </div>
                  </div>

                  <button type="submit" class="confirm-order-btn" id="confirm-order-btn">
                    <span class="btn-spinner" id="order-spinner" hidden></span>
                    <span id="confirm-btn-label">ยืนยันคำสั่งซื้อ</span>
                  </button>
                  <p class="checkout-terms">เมื่อกดสั่งซื้อ ถือว่าคุณยอมรับข้อตกลงและนโยบายความเป็นส่วนตัวของ IoT Hub</p>
                </div>
              </div>
            </div>
          </form>
        </div>
      `;
      document.body.appendChild(checkoutDialog);

      document.getElementById('checkout-close-btn').onclick = () => checkoutDialog.close();

      // Carrier selection toggles
      const carrierInputs = checkoutDialog.querySelectorAll('input[name="carrier"]');
      carrierInputs.forEach(input => {
        input.addEventListener('change', () => {
          checkoutDialog.querySelectorAll('.carrier-option').forEach(el => el.classList.remove('active'));
          input.closest('.carrier-option').classList.add('active');
          updateCheckoutSummary();
        });
      });

      // Payment method toggles
      const payInputs = checkoutDialog.querySelectorAll('input[name="payment_method"]');
      payInputs.forEach(input => {
        input.addEventListener('change', () => {
          checkoutDialog.querySelectorAll('.payment-tab').forEach(el => el.classList.remove('active'));
          input.closest('.payment-tab').classList.add('active');
          document.getElementById('pay-box-promptpay').hidden = input.value !== 'promptpay';
          document.getElementById('pay-box-card').hidden = input.value !== 'card';
          document.getElementById('pay-box-cod').hidden = input.value !== 'cod';
        });
      });

      // Form submission
      document.getElementById('checkout-form').onsubmit = (e) => {
        e.preventDefault();
        handleOrderSubmission();
      };
    }

    // 5. Digital Receipt Modal Shell
    let receiptDialog = document.getElementById('receipt-dialog');
    if (!receiptDialog) {
      receiptDialog = document.createElement('dialog');
      receiptDialog.id = 'receipt-dialog';
      receiptDialog.className = 'receipt-dialog-modal neu-dialog';
      receiptDialog.innerHTML = `
        <div class="receipt-container" id="receipt-container"></div>
      `;
      document.body.appendChild(receiptDialog);
    }
  }

  // Render the Cart UI
  function renderCart() {
    initCartDOM();

    const totalCount = getTotalItems();
    const subtotal = getSubtotal();
    const discount = getDiscount(subtotal);
    const shipping = getShippingFee(subtotal);
    const netTotal = getNetTotal();

    // 1. Update Topbar & Floating Badges
    const badge = document.getElementById('cart-badge');
    if (badge) {
      badge.textContent = totalCount;
      badge.hidden = totalCount === 0;
      badge.classList.remove('badge-pop');
      void badge.offsetWidth;
      badge.classList.add('badge-pop');
    }

    const floatBtn = document.getElementById('floating-cart-btn');
    if (floatBtn) {
      const introEl = document.getElementById('intro');
      const startIntroBtn = document.getElementById('startIntro');
      const isIntroActive = document.body.classList.contains('intro-playing')
        || (introEl && !introEl.hidden)
        || (startIntroBtn && !startIntroBtn.hidden && !document.body.classList.contains('intro-done'));

      floatBtn.hidden = totalCount === 0 || isIntroActive;
      const floatAmt = document.getElementById('float-cart-amount');
      const floatCnt = document.getElementById('float-cart-count');
      if (floatAmt) floatAmt.textContent = `฿${netTotal.toLocaleString()}`;
      if (floatCnt) floatCnt.textContent = totalCount;
    }

    // 2. Update Drawer Header Count
    const headerCount = document.getElementById('cart-header-count');
    if (headerCount) headerCount.textContent = `${totalCount} รายการ`;

    // 3. Update Shipping Progress Bar
    const shippingBanner = document.getElementById('cart-shipping-banner');
    const shippingFill = document.getElementById('shipping-progress-fill');
    const shippingText = document.getElementById('shipping-progress-text');
    if (shippingBanner && shippingFill && shippingText) {
      if (subtotal >= FREE_SHIPPING_THRESHOLD || appliedPromo === 'FREESHIP') {
        shippingFill.style.width = '100%';
        shippingFill.classList.add('free-qualified');
        shippingText.innerHTML = `🎉 ยอดสั่งซื้อของคุณได้รับสิทธิ์ <strong>ส่งฟรีทั่วประเทศ!</strong>`;
      } else {
        const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
        const pct = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
        shippingFill.style.width = `${pct}%`;
        shippingFill.classList.remove('free-qualified');
        shippingText.innerHTML = `ซื้อเพิ่มอีก <strong>฿${remaining.toLocaleString()}</strong> เพื่อรับสิทธิ์ส่งฟรี!`;
      }
    }

    // 4. Render Cart Items
    const itemsWrap = document.getElementById('cart-items-wrap');
    const footer = document.getElementById('cart-footer');

    if (itemsWrap) {
      if (cart.length === 0) {
        itemsWrap.innerHTML = `
          <div class="cart-empty-state">
            <div class="empty-cart-icon-ring">
              ${ICONS.bag}
            </div>
            <h3>ตะกร้าสินค้าว่างเปล่า</h3>
            <p>ยังไม่มีอุปกรณ์ในตะกร้า เลือกชมบอร์ดและเซ็นเซอร์ยอดนิยมเพื่อเริ่มต้นโปรเจกต์ของคุณ</p>
            <button type="button" class="button button-accent empty-browse-btn" id="empty-browse-btn">
              <span>เลือกดูอุปกรณ์ทันที</span>
              ${ICONS.arrowRight}
            </button>
          </div>
        `;
        if (footer) footer.style.display = 'none';

        const browseBtn = document.getElementById('empty-browse-btn');
        if (browseBtn) {
          browseBtn.onclick = () => {
            closeCart();
            const prodSec = document.getElementById('products');
            if (prodSec) prodSec.scrollIntoView({ behavior: 'smooth' });
          };
        }
      } else {
        if (footer) footer.style.display = 'block';

        itemsWrap.innerHTML = `
          <div class="cart-items-list">
            ${cart.map((item, idx) => {
              const itemTotal = item.price * item.quantity;
              return `
                <article class="cart-item-row" data-id="${item.id}">
                  <div class="cart-item-visual visual-${item.visual || 'blue'}">
                    <span class="cart-item-cat">${(item.category || 'IOT').slice(0, 3).toUpperCase()}</span>
                  </div>
                  <div class="cart-item-details">
                    <div class="cart-item-headline">
                      <h4 class="cart-item-name" title="${item.name}">${item.name}</h4>
                      <button type="button" class="cart-item-del-btn" data-remove="${item.id}" aria-label="ลบ ${item.name}">${ICONS.trash}</button>
                    </div>
                    <div class="cart-item-price-unit">฿${item.price.toLocaleString()} / ชิ้น</div>
                    <div class="cart-item-controls">
                      <div class="cart-stepper">
                        <button type="button" class="stepper-btn stepper-minus" data-decrease="${item.id}" aria-label="ลดจำนวน">${ICONS.minus}</button>
                        <span class="stepper-value">${item.quantity}</span>
                        <button type="button" class="stepper-btn stepper-plus" data-increase="${item.id}" aria-label="เพิ่มจำนวน">${ICONS.plus}</button>
                      </div>
                      <strong class="cart-item-subtotal">฿${itemTotal.toLocaleString()}</strong>
                    </div>
                  </div>
                </article>
              `;
            }).join('')}
          </div>
        `;

        // Bind item row actions
        itemsWrap.querySelectorAll('[data-increase]').forEach(btn => {
          btn.onclick = () => updateQuantity(btn.dataset.increase, 1);
        });
        itemsWrap.querySelectorAll('[data-decrease]').forEach(btn => {
          btn.onclick = () => updateQuantity(btn.dataset.decrease, -1);
        });
        itemsWrap.querySelectorAll('[data-remove]').forEach(btn => {
          btn.onclick = () => removeItem(btn.dataset.remove);
        });
      }
    }

    // 5. Update Promo Section
    const promoInputRow = document.getElementById('promo-input-row');
    const appliedPromoTag = document.getElementById('applied-promo-tag');
    const promoCodeLabel = document.getElementById('promo-code-label');
    const promoDescLabel = document.getElementById('promo-desc-label');

    if (promoInputRow && appliedPromoTag) {
      if (appliedPromo && PROMO_CODES[appliedPromo]) {
        promoInputRow.hidden = true;
        appliedPromoTag.hidden = false;
        if (promoCodeLabel) promoCodeLabel.textContent = appliedPromo;
        if (promoDescLabel) promoDescLabel.textContent = PROMO_CODES[appliedPromo].label;
      } else {
        promoInputRow.hidden = false;
        appliedPromoTag.hidden = true;
      }
    }

    // 6. Update Summary Breakdown
    const subtotalEl = document.getElementById('summary-subtotal');
    const discountRow = document.getElementById('summary-discount-row');
    const discountEl = document.getElementById('summary-discount');
    const shippingEl = document.getElementById('summary-shipping');
    const totalEl = document.getElementById('summary-total');
    const checkoutPill = document.getElementById('checkout-total-pill');

    if (subtotalEl) subtotalEl.textContent = `฿${subtotal.toLocaleString()}`;
    if (discountRow && discountEl) {
      if (discount > 0) {
        discountRow.hidden = false;
        discountEl.textContent = `-฿${discount.toLocaleString()}`;
      } else {
        discountRow.hidden = true;
      }
    }
    if (shippingEl) {
      shippingEl.innerHTML = shipping === 0
        ? `<span class="shipping-free-pill">ฟรี</span>`
        : `฿${shipping.toLocaleString()}`;
    }
    if (totalEl) totalEl.textContent = `฿${netTotal.toLocaleString()}`;
    if (checkoutPill) checkoutPill.textContent = `฿${netTotal.toLocaleString()}`;
  }

  // Open & Close Drawer
  function openCart() {
    initCartDOM();
    renderCart();
    const root = document.getElementById('cart-drawer-root');
    if (root) {
      root.classList.add('open');
      isOpen = true;
      document.body.style.overflow = 'hidden';
    }
  }

  function closeCart() {
    const root = document.getElementById('cart-drawer-root');
    if (root) {
      root.classList.remove('open');
      isOpen = false;
      document.body.style.overflow = '';
    }
  }

  // Operations
  function addToCart(productId, qty = 1, openAfterAdd = true) {
    const p = getProduct(productId);
    if (!p) {
      console.warn('Product not found:', productId);
      return;
    }

    const price = typeof p.price === 'number' ? p.price : 99;
    const existing = cart.find(x => x.id === productId);

    if (existing) {
      existing.quantity += qty;
    } else {
      cart.push({
        id: p.id,
        name: p.name,
        price: price,
        category: p.category,
        visual: p.visual,
        quantity: qty
      });
    }

    saveCart();
    renderCart();

    // Visual feedback
    showNotification(`เพิ่ม ${p.name} ลงตะกร้าแล้ว`);

    if (openAfterAdd) {
      openCart();
    }
  }

  function updateQuantity(productId, delta) {
    const item = cart.find(x => x.id === productId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      cart = cart.filter(x => x.id !== productId);
    }

    saveCart();
    renderCart();
  }

  function removeItem(productId) {
    const row = document.querySelector(`.cart-item-row[data-id="${productId}"]`);
    if (row) {
      row.classList.add('removing');
      setTimeout(() => {
        cart = cart.filter(x => x.id !== productId);
        saveCart();
        renderCart();
      }, 250);
    } else {
      cart = cart.filter(x => x.id !== productId);
      saveCart();
      renderCart();
    }
  }

  // Checkout Flow
  function openCheckoutModal() {
    const modal = document.getElementById('checkout-dialog');
    if (!modal) return;

    updateCheckoutSummary();
    modal.showModal();
  }

  function updateCheckoutSummary() {
    const modal = document.getElementById('checkout-dialog');
    if (!modal) return;

    const subtotal = getSubtotal();
    const discount = getDiscount(subtotal);

    // Selected Carrier Fee
    let carrierFee = 45;
    const checkedCarrier = modal.querySelector('input[name="carrier"]:checked');
    if (checkedCarrier) {
      if (checkedCarrier.value === 'flash') carrierFee = 35;
      if (checkedCarrier.value === 'ems') carrierFee = 50;
    }

    if (subtotal >= FREE_SHIPPING_THRESHOLD || appliedPromo === 'FREESHIP') {
      carrierFee = 0;
    }

    const net = Math.max(0, subtotal - discount + carrierFee);

    // Items preview
    const previewBox = document.getElementById('checkout-items-preview');
    if (previewBox) {
      previewBox.innerHTML = cart.map(item => `
        <div class="checkout-item-preview-row">
          <span class="preview-name">${item.name} <small>× ${item.quantity}</small></span>
          <span class="preview-price">฿${(item.price * item.quantity).toLocaleString()}</span>
        </div>
      `).join('');
    }

    // Totals
    const subtotalEl = document.getElementById('checkout-subtotal');
    const discRow = document.getElementById('checkout-discount-row');
    const discEl = document.getElementById('checkout-discount');
    const shipEl = document.getElementById('checkout-shipping');
    const netEl = document.getElementById('checkout-net-total');

    if (subtotalEl) subtotalEl.textContent = `฿${subtotal.toLocaleString()}`;
    if (discRow && discEl) {
      if (discount > 0) {
        discRow.hidden = false;
        discEl.textContent = `-฿${discount.toLocaleString()}`;
      } else {
        discRow.hidden = true;
      }
    }
    if (shipEl) {
      shipEl.innerHTML = carrierFee === 0 ? '<span class="shipping-free-pill">ฟรี</span>' : `฿${carrierFee.toLocaleString()}`;
    }
    if (netEl) netEl.textContent = `฿${net.toLocaleString()}`;
  }

  function handleOrderSubmission() {
    const modal = document.getElementById('checkout-dialog');
    const btn = document.getElementById('confirm-order-btn');
    const spinner = document.getElementById('order-spinner');
    const label = document.getElementById('confirm-btn-label');

    btn.disabled = true;
    if (spinner) spinner.hidden = false;
    if (label) label.textContent = 'กำลังประมวลผลคำสั่งซื้อ...';

    const orderId = 'IOT-' + Math.floor(100000 + Math.random() * 900000);
    const fullname = document.getElementById('order-fullname').value;
    const phone = document.getElementById('order-phone').value;
    const address = document.getElementById('order-address').value;
    const subdistrict = document.getElementById('order-subdistrict').value;
    const district = document.getElementById('order-district').value;
    const zipcode = document.getElementById('order-zipcode').value;

    const checkedCarrier = modal.querySelector('input[name="carrier"]:checked');
    const carrierName = checkedCarrier ? checkedCarrier.parentElement.querySelector('strong').textContent : 'Kerry Express';

    const checkedPay = modal.querySelector('input[name="payment_method"]:checked');
    const payMethod = checkedPay ? checkedPay.value : 'promptpay';

    const subtotal = getSubtotal();
    const discount = getDiscount(subtotal);
    const shipping = getShippingFee(subtotal);
    const netTotal = Math.max(0, subtotal - discount + shipping);

    const order = {
      orderId,
      createdAt: new Date().toISOString(),
      fullname,
      phone,
      shippingAddress: `${address}, ต.${subdistrict}, อ.${district}, จ.กรุงเทพฯ ${zipcode}`,
      carrier: carrierName,
      paymentMethod: payMethod,
      items: [...cart],
      subtotal,
      discount,
      shipping,
      netTotal,
      status: payMethod === 'promptpay' ? 'รอตรวจสอบยอดชำระ' : 'เตรียมจัดส่งพัสดุ'
    };

    // Save order history locally
    try {
      const orders = JSON.parse(localStorage.getItem('iothub_orders') || '[]');
      orders.unshift(order);
      localStorage.setItem('iothub_orders', JSON.stringify(orders));
    } catch (e) {
      console.error('Could not save order history', e);
    }

    // Sync order to Supabase table 'orders'
    if (window.supabaseClient) {
      (async () => {
        try {
          let userId = null;
          let userEmail = null;
          try {
            const { data } = await window.supabaseClient.auth.getUser();
            if (data && data.user) {
              userId = data.user.id;
              userEmail = data.user.email;
            }
          } catch (_) {}

          const { error } = await window.supabaseClient.from('orders').insert({
            order_id: order.orderId,
            user_id: userId,
            user_email: userEmail,
            customer_name: order.fullname,
            phone: order.phone,
            shipping_address: order.shippingAddress,
            carrier: order.carrier,
            payment_method: order.paymentMethod,
            items: order.items,
            subtotal: order.subtotal,
            discount: order.discount,
            shipping_fee: order.shipping,
            net_total: order.netTotal,
            status: order.status
          });

          if (!error) {
            console.log('Order successfully synced to Supabase orders table:', order.orderId);
          } else {
            console.warn('Supabase order insert warning:', error);
          }
        } catch (supabaseErr) {
          console.warn('Supabase sync exception:', supabaseErr);
        }
      })();
    }

    // Simulate network delay for realistic async polish (zero CLS)
    setTimeout(() => {
      btn.disabled = false;
      if (spinner) spinner.hidden = true;
      if (label) label.textContent = 'ยืนยันคำสั่งซื้อ';

      modal.close();

      // Clear cart
      cart = [];
      appliedPromo = null;
      saveCart();
      renderCart();

      // Open Digital Receipt
      openReceiptModal(order);
    }, 1100);
  }

  function openReceiptModal(order) {
    const receiptDialog = document.getElementById('receipt-dialog');
    const container = document.getElementById('receipt-container');
    if (!receiptDialog || !container) return;

    const isPromptPay = order.paymentMethod === 'promptpay';

    container.innerHTML = `
      <div class="receipt-card">
        <div class="receipt-success-badge">
          <div class="success-icon-wrap">
            ${ICONS.check}
          </div>
          <h2>สั่งซื้อสำเร็จเรียบร้อย!</h2>
          <p>ขอขอบคุณสำหรับคำสั่งซื้อ เรากำลังเตรียมจัดส่งอุปกรณ์ไปยังที่อยู่ของคุณ</p>
        </div>

        <div class="receipt-meta-box">
          <div class="meta-row">
            <span class="meta-label">หมายเลขคำสั่งซื้อ:</span>
            <strong class="order-id-badge">#${order.orderId}</strong>
          </div>
          <div class="meta-row">
            <span class="meta-label">วันที่สั่งซื้อ:</span>
            <span>${new Date(order.createdAt).toLocaleString('th-TH')}</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">สถานะคำสั่งซื้อ:</span>
            <span class="order-status-pill"><span class="active-dot"></span> ${order.status}</span>
          </div>
        </div>

        ${isPromptPay ? `
          <div class="receipt-promptpay-box">
            <div class="promptpay-header">
              <span class="qr-icon">${ICONS.qrCode}</span>
              <strong>สแกนจ่ายผ่าน PromptPay QR Code</strong>
            </div>
            <div class="qr-canvas-mockup">
              <!-- Inline SVG vector QR code pattern with PromptPay banner -->
              <svg viewBox="0 0 160 160" width="160" height="160" class="qr-svg-code">
                <rect width="160" height="160" fill="#ffffff" rx="10"/>
                <!-- Top-Left Finder -->
                <rect x="15" y="15" width="36" height="36" fill="#112d4e" rx="4"/>
                <rect x="22" y="22" width="22" height="22" fill="#ffffff" rx="2"/>
                <rect x="27" y="27" width="12" height="12" fill="#3f72af" rx="2"/>
                <!-- Top-Right Finder -->
                <rect x="109" y="15" width="36" height="36" fill="#112d4e" rx="4"/>
                <rect x="116" y="22" width="22" height="22" fill="#ffffff" rx="2"/>
                <rect x="121" y="27" width="12" height="12" fill="#3f72af" rx="2"/>
                <!-- Bottom-Left Finder -->
                <rect x="15" y="109" width="36" height="36" fill="#112d4e" rx="4"/>
                <rect x="22" y="116" width="22" height="22" fill="#ffffff" rx="2"/>
                <rect x="27" y="121" width="12" height="12" fill="#3f72af" rx="2"/>
                <!-- Simulated Data Modules -->
                <path d="M58 20h6v6h-6zM70 20h6v6h-6zM82 20h6v6h-6zM58 32h12v6H58zM82 32h12v6H82zM58 44h6v6h-6zM76 44h12v6H76zM20 58h6v12h-6zM32 58h12v6H32zM44 70h6v6h-6zM58 58h12v12H58zM76 58h6v6h-6zM88 58h12v6H88zM106 58h6v12h-6zM118 58h12v6h-12zM136 70h6v6h-6zM20 82h12v6H20zM38 82h6v6h-6zM58 76h6v12h-6zM70 82h12v6H70zM94 76h6v12h-6zM106 82h12v6h-12zM124 82h6v6h-6zM136 82h6v6h-6zM58 100h12v6H58zM76 94h6v12h-6zM88 100h12v6H88zM58 112h6v6h-6zM70 112h12v6H70zM88 112h6v12h-6zM100 118h12v6h-12zM118 112h6v6h-12zM130 112h12v12h-12zM58 130h12v6H58zM76 124h6v12h-6zM94 130h12v6H94zM112 130h6v6h-6zM124 130h12v6h-12z" fill="#112d4e"/>
                <!-- Center Logo Pill -->
                <circle cx="80" cy="80" r="14" fill="#ffffff" stroke="#3f72af" stroke-width="2"/>
                <text x="80" y="84" font-size="8" font-weight="bold" fill="#112d4e" text-anchor="middle">IoT</text>
              </svg>
            </div>
            <p class="qr-amount-prompt">ยอดชำระ: <strong class="qr-amount-highlight">฿${order.netTotal.toLocaleString()}</strong></p>
            <small class="qr-account-info">บัญชี: บจก. ไอโอที ฮับ (ประเทศไทย) · ธนาคารกสิกรไทย</small>
          </div>
        ` : ''}

        <div class="receipt-section-box">
          <h4 class="receipt-box-title">รายการอุปกรณ์</h4>
          <div class="receipt-items-table">
            ${order.items.map(it => `
              <div class="receipt-item-row">
                <span>${it.name} <small>× ${it.quantity}</small></span>
                <strong>฿${(it.price * it.quantity).toLocaleString()}</strong>
              </div>
            `).join('')}
          </div>
          <div class="receipt-cost-summary">
            <div class="receipt-sub-row">
              <span>ยอดรวมค่าสินค้า</span>
              <span>฿${order.subtotal.toLocaleString()}</span>
            </div>
            ${order.discount > 0 ? `
              <div class="receipt-sub-row text-discount">
                <span>ส่วนลด</span>
                <span>-฿${order.discount.toLocaleString()}</span>
              </div>
            ` : ''}
            <div class="receipt-sub-row">
              <span>ค่าจัดส่ง (${order.carrier})</span>
              <span>${order.shipping === 0 ? 'ฟรี' : `฿${order.shipping.toLocaleString()}`}</span>
            </div>
            <div class="receipt-total-divider"></div>
            <div class="receipt-sub-row receipt-net-row">
              <strong>ยอดชำระทั้งหมด</strong>
              <strong class="receipt-net-amount">฿${order.netTotal.toLocaleString()}</strong>
            </div>
          </div>
        </div>

        <div class="receipt-section-box shipping-dest-box">
          <h4 class="receipt-box-title">ที่อยู่จัดส่งและผู้รับ</h4>
          <p><strong>${order.fullname}</strong> (${order.phone})</p>
          <p class="address-text">${order.shippingAddress}</p>
        </div>

        <div class="receipt-actions">
          <button type="button" class="button button-accent print-receipt-btn" id="print-receipt-btn">
            ${ICONS.printer}
            <span>พิมพ์ใบเสร็จ</span>
          </button>
          <button type="button" class="button button-dark continue-shopping-btn" id="receipt-done-btn">
            <span>เลือกซื้อสินค้าต่อ</span>
            ${ICONS.arrowRight}
          </button>
        </div>
      </div>
    `;

    receiptDialog.showModal();

    document.getElementById('print-receipt-btn').onclick = () => window.print();
    document.getElementById('receipt-done-btn').onclick = () => {
      receiptDialog.close();
      const prodSec = document.getElementById('products');
      if (prodSec) prodSec.scrollIntoView({ behavior: 'smooth' });
    };
  }

  // Toast / Floating Micro-Notification
  function showNotification(msg) {
    let toast = document.getElementById('cart-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'cart-toast';
      toast.className = 'cart-micro-toast';
      document.body.appendChild(toast);
    }

    toast.innerHTML = `<span class="toast-dot active-dot"></span><span>${msg}</span>`;
    toast.classList.add('visible');

    if (toast._timer) clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.classList.remove('visible');
    }, 2800);
  }

  // Global Cart API
  window.IoTCart = {
    open: openCart,
    close: closeCart,
    add: addToCart,
    update: updateQuantity,
    remove: removeItem,
    clear: () => {
      cart = [];
      saveCart();
      renderCart();
    },
    getCart: () => cart,
    getSubtotal,
    getNetTotal,
    showNotification
  };

  // Auto-init on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initCartDOM();
      renderCart();
    });
  } else {
    initCartDOM();
    renderCart();
  }

  // Keyboard shortcut: Escape to close drawer
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) {
      closeCart();
    }
  });

  // Watch for intro lifecycle completion to reveal floating cart button
  if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver(() => {
      renderCart();
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    const introEl = document.getElementById('intro');
    if (introEl) {
      observer.observe(introEl, { attributes: true, attributeFilter: ['hidden'] });
    }
    const startIntroBtn = document.getElementById('startIntro');
    if (startIntroBtn) {
      observer.observe(startIntroBtn, { attributes: true, attributeFilter: ['hidden'] });
    }
  }

})();
