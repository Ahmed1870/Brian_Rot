import React from 'react';
import { spring, useVideoConfig } from 'remotion';
import { C } from '../../theme';
import { AR, EN, Reveal, Card, Header, Arrowed, CodeBlock } from '../../components/common';
import type { Tok } from '../../components/common';
import { p, lin, win } from '../../anim';
import { PRODUCTS } from '../../data';
import tl from '../../timeline.json';

const T = tl.s5;
const CODE: Tok[][] = [
  [['ALTER TABLE ', C.accent], ['store_products', C.client]],
  [['  ADD COLUMN ', C.accent], ['attributes ', C.text], ['JSONB', C.db], [';', C.text]],
  [['UPDATE ', C.accent], ['store_products', C.client]],
  [['SET ', C.accent], ['attributes = ', C.text], ["'{\"color\": \"Black\",", C.opt]],
  [['               ', C.text], ["\"warranty\": \"2 Years\"}'", C.opt]],
  [['WHERE ', C.accent], ['product_id = 101;', C.text]],
];
const lineLen = (i: number) => CODE[i].map((q) => q[0]).join('').length;
const charsA = CODE.slice(0, 2).reduce((a, _, i) => a + lineLen(i), 0);
const charsAll = CODE.reduce((a, _, i) => a + lineLen(i), 0);

