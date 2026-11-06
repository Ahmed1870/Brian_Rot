import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {TRIGGER_TIMINGS} from '../data';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, lerp, pop, sec} from '../kit';

// SC02 (40-85s): Trigger Timings & Scope — BEFORE (blue) / AFTER (green) / INSTEAD OF (purple) + FOR EACH ROW vs FOR EACH STATEMENT
// Anchors: 41.0 BEFORE | 45.0 AFTER | 52.0 INSTEAD OF | 60.0 FOR EACH ROW | 68.0 STATEMENT | 75.0 scope | 80.0 seal
const S = START.s2;
const t = (g: number) => sec(g - S);

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const beforeP = pop(f, t(41));
  const afterP = pop(f, t(45));
  const insteadP = pop(f, t(52));
  const rowP = pop(f, t(60));
  const stmtP = pop(f, t(68));
  const scopeP = pop(f, t(75));
  const sealP = pop(f, t(80));

  // Pulse
  const pulse = 0.5 + 0.5 * Math.sin(f * 0.17);

  return (
    <Stage dur={1350} inFx="left" outFx="left">
      <TopBadge text="توقيتات المُحفّزات ونطاقها | Trigger Timings (BEFORE · AFTER · INSTEAD OF) & Scope (ROW vs STATEMENT)" from={sec(2)} to={sec(40)} color={C.blue} />

      {/* LEFT: Trigger timings diagram - 3 timing paths */}
      <Win x={80} y={170} w={1080} h={540} title="trigger timings ──► BEFORE (blue) · AFTER (green) · INSTEAD OF (purple)" accent={C.blue} opacity={clamp(lin(f, t(41.5), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.blue}}>
          DML ──► BEFORE trigger (validate) ──► write to disk ──► AFTER trigger (audit)  ·  INSTEAD OF routes to views
        </div>

        <div style={{position: 'absolute', right: 18, top: 14, display: 'flex', gap: 10}}>
          <Chip color={C.blue} style={{fontSize: 13, padding: '4px 12px'}}>BEFORE</Chip>
          <Chip color={C.green} style={{fontSize: 13, padding: '4px 12px'}}>AFTER</Chip>
          <Chip color={C.purple} style={{fontSize: 13, padding: '4px 12px'}}>INSTEAD OF</Chip>
        </div>

        {/* SVG: 3 timing paths */}
        <svg width={1040} height={460} style={{position: 'absolute', left: 18, top: 60}}>
          {/* DML source (left) */}
          <g style={{opacity: clamp(beforeP)}}>
            <rect x={20} y={200} width={140} height={60} fill={`${C.amber}22`} stroke={C.amber} strokeWidth={3} rx={10} />
            <text x={90} y={225} fill={C.amber} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">DML</text>
            <text x={90} y={245} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">INSERT/UPDATE</text>
          </g>

          {/* === BEFORE path (top, blue) === */}
          <g style={{opacity: clamp(beforeP)}}>
            <line x1={160} y1={70} x2={160} y2={70} stroke={C.blue} strokeWidth={2} opacity={0} />
            <path d="M 160 200 Q 200 100 280 70" stroke={C.blue} strokeWidth={3} strokeDasharray="6 4" fill="none" opacity={0.7} />
            <rect x={280} y={40} width={220} height={60} fill={`${C.blue}33`} stroke={C.blue} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 ${8 + pulse * 6}px ${C.blue})`}} />
            <text x={390} y={65} fill={C.blue} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">BEFORE Trigger</text>
            <text x={390} y={85} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">validate &amp; modify NEW</text>

            {/* Arrow down to disk */}
            <path d="M 500 70 Q 600 70 660 200" stroke={C.blue} strokeWidth={3} strokeDasharray="6 4" fill="none" opacity={0.7} />
            <text x={580} y={60} fill={C.blue} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">pre-write ✓</text>
          </g>

          {/* Disk write (center) */}
          <g style={{opacity: clamp(beforeP)}}>
            <ellipse cx={700} cy={230} rx={60} ry={20} fill={`${C.amber}22`} stroke={C.amber} strokeWidth={3} />
            <path d="M 640 230 V 290 A 60 20 0 0 0 760 290 V 230" fill={`${C.amber}22`} stroke={C.amber} strokeWidth={3} />
            <ellipse cx={700} cy={250} rx={60} ry={20} fill="none" stroke={C.amber} strokeWidth={2} opacity={0.6} />
            <text x={700} y={230} fill={C.amber} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">disk write</text>
            <text x={700} y={320} fill={C.amber} fontSize={10} fontFamily={MONO} textAnchor="middle">PostgreSQL 16</text>
          </g>

          {/* === AFTER path (middle, green) === */}
          <g style={{opacity: clamp(afterP)}}>
            <path d="M 760 230 Q 820 230 880 200" stroke={C.green} strokeWidth={3} strokeDasharray="6 4" fill="none" opacity={0.7} />
            <rect x={880} y={170} width={140} height={60} fill={`${C.green}33`} stroke={C.green} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 ${8 + pulse * 6}px ${C.green})`}} />
            <text x={950} y={195} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">AFTER Trigger</text>
            <text x={950} y={215} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">log &amp; audit</text>
            <text x={950} y={150} fill={C.green} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">post-write ✓</text>
          </g>

          {/* === INSTEAD OF path (bottom, purple) === */}
          <g style={{opacity: clamp(insteadP)}}>
            <path d="M 160 230 Q 200 380 280 410" stroke={C.purple} strokeWidth={3} strokeDasharray="6 4" fill="none" opacity={0.7} />
            <rect x={280} y={380} width={240} height={60} fill={`${C.purple}33`} stroke={C.purple} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 ${8 + pulse * 6}px ${C.purple})`}} />
            <text x={400} y={405} fill={C.purple} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">INSTEAD OF Trigger</text>
            <text x={400} y={425} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">route DML to views</text>

            {/* Arrow to view node */}
            <line x1={520} y1={410} x2={620} y2={410} stroke={C.purple} strokeWidth={3} strokeDasharray="6 4" opacity={0.7} />
            <polygon points="614,404 614,416 628,410" fill={C.purple} />
            <text x={570} y={400} fill={C.purple} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">route ──►</text>

            <rect x={620} y={380} width={120} height={60} fill={`${C.purple}11`} stroke={C.purple} strokeWidth={2} strokeDasharray="5 4" rx={8} />
            <text x={680} y={405} fill={C.purple} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">VIEW</text>
            <text x={680} y={425} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">updatable</text>
          </g>

          {/* Bottom legend */}
          <text x={520} y={445} fill={C.text} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">BEFORE = pre-write validation  ·  AFTER = post-commit audit  ·  INSTEAD OF = view routing</text>
        </svg>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 36, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 13, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.blue}}>BEFORE · validate</span>
          <span style={{color: C.green}}>AFTER · audit</span>
          <span style={{color: C.purple}}>INSTEAD OF · views</span>
        </div>
      </Win>

      {/* LEFT-BOTTOM: Row vs Statement editor */}
      <div style={{opacity: clamp(rowP)}}>
        <Editor
          x={80}
          y={730}
          w={1080}
          h={170}
          title="scope.sql · FOR EACH ROW vs FOR EACH STATEMENT"
          lines={[
            'CREATE TRIGGER trg_row BEFORE UPDATE ON store_customers',
            '  FOR EACH ROW EXECUTE FUNCTION fn_validate();   -- fires once per affected row',
            'CREATE TRIGGER trg_stmt AFTER UPDATE ON store_customers',
            '  FOR EACH STATEMENT EXECUTE FUNCTION fn_audit_batch();   -- fires once per statement',
          ]}
          start={t(60)}
          cps={0.45}
          size={14}
          accent={C.amber}
          hl={1}
          hlColor={C.blue}
        />
      </div>

      {/* RIGHT: FOR EACH ROW vs FOR EACH STATEMENT visualization */}
      <Win x={1180} y={170} w={660} h={720} title="trigger scope ──► FOR EACH ROW (per-row) vs FOR EACH STATEMENT (once)" accent={C.amber} opacity={clamp(lin(f, t(60), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.amber}}>
          FOR EACH ROW ──► fires N times  ·  FOR EACH STATEMENT ──► fires ONCE per statement
        </div>

        <div style={{position: 'absolute', right: 18, top: 14, display: 'flex', gap: 10}}>
          <Chip color={C.blue} style={{fontSize: 13, padding: '4px 12px'}}>ROW</Chip>
          <Chip color={C.green} style={{fontSize: 13, padding: '4px 12px'}}>STATEMENT</Chip>
        </div>

        {/* SVG: row iteration vs statement batch */}
        <svg width={620} height={580} style={{position: 'absolute', left: 18, top: 60}}>
          {/* === FOR EACH ROW (top, blue) === */}
          <g style={{opacity: clamp(rowP)}}>
            <text x={20} y={20} fill={C.blue} fontSize={14} fontFamily={MONO} fontWeight={700}>FOR EACH ROW</text>
            <text x={20} y={40} fill={C.muted} fontSize={11} fontFamily={MONO}>fires once per affected row</text>

            {/* Source statement */}
            <rect x={20} y={56} width={180} height={50} fill={`${C.amber}22`} stroke={C.amber} strokeWidth={2.5} rx={8} />
            <text x={110} y={80} fill={C.amber} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">UPDATE ... WHERE id IN (1,2,3,4)</text>
            <text x={110} y={97} fill={C.muted} fontSize={9} fontFamily={MONO} textAnchor="middle">affects 4 rows</text>

            {/* Row iteration arrows */}
            {[0, 1, 2, 3].map((i) => {
              const rowFire = clamp(rowP - i * 0.08);
              return (
                <g key={i} style={{opacity: clamp(rowFire)}}>
                  <line x1={200} y1={81 + (i - 1.5) * 14} x2={280} y2={81 + (i - 1.5) * 14} stroke={C.blue} strokeWidth={2.5} strokeDasharray="5 3" opacity={0.7} />
                  <polygon points={`276,${81 + (i - 1.5) * 14 - 4} 276,${81 + (i - 1.5) * 14 + 4} 288,${81 + (i - 1.5) * 14}`} fill={C.blue} />
                  <rect x={290} y={66 + (i - 1.5) * 14} width={170} height={28} fill={`${C.blue}22`} stroke={C.blue} strokeWidth={1.5} rx={6} />
                  <text x={375} y={84 + (i - 1.5) * 14} fill={C.blue} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">fn() · row #{i + 1}</text>
                </g>
              );
            })}

            <text x={375} y={150} fill={C.blue} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">→ fires N times ✓</text>
          </g>

          {/* Divider */}
          <line x1={20} y1={180} x2={600} y2={180} stroke={C.border} strokeWidth={2} strokeDasharray="4 4" opacity={0.5} />

          {/* === FOR EACH STATEMENT (bottom, green) === */}
          <g style={{opacity: clamp(stmtP)}}>
            <text x={20} y={210} fill={C.green} fontSize={14} fontFamily={MONO} fontWeight={700}>FOR EACH STATEMENT</text>
            <text x={20} y={230} fill={C.muted} fontSize={11} fontFamily={MONO}>fires ONCE regardless of row count</text>

            {/* Source statement */}
            <rect x={20} y={246} width={180} height={50} fill={`${C.amber}22`} stroke={C.amber} strokeWidth={2.5} rx={8} />
            <text x={110} y={270} fill={C.amber} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">UPDATE ... WHERE id IN (1,2,3,4)</text>
            <text x={110} y={287} fill={C.muted} fontSize={9} fontFamily={MONO} textAnchor="middle">affects 4 rows</text>

            {/* Single arrow */}
            <g style={{opacity: clamp(stmtP)}}>
              <line x1={200} y1={271} x2={290} y2={271} stroke={C.green} strokeWidth={4} strokeDasharray="6 4" opacity={0.8} style={{filter: `drop-shadow(0 0 4px ${C.green})`}} />
              <polygon points="286,265 286,277 300,271" fill={C.green} />
              <text x={245} y={261} fill={C.green} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">once</text>
            </g>

            {/* Single fire node */}
            <rect x={300} y={246} width={260} height={50} fill={`${C.green}33`} stroke={C.green} strokeWidth={3} rx={8} style={{filter: `drop-shadow(0 0 ${8 + pulse * 6}px ${C.green})`}} />
            <text x={430} y={270} fill={C.green} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">fn_audit_batch() · single call</text>
            <text x={430} y={288} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">regardless of affected rows</text>

            <text x={430} y={322} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">→ fires ONCE ✓</text>
          </g>

          {/* Comparison panel */}
          <g style={{opacity: clamp(scopeP)}}>
            <rect x={20} y={360} width={580} height={150} fill={`${C.amber}0d`} stroke={C.amber} strokeWidth={2} strokeDasharray="5 4" rx={10} />
            <text x={310} y={388} fill={C.amber} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">⚠ Scope selection guide</text>
            <text x={310} y={412} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">ROW: per-row validation, modifying NEW/OLD, cascading logic</text>
            <text x={310} y={432} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">STATEMENT: batch audit, summary aggregation, single-shot init</text>
            <text x={310} y={458} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">ROW has NEW/OLD context  ·  STATEMENT has no row-level context</text>
            <text x={310} y={478} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">→ choose based on whether you need per-row visibility</text>
          </g>
        </svg>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 36, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 13, color: C.amber, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.blue}}>ROW · N fires</span>
          <span style={{color: C.green}}>STATEMENT · 1 fire</span>
        </div>
      </Win>

      {/* Seal badge bottom-center */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 910, display: 'flex', justifyContent: 'center', opacity: clamp(sealP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18, padding: '12px 26px', border: `3px solid ${C.green}`, borderRadius: 18, background: `${C.green}0d`, boxShadow: `0 0 32px ${C.green}44`}}>
          <Check p={sealP} size={48} color={C.green} />
          <div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 22, color: C.green, fontWeight: 700}}>Trigger Timings &amp; Scope Seal ✓</div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 13, color: C.muted, marginTop: 2}}>BEFORE · AFTER · INSTEAD OF  ·  FOR EACH ROW  ·  FOR EACH STATEMENT — complete trigger control</div>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 8, marginLeft: 16, padding: '6px 16px', border: `2px solid ${C.green}`, borderRadius: 999, background: `${C.green}1a`}}>
            <Check p={scopeP} size={22} color={C.green} />
            <span dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.green, fontWeight: 700}}>Scope ✓</span>
          </div>
        </div>
      </div>

      <Caption text="BEFORE ──► AFTER ──► INSTEAD OF ──► FOR EACH ROW ──► FOR EACH STATEMENT ──► Trigger Scope ✓" from={t(60)} to={sec(44)} tone="ok" />
    </Stage>
  );
};
