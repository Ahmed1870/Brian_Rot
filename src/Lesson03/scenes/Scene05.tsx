import React from 'react';
import { C, FONT_MONO } from '../../theme';
import { AR, EN, Reveal, Card, Arrowed } from '../../components/common';
import { p, lin, win, typed } from '../../anim';
import tl from '../../timeline.json';

const T = tl.s5;
// [first_name, last_name, city]
const DATA: [string, string, string][] = [
  ['أحمد', 'محمود', 'القاهرة'],
  ['سارة', 'علي', 'الإسكندرية'],
  ['خالد', 'حسن', 'القاهرة'],
  ['منى', 'سمير', 'الجيزة'],
  ['يوسف', 'كمال', 'القاهرة'],
  ['ليلى', 'إبراهيم', 'أسوان'],
  ['عمر', 'زكي', 'القاهرة'],
];
// final sorted position by last_name (Arabic alphabetical)
const ORDER = ['إبراهيم', 'حسن', 'زكي', 'سمير', 'علي', 'كمال', 'محمود'];
const finalIdx = DATA.map((r) => ORDER.indexOf(r[1]));

const TX = 980, TY = 300, RH = 66, CWD = 270;
const LINES = [
  { parts: [['SELECT', C.accent], [' *', C.text]] as [string, string][] },
  { parts: [['FROM', C.accent], [' customers', C.client]] as [string, string][] },
  { parts: [['WHERE', C.opt], [" city = 'القاهرة'", C.text]] as [string, string][] },
  { parts: [['ORDER BY', C.opt], [' last_name;', C.text]] as [string, string][] },
];

export const Scene05: React.FC<{ t: number }> = ({ t }) => {
  // typing progress over the whole statement (lines 1-3 first, then line 4)
  const l123 = lin(t, T.typeA[0], T.typeA[1] - T.typeA[0]);
  const l4 = lin(t, T.typeB[0], T.typeB[1] - T.typeB[0]);
  const total123 = LINES.slice(0, 3).reduce((a, l) => a + l.parts.map((x) => x[0]).join('').length, 0);
  let budget = Math.floor(l123 * total123);
  const filter = p(t, T.filterAt, 0.7);

  const ease = (x: number) => 1 - Math.pow(1 - x, 3);
  const sortK = (i: number) => ease(lin(t, T.sortAt + i * 0.12, 1.2));
  const rowY = (i: number) => {
    const from = i;
    const to = finalIdx[i];
    return TY + 70 + (from + (to - from) * sortK(i)) * RH;
  };

  return (
    <g>
      {/* code window */}
      <Reveal t={t} at={T.open} dy={24}>
        <Card x={80} y={230} w={820} h={380} stroke={C.client} glow={0.6} r={24} />
        <circle cx={120} cy={266} r={7} fill={C.accent} />
        <circle cx={146} cy={266} r={7} fill={C.opt} />
        <circle cx={172} cy={266} r={7} fill={C.db} />
        <EN x={860} y={274} size={22} anchor="end" fill={C.muted}>query.sql</EN>
        {LINES.map((ln, li) => {
          const full = ln.parts.map((x) => x[0]).join('').length;
          let take: number;
          if (li < 3) {
            take = Math.max(0, Math.min(full, budget));
            budget -= take;
          } else {
            take = Math.floor(l4 * full);
          }
          let left = take;
          return (
            <text key={li} x={120} y={350 + li * 58} fontFamily={FONT_MONO} fontSize={38} fontWeight={600} direction="ltr">
              {ln.parts.map(([s, c], pi) => {
                const n = Math.max(0, Math.min(s.length, left));
                left -= n;
                return (
                  <tspan key={pi} fill={c} xmlSpace="preserve">{s.slice(0, n)}</tspan>
                );
              })}
            </text>
          );
        })}
      </Reveal>

      {/* GROUP BY chip */}
      <Reveal t={t} at={T.groupAt} until={192} dy={18}>
        <rect x={140} y={660} width={700} height={78} rx={39} fill={C.db} opacity={0.16} stroke={C.db} strokeWidth={3} />
        <EN x={490} y={711} size={32} fill={C.db} weight={600}>GROUP BY city ✓ no errors</EN>
      </Reveal>

      {/* atomic table */}
      <Reveal t={t} at={T.open + 0.3} dy={24}>
        <Card x={TX - 40} y={TY - 30} w={3 * CWD + 80} h={7 * RH + 130} stroke={C.db} glow={0.5} r={24} />
        {['first_name', 'last_name', 'city'].map((h, i) => (
          <g key={h}>
            <rect x={TX + i * CWD + 4} y={TY} width={CWD - 8} height={54} rx={10} fill={C.client} opacity={0.2} />
            <EN x={TX + i * CWD + CWD / 2} y={TY + 36} size={24} fill={C.client} weight={600}>{h}</EN>
          </g>
        ))}
        {DATA.map((r, i) => {
          const cairo = r[2] === 'القاهرة';
          const hot = cairo ? filter : 0;
          const dim = cairo ? 1 : 1 - 0.65 * filter;
          const y = rowY(i);
          return (
            <g key={i} opacity={dim}>
              <rect x={TX} y={y} width={3 * CWD} height={RH - 10} rx={12} fill={i % 2 ? C.cardDeep : '#243247'} />
              <rect x={TX} y={y} width={3 * CWD} height={RH - 10} rx={12} fill={C.db} opacity={0.3 * hot} stroke={C.db} strokeWidth={hot > 0 ? 3 : 0} />
              {r.map((v, ci) => (
                <AR key={ci} x={TX + ci * CWD + CWD / 2} y={y + 38} size={28} weight={ci === 1 && p(t, T.sortAt, 0.5) > 0 ? 700 : 400} fill={ci === 1 && p(t, T.sortAt, 0.5) > 0 ? C.opt : C.text}>{v}</AR>
              ))}
            </g>
          );
        })}
      </Reveal>

      {/* captions */}
      <g opacity={win(t, T.cap1[0], T.cap1[1], 0.4)}>
        <Arrowed y={945} left="WHERE city = 'القاهرة'" right="Instant Filtering Success" leftColor={C.opt} rightColor={C.db} size={36} />
      </g>
      <g opacity={win(t, T.cap2[0], T.cap2[1], 0.4)}>
        <Arrowed y={945} left="ORDER BY last_name" right="Perfect Sorting & Indexing" leftColor={C.opt} rightColor={C.db} size={36} />
      </g>

      {/* closing line */}
      <g opacity={p(t, T.closing, 0.8)} transform={`translate(0 ${(1 - p(t, T.closing, 0.8)) * 16})`}>
        <AR x={960} y={1000} size={46} weight={700}>القيمة الذرية هي الأساس لكل تحليل متقدم</AR>
      </g>
    </g>
  );
};
