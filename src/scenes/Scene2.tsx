import React from 'react';
import TL from '../timeline.json';
import {CH, prog} from '../theme';
import {AR, EN} from '../fonts';
import {ChalkPath, ChalkText, arrowHead, ellipsePath} from '../components/Chalk';

const B = TL.s2;

type Tok = {text: string; cx: number; w: number; color: string; t: number; cap?: string; capT?: number};
const TOKENS: Tok[] = [
  {text: 'CLV', cx: 260, w: 260, color: CH.yellow, t: B.clv, cap: 'قيمة العميل', capT: B.clv + 1.2},
  {text: '=', cx: 450, w: 120, color: CH.white, t: B.clv + 0.9},
  {text: 'AOV', cx: 640, w: 260, color: CH.pink, t: B.aov, cap: 'متوسط قيمة الطلب', capT: B.aov + 1.0},
  {text: '×', cx: 820, w: 100, color: CH.white, t: B.freq - 0.4},
  {text: 'Frequency', cx: 1090, w: 440, color: CH.white, t: B.freq, cap: 'عدد مرات الشراء', capT: B.freq + 1.0},
  {text: '×', cx: 1360, w: 100, color: CH.white, t: B.life - 0.4},
  {text: 'Lifespan', cx: 1600, w: 380, color: CH.yellow, t: B.life, cap: 'مدة بقاء العميل', capT: B.life + 1.0},
];

const person = (x: number, y: number) =>
  `M ${x - 20} ${y - 18} A 20 20 0 1 1 ${x + 20} ${y - 18} A 20 20 0 1 1 ${x - 20} ${y - 18} M ${x} ${y + 2} V ${y + 50} M ${x - 28} ${y + 18} L ${x} ${y + 10} L ${x + 28} ${y + 18} M ${x} ${y + 50} L ${x - 20} ${y + 84} M ${x} ${y + 50} L ${x + 20} ${y + 84}`;

