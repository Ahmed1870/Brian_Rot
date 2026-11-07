import React from 'react';
import { C } from '../../theme';
import { AR, EN, Reveal, Card, Header, Arrowed, CodeBlock } from '../../components/common';
import type { Tok } from '../../components/common';
import { p, lin, win } from '../../anim';
import tl from '../../timeline.json';

const T = tl.s3;
const CODE: Tok[][] = [
  [['SELECT ', C.accent], ["attributes", C.text], ['->', C.client], ["'specs'", C.opt], [' AS json_obj,', C.text]],
  [['       attributes', C.text], ['->', C.client], ["'specs'", C.opt], ['->>', C.opt], ["'color'", C.opt], [' AS text_val', C.text]],
  [['FROM ', C.accent], ['store_products ', C.client], ['WHERE ', C.accent], ["attributes", C.text], ['->>', C.opt], ["'brand' = 'Manzooma';", C.text]],
];
const Leaf: React.FC<{ x: number; y: number; w: number; k: string; v: string; c: string; hot?: number }> = ({ x, y, w, k, v, c, hot = 0 }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect width={w} height={52} rx={14} fill={c} opacity={0.14 + 0.25 * hot} stroke={c} strokeWidth={3} />
    <EN x={w / 2} y={34} size={20} fill={C.text} weight={600}>{`"${k}": "${v}"`}</EN>
  </g>
);

