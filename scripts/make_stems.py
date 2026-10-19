# Sound stems for the Average Trap reel (numpy + ffmpeg). Fired on frames listed in src/utils/audioConfig.ts.
import numpy as np, wave, subprocess
sr=44100; rng=np.random.default_rng(60)
def T(d): return np.arange(int(sr*d))/sr
def env(d,a=0.004,r=4): t=T(d); return np.minimum(1,t/a)*np.exp(-t*r)
def mix(dur,events):
    out=np.zeros(int(sr*dur))
    for t,x,g in events:
        i=int(t*sr)
        if i>=len(out): continue
        j=min(len(out),i+len(x)); out[i:j]+=x[:j-i]*g
    return out
def sub(d=1.8,f0=70,f1=30,r=2.2): t=T(d); f=f1+(f0-f1)*np.exp(-t*9); return np.sin(2*np.pi*np.cumsum(f)/sr)*np.exp(-t*r)
def click(): return np.diff(rng.standard_normal(int(sr*0.02))*np.exp(-T(0.02)*200),prepend=0)*0.9
def swell(d,rise=True,k=4.0):
    m=int(sr*d); t=np.linspace(0,1,m); x=rng.standard_normal(m); y=np.zeros(m); a=0.0
    for q in range(m):
        al=0.01+0.3*(t[q] if rise else 1-t[q]); a+=al*(x[q]-a); y[q]=a
    return y*((t**2.2) if rise else ((1-t)**1.2))*k
def whistle(d,f0=400,f1=3200): t=T(d); f=f0+(f1-f0)*(t/d)**2; return np.sin(2*np.pi*np.cumsum(f)/sr)*(t/d)**1.5*0.5
def bell(f,d=3.0,r=1.5): t=T(d); return sum(np.sin(2*np.pi*f*k*t)*a for k,a in [(1,1),(2.76,.35),(5.4,.15)])*env(d,0.003,r)
def clang(): t=T(1.1); return sum(np.sin(2*np.pi*f*t)*a for f,a in [(520,1),(1310,.7),(2230,.5),(3470,.3)])*np.exp(-t*6)
def ping(f=1760): t=T(0.9); return (np.sin(2*np.pi*f*t)+np.sin(2*np.pi*f*1.5*t)*0.6)*env(0.9,0.002,5)
def servo(d=0.9):
    t=T(d); f=160+620*np.sin(np.pi*t/d); return (np.sign(np.sin(2*np.pi*np.cumsum(f)/sr))*0.22+rng.standard_normal(len(t))*0.1)*np.sin(np.pi*t/d)**1.4
def save(name,x):
    x=x/np.max(np.abs(x))*0.9
    w=wave.open(f'/tmp/{name}.wav','wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes((x*32767).astype(np.int16).tobytes()); w.close()
    subprocess.run(['ffmpeg','-v','error','-y','-i',f'/tmp/{name}.wav','-codec:a','libmp3lame','-b:a','192k',f'public/{name}.mp3'],check=True)
save('sub_bass',mix(3.0,[(0,sub(1.8,80,30),1.0),(0,click(),0.8),(0,swell(0.9,False),0.4)]))
save('impact',mix(4.0,[(0,swell(0.7,True,3.0),0.0),(0,sub(2.2,60,28,1.6),1.0),(0,click(),0.9),(0.02,swell(0.8,False),0.5),(0.2,whistle(1.6),0.5)]))
save('servo_slide',mix(3.0,[(0,servo(0.9),0.9),(0.1,click(),0.6),(0.9,ping(1320),0.5),(0.95,ping(990),0.35)]))
save('emerald_chime',mix(5.0,[(0,swell(0.8,True,3.0),0.5),(0.7,bell(432,4.0,1.1),0.8),(0.75,bell(648,3.0,1.4),0.45),(0.8,bell(864,2.4,1.8),0.3)]))
save('metallic_lock',mix(2.5,[(0,clang(),1.0),(0,sub(1.2,120,45),0.8),(0,click(),0.8),(0.5,click(),0.5)]))
save('ping',mix(4.0,[(0,ping(1760),0.8),(0.35,ping(2349),0.6),(1.6,ping(1568),0.5),(2.4,ping(1976),0.4)]))
print('stems ok')
