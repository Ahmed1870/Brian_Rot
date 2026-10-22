import React from 'react';
import {C, fr, T} from '../theme';
import {CAIRO} from '../fonts';
import {clamp, easeOut, ramp, sp, SP} from '../lib/anim';
import {ChalkDefs, Formula, Stroke, Txt, arrowD, circleD, lineD, rectD} from '../lib/chalk';
import {Sheet} from '../lib/board';
import {ArText, Header} from '../lib/ar';

const S = (t: number) => fr(t);
const W = 1080, H = 1920;
const A = {x: 360, y: 520, r: 200}, B = {x: 720, y: 520, r: 200};
const CARDS = [
  {y: 940, h: 210, n: '1', ar: 'الدعم (Support)', sub: 'مدى تكرار المنتجين معاً', val: '30%', tn: T.support, tt: T.supportName, ts: T.supportExp},
  {y: 1175, h: 210, n: '2', ar: 'الثقة (Confidence)', sub: 'احتمالية شراء ب بعد أ', val: '75%', tn: T.confidence, tt: T.confidenceName, ts: T.confidenceExp},
  {y: 1410, h: 290, n: '3', ar: 'الرفع (Lift)', sub: 'الارتباط الحقيقي (أكبر من 1 = قوي)', val: '1.5', tn: T.lift, tt: T.liftName, ts: T.liftExp},
];

