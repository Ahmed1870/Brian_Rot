import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO} from '../theme';
import {Caption, Chip, Mix, Stage, TopBadge, clamp, lerp, pop, prog, sec} from '../kit';

// SC03 (frames 2550-3900, global 85-130s): GROUP BY collapses 100 rows into 4; OVER() keeps all 100 and appends the metric.
const S = 85;
const t = (g: number) => sec(g - S);
const STEP = 50;
const CELL = 44;
const LX = 120;
const RX = 1020;
const GY = 300;
const PCOL = [C.blue, C.purple, C.amber, C.slate400];
const part = (r: number) => (r < 3 ? 0 : r < 5 ? 1 : r < 8 ? 2 : 3);
const AVGS = ['112.50', '673.33', '426.67', '310.00'];

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const panels = prog(f, t(86.4), 24);
  const lbl = pop(f, t(93.4));
  const sumBars = prog(f, t(96.6), 24);
  const lost = pop(f, t(100.9));
  const keep = pop(f, t(105.4));
  const identity = pop(f, t(112.9));
  const noJoin = pop(f, t(116.6));
  const noDer = pop(f, t(119.9));
  const notNeeded = pop(f, t(122.6));
  const glow = 0.5 + 0.5 * Math.sin(f / 8);

  const cells: React.ReactNode[] = [];
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 10; c++) {
      const k = part(r);
      const idx = r * 10 + c;
      const col = PCOL[k];
      const m = prog(f, t(96.6) + idx * 0.9, sec(1.6));
      const tx = 700 + 110 - CELL / 2;
      const ty = 330 + k * 110 + 35 - CELL / 2;
      const lxp = lerp(LX + c * STEP, tx, m);
      const lyp = lerp(GY + r * STEP, ty, m);
      const sc = 1 - 0.75 * m;
      cells.push(<rect key={`l${idx}`} x={lxp} y={lyp} width={CELL} height={CELL} rx={8} fill={`${col}55`} stroke={col} strokeWidth={2} opacity={panels * (m > 0.98 ? 0 : 1)} transform={`translate(${(CELL * (1 - sc)) / 2} ${(CELL * (1 - sc)) / 2}) scale(${sc})`} />);
      cells.push(<rect key={`r${idx}`} x={RX + c * STEP} y={GY + r * STEP} width={CELL} height={CELL} rx={8} fill={`${col}55`} stroke={col} strokeWidth={2} opacity={panels} />);
    }
  }

  return (
    <Stage dur={1350} inFx="left" outFx="up">
      <TopBadge text="GROUP BY مقابل OVER() | الانكماش مقابل الاحتفاظ" from={t(86.6)} to={t(98)} color={C.blue} />

      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        <rect x={90} y={190} width={840} height={700} rx={24} fill={C.card} stroke={sumBars > 0.2 ? C.red : C.border} strokeWidth={2} opacity={panels} />
        <rect x={990} y={190} width={840} height={700} rx={24} fill={C.card} stroke={keep > 0.2 ? C.green : C.border} strokeWidth={2} opacity={panels} />
        {cells}
        {/* summary rows (GROUP BY) */}
        {[0, 1, 2, 3].map((k) => (
          <g key={k} opacity={sumBars}>
            <rect x={700} y={330 + k * 110} width={220 * sumBars} height={70} rx={12} fill={`${C.red}22`} stroke={C.red} strokeWidth={3} />
            <text x={716} y={330 + k * 110 + 44} fontFamily={MONO} fontSize={22} fill={C.text}>group {k + 1} · avg</text>
          </g>
        ))}
      </svg>

      {/* headers */}
      <div dir="ltr" style={{position: 'absolute', left: 120, top: 212, opacity: panels}}><Chip color={C.red} style={{fontSize: 24}}>GROUP BY</Chip></div>
      <div dir="ltr" style={{position: 'absolute', left: 1020, top: 212, opacity: panels}}><Chip color={C.green} style={{fontSize: 24}}>OVER()</Chip></div>
      <div dir="ltr" style={{position: 'absolute', left: 700, top: 212, opacity: clamp(lbl), transform: `scale(${clamp(lbl)})`, transformOrigin: 'left center'}}><Chip color={C.muted} style={{fontSize: 20}}>100 rows · 4 departments</Chip></div>

      {/* left counter */}
      <div dir="ltr" style={{position: 'absolute', left: 120, top: 818, display: 'flex', alignItems: 'center', gap: 20, opacity: clamp(lost), transform: `scale(${0.9 + 0.1 * clamp(lost)})`, transformOrigin: 'left center'}}>
        <span style={{fontFamily: MONO, fontSize: 44, fontWeight: 700, color: C.red}}>100 → 4</span>
        <Chip color={C.red} style={{fontSize: 20}}>names & details lost ✕</Chip>
      </div>

      {/* metric column on the right */}
      {Array.from({length: 10}).map((_, r) => {
        const p = pop(f, t(109.8) + r * 4);
        return (
          <div key={r} dir="ltr" style={{position: 'absolute', left: 1540, top: GY + r * STEP + 3, width: 250, height: 38, borderRadius: 10, border: `2px solid ${C.green}`, background: `${C.green}1F`, display: 'flex', alignItems: 'center', padding: '0 14px', fontFamily: MONO, fontSize: 20, fontWeight: 700, color: C.green, opacity: clamp(p), transform: `translateX(${(1 - clamp(p)) * 80}px)`, boxShadow: p > 0.8 ? `0 0 ${10 * glow}px ${C.green}44` : 'none'}}>avg {AVGS[part(r)]}</div>
        );
      })}

      {/* right counter and no-join chips */}
      <div dir="ltr" style={{position: 'absolute', left: 1020, top: 818, display: 'flex', alignItems: 'center', gap: 16, opacity: clamp(keep)}}>
        <span style={{fontFamily: MONO, fontSize: 44, fontWeight: 700, color: C.green}}>100 → 100</span>
        <div style={{opacity: clamp(identity)}}><Chip color={C.green} style={{fontSize: 20, background: `${C.green}26`}}>every row keeps identity ✓</Chip></div>
      </div>
      <div dir="ltr" style={{position: 'absolute', left: 1020, top: 770, display: 'flex', gap: 14, alignItems: 'center'}}>
        <div style={{opacity: clamp(noJoin), textDecoration: 'line-through', textDecorationColor: C.red}}><Chip color={C.muted} style={{fontSize: 20}}>JOIN</Chip></div>
        <div style={{opacity: clamp(noDer), textDecoration: 'line-through', textDecorationColor: C.red}}><Chip color={C.muted} style={{fontSize: 20}}>Derived Table</Chip></div>
        <div style={{opacity: clamp(notNeeded)}}><Mix style={{fontSize: 24, fontWeight: 700, color: C.green}}>غير مطلوبة ✓</Mix></div>
      </div>

      <Caption text="GROUP BY ──► Collapses 100 Rows to 4 Summary Rows (Loses Detail)" from={t(96.8)} to={t(105)} />
      <Caption text="Window Functions ──► Retains All 100 Rows + Appends Group Metric" from={t(105.6)} to={t(127.4)} />
    </Stage>
  );
};
