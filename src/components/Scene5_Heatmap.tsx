import React from 'react';
import {C, SARA_SCORE, fr, T} from '../theme';
import {ChalkDefs, Stroke, Txt, arrowD, lineD, rectD} from '../lib/chalk';
import {Header, Sheet} from '../lib/board';
import {easeOut, ramp} from '../lib/anim';

const S = (t: number) => fr(t);
const X0 = 330, Y0 = 170, CW = 170, CH = 146; // grid: 5 x 5 cells, R score across, F+M score up

type Region = {name: string; strat: string; r0: number; r1: number; fm0: number; fm1: number};
// 3x3 simplified RFM segmentation: R bands (1-2 | 3 | 4-5) x FM bands (1-2 | 3 | 4-5)
const REGIONS: Region[] = [
  {name: "Can't Lose", strat: 'Personal outreach', r0: 1, r1: 2, fm0: 4, fm1: 5},
  {name: 'Loyal', strat: 'Upsell & reviews', r0: 3, r1: 3, fm0: 4, fm1: 5},
  {name: 'CHAMPIONS', strat: 'Loyalty & VIP Pass', r0: 4, r1: 5, fm0: 4, fm1: 5},
  {name: 'At Risk', strat: 'Win-back Campaign', r0: 1, r1: 2, fm0: 3, fm1: 3},
  {name: 'Need Attention', strat: 'Limited offers', r0: 3, r1: 3, fm0: 3, fm1: 3},
  {name: 'Potential Loyal', strat: 'Membership offer', r0: 4, r1: 5, fm0: 3, fm1: 3},
  {name: 'Hibernating', strat: 'Low-cost reactivation', r0: 1, r1: 2, fm0: 1, fm1: 2},
  {name: 'About to Sleep', strat: 'Gentle reminder', r0: 3, r1: 3, fm0: 1, fm1: 2},
  {name: 'New / Promising', strat: 'Onboarding series', r0: 4, r1: 5, fm0: 1, fm1: 2},
];

