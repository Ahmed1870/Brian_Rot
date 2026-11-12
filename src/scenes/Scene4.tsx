import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {Caption, Stage, prog, sec} from '../kit';
import {CATS, PPWin, RelId, RelLine, STAR, STORES, TableBox, TId, TState, fieldX, fieldY, relEnds, tH} from '../lp';
import {Pointer, Wp} from '../lq';
import {Host} from '../l46';
import {DragChip, Tag, colW54, factCell, ptrAt, relSt} from '../l54';
import {sale} from '../data';

// SC04 anchors (s, abs): 135.0 slicer | 136.2 click Electronics | 138.0 fact filtered | 140.6 click Cairo | 141.8 both | 143.4 clear | 150.0 drag 2nd Date rel | 152.0 drop | 155.4 inactive | 158 circular demo
const S = START.s4;
const t = (g: number) => sec(g - S);
const P = STAR;
const N = 50000;
let ELEC = 0, BOTH = 0;
for (let n = 1; n <= N; n++) { const s = sale(n); if (s.category === 'Electronics') { ELEC++; if (s.branch === 'Cairo') BOTH++; } }
const fmt = (n: number) => n.toLocaleString('en-US');
const CARD_Y = 312, CARD_W = 232;
const chipPos = (cx: number, i: number) => ({x: cx + 8 + (i % 2) * 112 + 52, y: CARD_Y + 22 + Math.floor(i / 2) * 24 + 12});
const ELEC_P = chipPos(P.prod.x, CATS.indexOf('Electronics'));
const CAIRO_P = chipPos(P.store.x, STORES.indexOf('Cairo'));
const DK = {x: fieldX('date', P), y: fieldY('date', P, 0)}, SK = {x: fieldX('fact', P), y: fieldY('fact', P, 5)};
const PTS: Wp[] = [
  {f: 0, x: 700, y: 560}, {f: t(135.9), ...ELEC_P}, {f: t(136.2), ...ELEC_P}, {f: t(140.4), ...CAIRO_P}, {f: t(140.7), ...CAIRO_P},
  {f: t(149.9), ...DK}, {f: t(151.9), ...SK}, {f: t(154.0), x: 760, y: 580},
];
const CLICKS = [136.2, 140.7, 150.0].map(t);

