import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Mix, PipeNode, Stage, TopBadge, Win, clamp, lin, pop, sec} from '../kit';
import {DAILY_REVENUE} from '../data';

// SC04 (130-170s): PostgreSQL 16 Engine — Sort Node + WindowAgg Node pipeline
// Anchors (s): 131.0 engine | 136.0 Sort Node | 140.0 work_mem | 145.0 sort by date | 150.0 WindowAgg | 155.0 single pass | 160.0 fast | 165.0 efficient
const S = START.s4;
const t = (g: number) => sec(g - S);

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const sortP = clamp(lin(f, t(131.5), 16));
  const windowAggP = clamp(lin(f, t(150), 16));
  const sealP = pop(f, t(160));

  // Sort animation: rows get sorted by date
  const sortProg = clamp(lin(f, t(136), sec(12)));
  // WindowAgg scan: single pass through sorted rows
  const scanProg = clamp(lin(f, t(152), sec(12)));

  // Unsorted input rows (shuffled)
  const unsorted = [
    {day: 4, date: '2024-01-04', amount: 800},
    {day: 1, date: '2024-01-01', amount: 1200},
    {day: 3, date: '2024-01-03', amount: 1450},
    {day: 2, date: '2024-01-02', amount: 950},
    {day: 5, date: '2024-01-05', amount: 1600},
  ];
  const sorted = [...unsorted].sort((a, b) => a.day - b.day);

  return (
    <Stage dur={1200} inFx="zoom" outFx="morph">
      <TopBadge text="كواليس المحرك | PostgreSQL 16 Execution Pipeline" from={sec(2)} to={sec(40)} color={C.amber} />

      {/* EXPLAIN editor at top */}
      <div style={{opacity: sortP}}>
        <Editor
          x={80}
          y={180}
          w={1760}
          h={150}
          title="EXPLAIN · Window Function Plan"
          lines={[
            'Sort  (cost=38.12..38.34 rows=12 width=16)',
            '  Sort Key: order_date',
            '  ->  WindowAgg  (cost=36.80..36.96 rows=12 width=20)',
            '        ->  Seq Scan on daily_revenue',
          ]}
          start={t(131.5)}
          cps={1.0}
          size={22}
          accent={C.amber}
          hl={f >= t(136) ? 0 : -1}
          hlColor={C.amber}
        />
      </div>

      {/* Sort Node — left */}
      <PipeNode x={80} y={360} w={860} h={420} label="Sort Node" sublabel="work_mem · sort by order_date" color={C.amber} p={sortP} glow={f >= t(136) && f < t(150)}>
        <div dir="ltr" style={{position: 'absolute', left: 20, top: 14, fontFamily: MONO, fontSize: 18, color: C.amber}}>
          unsorted input → sorted output
        </div>
        {/* Input rows (left side) — shuffled */}
        <div style={{position: 'absolute', left: 20, top: 50, width: 380}}>
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.muted, marginBottom: 6}}>input (unsorted)</div>
          {unsorted.map((r, i) => {
            const sorted2 = sortProg > (i + 1) / unsorted.length;
            return (
              <div key={r.day} dir="ltr" style={{display: 'flex', gap: 8, alignItems: 'center', padding: '4px 8px', fontFamily: MONO, fontSize: 16, background: sorted2 ? `${C.amber}22` : 'transparent', border: `1px solid ${sorted2 ? C.amber : C.border}`, borderRadius: 6, marginBottom: 4, opacity: sorted2 ? 0.5 : 1, textDecoration: sorted2 ? 'line-through' : 'none'}}>
                <span style={{color: '#475569', width: 30}}>#{r.day}</span>
                <span style={{color: C.blue, flex: 1}}>{r.date}</span>
                <span style={{color: C.text, width: 70, textAlign: 'right'}}>{r.amount}</span>
              </div>
            );
          })}
        </div>
        {/* Arrow */}
        <div dir="ltr" style={{position: 'absolute', left: 410, top: 130, fontFamily: MONO, fontSize: 28, color: C.amber, opacity: sortProg}}>──►</div>
        {/* Output rows (right side) — sorted */}
        <div style={{position: 'absolute', right: 20, top: 50, width: 380}}>
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.muted, marginBottom: 6}}>output (sorted by date)</div>
          {sorted.map((r, i) => {
            const appear = sortProg > (i + 1) / sorted.length;
            return (
              <div key={r.day} dir="ltr" style={{display: 'flex', gap: 8, alignItems: 'center', padding: '4px 8px', fontFamily: MONO, fontSize: 16, background: appear ? `${C.amber}22` : 'transparent', border: `1px solid ${appear ? C.amber : C.border}`, borderRadius: 6, marginBottom: 4, opacity: appear ? 1 : 0.3, transform: appear ? 'translateX(0)' : 'translateX(20px)'}}>
                <span style={{color: C.amber, width: 30, fontWeight: 700}}>#{r.day}</span>
                <span style={{color: C.blue, flex: 1}}>{r.date}</span>
                <span style={{color: C.text, width: 70, textAlign: 'right'}}>{r.amount}</span>
              </div>
            );
          })}
        </div>
        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 20, right: 20, bottom: 14, display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 18, color: C.amber, fontWeight: 700, paddingTop: 8, borderTop: '1px solid ' + C.border}}>
          <span>work_mem buffer</span>
          <span>{Math.round(sortProg * 100)}% sorted</span>
        </div>
      </PipeNode>

      {/* WindowAgg Node — right */}
      <PipeNode x={980} y={360} w={860} h={420} label="WindowAgg Node" sublabel="single-pass · running totals + moving avg" color={C.blue} p={windowAggP} glow={f >= t(150)}>
        <div dir="ltr" style={{position: 'absolute', left: 20, top: 14, fontFamily: MONO, fontSize: 18, color: C.blue}}>
          sorted rows → windowed aggregates
        </div>
        {/* Sorted rows streaming through with scan laser */}
        <div style={{position: 'absolute', left: 20, right: 20, top: 50, height: 260}}>
          {DAILY_REVENUE.slice(0, 7).map((r, i) => {
            const scanned = i / 7 < scanProg;
            const isCurrent = Math.abs(i / 7 - scanProg) < 0.18;
            return (
              <div key={r.day} dir="ltr" style={{display: 'flex', gap: 10, alignItems: 'center', padding: '4px 10px', fontFamily: MONO, fontSize: 17, background: isCurrent ? `${C.blue}33` : scanned ? `${C.green}14` : 'transparent', border: `1px solid ${isCurrent ? C.blue : 'transparent'}`, borderRadius: 6, marginBottom: 3, opacity: scanned ? 1 : 0.4, height: 30}}>
                <span style={{color: '#475569', width: 36}}>#{r.day}</span>
                <span style={{color: C.blue, width: 130}}>{r.date}</span>
                <span style={{color: C.text, width: 80, textAlign: 'right'}}>{r.amount}</span>
                <span style={{flex: 1, textAlign: 'right', color: scanned ? C.green : '#475569', fontWeight: 700}}>
                  {scanned ? '✓ aggregated' : 'pending'}
                </span>
              </div>
            );
          })}
          {/* Scan laser */}
          {scanProg < 1 && scanProg > 0 ? (
            <div style={{position: 'absolute', left: 0, right: 0, top: scanProg * 7 * 33, height: 3, background: C.blue, boxShadow: `0 0 18px ${C.blue}`}} />
          ) : null}
        </div>
        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 20, right: 20, bottom: 14, display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 18, color: C.blue, fontWeight: 700, paddingTop: 8, borderTop: '1px solid ' + C.border}}>
          <span>single-pass evaluation</span>
          <span>{Math.round(scanProg * 100)}% complete</span>
        </div>
      </PipeNode>

      {/* Performance seal */}
      <div style={{position: 'absolute', left: 80, top: 810, width: 1760, opacity: clamp(sealP), display: 'flex', justifyContent: 'center'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16, padding: '14px 28px', border: `2px solid ${C.green}`, borderRadius: 18, background: `${C.green}0d`}}>
          <Check p={sealP} size={48} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 26, color: C.green, fontWeight: 700}}>
            Single-Pass · In-Memory · High Efficiency
          </div>
        </div>
      </div>

      <Caption text="PostgreSQL Execution Pipeline: Sort Node ➔ WindowAgg Node" from={t(136)} to={t(150)} />
      <Caption text="In-Memory Accumulation ──► Single-Pass Evaluation in work_mem" from={t(152)} to={sec(44)} tone="ok" />
    </Stage>
  );
};
