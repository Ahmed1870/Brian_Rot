import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, lerp, pop, sec} from '../kit';

// SC01 (0-40s): SAVEPOINT Concept — Partial Rollback Anchor Inside a Transaction
// Anchors: 1.0 welcome | 5.0 SAVEPOINT | 9.0 partial | 14.0 recovery | 20.0 nodes | 28.0 seal | 35.0 protected
const S = START.s1;
const t = (g: number) => sec(g - S);

// Execution path nodes (right panel)
const PATH_NODES = [
  {label: 'BEGIN;', desc: 'open transaction', color: C.amber, x: 40, y: 60},
  {label: 'INSERT order 901', desc: 'step 1 · DML', color: C.blue, x: 40, y: 140},
  {label: 'SAVEPOINT sp_a', desc: 'anchor A', color: C.blue, x: 40, y: 220},
  {label: 'UPDATE stock -1', desc: 'step 2 · DML', color: C.blue, x: 40, y: 300},
  {label: 'SAVEPOINT sp_b', desc: 'anchor B', color: C.blue, x: 40, y: 380},
  {label: 'DELETE coupon', desc: 'step 3 · ERROR', color: C.red, x: 40, y: 460},
];

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(1.5), 14));
  const saveP = clamp(lin(f, t(5), 14));
  const partP = pop(f, t(9));
  const recP = pop(f, t(14));
  // Node reveal animation
  const nodeProg = clamp(lin(f, t(20), sec(8)));
  // Reversal arrow animates after step 3 ERROR (around 14s)
  const revStart = t(14);
  const revDur = sec(6);
  const revProg = clamp((f - revStart) / revDur);
  const sealP = pop(f, t(28));
  const protP = pop(f, t(35));

  return (
    <Stage dur={1200} inFx="zoom" outFx="left">
      <TopBadge text="مفهوم SAVEPOINT | Savepoint — Partial Rollback Anchor Inside a Transaction" from={sec(2)} to={sec(18)} color={C.purple} />

      {/* LEFT: Code editor with savepoint transaction */}
      <div style={{opacity: editorP}}>
        <Editor
          x={80}
          y={180}
          w={820}
          h={320}
          title="Query Editor · SAVEPOINT + ROLLBACK TO SAVEPOINT"
          lines={[
            'BEGIN;',
            'INSERT INTO store_orders (order_id) VALUES (901);',
            'SAVEPOINT sp_a;',
            'UPDATE store_inventory SET qty = qty - 1 WHERE id = 502;',
            'SAVEPOINT sp_b;',
            'DELETE FROM store_coupons WHERE code = $bad;',
            '-- ERROR: invalid coupon',
            'ROLLBACK TO SAVEPOINT sp_b;',
          ]}
          start={t(1.5)}
          cps={0.7}
          size={15}
          accent={C.purple}
          hl={7}
          hlColor={C.purple}
        />
      </div>

      {/* SAVEPOINT badge */}
      <div style={{position: 'absolute', left: 80, top: 520, width: 820, opacity: clamp(saveP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '12px 22px', border: `2px solid ${C.purple}`, borderRadius: 14, background: `${C.purple}0d`, boxShadow: `0 0 24px ${C.purple}33`}}>
          <svg width={42} height={42} viewBox="0 0 42 42">
            <circle cx={21} cy={21} r={19} fill={`${C.purple}22`} stroke={C.purple} strokeWidth={3} />
            <circle cx={21} cy={21} r={6} fill={C.purple} />
          </svg>
          <div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 20, color: C.purple, fontWeight: 700}}>SAVEPOINT ──► named anchor inside TX ✓</div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 13, color: C.muted}}>place a marker · ROLLBACK TO SAVEPOINT reverts only DML after the marker</div>
          </div>
        </div>
      </div>

      {/* Partial recovery chips */}
      <Win x={80} y={610} w={820} h={290} title="partial rollback ──► recovery without losing prior DML" accent={C.green} opacity={clamp(lin(f, t(9), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.green}}>
          SAVEPOINT sp_b ──► ROLLBACK TO sp_b clears step 3 only
        </div>

        <div style={{position: 'absolute', left: 18, right: 18, top: 56, display: 'flex', gap: 12, flexWrap: 'wrap'}}>
          <Chip color={C.green} style={{fontSize: 14, padding: '6px 14px', opacity: clamp(partP)}}><Check p={1} size={18} color={C.green} /> BEGIN preserved</Chip>
          <Chip color={C.green} style={{fontSize: 14, padding: '6px 14px', opacity: clamp(partP)}}><Check p={1} size={18} color={C.green} /> INSERT preserved</Chip>
          <Chip color={C.green} style={{fontSize: 14, padding: '6px 14px', opacity: clamp(partP)}}><Check p={1} size={18} color={C.green} /> UPDATE preserved</Chip>
          <Chip color={C.red} style={{fontSize: 14, padding: '6px 14px', opacity: clamp(partP)}}>✗ DELETE reverted</Chip>
        </div>

        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, top: 130, padding: '14px', border: `1px solid ${C.border}`, borderRadius: 10, background: C.deep, fontFamily: MONO, fontSize: 13, color: C.text, lineHeight: 1.6}}>
          <span style={{color: '#64748B'}}>recovery:</span> ROLLBACK TO SAVEPOINT sp_b ──► rewinds to anchor B · INSERT + UPDATE survive · DELETE undone · transaction still OPEN.
        </div>

        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 36, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 13, color: C.green, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span>SAVEPOINT ──► anchor</span>
          <span style={{color: C.amber}}>ROLLBACK TO ──► rewind</span>
          <span>partial recovery ✓</span>
        </div>
      </Win>

      {/* RIGHT: Execution path with savepoint nodes + reversal arrow */}
      <Win x={940} y={180} w={900} h={720} title="execution path ──► savepoint nodes · purple reversal arrow" accent={C.purple} opacity={clamp(lin(f, t(5), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.purple}}>
          BEGIN ──► DML ──► SAVEPOINT ──► ERROR ──► rewind to sp_b
        </div>

        <div style={{position: 'absolute', right: 18, top: 14, display: 'flex', gap: 10}}>
          <Chip color={C.purple} style={{fontSize: 13, padding: '4px 12px'}}>Module 13</Chip>
          <Chip color={revProg > 0.5 ? C.green : C.amber} style={{fontSize: 13, padding: '4px 12px'}}>
            {revProg > 0.7 ? 'Rolled back ✓' : revProg > 0 ? 'Rewinding...' : 'idle'}
          </Chip>
        </div>

        <svg width={880} height={600} style={{position: 'absolute', left: 10, top: 60}}>
          {/* Vertical guide line */}
          <line x1={75} y1={70} x2={75} y2={500} stroke={C.border} strokeWidth={2} strokeDasharray="4 4" opacity={0.6} />

          {/* Path nodes */}
          {PATH_NODES.map((node, i) => {
            const itemProg = clamp((nodeProg * PATH_NODES.length) - i);
            const isError = i === PATH_NODES.length - 1;
            const isSavepoint = node.label.startsWith('SAVEPOINT');
            // After reversal: error node fades (reverted)
            const reverted = revProg > 0.5 && isError;
            const nodeOpacity = reverted ? 0.35 : clamp(itemProg);
            return (
              <g key={i} style={{opacity: nodeOpacity}}>
                {/* Node circle */}
                <circle
                  cx={75}
                  cy={node.y + 22}
                  r={isSavepoint ? 14 : 12}
                  fill={isError ? `${C.red}22` : `${node.color}22`}
                  stroke={isError ? C.red : node.color}
                  strokeWidth={isSavepoint ? 4 : 3}
                  style={isSavepoint ? {filter: `drop-shadow(0 0 8px ${C.blue}88)`} : undefined}
                />
                {/* Savepoint inner dot */}
                {isSavepoint ? <circle cx={75} cy={node.y + 22} r={5} fill={C.blue} /> : null}

                {/* Node label card */}
                <rect
                  x={110}
                  y={node.y}
                  width={isError ? 320 : 380}
                  height={44}
                  fill={reverted ? `${C.red}11` : `${isError ? C.red : node.color}22`}
                  stroke={reverted ? C.muted : (isError ? C.red : node.color)}
                  strokeWidth={reverted ? 1.5 : 2}
                  rx={10}
                  style={isError && !reverted ? {filter: `drop-shadow(0 0 10px ${C.red}55)`} : undefined}
                />
                <text x={124} y={node.y + 28} fill={reverted ? C.muted : (isError ? C.red : node.color)} fontSize={15} fontFamily={MONO} fontWeight={700}>{node.label}</text>
                <text x={124} y={node.y + 28} dy={0} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="start" transform={`translate(${isError ? 250 : 320},0)`}>{node.desc}</text>

                {/* Connector arrow downward */}
                {i < PATH_NODES.length - 1 ? (
                  <g>
                    <line x1={75} y1={node.y + 34} x2={75} y2={node.y + 86} stroke={isError ? C.red : C.border} strokeWidth={2} />
                    <polygon points="70,80 80,80 75,90" fill={isError ? C.red : C.border} />
                  </g>
                ) : null}

                {/* Reverted strike-through on error node */}
                {reverted ? <line x1={110} y1={node.y + 22} x2={430} y2={node.y + 22} stroke={C.red} strokeWidth={2} strokeDasharray="6 4" /> : null}
              </g>
            );
          })}

          {/* Purple reversal arrow (curved) from ERROR back to SAVEPOINT sp_b */}
          <g style={{opacity: clamp(revProg)}}>
            <path
              d={`M 75 ${PATH_NODES[5].y + 22} C 380 ${PATH_NODES[5].y + 22}, 380 ${PATH_NODES[4].y + 22}, 90 ${PATH_NODES[4].y + 22}`}
              fill="none"
              stroke={C.purple}
              strokeWidth={4}
              strokeDasharray="10 5"
              style={{filter: `drop-shadow(0 0 10px ${C.purple})`}}
            />
            {/* Arrowhead pointing into sp_b node */}
            <polygon points="95,455 95,467 84,461" fill={C.purple} transform={`translate(0, ${PATH_NODES[4].y - 455})`} />
            <text x={220} y={lerp(PATH_NODES[5].y, PATH_NODES[4].y, 0.5)} fill={C.purple} fontSize={16} fontFamily={MONO} fontWeight={700} textAnchor="middle">◄ ROLLBACK TO SAVEPOINT sp_b</text>
            <text x={220} y={lerp(PATH_NODES[5].y, PATH_NODES[4].y, 0.5) + 22} fill={C.muted} fontSize={12} fontFamily={MONO} textAnchor="middle">partial rewind · prior DML preserved</text>
          </g>

          {/* Recovery outcome banner */}
          {revProg > 0.7 ? (
            <g style={{opacity: clamp(pop(f, t(28)))}}>
              <rect x={40} y={540} width={800} height={48} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 12px ${C.green}66)`}} />
              <text x={440} y={570} fill={C.green} fontSize={16} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ Partial Rollback · INSERT + UPDATE preserved · DELETE reverted</text>
            </g>
          ) : null}
        </svg>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 14, color: C.purple, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span>SAVEPOINT ──► anchor</span>
          <span style={{color: revProg > 0.7 ? C.green : C.muted}}>{revProg > 0.7 ? '✓ partial recovery' : 'rolling back...'}</span>
          <span style={{color: C.green}}>prior DML kept ✓</span>
        </div>
      </Win>

      {/* Seal badge bottom-left */}
      <div style={{position: 'absolute', left: 80, top: 920, opacity: clamp(sealP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 22px', border: `2px solid ${C.green}`, borderRadius: 14, background: `${C.green}0d`}}>
          <Check p={sealP} size={36} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700}}>Partial Transaction Rollback ✓</div>
        </div>
      </div>

      {/* Protected chip bottom-right */}
      <div style={{position: 'absolute', right: 80, top: 920, opacity: clamp(protP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 22px', border: `2px solid ${C.purple}`, borderRadius: 14, background: `${C.purple}0d`}}>
          <Check p={protP} size={36} color={C.purple} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.purple, fontWeight: 700}}>Prior Work Protected ✓</div>
        </div>
      </div>

      <Caption text="SAVEPOINT ──► ROLLBACK TO SAVEPOINT ──► Partial Recovery · Prior DML Preserved" from={t(20)} to={sec(38)} tone="ok" />
    </Stage>
  );
};
