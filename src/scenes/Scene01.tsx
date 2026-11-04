import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, S} from '../theme';
import {B} from '../layout';
import {cairo, mono} from '../fonts';
import {Caption, Card, Defs, Scene, Tag, Title, ease, fs, prog} from '../common';

const ROWS = [
  {n: 'لابتوب', s: 4200}, {n: 'شاشة', s: 3100}, {n: 'سماعة', s: 3100}, {n: 'كيبورد', s: 2200}, {n: 'ماوس', s: 900},
];
const RY = 120, RP = 100;

export const Scene01: React.FC = () => {
  const f = useCurrentFrame();
  const Bd = B.s1.board, D = B.s1.side;
  const probe = prog(f, 181, 540); // laser probe goes down the list
  const stampOf = (i: number) => probe * 5 > i + 0.3;
  const win = prog(f, 541, 600);

  return (
    <Scene dur={S.s1.dur} accent={C.blue}>
      <Title ar="دوال الترتيب والتصنيف المتقدمة" en="Advanced Ranking Functions" chip="SC 01 · ROW_NUMBER" accent={C.blue} />

      <Card box={Bd} accent={C.line} at={4}>
        <div style={{position: 'absolute', left: 28, top: 22, direction: 'ltr'}}><Tag color={C.blue}>TOP PRODUCTS · BY SALES</Tag></div>
        <div style={{position: 'absolute', left: 28, right: 28, top: 70, display: 'flex', direction: 'ltr', fontFamily: mono, fontWeight: 700, fontSize: 22, color: C.dim}}>
          <span style={{width: 150}}>row_number</span><span style={{width: 300}}>product</span><span>sales</span>
        </div>
        {ROWS.map((r, i) => {
          const st = stampOf(i);
          const first = i === 0 && win > 0;
          return (
            <div key={i} style={{position: 'absolute', left: 20, right: 20, top: RY + i * RP, height: RP - 14, borderRadius: 16, display: 'flex', alignItems: 'center', gap: 20, padding: '0 20px', direction: 'ltr', background: first ? 'rgba(16,185,129,0.14)' : C.panel2, border: `3px solid ${first ? C.green : st ? C.blue : C.line}`, opacity: prog(f, 20 + i * 10, 50 + i * 10)}}>
              <div style={{width: 110, height: 62, borderRadius: 14, background: st ? (first ? C.green : C.blue) : 'transparent', border: `3px dashed ${st ? 'transparent' : C.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: mono, fontWeight: 700, fontSize: 40, color: C.bg, transform: `scale(${st ? 1 : 0.9})`}}>{st ? i + 1 : ''}</div>
              <span style={{width: 300, fontFamily: cairo, fontWeight: 900, fontSize: 34, color: C.text, direction: 'rtl', textAlign: 'left', marginLeft: 20}}>{r.n}</span>
              <div style={{flex: 1, height: 22, borderRadius: 11, background: 'rgba(100,116,139,0.3)'}}><div style={{width: `${(r.s / 4200) * 100}%`, height: '100%', borderRadius: 11, background: C.row}} /></div>
              <span style={{width: 120, textAlign: 'right', fontFamily: mono, fontWeight: 700, fontSize: 30, color: C.text}}>${r.s.toLocaleString('en-US')}</span>
            </div>
          );
        })}
      </Card>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <Defs />
        {probe > 0 && probe < 1 && <rect x={Bd.x + 14} y={Bd.y + RY + probe * 5 * RP - 8} width={Bd.w - 28} height={7} rx={4} fill={C.blue} filter="url(#glow)" />}
      </svg>

      <Card box={D} accent={C.blue} at={150}>
        <div style={{position: 'absolute', left: 28, right: 28, top: 26, direction: 'ltr', fontFamily: mono, fontWeight: 700, color: C.text, lineHeight: 1.5}}>
          {[['SELECT', ' product, sales,'], ['  ROW_NUMBER()', ''], ['  OVER(ORDER BY sales DESC)', ''], ['  AS rn', ''], ['FROM', ' sales_by_product;']].map(([k, v], i) => (
            <div key={i} style={{whiteSpace: 'pre', fontSize: fs('  OVER(ORDER BY sales DESC)', 504, 26, mono), opacity: prog(f, 160 + i * 12, 190 + i * 12)}}><span style={{color: i === 1 ? C.blue : C.pink}}>{k}</span>{v}</div>
          ))}
        </div>
        <div style={{position: 'absolute', left: 28, right: 28, top: 270, direction: 'rtl', opacity: prog(f, 560, 620)}}>
          <div style={{fontFamily: cairo, fontWeight: 900, fontSize: 32, color: C.green}}>رقم فريد لكل صف: 1، 2، 3، 4، 5</div>
          <div style={{marginTop: 14, fontFamily: cairo, fontWeight: 700, fontSize: 28, color: C.text, lineHeight: 1.5}}>حتى لو الشاشة والسماعة نفس المبيعات (3,100)، كل واحد ليه رقم مختلف</div>
        </div>
        <div style={{position: 'absolute', left: 28, bottom: 28, direction: 'ltr', opacity: prog(f, 600, 650)}}><span style={{fontFamily: mono, fontWeight: 700, fontSize: 26, color: C.bg, background: C.green, borderRadius: 999, padding: '6px 22px'}}>UNIQUE ✓</span></div>
      </Card>

      <Caption from={60} to={540} ltr={false} color={C.blue}>دوال الترتيب والتصنيف المتقدمة | Advanced Ranking Functions</Caption>
      <Caption from={660} to={1140} color={C.green}>ROW_NUMBER() OVER(ORDER BY ...) ──► Assigns Unique Sequential Integers</Caption>
    </Scene>
  );
};
