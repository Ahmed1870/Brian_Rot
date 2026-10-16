# Loop-safe SFX synthesiser -> public/sfx.wav (15s). Events wrap circularly so the tail feeds the first second.
import numpy as np, wave
sr=44100; n=sr*15; out=np.zeros(n); rng=np.random.default_rng(5)
def add(t,x,g=1.0):
    i=int(t*sr)%n
    idx=(i+np.arange(len(x)))%n
    np.add.at(out,idx,x*g)
def env(d,a=0.005,r=3): t=np.arange(int(sr*d))/sr; return np.minimum(1,t/a)*np.exp(-t*r)
def bell(f,d=2.2): t=np.arange(int(sr*d))/sr; return sum(np.sin(2*np.pi*f*k*t)*a for k,a in [(1,1),(2.76,.35),(5.4,.15)])*env(d,0.003,2.2)
def chime(base):
    x=np.zeros(int(sr*2.4))
    for k,(m,dt) in enumerate([(1,0),(1.25,.09),(1.5,.18),(2,.27),(2.5,.36)]):
        b=bell(base*m,2.0); i=int(dt*sr); x[i:i+len(b)]+=b[:len(x)-i]*0.6
    return x
def swell(d,rise=True):
    m=int(sr*d); t=np.linspace(0,1,m); x=rng.standard_normal(m); y=np.zeros(m); a=0.0
    for k in range(m):
        al=0.01+0.25*np.sin(np.pi*t[k]); a+=al*(x[k]-a); y[k]=a
    return y*np.sin(np.pi*t)**2*4
def flow(d=2.6):
    t=np.arange(int(sr*d))/sr; e=np.sin(np.pi*t/d)**2
    return sum(np.sin(2*np.pi*(f+30*np.sin(2*np.pi*0.7*t+f))*t)*a for f,a in [(220,.5),(330,.35),(440,.3),(660,.2)])*e*0.5
def riser(d): t=np.arange(int(sr*d))/sr; f=120+1400*(t/d)**2.2; return np.sin(2*np.pi*np.cumsum(f)/sr)*(t/d)**2*0.55
def boom(): t=np.arange(int(sr*1.8))/sr; f=28+60*np.exp(-t*8); return np.sin(2*np.pi*np.cumsum(f)/sr)*np.exp(-t*2.4)
def spark(d=1.0):
    x=np.zeros(int(sr*d))
    for k in range(30):
        i=int(rng.random()*0.85*sr); m=min(len(x)-i,1100); x[i:i+m]+=np.sin(2*np.pi*(3200+rng.random()*3500)*np.arange(m)/sr)*np.exp(-np.arange(m)/170)*0.35
    return x
# hook: crystal chime at 0 (wraps with the loop-end chime tail) + sparkles
add(0.0,chime(523),0.5); add(0.1,spark(),0.7); add(1.6,spark(),0.5); add(3.0,spark(),0.5)
# fluid ASMR: swell + harmonic flow while the sculpture melts (4.2-10s)
add(3.9,swell(2.4),0.18); add(5.0,chime(659),0.4); add(5.2,flow(),0.35); add(7.6,flow(),0.3); add(10.0,chime(784),0.4)
# fold-back: riser into the point, big-bang at 14.1s, final shimmer wraps into 0:00
add(12.6,riser(1.5),0.5); add(13.9,swell(1.2),0.25); add(14.1,boom(),0.9); add(14.1,spark(),0.9); add(14.25,chime(523),0.55)
tt=np.arange(n)/sr
out+=0.05*np.sin(2*np.pi*60*tt)+0.025*np.sin(2*np.pi*90*tt+1.0)*(0.6+0.4*np.sin(2*np.pi*tt/15*3))+0.012*np.sin(2*np.pi*120*tt)
out=out/np.max(np.abs(out))*0.85
w=wave.open('public/sfx.wav','wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes((out*32767).astype(np.int16).tobytes()); w.close(); print('sfx ok')
