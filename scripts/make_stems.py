# Tactile SFX stems for the templates reel (numpy + ffmpeg). Frames are set in src/utils/audioConfig.ts.
import numpy as np, wave, subprocess
sr=44100; rng=np.random.default_rng(20)
def T(d): return np.arange(int(sr*d))/sr
def env(d,a=0.004,r=4): t=T(d); return np.minimum(1,t/a)*np.exp(-t*r)
def mix(dur,events):
    out=np.zeros(int(sr*dur))
    for t,x,g in events:
        i=int(t*sr)
        if i>=len(out): continue
        j=min(len(out),i+len(x)); out[i:j]+=x[:j-i]*g
    return out
def lp(x,a):
    y=np.zeros_like(x); s=0.0
    for i in range(len(x)): s+=a*(x[i]-s); y[i]=s
    return y
def paper(d=0.5,bright=0.5):
    x=rng.standard_normal(int(sr*d)); y=x-lp(x,0.15) if bright>0.3 else lp(x,0.25)
    t=T(d); return y*np.sin(np.pi*np.minimum(1,t/d))**1.5*np.exp(-t*3)*2.0
def sub(d=1.4,f0=80,f1=32,r=2.4): t=T(d); f=f1+(f0-f1)*np.exp(-t*9); return np.sin(2*np.pi*np.cumsum(f)/sr)*np.exp(-t*r)
def click(): return np.diff(rng.standard_normal(int(sr*0.02))*np.exp(-T(0.02)*200),prepend=0)*0.9
def servo(d=0.9):
    t=T(d); f=160+620*np.sin(np.pi*t/d); return (np.sign(np.sin(2*np.pi*np.cumsum(f)/sr))*0.22+rng.standard_normal(len(t))*0.1)*np.sin(np.pi*t/d)**1.4
def bell(f,d=1.6,r=3.0): t=T(d); return sum(np.sin(2*np.pi*f*k*t)*a for k,a in [(1,1),(2.76,.3)])*env(d,0.003,r)
def clang(): t=T(1.1); return sum(np.sin(2*np.pi*f*t)*a for f,a in [(520,1),(1310,.7),(2230,.5),(3470,.3)])*np.exp(-t*6)
def ping(f=1760): t=T(0.9); return (np.sin(2*np.pi*f*t)+np.sin(2*np.pi*f*1.5*t)*0.6)*env(0.9,0.002,5)
def save(name,x):
    x=x/np.max(np.abs(x))*0.9
    w=wave.open(f'/tmp/{name}.wav','wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes((x*32767).astype(np.int16).tobytes()); w.close()
    subprocess.run(['ffmpeg','-v','error','-y','-i',f'/tmp/{name}.wav','-codec:a','libmp3lame','-b:a','192k',f'public/{name}.mp3'],check=True)
save('paper_flip',mix(3.0,[(0,sub(1.2,70,34),0.8),(0,paper(0.5,0.6),0.7),(0.12,paper(0.35,0.9),0.6),(0.2,paper(0.3,0.9),0.5),(0.3,paper(0.3,0.9),0.5),(0.38,paper(0.35,0.9),0.6),(0.5,click(),0.7)]))
save('servo_slide',mix(2.5,[(0,servo(0.9),0.9),(0.1,click(),0.6),(0.65,bell(880,1.4),0.5),(0.7,bell(1320,1.2),0.3)]))
save('quick_card_swipe',mix(0.7,[(0,paper(0.28,0.9),0.9),(0.02,click(),0.8)]))
save('metallic_lock',mix(2.5,[(0,clang(),1.0),(0,sub(1.0,120,48),0.8),(0,click(),0.9),(0.45,click(),0.5)]))
save('ping',mix(2.0,[(0,ping(1760),0.8),(0.3,ping(2349),0.55)]))
print('stems ok')
