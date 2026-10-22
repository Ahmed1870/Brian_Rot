import React from 'react';
import {BRAND, C, fr, T} from '../theme';
import {CAIRO} from '../fonts';
import {clamp, easeOut, ramp} from '../lib/anim';
import {ChalkDefs, Stroke, Txt, rectD} from '../lib/chalk';
import {Sheet} from '../lib/board';
import {LogoMark} from '../lib/Logo';
import {ArText} from '../lib/ar';

const S = (t: number) => fr(t);
const W = 1080, H = 1920;
const LOGO = {main: C.chalk, bars: C.yellow, chart: C.chalk, bg: C.board};

const ico = (children: React.ReactNode, y: number) => <g transform={`translate(70 ${y - 34})`} fill="none" stroke={C.chalk} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round">{children}</g>;
const Row: React.FC<{f: number; from: number; y: number; icon: React.ReactNode; value: string; size?: number}> = ({f, from, y, icon, value, size = 44}) => {
  const a = easeOut(ramp(f, from, from + 16));
  return (
    <g opacity={a} transform={`translate(0 ${(1 - a) * 90})`}>
      {icon}
      <text x={170} y={y} fontFamily={CAIRO} fontWeight={900} fontSize={size} fill={C.chalk}>{value}</text>
    </g>
  );
};

/** Scene 4 (75.9 - 80s): wipe, the brand drawn in chalk, links rise from the bottom. */
export const Scene4_Outro: React.FC<{f: number}> = ({f}) => {
  const a0 = S(T.outro);
  const logo = easeOut(ramp(f, a0 + 6, a0 + 30));
  return (
    <Sheet f={f} from={a0} to={S(T.end) + 200} eraseFrames={1}>
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{position: 'absolute', left: 0, top: 0}}>
        <ChalkDefs />
        <g filter="url(#chalk)">
          <Stroke d={rectD(150, 230, 780, 640, 7)} f={f} from={a0 + 2} dur={28} w={4} color={C.yellow} />
        </g>
        <g transform="translate(540 520) scale(2.0) translate(-180 -138)" opacity={logo}><LogoMark f={Math.max(0, f - a0 - 8)} colors={LOGO} pulse={false} /></g>
        <Txt x={540} y={790} text={BRAND.name} f={f} from={a0 + 18} size={78} weight={900} anchor="middle" cps={1.0} />
        <Row f={f} from={a0 + 34} y={1190} size={42} value={BRAND.platform} icon={ico(<><circle cx={30} cy={30} r={26} /><path d="M4 30h52M30 4c-18 20-18 32 0 52M30 4c18 20 18 32 0 52" /></>, 1190)} />
        <Row f={f} from={a0 + 44} y={1340} size={42} value={BRAND.business} icon={ico(<><rect x={4} y={10} width={52} height={40} rx={4} /><path d="M14 40l10-12 10 8 12-18" /></>, 1340)} />
        <Row f={f} from={a0 + 54} y={1490} size={50} value={BRAND.whatsapp} icon={ico(<path d="M12 6l10 4-4 12c4 8 10 14 18 18l8-6 10 6-4 10C24 56 4 36 12 6z" />, 1490)} />
        <Row f={f} from={a0 + 64} y={1640} size={50} value={BRAND.handle} icon={ico(<><circle cx={30} cy={30} r={26} /><text x={30} y={42} fontSize={34} fontFamily={CAIRO} fontWeight={900} fill={C.chalk} stroke="none" textAnchor="middle">@</text></>, 1640)} />
      </svg>
      <ArText f={f} from={a0 + 26} text="افهم سلة عميلك، وضاعف أرباحك" top={900} size={58} color={C.yellow} lh={1.3} />
    </Sheet>
  );
};
