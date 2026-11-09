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

def error():
    t=T(.5); f=140*np.ones_like(t); y=np.sign(np.sin(2*np.pi*np.cumsum(f)/SR))*.5+np.sin(2*np.pi*np.cumsum(f*1.5)/SR)*.3
    env=np.exp(-t/.18)*np.minimum(1,t/.004); y=y*env
    # two short buzzes
    y2=np.zeros_like(y); y2[:len(y)]=y; gate=((t%.22)<.14).astype(float); return norm(y2*gate,.6)
def alert():
    t=T(.5); y=np.zeros_like(t)
    for k,(f,st) in enumerate([(880,0),(660,.18)]):
        m=t>=st; tt=np.where(m,t-st,0); y+=np.where(m,np.sin(2*np.pi*f*tt)*np.exp(-tt/.12),0)
    return norm(y,.6)
def scan():
    t=T(.9); f=500+1800*(t/.9)**2; y=np.sin(2*np.pi*np.cumsum(f)/SR)*np.sin(np.pi*t/.9)**2
    y+=.3*hp(rng.standard_normal(len(t)),.8)*np.sin(np.pi*t/.9)**2*.2; return norm(y,.55)
def shine():
    t=T(1.6); y=0
    for i,f in enumerate([1568,2093,2637,3136,3951]):
        st=i*.07; tt=np.clip(t-st,0,None); y=y+np.where(t>=st,np.sin(2*np.pi*f*tt)*np.exp(-tt/.5),0)*(1/(1+i*.3))
    return norm(y,.6)
def ambient():
    d=240; t=np.arange(int(SR*d))/SR; chords=[[110,164.8,220,261.6],[87.3,130.8,174.6,220],[130.8,196,261.6,329.6],[98,146.8,196,246.9]]
    y=np.zeros_like(t); seg=8.0
    for k,ch in enumerate(chords*8):
        a=int(k*seg*SR); b=min(len(t),int((k+1)*seg*SR+SR*1.5))
        if a>=len(t): break
        tt=t[a:b]-k*seg; env=np.minimum(1,tt/1.5)*np.clip((seg+1.5-tt)/1.5,0,1)
        for i,f in enumerate(ch):
            lfo=1+.003*np.sin(2*np.pi*.2*tt+i)
            y[a:b]+=env*(np.sin(2*np.pi*f*lfo*tt)+.3*np.sin(2*np.pi*2*f*tt))*(.5/(1+i*.2))
    beat=(np.sin(2*np.pi*t*(70/60)/2)>.99).astype(float)  # unused soft pulse placeholder
    y*=np.minimum(1,t/3)*np.clip((d-t)/6,0,1)
    return norm(y,.5)

for name,fn in dict(click=click,key=key,tick=tick,pop=pop,whoosh=whoosh,chime=chime,error=error,alert=alert,scan=scan,shine=shine,ambient=ambient).items():
    x=fn(); w=os.path.join('/tmp',f'sfx_{name}.wav')
    with wave.open(w,'wb') as f:
        f.setnchannels(1); f.setsampwidth(2); f.setframerate(SR); f.writeframes((x*32767).astype('<i2').tobytes())
    subprocess.run(['ffmpeg','-y','-loglevel','error','-i',w,'-codec:a','libmp3lame','-b:a','96k' if name=='ambient' else '128k',os.path.join(out,f'sfx_{name}.mp3')],check=True)
print('done')
