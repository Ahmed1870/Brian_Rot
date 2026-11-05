import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Mix, PipeNode, Stage, TopBadge, Warn, Win, clamp, lin, pop, sec} from '../kit';

// SC04 (130-170s): PostgreSQL 16 Engine — Sort Node + WindowAgg + work_mem Disk Spill
// Anchors (s): 131.0 engine | 136.0 Sort Node | 140.0 work_mem | 145.0 WindowAgg | 150.0 single pass | 155.0 disk spill | 160.0 external merge | 165.0 tune
const S = START.s4;
const t = (g: number) => sec(g - S);

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const engineP = clamp(lin(f, t(131.5), 16));
  const sortP = clamp(lin(f, t(136), 16));
  const windowAggP = clamp(lin(f, t(145), 16));
  const spillP = pop(f, t(155));

  // Memory usage animation — fills up then spills
  const memUsage = clamp(lin(f, t(137), sec(18)));
  const isSpilling = memUsage > 0.85;

  return (
    <Stage dur={1200} inFx="zoom" outFx="morph">
      <TopBadge text="كواليس المحرك | Sort + WindowAgg & Memory Allocation" from={sec(2)} to={sec(40)} color={C.amber} />

      {/* EXPLAIN editor at top */}
      <div style={{opacity: engineP}}>
        <Editor
          x={80}
          y={180}
          w={1760}
          h={140}
          title="EXPLAIN ANALYZE · Window Function Plan"
          lines={[
            'WindowAgg  (cost=42.50..42.80 rows=100 width=24)',
            '  ->  Sort  (cost=42.20..42.35 rows=100 width=16)',
            '        Sort Key: total_spent DESC',
            '        Sort Method: quicksort  Memory: 25kB',
          ]}
          start={t(131.5)}
          cps={0.9}
          size={18}
          accent={C.amber}
          hl={f >= t(136) ? 1 : -1}
          hlColor={C.amber}
        />
      </div>

      {/* Sort Node — left */}
      <PipeNode x={80} y={340} w={860} h={440} label="Sort Node" sublabel="work_mem · sort by total_spent DESC" color={C.amber} p={sortP} glow={f >= t(136) && f < t(145)}>
        <div dir="ltr" style={{position: 'absolute', left: 20, top: 12, fontFamily: MONO, fontSize: 18, color: C.amber}}>
          unsorted → sorted in memory
        </div>

        {/* Memory bar visualization */}
        <div style={{position: 'absolute', left: 20, right: 20, top: 50}}>
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 16, color: C.muted, marginBottom: 6}}>work_mem usage</div>
          <div style={{height: 28, borderRadius: 14, background: C.deep, border: `2px solid ${C.border}`, overflow: 'hidden', position: 'relative'}}>
            <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${memUsage * 100}%`, background: isSpilling ? `linear-gradient(90deg, ${C.amber}, ${C.red})` : `linear-gradient(90deg, ${C.green}, ${C.amber})`, borderRadius: 14, transition: 'none'}} />
            <div dir="ltr" style={{position: 'absolute', right: 12, top: 4, fontFamily: MONO, fontSize: 14, color: C.text, fontWeight: 700}}>
              {Math.round(memUsage * 100)}%
            </div>
          </div>
          {/* Memory threshold marker */}
          <div style={{position: 'absolute', right: '15%', top: -4, width: 2, height: 36, background: C.red, opacity: 0.6}} />
          <div dir="ltr" style={{position: 'absolute', right: '12%', top: -20, fontFamily: MONO, fontSize: 12, color: C.red}}>limit</div>
        </div>

        {/* Sort method badge */}
        <div style={{position: 'absolute', left: 20, right: 20, top: 130}}>
          <div style={{display: 'flex', gap: 12}}>
            <div style={{flex: 1, padding: '12px 16px', border: `2px solid ${isSpilling ? C.border : C.green}`, borderRadius: 10, background: isSpilling ? 'transparent' : `${C.green}0d`, opacity: isSpilling ? 0.4 : 1}}>
              <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700}}>quicksort Memory</div>
              <div dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.muted}}>in-RAM · fast</div>
            </div>
            <div style={{flex: 1, padding: '12px 16px', border: `2px solid ${isSpilling ? C.red : C.border}`, borderRadius: 10, background: isSpilling ? `${C.red}0d` : 'transparent', opacity: isSpilling ? 1 : 0.4}}>
              <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.red, fontWeight: 700}}>External Merge Disk</div>
              <div dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.muted}}>spill to disk · slow</div>
            </div>
          </div>
        </div>

        {/* Rows flowing through sort */}
        <div style={{position: 'absolute', left: 20, right: 20, top: 230, height: 120}}>
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 16, color: C.muted, marginBottom: 8}}>input rows → sorted output</div>
          <div style={{display: 'flex', gap: 6, flexWrap: 'wrap'}}>
            {[5, 2, 8, 1, 9, 3, 7, 4, 6, 10].slice(0, 6).map((v, i) => {
              const sorted2 = memUsage > (i + 1) / 6;
              return (
                <div key={i} dir="ltr" style={{width: 50, height: 40, borderRadius: 8, border: `2px solid ${sorted2 ? C.green : C.amber}`, background: sorted2 ? `${C.green}22` : `${C.amber}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontSize: 18, fontWeight: 700, color: sorted2 ? C.green : C.amber, opacity: sorted2 ? 1 : 0.6}}>
                  {sorted2 ? i + 1 : v}
                </div>
              );
            })}
          </div>
        </div>

        {/* Disk spill warning */}
        {isSpilling ? (
          <div style={{position: 'absolute', left: 20, right: 20, bottom: 14, display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', border: `2px solid ${C.red}`, borderRadius: 10, background: `${C.red}14`}}>
            <Warn size={32} color={C.red} />
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 16, color: C.red, fontWeight: 700}}>Disk Spill! External Merge Sort activated</div>
          </div>
        ) : null}
      </PipeNode>

      {/* WindowAgg Node — right */}
      <PipeNode x={980} y={340} w={860} h={440} label="WindowAgg Node" sublabel="single-pass · NTILE + PERCENT_RANK + CUME_DIST" color={C.blue} p={windowAggP} glow={f >= t(145)}>
        <div dir="ltr" style={{position: 'absolute', left: 20, top: 12, fontFamily: MONO, fontSize: 18, color: C.blue}}>
          sorted rows → windowed aggregates
        </div>

        {/* Function evaluation list */}
        <div style={{position: 'absolute', left: 20, right: 20, top: 50}}>
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 16, color: C.muted, marginBottom: 10}}>evaluating window functions:</div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
            {[
              {fn: 'NTILE(4)', desc: 'bucket assignment', color: C.purple, done: memUsage > 0.3},
              {fn: 'PERCENT_RANK()', desc: 'relative rank', color: C.blue, done: memUsage > 0.5},
              {fn: 'CUME_DIST()', desc: 'cumulative dist', color: C.green, done: memUsage > 0.7},
            ].map((item) => (
              <div key={item.fn} dir="ltr" style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 14px', border: `2px solid ${item.done ? item.color : C.border}`, borderRadius: 10, background: item.done ? `${item.color}0d` : 'transparent', opacity: item.done ? 1 : 0.4}}>
                <span style={{fontFamily: MONO, fontSize: 18, fontWeight: 700, color: item.color, width: 180}}>{item.fn}</span>
                <span style={{fontFamily: MONO, fontSize: 14, color: C.muted}}>{item.desc}</span>
                <span style={{flex: 1, textAlign: 'right', fontFamily: MONO, fontSize: 14, color: item.done ? item.color : '#475569', fontWeight: 700}}>
                  {item.done ? '✓ computed' : 'pending'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Single-pass indicator */}
        <div style={{position: 'absolute', left: 20, right: 20, bottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 18, color: C.blue, fontWeight: 700, paddingTop: 8, borderTop: '1px solid ' + C.border}}>
          <span>single-pass evaluation</span>
          <span>{Math.round(clamp(memUsage) * 100)}% complete</span>
        </div>
      </PipeNode>

      {/* Bottom tuning advisory */}
      <div style={{position: 'absolute', left: 80, top: 810, width: 1760, opacity: clamp(spillP), display: 'flex', justifyContent: 'center'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '14px 28px', border: `2px solid ${C.amber}`, borderRadius: 18, background: `${C.amber}0d`}}>
          <Warn size={40} color={C.amber} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 22, color: C.amber, fontWeight: 700}}>
            Tune work_mem to prevent Disk Spill on large datasets
          </div>
        </div>
      </div>

      <Caption text="PostgreSQL Execution Engine: Sort Node ➔ WindowAgg Node" from={t(136)} to={t(150)} />
      <Caption text="Memory Allocation: quicksort Memory vs External Merge Disk Spill" from={t(152)} to={sec(44)} tone="danger" />
    </Stage>
  );
};
