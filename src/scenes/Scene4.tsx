import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {FTS_BENCHMARK} from '../data';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, Warn, clamp, lin, lerp, pop, sec} from '../kit';

// SC04 (130-170s): GIN Index & Bitmap Scan — GIN inverted index maps lexemes to document bitmaps (green)
// Sequential scan (red) bypassed, Bitmap Index Scan (blue) executes instantly
// Anchors: 131.0 GIN | 136.0 inverted | 140.0 lexeme tree | 145.0 bitmap | 150.0 index scan | 155.0 sub-ms | 160.0 seal | 165.0 fast
const S = START.s4;
const t = (g: number) => sec(g - S);

// Lexeme → doc IDs mapping (inverted index)
const INVERTED_INDEX: {lexeme: string; docs: number[]}[] = [
  {lexeme: 'fast', docs: [1, 3, 5, 7]},
  {lexeme: 'hdmi', docs: [2, 3, 6]},
  {lexeme: 'cable', docs: [3, 4, 6]},
  {lexeme: 'support', docs: [1, 5, 7]},
  {lexeme: '4k', docs: [2, 5, 7]},
];

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(131), 14));
  const ginP = pop(f, t(131));
  const invP = pop(f, t(136));
  const treeP = pop(f, t(140));
  const bitP = pop(f, t(145));
  const scanP = pop(f, t(150));
  const fastP = pop(f, t(155));
  const sealP = pop(f, t(160));
  const doneP = pop(f, t(165));

  const pulse = 0.5 + 0.5 * Math.sin(f * 0.17);
  // Bitmap lookup animation
  const lookupProg = clamp(lin(f, t(150), sec(8)));
  // Sequential scan progress (slow, red)
  const seqScanProg = clamp(lin(f, t(132), sec(15)));

  return (
    <Stage dur={1200} inFx="zoom" outFx="morph">
      <TopBadge text="فهرس GIN ومسح البت-ماب | GIN Inverted Index & Bitmap Index Scan ──► sub-millisecond FTS (Module 15)" from={sec(2)} to={sec(38)} color={C.green} />

      {/* LEFT: GIN code editor */}
      <div style={{opacity: editorP}}>
        <Editor
          x={80}
          y={170}
          w={680}
          h={280}
          title="gin_index.sql · CREATE INDEX USING GIN (PostgreSQL 16)"
          lines={[
            '-- GIN = Generalized Inverted Index',
            'CREATE INDEX idx_fts_products',
            '  ON store_products USING GIN (search_vector);',
            '',
            '-- EXPLAIN: Bitmap Index Scan on idx_fts_products',
            "--   cost=12.40..12.42 rows=8 width=0",
            'EXPLAIN SELECT * FROM store_products',
            "  WHERE search_vector @@ to_tsquery('english','hdmi');",
          ]}
          start={t(131)}
          cps={0.55}
          size={15}
          accent={C.green}
          hl={2}
          hlColor={C.green}
        />
      </div>

      {/* Concept chips below editor */}
      <div style={{position: 'absolute', left: 80, top: 470, width: 680, opacity: clamp(invP)}}>
        <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.muted, marginBottom: 10}}>◆ GIN inverted index golden rule</div>
        <div style={{display: 'flex', gap: 10, flexWrap: 'wrap'}}>
          <Chip color={C.green} style={{fontSize: 16, padding: '4px 14px'}}>USING GIN</Chip>
          <Chip color={C.blue} style={{fontSize: 16, padding: '4px 14px'}}>inverted index</Chip>
          <Chip color={C.amber} style={{fontSize: 16, padding: '4px 14px'}}>lexeme → doc ids</Chip>
          <Chip color={C.purple} style={{fontSize: 16, padding: '4px 14px'}}>Bitmap Scan</Chip>
          <Chip color={C.green} style={{fontSize: 16, padding: '4px 14px'}}>0.5ms ✓</Chip>
        </div>
      </div>

      {/* GIN benchmark panel */}
      <Win x={80} y={560} w={680} h={340} title="benchmark ──► LIKE Seq Scan (red) vs GIN Bitmap Scan (green) — sub-ms" accent={C.amber} opacity={clamp(lin(f, t(155), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.amber}}>
          EXPLAIN ANALYZE: same query · two plans · {Math.round(FTS_BENCHMARK.likeMs / FTS_BENCHMARK.ftsMs)}× speedup
        </div>

        <div style={{position: 'absolute', right: 18, top: 14, display: 'flex', gap: 10}}>
          <Chip color={C.red} style={{fontSize: 13, padding: '4px 12px'}}>{FTS_BENCHMARK.likeMs}ms</Chip>
          <Chip color={C.green} style={{fontSize: 13, padding: '4px 12px'}}>{FTS_BENCHMARK.ftsMs}ms ✓</Chip>
        </div>

        <svg width={640} height={240} style={{position: 'absolute', left: 18, top: 60}}>
          {/* LIKE bar (red, very long) */}
          <g style={{opacity: clamp(pop(f, t(155)))}}>
            <text x={20} y={30} fill={C.red} fontSize={13} fontFamily={MONO} fontWeight={700}>LIKE '%laptop%' · Seq Scan</text>
            <rect x={20} y={40} width={500} height={40} fill={`${C.red}22`} stroke={C.red} strokeWidth={2.5} rx={6} style={{filter: `drop-shadow(0 0 6px ${C.red}66)`}} />
            <text x={280} y={66} fill={C.red} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">{FTS_BENCHMARK.likeMs}ms · scanning all rows</text>
          </g>

          {/* FTS bar (green, tiny) */}
          <g style={{opacity: clamp(pop(f, t(156)))}}>
            <text x={20} y={110} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700}>FTS @@ to_tsquery · GIN Bitmap Scan</text>
            <rect x={20} y={120} width={20} height={40} fill={`${C.green}33`} stroke={C.green} strokeWidth={3} rx={4} style={{filter: `drop-shadow(0 0 8px ${C.green})`}} />
            <text x={60} y={146} fill={C.green} fontSize={14} fontFamily={MONO} fontWeight={700}>{FTS_BENCHMARK.ftsMs}ms · instant ✓</text>
          </g>

          {/* Speedup annotation */}
          <g style={{opacity: clamp(pop(f, t(158)))}}>
            <rect x={20} y={180} width={500} height={48} fill={`${C.amber}11`} stroke={C.amber} strokeWidth={2} strokeDasharray="5 4" rx={8} />
            <text x={270} y={208} fill={C.amber} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">{Math.round(FTS_BENCHMARK.likeMs / FTS_BENCHMARK.ftsMs)}× speedup · production-ready ✓</text>
          </g>
        </svg>
      </Win>

      {/* RIGHT: GIN inverted index tree visualization */}
      <Win x={800} y={170} w={1040} h={730} title="GIN inverted index ──► lexeme tree (purple) ──► doc bitmap (green) ──► Bitmap Scan (blue)" accent={C.green} opacity={clamp(lin(f, t(136), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.green}}>
          GIN maps each lexeme → sorted list of doc IDs · query looks up only matching lexemes · Bitmap Scan fetches rows
        </div>

        <div style={{position: 'absolute', right: 18, top: 14, display: 'flex', gap: 10}}>
          <Chip color={C.purple} style={{fontSize: 13, padding: '4px 12px'}}>Lexeme tree</Chip>
          <Chip color={C.amber} style={{fontSize: 13, padding: '4px 12px'}}>{lookupProg > 0.05 && lookupProg < 0.99 ? 'looking up...' : 'idle'}</Chip>
          <Chip color={C.green} style={{fontSize: 13, padding: '4px 12px'}}>{lookupProg > 0.95 ? 'Bitmap ✓' : '...'}</Chip>
        </div>

        <svg width={1000} height={610} style={{position: 'absolute', left: 20, top: 60}}>
          {/* === TOP: Sequential Scan bypassed (red, faded) === */}
          <g style={{opacity: clamp(seqScanProg) * 0.4}}>
            <rect x={20} y={10} width={960} height={50} fill={`${C.red}11`} stroke={C.red} strokeWidth={2} strokeDasharray="5 4" rx={8} />
            <text x={500} y={30} fill={C.red} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle" textDecoration="line-through">Seq Scan · check every row · 4200ms (BYPASSED)</text>
            <text x={500} y={48} fill={C.red} fontSize={10} fontFamily={MONO} textAnchor="middle">→ planner rejects this plan when GIN index exists</text>
          </g>

          {/* === GIN root node (purple, top) === */}
          <g style={{opacity: clamp(treeP)}}>
            <rect x={400} y={80} width={200} height={56} fill={`${C.purple}33`} stroke={C.purple} strokeWidth={3} rx={12} style={{filter: `drop-shadow(0 0 ${8 + pulse * 8}px ${C.purple})`}} />
            <text x={500} y={106} fill={C.purple} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">GIN Root</text>
            <text x={500} y={124} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">lexeme B-tree</text>
          </g>

          {/* Lexeme leaves (5 entries) */}
          {INVERTED_INDEX.map((entry, i) => {
            const x = 60 + i * 180;
            const entryP = clamp(treeP - (i + 1) * 0.08);
            const isQueried = entry.lexeme === 'hdmi';
            const isQueriedActive = isQueried && lookupProg > 0.2;
            return (
              <g key={i} style={{opacity: clamp(entryP)}}>
                {/* Connector from root */}
                <line x1={500} y1={136} x2={x + 80} y2={180} stroke={C.purple} strokeWidth={1.8} strokeDasharray="4 3" opacity={0.5} />

                {/* Lexeme node */}
                <rect x={x} y={180} width={160} height={50} fill={isQueriedActive ? `${C.amber}33` : `${C.purple}22`} stroke={isQueriedActive ? C.amber : C.purple} strokeWidth={isQueriedActive ? 3 : 2} rx={8} style={isQueriedActive ? {filter: `drop-shadow(0 0 10px ${C.amber})`} : {}} />
                <text x={x + 80} y={202} fill={isQueriedActive ? C.amber : C.purple} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">{`'${entry.lexeme}'`}</text>
                <text x={x + 80} y={220} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">lexeme node</text>

                {/* Connector to bitmap */}
                <line x1={x + 80} y1={230} x2={x + 80} y2={270} stroke={C.green} strokeWidth={isQueriedActive ? 3 : 1.5} strokeDasharray={isQueriedActive ? '6 3' : '4 3'} opacity={isQueriedActive ? 0.9 : 0.4} />

                {/* Bitmap row (doc IDs) */}
                <rect x={x} y={270} width={160} height={100} fill={`${C.green}11`} stroke={C.green} strokeWidth={2} rx={8} />
                <text x={x + 80} y={290} fill={C.green} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">doc bitmap</text>
                {/* 8 bitmap cells (1..8) */}
                {Array.from({length: 8}, (_, docId) => {
                  const isSet = entry.docs.includes(docId + 1);
                  const cellP = clamp(bitP - (docId + 1) * 0.04);
                  const highlight = isQueriedActive && isSet;
                  return (
                    <g key={docId} style={{opacity: clamp(cellP)}}>
                      <rect x={x + 10 + (docId % 4) * 35} y={300 + Math.floor(docId / 4) * 28} width={28} height={22} fill={isSet ? (highlight ? C.amber : C.green) : C.deep} stroke={isSet ? (highlight ? C.amber : C.green) : C.border} strokeWidth={1.5} rx={3} />
                      <text x={x + 10 + (docId % 4) * 35 + 14} y={315 + Math.floor(docId / 4) * 28} fill={isSet ? C.bg : C.muted} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">{docId + 1}</text>
                    </g>
                  );
                })}
              </g>
            );
          })}

          {/* === Bitmap Index Scan execution (blue) === */}
          <g style={{opacity: clamp(scanP)}}>
            <line x1={240} y1={490} x2={500} y2={520} stroke={C.blue} strokeWidth={3} strokeDasharray="6 4" opacity={0.8} />
            <polygon points="494,514 494,526 508,520" fill={C.blue} />
            <text x={370} y={510} fill={C.blue} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">Bitmap Index Scan</text>

            <rect x={500} y={490} width={280} height={60} fill={`${C.blue}33`} stroke={C.blue} strokeWidth={3} rx={12} style={{filter: `drop-shadow(0 0 ${10 + pulse * 8}px ${C.blue})`}} />
            <text x={640} y={516} fill={C.blue} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">Bitmap Heap Fetch</text>
            <text x={640} y={536} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">only rows 2, 3, 6 (hdmi docs)</text>

            <line x1={780} y1={520} x2={840} y2={520} stroke={C.green} strokeWidth={4} opacity={0.9} style={{filter: `drop-shadow(0 0 6px ${C.green})`}} />
            <polygon points="834,514 834,526 848,520" fill={C.green} />

            <rect x={850} y={490} width={120} height={60} fill={`${C.green}33`} stroke={C.green} strokeWidth={3} rx={12} style={{filter: `drop-shadow(0 0 ${10 + pulse * 8}px ${C.green})`}} />
            <text x={910} y={516} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">3 rows</text>
            <text x={910} y={536} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">0.5ms ✓</text>
          </g>

          {/* Result banner */}
          {lookupProg > 0.95 ? (
            <g style={{opacity: clamp(pop(f, t(160)))}}>
              <rect x={200} y={565} width={600} height={40} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 12px ${C.green})`}} />
              <text x={500} y={590} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ GIN Sealed · Lexeme Tree · Bitmap Scan · {FTS_BENCHMARK.ftsMs}ms · Production-Ready</text>
            </g>
          ) : null}
        </svg>

        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 36, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 13, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.purple}}>GIN · lexeme tree</span>
          <span style={{color: C.green}}>Bitmap Scan · 0.5ms</span>
        </div>
      </Win>

      {/* Seal badge bottom-left */}
      <div style={{position: 'absolute', left: 80, top: 920, opacity: clamp(sealP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 22px', border: `2px solid ${C.green}`, borderRadius: 14, background: `${C.green}0d`}}>
          <Check p={sealP} size={36} color={C.green} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700}}>GIN Inverted Index · Sealed ✓</div>
        </div>
      </div>

      {/* Fast badge bottom-right */}
      <div style={{position: 'absolute', right: 80, top: 920, opacity: clamp(doneP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 22px', border: `2px solid ${C.blue}`, borderRadius: 14, background: `${C.blue}0d`}}>
          <Check p={doneP} size={36} color={C.blue} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.blue, fontWeight: 700}}>Bitmap Scan · {FTS_BENCHMARK.ftsMs}ms ✓</div>
        </div>
      </div>

      <Caption text="GIN ──► inverted index ──► lexeme tree ──► doc bitmap ──► Bitmap Index Scan ──► sub-ms ──► Seal ✓" from={t(150)} to={sec(40)} tone="ok" />
    </Stage>
  );
};
