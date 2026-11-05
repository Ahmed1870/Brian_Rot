'use strict';
// Lesson 27 - generates every sound effect + the music beds procedurally (pure Node, no dependencies).
// Output: public/gen/*.wav   -- timing comes from src/timeline.json (same file the visuals read).
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PUB = path.join(ROOT, 'public');
const OUT = path.join(PUB, 'gen');
const TL = JSON.parse(fs.readFileSync(path.join(ROOT, 'src', 'timeline.json'), 'utf8'));

// ---- asset check (exit 1 => render fails early with a clear message) -------------------------------
if (!fs.existsSync(path.join(PUB, 'voiceover.mp3'))) {
  console.error('MISSING public/voiceover.mp3 - put the lesson voiceover there.');
  process.exit(1);
}
fs.mkdirSync(OUT, {recursive: true});

const SR = 44100;
const SRB = 22050; // music beds are band-limited, half rate keeps files small
const TAU = Math.PI * 2;

let seed = 1234567;
const rand = () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const noise = () => rand() * 2 - 1;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const prog = (t, a, b) => clamp((t - a) / (b - a));
const mix = (a, b, p) => a + (b - a) * p;

function writeWav(name, data, sr) {
  let peak = 0;
  for (let i = 0; i < data.length; i++) peak = Math.max(peak, Math.abs(data[i]));
  const g = peak > 0 ? 0.9 / peak : 1;
  const buf = Buffer.alloc(44 + data.length * 2);
  buf.write('RIFF', 0);
  buf.writeUInt32LE(36 + data.length * 2, 4);
  buf.write('WAVEfmt ', 8);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(sr, 24);
  buf.writeUInt32LE(sr * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write('data', 36);
  buf.writeUInt32LE(data.length * 2, 40);
  for (let i = 0; i < data.length; i++) buf.writeInt16LE(Math.round(clamp(data[i] * g, -1, 1) * 32767), 44 + i * 2);
  fs.writeFileSync(path.join(OUT, name), buf);
  console.log('  wrote', name, (buf.length / 1024).toFixed(0) + ' KB');
}

const mk = (sec, sr = SR) => new Float32Array(Math.floor(sec * sr));

// state-variable band-pass filter
function svf(x, f, q, sr, mode) {
  const out = new Float32Array(x.length);
  let low = 0;
  let band = 0;
  for (let i = 0; i < x.length; i++) {
    const fc = typeof f === 'function' ? f(i / sr) : f;
    const k = 2 * Math.sin((Math.PI * Math.min(fc, sr * 0.45)) / sr);
    low += k * band;
    const high = x[i] - low - q * band;
    band += k * high;
    out[i] = mode === 'low' ? low : mode === 'high' ? high : band;
  }
  return out;
}
const add = (dst, src, at, gain = 1) => {
  const s0 = Math.floor(at * SR);
  for (let i = 0; i < src.length && s0 + i < dst.length; i++) if (s0 + i >= 0) dst[s0 + i] += src[i] * gain;
};

// ---------------- building blocks ----------------
function click(len = 0.09, pitch = 1, gain = 1) {
  const n = Math.floor(len * SR);
  const o = new Float32Array(n);
  const nz = new Float32Array(n);
  for (let i = 0; i < n; i++) nz[i] = noise();
  const hp = svf(nz, 2800 * pitch, 0.9, SR, 'band');
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    o[i] = (hp[i] * Math.exp(-t * 520) * 1.4 + Math.sin(TAU * 520 * pitch * t) * Math.exp(-t * 90) * 0.45) * gain;
  }
  return o;
}
function key(gain = 1) {
  const n = Math.floor(0.09 * SR);
  const o = new Float32Array(n);
  const nz = new Float32Array(n);
  for (let i = 0; i < n; i++) nz[i] = noise();
  const bp = svf(nz, 2200 + rand() * 1400, 1.1, SR, 'band');
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    o[i] = (bp[i] * Math.exp(-t * 300) * 1.3 + Math.sin(TAU * (170 + rand() * 30) * t) * Math.exp(-t * 110) * 0.7) * gain;
  }
  return o;
}

