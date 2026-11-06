import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, lerp, pop, sec} from '../kit';

// SC01 (0-40s): Trigger Concept — DML beam intercepted by purple Trigger Guard shield; blue function execution path activates
// Anchors: 1.0 welcome | 5.0 triggers | 9.0 interception | 14.0 guard | 20.0 automatic | 28.0 seal | 35.0 module 14
const S = START.s1;
const t = (g: number) => sec(g - S);

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(1.5), 14));
  const trigP = clamp(lin(f, t(5), 14));
  const interceptP = clamp(lin(f, t(9), 14));
  const guardP = pop(f, t(14));
  // Auto-activation: blue function execution path activates after interception
  const autoProg = clamp(lin(f, t(20), sec(8)));
  const sealP = pop(f, t(28));
  const modP = pop(f, t(35));

  // Beam travel progress (DML query traveling toward table)
  const beamProg = clamp(lin(f, t(9), sec(6)));
  // Pulse for trigger guard
  const pulse = 0.5 + 0.5 * Math.sin(f * 0.16);

  return (
    <Stage dur={1200} inFx="zoom" outFx="left">
      <TopBadge text="مفهوم المُحفّزات | Triggers & Trigger Functions — Automatic DML Interception (Module 14 Capstone)" from={sec(2)} to={sec(18)} color={C.purple} />

      {/* LEFT: Code editor with simple trigger */}
      <div style={{opacity: editorP}}>
        <Editor
          x={80}
          y={170}
          w={680}
          h={300}
          title="Query Editor · CREATE TRIGGER (PostgreSQL 16)"
          lines={[
            'CREATE FUNCTION fn_guard() RETURNS TRIGGER',
            'AS $$ BEGIN',
            '  -- intercept DML before write',
            '  RETURN NEW;',
            'END; $$ LANGUAGE plpgsql;',
            '',
            'CREATE TRIGGER trg_guard',
            '  BEFORE INSERT OR UPDATE ON store_customers',
            '  FOR EACH ROW EXECUTE FUNCTION fn_guard();',
            '',
            '-- fires automatically · no caller needed',
          ]}
          start={t(1.5)}
          cps={0.65}
          size={15}
          accent={C.purple}
          hl={6}
          hlColor={C.purple}
        />
      </div>

      {/* Concept chips below editor */}
      <div style={{position: 'absolute', left: 80, top: 490, width: 680, opacity: clamp(lin(f, t(5), 14))}}>
        <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.muted, marginBottom: 10}}>◆ Trigger Guard golden rule</div>
        <div style={{display: 'flex', gap: 10, flexWrap: 'wrap'}}>
          <Chip color={C.purple} style={{fontSize: 16, padding: '4px 14px'}}>TRIGGER</Chip>
          <Chip color={C.blue} style={{fontSize: 16, padding: '4px 14px'}}>BEFORE ✓</Chip>
          <Chip color={C.green} style={{fontSize: 16, padding: '4px 14px'}}>AFTER ✓</Chip>
          <Chip color={C.amber} style={{fontSize: 16, padding: '4px 14px'}}>FOR EACH ROW ✓</Chip>
        </div>
      </div>

      {/* Module 14 Architecture badge panel */}
      <Win x={80} y={580} w={680} h={320} title="module 14 architecture ──► automation capstone (triggers seal)" accent={C.green} opacity={clamp(lin(f, t(9), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.green}}>
          DML query ──► trigger intercepts ──► guard validates ──► automatic execution
        </div>

        <div style={{position: 'absolute', right: 18, top: 14, display: 'flex', gap: 10}}>
          <Chip color={C.green} style={{fontSize: 13, padding: '4px 12px'}}>
            <Check p={modP} size={16} color={C.green} /> Module 14
          </Chip>
        </div>

        <svg width={640} height={220} style={{position: 'absolute', left: 20, top: 50}}>
          {/* DML source (left) */}
          <g style={{opacity: clamp(pop(f, t(9)))}}>
            <rect x={20} y={50} width={140} height={80} fill={`${C.amber}11`} stroke={C.amber} strokeWidth={2} strokeDasharray="5 4" rx={8} />
            <text x={90} y={78} fill={C.amber} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">DML query</text>
            <text x={90} y={98} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">INSERT / UPDATE</text>
            <text x={90} y={114} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">/ DELETE</text>
          </g>

          {/* Beam arrow */}
          <g style={{opacity: clamp(beamProg)}}>
            <line x1={162} y1={90} x2={230} y2={90} stroke={C.amber} strokeWidth={3} strokeDasharray="6 4" opacity={0.4 + 0.6 * beamProg} />
            <polygon points="224,84 224,96 238,90" fill={C.amber} />
            <text x={196} y={80} fill={C.amber} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">DML beam</text>
          </g>

          {/* Trigger Guard shield (center, purple) */}
          <g style={{opacity: clamp(guardP)}}>
            <path d="M 240 60 L 360 50 L 480 60 L 480 110 Q 480 150 360 165 Q 240 150 240 110 Z" fill={`${C.purple}${autoProg > 0.4 ? '44' : '11'}`} stroke={C.purple} strokeWidth={3} style={{filter: `drop-shadow(0 0 ${8 + pulse * 14}px ${C.purple})`}} />
            <text x={360} y={88} fill={C.purple} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">Trigger Guard</text>
            <text x={360} y={108} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">intercepts DML</text>
            <text x={360} y={128} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">runs fn_guard()</text>
            <text x={360} y={148} fill={C.green} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">{autoProg > 0.95 ? '✓ sealed' : 'guarding...'}</text>
          </g>

          {/* Blue function execution rays (right) */}
          <g style={{opacity: clamp(pop(f, t(20)))}}>
            <line x1={480} y1={70} x2={480 + autoProg * 100} y2={70} stroke={C.blue} strokeWidth={2.5} strokeDasharray="6 4" opacity={0.7} />
            <line x1={480} y1={90} x2={480 + autoProg * 120} y2={90} stroke={C.blue} strokeWidth={2.5} strokeDasharray="6 4" opacity={0.9} />
            <line x1={480} y1={110} x2={480 + autoProg * 100} y2={110} stroke={C.blue} strokeWidth={2.5} strokeDasharray="6 4" opacity={0.7} />
          </g>

          {/* Database disk (right) */}
          <g style={{opacity: clamp(autoProg)}}>
            <ellipse cx={560} cy={90} rx={50} ry={16} fill={`${C.green}22`} stroke={C.green} strokeWidth={2.5} />
            <path d="M 510 90 V 130 A 50 16 0 0 0 610 130 V 90" fill={`${C.green}22`} stroke={C.green} strokeWidth={2.5} />
            <ellipse cx={560} cy={105} rx={50} ry={16} fill="none" stroke={C.green} strokeWidth={1.5} opacity={0.6} />
            <ellipse cx={560} cy={120} rx={50} ry={16} fill="none" stroke={C.green} strokeWidth={1.5} opacity={0.4} />
            <text x={560} y={160} fill={C.green} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">store_customers</text>
          </g>

          {/* Bottom caption */}
          <text x={310} y={200} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">triggers fire automatically ✓</text>
        </svg>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 14, color: C.green, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span>DML ──► trigger</span>
          <span>guard ✓</span>
        </div>
      </Win>

      {/* RIGHT: Big visualization — DML beam intercepted by Trigger Guard shield */}
      <Win x={800} y={170} w={1040} h={720} title="trigger concept ──► DML beam (amber) ──► purple Trigger Guard shield ──► blue function execution path" accent={C.purple} opacity={interceptP}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.purple}}>
          DML query (amber) ──► intercepted by Trigger Guard shield (purple) ──► blue function execution path activates
        </div>

        <div style={{position: 'absolute', right: 18, top: 14, display: 'flex', gap: 10}}>
          <Chip color={C.amber} style={{fontSize: 13, padding: '4px 12px'}}>DML Beam</Chip>
          <Chip color={C.purple} style={{fontSize: 13, padding: '4px 12px'}}>{beamProg > 0.05 && beamProg < 0.99 ? 'Intercepting...' : 'idle'}</Chip>
          <Chip color={C.blue} style={{fontSize: 13, padding: '4px 12px'}}>{autoProg > 0.95 ? 'Function ✓' : '...'}</Chip>
        </div>

        <svg width={1000} height={600} style={{position: 'absolute', left: 20, top: 60}}>
          {/* DML source (left) */}
          <g style={{opacity: clamp(pop(f, t(5)))}}>
            <rect x={50} y={240} width={200} height={120} fill={`${C.amber}11`} stroke={C.amber} strokeWidth={3} strokeDasharray="8 6" rx={14} style={{filter: `drop-shadow(0 0 ${10 + pulse * 6}px ${C.amber}66)`}} />
            <text x={150} y={278} fill={C.amber} fontSize={16} fontFamily={MONO} fontWeight={700} textAnchor="middle">DML Query</text>
            <text x={150} y={300} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">INSERT / UPDATE / DELETE</text>
            <text x={150} y={318} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">targeting store_customers</text>
            <text x={150} y={340} fill={C.amber} fontSize={10} fontFamily={MONO} textAnchor="middle">⏱ wants to write</text>
          </g>

          {/* Amber DML beam (left → right) traveling toward guard */}
          <g style={{opacity: clamp(pop(f, t(9)))}}>
            <line x1={250} y1={300} x2={250 + beamProg * 200} y2={300} stroke={C.amber} strokeWidth={5} strokeDasharray="10 6" opacity={0.8} style={{filter: `drop-shadow(0 0 6px ${C.amber})`}} />
            <polygon points={`${250 + beamProg * 200 - 6},294 ${250 + beamProg * 200 - 6},306 ${250 + beamProg * 200 + 4},300`} fill={C.amber} />
            <text x={350} y={290} fill={C.amber} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">DML beam ──►</text>
            <text x={350} y={326} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">fired by user / app</text>
          </g>

          {/* Trigger Guard shield (center, purple) - grows solid as interception completes */}
          <g style={{opacity: clamp(pop(f, t(14)))}}>
            <path d="M 470 180 L 720 180 L 720 320 Q 720 400 595 430 Q 470 400 470 320 Z" fill={`${C.purple}${beamProg > 0.5 ? '44' : '11'}`} stroke={C.purple} strokeWidth={4} style={{filter: `drop-shadow(0 0 ${10 + beamProg * 14}px ${C.purple})`}} />
            <text x={595} y={210} fill={C.purple} fontSize={15} fontFamily={MONO} fontWeight={700} textAnchor="middle">Trigger Guard</text>
            <text x={595} y={232} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">intercepts DML automatically</text>

            {/* Shield content rows */}
            {[
              {label: 'CREATE TRIGGER', c: C.purple},
              {label: 'BEFORE / AFTER', c: C.blue},
              {label: 'FOR EACH ROW', c: C.green},
              {label: 'EXECUTE FUNCTION', c: C.amber},
            ].map((row, i) => {
              const rowP = clamp((beamProg - i * 0.1) * 1.5);
              return (
                <g key={i} style={{opacity: clamp(rowP)}}>
                  <rect x={490} y={250 + i * 32} width={210} height={28} fill={`${row.c}22`} stroke={row.c} strokeWidth={1} rx={4} />
                  <text x={595} y={268 + i * 32} fill={row.c} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">{row.label}</text>
                </g>
              );
            })}
            <text x={595} y={412} fill={C.purple} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">guard validates & modifies</text>
          </g>

          {/* Blue function execution rays bursting from shield */}
          <g style={{opacity: clamp(pop(f, t(20)))}}>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
              const len = autoProg * 200 * (0.6 + (i % 3) * 0.18);
              return (
                <line
                  key={i}
                  x1={720}
                  y1={200 + i * 28}
                  x2={720 + len}
                  y2={200 + i * 28}
                  stroke={C.blue}
                  strokeWidth={2.5}
                  strokeDasharray="8 5"
                  opacity={0.4 + 0.5 * autoProg}
                  style={{filter: `drop-shadow(0 0 4px ${C.blue}88)`}}
                />
              );
            })}
            <text x={820} y={150} fill={C.blue} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">⚡ Function Execution Path</text>
          </g>

          {/* Database disk (right) */}
          <g style={{opacity: clamp(autoProg)}}>
            <ellipse cx={910} cy={300} rx={70} ry={22} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} />
            <path d="M 840 300 V 380 A 70 22 0 0 0 980 380 V 300" fill={`${C.green}22`} stroke={C.green} strokeWidth={3} />
            <ellipse cx={910} cy={325} rx={70} ry={22} fill="none" stroke={C.green} strokeWidth={2} opacity={0.6} />
            <ellipse cx={910} cy={350} rx={70} ry={22} fill="none" stroke={C.green} strokeWidth={2} opacity={0.4} />
            <text x={910} y={300} fill={C.green} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">database</text>
            <text x={910} y={320} fill={C.green} fontSize={10} fontFamily={MONO} textAnchor="middle">PostgreSQL 16</text>
            <text x={910} y={420} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">{autoProg > 0.95 ? '✓ trigger sealed' : `auto-firing... ${Math.round(autoProg * 100)}%`}</text>
          </g>

          {/* Auto-fire beam */}
          <g style={{opacity: clamp(pop(f, t(20)))}}>
            <line x1={720} y1={300} x2={840} y2={300} stroke={C.blue} strokeWidth={4} strokeDasharray="6 4" opacity={0.4 + 0.6 * autoProg} />
            <polygon points="834,294 834,306 848,300" fill={C.blue} />
            <text x={780} y={290} fill={C.blue} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">auto ──►</text>
          </g>

          {/* Result banner */}
          {autoProg > 0.95 ? (
            <g style={{opacity: clamp(pop(f, t(26)))}}>
              <rect x={250} y={500} width={500} height={50} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 12px ${C.green})`}} />
              <text x={500} y={532} fill={C.green} fontSize={15} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ Trigger Sealed · Automatic DML Interception · Zero Caller Code · Module 14 Capstone</text>
            </g>
          ) : null}

          {/* Status text */}
          <text x={500} y={580} fill={C.muted} fontSize={13} fontFamily={MONO} textAnchor="middle">
            {beamProg < 0.3 ? 'DML query fired...' : beamProg < 0.9 ? 'trigger guard intercepting...' : autoProg < 0.5 ? 'function path activating...' : '✓ trigger sealed · automatic execution'}
          </text>
        </svg>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 16, fontWeight: 700, paddingTop: 8, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.amber}}>DML · user-fired</span>
          <span style={{color: autoProg >= 1 ? C.green : C.purple, opacity: clamp(pop(f, t(20)))}}>
            {autoProg >= 1 ? '✓ trigger sealed' : autoProg > 0 ? `auto-firing... ${Math.round(autoProg * 100)}%` : 'intercepted'}
          </span>
          <span style={{color: C.green}}>Automatic ✓</span>
        </div>
      </Win>

      {/* Seal badge bottom-left */}
      <div style={{position: 'absolute', left: 80, top: 920, opacity: clamp(sealP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 22px', border: `2px solid ${C.purple}`, borderRadius: 14, background: `${C.purple}0d`}}>
          <Check p={sealP} size={36} color={C.purple} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.purple, fontWeight: 700}}>Trigger Guard · Sealed ✓</div>
        </div>
      </div>

      {/* Module 14 Automation Capstone chip bottom-right */}
      <div style={{position: 'absolute', right: 80, top: 920, opacity: clamp(modP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 22px', border: `2px solid ${C.green}`, borderRadius: 14, background: `${C.green}0d`}}>
          <Check p={modP} size={36} color={C.green} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700}}>Module 14 Automation Capstone ✓</div>
        </div>
      </div>

      <Caption text="CREATE TRIGGER ──► DML Interception ──► Trigger Guard ──► Automatic Execution ──► Module 14 ✓" from={t(20)} to={sec(38)} tone="ok" />
    </Stage>
  );
};
