import React from 'react';
import { C } from '../../theme';
import { AR, EN, Reveal, Card, Header, Arrowed } from '../../components/common';
import { p, lin, win, keys } from '../../anim';
import tl from '../../timeline.json';

const T = tl.s4;
const KEYS = ['warranty', 'color', 'brand', 'size', 'ram', 'battery'];
const SORTED = [...KEYS].sort();
const KY = 330, KH = 70;

export const Scene04: React.FC<{ t: number }> = ({ t }) => {
  const arch = p(t, T.archAt, 0.9);
  const sort = p(t, T.keysAt, 4.0);
  const toast = lin(t, T.toastAt, 6.5);
  const ptr = lin(t, T.pointerAt, 2.2);
  const sav = p(t, T.savingsAt, 0.7);
  const target = SORTED.indexOf('warranty');
  const posOf = (k: string) => {
    const from = KEYS.indexOf(k), to = SORTED.indexOf(k);
    return KY + (from + (to - from) * sort) * KH;
  };
  const ptrY = KY + target * KH + 26;
  const pulse = 0.5 + 0.5 * Math.sin(t * 7);
  const compress = keys(toast, [0, 0.3, 0.7, 1], [700, 700, 220, 220]);
  const toX = keys(toast, [0, 0.7, 1], [0, 0, 280]);

  return (
    <g>
      <Header t={t} a={T.archAt} b={T.keysAt - 0.3} ar="كواليس PostgreSQL 16" en="JSONB Binary Architecture" y={105} color={C.client} />

      {/* sorted keys + pointer jump */}
      <g opacity={arch} transform={`translate(0 ${(1 - arch) * 20})`}>
        <Card x={70} y={190} w={830} h={680} stroke={C.db} glow={0.4} r={24} />
        <EN x={100} y={238} size={26} anchor="start" fill={C.db} weight={600}>keys in memory</EN>
        <AR x={870} y={238} size={24} anchor="start" fill={C.muted}>ترتيب أبجدي</AR>
        {KEYS.map((k) => {
          const y = posOf(k);
          const hit = ptr > 0.5 && k === 'warranty';
          const skipped = ptr > 0.3 && k !== 'warranty';
          return (
            <g key={k} transform={`translate(110 ${y})`} opacity={skipped ? 0.35 : 1}>
              <rect width={560} height={KH - 12} rx={14} fill={hit ? C.db : C.client} opacity={hit ? 0.3 : 0.16} stroke={hit ? C.db : C.client} strokeWidth={hit ? 5 : 3} />
              <EN x={34} y={40} size={28} anchor="start" fill={C.text} weight={600}>{`"${k}"`}</EN>
              <g opacity={sort}>
                <circle cx={520} cy={29} r={19} fill={C.client} />
                <EN x={520} y={37} size={20} fill={C.bg} weight={600}>{String(SORTED.indexOf(k) + 1)}</EN>
              </g>
            </g>
          );
        })}
        {ptr > 0 && (
          <g>
            <path d={`M 740 ${KY + 20} C 790 ${KY + 100} 790 ${ptrY - 60} 690 ${ptrY}`} fill="none" stroke={C.opt} strokeWidth={6} strokeLinecap="round" strokeDasharray="12 10" strokeDashoffset={-t * 90} opacity={Math.min(1, ptr * 2)} />
            <path d={`M 706 ${ptrY - 18} L 676 ${ptrY} L 706 ${ptrY + 18} Z`} fill={C.opt} opacity={ptr} />
            <circle cx={keys(ptr, [0, 1], [740, 690])} cy={keys(ptr, [0, 1], [KY + 20, ptrY])} r={12} fill={C.opt} />
          </g>
        )}
        <g opacity={p(t, T.pointerAt + 1.8, 0.5)}>
          <rect x={110} y={KY + 6 * KH + 20} width={700} height={64} rx={32} fill={C.opt} opacity={0.16} stroke={C.opt} strokeWidth={3} />
          <EN x={460} y={KY + 6 * KH + 62} size={24} fill={C.opt} weight={600}>⚡ direct jump · no full read of the document</EN>
        </g>
      </g>

      {/* TOAST compression */}
      <g opacity={arch} transform={`translate(0 ${(1 - arch) * 20})`}>
        <Card x={940} y={190} w={890} h={680} stroke={toast > 0 ? C.purple : C.line} glow={toast > 0 ? 0.6 : 0.2} r={24} />
        <EN x={970} y={238} size={26} anchor="start" fill={C.purple} weight={600}>large JSONB document</EN>
        <g opacity={p(t, T.toastAt - 0.4, 0.5)}>
          <path d="M 970 330 H 1800" stroke={C.opt} strokeWidth={3} strokeDasharray="14 10" />
          <EN x={1800} y={318} size={18} anchor="end" fill={C.opt}>8KB page limit</EN>
        </g>
        <g opacity={p(t, T.toastAt - 0.4, 0.5)} transform={`translate(${970 + toX} 360)`}>
          <rect width={compress} height={260} rx={18} fill={toast > 0.7 ? C.purple : C.client} opacity={0.22} stroke={toast > 0.7 ? C.purple : C.client} strokeWidth={4} />
          {Array.from({ length: 6 }).map((_, i) => <rect key={i} x={24} y={30 + i * 36} width={Math.max(40, compress - 48) * (0.5 + 0.5 * (((i * 37) % 10) / 10))} height={14} rx={7} fill={C.text} opacity={0.5} />)}
          <EN x={compress / 2} y={250} size={18} fill={C.text}>{toast > 0.7 ? 'compressed' : 'big document'}</EN>
        </g>
        {/* TOAST storage capsule */}
        <g opacity={p(t, T.toastAt + 3.2, 0.6)}>
          <rect x={1370} y={350} width={420} height={290} rx={26} fill={C.purple} opacity={0.14} stroke={C.purple} strokeWidth={4} strokeDasharray={toast < 1 ? '14 10' : '0'} />
          <EN x={1580} y={402} size={30} fill={C.purple} weight={600}>TOAST Storage</EN>
          <EN x={1580} y={440} size={18} fill={C.muted}>out-of-line · compressed</EN>
        </g>
        {/* savings */}
        <g opacity={sav} transform={`translate(0 ${(1 - sav) * 14})`}>
          <EN x={970} y={700} size={22} anchor="start" fill={C.muted}>disk / memory use</EN>
          <rect x={970} y={716} width={820} height={26} rx={13} fill={C.cardDeep} />
          <rect x={970} y={716} width={820} height={26} rx={13} fill={C.accent} opacity={0.7} />
          <EN x={1780} y={736} size={16} anchor="end" fill={C.text}>JSON text 100%</EN>
          <rect x={970} y={760} width={820} height={26} rx={13} fill={C.cardDeep} />
          <rect x={970} y={760} width={820 * 0.34 * sav} height={26} rx={13} fill={C.db} />
          <EN x={1100} y={780} size={16} anchor="start" fill={C.text}>JSONB + TOAST ~34%</EN>
          <AR x={1790} y={830} size={26} anchor="start" fill={C.db}>تقليل استهلاك الذاكرة والقرص</AR>
        </g>
      </g>

      <g opacity={win(t, T.cap1[0], T.cap1[1], 0.3)}>
        <Arrowed y={985} left="Binary Key Sorting" right="Sorts Keys Alphabetically for Instant Pointer Lookup" leftColor={C.db} rightColor={C.text} size={22} />
      </g>
      <g opacity={win(t, T.cap2[0], T.cap2[1], 0.3)}>
        <Arrowed y={985} left="TOAST Storage" right="Out-of-Line Compressed Storage for Large JSONB Documents" leftColor={C.purple} rightColor={C.text} size={22} />
      </g>
      <g opacity={win(t, T.cap3[0], T.cap3[1], 0.3)}>
        <Arrowed y={985} left="Direct Pointer Jump" right="Reads Only the Requested Key" leftColor={C.opt} rightColor={C.text} size={30} />
      </g>
    </g>
  );
};