// ---------------- SFX ----------------
const sfx = {};
const keysTrack = (dur, step) => () => {
  const o = mk(dur);
  for (let t = 0.02; t < dur - 0.15; t += step * (0.7 + rand() * 0.7)) add(o, key(0.5 + rand() * 0.6), t);
  return o;
};
sfx['typing_s.wav'] = keysTrack(2.6, 0.075);
sfx['typing_m.wav'] = keysTrack(3.4, 0.07);
sfx['whoosh.wav'] = () => {
  const n = 1.4 * SR;
  const nz = new Float32Array(n);
  for (let i = 0; i < n; i++) nz[i] = noise();
  const b = svf(nz, (t) => 260 * Math.pow(14, Math.sin(clamp(t / 1.4) * Math.PI) ** 0.9), 0.35, SR, 'band');
  for (let i = 0; i < n; i++) b[i] *= Math.pow(Math.sin(clamp(i / n) * Math.PI), 1.6) * 2.2;
  return b;
};
sfx['tick.wav'] = () => {
  const o = mk(0.22);
  for (let i = 0; i < o.length; i++) {
    const t = i / SR;
    o[i] = (Math.sin(TAU * 1400 * t) * 0.6 + Math.sin(TAU * 2100 * t) * 0.3) * Math.exp(-t * 38);
  }
  return o;
};
sfx['drop.wav'] = () => {
  const o = mk(0.5);
  for (let i = 0; i < o.length; i++) {
    const t = i / SR;
    o[i] = Math.sin(TAU * (320 + 900 * Math.exp(-t * 30)) * t) * Math.exp(-t * 14) * 0.8 + Math.sin(TAU * 90 * t) * Math.exp(-t * 20) * 0.5;
  }
  return o;
};
sfx['reject.wav'] = () => {
  const o = mk(0.75);
  for (let i = 0; i < o.length; i++) {
    const t = i / SR;
    const env = Math.min(1, t * 200) * Math.exp(-t * 6);
    o[i] = (Math.sign(Math.sin(TAU * 185 * t)) * 0.35 + Math.sin(TAU * 196 * t) * 0.35) * env * (t < 0.12 || t > 0.2 ? 1 : 0.3) + Math.sin(TAU * 70 * t) * Math.exp(-t * 18) * 0.6;
  }
  return o;
};
sfx['cash.wav'] = () => {
  const o = mk(1.6);
  add(o, click(0.08, 1.1, 1.0), 0);
  const bell = (f, at, g) => {
    for (let i = 0; i < 1.3 * SR; i++) {
      const t = i / SR;
      const idx = Math.floor(at * SR) + i;
      if (idx >= o.length) break;
      o[idx] += (Math.sin(TAU * f * t) + 0.5 * Math.sin(TAU * f * 2.76 * t) + 0.25 * Math.sin(TAU * f * 5.4 * t)) * Math.exp(-t * 4.2) * g;
    }
  };
  bell(2093, 0.08, 0.45);
  bell(3136, 0.2, 0.4);
  return o;
};
// system-catalog write: a burst of soft digital blips climbing in pitch
sfx['catalog.wav'] = () => {
  const o = mk(2.4);
  for (let k = 0; k < 22; k++) {
    const at = k * 0.09 + rand() * 0.03;
    const f = 700 + k * 55 + rand() * 120;
    const len = Math.floor(0.07 * SR);
    for (let i = 0; i < len; i++) {
      const idx = Math.floor(at * SR) + i;
      if (idx >= o.length) break;
      const t = i / SR;
      o[idx] += Math.sign(Math.sin(TAU * f * t)) * 0.18 * Math.exp(-t * 40) + Math.sin(TAU * f * 2 * t) * 0.12 * Math.exp(-t * 55);
    }
  }
  for (let i = 0; i < o.length; i++) {
    const t = i / SR;
    o[i] += Math.sin(TAU * (180 + 260 * prog(t, 0, 2.0)) * t) * 0.18 * Math.pow(Math.sin(clamp(t / 2.4) * Math.PI), 1.5);
  }
  return o;
};
sfx['shield.wav'] = () => {
  const o = mk(1.6);
  for (let i = 0; i < o.length; i++) {
    const t = i / SR;
    const env = Math.pow(prog(t, 0, 0.5), 2) * Math.exp(-Math.max(0, t - 0.5) * 2.2);
    o[i] = (Math.sin(TAU * (220 + 500 * prog(t, 0, 0.5)) * t) * 0.45 + Math.sin(TAU * 880 * t) * 0.18 * Math.exp(-Math.max(0, t - 0.5) * 6)) * env;
    if (t > 0.5) o[i] += Math.sin(TAU * 1760 * t) * 0.3 * Math.exp(-(t - 0.5) * 7) + Math.sin(TAU * 2349 * t) * 0.18 * Math.exp(-(t - 0.5) * 9);
  }
  return o;
};
sfx['undo.wav'] = () => {
  const dur = 1.3;
  const n = Math.floor(dur * SR);
  const nz = new Float32Array(n);
  for (let i = 0; i < n; i++) nz[i] = noise();
  const b = svf(nz, (t) => 4200 * Math.exp(-t * 2.6) + 300, 0.5, SR, 'band');
  const o = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    o[i] = b[i] * 1.4 * Math.exp(-t * 2.2) + Math.sin(TAU * (900 - 650 * prog(t, 0, 1)) * t) * 0.25 * Math.exp(-t * 3);
  }
  return o;
};
sfx['clone.wav'] = () => {
  const o = mk(2.6);
  for (let layer = 0; layer < 2; layer++) {
    const at = layer * 0.55;
    for (let i = 0; i < 1.4 * SR; i++) {
      const idx = Math.floor(at * SR) + i;
      if (idx >= o.length) break;
      const t = i / SR;
      const f = 320 * Math.pow(3.2, prog(t, 0, 1.2)) * (layer ? 1.5 : 1);
      o[idx] += (Math.sin(TAU * f * t) + 0.3 * Math.sin(TAU * f * 2 * t)) * Math.sin(clamp(t / 1.4) * Math.PI) * 0.35;
    }
  }
  for (let k = 0; k < 14; k++) {
    const at = 0.4 + rand() * 1.6;
    for (let i = 0; i < 0.1 * SR; i++) {
      const idx = Math.floor(at * SR) + i;
      if (idx < o.length) o[idx] += Math.sin(TAU * (1500 + rand() * 1500) * (i / SR)) * Math.exp(-(i / SR) * 45) * 0.22;
    }
  }
  return o;
};
sfx['disksnap.wav'] = () => {
  const o = mk(0.9);
  add(o, click(0.1, 0.8, 1.3), 0);
  for (let i = 0; i < o.length; i++) {
    const t = i / SR;
    o[i] += Math.sin(TAU * 110 * t) * Math.exp(-t * 14) * 0.9 + Math.sin(TAU * 1320 * t) * Math.exp(-t * 30) * 0.3 + (t > 0.05 ? Math.sin(TAU * 2640 * t) * Math.exp(-(t - 0.05) * 9) * 0.12 : 0);
  }
  return o;
};
sfx['blocksnap.wav'] = () => {
  const o = mk(0.5);
  [0, 0.07, 0.14].forEach((at, k) => add(o, click(0.06, 0.9 + k * 0.25, 0.9), at));
  for (let i = 0; i < o.length; i++) {
    const t = i / SR;
    o[i] += Math.sin(TAU * 260 * t) * Math.exp(-t * 26) * 0.5;
  }
  return o;
};
sfx['lockengage.wav'] = () => {
  const o = mk(0.9);
  add(o, click(0.1, 0.9, 1.2), 0);
  add(o, click(0.1, 1.4, 1.5), 0.12);
  for (let i = 0; i < o.length; i++) {
    const t = i / SR;
    if (t > 0.1) o[i] += Math.sin(TAU * 1850 * t) * Math.exp(-(t - 0.1) * 18) * 0.35 + Math.sin(TAU * 210 * t) * Math.exp(-(t - 0.1) * 24) * 0.7;
  }
  return o;
};
sfx['laser.wav'] = () => {
  const o = mk(2.2);
  let ph = 0;
  for (let i = 0; i < o.length; i++) {
    const t = i / SR;
    const f = 500 + 2600 * prog(t, 0, 2.0) + 60 * Math.sin(TAU * 38 * t);
    ph += (TAU * f) / SR;
    o[i] = Math.sin(ph) * 0.35 * Math.min(1, t * 20) * Math.exp(-Math.max(0, t - 1.9) * 12) * (0.7 + 0.3 * Math.sin(TAU * 11 * t));
  }
  return o;
};
sfx['scan.wav'] = () => {
  const o = mk(1.4);
  let t = 0.02;
  while (t < 1.2) {
    const f = 900 + 3200 * prog(t, 0, 1.2);
    for (let i = 0; i < 0.035 * SR; i++) {
      const idx = Math.floor(t * SR) + i;
      if (idx < o.length) o[idx] += Math.sin(TAU * f * (i / SR)) * Math.exp(-(i / SR) * 90) * 0.4;
    }
    t += 0.05 * (1 - 0.5 * prog(t, 0, 1.2));
  }
  return o;
};
sfx['stamp.wav'] = () => {
  const o = mk(1.5);
  add(o, click(0.12, 0.6, 1.5), 0);
  for (let i = 0; i < o.length; i++) {
    const t = i / SR;
    o[i] += Math.sin(TAU * 80 * t) * Math.exp(-t * 11) * 1.1 + Math.sin(TAU * 160 * t) * Math.exp(-t * 18) * 0.5;
    if (t > 0.12) o[i] += (Math.sin(TAU * 1568 * t) + 0.4 * Math.sin(TAU * 3136 * t)) * Math.exp(-(t - 0.12) * 5) * 0.28;
  }
  return o;
};