/** Scene 2 (25.5 - 58.9s): Apriori. A Venn of two products + three metric cards, Lift highlighted. */
export const Scene2_Apriori: React.FC<{f: number}> = ({f}) => {
  const a0 = S(T.apriori) - 6, a1 = S(58.9);
  const supHi = ramp(f, S(T.supportName), S(T.supportName) + 14) * (1 - ramp(f, S(T.confidence), S(T.confidence) + 10));
  const conf = ramp(f, S(T.confidenceName), S(T.confidenceName) + 14);
  const lift = ramp(f, S(T.lift), S(T.lift) + 12);
  const fadeF = (t0: number, t1: number) => ramp(f, S(t0), S(t0) + 8) * (1 - ramp(f, S(t1), S(t1) + 8));
  const ding = f - S(T.liftName);
  const rule = ramp(f, S(T.liftRule), S(T.liftRule) + 14);
  return (
    <>
      <Sheet f={f} from={a0} to={a1}>
  <Header f={f - a0} label="APRIORI" n={2} />
        <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{position: 'absolute', left: 0, top: 0}}>
          <ChalkDefs />
          <defs><clipPath id="clipA"><circle cx={A.x} cy={A.y} r={A.r} /></clipPath></defs>
          {/* overlap highlight (Support) */}
          <g clipPath="url(#clipA)"><circle cx={B.x} cy={B.y} r={B.r} fill={C.yellow} opacity={0.5 * supHi} /></g>
          <g filter="url(#chalk)">
            <Stroke d={circleD(A.x, A.y, A.r, 3)} f={f} from={S(T.apriori) + 20} dur={34} w={conf > 0.5 ? 7 : 5} color={conf > 0.5 ? C.yellow : C.chalk} />
            <Stroke d={circleD(B.x, B.y, B.r, 5)} f={f} from={S(T.apriori) + 40} dur={34} w={5} />
            {/* confidence: A -> B */}
            <Stroke d="M 330 330 C 450 170, 650 170, 760 330" f={f} from={S(T.confidenceName)} dur={26} w={6} color={C.yellow} />
            <Stroke d={arrowD(748, 300, 762, 336, 9, 22)} f={f} from={S(T.confidenceName) + 22} dur={8} w={6} color={C.yellow} />
          </g>
          <Txt x={540} y={218} text="Apriori Algorithm" f={f} from={S(T.apriori)} size={78} weight={900} anchor="middle" cps={1.0} />
          <Txt x={200} y={510} text="Phone" f={f} from={S(T.apriori) + 52} size={38} anchor="middle" weight={900} cps={1.2} color={C.dim} />
          <Txt x={880} y={510} text="Earbuds" f={f} from={S(T.apriori) + 56} size={38} anchor="middle" weight={900} cps={1.2} color={C.dim} />
          <Txt x={A.x - 110} y={A.y + 50} text="10" f={f} from={S(T.apriori) + 70} size={70} anchor="middle" weight={900} cps={0.5} />
          <Txt x={540} y={A.y + 50} text="30" f={f} from={S(T.apriori) + 76} size={78} anchor="middle" weight={900} cps={0.5} color={supHi > 0.4 ? C.bg : C.yellow} />
          <Txt x={B.x + 110} y={B.y + 50} text="20" f={f} from={S(T.apriori) + 82} size={70} anchor="middle" weight={900} cps={0.5} />
          <Txt x={540} y={782} text="100 invoices  ·  Phone 40  ·  Earbuds 50" f={f} from={S(T.three) - 20} size={30} anchor="middle" color={C.dim} cps={1.5} />
          {/* formulas: one at a time */}
          <g opacity={fadeF(T.supportExp, T.confidence)}><Formula id="fSup" x={540} y={868} f={f} from={S(T.supportExp)} size={46} width={1000} anchor="middle" parts={[{t: 'Support', it: true}, {t: '(A,B) = 30 / 100 = '}, {t: '30%', color: C.yellow}]} /></g>
          <g opacity={fadeF(T.confidenceExp, T.lift)}><Formula id="fConf" x={540} y={868} f={f} from={S(T.confidenceExp)} size={46} width={1000} anchor="middle" parts={[{t: 'Confidence', it: true}, {t: '(A→B) = 30 / 40 = '}, {t: '75%', color: C.yellow}]} /></g>
          <g opacity={ramp(f, S(T.liftExp), S(T.liftExp) + 8)}><Formula id="fLift" x={540} y={868} f={f} from={S(T.liftExp)} size={52} width={1000} anchor="middle" parts={[{t: 'Lift', it: true}, {t: ' = 75% / 50% = '}, {t: '1.5', color: C.yellow}]} /></g>

          {/* metric cards */}
          {CARDS.map((c, i) => {
            const act = ramp(f, S(c.tn), S(c.tn) + 10);
            const dim = i < 2 && lift > 0 ? 0.4 : 1;
            const big = i === 2 ? lift : 0;
            return (
              <g key={i} opacity={dim}>
                <g filter="url(#chalk)">
                  <Stroke d={rectD(60, c.y, 960, c.h, 40 + i)} f={f} from={S(T.three) + i * 14} dur={22} w={act > 0.5 ? (i === 2 ? 8 : 5) : 3} color={act > 0.5 ? C.yellow : C.dim} fill={i === 2 && lift > 0 ? 'rgba(244,208,63,0.14)' : 'none'} />
                  <Stroke d={circleD(930, c.y + 56, 38, 50 + i)} f={f} from={S(c.tn)} dur={12} w={5} color={C.yellow} />
                </g>
                <Txt x={930} y={c.y + 72} text={c.n} f={f} from={S(c.tn) + 6} size={52} weight={900} anchor="middle" color={C.yellow} cps={0.5} />
                <Txt x={110} y={c.y + (i === 2 ? 120 : 110)} text={c.val} f={f} from={S(c.ts) + 50} size={i === 2 ? 110 : 84} weight={900} color={C.yellow} cps={0.45} />
              </g>
            );
          })}
          {/* lift number line */}
          <g opacity={ramp(f, S(54.2), S(54.2) + 10)}>
            <g filter="url(#chalk)">
              <Stroke d={lineD(150, 1655, 930, 1655, 70)} f={f} from={S(54.2)} dur={22} w={4} />
              {[0, 1, 2, 3].map((v) => <Stroke key={v} d={lineD(150 + v * 260, 1640, 150 + v * 260, 1670, 71 + v)} f={f} from={S(54.6)} dur={8} w={3} />)}
              <Stroke d={rectD(410, 1632, 520, 46, 80)} f={f} from={S(T.liftRule)} dur={16} w={0.1} fill="rgba(244,208,63,0.35)" color="rgba(0,0,0,0)" />
              <Stroke d={lineD(410, 1610, 410, 1690, 81)} f={f} from={S(T.liftRule)} dur={10} w={8} color={C.yellow} />
              <Stroke d={arrowD(540, 1590, 540, 1632, 82, 18)} f={f} from={S(55.0)} dur={12} w={5} color={C.yellow} />
            </g>
            {[0, 1, 2, 3].map((v) => <text key={v} x={150 + v * 260} y={1700} textAnchor="middle" fontFamily={CAIRO} fontWeight={700} fontSize={26} fill={C.dim}>{v}</text>)}
            <text x={670} y={1605} textAnchor="middle" fontFamily={CAIRO} fontWeight={900} fontSize={34} fill={C.yellow} opacity={rule}>Lift &gt; 1  =  strong link</text>
          </g>
          {/* "ding" ring when Lift is highlighted */}
          {ding > 0 && ding < 26 ? <rect x={60 - ding * 1.4} y={1410 - ding * 1.4} width={960 + ding * 2.8} height={290 + ding * 2.8} rx={20} fill="none" stroke={C.yellow} strokeWidth={6 * (1 - ding / 26)} opacity={1 - ding / 26} /> : null}
        </svg>
        {CARDS.map((c, i) => (
          <React.Fragment key={i}>
            <ArText f={f} from={S(c.tt)} text={c.ar} top={c.y + 14} left={130} width={740} size={i === 2 ? 60 : 52} align="right" typed cps={0.7} color={C.chalk} op={i < 2 && lift > 0 ? 0.4 : 1} />
            <ArText f={f} from={S(c.ts)} text={c.sub} top={c.y + (i === 2 ? 98 : 88)} left={130} width={740} size={i === 2 ? 38 : 36} align="right" typed cps={0.8} weight={700} color={C.dim} op={i < 2 && lift > 0 ? 0.4 : 1} />
          </React.Fragment>
        ))}
      </Sheet>
    </>
  );
};
