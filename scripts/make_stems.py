# Generates the four sound-design stems fired on frames 0 / 240 / 540 / 780 and encodes them to mp3 (needs numpy + ffmpeg).
import numpy as np, wave, subprocess, os
sr=44100; rng=np.random.default_rng(35)
def T(d): return np.arange(int(sr*d))/sr
def env(d,a=0.004,r=4): t=T(d); return np.minimum(1,t/a)*np.exp(-t*r)
def mix(dur,events):
    out=np.zeros(int(sr*dur))
    for t,x,g in events:
        i=int(t*sr)
        if i>=len(out): continue
        j=min(len(out),i+len(x)); out[i:j]+=x[:j-i]*g
    return out
def sub(d=1.8,f0=70,f1=30): t=T(d); f=f1+(f0-f1)*np.exp(-t*9); return np.sin(2*np.pi*np.cumsum(f)/sr)*np.exp(-t*2.2)
def click(): return np.diff(rng.standard_normal(int(sr*0.02))*np.exp(-T(0.02)*220),prepend=0)*0.9
def thump(): t=T(0.4); return np.sin(2*np.pi*np.cumsum(55+60*np.exp(-t*30))/sr)*np.exp(-t*9)
def swell(d,rise=True,k=4.0):
    m=int(sr*d); t=np.linspace(0,1,m); x=rng.standard_normal(m); y=np.zeros(m); a=0.0
    for q in range(m):
        al=0.01+0.3*(t[q] if rise else 1-t[q]); a+=al*(x[q]-a); y[q]=a
    e=(t**2.2) if rise else ((1-t)**1.2); return y*e*k
def riser(d,f0=100,f1=2600,pw=2.2): t=T(d); f=f0+(f1-f0)*(t/d)**pw; return np.sin(2*np.pi*np.cumsum(f)/sr)*(t/d)**2*0.55
def fall(d,f0=3000,f1=90): t=T(d); f=f1+(f0-f1)*np.exp(-t/d*3.2); return np.sin(2*np.pi*np.cumsum(f)/sr)*np.sin(np.pi*t/d)*0.5
def servo(d=0.9):
    t=T(d); f=180+700*np.sin(np.pi*t/d); w=np.sign(np.sin(2*np.pi*np.cumsum(f)/sr))*0.25
    n=rng.standard_normal(len(t))*0.12; return (w+n)*np.sin(np.pi*t/d)**1.5
def bell(f,d=1.6): t=T(d); return sum(np.sin(2*np.pi*f*k*t)*a for k,a in [(1,1),(2.76,.35),(5.4,.15)])*env(d,0.003,2.6)
def chime(f): return sum(bell(f*m,1.4)*a for m,a in [(1,.6),(1.5,.4),(2,.3)])
def bubble(f): t=T(0.12); return np.sin(2*np.pi*np.cumsum(f*(1+3*t/0.12))/sr)*np.exp(-t*30)
def clang(): t=T(0.9); return sum(np.sin(2*np.pi*f*t)*a for f,a in [(520,1),(1310,.7),(2230,.5),(3470,.3)])*np.exp(-t*7)
def ping2(f=1760): t=T(0.9); return (np.sin(2*np.pi*f*t)+np.sin(2*np.pi*f*1.5*t)*0.6)*env(0.9,0.002,5)
def tick(): t=T(0.08); return np.sin(2*np.pi*2400*t)*np.exp(-t*60)*0.5
def save(name,x):
    x=x/np.max(np.abs(x))*0.9
    wav=f'/tmp/{name}.wav'
    w=wave.open(wav,'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes((x*32767).astype(np.int16).tobytes()); w.close()
    subprocess.run(['ffmpeg','-v','error','-y','-i',wav,'-codec:a','libmp3lame','-b:a','192k',f'public/{name}.mp3'],check=True)
# frame 0: sub-bass 30Hz hit + reverse whoosh, word impulses, riser into the first portal (frame 212)
save('bass',mix(8.6,[(0,sub(),1.0),(0,swell(1.1,True),0.5),(0,click(),0.8),(1.33,thump(),0.5),(2.8,thump(),0.5),(3.33,thump(),0.4),(5.0,thump(),0.5),(5.67,thump(),0.4),
  (5.75,riser(1.35),0.7),(7.07,sub(1.4,90,36),0.9),(7.07,swell(1.2,False),0.4)]))
# frame 240: hydraulic servo slide + accelerating UI clicks, window portal blips, push-through servo at 506-546
ev=[(0,servo(0.9),0.9),(0.2,click(),0.6)]+[(1.0+i*0.33,click(),0.7) for i in range(3)]+[(3.7,servo(0.5),0.5),(3.75,click(),0.7)]
ev+=[(1.35+i*0.09,click(),0.45) for i in range(14)]+[(8.8,servo(1.2),0.8),(8.9,riser(1.3,150,2200),0.5),(10.0,swell(0.8,False),0.4)]
save('servo',mix(10.8,ev))
# frame 540: fluid whoosh + glass chime, bar growth bubbles, leak plugged, +17% chime, push-through into the seal
rb=[(0,swell(1.4,True,2.5),0.6),(0.05,swell(1.4,False,2.5),0.4),(0.1,chime(1320),0.55)]
rb+=[(1.35+i*0.19,bubble(500+rng.random()*700),0.5) for i in range(9)]+[(3.1,thump(),0.8),(3.1,chime(990),0.45),(3.5,thump(),0.6),(3.9,thump(),0.5),(4.2,chime(1760),0.6),(4.25,chime(2217),0.4)]
rb+=[(6.65,riser(1.35,180,2600),0.6),(7.95,sub(1.2,100,40),0.8),(7.95,swell(0.8,False),0.4)]
save('fluid',mix(8.7,rb))
# frame 780: metallic lock snap + notification ping, handle pop, CTA pop + pulse ticks every 24 frames, rewind sweep to the loop
pg=[(0,clang(),0.9),(0,sub(1.0,120,50),0.7),(0.12,ping2(1760),0.6),(0.3,ping2(2349),0.5),(0.6,click(),0.8),(1.73,ping2(1568),0.7),(1.73,thump(),0.6)]
pg+=[(1.73+0.8*k,tick(),0.5+0.1*(k%2)) for k in range(1,8)]+[(3.4,ping2(1976),0.4),(5.0,ping2(1976),0.4)]
pg+=[(7.87,fall(1.1,3200,90),0.8),(7.87,swell(1.1,False),0.4)]
save('ping',mix(9.0,pg))
print('stems ok')