sfx['pulse.wav'] = () => {
  const o = mk(0.9);
  for (let i = 0; i < o.length; i++) {
    const t = i / SR;
    o[i] = (Math.sin(TAU * 440 * t) * 0.5 + Math.sin(TAU * 659 * t) * 0.3) * Math.exp(-t * 5) * Math.min(1, t * 90) + Math.sin(TAU * 90 * t) * Math.exp(-t * 12) * 0.4;
  }
  return o;
};
sfx['crash.wav'] = () => {
  const o = mk(1.6);
  let t0 = 0;
  while (t0 < 0.7) {
    const len = 0.03 + rand() * 0.06, f = 150 + rand() * 800, cr = 3 + Math.floor(rand() * 5);
    for (let i = 0; i < len * SR; i++) {
      const idx = Math.floor(t0 * SR) + i;
      if (idx >= o.length) break;
      o[idx] += Math.round((Math.sign(Math.sin(TAU * f * (i / SR))) * 0.4 + noise() * 0.5) * cr) / cr * 0.7;
    }
    t0 += len;
  }
  for (let i = 0; i < o.length; i++) {
    const t = i / SR;
    o[i] = o[i] * Math.exp(-t * 2.2) + Math.sin(TAU * (60 - 25 * Math.min(1, t)) * t) * Math.exp(-t * 3.2) * 1.0;
  }
  return o;
};
sfx['rewrite.wav'] = () => {
  const o = mk(1.8);
  const notes = [392, 494, 587, 740, 880, 1175, 1480, 1760];
  notes.forEach((f, k) => {
    const at = k * 0.09;
    for (let i = 0; i < 0.5 * SR; i++) {
      const idx = Math.floor(at * SR) + i;
      if (idx >= o.length) break;
      const t = i / SR;
      o[idx] += (Math.sin(TAU * f * t) + 0.3 * Math.sin(TAU * f * 2 * t)) * Math.exp(-t * 7) * 0.35;
    }
  });
  for (let i = 0; i < o.length; i++) {
    const t = i / SR;
    if (t > 0.7) o[i] += Math.sin(TAU * 196 * t) * Math.exp(-(t - 0.7) * 3) * 0.3 + Math.sin(TAU * 392 * t) * Math.exp(-(t - 0.7) * 4) * 0.2;
  }
  return o;
};

