import React from 'react';
import { C, FONT_MONO } from '../../theme';
import { AR, EN, Reveal, Card, Header, Arrowed, ArrowedAR, MiniTable, ShieldIcon } from '../../components/common';
import type { Col } from '../../components/common';
import { p, lin, win, bump, keys } from '../../anim';
import tl from '../../timeline.json';

const T = tl.s1;
const PCOLS: Col[] = [
  { k: 'id', w: 100 },
  { k: 'name', w: 280, ar: true },
  { k: 'unit_price', w: 260, color: C.opt },
  { k: 'discount', w: 260, color: C.opt },
];
const CCOLS: Col[] = [
  { k: 'id', w: 70 },
  { k: 'name', w: 200, ar: true },
  { k: 'email', w: 270, color: C.client },
  { k: 'phone', w: 220, color: C.client },
];
const PROD = [['1', 'لابتوب', '1,250', '10%'], ['2', 'شاشة', '380', '5%'], ['3', 'ميكروباص', '-500', '150%']];
const CUST = [['1', 'أحمد محمود', 'ahmed@mail.com', '0100000001'], ['2', 'سارة علي', 'sara@mail.com', '0111234567'], ['3', 'خالد حسن', 'NULL', 'NULL']];
const PX = 100, CX = 1070, TY = 250;

