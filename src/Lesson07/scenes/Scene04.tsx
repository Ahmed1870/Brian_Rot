import React from 'react';
import { spring, useVideoConfig } from 'remotion';
import { C, FONT_MONO } from '../../theme';
import { AR, EN, Reveal, Card, Header, Arrowed, MiniTable, LockIcon } from '../../components/common';
import type { Col } from '../../components/common';
import { p, lin, win, bump, keys } from '../../anim';
import tl from '../../timeline.json';

const T = tl.s4;
const GOLD = '#FBBF24';
const PCOLS: Col[] = [
  { k: 'name', w: 200, ar: true },
  { k: 'cost_price', w: 210, color: C.opt },
  { k: 'unit_price', w: 210, color: C.db },
];
const OCOLS: Col[] = [
  { k: 'order_id', w: 170 },
  { k: 'customer_id', w: 220 },
  { k: 'status', w: 260, color: C.db },
  { k: 'created_at', w: 480, color: C.client },
];

const Lane: React.FC<{ y: number; label: string; sub: string; color: string; on: number }> = ({ y, label, sub, color, on }) => (
  <g>
    <rect x={130} y={y} width={780} height={92} rx={20} fill={color} opacity={0.08 + 0.2 * on} stroke={color} strokeWidth={3 + 3 * on} />
    <circle cx={190} cy={y + 46} r={22} fill={color} opacity={0.3 + 0.7 * on} />
    <EN x={290} y={y + 56} size={34} anchor="start" fill={color} weight={600}>{label}</EN>
    <EN x={880} y={y + 54} size={24} anchor="end" fill={on > 0.5 ? color : C.muted}>{sub}</EN>
  </g>
);

