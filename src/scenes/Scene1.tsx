import React from 'react';
import TL from '../timeline.json';
import {C, D, FONT_AR, FONT_MONO} from '../theme';
import {Bg} from '../components/Glass';
import {Code, CodeLine} from '../components/Code';
import {Bi, appear, pop} from '../components/Text';
import {Tag} from '../components/Tag';
import {eo, fmt, mix, prog, pulse, seg} from '../lib/anim';

const S = TL.cues.sc01;
const PUR = '#A855F7';
const EMP = [
  {n: 'أحمد', d: 'Sales', s: 9000}, {n: 'سارة', d: 'IT', s: 11000}, {n: 'منى', d: 'Sales', s: 8000},
  {n: 'عمر', d: 'HR', s: 7500}, {n: 'ياسمين', d: 'IT', s: 13000}, {n: 'كريم', d: 'HR', s: 6500},
];
const AVG: Record<string, number> = {Sales: 8500, IT: 12000, HR: 7000};
const CODE: CodeLine[] = [
  {text: 'SELECT e.first_name, e.salary', at: 1.6},
  {text: 'FROM employees e', at: 2.8},
  {text: 'WHERE e.salary > (', at: 3.6},
  {text: '  SELECT AVG(salary) FROM employees', at: 4.6},
  {text: '  WHERE department_id = e.department_id', at: 6.0},
  {text: ');', at: 8.0},
];
const TX = 60, TY = 200, RH = 70, HEAD = 56;
const TOKEN = {x: 1500, y: 200 + 52 + 18 + 4 * 46 + 23};
const bz = (u: number, a: number, b: number, c: number, d: number) => (1 - u) ** 3 * a + 3 * (1 - u) ** 2 * u * b + 3 * (1 - u) * u * u * c + u ** 3 * d;

