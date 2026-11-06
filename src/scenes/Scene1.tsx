import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, lerp, pop, sec} from '../kit';

// SC01 (0-40s): Locking Concept — Purple Lock Drops onto a Row
// Anchors: 1.0 welcome | 5.0 locks | 9.0 row-level | 14.0 protection | 20.0 capstone | 28.0 seal | 35.0 safeguard
const S = START.s1;
const t = (g: number) => sec(g - S);

// Sample table rows
const ROWS = [
  {id: 99, name: 'Keyboard', stock: 24, color: C.muted},
  {id: 101, name: 'Wireless Mouse', stock: 7, color: C.purple},
  {id: 105, name: 'USB-C Cable', stock: 50, color: C.muted},
  {id: 108, name: 'HDMI Adapter', stock: 12, color: C.muted},
  {id: 112, name: 'Webcam HD', stock: 3, color: C.muted},
];

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(1.5), 14));
  const tableP = clamp(lin(f, t(5), 14));
  // Lock drop animation
  const lockStart = t(9);
  const lockDur = sec(8);
  const lockProg = clamp((f - lockStart) / lockDur);
  const lockY = lerp(-60, 0, lockProg); // Lock drops from above
  // Seal & safeguard animations
  const sealP = pop(f, t(28));
  const protP = pop(f, t(35));
  const capP = pop(f, t(20));

  return (
    <Stage dur={1200} inFx="zoom" outFx="left">
      <TopBadge text="قفل مستوى الصف | Row-Level Locking — FOR UPDATE Protection (Module 13 Capstone)" from={sec(2)} to={sec(18)} color={C.purple} />

      {/* LEFT: Code editor with FOR UPDATE query */}
      <div style={{opacity: editorP}}>
        <Editor
          x={80}
          y={180}
          w={820}
          h={260}
          title="Query Editor · FOR UPDATE locks the row"
          lines={[
            'BEGIN;',
            'SELECT * FROM products',
            '  WHERE id = 101 FOR UPDATE;',
            '-- row 101 locked against',
            '-- concurrent writes/deletes',
            'COMMIT;',
          ]}
          start={t(1.5)}
          cps={0.85}
          size={16}
          accent={C.purple}
          hl={2}
          hlColor={C.purple}
        />
      </div>

      {/* Concept chips below editor */}
      <div style={{position: 'absolute', left: 80, top: 460, width: 820, opacity: clamp(lin(f, t(5), 14))}}>
        <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.muted, marginBottom: 10}}>◆ Row lock golden rule</div>
        <div style={{display: 'flex', gap: 10, flexWrap: 'wrap'}}>
          <Chip color={C.purple} style={{fontSize: 16, padding: '4px 14px'}}>FOR UPDATE</Chip>
          <Chip color={C.red} style={{fontSize: 16, padding: '4px 14px'}}>Block Writes ✓</Chip>
          <Chip color={C.amber} style={{fontSize: 16, padding: '4px 14px'}}>Block Deletes ✓</Chip>
          <Chip color={C.green} style={{fontSize: 16, padding: '4px 14px'}}>MVCC Reads ✓</Chip>
        </div>
      </div>

      {/* Module 13 Concurrency Capstone badge panel */}
      <Win x={80} y={540} w={820} h={360} title="module 13 concurrency capstone ──► row-level locking" accent={C.green} opacity={clamp(lin(f, t(14), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.green}}>
          Row lock ──► protects a single row ──► concurrency capstone
        </div>

        {/* Module 13 chip */}
        <div style={{position: 'absolute', right: 18, top: 14, display: 'flex', gap: 10}}>
          <Chip color={C.green} style={{fontSize: 13, padding: '4px 12px'}}>
            <Check p={capP} size={16} color={C.green} /> Module 13 Capstone
          </Chip>
        </div>

        <svg width={780} height={260} style={{position: 'absolute', left: 20, top: 50}}>
          {/* BEGIN input block */}
          <rect x={20} y={40} width={150} height={70} fill={`${C.blue}22`} stroke={C.blue} strokeWidth={2} rx={10} />
          <text x={95} y={68} fill={C.blue} fontSize={15} fontFamily={MONO} fontWeight={700} textAnchor="middle">BEGIN;</text>
          <text x={95} y={90} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">open transaction</text>

          {/* Arrow to SELECT FOR UPDATE */}
          <line x1={170} y1={75} x2={230} y2={75} stroke={C.green} strokeWidth={3} strokeDasharray="6 4" />
          <polygon points="224,69 224,81 238,75" fill={C.green} />

          {/* FOR UPDATE block (purple scope) */}
          <rect x={240} y={20} width={300} height={110} fill={`${C.purple}22`} stroke={C.purple} strokeWidth={3} rx={12} style={{filter: `drop-shadow(0 0 12px ${C.purple}66)`}} />
          <text x={390} y={45} fill={C.purple} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">SELECT ... FOR UPDATE</text>
          <text x={260} y={70} fill={C.amber} fontSize={12} fontFamily={MONO}>• row id = 101 targeted</text>
          <text x={260} y={88} fill={C.amber} fontSize={12} fontFamily={MONO}>• row lock acquired</text>
          <text x={260} y={106} fill={C.amber} fontSize={12} fontFamily={MONO}>• held until COMMIT</text>
          <text x={400} y={70} fill={C.muted} fontSize={11} fontFamily={MONO}>other TXs wait</text>
          <text x={400} y={88} fill={C.muted} fontSize={11} fontFamily={MONO}>or SKIP LOCKED</text>
          <text x={400} y={106} fill={C.muted} fontSize={11} fontFamily={MONO}>or NOWAIT 55P03</text>

          {/* Arrow to COMMIT */}
          <line x1={540} y1={75} x2={600} y2={75} stroke={C.green} strokeWidth={3} strokeDasharray="6 4" />
          <polygon points="594,69 594,81 608,75" fill={C.green} />

          {/* COMMIT outcome */}
          <rect x={610} y={40} width={150} height={70} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} rx={10} />
          <text x={685} y={68} fill={C.green} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">COMMIT;</text>
          <text x={685} y={90} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">lock released ✓</text>

          {/* Status text */}
          <text x={390} y={170} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ Row-Level Lock · protects a single row · concurrency capstone</text>
          <text x={390} y={195} fill={C.muted} fontSize={12} fontFamily={MONO} textAnchor="middle">other sessions blocked from modifying row 101 until lock released</text>
          <text x={390} y={220} fill={C.amber} fontSize={11} fontFamily={MONO} textAnchor="middle">SELECT (plain) reads MVCC snapshot · never blocked</text>
        </svg>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 14, color: C.green, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span>FOR UPDATE ──► row lock</span>
          <span>held until COMMIT</span>
        </div>
      </Win>

      {/* RIGHT: Table grid with purple lock dropping onto row 101 */}
      <Win x={940} y={180} w={900} h={720} title="products table ──► row 101 locked (purple lock drop)" accent={C.purple} opacity={tableP}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.purple}}>
          purple lock drops onto row 101 ──► other TXs blocked from writes
        </div>

        {/* Module 13 chip + lock chip */}
        <div style={{position: 'absolute', right: 18, top: 14, display: 'flex', alignItems: 'center', gap: 12}}>
          <Chip color={C.green} style={{fontSize: 13, padding: '4px 12px'}}>Module 13 Capstone</Chip>
          <Chip color={lockProg > 0.7 ? C.green : C.amber} style={{fontSize: 13, padding: '4px 12px'}}>
            {lockProg > 0.7 ? 'Locked ✓' : 'Locking...'}
          </Chip>
        </div>

        {/* SVG table with lock */}
        <svg width={900} height={610} style={{position: 'absolute', left: 0, top: 60}}>
          {/* Table header */}
          <rect x={60} y={40} width={780} height={44} fill={C.deep} stroke={C.border} strokeWidth={2} rx={6} />
          <text x={120} y={68} fill={C.muted} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">id</text>
          <text x={320} y={68} fill={C.muted} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">name</text>
          <text x={560} y={68} fill={C.muted} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">stock_qty</text>
          <text x={760} y={68} fill={C.muted} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">status</text>

          {/* Rows */}
          {ROWS.map((r, i) => {
            const y = 90 + i * 60;
            const isLocked = r.id === 101 && lockProg > 0.5;
            return (
              <g key={i}>
                <rect
                  x={60}
                  y={y}
                  width={780}
                  height={56}
                  fill={isLocked ? `${C.purple}22` : `${C.card}`}
                  stroke={isLocked ? C.purple : C.border}
                  strokeWidth={isLocked ? 3 : 1.5}
                  rx={6}
                  style={isLocked ? {filter: `drop-shadow(0 0 14px ${C.purple})`} : undefined}
                />
                <text x={120} y={y + 34} fill={r.color} fontSize={16} fontFamily={MONO} fontWeight={700} textAnchor="middle">{r.id}</text>
                <text x={320} y={y + 34} fill={C.text} fontSize={16} fontFamily={MONO} textAnchor="middle">{r.name}</text>
                <text x={560} y={y + 34} fill={C.text} fontSize={16} fontFamily={MONO} textAnchor="middle">{r.stock}</text>
                <text x={760} y={y + 34} fill={isLocked ? C.purple : C.muted} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">{isLocked ? '🔒 LOCKED' : 'active'}</text>
              </g>
            );
          })}

          {/* Purple lock dropping onto row 101 (row index 1) */}
          <g style={{opacity: clamp(lockProg > 0.1 ? 1 : 0), transform: `translate(0, ${lockY}px)`}}>
            {/* Lock body */}
            <rect x={690} y={130} width={80} height={70} fill={`${C.purple}33`} stroke={C.purple} strokeWidth={4} rx={10} style={{filter: `drop-shadow(0 0 16px ${C.purple})`}} />
            {/* Lock shackle */}
            <path d="M 700 130 V 110 A 30 30 0 0 1 760 110 V 130" fill="none" stroke={C.purple} strokeWidth={5} strokeLinecap="round" />
            {/* Keyhole */}
            <circle cx={730} cy={160} r={6} fill={C.purple} />
            <rect x={727} y={164} width={6} height={14} fill={C.purple} />
            {/* Drop line indicator */}
            {lockProg < 0.95 ? (
              <line x1={730} y1={50} x2={730} y2={130} stroke={C.purple} strokeWidth={2} strokeDasharray="4 4" opacity={0.5} />
            ) : null}
          </g>

          {/* Lock status banner */}
          {lockProg >= 0.95 ? (
            <g style={{opacity: clamp(pop(f, t(28)))}}>
              <rect x={250} y={490} width={400} height={50} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 12px ${C.green})`}} />
              <text x={450} y={522} fill={C.green} fontSize={16} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ Row 101 Locked: FOR UPDATE</text>
            </g>
          ) : null}

          {/* Caption-style status text below */}
          <text x={450} y={580} fill={C.muted} fontSize={13} fontFamily={MONO} textAnchor="middle">
            {lockProg < 0.3 ? 'lock descending onto row 101...' : lockProg < 0.9 ? 'purple lock engaging...' : 'row 101 sealed against concurrent writes ✓'}
          </text>
        </svg>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 16, fontWeight: 700, paddingTop: 8, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.purple}}>Row Lock · purple seal</span>
          <span style={{color: lockProg >= 1 ? C.green : C.amber, opacity: clamp(pop(f, t(9)))}}>
            {lockProg >= 1 ? '✓ row 101 locked' : lockProg > 0 ? `locking... ${Math.round(lockProg * 100)}%` : 'idle'}
          </span>
          <span style={{color: C.green}}>Module 13 ✓</span>
        </div>
      </Win>

      {/* Seal badge */}
      <div style={{position: 'absolute', left: 80, top: 920, opacity: clamp(sealP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 22px', border: `2px solid ${C.green}`, borderRadius: 14, background: `${C.green}0d`}}>
          <Check p={sealP} size={36} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700}}>Row-Level Lock · Sealed ✓</div>
        </div>
      </div>

      {/* Safeguard chip on the right */}
      <div style={{position: 'absolute', right: 80, top: 920, opacity: clamp(protP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 22px', border: `2px solid ${C.purple}`, borderRadius: 14, background: `${C.purple}0d`}}>
          <Check p={protP} size={36} color={C.purple} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.purple, fontWeight: 700}}>Concurrency Safeguard ✓</div>
        </div>
      </div>

      <Caption text="FOR UPDATE ──► Purple Lock Drops onto Row 101 ──► Writes Blocked ──► Concurrency Capstone" from={t(20)} to={sec(38)} tone="ok" />
    </Stage>
  );
};
