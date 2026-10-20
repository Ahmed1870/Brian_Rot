import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, useCurrentFrame, useVideoConfig, staticFile, spring} from 'remotion';

const BG = '#1A1D20', WHITE = '#EAEAEA', YELLOW = '#F4D03F', BLUE = '#56B4E9', MUTED = '#9CA3AF';
const font = 'Arial, "Noto Sans Arabic", sans-serif';

const Chalk = ({children, style={}}) => <div style={{fontFamily:font,color:WHITE,textShadow:'0 0 1px #fff',...style}}>{children}</div>;
const Panel = ({children, style={}}) => <div style={{border:`2px solid ${WHITE}55`,borderRadius:18,padding:24,background:'#202428',...style}}>{children}</div>;
const Title = ({children}) => <Chalk style={{fontSize:52,fontWeight:800,letterSpacing:1,marginBottom:26}}>{children}</Chalk>;
const Footer = () => <div style={{position:'absolute',bottom:22,left:42,right:42,display:'flex',justifyContent:'space-between',fontFamily:font,fontSize:18,color:'#AEB4BA',borderTop:'1px solid #60666b',paddingTop:12}}><span>MONZOMA DIGITAL · LESSON 25</span><span>COHORT & CHURN ANALYSIS</span></div>;

function BucketScene({frame}) {
  const leak = interpolate(Math.sin(frame/7),[-1,1],[0.6,1.25]);
  return <AbsoluteFill style={{padding:'68px 90px'}}>
    <Title>01 / CHURN RATE — THE LEAKY BUCKET</Title>
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',height:700}}>
      <div style={{width:760}}>
        <Chalk style={{fontSize:34,lineHeight:1.5}}>العملاء مثل الماء داخل الدلو.</Chalk>
        <Chalk style={{fontSize:28,color:MUTED,lineHeight:1.5,marginTop:18}}>كل عميل يغادر هو تسرب من قاعدة العملاء.</Chalk>
        <Panel style={{marginTop:28,width:600}}>
          <Chalk style={{fontSize:30,color:YELLOW}}>Churn Rate</Chalk>
          <Chalk style={{fontSize:29,marginTop:12}}>العملاء الذين غادروا ÷ العملاء في بداية الفترة × 100</Chalk>
          <Chalk style={{fontSize:23,color:MUTED,marginTop:12}}>مثال: 40 عميلًا غادروا من أصل 800 = 5%</Chalk>
        </Panel>
      </div>
      <svg width="700" height="600" viewBox="0 0 700 600">
        <path d="M190 120 L225 450 Q350 510 475 450 L510 120" fill="none" stroke={WHITE} strokeWidth="9" strokeLinecap="round"/>
        <path d="M202 270 Q350 300 498 270 L475 450 Q350 510 225 450 Z" fill="#3B6473" opacity=".8"/>
        <path d="M202 270 Q350 300 498 270" fill="none" stroke={BLUE} strokeWidth="7"/>
        <path d="M470 438 Q525 458 535 490" fill="none" stroke={BLUE} strokeWidth="8" strokeLinecap="round"/>
        {[0,1,2,3,4].map(i=><circle key={i} cx={535+Math.sin(frame/6+i)*8} cy={490+((frame*4+i*37)%85)} r={7+(i%2)*3} fill={BLUE} opacity={interpolate((frame+i*17)%60,[0,60],[1,0])}/>)}
        <path d="M175 120 Q350 80 525 120" fill="none" stroke={WHITE} strokeWidth="7"/>
        <text x="350" y="70" fill={YELLOW} fontSize="25" textAnchor="middle">CUSTOMER BASE</text>
        <text x="540" y="580" fill={BLUE} fontSize="22">CHURN</text>
      </svg>
    </div><Footer/>
  </AbsoluteFill>;
}

