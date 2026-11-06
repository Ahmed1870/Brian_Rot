import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Mix, Stage, TopBadge, Warn, Win, clamp, lin, lerp, pop, sec} from '../kit';

// SC02 (40-85s): Function Wrapping & Column Arithmetic Fix — Refactor Animation
// Anchors: 41.0 anti-patterns | 45.0 function wrapping | 52.0 arithmetic | 60.0 refactor | 68.0 move | 75.0 green | 80.0 seal
const S = START.s2;
const t = (g: number) => sec(g - S);

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const leftP = clamp(lin(f, t(41.5), 14));
  const rightP = clamp(lin(f, t(52), 14));
  // Refactor animation: * 1.1 moves to the right side as / 1.1
  const moveStart = t(60);
  const moveDur = sec(8);
  const moveProg = clamp((f - moveStart) / moveDur);
  // Position of "* 1.1" expression as it migrates
  // Left start: 350 (left side, after price) → Right target: 760 (right side, after >)
  const exprX = lerp(420, 700, moveProg);
  const exprY = lerp(0, 0, moveProg);
  const exprOpacity = moveProg < 0.95 ? 1 : 0;
  const sealP = pop(f, t(75));
  const greenP = pop(f, t(80));

  return (
    <Stage dur={1350} inFx="left" outFx="left">
      <TopBadge text="تغليف الدوال وحساب الأعمدة | Function Wrapping & Column Arithmetic Fix" from={sec(2)} to={sec(40)} color={C.red} />

      {/* LEFT: Non-SARGable — function wrapping + broken index */}
      <div style={{opacity: leftP, transform: `translateX(${(1 - leftP) * -30}px)`}}>
        <Editor
          x={80}
          y={180}
          w={860}
          h={220}
          title="Non-SARGable ──► Function Wrapping (broken index)"
          lines={[
            "WHERE LOWER(name) = 'admin'",
            'WHERE price * 1.1 > 100',
            '-- function & arithmetic wrap column',
            '-- index path BROKEN ✗',
          ]}
          start={t(41.5)}
          cps={0.8}
          size={17}
          accent={C.red}
          hl={0}
          hlColor={C.red}
        />

        <Win x={80} y={420} w={860} h={480} title="anti-pattern ──► index path broken" accent={C.red} opacity={leftP}>
          <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.red}}>
            function wraps column ──► B-Tree cannot traverse
          </div>

          {/* SVG: broken index path */}
          <svg width={820} height={360} style={{position: 'absolute', left: 20, top: 50}}>
            {/* Predicate input */}
            <rect x={20} y={20} width={280} height={70} fill={`${C.red}22`} stroke={C.red} strokeWidth={2} rx={10} />
            <text x={160} y={48} fill={C.red} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">WHERE LOWER(name)</text>
            <text x={160} y={70} fill={C.amber} fontSize={13} fontFamily={MONO} textAnchor="middle">= "admin"</text>

            {/* Arrow broken */}
            <line x1={300} y1={55} x2={380} y2={55} stroke={C.red} strokeWidth={3} strokeDasharray="8 5" />
            <polygon points="374,49 374,61 388,55" fill={C.red} />

            {/* Red X warning */}
            <g>
              <circle cx={440} cy={55} r={32} fill={`${C.red}22`} stroke={C.red} strokeWidth={3} />
              <line x1={424} y1={40} x2={456} y2={70} stroke={C.red} strokeWidth={5} strokeLinecap="round" />
              <line x1={456} y1={40} x2={424} y2={70} stroke={C.red} strokeWidth={5} strokeLinecap="round" />
            </g>

            {/* Broken B-Tree (dashed/disconnected) */}
            <text x={540} y={40} fill={C.red} fontSize={13} fontFamily={MONO} fontWeight={700}>B-Tree Index ✗</text>
            <circle cx={560} cy={80} r={22} fill="transparent" stroke={C.red} strokeWidth={2} strokeDasharray="4 3" />
            <text x={560} y={86} fill={C.red} fontSize={12} fontFamily={MONO} textAnchor="middle">50</text>
            <circle cx={660} cy={140} r={20} fill="transparent" stroke={C.red} strokeWidth={2} strokeDasharray="4 3" />
            <text x={660} y={145} fill={C.red} fontSize={11} fontFamily={MONO} textAnchor="middle">25</text>
            <circle cx={760} cy={140} r={20} fill="transparent" stroke={C.red} strokeWidth={2} strokeDasharray="4 3" />
            <text x={760} y={145} fill={C.red} fontSize={11} fontFamily={MONO} textAnchor="middle">75</text>
            {/* Disconnected lines (broken) */}
            <line x1={572} y1={92} x2={648} y2={132} stroke={C.red} strokeWidth={2} strokeDasharray="3 6" strokeOpacity={0.4} />
            <line x1={572} y1={92} x2={752} y2={132} stroke={C.red} strokeWidth={2} strokeDasharray="3 6" strokeOpacity={0.4} />

            {/* Seq Scan fallback */}
            <rect x={20} y={180} width={780} height={50} fill={`${C.red}11`} stroke={C.red} strokeWidth={2} strokeDasharray="8 4" rx={8} />
            <text x={410} y={212} fill={C.red} fontSize={15} fontFamily={MONO} fontWeight={700} textAnchor="middle">Fallback: Seq Scan ──► O(n) full table scan</text>

            {/* Cost label */}
            <text x={410} y={265} fill={C.red} fontSize={14} fontFamily={MONO} fontWeight={700} textAnchor="middle">cost: HIGH · rows scanned: ALL · index unusable</text>

            {/* Warning icon row */}
            <text x={410} y={305} fill={C.muted} fontSize={12} fontFamily={MONO} textAnchor="middle">LOWER() · UPPER() · price * 1.1 · price + 5 ──► all break index</text>
          </svg>

          {/* Bottom status */}
          <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 14, color: C.red, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
            <span>function wrapping kills index</span>
            <span>column arithmetic invalidates B-Tree</span>
          </div>
        </Win>
      </div>

      {/* RIGHT: SARGable refactor — moving * 1.1 to / 1.1 */}
      <div style={{opacity: rightP, transform: `translateX(${(1 - rightP) * 30}px)`}}>
        <Editor
          x={980}
          y={180}
          w={860}
          h={220}
          title="SARGable Refactor ──► Move arithmetic to constant side"
          lines={[
            'WHERE price > 100 / 1.1',
            "-- rewrite: keep column 'price' bare",
            '-- index path RECONNECTED ✓',
            '-- optimizer routes to Index Scan',
          ]}
          start={t(52.5)}
          cps={0.78}
          size={17}
          accent={C.green}
          hl={0}
          hlColor={C.green}
        />

        <Win x={980} y={420} w={860} h={480} title="refactor animation ──► * 1.1 moves to / 1.1" accent={C.green} opacity={rightP}>
          <div dir="ltr" style={{position: 'absolute', left: 18, top: 12, fontFamily: MONO, fontSize: 18, color: C.green}}>
            arithmetic migrates to right side ──► column stays bare
          </div>

          {/* SVG refactor animation */}
          <svg width={820} height={360} style={{position: 'absolute', left: 20, top: 50}}>
            {/* Before state (dim) */}
            <text x={20} y={30} fill={C.muted} fontSize={13} fontFamily={MONO} fontWeight={700}>BEFORE (non-SARGable)</text>
            <rect x={20} y={45} width={780} height={60} fill={`${C.red}0d`} stroke={C.red} strokeWidth={2} strokeDasharray="6 4" rx={8} />
            <text x={50} y={82} fill={C.red} fontSize={18} fontFamily={MONO} fontWeight={700}>WHERE price</text>
            <text x={220} y={82} fill={C.amber} fontSize={20} fontFamily={MONO} fontWeight={700}>* 1.1</text>
            <text x={300} y={82} fill={C.red} fontSize={18} fontFamily={MONO} fontWeight={700}>&gt; 100</text>

            {/* Migrating expression — moves with animation */}
            {moveProg > 0 && moveProg < 1 ? (
              <g style={{opacity: exprOpacity, filter: `drop-shadow(0 0 12px ${C.amber})`}}>
                <rect x={exprX} y={120} width={90} height={42} fill={`${C.amber}22`} stroke={C.amber} strokeWidth={3} rx={8} />
                <text x={exprX + 45} y={148} fill={C.amber} fontSize={18} fontFamily={MONO} fontWeight={700} textAnchor="middle">{moveProg > 0.5 ? '/ 1.1' : '* 1.1'}</text>
                {/* Trail line */}
                <path d={`M 265 87 Q ${(265 + exprX + 45) / 2} 100 ${exprX + 45} 120`} fill="none" stroke={C.amber} strokeWidth={2} strokeDasharray="4 3" opacity={0.6} />
              </g>
            ) : null}

            {/* Migration arrow indicator */}
            {moveProg > 0 && moveProg < 1 ? (
              <text x={410} y={115} fill={C.amber} fontSize={13} fontFamily={MONO} fontWeight={700} textAnchor="middle">↻ migrating...</text>
            ) : null}

            {/* After state (highlighted) */}
            <text x={20} y={210} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700}>AFTER (SARGable ✓)</text>
            <rect
              x={20}
              y={225}
              width={780}
              height={60}
              fill={moveProg >= 1 ? `${C.green}22` : `${C.green}0d`}
              stroke={C.green}
              strokeWidth={moveProg >= 1 ? 3 : 2}
              strokeDasharray={moveProg >= 1 ? 'none' : '6 4'}
              rx={8}
              style={moveProg >= 1 ? {filter: `drop-shadow(0 0 12px ${C.green})`} : undefined}
            />
            <text x={50} y={262} fill={C.green} fontSize={18} fontFamily={MONO} fontWeight={700}>WHERE price</text>
            <text x={220} y={262} fill={C.green} fontSize={18} fontFamily={MONO} fontWeight={700}>&gt;</text>
            <text x={260} y={262} fill={C.amber} fontSize={18} fontFamily={MONO} fontWeight={700}>100</text>
            <text x={330} y={262} fill={moveProg >= 1 ? C.amber : C.muted} fontSize={20} fontFamily={MONO} fontWeight={700} opacity={moveProg}>/ 1.1</text>
            {moveProg >= 1 ? <text x={440} y={262} fill={C.green} fontSize={14} fontFamily={MONO} fontWeight={700}>✓ bare column · index-safe</text> : null}

            {/* Reconnected B-Tree */}
            {moveProg >= 1 ? (
              <g style={{opacity: clamp(pop(f, t(70)))}}>
                <text x={20} y={320} fill={C.green} fontSize={13} fontFamily={MONO} fontWeight={700}>✓ Index path reconnected ──► B-Tree traversal</text>
                <circle cx={560} cy={320} r={14} fill={`${C.green}22`} stroke={C.green} strokeWidth={2} />
                <text x={560} y={324} fill={C.green} fontSize={10} fontFamily={MONO} textAnchor="middle">root</text>
                <line x1={560} y1={306} x2={520} y2={295} stroke={C.green} strokeWidth={2} />
                <line x1={560} y1={306} x2={600} y2={295} stroke={C.green} strokeWidth={2} />
                <circle cx={520} cy={285} r={11} fill={`${C.green}22`} stroke={C.green} strokeWidth={2} />
                <circle cx={600} cy={285} r={11} fill={`${C.green}22`} stroke={C.green} strokeWidth={2} />
              </g>
            ) : null}
          </svg>

          {/* Bottom status */}
          <div dir="ltr" style={{position: 'absolute', left: 18, right: 18, bottom: 12, height: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 14, color: C.green, fontWeight: 700, paddingTop: 6, borderTop: '1px solid ' + C.border, background: C.deep}}>
            <span>rule: keep column bare</span>
            <span>move arithmetic to constant side</span>
          </div>
        </Win>
      </div>

      {/* Seal badge */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 920, display: 'flex', justifyContent: 'center', opacity: clamp(sealP)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 22px', border: `2px solid ${C.green}`, borderRadius: 14, background: `${C.green}0d`}}>
          <Check p={sealP} size={36} />
          <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.green, fontWeight: 700}}>Function Wrapping Fix · Column Arithmetic Refactor ✓</div>
        </div>
      </div>

      <Caption text="Refactor: WHERE price * 1.1 > 100 ──► WHERE price > 100 / 1.1 (Index Reconnected)" from={t(60)} to={sec(44)} tone="ok" />
    </Stage>
  );
};
