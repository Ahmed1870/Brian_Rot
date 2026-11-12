import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, SCENES, START} from '../theme';
import {Caption, Chip, Stage, prog, sec} from '../kit';
import {DataView, PPWin, REL, RelId, RelLine, STAR, TableBox, TId, TState, fieldX, fieldY, ppBtn} from '../lp';
import {Pointer, Wp} from '../lq';
import {Host} from '../l46';
import {DragChip, Tag, colW54, factCell, ptrAt, relSt} from '../l54';

// SC03 anchors (s, abs): 89.2 click Diagram View | 93.0-96.7 drag CustomerKey | 100.6 "1" | 102.2 "*" | 103.4 arrow | 106.4-107.9 Date | 108.7-110.4 Store | 111.3-112.6 Product | 113.3 star complete
const S = START.s3;
const t = (g: number) => sec(g - S);
const P = STAR;
const DRAGS: Array<{rel: RelId; dim: TId; fi: number; grab: number; drop: number; name: string}> = [
  {rel: 'cust', dim: 'cust', fi: 2, grab: 93.0, drop: 96.7, name: 'CustomerKey'},
  {rel: 'date', dim: 'date', fi: 4, grab: 106.4, drop: 107.9, name: 'DateKey'},
  {rel: 'store', dim: 'store', fi: 3, grab: 108.7, drop: 110.4, name: 'StoreKey'},
  {rel: 'prod', dim: 'prod', fi: 1, grab: 111.3, drop: 112.6, name: 'ProductKey'},
];
const kp = (d: TId) => ({x: fieldX(d, P), y: fieldY(d, P, 0)});
const fp = (i: number) => ({x: fieldX('fact', P), y: fieldY('fact', P, i)});
const DV = ppBtn('diagramView');
const PTS: Wp[] = [{f: 0, x: 760, y: 420}, {f: t(88.9), x: DV.cx, y: DV.cy}, {f: t(89.2), x: DV.cx, y: DV.cy}];
DRAGS.forEach((d) => { PTS.push({f: t(d.grab - 0.1), ...kp(d.dim)}); PTS.push({f: t(d.drop - 0.12), ...fp(d.fi)}); });
PTS.push({f: t(116.5), x: 760, y: 560});
const CLICKS = [89.2, ...DRAGS.map((d) => d.grab)].map(t);

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const at = (g: number) => f >= t(g);
  const diagram = at(89.3);
  const amber = at(113.3) && !at(118.5);
  const col = amber ? C.amber : C.green;
  const drag = DRAGS.find((d) => at(d.grab + 0.3) && !at(d.drop));
  const pt = ptrAt(f, PTS);
  const fieldGlow = (id: TId): Record<number, string> | undefined => {
    const out: Record<number, string> = {};
    DRAGS.forEach((d) => { if (at(d.grab) && !at(d.drop + 1.2)) { if (d.dim === id) out[0] = C.purple; if (id === 'fact') out[d.fi] = C.blue; } });
    return Object.keys(out).length ? out : undefined;
  };
  const st = (id: TId): TState => ({fieldGlow: fieldGlow(id), rowsLabel: id === 'fact' ? '50,000 rows' : undefined, glow: amber ? C.amber : undefined, glowP: amber ? 0.7 : 0});
  const dimNames: Record<string, number> = {};
  void dimNames;
  return (
    <Stage dur={SCENES.s3.dur} inFx="left" outFx="up">
      <Host cell={factCell} colW={colW54} sheets={['Fact_Sales']} sheet="Fact_Sales" tab="Power Pivot">
        <PPWin view={diagram ? 'diagram' : 'data'} hotBtn={f >= t(88.6) && f < t(89.6) ? 'diagramView' : undefined}>
          {!diagram ? <DataView table="fact" /> : null}
          {diagram ? (
            <div style={{display: 'contents'}}>
              {DRAGS.map((d) => {
                const dr = t(d.drop);
                const o1 = d.rel === 'cust' ? t(100.6) : dr + 14, o2 = d.rel === 'cust' ? t(102.2) : dr + 24, o3 = d.rel === 'cust' ? t(103.4) : dr + 34;
                return <RelLine key={d.rel} r={d.rel} pos={P} f={f} st={{...relSt(f, dr, {one: o1, many: o2, arrow: o3, color: col}), label: d.rel === 'cust' && at(104.0) ? '1:* · single filter' : undefined}} />;
              })}
              {(['prod', 'cust', 'store', 'date', 'fact'] as TId[]).map((id) => <TableBox key={id} id={id} pos={P[id]} st={st(id)} />)}
              <Tag x={P.cust.x} y={P.cust.y + 138} text="Primary Key (1) side" color={C.purple} p={prog(f, t(93.2), 8) * (1 - prog(f, t(97.0), 8))} dark />
              <Tag x={P.fact.x + 6} y={P.fact.y + 160} text="Foreign Key (*) side" color={C.blue} p={prog(f, t(95.2), 8) * (1 - prog(f, t(97.0), 8))} dark />
              <Tag x={P.fact.x + 20} y={P.fact.y + 205} text="★ Star Schema complete · 4 relationships" color={C.amber} p={prog(f, t(113.4), 12)} dark />
            </div>
          ) : null}
          {drag ? <DragChip x={pt.x} y={pt.y} text={drag.name} p={1} /> : null}
          <Pointer f={f} pts={PTS} clicks={CLICKS} />
        </PPWin>
      </Host>
      <Caption text="Visual Relationship Drag & Drop ──► Drag Primary Key to Foreign Key in Diagram View" from={t(88.0)} to={t(106.0)} />
      <div style={{position: 'absolute', left: 100, top: 82, opacity: prog(f, t(114.2), 10) * (1 - prog(f, t(128.6), 10))}}>
        <Chip color={C.purple}>One-to-Many Topology ──► 1:* Relationship · Single Filter Direction Arrow</Chip>
      </div>
    </Stage>
  );
};
