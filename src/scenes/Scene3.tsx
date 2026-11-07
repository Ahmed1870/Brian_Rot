import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {EXTENSION_QUERIES, PGCRYPTO_EXAMPLE, POSTGIS_EXAMPLE, TRIGRAM_EXAMPLE} from '../data';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, lerp, pop, sec} from '../kit';

// SC03 (85-130s): Extension Creation &amp; Function Invocation Syntax
// Editor types CREATE EXTENSION IF NOT EXISTS, then % fuzzy, crypt(), ST_Distance — each query glows in its extension's color
// Anchors (scene-local seconds):
//   86.0 CREATE EXTENSION | 92.0 if not exists | 100.0 % fuzzy | 105.0 crypt() | 110.0 ST_Distance | 120.0 production-ready
const S = START.s3;
const t = (g: number) => sec(g - S);

interface FuzzyRow {
  name: string;
  matched: boolean;
  sim: number;
}

const FUZZY_ROWS: FuzzyRow[] = [
  {name: 'Manzooma Mouse Pad', matched: true, sim: 0.85},
  {name: 'Manzooma Mechanical Keyboard', matched: true, sim: 0.78},
  {name: 'Manzoma USB-C Hub', matched: true, sim: 0.71},
  {name: 'USB-C Charger 65W', matched: false, sim: 0.18},
  {name: 'HDMI Cable 4K', matched: false, sim: 0.09},
];

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(86), 14));
  const createP = pop(f, t(86));
  const fuzzyP = pop(f, t(100));
  const cryptP = pop(f, t(105));
  const distP = pop(f, t(110));
  const prodP = pop(f, t(120));

  const pulse = 0.5 + 0.5 * Math.sin(f * 0.18);
  // Fuzzy results reveal
  const fuzzyReveal = clamp(lin(f, t(102), sec(6)));
  // Crypt reveal
  const cryptReveal = clamp(lin(f, t(107), sec(4)));
  // Distance reveal
  const distReveal = clamp(lin(f, t(112), sec(4)));

  return (
    <Stage dur={1350} inFx="left" outFx="up">
      <TopBadge text="بناء واستدعاء الامتدادات | CREATE EXTENSION IF NOT EXISTS · % · crypt() · ST_Distance (Module 15)" from={sec(2)} to={sec(40)} color={C.amber} />

      {/* LEFT: Code editor with all three extension queries */}
      <div style={{opacity: editorP}}>
        <Editor
          x={80}
          y={170}
          w={880}
          h={600}
          title="extensions.sql · CREATE EXTENSION + invocation (PostgreSQL 16)"
          lines={EXTENSION_QUERIES}
          start={t(86)}
          cps={0.5}
          size={15}
          accent={C.amber}
          hl={1}
          hlColor={C.blue}
        />
      </div>

      {/* Concept chips below editor */}
      <div style={{position: 'absolute', left: 80, top: 786, width: 880, opacity: clamp(createP)}}>
        <div dir="ltr" style={{fontFamily: MONO, fontSize: 16, color: C.muted, marginBottom: 8}}>◆ Extension invocation golden rule</div>
        <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
          <Chip color={C.blue} style={{fontSize: 14, padding: '4px 12px'}}>CREATE EXTENSION</Chip>
          <Chip color={C.amber} style={{fontSize: 14, padding: '4px 12px'}}>IF NOT EXISTS</Chip>
          <Chip color={C.blue} style={{fontSize: 14, padding: '4px 12px'}}>{'% fuzzy'}</Chip>
          <Chip color={C.purple} style={{fontSize: 14, padding: '4px 12px'}}>crypt()</Chip>
          <Chip color={C.purple} style={{fontSize: 14, padding: '4px 12px'}}>gen_salt('bf')</Chip>
          <Chip color={C.green} style={{fontSize: 14, padding: '4px 12px'}}>ST_Distance</Chip>
          <Chip color={C.green} style={{fontSize: 14, padding: '4px 12px'}}>ST_MakePoint</Chip>
        </div>
      </div>

      {/* Production-ready bar */}
      <div style={{position: 'absolute', left: 80, top: 870, width: 880, opacity: clamp(prodP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '12px 22px', border: `3px solid ${C.green}`, borderRadius: 16, background: `${C.green}0d`, boxShadow: `0 0 24px ${C.green}33`}}>
          <Check p={prodP} size={40} color={C.green} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700}}>Extensions live · pg_extension registered · query-time ready ✓</div>
        </div>
      </div>

      {/* RIGHT: Three stacked result panels — fuzzy / crypt / distance */}
      {/* Panel A: pg_trgm fuzzy search results (blue) */}
      <Win x={980} y={170} w={860} h={280} title="pg_trgm result ──► SELECT product_name WHERE name % 'Manzoma' (blue)" accent={C.blue} opacity={clamp(lin(f, t(100), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 16, color: C.blue}}>
          % operator matches trigrams → ranked by similarity → 0.7+ is "similar enough"
        </div>

        <div style={{position: 'absolute', right: 18, top: 14, display: 'flex', gap: 8}}>
          <Chip color={C.blue} style={{fontSize: 12, padding: '4px 10px'}}>{fuzzyReveal > 0.95 ? '3 matches ✓' : '...'}</Chip>
        </div>

        <svg width={820} height={200} style={{position: 'absolute', left: 18, top: 50}}>
          {/* Header */}
          <rect x={10} y={10} width={800} height={30} fill={`${C.deep}cc`} stroke={C.border} strokeWidth={1} rx={6} />
          <text x={30} y={30} fill={C.muted} fontSize={11} fontFamily={MONO} fontWeight={700}>#</text>
          <text x={70} y={30} fill={C.muted} fontSize={11} fontFamily={MONO} fontWeight={700}>PRODUCT NAME</text>
          <text x={500} y={30} fill={C.blue} fontSize={11} fontFamily={MONO} fontWeight={700}>SIMILARITY</text>
          <text x={700} y={30} fill={C.muted} fontSize={11} fontFamily={MONO} fontWeight={700}>STATUS</text>

          {/* Rows */}
          {FUZZY_ROWS.map((row, i) => {
            const p = clamp(fuzzyReveal - i * 0.12);
            const barColor = row.matched ? C.blue : C.border;
            return (
              <g key={i} style={{opacity: clamp(p), transform: `translate(${(1 - p) * 30}px, 0)`}}>
                <rect x={10} y={50 + i * 30} width={800} height={26} fill={row.matched ? `${C.blue}11` : `${C.deep}88`} stroke={row.matched ? C.blue : C.border} strokeWidth={1.5} rx={6} />
                <text x={30} y={68 + i * 30} fill={row.matched ? C.blue : C.muted} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">{i + 1}</text>
                <text x={70} y={68 + i * 30} fill={C.text} fontSize={11} fontFamily={MONO} fontWeight={700}>{row.name}</text>
                {/* similarity bar */}
                <rect x={500} y={56 + i * 30} width={180} height={12} fill={C.deep} stroke={C.border} strokeWidth={1} rx={3} />
                <rect x={500} y={56 + i * 30} width={180 * row.sim} height={12} fill={barColor} rx={3} />
                <text x={690} y={66 + i * 30} fill={C.blue} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">{row.sim.toFixed(2)}</text>
                <text x={750} y={68 + i * 30} fill={row.matched ? C.green : C.red} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">{row.matched ? '✓ match' : '✗ skip'}</text>
              </g>
            );
          })}
        </svg>

        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 8, height: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 12, fontWeight: 700, paddingTop: 4, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.blue}}>trigram %</span>
          <span style={{color: C.green}}>3 of 5 matched · sub-ms ✓</span>
        </div>
      </Win>

      {/* Panel B: pgcrypto hash result (purple) */}
      <Win x={980} y={465} w={860} h={210} title="pgcrypto result ──► SELECT crypt('Pass123', gen_salt('bf')) (purple)" accent={C.purple} opacity={clamp(lin(f, t(105), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 16, color: C.purple}}>
          one-way Blowfish hash · $2a$06$ prefix · 60 chars · irreversible
        </div>

        <div style={{position: 'absolute', right: 18, top: 14, display: 'flex', gap: 8}}>
          <Chip color={C.purple} style={{fontSize: 12, padding: '4px 10px'}}>{cryptReveal > 0.95 ? 'hashed ✓' : '...'}</Chip>
        </div>

        <svg width={820} height={130} style={{position: 'absolute', left: 18, top: 50}}>
          {/* Plain → hashed */}
          <g style={{opacity: clamp(cryptP)}}>
            <rect x={20} y={20} width={200} height={50} fill={`${C.amber}22`} stroke={C.amber} strokeWidth={2.5} rx={8} />
            <text x={120} y={40} fill={C.amber} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">input</text>
            <text x={120} y={58} fill={C.text} fontSize={12} fontFamily={MONO} textAnchor="middle">{`'${PGCRYPTO_EXAMPLE.rawPassword}'`}</text>

            <line x1={224} y1={45} x2={280} y2={45} stroke={C.purple} strokeWidth={3} strokeDasharray="6 4" opacity={0.7} />
            <polygon points="274,39 274,51 288,45" fill={C.purple} />
            <text x={252} y={35} fill={C.purple} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">crypt()</text>

            <rect x={290} y={20} width={240} height={50} fill={`${C.purple}33`} stroke={C.purple} strokeWidth={2.5} rx={8} style={{filter: `drop-shadow(0 0 ${6 + pulse * 4}px ${C.purple})`}} />
            <text x={410} y={40} fill={C.purple} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">gen_salt('bf') · 6 rounds</text>
            <text x={410} y={58} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">salt = ${PGCRYPTO_EXAMPLE.salt}</text>

            <line x1={534} y1={45} x2={590} y2={45} stroke={C.green} strokeWidth={3} strokeDasharray="6 4" opacity={0.7} />
            <polygon points="584,39 584,51 598,45" fill={C.green} />
            <text x={562} y={35} fill={C.green} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">hash</text>

            <rect x={600} y={20} width={200} height={50} fill={`${C.green}22`} stroke={C.green} strokeWidth={2.5} rx={8} />
            <text x={700} y={40} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">password_hash</text>
            <text x={700} y={58} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">60 chars · $2a$06$…</text>
          </g>

          {/* Bottom note */}
          <g style={{opacity: clamp(cryptReveal)}}>
            <text x={410} y={110} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">crypt('Pass123', stored_hash) = stored_hash → password matches ✓</text>
          </g>
        </svg>

        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 8, height: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 12, fontWeight: 700, paddingTop: 4, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.amber}}>plain</span>
          <span style={{color: C.purple}}>Blowfish 6 rounds</span>
          <span style={{color: C.green}}>secure ✓</span>
        </div>
      </Win>

      {/* Panel C: PostGIS distance result (green) */}
      <Win x={980} y={690} w={860} h={210} title="PostGIS result ──► SELECT ST_Distance(ST_MakePoint(...), ST_MakePoint(...)) (green)" accent={C.green} opacity={clamp(lin(f, t(110), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 16, color: C.green}}>
          ST_MakePoint(lon, lat) → ST_Distance → degrees · multiply by 111.32 → km
        </div>

        <div style={{position: 'absolute', right: 18, top: 14, display: 'flex', gap: 8}}>
          <Chip color={C.green} style={{fontSize: 12, padding: '4px 10px'}}>{distReveal > 0.95 ? `${POSTGIS_EXAMPLE.distanceKm} km ✓` : '...'}</Chip>
        </div>

        <svg width={820} height={130} style={{position: 'absolute', left: 18, top: 50}}>
          {/* Point A */}
          <g style={{opacity: clamp(distP)}}>
            <rect x={20} y={20} width={200} height={50} fill={`${C.blue}22`} stroke={C.blue} strokeWidth={2.5} rx={8} />
            <text x={120} y={40} fill={C.blue} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">ST_MakePoint(...)</text>
            <text x={120} y={58} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">({POSTGIS_EXAMPLE.branchA.x}, {POSTGIS_EXAMPLE.branchA.y})</text>

            <line x1={224} y1={45} x2={280} y2={45} stroke={C.amber} strokeWidth={3} strokeDasharray="6 4" opacity={0.7} />
            <polygon points="274,39 274,51 288,45" fill={C.amber} />
            <text x={252} y={35} fill={C.amber} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">+</text>

            <rect x={290} y={20} width={200} height={50} fill={`${C.purple}22`} stroke={C.purple} strokeWidth={2.5} rx={8} />
            <text x={390} y={40} fill={C.purple} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">ST_MakePoint(...)</text>
            <text x={390} y={58} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">({POSTGIS_EXAMPLE.branchB.x}, {POSTGIS_EXAMPLE.branchB.y})</text>

            <line x1={494} y1={45} x2={550} y2={45} stroke={C.green} strokeWidth={3} strokeDasharray="6 4" opacity={0.7} />
            <polygon points="544,39 544,51 558,45" fill={C.green} />
            <text x={522} y={35} fill={C.green} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">ST_Distance</text>

            <rect x={560} y={20} width={240} height={50} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} rx={8} style={{filter: `drop-shadow(0 0 ${6 + pulse * 4}px ${C.green})`}} />
            <text x={680} y={40} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">{POSTGIS_EXAMPLE.distanceKm} km</text>
            <text x={680} y={58} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">GiST-accelerated · sub-ms</text>
          </g>

          <g style={{opacity: clamp(distReveal)}}>
            <text x={410} y={110} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">ORDER BY location &lt;-&gt; ST_MakePoint(...) → nearest branch in one indexed lookup</text>
          </g>
        </svg>

        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 8, height: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 12, fontWeight: 700, paddingTop: 4, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.blue}}>point A</span>
          <span style={{color: C.green}}>ST_Distance</span>
          <span style={{color: C.green}}>{POSTGIS_EXAMPLE.distanceKm} km ✓</span>
        </div>
      </Win>

      <Caption text="CREATE EXTENSION ──► % fuzzy ──► crypt() Blowfish ──► ST_MakePoint ──► ST_Distance ──► production-ready ✓" from={t(95)} to={sec(44)} tone="ok" />
    </Stage>
  );
};
