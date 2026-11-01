'use strict';
// Generates every sound effect + the music beds procedurally (pure Node, no dependencies).
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

sfx['whoosh.wav'] = () => {
  const n = 1.6 * SR;
  const nz = new Float32Array(n);
  for (let i = 0; i < n; i++) nz[i] = noise();
  const b = svf(nz, (t) => 260 * Math.pow(16, Math.sin(clamp(t / 1.6) * Math.PI) ** 0.9) , 0.35, SR, 'band');
  for (let i = 0; i < n; i++) b[i] *= Math.pow(Math.sin(clamp(i / n) * Math.PI), 1.6) * 2.2;
  return b;
};
sfx['warnclick.wav'] = () => {
  const o = mk(0.5);
  for (let i = 0; i < o.length; i++) {
    const t = i / SR;
    o[i] = Math.sin(TAU * 150 * t) * Math.exp(-t * 16) * 0.9 + (t < 0.004 ? noise() * 0.8 : 0) + (t > 0.05 && t < 0.14 ? Math.sin(TAU * 880 * t) * Math.exp(-(t - 0.05) * 40) * 0.3 : 0);
  }
  return o;
};
sfx['tick.wav'] = () => {
  const o = mk(0.22);
  for (let i = 0; i < o.length; i++) {
    const t = i / SR;
    o[i] = (Math.sin(TAU * 1400 * t) * 0.6 + Math.sin(TAU * 2100 * t) * 0.3) * Math.exp(-t * 38);
  }
  return o;
};
sfx['click.wav'] = () => click(0.12, 1, 1);
sfx['typing.wav'] = () => {
  const n = TL.cues.sc02.typeText.length;
  const dt = TL.cues.sc02.typeDt;
  const o = mk(n * dt + 1.0);
  for (let i = 0; i < n; i++) add(o, key(0.7 + rand() * 0.5), i * dt + (rand() - 0.5) * 0.012);
  add(o, key(1.3), n * dt + 0.36); // Enter
  return o;
};
sfx['scroll.wav'] = () => {
  const dur = TL.cues.sc02.scroll[1] - TL.cues.sc02.scroll[0] + 0.3;
  const o = mk(dur);
  // accelerating ratchet that stops abruptly (mirrors the visual "fast-stop" curve)
  const total = 340;
  let last = 0;
  const bz = (x) => {
    // cubic-bezier(0.4,0,0.9,0.75) solved numerically
    let lo = 0;
    let hi = 1;
    let s = x;
    for (let k = 0; k < 24; k++) {
      const v = 3 * (1 - s) * (1 - s) * s * 0.4 + 3 * (1 - s) * s * s * 0.9 + s * s * s;
      if (v < x) lo = s;
      else hi = s;
      s = (lo + hi) / 2;
    }
    return 3 * (1 - s) * (1 - s) * s * 0 + 3 * (1 - s) * s * s * 0.75 + s * s * s;
  };
  for (let i = 0; i < o.length; i++) {
    const t = i / SR;
    const p = bz(clamp(t / (dur - 0.3)));
    const c = Math.floor(p * total);
    if (c !== last && t < dur - 0.3) {
      last = c;
      add(o, click(0.04, 1.6, 0.22), t);
    }
  }
  const nz = new Float32Array(o.length);
  for (let i = 0; i < o.length; i++) nz[i] = noise() * 0.12 * prog(i / SR, 0, dur - 0.3) * (i / SR < dur - 0.3 ? 1 : 0);
  const air = svf(nz, 1800, 0.5, SR, 'band');
  for (let i = 0; i < o.length; i++) o[i] += air[i];
  return o;
};
sfx['impact.wav'] = () => {
  const n = 1.5 * SR;
  const o = new Float32Array(n);
  const nz = new Float32Array(n);
  for (let i = 0; i < n; i++) nz[i] = noise();
  const lp = svf(nz, 320, 0.7, SR, 'low');
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    o[i] = Math.sin(TAU * (48 + 40 * Math.exp(-t * 14)) * t) * Math.exp(-t * 3.4) * 1.0 + lp[i] * Math.exp(-t * 9) * 1.6;
  }
  return o;
};
sfx['glitch.wav'] = () => {
  const o = mk(0.95);
  let t0 = 0;
  while (t0 < 0.85) {
    const len = 0.04 + rand() * 0.07;
    const f = 180 + rand() * 900;
    const crush = 4 + Math.floor(rand() * 6);
    const g = 0.5 + rand() * 0.5;
    for (let i = 0; i < len * SR; i++) {
      const idx = Math.floor((t0 + 0) * SR) + i;
      if (idx >= o.length) break;
      const t = i / SR;
      let v = Math.sign(Math.sin(TAU * f * t)) * 0.4 + noise() * 0.5;
      v = Math.round(v * crush) / crush;
      o[idx] += v * g * Math.exp(-t * 6);
    }
    t0 += len + rand() * 0.05;
  }
  for (let i = 0; i < o.length; i++) {
    const t = i / SR;
    o[i] *= Math.exp(-t * 1.6);
    o[i] += Math.sin(TAU * 523 * t) * 0.18 * Math.exp(-t * 3) * (Math.sin(TAU * 22 * t) > 0 ? 1 : 0.2) + Math.sin(TAU * 554 * t) * 0.18 * Math.exp(-t * 3);
  }
  return o;
};
sfx['delete.wav'] = () => {
  const o = mk(0.45);
  add(o, click(0.1, 0.7, 1.2), 0);
  const nz = new Float32Array(o.length);
  for (let i = 0; i < nz.length; i++) nz[i] = noise();
  const sw = svf(nz, (t) => 5200 * Math.exp(-t * 7) + 300, 0.6, SR, 'band');
  for (let i = 0; i < o.length; i++) o[i] += sw[i] * Math.exp((-i / SR) * 7) * 0.8;
  return o;
};
sfx['dissolve.wav'] = () => {
  const dur = 2.6;
  const n = Math.floor(dur * SR);
  const o = new Float32Array(n);
  const nz = new Float32Array(n);
  for (let i = 0; i < n; i++) nz[i] = noise();
  const air = svf(nz, (t) => 1400 + 5200 * Math.min(1, t / dur), 0.7, SR, 'high');
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    o[i] = air[i] * 0.35 * Math.pow(Math.sin(clamp(t / dur) * Math.PI), 1.3);
  }
  for (let k = 0; k < 46; k++) {
    const at = Math.pow(rand(), 0.8) * (dur - 0.4);
    const f = 1800 + rand() * 4800;
    const ping = new Float32Array(Math.floor(0.12 * SR));
    for (let i = 0; i < ping.length; i++) ping[i] = Math.sin(TAU * f * (i / SR)) * Math.exp(-(i / SR) * 38) * 0.25;
    add(o, ping, at);
  }
  return o;
};
sfx['clicks.wav'] = () => {
  const dur = TL.cues.sc04.clicks[1] - TL.cues.sc04.clicks[0] + 0.6;
  const o = mk(dur);
  let t = 0;
  while (t < dur - 0.2) {
    const x = t / dur;
    const layers = 1 + (rand() < 0.45 + x * 0.4 ? 1 : 0);
    for (let l = 0; l < layers; l++) add(o, click(0.1, 0.8 + rand() * 0.9, 0.5 + rand() * 0.6), t + rand() * 0.03);
    t += 0.09 * (1 - 0.55 * x) + rand() * 0.12 * (1 - 0.6 * x);
  }
  return o;
};
sfx['error.wav'] = () => {
  const o = mk(1.5);
  const tone = (f, at, len) => {
    for (let i = 0; i < len * SR; i++) {
      const idx = Math.floor(at * SR) + i;
      if (idx >= o.length) break;
      const t = i / SR;
      const env = Math.min(1, t * 400) * Math.exp(-t * 5.5);
      o[idx] += (Math.sin(TAU * f * t) + 0.45 * Math.sin(TAU * f * 2.01 * t) + 0.2 * Math.sin(TAU * f * 3.02 * t)) * env * 0.5;
    }
  };
  tone(1046.5, 0, 0.5);
  tone(784, 0.22, 0.9);
  tone(523.25, 0.5, 0.9);
  for (let i = 0; i < 0.5 * SR; i++) o[i] += Math.sin(TAU * 70 * (i / SR)) * Math.exp(-(i / SR) * 10) * 0.7;
  return o;
};
sfx['shimmer.wav'] = () => {
  const dur = 4.8;
  const o = mk(dur);
  const chord = [293.66, 440, 587.33, 739.99, 880, 1174.66, 1479.98];
  for (let i = 0; i < o.length; i++) {
    const t = i / SR;
    const swell = Math.pow(prog(t, 0, 2.6), 2) * Math.exp(-Math.max(0, t - 2.8) * 1.3);
    let v = 0;
    chord.forEach((f, k) => {
      v += Math.sin(TAU * f * t + Math.sin(TAU * 5.2 * t + k) * 0.35) * (0.35 / (1 + k * 0.35));
      v += Math.sin(TAU * f * 1.004 * t) * (0.2 / (1 + k * 0.35));
    });
    o[i] = v * swell * 0.7;
  }
  const arp = [587.33, 739.99, 880, 1174.66, 1479.98, 1760, 2349.3];
  arp.forEach((f, k) => {
    const at = 1.2 + k * 0.2;
    const ping = new Float32Array(Math.floor(1.2 * SR));
    for (let i = 0; i < ping.length; i++) ping[i] = Math.sin(TAU * f * (i / SR)) * Math.exp(-(i / SR) * 3.2) * 0.32;
    add(o, ping, at);
  });
  const nz = new Float32Array(o.length);
  for (let i = 0; i < nz.length; i++) nz[i] = noise();
  const air = svf(nz, (t) => 2000 + 4000 * prog(t, 0, 2.8), 0.6, SR, 'high');
  for (let i = 0; i < o.length; i++) o[i] += air[i] * 0.18 * Math.pow(prog(i / SR, 0, 2.6), 2) * Math.exp(-Math.max(0, i / SR - 2.8) * 1.5);
  return o;
};
sfx['snap.wav'] = () => {
  const o = mk(0.9);
  add(o, click(0.08, 1.2, 1.4), 0);
  for (let i = 0; i < o.length; i++) {
    const t = i / SR;
    o[i] += Math.sin(TAU * 1250 * t) * Math.exp(-t * 55) * 0.5 + Math.sin(TAU * 310 * t) * Math.exp(-t * 28) * 0.8;
    if (t > 0.06) o[i] += Math.sin(TAU * 1760 * t) * Math.exp(-(t - 0.06) * 7) * 0.22 + Math.sin(TAU * 2349 * t) * Math.exp(-(t - 0.06) * 9) * 0.14;
  }
  return o;
};

