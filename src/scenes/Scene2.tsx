import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Cell, Check, Chip, Editor, Mix, Stage, TopBadge, Warn, Win, clamp, lin, pop, sec} from '../kit';
import {PRODUCTS, PROMO} from '../data';

// SC02 (40-85s): NOT IN + NULL trap, then the IS NOT NULL fix.
// Anchors (s): 41.1 here we reach | 50.4 subquery | 58.3 fails | 61.5 engineering reason | 67.0 <> | 68.8 since | 72.6 whole condition | 75.1 protect | 81.7 IS NOT NULL
const S = START.s2;
const t = (g: number) => sec(g - S);

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const fix = f >= t(81.7);
  const fixP = clamp(lin(f, t(81.7), 18));
  const lock = pop(f, t(58.3));
  const rows: {l: string; v: string; c: string; at: number}[] = [
    {l: 'product_id <> 10', v: 'TRUE', c: C.green, at: 61.5},
    {l: 'AND product_id <> 20', v: 'TRUE', c: C.green, at: 64.5},
    {l: 'AND product_id <> NULL', v: 'UNKNOWN', c: C.red, at: 68.8},
  ];

  return (
    <Stage dur={1350} inFx="left" outFx="left">
      <TopBadge text="فخ القيم المفقودة | NOT IN & the NULL Trap" from={sec(2)} to={sec(40)} color={C.red} />

      <Editor x={80} y={180} w={800} h={260} title="Query Editor" lines={['SELECT name FROM products', 'WHERE product_id NOT IN (', '  SELECT product_id FROM promo_items', ');']} start={t(41.1)} cps={1.0} size={28} accent={f > t(58.3) && !fix ? C.red : C.border} hl={f > t(50.4) ? 1 : -1} hlColor={C.red} />

      <div style={{position: 'absolute', left: 80, top: 470, width: 800, height: 150, borderRadius: 22, border: `2px dashed ${C.blue}`, background: `${C.blue}0d`, opacity: clamp(lin(f, t(50.4), 16))}}>
        <div dir="ltr" style={{position: 'absolute', left: 24, top: 10, fontFamily: MONO, fontSize: 22, color: C.blue}}>promo_items.product_id → [10, 20, NULL]</div>
        {PROMO.map((v, i) => (
          <Cell key={i} x={34 + i * 240} y={58} w={200} text={v === null ? 'NULL' : String(v)} color={v === null ? C.red : C.blue} p={pop(f, t(51.5 + i * 0.5))} />
        ))}
      </div>

      {/* safety fix editor */}
      <div style={{opacity: clamp(lin(f, t(75.1), 18))}}>
        <Editor x={80} y={650} w={800} h={200} title="Safety Fix" lines={['SELECT product_id FROM promo_items', 'WHERE product_id IS NOT NULL']} start={t(77.5)} cps={0.9} size={28} accent={fix ? C.green : C.amber} hl={fix ? 1 : -1} hlColor={C.green} />
      </div>

      {/* evaluation panel */}
      <Win x={960} y={180} w={880} h={680} title="evaluation · Keyboard (product_id = 30)" accent={fix ? C.green : C.border}>
        <div dir="ltr" style={{position: 'absolute', left: 36, top: 22, right: 36}}>
          {rows.map((r, i) => {
            const p = clamp(lin(f, t(r.at), 14));
            const struck = fix && r.v === 'UNKNOWN';
            return (
              <div key={i} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 62, opacity: p * (struck ? 0.35 : 1), transform: `translateX(${(1 - p) * 30}px)`, fontFamily: MONO, fontSize: 32, textDecoration: struck ? 'line-through' : 'none'}}>
                <span style={{color: C.text}}>{r.l}</span>
                <span style={{color: r.c, fontWeight: 700}}>{r.v}</span>
              </div>
            );
          })}
          <div style={{height: 3, background: C.border, margin: '6px 0', opacity: clamp(lin(f, t(72.6), 10))}} />
          <div style={{display: 'flex', justifyContent: 'space-between', height: 64, alignItems: 'center', opacity: clamp(lin(f, t(72.6), 14)), fontFamily: MONO, fontSize: 30}}>
            <span style={{color: C.muted}}>{fix ? 'TRUE AND TRUE' : 'TRUE AND TRUE AND UNKNOWN'}</span>
            <span style={{color: fix ? C.green : C.red, fontWeight: 700}}>{fix ? '= TRUE ✓' : '= UNKNOWN ✗'}</span>
          </div>
        </div>

        <div dir="ltr" style={{position: 'absolute', left: 36, right: 36, top: 330, display: 'flex', gap: 10}}>
          {PRODUCTS.map((p, i) => {
            const inPromo = PROMO.includes(p.id);
            const show = clamp(lin(f, t(58.3), 14));
            const keep = fix && !inPromo;
            const color = keep ? C.green : fix && inPromo ? C.muted : C.red;
            return (
              <div key={p.id} style={{flex: 1, height: 96, borderRadius: 14, border: `3px solid ${show > 0.1 ? color : C.border}`, background: keep ? `${C.green}22` : C.deep, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, color: C.text, opacity: fix && inPromo ? 0.4 : 1}}>
                <div style={{fontSize: 28, fontWeight: 700}}>{p.id}</div>
                <div style={{fontSize: 20, color: C.muted}}>{p.name}</div>
              </div>
            );
          })}
        </div>

        <div style={{position: 'absolute', left: 36, right: 36, top: 440, height: 110, borderRadius: 20, border: `3px solid ${fix ? C.green : C.red}`, background: fix ? `${C.green}1a` : `${C.red}1a`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 28, opacity: clamp(lock)}}>
          {fix ? <Check p={fixP} size={72} /> : <Warn size={72} />}
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 40, fontWeight: 700, color: fix ? C.green : C.red}}>
            {fix ? 'Result: 3 rows returned ✓' : 'Result: 0 rows returned ✗'}
          </div>
        </div>
        <div dir="ltr" style={{position: 'absolute', left: 36, right: 36, top: 568, display: 'flex', gap: 14, justifyContent: 'center', opacity: fixP}}>
          {['Keyboard', 'Monitor', 'Webcam'].map((n) => (
            <Chip key={n} color={C.green} style={{fontSize: 28}}>{n}</Chip>
          ))}
        </div>
      </Win>

      <Caption text="NOT IN ([10, 20, NULL]) ──► Evaluates to UNKNOWN (0 Rows Returned!)" from={t(58.3)} to={t(74.5)} tone="danger" />
      <Caption text="Safety Fix: Add WHERE column IS NOT NULL in Subquery" from={t(76)} to={sec(44)} tone="ok" />
    </Stage>
  );
};
