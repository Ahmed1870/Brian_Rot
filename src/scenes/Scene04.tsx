import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, S} from '../theme';
import {B} from '../layout';
import {cairo, mono} from '../fonts';
import {Caption, Card, Defs, Scene, Tag, Title, ease, fs, prog} from '../common';

const FIX = 450; // frame where "= NULL" is corrected to "IS NULL"

// ---- logic gate shapes (local coords, gate body ~150x120) ----
const OrGate: React.FC<{x: number; y: number; color: string}> = ({x, y, color}) => (
  <path d={`M ${x} ${y} Q ${x + 40} ${y + 60} ${x} ${y + 120} Q ${x + 100} ${y + 120} ${x + 150} ${y + 60} Q ${x + 100} ${y} ${x} ${y} Z`} fill={C.bg2} stroke={color} strokeWidth={5} />
);
const AndGate: React.FC<{x: number; y: number; color: string}> = ({x, y, color}) => (
  <path d={`M ${x} ${y} L ${x + 70} ${y} A 60 60 0 0 1 ${x + 70} ${y + 120} L ${x} ${y + 120} Z`} fill={C.bg2} stroke={color} strokeWidth={5} />
);

export const Scene04: React.FC = () => {
  const f = useCurrentFrame();
  const c = B.s4.circuit, t = B.s4.trap;
  const dim = 1 - 0.55 * prog(f, 500, 560);
  const wire = (d: string, on: boolean, col: string) => (
    <path d={d} fill="none" stroke={on ? col : C.line} strokeWidth={on ? 6 : 4} strokeDasharray={on ? '14 12' : undefined} strokeDashoffset={on ? -f * 3 : undefined} strokeLinecap="round" />
  );
  const sig = prog(f, 90, 140); // signals start flowing

  // circuit anchor points (absolute)
  const X0 = c.x + 36;
  const inY = [c.y + 190, c.y + 300, c.y + 520];
  const orX = c.x + 520, orY = c.y + 215;
  const andX = c.x + 730, andY = c.y + 340;
  const true1 = true, false2 = false, true3 = true;
  const orOut = true1 || false2;
  const andOut = orOut && true3;

  // trap state
  const showFix = f >= FIX;
  const unknownAmt = prog(f, 120, 200);
  const label = showFix ? 'phone IS NULL' : 'phone = NULL';

  return (
    <Scene dur={S.s4.dur} accent={C.amber}>
      <Title ar="المنطق المركّب والقيم المفقودة" en="AND · OR · NOT · IS NULL" chip="SC 04 · LOGIC" accent={C.amber} />

      {/* ---------- compound condition circuit ---------- */}
      <Card box={c} accent={C.line} at={6} style={{opacity: dim}}>
        <div style={{position: 'absolute', left: 30, top: 22, direction: 'ltr', fontFamily: mono, fontWeight: 700, color: C.text, fontSize: fs("WHERE (status = 'Active' OR points > 1000) AND phone IS NOT NULL", c.w - 60, 30, mono), whiteSpace: 'nowrap'}}>
          <span style={{color: C.pink}}>WHERE</span> (status = <span style={{color: C.amber}}>'Active'</span> <span style={{color: C.pink}}>OR</span> points &gt; 1000) <span style={{color: C.pink}}>AND</span> phone <span style={{color: C.pink}}>IS NOT NULL</span>
        </div>
      </Card>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity: dim}}>
        <Defs />
        {/* wires */}
        {wire(`M ${X0 + 340} ${inY[0]} L ${orX - 20} ${inY[0]} L ${orX - 20} ${orY + 35} L ${orX + 14} ${orY + 35}`, sig > 0 && true1, C.green)}
        {wire(`M ${X0 + 340} ${inY[1]} L ${orX - 20} ${inY[1]} L ${orX - 20} ${orY + 85} L ${orX + 14} ${orY + 85}`, false, C.green)}
        {wire(`M ${orX + 150} ${orY + 60} L ${andX - 40} ${orY + 60} L ${andX - 40} ${andY + 35} L ${andX} ${andY + 35}`, sig > 0.5 && orOut, C.green)}
        {wire(`M ${X0 + 340} ${inY[2]} L ${andX - 40} ${inY[2]} L ${andX - 40} ${andY + 85} L ${andX} ${andY + 85}`, sig > 0.5 && true3, C.green)}
        {wire(`M ${andX + 130} ${andY + 60} L ${c.x + c.w - 36} ${andY + 60}`, sig > 0.8 && andOut, C.green)}
        <OrGate x={orX} y={orY} color={sig > 0.5 ? C.green : C.line} />
        <AndGate x={andX} y={andY} color={sig > 0.8 ? C.green : C.line} />
        <text x={orX + 62} y={orY + 70} textAnchor="middle" fontFamily={mono} fontSize={30} fontWeight={700} fill={C.text}>OR</text>
        <text x={andX + 52} y={andY + 70} textAnchor="middle" fontFamily={mono} fontSize={28} fontWeight={700} fill={C.text}>AND</text>
        {/* parentheses hint */}
        <text x={orX + 75} y={orY - 18} textAnchor="middle" fontFamily={mono} fontSize={34} fontWeight={700} fill={C.amber}>( )</text>
        {/* inputs */}
        {[
          {t: "status = 'Active'", v: true1, y: inY[0]},
          {t: 'points > 1000', v: false2, y: inY[1]},
          {t: 'phone IS NOT NULL', v: true3, y: inY[2]},
        ].map((n, i) => (
          <g key={i} opacity={prog(f, 20 + i * 16, 50 + i * 16)}>
            <rect x={X0} y={n.y - 34} width={340} height={68} rx={16} fill={C.bg2} stroke={sig > 0 ? (n.v ? C.green : C.dim) : C.line} strokeWidth={3} />
            <text x={X0 + 20} y={n.y + 11} fontFamily={mono} fontSize={fs(n.t, 230, 28, mono)} fontWeight={700} fill={C.text}>{n.t}</text>
            <text x={X0 + 322} y={n.y + 9} textAnchor="end" fontFamily={mono} fontSize={22} fontWeight={700} fill={n.v ? C.green : C.dim} opacity={sig}>{n.v ? 'T' : 'F'}</text>
          </g>
        ))}
        {/* result */}
        <g opacity={prog(f, 190, 230)}>
          <rect x={c.x + c.w - 178} y={andY + 140} width={150} height={52} rx={14} fill="rgba(16,185,129,0.18)" stroke={C.green} strokeWidth={3} />
          <text x={c.x + c.w - 103} y={andY + 176} textAnchor="middle" fontFamily={mono} fontSize={28} fontWeight={700} fill={C.green}>TRUE</text>
        </g>
      </svg>

      {/* ---------- three-valued logic trap ---------- */}
      <Card box={t} accent={showFix ? C.green : C.amber} at={30}>
        <div style={{position: 'absolute', left: 30, right: 30, top: 24, height: 70, display: 'flex', alignItems: 'center', direction: 'ltr'}}>
          <span style={{fontFamily: mono, fontSize: 44, fontWeight: 700, color: showFix ? C.green : C.amber}}>
            <span style={{color: C.pink}}>WHERE</span> {label}
          </span>
          {!showFix && <span style={{marginLeft: 16, width: 'auto', height: 5, flex: 1, background: C.red, opacity: prog(f, 300, 340) * 0.9, borderRadius: 3, transform: 'translateY(-4px)'}} />}
        </div>

        {/* comparator */}
        <svg width={t.w} height={t.h} style={{position: 'absolute', inset: 0}}>
          <Defs />
          <rect x={40} y={140} width={190} height={74} rx={16} fill={C.bg2} stroke={C.line} strokeWidth={3} />
          <text x={135} y={188} textAnchor="middle" fontFamily={mono} fontSize={32} fontWeight={700} fill={C.text}>NULL</text>
          <text x={135} y={128} textAnchor="middle" fontFamily={mono} fontSize={22} fontWeight={700} fill={C.dim}>phone</text>
          <rect x={290} y={110} width={180} height={134} rx={22} fill={C.bg2} stroke={showFix ? C.green : C.amber} strokeWidth={5} filter="url(#glow)" />
          <text x={380} y={187} textAnchor="middle" fontFamily={mono} fontSize={showFix ? 30 : 56} fontWeight={700} fill={showFix ? C.green : C.amber}>{showFix ? 'IS NULL' : '='}</text>
          <rect x={530} y={140} width={190} height={74} rx={16} fill={C.bg2} stroke={C.line} strokeWidth={3} />
          <text x={625} y={188} textAnchor="middle" fontFamily={mono} fontSize={32} fontWeight={700} fill={C.text}>{showFix ? 'phone' : 'NULL'}</text>
          <line x1={230} y1={177} x2={290} y2={177} stroke={C.dim} strokeWidth={4} strokeDasharray="8 8" strokeDashoffset={-f * 3} />
          <line x1={470} y1={177} x2={530} y2={177} stroke={C.dim} strokeWidth={4} strokeDasharray="8 8" strokeDashoffset={-f * 3} />
          {/* result bubble */}
          <g opacity={showFix ? prog(f, FIX + 20, FIX + 60) : unknownAmt}>
            <circle cx={t.w / 2} cy={340} r={showFix ? 62 : 66} fill={showFix ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'} stroke={showFix ? C.green : C.amber} strokeWidth={5} filter="url(#glow)" />
            <text x={t.w / 2} y={showFix ? 352 : 360} textAnchor="middle" fontFamily={mono} fontSize={showFix ? 30 : 72} fontWeight={700} fill={showFix ? C.green : C.amber}>{showFix ? 'TRUE' : '?'}</text>
          </g>
          <text x={t.w / 2} y={450} textAnchor="middle" fontFamily={mono} fontSize={38} fontWeight={700} fill={showFix ? C.green : C.amber}>{showFix ? 'TRUE / FALSE' : 'UNKNOWN'}</text>
        </svg>
        <div style={{position: 'absolute', left: 30, right: 30, top: 478, textAlign: 'center', direction: 'rtl', fontFamily: cairo, fontWeight: 900, fontSize: 34, color: showFix ? C.green : C.red, opacity: showFix ? prog(f, FIX + 60, FIX + 100) : prog(f, 230, 280)}}>
          {showFix ? 'التقييم صح: بيجيب الصفوف اللي رقم تليفونها مفقود' : 'التقييم بيفشل: صفر صفوف رجعت'}
        </div>
        {/* 3-valued legend */}
        <div style={{position: 'absolute', left: 30, right: 30, bottom: 26, display: 'flex', justifyContent: 'space-between', direction: 'ltr'}}>
          {[['TRUE', C.green], ['FALSE', C.dim], ['UNKNOWN', C.amber]].map(([k, col]) => (
            <div key={k} style={{flex: 1, margin: '0 6px', height: 62, borderRadius: 14, border: `2px solid ${col}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: mono, fontWeight: 700, fontSize: 26, color: col, background: 'rgba(15,23,42,0.6)'}}>{k}</div>
          ))}
        </div>
      </Card>

      <Caption from={60} to={540} color={C.amber}>WHERE phone = NULL ──► UNKNOWN (Fails to match!)</Caption>
      <Caption from={660} to={1080} color={C.green}>WHERE phone IS NULL ──► Evaluates to TRUE / FALSE correctly</Caption>
    </Scene>
  );
};
