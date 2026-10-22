import React from 'react';
import {C, fr, T} from '../theme';
import {CAIRO} from '../fonts';
import {clamp, easeOut, ramp, sp, SP} from '../lib/anim';
import {ChalkDefs, Stroke, Txt, arrowD, circleD, lineD, polyD, rectD} from '../lib/chalk';
import {Sheet} from '../lib/board';
import {ArText, Header} from '../lib/ar';

const S = (t: number) => fr(t);
const W = 1080, H = 1920;
const ITEMS = [
  {id: 'phone', x: 410, y: 905, t: T.phone},
  {id: 'case', x: 560, y: 935, t: T.caseDrop},
  {id: 'buds', x: 710, y: 965, t: T.earbuds},
];

const Phone: React.FC<{f: number; from: number}> = ({f, from}) => (
  <g>
    <Stroke d={rectD(-48, -100, 96, 200, 3)} f={f} from={from} dur={10} w={4.5} />
    <Stroke d={rectD(-38, -82, 76, 150, 4)} f={f} from={from + 4} dur={8} w={2.5} />
    <Stroke d={circleD(0, 84, 7, 5)} f={f} from={from + 8} dur={6} w={3} />
  </g>
);
const Case: React.FC<{f: number; from: number}> = ({f, from}) => (
  <g>
    <Stroke d={rectD(-56, -86, 112, 172, 7)} f={f} from={from} dur={10} w={4.5} color={C.yellow} />
    <Stroke d={rectD(-42, -72, 44, 44, 8)} f={f} from={from + 4} dur={8} w={3} />
    <Stroke d={circleD(-20, -50, 10, 9)} f={f} from={from + 8} dur={6} w={3} />
    <Stroke d={rectD(-44, -2, 88, 70, 10)} f={f} from={from + 6} dur={8} w={2.2} dash="7 7" />
  </g>
);
const Buds: React.FC<{f: number; from: number}> = ({f, from}) => (
  <g>
    {[-34, 34].map((dx, i) => (
      <g key={i}>
        <Stroke d={circleD(dx, -30, 26, 11 + i)} f={f} from={from + i * 3} dur={9} w={4.5} />
        <Stroke d={lineD(dx + (i ? 10 : -10), -6, dx + (i ? 12 : -12), 74, 14 + i)} f={f} from={from + 4 + i * 3} dur={9} w={6} />
      </g>
    ))}
    <Stroke d={rectD(-58, 58, 116, 40, 17)} f={f} from={from + 8} dur={8} w={2.6} color={C.yellow} />
  </g>
);