sfx['press.wav'] = () => {
  const o = mk(0.7);
  for (let i = 0; i < o.length; i++) {
    const t = i / SR;
    o[i] = Math.sin(TAU * 70 * t) * Math.exp(-t * 12) * 0.9 + noise() * Math.exp(-t * 18) * 0.25 * (t > 0.04 ? 1 : 0.3);
  }
  add(o, click(0.08, 0.7, 1.0), 0);
  return o;
};
sfx['extract.wav'] = () => {
  const o = mk(1.2);
  [660, 880, 1320].forEach((f, k) => {
    for (let i = 0; i < 0.5 * SR; i++) {
      const idx = Math.floor(k * 0.14 * SR) + i;
      if (idx < o.length) o[idx] += (Math.sin(TAU * f * (i / SR)) + 0.3 * Math.sin(TAU * f * 2 * (i / SR))) * Math.exp(-(i / SR) * 8) * 0.35;
    }
  });
  return o;
};
sfx['leap.wav'] = () => {
  const o = mk(1.6);
  let ph = 0;
  for (let i = 0; i < o.length; i++) {
    const t = i / SR;
    const f = 300 + 900 * Math.sin(clamp(t / 1.2) * Math.PI * 0.5);
    ph += (TAU * f) / SR;
    o[i] = Math.sin(ph) * 0.3 * Math.sin(clamp(t / 1.3) * Math.PI) + (t > 1.1 ? Math.sin(TAU * 1568 * t) * Math.exp(-(t - 1.1) * 9) * 0.3 : 0);
  }
  return o;
};
sfx['stretch.wav'] = () => {
  const o = mk(1.8);
  let ph = 0;
  for (let i = 0; i < o.length; i++) {
    const t = i / SR;
    ph += (TAU * (200 + 380 * prog(t, 0, 1.6) + 18 * Math.sin(TAU * 9 * t))) / SR;
    o[i] = (Math.sin(ph) + 0.3 * Math.sin(2 * ph)) * 0.3 * Math.min(1, t * 30) * Math.exp(-Math.max(0, t - 1.6) * 10);
  }
  return o;
};
sfx['rise.wav'] = () => {
  const notes = [392, 440, 494, 587, 659, 784];
  const o = mk(3.2);
  notes.forEach((f, k) => {
    for (let i = 0; i < 0.8 * SR; i++) {
      const idx = Math.floor(k * 0.5 * SR) + i;
      if (idx < o.length) o[idx] += (Math.sin(TAU * f * (i / SR)) + 0.3 * Math.sin(TAU * f * 2 * (i / SR))) * Math.exp(-(i / SR) * 5) * 0.35;
    }
  });
  return o;
};

