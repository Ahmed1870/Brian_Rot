"""Procedural SFX + music-bed generator for Ahmed / Manzooma - Lesson 05.
Run:  python3 scripts/generate_sfx.py   (needs numpy). Outputs 44.1kHz mono WAVs to public/sfx/."""
import numpy as np, wave, os
SR = 44100
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public', 'sfx')
os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(7)

def t(d): return np.arange(int(SR * d)) / SR
def lp(x, k): return np.convolve(x, np.ones(k) / k, mode='same')
def save(name, x, peak=0.85):
    x = x / (np.max(np.abs(x)) + 1e-9) * peak
    f = int(SR * 0.004); x[:f] *= np.linspace(0, 1, f); x[-f:] *= np.linspace(1, 0, f)
    with wave.open(os.path.join(OUT, name + '.wav'), 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype('<i2').tobytes())
def place(buf, start, sig, wrap=False):
    i = int(start * SR)
    for k in range(len(sig)):
        j = i + k
        if j >= len(buf):
            if not wrap: break
            j %= len(buf)
        buf[j] += sig[k]

def bass_drop():
    tt = t(1.8); f = 35 + 95 * np.exp(-tt * 3.2); ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-tt * 1.6) + lp(rng.standard_normal(len(tt)), 40) * np.exp(-tt * 9) * 1.5
def click():
    tt = t(0.07); return (np.sin(2 * np.pi * 2200 * tt) * 0.6 + rng.standard_normal(len(tt)) * 0.3) * np.exp(-tt * 70)
def ping():
    tt = t(0.9)
    return (np.sin(2*np.pi*1318*tt) + .5*np.sin(2*np.pi*1975*tt) + .2*np.sin(2*np.pi*2637*tt)) * np.exp(-tt * 5)
def slide():
    tt = t(0.7); f = 250 + 1400 * (tt / 0.7) ** 2; ph = 2 * np.pi * np.cumsum(f) / SR
    return (0.35 * np.sin(ph) + 0.65 * lp(rng.standard_normal(len(tt)), 6)) * np.sin(np.pi * tt / 0.7) ** 2
def typing():
    x = np.zeros(int(SR * 0.9)); c = click()
    for i in range(9): place(x, i * 0.09 + rng.uniform(0, 0.012), c * rng.uniform(.6, 1))
    return x
def alarm():
    tt = t(0.7); f = np.where((tt * 8).astype(int) % 2 == 0, 196.0, 147.0); ph = 2 * np.pi * np.cumsum(f) / SR
    return (np.sign(np.sin(ph)) * .35 + np.sin(ph) * .5) * np.exp(-tt * 2.2)
def success():
    x = np.zeros(int(SR * 1.2))
    for i, fr in enumerate([523.25, 659.25, 783.99, 1046.5]):
        tt = t(0.8); place(x, i * 0.1, (np.sin(2*np.pi*fr*tt) + .3*np.sin(4*np.pi*fr*tt)) * np.exp(-tt * 5))
    return x
def sting():
    tt = t(3.8); x = np.zeros(len(tt))
    for fr in [110, 164.8, 220, 261.6, 329.6, 440]:
        x += np.sin(2*np.pi*fr*tt) * (1 - np.exp(-tt * 40)) * np.exp(-tt * 1.1)
    d = bass_drop(); x[:len(d)] += 2.0 * d
    return x
def alert():
    x = np.zeros(int(SR * 0.6))
    for i in range(3):
        tt = t(0.12); place(x, i * 0.16, np.sin(2*np.pi*880*tt) * np.exp(-tt * 20) + .4 * np.sign(np.sin(2*np.pi*440*tt)) * np.exp(-tt * 25))
    return x
def unlock():
    x = np.zeros(int(SR * 0.9)); c = click(); place(x, 0.0, c * 1.2); place(x, 0.12, c * 0.9)
    tt = t(0.6); place(x, 0.25, (np.sin(2*np.pi*660*tt) + .5*np.sin(2*np.pi*990*tt)) * np.exp(-tt * 6))
    return x
def tick():
    x = np.zeros(int(SR * 2.0)); c = click()
    for i in range(8): place(x, i * 0.25 + rng.uniform(-0.03, 0.03), c * (0.9 if i % 2 else 0.6))
    return x
def shift():
    tt = t(0.9); f = 300 + 900 * (tt / 0.9); ph = 2*np.pi*np.cumsum(f)/SR
    return np.sin(ph) * np.sin(np.pi * tt / 0.9) ** 2 * .8
def pop():
    tt = t(0.25); f = 500 + 900 * np.exp(-tt * 18); ph = 2*np.pi*np.cumsum(f)/SR
    return np.sin(ph) * np.exp(-tt * 14)
def fail():
    tt = t(1.1); f = 520 - 330 * (tt / 1.1); ph = 2*np.pi*np.cumsum(f)/SR
    return (np.sin(ph) + .4*np.sign(np.sin(ph))) * np.exp(-tt * 2.2)
def rise():
    x = np.zeros(int(SR * 1.3))
    for i, fr in enumerate([392.0, 493.9, 587.3, 783.99]):
        tt = t(0.9); place(x, i * 0.12, (np.sin(2*np.pi*fr*tt) + .25*np.sin(4*np.pi*fr*tt)) * np.exp(-tt * 4))
    return x
