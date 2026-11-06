/* Generates every sound effect + music bed of Lesson 35 procedurally (no dependencies, no network).
   Output: public/sfx/*.wav   — fails (exit 1) if the voice-over is missing. */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "public", "sfx");
const VO = path.join(ROOT, "public", "voiceover.mp3");

if (!fs.existsSync(VO)) {
  console.error("[generate-audio] MISSING public/voiceover.mp3");
  process.exit(1);
}
fs.mkdirSync(OUT, { recursive: true });

let seed = 1337;
const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
const TAU = Math.PI * 2;

function write(name, data, sr) {
  const n = data.length;
  const buf = Buffer.alloc(44 + n * 2);
  buf.write("RIFF", 0);
  buf.writeUInt32LE(36 + n * 2, 4);
  buf.write("WAVEfmt ", 8);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(sr, 24);
  buf.writeUInt32LE(sr * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write("data", 36);
  buf.writeUInt32LE(n * 2, 40);
  let peak = 0;
  for (let i = 0; i < n; i++) peak = Math.max(peak, Math.abs(data[i]));
  const g = peak > 0.95 ? 0.95 / peak : 1;
  for (let i = 0; i < n; i++) buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, data[i] * g)) * 32767), 44 + i * 2);
  fs.writeFileSync(path.join(OUT, name + ".wav"), buf);
}

const SR = 44100;
const mk = (sec, sr = SR) => new Float32Array(Math.floor(sec * sr));
const env = (t, a, d) => (t < a ? t / a : Math.exp(-(t - a) / d));

function addTone(buf, sr, start, dur, f0, f1, amp, decay, wave = "sin") {
  const s0 = Math.floor(start * sr);
  const n = Math.floor(dur * sr);
  let ph = 0;
  for (let i = 0; i < n && s0 + i < buf.length; i++) {
    const t = i / sr;
    const f = f0 + (f1 - f0) * (t / dur);
    ph += (TAU * f) / sr;
    let v = Math.sin(ph);
    if (wave === "saw") v = ((ph / TAU) % 1) * 2 - 1;
    if (wave === "sq") v = Math.sin(ph) > 0 ? 1 : -1;
    buf[s0 + i] += v * amp * env(t, 0.004, decay);
  }
}
function addNoise(buf, sr, start, dur, amp, decay, lp = 0.5) {
  const s0 = Math.floor(start * sr);
  const n = Math.floor(dur * sr);
  let y = 0;
  for (let i = 0; i < n && s0 + i < buf.length; i++) {
    y += lp * ((rand() * 2 - 1) - y);
    buf[s0 + i] += y * amp * env(i / sr, 0.001, decay);
  }
}

