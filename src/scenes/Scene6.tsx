import React from 'react';
import {Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, S} from '../theme';
import {KText, Scene} from '../components/common';

export const Scene6: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: f, fps, config: {damping: 18, stiffness: 90}});
  const y = interpolate(p, [0, 1], [160, 0]);
  const sc = interpolate(p, [0, 1], [0.85, 1]);
  const o = interpolate(f, [0, 18], [0, 1], {extrapolateRight: 'clamp'});

  return (
    <Scene dur={S.s6.dur}>
      <div className="absolute w-full flex flex-col items-center" style={{top: 170, opacity: o, transform: `translateY(${y}px) scale(${sc})`}}>
        <Img src={staticFile('logo-white.svg')} style={{width: 330, height: 330}} />
        <div style={{fontSize: 74, fontWeight: 900, color: C.white, direction: 'ltr', marginTop: 10}}>Monzoma Digital</div>
      </div>

      <KText at={50} top={720} size={84} color={C.white} style={{lineHeight: 1.45}}>
        عايز كل بيعة بتعملها تدخّل أرباح حقيقية في جيبك؟
      </KText>
      <KText at={95} top={1040} size={96} color={C.green}>
        اتواصل معانا دلوقتي!
      </KText>

      <KText at={150} top={1260} size={40} color={C.dim} weight={700}>
        للتواصل التنفيذي والمؤسسي
      </KText>
      <KText at={165} top={1330} size={86} color={C.white} ltr style={{fontVariantNumeric: 'tabular-nums'}}>
        +201019672878
      </KText>

      <KText at={215} top={1500} size={40} color={C.white} weight={700} ltr>
        https://analytics.gomaaintelligence.me/
      </KText>
      <KText at={240} top={1580} size={40} color={C.white} weight={700} ltr>
        https://solutions.gomaaintelligence.me/
      </KText>
    </Scene>
  );
};
