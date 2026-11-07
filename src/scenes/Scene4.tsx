import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {HASH_AGG_STATS, PARALLEL_WORKERS} from '../data';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, Warn, clamp, lin, lerp, pop, sec} from '../kit';

// SC04 (130-170s): PostgreSQL 16 Parallel Workers & work_mem Hash Aggregation
// 4 parallel workers split the 12.6M-row aggregation; hash aggregation runs in work_mem (no disk spill)
// Anchors (scene-local seconds):
//   131.0 parallel query | 136.0 workers | 140.0 hash agg | 145.0 work_mem | 150.0 no disk spill | 155.0 seal
const S = START.s4;
const t = (g: number) => sec(g - S);

const colorOf = (k: string) => (k === 'blue' ? C.blue : k === 'purple' ? C.purple : C.green);

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(131), 14));
  const parP = pop(f, t(131));
  const workP = pop(f, t(136));
  const hashP = pop(f, t(140));
  const memP = pop(f, t(145));
  const spillP = pop(f, t(150));
  const sealP = pop(f, t(155));

  const pulse = 0.5 + 0.5 * Math.sin(f * 0.17);
  // Worker processing progress (each worker fills its bar)
  const workProg = clamp(lin(f, t(136), sec(10)));
  // Hash aggregation progress
  const hashProg = clamp(lin(f, t(140), sec(8)));

  return (
    <Stage dur={1200} inFx="zoom" outFx="morph">
      <TopBadge text="هندسة المحرك الداخلية | Parallel Query Execution · work_mem Hash Aggregation (Module 16)" from={sec(2)} to={sec(38)} color={C.purple} />

      {/* LEFT: Engine internals code editor */}
      <div style={{opacity: editorP}}>
        <Editor
          x={80}
          y={170}
          w={680}
          h={300}
          title="engine_internals.sql · parallel execution settings (PostgreSQL 16)"
          lines={[
            '-- Enable parallel query execution',
            'SET max_parallel_workers = 8;',
            'SET max_parallel_workers_per_gather = 4;',
            'SET work_mem = \'64MB\';',
            'SET enable_hashagg = on;',
            '',
            '-- Verify parallel plan for analytics pipeline',
            'EXPLAIN ANALYZE',
            '  SELECT date_trunc(\'month\', order_date),',
            '         SUM(total_amount)',
            '  FROM store_orders GROUP BY 1;',
            '',
            '-- Plan: Gather · 4 Parallel Workers · Hash Aggregate',
          ]}
          start={t(131)}
          cps={0.55}
          size={14}
          accent={C.purple}
          hl={5}
          hlColor={C.purple}
        />
      </div>

      {/* Concept chips below editor */}
      <div style={{position: 'absolute', left: 80, top: 490, width: 680, opacity: clamp(parP)}}>
        <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.muted, marginBottom: 10}}>◆ Parallel execution golden rule</div>
        <div style={{display: 'flex', gap: 10, flexWrap: 'wrap'}}>
          <Chip color={C.blue} style={{fontSize: 16, padding: '4px 14px'}}>4 Parallel Workers</Chip>
          <Chip color={C.purple} style={{fontSize: 16, padding: '4px 14px'}}>Hash Aggregation</Chip>
          <Chip color={C.green} style={{fontSize: 16, padding: '4px 14px'}}>work_mem 64MB</Chip>
          <Chip color={C.green} style={{fontSize: 16, padding: '4px 14px'}}>no disk spill ✓</Chip>
        </div>
      </div>

      {/* Hash aggregation benchmark */}
      <Win x={80} y={570} w={680} h={330} title="benchmark ──► in-memory hash agg vs disk spill (sub-second)" accent={C.green} opacity={clamp(lin(f, t(145), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, right: 18, fontFamily: MONO, fontSize: 14, color: C.green, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
          12.6M rows · 4 workers · 64MB work_mem · {HASH_AGG_STATS.executionMs}ms · 0 disk writes
        </div>

        <div style={{position: 'absolute', right: 18, top: 38, display: 'flex', gap: 8}}>
          <Chip color={C.red} style={{fontSize: 12, padding: '4px 10px'}}>disk spill ✗</Chip>
          <Chip color={C.green} style={{fontSize: 12, padding: '4px 10px'}}>{HASH_AGG_STATS.executionMs}ms ✓</Chip>
        </div>

        <svg width={640} height={220} style={{position: 'absolute', left: 18, top: 70}}>
          {/* Disk spill bar (red, slow) */}
          <g style={{opacity: clamp(pop(f, t(145)))}}>
            <text x={20} y={20} fill={C.red} fontSize={11} fontFamily={MONO} fontWeight={700}>disk spill (work_mem too small) · slow</text>
            <rect x={20} y={28} width={500} height={28} fill={`${C.red}22`} stroke={C.red} strokeWidth={2.5} rx={6} strokeDasharray="6 4" opacity={0.6} />
            <text x={270} y={47} fill={C.red} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">2400ms · writes to temp files · disk I/O bottleneck</text>
          </g>

          {/* In-memory hash agg bar (green, fast) */}
          <g style={{opacity: clamp(pop(f, t(146)))}}>
            <text x={20} y={85} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700}>in-memory hash aggregation (work_mem 64MB) · fast</text>
            <rect x={20} y={93} width={20} height={28} fill={`${C.green}33`} stroke={C.green} strokeWidth={3} rx={4} style={{filter: `drop-shadow(0 0 8px ${C.green})`}} />
            <text x={60} y={112} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700}>{HASH_AGG_STATS.executionMs}ms · ✓ all in memory</text>
          </g>

          {/* Memory utilization gauge */}
          <g style={{opacity: clamp(pop(f, t(148)))}}>
            <text x={20} y={150} fill={C.purple} fontSize={11} fontFamily={MONO} fontWeight={700}>work_mem · {HASH_AGG_STATS.workMemMB}MB · {HASH_AGG_STATS.memoryUtil}% utilized</text>
            <rect x={20} y={160} width={500} height={22} fill={C.deep} stroke={C.purple} strokeWidth={1.5} rx={4} />
            <rect x={20} y={160} width={500 * (HASH_AGG_STATS.memoryUtil / 100)} height={22} fill={C.purple} rx={4} style={{filter: `drop-shadow(0 0 6px ${C.purple}88)`}} />
            <text x={270} y={175} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">{HASH_AGG_STATS.workMemMB}MB · {HASH_AGG_STATS.hashBuckets} hash buckets · 0 spills ✓</text>
          </g>

          {/* Footer */}
          <g style={{opacity: clamp(sealP)}}>
            <rect x={20} y={195} width={500} height={20} fill={`${C.green}22`} stroke={C.green} strokeWidth={2} rx={6} />
            <text x={270} y={210} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ 6.3× speedup · production-ready · zero disk I/O</text>
          </g>
        </svg>
      </Win>

      {/* RIGHT: 4 parallel workers visualization */}
      <Win x={800} y={170} w={1040} h={730} title="parallel execution engine ──► 4 workers split 12.6M rows · hash aggregation in work_mem" accent={C.blue} opacity={clamp(lin(f, t(136), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, right: 18, fontFamily: MONO, fontSize: 16, color: C.blue, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
          PostgreSQL 16 parallel query · 4 workers · 12.6M rows → in-memory hash aggregation · {HASH_AGG_STATS.executionMs}ms
        </div>

        <div style={{position: 'absolute', right: 18, top: 38, display: 'flex', gap: 8}}>
          <Chip color={C.blue} style={{fontSize: 12, padding: '4px 10px'}}>4 workers</Chip>
          <Chip color={C.amber} style={{fontSize: 12, padding: '4px 10px'}}>{workProg > 0.05 && workProg < 0.99 ? 'processing...' : 'idle'}</Chip>
          <Chip color={C.green} style={{fontSize: 12, padding: '4px 10px'}}>{workProg > 0.95 ? 'aggregated ✓' : '...'}</Chip>
        </div>

        <svg width={1000} height={620} style={{position: 'absolute', left: 20, top: 70}}>
          {/* Source table (top) */}
          <g style={{opacity: clamp(parP)}}>
            <rect x={350} y={20} width={300} height={60} fill={`${C.amber}22`} stroke={C.amber} strokeWidth={3} rx={10} />
            <text x={500} y={45} fill={C.amber} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">store_orders · 12.6M rows</text>
            <text x={500} y={65} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">to be aggregated by month</text>
          </g>

          {/* Splitter arrow (Gather node) */}
          <g style={{opacity: clamp(parP)}}>
            <rect x={400} y={100} width={200} height={36} fill={`${C.purple}33`} stroke={C.purple} strokeWidth={2.5} rx={8} />
            <text x={500} y={123} fill={C.purple} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">Gather · parallel split</text>
            <line x1={500} y1={80} x2={500} y2={100} stroke={C.purple} strokeWidth={2} strokeDasharray="4 3" opacity={0.6} />
          </g>

          {/* 4 worker nodes (parallel) */}
          {PARALLEL_WORKERS.map((w, i) => {
            const color = colorOf(w.color);
            const x = 80 + i * 220;
            const wP = clamp(pop(f, t(136 + i * 0.4)));
            // Each worker's progress bar
            const wProg = clamp(workProg - i * 0.05);
            return (
              <g key={i} style={{opacity: clamp(wP)}}>
                {/* Connector from Gather */}
                <line x1={500} y1={136} x2={x + 100} y2={180} stroke={color} strokeWidth={2} strokeDasharray="4 3" opacity={0.5} />
                <polygon points={`${x + 95},174 ${x + 105},174 ${x + 100},184`} fill={color} />

                {/* Worker box */}
                <rect x={x} y={185} width={200} height={180} fill={`${color}22`} stroke={color} strokeWidth={2.5} rx={10} style={{filter: `drop-shadow(0 0 6px ${color}66)`}} />
                <text x={x + 100} y={210} fill={color} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">{w.name}</text>
                <text x={x + 100} y={230} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">worker #{w.id}</text>

                {/* Rows assigned */}
                <text x={x + 100} y={258} fill={C.text} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">{w.rows}</text>
                <text x={x + 100} y={275} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">rows assigned</text>

                {/* Progress bar */}
                <rect x={x + 20} y={290} width={160} height={14} fill={C.deep} stroke={color} strokeWidth={1} rx={3} />
                <rect x={x + 20} y={290} width={160 * wProg} height={14} fill={color} rx={3} style={{filter: `drop-shadow(0 0 4px ${color})`}} />
                <text x={x + 100} y={324} fill={color} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">{Math.round(wProg * 100)}% · {w.status}</text>

                {/* Mini hash buckets visualization */}
                <g>
                  {Array.from({length: 6}, (_, bi) => {
                    const filled = wProg > (bi + 1) / 6;
                    return (
                      <rect key={bi} x={x + 20 + bi * 28} y={345} width={22} height={14} fill={filled ? color : C.deep} stroke={color} strokeWidth={1} rx={2} />
                    );
                  })}
                </g>
              </g>
            );
          })}

          {/* Merge arrows down to hash aggregation */}
          <g style={{opacity: clamp(hashP)}}>
            {PARALLEL_WORKERS.map((_, i) => {
              const x = 80 + i * 220 + 100;
              return (
                <line key={i} x1={x} y1={365} x2={500} y2={420} stroke={C.green} strokeWidth={2} strokeDasharray="4 3" opacity={0.5} />
              );
            })}
            <polygon points="494,414 506,414 500,424" fill={C.green} />
          </g>

          {/* Hash aggregation node (green, center) */}
          <g style={{opacity: clamp(hashP)}}>
            <rect x={300} y={420} width={400} height={80} fill={`${C.green}33`} stroke={C.green} strokeWidth={3} rx={12} style={{filter: `drop-shadow(0 0 ${10 + pulse * 6}px ${C.green})`}} />
            <text x={500} y={450} fill={C.green} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">Hash Aggregation · work_mem 64MB</text>
            <text x={500} y={472} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">8192 hash buckets · merges worker partial results</text>
            <text x={500} y={490} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">{HASH_AGG_STATS.executionMs}ms · 0 disk writes ✓</text>
          </g>

          {/* Result: aggregated output */}
          <g style={{opacity: clamp(sealP)}}>
            <line x1={500} y1={500} x2={500} y2={530} stroke={C.green} strokeWidth={3} strokeDasharray="6 4" opacity={0.7} />
            <polygon points="494,524 506,524 500,538" fill={C.green} />
            <rect x={250} y={540} width={500} height={60} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 12px ${C.green})`}} />
            <text x={500} y={568} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ Aggregated Output · 12 months · sub-second</text>
            <text x={500} y={588} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">4 workers · in-memory hash · zero disk spill · production-ready</text>
          </g>
        </svg>

        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 13, fontWeight: 700, paddingTop: 4, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.blue}}>4 parallel workers</span>
          <span style={{color: C.purple}}>work_mem 64MB</span>
          <span style={{color: C.green}}>{HASH_AGG_STATS.executionMs}ms ✓</span>
        </div>
      </Win>

      {/* Seal badge bottom-left */}
      <div style={{position: 'absolute', left: 80, top: 920, opacity: clamp(sealP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 22px', border: `2px solid ${C.blue}`, borderRadius: 14, background: `${C.blue}0d`}}>
          <Check p={sealP} size={36} color={C.blue} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.blue, fontWeight: 700}}>Parallel Workers · Sealed ✓</div>
        </div>
      </div>

      {/* work_mem badge bottom-right */}
      <div style={{position: 'absolute', right: 80, top: 920, opacity: clamp(pop(f, t(160)))}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 22px', border: `2px solid ${C.green}`, borderRadius: 14, background: `${C.green}0d`}}>
          <Check p={pop(f, t(160))} size={36} color={C.green} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700}}>work_mem · {HASH_AGG_STATS.executionMs}ms ✓</div>
        </div>
      </div>

      <Caption text="Parallel Workers ──► 4 workers ──► 12.6M rows ──► Hash Aggregation ──► work_mem ──► no disk spill ──► sub-second ✓" from={t(150)} to={sec(40)} tone="ok" />
    </Stage>
  );
};
