import React from 'react';
import TL from '../timeline.json';
import {C, D, FONT_AR, FONT_MONO} from '../theme';
import {Bg} from '../components/Glass';
import {Code, CodeLine} from '../components/Code';
import {appear, pop} from '../components/Text';
import {Tag} from '../components/Tag';
import {back, eo, prog, pulse} from '../lib/anim';

const S = TL.cues.sc02;
const PUR = '#A855F7';
const T0 = S.typeT;
const CODE: CodeLine[] = [
  {text: 'SELECT order_id,', at: T0}, {text: '       EXTRACT(YEAR FROM order_date) AS order_year,', at: T0 + 0.9},
  {text: '       EXTRACT(DOW FROM order_date) AS day_of_week,', at: T0 + 2.8}, {text: '       EXTRACT(HOUR FROM order_date) AS order_hour', at: T0 + 4.6}, {text: 'FROM orders;', at: T0 + 6.4},
];
const TS = '2026-11-06 15:30:00';
const CW = 32.4, TX0 = 60 + (940 - TS.length * CW) / 2, TY = 610;
const BOX = [
  {l: 'order_year', v: '2026', sub: 'YEAR', x0: 2, x1: 3}, {l: 'day_of_week', v: '5', sub: 'DOW · الجمعة', x0: 8, x1: 9}, {l: 'order_hour', v: '15', sub: 'HOUR · ساعة الذروة', x0: 11, x1: 12},
];
const BY = [215, 395, 575];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const VAL = [42, 55, 61, 58, 72, 96, 64];
const bz = (u: number, a: number, b: number, c: number, d: number) => (1 - u) ** 3 * a + 3 * (1 - u) ** 2 * u * b + 3 * (1 - u) * u * u * c + u ** 3 * d;