/** المشهد 2: معادلة CLV = AOV × Frequency × Lifespan مع رسمة لكل مكوّن + سهم زمني للسنين. */
export const Scene2: React.FC<{t: number}> = ({t}) => {
  const p = (a: number, d: number) => prog(t, a, d);
  const aov = p(B.aovIll, 3.2);
  const fr = p(B.freqIll, 3.2);
  const li = p(B.lifeIll, 3.2);
  const cl = p(B.combine, 3.0);
  const checks: [number, number][] = [[992, 646], [1122, 646], [1057, 707], [1187, 768]];
  const ticks = [0, 1, 2, 3, 4, 5];

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <ChalkText text="حساب قيمة العميل" x={960} y={96} w={1000} size={92} p={p(B.title, 1.8)} color={CH.white} />

      {TOKENS.map((k, i) => (
        <React.Fragment key={i}>
          <ChalkText text={k.text} x={k.cx} y={236} w={k.w} size={104} p={p(k.t, 1.0)} color={k.color} font="en" />
          {k.cap && <ChalkText text={k.cap} x={k.cx} y={388} w={k.w + 120} size={42} p={p(k.capT ?? k.t, 1.1)} color={CH.white} />}
        </React.Fragment>
      ))}

      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', left: 0, top: 0}}>
        {/* خطوط تحت الرموز */}
        {TOKENS.filter((k) => k.cap).map((k, i) => (
          <ChalkPath key={i} d={`M ${k.cx - k.w / 2 + 24} 366 Q ${k.cx} 376 ${k.cx + k.w / 2 - 24} 364`} p={p(k.t + 0.8, 0.9)} color={k.color} w={4} />
        ))}

        {/* AOV: سلة مشتريات + عملة */}
        <ChalkPath d="M 520 620 H 760 M 535 620 L 565 800 H 715 L 745 620" p={aov} w={6} />
        <ChalkPath d="M 565 620 C 575 520 705 520 715 620" p={p(B.aovIll + 1.2, 1.6)} w={6} />
        <ChalkPath d="M 600 635 V 790 M 640 635 V 795 M 680 635 V 790 M 548 690 H 732 M 556 745 H 724" p={p(B.aovIll + 1.8, 1.8)} w={3.5} opacity={0.7} />
        <ChalkPath d="M 615 620 V 580 Q 615 562 628 562 H 634 Q 647 562 647 580 V 620" p={p(B.aovIll + 2.2, 1.2)} color={CH.pink} w={4.5} />
        <ChalkPath d="M 722 598 A 26 26 0 1 1 670 598 A 26 26 0 1 1 722 598" p={p(B.aovIll + 2.5, 1.0)} color={CH.pink} w={4.5} />

        {/* Frequency: تقويم + علامات صح + سهم دوّار */}
        <ChalkPath d="M 960 560 H 1220 V 800 H 960 Z M 960 615 H 1220" p={fr} w={6} />
        <ChalkPath d="M 1010 545 V 580 M 1170 545 V 580" p={p(B.freqIll + 0.8, 0.8)} w={6} />
        <ChalkPath d="M 1025 615 V 800 M 1090 615 V 800 M 1155 615 V 800 M 960 677 H 1220 M 960 738 H 1220" p={p(B.freqIll + 1.2, 1.4)} w={3} opacity={0.6} />
        {checks.map(([x, y], i) => (
          <ChalkPath key={i} d={`M ${x - 14} ${y} L ${x - 3} ${y + 12} L ${x + 17} ${y - 14}`} p={p(B.freqIll + 1.8 + i * 0.35, 0.6)} color={CH.pink} w={6} />
        ))}
        <ChalkPath d="M 1327 625 A 72 72 0 1 1 1262 640" p={p(B.freqIll + 2.4, 1.2)} color={CH.yellow} w={5} />
        <ChalkPath d={arrowHead(1262, 640, 2.2, 20)} p={p(B.freqIll + 3.2, 0.4)} color={CH.yellow} w={5} />

        {/* Lifespan: سهم زمني عبر السنين */}
        <ChalkPath d="M 1440 700 H 1775" p={li} w={6} color={CH.yellow} />
        <ChalkPath d={arrowHead(1775, 700, 0, 24)} p={p(B.lifeIll + 1.6, 0.4)} color={CH.yellow} w={6} />
        {ticks.map((i) => (
          <ChalkPath key={i} d={`M ${1450 + i * 58} 684 V 716`} p={p(B.lifeIll + 0.8 + i * 0.25, 0.4)} w={4} />
        ))}
        {[1, 2, 3, 4, 5].map((i) => (
          <text key={i} x={1450 + i * 58} y={766} textAnchor="middle" fontFamily={EN} fontWeight={700} fontSize={40} fill={CH.white} opacity={p(B.lifeIll + 1.2 + i * 0.3, 0.5)}>
            {i}
          </text>
        ))}
        <ChalkPath d={person(1450, 600)} p={p(B.lifeIll + 0.2, 1.4)} color={CH.pink} w={5} />
        <ChalkPath d="M 1500 580 Q 1620 500 1740 580" p={p(B.lifeIll + 2.2, 1.4)} color={CH.pink} w={4.5} />
        <ChalkPath d={arrowHead(1740, 580, 0.9, 20)} p={p(B.lifeIll + 3.4, 0.4)} color={CH.pink} w={4.5} />

        {/* CLV: عملات متراصة + سهم صاعد */}
        {[0, 1, 2, 3].map((i) => {
          const y = 800 - i * 44;
          return (
            <React.Fragment key={i}>
              <ChalkPath d={`M 170 ${y} A 90 28 0 1 0 350 ${y} A 90 28 0 1 0 170 ${y}`} p={prog(t, B.combine + i * 0.5, 0.9)} color={CH.yellow} w={5} fill={CH.yellow} fillOpacity={0.06} />
              {i > 0 && <ChalkPath d={`M 170 ${y} V ${y + 44} M 350 ${y} V ${y + 44}`} p={prog(t, B.combine + i * 0.5, 0.9)} color={CH.yellow} w={4} />}
            </React.Fragment>
          );
        })}
        <text x={260} y={690} textAnchor="middle" fontFamily={EN} fontWeight={700} fontSize={44} fill={CH.yellow} opacity={prog(t, B.combine + 1.8, 0.6)}>
          $
        </text>
        <ChalkPath d="M 410 800 V 560" p={cl} color={CH.pink} w={6} />
        <ChalkPath d={arrowHead(410, 560, -Math.PI / 2, 24)} p={prog(t, B.combine + 2.6, 0.4)} color={CH.pink} w={6} />

        {/* دواير حوالين المكوّنات */}
        <ChalkPath d={ellipsePath(640, 300, 150, 80)} p={p(B.circle, 0.8)} color={CH.pink} w={4.5} />
        <ChalkPath d={ellipsePath(1090, 300, 230, 80)} p={p(B.circle + 0.7, 0.8)} color={CH.pink} w={4.5} />
        <ChalkPath d={ellipsePath(1600, 300, 205, 80)} p={p(B.circle + 1.4, 0.8)} color={CH.pink} w={4.5} />

        {/* إطار المعادلة كلها */}
        <ChalkPath d="M 130 226 Q 960 214 1795 228 Q 1805 310 1796 372 Q 960 384 124 370 Q 116 300 130 226" p={p(B.final, 1.5)} color={CH.yellow} w={5} />
      </svg>
      <ChalkText text="ضرب المكوّنات التلاتة = قيمة العميل" x={960} y={885} w={1300} size={44} p={p(B.recap, 2.0)} color={CH.yellow} />
    </div>
  );
};
