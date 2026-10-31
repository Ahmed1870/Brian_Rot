import React from 'react';
import {Img, staticFile, useCurrentFrame} from 'remotion';
import {C, FONT} from '../theme';
import {Fade, L, prog, sec} from '../kit';

// Scene 6 - Outro (frames 6750-7200, global 225-240s). Fades in vertically, then holds to the last frame.
export const Scene6: React.FC = () => {
  const f = useCurrentFrame();
  const logo = prog(f, 9, 45);
  const phone = prog(f, sec(3), 30);
  const urls = prog(f, sec(5), 30);
  const tag = prog(f, sec(11.1), 30);

  return (
    <Fade dur={450} inF={10} outF={0}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 260, display: 'flex', justifyContent: 'center', opacity: logo, transform: `translateY(${(1 - logo) * 60}px) scale(${0.92 + 0.08 * logo})`}}>
        <Img src={staticFile('logo.svg')} style={{width: 760, height: 'auto'}} />
      </div>

      <div style={{position: 'absolute', left: 80, right: 80, top: 960, textAlign: 'center', opacity: tag, direction: 'rtl', fontFamily: FONT, fontSize: 46, color: C.slate400}}>
        تمكين القيادات عبر البيانات
      </div>

      <div style={{position: 'absolute', left: 0, right: 0, top: 1090, textAlign: 'center', opacity: phone, transform: `translateY(${(1 - phone) * 40}px)`}}>
        <L style={{fontFamily: FONT, fontSize: 84, fontWeight: 700, color: C.white, letterSpacing: 1}}>+201019672878</L>
      </div>

      <div style={{position: 'absolute', left: 0, right: 0, top: 1280, textAlign: 'center', opacity: urls, transform: `translateY(${(1 - urls) * 40}px)`, fontFamily: FONT, fontSize: 36, color: C.white, lineHeight: 1.8}}>
        <div><L>https://analytics.gomaaintelligence.me/</L></div>
        <div><L>https://solutions.gomaaintelligence.me/</L></div>
      </div>
    </Fade>
  );
};
