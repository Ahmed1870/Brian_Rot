import React from 'react';
import { C } from '../../theme';
import { AR, EN, Reveal, Card, Logo } from '../../components/common';
import { p, lin, keys } from '../../anim';
import tl from '../../timeline.json';

const T = tl.s6;
const WHATSAPP = '+201019672878';
const URL_A = 'analytics.gomaaintelligence.me';
const URL_B = 'solutions.gomaaintelligence.me';

export const Scene06: React.FC<{ t: number }> = ({ t }) => {
  const logoK = p(t, T.brand, 1.4);
  const logoScale = 0.92 + 0.08 * lin(t, T.brand, 25); // slow 2D scale-in
  const sweepK = lin(t, T.sweep, 2.4);
  const sweepX = keys(sweepK, [0, 1], [-400, 1900]);

  return (
    <g>
      {/* brand */}
      <g opacity={logoK} transform={`translate(960 190) scale(${logoScale}) translate(-960 -190)`}>
        <Logo x={700} y={-70} size={520} fill={C.text} />
      </g>
      <Reveal t={t} at={T.brand + 0.8} dy={20}>
        <AR x={960} y={440} size={92} weight={900}>منظومة</AR>
        <EN x={960} y={498} size={40} fill={C.client} weight={600}>Manzooma Data Solutions</EN>
      </Reveal>

      {/* two glass cards */}
      {[
        { at: T.cardA, x: 110, ar: 'الخدمات الاستشارية وتحليل البيانات للشركات', label: 'موقع الخدمات', url: URL_A, color: C.client },
        { at: T.cardB, x: 1010, ar: 'المنصة التعليمية والموارد', label: 'المنصة والشيتات', url: URL_B, color: C.db },
      ].map((c, i) => (
        <Reveal key={i} t={t} at={c.at} dy={36}>
          <Card x={c.x} y={560} w={800} h={250} stroke={c.color} glow={0.7} fill="#1B2740" />
          <AR x={c.x + 400} y={630} size={34} weight={700}>{c.ar}</AR>
          <AR x={c.x + 400} y={705} size={28} weight={400} fill={C.muted}>{c.label}</AR>
          <EN x={c.x + 400} y={765} size={34} weight={600} fill={c.color}>{c.url}</EN>
        </Reveal>
      ))}

      {/* contact pill */}
      <Reveal t={t} at={T.whatsapp} dy={24}>
        <rect x={430} y={860} width={1060} height={110} rx={55} fill={C.cardDeep} stroke={C.opt} strokeWidth={3} />
        <AR x={1450} y={928} size={40} weight={700} anchor="start">واتساب / تواصل:</AR>
        <EN x={800} y={930} size={48} weight={600} fill={C.opt} anchor="middle">{WHATSAPP}</EN>
        {/* light sweep */}
        <g opacity={sweepK > 0 && sweepK < 1 ? 0.14 : 0}>
          <polygon points={`${sweepX},860 ${sweepX + 120},860 ${sweepX + 60},970 ${sweepX - 60},970`} fill={C.text} />
        </g>
      </Reveal>
    </g>
  );
};
