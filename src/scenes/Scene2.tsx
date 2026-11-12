import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {Caption, Stage, prog, sec} from '../kit';
import {PPWin, STAR, TABLES, TableBox, TId, TState, fieldY, relEnds, tH} from '../lp';
import {Host} from '../l46';
import {Tag, colW54, factCell} from '../l54';

// SC02 anchors (s, abs): 44.7 Dim glow | 46.5 key field | 50.5 PK badge | 53.0 One side | 54.8 FK | 56.5 FK badge | 57.0 repeats | 58.2 Many | 60.4 type match | 66 ready
const S = START.s2;
const t = (g: number) => sec(g - S);
const P = STAR;
const pk = {x: P.prod.x + TABLES.prod.w + 14, y: fieldY('prod', P, 0)};
const fk = {x: P.fact.x - 14, y: fieldY('fact', P, 1)};

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const at = (g: number) => f >= t(g);
  const pulse = 0.6 + 0.4 * Math.sin(f * 0.14);
  const dimG = prog(f, t(44.7), 10) * (1 - prog(f, t(53.8), 12));
  const factG = prog(f, t(54.0), 10) * (1 - prog(f, t(59.6), 12));
  const match = prog(f, t(60.4), 14);
  const ready = prog(f, t(66.0), 14);
  const stP: TState = {glow: C.purple, glowP: dimG * pulse, fieldGlow: at(46.5) ? {0: C.purple} : undefined, rowsLabel: '8 rows'};
  const stF: TState = {glow: C.blue, glowP: factG * pulse, fieldGlow: at(54.8) ? {1: C.blue} : undefined, rowsLabel: '50,000 rows'};
  const plain = (id: TId): TState => ({rowsLabel: TABLES[id].rows});
  const lnA = {x: pk.x - 14, y: pk.y}, lnB = {x: fk.x + 14, y: fk.y};
  const mid = {x: (lnA.x + lnB.x) / 2, y: (lnA.y + lnB.y) / 2};
  const rep = ['101', '103', '101', '105', '101', '102'];
  const nRep = at(57.0) ? Math.min(rep.length, Math.floor((f - t(57.0)) / 6) + 1) : 0;
  return (
    <Stage dur={SCENES.s2.dur} inFx="zoom" outFx="left">
      <Host cell={factCell} colW={colW54} sheets={['Fact_Sales']} sheet="Fact_Sales" tab="Power Pivot">
        <PPWin view="diagram">
          <TableBox id="prod" pos={P.prod} st={stP} />
          <TableBox id="fact" pos={P.fact} st={stF} />
          <TableBox id="cust" pos={P.cust} st={plain('cust')} />
          <TableBox id="store" pos={P.store} st={plain('store')} />
          <TableBox id="date" pos={P.date} st={plain('date')} />
          <Tag x={P.prod.x} y={P.prod.y - 34} text="Dimension table · unique keys" color={C.purple} p={prog(f, t(44.8), 10) * (1 - prog(f, t(53.8), 10))} dark />
          <Tag x={P.prod.x + 8} y={P.prod.y + tH('prod') + 8} text="ProductKey = Primary Key (1)" color={C.purple} p={prog(f, t(50.5), 10)} />
          <Tag x={P.prod.x + 8} y={P.prod.y + tH('prod') + 40} text="values: 101 102 103 104 105 106 107 108 · never repeated" color={C.purple} p={prog(f, t(51.8), 10) * (1 - prog(f, t(60.0), 10))} dark />
          <Tag x={P.prod.x + 8} y={P.prod.y + tH('prod') + 40} text="One Side (1)" color={C.purple} p={prog(f, t(53.0), 10) * (f < t(51.8) ? 0 : 0)} />
          <Tag x={P.fact.x} y={P.fact.y - 34} text="Fact table · repeated keys" color={C.blue} p={prog(f, t(54.0), 10) * (1 - prog(f, t(59.6), 10))} dark />
          <Tag x={P.fact.x + 6} y={P.fact.y + tH('fact') + 8} text="ProductKey = Foreign Key (*)" color={C.blue} p={prog(f, t(56.5), 10)} />
          <div style={{position: 'absolute', left: P.fact.x + 6, top: P.fact.y + tH('fact') + 42, display: 'flex', gap: 8, zIndex: 30}}>
            {rep.slice(0, nRep).map((v, i) => <span key={i} style={{fontFamily: MONO, fontSize: 14, fontWeight: 700, color: '#0B1222', background: C.blue, borderRadius: 6, padding: '2px 8px'}}>{v}</span>)}
            {nRep > 0 ? <Tag x={0} y={0} text="" color={C.blue} p={0} /> : null}
          </div>
          <Tag x={P.fact.x + 6} y={P.fact.y + tH('fact') + 76} text="Many Side (*)" color={C.blue} p={prog(f, t(58.2), 10)} />
          <svg width={1536} height={672} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none', zIndex: 6, opacity: match}}>
            <path d={`M${lnA.x} ${lnA.y} C ${lnA.x + 90} ${lnA.y - 70}, ${lnB.x - 90} ${lnB.y - 70}, ${lnB.x} ${lnB.y}`} fill="none" stroke={C.green} strokeWidth={4} strokeDasharray="10 7" strokeDashoffset={-f * 1.4} style={{filter: `drop-shadow(0 0 7px ${C.green})`}} />
          </svg>
          <Tag x={lnA.x + 4} y={lnA.y + 16} text="Whole Number" color={C.green} p={match} dark />
          <Tag x={lnB.x - 118} y={lnB.y + 16} text="Whole Number" color={C.green} p={match} dark />
          <Tag x={mid.x - 52} y={mid.y + 86} text="✓ types match" color={C.green} p={prog(f, t(61.6), 10)} />
          <Tag x={mid.x - 96} y={mid.y + 122} text="1 ──► * One-to-Many ready" color={C.green} p={ready} dark />
        </PPWin>
      </Host>
      <Caption text="Key Architecture ──► Primary Key (Unique - 1 Side) vs. Foreign Key (Multi - * Side)" from={t(42.0)} to={t(59.6)} />
      <Caption text="Data Type Alignment ──► Matching Key Data Types Ensures High-Performance Joins" from={t(64.0)} to={t(83.8)} tone="ok" />
    </Stage>
  );
};
