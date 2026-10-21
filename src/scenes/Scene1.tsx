import React from 'react';
import TL from '../timeline.json';
import {CH, clamp, prog} from '../theme';
import {AR, EN} from '../fonts';
import {ChalkPath, ChalkText, ellipsePath} from '../components/Chalk';

const B = TL.s1;
const PIV = {x: 960, y: 440};
const HALF = 360;

/** المشهد 1: ميزان طباشيري — CAC في كفة وCLV في كفة + النسبة المستهدفة 3:1. */
export const Scene1: React.FC<{t: number}> = ({t}) => {
  const p = (a: number, d: number) => prog(t, a, d);

  // ميلان الكفة: ذبذبة مخمّدة بعد ما الاتنين يتحطوا
  const u = t - B.tilt;
  const tilt = u > 0 ? 8 * (1 - Math.exp(-3.2 * u) * Math.cos(8.5 * u)) : 0;
  const sway = p(B.scale + 6, 2) * 0.35 * Math.sin(t * 1.6) * (1 - clamp(u / 1));
  const th = ((tilt + sway) * Math.PI) / 180;
  const hook = (s: number) => ({x: PIV.x + s * HALF * Math.cos(th), y: PIV.y + s * HALF * Math.sin(th)});
  const L = hook(-1);
  const R = hook(1);

  const pansP = p(B.pans, 2.6);
  const Pan: React.FC<{h: {x: number; y: number}; children?: React.ReactNode}> = ({h, children}) => (
    <g transform={`translate(${h.x} ${h.y})`}>
      <ChalkPath d="M 0 0 L -150 190" p={pansP} w={4} />
      <ChalkPath d="M 0 0 L 150 190" p={pansP} w={4} />
      <ChalkPath d="M -165 190 Q 0 270 165 190 Z" p={prog(t, B.pans + 1.2, 1.6)} w={5} fill={CH.white} fillOpacity={0.08} />
      {children}
    </g>
  );

  const bagP = p(B.bag, 2.6);
  const custP = p(B.customer, 2.8);
  const ratioP = p(B.ratio, 2.4);

  return (
    <div style={{position: 'absolute', inset: 0}}>
      {/* شارة الدرس + عنوان */}
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', left: 0, top: 0}}>
        <ChalkPath d={ellipsePath(235, 215, 76, 76)} p={p(B.title, 1.2)} color={CH.pink} w={5} />
        <ChalkPath d="M 650 224 Q 800 214 960 226 T 1270 222" p={p(B.title + 1.6, 1.2)} color={CH.yellow} w={5} />
        <ChalkPath d="M 1380 168 Q 1540 156 1690 166" p={p(B.sub + 0.8, 1)} color={CH.pink} w={4} />

        {/* الميزان */}
        <ChalkPath d={`M ${PIV.x} ${PIV.y} V 790`} p={p(B.scale, 2.6)} w={7} />
        <ChalkPath d="M 880 850 L 920 790 H 1000 L 1040 850 Z" p={p(B.scale + 2.6, 1.4)} w={6} fill={CH.white} fillOpacity={0.08} />
        <circle cx={PIV.x} cy={PIV.y} r={16} fill="none" stroke={CH.white} strokeWidth={5} opacity={p(B.scale + 3.4, 0.6)} />
        <g transform={`rotate(${(th * 180) / Math.PI} ${PIV.x} ${PIV.y})`}>
          <ChalkPath d={`M ${PIV.x - HALF} ${PIV.y} H ${PIV.x + HALF}`} p={p(B.scale + 3.8, 1.8)} w={8} />
          <circle cx={PIV.x - HALF} cy={PIV.y} r={10} fill="none" stroke={CH.white} strokeWidth={4} opacity={p(B.scale + 5.2, 0.5)} />
          <circle cx={PIV.x + HALF} cy={PIV.y} r={10} fill="none" stroke={CH.white} strokeWidth={4} opacity={p(B.scale + 5.2, 0.5)} />
        </g>

        {/* كفة CAC + كيس فلوس */}
        <Pan h={L}>
          <g transform="translate(0 190)">
            <ChalkPath d="M -48 -8 C -86 -54 -62 -104 -22 -112 L 22 -112 C 62 -104 86 -54 48 -8 Z" p={bagP} color={CH.pink} w={5} fill={CH.pink} fillOpacity={0.1} />
            <ChalkPath d="M -24 -114 L -32 -136 H 32 L 24 -114" p={prog(t, B.bag + 1.6, 0.9)} color={CH.pink} w={5} />
            <text x={0} y={-48} textAnchor="middle" fontFamily={EN} fontWeight={700} fontSize={70} fill={CH.pink} opacity={prog(t, B.bag + 2, 0.6)}>
              $
            </text>
          </g>
        </Pan>

        {/* كفة CLV + عميل طويل العمر */}
        <Pan h={R}>
          <g transform="translate(0 190)">
            <ChalkPath d="M 0 -92 V -40 M -38 -76 L 0 -86 L 38 -76 M 0 -40 L -26 -4 M 0 -40 L 26 -4" p={custP} color={CH.yellow} w={5} />
            <ChalkPath d="M -26 -118 A 26 26 0 1 1 26 -118 A 26 26 0 1 1 -26 -118" p={prog(t, B.customer, 1.2)} color={CH.yellow} w={5} />
            <ChalkPath d="M -11 -112 Q 0 -101 11 -112" p={prog(t, B.customer + 1.6, 0.6)} color={CH.yellow} w={3.5} />
            {[-30, -66, -102].map((y, i) => (
              <g key={y} opacity={prog(t, B.customer + 1.6 + i * 0.35, 0.5)}>
                <circle cx={66} cy={y} r={18} fill="none" stroke={CH.yellow} strokeWidth={4} />
                <text x={66} y={y + 8} textAnchor="middle" fontFamily={EN} fontWeight={700} fontSize={24} fill={CH.yellow}>
                  $
                </text>
              </g>
            ))}
          </g>
        </Pan>
      </svg>

      <ChalkText text="الدرس" x={235} y={165} w={140} size={36} p={p(B.title + 0.3, 0.8)} color={CH.pink} />
      <ChalkText text="26" x={235} y={196} w={140} size={64} p={p(B.title + 0.6, 0.8)} color={CH.yellow} font="en" />
      <ChalkText text="اقتصاديات الوحدة" x={960} y={96} w={900} size={104} p={p(B.title, 2.0)} color={CH.yellow} />
      <ChalkText text="Unit Economics" x={1535} y={108} w={380} size={56} p={p(B.sub, 1.4)} color={CH.pink} font="en" />

      {/* تسميات الكفتين */}
      <ChalkText text="CAC" x={600} y={770} w={300} size={78} p={p(B.labelCac, 1.0)} color={CH.pink} font="en" />
      <ChalkText text="تكلفة اكتساب العميل" x={600} y={858} w={520} size={40} p={p(B.labelCac + 0.8, 1.2)} color={CH.white} />
      <ChalkText text="CLV" x={1320} y={770} w={300} size={78} p={p(B.labelClv, 1.0)} color={CH.yellow} font="en" />
      <ChalkText text="قيمة العميل طول عمره" x={1320} y={858} w={520} size={40} p={p(B.labelClv + 0.8, 1.2)} color={CH.white} />

      {/* النسبة المستهدفة */}
      <ChalkText text="Target Ratio ≥ 3:1" x={960} y={238} w={900} size={92} p={ratioP} color={CH.yellow} font="en" />
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', left: 0, top: 0}}>
        <ChalkPath d="M 560 348 Q 760 362 960 350 T 1360 352" p={prog(t, B.emph, 1.0)} color={CH.pink} w={5} />
        <ChalkPath d="M 1470 330 L 1500 296 M 1500 330 L 1540 308 M 1480 360 L 1530 352" p={prog(t, B.emph + 0.6, 0.8)} color={CH.pink} w={4} />
      </svg>
    </div>
  );
};
