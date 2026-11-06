import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, lerp, pop, sec} from '../kit';

// SC03 (85-130s): RELEASE SAVEPOINT — Memory Cleanup & Nested Savepoint Cascading
// Anchors: 86.0 RELEASE | 90.0 cleanup | 95.0 memory | 100.0 nested | 110.0 cascading | 118.0 chronological | 125.0 seal
const S = START.s3;
const t = (g: number) => sec(g - S);

// Nested savepoint chain
const NESTED = [
  {name: 'sp_outer', depth: 0, color: C.purple},
  {name: 'sp_mid', depth: 1, color: C.blue},
  {name: 'sp_inner', depth: 2, color: C.green},
];

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const relP = clamp(lin(f, t(86.5), 14));
  const cleanP = clamp(lin(f, t(90), sec(6)));
  const memP = clamp(lin(f, t(95), sec(6)));
  const nestedP = clamp(lin(f, t(100), sec(8)));
  const cascP = clamp(lin(f, t(110), sec(8)));
  const chronP = pop(f, t(118));
  const sealP = pop(f, t(125));
  // RELEASE animation: savepoint fades out, data stays green
  const fadeProg = clamp(lin(f, t(90), sec(8)));
  // Memory release animation
  const memProg = clamp(lin(f, t(95), sec(6)));

  return (
    <Stage dur={1350} inFx="left" outFx="up">
      <TopBadge text="RELEASE SAVEPOINT | Memory Cleanup · Nested Savepoint Cascading" from={sec(2)} to={sec(40)} color={C.amber} />

      {/* LEFT: Code editor with RELEASE SAVEPOINT */}
      <div style={{opacity: relP}}>
        <Editor
          x={80}
          y={180}
          w={820}
          h={280}
          title="Query Editor · RELEASE SAVEPOINT (explicit cleanup)"
          lines={[
            'BEGIN;',
            'SAVEPOINT my_savepoint;',
            'UPDATE store_orders SET status = $paid;',
            'RELEASE SAVEPOINT my_savepoint;',
            '-- savepoint removed · DML preserved',
            'COMMIT;',
          ]}
          start={t(86.5)}
          cps={0.7}
          size={16}
          accent={C.amber}
          hl={3}
          hlColor={C.amber}
        />
      </div>

      {/* Cleanup badge */}
      <div style={{position: 'absolute', left: 80, top: 480, width: 820, opacity: clamp(cleanP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '12px 22px', border: `2px solid ${C.amber}`, borderRadius: 14, background: `${C.amber}0d`, boxShadow: `0 0 24px ${C.amber}33`}}>
          <svg width={42} height={42} viewBox="0 0 42 42">
            <circle cx={21} cy={21} r={19} fill={`${C.amber}22`} stroke={C.amber} strokeWidth={3} />
            <circle cx={21} cy={21} r={6} fill={C.amber} style={{opacity: 1 - fadeProg}} />
          </svg>
          <div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 20, color: C.amber, fontWeight: 700}}>RELEASE SAVEPOINT ──► removes marker ✓</div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 13, color: C.muted}}>explicit cleanup · savepoint name freed · DML inside remains committed-pending</div>
          </div>
        </div>
      </div>

      {/* Memory release panel */}
      <Win x={80} y={580} w={820} h={320} title="memory release ──► savepoint name freed · data preserved" accent={C.green} opacity={clamp(memP)}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.green}}>
          RELEASE ──► savepoint record released · DML survives in green
        </div>

        <svg width={780} height={220} style={{position: 'absolute', left: 20, top: 50}}>
          {/* Savepoint node (fades out in amber) */}
          <g style={{opacity: 1 - fadeProg * 0.85}}>
            <rect x={30} y={30} width={220} height={120} fill={`${C.amber}22`} stroke={C.amber} strokeWidth={3} rx={12} style={{filter: `drop-shadow(0 0 12px ${C.amber}66)`}} />
            <text x={140} y={70} fill={C.amber} fontSize={18} fontFamily={MONO} fontWeight={700} textAnchor="middle">SAVEPOINT</text>
            <text x={140} y={95} fill={C.amber} fontSize={14} fontFamily={MONO} textAnchor="middle">my_savepoint</text>
            <text x={140} y={120} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">marker record · name table</text>
            <text x={140} y={140} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">held until RELEASE</text>
          </g>

          {/* Arrow to released state */}
          <g style={{opacity: clamp(memProg)}}>
            <line x1={260} y1={90} x2={320} y2={90} stroke={C.green} strokeWidth={4} />
            <polygon points="316,82 316,98 332,90" fill={C.green} />
            <text x={290} y={78} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">RELEASE</text>
          </g>

          {/* Released: data preserved (green) */}
          <g style={{opacity: clamp(memProg)}}>
            <rect x={330} y={30} width={250} height={120} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} rx={12} style={{filter: `drop-shadow(0 0 12px ${C.green}66)`}} />
            <text x={455} y={68} fill={C.green} fontSize={18} fontFamily={MONO} fontWeight={700} textAnchor="middle">DML Preserved</text>
            <text x={455} y={92} fill={C.green} fontSize={14} fontFamily={MONO} textAnchor="middle">UPDATE store_orders</text>
            <text x={455} y={114} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">survives RELEASE ✓</text>
            <text x={455} y={134} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">committed at COMMIT;</text>
          </g>

          {/* Memory freed indicator */}
          <g style={{opacity: clamp(memProg)}}>
            <rect x={600} y={30} width={170} height={120} fill={`${C.purple}22`} stroke={C.purple} strokeWidth={3} rx={12} />
            <text x={685} y={68} fill={C.purple} fontSize={16} fontFamily={MONO} fontWeight={700} textAnchor="middle">Memory Freed</text>
            <text x={685} y={92} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">name table slot</text>
            <text x={685} y={110} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">release · reusable</text>
            <text x={685} y={136} fill={C.green} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ released</text>
          </g>

          {/* Bottom caption */}
          <text x={390} y={180} fill={C.muted} fontSize={12} fontFamily={MONO} textAnchor="middle">
            RELEASE SAVEPOINT = remove the marker · DML still pending COMMIT · cannot ROLLBACK TO this name anymore
          </text>
          <text x={390} y={202} fill={C.green} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">
            {memProg > 0.7 ? '✓ Memory released · data preserved · ready for COMMIT' : 'releasing memory...'}
          </text>
        </svg>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 38, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 14, color: C.green, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span>SAVEPOINT ──► marker</span>
          <span style={{color: C.amber}}>RELEASE ──► remove marker</span>
          <span>DML preserved ✓</span>
        </div>
      </Win>

      {/* RIGHT: Nested savepoints with chronological cascading */}
      <Win x={940} y={180} w={900} h={720} title="nested savepoints ──► chronological cascading on RELEASE" accent={C.blue} opacity={clamp(nestedP)}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.blue}}>
          nested SAVEPOINTs ──► RELEASE cascades children chronologically
        </div>

        <div style={{position: 'absolute', right: 18, top: 14, display: 'flex', gap: 10}}>
          <Chip color={C.blue} style={{fontSize: 13, padding: '4px 12px'}}>Nested ✓</Chip>
          <Chip color={cascP > 0.5 ? C.green : C.amber} style={{fontSize: 13, padding: '4px 12px'}}>
            {cascP > 0.7 ? 'Cascaded ✓' : cascP > 0 ? 'cascading...' : 'idle'}
          </Chip>
        </div>

        <svg width={880} height={600} style={{position: 'absolute', left: 10, top: 60}}>
          {/* Outer savepoint container */}
          <g style={{opacity: clamp(nestedP)}}>
            <rect x={30} y={30} width={820} height={500} fill={`${C.purple}11`} stroke={C.purple} strokeWidth={2.5} strokeDasharray="10 6" rx={16} style={{filter: `drop-shadow(0 0 16px ${C.purple}44)`}} />
            <text x={440} y={20} fill={C.purple} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">sp_outer (depth 0)</text>

            {/* Middle savepoint container */}
            <rect x={80} y={70} width={720} height={440} fill={`${C.blue}11`} stroke={C.blue} strokeWidth={2.5} strokeDasharray="8 5" rx={14} />
            <text x={440} y={62} fill={C.blue} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">sp_mid (depth 1)</text>

            {/* Inner savepoint container */}
            <rect x={140} y={110} width={600} height={380} fill={`${C.green}11`} stroke={C.green} strokeWidth={2.5} strokeDasharray="6 4" rx={12} />
            <text x={440} y={104} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">sp_inner (depth 2)</text>
          </g>

          {/* Chronological sequence arrows pointing inward */}
          <g style={{opacity: clamp(cascP)}}>
            <line x1={440} y1={42} x2={440} y2={66} stroke={C.amber} strokeWidth={3} strokeDasharray="6 3" />
            <polygon points="434,60 446,60 440,72" fill={C.amber} />
            <line x1={440} y1={82} x2={440} y2={106} stroke={C.amber} strokeWidth={3} strokeDasharray="6 3" />
            <polygon points="434,100 446,100 440,112" fill={C.amber} />
          </g>

          {/* DML step labels inside inner */}
          <g style={{opacity: clamp(nestedP)}}>
            <text x={440} y={150} fill={C.muted} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">DML block inside nested savepoints</text>

            <rect x={180} y={170} width={520} height={40} fill={`${C.blue}22`} stroke={C.blue} strokeWidth={2} rx={8} />
            <text x={440} y={196} fill={C.blue} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">① SAVEPOINT sp_outer;  (create outer)</text>

            <rect x={180} y={220} width={520} height={40} fill={`${C.amber}22`} stroke={C.amber} strokeWidth={2} rx={8} />
            <text x={440} y={246} fill={C.amber} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">② UPDATE orders SET status = $paid;</text>

            <rect x={180} y={270} width={520} height={40} fill={`${C.blue}22`} stroke={C.blue} strokeWidth={2} rx={8} />
            <text x={440} y={296} fill={C.blue} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">③ SAVEPOINT sp_mid;  (create mid)</text>

            <rect x={180} y={320} width={520} height={40} fill={`${C.amber}22`} stroke={C.amber} strokeWidth={2} rx={8} />
            <text x={440} y={346} fill={C.amber} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">④ UPDATE inventory SET qty = qty - 1;</text>

            <rect x={180} y={370} width={520} height={40} fill={`${C.green}22`} stroke={C.green} strokeWidth={2} rx={8} />
            <text x={440} y={396} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">⑤ SAVEPOINT sp_inner;  (create inner)</text>

            <rect x={180} y={420} width={520} height={40} fill={`${C.purple}22`} stroke={C.purple} strokeWidth={3} rx={8} style={{filter: `drop-shadow(0 0 8px ${C.purple}55)`}} />
            <text x={440} y={446} fill={C.purple} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">⑥ RELEASE SAVEPOINT sp_outer;  → cascades sp_mid + sp_inner</text>
          </g>

          {/* Chronological cascade outcome banner */}
          {cascP > 0.7 ? (
            <g style={{opacity: clamp(pop(f, t(118)))}}>
              <rect x={60} y={480} width={760} height={60} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 12px ${C.green}66)`}} />
              <text x={440} y={506} fill={C.green} fontSize={15} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ Chronological Cascade · sp_outer RELEASE removes sp_mid + sp_inner in order</text>
              <text x={440} y={528} fill={C.muted} fontSize={12} fontFamily={MONO} textAnchor="middle">child savepoints auto-released in chronological order · DML still pending COMMIT ✓</text>
            </g>
          ) : null}
        </svg>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 38, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 14, color: C.blue, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span>sp_outer (parent)</span>
          <span>RELEASE → cascades children chronologically</span>
          <span>DML preserved ✓</span>
        </div>
      </Win>

      {/* Seal badge */}
      <div style={{position: 'absolute', left: 80, top: 920, opacity: clamp(sealP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 22px', border: `2px solid ${C.green}`, borderRadius: 14, background: `${C.green}0d`}}>
          <Check p={sealP} size={36} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700}}>RELEASE SAVEPOINT · Memory Cleaned ✓</div>
        </div>
      </div>

      {/* Chronological cascade chip */}
      <div style={{position: 'absolute', right: 80, top: 920, opacity: clamp(chronP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 22px', border: `2px solid ${C.blue}`, borderRadius: 14, background: `${C.blue}0d`}}>
          <Check p={chronP} size={36} color={C.blue} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.blue, fontWeight: 700}}>Chronological Cascade ✓</div>
        </div>
      </div>

      <Caption text="RELEASE SAVEPOINT ──► Memory Freed · DML Preserved · Nested Children Cascade Chronologically" from={t(110)} to={sec(44)} tone="ok" />
    </Stage>
  );
};
