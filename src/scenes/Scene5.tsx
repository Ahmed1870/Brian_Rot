import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {Caption, KeyBadge, Stage, pop, prog, sec} from '../kit';
import {PPWin, RelLine, RelId, STAR, TABLES, TableBox, TId, TState} from '../lp';
import {Host} from '../l46';
import {Tag, colW54, factCell, relSt} from '../l54';
import {Gauge, fmt, pivotFull} from '../l56';

// SC05 anchors (s, abs): 171.4 file + counts | 185.3 cardinality | 187.2 unused cols | 189.2 4 relationships | 191.0 blank=0 | 193.4 50,000 rows / 4 tables | 194.0 pivot | 196.8 refresh | 200.3 seal | 205.8 reliable
const S = START.s5;
const t = (g: number) => sec(g - S);
const P = STAR;
const REL4: RelId[] = ['prod', 'cust', 'store', 'date'];
const colW5 = (c: number) => [0, 150, 100, 100, 100, 100, 100, 110][c] ?? 64;
const CHECKS: Array<[number, string, TId | 'all']> = [
  [185.3, '✓ Cardinality: DateTime split into Date + Time', 'fact'],
  [187.2, '✓ Unused text columns removed', 'fact'],
  [189.2, '✓ 4 active 1:* relationships', 'all'],
  [191.0, '✓ (blank) rows in PivotTable: 0', 'prod'],
];

export const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  const at = (g: number) => f >= t(g);
  const ppOpen = 1 - prog(f, t(193.6), 10);
  const cnt = prog(f, t(171.4), 70);
  const labels: Record<TId, string> = {fact: `${fmt(Math.round(50000 * cnt))} rows`, cust: `${Math.round(400 * cnt)} rows`, date: `${Math.round(365 * cnt)} rows`, prod: `${Math.round(8 * cnt)} rows`, store: `${Math.round(5 * cnt)} rows`};
  const pulse = 0.6 + 0.4 * Math.sin(f * 0.14);
  const hot = (id: TId): boolean => CHECKS.some(([g, , w]) => at(g) && !at(g + 1.9) && (w === id || w === 'all'));
  const st = (id: TId): TState => ({rowsLabel: labels[id], glow: hot(id) ? C.green : undefined, glowP: hot(id) ? pulse : 0});
  const seal = pop(f, t(200.3));
  const gauge = prog(f, t(184.2), 12);
  return (
    <Stage dur={SCENES.s5.dur} inFx="up" outFx="fade">
      <Host tab="Home" cell={ppOpen > 0.01 ? factCell : pivotFull} colW={ppOpen > 0.01 ? colW54 : colW5} sheets={['Report']} sheet="Report" glow={at(200.3) ? C.green : undefined}>
        {ppOpen > 0.01 ? (
          <PPWin open={ppOpen} view="diagram" status="Diagram View · audit">
            {REL4.map((r) => <RelLine key={r} r={r} pos={P} f={f} st={relSt(f, 0, {one: 0, many: 0, arrow: 0, color: C.green})} />)}
            {(['prod', 'cust', 'store', 'date', 'fact'] as TId[]).map((id) => <TableBox key={id} id={id} pos={P[id]} st={st(id)} />)}
            <Tag x={P.fact.x} y={P.fact.y - 34} text="manzooma_sales_2026.xlsx" color={C.blue} p={prog(f, t(171.4), 10)} dark />
            <Gauge x={1000} y={560} w={420} label="Model memory · audited" val="lean ✓" pct={0.2} color={C.green} p={gauge} sub="illustrative" />
            {CHECKS.map(([g, txt], i) => <Tag key={txt} x={440} y={462 + i * 34} text={txt} color={C.green} p={prog(f, t(g), 10)} dark />)}
            <Tag x={P.fact.x + 20} y={P.fact.y + 200} text="50,000 rows · 4 model tables" color={C.blue} p={prog(f, t(193.2), 8)} />
          </PPWin>
        ) : null}
        {ppOpen < 0.01 ? <Tag x={300} y={400} text="PivotTable on the audited Data Model" color={C.green} p={prog(f, t(194.2), 10) * (1 - prog(f, t(199.0), 10))} dark /> : null}
        {ppOpen < 0.01 && at(197.6) && f < t(199.4) ? <Tag x={300} y={436} text="Refresh All ✓" color={C.green} p={prog(f, t(197.6), 8)} /> : null}
      </Host>
      {f >= t(196.8) && f < t(198.8) ? <KeyBadge keys={['Ctrl', 'Alt', 'F5']} p={prog(f, t(196.8), 6) * (1 - prog(f, t(198.5), 6))} /> : null}
      <div style={{position: 'absolute', left: 1330, top: 520, width: 440, padding: '10px 0 14px', borderRadius: 24, background: 'rgba(11,18,34,0.92)', border: `2px solid ${C.green}`, boxShadow: `0 0 40px ${C.green}66`, textAlign: 'center', opacity: seal, transform: `scale(${0.7 + 0.3 * seal})`, zIndex: 9}} dir="ltr">
        <svg width={150} height={150} viewBox="0 0 230 230"><circle cx={115} cy={115} r={104} fill="#10B98122" stroke={C.green} strokeWidth={6} /><circle cx={115} cy={115} r={86} fill="none" stroke={C.green} strokeWidth={2} strokeDasharray="6 6" /><polyline points="72,118 104,150 162,84" fill="none" stroke={C.green} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" /></svg>
        <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 24, color: C.green, marginTop: -4}}>UNIT 11 COMPLETE</div>
        <div style={{fontFamily: MONO, fontSize: 18, color: C.text}}>Data Model & Power Pivot</div>
      </div>
      <Caption text="Enterprise Model Validation ──► Audit & Optimize 50,000 Sales Rows Across 4 Model Tables" from={t(172.0)} to={t(190.0)} />
      <Caption text="Unit 11 Completion Seal ──► Data Model & Power Pivot Engine Mastered" from={t(199.8)} to={t(208.0)} tone="ok" />
    </Stage>
  );
};