/** Scene 5 (214.1 - 234.3s): RFM heatmap -> one marketing strategy per segment. */
export const Scene5_Heatmap: React.FC<{f: number}> = ({f}) => {
  const a0 = S(T.heatmap), a1 = S(234.3);
  const cellX = (r: number) => X0 + (r - 1) * CW;
  const cellY = (fm: number) => Y0 + (5 - fm) * CH;
  const champ = ramp(f, S(224.0), S(224.0) + 12), risk = ramp(f, S(228.0), S(228.0) + 12);
  return (
    <>
      <Header f={f - a0} label="DECISIONS" n={5} />
      <Sheet f={f} from={a0} to={a1}>
        <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
          <ChalkDefs />
          {/* heat: yellow chalk, denser = more valuable (no glow) */}
          {Array.from({length: 25}, (_, i) => {
            const r = (i % 5) + 1, fm = Math.floor(i / 5) + 1;
            const t = ramp(f, a0 + 20 + ((r - 1) + (fm - 1)) * 10, a0 + 34 + ((r - 1) + (fm - 1)) * 10);
            const v = ((r - 1) + (fm - 1)) / 8;
            return <rect key={i} x={cellX(r) + 3} y={cellY(fm) + 3} width={CW - 6} height={CH - 6} fill={C.yellow} opacity={t * (0.06 + 0.62 * v * v)} />;
          })}
          <g filter="url(#chalk)">
            <Stroke d={rectD(X0, Y0, CW * 5, CH * 5, 3)} f={f} from={a0 + 4} dur={30} w={4.5} />
            {[1, 2, 3, 4].map((i) => <Stroke key={`v${i}`} d={lineD(X0 + i * CW, Y0, X0 + i * CW, Y0 + CH * 5, 10 + i)} f={f} from={a0 + 10 + i * 3} dur={18} w={2} />)}
            {[1, 2, 3, 4].map((i) => <Stroke key={`h${i}`} d={lineD(X0, Y0 + i * CH, X0 + CW * 5, Y0 + i * CH, 20 + i)} f={f} from={a0 + 10 + i * 3} dur={18} w={2} />)}
            {/* region borders */}
            {REGIONS.map((g, i) => <Stroke key={i} d={rectD(cellX(g.r0), cellY(g.fm1), (g.r1 - g.r0 + 1) * CW, (g.fm1 - g.fm0 + 1) * CH, 40 + i)} f={f} from={a0 + 60 + i * 4} dur={14} w={3.5} />)}
            <Stroke d={arrowD(X0 - 40, Y0 + CH * 5, X0 - 40, Y0 - 10, 60, 22)} f={f} from={a0 + 40} dur={20} w={4} />
            <Stroke d={arrowD(X0, Y0 + CH * 5 + 40, X0 + CW * 5 + 10, Y0 + CH * 5 + 40, 61, 22)} f={f} from={a0 + 44} dur={20} w={4} />
            {/* strategy arrows */}
            <Stroke d={arrowD(1330, 250, cellX(5) + CW - 10, cellY(5) + 60, 70, 22)} f={f} from={S(224.0)} dur={16} w={5} color={C.yellow} />
            <Stroke d={arrowD(1330, 720, cellX(2) + CW - 30, cellY(3) + 60, 71, 22)} f={f} from={S(228.0)} dur={16} w={5} color={C.yellow} />
          </g>
          {REGIONS.map((g, i) => {
            const cx = cellX(g.r0) + ((g.r1 - g.r0 + 1) * CW) / 2, cy = cellY(g.fm1) + ((g.fm1 - g.fm0 + 1) * CH) / 2;
            const hot = g.name === 'CHAMPIONS' || g.name === 'At Risk';
            return <Txt key={i} x={cx} y={cy + 8} text={g.name} f={f} from={a0 + 70 + i * 5} size={hot ? 34 : 28} anchor="middle" weight={900} color={hot ? C.yellow : C.chalk} cps={1.3} />;
          })}
          <Txt x={X0 + CW * 2.5} y={Y0 + CH * 5 + 96} text="Recency score  (1 → 5)" f={f} from={a0 + 50} size={34} anchor="middle" color={C.dim} cps={1.4} />
          <Txt x={X0 - 70} y={Y0 + CH * 2.5 - 8} text="Frequency" f={f} from={a0 + 50} size={32} anchor="end" color={C.dim} cps={1.4} />
          <Txt x={X0 - 70} y={Y0 + CH * 2.5 + 32} text="+ Monetary" f={f} from={a0 + 52} size={32} anchor="end" color={C.dim} cps={1.4} />
          <Txt x={1330} y={190} text="Actionable Strategy" f={f} from={S(T.strategies)} size={56} weight={900} cps={1.0} />
          <Txt x={1330} y={290} text="555  →  Loyalty & VIP Pass" f={f} from={S(224.2)} size={46} color={C.yellow} weight={900} cps={1.2} />
          <Txt x={1330} y={760} text={`${SARA_SCORE}  →  Win-back Campaign`} f={f} from={S(228.2)} size={46} color={C.yellow} weight={900} cps={1.2} />
          {[['Champions', 'Reward & early access'], ['Loyal', 'Upsell & reviews'], ['At Risk', 'Direct discount to return'], ['Hibernating', 'Low-cost reactivation']].map(([a, b], i) => (
            <Txt key={a} x={1330} y={400 + i * 70} text={`${a}: ${b}`} f={f} from={S(225.0) + i * 14} size={32} cps={1.5} color={C.chalk} />
          ))}
          <Txt x={960} y={1030} text="From summarizing numbers  →  to planning decisions" f={f} from={S(230.2)} size={50} anchor="middle" color={C.yellow} weight={900} cps={1.2} />
        </svg>
      </Sheet>
    </>
  );
};
