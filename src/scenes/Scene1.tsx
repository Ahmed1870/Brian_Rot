import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, lerp, pop, sec} from '../kit';

// SC01 (0-40s): Extension Architecture &amp; C-Library Injection
// PG16 Kernel in center; three purple capsules (pg_trgm, pgcrypto, PostGIS) inject via CREATE EXTENSION
// Green badge: "Module 15 Completion &amp; Extensions Engine" illuminates
// Anchors (in scene-local seconds):
//   1.0 welcome | 6.0 PostgreSQL Extensions | 18.0 القطاعات | 28.0 seal | 35.0 engine
const S = START.s1;
const t = (g: number) => sec(g - S);

const CAPSULES = [
  {name: 'pg_trgm', color: C.blue, role: 'Fuzzy Search %', x: 220},
  {name: 'pgcrypto', color: C.purple, role: 'crypt() Blowfish', x: 540},
  {name: 'PostGIS', color: C.green, role: 'ST_Distance', x: 860},
];

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(1.5), 14));
  const extP = pop(f, t(6));
  const sealP = pop(f, t(28));
  const engP = pop(f, t(35));

  // Pulse for the kernel glow
  const pulse = 0.5 + 0.5 * Math.sin(f * 0.18);
  // Capsule injection progress: each capsule moves from off-screen to center
  // capsule i injects at t(6 + i*1.2)
  const inject = (i: number) => clamp(lin(f, t(6 + i * 1.2), sec(2.4)));

  return (
    <Stage dur={1200} inFx="zoom" outFx="left">
      <TopBadge text="إدارة الامتدادات المتقدمة | PostgreSQL Extensions: PostGIS, pg_trgm &amp; pgcrypto (Module 15)" from={sec(2)} to={sec(18)} color={C.green} />

      {/* LEFT: Code editor — CREATE EXTENSION statements */}
      <div style={{opacity: editorP}}>
        <Editor
          x={80}
          y={170}
          w={680}
          h={300}
          title="Query Editor · CREATE EXTENSION (PostgreSQL 16)"
          lines={[
            '-- 1. Enable trigram fuzzy search',
            'CREATE EXTENSION IF NOT EXISTS pg_trgm;',
            '',
            '-- 2. Enable Blowfish password hashing',
            'CREATE EXTENSION IF NOT EXISTS pgcrypto;',
            '',
            '-- 3. Enable spatial GIS engine',
            'CREATE EXTENSION IF NOT EXISTS postgis;',
            '',
            '-- 4. Inspect installed extensions',
            'SELECT * FROM pg_extension;',
          ]}
          start={t(1.5)}
          cps={0.55}
          size={15}
          accent={C.green}
          hl={1}
          hlColor={C.blue}
        />
      </div>

      {/* Concept chips below editor */}
      <div style={{position: 'absolute', left: 80, top: 490, width: 680, opacity: clamp(lin(f, t(5), 14))}}>
        <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.muted, marginBottom: 10}}>◆ PostgreSQL Extension golden rule</div>
        <div style={{display: 'flex', gap: 10, flexWrap: 'wrap'}}>
          <Chip color={C.blue} style={{fontSize: 16, padding: '4px 14px'}}>pg_trgm</Chip>
          <Chip color={C.purple} style={{fontSize: 16, padding: '4px 14px'}}>pgcrypto</Chip>
          <Chip color={C.green} style={{fontSize: 16, padding: '4px 14px'}}>PostGIS</Chip>
          <Chip color={C.amber} style={{fontSize: 16, padding: '4px 14px'}}>CREATE EXTENSION</Chip>
          <Chip color={C.green} style={{fontSize: 16, padding: '4px 14px'}}>pg_extension ✓</Chip>
        </div>
      </div>

      {/* Module 15 Completion &amp; Extensions Engine badge panel */}
      <Win x={80} y={570} w={680} h={330} title="module 15 architecture ──► extension engine (C-library injection seal)" accent={C.green} opacity={clamp(lin(f, t(9), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.green}}>
          raw C-libraries (.so / .dll) ──► CREATE EXTENSION ──► pg_extension catalog ──► live in engine
        </div>

        <div style={{position: 'absolute', right: 18, top: 14, display: 'flex', gap: 10}}>
          <Chip color={C.green} style={{fontSize: 13, padding: '4px 12px'}}>
            <Check p={engP} size={16} color={C.green} /> Extensions Engine
          </Chip>
        </div>

        <svg width={640} height={220} style={{position: 'absolute', left: 20, top: 50}}>
          {/* C-library sources (left) */}
          <g style={{opacity: clamp(pop(f, t(9)))}}>
            <rect x={20} y={40} width={150} height={80} fill={`${C.amber}11`} stroke={C.amber} strokeWidth={2} strokeDasharray="5 4" rx={8} />
            <text x={95} y={68} fill={C.amber} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">shared C-lib</text>
            <text x={95} y={86} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">pg_trgm.so</text>
            <text x={95} y={102} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">pgcrypto.so</text>
            <text x={95} y={118} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">postgis-3.so</text>
          </g>

          {/* Arrow into CREATE EXTENSION */}
          <g style={{opacity: clamp(pop(f, t(14)))}}>
            <line x1={172} y1={80} x2={230} y2={80} stroke={C.amber} strokeWidth={3} strokeDasharray="6 4" opacity={0.7} />
            <polygon points="224,74 224,86 238,80" fill={C.amber} />
            <text x={200} y={70} fill={C.amber} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">CREATE EXT</text>
          </g>

          {/* CREATE EXTENSION box (center) */}
          <g style={{opacity: clamp(pop(f, t(14)))}}>
            <rect x={240} y={40} width={170} height={80} fill={`${C.blue}33`} stroke={C.blue} strokeWidth={3} rx={8} style={{filter: `drop-shadow(0 0 ${8 + pulse * 6}px ${C.blue})`}} />
            <text x={325} y={68} fill={C.blue} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">CREATE EXTENSION</text>
            <text x={325} y={88} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">loads C-binary</text>
            <text x={325} y={104} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">into engine memory</text>
          </g>

          {/* Arrow to pg_extension catalog */}
          <g style={{opacity: clamp(pop(f, t(20)))}}>
            <line x1={412} y1={80} x2={470} y2={80} stroke={C.green} strokeWidth={3} strokeDasharray="6 4" opacity={0.7} />
            <polygon points="464,74 464,86 478,80" fill={C.green} />
            <text x={442} y={70} fill={C.green} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">register</text>
          </g>

          {/* pg_extension catalog (right) */}
          <g style={{opacity: clamp(pop(f, t(20)))}}>
            <rect x={480} y={40} width={140} height={80} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} rx={8} />
            <text x={550} y={68} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">pg_extension</text>
            <text x={550} y={86} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">extname · version</text>
            <text x={550} y={102} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">3 extensions live</text>
          </g>

          {/* Bottom status row */}
          <g style={{opacity: clamp(sealP)}}>
            <text x={325} y={170} fill={C.red} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">✗ before: vanilla PG (no fuzzy / no crypto / no GIS)</text>
            <text x={325} y={195} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ after: 3 advanced capabilities injected · Module 15 sealed</text>
          </g>
        </svg>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 14, color: C.green, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span>.so ──► CREATE EXTENSION</span>
          <span>pg_extension ✓</span>
        </div>
      </Win>

      {/* RIGHT: Big visualization — three capsules injecting into PG16 kernel */}
      <Win x={800} y={170} w={1040} h={720} title="extension architecture ──► 3 capsules inject into PostgreSQL 16 Kernel via CREATE EXTENSION" accent={C.green} opacity={clamp(lin(f, t(6), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.green}}>
          CREATE EXTENSION ──► dynamically injects advanced C-libraries into PostgreSQL 16 Kernel (purple capsules → green engine)
        </div>

        <div style={{position: 'absolute', right: 18, top: 14, display: 'flex', gap: 10}}>
          <Chip color={C.purple} style={{fontSize: 13, padding: '4px 12px'}}>3 capsules</Chip>
          <Chip color={C.amber} style={{fontSize: 13, padding: '4px 12px'}}>{f >= t(6) && f < t(28) ? 'injecting...' : 'idle'}</Chip>
          <Chip color={C.green} style={{fontSize: 13, padding: '4px 12px'}}>{engP > 0.5 ? 'Engine ✓' : '...'}</Chip>
        </div>

        <svg width={1000} height={600} style={{position: 'absolute', left: 20, top: 60}}>
          {/* PostgreSQL 16 Kernel (center) */}
          <g style={{opacity: clamp(pop(f, t(1.5)))}}>
            <ellipse cx={500} cy={300} rx={140 + pulse * 12} ry={140 + pulse * 12} fill={`${C.green}11`} stroke={C.green} strokeWidth={3} strokeDasharray="8 6" opacity={0.4} />
            <rect x={400} y={240} width={200} height={120} fill={`${C.deep}cc`} stroke={C.green} strokeWidth={4} rx={18} style={{filter: `drop-shadow(0 0 ${12 + pulse * 10}px ${C.green})`}} />
            <text x={500} y={290} fill={C.green} fontSize={18} fontFamily={MONO} fontWeight={700} textAnchor="middle">PostgreSQL 16</text>
            <text x={500} y={312} fill={C.text} fontSize={13} fontFamily={MONO} textAnchor="middle">Kernel</text>
            <text x={500} y={332} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">Query Engine · Catalog · Memory</text>
            <text x={500} y={350} fill={C.muted} fontSize={9} fontFamily={MONO} textAnchor="middle">manzooma_store_db</text>
          </g>

          {/* Three capsules that inject into the kernel */}
          {CAPSULES.map((cap, i) => {
            const p = inject(i);
            const fromX = cap.x;
            const fromY = 30;
            const toX = 500;
            const toY = 280;
            // Capsule travels from (fromX, fromY) to (toX + offset, toY)
            const cx = lerp(fromX, toX, p);
            const cy = lerp(fromY, toY + (i - 1) * 36, p);
            const opacity = p > 0.05 && p < 0.95 ? 1 : p >= 0.95 ? 0.4 : 1;
            return (
              <g key={i} style={{opacity}}>
                {/* Trail line from start to capsule */}
                {p > 0.05 && p < 0.95 ? (
                  <line x1={fromX} y1={fromY + 16} x2={cx} y2={cy} stroke={cap.color} strokeWidth={2} strokeDasharray="4 4" opacity={0.4} />
                ) : null}

                {/* Capsule */}
                <rect x={cx - 60} y={cy - 16} width={120} height={32} fill={`${cap.color}33`} stroke={cap.color} strokeWidth={2.5} rx={16} style={{filter: p < 0.99 ? `drop-shadow(0 0 8px ${cap.color})` : 'none'}} />
                <text x={cx} y={cy + 5} fill={cap.color} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">{cap.name}</text>

                {/* Source label (at origin) */}
                {p < 0.95 ? (
                  <g>
                    <text x={fromX} y={fromY + 4} fill={cap.color} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">{cap.role}</text>
                  </g>
                ) : null}

                {/* Embedded marker inside kernel (after injection complete) */}
                {p >= 0.95 ? (
                  <g style={{opacity: clamp(pop(f, t(8 + i * 1.2)))}}>
                    <rect x={420 + i * 60} y={358} width={56} height={20} fill={`${cap.color}22`} stroke={cap.color} strokeWidth={1.5} rx={4} />
                    <text x={448 + i * 60} y={372} fill={cap.color} fontSize={9} fontFamily={MONO} fontWeight={700} textAnchor="middle">{cap.name}</text>
                  </g>
                ) : null}
              </g>
            );
          })}

          {/* CREATE EXTENSION label above kernel */}
          <g style={{opacity: clamp(pop(f, t(8)))}}>
            <rect x={400} y={200} width={200} height={32} fill={`${C.amber}33`} stroke={C.amber} strokeWidth={2.5} rx={8} style={{filter: `drop-shadow(0 0 8px ${C.amber})`}} />
            <text x={500} y={222} fill={C.amber} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">CREATE EXTENSION</text>
          </g>

          {/* Module 15 Completion badge below kernel */}
          <g style={{opacity: clamp(sealP)}}>
            <rect x={250} y={430} width={500} height={60} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} rx={14} style={{filter: `drop-shadow(0 0 ${12 + pulse * 8}px ${C.green})`}} />
            <text x={500} y={458} fill={C.green} fontSize={16} fontFamily={MONO} fontWeight={700} textAnchor="middle">Module 15 Completion &amp; Extensions Engine</text>
            <text x={500} y={478} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">pg_trgm + pgcrypto + PostGIS injected · production-ready</text>
          </g>

          {/* Status text */}
          <text x={500} y={540} fill={C.muted} fontSize={12} fontFamily={MONO} textAnchor="middle">
            {f < t(6) ? 'vanilla PostgreSQL 16 (no extensions yet)' :
              f < t(28) ? 'injecting C-libraries into kernel memory...' :
              '✓ 3 extensions live in pg_extension catalog · Module 15 sealed'}
          </text>
        </svg>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 16, fontWeight: 700, paddingTop: 8, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.purple}}>3 capsules</span>
          <span style={{color: C.amber}}>CREATE EXTENSION</span>
          <span style={{color: C.green}}>Module 15 · Extensions Engine ✓</span>
        </div>
      </Win>

      {/* Seal badge bottom-left */}
      <div style={{position: 'absolute', left: 80, top: 920, opacity: clamp(sealP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 22px', border: `2px solid ${C.green}`, borderRadius: 14, background: `${C.green}0d`}}>
          <Check p={sealP} size={36} color={C.green} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700}}>Extension Architecture · Sealed ✓</div>
        </div>
      </div>

      {/* Engine chip bottom-right */}
      <div style={{position: 'absolute', right: 80, top: 920, opacity: clamp(engP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 22px', border: `2px solid ${C.blue}`, borderRadius: 14, background: `${C.blue}0d`}}>
          <Check p={engP} size={36} color={C.blue} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.blue, fontWeight: 700}}>Extensions Engine · Activated ✓</div>
        </div>
      </div>

      <Caption text="CREATE EXTENSION ──► .so libraries ──► pg_extension ──► kernel injection ──► Module 15 ✓" from={t(20)} to={sec(38)} tone="ok" />
    </Stage>
  );
};