export const Scene05: React.FC<{ t: number }> = ({ t }) => {
  const { fps } = useVideoConfig();
  const dash = p(t, T.dashAt, 0.8);
  const prog = t < T.typeB[0]
    ? (lin(t, T.typeA[0], T.typeA[1] - T.typeA[0]) * charsA) / charsAll
    : (charsA + lin(t, T.typeB[0], T.typeB[1] - T.typeB[0]) * (charsAll - charsA)) / charsAll;
  const col = p(t, T.typeA[1] - 1.5, 0.7); // new column appears after ALTER
  const cards = p(t, T.cardsAt, 0.7);
  const nw = p(t, T.newAt, 0.6);
  const seal = (() => {
    const s = spring({ frame: Math.round((t - T.sealAt) * fps), fps, config: { stiffness: 160, damping: 11 } });
    return t >= T.sealAt ? s : 0;
  })();
  const cardSp = (i: number) => (t >= T.cardsAt + i * 0.4 ? spring({ frame: Math.round((t - (T.cardsAt + i * 0.4)) * fps), fps, config: { stiffness: 130 } }) : 0);

  return (
    <g>
      <Header t={t} a={T.dashAt - 0.3} b={T.typeA[0] + 3} ar="تطبيق عملي في منظومة ستور" en="Dynamic Product Attributes" y={105} color={C.db} />

      <g opacity={dash} transform={`translate(0 ${(1 - dash) * 20})`}>
        <Card x={70} y={190} w={900} h={430} stroke={C.client} glow={0.4} r={24} />
        <circle cx={110} cy={222} r={7} fill={C.accent} />
        <circle cx={136} cy={222} r={7} fill={C.opt} />
        <circle cx={162} cy={222} r={7} fill={C.db} />
        <CodeBlock lines={CODE} x={104} y={290} size={25} lineH={50} progress={prog} />
      </g>

      {/* schema: new JSONB column */}
      <g opacity={dash} transform={`translate(0 ${(1 - dash) * 20})`}>
        <Card x={1010} y={190} w={820} h={430} stroke={col > 0.3 ? C.db : C.line} glow={col * 0.6} r={24} />
        <EN x={1040} y={238} size={24} anchor="start" fill={C.client} weight={600}>store_products</EN>
        {[['product_id', 1040, 150], ['name', 1190, 150], ['price', 1340, 130]].map(([h, x, w]) => (
          <g key={h as string}>
            <rect x={x as number} y={262} width={(w as number) - 6} height={46} rx={10} fill={C.client} opacity={0.2} />
            <EN x={(x as number) + (w as number) / 2 - 3} y={292} size={17} fill={C.client} weight={600}>{h as string}</EN>
          </g>
        ))}
        <g opacity={col} transform={`translate(${(1 - col) * 40} 0)`}>
          <rect x={1478} y={262} width={320} height={46} rx={10} fill={C.db} opacity={0.25} stroke={C.db} strokeWidth={3} />
          <EN x={1638} y={292} size={17} fill={C.db} weight={600}>attributes · JSONB</EN>
        </g>
        {PRODUCTS.slice(0, 3).map((r, i) => (
          <g key={r.id}>
            <rect x={1040} y={322 + i * 78} width={758} height={68} rx={12} fill={i % 2 ? '#172033' : '#243247'} />
            <EN x={1115} y={364 + i * 78} size={20}>{String(r.id)}</EN>
            <AR x={1265} y={366 + i * 78} size={24}>{r.n}</AR>
            <EN x={1405} y={364 + i * 78} size={20}>{r.price}</EN>
            <g opacity={col}><EN x={1638} y={364 + i * 78} size={20} fill={C.db}>{i === 0 && t > T.typeB[1] ? '{color, warranty}' : 'NULL'}</EN></g>
          </g>
        ))}
        <EN x={1420} y={600} size={20} fill={C.muted}>one ALTER · no further schema changes</EN>
      </g>

      {/* e-commerce cards with different attribute sets */}
      <g opacity={cards}>
        <Card x={70} y={660} w={1760} h={250} stroke={C.line} glow={0.2} r={24} />
        <EN x={100} y={702} size={22} anchor="start" fill={C.muted}>E-commerce storefront · every product has its own attributes</EN>
        {PRODUCTS.map((r, i) => {
          const sp = cardSp(i);
          return (
            <g key={r.id} opacity={Math.min(1, sp * 1.5)} transform={`translate(${100 + i * 330} ${724 + (1 - sp) * 30})`}>
              <rect width={310} height={170} rx={18} fill={C.client} opacity={0.12} stroke={C.client} strokeWidth={3} />
              <AR x={290} y={38} size={28} anchor="start">{r.n}</AR>
              {r.attrs.map((a, j) => (
                <EN key={a} x={20} y={78 + j * 28} size={18} anchor="start" fill={C.db} weight={600}>{a}</EN>
              ))}
            </g>
          );
        })}
        {/* brand-new product with brand-new keys: still no ALTER */}
        <g opacity={nw} transform={`translate(${1450 + (1 - nw) * 60} 724)`}>
          <rect width={350} height={170} rx={18} fill={C.db} opacity={0.14} stroke={C.db} strokeWidth={4} strokeDasharray="10 8" />
          <EN x={20} y={34} size={20} anchor="start" fill={C.db} weight={600}>NEW product</EN>
          <EN x={20} y={78} size={18} anchor="start" fill={C.text}>material: Leather</EN>
          <EN x={20} y={106} size={18} anchor="start" fill={C.text}>weight: 1.2kg</EN>
          <EN x={20} y={150} size={17} anchor="start" fill={C.db}>new keys · zero DDL</EN>
        </g>
      </g>
      <g opacity={Math.min(1, seal * 1.5)} transform={`translate(1690 560) rotate(-10) scale(${0.5 + 0.5 * seal})`}>
        <circle r={78} fill={C.db} opacity={0.14} />
        <circle r={72} fill="none" stroke={C.db} strokeWidth={6} />
        <path d="M -26 -2 L -8 20 L 28 -26" fill="none" stroke={C.db} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
        <EN x={0} y={48} size={14} fill={C.db} weight={600}>FLEXIBLE</EN>
        <EN x={0} y={64} size={14} fill={C.db} weight={600}>SCHEMA</EN>
      </g>

      <g opacity={win(t, T.cap1[0], T.cap1[1], 0.4)}>
        <Arrowed y={985} left="Enterprise E-Commerce Schema" right="Dynamic Product Attributes via JSONB" leftColor={C.db} rightColor={C.text} size={28} />
      </g>
      <g opacity={win(t, T.cap2[0], T.cap2[1], 0.4)}>
        <Arrowed y={985} left="Flexible Schema" right="Zero DDL Alterations for New Product Attribute Variants" leftColor={C.db} rightColor={C.text} size={22} />
      </g>
    </g>
  );
};
