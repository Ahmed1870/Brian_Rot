import React from 'react';
import { C } from '../../theme';
import { AR, EN, Reveal, Card, Logo } from '../../components/common';
import { p, lin, bump } from '../../anim';
import tl from '../../timeline.json';

const T = tl.s6;
const GOLD = '#FBBF24';
const SKILLS = ['JSON vs JSONB', 'BINARY FORMAT', '-> OPERATOR', '->> OPERATOR', 'TOAST STORAGE', 'jsonb_build_object'];
const CONSTRAINTS = ['JSONB Mutations', 'GIN Indexes', 'jsonb_set()', '@> Contains'];

export const Scene06: React.FC<{ t: number }> = ({ t }) => {
  const prog = lin(t, T.progress[0], T.progress[1] - T.progress[0]);
  const pct = Math.round(prog * 100);
  const done = p(t, T.progress[1], 0.6);
  const sweep = lin(t, T.sheets + 0.6, 2.4);
  const sx = -300 + sweep * 1900;

  return (
    <g>
      {/* academy header */}
      <g opacity={p(t, T.header, 0.8)}>
        <Logo x={30} y={-60} size={330} fill={C.text} />
        <AR x={1010} y={130} size={64} weight={900}>منظومة أكاديمي</AR>
        <EN x={1010} y={186} size={34} fill={C.client} weight={600}>Manzooma SQL Masterclass</EN>
      </g>

      {/* completed lesson card */}
      <Reveal t={t} at={T.badge} dy={30}>
        <Card x={90} y={260} w={930} h={440} stroke={C.db} glow={0.6 + 0.4 * bump(t, T.progress[1], 1.2)} fill="#1B2740" />
        <circle cx={170} cy={340} r={42} fill={C.db} opacity={0.2} stroke={C.db} strokeWidth={4} />
        <path d="M 150 340 L 166 358 L 196 322" fill="none" stroke={C.db} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - done} />
        <EN x={240} y={336} size={32} anchor="start" fill={C.db} weight={600}>Lesson 61 Completed</EN>
        <EN x={240} y={376} size={26} anchor="start" fill={C.text}>JSON & JSONB Fundamentals Mastered</EN>
        {/* progress bar */}
        <rect x={130} y={430} width={850} height={26} rx={13} fill={C.cardDeep} />
        <rect x={130} y={430} width={850 * 0.25 * prog} height={26} rx={13} fill={C.db} />
        <EN x={130} y={420} size={22} anchor="start" fill={C.muted}>{`${Math.round(25 * prog)}%`}</EN>
        <AR x={980} y={415} size={26} anchor="start" fill={C.muted}>إنجاز الدرس 61</AR>
        <g opacity={done}><EN x={130} y={488} size={20} anchor="start" fill={C.db} weight={600}>Module 15 · Semi-Structured Data — 25% ✓</EN></g>
        {/* skills gained */}
        <AR x={980} y={520} size={26} anchor="start" fill={C.muted}>المهارات المكتسبة</AR>
        {SKILLS.map((s, i) => {
          const k = p(t, T.progress[0] + 1.5 + i * 0.7, 0.5);
          const col = i % 3, row = Math.floor(i / 3);
          const x = 130 + col * 290, y = 545 + row * 70;
          return (
            <g key={s} opacity={k} transform={`translate(0 ${(1 - k) * 12})`}>
              <rect x={x} y={y} width={270} height={52} rx={26} fill={C.client} opacity={0.16} stroke={C.client} strokeWidth={2} />
              <EN x={x + 135} y={y + 35} size={22} fill={C.client} weight={600}>{s}</EN>
            </g>
          );
        })}
      </Reveal>

      {/* next lesson teaser */}
      <Reveal t={t} at={T.next} dy={30}>
        <Card x={1060} y={260} w={770} h={440} stroke={GOLD} glow={0.7} fill="#1B2740" />
        <AR x={1445} y={330} size={30} fill={GOLD}>الدرس القادم · الدرس 62</AR>
        <AR x={1445} y={386} size={30} weight={900}>تعديل مستندات JSONB وفهارس GIN</AR>
        <EN x={1445} y={430} size={28} fill={C.client} weight={600}>JSONB Mutations & GIN Indexes</EN>
        {/* thumbnail: four constraint chips */}
        {CONSTRAINTS.map((c, i) => {
          const k = p(t, T.chips + i * 0.5, 0.5);
          const col = i % 2, row = Math.floor(i / 2);
          return (
            <g key={c} opacity={k} transform={`translate(0 ${(1 - k) * 12})`}>
              <rect x={1110 + col * 330} y={490 + row * 90} width={300} height={68} rx={34} fill={GOLD} opacity={0.14} stroke={GOLD} strokeWidth={3} />
              <EN x={1260 + col * 330} y={534 + row * 90} size={26} fill={GOLD} weight={600}>{c}</EN>
            </g>
          );
        })}
      </Reveal>

      {/* resources */}
      <Reveal t={t} at={T.sheets} dy={30}>
        <Card x={90} y={750} w={1740} h={200} stroke={C.client} glow={0.5} fill="#1B2740" />
        <g transform="translate(190 850)">
          <rect x={-44} y={-58} width={88} height={116} rx={12} fill={C.cardDeep} stroke={C.client} strokeWidth={5} />
          <path d="M -22 -28 H 22 M -22 -4 H 22 M -22 20 H 6" stroke={C.client} strokeWidth={5} strokeLinecap="round" />
        </g>
        <AR x={1760} y={832} size={46} weight={900} anchor="start">الشيتات والتمارين</AR>
        <EN x={1760} y={888} size={36} anchor="end" fill={C.client} weight={600}>solutions.gomaaintelligence.me</EN>
        <g opacity={sweep > 0 && sweep < 1 ? 0.14 : 0}>
          <polygon points={`${sx},750 ${sx + 140},750 ${sx + 70},950 ${sx - 70},950`} fill={C.text} />
        </g>
      </Reveal>
    </g>
  );
};