export const Scene1: React.FC<{t: number}> = ({t}) => {
  const rel = t - S.pulse + 12; // first cycle starts at 6
  const k = t < 6 ? -1 : Math.min(S.rows - 1, Math.floor((t - 6) / S.step));
  const u = k < 0 ? 0 : t >= 6 + S.rows * S.step ? 1 : prog(t - 6 - k * S.step, 0, S.step);
  const done = t >= 6 + S.rows * S.step;
  const e = k >= 0 ? EMP[k] : EMP[0];
  const rowY = TY + HEAD + Math.max(0, k) * RH + RH / 2;
  const sig = prog(u, 0.08, 0.42);
  const infer = prog(u, 0.42, 0.7);
  const ret = prog(u, 0.7, 0.9);
  const ring = prog(t, S.pulse, S.pulse + 1.4);
  const badgeP = pop(t, S.badge[0], S.badge[0] + 0.8) * (1 - seg(t, S.badge[1] - 0.4, S.badge[1]));
  const sx = 400, ex = TOKEN.x - 20, ey = TOKEN.y;
  const px = bz(eo(sig), sx, 800, 1150, ex), py = bz(eo(sig), rowY, rowY - 140, ey - 190, ey);
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, overflow: 'hidden'}}>
      <Bg t={t} />
      <div style={{position: 'absolute', left: 0, top: 92, width: 1920, display: 'flex', justifyContent: 'center', opacity: Math.min(1, badgeP * 1.5), transform: `translateY(${(1 - badgeP) * -60}px)`}}>
        {badgeP > 0.01 ? <div style={{padding: '16px 48px', borderRadius: 999, background: 'rgba(30,41,59,0.95)', border: `2px solid ${PUR}`, boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${PUR}55`}}><Bi ar="الاستعلامات المترابطة" en="Correlated Subqueries & Row-by-Row Binding" size={46} t={t} start={S.badge[0] + 0.15} sep={PUR} /></div> : null}
      </div>
      <div style={{position: 'absolute', left: 0, top: 96, width: 1920, display: 'flex', justifyContent: 'center', height: 60}}><Tag t={t} range={[22, 38]} head="Inner Query References Outer Row:" body="WHERE department_id = e.department_id" color={PUR} size={28} /></div>

      {/* outer table */}
      <div style={{position: 'absolute', left: TX, top: TY, width: 800, opacity: appear(t, 0.5, 1.4)}}>
        <div style={{borderRadius: 22, background: '#0B1222', border: `2px solid ${D.code}66`, overflow: 'hidden', boxShadow: '0 30px 70px rgba(0,0,0,0.5)'}}>
          <div style={{height: HEAD, display: 'flex', alignItems: 'center', background: '#111B31', fontFamily: FONT_MONO, fontWeight: 800, fontSize: 21, color: D.code}}>
            {[['employees e', 220], ['department_id', 200], ['salary', 140], ['dept avg', 160], ['', 80]].map(([l, w]) => <div key={l as string} style={{width: w as number, padding: '0 18px'}}>{l}</div>)}
          </div>
          {EMP.map((x, i) => {
            const active = i === k && !done;
            const seen = i < k || (i === k && ret > 0) || done;
            const above = x.s > AVG[x.d];
            return (
              <div key={i} style={{height: RH, display: 'flex', alignItems: 'center', borderTop: '1px solid rgba(71,85,105,0.5)', background: active ? `${D.code}2A` : seen && above && done ? `${D.cat}22` : 'transparent', fontFamily: FONT_MONO, fontSize: 25, color: C.text, boxShadow: active ? `inset 4px 0 0 ${D.code}` : undefined}}>
                <div style={{width: 220, padding: '0 18px', fontFamily: FONT_AR, fontWeight: 800}}>{x.n}</div>
                <div style={{width: 200, padding: '0 18px', color: active ? PUR : C.text, fontWeight: active ? 800 : 500}}>{x.d}</div>
                <div style={{width: 140, padding: '0 18px'}}>{fmt(x.s)}</div>
                <div style={{width: 160, padding: '0 18px', color: D.key, fontWeight: 800, opacity: seen ? 1 : 0}}>{fmt(AVG[x.d])}</div>
                <div style={{width: 80, textAlign: 'center', fontSize: 30, fontWeight: 800, color: above ? D.cat : D.err, opacity: seen ? 1 : 0}}>{above ? '✓' : '✕'}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* inner query */}
      <div style={{opacity: appear(t, 0.8, 1.6)}}><Code lines={CODE} t={t} x={920} y={200} w={940} h={350} title="correlated.sql" fontSize={27} lineH={46} accent={PUR} /></div>
      {ring > 0 && ring < 1 ? <div style={{position: 'absolute', left: TOKEN.x - 140 * ring, top: TOKEN.y - 24 * ring - 12, width: 280 * ring, height: 48 * ring + 24, borderRadius: 999, border: `4px solid ${PUR}`, opacity: 1 - ring}} /> : null}

      {/* bound value card */}
      <div style={{position: 'absolute', left: 920, top: 590, width: 940, height: 290, borderRadius: 24, background: 'linear-gradient(160deg,#22304A,#1B2740)', border: `2px solid ${PUR}88`, opacity: appear(t, 6, 7), padding: '22px 34px', boxSizing: 'border-box', boxShadow: `0 0 ${24 + 20 * pulse(t, 1.6)}px ${PUR}44`}}>
        <div style={{fontFamily: FONT_MONO, fontSize: 21, color: C.mute, letterSpacing: 2}}>INNER QUERY · BOUND TO OUTER ROW</div>
        <div style={{display: 'flex', alignItems: 'center', gap: 26, marginTop: 14}}>
          <div style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 36, color: C.text}}>e.department_id = <span style={{color: PUR}}>'{done ? '…' : e.d}'</span></div>
        </div>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 18, marginTop: 20, opacity: infer}}>
          <span style={{fontFamily: FONT_MONO, fontSize: 28, color: C.dim}}>AVG(salary) =</span>
          <span style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 74, color: D.key, textShadow: `0 0 26px ${D.key}66`}}>{done ? '' : fmt(AVG[e.d] * Math.min(1, infer * 1.2))}</span>
        </div>
        <div style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 30, marginTop: 6, opacity: ret, color: e.s > AVG[e.d] ? D.cat : D.err}}>{done ? 'rows above their department average: 3' : `${fmt(e.s)} > ${fmt(AVG[e.d])} → ${e.s > AVG[e.d] ? 'TRUE ✓' : 'FALSE ✕'}`}</div>
      </div>

      {/* purple loop signal */}
      <svg width="1920" height="1080" style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}}>
        {sig > 0 && !done && ret < 1 ? <>
          <path d={`M${sx} ${rowY} C 800 ${rowY - 140} 1150 ${ey - 190} ${ex} ${ey}`} fill="none" stroke={PUR} strokeWidth="5" strokeDasharray="10 12" strokeDashoffset={-t * 90} opacity={0.35 + 0.5 * (1 - ret)} />
          <circle cx={px} cy={py} r="11" fill={PUR} style={{filter: `drop-shadow(0 0 14px ${PUR})`}} />
        </> : null}
      </svg>
    </div>
  );
};