// ---------------- music beds ----------------
function bed() {
  const dur = TL.music.bedEnd;
  const n = Math.floor(dur * SRB);
  const o = new Float32Array(n);
  const calm = [[73.42, 0.5], [110, 0.4], [146.83, 0.26], [174.61, 0.2], [261.63, 0.12], [329.63, 0.08]];
  const tens = [[73.42, 0.5], [77.78, 0.42], [110, 0.3], [116.54, 0.26], [233.08, 0.16], [246.94, 0.16], [349.23, 0.08]];
  const brig = [[146.83, 0.4], [220, 0.32], [293.66, 0.28], [369.99, 0.22], [440, 0.2], [587.33, 0.1]];
  const ph = {calm: calm.map(() => rand() * TAU), tens: tens.map(() => rand() * TAU), brig: brig.map(() => rand() * TAU)};
  const lowN = new Float32Array(n);
  let lp = 0;
  for (let i = 0; i < n; i++) {
    lp += 0.02 * (noise() - lp);
    lowN[i] = lp;
  }
  for (let i = 0; i < n; i++) {
    const t = i / SRB;
    const wCalm = t < 113 ? 1 : t < 118 ? 1 - prog(t, 113, 118) : t < 148 ? 0 : t < 150 ? 0.35 * prog(t, 148, 150) : 0.35 * (1 - prog(t, 154, 158));
    const wTens = prog(t, 113, 118) * (1 - prog(t, 148, 149.2));
    const wBright = prog(t, 154.5, 158);
    let v = 0;
    if (wCalm > 0) {
      let s = 0;
      calm.forEach(([f, g], k) => (s += Math.sin(TAU * f * t + ph.calm[k]) * g * (0.75 + 0.25 * Math.sin(TAU * (0.07 + k * 0.013) * t))));
      v += s * wCalm;
    }
    if (wTens > 0) {
      const st = prog(t, 118, 148);
      let s = 0;
      tens.forEach(([f, g], k) => (s += Math.sin(TAU * f * t + ph.tens[k]) * g * (0.7 + 0.3 * Math.sin(TAU * (0.2 + k * 0.05 + st * 0.6) * t))));
      s += lowN[i] * 5 * st;
      s += Math.sin(TAU * 36.7 * t) * (0.5 + 0.5 * Math.sin(TAU * (1.2 + st * 3.8) * t)) * 0.5 * st;
      v += s * wTens;
    }
    if (wBright > 0) {
      let s = 0;
      brig.forEach(([f, g], k) => (s += Math.sin(TAU * f * t + ph.brig[k]) * g * (0.8 + 0.2 * Math.sin(TAU * (0.11 + k * 0.02) * t))));
      v += s * wBright;
    }
    o[i] = v;
  }
  // soft digital ticks during the explanation scenes + plucked arpeggio in the resolution
  const addB = (src, at, gain) => {
    const s0 = Math.floor(at * SRB);
    for (let i = 0; i < src.length && s0 + i < n; i++) o[s0 + i] += src[i] * gain;
  };
  for (let t = 36; t < 113; t += 1.0) {
    const b = new Float32Array(Math.floor(0.12 * SRB));
    for (let i = 0; i < b.length; i++) b[i] = Math.sin(TAU * (1760 + ((Math.floor(t) * 7) % 5) * 220) * (i / SRB)) * Math.exp(-(i / SRB) * 45);
    addB(b, t, 0.1);
  }
  const pent = [587.33, 659.25, 739.99, 880, 987.77, 1108.73, 1318.51];
  for (let k = 0, t = 156; t < 194; k++, t += 0.5) {
    const f = pent[(k * 3 + (k >> 2)) % pent.length];
    const b = new Float32Array(Math.floor(0.9 * SRB));
    for (let i = 0; i < b.length; i++) b[i] = (Math.sin(TAU * f * (i / SRB)) + 0.3 * Math.sin(TAU * f * 2 * (i / SRB))) * Math.exp(-(i / SRB) * 4.5);
    addB(b, t, 0.22 * prog(t, 156, 160));
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
  const prog4 = [[146.83, 185, 220, 293.66], [123.47, 146.83, 185, 246.94], [98, 123.47, 146.83, 196], [110, 138.59, 164.81, 220]];
  const seg = dur / 4;
  for (let i = 0; i < n; i++) {
    const t = i / SRB;
    const ci = Math.min(3, Math.floor(t / seg));
    const cj = Math.min(3, ci + 1);
    const x = prog(t, (ci + 1) * seg - 1.5, (ci + 1) * seg);
    let v = 0;
    for (let k = 0; k < 4; k++) {
      v += Math.sin(TAU * prog4[ci][k] * t) * (1 - x) * 0.35 + Math.sin(TAU * prog4[cj][k] * t) * x * 0.35;
      v += Math.sin(TAU * prog4[ci][k] * 2 * t + k) * (1 - x) * 0.08 * (0.7 + 0.3 * Math.sin(TAU * 0.2 * t));
    }
    o[i] = v;
  }
  for (let k = 0, t = 1; t < dur - 2; k++, t += 0.5) {
    const ci = Math.min(3, Math.floor(t / seg));
    const f = prog4[ci][[0, 1, 2, 3, 2, 1][k % 6]] * 2;
    const s0 = Math.floor(t * SRB);
    const len = Math.floor(1.1 * SRB);
    for (let i = 0; i < len && s0 + i < n; i++) o[s0 + i] += (Math.sin(TAU * f * (i / SRB)) + 0.25 * Math.sin(TAU * f * 2 * (i / SRB))) * Math.exp(-(i / SRB) * 3.6) * 0.3;
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

// every file referenced by the timeline must exist
const missing = TL.sfx.map((s) => s.file).filter((f) => !fs.existsSync(path.join(OUT, f)));
if (missing.length) {
  console.error('missing generated files:', missing.join(', '));
  process.exit(1);
}
console.log('audio ready.');
