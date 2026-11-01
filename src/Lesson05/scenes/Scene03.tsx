import React from 'react';
import { C } from '../../theme';
import { AR, EN, Reveal, Scaled, Card, Header } from '../../components/common';
import { p, lin, win, keys } from '../../anim';
import tl from '../../timeline.json';

const T = tl.s3;
const SW = 520, SH = 400, SY = 300, SX = [110, 700, 1290];
const CW = 19.2; // mono char width at size 32

/** "a ──► b ──► c" built from text + vector arrows, centered on x=960 */
const Chain: React.FC<{ y: number; parts: [string, string][]; size?: number }> = ({ y, parts, size = 32 }) => {
  const cw = size * 0.6;
  const widths = parts.map(([s]) => s.length * cw);
  const ARW = 110;
  const total = widths.reduce((a, b) => a + b, 0) + (parts.length - 1) * ARW;
  let x = 960 - total / 2;
  return (
    <g>
      {parts.map(([s, c], i) => {
        const tx = x;
        x += widths[i];
        const ax = x + 14;
        x += ARW;
        return (
          <g key={i}>
            <EN x={tx} y={y} size={size} anchor="start" fill={c} weight={600}>{s}</EN>
            {i < parts.length - 1 && (
              <g>
                <path d={`M ${ax} ${y - 12} H ${ax + 66}`} stroke={C.opt} strokeWidth={5} strokeLinecap="round" />
                <path d={`M ${ax + 54} ${y - 28} L ${ax + 84} ${y - 12} L ${ax + 54} ${y + 4} Z`} fill={C.opt} />
              </g>
            )}
          </g>
        );
      })}
    </g>
  );
};

