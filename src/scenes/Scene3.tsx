import React from 'react';
import TL from '../timeline.json';
import {CH, prog} from '../theme';
import {ChalkPath, ChalkText, arrowHead, ellipsePath} from '../components/Chalk';
import {EN} from '../fonts';

const B = TL.s3;
const CUST_X = 840;
const CUST_Y = [380, 580, 780];

const person = (x: number, y: number) =>
  `M ${x - 22} ${y - 46} A 22 22 0 1 1 ${x + 22} ${y - 46} A 22 22 0 1 1 ${x - 22} ${y - 46} M ${x} ${y - 24} V ${y + 26} M ${x - 32} ${y - 6} L ${x} ${y - 14} L ${x + 32} ${y - 6} M ${x} ${y + 26} L ${x - 22} ${y + 62} M ${x} ${y + 26} L ${x + 22} ${y + 62}`;

/** المشهد 3: محفظة التسويق → أسهم لعملاء جدد → CAC = إجمالي التكاليف ÷ العملاء الجدد. */
export const Scene3: React.FC<{t: number}> = ({t}) => {
  const p = (a: number, d: number) => prog(t, a, d);
  const wal = p(B.wallet, 2.8);
  const ends = CUST_Y.map((y) => ({x: CUST_X - 72, y}));

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <ChalkText text="تكلفة اكتساب العميل" x={900} y={96} w={1100} size={92} p={p(B.title, 2.0)} color={CH.white} />
      <ChalkText text="CAC" x={1560} y={100} w={300} size={96} p={p(B.title + 1.2, 1.0)} color={CH.pink} font="en" />

      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', left: 0, top: 0}}>
        {/* المحفظة */}
        <ChalkPath d="M 200 500 Q 200 470 230 470 H 470 Q 500 470 500 500 V 640 Q 500 670 470 670 H 230 Q 200 670 200 640 Z" p={wal} w={6} fill={CH.white} fillOpacity={0.07} />
        <ChalkPath d="M 200 525 H 490" p={p(B.wallet + 2.8, 1.0)} w={4.5} />
        <ChalkPath d="M 440 548 H 506 V 602 H 440 Z" p={p(B.wallet + 3.4, 1.0)} color={CH.yellow} w={5} />
        <circle cx={472} cy={575} r={9} fill="none" stroke={CH.yellow} strokeWidth={4} opacity={p(B.wallet + 4.2, 0.5)} />
        {[[262, 428], [335, 400], [408, 428]].map(([x, y], i) => (
          <g key={i} opacity={p(B.wallet + 3.8 + i * 0.5, 0.6)}>
            <circle cx={x} cy={y} r={30} fill="none" stroke={CH.pink} strokeWidth={5} />
            <text x={x} y={y + 12} textAnchor="middle" fontFamily={EN} fontWeight={700} fontSize={36} fill={CH.pink}>
              $
            </text>
          </g>
        ))}

        {/* الأسهم نحو العملاء الجدد */}
        {ends.map((e, i) => (
          <React.Fragment key={i}>
            <ChalkPath d={`M 530 570 C 610 570 650 ${e.y} ${e.x} ${e.y}`} p={p(B.arrows + i * 0.9, 1.4)} color={CH.yellow} w={5} />
            <ChalkPath d={arrowHead(e.x, e.y, 0, 22)} p={p(B.arrows + i * 0.9 + 1.2, 0.4)} color={CH.yellow} w={5} />
          </React.Fragment>
        ))}

        {/* العملاء الجدد */}
        {CUST_Y.map((y, i) => (
          <React.Fragment key={i}>
            <ChalkPath d={person(CUST_X, y)} p={p(B.customers + i * 1.1, 1.6)} color={CH.white} w={5} />
            <ChalkPath d={`M ${CUST_X + 74} ${y - 52} A 17 17 0 1 1 ${CUST_X + 74} ${y - 53} M ${CUST_X + 64} ${y - 52} H ${CUST_X + 84} M ${CUST_X + 74} ${y - 62} V ${y - 42}`} p={p(B.customers + i * 1.1 + 1.2, 0.8)} color={CH.pink} w={4} />
          </React.Fragment>
        ))}

        {/* خط الكسر */}
        <ChalkPath d="M 1285 548 Q 1530 560 1790 546" p={p(B.bar, 1.1)} color={CH.yellow} w={6} />

        {/* دواير للتوكيد */}
        <ChalkPath d={ellipsePath(1530, 456, 262, 78)} p={p(B.emph, 1.0)} color={CH.pink} w={4.5} />
        <ChalkPath d={ellipsePath(1530, 636, 240, 78)} p={p(B.emph + 0.8, 1.0)} color={CH.pink} w={4.5} />
        <ChalkPath d="M 1260 800 H 1800" p={p(B.note + 1.4, 1.0)} color={CH.yellow} w={5} />
      </svg>

      <ChalkText text="ميزانية التسويق والمبيعات" x={350} y={700} w={560} size={42} p={p(B.wallet + 3.0, 1.6)} color={CH.white} />
      <ChalkText text="عملاء جدد" x={CUST_X} y={236} w={300} size={44} p={p(B.customers + 2.6, 1.2)} color={CH.white} />

      <ChalkText text="CAC =" x={1105} y={498} w={380} size={108} p={p(B.formula, 1.6)} color={CH.pink} font="en" />
      <ChalkText text={'إجمالي تكاليف\nالتسويق والمبيعات'} x={1530} y={396} w={520} size={50} p={p(B.num, 2.2)} color={CH.white} />
      <ChalkText text={'العملاء الجدد\nالمكتسبين'} x={1530} y={574} w={520} size={50} p={p(B.den, 2.2)} color={CH.white} />

      <ChalkText text="CLV ÷ CAC ≥ 3" x={1530} y={716} w={620} size={74} p={p(B.note, 2.0)} color={CH.yellow} font="en" />
    </div>
  );
};
