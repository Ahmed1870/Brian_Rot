import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {ENTERPRISE_PROC_CODE} from '../data';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, lerp, pop, sec} from '../kit';

// SC05 (170-210s): Enterprise Batch Bonus Procedure — sp_process_monthly_bonuses + CALL + 10× faster than app-side loop
// Anchors: 171.0 enterprise | 175.0 procedure | 180.0 bonuses | 185.0 CALL | 192.0 10x | 200.0 seal | 205.0 batch
const S = START.s5;
const t = (g: number) => sec(g - S);

// Customer balances (before/after bonus)
const BALANCE_ROWS = [
  {id: 101, name: 'Cairo Co-op', before: 1000, after: 1050},
  {id: 102, name: 'Giza Trade', before: 2400, after: 2520},
  {id: 103, name: 'Alex Imports', before: 5800, after: 6090},
  {id: 104, name: 'Suez Logistics', before: 1750, after: 1838},
  {id: 105, name: 'Aswan Goods', before: 3200, after: 3360},
];

export const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(171.5), 14));
  const procP = clamp(lin(f, t(175), 14));
  const bonusP = pop(f, t(180));
  const callP = pop(f, t(185));
  // CALL executes -> balances update (10× faster than app-side loop)
  const execProg = clamp(lin(f, t(192), sec(8)));
  const fastP = pop(f, t(192));
  const sealP = pop(f, t(200));
  const batchP = pop(f, t(205));

  return (
    <Stage dur={1200} inFx="morph" outFx="fade">
      <TopBadge text="إجراء المؤسسات للبونص الشهري | Enterprise Batch Bonus Procedure (CALL · COMMIT · 10× Faster)" from={sec(1)} to={sec(38)} color={C.green} />

      {/* LEFT: Enterprise procedure editor */}
      <div style={{opacity: editorP}}>
        <Editor
          x={80}
          y={170}
          w={820}
          h={340}
          title="Enterprise · CREATE PROCEDURE sp_process_monthly_bonuses (PL/pgSQL + COMMIT)"
          lines={ENTERPRISE_PROC_CODE.concat([
            '',
            '-- one round trip · server-side batch',
            '-- COMMIT persists all balances atomically',
          ])}
          start={t(171.5)}
          cps={0.45}
          size={14}
          accent={C.green}
          hl={0}
          hlColor={C.green}
        />
      </div>

      {/* Procedure characteristics chips */}
      <div style={{position: 'absolute', left: 80, top: 530, width: 820, opacity: clamp(procP)}}>
        <div dir="ltr" style={{fontFamily: MONO, fontSize: 16, color: C.muted, marginBottom: 8}}>◆ Enterprise procedure characteristics:</div>
        <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
          <Chip color={C.green} style={{fontSize: 14, padding: '4px 12px'}}>
            <Check p={bonusP} size={16} color={C.green} /> PROCEDURE
          </Chip>
          <Chip color={C.purple} style={{fontSize: 14, padding: '4px 12px'}}>LANGUAGE plpgsql ✓</Chip>
          <Chip color={C.amber} style={{fontSize: 14, padding: '4px 12px'}}>CALL sp_name(...) ✓</Chip>
          <Chip color={C.green} style={{fontSize: 14, padding: '4px 12px'}}>COMMIT ✓</Chip>
          <Chip color={C.blue} style={{fontSize: 14, padding: '4px 12px'}}>10× Faster ✓</Chip>
        </div>
      </div>

      {/* Bonus 10× faster badge */}
      <div style={{position: 'absolute', left: 80, top: 620, width: 820, opacity: clamp(fastP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '14px 22px', border: `3px solid ${C.green}`, borderRadius: 16, background: `${C.green}0d`, boxShadow: `0 0 24px ${C.green}33`}}>
          <Check p={fastP} size={44} color={C.green} />
          <div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 20, color: C.green, fontWeight: 700}}>10× Faster than App-Side Loop ✓</div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 13, color: C.muted, marginTop: 2}}>Single CALL · server-side batch · one COMMIT · zero network round-trips per row</div>
          </div>
          <div style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, padding: '6px 16px', border: `2px solid ${C.green}`, borderRadius: 999, background: `${C.green}1a`}}>
            <Check p={batchP} size={22} color={C.green} />
            <span dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.green, fontWeight: 700}}>Batch ✓</span>
          </div>
        </div>
      </div>

      {/* Enterprise Quality Seal at bottom-left */}
      <div style={{position: 'absolute', left: 80, top: 730, width: 820, opacity: clamp(sealP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '14px 22px', border: `3px solid ${C.green}`, borderRadius: 16, background: `${C.green}0d`, boxShadow: `0 0 24px ${C.green}33`}}>
          <Check p={sealP} size={44} color={C.green} />
          <div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 20, color: C.green, fontWeight: 700}}>Enterprise Quality Seal ✓</div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 13, color: C.muted, marginTop: 2}}>PL/pgSQL · CREATE PROCEDURE · CALL · COMMIT · 10× faster batch processing</div>
          </div>
        </div>
      </div>

      {/* RIGHT: Visualization — CALL execution + balance updates + 10× comparison */}
      <Win x={940} y={170} w={900} h={720} title="enterprise batch ──► CALL sp_process_monthly_bonuses(0.05) → +5% balances" accent={C.green} opacity={clamp(callP)}>
        <div dir="ltr" style={{position: 'absolute', left: 24, top: 12, fontFamily: MONO, fontSize: 18, color: C.green}}>
          CALL ──► server-side batch ──► COMMIT ──► all balances updated in one round trip
        </div>

        <div style={{position: 'absolute', right: 24, top: 14, display: 'flex', gap: 10}}>
          <Chip color={C.amber} style={{fontSize: 13, padding: '4px 12px'}}>{execProg > 0.05 && execProg < 0.99 ? 'Executing...' : 'idle'}</Chip>
          <Chip color={C.green} style={{fontSize: 13, padding: '4px 12px'}}>{execProg > 0.95 ? 'COMMIT ✓' : '...'}</Chip>
        </div>

        {/* SVG: CALL flow + balances + 10× comparison */}
        <svg width={860} height={600} style={{position: 'absolute', left: 20, top: 60}}>
          {/* CALL node (top-left) */}
          <g style={{opacity: clamp(callP)}}>
            <rect x={20} y={20} width={260} height={80} fill={`${C.amber}22`} stroke={C.amber} strokeWidth={3} rx={12} style={{filter: `drop-shadow(0 0 8px ${C.amber}44)`}} />
            <text x={150} y={48} fill={C.amber} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">CALL sp_process_monthly_bonuses(0.05)</text>
            <text x={150} y={70} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">one round trip · server-side</text>
            <text x={150} y={88} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">no app-side loop</text>
          </g>

          {/* Arrow: CALL -> Procedure engine */}
          <g style={{opacity: clamp(callP)}}>
            <line x1={280} y1={60} x2={380 + execProg * 80} y2={60} stroke={C.green} strokeWidth={3.5} strokeDasharray="8 4" opacity={0.4 + 0.6 * execProg} />
            <polygon points={`${380 + execProg * 80 - 8},52 ${380 + execProg * 80 - 8},68 ${380 + execProg * 80 + 4},60`} fill={C.green} />
            <text x={330} y={42} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">execute ──►</text>
          </g>

          {/* Procedure engine node (top-right) */}
          <g style={{opacity: clamp(callP)}}>
            <rect x={620} y={20} width={220} height={80} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} rx={12} style={{filter: `drop-shadow(0 0 8px ${C.green}44)`}} />
            <text x={730} y={48} fill={C.green} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">PL/pgSQL Engine</text>
            <text x={730} y={70} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">UPDATE store_customers</text>
            <text x={730} y={88} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">balance *= 1.05 · COMMIT</text>
          </g>

          {/* Customer balances table */}
          <g style={{opacity: clamp(bonusP)}}>
            <text x={20} y={140} fill={C.text} fontSize={14} fontFamily={MONO} fontWeight={700}>Customer Balances (before → after +5% bonus)</text>

            {/* Table header */}
            <rect x={20} y={150} width={820} height={28} fill={C.deep} stroke={C.border} strokeWidth={1} rx={4} />
            <text x={50} y={168} fill={C.muted} fontSize={11} fontFamily={MONO} fontWeight={700}>ID</text>
            <text x={120} y={168} fill={C.muted} fontSize={11} fontFamily={MONO} fontWeight={700}>NAME</text>
            <text x={400} y={168} fill={C.muted} fontSize={11} fontFamily={MONO} fontWeight={700}>BEFORE</text>
            <text x={560} y={168} fill={C.muted} fontSize={11} fontFamily={MONO} fontWeight={700}>AFTER</text>
            <text x={720} y={168} fill={C.muted} fontSize={11} fontFamily={MONO} fontWeight={700}>Δ</text>

            {/* Balance rows */}
            {BALANCE_ROWS.map((row, i) => {
              const rowP = clamp((execProg - i * 0.1) * 1.4);
              return (
                <g key={i} style={{opacity: clamp(rowP)}}>
                  <rect x={20} y={180 + i * 34} width={820} height={30} fill={`${C.purple}11`} stroke={C.border} strokeWidth={0.5} rx={4} />
                  <text x={50} y={200 + i * 34} fill={C.amber} fontSize={11} fontFamily={MONO} fontWeight={700}>{row.id}</text>
                  <text x={120} y={200 + i * 34} fill={C.text} fontSize={11} fontFamily={MONO}>{row.name}</text>
                  <text x={400} y={200 + i * 34} fill={C.muted} fontSize={11} fontFamily={MONO}>{row.before}</text>
                  <text x={560} y={200 + i * 34} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700}>{row.after}</text>
                  <text x={720} y={200 + i * 34} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700}>+{row.after - row.before}</text>
                </g>
              );
            })}

            {/* COMMIT indicator */}
            <g style={{opacity: clamp(execProg > 0.95 ? pop(f, t(196)) : 0)}}>
              <rect x={620} y={356} width={220} height={30} fill={`${C.green}33`} stroke={C.green} strokeWidth={2} rx={6} style={{filter: `drop-shadow(0 0 8px ${C.green}66)`}} />
              <text x={730} y={376} fill={C.green} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ COMMIT · all balances persisted</text>
            </g>
          </g>

          {/* 10× faster comparison bar */}
          <g style={{opacity: clamp(fastP)}}>
            <text x={20} y={410} fill={C.text} fontSize={14} fontFamily={MONO} fontWeight={700}>Performance: app-side loop vs server-side CALL</text>

            {/* App-side loop (red, slow) */}
            <rect x={20} y={425} width={180} height={50} fill={`${C.red}22`} stroke={C.red} strokeWidth={2} rx={6} />
            <text x={110} y={448} fill={C.red} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">App-side loop</text>
            <text x={110} y={466} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">1000 round trips</text>

            <rect x={210} y={425} width={620 * 1.0} height={50} fill={`${C.red}33`} stroke={C.red} strokeWidth={2} rx={6} opacity={0.7} />
            <text x={830} y={455} fill={C.red} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="end">~8.0s (10× slower)</text>

            {/* Server-side CALL (green, fast) */}
            <rect x={20} y={485} width={180} height={50} fill={`${C.green}22`} stroke={C.green} strokeWidth={2} rx={6} />
            <text x={110} y={508} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">CALL procedure</text>
            <text x={110} y={526} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">1 round trip</text>

            <rect x={210} y={485} width={620 * 0.1 * execProg} height={50} fill={`${C.green}33`} stroke={C.green} strokeWidth={2} rx={6} style={{filter: `drop-shadow(0 0 8px ${C.green}66)`}} />
            <text x={210 + 620 * 0.1 * execProg + 10} y={515} fill={C.green} fontSize={12} fontFamily={MONO} fontWeight={700}>~0.8s ✓ (10× faster)</text>
          </g>

          {/* Result banner */}
          {execProg > 0.95 ? (
            <g style={{opacity: clamp(pop(f, t(198)))}}>
              <rect x={120} y={555} width={620} height={36} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 10px ${C.green}66)`}} />
              <text x={430} y={578} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ Enterprise Batch Complete · COMMIT · 10× Faster · Module 15 Capstone</text>
            </g>
          ) : null}
        </svg>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 14, color: C.green, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.amber}}>CALL sp_process_monthly_bonuses</span>
          <span style={{color: execProg >= 1 ? C.green : C.amber}}>{execProg >= 1 ? '✓ COMMIT · 10× faster' : execProg > 0 ? `executing... ${Math.round(execProg * 100)}%` : 'idle'}</span>
          <span style={{color: C.green}}>production ✓</span>
        </div>
      </Win>

      <Caption text="CREATE PROCEDURE ──► CALL ──► COMMIT ──► 10× Faster ──► Enterprise Batch Seal ✓" from={t(185)} to={sec(38)} tone="ok" />
    </Stage>
  );
};
