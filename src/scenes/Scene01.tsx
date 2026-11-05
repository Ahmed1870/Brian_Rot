import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, S} from '../theme';
import {B} from '../layout';
import {cairo, mono} from '../fonts';
import {Caption, Card, Defs, Scene, Tag, Title, ease, fs, prog} from '../common';

const SALES = [120, 135, 128, 150, 165, 158];
const MON = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'];
const RY = 110, RP = 90, RH = 76;
const X = {m: 30, s: 240, p: 520, g: 820};
const T = (i: number) => 181 + i * 55;

export const Scene01: React.FC = () => {
  const f = useCurrentFrame();
  const Bd = B.s1.board, D = B.s1.side;
  const cy = (i: number) => Bd.y + RY + i * RP + RH / 2;
  const cell = (x: number, w: number, i: number, txt: string, color: string, border: string, bg: string, o = 1, fontMono = true) => (
    <div style={{position: 'absolute', left: x, top: RY + i * RP, width: w, height: RH, borderRadius: 14, border: `3px solid ${border}`, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fontMono ? mono : cairo, fontWeight: 700, fontSize: 32, color, opacity: o, direction: 'ltr'}}>{txt}</div>
  );

  return (
    <Scene dur={S.s1.dur} accent={C.blue}>
      <Title ar="دوال الإزاحة والتحليل الزمني" en="Offset & Value Window Functions" chip="SC 01 · LAG" accent={C.blue} />

      <Card box={Bd} accent={C.line} at={4}>
        <div style={{position: 'absolute', left: 28, top: 20, direction: 'ltr'}}><Tag color={C.blue}>MONTHLY SALES ($K)</Tag></div>
        <div style={{position: 'absolute', left: 0, top: 68, direction: 'ltr', fontFamily: mono, fontWeight: 700, fontSize: 22, color: C.dim}}>
          <span style={{position: 'absolute', left: X.m + 8, whiteSpace: 'nowrap'}}>month</span>
          <span style={{position: 'absolute', left: X.s + 8}}>sales</span>
          <span style={{position: 'absolute', left: X.p + 8, color: C.blue, whiteSpace: 'nowrap'}}>LAG(sales,1,0)</span>
          <span style={{position: 'absolute', left: X.g + 8, color: C.green, whiteSpace: 'nowrap'}}>MoM growth</span>
        </div>
        {SALES.map((s, i) => {
          const on = f >= T(i);
          const act = f >= T(i) && f < T(i) + 55;
          const prev = i === 0 ? 0 : SALES[i - 1];
          const gr = i === 0 ? null : ((s - prev) / prev) * 100;
          const o = prog(f, 20 + i * 8, 50 + i * 8);
          return (
            <React.Fragment key={i}>
              {cell(X.m, 180, i, MON[i], C.text, act ? C.blue : C.line, C.panel2, o, false)}
              {cell(X.s, 220, i, '$' + s, C.text, act ? C.blue : C.line, C.panel2, o)}
              {cell(X.p, 260, i, '$' + prev, i === 0 ? C.amber : C.blue, on ? (i === 0 ? C.amber : C.blue) : C.line, on ? (i === 0 ? 'rgba(245,158,11,0.14)' : 'rgba(56,189,248,0.14)') : C.panel2, on ? 1 : 0.3)}
              {cell(X.g, 330, i, gr === null ? 'n/a' : `${gr >= 0 ? '+' : ''}${gr.toFixed(1)}%`, gr === null ? C.dim : gr >= 0 ? C.green : C.red, on && f >= T(i) + 25 ? (gr === null ? C.line : gr >= 0 ? C.green : C.red) : C.line, on && f >= T(i) + 25 ? 'rgba(16,185,129,0.10)' : C.panel2, on && f >= T(i) + 25 ? 1 : 0.3)}
            </React.Fragment>
          );
        })}
      </Card>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <Defs />
        {SALES.map((_, i) => {
          if (i === 0) return null;
          const t = prog(f, T(i), T(i) + 30);
          if (t <= 0 || f > T(i) + 70) return null;
          const x1 = Bd.x + X.s + 220, x2 = Bd.x + X.p;
          return (
            <g key={i} filter="url(#glow)">
              <line x1={x1} y1={cy(i - 1)} x2={x1 + (x2 - x1) * t} y2={cy(i - 1) + (cy(i) - cy(i - 1)) * t} stroke={C.blue} strokeWidth={6} strokeLinecap="round" />
              <circle cx={x1 + (x2 - x1) * t} cy={cy(i - 1) + (cy(i) - cy(i - 1)) * t} r={9} fill={C.text} />
            </g>
          );
        })}
      </svg>

      <Card box={D} accent={C.blue} at={150}>
        <div style={{position: 'absolute', left: 28, right: 28, top: 26, direction: 'ltr', fontFamily: mono, fontWeight: 700, color: C.text, lineHeight: 1.5}}>
          {[['SELECT', ' month, sales,'], ['  LAG', '(sales, 1, 0)'], ['  OVER(ORDER BY month)', ''], ['FROM', ' monthly_sales;']].map(([k, v], i) => (
            <div key={i} style={{whiteSpace: 'pre', fontSize: fs('  OVER(ORDER BY month)', 504, 28, mono), opacity: prog(f, 160 + i * 12, 190 + i * 12)}}><span style={{color: i === 1 ? C.blue : C.pink}}>{k}</span>{v}</div>
          ))}
        </div>
        <div style={{position: 'absolute', left: 28, right: 28, top: 250, direction: 'rtl', opacity: prog(f, 300, 360)}}>
          <div style={{fontFamily: cairo, fontWeight: 900, fontSize: 30, color: C.blue}}>offset = 1 ← خطوة واحدة للخلف</div>
          <div style={{fontFamily: cairo, fontWeight: 900, fontSize: 30, color: C.amber, marginTop: 8}}>default = 0 ← مفيش NULL في أول صف</div>
        </div>
        <div style={{position: 'absolute', left: 28, right: 28, bottom: 28, direction: 'rtl', opacity: prog(f, 560, 620)}}>
          <div style={{fontFamily: mono, fontWeight: 700, fontSize: 24, color: C.text, direction: 'ltr', textAlign: 'center'}}>(sales − prev) ÷ prev × 100</div>
          <div style={{fontFamily: cairo, fontWeight: 900, fontSize: 32, color: C.green, textAlign: 'center', marginTop: 8}}>نسبة النمو الشهري MoM ✓</div>
        </div>
      </Card>

      <Caption from={60} to={540} ltr={false} color={C.blue}>دوال الإزاحة والتحليل الزمني | Offset & Value Window Functions</Caption>
      <Caption from={660} to={1140} color={C.green}>LAG(sales, 1, 0) OVER(ORDER BY month) ──► Fetches Previous Row Value</Caption>
    </Scene>
  );
};
