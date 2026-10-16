import fs from 'fs';
import path from 'path';

const outDir = path.resolve('public/audio');
fs.mkdirSync(outDir, {recursive:true});
const SR=44100;

function writeWav(file, samples){
  const buf=Buffer.alloc(44+samples.length*2);
  buf.write('RIFF',0); buf.writeUInt32LE(36+samples.length*2,4); buf.write('WAVE',8);
  buf.write('fmt ',12); buf.writeUInt32LE(16,16); buf.writeUInt16LE(1,20); buf.writeUInt16LE(1,22);
  buf.writeUInt32LE(SR,24); buf.writeUInt32LE(SR*2,28); buf.writeUInt16LE(2,32); buf.writeUInt16LE(16,34);
  buf.write('data',36); buf.writeUInt32LE(samples.length*2,40);
  samples.forEach((x,i)=>buf.writeInt16LE(Math.max(-1,Math.min(1,x))*32767,44+i*2));
  fs.writeFileSync(file,buf);
}
function env(t,d,a=.01,r=.25){return t<a?t/a:Math.max(0,1-(t-a)/(d-a))**2}
function noise(n, seed=1){
  let x=seed; return Array.from({length:n},()=>{x=(x*1664525+1013904223)>>>0;return (x/4294967296)*2-1});
}
const dur=.9, n=Math.floor(SR*dur);

// Distinct sound 1: brittle glass impact + shards, not a generic repeated click.
{
  const s=new Float32Array(n), ns=noise(n,77);
  for(let i=0;i<n;i++){
    const t=i/SR, e=env(t,dur,.003,.35);
    const crack=Math.sin(2*Math.PI*(1700*Math.exp(-t*8))*t)*Math.exp(-t*7);
    const shard=(Math.sin(2*Math.PI*3100*t)+.55*Math.sin(2*Math.PI*4700*t)+.3*Math.sin(2*Math.PI*6900*t))*Math.exp(-t*12);
    s[i]=(crack*.42+shard*.18+ns[i]*.22*Math.exp(-t*15))*e;
  }
  writeWav(path.join(outDir,'crack-impact.wav'),s);
}

// Distinct sound 2: short digital electrical tearing, rhythmically unlike the glass hit.
{
  const s=new Float32Array(n), ns=noise(n,191);
  for(let i=0;i<n;i++){
    const t=i/SR;
    const gate=(Math.sin(2*Math.PI*29*t)>0.15?1:0)*Math.exp(-t*6);
    const tone=Math.sin(2*Math.PI*(95+850*t)*t)*.32 + Math.sin(2*Math.PI*4200*t)*.12;
    s[i]=(tone+ns[i]*.11)*gate;
  }
  writeWav(path.join(outDir,'electric-glitch.wav'),s);
}

// Distinct sound 3: clean ascending glassy repair chime with a soft tail.
{
  const s=new Float32Array(n);
  const notes=[523.25,659.25,783.99,1046.5];
  for(let i=0;i<n;i++){
    const t=i/SR, out=Math.exp(-t*3.4);
    let v=0;
    notes.forEach((f,k)=>{
      const start=k*.075, u=t-start;
      if(u>=0) v += Math.sin(2*Math.PI*f*u)*Math.exp(-u*7.5)*(.20-k*.025);
    });
    v += Math.sin(2*Math.PI*180*t)*Math.exp(-t*4)*.08;
    s[i]=v*out;
  }
  writeWav(path.join(outDir,'repair-chime.wav'),s);
}
console.log('Generated 3 distinct SFX assets in public/audio/');