// ── single sounds ──
(() => {
  const b = mk(0.12); addNoise(b, SR, 0, 0.06, 0.8, 0.012, 0.8); addTone(b, SR, 0, 0.1, 1700, 900, 0.5, 0.02); write("click", b, SR);
})();
(() => { const b = mk(0.22); addTone(b, SR, 0, 0.2, 988, 988, 0.7, 0.06); write("blip", b, SR); })();
(() => { const b = mk(0.25); addTone(b, SR, 0, 0.2, 320, 640, 0.7, 0.05); write("pop", b, SR); })();
(() => {
  const b = mk(1.4);
  addTone(b, SR, 0, 1.3, 1318, 1318, 0.55, 0.35); addTone(b, SR, 0, 1.3, 2637, 2637, 0.25, 0.18); addTone(b, SR, 0, 1.3, 3951, 3951, 0.1, 0.1);
  write("ding", b, SR);
})();
(() => { const b = mk(0.3); addNoise(b, SR, 0, 0.1, 0.9, 0.02, 0.9); addTone(b, SR, 0, 0.25, 220, 90, 0.7, 0.06); write("snap", b, SR); })();
(() => {
  const b = mk(1.1); let y = 0; const n = b.length;
  for (let i = 0; i < n; i++) {
    const t = i / SR, p = t / 1.1;
    const a = Math.sin(Math.PI * Math.pow(p, 0.8)) ** 1.5;
    const k = 0.02 + 0.5 * Math.sin(Math.PI * p) ** 2;
    y += k * ((rand() * 2 - 1) - y);
    b[i] = y * a * 1.6;
  }
  write("whoosh", b, SR);
})();
(() => { const b = mk(0.7); addTone(b, SR, 0, 0.6, 140, 45, 0.95, 0.12); addNoise(b, SR, 0, 0.05, 0.6, 0.01, 0.7); write("thud", b, SR); })();
(() => {
  const b = mk(1.5);
  [0, 0.45].forEach((s) => { addTone(b, SR, s, 0.4, 150, 148, 0.5, 0.2, "saw"); addTone(b, SR, s, 0.4, 158, 156, 0.5, 0.2, "saw"); addTone(b, SR, s, 0.4, 75, 75, 0.4, 0.2, "sq"); });
  write("buzz", b, SR);
})();
(() => {
  const b = mk(1.8);
  [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => { addTone(b, SR, i * 0.11, 1.2, f, f, 0.45, 0.28); addTone(b, SR, i * 0.11, 1.2, f * 2, f * 2, 0.12, 0.15); });
  write("success", b, SR);
})();
(() => {
  const b = mk(2); addTone(b, SR, 0, 1.6, 95, 38, 0.95, 0.18); addNoise(b, SR, 0, 0.08, 0.9, 0.015, 0.8); addNoise(b, SR, 0.02, 1.2, 0.2, 0.3, 0.12);
  write("stamp", b, SR);
})();
(() => {
  const b = mk(6.4); let t = 0.05;
  while (t < 6.3) {
    const f = 1500 + rand() * 1400;
    addNoise(b, SR, t, 0.03, 0.7, 0.007, 0.85); addTone(b, SR, t, 0.04, f, f * 0.6, 0.35, 0.008);
    t += 0.05 + rand() * 0.09 + (rand() < 0.08 ? 0.18 : 0);
  }
  write("typing", b, SR);
})();
(() => {
  // 9 "thunks" synchronised with the 9 rows entering the hash table (Scene 4) + soft memory rumble
  const b = mk(9);
  for (let n = 0; n < 9; n++) { const at = 0.7 + n * 0.9; addTone(b, SR, at, 0.25, 260 + n * 22, 130 + n * 10, 0.7, 0.05); addNoise(b, SR, at, 0.04, 0.4, 0.01, 0.6); }
  addNoise(b, SR, 0, 8.6, 0.05, 6, 0.04);
  write("hash", b, SR);
})();
(() => {
  const b = mk(5); const n = b.length; let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const f = 500 + 1300 * (t / 4.7) + 40 * Math.sin(t * 38);
    ph += (TAU * f) / SR;
    const a = Math.min(1, t / 0.15) * (1 - Math.max(0, (t - 4.5) / 0.5));
    b[i] = (Math.sin(ph) * 0.35 + Math.sin(ph * 2.01) * 0.1) * a * (0.7 + 0.3 * Math.sin(t * 20));
  }
  addNoise(b, SR, 0, 4.7, 0.05, 20, 0.5);
  write("laser", b, SR);
})();

// ── music beds (22.05 kHz) ──
const MR = 22050;
(() => {
  // seamless 8 s ambient loop
  const L = 8; const b = mk(L, MR); const n = b.length;
  for (let i = 0; i < n; i++) {
    const t = i / MR;
    const lfo = 0.65 + 0.35 * Math.sin(TAU * 0.25 * t);
    b[i] = (Math.sin(TAU * 110 * t) * 0.5 + Math.sin(TAU * 165 * t) * 0.32 + Math.sin(TAU * 220 * t) * 0.24 + Math.sin(TAU * 330 * t) * 0.1 * lfo) * lfo * 0.6;
  }
  [0, 2, 4, 6].forEach((s, k) => { const f = [440, 660, 554.37, 660][k]; addTone(b, MR, s + 0.3, 1.6, f, f, 0.18, 0.5); });
  write("ambient", b, MR);
})();
(() => {
  // 31.1 s motivating academic outro: Cmaj7 → Am7 → Fmaj7 → G (arpeggio plucks + warm pad)
  const L = 31.1; const b = mk(L, MR);
  const chords = [[261.63, 329.63, 392, 493.88], [220, 261.63, 329.63, 392], [174.61, 261.63, 329.63, 440], [196, 246.94, 293.66, 392]];
  const barLen = L / 4;
  chords.forEach((c, bi) => {
    c.forEach((f) => addTone(b, MR, bi * barLen, barLen + 0.8, f / 2, f / 2, 0.16, 6, "sin"));
    for (let k = 0; k < Math.floor(barLen / 0.25); k++) {
      const f = c[(k * 3 + (k >> 2)) % 4] * (k % 8 < 4 ? 2 : 4);
      addTone(b, MR, bi * barLen + k * 0.25, 0.5, f, f, 0.2, 0.16);
    }
  });
  write("outro", b, MR);
})();

console.log("[generate-audio] OK →", OUT);
