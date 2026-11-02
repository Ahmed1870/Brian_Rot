import React from 'react';
import { C } from '../../theme';
import { AR, EN, Reveal, Card, Header, Arrowed, MiniTable, KeyIcon } from '../../components/common';
import type { Col } from '../../components/common';
import { p, lin, win, keys } from '../../anim';
import tl from '../../timeline.json';

const T = tl.s3;
const CUST_COLS: Col[] = [
  { k: 'customer_id', w: 270, color: C.db, badge: { t: 'PK', c: C.db } },
  { k: 'name', w: 300, ar: true },
];
const ORD_COLS: Col[] = [
  { k: 'customer_id', w: 290, color: C.opt, badge: { t: 'FK', c: C.opt } },
  { k: 'order_id', w: 200 },
  { k: 'amount', w: 220 },
];
const CUST = [['1', 'أحمد محمود'], ['2', 'سارة علي'], ['3', 'خالد حسن']];
const ORD = [['1', '5001', '420'], ['2', '5002', '180'], ['2', '5003', '95'], ['3', '5004', '310']];
const CX = 110, OX = 1110, TY = 330, HDR = 60, RH = 70;
const cy = (r: number) => TY + HDR + r * RH + (RH - 8) / 2;
const LINKS: [number, number][] = [[0, 0], [1, 1], [1, 2], [2, 3]];

