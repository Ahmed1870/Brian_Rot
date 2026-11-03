import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, S} from '../theme';
import {B} from '../layout';
import {cairo, mono} from '../fonts';
import {Caption, Card, Defs, Scene, Tag, Title, ease, fs, lerp, prog} from '../common';

const ROWS = [
  {o: '#1', p: 'P1', k: 'm'}, {o: '#2', p: 'P2', k: 'm'}, {o: '#3', p: 'P3', k: 'm'},
  {o: '#4', p: 'NULL', k: 'l'}, {o: '#5', p: 'NULL', k: 'l'},
  {o: 'NULL', p: 'P4', k: 'r'}, {o: 'NULL', p: 'P5', k: 'r'},
];
const CW = 170, CH = 56, CY = 545, R = 270;

export const Scene01: React.FC = () => {
  const f = useCurrentFrame();
  const V = B.s1.venn, D = B.s1.side;
  const cx = V.x + V.w / 2;
  const slide = ease(prog(f, 0, 90)); // circles settle into the overlap
  const lx = lerp(cx - 300, cx - 170, slide), rx = lerp(cx + 300, cx + 170, slide);
  const hi = prog(f, 181, 260); // matched keys light up blue
  const pad = ease(prog(f, 541, 640)); // NULL blocks slide in

  const chip = (x: number, y: number, label: string, color: string, o: number, key: string) => (
    <g key={key} opacity={o}>
      <rect x={x - CW / 2} y={y - CH / 2} width={CW} height={CH} rx={14} fill={C.panel2} stroke={color} strokeWidth={3} />
      <text x={x} y={y + 10} textAnchor="middle" fontFamily={mono} fontSize={28} fontWeight={700} fill={C.text}>{label}</text>
    </g>
  );

  return (
    <Scene dur={S.s1.dur} accent={C.blue}>
      <Title ar="الربط الشامل الكامل" en="FULL OUTER JOIN & Full Union" chip="SC 01 · FULL UNION" accent={C.blue} />

      <Card box={V} accent={C.line} at={4} />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <Defs />
        <clipPath id="clipR"><circle cx={rx} cy={CY} r={R} /></clipPath>
        <circle cx={lx} cy={CY} r={R} fill="rgba(245,158,11,0.16)" stroke={C.amber} strokeWidth={5} opacity={prog(f, 5, 35)} />
        <circle cx={rx} cy={CY} r={R} fill="rgba(168,85,247,0.16)" stroke={C.purple} strokeWidth={5} opacity={prog(f, 5, 35)} />
        <g clipPath="url(#clipR)" opacity={hi}><circle cx={lx} cy={CY} r={R} fill="rgba(56,189,248,0.34)" filter="url(#softglow)" /></g>
        <text x={lx - 40} y={V.y + 44} textAnchor="middle" fontFamily={mono} fontSize={32} fontWeight={700} fill={C.amber} opacity={prog(f, 20, 50)}>orders</text>
        <text x={rx + 40} y={V.y + 44} textAnchor="middle" fontFamily={mono} fontSize={32} fontWeight={700} fill={C.purple} opacity={prog(f, 20, 50)}>payments</text>

        {/* left-only orders / right-only payments / matched pills */}
        {[0, 1].map((i) => chip(lx - 110, CY - 45 + i * 90, '#' + (4 + i), C.amber, prog(f, 60 + i * 12, 90 + i * 12), 'lo' + i))}
        {[0, 1].map((i) => chip(rx + 110, CY - 45 + i * 90, 'P' + (4 + i), C.purple, prog(f, 60 + i * 12, 90 + i * 12), 'ro' + i))}
        {[0, 1, 2].map((i) => (
          <g key={'m' + i} opacity={prog(f, 40 + i * 12, 70 + i * 12)}>
            <rect x={cx - 100} y={CY - 90 + i * 90 - 30} width={200} height={60} rx={16} fill={`rgba(56,189,248,${0.12 + 0.2 * hi})`} stroke={C.blue} strokeWidth={4} filter={hi > 0.5 ? 'url(#glow)' : undefined} />
            <text x={cx} y={CY - 90 + i * 90 + 10} textAnchor="middle" fontFamily={mono} fontSize={28} fontWeight={700} fill={C.text}>#{i + 1} ⇄ P{i + 1}</text>
          </g>
        ))}
      </svg>
      <div style={{position: 'absolute', left: V.x + 30, top: V.y + V.h - 62, width: V.w - 60, textAlign: 'center', direction: 'rtl', fontFamily: cairo, fontWeight: 900, fontSize: 30, color: C.blue, opacity: prog(f, 700, 750)}}>مفيش ولا سطر بيانات بيروح هدر</div>

      {/* result table */}
      <Card box={D} accent={C.blue} at={120}>
        <div style={{position: 'absolute', left: 28, right: 28, top: 22, direction: 'ltr', fontFamily: mono, fontWeight: 700, color: C.text, lineHeight: 1.45}}>
          {[['SELECT', ' o.order_id, p.payment_id'], ['FROM', ' orders o'], ['FULL OUTER JOIN', ' payments p'], ['  ON', ' o.order_id = p.order_id;']].map(([k, v], i) => (
            <div key={i} style={{whiteSpace: 'pre', fontSize: fs('FULL OUTER JOIN payments p', D.w - 56, 26, mono), opacity: prog(f, 130 + i * 12, 160 + i * 12)}}><span style={{color: C.pink}}>{k}</span>{v}</div>
          ))}
        </div>
        <div style={{position: 'absolute', left: 28, right: 28, top: 214, display: 'flex', gap: 24, direction: 'ltr', fontFamily: mono, fontWeight: 700, fontSize: 22, opacity: prog(f, 260, 300)}}>
          <span style={{width: 240, color: C.amber}}>order_id</span><span style={{color: C.purple}}>payment_id</span>
        </div>
        {ROWS.map((r, i) => {
          const o = prog(f, 280 + i * 14, 310 + i * 14);
          const nullOrder = r.o === 'NULL', nullPay = r.p === 'NULL';
          const nSlide = (dir: number) => ({transform: `translateX(${(1 - pad) * 160 * dir}px)`, opacity: pad});
          const cell = (txt: string, isNull: boolean, color: string, dir: number) => (
            <div style={{width: 240, height: 44, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: mono, fontWeight: 700, fontSize: 24, color: isNull ? C.dim : C.text, background: isNull ? 'rgba(148,163,184,0.18)' : 'rgba(15,23,42,0.6)', border: `2px solid ${isNull ? C.dim : color}`, ...(isNull ? nSlide(dir) : {})}}>{txt}</div>
          );
          return (
            <div key={i} style={{position: 'absolute', left: 28, top: 252 + i * 58, display: 'flex', gap: 24, direction: 'ltr', opacity: o}}>
              {cell(r.o, nullOrder, r.k === 'm' ? C.blue : C.amber, -1)}
              {cell(r.p, nullPay, r.k === 'm' ? C.blue : C.purple, 1)}
            </div>
          );
        })}
      </Card>

      <Caption from={60} to={540} ltr={false} color={C.blue}>الربط الشامل الكامل | FULL OUTER JOIN & Full Union</Caption>
      <Caption from={660} to={1140} color={C.green}>FULL OUTER JOIN ──► Preserves ALL Rows from Both Left & Right Tables</Caption>
    </Scene>
  );
};
