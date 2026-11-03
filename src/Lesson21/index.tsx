import React from 'react';
import {AbsoluteFill, Audio, Sequence, useCurrentFrame, staticFile, interpolate, Easing} from 'remotion';
import {C} from '../theme';
import {cairo, mono} from '../fonts';
import {Scene01} from './scenes/Scene01';
import {Scene02} from './scenes/Scene02';
import {Scene03} from './scenes/Scene03';
import {Scene04} from './scenes/Scene04';
import {Scene05} from './scenes/Scene05';
import {Scene06} from './scenes/Scene06';
const spans = [{from:0,d:1200},{from:1200,d:1350},{from:2550,d:1350},{from:3900,d:1200},{from:5100,d:1200},{from:6300,d:900}];
const scenes = [Scene01,Scene02,Scene03,Scene04,Scene05,Scene06];
export const Lesson21: React.FC = () => {
  const f=useCurrentFrame();
  const progress=f/7200;
  return <AbsoluteFill style={{background:C.bg,color:C.white,fontFamily:cairo,overflow:'hidden'}}>
    <AbsoluteFill style={{background:'radial-gradient(ellipse at 50% 42%, #1E293B 0%, #0F172A 68%)'}}/>
    {spans.map((s,i)=>{const Comp=scenes[i];return <Sequence key={i} from={s.from} durationInFrames={s.d}>
      <Comp/>
    </Sequence>;})}
    <Sequence from={30}><Audio src={staticFile('Manzooma_Store_Lesson_21_Scalar_Subqueries.mp3')} startFrom={0} /></Sequence>
    <AbsoluteFill style={{pointerEvents:'none',justifyContent:'flex-end',padding:'0 70px 32px'}}>
      <div style={{height:5,background:'#243247',borderRadius:8,overflow:'hidden'}}>
        <div style={{height:'100%',width:`${progress*100}%`,background:C.green}}/>
      </div>
      <div style={{display:'flex',justifyContent:'space-between',marginTop:12,color:C.muted,fontSize:18}}>
        <span>منظومة | SQL From Zero to Professional</span><span style={{fontFamily:mono}}>LESSON 21</span>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>;
};
