import React from 'react';
import { spring, useVideoConfig } from 'remotion';
import { C } from '../../theme';
import { AR, EN, Card } from '../../components/common';
import { p, win } from '../../anim';
import tl from '../../timeline.json';

const T = tl.s5;
const CW = 520, CH = 560, CY = 250, CX = (i: number) => 120 + i * 580;
const CARDS = [
  { ar: '1. التزامن الفائق', en: 'MVCC Concurrency', desc: 'آلاف الموظفين والعملاء في نفس اللحظة', color: C.client },
  { ar: '2. سلامة ACID والأمان', en: 'ACID & Financial Integrity', desc: 'حماية كاملة لسلامة المعاملات', color: C.db },
  { ar: '3. السرعة مع البيانات الضخمة', en: 'High-Throughput Caching', desc: 'سرعة استجابة حتى مع تيرابايت من البيانات', color: C.opt },
];

const Icon: React.FC<{ i: number; cx: number; cy: number; color: string; t: number; k: number }> = ({ i, cx, cy, color, t, k }) => {
  if (i === 0) {
    const users = Array.from({ length: 6 }).map((_, n) => {
      const a = (n / 6) * Math.PI * 2 - Math.PI / 2;
      return { x: cx + Math.cos(a) * 110, y: cy + Math.sin(a) * 78 };
    });
    return (
      <g>
        {users.map((u, n) => (
          <g key={n}>
            <path d={`M ${cx} ${cy} L ${u.x} ${u.y}`} stroke={color} strokeWidth={3} opacity={0.5} strokeDasharray="8 10" strokeDashoffset={-t * 50 - n * 4} />
            <circle cx={u.x} cy={u.y - 10} r={11} fill={color} />
            <path d={`M ${u.x - 18} ${u.y + 22} Q ${u.x} ${u.y - 4} ${u.x + 18} ${u.y + 22} Z`} fill={color} />
          </g>
        ))}
        <ellipse cx={cx} cy={cy - 16} rx={34} ry={11} fill={C.cardDeep} stroke={color} strokeWidth={4} />
        <path d={`M ${cx - 34} ${cy - 16} V ${cy + 14} C ${cx - 34} ${cy + 30} ${cx + 34} ${cy + 30} ${cx + 34} ${cy + 14} V ${cy - 16}`} fill={C.cardDeep} stroke={color} strokeWidth={4} />
      </g>
    );
  }
  if (i === 1)
    return (
      <g>
        <path d={`M ${cx} ${cy - 100} L ${cx + 80} ${cy - 70} V ${cy} C ${cx + 80} ${cy + 55} ${cx + 30} ${cy + 90} ${cx} ${cy + 104} C ${cx - 30} ${cy + 90} ${cx - 80} ${cy + 55} ${cx - 80} ${cy} V ${cy - 70} Z`} fill={color} fillOpacity={0.14} stroke={color} strokeWidth={6} strokeLinejoin="round" />
        <path d={`M ${cx - 34} ${cy} L ${cx - 8} ${cy + 28} L ${cx + 38} ${cy - 24}`} fill="none" stroke={color} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p(t, T.cards[1] + 0.6, 0.8)} />
      </g>
    );
  return (
    <g>
      <path d={`M ${cx + 18} ${cy - 100} L ${cx - 52} ${cy + 8} H ${cx - 4} L ${cx - 20} ${cy + 100} L ${cx + 56} ${cy - 20} H ${cx + 6} Z`} fill={color} fillOpacity={0.2} stroke={color} strokeWidth={6} strokeLinejoin="round" />
      {[-40, 0, 40].map((dy, n) => (
        <path key={n} d={`M ${cx - 120} ${cy + dy} H ${cx - 82 - ((t * 120 + n * 30) % 30)}`} stroke={color} strokeWidth={5} strokeLinecap="round" opacity={0.6} />
      ))}
    </g>
  );
};

export const Scene05: React.FC<{ t: number }> = ({ t }) => {
  const { fps } = useVideoConfig();
  return (
    <g>
      <g opacity={p(t, T.head, 0.6)}>
        <AR x={960} y={130} size={62} weight={900}>ثلاثية القوة للمؤسسات</AR>
        <EN x={960} y={184} size={32} fill={C.client} weight={600}>Enterprise RDBMS Triad</EN>
      </g>
      {CARDS.map((c, i) => {
        const at = T.cards[i];
        const sp = spring({ frame: Math.round((t - at) * fps), fps, config: { stiffness: 120 } });
        const o = t >= at ? Math.min(1, sp * 1.6) : 0;
        const x = CX(i);
        const glow = t >= at ? 1 : 0;
        return (
          <g key={i} opacity={o} transform={`translate(0 ${(1 - sp) * 320})`}>
            <Card x={x} y={CY} w={CW} h={CH} stroke={c.color} glow={glow * (0.6 + 0.4 * win(t, 189, 195, 1))} />
            <Icon i={i} cx={x + CW / 2} cy={CY + 190} color={c.color} t={t} k={sp} />
            <AR x={x + CW / 2} y={CY + 395} size={36} weight={900} fill={c.color}>{c.ar}</AR>
            <EN x={x + CW / 2} y={CY + 445} size={26} weight={600}>{c.en}</EN>
            <AR x={x + CW / 2} y={CY + 505} size={25} weight={400} fill={C.muted}>{c.desc}</AR>
          </g>
        );
      })}
      <g opacity={p(t, T.closing, 0.8)} transform={`translate(0 ${(1 - p(t, T.closing, 0.8)) * 16})`}>
        <AR x={960} y={930} size={48} weight={700}>قواعد البيانات مش مجرد مخزن.. دي بيئة معالجة متكاملة</AR>
      </g>
    </g>
  );
};
