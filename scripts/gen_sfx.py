# Synthesizes all sound effects (numpy -> wav -> mp3). No downloads. Silent after 295.0 s.
import json, subprocess, numpy as np, wave
SR=44100; TOTAL=300.0; END_SFX=294.95
rng=np.random.default_rng(5)
cues=json.load(open('scripts/cues_abs.json'))
buf=np.zeros(int(SR*TOTAL)+SR,dtype=np.float32)
def put(t,x,g=1.0):
    i=int(t*SR)
    if i<0 or i>=len(buf): return
    x=x[:len(buf)-i]; buf[i:i+len(x)]+=x*g
def env(n,a=0.005,r=0.1):
    e=np.ones(n); na=max(1,int(a*SR)); e[:na]=np.linspace(0,1,na)
    nr=min(n,int(r*SR)); e[-nr:]*=np.linspace(1,0,nr); return e
def sine(f,d,f2=None):
    n=int(d*SR); fr=np.linspace(f,f2 or f,n); ph=2*np.pi*np.cumsum(fr)/SR; return np.sin(ph)
def lp(x,k):  # simple moving-average low-pass
    return np.convolve(x,np.ones(k)/k,mode='same')
def whoosh(d=0.55):
    n=int(d*SR); noise=rng.standard_normal(n); out=np.zeros(n)
    for k,(a,b) in enumerate([(0.0,0.5)]):
        pass
    sweep=np.linspace(40,6,n).astype(int)
    y=np.zeros(n)
    for s in range(6,41,7):
        seg=lp(noise,s); w=np.exp(-((np.linspace(40,6,n)-s)**2)/18); y+=seg*w
    y=y/ (np.abs(y).max()+1e-9)
    return (y*np.sin(np.linspace(0,np.pi,n))**1.5).astype(np.float32)
def pop(): return (sine(620,0.14,380)*env(int(0.14*SR),0.002,0.12)).astype(np.float32)
def click(g=1): 
    n=int(0.05*SR); nz=rng.standard_normal(n)*np.exp(-np.linspace(0,9,n)); t=sine(1700,0.05)*np.exp(-np.linspace(0,8,n)); return ((0.6*nz+0.5*t)).astype(np.float32)
def tick(): return (click()*0.6)
def key():
    n=int(0.03*SR); nz=lp(rng.standard_normal(n),2)*np.exp(-np.linspace(0,10,n)); th=sine(170,0.03)*np.exp(-np.linspace(0,6,n)); return (0.8*nz+0.35*th).astype(np.float32)
def confirm():
    a=sine(660,0.12)*env(int(0.12*SR),0.005,0.05); b=sine(880,0.2)*env(int(0.2*SR),0.005,0.18); return np.concatenate([a,b]).astype(np.float32)*0.8
def error():
    n=int(0.32*SR); x=(np.sign(sine(150,0.32))*0.35+sine(150,0.32)*0.5)*env(n,0.01,0.25); return lp(x,6).astype(np.float32)
def ding():
    n=int(0.9*SR); t=np.arange(n)/SR; return (np.sin(2*np.pi*1318*t)*np.exp(-t*5)+0.4*np.sin(2*np.pi*2636*t)*np.exp(-t*8)).astype(np.float32)*0.8
GAIN={'whoosh':0.22,'trans':0.12,'pop':0.22,'click':0.30,'tick':0.18,'confirm':0.20,'error':0.18,'ding':0.20}
for c in cues:
    k=c['kind']; t=c['abs']
    if t>END_SFX: continue
    if k=='type':
        n=max(4,int(c['dur']*14)); ts=np.sort(rng.uniform(0,c['dur'],n))
        for tt in ts: put(t+tt,key(),rng.uniform(0.10,0.18))
    elif k=='whoosh': put(t,whoosh(0.6),GAIN[k])
    elif k=='trans': put(t,whoosh(0.35),GAIN[k])
    elif k=='pop': put(t,pop(),GAIN[k])
    elif k=='click': put(t,click(),GAIN[k])
    elif k=='tick': put(t,tick(),GAIN[k])
    elif k=='confirm': put(t,confirm(),GAIN[k])
    elif k=='error': put(t,error(),GAIN[k])
    elif k=='ding': put(t,ding(),GAIN[k])
buf=buf[:int(SR*TOTAL)]
buf[int(SR*295.0):]=0.0           # hard silence for the closing 5 s
buf=np.clip(buf,-0.6,0.6)
print('peak',float(np.abs(buf).max()),'rms_db',20*np.log10(np.sqrt((buf**2).mean())+1e-9))
pcm=(buf*32767).astype(np.int16)
with wave.open('/tmp/sfx.wav','wb') as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
subprocess.run(['ffmpeg','-y','-v','error','-i','/tmp/sfx.wav','-codec:a','libmp3lame','-b:a','96k','public/sfx_lesson_05.mp3'],check=True)
