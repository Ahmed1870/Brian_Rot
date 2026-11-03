import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONT, MONO} from '../theme';
import {Caption, Chip, Editor, Mix, Stage, TopBadge, clamp, lerp, pop, prog, sec} from '../kit';

// SC04 (frames 3879-5036, global 129.3-167.9s): LIMIT / OFFSET as a sliding window over the sorted rows.
const S = 129.3;
const t = (g: number) => sec(g - S);
const CELL = 40;
const STEP = 42;
const X0 = 120;
const STRIP_Y = 520;

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const strip = prog(f, t(131.8), 30);
  const limitWin = prog(f, t(140.9), 20);
  const skip = prog(f, t(147.6), sec(4.5));
  const jump = prog(f, t(156.6), sec(4.6));
  const res = prog(f, t(161.6), 24);
  const pages = prog(f, t(163.4), 22);
  const skipped = Math.round(skip * 20);
  const winStart = lerp(0, 20, jump);
  const winX = X0 + winStart * STEP - 6;
  const showWin = limitWin;

  return (
    <Stage dur={1157} inFx="up" outFx="zoom">
      <TopBadge text="التقطيع | LIMIT و OFFSET (Pagination)" from={t(131.2)} to={t(147)} color={C.blue} />

      <Editor x={90} y={150} w={1740} h={190} title="pagination.sql" lines={['SELECT * FROM orders', 'ORDER BY order_date DESC LIMIT 10 OFFSET 20;']} start={t(131.0)} cps={0.95} size={32} accent={C.blue} />

      {/* data strip */}
      <div dir="ltr" style={{position: 'absolute', left: X0 - 6, top: STRIP_Y - 60, fontFamily: MONO, fontSize: 22, color: C.muted, opacity: strip}}>orders · sorted by order_date DESC</div>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        {Array.from({length: 40}).map((_, i) => {
          const isSkipped = i < skipped;
          const inWin = i >= Math.round(winStart) && i < Math.round(winStart) + 10;
          const p = clamp(strip * 1.4 - i * 0.012);
          return (
            <g key={i} opacity={p}>
              <rect x={X0 + i * STEP} y={STRIP_Y} width={CELL} height={110} rx={8} fill={isSkipped ? '#1E293B' : inWin && showWin > 0.5 ? `${C.blue}33` : C.card} stroke={isSkipped ? C.border : inWin && showWin > 0.5 ? C.blue : C.muted} strokeWidth={2} strokeDasharray={isSkipped ? '5 5' : '0'} />
              <text x={X0 + i * STEP + CELL / 2} y={STRIP_Y + 64} textAnchor="middle" fontFamily={MONO} fontSize={15} fill={isSkipped ? '#475569' : C.text}>{i + 1}</text>
            </g>
          );
        })}

        {/* skipped brace */}
        <g opacity={clamp(skip * 2)}>
          <path d={`M${X0} ${STRIP_Y + 140} V${STRIP_Y + 156} H${X0 + skip * 20 * STEP - 6} V${STRIP_Y + 140}`} fill="none" stroke={C.red} strokeWidth={4} strokeLinecap="round" />
          <text x={X0 + (skip * 20 * STEP) / 2} y={STRIP_Y + 196} textAnchor="middle" fontFamily={MONO} fontSize={26} fontWeight={700} fill={C.red}>OFFSET 20 · skipped {skipped}</text>
        </g>

        {/* sliding window */}
        <g opacity={showWin}>
          <rect x={winX} y={STRIP_Y - 18} width={10 * STEP + 6} height={146} rx={16} fill={`${C.amber}14`} stroke={C.amber} strokeWidth={5} />
          <text x={winX + (10 * STEP) / 2} y={STRIP_Y - 30} textAnchor="middle" fontFamily={MONO} fontSize={26} fontWeight={700} fill={C.amber}>LIMIT 10</text>
        </g>
      </svg>

      {/* result rows */}
      <div dir="ltr" style={{position: 'absolute', left: X0 - 6, top: 790, width: 1700, display: 'flex', gap: 10, alignItems: 'center', opacity: res}}>
        <Chip color={C.amber} style={{fontSize: 24}}>10 rows returned →</Chip>
        {Array.from({length: 10}).map((_, i) => (
          <div key={i} style={{width: 76, height: 52, borderRadius: 10, border: `2px solid ${C.amber}`, background: `${C.amber}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontSize: 22, color: C.text, transform: `translateY(${(1 - clamp(pop(f, t(161.6) + i * 3))) * 20}px)`, opacity: clamp(pop(f, t(161.6) + i * 3))}}>#{21 + i}</div>
        ))}
      </div>

      {/* page formula */}
      <div dir="ltr" style={{position: 'absolute', left: X0 - 6, top: 862, display: 'flex', gap: 18, alignItems: 'center', opacity: pages}}>
        {[1, 2, 3].map((n) => (
          <Chip key={n} color={n === 3 ? C.amber : C.muted} style={{fontSize: 22}}>Page {n} → OFFSET {(n - 1) * 10}</Chip>
        ))}
      </div>

      <Caption text="LIMIT 10 ──► Fetches Only Top 10 Records" from={t(141)} to={t(147.2)} />
      <Caption text="OFFSET 20 ──► Skips First 20 Rows" from={t(147.8)} to={t(161)} />
    </Stage>
  );
};
