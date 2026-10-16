import React from 'react';
import {AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

const C = {
  bg: '#03050A',
  cyan: '#4FFFE0',
  blue: '#4AA8FF',
  white: '#F4F8FF',
  muted: '#9BA8B8',
  pink: '#FF3E86'
};

function Crack({opacity = 1, scale = 1}: {opacity?: number; scale?: number}) {
  const rays = [
    'M540 940 L540 560 L500 430 L520 250',
    'M540 940 L700 780 L890 700 L1010 570',
    'M540 940 L410 800 L230 760 L90 620',
    'M540 940 L610 1040 L820 1130 L950 1280',
    'M540 940 L470 1090 L300 1220 L150 1450',
    'M540 940 L530 1180 L570 1420 L520 1660',
    'M540 940 L680 900 L760 820 L830 780',
    'M540 940 L430 930 L350 880 L260 820'
  ];
  return (
    <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position:'absolute', inset:0, transform:`scale(${scale})`, opacity}}>
      <defs>
        <filter id="glow"><feGaussianBlur stdDeviation="8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      {rays.map((d,i)=>(
        <React.Fragment key={i}>
          <path d={d} fill="none" stroke="#DDEBFF" strokeWidth="5" opacity=".95" filter="url(#glow)"/>
          <path d={d} fill="none" stroke={i%3===0?C.cyan:i%3===1?C.pink:C.blue} strokeWidth="1.8" opacity=".8"/>
        </React.Fragment>
      ))}
      <circle cx="540" cy="940" r="24" fill="none" stroke={C.white} strokeWidth="4" opacity=".9"/>
      <circle cx="540" cy="940" r="8" fill={C.white}/>
    </svg>
  );
}

function ScanHUD({frame}: {frame:number}) {
  const p = interpolate(frame, [150, 239], [0, 1], {extrapolateLeft:'clamp', extrapolateRight:'clamp'});
  const y = interpolate((frame-150)%55, [0,55], [-120,2040]);
  return (
    <>
      <div style={{position:'absolute', top:76, left:70, right:70, display:'flex', justifyContent:'space-between', alignItems:'center', fontFamily:'Arial,sans-serif', letterSpacing:2, fontSize:27, color:C.white, opacity:interpolate(frame,[145,160],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})}}>
        <span>MONZOMA DIGITAL</span>
        <span style={{color:C.cyan}}>● SIGNAL</span>
      </div>
      <div style={{position:'absolute', top:y, left:0, width:'100%', height:5, background:`linear-gradient(90deg,transparent,${C.cyan},${C.white},${C.cyan},transparent)`, boxShadow:`0 0 25px ${C.cyan}`, opacity:.7}}/>
      <div style={{position:'absolute', left:70, right:70, bottom:90, fontFamily:'Arial,sans-serif', textAlign:'center', color:C.white, fontSize:24, lineHeight:1.7, letterSpacing:1, opacity:p}}>
        <div style={{color:C.cyan}}>WhatsApp +20 1019672878</div>
        <div>solutions.gomaaintelligence.me</div>
        <div>analytics.gomaaintelligence.me</div>
      </div>
    </>
  );
}

export const CrackedScreenReel: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const shock = interpolate(frame,[0,3,12,60],[0,1,1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  const repair = interpolate(frame,[58,120,155],[0,1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  const clean = interpolate(frame,[130,155,170],[0,1,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  const card = interpolate(frame,[158,178],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  const loopCrack = interpolate(frame,[232,239],[0,.9],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});

  const glitch = Math.sin(frame*2.7)*shock;
  const jitter = Math.sin(frame*19)*shock*5;

  return (
    <AbsoluteFill style={{background:C.bg, overflow:'hidden', fontFamily:'Arial,sans-serif'}}>
      <div style={{position:'absolute', inset:0, background:`radial-gradient(circle at 50% 49%, rgba(74,168,255,${.10+shock*.18}), transparent 36%), radial-gradient(circle at 48% 52%, rgba(79,255,224,${repair*.12}), transparent 42%)`}}/>

      <div style={{position:'absolute', inset:0, opacity:shock, transform:`translate(${jitter}px,${-jitter*.5}px)`}}>
        <Crack opacity={.95} scale={1 + glitch*.012}/>
        <div style={{position:'absolute', inset:0, mixBlendMode:'screen', background:`linear-gradient(${90+glitch*20}deg, transparent 35%, rgba(255,0,85,.16) 49%, transparent 53%, rgba(0,229,255,.16) 63%, transparent 68%)`}}/>
        <div style={{position:'absolute', top:0,left:0,right:0,height:8,background:C.white,opacity:.5,transform:`translateY(${(frame%7)*260}px)`}}/>
      </div>

      <div style={{position:'absolute', inset:0, opacity:repair}}>
        {[0,1,2,3,4].map(i=>{
          const s=interpolate(frame,[58,125],[.05+i*.02,1.35+i*.08],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
          return <div key={i} style={{position:'absolute',left:'50%',top:'49%',width:500+i*90,height:500+i*90,borderRadius:'50%',border:`${3+i}px solid rgba(79,255,224,${.55-i*.07})`,transform:`translate(-50%,-50%) scale(${s}) rotate(${frame*(i+1)*.8}deg)`,filter:`blur(${i*.6}px)`,boxShadow:`0 0 45px rgba(79,255,224,${.25})`}}/>
        })}
        <div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 50% 49%, rgba(79,255,224,.16), transparent 28%)'}}/>
      </div>

      <div style={{position:'absolute',top:'43%',width:'100%',textAlign:'center',opacity:clean,transform:`translateY(${(1-clean)*30}px)`}}>
        <div style={{fontSize:52,fontWeight:800,color:C.white,textShadow:`0 0 25px ${C.cyan}`}}>متخافش.. شاشتك سليمة! 📱✨</div>
      </div>

      <div style={{position:'absolute',left:55,right:55,top:'50%',transform:`translateY(-50%) scale(${.92+card*.08})`,opacity:card}}>
        <div style={{padding:'58px 38px',border:'1px solid rgba(255,255,255,.18)',borderRadius:34,background:'rgba(8,13,22,.82)',boxShadow:'0 30px 100px rgba(0,0,0,.45)',textAlign:'center'}}>
          <div style={{fontSize:51,fontWeight:900,color:C.white,marginBottom:28}}>اتخضيت ولا ثبات انفعالي؟ 😂</div>
          <div style={{fontSize:39,fontWeight:700,color:C.cyan}}>اكتب ردك في التعليقات! 👇</div>
        </div>
      </div>

      <ScanHUD frame={frame}/>

      <div style={{position:'absolute',inset:0,opacity:loopCrack}}>
        <Crack opacity={1} scale={.18 + loopCrack*.08}/>
      </div>

      <Audio src={staticFile('audio/glass-shatter.wav')} startFrom={0} volume={1}/>
      <Audio src={staticFile('audio/electric-glitch.wav')} startFrom={2} volume={0.48}/>
      <Audio src={staticFile('audio/notification-tick.wav')} startFrom={60} volume={0.9}/>
      <Audio src={staticFile('audio/neon-repair.wav')} startFrom={62} volume={0.72}/>
    </AbsoluteFill>
  );
};
