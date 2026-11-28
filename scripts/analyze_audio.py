# Measures voiceover pauses and derives scene/sentence anchors (estimates; no transcript available).
import json, re, subprocess, numpy as np, sys
SRC = sys.argv[1]
raw = subprocess.run(["ffmpeg","-v","error","-i",SRC,"-ac","1","-ar","16000","-f","s16le","-"],capture_output=True).stdout
x = np.frombuffer(raw, dtype=np.int16).astype(np.float32)/32768
hop = 160
n = len(x)//hop
rms = np.sqrt((x[:n*hop].reshape(n,hop)**2).mean(1))
db = 20*np.log10(rms+1e-9)
speech_db = np.percentile(db[:29500], 90)
thr = speech_db-28
low = db < thr
pauses=[]; i=0
while i<n:
    if low[i]:
        j=i
        while j<n and low[j]: j+=1
        pauses.append((i/100, j/100)); i=j
    else: i+=1
tail = [p for p in pauses if p[1]>=n/100-0.05 and p[0]>290]
speech_end = tail[0][0] if tail else 295.0
pauses=[p for p in pauses if p[1]-p[0]>=0.12 and p[1]<speech_end-0.05]
speech_start = 0.0
nar = json.load(open("src/data/narration.json"))
tot = sum(s["words"] for s in nar)
dur = speech_end-speech_start
def snap(t, tol):
    best=None
    for a,b in pauses:
        c=(a+b)/2
        if abs(c-t)<=tol and (best is None or abs(c-t)<abs((best[0]+best[1])/2-t)): best=(a,b)
    return best
cum=0; bounds=[0.0]; info=[]
for k,s in enumerate(nar[:-1]):
    cum+=s["words"]; pred=cum/tot*dur
    p=snap(pred,3.0)
    bounds.append(round((p[0]+p[1])/2,2) if p else round(pred,2))
    info.append({"after":s["id"],"pred":round(pred,2),"pause":p})
bounds.append(round(speech_end,2))
scenes=[]
for k,s in enumerate(nar):
    a,b=bounds[k],bounds[k+1]
    sents=[t for t in re.split(r'(?<=[\.؟:؛])\s+', s["text"]) if t.strip()]
    wc=[len(t.split()) for t in sents]; c=0; starts=[a]
    for w in wc[:-1]:
        c+=w; pred=a+(c/sum(wc))*(b-a)
        p=snap(pred,0.9)
        t=round(p[1] if p else pred,2)
        # keep anchors strictly increasing, >=1.2s apart, and inside the scene
        t=max(t, starts[-1]+1.2)
        t=min(t, b-1.0)
        starts.append(round(t,2))
    scenes.append({"id":s["id"],"start":a,"end":b,"sentenceStarts":starts,"sentenceWords":wc})
out={"audioDuration":round(n/100,3),"speechEnd":round(speech_end,2),"threshold_db":round(float(thr),1),
     "pausesFound":len(pauses),"scenes":scenes}
json.dump(out,open("src/data/timing.json","w"),indent=1)
print(json.dumps({"dur":out["audioDuration"],"speechEnd":out["speechEnd"],"thr":out["threshold_db"],"pauses":len(pauses)}))
for i_ in info: print(i_)
for s in scenes: print(s["id"],s["start"],s["end"],s["sentenceStarts"])
