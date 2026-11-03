import React from 'react';
import { spring, useVideoConfig } from 'remotion';
import { C, FONT_MONO } from '../../theme';
import { AR, EN, Reveal, Card, Header, Arrowed } from '../../components/common';
import { p, lin, win, bump } from '../../anim';
import tl from '../../timeline.json';

const T = tl.s5;
const GOLD = '#FBBF24';
const SQL = 'ALTER TABLE products ADD CONSTRAINT chk_stock CHECK (stock_quantity >= 0);';

const Bars: React.FC<{ x: number; y: number; vals: number[]; color: string; t: number; wob: number; k: number }> = ({ x, y, vals, color, t, wob, k }) => (
  <g>
    {vals.map((v, i) => {
      const h = (v + wob * 18 * Math.sin(t * 5 + i * 2)) * k;
      return <rect key={i} x={x + i * 64} y={y - h} width={46} height={Math.max(2, h)} rx={8} fill={color} opacity={0.85} />;
    })}
    <path d={`M ${x - 10} ${y} H ${x + vals.length * 64}`} stroke={C.line} strokeWidth={3} />
  </g>
);

export const Scene05: React.FC<{ t: number }> = ({ t }) => {
  const { fps } = useVideoConfig();
  const k = p(t, T.panelsAt, 0.9);
  const typed = Math.floor(lin(t, T.alterType[0], T.alterType[1] - T.alterType[0]) * SQL.length);
  const applied = p(t, T.appliedAt, 0.5);
  const integ = lin(t, T.integrityAt, 2.0);
  const hours = Math.round(200 * p(t, T.hoursAt, 2.0));
  const eng = p(t, T.engineAt, 0.6);
  const rep = p(t, T.reportsAt, 1.2);
  const stampSp = spring({ frame: Math.round((t - T.stampAt) * fps), fps, config: { stiffness: 160, damping: 11 } });
  const stamp = t >= T.stampAt ? stampSp : 0;

  return (
    <g>
      <Header t={t} a={T.panelsAt} b={T.alterType[0] - 0.3} ar="الفارق الحقيقي" en="Amateur vs Enterprise Databases" y={105} color={C.db} />

      {/* two companies */}
      <g opacity={k} transform={`translate(0 ${(1 - k) * 24})`}>
        <Card x={90} y={190} w={840} h={380} stroke={C.accent} glow={0.3} r={24} />
        <AR x={510} y={248} size={36} weight={900} fill="#FCA5A5">بدون قيود</AR>
        <EN x={510} y={284} size={22} fill={C.muted}>no constraints</EN>
        <EN x={130} y={346} size={26} anchor="start" fill={C.accent}>⚠ polluted data</EN>
        <EN x={130} y={392} size={26} anchor="start" fill={C.accent}>⚠ unstable financial reports</EN>
        <g opacity={p(t, T.hoursAt, 0.5)}>
          <rect x={560} y={320} width={330} height={120} rx={20} fill={C.accent} opacity={0.15} stroke={C.accent} strokeWidth={3} />
          <EN x={725} y={392} size={56} fill="#FCA5A5" weight={600}>{`${hours} h`}</EN>
          <EN x={725} y={424} size={18} fill={C.muted}>spent cleaning data</EN>
        </g>
        <Bars x={140} y={540} vals={[110, 70, 130, 60, 100]} color={C.accent} t={t} wob={1} k={rep} />

        <Card x={990} y={190} w={840} h={380} stroke={C.db} glow={0.3} r={24} />
        <AR x={1410} y={248} size={36} weight={900} fill={C.db}>منظومة</AR>
        <EN x={1410} y={284} size={22} fill={C.muted}>built-in constraints</EN>
        <EN x={1030} y={346} size={26} anchor="start" fill={C.db}>✓ 0% data pollution</EN>
        <EN x={1030} y={392} size={26} anchor="start" fill={C.db}>⚡ fast queries</EN>
        <g opacity={p(t, T.integrityAt, 0.5)}>
          <circle cx={1700} cy={390} r={62} fill="none" stroke={C.line} strokeWidth={12} />
          <circle cx={1700} cy={390} r={62} fill="none" stroke={C.db} strokeWidth={12} strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 62 * integ} 999`} transform="rotate(-90 1700 390)" />
          <EN x={1700} y={402} size={32} fill={C.db} weight={600}>{`${Math.round(100 * integ)}%`}</EN>
        </g>
        <Bars x={1040} y={540} vals={[110, 112, 108, 111, 109]} color={C.db} t={t} wob={0} k={rep} />
      </g>

      {/* ALTER TABLE code */}
      <Reveal t={t} at={T.alterType[0] - 0.4} dy={20}>
        <Card x={90} y={610} w={1400} h={150} stroke={C.client} glow={0.4} r={24} />
        <circle cx={130} cy={642} r={7} fill={C.accent} />
        <circle cx={156} cy={642} r={7} fill={C.opt} />
        <circle cx={182} cy={642} r={7} fill={C.db} />
        <text x={130} y={716} fontFamily={FONT_MONO} fontSize={27} fontWeight={600} direction="ltr">
          {(() => {
            let left = typed;
            const toks: [string, string][] = [['ALTER TABLE ', C.accent], ['products ', C.client], ['ADD CONSTRAINT ', C.accent], ['chk_stock ', C.text], ['CHECK ', C.opt], ['(stock_quantity >= 0);', C.text]];
            return toks.map(([x, c], i) => {
              const n = Math.max(0, Math.min(x.length, left));
              left -= n;
              return <tspan key={i} fill={c} xmlSpace="preserve">{x.slice(0, n)}</tspan>;
            });
          })()}
        </text>
        <g opacity={applied}>
          <rect x={1170} y={632} width={300} height={44} rx={22} fill={C.db} opacity={0.18} stroke={C.db} strokeWidth={3} />
          <EN x={1320} y={662} size={20} fill={C.db} weight={600}>✓ applied to existing table</EN>
        </g>
      </Reveal>

      {/* engine memory */}
      <g opacity={eng} transform={`translate(0 ${(1 - eng) * 14})`}>
        <rect x={90} y={800} width={1400} height={84} rx={42} fill={C.client} opacity={0.12} stroke={C.client} strokeWidth={3} />
        <AR x={1440} y={852} size={30} anchor="start" fill={C.client}>حماية الذاكرة من السجلات الخاطئة</AR>
        <EN x={680} y={850} size={24} fill={C.client} weight={600}>bad rows rejected before RAM</EN>
      </g>

      {/* structural approval seal */}
      <g opacity={Math.min(1, stamp * 1.5)} transform={`translate(1630 745) rotate(-10) scale(${0.5 + 0.5 * stamp})`}>
        <circle r={118} fill={C.db} opacity={0.12} />
        <circle r={110} fill="none" stroke={C.db} strokeWidth={7} />
        <circle r={96} fill="none" stroke={C.db} strokeWidth={2} />
        <path d="M -38 -4 L -10 26 L 42 -38" fill="none" stroke={C.db} strokeWidth={13} strokeLinecap="round" strokeLinejoin="round" />
        <EN x={0} y={62} size={19} fill={C.db} weight={600}>STRUCTURAL</EN>
        <EN x={0} y={86} size={19} fill={C.db} weight={600}>APPROVAL</EN>
      </g>

      {/* captions */}
      <g opacity={win(t, T.cap1[0], T.cap1[1], 0.4)}>
        <EN x={960} y={990} size={30} fill={C.client} weight={600}>ALTER TABLE ... ADD CONSTRAINT</EN>
      </g>
      <g opacity={win(t, T.cap2[0], T.cap2[1], 0.4)}>
        <Arrowed y={990} left="Zero Data Pollution" right="100% Trusted Financial Reporting" leftColor={C.db} rightColor={C.text} size={34} />
      </g>
    </g>
  );
};
