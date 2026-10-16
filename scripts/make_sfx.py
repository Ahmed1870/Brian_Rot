# Loop-safe procedural SFX (35s) -> public/sfx.wav. Events wrap circularly, so the final ping feeds the first frame.
import numpy as np, wave
sr=44100; DUR=35; n=sr*DUR; out=np.zeros(n); rng=np.random.default_rng(2049)
def add(t,x,g=1.0):
    i=int(t*sr)%n; np.add.at(out,(i+np.arange(len(x)))%n,x*g)
def T(d): return np.arange(int(sr*d))/sr
def env(d,a=0.004,r=4): t=T(d); return np.minimum(1,t/a)*np.exp(-t*r)
def ping(f=1760,d=1.6): t=T(d); return (np.sin(2*np.pi*f*t)+0.4*np.sin(2*np.pi*f*2.01*t))*env(d,0.002,3)
def click(): return np.diff(rng.standard_normal(int(sr*0.02))*np.exp(-T(0.02)*220),prepend=0)*0.9
def boom(d=2.4): t=T(d); f=24+70*np.exp(-t*7); return np.sin(2*np.pi*np.cumsum(f)/sr)*np.exp(-t*1.8)
def crash(d=2.2):
    x=rng.standard_normal(int(sr*d)); y=np.zeros_like(x); a=0.0
    for k in range(len(x)): a+=0.45*(x[k]-a); y[k]=x[k]-a
    return y*np.exp(-T(d)*2.2)*0.6
def riser(d,f0=100,f1=2400,pw=2.2): t=T(d); f=f0+(f1-f0)*(t/d)**pw; return np.sin(2*np.pi*np.cumsum(f)/sr)*(t/d)**2*0.6
def sweep_down(d,f0=3000,f1=120): t=T(d); f=f1+(f0-f1)*np.exp(-t*3.2/d*2); return np.sin(2*np.pi*np.cumsum(f)/sr)*np.sin(np.pi*t/d)*0.5
def whoosh(d=1.2):
    m=int(sr*d); t=np.linspace(0,1,m); x=rng.standard_normal(m); y=np.zeros(m); a=0.0
    for k in range(m):
        a+=(0.015+0.3*np.sin(np.pi*t[k]))*(x[k]-a); y[k]=a
    return y*np.sin(np.pi*t)**2*4
def glitch(d=0.12):
    t=T(d); x=np.sign(np.sin(2*np.pi*(180+rng.random()*900)*t))*rng.random(len(t)); return x*np.exp(-t*20)*0.5
def thump(): t=T(0.4); return np.sin(2*np.pi*np.cumsum(55+60*np.exp(-t*30))/sr)*np.exp(-t*9)
def chime(f=880): return sum(ping(f*m,1.2)*a for m,a in [(1,.6),(1.5,.4),(2,.3)])
# --- rain bed (circular) ---
r=rng.standard_normal(n*2); y=np.zeros_like(r); a=0.0
for k in range(len(r)): a+=0.12*(r[k]-a); y[k]=a
rain=(r-y*1.0)[n:]*0.0+y[n:]
out+=rain*0.9*(0.5+0.5*np.sin(2*np.pi*np.arange(n)/sr/35*2+1))
# --- synth pad: frequencies are multiples of 1/35 Hz => loops exactly ---
tt=np.arange(n)/sr
for f,a,m in [(55,.06,1),(110,.04,2),(165,.03,3),(220,.025,2),(330,.018,4)]:
    out+=a*np.sin(2*np.pi*f*tt)*(0.55+0.45*np.sin(2*np.pi*m*tt/DUR+f))
# --- timeline ---
add(0.0,ping(),0.55); add(0.25,riser(1.0,200,3200),0.35)
add(1.3,sweep_down(2.2,2400,200),0.4)                      # scanline sweeping the sphere
for i in range(10): add(1.95+i*0.14,click(),0.55)          # SYSTEM: INITIALIZED typing
add(3.5,glitch(),0.8)
for i in range(8): add(4.5+i*0.12,click(),0.55); add(5.0,glitch(0.2),0.6)  # RAW DATA OVERLOAD
# phase 2: stress
for i in range(14): add(6.0+i*0.43,thump(),0.35+i*0.03)
for t in np.sort(rng.random(48)*6+6.0): add(t,glitch(rng.random()*0.15+0.05),0.55)
add(7.6,whoosh(),0.3); add(9.0,whoosh(),0.3)
for i in range(10): add(7.6+i*0.14,click(),0.45)           # LOST IN THE NOISE
# phase 3: I can fix that @12s
add(10.8,riser(1.2,80,2800,2.6),0.55)
add(12.0,boom(),1.0); add(12.0,crash(),0.8); add(12.0,chime(660),0.5); add(12.05,chime(990),0.4)
add(12.3,whoosh(1.6),0.5)
for i,t in enumerate([13.0,13.27,13.54]): add(t,ping(1100+i*220,0.5),0.5)
add(13.4,riser(1.2,300,2200),0.3)
for i in range(12): add(12.6+i*0.14,click(),0.4)           # TRANSFORMING CHAOS INTO CLARITY
for i,t in enumerate([18.4,18.95,19.5]): add(t,chime(660+i*220),0.45)   # DATA > INSIGHT > ACTION
# phase 4: fly-through + green metrics
add(22.2,whoosh(2.0),0.45); add(22.5,boom(1.2),0.55)
for i in range(6): add(25.9+i*0.37,chime(880+i*110),0.45); add(25.9+i*0.37,click(),0.6)
add(26.3,boom(1.4),0.5); add(26.4,chime(1320),0.5); add(27.8,whoosh(1.5),0.35)
for t in [22.9,23.1,23.3,23.5]: add(t,click(),0.5)
# phase 5: brand + loop collapse
add(30.0,sweep_down(1.6,3200,300),0.4); add(30.1,boom(1.6),0.5)
add(30.8,whoosh(),0.3)
for t in [31.4,31.65,31.9]: add(t,ping(1500+t*20,0.5),0.5)
add(32.4,chime(880),0.35)
add(33.6,riser(1.4,100,3000),0.5); add(34.2,whoosh(0.8),0.35)
add(35.0,ping(),0.55)                                      # wraps onto the opening ping: seamless loop
out=out/np.max(np.abs(out))*0.85
w=wave.open('public/sfx.wav','wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes((out*32767).astype(np.int16).tobytes()); w.close(); print('sfx ok')
