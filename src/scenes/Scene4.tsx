import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Win, clamp, lin, lerp, pop, sec} from '../kit';

// SC04 (130-170s): Compiled Execution Tree — PL/pgSQL Interpreter compiles first call into cached tree; subsequent calls bypass parsing
// Anchors: 131.0 interpreter | 136.0 compile | 140.0 tree | 145.0 cache | 150.0 memory | 155.0 fast | 160.0 seal | 165.0 cached
const S = START.s4;
const t = (g: number) => sec(g - S);

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const editorP = clamp(lin(f, t(131.5), 14));
  const interpP = pop(f, t(131));
  // Compile progress: parser -> tree (first call)
  const compileProg = clamp(lin(f, t(136), sec(8)));
  const treeP = pop(f, t(140));
  const cacheP = pop(f, t(145));
  const memP = pop(f, t(150));
  const fastP = pop(f, t(155));
  const sealP = pop(f, t(160));
  const cachedP = pop(f, t(165));

  // Subsequent call progress: lightning bypass
  const bypassProg = clamp(lin(f, t(155), sec(6)));

  // Pulse
  const pulse = 0.5 + 0.5 * Math.sin(f * 0.18);

  return (
    <Stage dur={1200} inFx="zoom" outFx="morph">
      <TopBadge text="شجرة التنفيذ المترجمة | Compiled Execution Tree — PL/pgSQL Interpreter (Parse Once · Cache · Bypass)" from={sec(2)} to={sec(40)} color={C.green} />

      {/* LEFT: Editor with first and subsequent calls */}
      <div style={{opacity: editorP}}>
        <Editor
          x={80}
          y={170}
          w={620}
          h={260}
          title="Query Editor · first call vs subsequent calls"
          lines={[
            '-- First call: parse + compile + cache',
            "SELECT fn_calc_tax(100);",
            '',
            '-- Subsequent calls: skip parse',
            "SELECT fn_calc_tax(200);",
            "SELECT fn_calc_tax(300);",
            '-- cached tree → instant execute',
          ]}
          start={t(131.5)}
          cps={0.55}
          size={14}
          accent={C.green}
          hl={1}
          hlColor={C.purple}
        />
      </div>

      {/* PL/pgSQL Interpreter panel */}
      <Win x={80} y={450} w={620} h={260} title="plpgsql interpreter engine ──► first call compiles · subsequent calls bypass" accent={C.purple} opacity={interpP ? clamp(interpP) : 0}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 16, color: C.purple}}>
          first call: Parser → Compiled Execution Tree → cache in memory
        </div>

        <div style={{position: 'absolute', right: 18, top: 14, display: 'flex', gap: 10}}>
          <Chip color={C.purple} style={{fontSize: 13, padding: '4px 12px'}}>
            <Check p={interpP} size={16} color={C.purple} /> Interpreter
          </Chip>
        </div>

        {/* SVG: parser + tree + cache */}
        <svg width={580} height={170} style={{position: 'absolute', left: 20, top: 56}}>
          {/* Parser (left, purple) */}
          <g style={{opacity: clamp(interpP)}}>
            <rect x={10} y={20} width={140} height={80} fill={`${C.purple}22`} stroke={C.purple} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 8px ${C.purple}66)`}} />
            <text x={80} y={48} fill={C.purple} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">Parser</text>
            <text x={80} y={68} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">tokenize + AST</text>
            <text x={80} y={84} fill={C.muted} fontSize={9} fontFamily={MONO} textAnchor="middle">first call only</text>
          </g>

          {/* Compile arrow */}
          <line x1={150} y1={60} x2={220} y2={60} stroke={C.green} strokeWidth={3} strokeDasharray="6 4" opacity={0.4 + 0.6 * compileProg} />
          <polygon points="214,54 214,66 228,60" fill={C.green} />
          <text x={185} y={50} fill={C.green} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">compile</text>

          {/* Compiled Execution Tree (center, green) */}
          <g style={{opacity: clamp(treeP)}}>
            <rect x={230} y={20} width={170} height={80} fill={`${C.green}33`} stroke={C.green} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 ${8 + pulse * 6}px ${C.green})`}} />
            <text x={315} y={48} fill={C.green} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">Compiled Tree</text>
            <text x={315} y={68} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">execution plan</text>
            <text x={315} y={84} fill={C.muted} fontSize={9} fontFamily={MONO} textAnchor="middle">nodes cached</text>
          </g>

          {/* Cache arrow */}
          <line x1={400} y1={60} x2={470} y2={60} stroke={C.amber} strokeWidth={3} strokeDasharray="6 4" opacity={0.4 + 0.6 * compileProg} />
          <polygon points="464,54 464,66 478,60" fill={C.amber} />
          <text x={435} y={50} fill={C.amber} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">cache</text>

          {/* Memory cache (right, amber) */}
          <g style={{opacity: clamp(memP)}}>
            <rect x={480} y={20} width={100} height={80} fill={`${C.amber}22`} stroke={C.amber} strokeWidth={3} rx={10} />
            <text x={530} y={48} fill={C.amber} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">Memory</text>
            <text x={530} y={68} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">cached tree</text>
            <text x={530} y={84} fill={C.muted} fontSize={9} fontFamily={MONO} textAnchor="middle">ready ✓</text>
          </g>

          {/* Bottom legend */}
          <text x={290} y={130} fill={C.text} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">first call: parse → compile → cache  ·  later: skip parse, execute cached tree</text>
          <text x={290} y={150} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">{bypassProg > 0.5 ? '✓ subsequent calls bypass parsing' : 'compiling on first call...'}</text>
        </svg>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 36, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 13, color: C.purple, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span>Interpreter</span>
          <span>{bypassProg > 0.5 ? '✓ cached' : 'compiling...'}</span>
        </div>
      </Win>

      {/* Fast / seal / cached chips at bottom-left */}
      <div style={{position: 'absolute', left: 80, top: 740, width: 620, display: 'flex', gap: 8, flexWrap: 'wrap'}}>
        <div style={{opacity: clamp(fastP)}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', border: `2px solid ${C.green}`, borderRadius: 12, background: `${C.green}0d`}}>
            <Check p={fastP} size={28} color={C.green} />
            <span dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.green, fontWeight: 700}}>Fast Execute ✓</span>
          </div>
        </div>
        <div style={{opacity: clamp(sealP)}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', border: `2px solid ${C.amber}`, borderRadius: 12, background: `${C.amber}0d`}}>
            <Check p={sealP} size={28} color={C.amber} />
            <span dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.amber, fontWeight: 700}}>Compiled Tree Seal ✓</span>
          </div>
        </div>
        <div style={{opacity: clamp(cachedP)}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', border: `2px solid ${C.blue}`, borderRadius: 12, background: `${C.blue}0d`}}>
            <Check p={cachedP} size={28} color={C.blue} />
            <span dir="ltr" style={{fontFamily: MONO, fontSize: 14, color: C.blue, fontWeight: 700}}>Cached ✓</span>
          </div>
        </div>
      </div>

      {/* RIGHT: Full visualization — first call vs subsequent call paths */}
      <Win x={740} y={170} w={1100} h={720} title="plpgsql interpreter engine ──► first call compiles · subsequent calls bypass parsing (lightning)" accent={C.green} opacity={clamp(interpP)}>
        <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.green}}>
          First call: Parser → Compiled Tree → Memory cache  ·  Subsequent calls: ⚡ blue lightning bypass → instant execute
        </div>

        <div style={{position: 'absolute', right: 18, top: 14, display: 'flex', gap: 10}}>
          <Chip color={C.purple} style={{fontSize: 13, padding: '4px 12px'}}>Parser (1st)</Chip>
          <Chip color={C.green} style={{fontSize: 13, padding: '4px 12px'}}>{compileProg > 0.05 ? 'Compiling...' : 'idle'}</Chip>
          <Chip color={C.blue} style={{fontSize: 13, padding: '4px 12px'}}>{bypassProg > 0.95 ? '⚡ Bypass ✓' : '...'}</Chip>
        </div>

        {/* SVG: full pipeline with two paths */}
        <svg width={1060} height={600} style={{position: 'absolute', left: 20, top: 60}}>
          {/* First call source (top-left) */}
          <g style={{opacity: clamp(pop(f, t(131)))}}>
            <rect x={20} y={20} width={180} height={70} fill={`${C.amber}22`} stroke={C.amber} strokeWidth={3} rx={10} />
            <text x={110} y={48} fill={C.amber} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">1st call</text>
            <text x={110} y={68} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">SELECT fn_calc_tax(100)</text>
            <text x={110} y={84} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">cold start</text>
          </g>

          {/* Arrow: 1st call -> Parser (purple path) */}
          <g style={{opacity: clamp(pop(f, t(131)))}}>
            <line x1={200} y1={55} x2={300} y2={55} stroke={C.purple} strokeWidth={4} strokeDasharray="6 4" opacity={0.4 + 0.6 * compileProg} />
            <polygon points="294,49 294,61 308,55" fill={C.purple} />
            <text x={250} y={45} fill={C.purple} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">parse</text>
          </g>

          {/* Parser (purple) */}
          <g style={{opacity: clamp(interpP)}}>
            <rect x={310} y={20} width={180} height={70} fill={`${C.purple}22`} stroke={C.purple} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 10px ${C.purple}66)`}} />
            <text x={400} y={48} fill={C.purple} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">PL/pgSQL Parser</text>
            <text x={400} y={68} fill={C.text} fontSize={11} fontFamily={MONO} textAnchor="middle">tokenize · build AST</text>
            <text x={400} y={84} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">runs ONCE</text>
          </g>

          {/* Arrow: Parser -> Compiled Tree */}
          <g style={{opacity: clamp(treeP)}}>
            <line x1={490} y1={55} x2={580} y2={55} stroke={C.green} strokeWidth={4} strokeDasharray="6 4" opacity={0.5 + 0.5 * compileProg} />
            <polygon points="574,49 574,61 588,55" fill={C.green} />
            <text x={535} y={45} fill={C.green} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">compile</text>
          </g>

          {/* Compiled Execution Tree (green, center) */}
          <g style={{opacity: clamp(treeP)}}>
            <rect x={590} y={20} width={220} height={120} fill={`${C.green}33`} stroke={C.green} strokeWidth={3} rx={12} style={{filter: `drop-shadow(0 0 ${10 + pulse * 8}px ${C.green})`}} />
            <text x={700} y={48} fill={C.green} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">Compiled Execution Tree</text>
            <text x={700} y={68} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">root node · branch nodes</text>

            {/* Mini tree visualization inside the box */}
            <circle cx={700} cy={92} r={9} fill={C.green} />
            <line x1={700} y1={101} x2={660} y2={120} stroke={C.green} strokeWidth={2} />
            <line x1={700} y1={101} x2={740} y2={120} stroke={C.green} strokeWidth={2} />
            <circle cx={660} cy={125} r={6} fill={C.green} />
            <circle cx={740} cy={125} r={6} fill={C.green} />
          </g>

          {/* Arrow: Tree -> Memory cache */}
          <g style={{opacity: clamp(memP)}}>
            <line x1={810} y1={55} x2={900} y2={55} stroke={C.amber} strokeWidth={4} strokeDasharray="6 4" opacity={0.7} />
            <polygon points="894,49 894,61 908,55" fill={C.amber} />
            <text x={855} y={45} fill={C.amber} fontSize={10} fontFamily={MONO} fontWeight={700} textAnchor="middle">cache</text>
          </g>

          {/* Memory cache (amber, top-right) */}
          <g style={{opacity: clamp(memP)}}>
            <rect x={910} y={20} width={130} height={120} fill={`${C.amber}22`} stroke={C.amber} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 8px ${C.amber}66)`}} />
            <text x={975} y={48} fill={C.amber} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">Memory</text>
            <text x={975} y={68} fill={C.text} fontSize={10} fontFamily={MONO} textAnchor="middle">cached tree</text>
            <text x={975} y={92} fill={C.green} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">{bypassProg > 0.5 ? '✓ ready' : '...'}</text>
            <text x={975} y={115} fill={C.muted} fontSize={9} fontFamily={MONO} textAnchor="middle">reused on every</text>
            <text x={975} y={128} fill={C.muted} fontSize={9} fontFamily={MONO} textAnchor="middle">subsequent call</text>
          </g>

          {/* Divider line */}
          <line x1={20} y1={180} x2={1040} y2={180} stroke={C.border} strokeWidth={2} strokeDasharray="4 4" opacity={0.5} />
          <text x={530} y={210} fill={C.text} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">▼ Subsequent calls (2nd, 3rd, ...) bypass parsing ▼</text>

          {/* Subsequent call sources (bottom-left, stacked) */}
          <g style={{opacity: clamp(bypassProg)}}>
            <rect x={20} y={250} width={180} height={50} fill={`${C.blue}22`} stroke={C.blue} strokeWidth={2.5} rx={8} />
            <text x={110} y={280} fill={C.blue} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">2nd call: fn_calc_tax(200)</text>

            <rect x={20} y={310} width={180} height={50} fill={`${C.blue}22`} stroke={C.blue} strokeWidth={2.5} rx={8} />
            <text x={110} y={340} fill={C.blue} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">3rd call: fn_calc_tax(300)</text>

            <rect x={20} y={370} width={180} height={50} fill={`${C.blue}22`} stroke={C.blue} strokeWidth={2.5} rx={8} />
            <text x={110} y={400} fill={C.blue} fontSize={11} fontFamily={MONO} fontWeight={700} textAnchor="middle">Nth call: fn_calc_tax(N)</text>
          </g>

          {/* Lightning bypass arrows (blue) from subsequent calls straight to cached tree */}
          <g style={{opacity: clamp(bypassProg)}}>
            {/* Path 1: bypasses parser entirely, goes straight up to compiled tree */}
            <path d="M 200 275 Q 400 200 590 80" stroke={C.blue} strokeWidth={4} fill="none" strokeDasharray="8 6" opacity={0.7} style={{filter: `drop-shadow(0 0 6px ${C.blue})`}} />
            <polygon points="584,74 584,86 598,80" fill={C.blue} transform="translate(-7,0)" />

            <path d="M 200 335 Q 400 240 590 90" stroke={C.blue} strokeWidth={3.5} fill="none" strokeDasharray="8 6" opacity={0.6} style={{filter: `drop-shadow(0 0 4px ${C.blue}88)`}} />

            <path d="M 200 395 Q 400 280 590 95" stroke={C.blue} strokeWidth={3} fill="none" strokeDasharray="8 6" opacity={0.5} />

            {/* Lightning label */}
            <text x={400} y={220} fill={C.blue} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">⚡ lightning bypass ──► no parsing</text>
          </g>

          {/* Crossed-out Parser (subsequent path skips it) */}
          <g style={{opacity: clamp(bypassProg)}}>
            <text x={400} y={285} fill={C.muted} fontSize={11} fontFamily={MONO} textAnchor="middle" textDecoration="line-through">Parser SKIPPED ✓</text>
          </g>

          {/* Result banner: instant execute */}
          {bypassProg > 0.7 ? (
            <g style={{opacity: clamp(fastP)}}>
              <rect x={250} y={450} width={560} height={50} fill={`${C.green}22`} stroke={C.green} strokeWidth={3} rx={10} style={{filter: `drop-shadow(0 0 12px ${C.green}66)`}} />
              <text x={530} y={482} fill={C.green} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">⚡ Subsequent calls execute cached tree instantly · zero parse overhead · 10× faster</text>
            </g>
          ) : null}

          {/* Performance comparison */}
          <g style={{opacity: clamp(pop(f, t(150)))}}>
            <rect x={120} y={520} width={300} height={50} fill={`${C.purple}22`} stroke={C.purple} strokeWidth={2} rx={8} />
            <text x={270} y={542} fill={C.purple} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">1st call: parse + compile</text>
            <text x={270} y={560} fill={C.muted} fontSize={10} fontFamily={MONO} textAnchor="middle">~8ms cold</text>

            <rect x={640} y={520} width={300} height={50} fill={`${C.green}22`} stroke={C.green} strokeWidth={2} rx={8} />
            <text x={790} y={542} fill={C.green} fontSize={12} fontFamily={MONO} fontWeight={700} textAnchor="middle">Nth call: cached execute</text>
            <text x={790} y={560} fill={C.green} fontSize={10} fontFamily={MONO} textAnchor="middle">~0.8ms hot · 10× faster</text>
          </g>

          {/* Status text */}
          <text x={530} y={595} fill={C.muted} fontSize={13} fontFamily={MONO} textAnchor="middle">
            {compileProg < 0.3 ? 'parsing first call...' : compileProg < 0.95 ? 'compiling execution tree...' : bypassProg < 0.5 ? 'caching in memory...' : '⚡ subsequent calls bypass parsing · cached tree executes instantly'}
          </text>
        </svg>

        {/* Bottom status */}
        <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 14, color: C.green, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
          <span style={{color: C.purple}}>Parse (1st only)</span>
          <span style={{color: bypassProg >= 1 ? C.green : C.amber}}>{bypassProg >= 1 ? '⚡ bypass ✓' : bypassProg > 0 ? `bypassing... ${Math.round(bypassProg * 100)}%` : 'compiling...'}</span>
          <span style={{color: C.green}}>Cached · 10× faster</span>
        </div>
      </Win>

      <Caption text="PL/pgSQL Interpreter ──► Parse Once ──► Compile ──► Cached Tree ──► Bypass ──► 10× Faster ✓" from={t(140)} to={sec(40)} tone="ok" />
    </Stage>
  );
};
