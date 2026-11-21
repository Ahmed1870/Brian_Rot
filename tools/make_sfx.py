#!/usr/bin/env python3
"""يولّد المؤثرات الصوتية الخفيفة (WAV 44.1kHz mono) - بلا اعتماد على ملفات خارجية. يحتاج numpy."""
import wave, sys, os
import numpy as np
SR = 44100
out = sys.argv[1] if len(sys.argv) > 1 else 'public/sfx'
os.makedirs(out, exist_ok=True)
rng = np.random.default_rng(17)  # ثابت → نفس الملفات كل مرة

def save(name, x):
    x = x / (np.max(np.abs(x)) + 1e-9) * 0.8
    with wave.open(os.path.join(out, name + '.wav'), 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype('<i2').tobytes())

def t(d): return np.arange(int(SR * d)) / SR
def env(x, a, d):
    n = len(x); e = np.ones(n); na = max(1, int(SR * a))
    e[:na] = np.linspace(0, 1, na); e *= np.exp(-np.arange(n) / (SR * d)); return x * e

tt = t(0.05); save('click', env(np.sin(2*np.pi*1800*tt) * 0.5 + rng.standard_normal(len(tt)) * 0.5, 0.001, 0.012))
tt = t(0.02); save('type', env(np.sin(2*np.pi*2600*tt) + rng.standard_normal(len(tt)) * 0.3, 0.0005, 0.006))
tt = t(0.16); f = 620 - 300 * tt / 0.16; save('pop', env(np.sin(2*np.pi*np.cumsum(f)/SR), 0.004, 0.05))
tt = t(0.4); n = rng.standard_normal(len(tt)); n = np.convolve(n, np.ones(6)/6, mode='same')
save('swish', env(n, 0.03, 0.12))
tt = t(0.8); n = rng.standard_normal(len(tt)); k = np.convolve(n, np.ones(40)/40, mode='same')
sweep = np.sin(2*np.pi*np.cumsum(200 + 700 * (tt/0.8)**2)/SR) * 0.4
save('whoosh', env(k * 3 + sweep, 0.15, 0.3))
print('sfx ok ->', out)
