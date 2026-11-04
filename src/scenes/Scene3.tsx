import React from 'react';
import TL from '../timeline.json';
import {C, D, FONT_AR, FONT_MONO} from '../theme';
import {Bg} from '../components/Glass';
import {Code, CodeLine} from '../components/Code';
import {appear, pop} from '../components/Text';
import {Tag} from '../components/Tag';
import {back, eo, hash, prog, pulse} from '../lib/anim';

const S = TL.cues.sc03;
const L: CodeLine[] = [
  {text: 'SELECT name FROM customers', at: 87.4}, {text: 'WHERE customer_id NOT IN (', at: 88.0},
  {text: '  SELECT customer_id FROM orders', at: 88.7}, {text: ');', at: 89.6},
];
const R: CodeLine[] = [
  {text: 'SELECT name FROM customers c', at: 110.4}, {text: 'WHERE NOT EXISTS (', at: 111.2},
  {text: '  SELECT 1 FROM orders o', at: 112.0}, {text: '  WHERE o.customer_id = c.customer_id', at: 112.8}, {text: ');', at: 114.2},
];
const IDS: (number | null)[] = [1, 3, null];
const INACTIVE = [{id: 2, n: 'منى'}, {id: 4, n: 'عمر'}, {id: 5, n: 'أحمد'}];

const NullChips: React.FC<{color: string; ignored?: boolean}> = ({color, ignored}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 12, fontFamily: FONT_MONO, fontSize: 25, color: C.dim}}>
    orders.customer_id =
    {IDS.map((v, i) => (
      <span key={i} style={{padding: '4px 16px', borderRadius: 10, fontWeight: 800, background: v === null ? `${D.err}33` : 'rgba(255,255,255,0.07)', border: `2px solid ${v === null ? D.err : 'rgba(255,255,255,0.15)'}`, color: v === null ? '#FCA5A5' : C.text, textDecoration: v === null && ignored ? 'line-through' : 'none', opacity: v === null && ignored ? 0.5 : 1}}>{v === null ? 'NULL' : v}</span>
    ))}
  </div>
);

