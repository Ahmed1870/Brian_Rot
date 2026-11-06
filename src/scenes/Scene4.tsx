import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Chip, Editor, Kpi, Stage, TopBadge, Win, clamp, lin, pop, sec} from '../kit';
import {EMPS, LEVELS} from '../data';

// SC04 (130-170s): Recursive Union node + Working Table / Intermediate Table swapping in work_mem.
// Anchors (s): 131.3 PostgreSQL 16 | 141.0 two temp boxes | 149.2 intermediate | 154.1 swapping | 161.5 until empty | 164.0 performance
const S = START.s4;
const t = (g: number) => sec(g - S);
const STEPS = [149.2, 154.1, 156.5, 158.9, 161.5];

const Box: React.FC<{y: number; title: string; sub: string; color: string; names: string[]; glow: number; empty?: boolean}> = ({y, title, sub, color, names, glow, empty}) => (
  <div dir="ltr" style={{boxSizing: 'border-box', position: 'absolute', left: 30, top: y, width: 680, height: 250, borderRadius: 20, border: `3px solid ${color}`, background: `${color}14`, boxShadow: glow > 0.05 ? `0 0 ${34 * glow}px ${color}` : 'none', padding: '14px 24px', fontFamily: MONO}}>
    <div style={{display: 'flex', alignItems: 'baseline', gap: 14}}>
      <span style={{fontSize: 30, fontWeight: 700, color}}>{title}</span>
      <span style={{fontSize: 21, color: C.muted}}>{sub}</span>
    </div>
    <div style={{display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 24}}>
      {names.length === 0 ? <span style={{fontSize: 34, color: empty ? C.green : C.muted, fontWeight: 700}}>{empty ? '∅ empty → done ✓' : '—'}</span> : names.map((n) => <Chip key={n} color={color} style={{fontSize: 28, padding: '8px 22px'}}>{n}</Chip>)}
    </div>
  </div>
);

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const win = clamp(lin(f, t(141.0), 16));
  const step = STEPS.reduce((acc, s, i) => (f >= t(s) ? i : acc), -1);
  const nm = (l: number) => (l >= 0 && l < LEVELS.length ? LEVELS[l].map((e) => e.name) : []);
  const wl = step; // working table holds level `step`
  const done = step >= 4;
  const swapFlash = STEPS.some((s) => f >= t(s) && f < t(s) + 14) && step > 0 ? 1 : 0;
  return (
    <Stage dur={1200} inFx="up" outFx="morph">
      <TopBadge text="كواليس PostgreSQL 16 | Recursive Union Node" from={sec(1)} to={sec(40)} color={C.blue} />

      <Editor x={80} y={180} w={980} h={330} title="EXPLAIN" lines={['CTE Scan on emp_hierarchy', '  CTE emp_hierarchy', '    ->  Recursive Union', '          ->  Seq Scan on employees', '          ->  Hash Join', '                ->  WorkTable Scan on emp_hierarchy h']} start={t(133)} cps={1.0} size={22} hl={f >= t(138) ? 2 : -1} hlColor={C.blue} />
      <Kpi x={80} y={560} w={980} label="iterations (buffer swaps)" ar="دورات التبديل" value={String(Math.max(0, step))} color={C.blue} p={lin(f, t(149.2), 14)} glow={swapFlash} />
      <Kpi x={80} y={670} w={980} label="rows scanned from disk per cycle" ar="مسح أحادي في الذاكرة" value="0" color={C.green} p={lin(f, t(164.0), 14)} glow={clamp(lin(f, t(164.0), 14))} />
      <div style={{position: 'absolute', left: 80, top: 790, opacity: clamp(pop(f, t(164.0)))}}><Chip color={C.green} style={{fontSize: 26}}>✓ in-memory · no storage strain</Chip></div>

      <Win x={1100} y={180} w={740} h={700} title="work_mem" accent={done ? C.green : C.blue} opacity={win}>
        <Box y={26} title="Working Table" sub="current step rows" color={C.amber} names={step >= 0 ? nm(wl) : []} glow={step >= 0 ? 1 : 0} empty={done} />
        <div dir="ltr" style={{position: 'absolute', left: 0, right: 0, top: 292, textAlign: 'center', fontFamily: MONO, fontSize: 40, fontWeight: 700, color: swapFlash ? C.green : C.muted, opacity: step >= 0 ? 1 : 0.3}}>⇅ swap</div>
        <Box y={350} title="Intermediate Table" sub="collects next step" color={C.blue} names={step >= 0 ? nm(wl + 1) : []} glow={step >= 0 && wl + 1 < LEVELS.length ? 0.6 : 0} />
      </Win>

      <Caption text="PostgreSQL Execution Engine ──► Executes via Recursive Union Node" from={t(133)} to={t(147)} />
      <Caption text="Buffer Swapping ──► Working Table → Intermediate Table Exchange in work_mem" from={t(150)} to={sec(39)} tone="ok" />
    </Stage>
  );
};
