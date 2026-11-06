import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, lerp, pop, sec} from '../kit';
import {BTREE_NODES} from '../data';

// SC01 (0-40s): B-Tree Index Architecture — Seq Scan vs Balanced Tree
// Anchors: 1.0 welcome | 5.0 B-Tree | 9.0 balanced | 14.0 O(log n) | 20.0 ranges | 28.0 seal | 35.0 fast
const S = START.s1;
const t = (g: number) => sec(g - S);

// Tree SVG layout transform
const TX = 90;
const TY = 50;
const mapX = (x: number) => x - 120 + TX;
const mapY = (y: number) => y - 40 + TY;
const R = 34; // node radius

// Search path: Root (50) → Internal[0] (25) → Leaf[2] (40) = FOUND
const SEARCH_PATH = [
  {kind: 'root', idx: -1, value: 50, x: BTREE_NODES.root.x, y: BTREE_NODES.root.y},
  {kind: 'internal', idx: 0, value: 25, x: BTREE_NODES.internal[0].x, y: BTREE_NODES.internal[0].y},
  {kind: 'leaf', idx: 2, value: 40, x: BTREE_NODES.leaves[2].x, y: BTREE_NODES.leaves[2].y},
];

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(2), 14));
  const treeP = clamp(lin(f, t(5), 14));
  const seqP = clamp(lin(f, t(9), 12));
  // Search traversal animation
  const searchStart = t(14);
  const searchDur = sec(8); // 8 seconds total
  const searchProg = clamp((f - searchStart) / searchDur);
  const stepIdx = Math.min(SEARCH_PATH.length - 1, Math.floor(searchProg * SEARCH_PATH.length));
  const stepFrac = searchProg * SEARCH_PATH.length - stepIdx;
  // Pointer position interpolating between current and next node
  const cur = SEARCH_PATH[stepIdx];
  const next = SEARCH_PATH[Math.min(SEARCH_PATH.length - 1, stepIdx + 1)];
  const px = lerp(mapX(cur.x), mapX(next.x), stepFrac);
  const py = lerp(mapY(cur.y), mapY(next.y), stepFrac);

  // Seq scan animation — sequential highlight of all 6 leaves (red)
  const seqScanProg = clamp(lin(f, t(10), sec(8)));
  const seqScanIdx = Math.min(BTREE_NODES.leaves.length - 1, Math.floor(seqScanProg * BTREE_NODES.leaves.length));

  const sealP = pop(f, t(28));
  const fastP = pop(f, t(35));

  // Determine which nodes are highlighted as visited (blue glow) and which is current (green)
  const nodeState = (kind: string, idx: number): 'idle' | 'visited' | 'current' | 'found' => {
    if (searchProg <= 0) return 'idle';
    const flatIdx = SEARCH_PATH.findIndex((p) => p.kind === kind && p.idx === idx);
    if (flatIdx === -1) return 'idle';
    if (stepIdx === SEARCH_PATH.length - 1 && kind === 'leaf' && idx === 2) return 'found';
    if (flatIdx < stepIdx) return 'visited';
    if (flatIdx === stepIdx) return 'current';
    return 'idle';
  };

  const nodeColor = (state: 'idle' | 'visited' | 'current' | 'found') => {
    if (state === 'found') return C.green;
    if (state === 'current') return C.green;
    if (state === 'visited') return C.blue;
    return C.blue;
  };

  const renderNode = (x: number, y: number, value: number, label: string, kind: string, idx: number, key: string) => {
    const state = nodeState(kind, idx);
    const color = nodeColor(state);
    const glow = state === 'current' || state === 'found';
    return (
      <g key={key}>
        <circle cx={mapX(x)} cy={mapY(y)} r={R} fill={`${color}22`} stroke={color} strokeWidth={state === 'idle' ? 3 : 5} style={{filter: glow ? `drop-shadow(0 0 12px ${color})` : 'none'}} />
        <text x={mapX(x)} y={mapY(y) + 6} fill={color} fontSize={20} fontFamily={MONO} fontWeight={700} textAnchor="middle">{value}</text>
        <text x={mapX(x)} y={mapY(y) + R + 18} fill={C.muted} fontSize={12} fontFamily={MONO} textAnchor="middle">{label}</text>
      </g>
    );
  };

  return (
    <Stage dur={1200} inFx="zoom" outFx="left">
      <TopBadge text="هيكلية فهارس B-Tree | Indexing Architecture — B-Tree vs Seq Scan" from={sec(2)} to={sec(18)} color={C.blue} />

      {/* SQL editor on the left */}
      <div style={{opacity: editorP}}>
        <Editor
          x={80}
          y={180}
          w={820}
          h={210}
          title="Query Editor · CREATE INDEX USING btree"
          lines={[
            'CREATE INDEX idx_price ON products',
            '  USING btree (unit_price);',
            '-- range & equality queries',
            '-- O(log n) lookup cost',
          ]}
          start={t(2)}
          cps={0.85}
          size={17}
          accent={C.blue}
          hl={1}
          hlColor={C.blue}
        />
      </div>

      {/* Concept chips below editor */}
      <div style={{position: 'absolute', left: 80, top: 410, width: 820, opacity: clamp(lin(f, t(9), 14))}}>
        <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.muted, marginBottom: 10}}>◆ B-Tree properties</div>
        <div style={{display: 'flex', gap: 10, flexWrap: 'wrap'}}>
          <Chip color={C.blue} style={{fontSize: 16, padding: '4px 14px'}}>Balanced Tree</Chip>
          <Chip color={C.green} style={{fontSize: 16, padding: '4px 14px'}}>O(log n)</Chip>
          <Chip color={C.amber} style={{fontSize: 16, padding: '4px 14px'}}>Range Scans</Chip>
          <Chip color={C.purple} style={{fontSize: 16, padding: '4px 14px'}}>Sorted</Chip>
        </div>
      </div>

      {/* Seq Scan visualization (left, below) */}
      <Win x={80} y={470} w={820} h={430} title="Sequential Scan ──► O(n) row-by-row" accent={C.red} opacity={seqP}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.red}}>
          scans every row in heap table
        </div>
        <div style={{position: 'absolute', left: 24, right: 24, top: 60, display: 'flex', flexDirection: 'column', gap: 12}}>
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.muted, marginBottom: 4}}>heap products (no index)</div>
          {BTREE_NODES.leaves.map((leaf, i) => {
            const scanned = i <= seqScanIdx;
            const isCurrent = i === seqScanIdx && seqScanProg < 1;
            return (
              <div key={i} dir="ltr" style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 14px', border: `2px solid ${scanned ? C.red : C.border}`, borderRadius: 8, background: scanned ? `${C.red}0d` : 'transparent', opacity: scanned ? 1 : 0.4}}>
                <span style={{fontFamily: MONO, fontSize: 14, color: '#475569', width: 32}}>{i + 1}</span>
                <span style={{fontFamily: MONO, fontSize: 16, color: scanned ? C.red : C.muted, fontWeight: 700}}>{scanned ? '✗' : '○'}</span>
                <span style={{fontFamily: MONO, fontSize: 16, color: scanned ? C.text : C.muted, flex: 1}}>unit_price = ${leaf.value}</span>
                {isCurrent ? <span style={{color: C.red, fontSize: 12, fontFamily: MONO, fontWeight: 700}}>scanning...</span> : scanned ? <span style={{color: C.red, fontSize: 12, fontFamily: MONO}}>checked</span> : null}
              </div>
            );
          })}
        </div>
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 16, color: C.red, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span>{Math.min(BTREE_NODES.leaves.length, seqScanIdx + 1)} / {BTREE_NODES.leaves.length} rows scanned</span>
          <span>cost: O(n)</span>
        </div>
      </Win>

      {/* B-Tree visualization on the right */}
      <Win x={940} y={180} w={900} h={720} title="B-Tree Index ──► O(log n) balanced tree" accent={C.blue} opacity={treeP}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.blue}}>
          search: unit_price = 40 ──► tree traversal
        </div>

        {/* Search status indicator */}
        <div style={{position: 'absolute', right: 18, top: 14, display: 'flex', alignItems: 'center', gap: 10}}>
          {searchProg <= 0 ? (
            <span dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.muted}}>idle</span>
          ) : stepIdx < SEARCH_PATH.length - 1 ? (
            <span dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.blue}}>traversing... step {stepIdx + 1}/3</span>
          ) : (
            <span dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.green, fontWeight: 700}}>✓ FOUND at leaf</span>
          )}
        </div>

        {/* SVG tree */}
        <svg width={900} height={620} style={{position: 'absolute', left: 0, top: 50}}>
          {/* Connecting lines: Root → Internal[0,1] */}
          <line x1={mapX(BTREE_NODES.root.x)} y1={mapY(BTREE_NODES.root.y) + R} x2={mapX(BTREE_NODES.internal[0].x)} y2={mapY(BTREE_NODES.internal[0].y) - R} stroke={C.border} strokeWidth={3} />
          <line x1={mapX(BTREE_NODES.root.x)} y1={mapY(BTREE_NODES.root.y) + R} x2={mapX(BTREE_NODES.internal[1].x)} y2={mapY(BTREE_NODES.internal[1].y) - R} stroke={C.border} strokeWidth={3} />
          {/* Internal[0] → leaves[0,1,2] */}
          <line x1={mapX(BTREE_NODES.internal[0].x)} y1={mapY(BTREE_NODES.internal[0].y) + R} x2={mapX(BTREE_NODES.leaves[0].x)} y2={mapY(BTREE_NODES.leaves[0].y) - R} stroke={C.border} strokeWidth={3} />
          <line x1={mapX(BTREE_NODES.internal[0].x)} y1={mapY(BTREE_NODES.internal[0].y) + R} x2={mapX(BTREE_NODES.leaves[1].x)} y2={mapY(BTREE_NODES.leaves[1].y) - R} stroke={C.border} strokeWidth={3} />
          <line x1={mapX(BTREE_NODES.internal[0].x)} y1={mapY(BTREE_NODES.internal[0].y) + R} x2={mapX(BTREE_NODES.leaves[2].x)} y2={mapY(BTREE_NODES.leaves[2].y) - R} stroke={C.border} strokeWidth={3} />
          {/* Internal[1] → leaves[3,4,5] */}
          <line x1={mapX(BTREE_NODES.internal[1].x)} y1={mapY(BTREE_NODES.internal[1].y) + R} x2={mapX(BTREE_NODES.leaves[3].x)} y2={mapY(BTREE_NODES.leaves[3].y) - R} stroke={C.border} strokeWidth={3} />
          <line x1={mapX(BTREE_NODES.internal[1].x)} y1={mapY(BTREE_NODES.internal[1].y) + R} x2={mapX(BTREE_NODES.leaves[4].x)} y2={mapY(BTREE_NODES.leaves[4].y) - R} stroke={C.border} strokeWidth={3} />
          <line x1={mapX(BTREE_NODES.internal[1].x)} y1={mapY(BTREE_NODES.internal[1].y) + R} x2={mapX(BTREE_NODES.leaves[5].x)} y2={mapY(BTREE_NODES.leaves[5].y) - R} stroke={C.border} strokeWidth={3} />

          {/* Level labels */}
          <text x={20} y={mapY(BTREE_NODES.root.y) + 6} fill={C.muted} fontSize={14} fontFamily={MONO} textAnchor="start">Root</text>
          <text x={20} y={mapY(BTREE_NODES.internal[0].y) + 6} fill={C.muted} fontSize={14} fontFamily={MONO} textAnchor="start">Internal</text>
          <text x={20} y={mapY(BTREE_NODES.leaves[0].y) + 6} fill={C.muted} fontSize={14} fontFamily={MONO} textAnchor="start">Leaf</text>

          {/* Render nodes */}
          {renderNode(BTREE_NODES.root.x, BTREE_NODES.root.y, BTREE_NODES.root.value, 'Root', 'root', -1, 'root')}
          {renderNode(BTREE_NODES.internal[0].x, BTREE_NODES.internal[0].y, BTREE_NODES.internal[0].value, 'Internal L', 'internal', 0, 'int0')}
          {renderNode(BTREE_NODES.internal[1].x, BTREE_NODES.internal[1].y, BTREE_NODES.internal[1].value, 'Internal R', 'internal', 1, 'int1')}
          {BTREE_NODES.leaves.map((leaf, i) => renderNode(leaf.x, leaf.y, leaf.value, `Leaf ${i + 1}`, 'leaf', i, `leaf${i}`))}

          {/* Search pointer (pulsing arrow) */}
          {searchProg > 0 ? (
            <g style={{filter: `drop-shadow(0 0 8px ${C.green})`}}>
              <circle cx={px} cy={py} r={14} fill={C.green} opacity={0.7} />
              <circle cx={px} cy={py} r={8} fill={C.text} />
              <text x={px} y={py - 28} fill={C.green} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">search</text>
            </g>
          ) : null}
        </svg>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 60, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 16, fontWeight: 700, paddingTop: 8, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.blue}}>depth = 3 · balanced</span>
          <span style={{color: C.green, opacity: clamp(pop(f, t(20)))}}>{searchProg >= 1 ? '✓ value 40 found in 3 hops' : `comparing: ${cur.value}`}</span>
          <span style={{color: C.amber}}>cost: O(log n)</span>
        </div>
      </Win>

      {/* Seal badge */}
      <div style={{position: 'absolute', left: 80, top: 920, opacity: clamp(sealP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 22px', border: `2px solid ${C.green}`, borderRadius: 14, background: `${C.green}0d`}}>
          <Check p={sealP} size={36} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700}}>B-Tree · Balanced · O(log n)</div>
        </div>
      </div>

      <Caption text="CREATE INDEX idx_price ON products USING btree (unit_price) ──► O(log n) Lookup" from={t(20)} to={sec(38)} tone="ok" />
    </Stage>
  );
};
