import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {ENTERPRISE_EXTENSIONS_CODE, EXTENSIONS_BENCHMARK, POSTGIS_EXAMPLE} from '../data';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, lerp, pop, sec} from '../kit';

// SC05 (170-210s): Enterprise Spatial Routing &amp; Security Capstone on manzooma_store_db
// Three extensions combined: pg_trgm suggestions · pgcrypto password hashing · PostGIS nearest branch routing
// Green "Module 15 100% Mastery Seal" expands at the end (Module 15 complete)
// Anchors (scene-local seconds):
//   171.0 manzooma_store_db | 175.0 UPDATE crypt | 180.0 ORDER BY <-> | 185.0 GiST | 192.0 nearest branch | 200.0 Module 15 100%
const S = START.s5;
const t = (g: number) => sec(g - S);

interface BranchRow {
  name: string;
  lon: number;
  lat: number;
  km: number;
  nearest: boolean;
  /** Manual x position in the 360x220 mini-map (for visual clarity). */
  mx: number;
  /** Manual y position in the 360x220 mini-map. */
  my: number;
}

const BRANCHES: BranchRow[] = [
  {name: 'Cairo Branch', lon: 31.20, lat: 30.00, km: 2.41, nearest: true, mx: 380, my: 140},
  {name: 'Giza Branch', lon: 31.30, lat: 30.10, km: 13.42, nearest: false, mx: 540, my: 175},
  {name: 'Alex Branch', lon: 29.91, lat: 31.20, km: 198.6, nearest: false, mx: 130, my: 85},
  {name: 'Luxor Branch', lon: 32.64, lat: 25.72, km: 543.0, nearest: false, mx: 460, my: 235},
  {name: 'Aswan Branch', lon: 32.90, lat: 24.09, km: 712.4, nearest: false, mx: 640, my: 260},
];

