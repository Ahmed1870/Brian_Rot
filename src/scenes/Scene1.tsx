import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, lerp, pop, sec} from '../kit';

// SC01 (0-40s): Server-Side Programming Concept — External app queries collapse into PL/pgSQL Engine capsule
// Anchors: 1.0 welcome | 5.0 PL/pgSQL | 9.0 server-side | 14.0 logic | 20.0 engine | 28.0 seal | 35.0 module 15
const S = START.s1;
const t = (g: number) => sec(g - S);

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(1.5), 14));
  const pgP = clamp(lin(f, t(5), 14));
  const srvP = clamp(lin(f, t(9), 14));
  const logicP = pop(f, t(14));
  // Collapse animation: external app queries (red) -> PL/pgSQL Engine capsule (purple)
  const collapseProg = clamp(lin(f, t(20), sec(8)));
  const engineP = pop(f, t(20));
  const sealP = pop(f, t(28));
  const modP = pop(f, t(35));

  // Pulse for engine capsule
  const pulse = 0.5 + 0.5 * Math.sin(f * 0.16);

  return (
    <Stage dur={1200} inFx="zoom" outFx="left">
      <TopBadge text="البرمجة من جانب الخادم | Server-Side Programming — PL/pgSQL Engine &amp; Module 15 Start" from={sec(2)} to={sec(18)} color={C.purple} />

      {/* LEFT: Code editor with a simple PL/pgSQL function */}
      <div style={{opacity: editorP}}>
        <Editor
          x={80}
          y={170}
          w={680}
          h={300}
          title="Query Editor · CREATE OR REPLACE FUNCTION (PL/pgSQL)"
          lines={[
            'CREATE OR REPLACE FUNCTION fn_tax(p NUMERIC)',
            'RETURNS NUMERIC AS $$',
            'BEGIN',
            '  RETURN p * 0.14;',
            'END;',
            '$$ LANGUAGE plpgsql;',
            '',
            '-- runs inside the database engine',
            '-- callable via SELECT fn_tax(100);',
          ]}
          start={t(1.5)}
          cps={0.7}
          size={15}
          accent={C.purple}
          hl={0}
          hlColor={C.purple}
        />
      </div>

      {/* Concept chips below editor */}
      <div style={{position: 'absolute', left: 80, top: 490, width: 680, opacity: clamp(lin(f, t(5), 14))}}>
        <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.muted, marginBottom: 10}}>◆ PL/pgSQL engine golden rule</div>
        <div style={{display: 'flex', gap: 10, flexWrap: 'wrap'}}>
          <Chip color={C.purple} style={{fontSize: 16, padding: '4px 14px'}}>PL/pgSQL</Chip>
          <Chip color={C.amber} style={{fontSize: 16, padding: '4px 14px'}}>Server-Side ✓</Chip>
          <Chip color={C.green} style={{fontSize: 16, padding: '4px 14px'}}>In-Engine ✓</Chip>
          <Chip color={C.blue} style={{fontSize: 16, padding: '4px 14px'}}>No Network ✓</Chip>
        </div>
      </div>

      {/* Module 15 Architecture badge panel */}
      <Win x={80} y={580} w={680} h={320} title="module 15 architecture ──► server-side programming foundation" accent={C.green} opacity={clamp(lin(f, t(9), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.green}}>
          external app ──► slow network queries ──► collapse ──► PL/pgSQL engine capsule
        </div>

        <div style={{position: 'absolute', right: 18, top: 14, display: 'flex', gap: 10}}>
          <Chip color={C.green} style={{fontSize: 13, padding: '4px 12px'}}>
            <Check p={modP} size={16} color={C.green} /> Module 15
          </Chip>
        </div>

        <svg width={640} height={220} style={{position: 'absolute', left: 20, top: 50}}>
          {/* External app (left, faded as collapse progresses) */}
          <g style={{opacity: clamp(1 - collapseProg * 0.7)}}>
            <rect x={20} y={50} width={140} height={80} fill={`${C.red}11`} stroke={C.red} strokeWidth={2} strokeDasharray="5 4" rx={8} />
            <text x={90} y={78} fill={C.red} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">external app</text>
            <text x={90} y={98} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">queries over</text>
            <text x={90} y={114} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">slow network</text>
          </g>

          {/* Collapse arrow */}
          <g style={{opacity: clamp(pop(f, t(14)))}}>
            <line x1={162} y1={90} x2={230} y2={90} stroke={C.purple} strokeWidth={3} strokeDasharray="6 4" opacity={0.4 + 0.6 * collapseProg} />
            <polygon points="224,84 224,96 238,90" fill={C.purple} />
            <text x={196} y={80} fill={C.purple} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">collapse</text>
          </g>

          {/* PL/pgSQL Engine capsule (center, grows solid) */}
          <rect x={240} y={50} width={140} height={80} fill={`${C.purple}${collapseProg > 0.4 ? '44' : '11'}`} stroke={C.purple} strokeWidth={3} rx={40} style={{filter: `drop-shadow(0 0 ${8 + collapseProg * 14}px ${C.purple})`}} />
          <text x={310} y={78} fill={C.purple} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">PL/pgSQL Engine</text>
          <text x={310} y={98} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">server-side</text>
          <text x={310} y={114} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">in-database logic</text>

          {/* Green speed rays (right) */}
          <g style={{opacity: clamp(engineP)}}>
            <line x1={380} y1={70} x2={380 + collapseProg * 100} y2={70} stroke={C.green} strokeWidth={2.5} strokeDasharray="6 4" opacity={0.7} />
            <line x1={380} y1={90} x2={380 + collapseProg * 120} y2={90} stroke={C.green} strokeWidth={2.5} strokeDasharray="6 4" opacity={0.9} />
            <line x1={380} y1={110} x2={380 + collapseProg * 100} y2={110} stroke={C.green} strokeWidth={2.5} strokeDasharray="6 4" opacity={0.7} />
          </g>

          {/* Database disk (right) */}
          <g style={{opacity: clamp(engineP)}}>
            <ellipse cx={560} cy={90} rx={50} ry={16} fill={`${C.amber}22`} stroke={C.amber} strokeWidth={2.5} />
            <path d="M 510 90 V 130 A 50 16 0 0 0 610 130 V 90" fill={`${C.amber}22`} stroke={C.amber} strokeWidth={2.5} />
            <ellipse cx={560} cy={105} rx={50} ry={16} fill="none" stroke={C.amber} strokeWidth={1.5} opacity={0.6} />
            <ellipse cx={560} cy={120} rx={50} ry={16} fill="none" stroke={C.amber} strokeWidth={1.5} opacity={0.4} />
            <text x={560} y={160} fill={C.amber} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">database engine</text>
          </g>

          {/* Bottom caption */}
          <text x={310} y={200} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">logic lives where the data lives ✓</text>
        </svg>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 14, color: C.green, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span>external ──► server-side</span>
          <span>engine ✓</span>
        </div>
      </Win>

      {/* RIGHT: Big visualization — external app collapsing into PL/pgSQL engine capsule */}
      <Win x={800} y={170} w={1040} h={720} title="server-side programming ──► external app collapses into PL/pgSQL engine capsule" accent={C.purple} opacity={srvP}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.purple}}>
          slow external queries (red) ──► collapse ──► PL/pgSQL engine capsule ──► green speed rays
        </div>

        <div style={{position: 'absolute', right: 18, top: 14, display: 'flex', gap: 10}}>
          <Chip color={C.red} style={{fontSize: 13, padding: '4px 12px'}}>External App</Chip>
          <Chip color={C.purple} style={{fontSize: 13, padding: '4px 12px'}}>{collapseProg > 0.05 ? 'Collapsing...' : 'idle'}</Chip>
          <Chip color={C.green} style={{fontSize: 13, padding: '4px 12px'}}>{collapseProg > 0.95 ? 'Engine ✓' : '...'}</Chip>
        </div>

        <svg width={1000} height={600} style={{position: 'absolute', left: 20, top: 60}}>
          {/* External app (left, fades as collapse progresses) */}
          <g style={{opacity: clamp(1 - collapseProg * 0.8)}}>
            <rect x={50} y={240} width={200} height={120} fill={`${C.red}11`} stroke={C.red} strokeWidth={3} strokeDasharray="8 6" rx={14} style={{filter: `drop-shadow(0 0 ${10 + pulse * 6}px ${C.red}66)`}} />
            <text x={150} y={278} fill={C.red} fontSize={16} fontFamily={MONO} fontWeight={700} textAnchor="middle">External App</text>
            <text x={150} y={300} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">sends raw queries</text>
            <text x={150} y={318} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle">over slow network</text>
            <text x={150} y={340} fill={C.red} fontSize={10} fontFamily={MONO} textAnchor="middle">⏱ 4.8s round trip</text>
          </g>

          {/* Slow red network queries (left → right) — fade as collapse progresses */}
          <g style={{opacity: clamp(1 - collapseProg)}}>
            {[260, 290, 320, 350].map((y, i) => (
              <g key={i}>
                <line x1={250} y1={y} x2={430} y2={y} stroke={C.red} strokeWidth={2.5} strokeDasharray="10 6" opacity={0.6} />
                <polygon points="424,294 424,306 438,300" fill={C.red} transform={`translate(0, ${y - 300})`} />
                <text x={340} y={y - 8} fill={C.red} fontSize={10} fontFamily={MONO} textAnchor="middle">SELECT * FROM ...</text>
              </g>
            ))}
          </g>

          {/* Collapse arrow */}
          <g style={{opacity: clamp(pop(f, t(14)))}}>
            <line x1={250} y1={300} x2={430} y2={300} stroke={C.purple} strokeWidth={4} strokeDasharray="8 4" opacity={0.4 + 0.6 * collapseProg} />
            <polygon points="424,294 424,306 438,300" fill={C.purple} />
            <text x={340} y={288} fill={C.purple} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">collapse ──►</text>
            <text x={340} y={326} fill={C.amber} fontSize={10} fontFamily={MONO} textAnchor="middle">move logic inside engine</text>
          </g>

          {/* PL/pgSQL Engine capsule (center) - grows solid as collapse progresses */}
          <g style={{opacity: clamp(pop(f, t(20)))}}>
            <rect x={450} y={180} width={280} height={240} rx={120} fill={`${C.purple}${collapseProg > 0.5 ? '44' : '11'}`} stroke={C.purple} strokeWidth={4} style={{filter: `drop-shadow(0 0 ${10 + collapseProg * 14}px ${C.purple})`}} />
            <text x={590} y={210} fill={C.purple} fontSize={15} fontFamily={MONO} fontWeight={700} textAnchor="middle">PL/pgSQL Engine</text>
            <text x={590} y={230} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">server-side logic capsule</text>

            {/* Engine content rows */}
            {[
              {label: 'CREATE FUNCTION', c: C.blue},
              {label: 'CREATE PROCEDURE', c: C.purple},
              {label: 'DECLARE ... BEGIN', c: C.green},
              {label: 'COMMIT / ROLLBACK', c: C.amber},
            ].map((row, i) => {
              const rowP = clamp((collapseProg - i * 0.1) * 1.5);
              return (
                <g key={i} style={{opacity: clamp(rowP)}}>
                  <rect x={470} y={250 + i * 32} width={240} height={28} fill={`${row.c}22`} stroke={row.c} strokeWidth={1} rx={4} />
                  <text x={590} y={268 + i * 32} fill={row.c} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">{row.label}</text>
                </g>
              );
            })}
            <text x={590} y={406} fill={C.purple} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">logic lives with the data</text>
          </g>

          {/* Green speed rays bursting from capsule */}
          <g style={{opacity: clamp(pop(f, t(20)))}}>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
              const len = collapseProg * 200 * (0.6 + (i % 3) * 0.18);
              return (
                <line
                  key={i}
                  x1={730}
                  y1={200 + i * 28}
                  x2={730 + len}
                  y2={200 + i * 28}
                  stroke={C.green}
                  strokeWidth={2.5}
                  strokeDasharray="8 5"
                  opacity={0.4 + 0.5 * collapseProg}
                  style={{filter: `drop-shadow(0 0 4px ${C.green}88)`}}
                />
              );
            })}
            <text x={830} y={150} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">⚡ In-Engine Execution</text>
          </g>

          {/* Database disk (right) */}
          <g style={{opacity: clamp(engineP)}}>
            <ellipse cx={910} cy={300} rx={70} ry={22} fill={`${C.amber}22`} stroke={C.amber} strokeWidth={3} />
            <path d="M 840 300 V 380 A 70 22 0 0 0 980 380 V 300" fill={`${C.amber}22`} stroke={C.amber} strokeWidth={3} />
            <ellipse cx={910} cy={325} rx={70} ry={22} fill="none" stroke={C.amber} strokeWidth={2} opacity={0.6} />
            <ellipse cx={910} cy={350} rx={70} ry={22} fill="none" stroke={C.amber} strokeWidth={2} opacity={0.4} />
            <text x={910} y={300} fill={C.amber} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">database</text>
            <text x={910} y={320} fill={C.amber} fontSize={10} fontFamily={MONO} textAnchor="middle">PostgreSQL 16</text>
            <text x={910} y={420} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">{collapseProg > 0.95 ? '✓ engine sealed' : `collapsing... ${Math.round(collapseProg * 100)}%`}</text>
          </g>

          {/* Engine connection beam */}
          <g style={{opacity: clamp(pop(f, t(20)))}}>
            <line x1={730} y1={300} x2={840} y2={300} stroke={C.green} strokeWidth={4} strokeDasharray="6 4" opacity={0.4 + 0.6 * collapseProg} />
            <polygon points="834,294 834,306 848,300" fill={C.green} />
            <text x={785} y={290} fill={C.green} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">logic ──►</text>
          </g>

          {/* Result banner */}
          {collapseProg > 0.95 ? (
            <g style={{opacity: clamp(pop(f, t(26)))}}>
              <rect x={250} y={500} width={500} height={50} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 12px ${C.green})`}} />
              <text x={500} y={532} fill={C.green} fontSize={15} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ PL/pgSQL Engine Sealed · Logic Lives With The Data · Zero Network Round Trips</text>
            </g>
          ) : null}

          {/* Status text */}
          <text x={500} y={580} fill={C.muted} fontSize={13} fontFamily={MONO} textAnchor="middle">
            {collapseProg < 0.3 ? 'external app sending queries...' : collapseProg < 0.9 ? 'collapsing into engine capsule...' : 'PL/pgSQL engine sealed ✓ · server-side execution'}
          </text>
        </svg>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 16, fontWeight: 700, paddingTop: 8, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.red}}>External · slow network</span>
          <span style={{color: collapseProg >= 1 ? C.green : C.amber, opacity: clamp(pop(f, t(20)))}}>
            {collapseProg >= 1 ? '✓ engine sealed' : collapseProg > 0 ? `collapsing... ${Math.round(collapseProg * 100)}%` : 'idle'}
          </span>
          <span style={{color: C.green}}>Server-Side · fast</span>
        </div>
      </Win>

      {/* Seal badge bottom-left */}
      <div style={{position: 'absolute', left: 80, top: 920, opacity: clamp(sealP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 22px', border: `2px solid ${C.green}`, borderRadius: 14, background: `${C.green}0d`}}>
          <Check p={sealP} size={36} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700}}>PL/pgSQL Engine · Sealed ✓</div>
        </div>
      </div>

      {/* Module 15 Server-Side Programming chip bottom-right */}
      <div style={{position: 'absolute', right: 80, top: 920, opacity: clamp(modP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 22px', border: `2px solid ${C.green}`, borderRadius: 14, background: `${C.green}0d`}}>
          <Check p={modP} size={36} color={C.green} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700}}>Module 15 Server-Side Programming ✓</div>
        </div>
      </div>

      <Caption text="CREATE FUNCTION ──► PL/pgSQL Engine ──► Server-Side ──► Logic Lives With Data ──► Module 15 Start" from={t(20)} to={sec(38)} tone="ok" />
    </Stage>
  );
};
