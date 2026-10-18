import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C} from '../theme';
import {clamp, ramp} from '../lib/anim';
import {dioramaPrims} from '../lib/world';
import {Prims} from '../lib/Prims';
import {EditorialText} from './EditorialText';

/** Act II (150-330): through the crack into the dual space. Glass tower collapses into sand under an unlit room's shadow. */
export const Act2Fracture: React.FC<{f: number}> = ({f}) => {
  const {prims} = dioramaPrims(f);
  const bloom = 1 - ramp(f, 150, 186); // emerald-white light that spills through the crack
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
        <defs>
          <radialGradient id="a2bloom" cx="50%" cy="50%" r="60%">
            <stop offset="0" stopColor="#FAFAFA" stopOpacity="0.9" /><stop offset="0.4" stopColor="#10B981" stopOpacity="0.35" /><stop offset="1" stopColor="#10B981" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="a2vig" cx="50%" cy="46%" r="78%">
            <stop offset="0.5" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity="0.75" />
          </radialGradient>
        </defs>
        <rect width={1080} height={1920} fill={C.bg} />
        <Prims prims={prims} />
        {bloom > 0 ? <rect width={1080} height={1920} fill="url(#a2bloom)" opacity={bloom * bloom} /> : null}
        <rect width={1080} height={1920} fill="url(#a2vig)" />
      </svg>
      <EditorialText f={f} y={1470} size={92} lead={1.22}
        lines={[
          {words: [{t: 'قرار'}, {t: 'واحد'}, {t: 'ناقص', c: C.crimson}], from: 171, to: 318},
          {words: [{t: 'يكفي'}, {t: 'لإلغاء'}, {t: 'المخطط'}], from: 213, to: 318},
        ]} />
    </AbsoluteFill>
  );
};
