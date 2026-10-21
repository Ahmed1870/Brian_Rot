import React from 'react';
import {C, fr, T} from '../theme';
import {CAIRO, MONO} from '../fonts';
import {clamp, easeOut, ramp} from '../lib/anim';
import {ChalkDefs, Formula, Stroke, Txt, arrowD, circleD, count, curveD, fmtN, lineD, polyD, rectD} from '../lib/chalk';
import {Header, Sheet} from '../lib/board';

const S = (t: number) => fr(t);
const W = 1920, H = 1080;
const Frame: React.FC<{children: React.ReactNode}> = ({children}) => (
  <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{position: 'absolute', left: 0, top: 0}}><ChalkDefs />{children}</svg>
);

const Metric: React.FC<{f: number; t0: number; n: string; name: string; sub: string}> = ({f, t0, n, name, sub}) => (
  <>
    <Txt x={110} y={250} text={n} f={f} from={t0} size={110} weight={900} color={C.yellow} cps={0.6} />
    <Txt x={250} y={250} text={name} f={f} from={t0 + 4} size={96} weight={900} cps={0.8} />
    <Txt x={112} y={330} text={sub} f={f} from={t0 + 18} size={40} color={C.dim} cps={1.2} />
  </>
);

/** R (45-62s) · F (62.5-80s) · M (80.6-91s): the three formulas, then raw table and quintile scoring (to 120s). */
export const Scene2_Scoring: React.FC<{f: number}> = ({f}) => {
  const R0 = S(T.recency), R1 = S(62.0), F0 = S(T.frequency), F1 = S(80.3), M0 = S(T.monetary), M1 = S(91.5), W0 = S(T.rawTable), W1 = S(96.6), Q0 = S(T.quintiles), Q1 = S(120.2);
  return (
    <>
      <Header f={f - R0} label="R · F · M" n={1} />
      {/* ---- RECENCY ---- */}
      <Sheet f={f} from={R0} to={R1}>
        <Frame>
          <Metric f={f} t0={R0} n="01" name="Recency" sub="How recently did the customer buy?" />
          <Formula id="fR" x={110} y={500} f={f} from={R0 + 24} size={64} parts={[{t: 'Recency', it: true}, {t: ' = T'}, {t: 'current', sub: true, it: true}, {t: ' − T'}, {t: 'last_purchase', sub: true, it: true}]} />
          <g filter="url(#chalk)">
            <Stroke d={arrowD(1000, 600, 1780, 600, 3, 26)} f={f} from={R0 + 40} dur={26} w={5} />
            <Stroke d={circleD(1130, 600, 20, 4)} f={f} from={R0 + 66} dur={10} w={5} color={C.yellow} />
            <Stroke d={circleD(1650, 600, 20, 5)} f={f} from={R0 + 92} dur={10} w={5} color={C.yellow} />
            <Stroke d={arrowD(1150, 690, 1630, 690, 6, 22)} f={f} from={S(50.0)} dur={22} w={4} color={C.yellow} />
            <Stroke d={arrowD(1630, 690, 1150, 690, 7, 22)} f={f} from={S(50.0)} dur={22} w={4} color={C.yellow} />
            {/* scoring hint */}
            <Stroke d={rectD(1000, 790, 780, 190, 9)} f={f} from={R0 + S(9.4)} dur={24} w={3} />
            <Stroke d={arrowD(1560, 940, 1560, 830, 10, 20)} f={f} from={R0 + S(10.4)} dur={12} w={5} color={C.yellow} />
          </g>
          <Txt x={1130} y={550} text="last purchase" f={f} from={R0 + 70} size={34} anchor="middle" cps={1.3} />
          <Txt x={1650} y={550} text="today" f={f} from={R0 + 96} size={34} anchor="middle" cps={1.3} />
          <Txt x={1390} y={740} text="Δ days" f={f} from={S(50.4)} size={44} anchor="middle" color={C.yellow} mode="mathi" cps={1} />
          <Txt x={1030} y={850} text="2 days ago   →  score 5" f={f} from={S(54.6)} size={36} mode="mono" cps={1.5} weight={400} />
          <Txt x={1030} y={920} text="180 days ago →  score 1" f={f} from={S(56.6)} size={36} mode="mono" cps={1.5} weight={400} />
          <Txt x={1590} y={900} text="smaller gap" f={f} from={S(58.4)} size={32} color={C.yellow} cps={1.4} />
          <Txt x={1590} y={940} text="higher score" f={f} from={S(59.2)} size={32} color={C.yellow} cps={1.4} />
        </Frame>
      </Sheet>
      {/* ---- FREQUENCY ---- */}
      <Sheet f={f} from={F0} to={F1}>
        <Frame>
          <Metric f={f} t0={F0} n="02" name="Frequency" sub="How many times did the customer buy?" />
          <Formula id="fF" x={110} y={500} f={f} from={F0 + 24} size={64} parts={[{t: 'Frequency', it: true}, {t: ' = Σ Orders'}]} />
          <g filter="url(#chalk)">
            {Array.from({length: 6}, (_, i) => {
              const x = 1020 + (i % 3) * 250, y = 430 + Math.floor(i / 3) * 270;
              const t = S(70.4) + i * 14;
              return (
                <g key={i}>
                  <Stroke d={rectD(x, y, 190, 230, 20 + i)} f={f} from={t} dur={14} w={3.5} />
                  {[0, 1, 2, 3].map((l) => <Stroke key={l} d={lineD(x + 24, y + 56 + l * 42, x + 166, y + 56 + l * 42, 50 + i * 4 + l)} f={f} from={t + 6 + l * 2} dur={8} w={2.5} color={l === 3 ? C.yellow : C.chalk} />)}
                </g>
              );
            })}
            <Stroke d={circleD(1470, 940, 24, 31)} f={f} from={S(78.4)} dur={14} w={4} color={C.yellow} />
          </g>
          <Txt x={1020} y={400} text={`Orders: ${Math.min(6, Math.max(0, Math.floor((f - S(70.4)) / 14) + 1))}`} f={f} from={S(70.4)} size={52} color={C.yellow} cps={5} />
          <Txt x={1020} y={972} text="more orders  →  stronger loyalty" f={f} from={S(78.2)} size={44} cps={1.2} />
        </Frame>
      </Sheet>
      {/* ---- MONETARY ---- */}
      <Sheet f={f} from={M0} to={M1}>
        <Frame>
          <Metric f={f} t0={M0} n="03" name="Monetary" sub="How much did the customer spend?" />
          <Formula id="fM" x={110} y={500} f={f} from={M0 + 24} size={64} parts={[{t: 'Monetary', it: true}, {t: ' = Σ Revenue'}]} />
          <g filter="url(#chalk)">
            {[0, 1, 2, 3, 4].map((i) => <Stroke key={i} d={rectD(1010 + i * 150, 450 + (i % 2) * 40, 120, 60, 40 + i)} f={f} from={S(84.4) + i * 16} dur={12} w={3.5} />)}
            <Stroke d={lineD(1000, 700, 1780, 700, 66)} f={f} from={S(88.0)} dur={20} w={5} color={C.yellow} />
            {[0, 1, 2, 3].map((i) => <Stroke key={i} d={circleD(1180 + i * 40, 930 - i * 18, 52, 70 + i)} f={f} from={S(88.4) + i * 8} dur={12} w={4} color={C.yellow} />)}
          </g>
          {[['450', 0], ['1,200', 1], ['3,000', 2], ['890', 3], ['4,460', 4]].map(([a, i]) => <Txt key={a as string} x={1070 + (i as number) * 150} y={495 + ((i as number) % 2) * 40} text={`+${a}`} f={f} from={S(84.6) + (i as number) * 16} size={30} anchor="middle" mode="mono" cps={1.5} />)}
          <Txt x={1000} y={780} text={`Total spent: ${fmtN(count(f, S(88.2), 60, 10000))} EGP`} f={f} from={S(88.2)} size={50} color={C.yellow} cps={5} />
        </Frame>
      </Sheet>
      {/* ---- RAW TABLE ---- */}
      <Sheet f={f} from={W0} to={W1}>
        <Frame>
          <Txt x={960} y={220} text="Raw values for every customer" f={f} from={W0} size={72} anchor="middle" weight={900} cps={1} />
          <g filter="url(#chalk)">
            <Stroke d={rectD(360, 300, 1200, 540, 3)} f={f} from={W0 + 8} dur={22} />
            <Stroke d={lineD(360, 390, 1560, 390, 4)} f={f} from={W0 + 20} dur={12} color={C.yellow} />
            {[1, 2, 3].map((i) => <Stroke key={i} d={lineD(360 + i * 300, 300, 360 + i * 300, 840, 5 + i)} f={f} from={W0 + 22} dur={14} w={2.5} />)}
          </g>
          {['customer', 'R (days)', 'F (orders)', 'M (EGP)'].map((h, i) => <Txt key={h} x={510 + i * 300} y={360} text={h} f={f} from={W0 + 20} size={34} anchor="middle" mode="mono" color={C.yellow} cps={1.6} />)}
          {[['Ahmed', '2', '15', '10,000'], ['Sara', '180', '1', '150'], ['C-0831', '35', '6', '2,350'], ['C-3390', '90', '3', '720'], ['C-1175', '12', '11', '6,900']].map((r, ri) => r.map((c, ci) => (
            <Txt key={`${ri}${ci}`} x={510 + ci * 300} y={450 + ri * 82} text={c} f={f} from={W0 + 28 + ri * 8} size={36} anchor="middle" mode="mono" cps={1.6} weight={400} />)))}
        </Frame>
      </Sheet>
      {/* ---- QUINTILES ---- */}
      <Sheet f={f} from={Q0} to={Q1}>
        <Quintiles f={f} t0={Q0} />
      </Sheet>
    </>
  );
};