def outro_track():
    dur = 30.0; n = int(SR * dur); x = np.zeros(n); bpm = 84; beat = 60 / bpm
    chords = [[261.6, 329.6, 392.0], [220.0, 261.6, 329.6], [174.6, 220.0, 261.6], [196.0, 246.9, 392.0]]
    for bar in range(int(dur / (4 * beat))):
        ch = chords[bar % 4]; pt = t(4 * beat)
        env = np.sin(np.pi * pt / pt[-1]) ** 1.5
        for fr in ch: place(x, bar * 4 * beat, np.sin(2*np.pi*fr*pt) * env * 0.12)
        for k, fr in enumerate(ch * 2):
            at = bar * 4 * beat + k * beat * 0.66; nt = t(0.5)
            place(x, at, np.sin(2*np.pi*fr*2*nt) * np.exp(-nt * 5) * 0.2)
    x[:int(SR*0.5)] *= np.linspace(0, 1, int(SR*0.5)); x[-int(SR*3):] *= np.linspace(1, 0, int(SR*3))
    return x
def laser():
    tt = t(0.9); f = 400 + 2600 * (tt / 0.9) ** 1.5; ph = 2*np.pi*np.cumsum(f)/SR
    return (np.sin(ph) * .6 + lp(rng.standard_normal(len(tt)), 3) * .25) * np.sin(np.pi * tt / 0.9) ** 1.3
def choke():
    tt = t(1.4); ph = 2*np.pi*np.cumsum(90 + 25*np.sin(tt*38))/SR
    gate = (np.sin(tt * 2*np.pi*7) > -0.2).astype(float)
    return (np.sign(np.sin(ph)) * .35 + np.sin(ph)) * gate * np.exp(-tt * 1.3)
def whoosh():
    tt = t(0.8); n = lp(rng.standard_normal(len(tt)), 12)
    return n * np.sin(np.pi * (tt / 0.8) ** 0.7) ** 2 * 1.8 + np.sin(2*np.pi*np.cumsum(200 + 1800*(tt/0.8)**2)/SR) * .2 * np.sin(np.pi*tt/0.8)
def buzz():
    tt = t(0.7); ph = 2*np.pi*np.cumsum(150 + 6*np.sin(tt*50))/SR
    return (np.sign(np.sin(ph)) * .4 + np.sin(ph)) * (0.6 + 0.4*np.sin(tt*2*np.pi*14)) * np.exp(-tt * 2.5)
def scan_slow():
    x = np.zeros(int(SR * 2.4)); c = click()
    for i in range(24): place(x, i * 0.1, c * (0.35 + 0.1 * (i % 3)))
    x += lp(rng.standard_normal(len(x)), 40) * 0.12
    return x
def laser_snap():
    tt = t(0.4); f = 3200 - 2600 * (tt / 0.4); ph = 2*np.pi*np.cumsum(f)/SR
    x = np.sin(ph) * np.exp(-tt * 9)
    d = ping(); x[:len(d)] += d * 0.7 if len(d) < len(x) else 0
    return x
def music():
    bpm = 104; beats = 32; beat = 60 / bpm; n = int(SR * beats * beat); x = np.zeros(n)
    kt = t(0.35); kick = np.sin(2*np.pi*np.cumsum(50 + 110*np.exp(-kt*28))/SR) * np.exp(-kt * 9)
    ht = t(0.05); hat = rng.standard_normal(len(ht)) * np.exp(-ht * 90) * 0.25
    notes = [55.0, 43.65, 49.0, 41.2]
    for b in range(beats):
        place(x, b * beat, kick, True)
        place(x, (b + .5) * beat, hat, True)
    for e in range(beats * 2):
        fr = notes[(e // 16) % 4] * (2 if e % 4 == 3 else 1); bt = t(beat / 2)
        place(x, e * beat / 2, np.sin(2*np.pi*fr*bt) * np.exp(-bt * 6) * 0.55, True)
    for bar in range(beats // 4):
        root = [220.0, 174.6, 196.0, 164.8][(bar // 2) % 4]; pt = t(4 * beat)
        pad = sum(np.sin(2*np.pi*root*m*pt) for m in (1, 1.2, 1.5)) * np.sin(np.pi * pt / pt[-1]) ** 2 * 0.07
        place(x, bar * 4 * beat, pad, True)
    return x

for name, fn in [('bass_drop', bass_drop), ('click', click), ('ping', ping), ('slide', slide), ('typing', typing),
                 ('alarm', alarm), ('tick', tick), ('laser', laser), ('choke', choke), ('whoosh', whoosh), ('buzz', buzz), ('scan_slow', scan_slow), ('laser_snap', laser_snap), ('shift', shift), ('pop', pop), ('fail', fail), ('rise', rise), ('alert', alert), ('unlock', unlock), ('success', success), ('outro_sting', sting)]:
    save(name, fn())
save('music_loop', music(), peak=0.8)
save('outro_track', outro_track(), peak=0.8)
print('SFX done ->', os.path.abspath(OUT))