export const Scene03: React.FC<{ t: number }> = ({ t }) => {
  const stage = (at: number) => p(t, at, 0.7);
  const stages = [T.inputAt, T.storeAt, T.outputAt];
  const active = stages.reduce((a, s, i) => (t >= s ? i : a), -1);
  const pcx = (i: number) => SX[i] + SW / 2;
  const px = keys(t, [T.inputAt + 2.5, T.storeAt, T.storeAt + 1.2, T.outputAt, T.outputAt + 1.4], [pcx(0), pcx(0), pcx(1), pcx(1), pcx(2)]);
  const pOn = t >= T.inputAt + 2.5 && t < T.showAt + 1;
  const sub = lin(t, T.storeAt + 0.6, 1.2); // 10:00 -> 08:00 morph
  const add = lin(t, T.outputAt + 0.8, 1.2); // 08:00 -> 12:00 morph

  return (
    <g>
      <Header t={t} a={T.head[0]} b={T.head[1]} ar="السر الإعجازي في PostgreSQL" en="Internal UTC Normalization" color={C.db} />

      {/* connectors */}
      {[0, 1].map((i) => (
        <g key={i} opacity={stage(stages[i + 1] - 0.3)}>
          <path d={`M ${SX[i] + SW + 14} ${SY + SH / 2} H ${SX[i + 1] - 14}`} stroke={C.opt} strokeWidth={5} strokeLinecap="round" strokeDasharray="12 14" strokeDashoffset={-t * 60} />
        </g>
      ))}

      {/* stage 1: input */}
      <g opacity={stage(T.inputAt)} transform={`translate(0 ${(1 - stage(T.inputAt)) * 30})`}>
        <Scaled cx={pcx(0)} cy={SY + SH / 2} s={active === 0 ? 1.03 : 1}>
          <Card x={SX[0]} y={SY} w={SW} h={SH} stroke={active === 0 ? C.client : C.line} glow={active === 0 ? 1 : 0} />
          <EN x={pcx(0)} y={SY + 56} size={28} fill={C.client} weight={600}>1 · Input</EN>
          <AR x={pcx(0)} y={SY + 130} size={44} fill={C.text}>القاهرة</AR>
          <EN x={pcx(0)} y={SY + 172} size={24} fill={C.muted}>Africa/Cairo · +02:00</EN>
          <rect x={SX[0] + 40} y={SY + 220} width={SW - 80} height={80} rx={16} fill={C.cardDeep} stroke={C.opt} strokeWidth={3} />
          <EN x={pcx(0)} y={SY + 272} size={30} fill={C.opt} weight={600}>2026-11-01 10:00:00+02</EN>
        </Scaled>
      </g>

      {/* stage 2: storage */}
      <g opacity={stage(T.storeAt - 0.5)} transform={`translate(0 ${(1 - stage(T.storeAt - 0.5)) * 30})`}>
        <Scaled cx={pcx(1)} cy={SY + SH / 2} s={active === 1 ? 1.03 : 1}>
          <Card x={SX[1]} y={SY} w={SW} h={SH} stroke={active === 1 ? C.db : C.line} glow={active === 1 ? 1 : 0} />
          <EN x={pcx(1)} y={SY + 56} size={28} fill={C.db} weight={600}>2 · Storage</EN>
          <EN x={pcx(1)} y={SY + 130} size={30} fill={C.opt}>{`10:00:00 − 2h`}</EN>
          <rect x={SX[1] + 40} y={SY + 170} width={SW - 80} height={130} rx={16} fill={C.cardDeep} stroke={C.db} strokeWidth={3} />
          <EN x={pcx(1)} y={SY + 252} size={44} fill={C.db} weight={600}>{sub < 0.5 ? '10:00:00' : '08:00:00'}</EN>
          <EN x={pcx(1)} y={SY + 345} size={26} fill={C.db}>UTC · on disk</EN>
        </Scaled>
      </g>

      {/* stage 3: output */}
      <g opacity={stage(T.outputAt - 0.5)} transform={`translate(0 ${(1 - stage(T.outputAt - 0.5)) * 30})`}>
        <Scaled cx={pcx(2)} cy={SY + SH / 2} s={active === 2 ? 1.03 : 1}>
          <Card x={SX[2]} y={SY} w={SW} h={SH} stroke={active === 2 ? C.client : C.line} glow={active === 2 ? 1 : 0} />
          <EN x={pcx(2)} y={SY + 56} size={28} fill={C.client} weight={600}>3 · Output</EN>
          <AR x={pcx(2)} y={SY + 130} size={44} fill={C.text}>دبي</AR>
          <EN x={pcx(2)} y={SY + 172} size={24} fill={C.muted}>Asia/Dubai · +04:00</EN>
          <EN x={pcx(2)} y={SY + 232} size={26} fill={C.opt}>{`08:00:00 + 4h`}</EN>
          <rect x={SX[2] + 40} y={SY + 256} width={SW - 80} height={90} rx={16} fill={C.cardDeep} stroke={C.client} strokeWidth={3} />
          <EN x={pcx(2)} y={SY + 316} size={40} fill={C.client} weight={600}>{add < 0.5 ? '08:00:00 UTC' : '12:00:00 GST'}</EN>
        </Scaled>
      </g>

      {/* travelling particle */}
      {pOn && (
        <g opacity={win(t, T.inputAt + 2.5, T.showAt + 1, 0.3)}>
          <circle cx={px} cy={SY + SH + 40} r={24} fill={C.opt} opacity={0.2} />
          <circle cx={px} cy={SY + SH + 40} r={12} fill={C.opt} />
        </g>
      )}

      {/* captions */}
      <g opacity={win(t, T.cap1[0], T.cap1[1], 0.4)}>
        <Chain y={900} parts={[['Input (+02:00)', C.client], ['Stored as UTC (08:00:00)', C.db], ['Output (+04:00)', C.client]]} />
      </g>
      <Reveal t={t} at={T.cap2[0]} until={T.cap2[1]} dy={16}>
        <rect x={360} y={850} width={1200} height={84} rx={42} fill={C.db} opacity={0.16} stroke={C.db} strokeWidth={3} />
        <EN x={960} y={906} size={36} fill={C.db} weight={600}>PostgreSQL Internal Standard: Always Store in UTC</EN>
      </Reveal>
    </g>
  );
};
