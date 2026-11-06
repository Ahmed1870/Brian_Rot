#!/usr/bin/env node
/* Verifies required assets and synthesises all SFX + music into public/ (no deps). */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const pub = path.join(root, 'public');
const tl = JSON.parse(fs.readFileSync(path.join(root, 'src', 'timeline.json'), 'utf8'));

// ---- 1) asset checks (exit 1 on failure) ----
const need = [['public/voiceover_lesson_31.mp3', 100000], ['src/logoData.ts', 1000]];
let bad = false;
for (const [rel, min] of need) {
  const f = path.join(root, rel);
  if (!fs.existsSync(f) || fs.statSync(f).size < min) {
    console.error('MISSING/INVALID ASSET: ' + rel);
    bad = true;
  }
}
if (bad) process.exit(1);

// ---- 2) tiny synth toolkit ----
let seed = 12345;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296) * 2 - 1;
const SR = 44100;
const TAU = Math.PI * 2;
const buf = (sec, sr = SR) => new Float32Array(Math.floor(sec * sr));

function writeWav(file, data, sr = SR) {
  let peak = 0;
  for (const v of data) peak = Math.max(peak, Math.abs(v));
  const g = peak > 0.95 ? 0.95 / peak : 1;
  const out = Buffer.alloc(44 + data.length * 2);
  out.write('RIFF', 0); out.writeUInt32LE(36 + data.length * 2, 4); out.write('WAVE', 8);
  out.write('fmt ', 12); out.writeUInt32LE(16, 16); out.writeUInt16LE(1, 20); out.writeUInt16LE(1, 22);
  out.writeUInt32LE(sr, 24); out.writeUInt32LE(sr * 2, 28); out.writeUInt16LE(2, 32); out.writeUInt16LE(16, 34);
  out.write('data', 36); out.writeUInt32LE(data.length * 2, 40);
  for (let i = 0; i < data.length; i++) out.writeInt16LE(Math.round(Math.max(-1, Math.min(1, data[i] * g)) * 32767), 44 + i * 2);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, out);
}

// add a sine whose frequency sweeps f0->f1, with envelope fn(x in 0..1)
function addSweep(b, start, dur, f0, f1, amp, env, sr = SR) {
  let ph = 0;
  const n = Math.floor(dur * sr), s0 = Math.floor(start * sr);
  for (let i = 0; i < n && s0 + i < b.length; i++) {
    const x = i / n;
    ph += (TAU * (f0 + (f1 - f0) * x)) / sr;
    b[s0 + i] += Math.sin(ph) * amp * env(x);
  }
}
function addNoise(b, start, dur, amp, env, lp, sr = SR) {
  let y = 0;
  const n = Math.floor(dur * sr), s0 = Math.floor(start * sr);
  for (let i = 0; i < n && s0 + i < b.length; i++) {
    const x = i / n;
    const a = typeof lp === 'function' ? lp(x) : lp;
    y += a * (rnd() - y);
    b[s0 + i] += y * amp * env(x);
  }
}
const expDecay = (k) => (x) => Math.exp(-k * x);
const hann = (x) => Math.sin(Math.PI * x) ** 2;