export const Scene03: React.FC<{ t: number }> = ({ t }) => {
  const k = p(t, T.tablesAt, 0.9);
  const colFK = p(t, T.colAt, 0.6);
  const colPK = p(t, T.bridgeAt, 0.6);
  const draw = lin(t, T.bridgeAt, 3.5);
  const one = p(t, T.oneToN, 0.7);
  const cap2 = p(t, T.cap2[0], 0.6);
  const chk = lin(t, T.checkAt, 5);
  const newRow = p(t, T.checkAt + 3.2, 0.6);
  const pulseK = (t * 0.5) % 1;

  // chip flying through the gate
  const chipX = keys(t, [T.checkAt, T.checkAt + 1.4, T.checkAt + 2.2, T.checkAt + 3.4], [1610, 1010, 895, 1110]);
  const chipOn = t >= T.checkAt && t < T.checkAt + 3.4;
  const gateGlow = p(t, T.checkAt + 1.2, 0.5) * (1 - lin(t, T.checkAt + 3.6, 0.6));
  const check = p(t, T.checkAt + 1.9, 0.4);

  return (
    <g>
      <Header t={t} a={T.intro[0]} b={T.intro[1]} ar="الجسر المرجعي" en="Foreign Key" y={100} color={C.opt} />

      {/* customers (parent) */}
      <g opacity={k} transform={`translate(0 ${(1 - k) * 24})`}>
        <Card x={CX - 30} y={TY - 90} w={640} h={520} stroke={C.db} glow={0.4 + 0.6 * colPK} r={24} />
        <EN x={CX} y={TY - 40} size={30} anchor="start" fill={C.db} weight={600}>customers</EN>
        <MiniTable x={CX} y={TY} cols={CUST_COLS} rows={CUST} rowH={RH} hdrH={HDR} rowStyle={() => ({ stroke: colPK > 0.3 ? C.db : undefined })} />
        <g opacity={one}>
          <rect x={CX + 110} y={TY + 440 - 60} width={300} height={46} rx={23} fill={C.db} opacity={0.18} stroke={C.db} strokeWidth={2} />
          <EN x={CX + 260} y={TY + 440 - 29} size={22} fill={C.db} weight={600}>PARENT · 1</EN>
        </g>
      </g>

      {/* orders (child) */}
      <g opacity={k} transform={`translate(0 ${(1 - k) * 24})`}>
        <Card x={OX - 30} y={TY - 90} w={770} h={520} stroke={C.opt} glow={0.4 + 0.6 * colFK} r={24} />
        <EN x={OX} y={TY - 40} size={30} anchor="start" fill={C.opt} weight={600}>orders</EN>
        <MiniTable
          x={OX}
          y={TY}
          cols={ORD_COLS}
          rows={[...ORD, ['3', '5005', '120']]}
          rowH={RH}
          hdrH={HDR}
          rowStyle={(i) => (i === 4 ? { opacity: newRow, dx: (1 - newRow) * 30, fill: '#143B31', stroke: C.db } : { stroke: colFK > 0.3 ? C.opt : undefined })}
        />
        <g opacity={one}>
          <rect x={OX + 220} y={TY + 440 - 60} width={300} height={46} rx={23} fill={C.opt} opacity={0.18} stroke={C.opt} strokeWidth={2} />
          <EN x={OX + 370} y={TY + 440 - 29} size={22} fill={C.opt} weight={600}>CHILD · N</EN>
        </g>
      </g>

      {/* bridge: luminous dashed fan from PK cells to FK cells */}
      {LINKS.map(([a, b], i) => {
        const x1 = CX + 570 + 4, x2 = OX - 6;
        const d = `M ${x1} ${cy(a)} C ${x1 + 160} ${cy(a)} ${x2 - 160} ${cy(b)} ${x2} ${cy(b)}`;
        return (
          <g key={i}>
            <path d={d} stroke={C.client} strokeWidth={12} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} opacity={0.14} strokeLinecap="round" />
            <path d={d} stroke={C.client} strokeWidth={5} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} strokeLinecap="round" />
            {draw >= 1 && (
              <circle cx={x1 + (x2 - x1) * ((pulseK + i * 0.2) % 1)} cy={cy(a) + (cy(b) - cy(a)) * (((pulseK + i * 0.2) % 1) ** 2 * (3 - 2 * ((pulseK + i * 0.2) % 1)))} r={8} fill={C.text} opacity={0.9} />
            )}
          </g>
        );
      })}

      {/* 1:N indicator */}
      <g opacity={one} transform={`translate(895 ${TY - 20}) scale(${0.7 + 0.3 * one})`}>
        <circle r={58} fill={C.cardDeep} stroke={C.client} strokeWidth={5} />
        <circle r={72} fill="none" stroke={C.client} strokeWidth={3} opacity={0.4 + 0.3 * Math.sin(t * 4)} />
        <EN x={0} y={13} size={38} fill={C.client} weight={600}>1:N</EN>
      </g>
      <Reveal t={t} at={T.oneToN + 0.4} until={T.cap2[0] + 0.2} dy={10}>
        <AR x={895} y={216} size={26} fill={C.client}>واحد إلى متعدد</AR>
      </Reveal>

      {/* validation gate */}
      {t >= T.checkAt - 0.4 && (
        <g opacity={win(t, T.checkAt - 0.4, T.checkAt + 4.2, 0.4)}>
          <g transform={`translate(895 ${TY + 400})`}>
            <path d="M 0 -52 L 56 0 L 0 52 L -56 0 Z" fill={C.db} fillOpacity={0.14 + 0.3 * gateGlow} stroke={C.db} strokeWidth={5} />
            <EN x={0} y={8} size={18} fill={C.db} weight={600}>EXISTS?</EN>
            <path d="M -18 4 L -4 20 L 22 -14" fill="none" stroke={C.db} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - check} opacity={check} />
          </g>
          {chipOn && (
            <g transform={`translate(${chipX - 110} ${TY + 376})`}>
              <rect width={220} height={46} rx={23} fill={C.opt} opacity={0.25} stroke={C.opt} strokeWidth={3} />
              <EN x={110} y={31} size={20} fill={C.opt} weight={600}>INSERT cust_id=3</EN>
            </g>
          )}
        </g>
      )}
      <Reveal t={t} at={T.checkAt + 3.4} until={T.cap2[1]} dy={12}>
        <AR x={960} y={900} size={30} fill={C.db}>تحقق لحظي قبل تسجيل أي صف جديد</AR>
      </Reveal>

      {/* captions */}
      <g opacity={win(t, T.cap1[0], T.cap1[1], 0.4)}>
        <EN x={299} y={985} size={30} anchor="start" fill={C.db} weight={600}>customers(customer_id PK)</EN>
        <path d="M 763 973 H 865" stroke={C.client} strokeWidth={5} strokeLinecap="round" />
        <path d="M 781 957 L 751 973 L 781 989 Z" fill={C.client} />
        <EN x={879} y={985} size={30} anchor="start" fill={C.client} weight={600}>[1:N Bridge]</EN>
        <path d="M 1109 973 H 1211" stroke={C.client} strokeWidth={5} strokeLinecap="round" />
        <EN x={1225} y={985} size={30} anchor="start" fill={C.opt} weight={600}>orders(customer_id FK)</EN>
      </g>
      <g opacity={win(t, T.cap2[0], T.cap2[1], 0.4)}>
        <Arrowed y={985} left="Referential Integrity" right="Parent-Child Structural Constraint" leftColor={C.client} rightColor={C.text} size={32} />
      </g>
    </g>
  );
};
