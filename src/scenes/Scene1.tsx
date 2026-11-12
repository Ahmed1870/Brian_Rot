import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, SCENES, START} from '../theme';
import {Caption, Chip, Stage, TopBadge, prog, sec} from '../kit';
import {CHAOS, Mesh, PPWin, STAR, Spokes, TableBox, TId, TState, lerpPos} from '../lp';
import {Host} from '../l46';
import {factCell, colW54} from '../l54';

// SC01 anchors (s, abs): 0.8 badge | 7.9 unit | 15.9 chaos mesh | 22.4 star snap | 27.2 speed | 28 caption
const S = START.s1;
const t = (g: number) => sec(g - S);

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const open = prog(f, 0, 22);
  const snap = prog(f, t(22.4), 38);
  const pos = lerpPos(CHAOS, STAR, snap);
  const mesh = prog(f, t(15.9), 14) * (1 - snap);
  const spokes = prog(f, t(23.6), 20);
  const lbl = prog(f, t(24.2), 10);
  const st = (id: TId): TState => ({rowsLabel: lbl > 0.5 ? (id === 'fact' ? 'FACT' : 'DIM') : '', glow: lbl > 0.5 ? C.blue : undefined, glowP: lbl * 0.7});
  return (
    <Stage dur={SCENES.s1.dur} inFx="fade" outFx="zoom">
      <Host cell={factCell} colW={colW54} sheets={['Fact_Sales']} sheet="Fact_Sales" tab="Power Pivot">
        <PPWin open={open} view="diagram">
          <Mesh pos={pos} p={mesh} />
          <Spokes pos={pos} p={spokes} />
          {(['prod', 'cust', 'store', 'date', 'fact'] as TId[]).map((id) => <TableBox key={id} id={id} pos={pos[id]} st={st(id)} />)}
        </PPWin>
      </Host>
      <TopBadge text="الدرس 54 من 76 | الوحدة 11 من 14 ──► Star Schema, Keys & Relationships Architecture" from={t(0.8)} to={t(17.0)} />
      <div style={{position: 'absolute', left: 100, top: 82, opacity: prog(f, t(17.6), 10) * (1 - prog(f, t(22.2), 10))}}><Chip color={C.red}>Random tangled joins</Chip></div>
      <div style={{position: 'absolute', left: 100, top: 82, opacity: prog(f, t(22.6), 10) * (1 - prog(f, t(27.0), 10))}}><Chip color={C.blue}>Star Schema ──► Fact in the center</Chip></div>
      <div style={{position: 'absolute', left: 100, top: 82, opacity: prog(f, t(27.4), 10)}}><Chip color={C.green}>One direction · fastest queries</Chip></div>
      <Caption text="Unit 11 · Data Model & Power Pivot ──► Star Schema, Keys & Relationships" from={t(7.9)} to={t(15.8)} />
      <Caption text="Optimal Relational Schema ──► Central Fact Table Supported by Radial Dimension Tables" from={t(28.0)} to={t(40.2)} />
    </Stage>
  );
};
