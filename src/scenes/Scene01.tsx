import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, S} from '../theme';
import {B} from '../layout';
import {cairo, mono} from '../fonts';
import {Caption, Card, Defs, Scene, Title, ease, fs, lerp, prog} from '../common';

const MGR = [null, 1, 1, 2, 2]; // manager_id per employee_id 1..5
const CWD = 520, HEAD = 64, COLH = 40, RP = 54, TOP = 36;
const rowY = (i: number) => TOP + HEAD + COLH + i * RP; // relative to stage

const TCard: React.FC<{x: number; color: string; alias: string; show: number; split: number}> = ({x, color, alias, show, split}) => (
  <div style={{position: 'absolute', left: x, top: TOP, width: CWD, height: HEAD + COLH + 5 * RP + 18, borderRadius: 22, background: 'linear-gradient(160deg,#223047,#16203A)', border: `3px solid ${split > 0.4 ? color : C.line}`, opacity: show, boxShadow: '0 18px 40px rgba(0,0,0,0.45)', direction: 'ltr'}}>
    <div style={{height: HEAD, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px'}}>
      <span style={{fontFamily: mono, fontWeight: 700, fontSize: 30, color: C.text}}>employees</span>
      <span style={{fontFamily: mono, fontWeight: 700, fontSize: 28, color: C.bg, background: color, borderRadius: 999, padding: '2px 20px', opacity: split > 0.4 ? 1 : 0}}>{alias}</span>
    </div>
    <div style={{height: COLH, display: 'flex', justifyContent: 'space-between', padding: '0 24px', alignItems: 'center', fontFamily: mono, fontWeight: 700, fontSize: 22, color: C.dim}}><span>employee_id</span><span style={{color: split > 0.4 ? color : C.dim}}>manager_id</span></div>
    {MGR.map((m, i) => (
      <div key={i} style={{height: RP - 8, margin: '0 14px 8px', borderRadius: 10, background: C.panel2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 14px', fontFamily: mono, fontWeight: 700, fontSize: 26, color: C.text}}>
        <span>{i + 1}</span><span style={{color: m === null ? C.amber : C.text}}>{m === null ? 'NULL' : m}</span>
      </div>
    ))}
  </div>
);

export const Scene01: React.FC = () => {
  const f = useCurrentFrame();
  const St = B.s1.stage, N = B.s1.note;
  const split = ease(prog(f, 181, 360));
  const eX = lerp(640, 140, split), mX = lerp(640, 1140, split);
  const eEdge = St.x + 140 + CWD, mEdge = St.x + 1140;
  const LABEL = 'employees e  ──[ e.manager_id = m.employee_id ]──►  employees m';

  return (
    <Scene dur={S.s1.dur} accent={C.blue}>
      <Title ar="الربط الذاتي" en="SELF JOIN & Self-Referential Schema" chip="SC 01 · SELF JOIN" accent={C.blue} />
      <Card box={St} accent={C.line} at={4} />
      <div style={{position: 'absolute', left: St.x, top: St.y, width: St.w, height: St.h}}>
        <TCard x={mX} color={C.purple} alias="m" show={split > 0.02 ? split : 0} split={split} />
        <TCard x={eX} color={C.blue} alias="e" show={prog(f, 10, 40)} split={split} />
      </div>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <Defs />
        {MGR.map((m, i) => {
          if (m === null) return null;
          const t = ease(prog(f, 541 + i * 14, 620 + i * 14));
          const y1 = St.y + rowY(i) + 23, y2 = St.y + rowY(m - 1) + 23;
          const x2 = lerp(eEdge, mEdge, t), ye = lerp(y1, y2, t);
          return t > 0 ? <path key={i} d={`M ${eEdge} ${y1} C ${eEdge + 160 * t} ${y1}, ${x2 - 160 * t} ${ye}, ${x2} ${ye}`} fill="none" stroke={C.blue} strokeWidth={5} filter="url(#glow)" /> : null;
        })}
        <text x={(eEdge + mEdge) / 2} y={St.y + 80} textAnchor="middle" fontFamily={mono} fontSize={26} fontWeight={700} fill={C.blue} opacity={prog(f, 560, 600)}>e.manager_id → m.employee_id</text>
      </svg>

      <Card box={N} accent={C.line} at={540}>
        <div style={{position: 'absolute', left: 30, right: 30, top: 26, textAlign: 'center', direction: 'ltr', whiteSpace: 'nowrap', fontFamily: mono, fontWeight: 700, fontSize: fs(LABEL, N.w - 60, 46, mono), color: C.text}}>
          <span style={{color: C.blue}}>employees e</span>  ──[ <span style={{color: C.pink}}>e.manager_id = m.employee_id</span> ]──►  <span style={{color: C.purple}}>employees m</span>
        </div>
        <div style={{position: 'absolute', left: 30, right: 30, bottom: 28, textAlign: 'center', direction: 'rtl', fontFamily: cairo, fontWeight: 900, fontSize: 34, color: C.green, opacity: prog(f, 640, 700)}}>نفس الجدول ← نسختين افتراضيتين في الذاكرة</div>
      </Card>

      <Caption from={60} to={540} ltr={false} color={C.blue}>الربط الذاتي | SELF JOIN & Self-Referential Schema</Caption>
      <Caption from={660} to={1140} color={C.green}>employees e (Employees) ──[e.manager_id = m.employee_id]──► employees m (Managers)</Caption>
    </Scene>
  );
};
