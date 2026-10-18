// يولّد مؤثرات الصوت (SFX Master — 18 ثانية بالظبط) برمجيًا بدون أي مكتبات، ويتأكد من وجود الفويس أوفر.
// 1.0 UI Click + نغمة صعود · 5.0 Pull-back Whoosh · 6.0 Warning Alarm Sub · 9.3 Suction · 11.0 Metallic Lock · 11.9 Settle Chime · 12.7 Badge Pop
const fs = require('fs');
const path = require('path');

const PUB = path.join(__dirname, '..', 'public');
const SR = 44100;
const DUR = 18;
const N = SR * DUR;
const TAU = Math.PI * 2;
fs.mkdirSync(PUB, {recursive: true});

let seed = 18181818;
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

const tone = (t0, dur, f0, f1, amp, decay, attack = 0) => {
  let ph = 0;
  const s0 = at(t0);
  const n = Math.floor(dur * SR);
  for (let i = 0; i < n && s0 + i < N; i++) {
    const t = i / SR;
    ph += (TAU * (f0 + (f1 - f0) * (i / n))) / SR;
    const a = attack ? Math.min(1, t / attack) : 1;
    d[s0 + i] += Math.sin(ph) * amp * a * Math.exp(-t * decay);
  }
};
const noise = (t0, dur, amp, decay, lpA, lpB = lpA, shape = 'exp') => {
  let y = 0;
  const s0 = at(t0);
  const n = Math.floor(dur * SR);
  for (let i = 0; i < n && s0 + i < N; i++) {
    const k = i / n;
    y += (lpA + (lpB - lpA) * k) * (rnd() - y);
    const env = shape === 'bell' ? Math.pow(Math.sin(Math.PI * k), 1.5) : Math.exp((-i / SR) * decay);
    d[s0 + i] += y * amp * env;
  }
};

// 1.0: نقرة زجاجية حادة + نغمة صعود إيجابية خفيفة
noise(1.0, 0.012, 0.9, 200, 0.9);
tone(1.0, 0.06, 3400, 2600, 0.5, 70);
tone(1.02, 0.7, 440, 880, 0.22, 4, 0.02);
tone(1.02, 0.7, 660, 1320, 0.16, 4.5, 0.02);
tone(1.12, 0.8, 1320, 1760, 0.08, 5);

// 5.0: Camera Pull-back Whoosh + دفعة ميكانيكية
noise(4.92, 1.0, 0.7, 0, 0.04, 0.7, 'bell');
tone(5.0, 0.8, 120, 40, 0.8, 4);
noise(5.0, 0.05, 0.6, 120, 0.5);

// 5.3–6.6: تكّات عدّاد الرقم الأحمر
for (let k = 0; k < 40; k++) {
  const t0 = 5.4 + (k / 40) * 1.2;
  noise(t0, 0.01, 0.12 + 0.1 * (k / 40), 250, 0.9);
  tone(t0, 0.012, 2400 + k * 40, 2400 + k * 40, 0.07, 150);
}

// 6.0 → 9.3: Warning Alarm منخفض التردد (Sub) — نبضات 3 ثم بتخفت
for (let p = 0; p < 4; p++) {
  const t0 = 6.0 + p * 0.85;
  const a = 0.95 - p * 0.15;
  tone(t0, 0.55, 58, 52, a, 3.2, 0.015);
  tone(t0, 0.55, 116, 104, a * 0.35, 3.6, 0.015);
  tone(t0 + 0.0, 0.5, 220, 200, a * 0.08, 4, 0.01);
}
// قاع منخفض ثابت بيحافظ على التوتر في الصمت (7.25 → 9.5)
for (let i = at(6.5); i < at(9.4); i++) {
  const t = i / SR;
  d[i] += Math.sin(TAU * 41 * t) * 0.16 * ss(6.5, 7.4, t) * (1 - ss(9.0, 9.4, t)) * (0.7 + 0.3 * Math.sin(TAU * 1.2 * t));
}

// 9.3: Suction — الأحمر بينسحب لحلقة التركيز
noise(9.25, 0.6, 0.55, 0, 0.03, 0.6, 'bell');
tone(9.3, 0.6, 90, 700, 0.18, 2.5, 0.05);

// 9.6: نغمة مادّة الحلقة (Hum زجاجي)
tone(9.6, 1.4, 196, 196, 0.1, 1.6, 0.08);
tone(9.6, 1.4, 294, 294, 0.06, 1.8, 0.08);

// 11.0: Heavy Metallic Lock + Sub thud (الإطار 330)
noise(11.0, 0.05, 1.0, 110, 0.9);
for (const [f, a, dc] of [[310, 1.0, 26], [870, 0.75, 32], [2340, 0.55, 46], [3720, 0.35, 58]]) tone(11.0, 0.5, f, f, a, dc);
tone(11.0, 1.4, 88, 38, 0.95, 2.4);

// 11.9: رنين استقرار ناعم (Emerald chime)
for (const [f, a] of [[523.25, 0.5], [783.99, 0.4], [1046.5, 0.3], [1568, 0.14]]) tone(11.9, 2.6, f, f, a, 1.7, 0.004);
tone(11.9, 1.6, 65.4, 65.4, 0.5, 1.6, 0.01);

// 12.7: Badge Pop ناعم
tone(12.7, 0.25, 520, 1400, 0.4, 16);
noise(12.7, 0.01, 0.2, 200, 0.8);

// أطراف نظيفة
const f2 = Math.floor(0.002 * SR);
for (let i = 0; i < f2; i++) d[i] *= i / f2;
const tail = at(17.2);
for (let i = tail; i < N; i++) d[i] *= Math.max(0, 1 - (i - tail) / (0.8 * SR));

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
fs.writeFileSync(path.join(PUB, 'sfx_master_18s.wav'), buf);

const vo = path.join(PUB, 'vo_brand_voiceover_18s_final.wav');
if (!fs.existsSync(vo)) {
  console.error('Missing voiceover: public/vo_brand_voiceover_18s_final.wav');
  process.exit(1);
}
console.log('sfx_master_18s.wav generated (18.00s) + voiceover OK.');
