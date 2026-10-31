import React from 'react';
import {Img, staticFile, useCurrentFrame} from 'remotion';
import {C, FONT} from '../theme';
import {Fade, Kinetic, L, prog, sec} from '../kit';

// Scene 6 - Outro (frames 6750-7200, global 225-240s). Slides up, then holds still to the last frame.
export const Scene6: React.FC = () => {
  const f = useCurrentFrame();
  const logo = prog(f, 9, 45);
  const phone = prog(f, sec(7), 30);
  const urls = prog(f, sec(9.5), 30);

  return (
    <Fade dur={450} inF={10} outF={0}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 170, display: 'flex', justifyContent: 'center', opacity: logo, transform: `translateY(${(1 - logo) * 80}px) scale(${0.9 + 0.1 * logo})`}}>
        <Img src={staticFile('logo.svg')} style={{width: 640, height: 'auto'}} />
      </div>

      <div style={{position: 'absolute', left: 80, right: 80, top: 760}}>
        <Kinetic text="عايز ترفع إنتاجية بيزنسك وتلغي {{الاختناقات؟}}" start={sec(2.3)} size={76} align="center" />
        <Kinetic text="اتواصل معانا دلوقتي!" start={sec(5)} size={76} align="center" color={C.emerald} />
      </div>

      <div style={{position: 'absolute', left: 0, right: 0, top: 1180, textAlign: 'center', opacity: phone, transform: `translateY(${(1 - phone) * 50}px)`}}>
        <L style={{fontFamily: FONT, fontSize: 84, fontWeight: 700, color: C.white, letterSpacing: 1}}>+201019672878</L>
      </div>

      <div style={{position: 'absolute', left: 0, right: 0, top: 1360, textAlign: 'center', opacity: urls, transform: `translateY(${(1 - urls) * 50}px)`, fontFamily: FONT, fontSize: 36, color: C.white, lineHeight: 1.8}}>
        <div><L>https://analytics.gomaaintelligence.me/</L></div>
        <div><L>https://solutions.gomaaintelligence.me/</L></div>
      </div>
    </Fade>
  );
};
