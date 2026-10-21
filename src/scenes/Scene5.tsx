import React from 'react';
import TL from '../timeline.json';
import {CH, prog} from '../theme';
import {ChalkPath, ChalkText} from '../components/Chalk';
import {EN} from '../fonts';
import {BARS, CHART_LINE, CHART_NODES, CIRCUITS, CIRCUIT_NODES, CLOUD_L, CLOUD_R, LOGO_CENTER, SERVER, SUBLINES} from '../logoData';

const B = TL.s5;
const LX = 470;
const LY = 380;
const LS = 1.25;

const rect = (r: {x: number; y: number; w: number; h: number}) => `M ${r.x} ${r.y} H ${r.x + r.w} V ${r.y + r.h} H ${r.x} Z`;

type Row = {label: string; value: string; color: string; t: number; y: number; icon: 'cap' | 'globe' | 'phone' | 'at'};
const ROWS: Row[] = [
  {label: 'منصة التعلّم المجانية', value: 'solutions.gomaaintelligence.me', color: CH.yellow, t: B.r1, y: 150, icon: 'cap'},
  {label: 'خدمات الأعمال والتحليل', value: 'analytics.gomaaintelligence.me', color: CH.pink, t: B.r2, y: 340, icon: 'globe'},
  {label: 'واتساب', value: '+201019672878', color: CH.yellow, t: B.r3, y: 530, icon: 'phone'},
  {label: 'تابعنا على السوشيال ميديا', value: '@monzoma_digital', color: CH.pink, t: B.r4, y: 720, icon: 'at'},
];

const icon = (k: Row['icon'], x: number, y: number) => {
  switch (k) {
    case 'cap':
      return `M ${x - 34} ${y - 4} L ${x} ${y - 24} L ${x + 34} ${y - 4} L ${x} ${y + 16} Z M ${x - 20} ${y + 6} V ${y + 30} Q ${x} ${y + 44} ${x + 20} ${y + 30} V ${y + 6}`;
    case 'globe':
      return `M ${x - 30} ${y} A 30 30 0 1 1 ${x + 30} ${y} A 30 30 0 1 1 ${x - 30} ${y} M ${x - 30} ${y} H ${x + 30} M ${x} ${y - 30} Q ${x - 22} ${y} ${x} ${y + 30} Q ${x + 22} ${y} ${x} ${y - 30}`;
    case 'phone':
      return `M ${x - 18} ${y - 32} H ${x + 18} Q ${x + 24} ${y - 32} ${x + 24} ${y - 26} V ${y + 26} Q ${x + 24} ${y + 32} ${x + 18} ${y + 32} H ${x - 18} Q ${x - 24} ${y + 32} ${x - 24} ${y + 26} V ${y - 26} Q ${x - 24} ${y - 32} ${x - 18} ${y - 32} M ${x - 8} ${y + 22} H ${x + 8}`;
    case 'at':
      return `M ${x + 14} ${y + 4} A 14 14 0 1 1 ${x + 14} ${y + 3} M ${x + 14} ${y - 12} V ${y + 8} Q ${x + 14} ${y + 16} ${x + 24} ${y + 14} Q ${x + 38} ${y + 6} ${x + 34} ${y - 12} A 34 34 0 1 0 ${x + 20} ${y + 30}`;
  }
};

/** المشهد 5 (ثابت): لوجو طباشيري + المنصة التعليمية + الخدمات + واتساب + اليوزر. */
export const Scene5: React.FC<{t: number}> = ({t}) => {
  const p = (a: number, d: number) => prog(t, a, d);
  const g = p(B.logo, 3.4);
  const k = (a: number, b: number) => Math.min(1, Math.max(0, (g - a) / (b - a)));
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', left: 0, top: 0}}>
        <g transform={`translate(${LX} ${LY}) scale(${LS}) translate(${-LOGO_CENTER.x} ${-LOGO_CENTER.y})`}>
          {[CLOUD_L, CLOUD_R].map((d, i) => (
            <ChalkPath key={i} d={d} p={k(0, 0.45)} w={11} />
          ))}
          {BARS.map((b, i) => (
            <ChalkPath key={i} d={`M ${b.pts.split(' ').map((q) => q.replace(',', ' ')).join(' L ')} Z`} p={k(0.3 + i * 0.08, 0.6 + i * 0.08)} color={CH.yellow} w={4} fill={CH.yellow} fillOpacity={0.25} />
          ))}
          <ChalkPath d={CHART_LINE} p={k(0.45, 0.75)} color={CH.pink} w={5} />
          {CHART_NODES.map((n, i) => (
            <circle key={i} cx={n.x} cy={n.y} r={9 * k(0.55 + i * 0.05, 0.75 + i * 0.05)} fill="none" stroke={CH.pink} strokeWidth={4} />
          ))}
          {SERVER.map((r, i) => (
            <ChalkPath key={i} d={rect(r)} p={k(0.35 + i * 0.08, 0.6 + i * 0.08)} w={4.5} />
          ))}
          {CIRCUITS.map((d, i) => (
            <ChalkPath key={i} d={d} p={k(0.6, 0.9)} w={3} opacity={0.75} />
          ))}
          {CIRCUIT_NODES.map((n, i) => (
            <circle key={i} cx={n.x} cy={n.y} r={6 * k(0.8, 0.95)} fill="none" stroke={CH.white} strokeWidth={3} />
          ))}
          {SUBLINES.map((d, i) => (
            <ChalkPath key={i} d={d} p={k(0.85, 1)} w={3} color={CH.yellow} />
          ))}
        </g>
        {ROWS.map((r, i) => (
          <React.Fragment key={i}>
            <ChalkPath d={icon(r.icon, 985, r.y + 84)} p={p(r.t, 1.0)} color={r.color} w={5} />
            <ChalkPath d={`M 930 ${r.y + 168} Q 1360 ${r.y + 176} 1790 ${r.y + 166}`} p={p(r.t + 0.9, 0.9)} color={CH.dim as string} w={3} />
          </React.Fragment>
        ))}
      </svg>

      <ChalkText text="MONZOMA" x={LX} y={618} w={560} size={66} p={p(B.brand - 0.4, 1.4)} color={CH.white} font="en" ls={6} />
      <ChalkText text="Gomaa Intelligence" x={LX} y={704} w={780} size={70} p={p(B.brand, 1.8)} color={CH.yellow} font="en" />
      <ChalkText text="monzoma_digital" x={LX} y={792} w={780} size={58} p={p(B.brand + 1.0, 1.4)} color={CH.pink} font="en" />

      {ROWS.map((r, i) => (
        <React.Fragment key={i}>
          <ChalkText text={r.label} x={1400} y={r.y} w={760} size={46} p={p(r.t, 1.2)} color={CH.white} />
          <ChalkText text={r.value} x={1400} y={r.y + 62} w={760} size={58} p={p(r.t + 0.5, 1.4)} color={r.color} font="en" weight={700} />
        </React.Fragment>
      ))}
    </div>
  );
};
