import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, lerp, pop, sec} from '../kit';

// SC01 (0-40s): SARGable Engine — Predicate Matching Guard Shield & Green Index Path
// Anchors: 1.0 welcome | 5.0 SARGable | 9.0 Search Argument | 14.0 golden standard | 20.0 index scan | 28.0 seal | 35.0 benchmark
const S = START.s1;
const t = (g: number) => sec(g - S);

// B-Tree leaf nodes (index path visualization)
const LEAVES = [
  {x: 80, y: 80, value: 10, active: false},
  {x: 180, y: 80, value: 25, active: false},
  {x: 280, y: 80, value: 40, active: true},
  {x: 380, y: 80, value: 50, active: false},
  {x: 480, y: 80, value: 75, active: false},
  {x: 580, y: 80, value: 90, active: false},
  {x: 680, y: 80, value: 100, active: false},
];

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(2), 14));
  const engineP = clamp(lin(f, t(5), 16));
  const argP = clamp(lin(f, t(9), 14));
  const goldP = clamp(lin(f, t(14), 14));
  // Index scan laser animation
  const scanStart = t(20);
  const scanDur = sec(8);
  const scanProg = clamp((f - scanStart) / scanDur);
  // Pointer position along the index path
  const idx = Math.min(LEAVES.length - 1, Math.floor(scanProg * LEAVES.length));
  const stepFrac = scanProg * LEAVES.length - idx;
  const cur = LEAVES[idx];
  const next = LEAVES[Math.min(LEAVES.length - 1, idx + 1)];
  const px = lerp(cur.x, next.x, stepFrac);
  const py = lerp(cur.y, next.y, stepFrac);
  const sealP = pop(f, t(28));
  const benchP = pop(f, t(35));

  return (
    <Stage dur={1200} inFx="zoom" outFx="left">
      <TopBadge text="محرّك SARGable | SARGable Engine — Search Argument Able Queries" from={sec(2)} to={sec(18)} color={C.blue} />

      {/* LEFT: Query editor (SARGable query) */}
      <div style={{opacity: editorP}}>
        <Editor
          x={80}
          y={180}
          w={820}
          h={220}
          title="Query Editor · SARGable predicate"
          lines={[
            'SELECT id, name, unit_price',
            'FROM products',
            'WHERE unit_price > 100',
            '  AND name LIKE "Pro%";',
            '-- SARGable: column OP constant',
          ]}
          start={t(2)}
          cps={0.85}
          size={17}
          accent={C.blue}
          hl={2}
          hlColor={C.blue}
        />
      </div>

      {/* Concept chips below editor */}
      <div style={{position: 'absolute', left: 80, top: 420, width: 820, opacity: clamp(lin(f, t(9), 14))}}>
        <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.muted, marginBottom: 10}}>◆ SARGable golden standard</div>
        <div style={{display: 'flex', gap: 10, flexWrap: 'wrap'}}>
          <Chip color={C.blue} style={{fontSize: 16, padding: '4px 14px'}}>Column OP Constant</Chip>
          <Chip color={C.green} style={{fontSize: 16, padding: '4px 14px'}}>Index Scan ✓</Chip>
          <Chip color={C.amber} style={{fontSize: 16, padding: '4px 14px'}}>B-Tree Traversal</Chip>
          <Chip color={C.purple} style={{fontSize: 16, padding: '4px 14px'}}>O(log n)</Chip>
        </div>
      </div>

      {/* Guard shield — predicate matching gate */}
      <Win x={80} y={480} w={820} h={420} title="predicate matching guard ──► SARGability check" accent={C.green} opacity={clamp(lin(f, t(14), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.green}}>
          WHERE clause ──► guard shield ──► green index path
        </div>

        <svg width={780} height={300} style={{position: 'absolute', left: 20, top: 50}}>
          {/* Input: WHERE clause */}
          <rect x={20} y={120} width={220} height={60} fill={`${C.blue}22`} stroke={C.blue} strokeWidth={2} rx={10} />
          <text x={130} y={148} fill={C.blue} fontSize={15} fontFamily={MONO} fontWeight={700} textAnchor="middle">WHERE unit_price</text>
          <text x={130} y={168} fill={C.amber} fontSize={14} fontFamily={MONO} textAnchor="middle">&gt; 100</text>

          {/* Arrow to shield */}
          <line x1={240} y1={150} x2={300} y2={150} stroke={C.green} strokeWidth={3} strokeDasharray="6 4" />
          <polygon points="294,144 294,156 308,150" fill={C.green} />

          {/* Guard shield (SVG path) */}
          <g style={{filter: `drop-shadow(0 0 14px ${C.green}88)`}}>
            <path d="M380 90 L460 70 L540 90 L540 170 C540 210 500 230 460 240 C420 230 380 210 380 170 Z"
              fill={`${C.green}22`} stroke={C.green} strokeWidth={3} strokeLinejoin="round" />
            <text x={460} y={140} fill={C.green} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">SARGable</text>
            <text x={460} y={160} fill={C.green} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">Guard</text>
            <text x={460} y={190} fill={C.text} fontSize={12} fontFamily={MONO} textAnchor="middle">column OP const</text>
          </g>

          {/* Arrow from shield to index path */}
          <line x1={540} y1={150} x2={600} y2={150} stroke={C.green} strokeWidth={3} strokeDasharray="6 4" />
          <polygon points="594,144 594,156 608,150" fill={C.green} />

          {/* Index path output */}
          <rect x={610} y={120} width={150} height={60} fill={`${C.green}22`} stroke={C.green} strokeWidth={2} rx={10} />
          <text x={685} y={148} fill={C.green} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">Index Scan</text>
          <text x={685} y={168} fill={C.green} fontSize={12} fontFamily={MONO} textAnchor="middle">✓ approved</text>

          {/* Status text */}
          <text x={390} y={270} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700}>✓ SARGable predicate · index-safe · green laser route</text>
        </svg>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 14, color: C.green, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span>predicate form: column OP expression</span>
          <span>rule: keep column bare on left side</span>
        </div>
      </Win>

      {/* RIGHT: SARGable Engine with B-Tree index path */}
      <Win x={940} y={180} w={900} h={720} title="SARGable Engine ──► B-Tree green laser index path" accent={C.blue} opacity={engineP}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.blue}}>
          search: unit_price &gt; 100 ──► index traversal
        </div>

        {/* SARGable Engine badge + Module 12 chip */}
        <div style={{position: 'absolute', right: 18, top: 14, display: 'flex', alignItems: 'center', gap: 12}}>
          <Chip color={C.green} style={{fontSize: 14, padding: '4px 14px'}}>
            <Check p={1} size={22} color={C.green} /> Index Scan ✓
          </Chip>
          <Chip color={C.amber} style={{fontSize: 13, padding: '4px 12px'}}>Module 12 Optimization Benchmark</Chip>
        </div>

        {/* SVG B-Tree index path */}
        <svg width={900} height={420} style={{position: 'absolute', left: 0, top: 60}}>
          {/* B-Tree root */}
          <circle cx={450} cy={40} r={30} fill={`${C.blue}22`} stroke={C.blue} strokeWidth={3} />
          <text x={450} y={48} fill={C.blue} fontSize={16} fontFamily={MONO} fontWeight={700} textAnchor="middle">50</text>
          <text x={450} y={84} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">Root</text>

          {/* Internal nodes */}
          <line x1={440} y1={66} x2={220} y2={130} stroke={C.border} strokeWidth={3} />
          <line x1={460} y1={66} x2={680} y2={130} stroke={C.border} strokeWidth={3} />
          <circle cx={220} cy={150} r={28} fill={`${C.blue}22`} stroke={C.blue} strokeWidth={3} />
          <text x={220} y={157} fill={C.blue} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">25</text>
          <text x={220} y={192} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">Internal L</text>
          <circle cx={680} cy={150} r={28} fill={`${C.green}22`} stroke={C.green} strokeWidth={4} style={{filter: `drop-shadow(0 0 8px ${C.green})`}} />
          <text x={680} y={157} fill={C.green} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">75</text>
          <text x={680} y={192} fill={C.green} fontSize={10} fontFamily={MONO} textAnchor="middle">Internal R ✓</text>

          {/* Lines from internal R to leaves */}
          {LEAVES.map((leaf, i) => (
            <line
              key={`line-${i}`}
              x1={680}
              y1={178}
              x2={leaf.x + 30}
              y2={leaf.y + 30}
              stroke={scanProg > i / LEAVES.length ? C.green : C.border}
              strokeWidth={scanProg > i / LEAVES.length ? 3 : 2}
              strokeOpacity={scanProg > i / LEAVES.length ? 0.9 : 0.4}
            />
          ))}

          {/* Leaf nodes */}
          {LEAVES.map((leaf, i) => {
            const reached = scanProg > i / LEAVES.length;
            const matched = leaf.value > 100;
            const isCurrent = i === idx && scanProg < 1;
            return (
              <g key={`leaf-${i}`} style={{opacity: reached ? 1 : 0.45}}>
                <rect
                  x={leaf.x}
                  y={leaf.y}
                  width={60}
                  height={60}
                  fill={matched && reached ? `${C.green}33` : reached ? `${C.blue}22` : 'transparent'}
                  stroke={matched && reached ? C.green : reached ? C.blue : C.border}
                  strokeWidth={matched && reached ? 3 : 2}
                  rx={8}
                  style={isCurrent ? {filter: `drop-shadow(0 0 8px ${C.green})`} : undefined}
                />
                <text x={leaf.x + 30} y={leaf.y + 38} fill={matched && reached ? C.green : C.text} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">{leaf.value}</text>
              </g>
            );
          })}

          {/* Green laser pointer */}
          {scanProg > 0 && scanProg < 1 ? (
            <g style={{filter: `drop-shadow(0 0 8px ${C.green})`}}>
              <circle cx={px + 30} cy={py + 30} r={12} fill={C.green} opacity={0.7} />
              <circle cx={px + 30} cy={py + 30} r={7} fill={C.text} />
              <text x={px + 30} y={py - 6} fill={C.green} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">scanning</text>
            </g>
          ) : null}

          {/* Status label */}
          <text x={450} y={210} fill={C.muted} fontSize={12} fontFamily={MONO} textAnchor="middle">Leaf Level · B-Tree</text>
        </svg>

        {/* Index scan explanation */}
        <div style={{position: 'absolute', left: 18, right: 18, top: 510, padding: '14px 16px', border: `2px solid ${C.green}`, borderRadius: 10, background: `${C.green}0d`, opacity: clamp(lin(f, t(20), 14))}}>
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 16, color: C.green, fontWeight: 700, marginBottom: 6}}>✓ SARGable predicate approved</div>
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 13, color: C.text, lineHeight: 1.6}}>
            WHERE unit_price &gt; 100 ──► column (unit_price) directly compared to constant (100).<br />
            Optimizer routes to B-Tree Index Scan ──► O(log n) lookup ──► only matching leaves visited.
          </div>
        </div>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 60, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 16, fontWeight: 700, paddingTop: 8, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.blue}}>SARGable · column OP constant</span>
          <span style={{color: C.green, opacity: clamp(pop(f, t(20)))}}>{scanProg >= 1 ? '✓ Index Scan complete' : scanProg > 0 ? `scanning leaf ${idx + 1}/${LEAVES.length}` : 'idle'}</span>
          <span style={{color: C.amber}}>cost: O(log n)</span>
        </div>
      </Win>

      {/* Seal badge */}
      <div style={{position: 'absolute', left: 80, top: 920, opacity: clamp(sealP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 22px', border: `2px solid ${C.green}`, borderRadius: 14, background: `${C.green}0d`}}>
          <Check p={sealP} size={36} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700}}>SARGable · Golden Standard · Index Scan ✓</div>
        </div>
      </div>

      {/* Benchmark chip on the right */}
      <div style={{position: 'absolute', right: 80, top: 920, opacity: clamp(benchP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 22px', border: `2px solid ${C.amber}`, borderRadius: 14, background: `${C.amber}0d`}}>
          <Check p={benchP} size={36} color={C.amber} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.amber, fontWeight: 700}}>Module 12 Optimization Benchmark ✓</div>
        </div>
      </div>

      <Caption text="SARGable Engine ──► WHERE column OP constant ──► Index Scan (Golden Standard)" from={t(20)} to={sec(38)} tone="ok" />
    </Stage>
  );
};
