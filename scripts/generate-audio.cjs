// يولّد المؤثر الصوتي الرئيسي (10 ثواني بالظبط) برمجيًا بدون أي مكتبات — بدون فويس أوفر.
// Ultra-Fast Ticking (200+ BPM) + Stutter Pulse + Cyber Sub-Bass + Boom عند 8.0s + Magnetic Pull + Snap للّوب.
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'public');
const SR = 44100;
const DUR = 10;
const N = SR * DUR;
const TAU = Math.PI * 2;
fs.mkdirSync(OUT, {recursive: true});

let seed = 424242;
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

// ---- 1) Ticks: معدل متصاعد + أكسنت كل 4 تكّات ----
const rate = (t) => {
  if (t < 3) return 9 + 15 * Math.pow(t / 3, 1.5);
  if (t < 7) return 24 + 40 * Math.pow((t - 3) / 4, 1.3);
  return 64 + 70 * (t - 7);
};
const addTick = (t0, amp, accent) => {
  const s0 = Math.floor(t0 * SR);
  const f = 1700 + 2600 * clamp(t0 / 7.5);
  const n = Math.floor(0.012 * SR);
  for (let i = 0; i < n && s0 + i < N; i++) {
    const e = Math.exp((-i / n) * 6);
    d[s0 + i] += amp * (rnd() * 0.55 + Math.sin((TAU * f * i) / SR)) * e;
  }
  if (accent) {
    const m = Math.floor(0.035 * SR);
    for (let i = 0; i < m && s0 + i < N; i++) d[s0 + i] += amp * 0.9 * Math.sin((TAU * 95 * i) / SR) * Math.exp((-i / m) * 4);
  }
};
{
  let ph = 0;
  let idx = 0;
  for (let i = 0; i < Math.floor(7.97 * SR); i++) {
    const t = i / SR;
    ph += rate(t) / SR;
    if (ph >= 1) {
      ph -= 1;
      idx++;
      addTick(t + 0.004, 0.5 + 0.25 * clamp(t / 7), idx % 4 === 0);
    }
  }
}

// ---- 2) Cyber Sub-Bass (بيكبر مع الشحن) ----
for (let i = 0; i < Math.floor(8.0 * SR); i++) {
  const t = i / SR;
  const amp = 0.1 + 0.35 * ss(0, 7, t);
  d[i] += Math.sin(TAU * 46 * t) * amp * (0.75 + 0.25 * Math.sin(TAU * rate(t) * 0.25 * t));
}

// ---- 3) Charge tone + Stutter Pulse (Pitch Shift Up) ----
{
  let ph = 0;
  for (let i = Math.floor(3 * SR); i < Math.floor(8.0 * SR); i++) {
    const t = i / SR;
    const k = (t - 3) / 5;
    const f = 90 * Math.pow(2, 4.6 * Math.pow(k, 1.4));
    ph += (TAU * f) / SR;
    const saw = ((ph / TAU) % 1) * 2 - 1;
    const tone = Math.sin(ph) * 0.7 + saw * 0.25;
    const g = 6 + 54 * Math.pow(k, 2.2);
    const gate = 0.5 + 0.5 * Math.sign(Math.sin(TAU * g * t));
    const depth = t < 5 ? 0.35 : t < 7 ? 0.6 : 1.0;
    const gated = 1 - depth + depth * gate;
    d[i] += tone * gated * (0.04 + 0.34 * Math.pow(k, 1.3));
  }
}

// ---- 4) Boom عند 8.0s: Sub-Bass + Sci-Fi Release ----
{
  let ph = 0;
  for (let i = 0; i < Math.floor(2.2 * SR); i++) {
    const t = i / SR;
    const idx = Math.floor(8.0 * SR) + i;
    if (idx >= N) break;
    ph += (TAU * (28 + 112 * Math.exp(-t * 5))) / SR;
    let v = Math.sin(ph) * 1.0 * Math.exp(-t * 1.5);
    v += Math.sin(TAU * 62 * t) * 0.4 * Math.exp(-t * 2.2);
    if (t < 0.22) v += rnd() * 0.9 * Math.exp(-t * 18);
    // Release: نزول Pitch + لمعان
    const fr = 2000 * Math.exp(-t * 2.4) + 180;
    v += Math.sin(TAU * fr * t) * 0.22 * Math.exp(-t * 1.6);
    if (t < 1.4) v += rnd() * 0.07 * Math.exp(-t * 2.5) * (1 + Math.sin(TAU * 18 * t));
    d[idx] += v;
  }
}

// ---- 5) Magnetic Pull (9.0 → 9.9) ثم Snap ----
{
  let ph = 0;
  let y = 0;
  for (let i = Math.floor(9.0 * SR); i < Math.floor(9.9 * SR); i++) {
    const t = i / SR;
    const k = (t - 9.0) / 0.9;
    ph += (TAU * (140 + 1500 * k * k)) / SR;
    y += (0.02 + 0.5 * k) * (rnd() - y);
    d[i] += (Math.sin(ph) * 0.28 + y * 0.9) * Math.pow(k, 1.6);
  }
  addTick(9.89, 0.95, true); // آخر تكّة = Snap، والتكّة الأولى للّوب عند 0.004
}

// ---- Fade قصير جدًا على الأطراف (لوب بدون طقطقة) ----
const fade = Math.floor(0.0015 * SR);
for (let i = 0; i < fade; i++) {
  d[i] *= i / fade;
  d[N - 1 - i] *= i / fade;
}

// ---- تطبيع وكتابة WAV 16-bit ----
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
fs.writeFileSync(path.join(OUT, 'sfx_hyper_10s.wav'), buf);
console.log('sfx_hyper_10s.wav generated (10.00s, no voiceover).');
