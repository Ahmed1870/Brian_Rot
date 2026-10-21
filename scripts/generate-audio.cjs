// يولّد المؤثرات الصوتية للدرس (SFX Master — 210 ثانية) برمجيًا: صوت طباشير + مسح السبورة + نقرات + نغمة ختام.
// الأوقات بتتقرا من src/timeline.json (نفس الملف اللي الصورة بتتحكم منه). وبيتأكد من وجود الفويس أوفر.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PUB = path.join(ROOT, 'public');
const TL = JSON.parse(fs.readFileSync(path.join(ROOT, 'src', 'timeline.json'), 'utf8'));
const SR = 44100;
const DUR = 210;
const N = SR * DUR;
const TAU = Math.PI * 2;
fs.mkdirSync(PUB, {recursive: true});

let seed = 26262626;
const rnd = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return (seed / 4294967296) * 2 - 1;
};
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const d = new Float32Array(N);
const at = (t) => Math.floor(t * SR);

// صوت كتابة طباشير: ضوضاء محدودة التردد (مفلترة) بتتقطّع على إيقاع حركة اليد (خدش ناعم)
const chalk = (t0, dur, vol = 0.22) => {
  const s0 = at(t0);
  const n = Math.floor(dur * SR);
  let lp1 = 0;
  let lp2 = 0;
  let strokePhase = rnd() * 10;
  for (let i = 0; i < n && s0 + i < N; i++) {
    const t = i / SR;
    const raw = rnd();
    lp1 += 0.55 * (raw - lp1);
    lp2 += 0.08 * (raw - lp2);
    const hp = lp1 - lp2; // band-pass تقريبي (2–6kHz)
    // حركة اليد: سرعة بتتغير (5–9Hz) وبتتقطّع بين الضربات
    const hand = 0.5 + 0.5 * Math.sin(TAU * (6 + 1.5 * Math.sin(t * 1.3)) * t + strokePhase);
    const grain = 0.55 + 0.45 * Math.abs(rnd());
    const env = Math.min(1, t / 0.04) * Math.min(1, (dur - t) / 0.08) * Math.pow(hand, 1.4) * grain;
    d[s0 + i] += hp * env * vol * 3.2;
  }
};
const tap = (t0, vol = 0.35) => {
  const s0 = at(t0);
  const n = Math.floor(0.045 * SR);
  for (let i = 0; i < n && s0 + i < N; i++) {
    const e = Math.exp((-i / n) * 6);
    d[s0 + i] += (rnd() * 0.5 + Math.sin((TAU * 1700 * i) / SR) * 0.6 + Math.sin((TAU * 220 * i) / SR) * 0.8) * e * vol;
  }
};
// مسح السبورة بالممسحة: 3 تمريرات (ذهاب/إياب/ذهاب) ضوضاء ناعمة منخفضة التردد
const erase = (t0) => {
  for (let pass = 0; pass < 3; pass++) {
    const s0 = at(t0 + pass * 0.3);
    const n = Math.floor(0.3 * SR);
    let y = 0;
    for (let i = 0; i < n && s0 + i < N; i++) {
      const k = i / n;
      y += 0.09 * (rnd() - y);
      const env = Math.sin(Math.PI * k) * (0.8 + 0.2 * Math.sin(TAU * 11 * k));
      d[s0 + i] += y * env * 0.9;
    }
  }
};
const tone = (t0, dur, f, amp, decay) => {
  const s0 = at(t0);
  const n = Math.floor(dur * SR);
  for (let i = 0; i < n && s0 + i < N; i++) {
    const t = i / SR;
    d[s0 + i] += Math.sin(TAU * f * t) * amp * Math.exp(-t * decay) * Math.min(1, t / 0.006);
  }
};

for (const [t, dur, v] of TL.chalk) chalk(t, dur, v ?? 0.22);
for (const t of TL.tap) tap(t);
for (const t of TL.erase) erase(t);
// نغمة ختام خفيفة متناسقة (Cmaj9 ناعم)
for (const [f, a] of [[523.25, 0.34], [659.25, 0.28], [783.99, 0.24], [987.77, 0.16], [1046.5, 0.12]]) tone(TL.chime, 5.5, f, a, 0.75);
tone(TL.chime, 5.5, 130.81, 0.3, 0.7);
// تلاشي آخر ثانيتين
const fo = at(DUR - 2);
for (let i = fo; i < N; i++) d[i] *= clamp(1 - (i - fo) / (2 * SR));

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
for (let i = 0; i < N; i++) buf.writeInt16LE(Math.round((d[i] / peak) * 0.9 * 32767), 44 + i * 2);
fs.writeFileSync(path.join(PUB, 'sfx_chalk_210s.wav'), buf);

const need = ['vo_unit_economics_3m29.wav', 'board.jpg'];
const missing = need.filter((f) => !fs.existsSync(path.join(PUB, f)));
if (missing.length) {
  console.error('Missing files in public/: ' + missing.join(', '));
  process.exit(1);
}
console.log('sfx_chalk_210s.wav generated (210.00s) + voiceover + board OK.');
