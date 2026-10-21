import React from 'react';
import {BRAND, C, fr, T} from '../theme';
import {CAIRO} from '../fonts';
import {ChalkDefs, Stroke, Txt, circleD, polyD, rectD} from '../lib/chalk';
import {Sheet} from '../lib/board';
import {LogoMark} from '../lib/Logo';
import {clamp, easeOut, ramp} from '../lib/anim';

const S = (t: number) => fr(t);
const LOGO = {main: C.chalk, bars: C.yellow, chart: C.chalk, bg: C.board};

const Row: React.FC<{f: number; from: number; y: number; icon: React.ReactNode; label: string; value: string}> = ({f, from, y, icon, label, value}) => {
  const a = easeOut(ramp(f, from, from + 14));
  return (
    <g opacity={a} transform={`translate(${(1 - a) * 40} 0)`}>
      {icon}
      <text x={190} y={y - 34} fontFamily={CAIRO} fontWeight={700} fontSize={30} fill={C.dim}>{label}</text>
      <text x={190} y={y + 14} fontFamily={CAIRO} fontWeight={900} fontSize={50} fill={C.chalk}>{value}</text>
    </g>
  );
};
const ico = (children: React.ReactNode, y: number) => <g transform={`translate(110 ${y - 30})`} fill="none" stroke={C.chalk} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round">{children}</g>;

/** Scene 6 (234.65 - 239s): fixed end-screen - brand + links + WhatsApp + handle. */
export const Scene6_EndCTA: React.FC<{f: number}> = ({f}) => {
  const a0 = S(T.cta);
  const logo = easeOut(ramp(f, a0 + 6, a0 + 30));
  return (
    <Sheet f={f} from={a0} to={S(T.end) + 100} eraseFrames={1}>
      <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        <ChalkDefs />
        <g filter="url(#chalk)">
          <Stroke d={rectD(110, 150, 640, 780, 5)} f={f} from={a0 + 2} dur={26} w={4} />
          <Stroke d={rectD(840, 150, 970, 780, 6)} f={f} from={a0 + 8} dur={26} w={4} color={C.yellow} />
        </g>
        <g transform="translate(430 470) scale(1.55) translate(-180 -138)" opacity={logo}><LogoMark f={Math.max(0, f - a0 - 8)} colors={LOGO} pulse={false} /></g>
        <Txt x={430} y={790} text={BRAND.name} f={f} from={a0 + 16} size={58} weight={900} anchor="middle" cps={1.1} />
        <Txt x={430} y={850} text={BRAND.company} f={f} from={a0 + 28} size={38} anchor="middle" color={C.yellow} cps={1.2} />
        <Row f={f} from={a0 + 22} y={290} label="Free learning platform" value={BRAND.platform} icon={ico(<><circle cx={30} cy={30} r={26} /><path d="M4 30h52M30 4c-18 20-18 32 0 52M30 4c18 20 18 32 0 52" /></>, 290)} />
        <Row f={f} from={a0 + 32} y={440} label="Business analytics" value={BRAND.business} icon={ico(<><rect x={4} y={10} width={52} height={40} rx={4} /><path d="M14 40l10-12 10 8 12-18" /></>, 440)} />
        <Row f={f} from={a0 + 42} y={590} label="WhatsApp" value={BRAND.whatsapp} icon={ico(<path d="M12 6l10 4-4 12c4 8 10 14 18 18l8-6 10 6-4 10C24 56 4 36 12 6z" />, 590)} />
        <Row f={f} from={a0 + 52} y={740} label="Follow us" value={BRAND.handle} icon={ico(<><circle cx={30} cy={30} r={26} /><text x={30} y={42} fontSize={34} fontFamily={CAIRO} fontWeight={900} fill={C.chalk} stroke="none" textAnchor="middle">@</text></>, 740)} />
        <g fill="none" stroke={C.chalk} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" opacity={ramp(f, a0 + 62, a0 + 76)}>
          <g transform="translate(1260 790)"><rect x={0} y={0} width={56} height={56} rx={12} /><text x={28} y={44} fontSize={42} fontFamily={CAIRO} fontWeight={900} fill={C.chalk} stroke="none" textAnchor="middle">f</text></g>
          <g transform="translate(1350 790)"><rect x={0} y={0} width={56} height={56} rx={16} /><circle cx={28} cy={28} r={12} /><circle cx={43} cy={13} r={2.5} fill={C.chalk} /></g>
          <g transform="translate(1440 790)"><rect x={0} y={0} width={56} height={56} rx={12} /><circle cx={22} cy={38} r={8} /><path d="M30 38V14c2 8 8 10 14 10" /></g>
          <g transform="translate(1530 790)"><rect x={0} y={8} width={56} height={40} rx={12} /><path d="M23 18l16 10-16 10z" fill={C.chalk} /></g>
        </g>
        <Txt x={1325} y={880} text="Follow the next lessons on our platform" f={f} from={a0 + 74} size={34} color={C.yellow} cps={1.4} />
      </svg>
    </Sheet>
  );
};
