import React from 'react';
import {C, fr, T} from '../theme';
import {CAIRO} from '../fonts';
import {clamp, easeInOut, easeOut, hash, ramp} from '../lib/anim';
import {ChalkDefs, Stroke, Txt, arrowD, circleD, count, fmtN, lineD, polyD, rectD} from '../lib/chalk';
import {Sheet} from '../lib/board';

const S = (t: number) => fr(t);

const Person: React.FC<{x: number; y: number; s?: number; f: number; from: number; dashed?: boolean; seed?: number}> = ({x, y, s = 1, f, from, dashed, seed = 1}) => (
  <g>
    <Stroke d={circleD(x, y - 34 * s, 16 * s, seed)} f={f} from={from} dur={10} w={3.2} dash={dashed ? '6 6' : undefined} />
    <Stroke d={`${lineD(x - 24 * s, y + 6 * s, x - 18 * s, y - 14 * s, seed)} ${lineD(x - 18 * s, y - 14 * s, x + 18 * s, y - 14 * s, seed + 1)} ${lineD(x + 18 * s, y - 14 * s, x + 24 * s, y + 6 * s, seed + 2)}`} f={f} from={from + 4} dur={10} w={3.2} dash={dashed ? '6 6' : undefined} />
  </g>
);

/** Scene 1 (0 - 44.4s): the problem, the two customers, the RFM idea, rows -> 3D (R,F,M). */
export const Scene1_Problem: React.FC<{f: number}> = ({f}) => {
  const A0 = S(T.hook), A1 = S(9.3), B0 = S(T.weekly), B1 = S(24.4), C0 = S(T.rfmIntro), C1 = S(39.3), D0 = S(T.rows3d), D1 = S(44.4);
  const cust = Array.from({length: 32}, (_, i) => ({x: 800 + (i % 8) * 92, y: 580 + Math.floor(i / 8) * 84}));
  const tag = {x: 560, y: 430};
  return (
    <>
      {/* A: store, 100,000 customers, 20% to everyone */}
      <Sheet f={f} from={A0} to={A1}>
        <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
          <ChalkDefs />
          <g filter="url(#chalk)">
            {/* store */}
            <Stroke d={rectD(190, 610, 300, 200, 2)} f={f} from={A0 + 10} dur={26} />
            <Stroke d={polyD([[170, 610], [210, 540], [470, 540], [510, 610]], true, 4)} f={f} from={A0 + 30} dur={20} />
            <Stroke d={rectD(320, 690, 70, 120, 6)} f={f} from={A0 + 46} dur={14} />
            <Stroke d={rectD(220, 650, 70, 60, 8)} f={f} from={A0 + 52} dur={14} />
            {/* customers */}
            {cust.map((c, i) => <Stroke key={i} d={circleD(c.x, c.y, 17, i + 20)} f={f} from={A0 + 20 + i * 1.5} dur={8} w={3.2} />)}
            {/* 20% tag */}
            <Stroke d={circleD(tag.x, tag.y, 78, 12)} f={f} from={S(T.discount)} dur={20} color={C.yellow} w={5} />
            {[0, 7, 14, 21, 26, 31].map((ci, k) => (
              <Stroke key={ci} d={arrowD(tag.x + 62, tag.y + 38, cust[ci].x - 24, cust[ci].y - 6, 30 + k, 16)} f={f} from={S(3.6) + k * 7} dur={16} w={3} color={C.yellow} />
            ))}
            {/* crossed out: wasted */}
            <Stroke d={lineD(tag.x - 90, tag.y - 90, tag.x + 90, tag.y + 90, 40, 2)} f={f} from={S(T.wasted) + 6} dur={12} color={C.yellow} w={9} />
            <Stroke d={lineD(tag.x + 90, tag.y - 90, tag.x - 90, tag.y + 90, 41, 2)} f={f} from={S(T.wasted) + 14} dur={12} color={C.yellow} w={9} />
            <Stroke d={arrowD(1500, 900, 1500, 970, 51, 24)} f={f} from={S(8.0)} dur={12} color={C.yellow} w={6} />
          </g>
          <Txt x={960} y={230} text="Lesson 24" f={f} from={A0} size={40} color={C.yellow} anchor="middle" cps={1.2} />
          <Txt x={960} y={350} text="RFM Analysis" f={f} from={A0 + 4} size={130} color={C.chalk} anchor="middle" cps={0.8} weight={900} />
          <Txt x={340} y={880} text="Online Store" f={f} from={A0 + 40} size={40} anchor="middle" />
          <Txt x={1130} y={530} text={`${fmtN(count(f, A0 + 20, 70, 100000))} customers`} f={f} from={A0 + 20} size={48} anchor="middle" cps={5} color={C.chalk} />
          <Txt x={tag.x} y={tag.y + 20} text="20%" f={f} from={S(T.discount) + 8} size={64} color={C.yellow} anchor="middle" weight={900} cps={0.6} />
          <Txt x={tag.x} y={tag.y + 62} text="OFF" f={f} from={S(T.discount) + 14} size={32} color={C.yellow} anchor="middle" />
          <Txt x={960} y={940} text="Same offer to ALL customers" f={f} from={S(5.6)} size={44} anchor="end" cps={1.2} />
          <Txt x={960} y={1020} text="Budget wasted  ·  Profit margin ↓" f={f} from={S(T.wasted) + 10} size={46} color={C.yellow} anchor="middle" cps={1.2} />
        </svg>
      </Sheet>

      {/* B: two very different customers */}
      <Sheet f={f} from={B0} to={B1}>
        <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
          <ChalkDefs />
          <g filter="url(#chalk)">
            <Stroke d={rectD(120, 200, 760, 640, 3)} f={f} from={B0 + 4} dur={30} />
            <Stroke d={rectD(1040, 200, 760, 640, 5)} f={f} from={S(T.onceBuyer)} dur={30} />
            <Person x={300} y={400} s={2} f={f} from={B0 + 20} seed={7} />
            <Person x={1220} y={400} s={2} f={f} from={S(T.onceBuyer) + 20} dashed seed={9} />
            {/* weekly rhythm */}
            {Array.from({length: 8}, (_, i) => <Stroke key={i} d={lineD(440 + i * 50, 560, 440 + i * 50, 520, 60 + i)} f={f} from={S(11.2) + i * 6} dur={8} w={5} color={C.yellow} />)}
            <Stroke d={lineD(430, 570, 840, 570, 70)} f={f} from={S(11.0)} dur={20} w={3} />
            {/* high spend bars */}
            {[0.5, 0.75, 0.9, 1].map((h, i) => <Stroke key={i} d={rectD(440 + i * 90, 760 - h * 130, 56, h * 130, 80 + i)} f={f} from={S(12.5) + i * 8} dur={12} w={3.5} fill="rgba(244,208,63,0.35)" color={C.yellow} />)}
            {/* once, long ago */}
            <Stroke d={lineD(1360, 570, 1760, 570, 90)} f={f} from={S(16.2)} dur={20} w={3} />
            <Stroke d={circleD(1370, 570, 12, 91)} f={f} from={S(16.6)} dur={8} w={4} color={C.yellow} />
            <Stroke d={arrowD(1380, 620, 1740, 620, 92, 18)} f={f} from={S(18.0)} dur={20} w={3} dash="8 8" />
            <Stroke d={rectD(1440, 700, 56, 28, 95)} f={f} from={S(20.0)} dur={12} w={3} />
            {/* center verdict */}
            <Stroke d={lineD(480, 930, 1440, 930, 99)} f={f} from={S(21.2)} dur={20} w={5} color={C.yellow} />
          </g>
          <Txt x={500} y={300} text="Customer 1" f={f} from={B0 + 10} size={54} weight={900} />
          <Txt x={1420} y={300} text="Customer 2" f={f} from={S(T.onceBuyer) + 10} size={54} weight={900} />
          <Txt x={190} y={620} text="Buys every week" f={f} from={S(10.6)} size={40} cps={1.3} />
          <Txt x={190} y={790} text="High spend" f={f} from={S(12.2)} size={40} color={C.yellow} cps={1.3} />
          <Txt x={1110} y={690} text="Bought once" f={f} from={S(15.6)} size={40} cps={1.3} />
          <Txt x={1110} y={760} text="1 year ago…" f={f} from={S(17.2)} size={40} cps={1.3} />
          <Txt x={1110} y={810} text="never came back" f={f} from={S(19.0)} size={34} color={C.dim} cps={1.3} />
          <Txt x={960} y={910} text="Same 20% OFF ≠ same need" f={f} from={S(21.0)} size={52} color={C.yellow} anchor="middle" cps={1.0} weight={900} />
        </svg>
      </Sheet>

      {/* C: Recency / Frequency / Monetary -> RFM */}
      <Sheet f={f} from={C0} to={C1}>
        <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
          <ChalkDefs />
          <g filter="url(#chalk)">
            {[0, 1, 2].map((i) => <Stroke key={i} d={rectD(300 + i * 480, 330, 300, 300, 10 + i)} f={f} from={C0 + 4 + i * S(2.2)} dur={26} w={5} color={i === 2 ? C.yellow : C.chalk} />)}
            <Stroke d={lineD(300, 840, 1620, 840, 21)} f={f} from={S(T.rfmName) + 40} dur={28} w={5} color={C.yellow} />
          </g>
          {[['R', 'Recency'], ['F', 'Frequency'], ['M', 'Monetary']].map(([L, n], i) => (
            <React.Fragment key={L}>
              <Txt x={450 + i * 480} y={540} text={L} f={f} from={C0 + 14 + i * S(2.2)} size={220} anchor="middle" weight={900} color={i === 2 ? C.yellow : C.chalk} cps={0.5} />
              <Txt x={450 + i * 480} y={710} text={n} f={f} from={C0 + 24 + i * S(2.2)} size={52} anchor="middle" cps={1.0} />
            </React.Fragment>
          ))}
          <Txt x={960} y={230} text="RFM Analysis Framework" f={f} from={S(T.rfmName)} size={84} anchor="middle" weight={900} cps={0.9} />
          <Txt x={960} y={930} text="A statistical model → precise customer segments" f={f} from={S(T.rfmName) + 70} size={46} anchor="middle" color={C.yellow} cps={1.1} />
        </svg>
      </Sheet>

      {/* D: database rows -> 3D coordinate system */}
      <Sheet f={f} from={D0} to={D1}>
        <DatabaseTo3D f={f} t0={D0} />
      </Sheet>
    </>
  );
};

