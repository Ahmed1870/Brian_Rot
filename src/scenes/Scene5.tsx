import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {ENTERPRISE_FTS_CODE, FTS_BENCHMARK} from '../data';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, lerp, pop, sec} from '../kit';

// SC05 (170-210s): Enterprise Product Search Engine — build search_vector + GIN index on store_products
// E-commerce catalog search processes multi-keyword queries in 0.5ms. Green "Enterprise Quality Seal".
// Anchors: 171.0 enterprise | 175.0 catalog | 180.0 search_vector | 185.0 GIN | 192.0 0.5ms | 200.0 seal | 205.0 production
const S = START.s5;
const t = (g: number) => sec(g - S);

interface CatalogRow {
  id: number;
  name: string;
  price: string;
  match: boolean;
}

const CATALOG: CatalogRow[] = [
  {id: 1, name: 'HDMI 2.1 Cable 4K', price: '$24.99', match: true},
  {id: 2, name: 'USB-C Fast Charger', price: '$39.99', match: true},
  {id: 3, name: 'Mechanical Keyboard RGB', price: '$89.99', match: true},
  {id: 4, name: 'Webcam HD Pro', price: '$59.99', match: true},
  {id: 5, name: 'Bluetooth Speaker', price: '$129.99', match: false},
];

export const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(171), 14));
  const entP = pop(f, t(171));
  const catP = pop(f, t(175));
  const vecP = pop(f, t(180));
  const ginP = pop(f, t(185));
  const fastP = pop(f, t(192));
  const sealP = pop(f, t(200));
  const prodP = pop(f, t(205));

  const pulse = 0.5 + 0.5 * Math.sin(f * 0.17);
  // Search query progress
  const searchProg = clamp(lin(f, t(180), sec(10)));
  // Result reveal
  const resultP = clamp(lin(f, t(188), sec(6)));

  return (
    <Stage dur={1200} inFx="morph" outFx="fade">
      <TopBadge text="محرك بحث المنتجات للمؤسسات | Enterprise Product Search Engine · search_vector + GIN (Module 15)" from={sec(2)} to={sec(38)} color={C.green} />

      {/* LEFT: Enterprise FTS code editor */}
      <div style={{opacity: editorP}}>
        <Editor
          x={80}
          y={170}
          w={860}
          h={380}
          title="enterprise_fts.sql · search_vector + GIN index on store_products"
          lines={ENTERPRISE_FTS_CODE}
          start={t(171)}
          cps={0.5}
          size={15}
          accent={C.green}
          hl={5}
          hlColor={C.green}
        />
      </div>

      {/* Query example editor */}
      <div style={{opacity: clamp(prodP)}}>
        <Editor
          x={80}
          y={570}
          w={860}
          h={200}
          title="search_query.sql · multi-keyword FTS lookup (0.5ms)"
          lines={[
            "SELECT product_id, product_name,",
            "  ts_rank(search_vector, q) AS rank,",
            "  ts_headline('english', description, q) AS snippet",
            "FROM store_products,",
            "  to_tsquery('english', 'hdmi & fast & 4k') q",
            "WHERE search_vector @@ q",
            "ORDER BY rank DESC;",
          ]}
          start={t(178)}
          cps={0.5}
          size={14}
          accent={C.amber}
          hl={4}
          hlColor={C.purple}
        />
      </div>

      {/* Concept chips below editor */}
      <div style={{position: 'absolute', left: 80, top: 790, width: 860, opacity: clamp(entP)}}>
        <div style={{display: 'flex', gap: 10, flexWrap: 'wrap'}}>
          <Chip color={C.green} style={{fontSize: 14, padding: '4px 12px'}}>GENERATED column</Chip>
          <Chip color={C.blue} style={{fontSize: 14, padding: '4px 12px'}}>auto-maintained</Chip>
          <Chip color={C.purple} style={{fontSize: 14, padding: '4px 12px'}}>GIN index</Chip>
          <Chip color={C.amber} style={{fontSize: 14, padding: '4px 12px'}}>@@ match</Chip>
          <Chip color={C.green} style={{fontSize: 14, padding: '4px 12px'}}>0.5ms ✓</Chip>
        </div>
      </div>

      {/* Enterprise Quality Seal */}
      <Win x={80} y={845} w={860} h={100} title="enterprise quality seal ──► production-ready FTS (green)" accent={C.green} opacity={clamp(sealP)}>
        <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, padding: '0 22px'}}>
          <Check p={sealP} size={56} color={C.green} />
          <div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 22, color: C.green, fontWeight: 700}}>Enterprise Quality Seal ✓</div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 13, color: C.muted, marginTop: 2}}>search_vector GENERATED · GIN indexed · sub-ms multi-keyword search · production-ready</div>
          </div>
        </div>
      </Win>

      {/* RIGHT: Enterprise catalog search visualization */}
      <Win x={960} y={170} w={880} h={780} title="enterprise catalog ──► multi-keyword FTS search (0.5ms) — production" accent={C.green} opacity={clamp(lin(f, t(175), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.green}}>
          user types 'hdmi fast 4k' ──► to_tsquery ──► @@ search_vector ──► ranked results · 0.5ms
        </div>

        <div style={{position: 'absolute', right: 18, top: 14, display: 'flex', gap: 10}}>
          <Chip color={C.amber} style={{fontSize: 13, padding: '4px 12px'}}>{searchProg > 0.05 && searchProg < 0.99 ? 'searching...' : 'idle'}</Chip>
          <Chip color={C.green} style={{fontSize: 13, padding: '4px 12px'}}>{resultP > 0.95 ? '0.5ms ✓' : '...'}</Chip>
        </div>

        <svg width={840} height={680} style={{position: 'absolute', left: 18, top: 60}}>
          {/* Search bar (top) */}
          <g style={{opacity: clamp(entP)}}>
            <rect x={40} y={20} width={760} height={60} fill={`${C.deep}cc`} stroke={C.amber} strokeWidth={3} rx={12} style={{filter: `drop-shadow(0 0 8px ${C.amber}66)`}} />
            <text x={70} y={50} fill={C.amber} fontSize={16} fontFamily={MONO} fontWeight={700}>🔍 search:</text>
            <text x={190} y={50} fill={C.text} fontSize={18} fontFamily={MONO} fontWeight={700}>{`'hdmi & fast & 4k'`}</text>
            <text x={700} y={50} fill={C.green} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">{searchProg < 0.99 ? `querying... ${Math.round(searchProg * 100)}%` : '✓ done'}</text>
          </g>

          {/* Pipeline: query → tsquery → @@ → GIN → results */}
          <g style={{opacity: clamp(catP)}}>
            {/* to_tsquery node */}
            <rect x={40} y={100} width={150} height={50} fill={`${C.purple}33`} stroke={C.purple} strokeWidth={2.5} rx={8} />
            <text x={115} y={124} fill={C.purple} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">to_tsquery()</text>
            <text x={115} y={140} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">boolean expr</text>

            <line x1={192} y1={125} x2={230} y2={125} stroke={C.amber} strokeWidth={3} strokeDasharray="6 4" opacity={0.8} />
            <polygon points="224,119 224,131 238,125" fill={C.amber} />
            <text x={210} y={115} fill={C.amber} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">@@</text>

            {/* search_vector node */}
            <rect x={240} y={100} width={170} height={50} fill={`${C.blue}33`} stroke={C.blue} strokeWidth={2.5} rx={8} />
            <text x={325} y={124} fill={C.blue} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">search_vector</text>
            <text x={325} y={140} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">GENERATED STORED</text>

            <line x1={412} y1={125} x2={450} y2={125} stroke={C.green} strokeWidth={3} strokeDasharray="6 4" opacity={0.8} />
            <polygon points="444,119 444,131 458,125" fill={C.green} />

            {/* GIN index node */}
            <rect x={460} y={100} width={150} height={50} fill={`${C.green}33`} stroke={C.green} strokeWidth={2.5} rx={8} style={{filter: `drop-shadow(0 0 ${6 + pulse * 6}px ${C.green})`}} />
            <text x={535} y={124} fill={C.green} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">GIN index</text>
            <text x={535} y={140} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">Bitmap Scan</text>

            <line x1={612} y1={125} x2={650} y2={125} stroke={C.green} strokeWidth={4} opacity={0.9} style={{filter: `drop-shadow(0 0 6px ${C.green})`}} />
            <polygon points="644,119 644,131 658,125" fill={C.green} />

            {/* Results node */}
            <rect x={660} y={100} width={140} height={50} fill={`${C.green}33`} stroke={C.green} strokeWidth={3} rx={8} style={{filter: `drop-shadow(0 0 ${8 + pulse * 6}px ${C.green})`}} />
            <text x={730} y={124} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">4 matches</text>
            <text x={730} y={140} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">0.5ms ✓</text>
          </g>

          {/* Catalog table (results) */}
          <g style={{opacity: clamp(catP)}}>
            {/* Header */}
            <rect x={40} y={180} width={760} height={36} fill={`${C.deep}cc`} stroke={C.border} strokeWidth={1.5} rx={6} />
            <text x={70} y={204} fill={C.muted} fontSize={11} fontFamily={MONO} fontWeight={700}>ID</text>
            <text x={120} y={204} fill={C.muted} fontSize={11} fontFamily={MONO} fontWeight={700}>PRODUCT NAME</text>
            <text x={540} y={204} fill={C.muted} fontSize={11} fontFamily={MONO} fontWeight={700}>PRICE</text>
            <text x={660} y={204} fill={C.muted} fontSize={11} fontFamily={MONO} fontWeight={700}>STATUS</text>
            <text x={780} y={204} fill={C.muted} fontSize={11} fontFamily={MONO} fontWeight={700}>RANK</text>
          </g>

          {/* Catalog rows */}
          {CATALOG.map((row, i) => {
            const rowP = clamp(resultP - i * 0.1);
            const rank = row.match ? (0.98 - i * 0.07).toFixed(2) : '0.00';
            return (
              <g key={i} style={{opacity: clamp(rowP), transform: `translate(${(1 - rowP) * 30}px, 0)`}}>
                <rect x={40} y={224 + i * 70} width={760} height={62} fill={row.match ? `${C.green}11` : `${C.deep}88`} stroke={row.match ? C.green : C.border} strokeWidth={1.5} rx={8} />

                <text x={70} y={252 + i * 70} fill={row.match ? C.green : C.muted} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">{row.id}</text>

                {/* Product name with highlight on matched keywords */}
                <text x={120} y={252 + i * 70} fill={C.text} fontSize={13} fontFamily={MONO} fontWeight={700}>
                  {row.name.split(' ').map((word, wIdx) => {
                    const isMatched = row.match && ['HDMI', '4K', 'Fast'].includes(word);
                    return isMatched ? `__${word}__` : word;
                  }).join(' ').split('__').map((part, pIdx) => {
                    const isHl = pIdx % 2 === 1;
                    return <tspan key={pIdx} fill={isHl ? C.amber : C.text} fontWeight={isHl ? 700 : 400}>{part}</tspan>;
                  })}
                </text>
                <text x={120} y={272 + i * 70} fill={C.muted} fontSize={10} fontFamily={MONO}>{`ts_headline: ...<b>${row.match ? 'hdmi' : ''}</b>...`}</text>

                <text x={540} y={258 + i * 70} fill={C.text} fontSize={13} fontFamily={MONO} fontWeight={700}>{row.price}</text>

                {/* Status pill */}
                <rect x={650} y={240 + i * 70} width={100} height={26} fill={row.match ? `${C.green}22` : `${C.red}22`} stroke={row.match ? C.green : C.red} strokeWidth={1.5} rx={13} />
                <text x={700} y={258 + i * 70} fill={row.match ? C.green : C.red} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">{row.match ? '✓ match' : '✗ no'}</text>

                {/* Rank bar */}
                <text x={780} y={258 + i * 70} fill={C.amber} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">{rank}</text>
              </g>
            );
          })}

          {/* Performance footer */}
          <g style={{opacity: clamp(fastP)}}>
            <rect x={40} y={600} width={760} height={60} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 12px ${C.green})`}} />
            <text x={420} y={628} fill={C.green} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ {FTS_BENCHMARK.ftsMs}ms · 4 of 5 products matched · multi-keyword boolean · GIN Bitmap Scan</text>
            <text x={420} y={648} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">{Math.round(FTS_BENCHMARK.likeMs / FTS_BENCHMARK.ftsMs)}× faster than LIKE · production-ready · scales to millions of rows</text>
          </g>
        </svg>

        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 36, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 13, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.purple}}>to_tsquery</span>
          <span style={{color: C.amber}}>@@ match</span>
          <span style={{color: C.green}}>0.5ms · production ✓</span>
        </div>
      </Win>

      <Caption text="search_vector ──► GIN index ──► to_tsquery ──► @@ match ──► ranked results ──► 0.5ms ──► Enterprise Seal ✓" from={t(180)} to={sec(40)} tone="ok" />
    </Stage>
  );
};