// ---------------- music beds ----------------
function bed() {
  const dur = TL.music.bedEnd;
  const n = Math.floor(dur * SRB);
  const o = new Float32Array(n);
  const pad = [[110, 0.5], [164.81, 0.4], [220, 0.34], [261.63, 0.26], [329.63, 0.14]];
  const ph = pad.map(() => rand() * TAU);
  for (let i = 0; i < n; i++) {
    const t = i / SRB;
    let s = 0;
    pad.forEach(([f, g], k) => (s += Math.sin(TAU * f * t + ph[k]) * g * (0.75 + 0.25 * Math.sin(TAU * (0.06 + k * 0.011) * t))));
    o[i] = s + Math.sin(TAU * 55 * t) * 0.35 * (0.7 + 0.3 * Math.sin(TAU * 0.5 * t));
  }
  const pent = [440, 523.25, 587.33, 659.25, 783.99, 880];
  for (let k = 0, t = 3; t < dur - 4; k++, t += 0.75) {
    const f = pent[(k * 2 + (k >> 3)) % pent.length];
    const s0 = Math.floor(t * SRB);
    const len = Math.floor(0.8 * SRB);
    const gain = 0.11 * prog(t, 3, 8);
    for (let i = 0; i < len && s0 + i < n; i++) o[s0 + i] += (Math.sin(TAU * f * (i / SRB)) + 0.25 * Math.sin(TAU * f * 2 * (i / SRB))) * Math.exp(-(i / SRB) * 5.5) * gain * 4;
  }
  const fi = Math.floor(2 * SRB);
  for (let i = 0; i < fi; i++) o[i] *= i / fi;
  const fo = Math.floor(3 * SRB);
  for (let i = 0; i < fo; i++) o[n - 1 - i] *= i / fo;
  return o;
}
function outro() {
  const dur = TL.duration - TL.music.outroStart;
  const n = Math.floor(dur * SRB);
  const o = new Float32Array(n);
  const chords = [[130.81, 164.81, 196, 261.63], [110, 130.81, 164.81, 220], [87.31, 130.81, 174.61, 220], [98, 146.83, 196, 246.94]];
  const seg = dur / 4;
  for (let i = 0; i < n; i++) {
    const t = i / SRB;
    const ci = Math.min(3, Math.floor(t / seg));
    const cj = Math.min(3, ci + 1);
    const x = prog(t, (ci + 1) * seg - 1.4, (ci + 1) * seg);
    let v = 0;
    for (let k = 0; k < 4; k++) {
      v += Math.sin(TAU * chords[ci][k] * t) * (1 - x) * 0.34 + Math.sin(TAU * chords[cj][k] * t) * x * 0.34;
      v += Math.sin(TAU * chords[ci][k] * 2 * t + k) * (1 - x) * 0.07;
    }
    o[i] = v;
  }
  for (let k = 0, t = 0.5; t < dur - 2; k++, t += 0.375) {
    const ci = Math.min(3, Math.floor(t / seg));
    const f = chords[ci][[0, 1, 2, 3, 2, 1, 3, 2][k % 8]] * 4;
    const s0 = Math.floor(t * SRB);
    const len = Math.floor(0.9 * SRB);
    for (let i = 0; i < len && s0 + i < n; i++) o[s0 + i] += (Math.sin(TAU * f * (i / SRB)) + 0.3 * Math.sin(TAU * f * 2 * (i / SRB))) * Math.exp(-(i / SRB) * 4.4) * 0.26;
  }
  const fi = Math.floor(1.5 * SRB);
  for (let i = 0; i < fi; i++) o[i] *= i / fi;
  const fo = Math.floor(6 * SRB);
  for (let i = 0; i < fo; i++) o[n - 1 - i] *= i / fo;
  return o;
}

console.log('generating audio into public/gen ...');
Object.keys(sfx).forEach((name) => writeWav(name, sfx[name](), SR));
writeWav('bed.wav', bed(), SRB);
writeWav('outro.wav', outro(), SRB);

const missing = TL.sfx.map((s) => s.file).filter((f) => !fs.existsSync(path.join(OUT, f)));
if (missing.length) {
  console.error('missing generated files:', missing.join(', '));
  process.exit(1);
}
console.log('audio ready.');
