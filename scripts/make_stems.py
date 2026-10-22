# Lesson 28 SFX stems (numpy + ffmpeg). Cue times: src/utils/audioConfig.ts
import numpy as np, wave, subprocess
sr=44100; rng=np.random.default_rng(28)
def T(d): return np.arange(int(sr*d))/sr
def lp(x,a):
    y=np.zeros_like(x); s=0.0
    for i in range(len(x)): s+=a*(x[i]-s); y[i]=s
    return y
def hp(x,a=0.15): return x-lp(x,a)
def env(d,a=0.004,r=4): t=T(d); return np.minimum(1,t/a)*np.exp(-t*r)
def mix(dur,events):
    out=np.zeros(int(sr*dur))
    for t,x,g in events:
        i=int(t*sr)
        if i>=len(out): continue
        j=min(len(out),i+len(x)); out[i:j]+=x[:j-i]*g
    return out
def save(name,x):
    x=x/np.max(np.abs(x))*0.9
    w=wave.open(f'/tmp/{name}.wav','wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes((x*32767).astype(np.int16).tobytes()); w.close()
    subprocess.run(['ffmpeg','-v','error','-y','-i',f'/tmp/{name}.wav','-codec:a','libmp3lame','-b:a','160k',f'public/{name}.mp3'],check=True)
def bell(f,d=1.4,r=3.5): t=T(d); return sum(np.sin(2*np.pi*f*k*t)*a for k,a in [(1,1),(2.76,.3),(5.4,.12)])*env(d,0.003,r)
# fast electronic whoosh
d=0.9; t=T(d); n=lp(rng.standard_normal(len(t)),0.05+0.3*np.sin(np.pi*t/d)**2)*4; save('whoosh',n*np.sin(np.pi*t/d)**2)
# cash register "ka-ching": click + two bright bells
click=np.diff(rng.standard_normal(int(sr*0.03))*np.exp(-T(0.03)*120),prepend=0)
save('kaching',mix(1.4,[(0,click,0.9),(0.07,bell(2093,1.2,4),0.8),(0.16,bell(3136,1.1,4.5),0.7)]))
# heartbeat tick
t=T(0.35); beat=np.sin(2*np.pi*np.cumsum(70+60*np.exp(-t*30))/sr)*np.exp(-t*14)
save('tick',mix(0.7,[(0,beat,1.0),(0.14,beat,0.6),(0.01,click,0.5)]))
# ding for the Lift highlight
save('ding',mix(1.8,[(0,bell(1568,1.7,2.6),0.9),(0.0,bell(2349,1.2,3.4),0.45)]))
# fast mechanical keyboard
ev=[]
for k in range(90):
    tt=0.05+k*0.052+rng.random()*0.02
    c=np.diff(rng.standard_normal(int(sr*0.012))*np.exp(-T(0.012)*260),prepend=0)
    ev.append((tt,c,0.6+rng.random()*0.4))
save('keyboard_fast',mix(5.0,ev))
# chalk
d=2.6; t=T(d); n=hp(rng.standard_normal(len(t)),0.18); st=(0.55+0.45*np.abs(np.sin(2*np.pi*3.1*t)))*np.minimum(1,t/0.06)*np.minimum(1,(d-t)/0.25)
save('chalk_write',n*st*1.6)
# deep bass swoosh for the outro
t=T(3.0); f=38+90*np.exp(-t*2.2); sub=np.sin(2*np.pi*np.cumsum(f)/sr)*np.minimum(1,t/0.05)*np.exp(-t*0.9)
sw=lp(rng.standard_normal(len(t)),0.04)*5*np.sin(np.pi*np.minimum(1,t/1.2))**2*np.exp(-t*0.8)
save('bass_swoosh',sub+0.6*sw)
print('stems ok')
