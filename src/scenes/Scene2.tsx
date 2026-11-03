import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONT, MONO} from '../theme';
import {Caption, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lerp, pop, prog, sec} from '../kit';

// SC02 (frames 1270-2667, global 42.4-88.9s): multi-column ORDER BY and explicit NULLS LAST.
const S = 42.35;
const t = (g: number) => sec(g - S);
const RH = 52;
const ROW0 = 60;

// name, category, price, idx0 (heap), idx1 (category ASC), idx2 (price DESC, default NULL placement), idx3 (NULLS LAST)
const ROWS = [
  {n: 'Lamp', c: 3, p: 70, i0: 0, i1: 5, i2: 7, i3: 6},
  {n: 'Keyboard', c: 2, p: 120, i0: 1, i1: 3, i2: 4, i3: 4},
  {n: 'Stapler', c: 1, p: null, i0: 2, i1: 0, i2: 0, i3: 2},
  {n: 'Chair', c: 3, p: 600, i0: 3, i1: 6, i2: 6, i3: 5},
  {n: 'Pen', c: 1, p: 40, i0: 4, i1: 1, i2: 2, i3: 1},
  {n: 'Monitor', c: 2, p: 250, i0: 5, i1: 4, i2: 3, i3: 3},
  {n: 'Desk', c: 3, p: null, i0: 6, i1: 7, i2: 5, i3: 7},
  {n: 'Notebook', c: 1, p: 90, i0: 7, i1: 2, i2: 1, i3: 0},
] as const;