/** Scene 1 (0 - 25.3s): shopping cart, three products drop in, hidden links, "not magic - AI", Market Basket Analysis, Cross-Selling. */
export const Scene1_Puzzle: React.FC<{f: number}> = ({f}) => {
  const a0 = S(0.3), a1 = S(25.3);
  const drop = (t: number) => {
    const p = sp(f, SP.bouncy, S(t));
    return -820 * (1 - Math.min(1.03, p));
  };
  const link = ramp(f, S(T.link), S(T.link) + 20);
  const phaseA = ramp(f, S(T.notMagic), S(T.notMagic) + 10) * (1 - ramp(f, S(11.7), S(11.9)));
  const phaseB = ramp(f, S(T.mba), S(T.mba) + 10) * (1 - ramp(f, S(18.0), S(18.2)));
  const phaseC = ramp(f, S(T.idea), S(T.idea) + 10);
  return (
    <>
      <Sheet f={f} from={a0} to={a1}>
  <Header f={f} label="THE RIDDLE" n={1} />
        <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{position: 'absolute', left: 0, top: 0}}>
          <ChalkDefs />
          <g filter="url(#chalk)">
            {/* cart */}
            <Stroke d={polyD([[250, 760], [830, 760], [750, 1050], [330, 1050]], true, 3)} f={f} from={a0} dur={30} w={6} />
            {[1, 2, 3, 4].map((i) => <Stroke key={i} d={lineD(250 + 116 * i, 760, 330 + 84 * i, 1050, 10 + i)} f={f} from={a0 + 16 + i * 3} dur={14} w={2.2} color={C.dim} />)}
            {[1, 2].map((i) => <Stroke key={i} d={lineD(250 + i * 28, 760 + i * 97, 830 - i * 27, 760 + i * 97, 20 + i)} f={f} from={a0 + 20 + i * 4} dur={14} w={2.2} color={C.dim} />)}
            <Stroke d={polyD([[250, 760], [190, 680], [110, 680]], false, 6)} f={f} from={a0 + 26} dur={18} w={6} />
            <Stroke d={lineD(330, 1050, 770, 1050, 7)} f={f} from={a0 + 34} dur={12} w={5} />
            <Stroke d={circleD(400, 1112, 34, 8)} f={f} from={a0 + 44} dur={14} w={5} />
            <Stroke d={circleD(700, 1112, 34, 9)} f={f} from={a0 + 50} dur={14} w={5} />
            {/* items falling in */}
            {ITEMS.map((it) => {
              const dy = drop(it.t);
              return f >= S(it.t) - 2 ? (
                <g key={it.id} transform={`translate(${it.x} ${it.y + dy})`}>
                  {it.id === 'phone' ? <Phone f={f} from={S(it.t)} /> : it.id === 'case' ? <Case f={f} from={S(it.t)} /> : <Buds f={f} from={S(it.t)} />}
                </g>
              ) : null;
            })}
          </g>
          {/* hidden links between the three products (yellow, flowing) */}
          {link > 0 ? (
            <g opacity={link} fill="none" stroke={C.yellow} strokeWidth={5} strokeLinecap="round" strokeDasharray="14 12" strokeDashoffset={-f * 1.6}>
              <path d={lineD(425, 880, 545, 915, 31)} /><path d={lineD(575, 920, 695, 945, 32)} />
              <path d="M410 800 C 470 700, 640 700, 705 850" />
            </g>
          ) : null}
          {/* ka-ching marks */}
          {ITEMS.map((it) => {
            const t = f - S(it.t) - 6;
            if (t < 0 || t > 40) return null;
            const k = easeOut(clamp(t / 12));
            return (
              <g key={it.id} transform={`translate(${it.x} ${690 - t * 1.4})`} opacity={1 - ramp(t, 22, 40)}>
                <circle r={26 * k} fill="none" stroke={C.yellow} strokeWidth={4} />
                <text y={12 * k} textAnchor="middle" fontFamily={CAIRO} fontWeight={900} fontSize={34 * k} fill={C.yellow}>$</text>
              </g>
            );
          })}
          {link > 0 ? <text x={540} y={700} textAnchor="middle" fontFamily={CAIRO} fontWeight={900} fontSize={150} fill={C.yellow} opacity={link * (0.8 + 0.2 * Math.sin(f / 5))}>?</text> : null}

          {/* phase A: "not magic" -> AI */}
          <g opacity={phaseA}>
            <g filter="url(#chalk)">
              <Stroke d={lineD(200, 1340, 330, 1260, 41)} f={f} from={S(T.notMagic)} dur={10} w={8} />
              <Stroke d={circleD(345, 1245, 30, 42)} f={f} from={S(T.notMagic) + 4} dur={10} w={5} />
              <Stroke d={lineD(150, 1230, 390, 1370, 43)} f={f} from={S(T.notMagic) + 14} dur={10} w={9} color={C.yellow} />
              <Stroke d={lineD(150, 1370, 390, 1230, 44)} f={f} from={S(T.notMagic) + 22} dur={10} w={9} color={C.yellow} />
              <Stroke d={circleD(790, 1300, 120, 45)} f={f} from={S(T.ai)} dur={22} w={6} color={C.yellow} />
              <Stroke d={polyD([[740, 1300], [790, 1240], [840, 1300], [790, 1360]], true, 46)} f={f} from={S(T.ai) + 12} dur={14} w={3} />
            </g>
            <Txt x={790} y={1330} text="AI" f={f} from={S(T.ai) + 8} size={96} weight={900} color={C.yellow} anchor="middle" cps={0.5} />
          </g>
          <g opacity={phaseA}>
            <Txt x={270} y={1450} text="NOT magic" f={f} from={S(T.notMagic) + 8} size={44} weight={900} anchor="middle" cps={1.1} />
          </g>
          {/* phase B: Market Basket Analysis */}
          <g opacity={phaseB}>
            <g filter="url(#chalk)"><Stroke d={lineD(150, 1560, 930, 1560, 51)} f={f} from={S(T.mba) + 36} dur={22} w={6} color={C.yellow} /></g>
            <Txt x={540} y={1340} text="Market Basket" f={f} from={S(T.mba)} size={104} weight={900} anchor="middle" cps={0.9} />
            <Txt x={540} y={1470} text="Analysis" f={f} from={S(T.mba) + 18} size={104} weight={900} anchor="middle" cps={0.9} color={C.yellow} />
          </g>
          {/* phase C: Cross-Selling */}
          <g opacity={phaseC}>
            <g filter="url(#chalk)">
              {[0, 1, 2].map((i) => <Stroke key={i} d={rectD(250 + i * 190, 1530 - (0.35 + i * 0.3) * 200 * easeOut(ramp(f, S(21.0) + i * 12, S(22.0) + i * 12)), 120, (0.35 + i * 0.3) * 200 * easeOut(ramp(f, S(21.0) + i * 12, S(22.0) + i * 12)), 60 + i)} f={f} from={S(21.0) + i * 12} dur={10} w={4} fill="rgba(244,208,63,0.30)" color={C.yellow} />)}
              <Stroke d={arrowD(240, 1550, 830, 1550, 61, 22)} f={f} from={S(20.6)} dur={20} w={4} />
            </g>
            <Txt x={540} y={1350} text="Cross-Selling" f={f} from={S(19.0)} size={110} weight={900} color={C.yellow} anchor="middle" cps={0.9} />
            <Txt x={850} y={1470} text="Sales ↑" f={f} from={S(22.4)} size={52} weight={900} anchor="middle" cps={1.0} />
          </g>
        </svg>
        <ArText f={f} from={S(T.hook)} text="لماذا يشتري العميل هذه المنتجات معاً؟" top={150} size={78} lh={1.3} color={C.chalk} />
        <ArText f={f} from={S(T.mba) + 30} to={S(18.0)} text="تحليل سلة المشتريات" top={1580} size={52} color={C.chalk} op={phaseB} />
        <ArText f={f} from={S(T.idea) + 20} text="اكتشاف العلاقات المخفية ← مضاعفة المبيعات" top={1590} size={44} color={C.chalk} op={phaseC} />
      </Sheet>
    </>
  );
};
