(() => {
  const button = document.querySelector('#bgm-toggle');
  if (!button) return;

  const bpm = 76;
  const beatMs = 60000 / bpm;
  const chords = [
    [130.81, 164.81, 196, 246.94], // Cmaj7
    [110, 130.81, 164.81, 196], // Am7
    [87.31, 110, 130.81, 164.81], // Fmaj7
    [98, 123.47, 146.83, 220], // G6
  ];
  const melody = [523.25, 659.25, 783.99, 659.25, 587.33, 783.99, 659.25, 493.88,
    523.25, 659.25, 880, 783.99, 659.25, 587.33, 493.88, 587.33];
  let audio, musicGain, sfxGain, analyser, meter, timer, idleTimer, beat = 0, active = false, level = 0;
  const musicVolume = .18; // Set BGM volume to 18% (was 15%, raised by 20%).
  window.iotHubAudioLevel = 0;

  function ensureAudio() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return false;
    if (audio) return true;
    audio = new AudioContext();
    musicGain = audio.createGain();
    sfxGain = audio.createGain();
    analyser = audio.createAnalyser();
    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = .78;
    musicGain.gain.value = 0;
    sfxGain.gain.value = .84; // was .7, raised by 20% with the music bus
    musicGain.connect(analyser);
    sfxGain.connect(analyser);
    analyser.connect(audio.destination);
    return true;
  }

  function tone(frequency, delay = 0, duration = .13, volume = .025) {
    if (!audio || !sfxGain) return;
    const at = audio.currentTime + delay;
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    const filter = audio.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 2600;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, at);
    osc.frequency.exponentialRampToValueAtTime(Math.max(180, frequency * .72), at + duration);
    gain.gain.setValueAtTime(.0001, at);
    gain.gain.linearRampToValueAtTime(volume, at + .009);
    gain.gain.exponentialRampToValueAtTime(.0001, at + duration);
    osc.connect(filter).connect(gain).connect(sfxGain);
    osc.start(at);
    osc.stop(at + duration + .015);
    osc.addEventListener('ended', () => { filter.disconnect(); gain.disconnect(); }, { once: true });
  }

  function playActionSound(event) {
    const target = event.target instanceof Element
      ? event.target.closest('button,a,.product-card,.category-card,.board-interactive,[data-detail],[data-compare]')
      : null;
    if (!target || target.matches(':disabled,[aria-disabled="true"]') || !ensureAudio()) return;
    clearTimeout(idleTimer);
    audio.resume().catch(() => {});
    if (target.matches('[data-detail],.detail-link')) {
      tone(720, 0, .15, .033);
      tone(960, .075, .2, .027);
    } else if (target.matches('.category-card,.board-interactive')) {
      tone(560, 0, .14, .036);
      tone(410, .045, .11, .0195);
    } else if (target.matches('a')) {
      tone(660, 0, .11, .027);
    } else {
      tone(520, 0, .1, .03);
    }
    if (!active) idleTimer = setTimeout(() => {
      if (!active && audio?.state === 'running') audio.suspend();
    }, 1400);
  }

  function label() {
    button.setAttribute('aria-pressed', String(active));
    button.setAttribute('aria-label', active ? 'ปิดเพลงประกอบ' : 'เปิดเพลงประกอบ');
    button.title = active ? 'ปิดเพลงประกอบ' : 'เปิดเพลงประกอบ';
    button.innerHTML = active ? '♫ <span>BGM · ON</span>' : '♫ <span>BGM</span>';
    button.classList.toggle('bgm-playing', active);
  }

  function playChord(index) {
    const now = audio.currentTime;
    const bus = audio.createGain();
    const filter = audio.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1250;
    bus.gain.setValueAtTime(.0001, now);
    bus.gain.linearRampToValueAtTime(.09, now + .7);
    bus.gain.setValueAtTime(.09, now + beatMs * 7.5 / 1000);
    bus.gain.linearRampToValueAtTime(.0001, now + beatMs * 8 / 1000);
    bus.connect(filter).connect(musicGain);
    chords[index].forEach((frequency, i) => {
      const osc = audio.createOscillator();
      const voice = audio.createGain();
      osc.type = i === 0 ? 'sine' : 'triangle';
      osc.frequency.value = frequency;
      osc.detune.value = i === 3 ? 4 : 0;
      voice.gain.value = i === 0 ? .24 : .12;
      osc.connect(voice).connect(bus);
      osc.start(now);
      osc.stop(now + beatMs * 8 / 1000 + .04);
    });
    setTimeout(() => { bus.disconnect(); filter.disconnect(); }, 7000);
  }

  function pluck(frequency) {
    const now = audio.currentTime;
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    const filter = audio.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2300, now);
    filter.frequency.exponentialRampToValueAtTime(850, now + .55);
    osc.type = 'sine';
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(.0001, now);
    gain.gain.linearRampToValueAtTime(.095, now + .018);
    gain.gain.exponentialRampToValueAtTime(.0001, now + .62);
    osc.connect(filter).connect(gain).connect(musicGain);
    osc.start(now);
    osc.stop(now + .65);
    osc.addEventListener('ended', () => { filter.disconnect(); gain.disconnect(); }, { once: true });
  }

  function tick() {
    if (!active) return;
    if (beat % 8 === 0) playChord((beat / 8) % chords.length);
    if (beat % 2 === 0) pluck(melody[(beat / 2) % melody.length]);
    beat++;
    timer = setTimeout(tick, beatMs / 2);
  }

  function meterFrame() {
    if (!active || !analyser) {
      level = 0;
      window.iotHubAudioLevel = 0;
      return;
    }
    const bins = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(bins);
    const count = Math.max(1, Math.floor(230 * analyser.fftSize / audio.sampleRate));
    let low = 0;
    for (let i = 1; i < count; i++) low += bins[i];
    const bass = low / Math.max(1, count - 1) / 255;
    level += (Math.min(1, bass * 4.2) - level) * .22;
    window.iotHubAudioLevel = level;
    meter = requestAnimationFrame(meterFrame);
  }

  async function start() {
    if (!ensureAudio()) {
      button.title = 'เบราว์เซอร์นี้ไม่รองรับ Web Audio';
      return;
    }
    await audio.resume();
    musicGain.gain.cancelScheduledValues(audio.currentTime);
    musicGain.gain.setTargetAtTime(musicVolume, audio.currentTime, .2);
    active = true;
    label();
    clearTimeout(timer);
    tick();
    cancelAnimationFrame(meter);
    meterFrame();
  }

  button.addEventListener('click', async () => {
    if (active) {
      active = false;
      clearTimeout(timer);
      if (musicGain && audio) {
        musicGain.gain.cancelScheduledValues(audio.currentTime);
        musicGain.gain.setTargetAtTime(0, audio.currentTime, .12);
        setTimeout(() => {
          if (!active && audio?.state === 'running') audio.suspend();
        }, 500);
      }
      cancelAnimationFrame(meter);
      level = 0;
      window.iotHubAudioLevel = 0;
      label();
      return;
    }
    try { await start(); }
    catch (error) {
      active = false;
      label();
      console.warn('BGM could not start', error);
    }
  });

  document.addEventListener('click', playActionSound, true);
  label();
})();
