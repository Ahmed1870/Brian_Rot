import React from 'react';
import {CAIRO} from '../fonts';
import {C} from '../theme';
import {GlassBadge} from './GlassBadge';

const bounce = (t: number) => (t < 0 ? 0 : Math.exp(-t / 9) * Math.cos(t * 0.55));
const imp = (f: number, ts: number[]) => ts.reduce((a, t) => a + bounce(f - t) * (t === 0 ? 1 : 0.8), 0);

/** Outer plus polygon with a 135x240 hollow: the portal into SplitScreen. */
export const PLUS = 'M410 580 H670 V770 H860 V1030 H670 V1220 H410 V1030 H220 V770 H410 Z M472.5 780 H607.5 V1020 H472.5 Z';

const Word: React.FC<{text: string; top: number; f: number; ts: number[]; rot: number}> = ({text, top, f, ts, rot}) => {
  const k = imp(f, ts);
  const echo = Math.exp(-f / 16);
  const base: React.CSSProperties = {position: 'absolute', left: 0, right: 0, top, textAlign: 'center', fontFamily: CAIRO, fontWeight: 900,
    fontSize: 300, lineHeight: '300px', direction: 'rtl', whiteSpace: 'nowrap'};
  return (
    <>
      {[2, 1].map((e) => (
        <div key={e} style={{...base, color: 'transparent', WebkitTextStroke: '3px rgba(255,255,255,0.55)', opacity: 0.5 * echo / e,
          transform: `scale(${1 + 0.12 * e * echo + 0.14 * k})`}}>{text}</div>
      ))}
      <div style={{...base, color: C.white, transform: `scale(${1 + 0.14 * k}) rotate(${rot * k}deg)`}}>{text}</div>
    </>
  );
};

/** Frames 0-240: kinetic hook. All state is a pure function of f and equals the loop-entry state at f = 0. */
export const TypographyScene: React.FC<{f: number}> = ({f}) => {
  const k = imp(f, [0, 84]);
  return (
    <div style={{position: 'absolute', inset: 0, background: C.bg, overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, opacity: 0.07,
        backgroundImage: 'repeating-linear-gradient(0deg, #fff 0, #fff 1px, transparent 1px, transparent 6px)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 70, textAlign: 'center'}}>
        <GlassBadge title="Monzoma Digital" sub="حلول وتحليل البيانات" accent={C.cyan} titleSize={46} subSize={26} f={f} />
      </div>
      <Word text="تأسيس" top={175} f={f} ts={[0, 40, 150]} rot={-1.2} />
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
        {/* kinetic echoes (outline only) so the hollow itself never moves */}
        {[2, 1].map((e) => (
          <g key={e} transform={`translate(540 900) scale(${1 + 0.1 * e * Math.exp(-f / 16) + 0.12 * k}) translate(-540 -900)`} opacity={0.55 * Math.exp(-f / 16) / e + 0.25 * Math.max(0, k)}>
            <path d={PLUS} fill="none" stroke={C.yellow} strokeWidth={4} fillRule="evenodd" />
          </g>
        ))}
        <path d={PLUS} fill={C.yellow} fillRule="evenodd" />
        {/* portal frame: the camera dives through this hollow */}
        <rect x={468} y={776} width={144} height={248} fill="none" stroke={C.white} strokeWidth={4} />
      </svg>
      <Word text="تطبيق" top={1325} f={f} ts={[0, 100, 170]} rot={1.2} />
    </div>
  );
};