// ---- 3) SFX ----
const typingBuf = (len, step) => {
  const b = buf(len + 0.3); let t = 0;
  while (t < len) {
    const f = 700 + Math.abs(rnd()) * 600;
    addNoise(b, t, 0.025, 1.4, expDecay(6), 0.5);
    addSweep(b, t, 0.04, f, f * 0.6, 0.35, expDecay(6));
    t += step + Math.abs(rnd()) * step * 1.2;
  }
  return b;
};
const sfx = {
  disconnect() { const b = buf(1.2); addSweep(b, 0, 0.9, 900, 90, 0.4, expDecay(2.5)); addNoise(b, 0.0, 0.5, 0.5, expDecay(4), (x) => 0.3 - 0.25 * x); [0.05, 0.2, 0.42].forEach((o) => addSweep(b, o, 0.05, 2400, 2400, 0.3, expDecay(8))); return b; },
  rattle() { const b = buf(1.6); for (let i = 0; i < 14; i++) { const o = i * 0.09 + Math.abs(rnd()) * 0.03; addNoise(b, o, 0.03, 1.0, expDecay(6), 0.6); addSweep(b, o, 0.06, 2600 + rnd() * 600, 1800, 0.22, expDecay(8)); } return b; },
  lock() { const b = buf(0.8); addNoise(b, 0, 0.02, 1.3, expDecay(5), 0.8); addSweep(b, 0, 0.12, 1800, 900, 0.5, expDecay(9)); addSweep(b, 0.12, 0.35, 420, 210, 0.7, expDecay(7)); addSweep(b, 0.12, 0.4, 2093, 2093, 0.18, expDecay(6)); return b; },
  laser() { const b = buf(2.0); addSweep(b, 0, 1.8, 400, 2400, 0.3, hann); addSweep(b, 0, 1.8, 800, 4800, 0.1, hann); addNoise(b, 0, 1.8, 0.25, hann, 0.15); return b; },
  resonance() { const b = buf(1.8); [392, 523.25, 659.25, 783.99].forEach((f, i) => { addSweep(b, i * 0.03, 1.6, f, f, 0.22, expDecay(2.2)); addSweep(b, i * 0.03, 1.6, f * 2.003, f * 2.003, 0.06, expDecay(3)); }); return b; },
  typingshort() { return typingBuf(4.6, 0.065); },
  impact() { const b = buf(1.0); addSweep(b, 0, 0.5, 180, 40, 1.0, expDecay(6)); addNoise(b, 0, 0.12, 1.2, expDecay(6), 0.4); addSweep(b, 0, 0.5, 1200, 300, 0.3, expDecay(9)); [880, 1320, 1760].forEach((f) => addSweep(b, 0.02, 0.6, f, f * 0.97, 0.08, expDecay(5))); return b; },
  denied() { const b = buf(0.9); [0, 0.22].forEach((o) => { addSweep(b, o, 0.18, 220, 220, 0.5, (x) => Math.sin(Math.PI * x)); addSweep(b, o, 0.18, 233, 233, 0.4, (x) => Math.sin(Math.PI * x)); addSweep(b, o, 0.18, 440, 440, 0.15, (x) => Math.sin(Math.PI * x)); }); addSweep(b, 0.5, 0.35, 160, 110, 0.5, expDecay(4)); return b; },
  speed() { const b = buf(1.0); addNoise(b, 0, 0.7, 1.2, hann, (x) => 0.05 + 0.5 * x); addSweep(b, 0, 0.7, 300, 3200, 0.2, hann); addSweep(b, 0.5, 0.35, 1568, 1568, 0.3, expDecay(5)); return b; },
  stamp() { const b = buf(0.9); addSweep(b, 0, 0.35, 120, 45, 1.0, expDecay(7)); addNoise(b, 0, 0.06, 1.2, expDecay(7), 0.5); addSweep(b, 0.2, 0.6, 1046.5, 1046.5, 0.25, expDecay(3.5)); addSweep(b, 0.25, 0.6, 1568, 1568, 0.2, expDecay(3.5)); return b; },
  sprout() { const b = buf(1.6); [0, 0.12, 0.24, 0.4, 0.55, 0.7].forEach((o, i) => addSweep(b, o, 0.25, 500 + i * 160, 700 + i * 200, 0.3, expDecay(5))); addNoise(b, 0, 1.2, 0.15, hann, 0.2); return b; },
  warn() { const b = buf(0.9); [0, 0.3].forEach((o) => { addSweep(b, o, 0.26, 622, 622, 0.35, (x) => Math.sin(Math.PI * x)); addSweep(b, o, 0.26, 466, 466, 0.3, (x) => Math.sin(Math.PI * x)); }); return b; },
  pop() { const b = buf(0.35); addSweep(b, 0, 0.2, 700, 220, 0.8, expDecay(8)); addNoise(b, 0, 0.015, 1, expDecay(5), 0.7); return b; },
  clocktick() { const b = buf(2.6); for (let i = 0; i < 9; i++) { const o = i * 0.28; addNoise(b, o, 0.012, 1.0, expDecay(6), 0.7); addSweep(b, o, 0.05, i % 2 ? 2400 : 2000, 1500, 0.3, expDecay(10)); } return b; },
  pulse() { const b = buf(0.8); addSweep(b, 0, 0.5, 500, 900, 0.4, expDecay(5)); addSweep(b, 0.05, 0.5, 1000, 1800, 0.12, expDecay(6)); return b; },
  crash() { const b = buf(1.4); addSweep(b, 0, 1.2, 700, 70, 0.55, expDecay(2.2)); addSweep(b, 0, 1.2, 740, 74, 0.35, expDecay(2.2)); addNoise(b, 0, 0.3, 0.9, expDecay(5), 0.3); return b; },
  whoosh() { const b = buf(1.1); addNoise(b, 0, 1.0, 1.6, hann, (x) => 0.04 + 0.4 * Math.sin(Math.PI * x)); return b; },
};
for (const [name, fn] of Object.entries(sfx)) writeWav(path.join(pub, 'sfx', name + '.wav'), fn());

