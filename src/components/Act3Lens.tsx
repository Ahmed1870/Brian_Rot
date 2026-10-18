import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C} from '../theme';
import {ramp} from '../lib/anim';
import {dioramaPrims} from '../lib/world';
import {Prims} from '../lib/Prims';
import {EditorialText} from './EditorialText';

/** Act III (330-510): continuous 3D zoom-out onto the dark lens; the emerald beam lifts the sand into a balanced model. */
export const Act3Lens: React.FC<{f: number; text?: boolean}> = ({f, text = true}) => {
  const {prims} = dioramaPrims(f);
  const beam = ramp(f, 340, 362) * (1 - ramp(f, 455, 490));
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
        <defs>
          <radialGradient id="a3vig" cx="50%" cy="52%" r="78%">
            <stop offset="0.5" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity="0.72" />
          </radialGradient>
          <radialGradient id="a3glow" cx="50%" cy="62%" r="45%">
            <stop offset="0" stopColor="#10B981" stopOpacity="0.28" /><stop offset="1" stopColor="#10B981" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width={1080} height={1920} fill={C.bg} />
        <Prims prims={prims} />
        <rect width={1080} height={1920} fill="url(#a3glow)" opacity={beam} />
        <rect width={1080} height={1920} fill="url(#a3vig)" />
      </svg>
      {text ? (
        <EditorialText f={f} y={250} size={84} lead={1.3}
          lines={[
            {words: [{t: 'الداتا'}, {t: 'لا'}, {t: 'تضمن'}, {t: 'المستقبل..'}], from: 426, to: 500},
            {words: [{t: 'بل'}, {t: 'تكشف'}, {t: 'نقطة', c: C.emerald}, {t: 'العماء', c: C.emerald}], from: 465, to: 500},
          ]} />
      ) : null}
    </AbsoluteFill>
  );
};
