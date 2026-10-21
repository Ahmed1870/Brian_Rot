# Chalkboard SFX stems (numpy + ffmpeg). Cue times are in src/utils/audioConfig.ts.
import numpy as np, wave, subprocess
sr=44100; rng=np.random.default_rng(24)
def T(d): return np.arange(int(sr*d))/sr
def lp(x,a):
    y=np.zeros_like(x); s=0.0
    for i in range(len(x)): s+=a*(x[i]-s); y[i]=s
    return y
def hp(x,a=0.12): return x-lp(x,a)
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
# chalk on board: scratchy filtered noise with a stroke-rhythm envelope
d=2.6; t=T(d); n=hp(rng.standard_normal(len(t)),0.18)
stroke=(0.55+0.45*np.abs(np.sin(2*np.pi*3.1*t)))*np.minimum(1,t/0.06)*np.minimum(1,(d-t)/0.25)
save('chalk_write',n*stroke*1.6)
# click + sharp drag
t=T(0.8); click=np.diff(rng.standard_normal(int(sr*0.02))*np.exp(-T(0.02)*190),prepend=0)
drag=hp(rng.standard_normal(len(t)),0.25)*np.exp(-t*7)*np.minimum(1,t/0.01)
save('click_drag',mix(0.8,[(0,click,1.0),(0.03,drag,0.7)]))
# board erase: soft dusty swoosh
t=T(1.3); n=lp(rng.standard_normal(len(t)),0.12)*3.0; env=np.sin(np.pi*np.minimum(1,t/1.3))**1.5
save('board_erase',n*env)
# keyboard typing: irregular key clicks
ev=[]
for k in range(46):
    tt=0.1+k*0.11+rng.random()*0.05
    c=np.diff(rng.standard_normal(int(sr*0.012))*np.exp(-T(0.012)*260),prepend=0)
    body=np.sin(2*np.pi*(180+rng.random()*80)*T(0.03))*np.exp(-T(0.03)*120)*0.5
    ev.append((tt,c+np.pad(body,(0,max(0,len(c)-len(body))))[:len(c)] if len(body)<=len(c) else c,0.7+rng.random()*0.3))
save('keyboard',mix(5.4,ev))
# strike / arrow: quick chalk slash
t=T(0.9); sl=hp(rng.standard_normal(len(t)),0.2)*np.exp(-t*9)*np.minimum(1,t/0.01)
save('strike_arrow',mix(0.9,[(0,sl*1.4,1.0),(0.25,sl*0.9,0.7)]))
# calm ending tone: soft pad
d=5.0; t=T(d); pad=sum(np.sin(2*np.pi*f*t)*a for f,a in [(220,1),(330,.6),(440,.45),(554.4,.25)])
save('calm_end',pad*np.minimum(1,t/1.2)*np.minimum(1,(d-t)/1.8)*0.5)
print('stems ok')
