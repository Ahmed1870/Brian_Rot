import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, S} from '../theme';
import {B} from '../layout';
import {cairo, mono} from '../fonts';
import {Caption, Card, Defs, Scene, Tag, Title, ease, lerp, prog} from '../common';

const CATS = ['إلكترونيات', 'ملابس', 'أثاث', 'كتب'];
const MON = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'];

export const Scene04: React.FC = () => {
  const f = useCurrentFrame();
  const D = B.s4.danger, E = B.s4.dense;
  const boom = ease(prog(f, 120, 420));
  const rows = Math.round(boom * 100_000_000);
  const shake = f > 300 && f < 440 ? Math.sin(f * 2.6) * 7 : 0;
  const ram = boom;
  const GX = 130, GW = 108, GY = 190, GH = 92;
  const cells = Math.round(ease(prog(f, 460, 900)) * 24);

  const gcx = D.w / 2, gcy = 520, gr = 120;
  const ang = Math.PI * (1 - ram);
  const gx = gcx + gr * Math.cos(ang), gy = gcy - gr * Math.sin(ang);

  return (
    <Scene dur={S.s4.dur} accent={C.red}>
      <Title ar="مخاطر الأداء والتقارير المكتملة" en="CROSS JOIN: Danger vs Dense Reporting" chip="SC 04 · PERFORMANCE" accent={C.red} />

      <Card box={D} accent={C.red} at={6} style={{transform: `translateX(${shake}px)`}}>
        <div style={{position: 'absolute', left: 30, top: 24, direction: 'ltr'}}><Tag color={C.red}>ACCIDENTAL CROSS JOIN</Tag></div>
        <div style={{position: 'absolute', left: 30, right: 30, top: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 28, direction: 'ltr', opacity: prog(f, 20, 60)}}>
          {['10,000', '10,000'].map((t, i) => (
            <React.Fragment key={i}>
              {i === 1 && <span style={{fontFamily: mono, fontWeight: 700, fontSize: 56, color: C.red}}>×</span>}
              <div style={{width: 250, height: 92, borderRadius: 18, border: `3px solid ${C.line}`, background: C.panel2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                <span style={{fontFamily: mono, fontWeight: 700, fontSize: 40, color: C.text}}>{t}</span>
                <span style={{fontFamily: mono, fontWeight: 700, fontSize: 20, color: C.dim}}>rows</span>
              </div>
            </React.Fragment>
          ))}
        </div>
        <div style={{position: 'absolute', left: 30, right: 30, top: 200, textAlign: 'center', direction: 'ltr', fontFamily: mono, fontWeight: 700, fontSize: 76, color: C.red, opacity: prog(f, 100, 140)}}>{rows.toLocaleString('en-US')}</div>
        <div style={{position: 'absolute', left: 30, right: 30, top: 300, textAlign: 'center', direction: 'rtl', fontFamily: cairo, fontWeight: 900, fontSize: 30, color: C.red, opacity: prog(f, 380, 430)}}>مئة مليون سطر في الذاكرة!</div>
        <svg width={D.w} height={D.h} style={{position: 'absolute', inset: 0}}>
          <path d={`M ${gcx - gr} ${gcy} A ${gr} ${gr} 0 0 1 ${gcx + gr} ${gcy}`} fill="none" stroke={C.line} strokeWidth={24} strokeLinecap="round" />
          {ram > 0.01 && <path d={`M ${gcx - gr} ${gcy} A ${gr} ${gr} 0 0 1 ${gx} ${gy}`} fill="none" stroke={ram > 0.7 ? C.red : C.amber} strokeWidth={24} strokeLinecap="round" />}
          <text x={gcx} y={gcy - 10} textAnchor="middle" fontFamily={mono} fontSize={52} fontWeight={700} fill={ram > 0.7 ? C.red : C.amber}>{Math.round(ram * 100)}%</text>
          <text x={gcx} y={gcy + 40} textAnchor="middle" fontFamily={mono} fontSize={26} fontWeight={700} fill={C.dim}>RAM</text>
        </svg>
        <div style={{position: 'absolute', left: 30, right: 30, bottom: 26, textAlign: 'center', direction: 'rtl', fontFamily: cairo, fontWeight: 900, fontSize: 30, color: C.red, opacity: prog(f, 400, 450) * (f > 460 ? 0.6 : 1)}}>استنزاف الـ RAM وشلل السيرفر</div>
      </Card>

      <Card box={E} accent={C.green} at={440}>
        <div style={{position: 'absolute', left: 30, top: 24, direction: 'ltr'}}><Tag color={C.green}>DENSE REPORTING SKELETON</Tag></div>
        <div style={{position: 'absolute', left: 30, right: 30, top: 64, direction: 'ltr', fontFamily: mono, fontWeight: 700, fontSize: 28, color: C.text}}>categories <span style={{color: C.green}}>×</span> months</div>
        {MON.map((m, j) => (<div key={m} style={{position: 'absolute', left: GX + j * GW, top: 140, width: GW - 10, textAlign: 'center', fontFamily: cairo, fontWeight: 700, fontSize: 22, color: C.dim, opacity: prog(f, 470 + j * 8, 500 + j * 8)}}>{m}</div>))}
        {CATS.map((c, i) => (<div key={c} style={{position: 'absolute', left: 10, top: GY + i * GH, width: GX - 22, height: GH - 12, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', fontFamily: cairo, fontWeight: 700, fontSize: 21, color: C.blue, opacity: prog(f, 470 + i * 8, 500 + i * 8)}}>{c}</div>))}
        {CATS.flatMap((_, i) => MON.map((__, j) => {
          const idx = i * 6 + j; const on = idx < cells;
          return <div key={idx} style={{position: 'absolute', left: GX + j * GW, top: GY + i * GH, width: GW - 10, height: GH - 12, borderRadius: 12, border: `3px solid ${on ? C.green : C.line}`, borderStyle: on ? 'solid' : 'dashed', background: on ? 'rgba(16,185,129,0.14)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: mono, fontWeight: 700, fontSize: 24, color: C.green, opacity: on ? 1 : 0.35}}>{on ? '—' : ''}</div>;
        }))}
        <div style={{position: 'absolute', left: 30, right: 30, bottom: 26, textAlign: 'center', direction: 'rtl', fontFamily: cairo, fontWeight: 900, fontSize: 30, color: C.green, opacity: prog(f, 900, 950)}}>24 خانة جاهزة، ولا فئة ناقصة</div>
      </Card>
      <svg width={0} height={0}><Defs /></svg>

      <Caption from={60} to={540} color={C.red}>Accidental CROSS JOIN Trap ──► 10,000 × 10,000 = 100M Rows (RAM Strain)</Caption>
      <Caption from={660} to={1080} color={C.green}>Dense Reporting Skeleton ──► Ensures Zero-Missing Category/Date Matrices</Caption>
    </Scene>
  );
};
