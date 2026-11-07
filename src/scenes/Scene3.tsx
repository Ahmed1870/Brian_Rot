import React from 'react';
import TL from '../timeline.json';
import {C, D, FONT_AR, FONT_MONO} from '../theme';
import {Bg} from '../components/Glass';
import {Card} from '../components/Card';
import {Code, CodeLine} from '../components/Code';
import {appear} from '../components/Text';
import {Tag} from '../components/Tag';
import {back, eo, prog, pulse} from '../lib/anim';

const S = TL.cues.sc03;
const PUR = '#A855F7';
const CODE: CodeLine[] = [
  {text: 'Index Scan using idx_orders_customer on orders  (cost=0.29..8.31 rows=1 width=42)', at: S.typeT, dt: 0.03},
  {text: '  (actual time=0.015..0.018 rows=1 loops=1)', at: S.typeT + 3.2, dt: 0.04},
];
const CARDS = [{x: 60, c: D.key}, {x: 670, c: PUR}, {x: 1280, c: D.cat}];

export const Scene3: React.FC<{t: number}> = ({t}) => {
  const en = appear(t, TL.scenes[2].start + 0.3, TL.scenes[2].start + 1.3);
  const warm = 0.5 + 0.5 * pulse(t, 1.2);
  const a = (k: number) => back(prog(t, S.arrows + k * 0.5, S.arrows + 0.7 + k * 0.5));
  const r = back(prog(t, S.rows, S.rows + 0.8));
  const stale = t >= S.stale;
  const sp = back(prog(t, S.stale, S.stale + 0.8));
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, overflow: 'hidden'}}>
      <Bg t={t} />
      <div style={{position: 'absolute', left: 60, top: 92, height: 60}}><Tag t={t} range={S.tag1} head="cost = startup_cost .. total_cost" body="──► Measured in Page Fetch Units" color={D.key} size={26} /></div>
      <div style={{position: 'absolute', left: 60, top: 92, height: 60}}><Tag t={t} range={S.tag2} head="rows vs actual rows" body="──► Discrepancies Indicate Stale Statistics (ANALYZE)" color={PUR} size={26} /></div>
      <div style={{opacity: en}}><Code lines={CODE} t={t} x={60} y={190} w={1560} h={190} title="plan_node" fontSize={23} lineH={52} /></div>
      <svg width="1920" height="1080" style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}}>
        {CARDS.map((c, i) => <path key={i} d={`M${[640, 1010, 1330][i] - (i === 0 ? 0 : 0)} 330 C ${[640, 1010, 1330][i]} 380 ${c.x + 290} 380 ${c.x + 290} 440`} fill="none" stroke={c.c} strokeWidth="5" strokeDasharray="9 9" strokeDashoffset={-t * 60} opacity={Math.min(1, a(i) * 1.4) * 0.7} />)}
      </svg>
      <Card x={60} y={440} w={580} h={330} c={D.key} glow={18} op={Math.min(1, a(0) * 2)}>
        <div style={{padding: '22px 30px'}}><div style={{fontFamily: FONT_MONO, fontSize: 21, color: C.mute, letterSpacing: 2}}>COST</div>
          <div style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 52, color: D.key, marginTop: 6}}>0.29..8.31</div>
          <div style={{fontFamily: FONT_MONO, fontSize: 25, color: C.text, marginTop: 10}}>startup <b style={{color: D.key}}>0.29</b> → total <b style={{color: D.key}}>8.31</b></div>
          <div style={{fontFamily: FONT_AR, fontWeight: 700, fontSize: 26, color: C.dim, direction: 'rtl', marginTop: 14}}>تكلفة أول صف مقابل التكلفة الكلية (Page Fetch Units)</div></div>
      </Card>
      <Card x={670} y={440} w={580} h={330} c={stale ? D.err : PUR} glow={18 + 14 * warm * (stale ? 1 : 0)} op={Math.min(1, a(1) * 2)}>
        <div style={{padding: '22px 30px'}}><div style={{fontFamily: FONT_MONO, fontSize: 21, color: C.mute, letterSpacing: 2}}>ROWS · ESTIMATED vs ACTUAL</div>
          <div style={{display: 'flex', gap: 26, alignItems: 'baseline', marginTop: 8}}>
            <div><div style={{fontFamily: FONT_MONO, fontSize: 20, color: C.dim}}>rows=</div><div style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 60, color: PUR}}>{stale ? '1' : '1'}</div></div>
            <div style={{fontFamily: FONT_MONO, fontSize: 40, color: stale ? D.err : D.cat}}>{stale ? '≠' : r > 0.5 ? '=' : '?'}</div>
            <div><div style={{fontFamily: FONT_MONO, fontSize: 20, color: C.dim}}>actual rows=</div><div style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: stale ? 52 : 60, color: stale ? D.err : D.cat, opacity: r > 0.5 || stale ? 1 : 0}}>{stale ? '25,000' : '1'}</div></div>
          </div>
          <div style={{fontFamily: FONT_AR, fontWeight: 800, fontSize: 27, marginTop: 16, direction: 'rtl', color: stale ? '#FCA5A5' : D.cat, opacity: r > 0.5 || stale ? 1 : 0}}>{stale ? 'فجوة ضخمة ← الإحصائيات قديمة' : 'تطابق ← إحصائيات سليمة ✓'}</div>
          {stale ? <div style={{marginTop: 12, opacity: Math.min(1, sp * 2), display: 'inline-block', padding: '8px 22px', borderRadius: 12, background: PUR, color: '#fff', fontFamily: FONT_MONO, fontWeight: 800, fontSize: 26}}>ANALYZE orders;</div> : null}</div>
      </Card>
      <Card x={1280} y={440} w={580} h={330} c={D.cat} glow={18} op={Math.min(1, a(2) * 2)}>
        <div style={{padding: '22px 30px'}}><div style={{fontFamily: FONT_MONO, fontSize: 21, color: C.mute, letterSpacing: 2}}>ACTUAL TIME · LOOPS</div>
          <div style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 52, color: D.cat, marginTop: 6, opacity: r > 0.3 ? 1 : 0.15}}>0.015..0.018 ms</div>
          <div style={{fontFamily: FONT_MONO, fontSize: 27, color: C.text, marginTop: 12, opacity: r > 0.3 ? 1 : 0.15}}>loops=<b style={{color: D.cat}}>1</b> · width=<b style={{color: D.cat}}>42</b> bytes</div></div>
      </Card>
      <div style={{position: 'absolute', left: 60, top: 820, width: 1800, display: 'flex', gap: 24, opacity: appear(t, S.arrows + 3, S.arrows + 4)}}>
        {['Seq Scan', 'Index Scan', 'Bitmap Heap Scan'].map((n, i) => <div key={n} style={{flex: 1, padding: '14px 10px', borderRadius: 16, textAlign: 'center', fontFamily: FONT_MONO, fontWeight: 800, fontSize: 28, color: i === 1 ? D.cat : C.dim, background: i === 1 ? `${D.cat}22` : 'rgba(255,255,255,0.05)', border: `2px solid ${i === 1 ? D.cat : 'rgba(255,255,255,0.14)'}`}}>{n}</div>)}
      </div>
    </div>
  );
};
