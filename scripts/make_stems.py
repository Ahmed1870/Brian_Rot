# Sound-design stems for the museum reel (numpy + ffmpeg). Fired on frames 0 / 90 / 150 / 330 / 510 (see src/utils/audioConfig.ts).
import numpy as np, wave, subprocess
sr=44100; rng=np.random.default_rng(24)
def T(d): return np.arange(int(sr*d))/sr
def env(d,a=0.004,r=4): t=T(d); return np.minimum(1,t/a)*np.exp(-t*r)
def mix(dur,events):
    out=np.zeros(int(sr*dur))
    for t,x,g in events:
        i=int(t*sr)
        if i>=len(out): continue
        j=min(len(out),i+len(x)); out[i:j]+=x[:j-i]*g
    return out
def swell(d,rise=True,k=4.0):
    m=int(sr*d); t=np.linspace(0,1,m); x=rng.standard_normal(m); y=np.zeros(m); a=0.0
    for q in range(m):
        al=0.01+0.3*(t[q] if rise else 1-t[q]); a+=al*(x[q]-a); y[q]=a
    return y*((t**2.2) if rise else ((1-t)**1.2))*k
def sub(d=1.8,f0=70,f1=30): t=T(d); f=f1+(f0-f1)*np.exp(-t*9); return np.sin(2*np.pi*np.cumsum(f)/sr)*np.exp(-t*2.2)
def bell(f,d=4.0,r=1.1): t=T(d); return sum(np.sin(2*np.pi*f*k*t)*a for k,a in [(1,1),(2,.4),(3,.18),(4.2,.08)])*env(d,0.004,r)
def clang(): t=T(1.1); return sum(np.sin(2*np.pi*f*t)*a for f,a in [(520,1),(1310,.7),(2230,.5),(3470,.3),(5120,.2)])*np.exp(-t*6)
def hp(x,a=0.92):
    y=np.zeros_like(x); p=0.0; q=0.0
    for i in range(len(x)): y[i]=a*(y[i-1]+x[i]-p) if i else x[0]; p=x[i]
    return y
def save(name,x):
    x=x/np.max(np.abs(x))*0.9
    w=wave.open(f'/tmp/{name}.wav','wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes((x*32767).astype(np.int16).tobytes()); w.close()
    subprocess.run(['ffmpeg','-v','error','-y','-i',f'/tmp/{name}.wav','-codec:a','libmp3lame','-b:a','192k',f'public/{name}.mp3'],check=True)
# frame 0: 28Hz sub drone - integer cycles over 24s, so the loop restarts phase-continuous
t=T(24); d=np.sin(2*np.pi*28*t)*(0.7+0.3*np.sin(2*np.pi*2*t/24+1))+0.25*np.sin(2*np.pi*56*t+0.4)+0.05*np.sin(2*np.pi*84*t)*(0.5+0.5*np.sin(2*np.pi*3*t/24))
save('drone_28hz',d)
# frame 90: glass stress fracture
ev=[(0,sub(1.2,90,38),0.7),(0,np.diff(rng.standard_normal(int(sr*0.03))*np.exp(-T(0.03)*120),prepend=0)*2,0.9)]
for f,g in [(3100,1),(4700,.8),(6900,.6),(2300,.7)]: ev.append((0.01,np.sin(2*np.pi*f*T(0.9))*np.exp(-T(0.9)*9),0.35*g))
for tt in np.sort(rng.random(34)*2.4+0.1): ev.append((tt,np.sin(2*np.pi*(2500+rng.random()*5000)*T(0.12))*np.exp(-T(0.12)*40)*0.5,0.6))
save('glass_fracture',mix(4.0,ev))
# frame 150: pneumatic servo slide + fine falling sand
t=T(0.9); f=160+620*np.sin(np.pi*t/0.9); servo=(np.sign(np.sin(2*np.pi*np.cumsum(f)/sr))*0.22+rng.standard_normal(len(t))*0.1)*np.sin(np.pi*t/0.9)**1.4
sand=hp(rng.standard_normal(int(sr*5.2)))*0.12*(0.4+0.6*(rng.random(int(sr*5.2))>0.55))*np.minimum(1,T(5.2)/0.6)*np.exp(-np.maximum(0,T(5.2)-3.4)*1.1)
save('servo_sand',mix(6.0,[(0,servo,0.9),(0.1,sand,0.9),(1.2,sub(2.0,60,32),0.4)]))
# frame 330: cinematic whoosh + 432Hz emerald crystal chime
save('whoosh_chime',mix(6.0,[(0,swell(1.4,True,3.5),0.8),(0.3,swell(1.6,False,2.5),0.5),(1.2,bell(432),0.8),(1.25,bell(648,3.0,1.4),0.4),(1.3,bell(864,2.4,1.8),0.3)]))
# frame 510: heavy metallic lock snap, then (frame 676) the plunge through the seal core -> loop
t=T(1.6); rise=np.sin(2*np.pi*np.cumsum(90+2500*(t/1.6)**2.4)/sr)*(t/1.6)**2*0.5
save('lock_snap',mix(7.0,[(0,clang(),1.0),(0,sub(1.4,120,45),0.9),(0.02,np.diff(rng.standard_normal(int(sr*0.02))*np.exp(-T(0.02)*160),prepend=0)*2,0.8),
  (1.2,bell(432,2.5,1.6),0.25),(5.4,swell(1.6,True,3.0),0.7),(5.4,rise,0.7),(7.0-0.9,sub(0.9,50,28),0.0)]))
print('stems ok')
