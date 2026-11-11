import React from 'react';
import { C, FONT_MONO } from '../../theme';
import { AR, EN, Reveal, Card, Header, Arrowed } from '../../components/common';
import { p, lin, win, bump } from '../../anim';
import tl from '../../timeline.json';

const T = tl.s2;
const RAW = [
  '{ "brand" :   "Manzooma",',
  '  "color"  : "Black",',
  '  "color"  : "Blue" ,',
  '  "warranty" : "2 Years" }',
];
const KEYS = [['brand', 'Manzooma'], ['color', 'Blue'], ['warranty', '2 Years']];

export const Scene02: React.FC<{ t: number }> = ({ t }) => {
  const k = p(t, T.splitAt, 0.9);
  const js = p(t, T.jsonAt, 0.5);
  const rp = lin(t, T.reparseAt, 3.0);
  const jb = p(t, T.jsonbAt, 0.6);
  const bin = p(t, T.binaryAt, 0.9);
  const clean = p(t, T.cleanAt, 0.7);
  const sorted = p(t, T.sortAt, 0.7);
  const race = lin(t, T.raceAt, 4.0);
  const fast = p(t, T.fastAt, 0.5);
  const ok = p(t, T.okAt, 0.5);
  const sweep = (t * 0.7) % 1;
  const pulse = 0.5 + 0.5 * Math.sin(t * 8);

  return (
    <g>
      <Header t={t} a={T.splitAt - 0.2} b={T.jsonAt - 0.3} ar="الفارق الهيكلي الجوهري" en="JSON vs JSONB" y={105} color={C.client} />

      {/* JSON text */}
      <g opacity={k} transform={`translate(0 ${(1 - k) * 20})`}>
        <Card x={70} y={190} w={860} h={650} stroke={js > 0 ? C.accent : C.line} glow={js * 0.5} r={24} />
        <EN x={100} y={240} size={30} anchor="start" fill={C.accent} weight={600}>JSON · plain text</EN>
        <AR x={900} y={240} size={26} anchor="start" fill={C.muted}>نص كما هو</AR>
        <rect x={100} y={274} width={800} height={230} rx={18} fill={C.cardDeep} stroke={C.accent} strokeWidth={js > 0 ? 3 : 1} />
        {RAW.map((l, i) => (
          <text key={i} x={124} y={326 + i * 50} fontFamily={FONT_MONO} fontSize={26} fontWeight={600} direction="ltr" fill={i === 1 || i === 2 ? '#FCA5A5' : C.text} xmlSpace="preserve">{l}</text>
        ))}
        <g opacity={js}>
          <rect x={116} y={364} width={560} height={90} rx={10} fill="none" stroke={C.accent} strokeWidth={2} strokeDasharray="8 8" />
          <EN x={780} y={448} size={16} fill={C.accent}>duplicate key</EN>
        </g>
        {/* re-parse sweep on every query */}
        {rp > 0 && rp < 1 && <rect x={100} y={274} width={800 * rp} height={230} rx={18} fill={C.accent} opacity={0.12} />}
        <g opacity={p(t, T.reparseAt, 0.5)}>
          <g transform="translate(180 580)">
            <circle r={44} fill={C.cardDeep} stroke={C.accent} strokeWidth={5} />
            <path d="M 0 0 V -28" stroke={C.text} strokeWidth={5} strokeLinecap="round" transform={`rotate(${t * 220})`} />
            <path d="M 0 0 V -20" stroke={C.accent} strokeWidth={5} strokeLinecap="round" transform={`rotate(${t * 40})`} />
          </g>
          <EN x={250} y={578} size={26} anchor="start" fill={C.accent} weight={600}>re-parse text on every query</EN>
          <EN x={250} y={614} size={20} anchor="start" fill={C.muted}>Text Parsing Overhead</EN>
        </g>
        {/* lookup race: slow */}
        <g opacity={p(t, T.raceAt, 0.4)}>
          <rect x={100} y={700} width={800} height={30} rx={15} fill={C.cardDeep} />
          <rect x={100} y={700} width={800 * Math.min(1, race * 0.85)} height={30} rx={15} fill={C.accent} />
          <EN x={100} y={766} size={22} anchor="start" fill="#FCA5A5" weight={600}>lookup: slow (scans the text)</EN>
        </g>
      </g>

      {/* JSONB binary */}
      <g opacity={k} transform={`translate(0 ${(1 - k) * 20})`}>
        <Card x={970} y={190} w={860} h={650} stroke={jb > 0 ? C.db : C.line} glow={jb * 0.6} r={24} />
        <EN x={1000} y={240} size={30} anchor="start" fill={C.db} weight={600}>JSONB · decomposed binary</EN>
        <AR x={1800} y={240} size={26} anchor="start" fill={C.muted}>تنسيق ثنائي مفكك</AR>
        <g opacity={0.35 + 0.65 * jb}>
          <rect x={1000} y={274} width={800} height={230} rx={18} fill={C.cardDeep} stroke={C.db} strokeWidth={jb > 0 ? 3 : 1} />
        </g>
        {/* binary pattern appears as the text decomposes */}
        <g opacity={bin * (1 - clean)}>
          {Array.from({ length: 6 }).map((_, r) => (
            <text key={r} x={1024} y={314 + r * 30} fontFamily={FONT_MONO} fontSize={20} fontWeight={600} direction="ltr" fill={C.db} opacity={0.55}>{['0110 0010 0111 0010', '0110 0001 0110 1110', '0110 0100 0011 1010', '0100 1101 0110 0001', '0110 1110 0111 1010', '0110 1111 0110 1111'][r]}</text>
          ))}
        </g>
        {/* clean, de-duplicated, sorted keys */}
        <g opacity={clean}>
          {KEYS.map(([key, v], i) => {
            const orig = i === 0 ? 0 : i === 1 ? 2 : 1; // pre-sort order shown for the motion
            const order = sorted > 0.5 ? i : orig;
            const y = 292 + order * 66;
            return (
              <g key={key} transform={`translate(1030 ${y})`}>
                <rect width={740} height={54} rx={14} fill={C.db} opacity={0.18} stroke={C.db} strokeWidth={3} />
                <EN x={30} y={36} size={26} anchor="start" fill={C.db} weight={600}>{`"${key}"`}</EN>
                <EN x={330} y={36} size={26} anchor="start" fill={C.text}>{`: "${v}"`}</EN>
                <g opacity={sorted}>
                  <circle cx={700} cy={27} r={18} fill={C.db} />
                  <EN x={700} y={35} size={20} fill={C.bg} weight={600}>{String(i + 1)}</EN>
                </g>
              </g>
            );
          })}
        </g>
        <g opacity={clean}>
          <EN x={1400} y={528} size={20} fill={C.db}>spaces removed · duplicate key dropped · keys sorted A→Z</EN>
        </g>
        <g opacity={p(t, T.raceAt, 0.4)}>
          <rect x={1000} y={700} width={800} height={30} rx={15} fill={C.cardDeep} />
          <rect x={1000} y={700} width={800 * Math.min(1, race * 6)} height={30} rx={15} fill={C.db} />
          <EN x={1000} y={766} size={22} anchor="start" fill={C.db} weight={600}>lookup: direct key jump</EN>
        </g>
        <g opacity={fast} transform={`translate(0 ${(1 - fast) * 10})`}>
          <rect x={1500} y={738} width={300} height={74} rx={22} fill={C.db} opacity={0.2} stroke={C.db} strokeWidth={3} />
          <EN x={1650} y={788} size={34} fill={C.db} weight={600}>100× faster</EN>
        </g>
      </g>

      <g opacity={ok} transform={`translate(0 ${(1 - ok) * 14})`}>
        <rect x={470} y={856} width={980} height={72} rx={36} fill={C.db} opacity={0.14} stroke={C.db} strokeWidth={3} />
        <AR x={1400} y={906} size={30} anchor="start" fill={C.db}>JSONB الأسرع عند الاستعلام والفلترة</AR>
        <EN x={800} y={904} size={22} fill={C.db} weight={600}>✓ high efficiency</EN>
      </g>

      <g opacity={win(t, T.capA[0], T.capA[1], 0.4)}>
        <Arrowed y={985} left="JSON (Plain Text)" right="Preserves Formatting & Spaces | Slow Query Parsing" leftColor={C.accent} rightColor={C.text} size={26} />
      </g>
      <g opacity={win(t, T.capB[0], T.capB[1], 0.4)}>
        <Arrowed y={985} left="JSONB (Decomposed Binary)" right="Removes Duplicate Keys | 100x Faster Lookup" leftColor={C.db} rightColor={C.text} size={26} />
      </g>
    </g>
  );
};
