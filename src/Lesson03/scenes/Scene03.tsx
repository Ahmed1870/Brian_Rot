import React from 'react';
import { C, FONT_MONO } from '../../theme';
import { AR, EN, Reveal, Card, Header, Arrowed } from '../../components/common';
import { p, lin, win, bump, typed } from '../../anim';
import tl from '../../timeline.json';

const T = tl.s3;
const MESSY = 'أحمد محمود - 01000000001 - القاهرة، المعادي';
const QUERY = "WHERE city = 'القاهرة'";

export const Scene03: React.FC<{ t: number }> = ({ t }) => {
  const cellK = p(t, T.messyAt, 0.7);
  const jit = t >= T.jitterAt && t < T.jitterAt + 2 ? Math.sin(t * 60) * 7 * (1 - lin(t, T.jitterAt, 2)) : 0;
  const warn = p(t, T.badge[0], 0.5);
  const pulse = 0.5 + 0.5 * Math.sin(t * 7);
  const fail = p(t, T.failAt, 0.45);
  const q = typed(QUERY, t, T.typeAt, 5.5);
  const scan = lin(t, T.typeAt + 5.8, 1.2);
  const red = warn > 0;

  return (
    <g>
      <Header t={t} a={T.head[0]} b={T.head[1]} ar="الفخ الشهير للمبتدئين" en="The Non-Atomic Data Trap" color={C.accent} />

      {/* table skeleton */}
      <g opacity={cellK}>
        <Card x={260} y={300} w={1400} h={300} stroke={red ? C.accent : C.line} glow={red ? 0.8 + 0.3 * pulse : 0} />
        <rect x={290} y={330} width={160} height={54} rx={10} fill={C.client} opacity={0.2} />
        <EN x={370} y={366} size={24} fill={C.client} weight={600}>id</EN>
        <rect x={470} y={330} width={1160} height={54} rx={10} fill={C.client} opacity={0.2} />
        <EN x={1050} y={366} size={24} fill={C.client} weight={600}>customer_info</EN>
        <rect x={290} y={410} width={160} height={150} rx={12} fill="#243247" />
        <EN x={370} y={495} size={26}>1</EN>
        {/* the chaotic cell */}
        <g transform={`translate(${jit} 0)`}>
          <rect x={470} y={410} width={1160} height={150} rx={14} fill={red ? C.accent : '#243247'} fillOpacity={red ? 0.18 : 1} stroke={red ? C.accent : C.line} strokeWidth={4} strokeDasharray={red ? '14 8' : '0'} />
          <AR x={1050} y={502} size={48} weight={700} fill={red ? '#FCA5A5' : C.text}>{MESSY}</AR>
        </g>
        {/* warning triangle */}
        <g opacity={warn} transform={`translate(${1590} ${420 - (1 - warn) * 20}) scale(${0.8 + 0.2 * warn})`}>
          <path d="M 0 -34 L 38 30 H -38 Z" fill={C.accent} stroke={C.accent} strokeWidth={6} strokeLinejoin="round" />
          <path d="M 0 -12 V 10" stroke={C.text} strokeWidth={6} strokeLinecap="round" />
          <circle cx={0} cy={21} r={4} fill={C.text} />
        </g>
      </g>

      {/* red alert tag */}
      <Reveal t={t} at={T.badge[0]} until={T.badge[1]} dy={16}>
        <rect x={560} y={196} width={800} height={72} rx={36} fill={C.accent} opacity={0.2} stroke={C.accent} strokeWidth={4} />
        <EN x={960} y={244} size={38} fill="#FCA5A5" weight={600}>CRITICAL TRAP: Non-Atomic Value</EN>
      </Reveal>

      {/* query window */}
      <Reveal t={t} at={T.typeAt - 0.5} dy={24}>
        <Card x={460} y={670} w={1000} h={130} stroke={C.line} r={22} />
        <circle cx={500} cy={702} r={7} fill={C.accent} />
        <circle cx={526} cy={702} r={7} fill={C.opt} />
        <circle cx={552} cy={702} r={7} fill={C.db} />
        <text x={500} y={770} fontFamily={FONT_MONO} fontSize={36} fontWeight={600} direction="ltr" fill={C.opt}>{q}</text>
      </Reveal>

      {/* scanning bar bouncing off the cell */}
      {scan > 0 && scan < 1 && (
        <rect x={470 + (1 - Math.abs(scan * 2 - 1)) * 1100} y={410} width={10} height={150} rx={5} fill={C.client} opacity={0.8} />
      )}

      {/* fail badge */}
      <g opacity={fail} transform={`translate(1360 735) scale(${0.6 + 0.4 * fail})`}>
        <circle r={48} fill={C.accent} />
        <path d="M -20 -20 L 20 20 M 20 -20 L -20 20" stroke={C.text} strokeWidth={9} strokeLinecap="round" />
      </g>
      <g opacity={fail}>
        <EN x={1280} y={745} size={26} anchor="end" fill="#FCA5A5">0 rows</EN>
      </g>

      {/* caption */}
      <g opacity={win(t, T.caption[0], T.caption[1], 0.4)}>
        <Arrowed y={940} left={'"أحمد - 01000... - القاهرة"'} right="Query Filter Failed!" leftColor={C.opt} rightColor={C.accent} size={38} leftArabic />
      </g>
    </g>
  );
};
