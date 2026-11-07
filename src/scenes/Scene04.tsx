import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, S} from '../theme';
import {B} from '../layout';
import {cairo, mono} from '../fonts';
import {Caption, Card, Defs, Scene, Tag, Title, ease, prog} from '../common';

const BITS = 22;
const HIT = [3, 9, 14, 19];
const PAGES = 8;
const HITPAGE = [1, 4, 6];
const ROUTE = 450; // 4351

export const Scene04: React.FC = () => {
  const f = useCurrentFrame();
  const Sq = B.s4.seq, G = B.s4.gin;
  const scanned = Math.floor(prog(f, 20, 200) * 40);
  const bypass = ease(prog(f, 200, 260));
  const look = prog(f, 300, 450), bits = prog(f, ROUTE, ROUTE + 150), heap = prog(f, ROUTE + 160, ROUTE + 330);

  return (
    <Scene dur={S.s4.dur} accent={C.purple}>
      <Title ar="كواليس Bitmap Index Scan" en="PostgreSQL 16 · GIN Engine" chip="SC 04 · ENGINE" accent={C.purple} />

      <Card box={Sq} accent={bypass > 0.5 ? C.line : C.red} at={6} style={{filter: `grayscale(${bypass * 0.6})`}}>
        <div style={{position: 'absolute', left: 24, top: 18, direction: 'ltr'}}><Tag color={C.red}>SEQUENTIAL SCAN</Tag></div>
        <svg width={Sq.w} height={Sq.h} style={{position: 'absolute', inset: 0}}>
          {Array.from({length: 40}, (_, i) => {
            const x = 34 + (i % 8) * 105, y = 80 + Math.floor(i / 8) * 90;
            const done = i < scanned, cur = i === scanned;
            return <rect key={i} x={x} y={y} width={90} height={76} rx={12} fill={cur ? C.red : done ? '#475569' : C.bg2} stroke={cur ? C.red : C.line} strokeWidth={cur ? 4 : 2} opacity={prog(f, 10, 40)} />;
          })}
        </svg>
        <div style={{position: 'absolute', left: 24, right: 24, top: 560, textAlign: 'center', direction: 'ltr', fontFamily: mono, fontWeight: 700, fontSize: 38, color: C.red, opacity: bypass}}>Sequential Scan Bypassed</div>
        <div style={{position: 'absolute', left: 24, right: 24, bottom: 26, textAlign: 'center', direction: 'rtl', fontFamily: cairo, fontWeight: 900, fontSize: 28, color: C.dim, opacity: bypass}}>مسح الجدول كله اتلغى</div>
      </Card>

      <Card box={G} accent={C.green} at={200}>
        <div style={{position: 'absolute', left: 24, top: 66, direction: 'ltr', opacity: look}}><Tag color={C.purple}>GIN INDEX LOOKUP</Tag></div>
        <div style={{position: 'absolute', left: 24, right: 24, top: 18, direction: 'ltr', fontFamily: mono, fontWeight: 700, fontSize: 26, color: C.text, opacity: prog(f, 230, 270)}}>attributes @&gt; '&#123;"color": "Red"&#125;'</div>
        <div style={{position: 'absolute', left: 24, right: 24, top: 104, height: 70, borderRadius: 14, border: `3px solid ${C.purple}`, background: 'rgba(168,85,247,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', direction: 'ltr', fontFamily: mono, fontWeight: 700, fontSize: 28, color: C.text, opacity: look}}>color:Red → rows {HIT.join(', ')}…</div>

        <div style={{position: 'absolute', left: 24, top: 214, direction: 'ltr', opacity: bits}}><Tag color={C.green}>BITMAP INDEX SCAN</Tag></div>
        <div style={{position: 'absolute', left: 24, top: 252, direction: 'ltr', display: 'flex', gap: 4}}>
          {Array.from({length: BITS}, (_, i) => {
            const on = HIT.includes(i) && bits > (i / BITS);
            return <div key={i} style={{width: 34, height: 44, borderRadius: 8, background: on ? C.green : C.panel2, border: `2px solid ${on ? C.green : C.line}`, opacity: bits > 0 ? 1 : 0}} />;
          })}
        </div>

        <div style={{position: 'absolute', left: 24, top: 332, direction: 'ltr', opacity: heap}}><Tag color={C.purple}>BITMAP HEAP SCAN</Tag></div>
        <div style={{position: 'absolute', left: 24, top: 372, direction: 'ltr', display: 'flex', gap: 10}}>
          {Array.from({length: PAGES}, (_, i) => {
            const on = HITPAGE.includes(i) && heap > 0.3 + i * 0.05;
            return <div key={i} style={{width: 95, height: 120, borderRadius: 12, background: on ? 'rgba(16,185,129,0.2)' : C.panel2, border: `3px solid ${on ? C.green : C.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: mono, fontWeight: 700, fontSize: 22, color: on ? C.green : C.dim, opacity: heap > 0 ? 1 : 0}}>p{i + 1}</div>;
          })}
        </div>
        <div style={{position: 'absolute', left: 24, right: 24, top: 540, textAlign: 'center', opacity: prog(f, ROUTE + 330, ROUTE + 380)}}>
          <span style={{display: 'inline-block', fontFamily: mono, fontWeight: 700, fontSize: 34, color: C.bg, background: C.green, borderRadius: 999, padding: '8px 30px'}}>0.8 ms</span>
        </div>
        <div style={{position: 'absolute', left: 24, right: 24, bottom: 26, textAlign: 'center', direction: 'rtl', fontFamily: cairo, fontWeight: 900, fontSize: 28, color: C.green, opacity: prog(f, ROUTE + 380, ROUTE + 430)}}>بيروح للصفوف المطابقة مباشرة</div>
      </Card>
      <svg width={0} height={0}><Defs /></svg>

      <Caption from={60} to={540} color={C.purple}>Inverted Index Lookup ──► Maps Keys Directly to Row Identification Bitmaps</Caption>
      <Caption from={660} to={1080} color={C.green}>Bitmap Heap Scan ──► Bypasses Full Table Scan for Sub-Millisecond JSONB Search</Caption>
    </Scene>
  );
};
