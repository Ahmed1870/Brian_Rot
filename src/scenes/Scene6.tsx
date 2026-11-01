import React from 'react';
import {Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, S} from '../theme';
import {KText, Scene} from '../components/common';

/** Everything lives in ONE flex column so no line can ever overlap another. */
export const Scene6: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: f, fps, config: {damping: 18, stiffness: 90}});
  const y = interpolate(p, [0, 1], [160, 0]);
  const sc = interpolate(p, [0, 1], [0.85, 1]);
  const o = interpolate(f, [0, 18], [0, 1], {extrapolateRight: 'clamp'});

  return (
    <Scene dur={S.s6.dur}>
      <div className="absolute w-full flex flex-col items-center" style={{top: 130, gap: 26}}>
        <div className="flex flex-col items-center" style={{opacity: o, transform: `translateY(${y}px) scale(${sc})`}}>
          <Img src={staticFile('logo-white.svg')} style={{width: 280, height: 280}} />
          <div style={{fontSize: 68, fontWeight: 900, color: C.white, direction: 'ltr'}}>Monzoma Digital</div>
        </div>

        <div style={{height: 30}} />
        <KText at={50} size={70} style={{lineHeight: 1.45}}>عايز تبني أنظمة تدير بيزنسك وتلغي الميكرومانجمنت؟</KText>
        <KText at={95} size={84} color={C.green}>اتواصل معانا دلوقتي!</KText>

        <div style={{height: 20}} />
        <KText at={150} size={38} color={C.dim} weight={700}>للتواصل التنفيذي والمؤسسي</KText>
        <KText at={165} size={84} ltr style={{fontVariantNumeric: 'tabular-nums'}}>+201019672878</KText>

        <div style={{height: 14}} />
        <KText at={215} size={38} weight={700} ltr>https://analytics.gomaaintelligence.me/</KText>
        <KText at={240} size={38} weight={700} ltr>https://solutions.gomaaintelligence.me/</KText>
      </div>
    </Scene>
  );
};
