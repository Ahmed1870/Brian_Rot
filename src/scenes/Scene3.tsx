import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {REFRESH_COMMANDS} from '../data';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, lerp, pop, sec} from '../kit';

// SC03 (85-130s): REFRESH MATERIALIZED VIEW CONCURRENTLY — Non-Blocking Refresh with dual parallel streams
// Anchors: 86.0 REFRESH | 90.0 CONCURRENTLY | 95.0 UNIQUE index | 100.0 parallel | 110.0 non-blocking | 118.0 background | 125.0 seal
const S = START.s3;
const t = (g: number) => sec(g - S);

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(86.5), 14));
  const idxP = pop(f, t(95));
  // Parallel streams flow animation
  const parallelProg = clamp(lin(f, t(100), sec(8)));
  // Non-blocking flow: purple refresh stream + blue read stream run concurrently
  const refreshProg = clamp(lin(f, t(110), sec(8)));
  const readProg = clamp(lin(f, t(110), sec(8)));
  const bgP = pop(f, t(118));
  const sealP = pop(f, t(125));

  // Pulse for refresh stream
  const pulse = 0.5 + 0.5 * Math.sin(f * 0.18);

  return (
    <Stage dur={1350} inFx="left" outFx="up">
      <TopBadge text="REFRESH CONCURRENTLY و التحديث غير الحاجب | Non-Blocking Refresh (UNIQUE INDEX Required)" from={sec(2)} to={sec(40)} color={C.purple} />

      {/* LEFT: CREATE UNIQUE INDEX + REFRESH CONCURRENTLY editor */}
      <div style={{opacity: editorP}}>
        <Editor
          x={80}
          y={170}
          w={880}
          h={250}
          title="Query Editor · CREATE UNIQUE INDEX + REFRESH CONCURRENTLY"
          lines={REFRESH_COMMANDS.concat([
            '',
            '-- CONCURRENTLY: no read lock',
            '-- requires UNIQUE INDEX',
          ])}
          start={t(86.5)}
          cps={0.5}
          size={14}
          accent={C.purple}
          hl={1}
          hlColor={C.purple}
        />
      </div>

      {/* Concept chips below editor */}
      <div style={{position: 'absolute', left: 80, top: 440, width: 880, opacity: clamp(lin(f, t(95), 14))}}>
        <div dir="ltr" style={{fontFamily: MONO, fontSize: 16, color: C.muted, marginBottom: 8}}>◆ REFRESH CONCURRENTLY prerequisites:</div>
        <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
          <Chip color={C.amber} style={{fontSize: 14, padding: '4px 12px'}}>
            <Check p={idxP} size={16} color={C.amber} /> UNIQUE INDEX
          </Chip>
          <Chip color={C.purple} style={{fontSize: 14, padding: '4px 12px'}}>CONCURRENTLY ✓</Chip>
          <Chip color={C.blue} style={{fontSize: 14, padding: '4px 12px'}}>No Read Lock ✓</Chip>
          <Chip color={C.green} style={{fontSize: 14, padding: '4px 12px'}}>Parallel ✓</Chip>
          <Chip color={C.green} style={{fontSize: 14, padding: '4px 12px'}}>Non-Blocking ✓</Chip>
        </div>
      </div>

      {/* Non-Blocking Refresh badge */}
      <div style={{position: 'absolute', left: 80, top: 520, width: 880, opacity: clamp(pop(f, t(110)))}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '14px 22px', border: `3px solid ${C.green}`, borderRadius: 16, background: `${C.green}0d`, boxShadow: `0 0 24px ${C.green}33`}}>
          <Check p={sealP} size={44} color={C.green} />
          <div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 20, color: C.green, fontWeight: 700}}>Non-Blocking Refresh ✓</div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 13, color: C.muted, marginTop: 2}}>REFRESH CONCURRENTLY builds a new version in the background · readers keep querying the old version · zero lock</div>
          </div>
        </div>
      </div>

      {/* UNIQUE INDEX explanation panel */}
      <div style={{position: 'absolute', left: 80, top: 640, width: 880, opacity: clamp(lin(f, t(95), 14))}}>
        <div dir="ltr" style={{fontFamily: MONO, fontSize: 16, color: C.muted, marginBottom: 8}}>◆ Why UNIQUE INDEX is required:</div>
        <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
          <Chip color={C.amber} style={{fontSize: 13, padding: '4px 12px'}}>Diff old vs new</Chip>
          <Chip color={C.amber} style={{fontSize: 13, padding: '4px 12px'}}>Identify rows to update</Chip>
          <Chip color={C.amber} style={{fontSize: 13, padding: '4px 12px'}}>Without UNIQUE: full rebuild (lock)</Chip>
          <Chip color={C.green} style={{fontSize: 13, padding: '4px 12px'}}>With UNIQUE: incremental (no lock)</Chip>
        </div>
      </div>

      {/* Seal at bottom-left */}
      <div style={{position: 'absolute', left: 80, top: 780, width: 880, opacity: clamp(sealP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '12px 22px', border: `2px solid ${C.purple}`, borderRadius: 14, background: `${C.purple}0d`}}>
          <Check p={sealP} size={36} color={C.purple} />
          <div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.purple, fontWeight: 700}}>REFRESH CONCURRENTLY · Non-Blocking Seal ✓</div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 13, color: C.muted, marginTop: 2}}>UNIQUE INDEX enables incremental diff · readers never blocked · pg_cron can schedule</div>
          </div>
        </div>
      </div>

      {/* RIGHT: Dual parallel streams visualization */}
      <Win x={1000} y={170} w={840} h={720} title="dual parallel streams ──► purple refresh + blue read (non-blocking)" accent={C.purple} opacity={clamp(lin(f, t(100), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.purple}}>
          REFRESH CONCURRENTLY ──► background refresh (purple) + user reads (blue) run in parallel · no lock
        </div>

        <div style={{position: 'absolute', right: 18, top: 14, display: 'flex', gap: 10}}>
          <Chip color={C.purple} style={{fontSize: 13, padding: '4px 12px'}}>BG Refresh</Chip>
          <Chip color={C.blue} style={{fontSize: 13, padding: '4px 12px'}}>User Reads</Chip>
          <Chip color={C.green} style={{fontSize: 13, padding: '4px 12px'}}>{parallelProg > 0.95 ? 'Parallel ✓' : '...'}</Chip>
        </div>

        {/* SVG: dual parallel streams */}
        <svg width={800} height={600} style={{position: 'absolute', left: 20, top: 60}}>
          {/* REFRESH stream (top, purple) */}
          <g style={{opacity: clamp(pop(f, t(100)))}}>
            <rect x={20} y={20} width={760} height={220} fill={`${C.purple}11`} stroke={C.purple} strokeWidth={3} strokeDasharray="6 4" rx={12} style={{filter: `drop-shadow(0 0 ${8 + pulse * 8}px ${C.purple}44)`}} />
            <text x={400} y={48} fill={C.purple} fontSize={15} fontFamily={MONO} fontWeight={700} textAnchor="middle">▼ Background Refresh Stream (purple) ▼</text>

            {/* Refresh steps */}
            <rect x={40} y={66} width={150} height={50} fill={`${C.purple}22`} stroke={C.purple} strokeWidth={2} rx={8} />
            <text x={115} y={88} fill={C.purple} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">1. Build new ver</text>
            <text x={115} y={104} fill={C.muted} fontSize={9} fontFamily={MONO} textAnchor="middle">in background</text>

            <line x1={190} y1={91} x2={230} y2={91} stroke={C.purple} strokeWidth={2.5} strokeDasharray="6 4" opacity={0.4 + 0.6 * refreshProg} />
            <polygon points="224,86 224,96 236,91" fill={C.purple} />

            <rect x={235} y={66} width={150} height={50} fill={`${C.purple}22`} stroke={C.purple} strokeWidth={2} rx={8} />
            <text x={310} y={88} fill={C.purple} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">2. Diff vs old</text>
            <text x={310} y={104} fill={C.muted} fontSize={9} fontFamily={MONO} textAnchor="middle">via UNIQUE INDEX</text>

            <line x1={385} y1={91} x2={425} y2={91} stroke={C.purple} strokeWidth={2.5} strokeDasharray="6 4" opacity={0.4 + 0.6 * refreshProg} />
            <polygon points="419,86 419,96 431,91" fill={C.purple} />

            <rect x={430} y={66} width={150} height={50} fill={`${C.purple}22`} stroke={C.purple} strokeWidth={2} rx={8} />
            <text x={505} y={88} fill={C.purple} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">3. Apply delta</text>
            <text x={505} y={104} fill={C.muted} fontSize={9} fontFamily={MONO} textAnchor="middle">incremental</text>

            <line x1={580} y1={91} x2={620} y2={91} stroke={C.purple} strokeWidth={2.5} strokeDasharray="6 4" opacity={0.4 + 0.6 * refreshProg} />
            <polygon points="614,86 614,96 626,91" fill={C.purple} />

            <rect x={625} y={66} width={135} height={50} fill={`${C.purple}33`} stroke={C.purple} strokeWidth={3} rx={8} style={{filter: `drop-shadow(0 0 8px ${C.purple})`}} />
            <text x={692} y={88} fill={C.purple} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">4. Swap atomically</text>
            <text x={692} y={104} fill={C.muted} fontSize={9} fontFamily={MONO} textAnchor="middle">new version live</text>

            {/* Refresh progress bar */}
            <rect x={40} y={130} width={720} height={20} fill={C.deep} stroke={C.purple} strokeWidth={2} rx={10} />
            <rect x={42} y={132} width={716 * refreshProg} height={16} fill={C.purple} rx={8} style={{filter: `drop-shadow(0 0 6px ${C.purple}88)`}} />
            <text x={400} y={170} fill={C.purple} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">background refresh: {Math.round(refreshProg * 100)}%</text>
          </g>

          {/* READ stream (bottom, blue) — runs in parallel, never blocked */}
          <g style={{opacity: clamp(pop(f, t(100)))}}>
            <rect x={20} y={270} width={760} height={220} fill={`${C.blue}11`} stroke={C.blue} strokeWidth={3} strokeDasharray="6 4" rx={12} style={{filter: `drop-shadow(0 0 8px ${C.blue}44)`}} />
            <text x={400} y={298} fill={C.blue} fontSize={15} fontFamily={MONO} fontWeight={700} textAnchor="middle">▲ User Read Stream (blue) — never blocked ▲</text>

            {/* Read steps */}
            <rect x={40} y={316} width={150} height={50} fill={`${C.blue}22`} stroke={C.blue} strokeWidth={2} rx={8} />
            <text x={115} y={338} fill={C.blue} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">1. SELECT</text>
            <text x={115} y={354} fill={C.muted} fontSize={9} fontFamily={MONO} textAnchor="middle">from mv_sales</text>

            <line x1={190} y1={341} x2={230} y2={341} stroke={C.blue} strokeWidth={2.5} strokeDasharray="6 4" opacity={0.4 + 0.6 * readProg} />
            <polygon points="224,336 224,346 236,341" fill={C.blue} />

            <rect x={235} y={316} width={150} height={50} fill={`${C.blue}22`} stroke={C.blue} strokeWidth={2} rx={8} />
            <text x={310} y={338} fill={C.blue} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">2. Read old ver</text>
            <text x={310} y={354} fill={C.muted} fontSize={9} fontFamily={MONO} textAnchor="middle">still queryable</text>

            <line x1={385} y1={341} x2={425} y2={341} stroke={C.blue} strokeWidth={2.5} strokeDasharray="6 4" opacity={0.4 + 0.6 * readProg} />
            <polygon points="419,336 419,346 431,341" fill={C.blue} />

            <rect x={430} y={316} width={150} height={50} fill={`${C.blue}22`} stroke={C.blue} strokeWidth={2} rx={8} />
            <text x={505} y={338} fill={C.blue} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">3. Return rows</text>
            <text x={505} y={354} fill={C.muted} fontSize={9} fontFamily={MONO} textAnchor="middle">instant</text>

            <line x1={580} y1={341} x2={620} y2={341} stroke={C.blue} strokeWidth={2.5} strokeDasharray="6 4" opacity={0.4 + 0.6 * readProg} />
            <polygon points="614,336 614,346 626,341" fill={C.blue} />

            <rect x={625} y={316} width={135} height={50} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} rx={8} style={{filter: `drop-shadow(0 0 8px ${C.green})`}} />
            <text x={692} y={338} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">4. ✓ Success</text>
            <text x={692} y={354} fill={C.muted} fontSize={9} fontFamily={MONO} textAnchor="middle">no lock</text>

            {/* Read progress bar */}
            <rect x={40} y={380} width={720} height={20} fill={C.deep} stroke={C.blue} strokeWidth={2} rx={10} />
            <rect x={42} y={382} width={716 * readProg} height={16} fill={C.blue} rx={8} style={{filter: `drop-shadow(0 0 6px ${C.blue}88)`}} />
            <text x={400} y={420} fill={C.blue} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">user read: {Math.round(readProg * 100)}% · no lock ✓</text>
          </g>

          {/* Parallel indicator (center divider) */}
          <g style={{opacity: clamp(pop(f, t(110)))}}>
            <line x1={20} y1={250} x2={780} y2={250} stroke={C.amber} strokeWidth={2} strokeDasharray="4 4" opacity={0.5} />
            <rect x={320} y={238} width={160} height={26} fill={`${C.amber}22`} stroke={C.amber} strokeWidth={2} rx={13} />
            <text x={400} y={256} fill={C.amber} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">⇅ parallel · no lock</text>
          </g>

          {/* Non-blocking result banner */}
          {parallelProg > 0.95 ? (
            <g style={{opacity: clamp(pop(f, t(116)))}}>
              <rect x={120} y={520} width={560} height={44} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 10px ${C.green}66)`}} />
              <text x={400} y={548} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ Non-Blocking Refresh · readers never wait · UNIQUE INDEX enables concurrent rebuild</text>
            </g>
          ) : null}
        </svg>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 13, color: C.purple, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.purple}}>refresh (background)</span>
          <span style={{color: parallelProg >= 1 ? C.green : C.amber}}>{parallelProg >= 1 ? '✓ parallel · no lock' : parallelProg > 0 ? `running... ${Math.round(parallelProg * 100)}%` : 'idle'}</span>
          <span style={{color: C.blue}}>read (foreground)</span>
        </div>
      </Win>

      <Caption text="CREATE UNIQUE INDEX ──► REFRESH CONCURRENTLY ──► Parallel Streams ──► Non-Blocking Refresh ✓" from={t(110)} to={sec(44)} tone="ok" />
    </Stage>
  );
};
