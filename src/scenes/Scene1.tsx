import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, lerp, pop, sec} from '../kit';

// SC01 (0-40s): Materialized Views Concept — Transparent lens transforms into solid purple block on disk
// Anchors: 1.0 welcome | 5.0 materialized | 9.0 physical | 14.0 cache | 20.0 disk | 28.0 seal | 35.0 module 14
const S = START.s1;
const t = (g: number) => sec(g - S);

// Materialized block rows (pre-computed cache content)
const MV_ROWS = [
  {id: 101, region: 'Cairo', total: 4250},
  {id: 102, region: 'Giza', total: 3180},
  {id: 103, region: 'Alex', total: 2760},
  {id: 104, region: 'Suez', total: 1990},
];

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(1.5), 14));
  const matP = clamp(lin(f, t(5), 14));
  const physP = clamp(lin(f, t(9), 14));
  const cacheP = pop(f, t(14));
  // Clamp-down animation: transparent lens → solid purple block on disk
  const clampProg = clamp(lin(f, t(20), sec(8)));
  const diskP = pop(f, t(20));
  const sealP = pop(f, t(28));
  const modP = pop(f, t(35));

  // Lens-to-block interpolation: opacity (transparent→solid) and color shift
  const solidify = clampProg;
  // Speed ray expansion
  const rayLen = clampProg * 220;

  // Pulse
  const pulse = 0.5 + 0.5 * Math.sin(f * 0.15);

  return (
    <Stage dur={1200} inFx="zoom" outFx="left">
      <TopBadge text="العروض المجسدة | Materialized Views — CREATE MATERIALIZED VIEW &amp; Pre-Computed Cache (Module 14)" from={sec(2)} to={sec(18)} color={C.purple} />

      {/* LEFT: Code editor with CREATE MATERIALIZED VIEW query */}
      <div style={{opacity: editorP}}>
        <Editor
          x={80}
          y={170}
          w={680}
          h={300}
          title="Query Editor · CREATE MATERIALIZED VIEW writes a solid cache"
          lines={[
            'CREATE MATERIALIZED VIEW mv_sales AS',
            '  SELECT region, SUM(total_amount) AS total',
            '  FROM store_orders',
            '  GROUP BY region;',
            '',
            '-- writes real data to disk',
            '-- zero re-computation on read',
          ]}
          start={t(1.5)}
          cps={0.7}
          size={15}
          accent={C.purple}
          hl={0}
          hlColor={C.purple}
        />
      </div>

      {/* Concept chips below editor */}
      <div style={{position: 'absolute', left: 80, top: 490, width: 680, opacity: clamp(lin(f, t(5), 14))}}>
        <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.muted, marginBottom: 10}}>◆ Materialized view golden rule</div>
        <div style={{display: 'flex', gap: 10, flexWrap: 'wrap'}}>
          <Chip color={C.purple} style={{fontSize: 16, padding: '4px 14px'}}>CREATE MATERIALIZED VIEW</Chip>
          <Chip color={C.amber} style={{fontSize: 16, padding: '4px 14px'}}>On Disk ✓</Chip>
          <Chip color={C.green} style={{fontSize: 16, padding: '4px 14px'}}>Pre-Computed ✓</Chip>
          <Chip color={C.blue} style={{fontSize: 16, padding: '4px 14px'}}>Cache Layer ✓</Chip>
        </div>
      </div>

      {/* Module 14 Architecture badge panel */}
      <Win x={80} y={580} w={680} h={320} title="module 14 architecture ──► materialized optimization foundation" accent={C.green} opacity={clamp(lin(f, t(14), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.green}}>
          CREATE MATERIALIZED VIEW ──► solid purple block ──► physical disk ──► pre-computed cache
        </div>

        <div style={{position: 'absolute', right: 18, top: 14, display: 'flex', gap: 10}}>
          <Chip color={C.green} style={{fontSize: 13, padding: '4px 12px'}}>
            <Check p={modP} size={16} color={C.green} /> Module 14 Opt
          </Chip>
        </div>

        <svg width={640} height={220} style={{position: 'absolute', left: 20, top: 50}}>
          {/* Transparent virtual view (left, faded) */}
          <rect x={20} y={50} width={140} height={80} fill={`${C.blue}0d`} stroke={C.blue} strokeWidth={2} strokeDasharray="5 4" rx={8} />
          <text x={90} y={78} fill={C.blue} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">virtual view</text>
          <text x={90} y={98} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">re-computes</text>
          <text x={90} y={114} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">on every read</text>

          {/* Transform arrow */}
          <line x1={162} y1={90} x2={230} y2={90} stroke={C.purple} strokeWidth={3} strokeDasharray="6 4" />
          <polygon points="224,84 224,96 238,90" fill={C.purple} />
          <text x={196} y={80} fill={C.purple} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">CREATE MAT</text>

          {/* Solid purple block (center) */}
          <rect x={240} y={50} width={140} height={80} fill={`${C.purple}33`} stroke={C.purple} strokeWidth={3} rx={8} style={{filter: `drop-shadow(0 0 ${8 + pulse * 6}px ${C.purple})`}} />
          <text x={310} y={78} fill={C.purple} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">mv_sales</text>
          <text x={310} y={98} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">solid block</text>
          <text x={310} y={114} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">pre-computed</text>

          {/* Speed rays (green) */}
          <g style={{opacity: clamp(cacheP)}}>
            <line x1={380} y1={70} x2={380 + clampProg * 80} y2={70} stroke={C.green} strokeWidth={2.5} strokeDasharray="6 4" opacity={0.7} />
            <line x1={380} y1={90} x2={380 + clampProg * 100} y2={90} stroke={C.green} strokeWidth={2.5} strokeDasharray="6 4" opacity={0.9} />
            <line x1={380} y1={110} x2={380 + clampProg * 80} y2={110} stroke={C.green} strokeWidth={2.5} strokeDasharray="6 4" opacity={0.7} />
          </g>

          {/* Physical disk (right) */}
          <g style={{opacity: clamp(diskP)}}>
            <ellipse cx={560} cy={90} rx={50} ry={16} fill={`${C.amber}22`} stroke={C.amber} strokeWidth={2.5} />
            <path d="M 510 90 V 130 A 50 16 0 0 0 610 130 V 90" fill={`${C.amber}22`} stroke={C.amber} strokeWidth={2.5} />
            <ellipse cx={560} cy={105} rx={50} ry={16} fill="none" stroke={C.amber} strokeWidth={1.5} opacity={0.6} />
            <ellipse cx={560} cy={120} rx={50} ry={16} fill="none" stroke={C.amber} strokeWidth={1.5} opacity={0.4} />
            <text x={560} y={160} fill={C.amber} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">physical disk</text>
          </g>

          {/* Bottom caption */}
          <text x={310} y={200} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">pre-computed cache layer ✓</text>
        </svg>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 14, color: C.green, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span>transparent ──► solid</span>
          <span>disk ✓</span>
        </div>
      </Win>

      {/* RIGHT: Big visualization — transparent lens → solid purple block → clamps onto disk with green speed rays */}
      <Win x={800} y={170} w={1040} h={720} title="materialized view lens ──► solid purple block clamps onto physical disk" accent={C.purple} opacity={physP}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.purple}}>
          transparent virtual lens ──► CREATE MATERIALIZED VIEW ──► solid purple block ──► disk cache + speed rays
        </div>

        <div style={{position: 'absolute', right: 18, top: 14, display: 'flex', gap: 10}}>
          <Chip color={C.blue} style={{fontSize: 13, padding: '4px 12px'}}>Transparent Lens</Chip>
          <Chip color={C.purple} style={{fontSize: 13, padding: '4px 12px'}}>{clampProg > 0.05 ? 'Solidifying...' : 'idle'}</Chip>
          <Chip color={C.green} style={{fontSize: 13, padding: '4px 12px'}}>{clampProg > 0.95 ? 'On Disk ✓' : '...'}</Chip>
        </div>

        <svg width={1000} height={600} style={{position: 'absolute', left: 20, top: 60}}>
          {/* Transparent virtual view lens (left) - fades as block solidifies */}
          <g style={{opacity: clamp(1 - solidify * 0.85)}}>
            <ellipse cx={180} cy={300} rx={110} ry={80} fill={`${C.blue}11`} stroke={C.blue} strokeWidth={3} strokeDasharray="8 6" style={{filter: `drop-shadow(0 0 ${10 + pulse * 6}px ${C.blue}66)`}} />
            <text x={180} y={295} fill={C.blue} fontSize={16} fontFamily={MONO} fontWeight={700} textAnchor="middle">Virtual View</text>
            <text x={180} y={316} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">re-computes on every read</text>
            <text x={180} y={336} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">zero disk storage</text>
          </g>

          {/* Transformation arrows: lens → block */}
          <g style={{opacity: clamp(pop(f, t(9)))}}>
            <line x1={300} y1={300} x2={430} y2={300} stroke={C.purple} strokeWidth={4} strokeDasharray="8 4" opacity={0.4 + 0.6 * solidify} />
            <polygon points="424,294 424,306 438,300" fill={C.purple} />
            <text x={365} y={288} fill={C.purple} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">CREATE MAT VIEW ──►</text>
            <text x={365} y={326} fill={C.amber} fontSize={10} fontFamily={MONO} textAnchor="middle">solidify · clamp onto disk</text>
          </g>

          {/* Solid purple materialized block (center) - grows solid as clampProg progresses */}
          <g style={{opacity: clamp(pop(f, t(9)))}}>
            <rect x={450} y={180} width={280} height={240} fill={`${C.purple}${solidify > 0.5 ? '44' : '11'}`} stroke={C.purple} strokeWidth={4} rx={16} style={{filter: `drop-shadow(0 0 ${10 + solidify * 14}px ${C.purple})`}} />
            <text x={590} y={210} fill={C.purple} fontSize={15} fontFamily={MONO} fontWeight={700} textAnchor="middle">mv_sales</text>
            <text x={590} y={230} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">solid materialized block</text>
            {/* Block rows (pre-computed cache content) */}
            {MV_ROWS.map((row, i) => {
              const rowP = clamp((solidify - i * 0.1) * 1.5);
              return (
                <g key={i} style={{opacity: clamp(rowP)}}>
                  <rect x={470} y={250 + i * 32} width={240} height={28} fill={`${C.purple}22`} stroke={C.purple} strokeWidth={1} rx={4} />
                  <text x={486} y={268 + i * 32} fill={C.text} fontSize={11} fontFamily={MONO}>{row.id}</text>
                  <text x={540} y={268 + i * 32} fill={C.text} fontSize={11} fontFamily={MONO}>{row.region}</text>
                  <text x={660} y={268 + i * 32} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700}>{row.total}</text>
                </g>
              );
            })}
            <text x={590} y={430} fill={C.purple} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">pre-computed · cached</text>
          </g>

          {/* Green speed rays bursting from block */}
          <g style={{opacity: clamp(pop(f, t(20)))}}>
            {[80, 100, 120, 280, 300, 320, 480, 500, 520].map((angleOff, i) => {
              const baseY = 200 + i * 4;
              const len = rayLen * (0.6 + (i % 3) * 0.18);
              return (
                <line
                  key={i}
                  x1={730}
                  y1={200 + i * 32}
                  x2={730 + len}
                  y2={200 + i * 32}
                  stroke={C.green}
                  strokeWidth={2.5}
                  strokeDasharray="8 5"
                  opacity={0.4 + 0.5 * clampProg}
                  style={{filter: `drop-shadow(0 0 4px ${C.green}88)`}}
                />
              );
            })}
            <text x={820} y={150} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">⚡ Pre-Computed Cache Layer</text>
          </g>

          {/* Physical disk (right) - block clamps down onto it */}
          <g style={{opacity: clamp(diskP)}}>
            <ellipse cx={910} cy={300} rx={70} ry={22} fill={`${C.amber}22`} stroke={C.amber} strokeWidth={3} />
            <path d="M 840 300 V 380 A 70 22 0 0 0 980 380 V 300" fill={`${C.amber}22`} stroke={C.amber} strokeWidth={3} />
            <ellipse cx={910} cy={325} rx={70} ry={22} fill="none" stroke={C.amber} strokeWidth={2} opacity={0.6} />
            <ellipse cx={910} cy={350} rx={70} ry={22} fill="none" stroke={C.amber} strokeWidth={2} opacity={0.4} />
            <text x={910} y={300} fill={C.amber} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">physical disk</text>
            <text x={910} y={320} fill={C.amber} fontSize={10} fontFamily={MONO} textAnchor="middle">Heap Files</text>
            {/* Clamp indicator */}
            <text x={910} y={420} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">{clampProg > 0.95 ? '✓ block cached on disk' : `clamping... ${Math.round(clampProg * 100)}%`}</text>
          </g>

          {/* Clamp-down beam from block to disk */}
          <g style={{opacity: clamp(pop(f, t(20)))}}>
            <line x1={730} y1={300} x2={840} y2={300} stroke={C.green} strokeWidth={4} strokeDasharray="6 4" opacity={0.4 + 0.6 * clampProg} />
            <polygon points="834,294 834,306 848,300" fill={C.green} />
            <text x={785} y={290} fill={C.green} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">clamp ──►</text>
          </g>

          {/* Cache layer banner */}
          {clampProg > 0.95 ? (
            <g style={{opacity: clamp(pop(f, t(26)))}}>
              <rect x={250} y={500} width={500} height={50} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 12px ${C.green})`}} />
              <text x={500} y={532} fill={C.green} fontSize={15} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ Materialized Block Cached on Disk · Pre-Computed · Zero Re-Computation</text>
            </g>
          ) : null}

          {/* Status text */}
          <text x={500} y={580} fill={C.muted} fontSize={13} fontFamily={MONO} textAnchor="middle">
            {clampProg < 0.3 ? 'transparent lens ready...' : clampProg < 0.9 ? 'purple block solidifying · clamping to disk...' : 'materialized view on disk ✓ · pre-computed cache'}
          </text>
        </svg>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 16, fontWeight: 700, paddingTop: 8, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.blue}}>Transparent · virtual</span>
          <span style={{color: clampProg >= 1 ? C.green : C.amber, opacity: clamp(pop(f, t(20)))}}>
            {clampProg >= 1 ? '✓ on disk · cached' : clampProg > 0 ? `solidifying... ${Math.round(clampProg * 100)}%` : 'idle'}
          </span>
          <span style={{color: C.green}}>Solid · on disk</span>
        </div>
      </Win>

      {/* Seal badge bottom-left */}
      <div style={{position: 'absolute', left: 80, top: 920, opacity: clamp(sealP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 22px', border: `2px solid ${C.green}`, borderRadius: 14, background: `${C.green}0d`}}>
          <Check p={sealP} size={36} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700}}>Materialized Block · Sealed ✓</div>
        </div>
      </div>

      {/* Module 14 Materialized Optimization chip bottom-right */}
      <div style={{position: 'absolute', right: 80, top: 920, opacity: clamp(modP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 22px', border: `2px solid ${C.green}`, borderRadius: 14, background: `${C.green}0d`}}>
          <Check p={modP} size={36} color={C.green} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700}}>Module 14 Materialized Optimization ✓</div>
        </div>
      </div>

      <Caption text="CREATE MATERIALIZED VIEW ──► Solid Purple Block ──► Disk Cache ──► Pre-Computed ──► Module 14 Opt" from={t(20)} to={sec(38)} tone="ok" />
    </Stage>
  );
};