export const Scene03: React.FC<{ t: number }> = ({ t }) => {
  const ed = p(t, T.typeAt[0] - 0.5, 0.7);
  const typed = lin(t, T.typeAt[0], T.typeAt[1] - T.typeAt[0]);
  const a1 = p(t, T.arrowAt, 0.6);
  const a2 = p(t, T.arrow2At, 0.6);
  const where = p(t, T.arrow2At + 3.4, 0.5);
  const fn = p(t, T.funcAt, 0.6);
  const ext = 1 - fn;
  const build = p(t, T.buildAt, 0.9);
  const out = p(t, T.outAt, 0.6);

  return (
    <g>
      <Header t={t} a={T.typeAt[0] - 0.4} b={T.typeAt[0] + 1} ar="معاملات استعلام JSONB" en="-> and ->> Operators" y={105} color={C.client} />

      <g opacity={ed} transform={`translate(0 ${(1 - ed) * 20})`}>
        <Card x={90} y={190} w={1740} h={218} stroke={C.client} glow={0.4} r={24} />
        <circle cx={130} cy={222} r={7} fill={C.accent} />
        <circle cx={156} cy={222} r={7} fill={C.opt} />
        <circle cx={182} cy={222} r={7} fill={C.db} />
        <CodeBlock lines={CODE} x={124} y={284} size={26} lineH={46} progress={typed} />
      </g>

      {/* the JSONB document */}
      <g opacity={ed}>
        <Card x={70} y={430} w={760} h={420} stroke={C.line} glow={0.3} r={24} />
        <EN x={100} y={478} size={24} anchor="start" fill={C.db} weight={600}>attributes · JSONB</EN>
        <Leaf x={110} y={510} w={300} k="brand" v="Manzooma" c={C.muted} hot={where} />
        <g>
          <rect x={110} y={590} width={680} height={230} rx={18} fill="none" stroke={C.client} strokeWidth={a1 > 0 ? 5 : 2} opacity={0.4 + 0.6 * a1} strokeDasharray={a1 > 0 ? '0' : '10 8'} />
          <EN x={160} y={624} size={22} anchor="start" fill={C.client} weight={600}>"specs"</EN>
          <Leaf x={140} y={664} w={300} k="color" v="Black" c={C.opt} hot={a2} />
          <Leaf x={470} y={664} w={300} k="size" v="L" c={C.muted} />
          <EN x={450} y={790} size={18} fill={C.muted}>nested object</EN>
        </g>
      </g>

      {/* extraction results */}
      <g opacity={ed * ext}>
        <Card x={870} y={430} w={960} h={420} stroke={C.line} r={24} />
        <g opacity={a1} transform={`translate(0 ${(1 - a1) * 14})`}>
          <rect x={900} y={470} width={120} height={64} rx={32} fill={C.client} opacity={0.22} stroke={C.client} strokeWidth={4} />
          <EN x={960} y={514} size={34} fill={C.client} weight={600}>-&gt;</EN>
          <path d="M 1030 502 H 1110" stroke={C.client} strokeWidth={5} strokeLinecap="round" />
          <rect x={1120} y={462} width={680} height={80} rx={20} fill={C.client} opacity={0.16} stroke={C.client} strokeWidth={3} />
          <EN x={1460} y={512} size={26} fill={C.text} weight={600}>{'{"color": "Black", "size": "L"}'}</EN>
          <EN x={1780} y={452} size={16} anchor="end" fill={C.client}>jsonb · structure kept</EN>
        </g>
        <g opacity={a2} transform={`translate(0 ${(1 - a2) * 14})`}>
          <rect x={900} y={590} width={120} height={64} rx={32} fill={C.opt} opacity={0.22} stroke={C.opt} strokeWidth={4} />
          <EN x={960} y={634} size={32} fill={C.opt} weight={600}>-&gt;&gt;</EN>
          <path d="M 1030 622 H 1110" stroke={C.opt} strokeWidth={5} strokeLinecap="round" />
          <rect x={1120} y={582} width={300} height={80} rx={20} fill={C.opt} opacity={0.16} stroke={C.opt} strokeWidth={3} />
          <EN x={1270} y={632} size={30} fill={C.text} weight={600}>Black</EN>
          <EN x={1410} y={572} size={16} anchor="end" fill={C.opt}>text · plain string</EN>
        </g>
        <g opacity={where} transform={`translate(0 ${(1 - where) * 14})`}>
          <rect x={900} y={710} width={900} height={92} rx={26} fill={C.opt} opacity={0.14} stroke={C.opt} strokeWidth={3} />
          <EN x={1160} y={766} size={26} fill={C.opt} weight={600}>{"WHERE attributes ->> 'brand' = 'Manzooma'"}</EN>
          <EN x={1690} y={766} size={24} fill={C.db} weight={600}>✓ filter / sort</EN>
        </g>
      </g>

      {/* builder functions */}
      <g opacity={fn}>
        <Card x={870} y={430} w={960} h={420} stroke={C.purple} glow={0.5} r={24} />
        <EN x={900} y={474} size={24} anchor="start" fill={C.purple} weight={600}>build JSONB from rows</EN>
        <rect x={900} y={492} width={340} height={48} rx={24} fill={C.purple} opacity={0.22} stroke={C.purple} strokeWidth={3} />
        <EN x={1070} y={524} size={22} fill={C.purple} weight={600}>jsonb_build_object()</EN>
        <g opacity={build}>
          <rect x={900} y={556} width={330} height={56} rx={12} fill={C.cardDeep} stroke={C.line} strokeWidth={2} />
          <EN x={940} y={592} size={20} anchor="start" fill={C.muted}>1,250</EN>
          <AR x={1200} y={594} size={26} anchor="start">لابتوب</AR>
          <path d="M 1250 584 H 1310" stroke={C.purple} strokeWidth={5} strokeLinecap="round" />
          <path d="M 1300 570 L 1324 584 L 1300 598 Z" fill={C.purple} />
          <rect x={1334} y={554} width={470} height={60} rx={16} fill={C.purple} opacity={0.18} stroke={C.purple} strokeWidth={3} />
          <EN x={1569} y={591} size={20} fill={C.text} weight={600}>{'{"name": "لابتوب", "price": 1250}'}</EN>
        </g>
        <g opacity={p(t, T.buildAt + 3.2, 0.6)}>
          <rect x={900} y={660} width={250} height={48} rx={24} fill={C.purple} opacity={0.22} stroke={C.purple} strokeWidth={3} />
          <EN x={1025} y={692} size={22} fill={C.purple} weight={600}>jsonb_agg()</EN>
          <rect x={900} y={724} width={904} height={84} rx={18} fill={C.purple} opacity={0.14} stroke={C.purple} strokeWidth={3} />
          <EN x={1352} y={776} size={24} fill={C.text} weight={600}>{'[ {…}, {…}, {…} ]  ← rows folded into one JSONB array'}</EN>
        </g>
      </g>

      <g opacity={out} transform={`translate(0 ${(1 - out) * 12})`}>
        <rect x={470} y={872} width={980} height={64} rx={32} fill={C.db} opacity={0.14} stroke={C.db} strokeWidth={3} />
        <AR x={1400} y={918} size={30} anchor="start" fill={C.db}>تشكيل المخرجات بمرونة مطلقة</AR>
      </g>

      <g opacity={win(t, T.capA[0], T.capA[1], 0.3)}>
        <Arrowed y={995} left="Operator ->" right="Extracts JSON Object / Array Element (Retains JSONB Type)" leftColor={C.client} rightColor={C.text} size={22} />
      </g>
      <g opacity={win(t, T.capB[0], T.capB[1], 0.3)}>
        <Arrowed y={995} left="Operator ->>" right="Extracts Element as Plain Text (Filterable in WHERE Clause)" leftColor={C.opt} rightColor={C.text} size={22} />
      </g>
    </g>
  );
};