const DatabaseTo3D: React.FC<{f: number; t0: number}> = ({f, t0}) => {
  const rows = [['C-1042', '2025-09-12', '15', '10,000'], ['C-2217', '2024-03-02', '1', '150'], ['C-0831', '2025-08-27', '6', '2,350'], ['C-3390', '2025-01-19', '3', '720'], ['C-1175', '2025-09-30', '11', '6,900'], ['C-4408', '2024-11-05', '2', '310']];
  const tab = 1 - 0.8 * easeInOut(ramp(f, t0 + 52, t0 + 80));
  const O = {x: 1330, y: 800}, Rv = {x: 390, y: -50}, Fv = {x: 0, y: -460}, Mv = {x: -260, y: 170};
  const P = (r: number, fq: number, m: number) => ({x: O.x + r * Rv.x + fq * Fv.x + m * Mv.x, y: O.y + r * Rv.y + fq * Fv.y + m * Mv.y});
  const dots = Array.from({length: 64}, (_, i) => {
    const base = hash(i * 3.3);
    const r = clamp(base * 0.9 + hash(i * 1.1) * 0.15), fq = clamp(base * 0.8 + hash(i * 2.2) * 0.3), m = clamp(base * 0.85 + hash(i * 4.4) * 0.25);
    return {p: P(r, fq, m), i};
  });
  return (
    <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
      <ChalkDefs />
      <g filter="url(#chalk)" opacity={tab}>
        <Stroke d={rectD(120, 290, 960, 520, 3)} f={f} from={t0 + 4} dur={22} />
        <Stroke d={lineD(120, 370, 1080, 370, 4)} f={f} from={t0 + 18} dur={14} color={C.yellow} />
        {rows.map((_, i) => <Stroke key={i} d={lineD(120, 440 + i * 62, 1080, 440 + i * 62, 6 + i)} f={f} from={t0 + 24 + i * 3} dur={10} w={2} />)}
      </g>
      <g opacity={tab}>
        {['customer_id', 'last_purchase', 'orders', 'revenue'].map((h, i) => <Txt key={h} x={150 + i * 235} y={342} text={h} f={f} from={t0 + 16} size={28} mode="mono" color={C.yellow} cps={1.6} />)}
        {rows.map((r, ri) => r.map((c, ci) => <Txt key={`${ri}${ci}`} x={150 + ci * 235} y={418 + ri * 62} text={c} f={f} from={t0 + 28 + ri * 3} size={27} mode="mono" cps={1.6} weight={400} />))}
        <Txt x={600} y={870} text="thousands of rows…" f={f} from={t0 + 30} size={40} anchor="middle" color={C.dim} cps={1.2} />
      </g>
      {/* axes */}
      <g filter="url(#chalk)">
        <Stroke d={arrowD(O.x, O.y, O.x + Rv.x, O.y + Rv.y, 71, 24)} f={f} from={t0 + 58} dur={16} w={4.5} />
        <Stroke d={arrowD(O.x, O.y, O.x + Fv.x, O.y + Fv.y, 72, 24)} f={f} from={t0 + 64} dur={16} w={4.5} />
        <Stroke d={arrowD(O.x, O.y, O.x + Mv.x, O.y + Mv.y, 73, 24)} f={f} from={t0 + 70} dur={16} w={4.5} color={C.yellow} />
        <Stroke d={arrowD(1090, 540, 1190, 540, 74, 22)} f={f} from={t0 + 50} dur={12} color={C.yellow} w={5} />
      </g>
      <Txt x={O.x + Rv.x - 10} y={O.y + Rv.y + 50} text="R" f={f} from={t0 + 74} size={58} weight={900} anchor="end" />
      <Txt x={O.x + 30} y={O.y + Fv.y + 10} text="F" f={f} from={t0 + 80} size={58} weight={900} />
      <Txt x={O.x + Mv.x - 20} y={O.y + Mv.y + 30} text="M" f={f} from={t0 + 86} size={58} weight={900} color={C.yellow} anchor="end" />
      {dots.map((d) => {
        const a = easeOut(ramp(f, t0 + 80 + d.i * 0.6, t0 + 92 + d.i * 0.6));
        return a > 0 ? <circle key={d.i} cx={d.p.x} cy={d.p.y} r={7 * a} fill={d.i % 9 === 0 ? C.yellow : C.chalk} opacity={0.9} /> : null;
      })}
    </svg>
  );
};
