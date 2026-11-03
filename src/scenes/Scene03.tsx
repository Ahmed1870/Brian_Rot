import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, S} from '../theme';
import {B} from '../layout';
import {cairo, mono} from '../fonts';
import {Caption, Card, Defs, Scene, Tag, Title, ease, fs, prog} from '../common';

const PROD = ['لابتوب', 'ماوس', 'كيبورد', 'شاشة'];
const BR = ['القاهرة', 'الإسكندرية', 'أسوان'];
const M = B.s3.matrix, P = B.s3.products, Br = B.s3.branches;
const GX = 330, CWD = 330, GY = 150, RHT = 115; // grid origin inside the matrix card
const QUERY = 'SELECT * FROM products p CROSS JOIN branches b;';

export const Scene03: React.FC = () => {
  const f = useCurrentFrame();
  const n = Math.round(ease(prog(f, 100, 520)) * 12);
  const glow = prog(f, 900, 960);
  return (
    <Scene dur={S.s3.dur} accent={C.amber}>
      <Title ar="الضرب الكارتيزي" en="CROSS JOIN · N × M Combinations" chip="SC 03 · CROSS JOIN" accent={C.amber} />

      <Card box={P} accent={C.blue} at={6}>
        <div style={{position: 'absolute', left: 24, top: 20, direction: 'ltr'}}><Tag color={C.blue}>products · 4</Tag></div>
        {PROD.map((p, i) => (
          <div key={i} style={{position: 'absolute', left: 20, right: 20, top: 80 + i * 80, height: 66, borderRadius: 14, background: C.panel2, border: `2px solid ${C.blue}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: cairo, fontWeight: 700, fontSize: 30, color: C.text, opacity: prog(f, 20 + i * 10, 50 + i * 10)}}>{p}</div>
        ))}
      </Card>
      <Card box={Br} accent={C.green} at={26}>
        <div style={{position: 'absolute', left: 24, top: 16, direction: 'ltr'}}><Tag color={C.green}>branches · 3</Tag></div>
        {BR.map((b, i) => (
          <div key={i} style={{position: 'absolute', left: 20, right: 20, top: 66 + i * 56, height: 48, borderRadius: 12, background: C.panel2, border: `2px solid ${C.green}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: cairo, fontWeight: 700, fontSize: 26, color: C.text, opacity: prog(f, 40 + i * 10, 70 + i * 10)}}>{b}</div>
        ))}
      </Card>

      <Card box={M} accent={C.amber} at={16}>
        <div style={{position: 'absolute', left: 30, top: 24, right: 30, display: 'flex', alignItems: 'center', gap: 20, direction: 'ltr'}}>
          <span style={{fontFamily: mono, fontWeight: 700, whiteSpace: 'nowrap', fontSize: fs(QUERY, 1000, 40, mono), color: C.text}}><span style={{color: C.pink}}>SELECT</span> * <span style={{color: C.pink}}>FROM</span> products p <span style={{color: C.pink}}>CROSS JOIN</span> branches b;</span>
          <span style={{fontFamily: mono, fontWeight: 700, fontSize: 24, color: C.amber, border: `2px solid ${C.amber}`, borderRadius: 999, padding: '4px 18px', whiteSpace: 'nowrap', opacity: prog(f, 60, 100)}}>NO ON NEEDED</span>
        </div>
        {/* column headers (branches) */}
        {BR.map((b, i) => (
          <div key={i} style={{position: 'absolute', left: GX + i * CWD, top: 100, width: CWD - 16, textAlign: 'center', fontFamily: cairo, fontWeight: 900, fontSize: 30, color: C.green, opacity: prog(f, 80 + i * 10, 110 + i * 10)}}>{b}</div>
        ))}
        {/* row headers (products) */}
        {PROD.map((p, i) => (
          <div key={i} style={{position: 'absolute', left: 30, top: GY + i * RHT, width: 260, height: RHT - 14, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', fontFamily: cairo, fontWeight: 900, fontSize: 30, color: C.blue, opacity: prog(f, 80 + i * 10, 110 + i * 10)}}>{p}</div>
        ))}
        {/* 12 combination cells */}
        {PROD.flatMap((p, i) => BR.map((b, j) => {
          const idx = i * 3 + j;
          const on = idx < n;
          const pop = ease(prog(f, 100 + idx * 35, 140 + idx * 35));
          return (
            <div key={idx} style={{position: 'absolute', left: GX + j * CWD, top: GY + i * RHT, width: CWD - 16, height: RHT - 14, borderRadius: 16, background: on ? `rgba(245,158,11,${0.16 + 0.14 * glow})` : 'transparent', border: `3px solid ${on ? C.amber : C.line}`, borderStyle: on ? 'solid' : 'dashed', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, opacity: on ? 1 : 0.4, transform: `scale(${0.85 + 0.15 * pop})`}}>
              {on && (<><span style={{fontFamily: cairo, fontWeight: 700, fontSize: 28, color: C.text}}>{p} × {b}</span><span style={{fontFamily: mono, fontWeight: 700, fontSize: 20, color: C.amber}}>row {idx + 1}</span></>)}
            </div>
          );
        }))}
        <div style={{position: 'absolute', left: 30, right: 30, bottom: 22, display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 24, direction: 'ltr'}}>
          <span style={{fontFamily: mono, fontWeight: 700, fontSize: 48, color: C.amber}}>4 × 3 = {n}</span>
          <span style={{fontFamily: cairo, fontWeight: 900, fontSize: 30, color: C.text, opacity: prog(f, 560, 620)}}>كل التوفيقات الممكنة</span>
        </div>
      </Card>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <Defs />
        {PROD.map((_, i) => {
          const t = prog(f, 100 + i * 100, 160 + i * 100);
          const y1 = P.y + 80 + i * 80 + 33, y2 = M.y + GY + i * RHT + (RHT - 14) / 2;
          return t > 0 ? <line key={i} x1={P.x + P.w} y1={y1} x2={P.x + P.w + (M.x - P.x - P.w) * t} y2={y1 + (y2 - y1) * t} stroke={C.amber} strokeWidth={5} filter="url(#glow)" /> : null;
        })}
      </svg>

      <Caption from={90} to={630} color={C.amber}>4 Products × 3 Branches ──► Generates 12 Matrix Rows Automatically</Caption>
      <Caption from={750} to={1230} color={C.amber}>CROSS JOIN ──► Cartesian Product (N × M Combinations)</Caption>
    </Scene>
  );
};