const cohorts = [
 ['Jan','100%','72%','58%','49%','43%'],
 ['Feb','100%','78%','65%','56%','—'],
 ['Mar','100%','75%','61%','—','—'],
 ['Apr','100%','81%','—','—','—'],
 ['May','100%','77%','—','—','—']
];
function HeatmapScene({frame}) {
  const reveal = Math.floor(interpolate(frame,[0,2550],[0,30],{extrapolateRight:'clamp'}));
  const cells = cohorts.flatMap((row,r)=>row.slice(1).map((v,c)=>({r,c,v})));
  return <AbsoluteFill style={{padding:'64px 90px'}}>
    <Title>02 / COHORT RETENTION HEATMAP</Title>
    <Chalk style={{fontSize:28,color:MUTED,marginBottom:28}}>تابع كل مجموعة عملاء حسب شهر اكتسابها — هل يعودون في الأشهر التالية؟</Chalk>
    <div style={{display:'grid',gridTemplateColumns:'150px repeat(5, 1fr)',gap:10,maxWidth:1450,margin:'0 auto'}}>
      <div/>
      {['Month 0','Month 1','Month 2','Month 3','Month 4'].map(x=><Chalk key={x} style={{fontSize:23,textAlign:'center',padding:12,color:YELLOW}}>{x}</Chalk>)}
      {cohorts.map((row,r)=><React.Fragment key={row[0]}>
        <Chalk style={{fontSize:27,display:'flex',alignItems:'center',paddingLeft:16}}>{row[0]} cohort</Chalk>
        {row.slice(1).map((v,c)=>{
          const idx=r*5+c, shown=idx<reveal;
          const n=parseInt(v)||0, opacity=shown?0.18+(n/100)*0.75:0.04;
          return <div key={c} style={{height:90,border:`1px solid ${WHITE}44`,borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',background:shown?`rgba(244,208,63,${opacity})`:'#262a2e',transform:shown?'scale(1)':'scale(.96)',transition:'background .3s'}}>
            <Chalk style={{fontSize:30,color:shown?(n>=70?WHITE:YELLOW):'#596067',fontWeight:700}}>{shown?v:'·'}</Chalk>
          </div>
        })}
      </React.Fragment>)}
    </div>
    <div style={{display:'flex',gap:20,justifyContent:'center',marginTop:34}}>
      <Chalk style={{fontSize:22,color:YELLOW}}>Retention أعلى = احتفاظ أفضل</Chalk>
      <Chalk style={{fontSize:22,color:MUTED}}>— = بيانات لم تكتمل بعد</Chalk>
    </div><Footer/>
  </AbsoluteFill>;
}

function ComparisonScene({frame}) {
  const p = interpolate(frame,[0,1350],[0,1],{extrapolateRight:'clamp'});
  const bar = (v,color) => <div style={{height:18,background:'#3A4046',borderRadius:20,overflow:'hidden',marginTop:10}}><div style={{width:`${v*p}%`,height:'100%',background:color,borderRadius:20}}/></div>;
  return <AbsoluteFill style={{padding:'70px 90px'}}>
    <Title>03 / JANUARY VS FEBRUARY COHORT</Title>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:32,marginTop:22}}>
      <Panel>
        <Chalk style={{fontSize:38,color:YELLOW,fontWeight:800}}>JAN COHORT</Chalk>
        <Chalk style={{fontSize:24,color:MUTED,marginTop:8}}>1000 customers acquired</Chalk>
        {[['Month 1',72],['Month 2',58],['Month 3',49],['Month 4',43]].map(([label,v])=><div key={label} style={{marginTop:20}}><div style={{display:'flex',justifyContent:'space-between',fontSize:24}}><Chalk>{label}</Chalk><Chalk>{Math.round(v*p)}%</Chalk></div>{bar(v,YELLOW)}</div>)}
      </Panel>
      <Panel>
        <Chalk style={{fontSize:38,color:BLUE,fontWeight:800}}>FEB COHORT</Chalk>
        <Chalk style={{fontSize:24,color:MUTED,marginTop:8}}>1000 customers acquired</Chalk>
        {[['Month 1',78],['Month 2',65],['Month 3',56],['Month 4',null]].map(([label,v])=><div key={label} style={{marginTop:20}}><div style={{display:'flex',justifyContent:'space-between',fontSize:24}}><Chalk>{label}</Chalk><Chalk>{v===null?'Not ready':`${Math.round(v*p)}%`}</Chalk></div>{v?bar(v,BLUE):<div style={{marginTop:10,color:MUTED,fontSize:18}}>لا تقارن فترة غير مكتملة</div>}</div>)}
      </Panel>
    </div>
    <Panel style={{marginTop:25,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
      <Chalk style={{fontSize:27}}>تحسن الاحتفاظ في فبراير: راجع التفعيل وتجربة أول أسبوع.</Chalk><Chalk style={{fontSize:32,color:YELLOW,fontWeight:800}}>+7 pts</Chalk>
    </Panel><Footer/>
  </AbsoluteFill>;
}

function CodeScene({frame}) {
 const cards=[
  {title:'SQL',sub:'Measure cohorts',code:'SELECT cohort_month,\\n       months_since_signup,\\n       COUNT(DISTINCT customer_id)\\nFROM customer_activity\\nGROUP BY 1, 2;',accent:YELLOW},
  {title:'PYTHON',sub:'Calculate retention',code:'retention = active_users\\n    / cohort_size * 100\\n\\nchurn = 100 - retention',accent:BLUE},
  {title:'POWER BI',sub:'Monitor the trend',code:'Retention Rate\\n= DIVIDE(\\n  [Active Customers],\\n  [Cohort Customers]\\n)',accent:YELLOW},
  {title:'EXCEL',sub:'Quick validation',code:'=Active_Customers\\n / Cohort_Size\\n\\nFormat as Percentage',accent:BLUE}
 ];
 return <AbsoluteFill style={{padding:'58px 80px'}}>
  <Title>04 / FROM DATA TO DECISION</Title>
  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gridTemplateRows:'1fr 1fr',gap:18,height:790}}>
   {cards.map((c,i)=><Panel key={c.title} style={{padding:22,borderColor:c.accent+'88',transform:`translateY(${Math.sin(frame/10+i)*3}px)`}}>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline'}}><Chalk style={{fontSize:30,color:c.accent,fontWeight:800}}>{c.title}</Chalk><Chalk style={{fontSize:18,color:MUTED}}>{c.sub}</Chalk></div>
    <pre style={{fontFamily:'monospace',fontSize:23,lineHeight:1.42,color:WHITE,whiteSpace:'pre-wrap',marginTop:18}}>{c.code}</pre>
   </Panel>)}
  </div><Footer/>
 </AbsoluteFill>;
}

