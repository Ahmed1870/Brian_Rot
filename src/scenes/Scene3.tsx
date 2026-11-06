import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {PLPGSQL_CODE} from '../data';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, lerp, pop, sec} from '../kit';

// SC03 (85-130s): PL/pgSQL Syntax & Dollar Quoting — $$ delimiters (amber), DECLARE / BEGIN...END (green), IF...THEN, LOOP
// Anchors: 86.0 dollar quoting | 90.0 $$ | 95.0 DECLARE | 100.0 BEGIN END | 110.0 IF THEN | 118.0 LOOP | 125.0 seal
const S = START.s3;
const t = (g: number) => sec(g - S);

// Extended code with IF...THEN and LOOP examples for the right-side panel
const IF_LOOP_LINES = [
  '-- control flow inside PL/pgSQL',
  '',
  'IF price > 1000 THEN',
  '  tax := price * 0.20;',
  'ELSE',
  '  tax := price * 0.14;',
  'END IF;',
  '',
  '<<bulk>>',
  'LOOP',
  '  EXIT WHEN i > 100;',
  '  i := i + 1;',
  'END LOOP;',
];

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(86.5), 14));
  const dollarP = pop(f, t(90));
  const declareP = pop(f, t(95));
  const beginEndP = pop(f, t(100));
  const ifP = pop(f, t(110));
  const loopP = pop(f, t(118));
  const sealP = pop(f, t(125));

  // Pulse for dollar quoting
  const pulse = 0.5 + 0.5 * Math.sin(f * 0.2);

  return (
    <Stage dur={1350} inFx="left" outFx="up">
      <TopBadge text="صياغة PL/pgSQL و dollar-quoting | PL/pgSQL Syntax &amp; $$ Dollar Quoting" from={sec(2)} to={sec(40)} color={C.amber} />

      {/* LEFT: PL/pgSQL block editor with $$ highlighted */}
      <div style={{opacity: editorP}}>
        <Editor
          x={80}
          y={170}
          w={880}
          h={470}
          title="Query Editor · PL/pgSQL block (CREATE FUNCTION with $$ dollar quoting)"
          lines={PLPGSQL_CODE.concat([
            '',
            '-- $$ is the dollar-quote delimiter',
            '-- avoids escaping single quotes inside body',
          ])}
          start={t(86.5)}
          cps={0.55}
          size={15}
          accent={C.amber}
          hl={1}
          hlColor={C.amber}
        />
      </div>

      {/* Concept chips below editor */}
      <div style={{position: 'absolute', left: 80, top: 660, width: 880, opacity: clamp(lin(f, t(90), 14))}}>
        <div dir="ltr" style={{fontFamily: MONO, fontSize: 16, color: C.muted, marginBottom: 8}}>◆ PL/pgSQL block structure:</div>
        <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
          <Chip color={C.amber} style={{fontSize: 14, padding: '4px 12px'}}>
            <Check p={dollarP} size={16} color={C.amber} /> $$ Dollar Quoting
          </Chip>
          <Chip color={C.green} style={{fontSize: 14, padding: '4px 12px'}}>
            <Check p={declareP} size={16} color={C.green} /> DECLARE
          </Chip>
          <Chip color={C.green} style={{fontSize: 14, padding: '4px 12px'}}>
            <Check p={beginEndP} size={16} color={C.green} /> BEGIN ... END
          </Chip>
          <Chip color={C.blue} style={{fontSize: 14, padding: '4px 12px'}}>
            <Check p={ifP} size={16} color={C.blue} /> IF ... THEN
          </Chip>
          <Chip color={C.purple} style={{fontSize: 14, padding: '4px 12px'}}>
            <Check p={loopP} size={16} color={C.purple} /> LOOP
          </Chip>
        </div>
      </div>

      {/* Dollar-quoting explanation panel */}
      <div style={{position: 'absolute', left: 80, top: 740, width: 880, opacity: clamp(pop(f, t(90)))}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '14px 22px', border: `3px solid ${C.amber}`, borderRadius: 16, background: `${C.amber}0d`, boxShadow: `0 0 24px ${C.amber}33`}}>
          <Check p={sealP} size={44} color={C.amber} />
          <div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 20, color: C.amber, fontWeight: 700}}>$$ Dollar Quoting ✓</div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 13, color: C.muted, marginTop: 2}}>$$ wraps the function body · no need to escape single quotes · unique tag allowed (e.g. $body$)</div>
          </div>
        </div>
      </div>

      {/* Seal at bottom-left */}
      <div style={{position: 'absolute', left: 80, top: 850, width: 880, opacity: clamp(sealP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '12px 22px', border: `2px solid ${C.green}`, borderRadius: 14, background: `${C.green}0d`}}>
          <Check p={sealP} size={36} color={C.green} />
          <div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700}}>PL/pgSQL Syntax &amp; Dollar Quoting Seal ✓</div>
            <div dir="ltr" style={{fontFamily: MONO, fontSize: 13, color: C.muted, marginTop: 2}}>$$ · DECLARE · BEGIN ... END · IF ... THEN · LOOP — complete control-flow toolkit</div>
          </div>
        </div>
      </div>

      {/* RIGHT: Visual block structure + control flow */}
      <Win x={1000} y={170} w={840} h={720} title="plpgsql block structure ──► $$ delimiters + DECLARE + BEGIN ... END + IF + LOOP" accent={C.amber} opacity={clamp(lin(f, t(95), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.amber}}>
          $$ amber delimiters ──► green DECLARE/BEGIN-END ──► blue IF-THEN ──► purple LOOP
        </div>

        <div style={{position: 'absolute', right: 18, top: 14, display: 'flex', gap: 10}}>
          <Chip color={C.amber} style={{fontSize: 13, padding: '4px 12px'}}>$$ dollar</Chip>
          <Chip color={C.green} style={{fontSize: 13, padding: '4px 12px'}}>DECLARE</Chip>
          <Chip color={C.blue} style={{fontSize: 13, padding: '4px 12px'}}>IF THEN</Chip>
          <Chip color={C.purple} style={{fontSize: 13, padding: '4px 12px'}}>LOOP</Chip>
        </div>

        {/* SVG: block diagram of PL/pgSQL structure */}
        <svg width={800} height={620} style={{position: 'absolute', left: 20, top: 60}}>
          {/* Outer $$ amber delimiter frame */}
          <g style={{opacity: clamp(dollarP)}}>
            <rect x={20} y={20} width={760} height={560} fill={`${C.amber}0d`} stroke={C.amber} strokeWidth={4} strokeDasharray="10 5" rx={14} style={{filter: `drop-shadow(0 0 ${10 + pulse * 8}px ${C.amber}66)`}} />
            <text x={40} y={50} fill={C.amber} fontSize={16} fontFamily={MONO} fontWeight={700}>$$  ──► dollar-quote open</text>
            <text x={760} y={580} fill={C.amber} fontSize={16} fontFamily={MONO} fontWeight={700} textAnchor="end">$$  ──► dollar-quote close</text>
          </g>

          {/* DECLARE block (top, green) */}
          <g style={{opacity: clamp(declareP)}}>
            <rect x={60} y={70} width={680} height={70} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 8px ${C.green}66)`}} />
            <text x={400} y={100} fill={C.green} fontSize={15} fontFamily={MONO} fontWeight={700} textAnchor="middle">DECLARE</text>
            <text x={400} y={122} fill={C.text} fontSize={12} fontFamily={MONO} textAnchor="middle">tax NUMERIC; · i INT := 0;</text>
          </g>

          {/* BEGIN block (middle, green frame) */}
          <g style={{opacity: clamp(beginEndP)}}>
            <rect x={60} y={160} width={680} height={340} fill={`${C.green}0d`} stroke={C.green} strokeWidth={3} rx={10} />
            <text x={400} y={188} fill={C.green} fontSize={15} fontFamily={MONO} fontWeight={700} textAnchor="middle">BEGIN</text>

            {/* Body content row */}
            <rect x={90} y={210} width={620} height={36} fill={`${C.green}11`} stroke={C.green} strokeWidth={1.5} rx={6} />
            <text x={400} y={233} fill={C.text} fontSize={12} fontFamily={MONO} textAnchor="middle">tax := price * 0.14;</text>

            {/* IF ... THEN (blue) nested inside BEGIN */}
            <g style={{opacity: clamp(ifP)}}>
              <rect x={90} y={260} width={620} height={100} fill={`${C.blue}11`} stroke={C.blue} strokeWidth={2.5} strokeDasharray="5 4" rx={8} style={{filter: `drop-shadow(0 0 8px ${C.blue}44)`}} />
              <text x={110} y={284} fill={C.blue} fontSize={13} fontFamily={MONO} fontWeight={700}>IF price &gt; 1000 THEN</text>
              <text x={130} y={306} fill={C.text} fontSize={11} fontFamily={MONO}>tax := price * 0.20;</text>
              <text x={110} y={326} fill={C.blue} fontSize={11} fontFamily={MONO}>ELSE</text>
              <text x={130} y={346} fill={C.text} fontSize={11} fontFamily={MONO}>tax := price * 0.14;</text>
              <text x={690} y={354} fill={C.blue} fontSize={11} fontFamily={MONO} textAnchor="end">END IF;</text>
            </g>

            {/* LOOP (purple) nested inside BEGIN */}
            <g style={{opacity: clamp(loopP)}}>
              <rect x={90} y={375} width={620} height={80} fill={`${C.purple}11`} stroke={C.purple} strokeWidth={2.5} strokeDasharray="5 4" rx={8} style={{filter: `drop-shadow(0 0 8px ${C.purple}44)`}} />
              <text x={110} y={399} fill={C.purple} fontSize={13} fontFamily={MONO} fontWeight={700}>LOOP</text>
              <text x={130} y={420} fill={C.text} fontSize={11} fontFamily={MONO}>EXIT WHEN i &gt; 100;</text>
              <text x={130} y={440} fill={C.text} fontSize={11} fontFamily={MONO}>i := i + 1;</text>
              <text x={690} y={448} fill={C.purple} fontSize={11} fontFamily={MONO} textAnchor="end">END LOOP;</text>
            </g>

            {/* RETURN inside BEGIN */}
            <rect x={90} y={465} width={620} height={28} fill={`${C.amber}22`} stroke={C.amber} strokeWidth={1.5} rx={6} />
            <text x={400} y={484} fill={C.amber} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">RETURN tax;</text>
            <text x={400} y={510} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">END;</text>
          </g>

          {/* LANGUAGE clause at bottom */}
          <g style={{opacity: clamp(beginEndP)}}>
            <rect x={60} y={520} width={680} height={40} fill={`${C.purple}11`} stroke={C.purple} strokeWidth={2} rx={8} />
            <text x={400} y={546} fill={C.purple} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">LANGUAGE plpgsql;  ──►  tells PostgreSQL how to interpret the body</text>
          </g>
        </svg>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 13, color: C.amber, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.amber}}>$$ dollar quoting</span>
          <span style={{color: loopP > 0.5 ? C.green : C.amber}}>{loopP > 0.5 ? '✓ block complete' : 'parsing...'}</span>
          <span style={{color: C.green}}>DECLARE · BEGIN · END</span>
        </div>
      </Win>

      <Caption text="$$ Dollar Quoting ──► DECLARE ──► BEGIN ... END ──► IF THEN ──► LOOP ──► PL/pgSQL Syntax ✓" from={t(95)} to={sec(44)} tone="ok" />
    </Stage>
  );
};
