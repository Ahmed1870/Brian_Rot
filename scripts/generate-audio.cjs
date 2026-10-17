// يولّد المؤثرات الصوتية (SFX Master — 35 ثانية بالظبط) برمجيًا بدون أي مكتبات، ويتأكد من وجود الفويس أوفر.
// الأحداث مظبوطة على التحولات: 0.2 Impact · 3.0 Riser · 6.2 Glitch · 7.8 Servo · 12.5 Pad · 16.4 Fluid+Chime ·
// 22.5 Page Flips · 26.65 Lock Snap · 30.0 Ping — وفيه صمت كامل في آخر 0.15s (لوب نظيف).
const fs = require('fs');
const path = require('path');

const PUB = path.join(__dirname, '..', 'public');
const SR = 44100;
const DUR = 35;
const N = SR * DUR;
const TAU = Math.PI * 2;
fs.mkdirSync(PUB, {recursive: true});

let seed = 777001;
const rnd = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return (seed / 4294967296) * 2 - 1;
};
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const ss = (a, b, x) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const d = new Float32Array(N);
const at = (t) => Math.floor(t * SR);

const tone = (t0, dur, f0, f1, amp, decay, wave = 'sin') => {
  let ph = 0;
  const s0 = at(t0);
  const n = Math.floor(dur * SR);
  for (let i = 0; i < n && s0 + i < N; i++) {
    const t = i / SR;
    const f = f0 + (f1 - f0) * (i / n);
    ph += (TAU * f) / SR;
    let v = Math.sin(ph);
    if (wave === 'saw') v = ((ph / TAU) % 1) * 2 - 1;
    if (wave === 'sq') v = Math.sign(Math.sin(ph)) * 0.6;
    d[s0 + i] += v * amp * Math.exp(-t * decay);
  }
};
const noise = (t0, dur, amp, decay, lpStart = 1, lpEnd = lpStart) => {
  let y = 0;
  const s0 = at(t0);
  const n = Math.floor(dur * SR);
  for (let i = 0; i < n && s0 + i < N; i++) {
    const k = i / n;
    y += (lpStart + (lpEnd - lpStart) * k) * (rnd() - y);
    d[s0 + i] += y * amp * Math.exp((-i / SR) * decay);
  }
};
const click = (t0, amp, f) => {
  const s0 = at(t0);
  const n = Math.floor(0.008 * SR);
  for (let i = 0; i < n && s0 + i < N; i++) d[s0 + i] += amp * (rnd() * 0.5 + Math.sin((TAU * f * i) / SR)) * Math.exp((-i / n) * 5);
};

// 0.2s: صمت ثم Sub-Bass 30Hz + انكسار زجاجي
tone(0.2, 2.2, 52, 30, 1.0, 1.5);
tone(0.2, 1.2, 30, 30, 0.8, 2.2);
noise(0.2, 0.1, 0.9, 40, 0.4);
for (let k = 0; k < 14; k++) {
  const t0 = 0.2 + Math.abs(rnd()) * 0.32;
  tone(t0, 0.22, 4200 + Math.abs(rnd()) * 5200, 3200, 0.16, 18);
  click(t0, 0.18, 6500);
}

// 3.0 → 6.2: Granular Reverse Riser
for (let g = 0; g < 190; g++) {
  const k = g / 190;
  const t0 = 3.0 + k * 3.18;
  const f = 180 + 3800 * k * k;
  const dur = 0.05 + 0.04 * (1 - k);
  tone(t0, dur, f, f * 1.2, 0.06 + 0.3 * k * k, 28);
  if (g % 2 === 0) noise(t0, dur, 0.05 + 0.2 * k, 30, 0.1 + 0.8 * k);
}
tone(3.0, 3.2, 70, 900, 0.12, -0.5, 'saw');

// 6.2: Glitch (Stutter Crackle)
for (let k = 0; k < 9; k++) {
  const t0 = 6.2 + k * 0.045 + Math.abs(rnd()) * 0.01;
  tone(t0, 0.04, 400 + Math.abs(rnd()) * 3000, 300, 0.4, 20, 'sq');
  noise(t0, 0.03, 0.3, 40, 0.9);
}

// 7.8: Mechanical Servo Slide + UI Data Clicks
tone(7.8, 1.1, 160, 820, 0.28, 2.0, 'saw');
noise(7.8, 1.1, 0.22, 3.0, 0.15, 0.45);
tone(7.8, 1.2, 44, 38, 0.8, 2.2);
for (let k = 0; k < 90; k++) {
  const t0 = 7.95 + k * (2.6 / 90) + Math.abs(rnd()) * 0.01;
  click(t0, 0.3 * (1 - k / 130), 3200 + Math.abs(rnd()) * 3200);
}

