import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Mix, PipeNode, Stage, TopBadge, Warn, Win, clamp, lin, pop, sec} from '../kit';

// SC04 (130-170s): PostgreSQL 16 Engine — WindowAgg Node & Memory Performance
// Anchors: 131.0 engine | 136.0 WindowAgg | 140.0 ROWS fast | 145.0 RANGE peer | 150.0 work_mem | 155.0 disk spill | 160.0 tune | 165.0 efficient
const S = START.s4;
const t = (g: number) => sec(g - S);

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const engineP = clamp(lin(f, t(131.5), 16));
  const rowsP = clamp(lin(f, t(136), 16));
  const rangeP = clamp(lin(f, t(145), 16));
  const spillP = pop(f, t(155));

  // Memory usage animation
  const memUsage = clamp(lin(f, t(137), sec(18)));
  const isSpilling = memUsage > 0.85;

  // ROWS pointer animation — fast jumps
  const rowsPtrProg = clamp(lin(f, t(138), sec(14)));
  // RANGE peer scanning — slower horizontal sweep
  const rangeScanProg = clamp(lin(f, t(146), sec(14)));

  return (
    <Stage dur={1200} inFx="zoom" outFx="morph">
      <TopBadge text="كواليس المحرك | WindowAgg Node & Memory Performance" from={sec(2)} to={sec(40)} color={C.amber} />

      {/* EXPLAIN editor at top */}
      <div style={{opacity: engineP}}>
        <Editor
          x={80}
          y={180}
          w={1760}
          h={120}
          title="EXPLAIN ANALYZE · WindowAgg Performance"
          lines={[
            'WindowAgg  (cost=42.50..42.80 rows=100 width=24)',
            '  ->  Sort  Sort Key: order_date  Sort Method: quicksort  Memory: 25kB',
          ]}
          start={t(131.5)}
          cps={0.95}
          size={18}
          accent={C.amber}
          hl={0}
          hlColor={C.amber}
        />
      </div>

      {/* ROWS path — left (fast pointer) */}
      <PipeNode x={80} y={320} w={860} h={440} label="ROWS Path" sublabel="fast pointer offsets in work_mem" color={C.blue} p={rowsP} glow={f >= t(136) && f < t(145)}>
        <div dir="ltr" style={{position: 'absolute', left: 20, top: 12, fontFamily: MONO, fontSize: 18, color: C.blue}}>
          ⚡ direct pointer jumps · no peer scanning
        </div>

        {/* Pointer slots visualization */}
        <div style={{position: 'absolute', left: 20, right: 20, top: 50, display: 'flex', gap: 8, flexWrap: 'wrap'}}>
          {Array.from({length: 8}).map((_, i) => {
            const isCurrent = Math.floor(rowsPtrProg * 8) === i;
            const isDone = i < Math.floor(rowsPtrProg * 8);
            return (
              <div key={i} dir="ltr" style={{width: 88, height: 70, borderRadius: 10, border: `2px solid ${isCurrent ? C.blue : isDone ? C.green : C.border}`, background: isCurrent ? `${C.blue}22` : isDone ? `${C.green}14` : C.deep, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontSize: 16, color: C.text, opacity: isDone || isCurrent ? 1 : 0.3, boxShadow: isCurrent ? `0 0 16px ${C.blue}` : 'none'}}>
                <div style={{color: '#475569', fontSize: 12}}>slot {i + 1}</div>
                <div style={{color: isCurrent ? C.blue : isDone ? C.green : C.muted, fontWeight: 700}}>${(i + 1) * 200}</div>
                {isCurrent ? <div style={{color: C.blue, fontSize: 11, fontWeight: 700}}>◄ here</div> : null}
              </div>
            );
          })}
        </div>

        {/* Fast pointer arrow */}
        {rowsPtrProg > 0 && rowsPtrProg < 1 ? (
          <svg width={820} height={100} style={{position: 'absolute', left: 20, top: 140, pointerEvents: 'none'}}>
            <line x1={44 + (Math.floor(rowsPtrProg * 8) - 1) * 96} y1={20} x2={44 + Math.floor(rowsPtrProg * 8) * 96} y2={20} stroke={C.blue} strokeWidth={3} strokeDasharray="5 3" />
            <polygon points={`${44 + Math.floor(rowsPtrProg * 8) * 96 - 8},14 ${44 + Math.floor(rowsPtrProg * 8) * 96 - 8},26 ${44 + Math.floor(rowsPtrProg * 8) * 96 + 2},20`} fill={C.blue} />
            <text x={44 + (Math.floor(rowsPtrProg * 8) - 0.5) * 96} y={12} fill={C.blue} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">⚡ jump</text>
          </svg>
        ) : null}

        {/* Performance badge */}
        <div style={{position: 'absolute', left: 20, right: 20, bottom: 60, display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', border: `2px solid ${C.green}`, borderRadius: 10, background: `${C.green}0d`}}>
          <Check p={1} size={32} color={C.green} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700}}>fast · O(1) pointer access</div>
        </div>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 20, right: 20, bottom: 14, display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 16, color: C.blue, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border}}>
          <span>pointer offset mode</span>
          <span>{Math.round(rowsPtrProg * 100)}% done</span>
        </div>
      </PipeNode>

      {/* RANGE path — right (peer scanning) */}
      <PipeNode x={980} y={320} w={860} h={440} label="RANGE Path" sublabel="peer value scanning · slower" color={C.amber} p={rangeP} glow={f >= t(145)}>
        <div dir="ltr" style={{position: 'absolute', left: 20, top: 12, fontFamily: MONO, fontSize: 18, color: C.amber}}>
          🔍 scans peer groups for duplicate values
        </div>

        {/* Peer group visualization */}
        <div style={{position: 'absolute', left: 20, right: 20, top: 50, display: 'flex', flexDirection: 'column', gap: 10}}>
          {[
            {label: 'group A (3 peers)', count: 3, color: C.amber},
            {label: 'group B (2 peers)', count: 2, color: C.amber},
            {label: 'group C (1 peer)', count: 1, color: C.amber},
          ].map((group, gi) => {
            const isScanning = rangeScanProg > gi / 3 && rangeScanProg < (gi + 1) / 3;
            const isDone = rangeScanProg >= (gi + 1) / 3;
            return (
              <div key={gi} dir="ltr" style={{display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', border: `2px solid ${isScanning ? C.amber : isDone ? C.green : C.border}`, borderRadius: 10, background: isScanning ? `${C.amber}22` : isDone ? `${C.green}14` : 'transparent', opacity: isDone || isScanning ? 1 : 0.4}}>
                <span style={{fontFamily: MONO, fontSize: 16, color: C.muted, width: 140}}>{group.label}</span>
                <div style={{display: 'flex', gap: 4}}>
                  {Array.from({length: group.count}).map((_, i) => (
                    <div key={i} style={{width: 40, height: 36, borderRadius: 6, border: `2px solid ${isScanning ? C.amber : isDone ? C.green : C.border}`, background: isScanning ? `${C.amber}22` : isDone ? `${C.green}14` : C.deep, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontSize: 14, color: isDone ? C.green : C.amber}}>${(gi + 1) * 100 + i * 50}</div>
                  ))}
                </div>
                <span style={{flex: 1, textAlign: 'right', fontFamily: MONO, fontSize: 14, color: isDone ? C.green : isScanning ? C.amber : '#475569', fontWeight: 700}}>
                  {isDone ? '✓ scanned' : isScanning ? 'scanning...' : 'pending'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Memory bar */}
        <div style={{position: 'absolute', left: 20, right: 20, bottom: 60}}>
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.muted, marginBottom: 4}}>work_mem usage</div>
          <div style={{height: 22, borderRadius: 11, background: C.deep, border: `2px solid ${C.border}`, overflow: 'hidden', position: 'relative'}}>
            <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${memUsage * 100}%`, background: isSpilling ? `linear-gradient(90deg, ${C.amber}, ${C.red})` : `linear-gradient(90deg, ${C.green}, ${C.amber})`, borderRadius: 11}} />
            <div dir="ltr" style={{position: 'absolute', right: 8, top: 2, fontFamily: MONO, fontSize: 12, color: C.text, fontWeight: 700}}>{Math.round(memUsage * 100)}%</div>
          </div>
        </div>

        {/* Disk spill warning */}
        {isSpilling ? (
          <div style={{position: 'absolute', left: 20, right: 20, bottom: 14, display: 'flex', alignItems: 'center', gap: 10, padding: '6px 12px', border: `2px solid ${C.red}`, borderRadius: 8, background: `${C.red}14`}}>
            <Warn size={28} color={C.red} />
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.red, fontWeight: 700}}>Disk Spill! External Merge</div>
          </div>
        ) : (
          <div dir="ltr" style={{position: 'absolute', left: 20, right: 20, bottom: 14, display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 16, color: C.amber, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border}}>
            <span>peer scanning mode</span>
            <span>{Math.round(rangeScanProg * 100)}% done</span>
          </div>
        )}
      </PipeNode>

      <Caption text="Engine Performance: ROWS Fast Pointer Offset vs RANGE Peer Value Scanning" from={t(136)} to={t(150)} />
      <Caption text="Memory Management ──► Keep Window Buffers in work_mem to Prevent Disk Spill" from={t(152)} to={sec(44)} tone="danger" />
    </Stage>
  );
};
