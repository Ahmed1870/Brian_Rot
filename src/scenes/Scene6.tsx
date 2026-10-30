import React from 'react';
import {staticFile, useCurrentFrame} from "remotion";
import {C, FONT} from '../theme';
import {Fade, L, prog, sec} from '../kit';

// Scene 6 - Outro (frames 5850-6300 = global 195s-210s). Holds still until the last frame.
const K = 620 / 550; // logo crop scale (logo occupies ~550x445 px of the 1080 square)

export const Scene6: React.FC = () => {
  const f = useCurrentFrame();
  const logo = prog(f, 9, 40);
  const phone = prog(f, sec(3), 30);
  const urls = prog(f, sec(4.2), 30);
  const tag = prog(f, sec(2), 30);

  return (
    <Fade dur={450} inF={10} outF={0}>
      <div
        style={{
          position: 'absolute',
          left: 650,
          top: 40,
          width: 620,
          height: 445 * K,
          overflow: 'hidden',
          opacity: logo,
          transform: `scale(${0.94 + 0.06 * logo})`,
          mixBlendMode: 'lighten',
        }}
      >
        {/* Logo is navy-on-white: invert + hue-rotate turns it into light-on-dark with the brand blues preserved */}
        <img
          src={staticFile("logo.jpg")}
          style={{position: 'absolute', width: 1080 * K, left: -270 * K, top: -310 * K, filter: 'invert(1) hue-rotate(180deg) brightness(1.15)'}}
        />
      </div>

      <div style={{position: 'absolute', left: 0, right: 0, top: 600, textAlign: 'center', fontFamily: FONT, fontSize: 40, color: C.slate400, direction: 'rtl', opacity: tag}}>
        تمكين القيادات عبر البيانات
      </div>

      <div style={{position: 'absolute', left: 0, right: 0, top: 685, textAlign: 'center', opacity: phone, transform: `scale(${0.96 + 0.04 * phone})`}}>
        <L style={{fontFamily: FONT, fontSize: 92, fontWeight: 700, color: C.white, letterSpacing: 2}}>+201019672878</L>
      </div>

      <div style={{position: 'absolute', left: 0, right: 0, top: 835, textAlign: 'center', opacity: urls, fontFamily: FONT, fontSize: 38, color: C.white, lineHeight: 1.7}}>
        <div><L>https://analytics.gomaaintelligence.me/</L></div>
        <div><L>https://solutions.gomaaintelligence.me/</L></div>
      </div>
    </Fade>
  );
};
