#!/usr/bin/env python3
"""Synthesizes the 3 interaction SFX (no downloads). Output: public/sfx_*.wav (44.1kHz mono 16-bit, low level)."""
import numpy as np, wave, os
SR = 44100
out = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public')
def save(name, x):
    x = np.clip(x, -1, 1)
    with wave.open(os.path.join(out, name), 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767 * 0.5).astype('<i2').tobytes())
def env(n, a, d): t = np.arange(n) / SR; return np.minimum(t / a, 1) * np.exp(-t / d)
rng = np.random.default_rng(16)
n = int(0.07 * SR); t = np.arange(n) / SR
save('sfx_click.wav', (np.sin(2*np.pi*1800*t) * 0.6 + rng.standard_normal(n) * 0.15) * env(n, 0.001, 0.012))
n = int(0.18 * SR); t = np.arange(n) / SR
save('sfx_pop.wav', np.sin(2*np.pi*(420 + 500 * np.exp(-t / 0.03)) * t) * env(n, 0.002, 0.05))
n = int(0.05 * SR); t = np.arange(n) / SR
save('sfx_key.wav', (np.sin(2*np.pi*1100*t) * 0.4 + rng.standard_normal(n) * 0.3) * env(n, 0.0008, 0.008))
