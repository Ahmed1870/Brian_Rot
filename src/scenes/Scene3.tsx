import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, lerp, pop, sec} from '../kit';

// SC03 (85-130s): GiST Spatial Index & PostgreSQL 16 Optimizer Cost Engine
// Anchors: 86.0 GiST | 90.0 spatial | 95.0 PostGIS | 100.0 ranges | 110.0 optimizer | 118.0 cost | 125.0 winner
const S = START.s3;
const t = (g: number) => sec(g - S);

// Spatial bounding boxes (GiST R-tree partitions)
const BOXES = [
  {x: 40, y: 30, w: 200, h: 140, label: 'R1'},
  {x: 280, y: 30, w: 220, h: 160, label: 'R2'},
  {x: 540, y: 30, w: 200, h: 140, label: 'R3'},
  {x: 40, y: 220, w: 220, h: 160, label: 'R4'},
  {x: 300, y: 220, w: 180, h: 140, label: 'R5'},
  {x: 520, y: 220, w: 220, h: 160, label: 'R6'},
];

// Delivery points (some inside query window)
const POINTS = [
  {x: 90, y: 70, inQuery: false},
  {x: 150, y: 130, inQuery: false},
  {x: 320, y: 90, inQuery: true},
  {x: 400, y: 150, inQuery: true},
  {x: 590, y: 100, inQuery: false},
  {x: 100, y: 280, inQuery: false},
  {x: 350, y: 280, inQuery: false},
  {x: 580, y: 290, inQuery: false},
  {x: 220, y: 350, inQuery: false},
  {x: 460, y: 340, inQuery: false},
];