const Slicer: React.FC<{x: number; title: string; items: string[]; sel: string | null; p: number}> = ({x, title, items, sel, p}) => (
  p > 0.01 ? (
    <div style={{position: 'absolute', left: x, top: CARD_Y, width: CARD_W, background: '#fff', border: '1.5px solid #6B7785', borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,.25)', opacity: p, zIndex: 8, fontFamily: 'Segoe UI, Open Sans, sans-serif'}}>
      <div style={{height: 20, background: '#DDE6F0', fontSize: 12, fontWeight: 700, padding: '0 8px', lineHeight: '20px'}}>{title}</div>
      {items.map((it, i) => (
        <div key={it} style={{position: 'absolute', left: 8 + (i % 2) * 112, top: 24 + Math.floor(i / 2) * 24, width: 104, height: 20, fontSize: 12, lineHeight: '20px', textAlign: 'center', background: sel === it ? '#107C41' : '#EEF1F4', color: sel === it ? '#fff' : '#222', border: '1px solid #B8C0C8', boxSizing: 'border-box'}}>{it}</div>
      ))}
    </div>
  ) : null
);
const Flow: React.FC<{r: RelId; f: number; on: number}> = ({r, f, on}) => {
  if (on < 0.02) return null;
  const {a, b} = relEnds(r, P);
  return (
    <svg width={1536} height={672} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none', zIndex: 7, opacity: on}}>
      {[0, 1, 2, 3].map((k) => { const d = (f * 0.022 + k / 4) % 1; return <circle key={k} cx={a.x + (b.x - a.x) * d} cy={a.y + (b.y - a.y) * d} r={7} fill={C.green} style={{filter: `drop-shadow(0 0 8px ${C.green})`}} />; })}
    </svg>
  );
};

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const at = (g: number) => f >= t(g);
  const pulse = 0.6 + 0.4 * Math.sin(f * 0.14);
  const selCat = at(136.3) && !at(143.4) ? 'Electronics' : null;
  const selSt = at(140.8) && !at(143.4) ? 'Cairo' : null;
  const sl1 = prog(f, t(134.9), 10) * (1 - prog(f, t(143.6), 10));
  const sl2 = prog(f, t(139.6), 10) * (1 - prog(f, t(143.6), 10));
  const fl1 = prog(f, t(136.4), 10) * (1 - prog(f, t(143.4), 10));
  const fl2 = prog(f, t(140.9), 10) * (1 - prog(f, t(143.4), 10));
  const rows = !selCat ? N : selSt ? BOTH : ELEC;
  const factG = (selCat ? 0.8 : 0) * pulse;
  const drop2 = t(152.0);
  const inact = at(155.4);
  const drag = at(150.3) && !at(152.0);
  const pt = ptrAt(f, PTS);
  const st = (id: TId): TState => ({rowsLabel: id === 'fact' ? `${fmt(rows)} rows` : undefined, glow: id === 'fact' && selCat ? C.green : undefined, glowP: id === 'fact' ? factG : 0, fieldGlow: drag || (at(152.0) && !at(156.5)) ? (id === 'date' ? {0: C.purple} : id === 'fact' ? {5: C.blue} : undefined) : undefined});
  const circ = prog(f, t(158.0), 12) * (1 - prog(f, t(167.5), 10));
  return (
    <Stage dur={SCENES.s4.dur} inFx="up" outFx="zoom">
      <Host cell={factCell} colW={colW54} sheets={['Fact_Sales']} sheet="Fact_Sales" tab="Power Pivot">
        <PPWin view="diagram">
          {(['prod', 'cust', 'store', 'date'] as RelId[]).map((r) => <RelLine key={r} r={r} pos={P} f={f} st={{p: 1, one: 1, many: 1, arrow: 1, color: C.green, glow: (r === 'prod' && fl1 > 0.1) || (r === 'store' && fl2 > 0.1) ? 1.4 : 0.7}} />)}
          <RelLine r="ship" pos={P} f={f} st={{...relSt(f, drop2, {one: drop2 + 14, many: drop2 + 24, arrow: drop2 + 30, color: inact ? '#94A3B8' : C.green, dashed: inact}), label: inact ? 'Inactive' : undefined, labelColor: C.amber}} />
          {(['prod', 'cust', 'store', 'date', 'fact'] as TId[]).map((id) => <TableBox key={id} id={id} pos={P[id]} st={st(id)} />)}
          <Slicer x={P.prod.x} title="Category (Dim_Product)" items={CATS} sel={selCat} p={sl1} />
          <Slicer x={P.store.x} title="City (Dim_Store)" items={STORES} sel={selSt} p={sl2} />
          <Flow r="prod" f={f} on={fl1} /><Flow r="store" f={f} on={fl2} />
          <Tag x={P.fact.x + 6} y={P.fact.y + tH('fact') + 8} text={selCat ? `Filtered: ${fmt(N)} → ${fmt(rows)} rows` : 'No filter: 50,000 rows'} color={C.green} p={prog(f, t(137.8), 10) * (1 - prog(f, t(143.6), 10))} dark />
          <Tag x={P.fact.x + 6} y={P.fact.y + tH('fact') + 40} text="1 ──► * filter flows down" color={C.green} p={prog(f, t(137.0), 10) * (1 - prog(f, t(143.6), 10))} dark />
          <Tag x={P.fact.x + 6} y={P.fact.y + tH('fact') + 8} text="Only ONE active path between two tables" color={C.amber} p={prog(f, t(144.2), 10) * (1 - prog(f, t(149.2), 10))} dark />
          <Tag x={P.fact.x + 6} y={P.fact.y + tH('fact') + 8} text="2nd relationship ──► Inactive (dashed)" color={C.amber} p={prog(f, t(155.6), 10)} dark />
          <svg width={1536} height={672} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none', zIndex: 9, opacity: circ}}>
            {[{x: 640, y: 520, n: 'A'}, {x: 760, y: 580, n: 'B'}, {x: 880, y: 520, n: 'C'}].map((n) => (<g key={n.n}><circle cx={n.x} cy={n.y} r={22} fill="#fff" stroke={C.red} strokeWidth={3} /><text x={n.x} y={n.y + 6} textAnchor="middle" fontSize={18} fontWeight={700} fill="#0B1222" fontFamily="Consolas, monospace">{n.n}</text></g>))}
            <path d="M664 528 L736 572 M784 572 L856 528 M858 508 L664 508" fill="none" stroke={C.red} strokeWidth={3.5} strokeDasharray="8 6" />
            <g stroke={C.red} strokeWidth={6} strokeLinecap="round"><line x1={738} y1={494} x2={778} y2={534} /><line x1={778} y1={494} x2={738} y2={534} /></g>
          </svg>
          <Tag x={600} y={620} text="Circular path blocked" color={C.red} p={circ} dark />
          {drag ? <DragChip x={pt.x} y={pt.y} text="DateKey" p={1} /> : null}
          <Pointer f={f} pts={PTS} clicks={CLICKS} />
        </PPWin>
      </Host>
      <Caption text="Downstream Filter Propagation ──► Filters Flow Smoothly from Dimension (1) to Fact (*)" from={t(132.0)} to={t(148.0)} />
      <Caption text="Ambiguity Protection ──► Prevents Circular Paths & Auto-Manages Inactive Relationships" from={t(156.0)} to={t(169.6)} tone="ok" />
    </Stage>
  );
};