export const Scene3: React.FC<{t: number}> = ({t}) => {
  const inP = pop(t, 85.2, 86.4);
  const crash = prog(t, S.crash, S.crash + 0.7);
  const shake = t >= S.crash && t < S.crash + 1.6 ? Math.sin((t - S.crash) * 80) * 10 * (1 - prog(t, S.crash, S.crash + 1.6)) : 0;
  const focusR = 0.45 + 0.55 * eo(prog(t, 108, 110));
  const focusL = 1 - 0.5 * eo(prog(t, 108, 110));
  const shield = back(prog(t, S.shield, S.shield + 0.8));
  const warn = 0.5 + 0.5 * pulse(t, 0.9);
  const step = (a: number) => appear(t, a, a + 0.5);
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, overflow: 'hidden'}}>
      <Bg t={t} tint={t < 108 ? D.err : D.cat} />
      <div style={{position: 'absolute', left: 60, top: 92, height: 60}}><Tag t={t} range={S.tag1} head="NOT IN Trap" body="──► Fails in Presence of NULLs (Three-Valued Logic Crash)" color={D.err} size={25} /></div>
      <div style={{position: 'absolute', left: 60, top: 92, height: 60}}><Tag t={t} range={S.tag2} head="NOT EXISTS Immunity" body="──► 100% NULL-Safe Boolean Subquery Evaluation" color={D.cat} size={25} /></div>

      {/* LEFT: NOT IN crash */}
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, opacity: focusL * Math.min(1, inP * 1.5), transform: `translateX(${shake}px)`}}>
        <div style={{position: 'absolute', left: 60, top: 190, width: 880, height: 700, borderRadius: 28, border: `2.5px solid ${D.err}`, background: `rgba(127,29,29,${0.12 + 0.12 * crash})`, boxShadow: `0 0 ${24 + 30 * crash * warn}px ${D.err}66`}} />
        <Code lines={L} t={t} x={90} y={215} w={820} h={270} title="not_in.sql" fontSize={25} lineH={46} accent={D.err} />
        <div style={{position: 'absolute', left: 90, top: 510, opacity: step(90.5)}}><NullChips color={D.err} /></div>
        <div style={{position: 'absolute', left: 90, top: 580, width: 820}}>
          {[['2 <> 1', 'TRUE', D.cat, 92], ['2 <> 3', 'TRUE', D.cat, 93.4], ['2 <> NULL', 'UNKNOWN', D.err, 94.8]].map(([a, b, c, at]) => (
            <div key={a as string} style={{display: 'flex', justifyContent: 'space-between', fontFamily: FONT_MONO, fontWeight: 800, fontSize: 28, padding: '10px 22px', marginBottom: 10, borderRadius: 12, background: 'rgba(255,255,255,0.05)', opacity: step(at as number), transform: `translateX(${(1 - step(at as number)) * -40}px)`}}>
              <span style={{color: C.text}}>{a}</span><span style={{color: c as string}}>{b}</span>
            </div>
          ))}
          <div style={{fontFamily: FONT_AR, fontWeight: 800, fontSize: 26, color: '#FCA5A5', direction: 'rtl', opacity: step(96.2), marginTop: 4}}>النتيجة UNKNOWN → يُرفض الصف</div>
        </div>
        {crash > 0 ? <div style={{position: 'absolute', left: 90, top: 806, width: 820, textAlign: 'center', fontFamily: FONT_MONO, fontWeight: 800, fontSize: 60, color: D.err, opacity: Math.min(1, crash * 2), textShadow: crash < 1 ? `4px 0 ${D.code}, -4px 0 #fff` : `0 0 30px ${D.err}`}}>(0 rows)</div> : null}
      </div>

      {/* RIGHT: NOT EXISTS shield pass */}
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, opacity: focusR * Math.min(1, inP * 1.5)}}>
        <div style={{position: 'absolute', left: 980, top: 190, width: 880, height: 700, borderRadius: 28, border: `2.5px solid ${D.cat}`, background: `rgba(16,185,129,${0.05 + 0.08 * shield})`, boxShadow: `0 0 ${20 + 26 * shield}px ${D.cat}66`}} />
        <Code lines={R} t={t} x={1010} y={215} w={820} h={310} title="not_exists.sql" fontSize={25} lineH={46} accent={D.cat} />
        <div style={{position: 'absolute', left: 1010, top: 545, opacity: step(114.6)}}><NullChips color={D.cat} ignored /></div>
        {shield > 0.02 ? (
          <div style={{position: 'absolute', left: 1010, top: 610, width: 820, opacity: Math.min(1, shield * 1.5)}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 22, padding: '10px 26px', borderRadius: 20, background: `${D.cat}22`, border: `2px solid ${D.cat}`, transform: `scale(${0.8 + 0.2 * shield})`, transformOrigin: '0 50%'}}>
              <svg width="56" height="64" viewBox="0 0 86 98" fill="none"><path d="M43 4 L80 18 V48 C80 70 64 86 43 94 C22 86 6 70 6 48 V18 Z" fill={`${D.cat}33`} stroke={D.cat} strokeWidth="7" strokeLinejoin="round" /><path d="M27 48 L39 60 L61 34" stroke="#fff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <div><div style={{fontFamily: FONT_MONO, fontWeight: 800, fontSize: 30, color: C.text}}>NULL-safe</div><div style={{fontFamily: FONT_AR, fontWeight: 700, fontSize: 24, color: D.cat, direction: 'rtl'}}>تفحص وجود السطر لا محتوى الخلايا</div></div>
            </div>
            <div style={{marginTop: 18, fontFamily: FONT_MONO, fontWeight: 800, fontSize: 24, color: D.cat}}>inactive customers →</div>
            <div style={{display: 'flex', gap: 14, marginTop: 10}}>
              {INACTIVE.map((c, i) => {
                const p = back(prog(t, S.shield + 0.5 + i * 0.35, S.shield + 1.1 + i * 0.35));
                return <div key={c.id} style={{flex: 1, padding: '14px 18px', borderRadius: 18, background: `${D.cat}26`, border: `2px solid ${D.cat}`, opacity: Math.min(1, p * 2), transform: `translateY(${(1 - p) * 40}px)`, boxShadow: `0 0 24px ${D.cat}55`}}><div style={{fontFamily: FONT_MONO, fontSize: 20, color: C.mute}}>id {c.id}</div><div style={{fontFamily: FONT_AR, fontWeight: 800, fontSize: 34, color: C.text}}>{c.n}</div></div>;
              })}
            </div>
            <div style={{marginTop: 18, fontFamily: FONT_MONO, fontWeight: 800, fontSize: 46, color: D.cat, textAlign: 'center', opacity: appear(t, S.shield + 2, S.shield + 2.6)}}>(3 rows) ✓</div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
