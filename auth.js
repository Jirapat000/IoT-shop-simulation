/**
 * auth.js – Supabase Auth Modal (IoT888)
 * Compact single-card popup with expandable sign-up fields.
 * Color palette: #F8FAFC, #D9EAFD, #BCCCDC, #9AA6B2
 */
(function () {
  'use strict';

  /* ─── Cooldown state (rate-limit guard) ─────────────────── */
  let _cooldownEnd = 0;  // epoch ms when cooldown expires
  let _cooldownTimer = null;

  /* ─── Supabase credentials ─────────────────────────────── */
  const SUPABASE_URL     = 'https://kjbfhfinbbygcnqjhnnl.supabase.co';
  const SUPABASE_ANON_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
    'eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqYmZoZmluYmJ5Z2NucWpobm5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA5NDI4MzMsImV4cCI6MjEwNjUxODgzM30.' +
    'XJO4KmWXHdjK1euy3tl4soOzS6LI67ZArgj6Ll1g5Po';

  /* ─── Init Supabase client ──────────────────────────────── */
  let sb = null;
  function initSupabase () {
    if (window.supabase && window.supabase.createClient) {
      sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      window.supabaseClient = sb;
    } else {
      setTimeout(initSupabase, 200);
    }
  }
  initSupabase();

  /* ─── DOM refs ──────────────────────────────────────────── */
  const $ = id => document.getElementById(id);
  const authBtn         = $('auth-btn');
  const backdrop        = $('auth-modal');
  const closeBtn        = $('auth-modal-close');
  const authForm        = $('auth-form');
  const fieldUsername   = $('field-username');
  const inputUsername   = $('auth-username');
  const inputEmail      = $('auth-email');
  const inputPassword   = $('auth-password');
  const authOptions     = $('auth-options');
  const submitBtn       = $('auth-submit-btn');
  const submitText      = $('auth-submit-text');
  const modalTitle      = $('auth-modal-title');
  const modalSub        = $('auth-modal-sub');
  const togglePrompt    = $('auth-toggle-prompt');
  const switchBtn       = $('auth-switch-btn');
  const msgBox          = $('auth-msg');
  const googleBtn       = $('google-auth-btn');
  const pwdToggle       = $('auth-pwd-toggle');

  /* ─── State ─────────────────────────────────────────────── */
  let currentUser    = null;
  let currentProfile = null;
  let isSignUpMode   = false;

  /* ═══════════════════════════════════════════════════════════
     UI & Mode Switcher
  ═══════════════════════════════════════════════════════════ */
  function setAuthMode (signUp) {
    isSignUpMode = Boolean(signUp);

    if (fieldUsername) {
      if (isSignUpMode) {
        fieldUsername.hidden = false;
        requestAnimationFrame(() => {
          fieldUsername.classList.add('is-expanded');
          if (inputUsername) {
            inputUsername.required = true;
            inputUsername.focus();
          }
        });
      } else {
        fieldUsername.classList.remove('is-expanded');
        if (inputUsername) inputUsername.required = false;
        setTimeout(() => {
          if (!isSignUpMode) fieldUsername.hidden = true;
        }, 280);
      }
    }
    if (authOptions) {
      authOptions.hidden = isSignUpMode;
    }
    if (modalTitle) {
      modalTitle.textContent = isSignUpMode ? 'Create Account' : 'Welcome Back';
    }
    if (modalSub) {
      modalSub.textContent = isSignUpMode ? 'Sign up to join IoT Hub' : 'Sign in to continue to IoT Hub';
    }
    if (submitText) {
      submitText.textContent = isSignUpMode ? 'Sign Up' : 'Sign In';
    }
    if (togglePrompt) {
      togglePrompt.textContent = isSignUpMode ? 'Already have an account?' : "Don't have an account?";
    }
    if (switchBtn) {
      switchBtn.textContent = isSignUpMode ? 'Sign in' : 'Sign up';
    }
    clearMsg();
  }

  function openModal (mode = 'login') {
    if (!backdrop) return;
    backdrop.hidden = false;
    backdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setAuthMode(mode === 'signup' || mode === 'register');
    clearMsg();

    // Reset card animation
    const card = backdrop.querySelector('.auth-modal-card');
    if (card) {
      card.style.animation = 'none';
      card.offsetHeight; // reflow
      card.style.animation = '';
    }
  }

  function closeModal () {
    if (!backdrop) return;
    backdrop.hidden = true;
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    clearMsg();
  }

  function showMsg (text, type = 'error') {
    if (!msgBox) return;
    msgBox.textContent = text;
    msgBox.className   = `auth-msg is-${type}`;
    msgBox.hidden      = false;
  }

  function clearMsg () {
    if (!msgBox) return;
    msgBox.textContent = '';
    msgBox.hidden      = true;
  }

  /* ─── Update topbar button ──────────────────────────────── */
  async function refreshUI (user) {
    currentUser = user;
    if (!authBtn) return;

    if (user) {
      try {
        const { data } = await sb.from('IoT888').select('*').eq('user_id', user.id).maybeSingle();
        if (data) {
          currentProfile = data;
        } else {
          const meta = user.user_metadata || {};
          const username = meta.username || meta.full_name || meta.name || user.email.split('@')[0];
          const { data: newRow } = await sb.from('IoT888').insert([{
            user_id   : user.id,
            email     : user.email,
            username  : username,
            last_login: new Date().toISOString()
          }]).select().maybeSingle();
          currentProfile = newRow;
        }
      } catch (err) {
        console.warn('[auth] IoT888 sync failed:', err);
      }

      const meta = user.user_metadata || {};
      const name = currentProfile?.username || meta.username || meta.full_name || meta.name || user.email.split('@')[0];
      const avatarUrl = meta.avatar_url || meta.picture || null;
      const avatarHtml = avatarUrl
        ? `<img src="${avatarUrl}" alt="${name}" class="auth-user-avatar-img">`
        : `<span class="auth-user-avatar">👤</span>`;

      authBtn.innerHTML = `
        ${avatarHtml}
        <span class="auth-user-name">${name}</span>
        <span class="auth-logout-icon" title="ออกจากระบบ">⏻</span>
      `;
      authBtn.classList.add('is-logged-in');
      authBtn.title = `${user.email} · คลิกเพื่อออกจากระบบ`;
    } else {
      currentProfile = null;
      authBtn.innerHTML = `<span>🔑</span> <span>เข้าสู่ระบบ</span>`;
      authBtn.classList.remove('is-logged-in');
      authBtn.title = 'เข้าสู่ระบบ / สมัครสมาชิก';
    }
  }

  /* ═══════════════════════════════════════════════════════════
     Event Wiring & 3D Tilt
  ═══════════════════════════════════════════════════════════ */

  /* Open / close */
  authBtn?.addEventListener('click', () => {
    if (currentUser) {
      if (confirm(`ต้องการออกจากระบบ (${currentUser.email})?`)) {
        sb.auth.signOut().then(() => { refreshUI(null); closeModal(); });
      }
    } else {
      openModal('login');
    }
  });

  closeBtn?.addEventListener('click', closeModal);

  backdrop?.addEventListener('click', e => {
    if (e.target === backdrop) closeModal();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !backdrop?.hidden) closeModal();
  });

  /* Toggle between Sign In & Sign Up */
  switchBtn?.addEventListener('click', () => {
    setAuthMode(!isSignUpMode);
  });

  /* 3D Card tilt effect on mouse move */
  const cardWrap = $('auth-card-wrap');
  const cardOuter = document.querySelector('.auth-card-outer');
  if (cardWrap && cardOuter) {
    cardWrap.addEventListener('mousemove', e => {
      const rect = cardWrap.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = -(y / (rect.height / 2)) * 8;
      const rotateY = (x / (rect.width / 2)) * 8;
      cardOuter.style.transform = `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
    });
    cardWrap.addEventListener('mouseleave', () => {
      cardOuter.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
    });
  }

  /* Input focus highlight effects */
  document.querySelectorAll('.auth-input-wrap input').forEach(inp => {
    inp.addEventListener('focus', () => inp.closest('.auth-input-wrap')?.classList.add('is-focused'));
    inp.addEventListener('blur', () => inp.closest('.auth-input-wrap')?.classList.remove('is-focused'));
  });

  /* Password visibility toggle */
  pwdToggle?.addEventListener('click', () => {
    if (!inputPassword) return;
    const isPwd = inputPassword.type === 'password';
    inputPassword.type = isPwd ? 'text' : 'password';
    pwdToggle.querySelector('.eye-show')?.toggleAttribute('hidden', isPwd);
    pwdToggle.querySelector('.eye-hide')?.toggleAttribute('hidden', !isPwd);
  });

  /* Forgot password */
  $('auth-forgot-btn')?.addEventListener('click', () => {
    showMsg('ระบุอีเมลเพื่อรับลิงก์รีเซ็ตรหัสผ่านทางอีเมล', 'success');
  });

  /* Google Sign In */
  async function handleGoogleLogin () {
    if (!sb) return showMsg('กำลังโหลดระบบ Supabase...');
    if (!googleBtn) return;

    const originalContent = googleBtn.innerHTML;
    try {
      googleBtn.disabled = true;
      googleBtn.innerHTML = `
        <span class="auth-google-icon"><svg class="ui-svg spinner-svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg></span>
        <span>กำลังเชื่อมต่อ Google...</span>
      `;
      clearMsg();

      // Ensure clean redirect URL without any hashes
      const redirectUrl = window.location.origin + window.location.pathname;

      const { data, error } = await sb.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account'
          }
        }
      });

      if (error) {
        if (error.message?.includes('provider is not enabled')) {
          showMsg('⚠️ ยังไม่ได้เปิดใช้งาน Google Provider ใน Supabase Dashboard\n(Authentication → Providers → Google)', 'error');
        } else {
          showMsg(error.message, 'error');
        }
        googleBtn.disabled = false;
        googleBtn.innerHTML = originalContent;
      }
    } catch (err) {
      showMsg(err.message || 'ไม่สามารถเปิด Google Sign In ได้', 'error');
      googleBtn.disabled = false;
      googleBtn.innerHTML = originalContent;
    }
  }
  googleBtn?.addEventListener('click', handleGoogleLogin);

  /* ─── Cooldown helper ───────────────────────────────────── */
  function startCooldown (seconds, btn, originalLabel) {
    _cooldownEnd = Date.now() + seconds * 1000;
    clearInterval(_cooldownTimer);
    _cooldownTimer = setInterval(() => {
      const left = Math.ceil((_cooldownEnd - Date.now()) / 1000);
      if (left <= 0) {
        clearInterval(_cooldownTimer);
        btn.disabled    = false;
        if (submitText) submitText.textContent = originalLabel;
        clearMsg();
      } else {
        btn.disabled    = true;
        if (submitText) submitText.textContent = `รอ ${left} วินาที…`;
      }
    }, 500);
  }

  function isCoolingDown () {
    return Date.now() < _cooldownEnd;
  }

  /* ─── Unified Form Submit (Sign In or Sign Up) ─────────── */
  authForm?.addEventListener('submit', async e => {
    e.preventDefault();
    if (!sb) return showMsg('กำลังโหลดระบบ...');
    if (isCoolingDown()) return;

    const email    = inputEmail?.value.trim();
    const password = inputPassword?.value;
    const username = inputUsername?.value.trim();

    if (!email || !password) return showMsg('ระบุอีเมลและรหัสผ่าน');

    const originalLabel = isSignUpMode ? 'Sign Up' : 'Sign In';

    if (isSignUpMode) {
      /* ─── SIGN UP ────────────────────────── */
      if (!username) return showMsg('ระบุชื่อผู้ใช้ (Username)');
      if (password.length < 6) return showMsg('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');

      try {
        submitBtn.disabled = true;
        if (submitText) submitText.textContent = 'กำลังสมัครสมาชิก…';
        clearMsg();

        const { data, error } = await sb.auth.signUp({
          email,
          password,
          options: { data: { username } }
        });

        if (error) {
          if (error.status === 429 || error.message?.toLowerCase().includes('rate')) {
            showMsg('ส่งคำขอบ่อยเกินไป • รอสักครู่แล้วลองใหม่', 'error');
            startCooldown(120, submitBtn, originalLabel);
            return;
          }
          if (error.message?.includes('already registered')) {
            showMsg('อีเมลนี้ลงทะเบียนแล้ว • สลับเป็นเข้าสู่ระบบ', 'error');
            return;
          }
          return showMsg(error.message);
        }

        if (data.user) {
          await sb.from('IoT888').upsert([{
            user_id    : data.user.id,
            email      : email,
            username   : username,
            last_login : new Date().toISOString()
          }], { onConflict: 'user_id', ignoreDuplicates: false });
        }

        const needsConfirm = !data.session;
        if (needsConfirm) {
          showMsg('ส่งอีเมลยืนยันไปยัง ' + email + ' แล้ว • ตรวจสอบกล่องข้อความเพื่อยืนยัน', 'success');
          setTimeout(closeModal, 3500);
        } else {
          showMsg('สมัครสมาชิกสำเร็จ • บันทึกข้อมูลเรียบร้อย', 'success');
          await refreshUI(data.user);
          setTimeout(closeModal, 1200);
        }
      } catch (err) {
        showMsg(err.message || 'ไม่สามารถสมัครสมาชิกได้');
      } finally {
        if (!isCoolingDown()) {
          submitBtn.disabled = false;
          if (submitText) submitText.textContent = originalLabel;
        }
      }

    } else {
      /* ─── SIGN IN ────────────────────────── */
      try {
        submitBtn.disabled = true;
        if (submitText) submitText.textContent = 'กำลังเข้าสู่ระบบ…';
        clearMsg();

        const { data, error } = await sb.auth.signInWithPassword({ email, password });
        if (error) {
          if (error.status === 429 || error.message?.toLowerCase().includes('rate')) {
            showMsg('เข้าสู่ระบบบ่อยเกินไป • รอสักครู่แล้วลองใหม่', 'error');
            startCooldown(60, submitBtn, originalLabel);
            return;
          }
          const msg = error.message.includes('Invalid login')
            ? 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
            : error.message;
          return showMsg(msg);
        }

        await sb.from('IoT888').upsert({
          user_id    : data.user.id,
          email      : data.user.email,
          username   : data.user.user_metadata?.username || data.user.email.split('@')[0],
          last_login : new Date().toISOString()
        }, { onConflict: 'user_id', ignoreDuplicates: false });

        showMsg('เข้าสู่ระบบสำเร็จ', 'success');
        await refreshUI(data.user);
        setTimeout(closeModal, 900);
      } catch (err) {
        showMsg(err.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
      } finally {
        if (!isCoolingDown()) {
          submitBtn.disabled = false;
          if (submitText) submitText.textContent = originalLabel;
        }
      }
    }
  });

  /* ─── Restore session on page load ─────────────────────── */
  function bootstrap () {
    if (!sb) { setTimeout(bootstrap, 150); return; }

    sb.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) refreshUI(session.user);
    });

    sb.auth.onAuthStateChange((_event, session) => {
      refreshUI(session?.user ?? null);
    });
  }
  bootstrap();

  /* ─── Global API ────────────────────────────────────────── */
  window.IoTHubAuth = {
    openModal,
    closeModal,
    setAuthMode,
    getUser:    () => currentUser,
    getProfile: () => currentProfile
  };

})();
