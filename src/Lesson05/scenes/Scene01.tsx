import React from 'react';
import { C } from '../../theme';
import { AR, EN, Reveal, Card, Header, Arrowed } from '../../components/common';
import { p, lin, win, bump } from '../../anim';
import tl from '../../timeline.json';

const T = tl.s1;
const CITIES = [
  { n: 'London', ar: 'لندن', off: 'UTC+0', x: 330, y: 372, rec: '08:00:00', at: T.cities[0] },
  { n: 'Cairo', ar: 'القاهرة', off: 'UTC+2', x: 584, y: 528, rec: '10:00:00', at: T.cities[1] },
  { n: 'Dubai', ar: 'دبي', off: 'UTC+4', x: 781, y: 566, rec: '12:00:00', at: T.cities[2] },
];
const BANDS = [330, 576, 822];
const SRV = { x: 1170, y: 250, w: 660, h: 520 };

export const Scene01: React.FC<{ t: number }> = ({ t }) => {
  const mapK = p(t, T.mapAt, 0.9);
  const fire = lin(t, T.fireAt, 2.2); // pulse travel 0..1
  const shake = t >= T.scrambleAt && t < T.scrambleAt + 2 ? Math.sin(t * 70) * 8 * (1 - lin(t, T.scrambleAt, 2)) : 0;
  const bad = p(t, T.scrambleAt, 0.5);
  const pulse = 0.5 + 0.5 * Math.sin(t * 7);

  return (
    <g>
      <Header t={t} a={T.header[0]} b={T.header[1]} ar="كارثة التوقيت المحلي" en="Local Time Trap" color={C.accent} />

      {/* flat 2D map with timezone bands */}
      <g opacity={mapK}>
        <Card x={70} y={250} w={1020} h={520} stroke={C.line} r={26} />
        {BANDS.map((bx, i) => (
          <g key={i}>
            <rect x={bx - 62} y={262} width={124} height={496} fill={C.opt} opacity={0.06 + 0.04 * i} />
            <EN x={bx} y={298} size={22} fill={C.opt} weight={600}>{['UTC+0', 'UTC+2', 'UTC+4'][i]}</EN>
          </g>
        ))}
        {[
          'M 250 340 L 420 322 L 560 346 L 604 420 L 520 462 L 380 452 L 290 424 Z',
          'M 300 486 L 520 476 L 640 526 L 640 644 L 560 740 L 460 740 L 380 644 L 300 546 Z',
          'M 640 476 L 800 486 L 900 566 L 840 642 L 740 622 L 680 564 Z',
          'M 604 336 L 1010 326 L 1066 424 L 900 474 L 700 454 Z',
        ].map((d, i) => (
          <path key={i} d={d} fill="#1B2A41" stroke={C.line} strokeWidth={2} />
        ))}
      </g>

      {/* cities */}
      {CITIES.map((c, i) => {
        const k = p(t, c.at, 0.6);
        const ring = (t * 0.8 + i / 3) % 1;
        return (
          <g key={c.n} opacity={k}>
            <circle cx={c.x} cy={c.y} r={10 + ring * 34} fill="none" stroke={C.client} strokeWidth={3} opacity={(1 - ring) * 0.7} />
            <circle cx={c.x} cy={c.y} r={11} fill={C.client} />
            <AR x={c.x} y={c.y - 28} size={28} fill={C.text}>{c.ar}</AR>
            <EN x={c.x} y={c.y + 40} size={20} fill={C.muted}>{c.off}</EN>
          </g>
        );
      })}

      {/* order pulses to the server */}
      {CITIES.map((c, i) => {
        const x2 = SRV.x, y2 = 330 + i * 70;
        const k = fire;
        if (k <= 0) return null;
        const cx = c.x + (x2 - c.x) * k, cy = c.y + (y2 - c.y) * k;
        return (
          <g key={c.n}>
            <path d={`M ${c.x} ${c.y} L ${x2} ${y2}`} stroke={C.client} strokeWidth={3} strokeDasharray="10 12" strokeDashoffset={-t * 60} opacity={0.5 * (1 - lin(t, T.fireAt + 2.4, 1))} />
            {k < 1 && <circle cx={cx} cy={cy} r={13} fill={C.opt} />}
          </g>
        );
      })}
      <g opacity={win(t, T.fireAt, T.fireAt + 4.5, 0.5)}>
        <rect x={420} y={640} width={360} height={56} rx={28} fill={C.cardDeep} stroke={C.opt} strokeWidth={3} />
        <EN x={600} y={677} size={24} fill={C.opt} weight={600}>same instant = 08:00:00 UTC</EN>
      </g>

      {/* server log */}
      <g opacity={mapK}>
        <Card x={SRV.x} y={SRV.y} w={SRV.w} h={SRV.h} stroke={bad > 0 ? C.accent : C.db} glow={bad > 0 ? 0.8 + 0.3 * pulse : 0.4} />
        <EN x={SRV.x + 36} y={SRV.y + 50} size={28} anchor="start" fill={C.db} weight={600}>orders_log · TIMESTAMP</EN>
        <g transform={`translate(${shake} 0)`}>
          {CITIES.map((c, i) => {
            const rk = p(t, T.fireAt + 1.6 + i * 0.3, 0.5);
            const y = SRV.y + 90 + i * 84;
            return (
              <g key={c.n} opacity={rk} transform={`translate(${(1 - rk) * 40} 0)`}>
                <rect x={SRV.x + 28} y={y} width={SRV.w - 56} height={70} rx={14} fill={C.cardDeep} stroke={bad > 0 ? C.accent : C.line} strokeWidth={2} />
                <EN x={SRV.x + 52} y={y + 45} size={26} anchor="start">{c.n}</EN>
                <EN x={SRV.x + SRV.w - 52} y={y + 45} size={28} anchor="end" fill={bad > 0 ? '#FCA5A5' : C.text} weight={600}>{`2026-11-01 ${c.rec}`}</EN>
              </g>
            );
          })}
        </g>
        {/* narration callouts */}
        <Reveal t={t} at={T.dubaiAt} until={T.londonAt + 3.5} dy={12}>
          <EN x={SRV.x + 36} y={SRV.y + 380} size={24} anchor="start" fill={C.muted}>Dubai 12:00 · London 10:00 — "same second"</EN>
        </Reveal>
        <g opacity={bad} transform={`translate(0 ${(1 - bad) * 16})`}>
          <rect x={SRV.x + 28} y={SRV.y + 410} width={SRV.w - 56} height={78} rx={39} fill={C.accent} opacity={0.2} stroke={C.accent} strokeWidth={3} />
          <path d={`M ${SRV.x + 80} ${SRV.y + 470} L ${SRV.x + 112} ${SRV.y + 420} L ${SRV.x + 144} ${SRV.y + 470} Z`} fill={C.accent} />
          <path d={`M ${SRV.x + 112} ${SRV.y + 436} V ${SRV.y + 452}`} stroke={C.text} strokeWidth={5} strokeLinecap="round" />
          <AR x={SRV.x + SRV.w - 60} y={SRV.y + 462} size={30} fill="#FCA5A5" anchor="start">تدمير التسلسل الزمني</AR>
        </g>
      </g>

      <g opacity={win(t, T.caption[0], T.caption[1], 0.4)}>
        <Arrowed y={900} left="Same Moment" right="Scrambled Chronological Sequence" leftColor={C.client} rightColor={C.accent} size={36} />
      </g>
    </g>
  );
};
