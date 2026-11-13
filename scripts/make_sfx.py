import numpy as np, subprocess, wave, os, sys
SR=44100; rng=np.random.default_rng(7)
out=sys.argv[1] if len(sys.argv)>1 else 'public'
def T(d): return np.arange(int(SR*d))/SR
def hp(x,a=0.97):
    y=np.zeros_like(x); p=0; q=0
    for i,v in enumerate(x): y[i]=a*(y[i-1]+v-(x[i-1] if i else 0))
    return y
def norm(x,pk=0.8): return x/ (np.max(np.abs(x))+1e-9)*pk
def click():
    t=T(.09); n=hp(rng.standard_normal(len(t)))*np.exp(-t/.004)
    th=np.sin(2*np.pi*1500*t)*np.exp(-t/.012); return norm(.7*n+.5*th)
def key():
    t=T(.12); n=hp(rng.standard_normal(len(t)),.9)*np.exp(-t/.006)
    th=np.sin(2*np.pi*520*t*(1-.3*t))*np.exp(-t/.02)
    return norm(.6*n+.7*th,.7)
def tick():
    t=T(.04); return norm(hp(rng.standard_normal(len(t)))*np.exp(-t/.0025)+.3*np.sin(2*np.pi*2400*t)*np.exp(-t/.006),.5)
def pop():
    t=T(.22); f=900*np.exp(-t*9)+300
    return norm(np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t/.07),.7)
def whoosh():
    d=.7; t=T(d); n=rng.standard_normal(len(t)); y=np.zeros_like(n); s=0
    cut=0.02+0.35*np.sin(np.pi*t/d)**2
    for i in range(len(n)): s+=cut[i]*(n[i]-s); y[i]=s
    y2=np.zeros_like(y); s=0
    for i in range(len(y)): s+=cut[i]*(y[i]-s); y2[i]=s
    env=np.sin(np.pi*t/d)**1.5
    return norm(y2*env,.7)
def chime():
    t=T(1.4); y=0
    for f,a in [(880,1),(1318.5,.7),(1760,.5),(2637,.25)]: y=y+a*np.sin(2*np.pi*f*t)*np.exp(-t/(.5 if f<2000 else .3))
    y*=np.minimum(1,t/.004); return norm(y,.7)
for name,fn in dict(click=click,key=key,tick=tick,pop=pop,whoosh=whoosh,chime=chime).items():
    x=fn(); w=os.path.join('/tmp',f'sfx_{name}.wav')
    with wave.open(w,'wb') as f:
        f.setnchannels(1); f.setsampwidth(2); f.setframerate(SR); f.writeframes((x*32767).astype('<i2').tobytes())
    subprocess.run(['ffmpeg','-y','-loglevel','error','-i',w,'-codec:a','libmp3lame','-b:a','128k',os.path.join(out,f'sfx_{name}.mp3')],check=True)
print('done')