export const Scene2: React.FC<{t: number}> = ({t}) => {
  const enter = appear(t, 38.6, 39.6);
  const warm = 0.5 + 0.5 * pulse(t, 1.2);
  const barsP = eo(prog(t, S.bars, S.bars + 2));
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, overflow: 'hidden'}}>
      <Bg t={t} />
      <div style={{position: 'absolute', left: 60, top: 92, height: 60}}><Tag t={t} range={S.tag1} head="EXTRACT(DOW FROM order_date)" body="──► Extracts Numerical Date Components" color={PUR} size={27} /></div>
      <div style={{position: 'absolute', left: 60, top: 92, height: 60}}><Tag t={t} range={S.tag2} head="Seasonality Analytics" body="──► Analyzes Peak Hours, Weekdays & Yearly Trends" color={D.cat} size={27} /></div>
      <div style={{opacity: enter}}><Code lines={CODE} t={t} x={60} y={190} w={940} h={310} title="extract.sql" fontSize={23} lineH={44} accent={PUR} /></div>

      {/* timestamp cell */}
      <div style={{position: 'absolute', left: 60, top: 535, width: 940, height: 150, borderRadius: 22, background: '#0B1222', border: `2px solid ${D.key}88`, opacity: appear(t, S.typeT + 3, S.typeT + 4)}}>
        <div style={{position: 'absolute', left: 24, top: 10, fontFamily: FONT_MONO, fontSize: 19, color: C.mute}}>order_date · TIMESTAMPTZ</div>
      </div>
      <div style={{position: 'absolute', left: TX0, top: TY - 38, fontFamily: FONT_MONO, fontWeight: 800, fontSize: 54, letterSpacing: 0, whiteSpace: 'pre', opacity: appear(t, S.typeT + 3, S.typeT + 4)}}>
        {TS.split('').map((ch, i) => {
          const seg = BOX.find((b) => i >= b.x0 && i <= b.x1 && true) || BOX.find((b, k) => (k === 0 && i <= 3) || (k === 1 && i >= 8 && i <= 9) || (k === 2 && i >= 11 && i <= 12));
          const hit = (i <= 3) || (i >= 8 && i <= 9) || (i >= 11 && i <= 12);
          const g = hit ? Math.sin(prog(t, S.probe, S.probe + 4) * Math.PI) : 0;
          return <span key={i} style={{color: hit && t > S.probe ? PUR : C.text, textShadow: g > 0 ? `0 0 ${20 * g}px ${PUR}` : undefined}}>{ch}</span>;
        })}
      </div>

      {/* purple extraction probes */}
      <svg width="1920" height="1080" style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}}>
        {BOX.map((b, k) => {
          const st = S.probe + k * 1.3;
          const p = eo(prog(t, st, st + 1.2));
          if (p <= 0) return null;
          const sx = TX0 + ((b.x0 + b.x1 + 1) / 2) * CW, sy = TY - 40, ex = 1060, ey = BY[k] + 65;
          return (
            <g key={k}>
              <path d={`M${sx} ${sy} C ${sx} ${sy - 120} ${ex - 160} ${ey} ${ex} ${ey}`} fill="none" stroke={PUR} strokeWidth="5" strokeDasharray="10 10" strokeDashoffset={-t * 80} opacity={0.5} pathLength={1} style={{strokeDasharray: `${p} 1`}} />
              <circle cx={bz(p, sx, sx, ex - 160, ex)} cy={bz(p, sy, sy - 120, ey, ey)} r="11" fill={PUR} style={{filter: `drop-shadow(0 0 12px ${PUR})`}} />
            </g>
          );
        })}
      </svg>

      {/* metric boxes */}
      {BOX.map((b, k) => {
        const st = S.probe + k * 1.3 + 1.1;
        const p = back(prog(t, st, st + 0.7));
        return (
          <div key={b.l} style={{position: 'absolute', left: 1060, top: BY[k], width: 800, height: 130, borderRadius: 22, background: `${D.cat}1A`, border: `2.5px solid ${D.cat}`, opacity: Math.min(1, p * 2 + 0.15), transform: `scale(${0.94 + 0.06 * p})`, display: 'flex', alignItems: 'center', gap: 28, padding: '0 34px', boxShadow: p > 0.8 ? `0 0 ${22 + 14 * warm}px ${D.cat}55` : undefined}}>
            <div style={{flex: 1}}><div style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 28, color: C.text}}>{b.l}</div><div style={{fontFamily: FONT_AR, fontWeight: 700, fontSize: 24, color: D.cat, direction: 'rtl', textAlign: 'left'}}>{b.sub}</div></div>
            <div style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 80, color: D.cat, opacity: p > 0.5 ? 1 : 0}}>{b.v}</div>
          </div>
        );
      })}

      {/* weekday seasonality */}
      {t >= S.bars ? (
        <div style={{position: 'absolute', left: 60, top: 725, width: 1800, height: 260, borderRadius: 22, background: 'rgba(30,41,59,0.8)', border: '2px solid rgba(255,255,255,0.12)', opacity: appear(t, S.bars, S.bars + 0.8)}}>
          <div style={{position: 'absolute', left: 28, top: 16, fontFamily: FONT_MONO, fontWeight: 800, fontSize: 22, color: C.dim}}>orders by DOW</div>
          {DAYS.map((d, i) => {
            const h = (VAL[i] / 96) * 150 * barsP;
            const fri = i === 5;
            return (
              <div key={d} style={{position: 'absolute', left: 340 + i * 190, top: 70, width: 110, height: 170}}>
                <div style={{position: 'absolute', bottom: 28, left: 0, width: 110, height: h, borderRadius: 10, background: fri ? D.cat : '#475569', boxShadow: fri ? `0 0 ${20 + 14 * warm}px ${D.cat}` : undefined}} />
                <div style={{position: 'absolute', bottom: 0, width: 110, textAlign: 'center', fontFamily: FONT_MONO, fontWeight: 700, fontSize: 21, color: fri ? D.cat : C.mute}}>{i} {d}</div>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};
