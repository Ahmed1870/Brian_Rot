import React from 'react';
import { C, FONT_MONO } from '../../theme';
import { AR, EN, Reveal, Card, Arrowed, MiniTable, KeyIcon, LockIcon } from '../../components/common';
import type { Col } from '../../components/common';
import { p, lin, win, bump } from '../../anim';
import tl from '../../timeline.json';

const T = tl.s2;
const GOLD = '#FBBF24';
const COLS: Col[] = [
  { k: 'id', w: 170, color: GOLD },
  { k: 'name', w: 300, ar: true },
];
const NAMES = [['1', 'أحمد محمود'], ['2', 'سارة علي'], ['3', 'خالد حسن']];

export const Scene02: React.FC<{ t: number }> = ({ t }) => {
  const k = p(t, T.left[0] - 0.3, 0.8);
  const pkIn = win(t, T.pkAt, T.pkEnd + 0.6, 0.6);
  const rattle = t >= T.rattleAt && t < T.rattleAt + 4 ? Math.sin(t * 55) * 6 * (1 - lin(t, T.rattleAt, 4)) : 0;
  const warnK = p(t, T.riskAt[0] + 0.3, 0.5);
  const lockK = p(t, T.lockAt, 0.45);
  const ansi = p(t, T.ansiAt, 0.6);
  const manual = lin(t, T.manualAt, 2.2);
  const manualOut = 1 - lin(t, T.finalAt - 0.3, 0.3);
  const fin = p(t, T.finalAt, 0.7);
  const LX = 130, RX = 1030, TY = 430;

  // manual-edit chip: flies to the id column, bounces back
  const mx = manual < 0.5 ? 1780 - (manual / 0.5) * 330 : 1450 + ((manual - 0.5) / 0.5) * 300;
  const rows3 = (at: number[]) => (i: number) => ({ opacity: p(t, at[i], 0.5), dx: (1 - p(t, at[i], 0.5)) * 40 });

  return (
    <g>
      {/* primary key intro */}
      <g opacity={pkIn} transform={`translate(0 ${(1 - p(t, T.pkAt, 0.8)) * 20})`}>
        <circle cx={960} cy={430} r={150} fill={GOLD} opacity={0.08} />
        <circle cx={960} cy={430} r={110} fill="none" stroke={GOLD} strokeWidth={4} strokeDasharray="10 14" strokeDashoffset={-t * 30} opacity={0.7} />
        <KeyIcon x={960} y={430} s={2.4} color={GOLD} rot={-20 + 6 * Math.sin(t * 2)} />
        <AR x={960} y={650} size={66} weight={900}>المفتاح الأساسي</AR>
        <EN x={960} y={712} size={34} fill={GOLD} weight={600}>Primary Key · unique identity per row</EN>
      </g>

      {/* LEFT: SERIAL */}
      <g opacity={k * (t >= T.right[0] ? 0.55 : 1)}>
        <Card x={90} y={250} w={840} h={580} stroke={t >= T.left[0] ? C.opt : C.line} glow={t >= T.left[0] && t < T.right[0] ? 0.8 : 0} />
        <EN x={510} y={308} size={34} fill={C.opt} weight={600}>SERIAL</EN>
        <rect x={130} y={336} width={760} height={56} rx={12} fill={C.cardDeep} />
        <text x={150} y={374} fontFamily={FONT_MONO} fontSize={28} fontWeight={600} direction="ltr"><tspan fill={C.text}>id </tspan><tspan fill={C.opt}>SERIAL</tspan><tspan fill={C.accent}> PRIMARY KEY</tspan></text>
        <MiniTable x={LX} y={TY} cols={COLS} rows={NAMES} rowH={56} hdrH={50} />
        {/* detached sequence */}
        <g transform={`translate(${rattle} 0)`}>
          <rect x={650} y={440} width={240} height={130} rx={16} fill={C.cardDeep} stroke={C.opt} strokeWidth={3} strokeDasharray="10 8" />
          <EN x={770} y={480} size={20} fill={C.opt}>customers_id_seq</EN>
          <g transform={`translate(770 528) rotate(${t * 60})`}>
            {Array.from({ length: 6 }).map((_, i) => <rect key={i} x={-5} y={-22} width={10} height={12} rx={3} fill={C.opt} transform={`rotate(${i * 60})`} />)}
            <circle r={13} fill="none" stroke={C.opt} strokeWidth={4} />
          </g>
        </g>
        {/* wobbling, broken link */}
        <path d={`M 604 470 C 622 ${470 + Math.sin(t * 9) * 12} 632 ${500 - Math.sin(t * 9) * 12} 648 500`} stroke={C.accent} strokeWidth={4} strokeDasharray="8 8" fill="none" opacity={0.4 + 0.6 * warnK} />
        {/* risk chips */}
        {[
          { at: T.riskAt[0], ar: 'مخاطر الملكية', en: 'Ownership Risk', y: 650 },
          { at: T.riskAt[1] + 0.5, ar: 'مخاطر المزامنة', en: 'Sync Risk (migration)', y: 735 },
        ].map((c) => {
          const kk = p(t, c.at, 0.5);
          return (
            <g key={c.en} opacity={kk} transform={`translate(0 ${(1 - kk) * 14})`}>
              <rect x={150} y={c.y} width={720} height={68} rx={34} fill={C.accent} opacity={0.14} stroke={C.accent} strokeWidth={3} />
              <path d={`M 190 ${c.y + 50} L 214 ${c.y + 12} L 238 ${c.y + 50} Z`} fill={C.accent} />
              <EN x={290} y={c.y + 43} size={24} anchor="start" fill="#FCA5A5" weight={600}>{c.en}</EN>
              <AR x={850} y={c.y + 45} size={28} anchor="start" fill="#FCA5A5">{c.ar}</AR>
            </g>
          );
        })}
      </g>

      {/* RIGHT: IDENTITY */}
      <g opacity={k * (t < T.right[0] ? 0.55 : 1)}>
        <Card x={990} y={250} w={840} h={580} stroke={t >= T.right[0] ? C.db : C.line} glow={t >= T.right[0] ? 0.9 : 0} />
        <EN x={1410} y={308} size={30} fill={C.db} weight={600}>GENERATED ALWAYS AS IDENTITY</EN>
        <rect x={1030} y={336} width={760} height={56} rx={12} fill={C.cardDeep} />
        <text x={1048} y={372} fontFamily={FONT_MONO} fontSize={23} fontWeight={600} direction="ltr"><tspan fill={C.text}>id INT </tspan><tspan fill={C.db}>GENERATED ALWAYS AS IDENTITY</tspan><tspan fill={C.accent}> PRIMARY KEY</tspan></text>
        <MiniTable x={RX} y={TY} cols={COLS} rows={NAMES} rowH={56} hdrH={50} rowStyle={rows3(T.rowsAt)} />
        {/* integrated gold key + lock engaging on the id column */}
        <g>
          <rect x={RX + 3} y={TY - 4} width={164} height={50 + 3 * 56 + 6} rx={12} fill="none" stroke={C.db} strokeWidth={4} opacity={lockK} />
          <LockIcon x={1660} y={560} s={1.6} color={C.db} closed={lockK} />
          <KeyIcon x={1660} y={462 - 40 * (1 - lockK)} s={0.8} color={GOLD} rot={90} />
          <EN x={1660} y={660} size={20} fill={C.muted}>engine-owned</EN>
        </g>
        {/* ANSI badge */}
        <g opacity={ansi} transform={`translate(0 ${(1 - ansi) * 12})`}>
          <rect x={1130} y={665} width={560} height={54} rx={27} fill={C.db} opacity={0.18} stroke={C.db} strokeWidth={3} />
          <circle cx={1170} cy={692} r={14} fill={C.db} />
          <path d="M 1163 692 L 1169 698 L 1179 685" stroke={C.bg} strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <EN x={1430} y={700} size={24} fill={C.db} weight={600}>ANSI SQL Standard ✓</EN>
        </g>
        {/* manual edit attempt */}
        {manual > 0 && manual < 1 && (
          <g opacity={manualOut}>
            <rect x={mx} y={462} width={220} height={44} rx={22} fill={C.opt} opacity={0.25} stroke={C.opt} strokeWidth={3} />
            <EN x={mx + 110} y={492} size={20} fill={C.opt} weight={600}>UPDATE id = 99</EN>
          </g>
        )}
        <g opacity={p(t, T.manualAt + 1.0, 0.4) * manualOut}>
          <rect x={1030} y={738} width={760} height={58} rx={29} fill={C.accent} opacity={0.16} stroke={C.accent} strokeWidth={3} />
          <EN x={1410} y={776} size={24} fill="#FCA5A5" weight={600}>✗ manual edit rejected — engine owns the value</EN>
        </g>
        {/* final: both tables secured */}
        <g opacity={fin} transform={`translate(0 ${(1 - fin) * 14})`}>
          {['customers.id', 'orders.id'].map((s, i) => (
            <g key={s}>
              <rect x={1040 + i * 390} y={738} width={360} height={64} rx={32} fill={C.db} opacity={0.16} stroke={C.db} strokeWidth={3} />
              <LockIcon x={1086 + i * 390} y={770} s={0.5} color={C.db} />
              <EN x={1250 + i * 390} y={778} size={26} fill={C.db} weight={600}>{s}</EN>
            </g>
          ))}
        </g>
      </g>

      {/* captions */}
      <g opacity={win(t, T.left[0], T.left[1], 0.4)}>
        <Arrowed y={960} left="SERIAL" right="Legacy Sequence (Ownership Risks)" leftColor={C.opt} rightColor={C.text} size={34} />
      </g>
      <g opacity={win(t, T.right[0], T.right[1] + 0.2, 0.4)}>
        <Arrowed y={960} left="GENERATED ALWAYS AS IDENTITY" right="ANSI SQL Standard (Strict Primary Key)" leftColor={C.db} rightColor={C.text} size={32} />
      </g>
    </g>
  );
};