export const Scene04: React.FC<{ t: number }> = ({ t }) => {
  const { fps } = useVideoConfig();
  const edge = win(t, T.headAt, T.defaultAt - 0.2, 0.4);
  const truth = p(t, T.truthAt, 0.7);
  const nul = p(t, T.nullAt, 0.6);
  const unk = p(t, T.unknownAt, 0.5);
  const pass = p(t, T.passAt, 0.6);
  const rule = p(t, T.ruleAt, 0.7) * (1 - lin(t, T.ruleEnd, 0.5));
  const fixed = p(t, T.ruleAt + 1.5, 0.6);
  const rej = p(t, T.ruleAt + 2.8, 0.5);
  const lanes = { t: unk < 0.1 ? 1 : 0, f: 0, u: unk };
  const tok = keys(t, [T.nullAt + 0.3, T.unknownAt, T.unknownAt + 0.8, T.passAt], [0, 0, 1, 2]);
  const tokY = 416 + 218 * Math.min(1, tok);
  const pulse = 0.5 + 0.5 * Math.sin(t * 8);

  const def = p(t, T.defaultAt, 0.7);
  const stSp = spring({ frame: Math.round((t - T.statusAt) * fps), fps, config: { stiffness: 140 } });
  const st = t >= T.statusAt ? stSp : 0;
  const clk = p(t, T.clockAt, 0.5);
  const ms = String(Math.floor((t * 1000) % 1000)).padStart(3, '0');
  const sec = String(7 + Math.floor(t - T.clockAt) % 50).padStart(2, '0');

  return (
    <g>
      <Header t={t} a={T.headAt} b={T.truthAt + 0.2} ar="حالة حدية خطيرة" en="Dangerous Edge Case in CHECK" y={105} color={C.opt} />

      {/* ===== edge case: TRUE / FALSE / UNKNOWN ===== */}
      <g opacity={edge}>
        <Reveal t={t} at={T.truthAt - 0.4} dy={16}>
          <Card x={90} y={190} w={1740} h={100} stroke={C.client} r={22} />
          <text x={130} y={254} fontFamily={FONT_MONO} fontSize={34} fontWeight={600} direction="ltr">
            <tspan fill={C.text}>cost_price NUMERIC </tspan>
            <tspan fill={C.client}>{fixed > 0.5 ? 'NOT NULL ' : ''}</tspan>
            <tspan fill={C.opt}>CHECK (cost_price &lt; unit_price)</tspan>
          </text>
        </Reveal>

        <g opacity={truth} transform={`translate(0 ${(1 - truth) * 20})`}>
          <Card x={90} y={330} w={860} h={500} stroke={C.line} r={24} />
          <Lane y={370} label="TRUE" sub="✓ passes" color={C.db} on={lanes.t * truth} />
          <Lane y={482} label="FALSE" sub="✗ rejected" color={C.accent} on={0} />
          <Lane y={594} label="UNKNOWN" sub="✓ passes!" color={C.opt} on={unk * (0.6 + 0.4 * pulse)} />
          <EN x={520} y={780} size={24} fill={C.muted}>NULL &lt; 500  →  UNKNOWN</EN>
        </g>
        {nul > 0 && t < T.ruleAt + 3 && (
          <g opacity={nul}>
            <circle cx={150} cy={tokY + 6 + (tok > 1 ? 0 : 0)} r={14} fill={C.opt} />
          </g>
        )}

        {/* products table receives the NULL row */}
        <g opacity={truth} transform={`translate(0 ${(1 - truth) * 20})`}>
          <Card x={990} y={330} w={840} h={500} stroke={C.line} r={24} />
          <EN x={1020} y={376} size={24} anchor="start" fill={C.opt} weight={600}>products</EN>
          <MiniTable x={1020} y={394} cols={PCOLS} rows={[['لابتوب', '900', '1,250'], ['شاشة', '260', '380'], ['سلك USB', 'NULL', '40']]} rowH={64} hdrH={54} fs={24}
            rowStyle={(i) => (i === 2 ? { opacity: nul, dx: (1 - nul) * 40, fill: pass > 0.5 && rej < 0.2 ? '#3A3220' : rej > 0.2 ? '#3A2030' : undefined, stroke: rej > 0.2 ? C.accent : pass > 0.5 ? C.opt : undefined, txt: rej > 0.2 ? '#FCA5A5' : pass > 0.5 ? '#FCD34D' : undefined } : {})} />
          <g opacity={pass * (1 - rej)}>
            <rect x={1020} y={394 + 54 + 3 * 64 + 8} width={780} height={50} rx={25} fill={C.opt} opacity={0.15} stroke={C.opt} strokeWidth={3} />
            <EN x={1410} y={394 + 54 + 3 * 64 + 42} size={22} fill={C.opt} weight={600}>⚠ inserted — NULL slipped through</EN>
          </g>
          <g opacity={rej}>
            <rect x={1020} y={394 + 54 + 3 * 64 + 8} width={780} height={50} rx={25} fill={C.accent} opacity={0.15} stroke={C.accent} strokeWidth={3} />
            <EN x={1410} y={394 + 54 + 3 * 64 + 42} size={22} fill="#FCA5A5" weight={600}>✗ rejected by NOT NULL</EN>
          </g>
          <g opacity={fixed}><LockIcon x={1400} y={420} s={0.45} color={C.client} /></g>
        </g>

        {/* golden rule */}
        <g opacity={rule} transform={`translate(0 ${(1 - rule) * 16})`}>
          <rect x={430} y={846} width={1060} height={84} rx={42} fill={GOLD} opacity={0.15} stroke={GOLD} strokeWidth={4} />
          <AR x={1440} y={902} size={32} anchor="start" fill={GOLD}>القاعدة الذهبية</AR>
          <EN x={880} y={899} size={30} fill={GOLD} weight={600}>Combine NOT NULL + CHECK!</EN>
        </g>
      </g>

      {/* ===== DEFAULT values ===== */}
      <g opacity={def} transform={`translate(0 ${(1 - def) * 20})`}>
        <Header t={t} a={T.defaultAt} b={T.defaultAt + 2.2} ar="القيم الافتراضية" en="DEFAULT Values" y={105} color={C.db} />
        <Card x={90} y={190} w={1740} h={190} stroke={C.client} glow={0.4} r={24} />
        <text x={130} y={262} fontFamily={FONT_MONO} fontSize={34} fontWeight={600} direction="ltr"><tspan fill={C.accent}>INSERT INTO </tspan><tspan fill={C.client}>orders </tspan><tspan fill={C.text}>(customer_id)</tspan></text>
        <text x={130} y={324} fontFamily={FONT_MONO} fontSize={34} fontWeight={600} direction="ltr"><tspan fill={C.accent}>VALUES </tspan><tspan fill={C.text}>(</tspan><tspan fill={C.opt}>3</tspan><tspan fill={C.text}>);</tspan></text>
        <EN x={1790} y={270} size={22} anchor="end" fill={C.muted}>status &amp; created_at omitted</EN>

        <Card x={90} y={420} w={1740} h={280} stroke={C.line} r={24} />
        <MiniTable x={120} y={444} cols={OCOLS} rows={[['9001', '1', 'Shipped', '2026-10-31 18:02:11.204'], ['9002', '3', '', '']]} rowH={72} hdrH={56} fs={26} />
        {/* auto-filled cells */}
        <rect x={120 + 170 + 220 + 4} y={444 + 56 + 72 + 6} width={252} height={58} rx={12} fill="none" stroke={C.db} strokeWidth={3} strokeDasharray="8 8" opacity={1 - st} />
        <g opacity={Math.min(1, st * 1.5)} transform={`translate(0 ${(1 - st) * -14})`}>
          <rect x={120 + 170 + 220 + 4} y={444 + 56 + 72 + 6} width={252} height={58} rx={12} fill={C.db} opacity={0.2} stroke={C.db} strokeWidth={3} />
          <EN x={120 + 170 + 220 + 130} y={444 + 56 + 72 + 44} size={28} fill={C.db} weight={600}>Pending</EN>
        </g>
        <rect x={120 + 170 + 220 + 260 + 4} y={444 + 56 + 72 + 6} width={472} height={58} rx={12} fill="none" stroke={C.client} strokeWidth={3} strokeDasharray="8 8" opacity={1 - clk} />
        <g opacity={clk}>
          <rect x={120 + 170 + 220 + 260 + 4} y={444 + 56 + 72 + 6} width={472} height={58} rx={12} fill={C.client} opacity={0.18} stroke={C.client} strokeWidth={3} />
          <EN x={120 + 170 + 220 + 260 + 240} y={444 + 56 + 72 + 44} size={26} fill={C.client} weight={600}>{`2026-11-02 14:32:${sec}.${ms}`}</EN>
        </g>
        {/* mini clock */}
        <g opacity={clk} transform="translate(1730 560)">
          <circle r={34} fill={C.cardDeep} stroke={C.client} strokeWidth={4} />
          <path d="M 0 0 V -22" stroke={C.text} strokeWidth={4} strokeLinecap="round" transform={`rotate(${t * 40})`} />
          <path d="M 0 0 V -26" stroke={C.client} strokeWidth={3} strokeLinecap="round" transform={`rotate(${t * 360})`} />
        </g>

        {/* DDL definitions */}
        <Card x={90} y={740} w={1740} h={150} stroke={C.line} r={24} />
        <text x={130} y={806} fontFamily={FONT_MONO} fontSize={30} fontWeight={600} direction="ltr"><tspan fill={C.text}>status VARCHAR(20) </tspan><tspan fill={C.db}>DEFAULT 'Pending'</tspan></text>
        <text x={130} y={860} fontFamily={FONT_MONO} fontSize={30} fontWeight={600} direction="ltr"><tspan fill={C.text}>created_at TIMESTAMPTZ </tspan><tspan fill={C.client}>DEFAULT CURRENT_TIMESTAMP</tspan></text>
        <EN x={1790} y={806} size={22} anchor="end" fill={C.db}>static default</EN>
        <EN x={1790} y={860} size={22} anchor="end" fill={C.client}>live server function</EN>
      </g>

      {/* captions */}
      <g opacity={win(t, T.capEdge[0], T.capEdge[1], 0.4)}>
        <Arrowed y={990} left="Edge Case" right="CHECK Passes if Expression is TRUE or UNKNOWN!" leftColor={C.opt} rightColor={C.text} size={28} />
      </g>
      <g opacity={win(t, T.capDef1[0], T.capDef1[1], 0.3)}>
        <Arrowed y={990} left="status VARCHAR(20) DEFAULT 'Pending'" right="Static Default" leftColor={C.db} rightColor={C.text} size={32} />
      </g>
      <g opacity={win(t, T.capDef2[0], T.capDef2[1], 0.3)}>
        <Arrowed y={990} left="created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP" right="Dynamic Function" leftColor={C.client} rightColor={C.text} size={28} />
      </g>
    </g>
  );
};
