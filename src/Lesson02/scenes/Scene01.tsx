import React from 'react';
import { C } from '../../theme';
import { AR, EN, Reveal, Scaled, Card, Header, Blueprint } from '../../components/common';
import { p, lin, win, bump, typed } from '../../anim';
import tl from '../../timeline.json';

const T = tl.s1;
const CLIENT = { x: 110, y: 250, w: 500, h: 500 };
const SERVER = { x: 1310, y: 250, w: 500, h: 500 };
const PY = 500; // pipeline y
const QUERY = 'SELECT * FROM sales;';
const ROWS = [
  ['1001', 'Laptop', '1,250'],
  ['1002', 'Monitor', '380'],
  ['1003', 'Keyboard', '95'],
  ['1004', 'Headset', '140'],
  ['1005', 'Webcam', '110'],
];

export const Scene01: React.FC<{ t: number }> = ({ t }) => {
  const enter = p(t, 0.2, 0.8);
  const clientPulse = 1 + 0.03 * bump(t, T.resultAt, 0.6);
  const serverPulse = 1 + 0.03 * bump(t, T.serverAt, 0.6);
  const q = typed(QUERY, t, T.typeAt, 1.6);
  const caret = Math.floor(t * 2) % 2 === 0 && t < T.packetAt + 1 ? '▌' : '';

  // request packet client -> server, response packets server -> client
  const reqK = lin(t, T.packetAt, 3.6);
  const reqX = 610 + 700 * reqK;
  const reqOn = t >= T.packetAt && t < T.packetAt + 3.7;

  return (
    <g>
      <Header t={t} a={T.header[0]} b={T.header[1]} ar="معمارية العميل والخادم" en="Client-Server Architecture" />

      {/* pipeline tube */}
      <g opacity={enter}>
        <rect x={610} y={PY - 24} width={700} height={48} rx={24} fill={C.cardDeep} stroke={C.line} strokeWidth={3} />
        <path d={`M 630 ${PY} H 1290`} stroke={C.client} strokeWidth={4} strokeLinecap="round" strokeDasharray="14 22" strokeDashoffset={-t * 90} opacity={0.55} />
        <EN x={960} y={PY + 70} size={30} fill={C.opt} weight={600}>Port 5432</EN>
      </g>

      {/* client node */}
      <g opacity={enter}>
        <Scaled cx={CLIENT.x + CLIENT.w / 2} cy={CLIENT.y + CLIENT.h / 2} s={clientPulse}>
          <Card {...CLIENT} stroke={C.client} glow={1 + bump(t, T.resultAt, 1.2)} />
          {[0, 1, 2].map((i) => (
            <circle key={i} cx={CLIENT.x + 40 + i * 28} cy={CLIENT.y + 38} r={8} fill={[C.accent, C.opt, C.db][i]} />
          ))}
          <EN x={CLIENT.x + CLIENT.w - 30} y={CLIENT.y + 46} size={24} anchor="end" fill={C.muted}>pgAdmin / App</EN>
          <rect x={CLIENT.x + 24} y={CLIENT.y + 80} width={CLIENT.w - 48} height={64} rx={14} fill={C.cardDeep} />
          <EN x={CLIENT.x + 44} y={CLIENT.y + 122} size={28} anchor="start" fill={C.client}>{q + caret}</EN>
          {/* result grid */}
          <g>
            {ROWS.map((r, i) => {
              const k = p(t, T.resultAt + 0.3 + i * 0.35, 0.5);
              const ry = CLIENT.y + 190 + i * 56;
              return (
                <g key={i} opacity={k} transform={`translate(${(1 - k) * -30} 0)`}>
                  <rect x={CLIENT.x + 24} y={ry} width={CLIENT.w - 48} height={46} rx={10} fill={i % 2 ? C.cardDeep : '#243247'} />
                  <EN x={CLIENT.x + 50} y={ry + 31} size={24} anchor="start" fill={C.muted}>{r[0]}</EN>
                  <EN x={CLIENT.x + 150} y={ry + 31} size={24} anchor="start">{r[1]}</EN>
                  <EN x={CLIENT.x + CLIENT.w - 50} y={ry + 31} size={24} anchor="end" fill={C.db}>{r[2]}</EN>
                </g>
              );
            })}
          </g>
        </Scaled>
        <AR x={CLIENT.x + CLIENT.w / 2} y={CLIENT.y + CLIENT.h + 70} size={44} fill={C.client}>العميل</AR>
        <EN x={CLIENT.x + CLIENT.w / 2} y={CLIENT.y + CLIENT.h + 112} size={26} fill={C.muted}>Client App</EN>
      </g>

      {/* server node */}
      <g opacity={enter}>
        <Scaled cx={SERVER.x + SERVER.w / 2} cy={SERVER.y + SERVER.h / 2} s={serverPulse}>
          <Card {...SERVER} stroke={C.db} glow={1 + bump(t, T.serverAt, 1.2)} />
          {[0, 1, 2].map((i) => {
            const cy = SERVER.y + 190 + i * 70;
            const cx = SERVER.x + SERVER.w / 2;
            return (
              <g key={i}>
                <rect x={cx - 110} y={cy - 24} width={220} height={52} rx={12} fill={C.cardDeep} stroke={C.db} strokeWidth={3} />
                <circle cx={cx + 70} cy={cy + 2} r={7} fill={C.db} opacity={0.6 + 0.4 * Math.sin(t * 6 + i)} />
                <rect x={cx - 85} y={cy - 6} width={90} height={8} rx={4} fill={C.line} />
              </g>
            );
          })}
          <EN x={SERVER.x + SERVER.w / 2} y={SERVER.y + 440} size={30} fill={C.db} weight={600}>PostgreSQL</EN>
        </Scaled>
        {/* processing rings */}
        {t >= T.serverAt && t < T.resultAt &&
          [0, 1, 2].map((i) => {
            const ph = (t * 0.9 + i / 3) % 1;
            return <circle key={i} cx={SERVER.x + SERVER.w / 2} cy={SERVER.y + 255} r={70 + ph * 150} fill="none" stroke={C.db} strokeWidth={4} opacity={(1 - ph) * 0.7} />;
          })}
        <AR x={SERVER.x + SERVER.w / 2} y={SERVER.y + SERVER.h + 70} size={44} fill={C.db}>الخادم</AR>
        <EN x={SERVER.x + SERVER.w / 2} y={SERVER.y + SERVER.h + 112} size={26} fill={C.muted}>Database Server</EN>
      </g>

      {/* idle blue dots before the request */}
      {t < T.packetAt &&
        [0, 1, 2].map((i) => {
          const ph = (t * 0.25 + i / 3) % 1;
          return <circle key={i} cx={640 + ph * 640} cy={PY} r={7} fill={C.client} opacity={0.5 * enter} />;
        })}

      {/* request packet */}
      {reqOn && (
        <g>
          <circle cx={reqX} cy={PY} r={30} fill={C.opt} opacity={0.2} />
          <circle cx={reqX} cy={PY} r={16} fill={C.opt} />
          <rect x={reqX - 62} y={PY - 78} width={124} height={34} rx={17} fill={C.cardDeep} stroke={C.opt} strokeWidth={2} />
          <EN x={reqX} y={PY - 54} size={20} fill={C.opt} weight={600}>SQL</EN>
        </g>
      )}

      {/* response packets */}
      {[0, 1, 2].map((i) => {
        const k = lin(t, T.resultAt + i * 0.35, 2.6);
        if (k <= 0 || k >= 1) return null;
        const x = 1310 - 700 * k;
        return (
          <g key={i}>
            <circle cx={x} cy={PY} r={22} fill={C.db} opacity={0.2} />
            <circle cx={x} cy={PY} r={12} fill={C.db} />
          </g>
        );
      })}

      {/* live blueprint */}
      <g opacity={win(t, T.blueprint[0], T.blueprint[1])}>
        <Blueprint y={930} />
      </g>
    </g>
  );
};
