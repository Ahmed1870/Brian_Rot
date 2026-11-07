import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {ENGINE_INTERNALS_CODE, EXTENSIONS_BENCHMARK, PG_EXTENSION_CATALOG} from '../data';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, Warn, clamp, lin, lerp, pop, sec} from '../kit';

// SC04 (130-170s): PostgreSQL 16 Engine Mechanics — shared C-binaries register in pg_extension catalog (purple)
// GiST/GIN indexes attach to spatial and trigram columns → Index Scan (green) executes in sub-ms
// Anchors: 131 dynamic shared libraries | 136 pg_extension | 140 query plan | 145 optimizer | 150 GiST/GIN | 155 seal
const S = START.s4;
const t = (g: number) => sec(g - S);

// Lexemes/docs for the GIN inverted index (illustrative — same pattern as FTS but here for trigrams)
const TRIGRAM_INDEX: {trigram: string; docs: number[]}[] = [
  {trigram: ' man', docs: [1, 2, 3]},
  {trigram: 'man', docs: [1, 2, 3, 5]},
  {trigram: 'anz', docs: [1, 2, 3, 5]},
  {trigram: 'nzo', docs: [1, 2, 3]},
  {trigram: 'zoo', docs: [1, 2, 3]},
  {trigram: 'oma', docs: [1, 2, 3, 4]},
];

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(131), 14));
  const libP = pop(f, t(131));
  const catP = pop(f, t(136));
  const planP = pop(f, t(140));
  const optP = pop(f, t(145));
  const idxP = pop(f, t(150));
  const sealP = pop(f, t(155));

  const pulse = 0.5 + 0.5 * Math.sin(f * 0.17);
  // Sequential scan bypassed (red) — slow, fades out
  const seqScanP = clamp(lin(f, t(132), sec(3))) * (1 - clamp(lin(f, t(140), sec(4))));
  // Index scan progress (green, instant)
  const idxScanP = clamp(lin(f, t(150), sec(4)));
  // Lookup animation
  const lookupP = clamp(lin(f, t(150), sec(6)));

  return (
    <Stage dur={1200} inFx="zoom" outFx="morph">
      <TopBadge text="هندسة المحرك الداخلية | pg_extension Catalog · Shared C-Binaries · GiST &amp; GIN Index Scan (Module 15)" from={sec(2)} to={sec(38)} color={C.green} />

      {/* LEFT: Engine internals code editor */}
      <div style={{opacity: editorP}}>
        <Editor
          x={80}
          y={170}
          w={680}
          h={380}
          title="engine_internals.sql · pg_extension + GiST/GIN (PostgreSQL 16)"
          lines={ENGINE_INTERNALS_CODE}
          start={t(131)}
          cps={0.55}
          size={15}
          accent={C.purple}
          hl={5}
          hlColor={C.green}
        />
      </div>

      {/* Concept chips below editor */}
      <div style={{position: 'absolute', left: 80, top: 565, width: 680, opacity: clamp(libP)}}>
        <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.muted, marginBottom: 10}}>◆ Engine internals golden rule</div>
        <div style={{display: 'flex', gap: 10, flexWrap: 'wrap'}}>
          <Chip color={C.purple} style={{fontSize: 16, padding: '4px 14px'}}>.so / .dll</Chip>
          <Chip color={C.purple} style={{fontSize: 16, padding: '4px 14px'}}>pg_extension</Chip>
          <Chip color={C.amber} style={{fontSize: 16, padding: '4px 14px'}}>Query Optimizer</Chip>
          <Chip color={C.green} style={{fontSize: 16, padding: '4px 14px'}}>GiST</Chip>
          <Chip color={C.green} style={{fontSize: 16, padding: '4px 14px'}}>GIN</Chip>
          <Chip color={C.blue} style={{fontSize: 16, padding: '4px 14px'}}>Index Scan ✓</Chip>
        </div>
      </div>

      {/* Benchmark panel */}
      <Win x={80} y={640} w={680} h={280} title="benchmark ──► Seq Scan (red, bypassed) vs Index Scan (green, sub-ms)" accent={C.amber} opacity={clamp(lin(f, t(155), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 16, color: C.amber}}>
          EXPLAIN ANALYZE: same query · Seq Scan rejected · Index Scan chosen · {Math.round(EXTENSIONS_BENCHMARK.beforeMs / EXTENSIONS_BENCHMARK.afterMs)}× speedup
        </div>

        <div style={{position: 'absolute', right: 18, top: 14, display: 'flex', gap: 8}}>
          <Chip color={C.red} style={{fontSize: 12, padding: '4px 10px'}}>{EXTENSIONS_BENCHMARK.beforeMs}ms</Chip>
          <Chip color={C.green} style={{fontSize: 12, padding: '4px 10px'}}>{EXTENSIONS_BENCHMARK.afterMs}ms ✓</Chip>
        </div>

        <svg width={640} height={180} style={{position: 'absolute', left: 18, top: 50}}>
          {/* Seq Scan bar (red, very long, fading) */}
          <g style={{opacity: clamp(pop(f, t(155)))}}>
            <text x={20} y={20} fill={C.red} fontSize={12} fontFamily={MONO} fontWeight={700}>Seq Scan · no GiST/GIN · slow</text>
            <rect x={20} y={28} width={500} height={32} fill={`${C.red}22`} stroke={C.red} strokeWidth={2.5} rx={6} strokeDasharray="6 4" opacity={0.6} />
            <text x={280} y={50} fill={C.red} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">{EXTENSIONS_BENCHMARK.beforeMs}ms · scan all rows</text>
          </g>

          {/* Index Scan bar (green, tiny) */}
          <g style={{opacity: clamp(pop(f, t(156)))}}>
            <text x={20} y={90} fill={C.green} fontSize={12} fontFamily={MONO} fontWeight={700}>Index Scan · GiST/GIN · instant</text>
            <rect x={20} y={98} width={20} height={32} fill={`${C.green}33`} stroke={C.green} strokeWidth={3} rx={4} style={{filter: `drop-shadow(0 0 8px ${C.green})`}} />
            <text x={60} y={120} fill={C.green} fontSize={12} fontFamily={MONO} fontWeight={700}>{EXTENSIONS_BENCHMARK.afterMs}ms ✓</text>
          </g>

          {/* Speedup */}
          <g style={{opacity: clamp(pop(f, t(158)))}}>
            <rect x={20} y={140} width={500} height={32} fill={`${C.amber}11`} stroke={C.amber} strokeWidth={2} strokeDasharray="5 4" rx={8} />
            <text x={270} y={162} fill={C.amber} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">{Math.round(EXTENSIONS_BENCHMARK.beforeMs / EXTENSIONS_BENCHMARK.afterMs)}× speedup · production-ready ✓</text>
          </g>
        </svg>
      </Win>

      {/* RIGHT: pg_extension catalog + GiST/GIN tree visualization */}
      <Win x={800} y={170} w={1040} h={750} title="engine mechanics ──► pg_extension catalog (purple) ──► GiST/GIN indexes (green) ──► Index Scan (blue)" accent={C.green} opacity={clamp(lin(f, t(136), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 16, color: C.green}}>
          C-libraries load into engine memory · pg_extension registers metadata · GiST/GIN accelerate lookups → Index Scan
        </div>

        <div style={{position: 'absolute', right: 18, top: 14, display: 'flex', gap: 8}}>
          <Chip color={C.purple} style={{fontSize: 12, padding: '4px 10px'}}>pg_extension</Chip>
          <Chip color={C.amber} style={{fontSize: 12, padding: '4px 10px'}}>{lookupP > 0.05 && lookupP < 0.99 ? 'planning...' : 'idle'}</Chip>
          <Chip color={C.green} style={{fontSize: 12, padding: '4px 10px'}}>{idxScanP > 0.95 ? 'Index Scan ✓' : '...'}</Chip>
        </div>

        <svg width={1000} height={630} style={{position: 'absolute', left: 20, top: 60}}>
          {/* === TOP: shared C-libraries ingestion (purple) === */}
          <g style={{opacity: clamp(libP)}}>
            <text x={500} y={20} fill={C.purple} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">Dynamic Shared Libraries ──► loaded into PostgreSQL 16 engine memory</text>

            {/* Three .so files feeding in */}
            {[
              {lib: 'pg_trgm.so', color: C.blue, x: 130},
              {lib: 'pgcrypto.so', color: C.purple, x: 425},
              {lib: 'postgis-3.so', color: C.green, x: 720},
            ].map((lib, i) => {
              const p = clamp(libP - i * 0.08);
              return (
                <g key={i} style={{opacity: clamp(p)}}>
                  <rect x={lib.x} y={40} width={150} height={50} fill={`${lib.color}22`} stroke={lib.color} strokeWidth={2.5} rx={8} />
                  <text x={lib.x + 75} y={62} fill={lib.color} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">{lib.lib}</text>
                  <text x={lib.x + 75} y={78} fill={C.muted} fontSize={9} fontFamily={MONO} textAnchor="middle">C-binary · loaded once</text>

                  <line x1={lib.x + 75} y1={92} x2={lib.x + 75} y2={120} stroke={lib.color} strokeWidth={2} strokeDasharray="4 3" opacity={0.6} />
                  <polygon points={`${lib.x + 70},114 ${lib.x + 80},114 ${lib.x + 75},124`} fill={lib.color} />
                </g>
              );
            })}

            {/* Engine memory bar */}
            <rect x={80} y={130} width={840} height={50} fill={`${C.purple}22`} stroke={C.purple} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 ${8 + pulse * 6}px ${C.purple})`}} />
            <text x={500} y={155} fill={C.purple} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">PostgreSQL 16 Engine Memory · 3 extensions loaded · linked via pg_extension catalog</text>
            <text x={500} y={172} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">functions · types · operators · index opclasses registered</text>
          </g>

          {/* === MIDDLE: pg_extension catalog table (purple) === */}
          <g style={{opacity: clamp(catP)}}>
            <rect x={80} y={210} width={840} height={120} fill={`${C.deep}cc`} stroke={C.purple} strokeWidth={2.5} rx={10} />
            <text x={500} y={230} fill={C.purple} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">SELECT * FROM pg_extension ORDER BY extname;</text>

            {/* Header */}
            <rect x={100} y={240} width={800} height={22} fill={`${C.purple}22`} stroke={C.purple} strokeWidth={1} rx={4} />
            <text x={200} y={256} fill={C.muted} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">extname</text>
            <text x={400} y={256} fill={C.muted} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">extversion</text>
            <text x={600} y={256} fill={C.muted} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">extrelocatable</text>
            <text x={800} y={256} fill={C.muted} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">catalog entry</text>

            {/* Rows */}
            {PG_EXTENSION_CATALOG.map((row, i) => {
              const rowColor = row.color === 'blue' ? C.blue : row.color === 'purple' ? C.purple : C.green;
              return (
                <g key={i} style={{opacity: clamp(catP - i * 0.06)}}>
                  <rect x={100} y={266 + i * 20} width={800} height={18} fill={`${rowColor}11`} stroke={rowColor} strokeWidth={1} rx={3} />
                  <text x={200} y={279 + i * 20} fill={rowColor} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">{row.extname}</text>
                  <text x={400} y={279 + i * 20} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">{row.extversion}</text>
                  <text x={600} y={279 + i * 20} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">{row.extrelocatable ? 'true' : 'false'}</text>
                  <text x={800} y={279 + i * 20} fill={C.green} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓</text>
                </g>
              );
            })}
          </g>

          {/* === BOTTOM: GiST/GIN index tree (green) feeding Index Scan (blue) === */}
          <g style={{opacity: clamp(idxP)}}>
            {/* Seq Scan bypassed (red, faded) */}
            <g style={{opacity: clamp(seqScanP)}}>
              <rect x={40} y={360} width={920} height={36} fill={`${C.red}11`} stroke={C.red} strokeWidth={2} strokeDasharray="5 4" rx={8} />
              <text x={500} y={382} fill={C.red} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle" textDecoration="line-through">Seq Scan · 4800ms · bypassed by Optimizer</text>
            </g>

            {/* Optimizer node */}
            <g style={{opacity: clamp(optP)}}>
              <rect x={400} y={410} width={200} height={48} fill={`${C.amber}33`} stroke={C.amber} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 ${8 + pulse * 6}px ${C.amber})`}} />
              <text x={500} y={432} fill={C.amber} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">Query Optimizer</text>
              <text x={500} y={450} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">picks Index Scan plan</text>
            </g>

            {/* Two index trees side by side */}
            {/* GIN tree (left) */}
            <g style={{opacity: clamp(idxP)}}>
              <rect x={40} y={490} width={420} height={150} fill={`${C.green}11`} stroke={C.green} strokeWidth={2.5} rx={10} />
              <text x={250} y={510} fill={C.green} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">GIN trigram index · gin_trgm_ops</text>

              {/* Trigram leaves → doc bitmaps */}
              {TRIGRAM_INDEX.slice(0, 4).map((entry, i) => {
                const x = 60 + i * 95;
                return (
                  <g key={i}>
                    <rect x={x} y={525} width={85} height={26} fill={`${C.green}22`} stroke={C.green} strokeWidth={1.5} rx={4} />
                    <text x={x + 42} y={542} fill={C.green} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">{`'${entry.trigram}'`}</text>
                    {/* Doc chips */}
                    {entry.docs.slice(0, 3).map((d, di) => (
                      <rect key={di} x={x + 8 + di * 22} y={558} width={18} height={18} fill={lookupP > 0.3 && entry.trigram === 'man' ? C.amber : C.green} rx={3} />
                    ))}
                  </g>
                );
              })}
              <text x={250} y={610} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">trigram → doc-bitmap · 1 lookup</text>
            </g>

            {/* GiST tree (right) */}
            <g style={{opacity: clamp(idxP)}}>
              <rect x={540} y={490} width={420} height={150} fill={`${C.green}11`} stroke={C.green} strokeWidth={2.5} rx={10} />
              <text x={750} y={510} fill={C.green} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">GiST spatial index · R-tree</text>

              {/* Bounding rectangles */}
              <rect x={560} y={525} width={120} height={60} fill="none" stroke={C.green} strokeWidth={2} strokeDasharray="4 3" rx={4} />
              <text x={620} y={560} fill={C.green} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">bbox A</text>
              <rect x={700} y={535} width={120} height={60} fill="none" stroke={C.green} strokeWidth={2} strokeDasharray="4 3" rx={4} />
              <text x={760} y={570} fill={C.green} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">bbox B</text>
              <text x={750} y={610} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">location → R-tree · 1 lookup</text>
            </g>

            {/* Arrows to Index Scan node */}
            <g style={{opacity: clamp(idxP)}}>
              <line x1={250} y1={640} x2={450} y2={670} stroke={C.blue} strokeWidth={3} strokeDasharray="6 4" opacity={0.8} />
              <polygon points="444,664 444,676 458,670" fill={C.blue} />
              <line x1={750} y1={640} x2={550} y2={670} stroke={C.blue} strokeWidth={3} strokeDasharray="6 4" opacity={0.8} />
              <polygon points="556,664 556,676 542,670" fill={C.blue} />
            </g>
          </g>

          {/* Index Scan execution (blue) — bottom right */}
          {idxScanP > 0.5 ? (
            <g style={{opacity: clamp(pop(f, t(155)))}}>
              <rect x={360} y={650} width={280} height={50} fill={`${C.blue}33`} stroke={C.blue} strokeWidth={3} rx={12} style={{filter: `drop-shadow(0 0 ${10 + pulse * 8}px ${C.blue})`}} />
              <text x={500} y={672} fill={C.blue} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">Index Scan ✓</text>
              <text x={500} y={690} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">{EXTENSIONS_BENCHMARK.afterMs}ms · production-ready</text>
            </g>
          ) : null}
        </svg>

        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 13, fontWeight: 700, paddingTop: 4, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.purple}}>.so → pg_extension</span>
          <span style={{color: C.green}}>GiST · GIN</span>
          <span style={{color: C.blue}}>Index Scan · {EXTENSIONS_BENCHMARK.afterMs}ms ✓</span>
        </div>
      </Win>

      {/* Seal badge bottom-left */}
      <div style={{position: 'absolute', left: 80, top: 930, opacity: clamp(sealP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 22px', border: `2px solid ${C.green}`, borderRadius: 14, background: `${C.green}0d`}}>
          <Check p={sealP} size={36} color={C.green} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700}}>Engine Mechanics · Sealed ✓</div>
        </div>
      </div>

      {/* Index Scan badge bottom-right */}
      <div style={{position: 'absolute', right: 80, top: 930, opacity: clamp(pop(f, t(160)))}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 22px', border: `2px solid ${C.blue}`, borderRadius: 14, background: `${C.blue}0d`}}>
          <Check p={pop(f, t(160))} size={36} color={C.blue} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.blue, fontWeight: 700}}>Index Scan · {EXTENSIONS_BENCHMARK.afterMs}ms ✓</div>
        </div>
      </div>

      <Caption text=".so ──► pg_extension ──► Optimizer ──► GiST/GIN ──► Index Scan ──► sub-ms ✓" from={t(150)} to={sec(40)} tone="ok" />
    </Stage>
  );
};