const Z = [-3.2, -0.8416, -0.2533, 0.2533, 0.8416, 3.2];
const Quintiles: React.FC<{f: number; t0: number}> = ({f, t0}) => {
  const cx = 780, base = 790, amp = 340, sg = 175;
  const X = (z: number) => cx + z * sg;
  const Y = (z: number) => base - amp * Math.exp(-(z * z) / 2);
  const curve = Array.from({length: 49}, (_, i) => -3.2 + (i / 48) * 6.4).map((z) => [X(z), Y(z)] as [number, number]);
  const top = ramp(f, S(T.top20), S(T.top20) + 14), bot = ramp(f, S(T.bottom20), S(T.bottom20) + 14);
  const slices = [0, 1, 2, 3, 4].map((k) => {
    const za = Z[k], zb = Z[k + 1];
    const pts: [number, number][] = [[X(za), base]];
    for (let i = 0; i <= 10; i++) { const z = za + ((zb - za) * i) / 10; pts.push([X(z), Y(z)]); }
    pts.push([X(zb), base]);
    return pts;
  });
  const draw = easeOut(ramp(f, t0, t0 + 70));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{position: 'absolute', left: 0, top: 0}}>
      <ChalkDefs />
      <Txt x={110} y={200} text="Quintiles  →  scores 1 to 5" f={f} from={t0} size={78} weight={900} cps={0.9} />
      {slices.map((pts, k) => {
        const hot = (k === 4 && top > 0) || (k === 0 && bot > 0);
        const show = easeOut(ramp(f, t0 + 80 + k * 10, t0 + 96 + k * 10));
        return <polygon key={k} points={pts.map((p) => `${p[0]},${p[1]}`).join(' ')} fill={hot ? C.yellow : C.chalk} opacity={show * (hot ? 0.55 : k % 2 ? 0.10 : 0.20)} />;
      })}
      <g filter="url(#chalk)">
        <Stroke d={lineD(X(-3.3), base, X(3.3), base, 2)} f={f} from={t0 + 4} dur={20} w={4} />
        <Stroke d={curveD(curve)} f={f} from={t0 + 12} dur={60} w={5} />
        {Z.slice(1, 5).map((z, i) => <Stroke key={i} d={lineD(X(z), base + 16, X(z), Y(z), 20 + i)} f={f} from={t0 + 84 + i * 10} dur={14} w={4} color={C.yellow} dash="10 8" />)}
      </g>
      {[0, 1, 2, 3, 4].map((k) => {
        const mid = (Z[k] + Z[k + 1]) / 2;
        const hot = (k === 4 && top > 0) || (k === 0 && bot > 0);
        return (
          <React.Fragment key={k}>
            <Txt x={X(mid)} y={base + 92} text={String(k + 1)} f={f} from={t0 + 100 + k * 8} size={88} weight={900} anchor="middle" color={hot ? C.yellow : C.chalk} cps={0.5} />
            <Txt x={X(mid)} y={base + 150} text="20%" f={f} from={t0 + 106 + k * 8} size={38} anchor="middle" color={C.dim} cps={0.8} />
          </React.Fragment>
        );
      })}
      <Txt x={1390} y={300} text="Cut points" f={f} from={t0 + 90} size={34} color={C.dim} cps={1.5} />
      <Txt x={1390} y={350} text="P20·P40·P60·P80" f={f} from={t0 + 96} size={34} mode="mono" cps={1.5} weight={400} />
      <Txt x={1390} y={470} text="Top 20% spend" f={f} from={S(T.top20)} size={40} color={C.yellow} cps={1.2} />
      <Txt x={1390} y={520} text="→ score 5" f={f} from={S(T.top20) + 14} size={40} color={C.yellow} cps={1.2} />
      <Txt x={1390} y={620} text="Bottom 20%" f={f} from={S(T.bottom20)} size={40} color={C.yellow} cps={1.2} />
      <Txt x={1390} y={670} text="→ score 1" f={f} from={S(T.bottom20) + 14} size={40} color={C.yellow} cps={1.2} />
      <Formula id="fScore" x={960} y={1035} f={f} from={S(111.5)} size={56} width={1200} anchor="middle" parts={[{t: 'RFM Score', it: true}, {t: ' = R × 100 + F × 10 + M'}]} />
      <Txt x={1390} y={800} text="5×100+5×10+5" f={f} from={S(117.6)} size={36} mode="mono" color={C.yellow} cps={1.5} weight={700} />
      <Txt x={1390} y={850} text="= 555" f={f} from={S(117.6) + 14} size={44} mode="mono" color={C.yellow} cps={1.5} weight={700} />
    </svg>
  );
};
