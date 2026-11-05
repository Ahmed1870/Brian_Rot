import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, S} from '../theme';
import {B} from '../layout';
import {cairo, mono} from '../fonts';
import {Caption, Card, Scene, Tag, Title, ease, prog} from '../common';

const ROWS = [{d: '01-05', a: 100}, {d: '01-12', a: 200}, {d: '01-20', a: 300}, {d: '02-03', a: 250}, {d: '02-18', a: 400}];
const RY = 270, RP = 66, RH = 56;

const Case: React.FC<{box: typeof B.s3.trap; fix: boolean; t0: number}> = ({box, fix, t0}) => {
  const f = useCurrentFrame();
  const col = fix ? C.green : C.red;
  const expand = ease(prog(f, t0 + 80, t0 + 220));
  const step = prog(f, t0 + 40, t0 + 40 + 5 * 40) * 5; // "current row" scans down for the trap card
  const lines = fix
    ? [['LAST_VALUE', '(amount)'], ['  OVER(ORDER BY order_date', ''], ['  ROWS BETWEEN UNBOUNDED PRECEDING', ''], ['  AND UNBOUNDED FOLLOWING)', '']]
    : [['LAST_VALUE', '(amount)'], ['  OVER(ORDER BY order_date)', '']];
  return (
    <Card box={box} accent={col} at={t0 === 0 ? 6 : t0}>
      <div style={{position: 'absolute', left: 28, top: 20, direction: 'ltr'}}><Tag color={col}>{fix ? 'EXPLICIT FRAME' : 'DEFAULT FRAME · TRAP'}</Tag></div>
      <div style={{position: 'absolute', left: 28, right: 28, top: 60, direction: 'ltr', fontFamily: mono, fontWeight: 700, fontSize: 26, color: C.text, lineHeight: 1.45, whiteSpace: 'pre'}}>
        {lines.map((l, i) => (<div key={i}><span style={{color: i === 0 ? col : C.pink}}>{l[0]}</span>{l[1]}</div>))}
      </div>
      <div style={{position: 'absolute', left: 28, right: 28, top: 232, display: 'flex', direction: 'ltr', fontFamily: mono, fontWeight: 700, fontSize: 20, color: C.dim}}>
        <span style={{width: 180}}>date</span><span style={{width: 180}}>amount</span><span style={{color: col}}>last_value</span>
      </div>
      {/* purple frame shading */}
      {fix ? (
        <div style={{position: 'absolute', left: 14, top: RY - 6, width: 14, height: (5 * RP) * expand, borderRadius: 7, background: C.purple, opacity: 0.9}} />
      ) : (
        <div style={{position: 'absolute', left: 14, top: RY - 6, width: 14, height: Math.min(5, step + 0.5) * RP, borderRadius: 7, background: C.purple, opacity: prog(f, t0 + 40, t0 + 70) * 0.9}} />
      )}
      {ROWS.map((r, i) => {
        const cur = !fix && Math.floor(step) === i && step < 5;
        const val = fix ? (expand > 0.8 ? 400 : '…') : (step >= i ? r.a : '…');
        const bad = !fix && step >= i && r.a !== 400;
        const good = fix && expand > 0.8;
        return (
          <div key={i} style={{position: 'absolute', left: 36, right: 28, top: RY + i * RP, height: RH, borderRadius: 14, display: 'flex', alignItems: 'center', direction: 'ltr', padding: '0 16px', background: cur ? 'rgba(168,85,247,0.18)' : C.panel2, border: `3px solid ${cur ? C.purple : bad ? C.red : good ? C.green : C.line}`, opacity: prog(f, t0 + 10 + i * 8, t0 + 40 + i * 8)}}>
            <span style={{width: 180, fontFamily: mono, fontWeight: 700, fontSize: 26, color: C.text}}>{r.d}</span>
            <span style={{width: 180, fontFamily: mono, fontWeight: 700, fontSize: 26, color: C.text}}>{r.a}</span>
            <span style={{fontFamily: mono, fontWeight: 700, fontSize: 30, color: bad ? C.red : good ? C.green : C.dim}}>{val}</span>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 28, right: 28, bottom: 24, textAlign: 'center', direction: 'rtl', fontFamily: cairo, fontWeight: 900, fontSize: 28, color: col, opacity: prog(f, t0 + (fix ? 260 : 240), t0 + (fix ? 320 : 300))}}>
        {fix ? 'النافذة كلها من البداية للنهاية: 400 في كل الصفوف ✓' : 'الإطار بيقف عند CURRENT ROW: القيمة غلط!'}
      </div>
    </Card>
  );
};

export const Scene03: React.FC = () => (
  <Scene dur={S.s3.dur} accent={C.red}>
    <Title ar="القيمة الأولى والأخيرة" en="FIRST_VALUE & LAST_VALUE Framing" chip="SC 03 · FRAME" accent={C.red} />
    <Case box={B.s3.trap} fix={false} t0={0} />
    <Case box={B.s3.fix} fix t0={450} />
    <Caption from={90} to={630} color={C.red}>LAST_VALUE() Danger Trap ──► Default Frame Stops at CURRENT ROW</Caption>
    <Caption from={750} to={1230} color={C.green}>Explicit Frame: ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING</Caption>
  </Scene>
);
