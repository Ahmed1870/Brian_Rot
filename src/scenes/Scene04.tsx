import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, S} from '../theme';
import {mono} from '../fonts';
import {Caption, Scene, Title, prog} from '../common';

type Q = {lines: string[]; start: number; end: number; result: string; label: string; color: string; rAt: number};
const queries: Q[] = [
  {lines: ['SELECT order_date', "  AT TIME ZONE 'America/New_York'", 'FROM orders;'], start: 40, end: 200, result: '2026-11-01 03:00:00', label: 'AT TIME ZONE → NY', color: C.pink, rAt: 230},
  {lines: ['SELECT EXTRACT(HOUR FROM order_date)', 'FROM orders;'], start: 300, end: 440, result: '8', label: 'EXTRACT → hour', color: C.blue, rAt: 470},
  {lines: ['SELECT AGE(delivery_date, order_date)', 'FROM global_logistics;'], start: 540, end: 720, result: '3 days 06:30:00', label: 'AGE → INTERVAL', color: C.amber, rAt: 750},
  {lines: ["SELECT DATE_TRUNC('day', order_date)", 'FROM orders;'], start: 820, end: 980, result: '2026-11-01 00:00:00+00', label: 'DATE_TRUNC → day', color: C.green, rAt: 1010},
];

const KW = /^(SELECT|FROM|AT TIME ZONE|AS)$/;
const FN = /^(EXTRACT|AGE|DATE_TRUNC|HOUR)$/;
const tokenize = (s: string) => s.match(/'[^']*'|AT TIME ZONE|[A-Za-z_]+|\s+|[^\sA-Za-z_]+/g) ?? [];
const colorOf = (t: string) => (t.startsWith("'") ? C.amber : KW.test(t) ? C.pink : FN.test(t) ? C.blue : C.text);

const CodeLine: React.FC<{text: string; shown: number}> = ({text, shown}) => {
  let used = 0;
  return (
    <>
      {tokenize(text).map((tk, i) => {
        const take = Math.max(0, Math.min(tk.length, shown - used));
        used += tk.length;
        return take > 0 ? <span key={i} style={{color: colorOf(tk), fontWeight: KW.test(tk) || FN.test(tk) ? 700 : 400, whiteSpace: 'pre'}}>{tk.slice(0, take)}</span> : null;
      })}
    </>
  );
};

export const Scene04: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  // flatten lines to rows; 52px per row
  let row = 0;
  const rows: {text: string; q: number; ln: number; r: number; offset: number}[] = [];
  queries.forEach((q, qi) => {
    const total = q.lines.join('').length;
    let off = 0;
    q.lines.forEach((l) => {
      rows.push({text: l, q: qi, ln: ++row, r: row - 1 + qi, offset: off});
      off += l.length;
    });
    void total;
  });

  return (
    <Scene dur={S.s4.dur}>
      <Title ar="التحويل والمعالجة الزمنية" en="AT TIME ZONE · EXTRACT · AGE · DATE_TRUNC" />

      {/* code window */}
      <div className="absolute" style={{left: 80, top: 200, width: 1040, height: 690, background: '#0B1220', border: `2px solid ${C.line}`, borderRadius: 20, overflow: 'hidden', opacity: prog(f, 5, 30)}}>
        <div style={{height: 54, background: C.panel, display: 'flex', alignItems: 'center', gap: 10, padding: '0 22px', direction: 'ltr'}}>
          {[C.red, C.amber, C.green].map((c) => (<div key={c} style={{width: 16, height: 16, borderRadius: 8, background: c}} />))}
          <span style={{marginLeft: 16, fontFamily: mono, fontSize: 22, color: C.dim}}>manzooma_store_global.sql</span>
        </div>
        <div style={{position: 'relative', direction: 'ltr', padding: '18px 0 0 0'}}>
          {rows.map((r, i) => {
            const q = queries[r.q];
            const totalChars = q.lines.join('').length;
            const typed = Math.floor(prog(f, q.start, q.end) * totalChars);
            const shown = typed - r.offset;
            const active = f >= q.start && f <= q.end + 20;
            return (
              <div key={i} style={{position: 'absolute', top: 18 + (r.r) * 48, left: 0, right: 0, height: 48, display: 'flex', alignItems: 'center', fontFamily: mono, fontSize: 30, background: active ? 'rgba(56,189,248,0.07)' : 'transparent'}}>
                <span style={{width: 70, textAlign: 'right', paddingRight: 24, color: C.line, fontSize: 24}}>{r.ln}</span>
                {shown > 0 && <CodeLine text={r.text} shown={shown} />}
                {active && shown > 0 && shown < r.text.length && <span style={{width: 3, height: 34, background: C.blue, marginLeft: 2}} />}
              </div>
            );
          })}
        </div>
      </div>

      {/* result cards */}
      {queries.map((q, i) => {
        const p = spring({frame: f - q.rAt, fps, config: {damping: 13, stiffness: 150}});
        return (
          <div key={i} className="absolute" style={{left: 1180, top: 200 + i * 175, width: 660, height: 155, background: C.panel, border: `3px solid ${q.color}`, borderRadius: 20, opacity: Math.min(1, Math.max(0, p)), transform: `scale(${interpolate(p, [0, 1], [0.85, 1])})`, padding: '18px 28px', direction: 'ltr'}}>
            <div style={{fontFamily: mono, fontSize: 24, fontWeight: 700, color: q.color}}>{q.label}</div>
            <div style={{fontFamily: mono, fontSize: i === 3 ? 38 : 46, fontWeight: 700, color: C.text, marginTop: 14}}>{q.result}</div>
          </div>
        );
      })}

      <Caption from={60} to={510} color={C.pink} size={40}>order_date AT TIME ZONE 'UTC' ──► Dynamic Zone Conversion</Caption>
      <Caption from={630} to={1110} color={C.blue} size={40}>EXTRACT(MONTH FROM date) & AGE() ──► Date Interval Math</Caption>
    </Scene>
  );
};