function JourneyScene({frame}) {
 const steps=[['01','DISCOVER','اعرف لماذا يغادر العميل'],['02','ONBOARD','سهّل أول تجربة'],['03','ENGAGE','قدّم قيمة مستمرة'],['04','RECOVER','تواصل مع العملاء المعرضين للتسرب'],['05','MEASURE','اختبر وحسّن باستمرار']];
 return <AbsoluteFill style={{padding:'68px 90px'}}>
  <Title>05 / IMPROVE RETENTION — STEP BY STEP</Title>
  <div style={{position:'relative',margin:'36px auto',width:1450}}>
   <div style={{position:'absolute',top:47,left:100,right:100,height:4,background:'#656B70'}}/>
   <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:20,position:'relative'}}>
    {steps.map(([num,title,desc],i)=><div key={num} style={{textAlign:'center',opacity:interpolate(frame,[i*80,i*80+35],[0.25,1],{extrapolateRight:'clamp'})}}>
      <div style={{width:92,height:92,borderRadius:60,border:`4px solid ${i===4?YELLOW:WHITE}`,background:BG,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 22px',fontSize:30,color:i===4?YELLOW:WHITE,fontWeight:800}}>{num}</div>
      <Chalk style={{fontSize:24,color:i===4?YELLOW:BLUE,fontWeight:800}}>{title}</Chalk>
      <Chalk style={{fontSize:21,lineHeight:1.5,marginTop:14}}>{desc}</Chalk>
    </div>)}
   </div>
  </div>
  <Panel style={{maxWidth:1200,margin:'40px auto 0',textAlign:'center'}}>
   <Chalk style={{fontSize:33,color:YELLOW,fontWeight:800}}>Retention is a product of customer value.</Chalk>
   <Chalk style={{fontSize:26,marginTop:12}}>الاحتفاظ نتيجة قيمة حقيقية وتجربة مستمرة — وليس مجرد حملة خصومات.</Chalk>
  </Panel><Footer/>
 </AbsoluteFill>;
}

function EndScene({frame}) {
 const opacity=interpolate(frame,[0,20],[0,1],{extrapolateRight:'clamp'});
 return <AbsoluteFill style={{alignItems:'center',justifyContent:'center',padding:55,opacity}}>
  <Img src={staticFile('monzoma-logo.jpg')} style={{width:260,height:260,objectFit:'contain',borderRadius:12,marginBottom:20}}/>
  <Chalk style={{fontSize:52,fontWeight:900,letterSpacing:3}}>MONZOMA DIGITAL</Chalk>
  <Chalk style={{fontSize:27,color:YELLOW,marginTop:10}}>بيانات أوضح. قرارات أفضل.</Chalk>
  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px 45px',marginTop:40,textAlign:'center'}}>
   <Chalk style={{fontSize:24}}>solutions.gomaaintelligence.me</Chalk>
   <Chalk style={{fontSize:24}}>analytics.gomaaintelligence.me</Chalk>
   <Chalk style={{fontSize:24}}>+201019672878</Chalk>
   <Chalk style={{fontSize:24}}>@monzoma_digital</Chalk>
  </div>
  <Chalk style={{fontSize:22,color:MUTED,marginTop:38}}>LESSON 25 · COHORT & CHURN ANALYSIS</Chalk>
 </AbsoluteFill>;
}

export const Lesson25 = () => {
 const frame=useCurrentFrame();
 const {fps}=useVideoConfig();
 return <AbsoluteFill style={{background:BG,color:WHITE,fontFamily:font}}>
  <Audio src={staticFile('voiceover.wav')} volume={1}/>
  <Sequence from={0} durationInFrames={1350}><BucketScene frame={frame}/></Sequence>
  <Sequence from={1350} durationInFrames={2550}><HeatmapScene frame={frame-1350}/></Sequence>
  <Sequence from={3900} durationInFrames={1350}><ComparisonScene frame={frame-3900}/></Sequence>
  <Sequence from={5250} durationInFrames={1050}><CodeScene frame={frame-5250}/></Sequence>
  <Sequence from={6300} durationInFrames={600}><JourneyScene frame={frame-6300}/></Sequence>
  <Sequence from={6900} durationInFrames={300}><EndScene frame={frame-6900}/></Sequence>
 </AbsoluteFill>;
};
