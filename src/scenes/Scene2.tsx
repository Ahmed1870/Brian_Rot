import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {PGCRYPTO_EXAMPLE, POSTGIS_EXAMPLE, TRIGRAM_EXAMPLE} from '../data';
import {Caption, Check, Chip, Mix, Stage, TopBadge, Win, clamp, lin, lerp, pop, sec} from '../kit';

// SC02 (40-85s): Core Extensions Benchmark — three side-by-side capability channels
// pg_trgm trigram decomposition (blue) | pgcrypto Blowfish hashing (purple) | PostGIS spatial map (green)
// Anchors: 41.5 pg_trgm | 52 pgcrypto | 60 PostGIS | 68 distances | 75 seal
const S = START.s2;
const t = (g: number) => sec(g - S);

const TRIGRAMS = TRIGRAM_EXAMPLE.trigrams;

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const trgmP = pop(f, t(41.5));
  const cryptoP = pop(f, t(52));
  const gisP = pop(f, t(60));
  const distP = pop(f, t(68));
  const sealP = pop(f, t(75));

  const pulse = 0.5 + 0.5 * Math.sin(f * 0.17);
  // Trigram reveal progress
  const trgmReveal = clamp(lin(f, t(45), sec(8)));
  // Hash reveal
  const hashReveal = clamp(lin(f, t(55), sec(6)));
  // Distance progress (line drawing)
  const distProg = clamp(lin(f, t(68), sec(6)));

  // Coordinate transform for the spatial mini-map
  // branches at (31.2, 30.0) and (31.3, 30.1); map them into a 320x220 viewport
  // x in [31.15, 31.35] -> [40, 360]; y in [29.95, 30.15] -> [40, 260] (inverted)
  const toMapX = (lon: number) => 40 + ((lon - 31.15) / 0.20) * 320;
  const toMapY = (lat: number) => 260 - ((lat - 29.95) / 0.20) * 220;

  const ax = toMapX(POSTGIS_EXAMPLE.branchA.x);
  const ay = toMapY(POSTGIS_EXAMPLE.branchA.y);
  const bx = toMapX(POSTGIS_EXAMPLE.branchB.x);
  const by = toMapY(POSTGIS_EXAMPLE.branchB.y);
  const cx = toMapX(POSTGIS_EXAMPLE.customer.x);
  const cy = toMapY(POSTGIS_EXAMPLE.customer.y);

  return (
    <Stage dur={1350} inFx="left" outFx="left">
      <TopBadge text="الملحقات الثلاثة الرئيسية | pg_trgm (Trigram Fuzzy) · pgcrypto (Blowfish) · PostGIS (Spatial) — Module 15" from={sec(2)} to={sec(40)} color={C.blue} />

      {/* LEFT channel: pg_trgm trigram decomposition (blue) */}
      <Win x={80} y={170} w={580} h={660} title="pg_trgm ──► trigram fuzzy search (blue) ──► % similarity operator" accent={C.blue} opacity={clamp(lin(f, t(41), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 16, color: C.blue}}>
          text → trigrams (3-char groups) → GIN index → % fuzzy match
        </div>

        <div style={{position: 'absolute', right: 18, top: 14, display: 'flex', gap: 8}}>
          <Chip color={C.blue} style={{fontSize: 12, padding: '4px 10px'}}>{trgmReveal > 0.95 ? 'trigrams ✓' : '...'}</Chip>
        </div>

        <svg width={540} height={560} style={{position: 'absolute', left: 18, top: 60}}>
          {/* Source word */}
          <g style={{opacity: clamp(trgmP)}}>
            <rect x={120} y={20} width={300} height={50} fill={`${C.amber}22`} stroke={C.amber} strokeWidth={3} rx={10} />
            <text x={270} y={50} fill={C.amber} fontSize={16} fontFamily={MONO} fontWeight={700} textAnchor="middle">{`'${TRIGRAM_EXAMPLE.raw}'`}</text>
          </g>

          {/* Arrow down to trigram decomposition */}
          <g style={{opacity: clamp(trgmP)}}>
            <line x1={270} y1={72} x2={270} y2={100} stroke={C.blue} strokeWidth={3} strokeDasharray="6 4" opacity={0.7} />
            <polygon points="264,94 276,94 270,108" fill={C.blue} />
          </g>

          {/* Trigram box */}
          <g style={{opacity: clamp(trgmP)}}>
            <rect x={80} y={110} width={380} height={40} fill={`${C.blue}33`} stroke={C.blue} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 ${8 + pulse * 6}px ${C.blue})`}} />
            <text x={270} y={136} fill={C.blue} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">trigram decomposition</text>
          </g>

          {/* Trigram chips stream */}
          <g style={{opacity: clamp(trgmP)}}>
            {TRIGRAMS.map((tr, i) => {
              const p = clamp(trgmReveal - i * 0.06);
              const col = i % 3;
              const row = Math.floor(i / 3);
              const x = 80 + col * 130;
              const y = 170 + row * 50;
              return (
                <g key={i} style={{opacity: clamp(p), transform: `translate(${(1 - p) * 18}px, 0)`}}>
                  <rect x={x} y={y} width={120} height={36} fill={`${C.blue}22`} stroke={C.blue} strokeWidth={2} rx={6} style={{filter: `drop-shadow(0 0 4px ${C.blue}66)`}} />
                  <text x={x + 60} y={y + 23} fill={C.blue} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">{`'${tr}'`}</text>
                </g>
              );
            })}
          </g>

          {/* Fuzzy query % operator */}
          <g style={{opacity: clamp(pop(f, t(60)))}}>
            <rect x={80} y={310} width={380} height={50} fill={`${C.amber}22`} stroke={C.amber} strokeWidth={3} rx={10} />
            <text x={270} y={336} fill={C.amber} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">user types: {`'${TRIGRAM_EXAMPLE.fuzzyQuery}'`} (misspelled)</text>
            <text x={270} y={354} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">WHERE product_name % 'Manzoma'</text>
          </g>

          {/* Similarity result */}
          <g style={{opacity: clamp(pop(f, t(64)))}}>
            <line x1={270} y1={362} x2={270} y2={390} stroke={C.green} strokeWidth={3} strokeDasharray="6 4" opacity={0.7} />
            <polygon points="264,384 276,384 270,398" fill={C.green} />
            <rect x={80} y={400} width={380} height={80} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} rx={12} style={{filter: `drop-shadow(0 0 ${10 + pulse * 6}px ${C.green})`}} />
            <text x={270} y={432} fill={C.green} fontSize={20} fontFamily={MONO} fontWeight={700} textAnchor="middle">MATCH ✓</text>
            <text x={270} y={458} fill={C.text} fontSize={12} fontFamily={MONO} textAnchor="middle">similarity = {TRIGRAM_EXAMPLE.similarity.toFixed(3)} · sub-ms · GIN</text>
          </g>

          {/* Bottom note */}
          <text x={270} y={510} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">handles typos &amp; partial spelling</text>
          <text x={270} y={528} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">like '%manz%' won't catch 'Manzooma' but % will</text>
        </svg>

        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 12, fontWeight: 700, paddingTop: 4, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.blue}}>trigrams</span>
          <span style={{color: C.amber}}>{'% operator'}</span>
          <span style={{color: C.green}}>fuzzy ✓</span>
        </div>
      </Win>

      {/* MIDDLE channel: pgcrypto Blowfish hashing (purple) */}
      <Win x={680} y={170} w={560} h={660} title="pgcrypto ──► Blowfish password hashing (purple) ──► crypt() + gen_salt('bf')" accent={C.purple} opacity={clamp(lin(f, t(52), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 16, color: C.purple}}>
          plain password → gen_salt('bf') → crypt() → $2a$06$… hash (60 chars)
        </div>

        <div style={{position: 'absolute', right: 18, top: 14, display: 'flex', gap: 8}}>
          <Chip color={C.purple} style={{fontSize: 12, padding: '4px 10px'}}>{hashReveal > 0.95 ? 'hashed ✓' : '...'}</Chip>
        </div>

        <svg width={520} height={560} style={{position: 'absolute', left: 18, top: 60}}>
          {/* Plain password source */}
          <g style={{opacity: clamp(cryptoP)}}>
            <rect x={110} y={20} width={300} height={50} fill={`${C.amber}22`} stroke={C.amber} strokeWidth={3} rx={10} />
            <text x={260} y={50} fill={C.amber} fontSize={15} fontFamily={MONO} fontWeight={700} textAnchor="middle">{`'${PGCRYPTO_EXAMPLE.rawPassword}'`}</text>
            <text x={260} y={78} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">plain password (insecure)</text>
          </g>

          {/* Arrow into crypt() */}
          <g style={{opacity: clamp(cryptoP)}}>
            <line x1={260} y1={88} x2={260} y2={120} stroke={C.purple} strokeWidth={3} strokeDasharray="6 4" opacity={0.7} />
            <polygon points="254,114 266,114 260,128" fill={C.purple} />
          </g>

          {/* crypt() node */}
          <g style={{opacity: clamp(cryptoP)}}>
            <rect x={70} y={130} width={380} height={70} fill={`${C.purple}33`} stroke={C.purple} strokeWidth={3} rx={12} style={{filter: `drop-shadow(0 0 ${8 + pulse * 6}px ${C.purple})`}} />
            <text x={260} y={158} fill={C.purple} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">crypt(password, gen_salt('bf'))</text>
            <text x={260} y={180} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">Blowfish (bf) · 6 rounds · salt baked in</text>
          </g>

          {/* Hash output (long string) */}
          <g style={{opacity: clamp(pop(f, t(56)))}}>
            <line x1={260} y1={202} x2={260} y2={230} stroke={C.purple} strokeWidth={3} strokeDasharray="6 4" opacity={0.7} />
            <polygon points="254,224 266,224 260,238" fill={C.purple} />
            <rect x={40} y={240} width={440} height={100} fill={`${C.deep}cc`} stroke={C.purple} strokeWidth={3} rx={12} />
            <text x={260} y={262} fill={C.muted} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">password_hash (60 chars · never reversible)</text>
            <text x={260} y={296} fill={C.purple} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle" style={{filter: `drop-shadow(0 0 6px ${C.purple}88)`}}>${PGCRYPTO_EXAMPLE.salt}wH9QvKp3xZ8mJ2cT1nB5oO</text>
            <text x={260} y={320} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">prefix $2a$06$ = Blowfish · 6 rounds</text>
          </g>

          {/* Verification flow */}
          <g style={{opacity: clamp(pop(f, t(62)))}}>
            <rect x={40} y={370} width={440} height={130} fill={`${C.green}11`} stroke={C.green} strokeWidth={2.5} strokeDasharray="5 4" rx={10} />
            <text x={260} y={395} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">login verification</text>
            <text x={260} y={418} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">crypt(input, stored_hash) = stored_hash?</text>
            <text x={260} y={438} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">→ no need to decrypt (one-way hash)</text>
            <rect x={120} y={450} width={280} height={36} fill={`${C.green}22`} stroke={C.green} strokeWidth={2} rx={8} />
            <text x={260} y={472} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ password verified · secure</text>
          </g>

          {/* Bottom note */}
          <text x={260} y={525} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">also: pgp_sym_encrypt / digest() / hmac()</text>
        </svg>

        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 12, fontWeight: 700, paddingTop: 4, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.amber}}>plain</span>
          <span style={{color: C.purple}}>crypt() · bf</span>
          <span style={{color: C.green}}>hashed ✓</span>
        </div>
      </Win>

      {/* RIGHT channel: PostGIS spatial map (green) */}
      <Win x={1260} y={170} w={580} h={660} title="PostGIS ──► spatial distance (green) ──► ST_Distance &amp; ST_MakePoint" accent={C.green} opacity={clamp(lin(f, t(60), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 16, color: C.green}}>
          ST_MakePoint(lon, lat) → ST_Distance → real-world km between branches
        </div>

        <div style={{position: 'absolute', right: 18, top: 14, display: 'flex', gap: 8}}>
          <Chip color={C.green} style={{fontSize: 12, padding: '4px 10px'}}>{distP > 0.5 ? 'distance ✓' : '...'}</Chip>
        </div>

        <svg width={540} height={560} style={{position: 'absolute', left: 18, top: 60}}>
          {/* Spatial mini-map */}
          <g style={{opacity: clamp(gisP)}}>
            <rect x={30} y={20} width={360} height={260} fill={`${C.deep}cc`} stroke={C.green} strokeWidth={2.5} rx={10} />
            {/* Grid lines */}
            {[0, 1, 2, 3].map((i) => (
              <g key={i}>
                <line x1={30 + (i + 1) * 72} y1={20} x2={30 + (i + 1) * 72} y2={280} stroke={C.border} strokeWidth={1} opacity={0.4} />
                <line x1={30} y1={20 + (i + 1) * 52} x2={390} y2={20 + (i + 1) * 52} stroke={C.border} strokeWidth={1} opacity={0.4} />
              </g>
            ))}
            <text x={210} y={40} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">spatial map · lon/lat grid</text>

            {/* Branch A marker */}
            <g style={{opacity: clamp(pop(f, t(60)))}}>
              <circle cx={ax} cy={ay} r={12 + pulse * 4} fill={`${C.green}33`} stroke={C.green} strokeWidth={3} style={{filter: `drop-shadow(0 0 8px ${C.green})`}} />
              <circle cx={ax} cy={ay} r={6} fill={C.green} />
              <text x={ax} y={ay - 18} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">{POSTGIS_EXAMPLE.branchA.name}</text>
              <text x={ax} y={ay + 26} fill={C.muted} fontSize={9} fontFamily={MONO} textAnchor="middle">({POSTGIS_EXAMPLE.branchA.x}, {POSTGIS_EXAMPLE.branchA.y})</text>
            </g>

            {/* Customer marker (in between) */}
            <g style={{opacity: clamp(pop(f, t(64)))}}>
              <circle cx={cx} cy={cy} r={10 + pulse * 3} fill={`${C.amber}33`} stroke={C.amber} strokeWidth={3} style={{filter: `drop-shadow(0 0 6px ${C.amber})`}} />
              <circle cx={cx} cy={cy} r={5} fill={C.amber} />
              <text x={cx} y={cy - 16} fill={C.amber} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">Customer #4821</text>
            </g>

            {/* Branch B marker */}
            <g style={{opacity: clamp(pop(f, t(60)))}}>
              <circle cx={bx} cy={by} r={12 + pulse * 4} fill={`${C.green}33`} stroke={C.green} strokeWidth={3} style={{filter: `drop-shadow(0 0 8px ${C.green})`}} />
              <circle cx={bx} cy={by} r={6} fill={C.green} />
              <text x={bx} y={by - 18} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">{POSTGIS_EXAMPLE.branchB.name}</text>
              <text x={bx} y={by + 26} fill={C.muted} fontSize={9} fontFamily={MONO} textAnchor="middle">({POSTGIS_EXAMPLE.branchB.x}, {POSTGIS_EXAMPLE.branchB.y})</text>
            </g>

            {/* Distance line (animated draw) */}
            <g style={{opacity: clamp(distP)}}>
              <line x1={ax} y1={ay} x2={ax + (bx - ax) * distProg} y2={ay + (by - ay) * distProg} stroke={C.amber} strokeWidth={3} strokeDasharray="8 4" style={{filter: `drop-shadow(0 0 6px ${C.amber})`}} />
              {/* Distance label at midpoint */}
              <g style={{opacity: clamp(pop(f, t(72)))}}>
                <rect x={(ax + bx) / 2 - 60} y={(ay + by) / 2 - 24} width={120} height={32} fill={`${C.deep}cc`} stroke={C.amber} strokeWidth={2} rx={8} />
                <text x={(ax + bx) / 2} y={(ay + by) / 2 - 3} fill={C.amber} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">{POSTGIS_EXAMPLE.distanceKm} km</text>
              </g>
            </g>
          </g>

          {/* ST_Distance formula */}
          <g style={{opacity: clamp(distP)}}>
            <rect x={30} y={310} width={360} height={80} fill={`${C.green}22`} stroke={C.green} strokeWidth={2.5} rx={10} />
            <text x={210} y={335} fill={C.green} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">SELECT ST_Distance(</text>
            <text x={210} y={355} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">ST_MakePoint(31.2, 30.0),</text>
            <text x={210} y={372} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">ST_MakePoint(31.3, 30.1));</text>
          </g>

          {/* Result */}
          <g style={{opacity: clamp(pop(f, t(72)))}}>
            <rect x={30} y={410} width={360} height={50} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 ${8 + pulse * 6}px ${C.green})`}} />
            <text x={210} y={442} fill={C.green} fontSize={16} fontFamily={MONO} fontWeight={700} textAnchor="middle">= {POSTGIS_EXAMPLE.distanceKm} km ✓</text>
          </g>

          {/* Bottom note */}
          <text x={210} y={490} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">geometry + geography types · GiST-accelerated</text>
          <text x={210} y={508} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">ST_Within · ST_DWithin · ST_Intersects available</text>
          <text x={210} y={526} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">SRID-aware (4326 = WGS84 GPS)</text>
        </svg>

        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 12, fontWeight: 700, paddingTop: 4, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.green}}>ST_MakePoint</span>
          <span style={{color: C.amber}}>distance</span>
          <span style={{color: C.green}}>{POSTGIS_EXAMPLE.distanceKm} km ✓</span>
        </div>
      </Win>

      {/* Bottom seal bar across the three channels */}
      <div style={{position: 'absolute', left: 80, right: 80, top: 855, display: 'flex', justifyContent: 'center', opacity: clamp(sealP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 20, padding: '12px 28px', border: `3px solid ${C.green}`, borderRadius: 18, background: `${C.green}0d`, boxShadow: `0 0 28px ${C.green}44`}}>
          <Check p={sealP} size={44} color={C.green} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 22, color: C.green, fontWeight: 700}}>Three Extensions Architecture Seal ✓</div>
          <div style={{display: 'flex', gap: 10, marginLeft: 8}}>
            <Chip color={C.blue} style={{fontSize: 14, padding: '4px 12px'}}>trigram ✓</Chip>
            <Chip color={C.purple} style={{fontSize: 14, padding: '4px 12px'}}>blowfish ✓</Chip>
            <Chip color={C.green} style={{fontSize: 14, padding: '4px 12px'}}>spatial ✓</Chip>
          </div>
        </div>
      </div>

      <Caption text="pg_trgm ──► trigrams ──► %  ·  pgcrypto ──► crypt() ──► $2a$06$  ·  PostGIS ──► ST_Distance ──► km ✓" from={t(60)} to={sec(44)} tone="ok" />
    </Stage>
  );
};