const QUERY_WINDOW = {x: 290, y: 60, w: 240, h: 140};

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(86.5), 14));
  const spatialP = clamp(lin(f, t(90), 14));
  const optimizerP = clamp(lin(f, t(110), 16));
  // Cost comparison animation
  const costProg = clamp(lin(f, t(118), sec(12)));
  // Winner highlight
  const winnerP = pop(f, t(125));

  // Interpolated cost values
  const seqCost = lerp(0, 5432.10, clamp(lin(f, t(112), 8)));
  const idxCost = lerp(0, 12.45, clamp(lin(f, t(114), 8)));

  // Spatial search animation — query window lights up matching boxes
  const searchP = clamp(lin(f, t(95), sec(8)));
  const matchingBoxes = [1, 2]; // R2 and R3 partially overlap query

  return (
    <Stage dur={1350} inFx="left" outFx="up">
      <TopBadge text="GiST المكاني ومحرك التكلفة | GiST Spatial & PostgreSQL 16 Optimizer" from={sec(2)} to={sec(40)} color={C.purple} />

      {/* SQL editor at top */}
      <div style={{opacity: editorP}}>
        <Editor
          x={80}
          y={180}
          w={1760}
          h={120}
          title="PostGIS · GiST Spatial Index"
          lines={[
            "CREATE INDEX idx_delivery_point ON deliveries USING gist (delivery_point);",
            "-- supports: && << >> overlaps  (range & spatial operators)",
          ]}
          start={t(86.5)}
          cps={0.85}
          size={16}
          accent={C.purple}
          hl={0}
          hlColor={C.purple}
        />
      </div>

      {/* LEFT: GiST Spatial Map */}
      <Win x={80} y={320} w={860} h={560} title="GiST spatial index · bounding-box R-tree" accent={C.purple} opacity={spatialP}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.purple}}>
          delivery_point ──► PostGIS geometry
        </div>

        <svg width={820} height={420} style={{position: 'absolute', left: 20, top: 50}}>
          {/* Grid background */}
          {Array.from({length: 9}, (_, i) => (
            <line key={`v${i}`} x1={40 + i * 90} y1={20} x2={40 + i * 90} y2={420} stroke={C.border} strokeWidth={1} strokeOpacity={0.4} />
          ))}
          {Array.from({length: 5}, (_, i) => (
            <line key={`h${i}`} x1={40} y1={20 + i * 90} x2={760} y2={20 + i * 90} stroke={C.border} strokeWidth={1} strokeOpacity={0.4} />
          ))}

          {/* Axis labels */}
          <text x={20} y={28} fill={C.muted} fontSize={11} fontFamily={MONO}>y</text>
          <text x={760} y={418} fill={C.muted} fontSize={11} fontFamily={MONO}>x →</text>

          {/* Bounding boxes (R-tree partitions) */}
          {BOXES.map((b, i) => {
            const isMatching = matchingBoxes.includes(i);
            const highlight = isMatching && searchP > 0.4;
            return (
              <g key={i}>
                <rect x={b.x} y={b.y + 30} width={b.w} height={b.h} fill={highlight ? `${C.purple}22` : `${C.purple}08`} stroke={highlight ? C.green : C.purple} strokeWidth={highlight ? 3 : 2} strokeDasharray="6 3" rx={4} />
                <text x={b.x + 8} y={b.y + 48} fill={highlight ? C.green : C.purple} fontSize={12} fontFamily={MONO} fontWeight={700}>{b.label}</text>
              </g>
            );
          })}

          {/* Query window (amber) */}
          <rect x={QUERY_WINDOW.x} y={QUERY_WINDOW.y + 30} width={QUERY_WINDOW.w} height={QUERY_WINDOW.h} fill={`${C.amber}14`} stroke={C.amber} strokeWidth={3} rx={4} style={{filter: `drop-shadow(0 0 8px ${C.amber}88)`}} />
          <text x={QUERY_WINDOW.x + 8} y={QUERY_WINDOW.y + 50} fill={C.amber} fontSize={12} fontFamily={MONO} fontWeight={700}>query area</text>

          {/* Delivery points */}
          {POINTS.map((p, i) => {
            const visible = searchP > i / POINTS.length;
            const highlight = p.inQuery && searchP > 0.7;
            return (
              <g key={i} style={{opacity: visible ? 1 : 0.3}}>
                <circle cx={p.x} cy={p.y + 30} r={highlight ? 7 : 4} fill={highlight ? C.green : C.blue} stroke={highlight ? C.green : C.bg} strokeWidth={1} style={{filter: highlight ? `drop-shadow(0 0 6px ${C.green})` : 'none'}} />
              </g>
            );
          })}
        </svg>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 50, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 14, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.purple}}>R-tree · {BOXES.length} partitions</span>
          <span style={{color: C.amber}}>{searchP > 0.7 ? '2 points in query area' : 'searching...'}</span>
          <span style={{color: C.green}}>ops: &amp;&amp; &lt;&lt; &gt;&gt;</span>
        </div>
      </Win>

      {/* RIGHT: PostgreSQL 16 Optimizer Cost Engine */}
      <Win x={980} y={320} w={860} h={560} title="PostgreSQL 16 · Optimizer Cost Engine" accent={C.green} opacity={optimizerP}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.green}}>
          evaluates plans ──► routes to lowest cost
        </div>

        {/* EXPLAIN query */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, top: 50, padding: '10px 14px', border: `1px solid ${C.border}`, borderRadius: 8, background: C.deep, fontFamily: MONO, fontSize: 13, color: C.text}}>
          <span style={{color: '#64748B'}}>EXPLAIN</span> SELECT * FROM deliveries WHERE delivery_point &amp;&amp; <span style={{color: C.amber}}>'query_area'</span>;
        </div>

        {/* Two competing plans */}
        <div style={{position: 'absolute', left: 18, right: 18, top: 110, display: 'flex', gap: 14}}>
          {/* Seq Scan — high cost */}
          <div style={{flex: 1, padding: '14px', border: `2px solid ${costProg > 0.5 ? C.red : C.border}`, borderRadius: 10, background: costProg > 0.3 ? `${C.red}0d` : 'transparent'}}>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.red, fontWeight: 700, marginBottom: 6}}>Seq Scan</div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 11, color: C.muted, marginBottom: 8}}>on deliveries</div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 13, color: C.text, marginBottom: 4}}>
              cost: <span style={{color: C.red, fontWeight: 700, fontSize: 18}}>{seqCost.toFixed(2)}</span>
            </div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 12, color: C.muted}}>rows: 1,000,000</div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 12, color: C.muted}}>full table scan</div>
          </div>

          {/* Index Scan — low cost (winner) */}
          <div style={{flex: 1, padding: '14px', border: `2px solid ${costProg > 0.5 ? C.green : C.border}`, borderRadius: 10, background: costProg > 0.3 ? `${C.green}0d` : 'transparent', boxShadow: costProg > 0.9 ? `0 0 24px ${C.green}66` : 'none'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6}}>
              <div dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.green, fontWeight: 700}}>Bitmap Index Scan</div>
              {costProg > 0.9 ? <Check p={1} size={24} color={C.green} /> : null}
            </div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 11, color: C.muted, marginBottom: 8}}>using idx_delivery_point</div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 13, color: C.text, marginBottom: 4}}>
              cost: <span style={{color: C.green, fontWeight: 700, fontSize: 18}}>{idxCost.toFixed(2)}</span>
            </div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 12, color: C.muted}}>rows: 2</div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 12, color: C.green}}>GiST @&gt; query</div>
          </div>
        </div>

        {/* Cost comparison bar */}
        <div style={{position: 'absolute', left: 18, right: 18, top: 290, padding: '12px 14px', border: `1px solid ${C.border}`, borderRadius: 8, background: C.deep}}>
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 12, color: C.muted, marginBottom: 8}}>cost ratio (log scale)</div>
          <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6}}>
            <span dir="ltr" style={{fontFamily: MONO, fontSize: 11, color: C.red, width: 80}}>Seq Scan</span>
            <div style={{flex: 1, height: 14, borderRadius: 7, background: C.border, overflow: 'hidden'}}>
              <div style={{height: '100%', width: `${Math.min(100, 100 - costProg * 95)}%`, background: C.red, borderRadius: 7}} />
            </div>
            <span dir="ltr" style={{fontFamily: MONO, fontSize: 11, color: C.red, fontWeight: 700, width: 80, textAlign: 'right'}}>{seqCost.toFixed(0)}</span>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
            <span dir="ltr" style={{fontFamily: MONO, fontSize: 11, color: C.green, width: 80}}>Index Scan</span>
            <div style={{flex: 1, height: 14, borderRadius: 7, background: C.border, overflow: 'hidden'}}>
              <div style={{height: '100%', width: `${Math.max(5, costProg * 8)}%`, background: C.green, borderRadius: 7}} />
            </div>
            <span dir="ltr" style={{fontFamily: MONO, fontSize: 11, color: C.green, fontWeight: 700, width: 80, textAlign: 'right'}}>{idxCost.toFixed(0)}</span>
          </div>
        </div>

        {/* Winner routing */}
        {costProg > 0.9 ? (
          <div style={{position: 'absolute', left: 18, right: 18, top: 410, padding: '12px 14px', border: `2px solid ${C.green}`, borderRadius: 10, background: `${C.green}0d`, opacity: clamp(winnerP)}}>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 16, color: C.green, fontWeight: 700, marginBottom: 4}}>✓ Optimizer selected: Bitmap Index Scan</div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 13, color: C.muted}}>cost reduction: {(5432.10 / 12.45).toFixed(0)}x faster · rows pruned: 99.9998%</div>
          </div>
        ) : null}

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 14, color: C.green, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span>planner · cost-based</span>
          <span>statistics from pg_class</span>
          <span>WINNER: Index Scan</span>
        </div>
      </Win>

      <Caption text="GiST Spatial Index ──► PostgreSQL 16 Optimizer Picks Index Scan (cost 12 vs 5432)" from={t(110)} to={sec(44)} tone="ok" />
    </Stage>
  );
};