// 10.8–12.7 / 19.4–21.3: ضغطات كتابة ليزرية (URL typing)
for (const base of [10.8, 19.4]) for (let k = 0; k < 30; k++) click(base + k * 0.063, 0.4, 2600 + (k % 3) * 700);

// 12.5 → 16.2: Ambient Harmonic Pad (Am9) بيتصاعد
{
  const notes = [110, 164.81, 261.63, 392, 493.88];
  for (let i = at(12.5); i < at(16.6); i++) {
    const t = i / SR;
    const swell = ss(12.5, 16.0, t) * (1 - ss(16.1, 16.6, t));
    let v = 0;
    notes.forEach((f, k) => {
      v += Math.sin(TAU * f * t + 0.6 * Math.sin(TAU * 0.2 * t + k)) * (0.5 - k * 0.07);
    });
    d[i] += v * swell * 0.5;
  }
}

// 16.4: Fluid Whoosh ثم Crystal Chime (17.0)
noise(16.3, 0.9, 0.5, 2.5, 0.05, 0.6);
for (const [f, a] of [[1046.5, 0.55], [1568, 0.4], [2093, 0.3], [3136, 0.16]]) tone(17.0, 2.4, f, f, a, 2.1);

// 22.5: تقليب صفحات رقمية + نغمة دافئة
for (let k = 0; k < 9; k++) {
  const t0 = 22.5 + k * 0.058;
  noise(t0, 0.07, 0.45, 38, 0.9, 0.2);
  tone(t0, 0.06, 2800, 900, 0.1, 30);
}
for (let i = at(22.5); i < at(25.2); i++) {
  const t = i / SR;
  const env = ss(22.5, 23.2, t) * (1 - ss(24.6, 25.2, t));
  d[i] += (Math.sin(TAU * 220 * t) * 0.5 + Math.sin(TAU * 277.18 * t) * 0.35 + Math.sin(TAU * 329.63 * t) * 0.3) * env * 0.1;
}

// 24.5 → 26.6: Riser تاني قبل الإغلاق
for (let g = 0; g < 80; g++) {
  const k = g / 80;
  tone(24.5 + k * 2.1, 0.05, 250 + 2600 * k * k, 250 + 3000 * k * k, 0.05 + 0.22 * k * k, 30);
}

// 26.65: Heavy Metallic Lock Snap + Sub-Bass
noise(26.65, 0.05, 1.0, 100, 0.9);
for (const [f, a, dc] of [[310, 1.0, 26], [870, 0.8, 32], [2340, 0.6, 46], [3720, 0.4, 58]]) tone(26.65, 0.5, f, f, a, dc);
tone(26.65, 1.8, 90, 36, 1.0, 2.2);

// 30.0: Pop-Notification Ping
tone(30.0, 0.9, 1318.5, 1318.5, 0.6, 7);
tone(30.1, 1.0, 1760, 1760, 0.55, 6);
tone(30.1, 0.6, 2637, 2637, 0.2, 9);

// أطراف نظيفة: Fade 2ms + صمت آخر 150ms (لوب)
const f2 = Math.floor(0.002 * SR);
for (let i = 0; i < f2; i++) d[i] *= i / f2;
const tail = at(34.85);
for (let i = tail; i < N; i++) d[i] *= Math.max(0, 1 - (i - tail) / (0.1 * SR));

let peak = 1e-9;
for (const v of d) peak = Math.max(peak, Math.abs(v));
const buf = Buffer.alloc(44 + N * 2);
buf.write('RIFF', 0);
buf.writeUInt32LE(36 + N * 2, 4);
buf.write('WAVEfmt ', 8);
buf.writeUInt32LE(16, 16);
buf.writeUInt16LE(1, 20);
buf.writeUInt16LE(1, 22);
buf.writeUInt32LE(SR, 24);
buf.writeUInt32LE(SR * 2, 28);
buf.writeUInt16LE(2, 32);
buf.writeUInt16LE(16, 34);
buf.write('data', 36);
buf.writeUInt32LE(N * 2, 40);
for (let i = 0; i < N; i++) buf.writeInt16LE(Math.round((d[i] / peak) * 0.92 * 32767), 44 + i * 2);
fs.writeFileSync(path.join(PUB, 'sfx_master_35s.wav'), buf);

const vo = path.join(PUB, 'vo_monzoma_digital_no_urls_35s.wav');
if (!fs.existsSync(vo)) {
  console.error('Missing voiceover: public/vo_monzoma_digital_no_urls_35s.wav');
  process.exit(1);
}
console.log('sfx_master_35s.wav generated (35.00s) + voiceover OK.');
