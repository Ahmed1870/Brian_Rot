import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Cell, Chip, Editor, Kpi, Mix, Stage, TopBadge, Win, clamp, lerp, lin, pop, sec} from '../kit';
import {CUSTOMERS, SET_IDS} from '../data';

// SC04 (130-170s): Hash Semi-Join inside work_mem, early exit on first match.
// Anchors (s): 131.1 behind the scenes | 136.7 not executed | 138.7 query plan | 145.8 Hash Semi-Join | 148.8 builds | 154.2 work_mem | 155.6 checks | 160.3 without need | 163.6 that's why
const S = START.s4;
const t = (g: number) => sec(g - S);
const BUCKETS = 8;

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const a = clamp(lin(f, t(131.1), 16));
  const b = clamp(lin(f, t(136.7), 16));
  const c = clamp(lin(f, t(145.8), 16));
  const memP = clamp(lin(f, t(148.8), 18));

  return (
    <Stage dur={1200} inFx="zoom" outFx="morph">
      <TopBadge text="كواليس المحرك | Query Optimizer Internals" from={sec(2)} to={sec(40)} color={C.blue} />

      <div dir="ltr" style={{position: 'absolute', left: 80, top: 176, width: 1760, display: 'flex', alignItems: 'center', gap: 22}}>
        <div style={{opacity: a}}><Chip color={C.blue} style={{fontSize: 28}}>WHERE id IN (subquery)</Chip></div>
        <div style={{opacity: b}}><Chip color={C.red} style={{fontSize: 28}}>✗ not run row-by-row</Chip></div>
        <div style={{opacity: c, color: C.amber, fontFamily: MONO, fontSize: 36}}>──►</div>
        <div style={{opacity: c, transform: `scale(${0.85 + 0.15 * c})`}}><Chip color={C.green} style={{fontSize: 28}}>Hash Semi-Join</Chip></div>
      </div>

      <Editor x={80} y={270} w={760} h={330} title="EXPLAIN" lines={['Hash Semi Join', '  Hash Cond: (c.id = o.customer_id)', '  -> Seq Scan on customers c', '  -> Hash', '       -> Seq Scan on orders o']} start={t(138.7)} cps={1.1} size={24} hl={f >= t(145.8) ? 0 : -1} hlColor={C.green} />

      <Kpi x={80} y={650} w={760} label="Nested loop · re-scan per row" ar="تكلفة مضاعفة" value="n × m" color={C.red} p={lin(f, t(160.3), 18)} />
      <Kpi x={80} y={760} w={760} label="Hash Semi Join · one pass" ar="مرور واحد" value="n + m" color={C.green} p={lin(f, t(163.6), 18)} glow={clamp(lin(f, t(163.6), 18))} />

      <Win x={880} y={270} w={960} h={630} title="work_mem (RAM)" accent={C.blue} opacity={memP}>
        <div dir="ltr" style={{position: 'absolute', left: 30, top: 14, fontFamily: MONO, fontSize: 22, color: C.blue}}>hash table · built from the inner set</div>
        {Array.from({length: BUCKETS}).map((_, k) => {
          const idx = SET_IDS.findIndex((v) => v % BUCKETS === k);
          const vis = idx >= 0 ? clamp(lin(f, t(149.2 + idx * 1.1), 14)) : 0;
          const hitNow = idx >= 0 && CUSTOMERS.some((cu, i) => cu.id === SET_IDS[idx] && Math.abs(f - (t(155.6) + i * sec(0.9) + sec(0.65))) < 12);
          return (
            <div key={k} dir="ltr" style={{position: 'absolute', left: 30 + (k % 4) * 225, top: 62 + Math.floor(k / 4) * 120, width: 205, height: 98, borderRadius: 14, border: `3px solid ${hitNow ? C.green : vis > 0 ? C.blue : C.border}`, background: vis > 0 ? `${C.blue}22` : C.deep, boxShadow: hitNow ? `0 0 28px ${C.green}` : 'none', fontFamily: MONO}}>
              <div style={{position: 'absolute', left: 10, top: 4, fontSize: 18, color: C.muted}}>#{k}</div>
              <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 38, fontWeight: 700, color: C.text, opacity: vis}}>{idx >= 0 ? SET_IDS[idx] : ''}</div>
            </div>
          );
        })}
        <div dir="ltr" style={{position: 'absolute', left: 30, top: 320, fontFamily: MONO, fontSize: 22, color: C.muted, opacity: clamp(lin(f, t(155.6), 12))}}>outer rows stream through → probe</div>
        <div style={{position: 'absolute', left: 30, right: 30, top: 358, height: 6, borderRadius: 3, background: C.border, opacity: clamp(lin(f, t(155.6), 12))}} />
        <div dir="ltr" style={{position: 'absolute', right: 30, top: 470, opacity: clamp(lin(f, t(160.3), 16))}}>
          <Chip color={C.green} style={{fontSize: 26}}>✓ early exit on FIRST match</Chip>
        </div>
        {CUSTOMERS.map((cu, i) => {
          const st = t(155.6) + i * sec(0.9);
          const p = lin(f, st, sec(1.3));
          if (p <= 0 || p >= 1) return null;
          const match = SET_IDS.includes(cu.id);
          const past = p > 0.5;
          const x = lerp(840, 40, p);
          const color = !past ? C.text : match ? C.green : '#64748B';
          const y = past && match ? 380 + (p - 0.5) * 120 : 340;
          return (
            <div key={cu.id} dir="ltr" style={{position: 'absolute', left: x, top: y, width: 90, height: 56, borderRadius: 12, border: `3px solid ${color}`, background: `${color}22`, color, fontFamily: MONO, fontWeight: 700, fontSize: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: past && !match ? 1 - (p - 0.5) * 1.4 : 1}}>{cu.id}</div>
          );
        })}
      </Win>

      <Caption text="PostgreSQL Query Optimizer ──► Rewrites IN Subqueries to Hash Semi-Join" from={t(138.7)} to={t(153)} />
      <Caption text="Early Exit Matching ──► Stops scanning inner table upon FIRST match in work_mem" from={t(156)} to={sec(39)} tone="ok" />
    </Stage>
  );
};
