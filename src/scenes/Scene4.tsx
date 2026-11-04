import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {BTreeNode, Caption, Check, Chip, Editor, Kpi, Mix, Stage, TopBadge, Warn, Win, clamp, lin, pop, sec} from '../kit';
import {PERF} from '../data';

// SC04 (130-170s): Expression Indexes — Performance Trap & Fix
// Anchors (s): 131.1 trap | 136.0 LOWER(email) | 140.0 B-Tree | 145.0 Full Table Scan | 150.0 slow | 155.0 CREATE INDEX | 160.0 Expression Index | 165.0 0.0001s
const S = START.s4;
const t = (g: number) => sec(g - S);

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const trapP = clamp(lin(f, t(131.5), 14));
  const slowP = clamp(lin(f, t(140), 16));
  const fixP = clamp(lin(f, t(155), 16));
  const seekP = clamp(lin(f, t(162), 18));

  // Animated scan progress for the full table scan (slow)
  const scanProg = clamp(lin(f, t(141), sec(18)));
  // Animated index seek (fast — jumps directly to the leaf node)
  const seekProg = clamp(lin(f, t(163), sec(2.5)));

  // B-Tree index visualization on the right (3 levels: root → branch → leaves)
  const treeP = clamp(lin(f, t(155), 14));

  // Counter for the slow scan
  const rowsScanned = Math.floor(scanProg * PERF.rowsScanned);
  const scanMs = (scanProg * PERF.fullScanMs).toFixed(1);
  const seekMs = (PERF.indexSeekMs).toFixed(3);

  return (
    <Stage dur={1200} inFx="zoom" outFx="morph">
      <TopBadge text="كواليس الأداء | Expression Index Optimization" from={sec(2)} to={sec(40)} color={C.amber} />

      {/* Problem editor */}
      <div style={{opacity: trapP}}>
        <Editor
          x={80}
          y={180}
          w={880}
          h={170}
          title="Performance Trap"
          lines={['SELECT * FROM customers', "WHERE LOWER(email) = 'john.doe@manzooma.com';"]}
          start={t(131.5)}
          cps={1.0}
          size={26}
          accent={C.red}
          hl={1}
          hlColor={C.red}
        />
      </div>

      {/* Fix editor */}
      <div style={{opacity: fixP, transform: `translateY(${(1 - fixP) * 24}px)`}}>
        <Editor
          x={980}
          y={180}
          w={860}
          h={170}
          title="Expression Index Fix"
          lines={['CREATE INDEX idx_email_lower', 'ON customers (LOWER(email));']}
          start={t(155.5)}
          cps={0.9}
          size={22}
          accent={C.green}
          hl={1}
          hlColor={C.green}
        />
      </div>

      {/* LEFT: Full Table Scan visualization */}
      <Win x={80} y={360} w={880} h={540} title="WITHOUT Expression Index · Full Table Scan" accent={C.red} opacity={slowP}>
        <div dir="ltr" style={{position: 'absolute', left: 24, top: 14, fontFamily: MONO, fontSize: 20, color: C.red}}>
          B-Tree index bypassed · scanning every row sequentially
        </div>
        {/* table rows visualization */}
        <div style={{position: 'absolute', left: 24, right: 24, top: 50, height: 360, display: 'flex', flexDirection: 'column', gap: 4}}>
          {Array.from({length: 8}).map((_, i) => {
            const rowScanned = i / 8 < scanProg;
            const isCurrentRow = Math.abs(i / 8 - scanProg) < 0.12;
            const bg = isCurrentRow ? C.red + '33' : rowScanned ? C.red + '14' : 'transparent';
            const bd = isCurrentRow ? C.red : 'transparent';
            return (
              <div key={i} dir="ltr" style={{display: 'flex', gap: 12, alignItems: 'center', padding: '4px 10px', fontFamily: MONO, fontSize: 17, background: bg, border: '1px solid ' + bd, borderRadius: 6, opacity: rowScanned ? 1 : 0.5, height: 40}}>
                <span style={{color: '#475569', width: 110, fontSize: 16}}>#{((i + 1) * 125000).toLocaleString()}</span>
                <span style={{color: C.muted, flex: 1}}>user{i}@example.com</span>
                <span style={{color: rowScanned ? C.red : '#475569', width: 80, textAlign: 'right'}}>{rowScanned ? 'scanned' : 'pending'}</span>
              </div>
            );
          })}
        </div>
        {/* scan laser indicator — removed to avoid overlap with footer */}
        {/* bottom status bar */}
        <div dir="ltr" style={{position: 'absolute', left: 24, right: 24, bottom: 14, height: 50, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 22, color: C.red, fontWeight: 700, paddingTop: 8, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span>{rowsScanned.toLocaleString()} rows scanned</span>
          <span>{scanMs}ms</span>
        </div>
      </Win>

      {/* RIGHT: Expression Index Seek visualization with B-Tree */}
      <Win x={980} y={360} w={860} h={540} title="WITH Expression Index · Index Only Scan" accent={C.green} opacity={seekP}>
        <div dir="ltr" style={{position: 'absolute', left: 24, top: 14, fontFamily: MONO, fontSize: 22, color: C.green}}>
          Index seek · jumps directly to leaf node
        </div>

        {/* B-Tree visualization */}
        <svg width={860} height={420} style={{position: 'absolute', left: 0, top: 50}}>
          {/* Level 1: root */}
          <BTreeNodeSvg x={400} y={20} w={80} h={40} label="root" color={C.green} p={treeP} />
          {/* Level 2: branches */}
          <BTreeNodeSvg x={180} y={120} w={80} h={40} label="≤ m" color={C.blue} p={treeP * clamp(lin(f, t(157), 10))} glow={seekProg > 0.3 ? 1 : 0} />
          <BTreeNodeSvg x={620} y={120} w={80} h={40} label="> m" color={C.blue} p={treeP * clamp(lin(f, t(158), 10))} />
          {/* Level 3: leaves */}
          <BTreeNodeSvg x={120} y={240} w={90} h={44} label="a-f" color={C.muted} p={treeP * clamp(lin(f, t(159), 10))} />
          <BTreeNodeSvg x={230} y={240} w={90} h={44} label="g-m" color={C.muted} p={treeP * clamp(lin(f, t(159.5), 10))} />
          <BTreeNodeSvg x={340} y={240} w={90} h={44} label="n-s" color={C.muted} p={treeP * clamp(lin(f, t(160), 10))} />
          <BTreeNodeSvg x={450} y={240} w={90} h={44} label="t-z" color={C.amber} p={treeP * clamp(lin(f, t(160.5), 10))} glow={seekProg > 0.6 ? 1 : 0} highlight={seekProg > 0.6} />
          <BTreeNodeSvg x={560} y={240} w={90} h={44} label="other" color={C.muted} p={treeP * clamp(lin(f, t(161), 10))} />
          <BTreeNodeSvg x={670} y={240} w={90} h={44} label="num" color={C.muted} p={treeP * clamp(lin(f, t(161.5), 10))} />
          {/* Connecting lines */}
          <line x1={440} y1={60} x2={220} y2={120} stroke={C.border} strokeWidth={2} opacity={treeP} />
          <line x1={440} y1={60} x2={660} y2={120} stroke={C.border} strokeWidth={2} opacity={treeP} />
          <line x1={220} y1={160} x2={165} y2={240} stroke={C.border} strokeWidth={2} opacity={treeP} />
          <line x1={220} y1={160} x2={275} y2={240} stroke={C.border} strokeWidth={2} opacity={treeP} />
          <line x1={660} y1={160} x2={385} y2={240} stroke={C.border} strokeWidth={2} opacity={treeP} />
          <line x1={660} y1={160} x2={495} y2={240} stroke={C.amber} strokeWidth={3} opacity={treeP * seekProg} />
          <line x1={660} y1={160} x2={605} y2={240} stroke={C.border} strokeWidth={2} opacity={treeP} />
          <line x1={660} y1={160} x2={715} y2={240} stroke={C.border} strokeWidth={2} opacity={treeP} />

          {/* Seek path animation — laser jumping from root to leaf */}
          {seekProg > 0 && seekProg < 1 ? (
            <g>
              {seekProg < 0.4 ? (
                <circle cx={440} cy={40} r={8} fill={C.green} opacity={1 - seekProg / 0.4} />
              ) : seekProg < 0.7 ? (
                <circle cx={660} cy={140} r={8} fill={C.green} opacity={1 - (seekProg - 0.4) / 0.3} />
              ) : (
                <circle cx={495} cy={262} r={8} fill={C.green} opacity={1 - (seekProg - 0.7) / 0.3} />
              )}
            </g>
          ) : null}

          {/* Result leaf */}
          {seekProg >= 1 ? (
            <g>
              <rect x={445} y={300} width={100} height={50} fill={`${C.green}22`} stroke={C.green} strokeWidth={2} rx={8} />
              <text x={495} y={330} fill={C.green} fontSize={20} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ found</text>
            </g>
          ) : null}
        </svg>

        {/* bottom status bar */}
        <div dir="ltr" style={{position: 'absolute', left: 24, right: 24, bottom: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 22, color: C.green, fontWeight: 700, opacity: seekP}}>
          <span>{seekProg >= 1 ? '1 row · index seek' : 'seeking...'}</span>
          <span>{seekMs}ms</span>
        </div>
      </Win>

      <Caption text="WHERE LOWER(col) ──► Invalidates Normal B-Tree Index (Full Scan)" from={t(140)} to={t(155)} tone="danger" />
      <Caption text="CREATE INDEX idx ON table (LOWER(col)) ──► Enables Expression Index Seek" from={t(157)} to={sec(44)} tone="ok" />
    </Stage>
  );
};

// SVG-based B-Tree node (uses SVG primitives for cleaner rendering inside svg)
const BTreeNodeSvg: React.FC<{x: number; y: number; w: number; h: number; label: string; color: string; p: number; glow?: number; highlight?: boolean}> = ({x, y, w, h, label, color, p, glow = 0, highlight = false}) => (
  <g opacity={Math.max(0, Math.min(1, p))} transform={`translate(${x}, ${y})`}>
    {glow > 0 ? <rect x={-6} y={-6} width={w + 12} height={h + 12} fill="none" stroke={color} strokeWidth={2} rx={12} opacity={glow * 0.4} /> : null}
    <rect x={0} y={0} width={w} height={h} fill={`${color}22`} stroke={highlight ? C.amber : color} strokeWidth={highlight ? 3 : 2} rx={8} />
    <text x={w / 2} y={h / 2 + 7} fill={color} fontSize={16} fontFamily={MONO} fontWeight={700} textAnchor="middle">{label}</text>
  </g>
);
