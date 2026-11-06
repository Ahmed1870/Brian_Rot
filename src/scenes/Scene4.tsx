import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Mix, Stage, TopBadge, Win, clamp, lin, lerp, pop, sec} from '../kit';

// SC04 (130-170s): Subtransactions & SubXID — PostgreSQL 16 Subtransaction Engine
// Anchors: 131.0 subtransactions | 136.0 SubXID | 140.0 WAL | 145.0 abort | 150.0 capsule | 155.0 target | 160.0 seal | 165.0 fast
const S = START.s4;
const t = (g: number) => sec(g - S);

// SubXID capsule list
const SUBCAPS = [
  {label: 'SubXID: 804922', savepoint: 'sp_a', color: C.blue},
  {label: 'SubXID: 804923', savepoint: 'sp_b', color: C.blue},
];

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const subP = clamp(lin(f, t(131.5), 14));
  const xidP = clamp(lin(f, t(136), sec(6)));
  const walP = clamp(lin(f, t(140), sec(6)));
  const abortP = clamp(lin(f, t(145), sec(8)));
  const capP = pop(f, t(150));
  const tgtP = pop(f, t(155));
  const sealP = pop(f, t(160));
  const fastP = pop(f, t(165));
  // SubXID spawn animation
  const spawnProg = clamp(lin(f, t(136), sec(8)));
  // Abort animation
  const abortProg = clamp(lin(f, t(145), sec(8)));

  return (
    <Stage dur={1200} inFx="zoom" outFx="morph">
      <TopBadge text="Subtransactions و SubXID | PostgreSQL 16 Subtransaction Engine" from={sec(2)} to={sec(40)} color={C.purple} />

      {/* LEFT: PostgreSQL 16 engine + main XID + SubXID capsules */}
      <Win x={80} y={180} w={860} h={560} title="PostgreSQL 16 subtransaction engine ──► XID spawns SubXIDs" accent={C.purple} opacity={subP}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.purple}}>
          main XID ──► SAVEPOINT creates child SubXID ──► per-savepoint identity
        </div>

        <div style={{position: 'absolute', right: 18, top: 14, display: 'flex', gap: 10}}>
          <Chip color={C.purple} style={{fontSize: 13, padding: '4px 12px'}}>PostgreSQL 16</Chip>
          <Chip color={abortProg > 0.5 ? C.green : C.amber} style={{fontSize: 13, padding: '4px 12px'}}>
            {abortProg > 0.7 ? 'Sub aborted ✓' : 'spawning...'}
          </Chip>
        </div>

        <svg width={820} height={460} style={{position: 'absolute', left: 20, top: 60}}>
          {/* PostgreSQL engine block */}
          <rect x={20} y={20} width={200} height={100} fill={`${C.blue}22`} stroke={C.blue} strokeWidth={3} rx={14} style={{filter: `drop-shadow(0 0 10px ${C.blue}55)`}} />
          <text x={120} y={56} fill={C.blue} fontSize={15} fontFamily={MONO} fontWeight={700} textAnchor="middle">PostgreSQL 16</text>
          <text x={120} y={78} fill={C.muted} fontSize={12} fontFamily={MONO} textAnchor="middle">Subtransaction Engine</text>
          <text x={120} y={98} fill={C.green} fontSize={11} fontFamily={MONO} textAnchor="middle">assigning SubXID...</text>

          {/* Main XID capsule (purple, large) */}
          <rect x={250} y={20} width={550} height={100} fill={`${C.purple}22`} stroke={C.purple} strokeWidth={4} rx={50} style={{filter: `drop-shadow(0 0 18px ${C.purple}66)`, opacity: clamp(xidP)}} />
          <text x={525} y={58} fill={C.purple} fontSize={24} fontFamily={MONO} fontWeight={700} textAnchor="middle">XID: 804921 (main)</text>
          <text x={525} y={84} fill={C.muted} fontSize={12} fontFamily={MONO} textAnchor="middle">transaction stays ACTIVE through subtransaction abort</text>
          <text x={525} y={102} fill={C.green} fontSize={11} fontFamily={MONO} textAnchor="middle">✓ main XID unaffected by sub-abort</text>

          {/* Spawning arrows */}
          <g style={{opacity: clamp(spawnProg)}}>
            <line x1={525} y1={120} x2={250} y2={180} stroke={C.blue} strokeWidth={3} strokeDasharray="6 4" />
            <polygon points="256,176 262,186 246,184" fill={C.blue} />
            <line x1={525} y1={120} x2={525} y2={180} stroke={C.blue} strokeWidth={3} strokeDasharray="6 4" />
            <polygon points="519,176 531,176 525,188" fill={C.blue} />
            <line x1={525} y1={120} x2={800} y2={180} stroke={C.blue} strokeWidth={3} strokeDasharray="6 4" />
            <polygon points="794,184 798,176 808,182" fill={C.blue} />
          </g>

          {/* SubXID capsules (blue) */}
          {SUBCAPS.map((sub, i) => {
            const itemProg = clamp((spawnProg * SUBCAPS.length) - i);
            const x = 80 + i * 350;
            const aborted = abortProg > 0.5 && i === 0; // 804922 (sp_a) is aborted
            const op = aborted ? 0.35 : clamp(itemProg);
            const col = aborted ? C.red : sub.color;
            return (
              <g key={i} style={{opacity: op}}>
                <rect x={x} y={200} width={290} height={90} fill={`${col}22`} stroke={col} strokeWidth={aborted ? 2 : 4} rx={45} style={aborted ? {filter: 'none'} : {filter: `drop-shadow(0 0 12px ${col}66)`}} />
                <text x={x + 145} y={236} fill={col} fontSize={18} fontFamily={MONO} fontWeight={700} textAnchor="middle">{sub.label}</text>
                <text x={x + 145} y={260} fill={C.muted} fontSize={12} fontFamily={MONO} textAnchor="middle">spawned at {sub.savepoint}</text>
                <text x={x + 145} y={280} fill={aborted ? C.red : C.green} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">{aborted ? '✗ ABORTED (target)' : '✓ active sub'}</text>
                {/* Strike-through if aborted */}
                {aborted ? <line x1={x + 20} y1={245} x2={x + 270} y2={245} stroke={C.red} strokeWidth={2} strokeDasharray="6 4" /> : null}
              </g>
            );
          })}

          {/* ROLLBACK TO SAVEPOINT label between sub-capsules */}
          <g style={{opacity: clamp(abortP)}}>
            <rect x={140} y={310} width={540} height={50} fill={`${C.purple}11`} stroke={C.purple} strokeWidth={2} strokeDasharray="6 4" rx={10} />
            <text x={410} y={342} fill={C.purple} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">ROLLBACK TO SAVEPOINT sp_a ──► aborts SubXID 804922 only</text>
          </g>

          {/* Result banner */}
          {abortProg > 0.6 ? (
            <g style={{opacity: clamp(pop(f, t(160)))}}>
              <rect x={20} y={380} width={780} height={60} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 12px ${C.green}66)`}} />
              <text x={410} y={406} fill={C.green} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ SubXID 804922 aborted · SubXID 804923 + main XID 804921 still active</text>
              <text x={410} y={428} fill={C.muted} fontSize={12} fontFamily={MONO} textAnchor="middle">partial rollback lives at the SubXID layer · zero main-TX cost</text>
            </g>
          ) : null}
        </svg>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 38, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 14, color: C.purple, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span>XID (main)</span>
          <span>SAVEPOINT → SubXID spawn</span>
          <span>target abort ✓</span>
        </div>
      </Win>

      {/* RIGHT: WAL log stream with abort tracking */}
      <Win x={980} y={180} w={860} h={560} title="WAL log stream ──► SubXID abort tracking" accent={C.blue} opacity={walP}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.blue}}>
          WAL records every SubXID ──► abort logged · main XID unaffected
        </div>

        <div style={{position: 'absolute', right: 18, top: 14, display: 'flex', gap: 10}}>
          <Chip color={C.blue} style={{fontSize: 13, padding: '4px 12px'}}>WAL tagged</Chip>
          <Chip color={abortProg > 0.6 ? C.green : C.amber} style={{fontSize: 13, padding: '4px 12px'}}>
            {abortProg > 0.7 ? 'Aborted ✓' : 'tracking...'}
          </Chip>
        </div>

        <svg width={820} height={460} style={{position: 'absolute', left: 20, top: 60}}>
          {/* WAL stream container */}
          <rect x={10} y={10} width={800} height={40} fill={`${C.blue}11`} stroke={C.blue} strokeWidth={2} rx={8} />
          <text x={410} y={36} fill={C.blue} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">─── WAL stream · all entries tagged with main XID 804921 ───</text>

          {/* WAL entries */}
          {[
            {xid: 'XID 804921', sub: 'main', action: 'BEGIN', status: 'flushed', color: C.purple, y: 70},
            {xid: 'XID 804921 · Sub 804922', sub: 'sp_a', action: 'UPDATE orders', status: 'logged', color: C.blue, y: 130},
            {xid: 'XID 804921 · Sub 804923', sub: 'sp_b', action: 'UPDATE inventory', status: 'logged', color: C.blue, y: 190},
            {xid: 'XID 804921 · Sub 804922', sub: 'sp_a', action: 'ABORT (ROLLBACK TO sp_a)', status: 'flushed', color: C.red, y: 250},
            {xid: 'XID 804921', sub: 'main', action: 'COMMIT', status: 'flushed', color: C.green, y: 320},
          ].map((entry, i) => {
            const itemProg = clamp((walP * 5) - i);
            const isAbort = i === 3;
            const aborted = abortProg > 0.5 && isAbort;
            return (
              <g key={i} style={{opacity: clamp(itemProg)}}>
                <rect x={20} y={entry.y} width={780} height={50} fill={aborted ? `${C.red}22` : `${entry.color}22`} stroke={aborted ? C.red : entry.color} strokeWidth={aborted ? 3 : 2} rx={10} style={aborted ? {filter: `drop-shadow(0 0 8px ${C.red}66)`} : undefined} />
                <text x={36} y={entry.y + 22} fill={aborted ? C.red : entry.color} fontSize={13} fontFamily={MONO} fontWeight={700}>{entry.action}</text>
                <text x={36} y={entry.y + 40} fill={C.muted} fontSize={11} fontFamily={MONO}>{entry.xid}</text>
                <text x={780} y={entry.y + 30} fill={aborted ? C.red : (entry.status === 'flushed' ? C.green : C.amber)} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="end">{aborted ? '✗ ABORTED' : (entry.status === 'flushed' ? '✓ flushed' : '◉ in buffer')}</text>
                {/* Connector */}
                {i < 4 ? <line x1={410} y1={entry.y + 50} x2={410} y2={entry.y + 70} stroke={C.border} strokeWidth={1.5} strokeDasharray="3 3" opacity={0.5} /> : null}
              </g>
            );
          })}

          {/* Abort outcome banner */}
          {abortProg > 0.7 ? (
            <g style={{opacity: clamp(pop(f, t(160)))}}>
              <rect x={20} y={390} width={780} height={50} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 10px ${C.green}55)`}} />
              <text x={410} y={412} fill={C.green} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ SubXID 804922 ABORT recorded · main XID 804921 COMMIT succeeded</text>
              <text x={410} y={432} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">WAL preserves abort record for crash recovery · zero main-TX rollback</text>
            </g>
          ) : null}
        </svg>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 38, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 14, color: C.blue, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span>WAL ──► SubXID tracking</span>
          <span>abort flushed</span>
          <span>main XID intact ✓</span>
        </div>
      </Win>

      {/* Seal badge bottom-left */}
      <div style={{position: 'absolute', left: 80, top: 770, width: 860, opacity: clamp(sealP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '12px 22px', border: `2px solid ${C.green}`, borderRadius: 14, background: `${C.green}0d`}}>
          <Check p={sealP} size={36} />
          <div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700}}>Subtransaction Seal ✓</div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 13, color: C.muted, marginTop: 2}}>SubXID abort · main XID stays active · WAL-tagged recovery</div>
          </div>
        </div>
      </div>

      {/* Fast recovery chip bottom-right */}
      <div style={{position: 'absolute', left: 980, top: 770, width: 860, opacity: clamp(fastP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '12px 22px', border: `2px solid ${C.amber}`, borderRadius: 14, background: `${C.amber}0d`}}>
          <Check p={fastP} size={36} color={C.amber} />
          <div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.amber, fontWeight: 700}}>Fast SubXID Abort · Zero Main-TX Cost</div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 13, color: C.muted, marginTop: 2}}>target-only rollback · production-grade resilience</div>
          </div>
        </div>
      </div>

      <Caption text="XID ──► SubXID (sp_a / sp_b) ──► ROLLBACK TO sp_a ──► Target SubXID Aborted · Main XID Active ✓" from={t(150)} to={sec(40)} tone="ok" />
    </Stage>
  );
};
