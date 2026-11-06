import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, lerp, pop, sec} from '../kit';

// SC04 (130-170s): Query Rewriter & pg_rewrite Catalog
// Anchors: 131.0 query rewriter | 136.0 pg_rewrite | 140.0 merge | 145.0 tree | 150.0 zero overhead | 155.0 unified | 160.0 seal | 165.0 fast
const S = START.s4;
const t = (g: number) => sec(g - S);

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(131.5), 14));
  const rewriteP = clamp(lin(f, t(136), 14));
  // pg_rewrite catalog open animation
  const catalogP = pop(f, t(136));
  // Merge animation: view query tree merges into main execution tree
  const mergeProg = clamp(lin(f, t(140), sec(8)));
  const treeP = pop(f, t(145));
  const zeroP = pop(f, t(150));
  const unifiedP = pop(f, t(155));
  const sealP = pop(f, t(160));
  const fastP = pop(f, t(165));

  // Tree node pulse
  const pulse = 0.5 + 0.5 * Math.sin(f * 0.15);

  return (
    <Stage dur={1200} inFx="zoom" outFx="morph">
      <TopBadge text="محرك إعادة كتابة الاستعلامات و pg_rewrite | Query Rewriter Engine &amp; pg_rewrite Catalog (PostgreSQL 16)" from={sec(2)} to={sec(40)} color={C.amber} />

      {/* LEFT: Simple query editor + pg_rewrite catalog */}
      <div style={{opacity: editorP}}>
        <Editor
          x={80}
          y={170}
          w={620}
          h={150}
          title="Query Editor · simple view reference"
          lines={[
            'SELECT * FROM vw_sales;',
            '-- looks like a table,',
            '-- but is a stored query',
          ]}
          start={t(131.5)}
          cps={0.55}
          size={15}
          accent={C.blue}
          hl={0}
          hlColor={C.blue}
        />
      </div>

      {/* pg_rewrite catalog panel */}
      <Win x={80} y={340} w={620} h={310} title="pg_rewrite catalog (PostgreSQL 16) ──► view rule storage" accent={C.amber} opacity={clamp(rewriteP)}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 16, color: C.amber}}>
          pg_rewrite stores view definitions as query trees
        </div>

        <div style={{position: 'absolute', right: 18, top: 14, display: 'flex', gap: 10}}>
          <Chip color={C.amber} style={{fontSize: 13, padding: '4px 12px'}}>
            <Check p={catalogP} size={16} color={C.amber} /> pg_rewrite ✓
          </Chip>
        </div>

        {/* SVG: pg_rewrite catalog rows */}
        <svg width={580} height={210} style={{position: 'absolute', left: 20, top: 56}}>
          {/* Catalog header */}
          <rect x={0} y={0} width={580} height={30} fill={C.deep} stroke={C.amber} strokeWidth={2} rx={6} />
          <text x={70} y={20} fill={C.amber} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">ev_class</text>
          <text x={210} y={20} fill={C.amber} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">rulename</text>
          <text x={400} y={20} fill={C.amber} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">ev_action (query tree)</text>

          {/* Catalog rows */}
          {[
            {ev: 'vw_sales (16384)', rule: '_RETURN', action: 'SELECT ... FROM orders JOIN ...'},
            {ev: 'vw_clean (16390)', rule: '_RETURN', action: 'SELECT user_id, email FROM users'},
            {ev: 'vw_active (16395)', rule: '_RETURN', action: 'SELECT ... WHERE balance > 0'},
            {ev: 'vw_summary (16401)', rule: '_RETURN', action: 'SELECT ... GROUP BY product_id'},
          ].map((row, i) => {
            const ap = clamp(pop(f, t(137 + i * 0.5)));
            return (
              <g key={i} style={{opacity: clamp(ap)}}>
                <rect x={0} y={36 + i * 34} width={580} height={30} fill={i % 2 === 0 ? `${C.card}` : `${C.deep}`} stroke={C.border} strokeWidth={1} rx={4} />
                <text x={70} y={56 + i * 34} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">{row.ev}</text>
                <text x={210} y={56 + i * 34} fill={C.amber} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">{row.rule}</text>
                <text x={400} y={56 + i * 34} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">{row.action}</text>
              </g>
            );
          })}

          {/* Footer note */}
          <text x={290} y={190} fill={C.amber} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">pg_rewrite.ev_action ──► stored query tree ──► merged by Query Rewriter</text>
        </svg>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 36, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 13, color: C.amber, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span>pg_rewrite</span>
          <span>query tree stored</span>
        </div>
      </Win>

      {/* Zero storage overhead chip */}
      <div style={{position: 'absolute', left: 80, top: 670, width: 620, opacity: clamp(zeroP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '12px 18px', border: `2px solid ${C.green}`, borderRadius: 14, background: `${C.green}0d`}}>
          <Check p={zeroP} size={36} color={C.green} />
          <div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700}}>Zero Storage Overhead ✓</div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 12, color: C.muted, marginTop: 2}}>Views store query text only ──► no data duplication ──► always current</div>
          </div>
        </div>
      </div>

      {/* Seal + fast chips at bottom-left */}
      <div style={{position: 'absolute', left: 80, top: 780, width: 620, display: 'flex', gap: 12}}>
        <div style={{flex: 1, opacity: clamp(sealP)}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', border: `2px solid ${C.amber}`, borderRadius: 12, background: `${C.amber}0d`}}>
            <Check p={sealP} size={28} color={C.amber} />
            <span dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.amber, fontWeight: 700}}>Query Rewriter Seal ✓</span>
          </div>
        </div>
        <div style={{flex: 1, opacity: clamp(fastP)}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', border: `2px solid ${C.green}`, borderRadius: 12, background: `${C.green}0d`}}>
            <Check p={fastP} size={28} color={C.green} />
            <span dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.green, fontWeight: 700}}>Fast &amp; Unified ✓</span>
          </div>
        </div>
      </div>

      {/* RIGHT: Query Rewriter merging view tree into main execution tree */}
      <Win x={740} y={170} w={1100} h={720} title="PostgreSQL 16 Query Rewriter ──► merges view query tree into execution tree" accent={C.amber} opacity={rewriteP}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.amber}}>
          SELECT * FROM vw_sales ──► Query Rewriter expands view ──► merged execution tree (single plan)
        </div>

        <div style={{position: 'absolute', right: 18, top: 14, display: 'flex', gap: 10}}>
          <Chip color={C.blue} style={{fontSize: 13, padding: '4px 12px'}}>Input Query</Chip>
          <Chip color={C.amber} style={{fontSize: 13, padding: '4px 12px'}}>{mergeProg > 0.05 ? 'Rewriting...' : 'idle'}</Chip>
          <Chip color={C.green} style={{fontSize: 13, padding: '4px 12px'}}>{mergeProg > 0.95 ? 'Unified ✓' : '...'}</Chip>
        </div>

        {/* SVG: tree merge visualization */}
        <svg width={1060} height={600} style={{position: 'absolute', left: 20, top: 60}}>
          {/* Input query box (top-left) */}
          <rect x={20} y={20} width={240} height={70} fill={`${C.blue}22`} stroke={C.blue} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 8px ${C.blue}44)`}} />
          <text x={140} y={48} fill={C.blue} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">Input Query</text>
          <text x={140} y={70} fill={C.text} fontSize={12} fontFamily={MONO} textAnchor="middle">SELECT * FROM vw_sales;</text>

          {/* pg_rewrite catalog box (top-right) */}
          <rect x={800} y={20} width={240} height={70} fill={`${C.amber}22`} stroke={C.amber} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 8px ${C.amber}44)`}} />
          <text x={920} y={48} fill={C.amber} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">pg_rewrite.ev_action</text>
          <text x={920} y={70} fill={C.text} fontSize={12} fontFamily={MONO} textAnchor="middle">stored view query tree</text>

          {/* Arrows into Query Rewriter (center) */}
          <line x1={140} y1={90} x2={460} y2={200} stroke={C.blue} strokeWidth={3} strokeDasharray="6 4" opacity={0.7} />
          <polygon points="455,194 463,206 470,196" fill={C.blue} />
          <line x1={920} y1={90} x2={600} y2={200} stroke={C.amber} strokeWidth={3} strokeDasharray="6 4" opacity={0.7} />
          <polygon points="605,194 597,206 590,196" fill={C.amber} />

          {/* Query Rewriter engine box (center) */}
          <rect x={420} y={180} width={220} height={80} fill={`${C.amber}33`} stroke={C.amber} strokeWidth={4} rx={12} style={{filter: `drop-shadow(0 0 ${12 + pulse * 8}px ${C.amber})`}} />
          <text x={530} y={210} fill={C.amber} fontSize={16} fontFamily={MONO} fontWeight={700} textAnchor="middle">Query Rewriter</text>
          <text x={530} y={232} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">expands view reference</text>
          <text x={530} y={250} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">into base-table query</text>

          {/* Merge arrow downward */}
          <g style={{opacity: clamp(pop(f, t(140)))}}>
            <line x1={530} y1={260} x2={530} y2={320} stroke={C.green} strokeWidth={4} strokeDasharray="6 4" opacity={0.4 + 0.6 * mergeProg} />
            <polygon points="522,312 538,312 530,328" fill={C.green} />
            <text x={560} y={298} fill={C.green} fontSize={12} fontFamily={MONO} fontWeight={700}>merging trees ──►</text>
          </g>

          {/* Two source trees converging (left = input, right = view) */}
          {/* Left tree (input query tree) */}
          <g style={{opacity: clamp(1 - mergeProg * 0.7)}}>
            <circle cx={260} cy={350} r={18} fill={`${C.blue}22`} stroke={C.blue} strokeWidth={2.5} />
            <text x={260} y={355} fill={C.blue} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">SELECT</text>
            <line x1={260} y1={368} x2={260} y2={395} stroke={C.blue} strokeWidth={2} />
            <circle cx={260} cy={410} r={16} fill={`${C.blue}22`} stroke={C.blue} strokeWidth={2} />
            <text x={260} y={414} fill={C.blue} fontSize={9} fontFamily={MONO} textAnchor="middle">vw_sales</text>
            <text x={260} y={440} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">(view ref)</text>
          </g>

          {/* Right tree (view query tree from pg_rewrite) */}
          <g style={{opacity: clamp(1 - mergeProg * 0.7)}}>
            <circle cx={800} cy={350} r={18} fill={`${C.amber}22`} stroke={C.amber} strokeWidth={2.5} />
            <text x={800} y={355} fill={C.amber} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">SELECT</text>
            <line x1={800} y1={368} x2={800} y2={395} stroke={C.amber} strokeWidth={2} />
            <circle cx={760} cy={410} r={14} fill={`${C.amber}22`} stroke={C.amber} strokeWidth={2} />
            <text x={760} y={414} fill={C.amber} fontSize={8} fontFamily={MONO} textAnchor="middle">orders</text>
            <circle cx={840} cy={410} r={14} fill={`${C.amber}22`} stroke={C.amber} strokeWidth={2} />
            <text x={840} y={414} fill={C.amber} fontSize={8} fontFamily={MONO} textAnchor="middle">JOIN</text>
            <line x1={800} y1={395} x2={760} y2={396} stroke={C.amber} strokeWidth={2} />
            <line x1={800} y1={395} x2={840} y2={396} stroke={C.amber} strokeWidth={2} />
          </g>

          {/* Unified merged execution tree (bottom, green) - grows as merge progresses */}
          <g style={{opacity: clamp(mergeProg)}}>
            <rect x={120} y={460} width={820} height={130} fill={`${C.green}0d`} stroke={C.green} strokeWidth={2.5} strokeDasharray="6 4" rx={10} style={{filter: `drop-shadow(0 0 ${10 + mergeProg * 10}px ${C.green}44)`}} />
            <text x={530} y={484} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ Unified Execution Tree (single query plan)</text>

            {/* Root node */}
            <circle cx={530} cy={510} r={20} fill={`${C.green}33`} stroke={C.green} strokeWidth={3} style={{filter: `drop-shadow(0 0 8px ${C.green})`}} />
            <text x={530} y={515} fill={C.green} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">SELECT</text>

            {/* Children: JOIN + columns */}
            <line x1={530} y1={530} x2={420} y2={555} stroke={C.green} strokeWidth={2} />
            <line x1={530} y1={530} x2={640} y2={555} stroke={C.green} strokeWidth={2} />
            <circle cx={420} cy={568} r={16} fill={`${C.green}22`} stroke={C.green} strokeWidth={2} />
            <text x={420} y={572} fill={C.green} fontSize={9} fontFamily={MONO} textAnchor="middle">orders</text>
            <circle cx={640} cy={568} r={16} fill={`${C.green}22`} stroke={C.green} strokeWidth={2} />
            <text x={640} y={572} fill={C.green} fontSize={9} fontFamily={MONO} textAnchor="middle">products</text>
          </g>

          {/* Merge result banner */}
          {mergeProg > 0.95 ? (
            <g style={{opacity: clamp(pop(f, t(146)))}}>
              <rect x={250} y={600} width={560} height={36} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 10px ${C.green}66)`}} />
              <text x={530} y={623} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ View merged into execution tree · planner sees one unified plan · zero overhead</text>
            </g>
          ) : null}
        </svg>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 14, color: C.amber, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span>input + pg_rewrite</span>
          <span style={{color: mergeProg >= 1 ? C.green : C.amber}}>{mergeProg >= 1 ? '✓ unified tree' : mergeProg > 0 ? `merging... ${Math.round(mergeProg * 100)}%` : 'idle'}</span>
          <span style={{color: C.green}}>zero overhead</span>
        </div>
      </Win>

      <Caption text="SELECT vw_sales ──► pg_rewrite ──► Query Rewriter ──► Unified Tree ──► Zero Overhead ──► Fast ✓" from={t(140)} to={sec(40)} tone="ok" />
    </Stage>
  );
};
