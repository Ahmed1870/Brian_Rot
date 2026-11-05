import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Chip, Sql, Stage, TopBadge, Win, clamp, lerp, lin, pop, sec} from '../kit';
import {BRANCHES, LONG, QS} from '../data';

// SC01 (0-40s): pivoting - a long vertical table rotates into a horizontal matrix.
// Anchors (s): 1.2 welcome | 6.5 after CASE WHEN | 16.8 Pivot Tables | 19.7 Pivoting | 24.2 adjacent columns | 26.7 conditional aggregation | 31.6 FILTER | 34.9 cleaner
const S = START.s1;
const t = (g: number) => sec(g - S);
const RH = 46;
const LY = 180 + 56 + 52;
const MX = 900;
const mcx = (c: number) => MX + 20 + 220 + c * 170 + 85;
const mcy = (r: number) => 180 + 56 + 52 + r * 88 + 44;

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const left = clamp(lin(f, t(1.5), 16));
  const mat = clamp(lin(f, t(16.8), 18));
  const hdr = clamp(lin(f, t(24.2), 14));
  const spin = f > t(16.8) && f < t(30) ? (f - t(16.8)) * 6 : 0;
  const flights: React.ReactNode[] = [];

  return (
    <Stage dur={1200} inFx="zoom" outFx="left">
      <TopBadge text="التجميع الشرطي المتقدم | Advanced Conditional Aggregation & Pivoting" from={sec(2)} to={sec(18)} color={C.blue} />

      <Win x={80} y={180} w={620} h={684} title="branch_sales · vertical" opacity={left}>
        <div dir="ltr" style={{position: 'absolute', left: 0, right: 0, top: 0, height: 52, display: 'flex', alignItems: 'center', padding: '0 26px', fontFamily: MONO, fontSize: 22, color: C.muted, borderBottom: `1px solid ${C.border}`}}>
          <span style={{width: 200}}>branch</span><span style={{width: 130}}>quarter</span><span>amount</span>
        </div>
        {LONG.map((r, i) => {
          const st = t(19.7 + i * 0.3);
          const sent = f >= st + 28;
          const p = clamp(lin(f, t(2 + i * 0.2), 10));
          return (
            <div key={i} dir="ltr" style={{position: 'absolute', left: 12, right: 12, top: 56 + i * RH, height: RH - 4, borderRadius: 8, display: 'flex', alignItems: 'center', padding: '0 14px', fontFamily: MONO, fontSize: 24, opacity: p * (sent ? 0.3 : 1), background: f >= st && !sent ? `${C.blue}33` : 'transparent', color: C.text}}>
              <span style={{width: 200}}>{r.branch}</span><span style={{width: 130, color: C.green}}>{r.q}</span><span>{r.amount}K</span>
            </div>
          );
        })}
      </Win>

      {/* pivot engine */}
      <div style={{position: 'absolute', left: 724, top: 380, width: 150, height: 150, opacity: mat}}>
        <svg width={150} height={150} viewBox="0 0 150 150" style={{transform: `rotate(${spin}deg)`, filter: `drop-shadow(0 0 14px ${C.blue})`}}>
          <circle cx={75} cy={75} r={62} fill={`${C.blue}18`} stroke={C.blue} strokeWidth={5} />
          <path d="M75 25 A50 50 0 0 1 125 75" fill="none" stroke={C.blue} strokeWidth={8} strokeLinecap="round" />
          <polygon points="125,55 140,80 112,80" fill={C.blue} />
          <path d="M75 125 A50 50 0 0 1 25 75" fill="none" stroke={C.green} strokeWidth={8} strokeLinecap="round" />
          <polygon points="25,95 10,70 38,70" fill={C.green} />
        </svg>
        <div dir="ltr" style={{position: 'absolute', left: 0, right: 0, bottom: -34, textAlign: 'center', fontFamily: MONO, fontSize: 22, fontWeight: 700, color: C.blue}}>PIVOT 90°</div>
      </div>

      {/* horizontal matrix */}
      <Win x={MX} y={180} w={940} h={460} title="pivot · horizontal matrix" accent={hdr > 0.5 ? C.green : C.border} opacity={mat}>
        <div dir="ltr" style={{position: 'absolute', left: 20, right: 20, top: 0, height: 52, display: 'flex', alignItems: 'center', fontFamily: MONO, fontSize: 26, fontWeight: 700}}>
          <span style={{width: 220, color: C.muted}}>branch</span>
          {QS.map((q) => (
            <span key={q} style={{width: 170, textAlign: 'center', color: hdr > 0.3 ? C.green : C.muted, textShadow: hdr > 0.3 ? `0 0 16px ${C.green}` : 'none'}}>{q}</span>
          ))}
        </div>
        {BRANCHES.map((b, bi) => (
          <div key={b} dir="ltr" style={{position: 'absolute', left: 20, top: 52 + bi * 88, height: 80, width: 220, display: 'flex', alignItems: 'center', fontFamily: MONO, fontSize: 30, fontWeight: 700, color: C.text}}>{b}</div>
        ))}
        {LONG.map((r, i) => {
          const p = lin(f, t(19.7 + i * 0.3), 28);
          if (p < 1) return null;
          return (
            <div key={i} dir="ltr" style={{position: 'absolute', left: 20 + 220 + r.qi * 170 + 8, top: 52 + r.bi * 88 + 8, width: 154, height: 64, borderRadius: 12, border: `3px solid ${C.green}`, background: `${C.green}1c`, color: C.text, fontFamily: MONO, fontSize: 30, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 16px ${C.green}55`}}>{r.amount}K</div>
          );
        })}
      </Win>
      {LONG.map((r, i) => {
        const p = lin(f, t(19.7 + i * 0.3), 28);
        if (p <= 0 || p >= 1) return null;
        const e = p * p * (3 - 2 * p);
        return (
          <div key={i} dir="ltr" style={{position: 'absolute', left: lerp(520, mcx(r.qi), e) - 60, top: lerp(LY + i * RH + 21, mcy(r.bi), e) - 22, width: 120, height: 44, borderRadius: 22, background: C.blue, color: C.bg, fontFamily: MONO, fontWeight: 700, fontSize: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 18px ${C.blue}`}}>{r.amount}K</div>
        );
      })}
      {flights}

      {/* FILTER teaser */}
      <div dir="ltr" style={{boxSizing: 'border-box', position: 'absolute', left: 900, top: 690, width: 940, height: 170, borderRadius: 22, background: C.card, border: `3px solid ${C.green}`, padding: '18px 30px', opacity: clamp(lin(f, t(31.6), 16)), transform: `translateY(${(1 - clamp(lin(f, t(31.6), 16))) * 24}px)`, fontFamily: MONO}}>
        <div style={{fontSize: 24, color: C.green, fontWeight: 700}}>FILTER (WHERE ...)</div>
        <div style={{fontSize: 30, marginTop: 14}}><Sql text="SUM(amount) FILTER (WHERE quarter = 1)" /></div>
        <div style={{marginTop: 12, opacity: clamp(lin(f, t(34.9), 12))}}><Chip color={C.green} style={{fontSize: 22}}>✓ cleaner &amp; easier to read</Chip></div>
      </div>
      <Caption text="Row-to-Column Pivot ──► Transforms Vertical Data to Horizontal Matrix" from={sec(22)} to={sec(38)} />
    </Stage>
  );
};
