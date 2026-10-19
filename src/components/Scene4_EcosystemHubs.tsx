import React from 'react';
import {C, BRAND, SCENES} from '../theme';
import {clamp, ramp, sp, SP} from '../lib/anim';
import {IsoBoxes, IsoFloor} from '../lib/IsoView';
import {ISO4A, ISO4B, s4HubA, s4HubB} from '../lib/scenegeo';
import {IconCap, IconGlobe, Ring, SceneShell} from '../lib/ui';
import {GlassBadge} from './GlassBadge';

/** Frames 1098-1488: two glass badges - free education hub and B2B rescue center. */
export const Scene4_EcosystemHubs: React.FC<{f: number}> = ({f}) => {
  const a = sp(f, SP.pop, 1112);
  const b = sp(f, SP.pop, 1382);
  const link = ramp(f, 1392, 1430);
  return (
    <SceneShell dur={SCENES.s4.dur} fadeIn={12} fadeOut={12}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
        <IsoFloor o={ISO4A} x0={-40} x1={500} z0={-40} z1={260} step={100} op={ramp(f, 1100, 1124)} />
        <IsoBoxes boxes={s4HubA(f)} o={ISO4A} />
        {f >= 1374 ? <IsoFloor o={ISO4B} x0={-40} x1={560} z0={-40} z1={240} step={100} op={ramp(f, 1376, 1400)} /> : null}
        <IsoBoxes boxes={s4HubB(f)} o={ISO4B} />
        {/* connector: the two worlds belong to one ecosystem */}
        <line x1={540} y1={790} x2={540} y2={810 + 70 * link} stroke={C.text} strokeWidth={3} strokeDasharray="6 10" opacity={link} />
        <circle cx={540} cy={800} r={10 + 3 * Math.sin(f / 6)} fill={C.yellow} opacity={link} />
        <Ring f={f} start={1112} x={540} y={640} max={300} life={26} color={C.yellow} w={6} />
        <Ring f={f} start={1382} x={540} y={1060} max={300} life={26} color={C.emerald} w={6} />
      </svg>
      {f >= 1112 ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 210, textAlign: 'center', opacity: clamp(a * 3), transform: `scale(${0.6 + 0.4 * Math.min(1.08, a)})`}}>
          <GlassBadge title="منصة التعليم المجاني" sub={BRAND.solutions} subLtr accent={C.yellow} titleSize={58} subSize={30} f={f} radius={52} icon={<IconCap s={70} c={C.yellow} />} />
        </div>
      ) : null}
      {f >= 1382 ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 880, textAlign: 'center', opacity: clamp(b * 3), transform: `scale(${0.6 + 0.4 * Math.min(1.08, b)})`}}>
          <GlassBadge title="مركز إنقاذ المشروعات" sub={BRAND.analytics} subLtr accent={C.emerald} titleSize={58} subSize={30} f={f} radius={52} icon={<IconGlobe s={70} c={C.emerald} />} />
        </div>
      ) : null}
    </SceneShell>
  );
};
