import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, lerp, pop, sec} from '../kit';

// SC04 (130-170s): Heap Files & B-Tree Indexing — PostgreSQL 16 Materialized Core
// Anchors: 131.0 heap files | 136.0 physical | 140.0 B-Tree | 145.0 index scan | 150.0 optimizer | 155.0 fast | 160.0 seal | 165.0 pre-computed
const S = START.s4;
const t = (g: number) => sec(g - S);

// Heap file rows (materialized data on disk)
const HEAP_ROWS = [
  {tid: '(0,1)', region: 'Cairo', total: 4250},
  {tid: '(0,2)', region: 'Giza', total: 3180},
  {tid: '(0,3)', region: 'Alex', total: 2760},
  {tid: '(0,4)', region: 'Suez', total: 1990},
  {tid: '(0,5)', region: 'Aswan', total: 1450},
];

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(131.5), 14));
  const heapP = clamp(lin(f, t(136), 14));
  // B-Tree builds over the materialized data
  const btreeProg = clamp(lin(f, t(140), sec(8)));
  // Optimizer routes to Index Scan
  const scanProg = clamp(lin(f, t(145), sec(6)));
  const optP = pop(f, t(150));
  const fastP = pop(f, t(155));
  const sealP = pop(f, t(160));
  const preP = pop(f, t(165));

  // Pulse
  const pulse = 0.5 + 0.5 * Math.sin(f * 0.15);

  return (
    <Stage dur={1200} inFx="zoom" outFx="morph">
      <TopBadge text="ملفات Heap و فهارس B-Tree | Heap Files &amp; B-Tree Indexing (PostgreSQL 16 Materialized Core)" from={sec(2)} to={sec(40)} color={C.amber} />

      {/* LEFT: Simple query editor */}
      <div style={{opacity: editorP}}>
        <Editor
          x={80}
          y={170}
          w={620}
          h={150}
          title="Query Editor · SELECT on materialized view"
          lines={[
            'SELECT * FROM mv_sales',
            '  WHERE region = :Cairo;',
            '-- routes to Index Scan on B-Tree',
          ]}
          start={t(131.5)}
          cps={0.55}
          size={15}
          accent={C.blue}
          hl={0}
          hlColor={C.blue}
        />
      </div>

      {/* Heap Files panel */}
      <Win x={80} y={340} w={620} h={310} title="Heap Files (PostgreSQL 16) ──► materialized data on physical disk" accent={C.purple} opacity={heapP}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 16, color: C.purple}}>
          materialized view = Heap Files + B-Tree index on disk
        </div>

        <div style={{position: 'absolute', right: 18, top: 14, display: 'flex', gap: 10}}>
          <Chip color={C.purple} style={{fontSize: 13, padding: '4px 12px'}}>
            <Check p={heapP} size={16} color={C.purple} /> Heap Files ✓
          </Chip>
        </div>

        {/* SVG: heap files representation */}
        <svg width={580} height={210} style={{position: 'absolute', left: 20, top: 56}}>
          {/* Heap file capsule (purple) */}
          <rect x={10} y={10} width={560} height={180} fill={`${C.purple}11`} stroke={C.purple} strokeWidth={3} strokeDasharray="6 4" rx={14} style={{filter: `drop-shadow(0 0 8px ${C.purple}44)`}} />
          <text x={290} y={34} fill={C.purple} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">mv_sales · Heap File (physical storage)</text>

          {/* Heap rows */}
          {HEAP_ROWS.map((row, i) => {
            const ap = clamp(pop(f, t(137 + i * 0.3)));
            return (
              <g key={i} style={{opacity: clamp(ap)}}>
                <rect x={30} y={48 + i * 26} width={520} height={22} fill={`${C.purple}22`} stroke={C.purple} strokeWidth={1} rx={4} />
                <text x={50} y={64 + i * 26} fill={C.amber} fontSize={10} fontFamily={MONO} fontWeight={700}>TID {row.tid}</text>
                <text x={160} y={64 + i * 26} fill={C.text} fontSize={10} fontFamily={MONO}>{row.region}</text>
                <text x={280} y={64 + i * 26} fill={C.green} fontSize={10} fontFamily={MONO} fontWeight={700}>{row.total}</text>
                <text x={400} y={64 + i * 26} fill={C.muted} fontSize={9} fontFamily={MONO}>heap block</text>
              </g>
            );
          })}
        </svg>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 36, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 13, color: C.purple, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span>Heap Files</span>
          <span>physical disk ✓</span>
        </div>
      </Win>

      {/* Optimizer routing chip */}
      <div style={{position: 'absolute', left: 80, top: 670, width: 620, opacity: clamp(optP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '12px 18px', border: `2px solid ${C.amber}`, borderRadius: 14, background: `${C.amber}0d`}}>
          <Check p={optP} size={36} color={C.amber} />
          <div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.amber, fontWeight: 700}}>Optimizer Routes to Index Scan ✓</div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 12, color: C.muted, marginTop: 2}}>planner picks B-Tree index scan over Heap scan · O(log n) lookup · fast ✓</div>
          </div>
        </div>
      </div>

      {/* Seal + fast + pre-computed chips at bottom-left */}
      <div style={{position: 'absolute', left: 80, top: 780, width: 620, display: 'flex', gap: 8, flexWrap: 'wrap'}}>
        <div style={{opacity: clamp(sealP)}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', border: `2px solid ${C.amber}`, borderRadius: 12, background: `${C.amber}0d`}}>
            <Check p={sealP} size={28} color={C.amber} />
            <span dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.amber, fontWeight: 700}}>Heap+B-Tree Seal ✓</span>
          </div>
        </div>
        <div style={{opacity: clamp(fastP)}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', border: `2px solid ${C.green}`, borderRadius: 12, background: `${C.green}0d`}}>
            <Check p={fastP} size={28} color={C.green} />
            <span dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.green, fontWeight: 700}}>Fast O(log n) ✓</span>
          </div>
        </div>
        <div style={{opacity: clamp(preP)}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', border: `2px solid ${C.purple}`, borderRadius: 12, background: `${C.purple}0d`}}>
            <Check p={preP} size={28} color={C.purple} />
            <span dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.purple, fontWeight: 700}}>Pre-Computed ✓</span>
          </div>
        </div>
      </div>

      {/* RIGHT: Heap Files + B-Tree Indexing visualization */}
      <Win x={740} y={170} w={1100} h={720} title="PostgreSQL 16 Materialized Core ──► Heap Files + B-Tree Index → Index Scan" accent={C.amber} opacity={heapP}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.amber}}>
          Heap Files (purple) ──► B-Tree index (green) builds over materialized data ──► Optimizer routes to Index Scan
        </div>

        <div style={{position: 'absolute', right: 18, top: 14, display: 'flex', gap: 10}}>
          <Chip color={C.purple} style={{fontSize: 13, padding: '4px 12px'}}>Heap Files</Chip>
          <Chip color={C.green} style={{fontSize: 13, padding: '4px 12px'}}>{btreeProg > 0.05 ? 'B-Tree building...' : 'idle'}</Chip>
          <Chip color={C.amber} style={{fontSize: 13, padding: '4px 12px'}}>{scanProg > 0.95 ? 'Index Scan ✓' : '...'}</Chip>
        </div>

        {/* SVG: Heap capsule + B-Tree + Optimizer routing */}
        <svg width={1060} height={600} style={{position: 'absolute', left: 20, top: 60}}>
          {/* Heap Files capsule (bottom, purple) */}
          <g style={{opacity: clamp(pop(f, t(136)))}}>
            <rect x={50} y={460} width={960} height={120} fill={`${C.purple}11`} stroke={C.purple} strokeWidth={3} rx={14} style={{filter: `drop-shadow(0 0 10px ${C.purple}44)`}} />
            <text x={530} y={484} fill={C.purple} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">mv_sales · Heap Files (physical disk · materialized data)</text>

            {/* Heap row blocks */}
            {HEAP_ROWS.map((row, i) => {
              const ap = clamp(pop(f, t(137 + i * 0.3)));
              return (
                <g key={i} style={{opacity: clamp(ap)}}>
                  <rect x={70 + i * 188} y={498} width={170} height={64} fill={`${C.purple}22`} stroke={C.purple} strokeWidth={2} rx={6} />
                  <text x={155 + i * 188} y={520} fill={C.amber} fontSize={9} fontFamily={MONO} fontWeight={700} textAnchor="middle">TID {row.tid}</text>
                  <text x={155 + i * 188} y={538} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">{row.region}</text>
                  <text x={155 + i * 188} y={554} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">{row.total}</text>
                </g>
              );
            })}
          </g>

          {/* B-Tree index (top, green) - builds progressively */}
          <g style={{opacity: clamp(pop(f, t(140)))}}>
            <text x={530} y={30} fill={C.green} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">▼ B-Tree Index on region (built over Heap Files) ▼</text>

            {/* B-Tree root node */}
            <g style={{opacity: clamp(btreeProg * 1.5)}}>
              <rect x={490} y={50} width={80} height={40} fill={`${C.green}33`} stroke={C.green} strokeWidth={3} rx={8} style={{filter: `drop-shadow(0 0 ${8 + pulse * 6}px ${C.green})`}} />
              <text x={530} y={75} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">root</text>
            </g>

            {/* B-Tree internal nodes (level 2) - appears as btreeProg grows */}
            <g style={{opacity: clamp(btreeProg * 1.5 - 0.3)}}>
              {/* Edges from root to internal */}
              <line x1={510} y1={90} x2={330} y2={130} stroke={C.green} strokeWidth={2} opacity={0.7} />
              <line x1={530} y1={90} x2={530} y2={130} stroke={C.green} strokeWidth={2} opacity={0.7} />
              <line x1={550} y1={90} x2={730} y2={130} stroke={C.green} strokeWidth={2} opacity={0.7} />

              <rect x={290} y={130} width={80} height={36} fill={`${C.green}22`} stroke={C.green} strokeWidth={2.5} rx={6} />
              <text x={330} y={153} fill={C.green} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">&lt; Giza</text>

              <rect x={490} y={130} width={80} height={36} fill={`${C.green}22`} stroke={C.green} strokeWidth={2.5} rx={6} />
              <text x={530} y={153} fill={C.green} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">G-L</text>

              <rect x={690} y={130} width={80} height={36} fill={`${C.green}22`} stroke={C.green} strokeWidth={2.5} rx={6} />
              <text x={730} y={153} fill={C.green} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">&gt; L</text>
            </g>

            {/* B-Tree leaf nodes (level 3) - appears last */}
            <g style={{opacity: clamp(btreeProg * 1.5 - 0.6)}}>
              {/* Edges from internal to leaves */}
              <line x1={330} y1={166} x2={200} y2={210} stroke={C.green} strokeWidth={2} opacity={0.6} />
              <line x1={330} y1={166} x2={330} y2={210} stroke={C.green} strokeWidth={2} opacity={0.6} />
              <line x1={530} y1={166} x2={460} y2={210} stroke={C.green} strokeWidth={2} opacity={0.6} />
              <line x1={530} y1={166} x2={600} y2={210} stroke={C.green} strokeWidth={2} opacity={0.6} />
              <line x1={730} y1={166} x2={800} y2={210} stroke={C.green} strokeWidth={2} opacity={0.6} />
              <line x1={730} y1={166} x2={900} y2={210} stroke={C.green} strokeWidth={2} opacity={0.6} />

              {[
                {x: 160, label: 'Aswan', tid: '(0,5)'},
                {x: 290, label: 'Cairo', tid: '(0,1)'},
                {x: 420, label: 'Giza', tid: '(0,2)'},
                {x: 560, label: 'Alex', tid: '(0,3)'},
                {x: 760, label: 'Suez', tid: '(0,4)'},
                {x: 860, label: '∞', tid: '-'},
              ].map((leaf, i) => (
                <g key={i}>
                  <rect x={leaf.x} y={210} width={80} height={36} fill={`${C.green}11`} stroke={C.green} strokeWidth={2} rx={6} />
                  <text x={leaf.x + 40} y={231} fill={C.green} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">{leaf.label}</text>
                  <text x={leaf.x + 40} y={243} fill={C.muted} fontSize={8} fontFamily={MONO} textAnchor="middle">TID {leaf.tid}</text>
                </g>
              ))}
            </g>
          </g>

          {/* Optimizer box (left center) */}
          <g style={{opacity: clamp(optP)}}>
            <rect x={50} y={290} width={200} height={80} fill={`${C.amber}22`} stroke={C.amber} strokeWidth={3} rx={12} style={{filter: `drop-shadow(0 0 ${10 + pulse * 6}px ${C.amber})`}} />
            <text x={150} y={318} fill={C.amber} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">Optimizer</text>
            <text x={150} y={338} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">picks cheapest plan</text>
            <text x={150} y={356} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">B-Tree available ✓</text>
          </g>

          {/* Routing arrows: Optimizer → Index Scan (green) and Heap Scan (faded red, rejected) */}
          <g style={{opacity: clamp(scanProg)}}>
            {/* Index Scan path (green, selected) */}
            <line x1={250} y1={320} x2={450} y2={320} stroke={C.green} strokeWidth={4} strokeDasharray="6 4" opacity={0.5 + 0.5 * scanProg} />
            <polygon points="444,314 444,326 458,320" fill={C.green} />
            <text x={350} y={310} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">route ✓</text>

            {/* Index Scan box (selected) */}
            <rect x={460} y={290} width={240} height={60} fill={`${C.green}33`} stroke={C.green} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 10px ${C.green})`}} />
            <text x={580} y={316} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">Index Scan</text>
            <text x={580} y={336} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">O(log n) · walks B-Tree → Heap TID</text>

            {/* Heap Scan box (rejected, faded red) */}
            <rect x={720} y={290} width={240} height={60} fill={`${C.red}0d`} stroke={C.red} strokeWidth={2} strokeDasharray="4 4" rx={10} opacity={0.4} />
            <text x={840} y={316} fill={C.red} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">Seq Scan</text>
            <text x={840} y={336} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">O(n) · rejected ✗</text>

            {/* Rejected arrow (red, faded) */}
            <line x1={250} y1={340} x2={720} y2={340} stroke={C.red} strokeWidth={2} strokeDasharray="4 4" opacity={0.2} />
          </g>

          {/* B-Tree lookup path: Index Scan → B-Tree leaf → Heap row (TID pointer) */}
          <g style={{opacity: clamp(scanProg * 1.2 - 0.2)}}>
            {/* Arrow from Index Scan up to B-Tree leaf */}
            <line x1={580} y1={290} x2={580} y2={250} stroke={C.green} strokeWidth={2.5} strokeDasharray="5 4" opacity={0.7} />
            <polygon points="574,256 586,256 580,248" fill={C.green} />
            <text x={620} y={272} fill={C.green} fontSize={10} fontFamily={MONO} fontWeight={700}>lookup ✓</text>

            {/* Arrow from B-Tree leaf down to Heap row (TID pointer) */}
            <line x1={330} y1={246} x2={155} y2={498} stroke={C.amber} strokeWidth={2.5} strokeDasharray="5 4" opacity={0.7} />
            <polygon points="149,492 161,492 155,504" fill={C.amber} />
            <text x={210} y={380} fill={C.amber} fontSize={10} fontFamily={MONO} fontWeight={700}>TID → heap row</text>
          </g>

          {/* Result banner */}
          {scanProg > 0.95 ? (
            <g style={{opacity: clamp(pop(f, t(150)))}}>
              <rect x={250} y={400} width={560} height={40} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 10px ${C.green}66)`}} />
              <text x={530} y={426} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ Optimizer chose Index Scan · B-Tree → Heap TID · O(log n) · fast</text>
            </g>
          ) : null}

          {/* Status text */}
          <text x={530} y={450} fill={C.muted} fontSize={13} fontFamily={MONO} textAnchor="middle">
            {btreeProg < 0.3 ? 'heap files on disk...' : btreeProg < 0.95 ? 'building B-Tree index...' : scanProg < 0.95 ? 'optimizer routing...' : 'Index Scan ✓ · pre-computed cache + B-Tree'}
          </text>
        </svg>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 14, color: C.amber, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.purple}}>Heap Files (disk)</span>
          <span style={{color: scanProg >= 1 ? C.green : C.amber}}>{scanProg >= 1 ? '✓ Index Scan' : scanProg > 0 ? `routing... ${Math.round(scanProg * 100)}%` : 'idle'}</span>
          <span style={{color: C.green}}>B-Tree · fast</span>
        </div>
      </Win>

      <Caption text="Heap Files ──► B-Tree Index ──► Optimizer ──► Index Scan ──► Fast O(log n) ──► Pre-Computed ✓" from={t(140)} to={sec(40)} tone="ok" />
    </Stage>
  );
};
