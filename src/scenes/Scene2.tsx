import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {ROW_LOCK_TYPES} from '../data';
import {Caption, Check, Chip, Mix, Stage, TopBadge, Win, clamp, lin, lerp, pop, sec} from '../kit';

// SC02 (40-85s): Row Lock Types & MVCC Non-Blocking Reads
// Anchors: 41.0 FOR UPDATE | 45.0 four types | 52.0 MVCC | 60.0 SELECT | 68.0 non-blocking | 75.0 green | 80.0 seal
const S = START.s2;
const t = (g: number) => sec(g - S);

// Activation start times (in seconds) for each lock type
const TYPE_STARTS = [45, 48, 51, 54];

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const typesP = clamp(lin(f, t(41.5), 14));
  const mvccP = clamp(lin(f, t(52), 14));
  const selectP = clamp(lin(f, t(60), 14));
  const nonBlockP = pop(f, t(68));
  const greenP = pop(f, t(75));
  const sealP = pop(f, t(80));

  // MVCC visualization progress
  // TX2 UPDATE stalls (waiting)
  const tx2WaitProg = clamp(lin(f, t(60), sec(8)));
  // TX3 SELECT passes through smoothly
  const tx3FlowProg = clamp(lin(f, t(60), sec(10)));
  const tx3X = lerp(20, 740, tx3FlowProg);

  return (
    <Stage dur={1350} inFx="left" outFx="left">
      <TopBadge text="أنواع أقفال الصفوف و MVCC | Row Lock Types & MVCC Non-Blocking Reads" from={sec(2)} to={sec(40)} color={C.blue} />

      {/* Top: 4 row lock types banner */}
      <Win x={80} y={170} w={1760} h={180} title="row lock types ──► four FOR ... flavors" accent={C.blue} opacity={typesP}>
        <div dir="ltr" style={{position: 'absolute', left: 24, top: 12, fontFamily: MONO, fontSize: 20, color: C.blue}}>
          FOR UPDATE · FOR NO KEY UPDATE · FOR SHARE · FOR KEY SHARE ──► escalating strength
        </div>
        <div style={{position: 'absolute', left: 24, right: 24, top: 50, display: 'flex', gap: 18, justifyContent: 'center'}}>
          {ROW_LOCK_TYPES.map((p, i) => {
            const ap = clamp(pop(f, t(41.5 + i * 0.6)));
            return (
              <div key={i} style={{display: 'flex', alignItems: 'center', gap: 10, padding: '10px 22px', border: `2px solid ${p.color}`, borderRadius: 14, background: `${p.color}0d`, opacity: clamp(ap), transform: `scale(${0.9 + 0.1 * clamp(ap)})`}}>
                <div style={{width: 48, height: 48, borderRadius: 10, background: `${p.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <svg width={28} height={28} viewBox="0 0 28 28">
                    <rect x={5} y={12} width={18} height={14} fill="none" stroke={p.color} strokeWidth={2.5} rx={3} />
                    <path d="M 8 12 V 8 A 6 6 0 0 1 20 8 V 12" fill="none" stroke={p.color} strokeWidth={2.5} strokeLinecap="round" />
                    <circle cx={14} cy={18} r={2} fill={p.color} />
                  </svg>
                </div>
                <div>
                  <div dir="ltr" style={{fontFamily: MONO, fontSize: 16, fontWeight: 700, color: p.color}}>{p.type}</div>
                  <div dir="ltr" style={{fontFamily: MONO, fontSize: 11, color: C.muted, marginTop: 2}}>{p.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Win>

      {/* MVCC visualization panel */}
      <Win x={80} y={380} w={1760} h={470} title="MVCC non-blocking reads ──► SELECT passes through locked rows" accent={C.purple} opacity={mvccP}>
        <div dir="ltr" style={{position: 'absolute', left: 24, top: 12, fontFamily: MONO, fontSize: 20, color: C.purple}}>
          TX1 holds FOR UPDATE on row 101 ──► TX2 UPDATE stalls ──► TX3 SELECT reads MVCC snapshot instantly
        </div>

        <div style={{position: 'absolute', right: 24, top: 14, display: 'flex', gap: 10}}>
          <Chip color={C.red} style={{fontSize: 13, padding: '4px 12px'}}>TX1 FOR UPDATE</Chip>
          <Chip color={C.amber} style={{fontSize: 13, padding: '4px 12px'}}>{tx2WaitProg > 0.95 ? 'TX2 timeout ✗' : 'TX2 waiting...'}</Chip>
          <Chip color={C.blue} style={{fontSize: 13, padding: '4px 12px'}}>TX3 SELECT (MVCC)</Chip>
        </div>

        {/* SVG MVCC diagram */}
        <svg width={1720} height={380} style={{position: 'absolute', left: 20, top: 60}}>
          {/* Row 101 visualization in center */}
          <rect x={620} y={140} width={460} height={80} fill={`${C.red}22`} stroke={C.red} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 14px ${C.red}66)`}} />
          <text x={850} y={170} fill={C.red} fontSize={16} fontFamily={MONO} fontWeight={700} textAnchor="middle">Row 101 (stock_qty = 7)</text>
          <text x={850} y={195} fill={C.muted} fontSize={12} fontFamily={MONO} textAnchor="middle">held by TX1 with FOR UPDATE</text>
          {/* Lock badge on the row */}
          <g>
            <rect x={1040} y={150} width={32} height={32} fill={`${C.red}33`} stroke={C.red} strokeWidth={2} rx={5} />
            <path d="M 1044 158 V 152 A 8 8 0 0 1 1060 152 V 158" fill="none" stroke={C.red} strokeWidth={2} />
            <circle cx={1052} cy={168} r={2} fill={C.red} />
          </g>

          {/* MVCC snapshot layer (transparent copy of row) */}
          <rect x={620} y={250} width={460} height={60} fill={`${C.blue}11`} stroke={C.blue} strokeWidth={2} strokeDasharray="6 4" rx={8} />
          <text x={850} y={278} fill={C.blue} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">MVCC snapshot · row 101 at commit-time version (stock_qty = 7)</text>
          <text x={850} y={298} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">read by TX3 SELECT ──► never blocks</text>

          {/* TX1 (FOR UPDATE holder) */}
          <rect x={20} y={140} width={220} height={80} fill={`${C.red}22`} stroke={C.red} strokeWidth={3} rx={10} />
          <text x={130} y={170} fill={C.red} fontSize={15} fontFamily={MONO} fontWeight={700} textAnchor="middle">TX1 · holds lock</text>
          <text x={130} y={190} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">BEGIN;</text>
          <text x={130} y={206} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">SELECT ... FOR UPDATE;</text>

          {/* Arrow from TX1 to row (holding) */}
          <line x1={240} y1={180} x2={620} y2={180} stroke={C.red} strokeWidth={3} />
          <polygon points="614,174 614,186 628,180" fill={C.red} />
          <text x={430} y={170} fill={C.red} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">holds lock</text>

          {/* TX2 (UPDATE stalls) - amber */}
          <rect x={20} y={20} width={220} height={80} fill={`${C.amber}22`} stroke={C.amber} strokeWidth={3} rx={10} opacity={clamp(pop(f, t(52)))} />
          <text x={130} y={50} fill={C.amber} fontSize={15} fontFamily={MONO} fontWeight={700} textAnchor="middle">TX2 · concurrent UPDATE</text>
          <text x={130} y={70} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">BEGIN;</text>
          <text x={130} y={86} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">UPDATE products SET ...</text>

          {/* Arrow from TX2 to row (stalled - dashed, with wait symbol) */}
          <path d={`M 240 60 Q 430 60 580 ${clamp(lerp(60, 180, tx2WaitProg * 0.5), 60, 180)}`} fill="none" stroke={C.amber} strokeWidth={3} strokeDasharray={tx2WaitProg > 0.95 ? '4 4' : '8 4'} opacity={0.85} />
          <text x={400} y={50} fill={C.amber} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">{tx2WaitProg > 0.95 ? '✗ timeout 55P03' : '⏳ waiting for lock...'}</text>

          {/* Spinning/waiting indicator near the row */}
          {tx2WaitProg < 0.95 ? (
            <g style={{opacity: clamp(pop(f, t(55)))}}>
              <circle cx={600} cy={180} r={14} fill="none" stroke={C.amber} strokeWidth={3} strokeDasharray="20 6" strokeDashoffset={-f * 0.5} />
              <text x={600} y={220} fill={C.amber} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">stalled</text>
            </g>
          ) : (
            <g>
              <circle cx={600} cy={180} r={14} fill={`${C.red}22`} stroke={C.red} strokeWidth={2} />
              <line x1={594} y1={174} x2={606} y2={186} stroke={C.red} strokeWidth={2.5} strokeLinecap="round" />
              <line x1={606} y1={174} x2={594} y2={186} stroke={C.red} strokeWidth={2.5} strokeLinecap="round" />
              <text x={600} y={220} fill={C.red} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">aborted</text>
            </g>
          )}

          {/* TX3 (SELECT passes through) - blue */}
          <rect x={20} y={280} width={220} height={80} fill={`${C.blue}22`} stroke={C.blue} strokeWidth={3} rx={10} opacity={clamp(pop(f, t(60)))} />
          <text x={130} y={310} fill={C.blue} fontSize={15} fontFamily={MONO} fontWeight={700} textAnchor="middle">TX3 · plain SELECT</text>
          <text x={130} y={330} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">BEGIN;</text>
          <text x={130} y={346} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">SELECT * FROM products;</text>

          {/* Arrow from TX3 flowing through row to MVCC snapshot (passes through) */}
          <line x1={240} y1={320} x2={tx3X} y2={320} stroke={C.blue} strokeWidth={3} />
          <polygon points={`${tx3X - 6},314 ${tx3X - 6},326 ${tx3X},320`} fill={C.blue} />
          <text x={400} y={310} fill={C.blue} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ reads MVCC snapshot · passes through</text>

          {/* Right side: result panels */}
          {/* TX2 result */}
          <rect x={1180} y={20} width={500} height={80} fill={`${C.amber}11`} stroke={C.amber} strokeWidth={2} strokeDasharray="6 4" rx={10} opacity={clamp(pop(f, t(65)))} />
          <text x={1430} y={50} fill={C.amber} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">TX2 result · blocked</text>
          <text x={1430} y={72} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">{tx2WaitProc(tx2WaitProg)} · wait until TX1 COMMIT or deadlock_timeout</text>
          <text x={1430} y={90} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">or abort with SQLSTATE 55P03 (lock_not_available)</text>

          {/* TX3 result */}
          <rect x={1180} y={280} width={500} height={80} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} rx={10} opacity={clamp(pop(f, t(62)))} style={{filter: `drop-shadow(0 0 10px ${C.green}44)`}} />
          <text x={1430} y={310} fill={C.green} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">TX3 result · instant ✓</text>
          <text x={1430} y={332} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">returns stock_qty = 7 (snapshot version)</text>
          <text x={1430} y={350} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ zero wait · non-blocking read</text>
        </svg>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 14, color: C.blue, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.red}}>FOR UPDATE ──► blocks writes</span>
          <span style={{color: C.green}}>plain SELECT ──► MVCC snapshot</span>
          <span style={{color: C.amber}}>UPDATE ──► waits or aborts</span>
        </div>
      </Win>

      {/* Non-Blocking Reads checkmark badge */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 870, display: 'flex', justifyContent: 'center', opacity: clamp(nonBlockP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18, padding: '12px 26px', border: `3px solid ${C.green}`, borderRadius: 18, background: `${C.green}0d`, boxShadow: `0 0 32px ${C.green}44`}}>
          <Check p={greenP} size={56} color={C.green} />
          <div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 22, color: C.green, fontWeight: 700}}>Non-Blocking Reads ✓</div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 13, color: C.muted, marginTop: 2}}>MVCC snapshot isolation · readers never wait · writers serialize on row lock</div>
          </div>
          {sealP > 0 ? (
            <div style={{display: 'flex', alignItems: 'center', gap: 8, marginLeft: 20, padding: '6px 16px', border: `2px solid ${C.purple}`, borderRadius: 999, background: `${C.purple}1a`}}>
              <Check p={sealP} size={22} color={C.purple} />
              <span dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.purple, fontWeight: 700}}>MVCC Seal ✓</span>
            </div>
          ) : null}
        </div>
      </div>

      <Caption text="FOR UPDATE ──► 4 Lock Types ──► MVCC Snapshot ──► Non-Blocking Reads ✓" from={t(75)} to={sec(44)} tone="ok" />
    </Stage>
  );
};

// Helper to render TX2 wait status text
const tx2WaitProc = (p: number) => (p > 0.95 ? '✗ aborted' : `waiting ${Math.round(p * 100)}%`);
