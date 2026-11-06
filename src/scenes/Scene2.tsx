import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, lerp, pop, sec} from '../kit';

// SC02 (40-85s): Functions vs Procedures — CREATE FUNCTION (blue) vs CREATE PROCEDURE (purple, with COMMIT/ROLLBACK)
// Anchors: 41.0 FUNCTION | 45.0 RETURNS | 52.0 PROCEDURE | 60.0 CALL | 68.0 COMMIT | 75.0 green | 80.0 seal
const S = START.s2;
const t = (g: number) => sec(g - S);

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const leftP = clamp(lin(f, t(41.5), 14));
  const rightP = clamp(lin(f, t(52), 14));
  // FUNCTION: RETURNS appears
  const retP = pop(f, t(45));
  // PROCEDURE: CALL appears
  const callP = pop(f, t(60));
  // COMMIT/ROLLBACK nodes appear
  const txP = pop(f, t(68));
  const greenP = pop(f, t(75));
  const sealP = pop(f, t(80));

  // Pulse
  const pulse = 0.5 + 0.5 * Math.sin(f * 0.17);

  return (
    <Stage dur={1350} inFx="left" outFx="left">
      <TopBadge text="الدوال مقابل الإجراءات | CREATE FUNCTION vs CREATE PROCEDURE (Returns vs CALL vs Tx Control)" from={sec(2)} to={sec(40)} color={C.purple} />

      {/* LEFT: CREATE FUNCTION (blue) — returns value, callable in SELECT, no tx control */}
      <Win x={80} y={170} w={860} h={720} title="create function (blue) ──► returns value · callable in SELECT · no tx control" accent={C.blue} opacity={leftP}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.blue}}>
          CREATE FUNCTION ──► RETURNS NUMERIC ──► callable in SELECT ──► ✗ no transaction control
        </div>

        <div style={{position: 'absolute', right: 18, top: 14, display: 'flex', gap: 10}}>
          <Chip color={C.blue} style={{fontSize: 13, padding: '4px 12px'}}>CREATE FUNCTION</Chip>
          <Chip color={C.amber} style={{fontSize: 13, padding: '4px 12px'}}>{retP > 0.05 && retP < 0.99 ? 'Returns...' : 'idle'}</Chip>
          <Chip color={C.blue} style={{fontSize: 13, padding: '4px 12px'}}>SELECT ✓</Chip>
        </div>

        {/* FUNCTION query editor (blue) */}
        <div style={{position: 'absolute', left: 18, right: 18, top: 56}}>
          <Editor
            x={0}
            y={0}
            w={824}
            h={250}
            title="function.sql · CREATE FUNCTION with RETURNS"
            lines={[
              'CREATE OR REPLACE FUNCTION fn_calc_tax(price NUMERIC)',
              'RETURNS NUMERIC AS $$',
              'BEGIN',
              '  RETURN price * 0.14;',
              'END;',
              '$$ LANGUAGE plpgsql;',
              '',
              'SELECT fn_calc_tax(100);  -- 14.00',
            ]}
            start={t(41.5)}
            cps={0.5}
            size={14}
            accent={C.blue}
            hl={1}
            hlColor={C.blue}
          />
        </div>

        {/* SVG: blue function call + RETURNS badge */}
        <svg width={824} height={340} style={{position: 'absolute', left: 18, top: 326}}>
          {/* Function node (left) */}
          <g style={{opacity: clamp(pop(f, t(41)))}}>
            <rect x={20} y={20} width={220} height={100} fill={`${C.blue}22`} stroke={C.blue} strokeWidth={3} rx={12} style={{filter: `drop-shadow(0 0 10px ${C.blue}66)`}} />
            <text x={130} y={50} fill={C.blue} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">fn_calc_tax(price)</text>
            <text x={130} y={72} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">pure computation</text>
            <text x={130} y={92} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">callable in SELECT</text>
            <text x={130} y={110} fill={C.blue} fontSize={10} fontFamily={MONO} textAnchor="middle">RETURNS NUMERIC ✓</text>
          </g>

          {/* Arrow: SELECT ──► function */}
          <g style={{opacity: clamp(pop(f, t(45)))}}>
            <line x1={240} y1={70} x2={360} y2={70} stroke={C.blue} strokeWidth={3} strokeDasharray="6 4" opacity={0.7} />
            <polygon points="354,64 354,76 368,70" fill={C.blue} />
            <text x={300} y={60} fill={C.blue} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">SELECT ✓</text>
          </g>

          {/* RETURNS badge (center) */}
          <g style={{opacity: clamp(retP)}}>
            <rect x={370} y={40} width={180} height={60} fill={`${C.blue}33`} stroke={C.blue} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 ${8 + pulse * 6}px ${C.blue})`}} />
            <text x={460} y={68} fill={C.blue} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">RETURNS NUMERIC</text>
            <text x={460} y={88} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">single value ✓</text>
          </g>

          {/* Result node (right) */}
          <g style={{opacity: clamp(retP)}}>
            <rect x={580} y={40} width={220} height={60} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} rx={10} />
            <text x={690} y={68} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">→ 14.00</text>
            <text x={690} y={88} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">returned to caller</text>
          </g>

          {/* Warning panel: no transaction control */}
          <g style={{opacity: clamp(pop(f, t(50)))}}>
            <rect x={20} y={150} width={780} height={80} fill={`${C.red}11`} stroke={C.red} strokeWidth={2} strokeDasharray="5 4" rx={10} />
            <text x={410} y={178} fill={C.red} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">⚠ No Transaction Control inside FUNCTION</text>
            <text x={410} y={200} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">cannot issue COMMIT or ROLLBACK</text>
            <text x={410} y={218} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">functions are pure · procedures own transactions</text>
          </g>

          {/* Bottom comparison row */}
          <g style={{opacity: clamp(pop(f, t(55)))}}>
            <rect x={20} y={250} width={250} height={60} fill={`${C.blue}22`} stroke={C.blue} strokeWidth={2} rx={8} />
            <text x={145} y={275} fill={C.blue} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">Must RETURN value</text>
            <text x={145} y={295} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">SELECT fn(...);</text>

            <rect x={285} y={250} width={250} height={60} fill={`${C.blue}22`} stroke={C.blue} strokeWidth={2} rx={8} />
            <text x={410} y={275} fill={C.blue} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">Callable in SELECT</text>
            <text x={410} y={295} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">inside WHERE, GROUP BY...</text>

            <rect x={550} y={250} width={250} height={60} fill={`${C.red}22`} stroke={C.red} strokeWidth={2} rx={8} />
            <text x={675} y={275} fill={C.red} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">✗ No Tx Control</text>
            <text x={675} y={295} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">no COMMIT / ROLLBACK</text>
          </g>
        </svg>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 14, color: C.blue, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span>CREATE FUNCTION</span>
          <span>RETURNS ✓</span>
          <span style={{color: C.red}}>no tx control ✗</span>
        </div>
      </Win>

      {/* RIGHT: CREATE PROCEDURE (purple) — CALL, with COMMIT and ROLLBACK nodes */}
      <Win x={980} y={170} w={860} h={720} title="create procedure (purple) ──► CALL · explicit COMMIT / ROLLBACK" accent={C.purple} opacity={rightP}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.purple}}>
          CREATE PROCEDURE ──► CALL ──► COMMIT / ROLLBACK ──► explicit transaction control ✓
        </div>

        <div style={{position: 'absolute', right: 18, top: 14, display: 'flex', gap: 10}}>
          <Chip color={C.purple} style={{fontSize: 13, padding: '4px 12px'}}>CREATE PROCEDURE</Chip>
          <Chip color={C.amber} style={{fontSize: 13, padding: '4px 12px'}}>{callP > 0.05 && callP < 0.99 ? 'Calling...' : 'idle'}</Chip>
          <Chip color={C.green} style={{fontSize: 13, padding: '4px 12px'}}>{txP > 0.5 ? 'COMMIT ✓' : '...'}</Chip>
        </div>

        {/* PROCEDURE query editor (purple) */}
        <div style={{position: 'absolute', left: 18, right: 18, top: 56}}>
          <Editor
            x={0}
            y={0}
            w={824}
            h={250}
            title="procedure.sql · CREATE PROCEDURE with COMMIT"
            lines={[
              'CREATE PROCEDURE sp_apply_bonus(p_rate NUMERIC)',
              'LANGUAGE plpgsql AS $$',
              'BEGIN',
              '  UPDATE store_customers',
              '    SET balance = balance * (1 + p_rate);',
              '  COMMIT;',
              'END; $$;',
              '',
              'CALL sp_apply_bonus(0.05);',
            ]}
            start={t(52)}
            cps={0.5}
            size={14}
            accent={C.purple}
            hl={5}
            hlColor={C.green}
          />
        </div>

        {/* SVG: purple CALL flow + COMMIT/ROLLBACK nodes */}
        <svg width={824} height={340} style={{position: 'absolute', left: 18, top: 326}}>
          {/* CALL invoker (left) */}
          <g style={{opacity: clamp(pop(f, t(52)))}}>
            <rect x={20} y={20} width={200} height={100} fill={`${C.purple}22`} stroke={C.purple} strokeWidth={3} rx={12} style={{filter: `drop-shadow(0 0 10px ${C.purple}66)`}} />
            <text x={120} y={50} fill={C.purple} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">CALL sp_apply_bonus</text>
            <text x={120} y={72} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">(0.05)</text>
            <text x={120} y={92} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">no return value</text>
            <text x={120} y={110} fill={C.purple} fontSize={10} fontFamily={MONO} textAnchor="middle">invokes procedure ✓</text>
          </g>

          {/* Arrow: CALL ──► procedure body */}
          <g style={{opacity: clamp(callP)}}>
            <line x1={220} y1={70} x2={320} y2={70} stroke={C.purple} strokeWidth={3} strokeDasharray="6 4" opacity={0.7} />
            <polygon points="314,64 314,76 328,70" fill={C.purple} />
            <text x={270} y={60} fill={C.purple} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">CALL ✓</text>
          </g>

          {/* Procedure body node (center) */}
          <g style={{opacity: clamp(callP)}}>
            <rect x={330} y={40} width={200} height={60} fill={`${C.purple}33`} stroke={C.purple} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 ${8 + pulse * 6}px ${C.purple})`}} />
            <text x={430} y={68} fill={C.purple} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">UPDATE balance</text>
            <text x={430} y={88} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">+5% to all customers</text>
          </g>

          {/* COMMIT node (top-right, green) */}
          <g style={{opacity: clamp(txP)}}>
            <line x1={530} y1={60} x2={610} y2={36} stroke={C.green} strokeWidth={2.5} strokeDasharray="5 4" opacity={0.8} />
            <rect x={610} y={16} width={190} height={56} fill={`${C.green}33`} stroke={C.green} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 10px ${C.green})`}} />
            <text x={705} y={42} fill={C.green} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">COMMIT ✓</text>
            <text x={705} y={62} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">persist all changes</text>
          </g>

          {/* ROLLBACK node (bottom-right, red) */}
          <g style={{opacity: clamp(txP)}}>
            <line x1={530} y1={80} x2={610} y2={110} stroke={C.red} strokeWidth={2.5} strokeDasharray="5 4" opacity={0.8} />
            <rect x={610} y={88} width={190} height={56} fill={`${C.red}22`} stroke={C.red} strokeWidth={3} rx={10} />
            <text x={705} y={114} fill={C.red} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">ROLLBACK</text>
            <text x={705} y={134} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">undo on error</text>
          </g>

          {/* Tx Control green panel */}
          <g style={{opacity: clamp(pop(f, t(68)))}}>
            <rect x={20} y={150} width={780} height={80} fill={`${C.green}11`} stroke={C.green} strokeWidth={2} strokeDasharray="5 4" rx={10} />
            <text x={410} y={178} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ Explicit Transaction Control inside PROCEDURE</text>
            <text x={410} y={200} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">procedure can issue COMMIT and ROLLBACK freely</text>
            <text x={410} y={218} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">ideal for batch jobs, multi-step workflows, ETL pipelines</text>
          </g>

          {/* Bottom comparison row */}
          <g style={{opacity: clamp(pop(f, t(72)))}}>
            <rect x={20} y={250} width={250} height={60} fill={`${C.amber}22`} stroke={C.amber} strokeWidth={2} rx={8} />
            <text x={145} y={275} fill={C.amber} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">No return value</text>
            <text x={145} y={295} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">CALL sp(...);</text>

            <rect x={285} y={250} width={250} height={60} fill={`${C.purple}22`} stroke={C.purple} strokeWidth={2} rx={8} />
            <text x={410} y={275} fill={C.purple} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">Called via CALL</text>
            <text x={410} y={295} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">not in SELECT</text>

            <rect x={550} y={250} width={250} height={60} fill={`${C.green}22`} stroke={C.green} strokeWidth={2} rx={8} />
            <text x={675} y={275} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">COMMIT / ROLLBACK ✓</text>
            <text x={675} y={295} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">explicit tx control</text>
          </g>
        </svg>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 14, color: C.purple, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.purple}}>CREATE PROCEDURE</span>
          <span style={{color: C.green}}>{txP > 0.5 ? 'COMMIT ✓' : 'CALL ✓'}</span>
          <span style={{color: C.green}}>tx control ✓</span>
        </div>
      </Win>

      {/* Seal badge bottom-center */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 910, display: 'flex', justifyContent: 'center', opacity: clamp(sealP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18, padding: '12px 26px', border: `3px solid ${C.green}`, borderRadius: 18, background: `${C.green}0d`, boxShadow: `0 0 32px ${C.green}44`}}>
          <Check p={sealP} size={48} color={C.green} />
          <div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 22, color: C.green, fontWeight: 700}}>Function vs Procedure Seal ✓</div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 13, color: C.muted, marginTop: 2}}>FUNCTION = returns value · SELECT · no tx · PROCEDURE = CALL · COMMIT/ROLLBACK · tx control</div>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 8, marginLeft: 16, padding: '6px 16px', border: `2px solid ${C.green}`, borderRadius: 999, background: `${C.green}1a`}}>
            <Check p={greenP} size={22} color={C.green} />
            <span dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.green, fontWeight: 700}}>Tx ✓</span>
          </div>
        </div>
      </div>

      <Caption text="CREATE FUNCTION ──► RETURNS ──► SELECT ──► CREATE PROCEDURE ──► CALL ──► COMMIT / ROLLBACK ✓" from={t(60)} to={sec(44)} tone="ok" />
    </Stage>
  );
};