// ---- 4) music (22.05 kHz mono) ----
const MSR = 22050;
const note = (n) => 440 * Math.pow(2, (n - 69) / 12);
function pad(b, start, len, midis, amp, sr, wrap) {
  const n = Math.floor(len * sr), s0 = Math.floor(start * sr);
  for (let i = 0; i < n; i++) {
    const x = i / n, e = hann(x);
    let v = 0;
    for (const m of midis) { const f = note(m); v += Math.sin(TAU * f * (i / sr)) + 0.4 * Math.sin(TAU * f * 2.003 * (i / sr)); }
    let idx = s0 + i;
    if (wrap) idx %= b.length; else if (idx >= b.length) break;
    b[idx] += (v / midis.length) * amp * e;
  }
}
function pluck(b, start, m, amp, sr, wrap) {
  const n = Math.floor(0.35 * sr), s0 = Math.floor(start * sr), f = note(m);
  for (let i = 0; i < n; i++) {
    const x = i / n;
    let idx = s0 + i;
    if (wrap) idx %= b.length; else if (idx >= b.length) break;
    b[idx] += Math.sin(TAU * f * (i / sr)) * amp * Math.exp(-6 * x);
  }
}
// ambient loop: 24 s, Am - F - C - G, pad + 8th-note pluck arpeggio @ 120 bpm
{
  const len = 24, b = buf(len, MSR);
  const chords = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]];
  chords.forEach((c, k) => {
    pad(b, k * 6 - 1, 8, c.map((m) => m - 12), 0.5, MSR, true);
    const arp = [c[0] + 12, c[1] + 12, c[2] + 12, c[1] + 12];
    for (let s = 0; s < 12; s++) pluck(b, k * 6 + s * 0.5, arp[s % 4], 0.28, MSR, true);
  });
  writeWav(path.join(pub, 'music', 'ambient.wav'), b, MSR);
}
// corporate outro: 30 s, C - G - Am - F warm pad + sparse bells
{
  const len = 30, b = buf(len, MSR);
  const chords = [[48, 55, 60, 64], [43, 50, 59, 62], [45, 52, 60, 64], [41, 48, 57, 60]];
  chords.forEach((c, k) => {
    pad(b, k * 7.5 - 0.5, 9, c, 0.5, MSR, false);
    pluck(b, k * 7.5 + 1.0, c[3] + 12, 0.25, MSR, false);
    pluck(b, k * 7.5 + 3.0, c[2] + 12, 0.2, MSR, false);
  });
  writeWav(path.join(pub, 'music', 'outro.wav'), b, MSR);
}

// ---- 5) sanity: every SFX kind used in the timeline exists ----
for (const s of tl.sfx) {
  if (!fs.existsSync(path.join(pub, 'sfx', s.kind + '.wav'))) { console.error('Unknown sfx kind: ' + s.kind); process.exit(1); }
}
console.log('generate-audio OK: ' + Object.keys(sfx).length + ' sfx + 2 music tracks, ' + tl.sfx.length + ' cues');