export const Scene01: React.FC<{ t: number }> = ({ t }) => {
  const k = p(t, T.tablesAt, 0.9);
  const neg = p(t, T.negAt, 0.5), disc = p(t, T.discAt, 0.5), cust = p(t, T.custAt, 0.5);
  const pulse = 0.5 + 0.5 * Math.sin(t * 8);
  const app = p(t, T.appAt, 0.7);
  const byp = lin(t, T.bypassAt, T.hitAt - T.bypassAt);
  const hitBump = bump(t, T.hitAt, 0.8);
  const shield = p(t, T.shieldAt, 0.8);
  const blk = lin(t, T.blockAt - 1.4, 1.4); // second payload rises to the shield
  const bounce = lin(t, T.blockAt, 1.2);
  const ddl = p(t, T.ddlAt, 0.8);
  const shake = t >= T.blockAt && t < T.blockAt + 1.4 ? Math.sin(t * 60) * 8 * (1 - lin(t, T.blockAt, 1.4)) : 0;

  const payY = blk < 1 ? 780 - 190 * blk : 590 + 190 * (bounce * bounce) ;
  const payOn = t >= T.blockAt - 1.4 && t < T.blockAt + 1.3;

  return (
    <g>
      <Header t={t} a={T.head[0]} b={T.head[1]} ar="بيانات ملوثة" en="Polluted Data" y={105} color={C.accent} />

      {/* products */}
      <g opacity={k} transform={`translate(0 ${(1 - k) * 24})`}>
        <Card x={PX - 30} y={190} w={960} h={360} stroke={C.line} glow={0.3} r={24} />
        <EN x={PX} y={238} size={26} anchor="start" fill={C.opt} weight={600}>products</EN>
        <MiniTable x={PX} y={256} cols={PCOLS} rows={PROD} rowH={62} hdrH={54} fs={24}
          rowStyle={(i) => {
            if (i < 2) return {};
            const a = Math.max(neg, 0);
            return { fill: a > 0 ? '#3A2030' : undefined, stroke: a > 0 ? C.accent : undefined, opacity: neg, dx: (1 - neg) * 40 + (t < T.negAt + 8 ? Math.sin(t * 38) * 3 * neg : 0), txt: '#FCA5A5' };
          }} />
        {/* highlight the negative price / discount cells */}
        <rect x={PX + 380 + 12} y={256 + 54 + 2 * 62 + 6} width={236} height={44} rx={10} fill={C.accent} opacity={0.35 * neg * (0.7 + 0.3 * pulse)} />
        <rect x={PX + 640 + 12} y={256 + 54 + 2 * 62 + 6} width={236} height={44} rx={10} fill={C.accent} opacity={0.35 * disc * (0.7 + 0.3 * pulse)} />
        <g opacity={neg}><EN x={PX + 510} y={256 + 54 + 3 * 62 + 28} size={18} fill={C.accent}>unit_price = -500</EN></g>
        <g opacity={disc}><EN x={PX + 770} y={256 + 54 + 3 * 62 + 28} size={18} fill={C.accent}>discount = 150%</EN></g>
      </g>

      {/* customers */}
      <g opacity={k} transform={`translate(0 ${(1 - k) * 24})`}>
        <Card x={CX - 20} y={190} w={800} h={360} stroke={C.line} glow={0.3} r={24} />
        <EN x={CX} y={238} size={26} anchor="start" fill={C.client} weight={600}>customers</EN>
        <MiniTable x={CX} y={256} cols={CCOLS} rows={CUST} rowH={62} hdrH={54} fs={22}
          rowStyle={(i) => (i === 2 ? { fill: '#3A2030', stroke: C.accent, opacity: cust, dx: (1 - cust) * 40, txt: '#FCA5A5' } : {})} />
      </g>

      {/* consequence chips */}
      {[
        { at: T.chips[0], ar: 'تعطيل التحليل المالي', x: 560 },
        { at: T.chips[1], ar: 'تدمير ثقة الإدارة في التقارير', x: 1240 },
      ].map((c, i) => {
        const kk = p(t, c.at, 0.5) * (1 - lin(t, T.appAt - 0.3, 0.4));
        return (
          <g key={i} opacity={kk} transform={`translate(0 ${(1 - kk) * 14})`}>
            <rect x={c.x - 260} y={650} width={520} height={78} rx={39} fill={C.accent} opacity={0.15} stroke={C.accent} strokeWidth={3} />
            <AR x={c.x} y={702} size={34} fill="#FCA5A5">{c.ar}</AR>
          </g>
        );
      })}

      {/* front-end app (validated) + data-merge script (bypass) */}
      <g opacity={app}>
        <Card x={90} y={640} w={420} h={250} stroke={C.db} r={22} />
        <AR x={300} y={690} size={30} fill={C.db}>تطبيق الفرونت إند</AR>
        <EN x={300} y={728} size={20} fill={C.muted}>front-end validation</EN>
        {['price > 0 ✓', 'email ✓'].map((s, i) => <EN key={s} x={300} y={786 + i * 44} size={24} fill={C.db} weight={600}>{s}</EN>)}
        <Card x={580} y={640} w={500} h={250} stroke={C.accent} r={22} />
        <AR x={830} y={690} size={30} fill={C.accent}>سكريبت دمج البيانات</AR>
        <text x={620} y={770} fontFamily={FONT_MONO} fontSize={22} fontWeight={600} direction="ltr" fill={C.muted}>INSERT INTO products</text>
        <text x={620} y={806} fontFamily={FONT_MONO} fontSize={22} fontWeight={600} direction="ltr" fill="#FCA5A5">VALUES (.., -500, 150)</text>
        {/* bypass route skipping the app */}
        <path d="M 830 640 V 590 H 1000 V 560" stroke={C.accent} strokeWidth={4} strokeDasharray="10 10" strokeDashoffset={-t * 70} fill="none" opacity={0.5 * (1 - shield)} />
        <path d="M 510 765 C 540 765 550 765 580 765" stroke={C.line} strokeWidth={4} />
        <path d="M 540 750 L 566 765 L 540 780" stroke={C.line} strokeWidth={4} fill="none" />
      </g>
      {byp > 0 && byp < 1 && (() => {
        const pts = keys(byp, [0, 0.35, 0.8, 1], [0, 1, 2, 3]);
        const seg = [[830, 640], [830, 590], [1000, 590], [1000, 540]];
        const i = Math.min(2, Math.floor(pts));
        const f = pts - i;
        const x = seg[i][0] + (seg[i + 1][0] - seg[i][0]) * f, y = seg[i][1] + (seg[i + 1][1] - seg[i][1]) * f;
        return (
          <g>
            <circle cx={x} cy={y} r={24} fill={C.accent} opacity={0.25} />
            <circle cx={x} cy={y} r={12} fill={C.accent} />
          </g>
        );
      })()}
      <g opacity={hitBump}>
        <rect x={PX} y={190} width={900} height={360} rx={24} fill={C.accent} opacity={0.12} />
      </g>

      {/* engine shield band */}
      <g opacity={shield} transform={`translate(0 ${(1 - shield) * -40})`}>
        <rect x={90} y={572} width={1740} height={8} rx={4} fill={C.opt} opacity={0.9} />
        <rect x={90} y={564} width={1740} height={24} rx={12} fill={C.opt} opacity={0.15} />
        <g transform="translate(960 576)">
          <ShieldIcon x={0} y={0} s={0.42} color={C.opt} fillOp={0.35} />
        </g>
      </g>
      {/* first line of defense card */}
      <g opacity={shield} transform={`translate(0 ${(1 - shield) * 20})`}>
        <Card x={1170} y={640} w={660} h={250} stroke={C.opt} glow={0.6} r={22} />
        <ShieldIcon x={1290} y={765} s={0.75} color={C.opt} fillOp={0.3} />
        <AR x={1760} y={730} size={36} anchor="start" fill={C.opt}>خط الدفاع الأول</AR>
        <EN x={1700} y={776} size={24} anchor="end" fill={C.text} weight={600}>First line of defense</EN>
        <EN x={1700} y={820} size={20} anchor="end" fill={C.muted}>enforced inside PostgreSQL</EN>
      </g>

      {/* second payload bounced by the shield */}
      {payOn && (
        <g transform={`translate(${shake} 0)`}>
          <circle cx={830} cy={payY} r={26} fill={C.accent} opacity={0.25} />
          <circle cx={830} cy={payY} r={13} fill={C.accent} />
        </g>
      )}
      <g opacity={p(t, T.blockAt, 0.2) * (1 - lin(t, T.ddlAt, 0.5))} transform={`translate(830 ${520}) rotate(-5) translate(${shake} 0)`}>
        <rect x={-130} y={-28} width={260} height={56} rx={14} fill={C.bg} stroke={C.accent} strokeWidth={5} />
        <EN x={0} y={11} size={28} fill={C.accent} weight={600}>REJECTED</EN>
      </g>

      {/* DDL chips replace the shield */}
      {[
        { x: 610, t: 'CHECK (unit_price > 0)', c: C.opt },
        { x: 880, t: 'CHECK (discount <= 100)', c: C.opt },
        { x: 1480, t: 'NOT NULL', c: C.client },
        { x: 1690, t: 'NOT NULL', c: C.client },
      ].map((c, i) => {
        const kk = p(t, T.ddlAt + i * 0.25, 0.5);
        return (
          <g key={i} opacity={kk} transform={`translate(0 ${(1 - kk) * -12})`}>
            <rect x={c.x - (c.t.length > 12 ? 125 : 80)} y={576} width={c.t.length > 12 ? 250 : 160} height={40} rx={20} fill={C.bg} stroke={c.c} strokeWidth={3} />
            <EN x={c.x} y={603} size={c.t.length > 12 ? 17 : 20} fill={c.c} weight={600}>{c.t}</EN>
          </g>
        );
      })}

      {/* captions */}
      <g opacity={win(t, T.cap1[0], T.cap1[1], 0.4)}>
        <ArrowedAR y={985} first="تجاوز الفلترة الخارجية" second="خطر تلوث البيانات" firstColor={C.accent} secondColor="#FCA5A5" size={40} />
      </g>
      <g opacity={win(t, T.cap2[0], T.cap2[1], 0.4)}>
        <Arrowed y={985} left="Database Constraints" right="Engine-Level Single Source of Truth" leftColor={C.opt} rightColor={C.text} size={34} />
      </g>
    </g>
  );
};
