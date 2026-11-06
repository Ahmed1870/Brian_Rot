import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {WAL_ENTRIES} from '../data';
import {Caption, Check, Chip, Mix, Stage, TopBadge, Win, clamp, lin, lerp, pop, sec} from '../kit';

// SC04 (130-170s): XID & WAL — Transaction ID + Write-Ahead Log
// Anchors: 131.0 XID | 136.0 unique | 140.0 WAL | 145.0 write-ahead | 150.0 crash | 155.0 durability | 160.0 seal | 165.0 fast
const S = START.s4;
const t = (g: number) => sec(g - S);

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const xidP = clamp(lin(f, t(131.5), 14));
  const uniqueP = clamp(lin(f, t(136), 14));
  const walP = clamp(lin(f, t(140), 14));
  const writeAheadP = clamp(lin(f, t(145), 14));
  const crashP = pop(f, t(150));
  const durP = pop(f, t(155));
  const sealP = pop(f, t(160));
  const fastP = pop(f, t(165));

  // WAL stream flow animation - entries flowing through the stream
  const flowProg = clamp(lin(f, t(140), sec(20)));
  // Disk write flush animation
  const flushProg = clamp(lin(f, t(155), sec(8)));

  return (
    <Stage dur={1200} inFx="zoom" outFx="morph">
      <TopBadge text="XID و WAL | Transaction ID & Write-Ahead Log — Crash-Proof Durability" from={sec(2)} to={sec(40)} color={C.purple} />

      {/* LEFT: PostgreSQL 16 engine + XID capsule assignment */}
      <Win x={80} y={180} w={860} h={360} title="PostgreSQL 16 engine ──► XID assignment" accent={C.purple} opacity={xidP}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.purple}}>
          every transaction gets a unique XID ──► identity capsule
        </div>

        <div style={{position: 'absolute', right: 18, top: 14}}>
          <Chip color={C.purple} style={{fontSize: 13, padding: '4px 12px'}}>PostgreSQL 16</Chip>
        </div>

        <svg width={820} height={280} style={{position: 'absolute', left: 20, top: 60}}>
          {/* PostgreSQL engine block */}
          <rect x={20} y={60} width={200} height={120} fill={`${C.blue}22`} stroke={C.blue} strokeWidth={3} rx={14} style={{filter: `drop-shadow(0 0 12px ${C.blue}55)`}} />
          <text x={120} y={100} fill={C.blue} fontSize={16} fontFamily={MONO} fontWeight={700} textAnchor="middle">PostgreSQL 16</text>
          <text x={120} y={120} fill={C.muted} fontSize={12} fontFamily={MONO} textAnchor="middle">TX Manager</text>
          <text x={120} y={142} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">pg_xact · pg_mvcc</text>
          <text x={120} y={160} fill={C.green} fontSize={11} fontFamily={MONO} textAnchor="middle">assigning XID...</text>

          {/* Arrow from engine to XID capsule */}
          <line x1={220} y1={120} x2={300} y2={120} stroke={C.purple} strokeWidth={4} strokeDasharray="8 4" />
          <polygon points="294,114 294,126 308,120" fill={C.purple} />
          <text x={260} y={110} fill={C.purple} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">assigns</text>

          {/* XID capsule (purple, large) */}
          <rect
            x={310}
            y={70}
            width={490}
            height={100}
            fill={`${C.purple}22`}
            stroke={C.purple}
            strokeWidth={4}
            rx={50}
            style={{filter: `drop-shadow(0 0 18px ${C.purple}66)`, opacity: clamp(uniqueP)}}
          />
          <text x={555} y={110} fill={C.purple} fontSize={28} fontFamily={MONO} fontWeight={700} textAnchor="middle">XID: 804921</text>
          <text x={555} y={140} fill={C.muted} fontSize={13} fontFamily={MONO} textAnchor="middle">unique transaction identifier · monotonically increasing</text>
          <text x={555} y={158} fill={C.green} fontSize={11} fontFamily={MONO} textAnchor="middle">✓ globally unique · never reused</text>

          {/* XID properties */}
          <text x={120} y={210} fill={C.muted} fontSize={12} fontFamily={MONO} textAnchor="middle">every BEGIN ──► new XID allocated</text>
          <text x={555} y={210} fill={C.purple} fontSize={12} fontFamily={MONO} textAnchor="middle">XID ──► MVCC visibility · WAL tagging · rollback tracking</text>
          <text x={410} y={240} fill={C.green} fontSize={11} fontFamily={MONO} textAnchor="middle">XID + WAL = crash-safe transaction durability</text>
        </svg>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 14, color: C.purple, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span>BEGIN ──► assigns XID</span>
          <span>unique · monotonic</span>
          <span>used by MVCC + WAL</span>
        </div>
      </Win>

      {/* RIGHT: WAL log stream visualization */}
      <Win x={980} y={180} w={860} h={720} title="WAL log stream ──► write-ahead logging" accent={C.blue} opacity={walP}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.blue}}>
          WAL buffers changes BEFORE disk write ──► crash-safe guarantee
        </div>

        <div style={{position: 'absolute', right: 18, top: 14, display: 'flex', gap: 10}}>
          <Chip color={C.blue} style={{fontSize: 13, padding: '4px 12px'}}>{writeAheadP > 0.5 ? 'Write-Ahead ✓' : '...'}</Chip>
          <Chip color={C.green} style={{fontSize: 13, padding: '4px 12px'}}>{durP > 0.5 ? 'Durable ✓' : '...'}</Chip>
        </div>

        {/* SVG WAL stream */}
        <svg width={820} height={560} style={{position: 'absolute', left: 20, top: 60}}>
          {/* Source: DML changes */}
          <rect x={20} y={20} width={170} height={70} fill={`${C.amber}22`} stroke={C.amber} strokeWidth={2} rx={10} />
          <text x={105} y={50} fill={C.amber} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">DML changes</text>
          <text x={105} y={70} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">INSERT · UPDATE · DELETE</text>

          {/* Arrow into WAL buffer */}
          <line x1={190} y1={55} x2={240} y2={55} stroke={C.blue} strokeWidth={3} />
          <polygon points="234,49 234,61 248,55" fill={C.blue} />

          {/* WAL Buffer (blue stream container) */}
          <rect
            x={250}
            y={20}
            width={320}
            height={70}
            fill={`${C.blue}22`}
            stroke={C.blue}
            strokeWidth={3}
            rx={10}
            style={{filter: `drop-shadow(0 0 12px ${C.blue}55)`}}
          />
          <text x={410} y={45} fill={C.blue} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">WAL Buffer (shared_buffers)</text>
          <text x={410} y={68} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">write-ahead · serialized · ordered</text>
          <text x={410} y={84} fill={C.green} fontSize={10} fontFamily={MONO} textAnchor="middle">✓ written BEFORE data files</text>

          {/* Arrow from WAL buffer to WAL log file */}
          <line x1={570} y1={55} x2={620} y2={55} stroke={C.blue} strokeWidth={3} />
          <polygon points="614,49 614,61 628,55" fill={C.blue} />

          {/* WAL log file (on disk) */}
          <rect x={630} y={20} width={170} height={70} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 10px ${C.green}66)`}} />
          <text x={715} y={50} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">WAL log file</text>
          <text x={715} y={70} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">pg_wal/000001...</text>
          <text x={715} y={84} fill={C.green} fontSize={10} fontFamily={MONO} textAnchor="middle">✓ fsync() flushed</text>

          {/* WAL entries flowing through the stream */}
          <text x={410} y={140} fill={C.muted} fontSize={13} fontFamily={MONO} textAnchor="middle">─── WAL entries flow (tagged with XID 804921) ───</text>

          {WAL_ENTRIES.map((entry, i) => {
            const itemFlow = clamp((flowProg * WAL_ENTRIES.length) - i);
            const x = lerp(40, 720, clamp(itemFlow));
            const y = 180 + i * 80;
            const flushed = flushProg > (i + 1) / (WAL_ENTRIES.length + 1);
            return (
              <g key={i} style={{opacity: clamp(itemFlow)}}>
                {/* Entry card */}
                <rect
                  x={x}
                  y={y}
                  width={260}
                  height={64}
                  fill={flushed ? `${C.green}22` : `${C.blue}22`}
                  stroke={flushed ? C.green : C.blue}
                  strokeWidth={flushed ? 3 : 2}
                  rx={10}
                  style={flushed ? {filter: `drop-shadow(0 0 8px ${C.green}55)`} : undefined}
                />
                <text x={x + 130} y={y + 22} fill={flushed ? C.green : C.blue} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">{entry.action}</text>
                <text x={x + 130} y={y + 40} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">{entry.xid} · {entry.lsn}</text>
                <text x={x + 130} y={y + 56} fill={flushed ? C.green : C.amber} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">{flushed ? '✓ flushed to disk' : '◉ in buffer'}</text>

                {/* Arrow to next entry (if not last) */}
                {i < WAL_ENTRIES.length - 1 ? (
                  <line x1={x + 130} y1={y + 64} x2={x + 130} y2={y + 80} stroke={C.blue} strokeWidth={2} strokeDasharray="4 3" opacity={0.6} />
                ) : null}
              </g>
            );
          })}

          {/* Crash durability banner */}
          <g style={{opacity: clamp(crashP)}}>
            <rect x={20} y={440} width={780} height={60} fill={`${C.red}11`} stroke={C.red} strokeWidth={2} strokeDasharray="6 4" rx={10} />
            <text x={410} y={465} fill={C.red} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">⚠ System crash scenario</text>
            <text x={410} y={486} fill={C.muted} fontSize={12} fontFamily={MONO} textAnchor="middle">on reboot ──► PostgreSQL replays WAL ──► committed TXs restored · uncommitted rolled back</text>
          </g>

          {/* Durability result */}
          <g style={{opacity: clamp(durP)}}>
            <rect x={20} y={510} width={780} height={40} fill={`${C.green}22`} stroke={C.green} strokeWidth={2} rx={8} style={{filter: `drop-shadow(0 0 8px ${C.green}55)`}} />
            <text x={410} y={535} fill={C.green} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ Crash Durability · instant rollback · zero data loss</text>
          </g>
        </svg>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 14, color: C.blue, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span>WAL ──► write-ahead log</span>
          <span>flushed BEFORE commit</span>
          <span>crash-safe ✓</span>
        </div>
      </Win>

      {/* Seal badge */}
      <div style={{position: 'absolute', left: 80, top: 580, width: 860, opacity: clamp(sealP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '12px 22px', border: `2px solid ${C.green}`, borderRadius: 14, background: `${C.green}0d`}}>
          <Check p={sealP} size={36} />
          <div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700}}>XID + WAL ──► Crash-Safe Seal ✓</div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 13, color: C.muted, marginTop: 2}}>unique identity · write-ahead log · durability guaranteed</div>
          </div>
        </div>
      </div>

      {/* Fast chip */}
      <div style={{position: 'absolute', left: 80, top: 690, width: 860, opacity: clamp(fastP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 22px', border: `2px solid ${C.amber}`, borderRadius: 14, background: `${C.amber}0d`}}>
          <Check p={fastP} size={32} color={C.amber} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 16, color: C.amber, fontWeight: 700}}>Instant Rollback · Fast Recovery · Production-Ready ✓</div>
        </div>
      </div>

      <Caption text="XID (unique) ──► WAL write-ahead log ──► fsync ──► Crash Durability + Instant Rollback" from={t(150)} to={sec(40)} tone="ok" />
    </Stage>
  );
};
