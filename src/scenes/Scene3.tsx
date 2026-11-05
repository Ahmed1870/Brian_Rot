import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO} from '../theme';
import {Caption, Chip, Editor, Stage, TopBadge, Win, clamp, lerp, pop, prog, sec} from '../kit';

// SC03 (frames 2550-3900, global 85-130s): PARTITION BY + ORDER BY - independent running totals with a counter reset.
const S = 85;
const t = (g: number) => sec(g - S);
const DATES = ['01-Jan', '02-Jan', '03-Jan', '04-Jan'];
const A = [120, 80, 150, 60];
const B = [200, 90, 130, 170];
const RA = [120, 200, 350, 410];
const RB = [200, 290, 420, 590];
const RH = 62;

const Branch: React.FC<{x: number; name: string; color: string; amt: number[]; run: number[]; shown: number; cur: number; p: number}> = ({x, name, color, amt, run, shown, cur, p}) => (
  <Win x={x} y={410} w={840} h={490} title={`sales · ${name}`} accent={color} opacity={p}>
    <div dir="ltr" style={{padding: '0 22px'}}>
      <div style={{display: 'flex', height: 42, alignItems: 'center', fontFamily: MONO, fontSize: 20, color: C.muted, borderBottom: `2px solid ${C.border}`}}>
        <div style={{width: 200, paddingLeft: 12}}>sale_date</div>
        <div style={{width: 180}}>amount</div>
        <div style={{color: C.green, fontWeight: 700}}>branch_running_total</div>
      </div>
      {DATES.map((d, i) => {
        const now = cur === i;
        return (
          <div key={d} style={{display: 'flex', alignItems: 'center', height: RH, marginTop: 6, borderRadius: 10, border: `2px solid ${now ? C.green : C.border}`, background: now ? `${C.green}1F` : C.deep, fontFamily: MONO, fontSize: 26, color: C.text}}>
            <div style={{width: 200, paddingLeft: 14, color}}>{d}</div>
            <div style={{width: 180}}>{amt[i]}</div>
            <div style={{color: C.green, fontWeight: 700, opacity: i < shown ? 1 : 0, transform: `scale(${now ? 1.15 : 1})`, transformOrigin: 'left center'}}>{run[i]}</div>
          </div>
        );
      })}
    </div>
  </Win>
);

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const panels = prog(f, t(92.7), 24);
  const indep = pop(f, t(95.0));
  const autoReset = pop(f, t(100.0));
  const aShown = f >= t(106.2) ? Math.min(4, Math.floor((f - t(106.2)) / sec(1.9)) + 1) : 0;
  const bShown = f >= t(121.9) ? Math.min(4, Math.floor((f - t(121.9)) / sec(1.6)) + 1) : 0;
  const resetP = prog(f, t(118.6), 14);
  const aVal = aShown ? RA[aShown - 1] : 0;
  const bVal = bShown ? RB[bShown - 1] : 0;
  const val = f < t(118.6) ? aVal : f < t(119.6) ? Math.round(lerp(410, 0, resetP)) : bVal;
  const next = pop(f, t(114.1)) * (1 - prog(f, t(118.0), 8));
  const pulse = f >= t(118.6) && f < t(120.2) ? 1 - prog(f, t(118.6), sec(1.6)) : 0;
  const indepDone = pop(f, t(126.4));
  const curA = f < t(114.0) && aShown ? aShown - 1 : -1;
  const curB = f >= t(121.9) && bShown ? bShown - 1 : -1;

  return (
    <Stage dur={1350} inFx="left" outFx="up">
      <TopBadge text="PARTITION BY + ORDER BY | تصفير العداد لكل قطاع" from={t(86.4)} to={t(98)} color={C.blue} />

      <Editor x={90} y={150} w={1250} h={240} title="branch_running_total.sql" lines={['SELECT branch_id, sale_date, amount,', '       SUM(amount) OVER(PARTITION BY branch_id ORDER BY sale_date)', '       AS branch_running_total', 'FROM sales;']} start={t(96.0)} cps={1.3} size={22} accent={C.blue} />

      {/* accumulator */}
      <div dir="ltr" style={{position: 'absolute', left: 1380, top: 150, width: 450, height: 240, borderRadius: 24, border: `3px solid ${pulse > 0 ? C.amber : C.green}`, background: C.card, boxShadow: `0 0 ${50 * pulse}px ${C.amber}, 0 0 ${24}px ${C.green}33`, opacity: prog(f, t(104.0), 18), transform: `scale(${1 + 0.06 * pulse})`}}>
        <div style={{padding: '22px 30px', fontFamily: MONO}}>
          <div style={{fontSize: 22, color: C.muted}}>accumulator</div>
          <div style={{fontSize: 96, fontWeight: 700, color: pulse > 0 ? C.amber : C.green, lineHeight: 1.1}}>{val}</div>
          <div style={{fontSize: 20, color: pulse > 0 ? C.amber : C.muted}}>{pulse > 0 ? 'RESET → 0' : f >= t(121.9) ? 'Branch B' : 'Branch A'}</div>
        </div>
      </div>

      <Branch x={90} name="Branch A" color={C.blue} amt={A} run={RA} shown={aShown} cur={curA} p={panels} />
      <Branch x={990} name="Branch B" color={C.amber} amt={B} run={RB} shown={bShown} cur={curB} p={panels} />

      <div dir="ltr" style={{position: 'absolute', left: 740, top: 604, opacity: next, transform: `scale(${0.9 + 0.1 * next})`}}>
        <Chip color={C.amber} style={{fontSize: 24, background: `${C.amber}26`}}>next partition →</Chip>
      </div>

      <div dir="ltr" style={{position: 'absolute', left: 90, top: 912, display: 'flex', gap: 16, opacity: 1}}>
        <div style={{transform: `scale(${clamp(indep)})`, transformOrigin: 'left center', opacity: clamp(indep)}}><Chip color={C.blue} style={{fontSize: 22}}>independent per partition</Chip></div>
        <div style={{transform: `scale(${clamp(autoReset)})`, transformOrigin: 'left center', opacity: clamp(autoReset)}}><Chip color={C.amber} style={{fontSize: 22}}>auto reset at each new group</Chip></div>
        <div style={{transform: `scale(${clamp(indepDone)})`, transformOrigin: 'left center', opacity: clamp(indepDone)}}><Chip color={C.green} style={{fontSize: 22, background: `${C.green}26`}}>no overlap ✓</Chip></div>
      </div>

      <Caption text="SUM(amount) OVER(PARTITION BY branch_id ORDER BY sale_date)" from={t(105.4)} to={t(113.6)} />
      <Caption text="Partition Reset ──► Zeroes Out Accumulator for Each New Sub-Group" from={t(118.0)} to={t(128.2)} />
    </Stage>
  );
};