export const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(171), 14));
  const entP = pop(f, t(171));
  const updP = pop(f, t(175));
  const orderP = pop(f, t(180));
  const nearP = pop(f, t(192));
  const sealP = pop(f, t(200));

  const pulse = 0.5 + 0.5 * Math.sin(f * 0.17);
  // Search/route progress
  const routeP = clamp(lin(f, t(180), sec(10)));
  // Result reveal
  const resultP = clamp(lin(f, t(188), sec(6)));
  // Customer marker coordinate — placed close to Cairo (nearest branch) for visual clarity.
  const cx = 400;
  const cy = 120;

  return (
    <Stage dur={1200} inFx="morph" outFx="fade">
      <TopBadge text="التطبيقات المؤسسية | Enterprise Spatial Routing &amp; Blowfish Security · manzooma_store_db (Module 15 Capstone)" from={sec(2)} to={sec(38)} color={C.green} />

      {/* LEFT: Enterprise extensions code editor */}
      <div style={{opacity: editorP}}>
        <Editor
          x={80}
          y={170}
          w={860}
          h={460}
          title="enterprise_extensions.sql · pg_trgm + pgcrypto + PostGIS (manzooma_store_db)"
          lines={ENTERPRISE_EXTENSIONS_CODE}
          start={t(171)}
          cps={0.5}
          size={14}
          accent={C.green}
          hl={9}
          hlColor={C.purple}
        />
      </div>

      {/* Concept chips below editor */}
      <div style={{position: 'absolute', left: 80, top: 645, width: 860, opacity: clamp(entP)}}>
        <div dir="ltr" style={{fontFamily: MONO, fontSize: 16, color: C.muted, marginBottom: 8}}>◆ Module 15 capstone — three extensions combined</div>
        <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
          <Chip color={C.blue} style={{fontSize: 14, padding: '4px 12px'}}>pg_trgm suggestions</Chip>
          <Chip color={C.purple} style={{fontSize: 14, padding: '4px 12px'}}>pgcrypto secure</Chip>
          <Chip color={C.green} style={{fontSize: 14, padding: '4px 12px'}}>PostGIS routing</Chip>
          <Chip color={C.amber} style={{fontSize: 14, padding: '4px 12px'}}>&lt;-&gt; operator</Chip>
          <Chip color={C.green} style={{fontSize: 14, padding: '4px 12px'}}>{EXTENSIONS_BENCHMARK.afterMs}ms ✓</Chip>
        </div>
      </div>

      {/* Module 15 100% Mastery Seal */}
      <Win x={80} y={725} w={860} h={220} title="module 15 mastery seal ──► 100% complete · semi-structured data &amp; extensions mastered" accent={C.green} opacity={clamp(sealP)}>
        <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: '0 22px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
            <Check p={sealP} size={72} color={C.green} />
            <div>
              <div dir="ltr" style={{fontFamily: MONO, fontSize: 28, color: C.green, fontWeight: 700}}>Module 15 Mastery Seal · 100% ✓</div>
              <div dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.muted, marginTop: 4}}>Semi-Structured Data &amp; Extensions · JSONB · Full-Text Search · pg_trgm · pgcrypto · PostGIS</div>
            </div>
          </div>
          {/* Progress bar at 100% */}
          <div style={{width: '100%', height: 18, borderRadius: 9, background: C.deep, overflow: 'hidden', border: `2px solid ${C.green}`}}>
            <div style={{width: `${sealP * 100}%`, height: '100%', background: `linear-gradient(90deg, ${C.blue}, ${C.green})`, borderRadius: 9, boxShadow: `0 0 ${10 + pulse * 6}px ${C.green}`}} />
          </div>
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.green, fontWeight: 700}}>3 extensions live · sub-ms routing · Blowfish-secured passwords · production-ready · Module 15 complete ✓</div>
        </div>
      </Win>

      {/* RIGHT: Enterprise dashboard — nearest branch routing + encrypted login */}
      <Win x={960} y={170} w={880} h={780} title="enterprise dashboard ──► nearest branch routing + Blowfish-secured login (manzooma_store_db)" accent={C.green} opacity={clamp(lin(f, t(175), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 16, color: C.green}}>
          customer submits order → PostGIS finds nearest branch → pgcrypto verifies login → pg_trgm suggests products · sub-ms
        </div>

        <div style={{position: 'absolute', right: 18, top: 14, display: 'flex', gap: 8}}>
          <Chip color={C.amber} style={{fontSize: 12, padding: '4px 10px'}}>{routeP > 0.05 && routeP < 0.99 ? 'routing...' : 'idle'}</Chip>
          <Chip color={C.green} style={{fontSize: 12, padding: '4px 10px'}}>{resultP > 0.95 ? 'routed ✓' : '...'}</Chip>
        </div>

        <svg width={840} height={680} style={{position: 'absolute', left: 18, top: 50}}>
          {/* Pipeline header: order → routing → secure → ship */}
          <g style={{opacity: clamp(entP)}}>
            <rect x={20} y={10} width={150} height={40} fill={`${C.amber}22`} stroke={C.amber} strokeWidth={2.5} rx={8} />
            <text x={95} y={35} fill={C.amber} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">customer order</text>

            <line x1={172} y1={30} x2={210} y2={30} stroke={C.amber} strokeWidth={3} strokeDasharray="6 4" opacity={0.7} />
            <polygon points="204,24 204,36 218,30" fill={C.amber} />

            <rect x={220} y={10} width={150} height={40} fill={`${C.blue}22`} stroke={C.blue} strokeWidth={2.5} rx={8} />
            <text x={295} y={35} fill={C.blue} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">pg_trgm suggest</text>

            <line x1={372} y1={30} x2={410} y2={30} stroke={C.blue} strokeWidth={3} strokeDasharray="6 4" opacity={0.7} />
            <polygon points="404,24 404,36 418,30" fill={C.blue} />

            <rect x={420} y={10} width={150} height={40} fill={`${C.green}22`} stroke={C.green} strokeWidth={2.5} rx={8} />
            <text x={495} y={35} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">PostGIS route</text>

            <line x1={572} y1={30} x2={610} y2={30} stroke={C.green} strokeWidth={3} strokeDasharray="6 4" opacity={0.7} />
            <polygon points="604,24 604,36 618,30" fill={C.green} />

            <rect x={620} y={10} width={200} height={40} fill={`${C.purple}22`} stroke={C.purple} strokeWidth={2.5} rx={8} />
            <text x={720} y={35} fill={C.purple} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">pgcrypto verify login</text>
          </g>

          {/* Spatial map (top half) */}
          <g style={{opacity: clamp(lin(f, t(180), 14))}}>
            <rect x={20} y={70} width={800} height={280} fill={`${C.deep}cc`} stroke={C.green} strokeWidth={2.5} rx={10} />
            <text x={420} y={92} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">Egypt · store_branches · GiST-accelerated ORDER BY location &lt;-&gt; ST_MakePoint</text>

            {/* Branch markers — placed manually for visual clarity (Egypt silhouette) */}
            {BRANCHES.map((b, i) => {
              const bx = b.mx;
              const by = b.my;
              const p = clamp(pop(f, t(180 + i * 0.4)));
              const isNearest = b.nearest && nearP > 0.4;
              return (
                <g key={i} style={{opacity: clamp(p)}}>
                  {/* Marker */}
                  <circle cx={bx} cy={by} r={isNearest ? 16 + pulse * 5 : 9} fill={isNearest ? `${C.green}33` : `${C.blue}22`} stroke={isNearest ? C.green : C.blue} strokeWidth={isNearest ? 3 : 2} style={{filter: isNearest ? `drop-shadow(0 0 12px ${C.green})` : 'none'}} />
                  <circle cx={bx} cy={by} r={isNearest ? 6 : 4} fill={isNearest ? C.green : C.blue} />
                  <text x={bx} y={by - 18} fill={isNearest ? C.green : C.blue} fontSize={isNearest ? 12 : 10} fontFamily={MONO} fontWeight={700} textAnchor="middle">{b.name}</text>
                  <text x={bx} y={by + 26} fill={isNearest ? C.green : C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">{b.km} km</text>
                </g>
              );
            })}

            {/* Customer marker */}
            <g style={{opacity: clamp(pop(f, t(184)))}}>
              <circle cx={cx} cy={cy} r={10 + pulse * 4} fill={`${C.amber}33`} stroke={C.amber} strokeWidth={3} style={{filter: `drop-shadow(0 0 8px ${C.amber})`}} />
              <circle cx={cx} cy={cy} r={5} fill={C.amber} />
              <text x={cx} y={cy - 18} fill={C.amber} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">Customer #4821</text>
            </g>

            {/* Nearest branch line */}
            <g style={{opacity: clamp(nearP)}}>
              {(() => {
                const nb = BRANCHES.find((b) => b.nearest)!;
                const bx = nb.mx;
                const by = nb.my;
                return (
                  <>
                    <line x1={cx} y1={cy} x2={bx} y2={by} stroke={C.green} strokeWidth={3} strokeDasharray="8 4" style={{filter: `drop-shadow(0 0 6px ${C.green})`}} />
                    <text x={(cx + bx) / 2 + 30} y={(cy + by) / 2} fill={C.green} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ nearest</text>
                  </>
                );
              })()}
            </g>
          </g>

          {/* Routing results table (bottom) */}
          <g style={{opacity: clamp(pop(f, t(186)))}}>
            {/* Header */}
            <rect x={20} y={370} width={800} height={30} fill={`${C.deep}cc`} stroke={C.border} strokeWidth={1} rx={6} />
            <text x={60} y={390} fill={C.muted} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">#</text>
            <text x={200} y={390} fill={C.muted} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">BRANCH</text>
            <text x={420} y={390} fill={C.muted} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">LOCATION (lon, lat)</text>
            <text x={620} y={390} fill={C.muted} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">DISTANCE</text>
            <text x={770} y={390} fill={C.muted} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">STATUS</text>

            {/* Rows */}
            {BRANCHES.map((b, i) => {
              const p = clamp(resultP - i * 0.12);
              return (
                <g key={i} style={{opacity: clamp(p), transform: `translate(${(1 - p) * 30}px, 0)`}}>
                  <rect x={20} y={406 + i * 36} width={800} height={32} fill={b.nearest ? `${C.green}22` : `${C.deep}88`} stroke={b.nearest ? C.green : C.border} strokeWidth={1.5} rx={6} />
                  <text x={60} y={426 + i * 36} fill={b.nearest ? C.green : C.muted} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">{i + 1}</text>
                  <text x={200} y={426 + i * 36} fill={b.nearest ? C.green : C.text} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">{b.name}</text>
                  <text x={420} y={426 + i * 36} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">({b.lon}, {b.lat})</text>
                  <text x={620} y={426 + i * 36} fill={b.nearest ? C.green : C.amber} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">{b.km} km</text>
                  <text x={770} y={426 + i * 36} fill={b.nearest ? C.green : C.muted} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">{b.nearest ? '✓ ship' : 'skip'}</text>
                </g>
              );
            })}
          </g>

          {/* Performance footer */}
          <g style={{opacity: clamp(pop(f, t(196)))}}>
            <rect x={20} y={610} width={800} height={50} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 12px ${C.green})`}} />
            <text x={420} y={632} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ {EXTENSIONS_BENCHMARK.afterMs}ms · Cairo Branch routed · customer login verified · Module 15 capstone sealed</text>
            <text x={420} y={650} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">{Math.round(EXTENSIONS_BENCHMARK.beforeMs / EXTENSIONS_BENCHMARK.afterMs)}× faster than Seq Scan · GiST-accelerated · production-ready</text>
          </g>
        </svg>

        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 12, fontWeight: 700, paddingTop: 4, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.amber}}>customer #4821</span>
          <span style={{color: C.green}}>Cairo Branch · {EXTENSIONS_BENCHMARK.afterMs}ms</span>
          <span style={{color: C.green}}>Module 15 · 100% ✓</span>
        </div>
      </Win>

      <Caption text="manzooma_store_db ──► pg_trgm ──► pgcrypto ──► PostGIS ──► nearest branch ──► Module 15 100% ✓" from={t(180)} to={sec(40)} tone="ok" />
    </Stage>
  );
};
