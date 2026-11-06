import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, lerp, pop, sec} from '../kit';

// SC01 (0-40s): Transaction Concept — Unit of Work & Laser-Gated Scope
// Anchors: 1.0 welcome | 5.0 transaction | 9.0 all-or-nothing | 14.0 unit of work | 20.0 lock | 28.0 seal | 35.0 protected
const S = START.s1;
const t = (g: number) => sec(g - S);

// DML statements that flow into the transaction scope
const DML_FLOW = [
  {label: 'INSERT', color: C.green, y: 110},
  {label: 'UPDATE', color: C.amber, y: 200},
  {label: 'DELETE', color: C.red, y: 290},
  {label: 'COMMIT', color: C.blue, y: 380},
];

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(1.5), 14));
  const txP = clamp(lin(f, t(5), 16));
  // Laser gates closing animation (close around the DML statements)
  const lockStart = t(20);
  const lockDur = sec(8);
  const lockProg = clamp((f - lockStart) / lockDur);
  // Top gate slides down, bottom gate slides up
  const gateTopY = lerp(-40, 70, lockProg);
  const gateBotY = lerp(490, 420, lockProg);
  // DML flow-in animation (each statement slides in)
  const flowProg = clamp(lin(f, t(9), sec(8)));
  const sealP = pop(f, t(28));
  const protP = pop(f, t(35));

  return (
    <Stage dur={1200} inFx="zoom" outFx="left">
      <TopBadge text="مفهوم المعاملة (Transaction) | Transaction Scope — All-or-Nothing Unit of Work" from={sec(2)} to={sec(18)} color={C.purple} />

      {/* LEFT: Code editor with transaction DML statements */}
      <div style={{opacity: editorP}}>
        <Editor
          x={80}
          y={180}
          w={820}
          h={260}
          title="Query Editor · transaction DML block"
          lines={[
            'BEGIN;',
            'INSERT INTO orders (id, total)',
            "  VALUES (9001, 1500);",
            'UPDATE accounts SET balance = balance - 1500',
            '  WHERE id = 101;',
            'COMMIT;',
          ]}
          start={t(1.5)}
          cps={0.85}
          size={16}
          accent={C.blue}
          hl={0}
          hlColor={C.purple}
        />
      </div>

      {/* Concept chips below editor */}
      <div style={{position: 'absolute', left: 80, top: 460, width: 820, opacity: clamp(lin(f, t(9), 14))}}>
        <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.muted, marginBottom: 10}}>◆ Transaction golden rule</div>
        <div style={{display: 'flex', gap: 10, flexWrap: 'wrap'}}>
          <Chip color={C.purple} style={{fontSize: 16, padding: '4px 14px'}}>Unit of Work</Chip>
          <Chip color={C.green} style={{fontSize: 16, padding: '4px 14px'}}>All-or-Nothing ✓</Chip>
          <Chip color={C.amber} style={{fontSize: 16, padding: '4px 14px'}}>Atomic Block</Chip>
          <Chip color={C.blue} style={{fontSize: 16, padding: '4px 14px'}}>BEGIN · COMMIT</Chip>
        </div>
      </div>

      {/* Unit of Work badge panel */}
      <Win x={80} y={540} w={820} h={360} title="unit of work ──► all-or-nothing execution" accent={C.green} opacity={clamp(lin(f, t(14), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.green}}>
          BEGIN ──► DML block ──► COMMIT or ROLLBACK
        </div>

        <svg width={780} height={260} style={{position: 'absolute', left: 20, top: 50}}>
          {/* BEGIN input block */}
          <rect x={20} y={40} width={160} height={70} fill={`${C.blue}22`} stroke={C.blue} strokeWidth={2} rx={10} />
          <text x={100} y={68} fill={C.blue} fontSize={15} fontFamily={MONO} fontWeight={700} textAnchor="middle">BEGIN;</text>
          <text x={100} y={90} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">open transaction</text>

          {/* Arrow to DML block */}
          <line x1={180} y1={75} x2={240} y2={75} stroke={C.green} strokeWidth={3} strokeDasharray="6 4" />
          <polygon points="234,69 234,81 248,75" fill={C.green} />

          {/* DML block (purple scope) */}
          <rect x={250} y={20} width={280} height={110} fill={`${C.purple}22`} stroke={C.purple} strokeWidth={3} rx={12} style={{filter: `drop-shadow(0 0 12px ${C.purple}66)`}} />
          <text x={390} y={45} fill={C.purple} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">DML Scope (Unit of Work)</text>
          <text x={280} y={70} fill={C.amber} fontSize={12} fontFamily={MONO}>• INSERT</text>
          <text x={280} y={88} fill={C.amber} fontSize={12} fontFamily={MONO}>• UPDATE</text>
          <text x={280} y={106} fill={C.amber} fontSize={12} fontFamily={MONO}>• DELETE</text>
          <text x={400} y={70} fill={C.muted} fontSize={11} fontFamily={MONO}>all executed</text>
          <text x={400} y={88} fill={C.muted} fontSize={11} fontFamily={MONO}>as one block</text>
          <text x={400} y={106} fill={C.muted} fontSize={11} fontFamily={MONO}>atomic</text>

          {/* Arrow to COMMIT/ROLLBACK */}
          <line x1={530} y1={75} x2={590} y2={75} stroke={C.green} strokeWidth={3} strokeDasharray="6 4" />
          <polygon points="584,69 584,81 598,75" fill={C.green} />

          {/* COMMIT / ROLLBACK outcome */}
          <rect x={600} y={20} width={150} height={50} fill={`${C.green}22`} stroke={C.green} strokeWidth={2} rx={8} />
          <text x={675} y={48} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">COMMIT ✓</text>
          <text x={675} y={62} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">permanent</text>

          <rect x={600} y={80} width={150} height={50} fill={`${C.red}22`} stroke={C.red} strokeWidth={2} rx={8} />
          <text x={675} y={108} fill={C.red} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">ROLLBACK ✗</text>
          <text x={675} y={122} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">reverted</text>

          {/* Status text */}
          <text x={390} y={170} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ Unit of Work · all-or-nothing atomic block</text>
          <text x={390} y={195} fill={C.muted} fontSize={12} fontFamily={MONO} textAnchor="middle">no partial state · no torn writes · guaranteed integrity</text>
          <text x={390} y={220} fill={C.amber} fontSize={11} fontFamily={MONO} textAnchor="middle">fail anywhere → entire block reverts</text>
        </svg>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 14, color: C.green, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span>BEGIN ──► opens transaction</span>
          <span>COMMIT / ROLLBACK ──► closes</span>
        </div>
      </Win>

      {/* RIGHT: Transaction Scope container with laser gates closing around DML statements */}
      <Win x={940} y={180} w={900} h={720} title="transaction scope ──► laser gates seal DML statements" accent={C.purple} opacity={txP}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.purple}}>
          DML statements enter scope ──► laser gates lock them as one unit
        </div>

        {/* Module 13 chip + lock chip */}
        <div style={{position: 'absolute', right: 18, top: 14, display: 'flex', alignItems: 'center', gap: 12}}>
          <Chip color={C.purple} style={{fontSize: 13, padding: '4px 12px'}}>Module 13 Transactions</Chip>
          <Chip color={lockProg > 0.7 ? C.green : C.amber} style={{fontSize: 13, padding: '4px 12px'}}>
            {lockProg > 0.7 ? 'Locked ✓' : 'Locking...'}
          </Chip>
        </div>

        {/* SVG scope container with laser gates */}
        <svg width={900} height={610} style={{position: 'absolute', left: 0, top: 60}}>
          {/* Transaction scope outer frame (purple) */}
          <rect
            x={60}
            y={50}
            width={780}
            height={430}
            fill={`${C.purple}11`}
            stroke={C.purple}
            strokeWidth={3}
            strokeDasharray="10 6"
            rx={16}
            style={{filter: `drop-shadow(0 0 18px ${C.purple}55)`}}
          />
          <text x={450} y={40} fill={C.purple} fontSize={16} fontFamily={MONO} fontWeight={700} textAnchor="middle">⚡ Transaction Scope (purple boundary)</text>

          {/* TOP laser gate (closes downward) */}
          <g style={{opacity: clamp(lockProg > 0 ? 1 : 0)}}>
            <line x1={70} y1={gateTopY} x2={830} y2={gateTopY} stroke={C.purple} strokeWidth={4} style={{filter: `drop-shadow(0 0 8px ${C.purple})`}} />
            <text x={450} y={gateTopY - 8} fill={C.purple} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">▼ laser gate (top)</text>
          </g>

          {/* BOTTOM laser gate (closes upward) */}
          <g style={{opacity: clamp(lockProg > 0 ? 1 : 0)}}>
            <line x1={70} y1={gateBotY} x2={830} y2={gateBotY} stroke={C.purple} strokeWidth={4} style={{filter: `drop-shadow(0 0 8px ${C.purple})`}} />
            <text x={450} y={gateBotY + 18} fill={C.purple} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">▲ laser gate (bottom)</text>
          </g>

          {/* DML statements flowing into the scope */}
          {DML_FLOW.map((dml, i) => {
            const itemProg = clamp((flowProg * DML_FLOW.length) - i);
            const xEnter = lerp(-180, 130 + i * 170, clamp(itemProg));
            const yInside = dml.y;
            const locked = lockProg > 0.5 && itemProg >= 1;
            return (
              <g key={i} style={{opacity: clamp(itemProg)}}>
                <rect
                  x={xEnter}
                  y={yInside - 25}
                  width={140}
                  height={50}
                  fill={locked ? `${dml.color}33` : `${dml.color}22`}
                  stroke={dml.color}
                  strokeWidth={locked ? 3 : 2}
                  rx={10}
                  style={locked ? {filter: `drop-shadow(0 0 10px ${dml.color})`} : undefined}
                />
                <text x={xEnter + 70} y={yInside + 4} fill={dml.color} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">{dml.label}{locked ? ' 🔒' : ''}</text>
              </g>
            );
          })}

          {/* Lock status */}
          {lockProg >= 1 ? (
            <g style={{opacity: clamp(pop(f, t(28)))}}>
              <rect x={300} y={500} width={300} height={50} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 12px ${C.green})`}} />
              <text x={450} y={532} fill={C.green} fontSize={16} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ Sealed: Unit of Work</text>
            </g>
          ) : null}

          {/* Caption-style status text below */}
          <text x={450} y={580} fill={C.muted} fontSize={13} fontFamily={MONO} textAnchor="middle">
            {lockProg < 0.3 ? 'statements entering scope...' : lockProg < 0.9 ? 'laser gates closing...' : 'all DML locked as one atomic block ✓'}
          </text>
        </svg>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 16, fontWeight: 700, paddingTop: 8, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.purple}}>Transaction · purple scope</span>
          <span style={{color: lockProg >= 1 ? C.green : C.amber, opacity: clamp(pop(f, t(20)))}}>
            {lockProg >= 1 ? '✓ Unit of Work sealed' : lockProg > 0 ? `locking... ${Math.round(lockProg * 100)}%` : 'idle'}
          </span>
          <span style={{color: C.green}}>Atomicity ✓</span>
        </div>
      </Win>

      {/* Seal badge */}
      <div style={{position: 'absolute', left: 80, top: 920, opacity: clamp(sealP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 22px', border: `2px solid ${C.green}`, borderRadius: 14, background: `${C.green}0d`}}>
          <Check p={sealP} size={36} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700}}>Unit of Work · All-or-Nothing · Sealed ✓</div>
        </div>
      </div>

      {/* Protected chip on the right */}
      <div style={{position: 'absolute', right: 80, top: 920, opacity: clamp(protP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 22px', border: `2px solid ${C.purple}`, borderRadius: 14, background: `${C.purple}0d`}}>
          <Check p={protP} size={36} color={C.purple} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.purple, fontWeight: 700}}>Transaction Protected ✓</div>
        </div>
      </div>

      <Caption text="Transaction ──► BEGIN ──► DML Block ──► Laser Gates Seal ──► All-or-Nothing Unit of Work" from={t(20)} to={sec(38)} tone="ok" />
    </Stage>
  );
};
