import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, S} from '../theme';
import {B} from '../layout';
import {cairo, mono} from '../fonts';
import {Caption, Card, Defs, Scene, Tag, Title, ease, fs, prog} from '../common';

const EMP = [['أحمد', 'Sales', '18,500', '4539 …'], ['سارة', 'Finance', '22,000', '5105 …'], ['منى', 'IT', '16,800', '3782 …'], ['كريم', 'Sales', '14,200', '4916 …'], ['ليلى', 'HR', '19,300', '6011 …']];
const X = {n: 20, d: 190, s: 340, c: 520};
const RY = 190, RP = 80, RH = 66;
const Q = ['CREATE VIEW v_employee_public AS', 'SELECT name, department FROM employees;'];

export const Scene02: React.FC = () => {
  const f = useCurrentFrame();
  const R = B.s2.raw, V = B.s2.safe;
  const sweep = prog(f, 100, 360); // security laser goes down the rows
  const laserY = R.y + RY + sweep * 5 * RP;
  const safe = ease(prog(f, 360, 480));
  const lock = ease(prog(f, 840, 900));
  const cell = (x: number, w: number, i: number, txt: string, color: string, border: string, bg: string, fm = true) => (
    <div style={{position: 'absolute', left: x, top: RY + i * RP, width: w, height: RH, borderRadius: 12, border: `3px solid ${border}`, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fm ? mono : cairo, fontWeight: 700, fontSize: 26, color, direction: 'ltr'}}>{txt}</div>
  );

  return (
    <Scene dur={S.s2.dur} accent={C.green}>
      <Title ar="حماية البيانات ومنطق الأعمال" en="Security Shield · Data Governance" chip="SC 02 · SECURITY" accent={C.green} />

      <Card box={R} accent={C.red} at={6}>
        <div style={{position: 'absolute', left: 24, top: 18, direction: 'ltr'}}><Tag color={C.red}>employees · BASE TABLE</Tag></div>
        <div style={{position: 'absolute', left: 0, top: 138, direction: 'ltr', fontFamily: mono, fontWeight: 700, fontSize: 20}}>
          <span style={{position: 'absolute', left: X.n + 8, color: C.dim}}>name</span><span style={{position: 'absolute', left: X.d + 8, color: C.dim}}>dept</span>
          <span style={{position: 'absolute', left: X.s + 8, color: C.red}}>salary</span><span style={{position: 'absolute', left: X.c + 8, color: C.red, whiteSpace: 'nowrap'}}>credit_card</span>
        </div>
        {EMP.map((e, i) => {
          const masked = sweep * 5 > i + 0.5;
          const o = prog(f, 20 + i * 10, 50 + i * 10);
          return (
            <div key={i} style={{opacity: o}}>
              {cell(X.n, 150, i, e[0], C.text, C.line, C.panel2, false)}
              {cell(X.d, 130, i, e[1], C.text, C.line, C.panel2)}
              {cell(X.s, 160, i, masked ? '█████' : e[2], masked ? C.dim : C.red, masked ? C.green : C.red, masked ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.14)')}
              {cell(X.c, 330, i, masked ? '████████' : e[3], masked ? C.dim : C.red, masked ? C.green : C.red, masked ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.14)')}
            </div>
          );
        })}
      </Card>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <Defs />
        {sweep > 0 && sweep < 1 && <rect x={R.x + 12} y={laserY - 4} width={R.w - 24} height={7} rx={4} fill={C.green} filter="url(#glow)" />}
      </svg>

      <Card box={V} accent={C.green} at={340}>
        <div style={{position: 'absolute', left: 24, top: 18, direction: 'ltr'}}><Tag color={C.green}>v_employee_public · ANALYST VIEW</Tag></div>
        <div style={{position: 'absolute', left: 24, right: 24, top: 70, direction: 'ltr', fontFamily: mono, fontWeight: 700, color: C.text, lineHeight: 1.5}}>
          {Q.map((l, i) => (<div key={i} style={{whiteSpace: 'pre', fontSize: fs(Q[1], V.w - 48, 26, mono), color: i === 0 ? C.green : C.text, opacity: prog(f, 380 + i * 20, 410 + i * 20)}}>{l}</div>))}
        </div>
        <div style={{position: 'absolute', left: 24, right: 24, top: 190, direction: 'ltr', display: 'flex', fontFamily: mono, fontWeight: 700, fontSize: 20, color: C.dim, opacity: safe}}><span style={{width: 300}}>name</span><span>department</span></div>
        {EMP.map((e, i) => (
          <div key={i} style={{position: 'absolute', left: 24, right: 24, top: 226 + i * 74, height: 62, borderRadius: 12, border: `2px solid ${C.green}`, background: 'rgba(16,185,129,0.10)', display: 'flex', alignItems: 'center', padding: '0 20px', direction: 'ltr', opacity: prog(f, 440 + i * 24, 470 + i * 24)}}>
            <span style={{width: 276, fontFamily: cairo, fontWeight: 700, fontSize: 28, color: C.text, direction: 'rtl', textAlign: 'left'}}>{e[0]}</span>
            <span style={{fontFamily: mono, fontWeight: 700, fontSize: 26, color: C.text}}>{e[1]}</span>
          </div>
        ))}
        <div style={{position: 'absolute', left: 24, right: 24, bottom: 22, display: 'flex', alignItems: 'center', gap: 16, direction: 'rtl', opacity: lock, transform: `scale(${0.9 + 0.1 * lock})`}}>
          <svg width={50} height={58} viewBox="0 0 50 58" style={{flexShrink: 0}}><rect x={6} y={26} width={38} height={28} rx={6} fill={C.green} /><path d="M 14 26 V 18 A 11 11 0 0 1 36 18 V 26" fill="none" stroke={C.green} strokeWidth={5} /></svg>
          <span style={{fontFamily: cairo, fontWeight: 900, fontSize: 28, color: C.green}}>المحللون بيشوفوا المنظور بس، مش الجدول الأصلي</span>
        </div>
      </Card>

      <Caption from={60} to={600} color={C.green}>CREATE VIEW ──► Restricts Access to Sensitive Columns & Rows</Caption>
      <Caption from={720} to={1260} color={C.green}>Data Governance ──► Business Logic Isolation & Data Security</Caption>
    </Scene>
  );
};
