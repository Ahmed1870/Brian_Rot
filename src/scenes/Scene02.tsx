import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, S} from '../theme';
import {B} from '../layout';
import {cairo, mono} from '../fonts';
import {Caption, Card, Scene, Tag, Title, ease, prog} from '../common';

const ROWS = [{n: 'لابتوب', v: 1500}, {n: 'شاشة', v: 1000}, {n: 'سماعة', v: 1000}, {n: 'كيبورد', v: 700}];
const RY = 190, RP = 92;

const Panel: React.FC<{box: typeof B.s2.rank; dense: boolean; t0: number}> = ({box, dense, t0}) => {
  const f = useCurrentFrame();
  const col = dense ? C.green : C.red;
  const ranks = dense ? [1, 2, 2, 3] : [1, 2, 2, 4];
  const gap = ease(prog(f, t0 + 300, t0 + 420)); // the missing rank 3 (RANK only)
  const fn = dense ? 'DENSE_RANK()' : 'RANK()';
  return (
    <Card box={box} accent={col} at={t0 === 0 ? 6 : 24}>
      <div style={{position: 'absolute', left: 28, top: 20, direction: 'ltr'}}><Tag color={col}>{fn}</Tag></div>
      <div style={{position: 'absolute', left: 28, right: 28, top: 62, direction: 'ltr', fontFamily: mono, fontWeight: 700, fontSize: 28, color: C.text, opacity: prog(f, t0 + 20, t0 + 60)}}>
        <span style={{color: col}}>{fn}</span> <span style={{color: C.pink}}>OVER</span>(<span style={{color: C.pink}}>ORDER BY</span> revenue <span style={{color: C.pink}}>DESC</span>)
      </div>
      <div style={{position: 'absolute', left: 28, right: 28, top: 148, display: 'flex', direction: 'ltr', fontFamily: mono, fontWeight: 700, fontSize: 22, color: C.dim}}>
        <span style={{width: 150}}>rank</span><span style={{width: 300}}>product</span><span>revenue</span>
      </div>
      {ROWS.map((r, i) => {
        const tied = i === 1 || i === 2;
        const st = prog(f, t0 + 60 + i * 50, t0 + 100 + i * 50);
        const extra = !dense && i === 3 ? gap * 34 : 0; // RANK: open a visible gap before row 4
        return (
          <div key={i} style={{position: 'absolute', left: 20, right: 20, top: RY + 30 + i * RP + extra, height: RP - 14, borderRadius: 16, display: 'flex', alignItems: 'center', gap: 20, padding: '0 20px', direction: 'ltr', background: tied ? 'rgba(245,158,11,0.10)' : C.panel2, border: `3px solid ${tied ? C.amber : C.line}`, opacity: prog(f, t0 + 10 + i * 8, t0 + 40 + i * 8)}}>
            <div style={{width: 100, height: 58, borderRadius: 14, background: col, opacity: st, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: mono, fontWeight: 700, fontSize: 38, color: C.bg, transform: `scale(${0.7 + 0.3 * st})`}}>{ranks[i]}</div>
            <span style={{width: 300, fontFamily: cairo, fontWeight: 900, fontSize: 32, color: C.text, direction: 'rtl', textAlign: 'left', marginLeft: 30}}>{r.n}</span>
            <span style={{flex: 1, textAlign: 'right', fontFamily: mono, fontWeight: 700, fontSize: 30, color: tied ? C.amber : C.text}}>${r.v.toLocaleString('en-US')}</span>
          </div>
        );
      })}
      {!dense && gap > 0 && (
        <div style={{position: 'absolute', left: 28, right: 28, top: RY + 30 + 3 * RP - 2, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, direction: 'ltr', opacity: gap, color: C.red, fontFamily: mono, fontWeight: 700, fontSize: 24, borderTop: `3px dashed ${C.red}`}}>
          <span style={{background: C.red, color: C.bg, borderRadius: 8, padding: '0 12px'}}>3 ✗</span><span>GAP</span>
        </div>
      )}
      <div style={{position: 'absolute', left: 28, right: 28, bottom: 26, textAlign: 'center', direction: 'rtl', fontFamily: cairo, fontWeight: 900, fontSize: 30, color: col, opacity: prog(f, t0 + (dense ? 360 : 400), t0 + (dense ? 420 : 460))}}>
        {dense ? 'نفس الرتبة للمتساويين، وتسلسل صلب بدون فجوات' : 'نفس الرتبة للمتساويين، لكن الرتبة 3 اختفت'}
      </div>
    </Card>
  );
};

export const Scene02: React.FC = () => (
  <Scene dur={S.s2.dur} accent={C.red}>
    <Title ar="معالجة القيم المتساوية" en="RANK() vs DENSE_RANK()" chip="SC 02 · TIES" accent={C.red} />
    <Panel box={B.s2.rank} dense={false} t0={0} />
    <Panel box={B.s2.dense} dense t0={700} />
    <Caption from={60} to={600} color={C.red}>RANK() ──► Same Rank for Ties, Leaves Gaps (1, 2, 2, 4)</Caption>
    <Caption from={720} to={1260} color={C.green}>DENSE_RANK() ──► Same Rank for Ties, NO Gaps (1, 2, 2, 3)</Caption>
  </Scene>
);
