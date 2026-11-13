import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {Caption, Chip, Stage, TopBadge, clamp, prog, sec} from '../kit';
import {PPWin, RelLine, STAR, TABLES, TableBox, TId, TState, RelId, tH} from '../lp';
import {Host} from '../l46';
import {Tag, colW54, factCell, relSt} from '../l54';
import {Gauge} from '../l56';

// SC01 anchors (s, abs): 0.8 badge | 14.8 bloated model (red) | 18.1 32-bit cap | 23.0 64-bit | 26.0-31.0 scan | 31.3 audited | 36.7 integrity
const S = START.s1;
const t = (g: number) => sec(g - S);
const P = STAR;
const ORDER: TId[] = ['prod', 'cust', 'fact', 'store', 'date'];
const CX: Record<TId, number> = {prod: 170 + 115, cust: 170 + 115, fact: 633 + 135, store: 1136 + 115, date: 1136 + 115};

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const open = prog(f, 0, 22);
  const red = prog(f, t(14.8), 12) * (1 - prog(f, t(31.3), 14));
  const sw = prog(f, t(26.0), sec(5.0));
  const sweepX = 90 + sw * 1360;
  const aud = prog(f, t(31.3), 20);
  const blueGlow = (id: TId) => (sw > 0 && sweepX > CX[id] ? 1 : 0);
  const pulse = 0.6 + 0.4 * Math.sin(f * 0.14);
  const st = (id: TId): TState => {
    const scanned = blueGlow(id) > 0;
    const glow = f < t(31.3) ? (scanned ? C.blue : red > 0.05 ? C.red : undefined) : C.blue;
    return {rowsLabel: TABLES[id].rows, glow, glowP: glow ? (glow === C.red ? red * pulse : (f < t(31.3) ? 0.8 : aud * 0.7)) : 0};
  };
  const pctA = f < t(31.3) ? 0.92 * prog(f, t(15.4), 24) : 0.92 - 0.72 * aud;
  const gcol = f < t(31.3) ? C.red : C.blue;
  const labelA = f < t(31.3) ? 'Unaudited model · bloated columns' : 'Audited model · optimized';
  const valA = f < t(31.3) ? '≈ 1.8 GB' : '≈ 0.4 GB';
  const REL5: RelId[] = ['prod', 'cust', 'store', 'date'];
  return (
    <Stage dur={SCENES.s1.dur} inFx="fade" outFx="zoom">
      <Host cell={factCell} colW={colW54} sheets={['Fact_Sales']} sheet="Fact_Sales" tab="Power Pivot">
        <PPWin open={open} view="diagram" status="Diagram View · model diagnostics">
          {REL5.map((r) => <RelLine key={r} r={r} pos={P} f={f} st={relSt(f, 0, {one: 0, many: 0, arrow: 0, color: f < t(31.3) ? C.red : C.green})} />)}
          {ORDER.map((id) => <TableBox key={id} id={id} pos={P[id]} st={st(id)} />)}
          <div style={{position: 'absolute', left: sweepX, top: 152, width: 4, height: 498, background: C.blue, boxShadow: `0 0 26px 8px ${C.blue}`, opacity: sw > 0 && sw < 1 ? 0.9 : 0, zIndex: 20}} />
          <Gauge x={468} y={478} w={600} label={labelA} val={valA} pct={pctA} color={gcol} cap={prog(f, t(18.1), 10) > 0.5 && f < t(31.3) ? '32-bit Excel cap ≈ 2 GB' : undefined} p={prog(f, t(15.0), 12)} sub="illustrative size · millions of rows" />
          <Tag x={468} y={560} text="Microsoft 365 64-bit ──► limit = available RAM" color={C.blue} p={prog(f, t(23.0), 12) * (f < t(31.3) ? 1 : 0)} dark />
          <Tag x={468} y={560} text="Cardinality ✓ · RAM footprint ✓ · limits known" color={C.blue} p={prog(f, t(31.8), 12) * (1 - prog(f, t(36.4), 8))} dark />
          <Tag x={P.fact.x + 6} y={P.fact.y - 34} text="✓ Model integrity verified" color={C.green} p={prog(f, t(36.7), 12)} />
        </PPWin>
      </Host>
      <TopBadge text="الدرس 56 من 76 | ختام الوحدة 11 ──► Data Model Execution & Audit Engine" from={t(0.8)} to={t(17.0)} />
      <div style={{position: 'absolute', left: 100, top: 82}}>
        {prog(f, t(14.8), 10) > 0 && f < t(31.0) ? <div style={{opacity: prog(f, t(14.8), 10)}}><Chip color={C.red}>Unaudited model · memory bloat</Chip></div> : null}
        {f >= t(31.0) ? <div style={{opacity: prog(f, t(31.3), 10)}}><Chip color={C.blue}>Audited model · runs lean in 64-bit</Chip></div> : null}
      </div>
      <Caption text="Unit 11 Finale ──► Data Model Execution, Audit & Limitations" from={t(7.5)} to={t(14.5)} />
      <Caption text="Model Diagnostics ──► Audit RAM Memory Footprint, Cardinality & Engine Limits" from={t(22.0)} to={t(39.8)} />
    </Stage>
  );
};
