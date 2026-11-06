import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Warn, Win, clamp, lin, lerp, pop, sec} from '../kit';

// SC04 (130-170s): RETURN NULL Abort — PostgreSQL 16 engine receives DML, BEFORE trigger returns NULL → red barrier slams down, zero disk IO
// Anchors: 131.0 engine | 136.0 pause | 140.0 NEW/OLD | 145.0 RETURN NULL | 150.0 abort | 155.0 zero IO | 160.0 seal | 165.0 fast
const S = START.s4;
const t = (g: number) => sec(g - S);

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(131.5), 14));
  const engineP = pop(f, t(131));
  // Pause: DML arrives at engine, triggers fire, NEW/OLD prepared
  const pauseProg = clamp(lin(f, t(136), sec(6)));
  const ctxP = pop(f, t(140));
  // RETURN NULL: trigger returns NULL → red barrier slams down
  const nullP = pop(f, t(145));
  // Abort animation: red barrier slams, DML cancelled, zero disk IO
  const abortProg = clamp(lin(f, t(150), sec(5)));
  const zeroIoP = pop(f, t(155));
  const sealP = pop(f, t(160));
  const fastP = pop(f, t(165));

  // Pulse
  const pulse = 0.5 + 0.5 * Math.sin(f * 0.18);

  return (
    <Stage dur={1200} inFx="zoom" outFx="morph">
      <TopBadge text="إلغاء العملية بـ RETURN NULL | BEFORE Trigger Returns NULL → DML Abort (Zero Disk IO)" from={sec(2)} to={sec(40)} color={C.red} />

      {/* LEFT: Editor with RETURN NULL trigger */}
      <div style={{opacity: editorP}}>
        <Editor
          x={80}
          y={170}
          w={620}
          h={260}
          title="Query Editor · BEFORE trigger returning NULL aborts DML"
          lines={[
            'CREATE FUNCTION fn_block_negative() RETURNS TRIGGER',
            'AS $$ BEGIN',
            '  IF NEW.balance < 0 THEN',
            '    -- abort the entire DML operation',
            '    RETURN NULL;',
            '  END IF;',
            '  RETURN NEW;',
            'END; $$ LANGUAGE plpgsql;',
            '',
            'CREATE TRIGGER trg_guard BEFORE INSERT OR UPDATE',
          ]}
          start={t(131.5)}
          cps={0.5}
          size={14}
          accent={C.red}
          hl={4}
          hlColor={C.red}
        />
      </div>

      {/* RETURN NULL explanation panel */}
      <Win x={80} y={450} w={620} h={260} title="return null semantics ──► BEFORE trigger aborts DML with zero IO" accent={C.red} opacity={clamp(engineP)}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 16, color: C.red}}>
          BEFORE trigger RETURN NULL ──► DML silently dropped ──► zero disk writes
        </div>

        <div style={{position: 'absolute', right: 18, top: 14, display: 'flex', gap: 10}}>
          <Chip color={C.red} style={{fontSize: 13, padding: '4px 12px'}}>
            <Warn size={20} color={C.red} /> RETURN NULL
          </Chip>
        </div>

        {/* SVG: abort semantics */}
        <svg width={580} height={170} style={{position: 'absolute', left: 20, top: 56}}>
          {/* Engine (left) */}
          <g style={{opacity: clamp(engineP)}}>
            <rect x={10} y={20} width={150} height={80} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 8px ${C.green}66)`}} />
            <text x={85} y={48} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">PG 16 Engine</text>
            <text x={85} y={68} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">DML paused</text>
            <text x={85} y={84} fill={C.muted} fontSize={9} fontFamily={MONO} textAnchor="middle">trigger fires</text>
          </g>

          {/* Arrow to RETURN NULL */}
          <line x1={160} y1={60} x2={220} y2={60} stroke={C.red} strokeWidth={3} strokeDasharray="6 4" opacity={0.4 + 0.6 * abortProg} />
          <polygon points="214,54 214,66 228,60" fill={C.red} />
          <text x={190} y={50} fill={C.red} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">NULL</text>

          {/* RETURN NULL node (center) */}
          <g style={{opacity: clamp(nullP)}}>
            <rect x={230} y={20} width={170} height={80} fill={`${C.red}33`} stroke={C.red} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 ${8 + pulse * 6}px ${C.red})`}} />
            <text x={315} y={48} fill={C.red} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">RETURN NULL</text>
            <text x={315} y={68} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">DML cancelled</text>
            <text x={315} y={84} fill={C.muted} fontSize={9} fontFamily={MONO} textAnchor="middle">no disk write</text>
          </g>

          {/* Arrow to zero IO */}
          <line x1={400} y1={60} x2={460} y2={60} stroke={C.green} strokeWidth={3} strokeDasharray="6 4" opacity={0.4 + 0.6 * abortProg} />
          <polygon points="454,54 454,66 468,60" fill={C.green} />
          <text x={430} y={50} fill={C.green} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">zero IO</text>

          {/* Zero IO node (right) */}
          <g style={{opacity: clamp(zeroIoP)}}>
            <rect x={470} y={20} width={100} height={80} fill={`${C.green}33`} stroke={C.green} strokeWidth={3} rx={10} />
            <text x={520} y={48} fill={C.green} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">Zero IO</text>
            <text x={520} y={68} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">no rows written</text>
            <text x={520} y={84} fill={C.muted} fontSize={9} fontFamily={MONO} textAnchor="middle">instant ✓</text>
          </g>

          {/* Bottom legend */}
          <text x={290} y={130} fill={C.text} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">BEFORE RETURN NULL ──► abort ──► zero disk cost</text>
          <text x={290} y={150} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">{abortProg > 0.5 ? '✓ operation aborted · zero IO cost' : 'preparing NEW/OLD context...'}</text>
        </svg>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 36, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 13, color: C.red, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span>BEFORE trigger</span>
          <span>{abortProg > 0.5 ? '✓ aborted' : 'paused...'}</span>
        </div>
      </Win>

      {/* Fast / seal / zero-IO chips at bottom-left */}
      <div style={{position: 'absolute', left: 80, top: 740, width: 620, display: 'flex', gap: 8, flexWrap: 'wrap'}}>
        <div style={{opacity: clamp(zeroIoP)}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', border: `2px solid ${C.green}`, borderRadius: 12, background: `${C.green}0d`}}>
            <Check p={zeroIoP} size={28} color={C.green} />
            <span dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.green, fontWeight: 700}}>Zero IO ✓</span>
          </div>
        </div>
        <div style={{opacity: clamp(sealP)}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', border: `2px solid ${C.red}`, borderRadius: 12, background: `${C.red}0d`}}>
            <Check p={sealP} size={28} color={C.red} />
            <span dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.red, fontWeight: 700}}>Abort Seal ✓</span>
          </div>
        </div>
        <div style={{opacity: clamp(fastP)}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', border: `2px solid ${C.blue}`, borderRadius: 12, background: `${C.blue}0d`}}>
            <Check p={fastP} size={28} color={C.blue} />
            <span dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.blue, fontWeight: 700}}>Instant ✓</span>
          </div>
        </div>
      </div>

      {/* RIGHT: Full visualization — engine pause + RETURN NULL barrier abort */}
      <Win x={740} y={170} w={1100} h={720} title="return null abort ──► engine pauses DML · BEFORE trigger RETURN NULL · red barrier slams · zero disk IO" accent={C.red} opacity={clamp(engineP)}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.red}}>
          DML arrives ──► engine pauses ──► NEW/OLD prepared ──► RETURN NULL ──► red barrier slams ──► zero IO
        </div>

        <div style={{position: 'absolute', right: 18, top: 14, display: 'flex', gap: 10}}>
          <Chip color={C.green} style={{fontSize: 13, padding: '4px 12px'}}>PG 16 Engine</Chip>
          <Chip color={C.amber} style={{fontSize: 13, padding: '4px 12px'}}>{pauseProg > 0.05 && pauseProg < 0.99 ? 'Pausing...' : 'idle'}</Chip>
          <Chip color={C.red} style={{fontSize: 13, padding: '4px 12px'}}>{abortProg > 0.95 ? '✓ Aborted' : '...'}</Chip>
        </div>

        {/* SVG: full pipeline */}
        <svg width={1060} height={600} style={{position: 'absolute', left: 20, top: 60}}>
          {/* DML source (top-left) */}
          <g style={{opacity: clamp(pop(f, t(131)))}}>
            <rect x={20} y={20} width={180} height={70} fill={`${C.amber}22`} stroke={C.amber} strokeWidth={3} rx={10} />
            <text x={110} y={48} fill={C.amber} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">DML: UPDATE balance</text>
            <text x={110} y={68} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">SET balance = -500</text>
            <text x={110} y={84} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">negative value</text>
          </g>

          {/* Arrow: DML -> Engine */}
          <g style={{opacity: clamp(pop(f, t(131)))}}>
            <line x1={200} y1={55} x2={300} y2={55} stroke={C.green} strokeWidth={4} strokeDasharray="6 4" opacity={0.4 + 0.6 * pauseProg} />
            <polygon points="294,49 294,61 308,55" fill={C.green} />
            <text x={250} y={45} fill={C.green} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">arrive</text>
          </g>

          {/* PostgreSQL 16 Engine (green, center-left) */}
          <g style={{opacity: clamp(engineP)}}>
            <rect x={310} y={20} width={220} height={120} fill={`${C.green}33`} stroke={C.green} strokeWidth={3} rx={12} style={{filter: `drop-shadow(0 0 ${10 + pulse * 8}px ${C.green})`}} />
            <text x={420} y={48} fill={C.green} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">PostgreSQL 16 Engine</text>
            <text x={420} y={70} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">{pauseProg > 0.5 ? '⏸ DML paused' : 'receiving DML...'}</text>
            <text x={420} y={90} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">fires BEFORE trigger</text>
            <text x={420} y={110} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">prepares NEW / OLD context</text>
          </g>

          {/* NEW/OLD context cards (below engine) */}
          <g style={{opacity: clamp(ctxP)}}>
            <rect x={310} y={160} width={100} height={50} fill={`${C.blue}22`} stroke={C.blue} strokeWidth={2.5} rx={8} />
            <text x={360} y={182} fill={C.blue} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">NEW</text>
            <text x={360} y={200} fill={C.text} fontSize={9} fontFamily={MONO} textAnchor="middle">balance=-500</text>

            <rect x={430} y={160} width={100} height={50} fill={`${C.amber}22`} stroke={C.amber} strokeWidth={2.5} rx={8} />
            <text x={480} y={182} fill={C.amber} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">OLD</text>
            <text x={480} y={200} fill={C.text} fontSize={9} fontFamily={MONO} textAnchor="middle">balance=1000</text>

            <text x={420} y={230} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">NEW.balance &lt; 0 ──► trigger decides</text>
          </g>

          {/* Arrow: Engine -> BEFORE trigger check */}
          <g style={{opacity: clamp(ctxP)}}>
            <line x1={530} y1={80} x2={620} y2={80} stroke={C.red} strokeWidth={4} strokeDasharray="6 4" opacity={0.7} />
            <polygon points="614,74 614,86 628,80" fill={C.red} />
            <text x={575} y={70} fill={C.red} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">check</text>
          </g>

          {/* BEFORE trigger check (red, center) */}
          <g style={{opacity: clamp(nullP)}}>
            <rect x={630} y={40} width={200} height={100} fill={`${C.red}33`} stroke={C.red} strokeWidth={3} rx={12} style={{filter: `drop-shadow(0 0 ${10 + pulse * 8}px ${C.red})`}} />
            <text x={730} y={68} fill={C.red} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">BEFORE Trigger</text>
            <text x={730} y={90} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">IF NEW.balance &lt; 0</text>
            <text x={730} y={110} fill={C.red} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">RETURN NULL ✗</text>
            <text x={730} y={128} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">abort signal sent</text>
          </g>

          {/* Red barrier slamming down (vertical red bars) */}
          <g style={{opacity: clamp(abortProg)}}>
            {/* Barrier bars - slam down from above */}
            {[0, 1, 2, 3].map((i) => (
              <rect key={i} x={840 + i * 18} y={20 + (1 - abortProg) * -120} width={14} height={170} fill={C.red} opacity={0.4 + 0.5 * abortProg} style={{filter: `drop-shadow(0 0 8px ${C.red})`}} />
            ))}
            <text x={900} y={210} fill={C.red} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">🛑 BARRIER SLAMMED</text>
          </g>

          {/* Cancelled DML stamp (crossed out) */}
          {abortProg > 0.5 ? (
            <g style={{opacity: clamp(pop(f, t(150)))}}>
              <text x={110} y={150} fill={C.red} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle" textDecoration="line-through">UPDATE balance = -500</text>
              <text x={110} y={172} fill={C.red} fontSize={11} fontFamily={MONO} textAnchor="middle">✗ DML ABORTED</text>
            </g>
          ) : null}

          {/* Divider line */}
          <line x1={20} y1={280} x2={1040} y2={280} stroke={C.border} strokeWidth={2} strokeDasharray="4 4" opacity={0.5} />
          <text x={530} y={310} fill={C.text} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">▼ Disk write avoided · zero IO cost ▼</text>

          {/* Disk (bottom, with X overlay) */}
          <g style={{opacity: clamp(pop(f, t(155)))}}>
            <ellipse cx={500} cy={400} rx={80} ry={26} fill={`${C.amber}11`} stroke={C.amber} strokeWidth={3} strokeDasharray="8 6" />
            <path d="M 420 400 V 480 A 80 26 0 0 0 580 480 V 400" fill={`${C.amber}11`} stroke={C.amber} strokeWidth={3} strokeDasharray="8 6" />
            <ellipse cx={500} cy={425} rx={80} ry={26} fill="none" stroke={C.amber} strokeWidth={2} opacity={0.4} />
            <text x={500} y={404} fill={C.amber} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">disk (no write)</text>
            <text x={500} y={430} fill={C.amber} fontSize={10} fontFamily={MONO} textAnchor="middle">0 rows persisted</text>

            {/* Red X overlay */}
            <line x1={430} y1={380} x2={570} y2={470} stroke={C.red} strokeWidth={6} strokeLinecap="round" />
            <line x1={570} y1={380} x2={430} y2={470} stroke={C.red} strokeWidth={6} strokeLinecap="round" />
            <text x={500} y={520} fill={C.red} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ Zero IO Cost</text>
          </g>

          {/* Result banner */}
          {abortProg > 0.95 ? (
            <g style={{opacity: clamp(pop(f, t(155)))}}>
              <rect x={120} y={540} width={820} height={40} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 12px ${C.green}66)`}} />
              <text x={530} y={566} fill={C.green} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">✓ Operation Aborted (Zero IO Cost) · BEFORE trigger RETURN NULL · no rows written · instant fail-fast</text>
            </g>
          ) : null}

          {/* Status text */}
          <text x={530} y={595} fill={C.muted} fontSize={13} fontFamily={MONO} textAnchor="middle">
            {pauseProg < 0.3 ? 'engine receiving DML...' : pauseProg < 0.95 ? 'preparing NEW/OLD context...' : abortProg < 0.5 ? 'trigger firing...' : '✓ aborted · zero IO'}
          </text>
        </svg>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 14, fontWeight: 700, paddingTop: 8, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.green}}>PG 16 · pause</span>
          <span style={{color: abortProg >= 1 ? C.green : C.red}}>{abortProg >= 1 ? '✓ zero IO' : abortProg > 0 ? `aborting... ${Math.round(abortProg * 100)}%` : 'paused'}</span>
          <span style={{color: C.red}}>RETURN NULL</span>
        </div>
      </Win>

      <Caption text="BEFORE Trigger ──► RETURN NULL ──► DML Aborted ──► Zero Disk IO ──► Instant Fail-Fast ✓" from={t(140)} to={sec(40)} tone="ok" />
    </Stage>
  );
};