const Card: React.FC<{x: number; y: number; w: number; h: number; color: string; p: number; children: React.ReactNode}> = ({x, y, w, h, color, p, children}) => (
  <div dir="ltr" style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 22, background: C.card, border: `2px solid ${color}`, padding: '22px 28px', boxSizing: 'border-box', opacity: p, transform: `translateY(${(1 - p) * 30}px)`}}>
    {children}
  </div>
);

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const tbl = prog(f, t(46.5), 24);
  const p1 = prog(f, t(57.4), sec(2.4));
  const p2 = prog(f, t(63.7), sec(1.8));
  const p3 = prog(f, t(80.5), sec(2.2));
  const asc = prog(f, t(45.9), 22);
  const desc = prog(f, t(52.0), 22);
  const nullCard = prog(f, t(65.7), 22);
  const dflt = prog(f, t(69.5), 20) * (1 - prog(f, t(76.0), 12));
  const gold = pop(f, t(76.6));
  const last = pop(f, t(80.6));
  const first = pop(f, t(83.9));
  const glow = 0.5 + 0.5 * Math.sin(f / 7);

  return (
    <Stage dur={1397} inFx="zoom" outFx="left">
      <TopBadge text="ASC · DESC · NULLS — التحكم الكامل بالترتيب" from={t(43.8)} to={t(57)} color={C.blue} />

      <Editor x={90} y={150} w={960} h={200} title="sort.sql" lines={['SELECT product_name, category_id, unit_price FROM products', 'ORDER BY category_id ASC, unit_price DESC NULLS LAST;']} start={t(43.8)} cps={1.5} size={22} accent={C.blue} />

      <Win x={90} y={380} w={960} h={520} title="products · result" accent={C.border} opacity={tbl}>
        <div dir="ltr" style={{padding: '14px 18px 0 18px'}}>
          <div style={{display: 'flex', fontFamily: MONO, fontSize: 19, color: C.muted, borderBottom: `2px solid ${C.border}`, paddingBottom: 6}}>
            <div style={{width: 330, paddingLeft: 12}}>product_name</div>
            <div style={{width: 270, paddingLeft: 12, color: p1 > 0.5 ? C.blue : C.muted, fontWeight: p1 > 0.5 ? 700 : 400}}>category_id ↑ ASC</div>
            <div style={{width: 270, paddingLeft: 12, color: p2 > 0.5 ? C.green : C.muted, fontWeight: p2 > 0.5 ? 700 : 400}}>unit_price ↓ DESC</div>
          </div>
        </div>
        <div style={{position: 'absolute', left: 18, right: 18, top: 56}}>
          {ROWS.map((r) => {
            const idx = r.i0 + (r.i1 - r.i0) * p1 + (r.i2 - r.i1) * p2 + (r.i3 - r.i2) * p3;
            const nullGlow = r.p === null && p3 > 0.2 ? 0.25 * glow + 0.1 : 0;
            return (
              <div key={r.n} dir="ltr" style={{position: 'absolute', left: 0, right: 0, top: ROW0 - 56 + idx * RH, height: RH - 6, display: 'flex', alignItems: 'center', fontFamily: MONO, fontSize: 24, color: C.text, background: C.deep, borderRadius: 10, border: `2px solid ${r.p === null && p3 > 0.2 ? C.amber : C.border}`, boxShadow: r.p === null && p3 > 0.2 ? `0 0 ${18 * glow}px ${C.amber}55` : 'none', opacity: clamp(tbl)}}>
                <div style={{width: 330, paddingLeft: 12}}>{r.n}</div>
                <div style={{width: 270, paddingLeft: 12, color: p1 > 0.5 ? C.blue : C.text, fontWeight: p1 > 0.5 ? 700 : 400}}>{r.c}</div>
                <div style={{width: 270, paddingLeft: 12, color: r.p === null ? C.amber : p2 > 0.5 ? C.green : C.text, fontWeight: r.p === null || p2 > 0.5 ? 700 : 400, background: `rgba(245,158,11,${nullGlow})`, borderRadius: 8}}>{r.p === null ? 'NULL' : r.p}</div>
              </div>
            );
          })}
        </div>
      </Win>

      {/* explainers */}
      <Card x={1110} y={150} w={720} h={170} color={C.blue} p={asc}>
        <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
          <Chip color={C.blue} style={{fontSize: 34, padding: '8px 26px'}}>ASC ↑</Chip>
          <Mix style={{fontSize: 34, color: C.text}}>الأصغر للأكبر (الافتراضي)</Mix>
        </div>
        <div style={{fontFamily: MONO, fontSize: 28, color: C.blue, marginTop: 20}}>1 → 2 → 3 → 4</div>
      </Card>
      <Card x={1110} y={344} w={720} h={170} color={C.green} p={desc}>
        <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
          <Chip color={C.green} style={{fontSize: 34, padding: '8px 26px'}}>DESC ↓</Chip>
          <Mix style={{fontSize: 34, color: C.text}}>الأكبر للأصغر</Mix>
        </div>
        <div style={{fontFamily: MONO, fontSize: 28, color: C.green, marginTop: 20}}>600 → 250 → 120 → 70</div>
      </Card>
      <Card x={1110} y={538} w={720} h={362} color={C.amber} p={nullCard}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
          <Chip color={C.amber} style={{fontSize: 30}}>NULL</Chip>
          <Mix style={{fontSize: 32, color: C.text}}>القيم المفقودة</Mix>
        </div>
        <div style={{marginTop: 20, opacity: dflt}}>
          <Mix style={{fontSize: 30, color: C.muted, display: 'block'}}>موقع NULL الافتراضي يختلف حسب اتجاه الترتيب</Mix>
          <div style={{fontFamily: MONO, fontSize: 22, color: C.muted, marginTop: 10}}>don't rely on the default → be explicit</div>
        </div>
        <div style={{display: 'flex', gap: 18, marginTop: 24}}>
          <div style={{transform: `scale(${clamp(last)})`, transformOrigin: 'left center'}}><Chip color={C.amber} style={{fontSize: 30, padding: '10px 26px', background: `${C.amber}33`}}>NULLS LAST</Chip></div>
          <div style={{transform: `scale(${clamp(first)})`, transformOrigin: 'left center'}}><Chip color={C.amber} style={{fontSize: 30, padding: '10px 26px'}}>NULLS FIRST</Chip></div>
        </div>
        <div style={{marginTop: 22, opacity: gold}}>
          <Mix style={{fontSize: 30, fontWeight: 700, color: C.amber}}>★ تحكم صريح بدقة مطلقة</Mix>
        </div>
      </Card>

      <Caption text="ORDER BY category_id ASC, unit_price DESC  (Multi-Column Ordering)" from={t(47)} to={t(66)} />
      <Caption text="NULLS LAST ──► Explicitly Controls Missing Value Positioning" from={t(76.8)} to={t(88)} />
    </Stage>
  );
};
