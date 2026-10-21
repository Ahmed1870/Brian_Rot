import React from 'react';
import {C, SARA_SCORE, fr, T} from '../theme';
import {ChalkDefs, Stroke, Txt, arrowD, circleD, count, fmtN, lineD, polyD, rectD} from '../lib/chalk';
import {Header, Sheet} from '../lib/board';
import {easeOut, ramp} from '../lib/anim';

const S = (t: number) => fr(t);

type Cust = {
  x0: number; name: string; who: string; last: string; lastN: number; orders: number; spend: number; r: number; fq: number; m: number;
  score: string; tagText: string; strat: string; tData: number; tScores: number; tResult: number; tStrat: number; seed: number;
};

const Card: React.FC<{f: number; c: Cust}> = ({f, c}) => {
  const x0 = c.x0, w = 790;
  const cnt = (t: number, to: number) => count(f, t, 36, to);
  return (
    <g>
      <g filter="url(#chalk)">
        <Stroke d={rectD(x0, 190, w, 770, c.seed)} f={f} from={c.tData - 40} dur={34} w={4.5} />
        <Stroke d={lineD(x0 + 30, 290, x0 + w - 30, 290, c.seed + 1)} f={f} from={c.tData - 10} dur={16} w={3} color={C.yellow} />
        {[0, 1, 2].map((i) => <Stroke key={i} d={lineD(x0 + 30, 410 + i * 90, x0 + w - 30, 410 + i * 90, c.seed + 5 + i)} f={f} from={c.tData + 6 + i * 6} dur={10} w={2} />)}
        {[0, 1, 2].map((i) => <Stroke key={i} d={rectD(x0 + 50 + i * 240, 580, 200, 120, c.seed + 20 + i)} f={f} from={c.tScores + i * 8} dur={14} w={4.5} color={C.yellow} />)}
        <Stroke d={rectD(x0 + 400, 770, 340, 90, c.seed + 40)} f={f} from={c.tResult + 40} dur={16} w={4.5} />
        <Stroke d={arrowD(x0 + 570, 870, x0 + 570, 960, c.seed + 41, 22)} f={f} from={c.tStrat} dur={14} w={5} color={C.yellow} />
      </g>
      <Txt x={x0 + w / 2} y={260} text={c.name} f={f} from={c.tData - 30} size={50} weight={900} anchor="middle" cps={1.2} />
      {[['Last purchase', c.last], ['Orders', fmtN(cnt(c.tData + 10, c.orders))], ['Total spend', `${fmtN(cnt(c.tData + 22, c.spend))} EGP`]].map(([l, v], i) => (
        <React.Fragment key={l}>
          <Txt x={x0 + 40} y={372 + i * 90} text={l} f={f} from={c.tData + i * 6} size={40} color={C.dim} cps={1.5} />
          <Txt x={x0 + w - 40} y={372 + i * 90} text={i === 0 ? c.last : v} f={f} from={c.tData + 6 + i * 6} size={44} anchor="end" cps={4} />
        </React.Fragment>
      ))}
      {['R', 'F', 'M'].map((l, i) => (
        <React.Fragment key={l}>
          <Txt x={x0 + 150 + i * 240} y={670} text={`${l} = ${[c.r, c.fq, c.m][i]}`} f={f} from={c.tScores + 8 + i * 8} size={60} anchor="middle" weight={900} color={C.yellow} cps={1.0} />
        </React.Fragment>
      ))}
      <Txt x={x0 + 60} y={860} text={c.score} f={f} from={c.tResult} size={170} weight={900} color={C.yellow} cps={0.35} />
      <Txt x={x0 + 570} y={832} text={c.tagText} f={f} from={c.tResult + 44} size={46} weight={900} anchor="middle" cps={1.0} />
      <Txt x={x0 + w / 2} y={1030} text={c.strat} f={f} from={c.tStrat + 10} size={50} weight={900} color={C.yellow} anchor="middle" cps={1.1} />
    </g>
  );
};

/** Scene 3 (120.35 - 176.8s): Ahmed (555, Champion) vs Sara (151, At Risk) with animated numbers and strategy tags. */
export const Scene3_CaseStudy: React.FC<{f: number}> = ({f}) => {
  const a0 = S(T.caseIntro), a1 = S(176.8);
  const A: Cust = {x0: 110, name: 'Customer A · Ahmed', who: 'A', last: '2 days ago', lastN: 2, orders: 15, spend: 10000, r: 5, fq: 5, m: 5, score: '555', tagText: 'CHAMPION',
    strat: 'Strategy: Loyalty & VIP Pass', tData: S(T.ahmedData), tScores: S(T.ahmedScores), tResult: S(T.ahmedResult), tStrat: S(T.ahmedStrategy), seed: 3};
  const B: Cust = {x0: 1020, name: 'Customer B · Sara', who: 'B', last: '180 days ago', lastN: 180, orders: 1, spend: 150, r: 1, fq: 1, m: 1, score: SARA_SCORE, tagText: 'AT RISK',
    strat: 'Strategy: Win-back Campaign', tData: S(T.saraData), tScores: S(T.saraScores), tResult: S(T.saraResult), tStrat: S(T.saraStrategy), seed: 11};
  return (
    <>
      <Header f={f - a0} label="CASE STUDY" n={3} />
      <Sheet f={f} from={a0} to={a1}>
        <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
          <ChalkDefs />
          <Txt x={960} y={150} text="Business case: same formula, two customers" f={f} from={a0 + 4} size={52} anchor="middle" cps={1.3} />
          <g filter="url(#chalk)"><Stroke d={circleD(960, 540, 52, 77)} f={f} from={S(T.ahmedData) - 20} dur={14} w={4} color={C.yellow} /></g>
          <Txt x={960} y={558} text="VS" f={f} from={S(T.ahmedData) - 14} size={44} weight={900} anchor="middle" color={C.yellow} cps={0.5} />
          <Card f={f} c={A} />
          <Card f={f} c={B} />
        </svg>
      </Sheet>
    </>
  );
};
