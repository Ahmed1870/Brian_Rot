import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Chip, Editor, Stage, TopBadge, Win, clamp, lerp, lin, pop, sec} from '../kit';
import {XTAB} from '../data';

// SC03 (85-130s): tablefunc + crosstab().
// Anchors (s): 86.2 when reports need | 94.2 tablefunc | 100.4 crosstab takes a query | 103.9 row/column/value | 107.6 passes into engine | 115.3 golden option | 123.2 no manual lines
const S = START.s3;
const t = (g: number) => sec(g - S);
const SRC = XTAB.flatMap((r) => [
  {b: r.branch, c: 'electronics', v: r.elec},
  {b: r.branch, c: 'clothing', v: r.cloth},
]);

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const hot = (g: number) => clamp(lin(f, t(g), 10));
  const out = clamp(lin(f, t(110.5), 20));
  const ext = clamp(pop(f, t(94.2)));
  return (
    <Stage dur={1350} inFx="up" outFx="down">
      <TopBadge text="الجداول التقاطعية | Cross-tabulation with crosstab" from={sec(1)} to={sec(40)} color={C.purple} />

      <Editor x={80} y={170} w={1010} h={310} title="Query Editor" lines={['CREATE EXTENSION tablefunc;', 'SELECT * FROM crosstab(', "  'SELECT branch, category, SUM(amount)", "   FROM sales GROUP BY 1, 2 ORDER BY 1, 2'", ') AS ct(branch TEXT, electronics NUMERIC, clothing NUMERIC);']} start={t(90)} cps={1.0} size={23} hl={f > t(100.4) ? 1 : f > t(94.2) ? 0 : -1} hlColor={C.purple} />
      <div style={{position: 'absolute', left: 1150, top: 200, opacity: ext, transform: `scale(${0.85 + 0.15 * ext})`}}>
        <Chip color={C.purple} style={{fontSize: 30, padding: '10px 28px'}}>tablefunc ✓ enabled</Chip>
      </div>
      <div style={{position: 'absolute', left: 1150, top: 290, opacity: clamp(pop(f, t(100.4)))}}>
        <Chip color={C.blue} style={{fontSize: 26}}>crosstab(source_sql)</Chip>
      </div>
      <div style={{position: 'absolute', left: 1150, top: 370, opacity: clamp(pop(f, t(115.3)))}}>
        <Chip color={C.purple} style={{fontSize: 26}}>★ the golden option</Chip>
      </div>

      {/* source: 3 columns */}
      <Win x={80} y={510} w={620} h={400} title="source query · 3 columns" opacity={clamp(lin(f, t(100.4), 14))}>
        <div dir="ltr" style={{position: 'absolute', left: 0, right: 0, top: 0, height: 50, display: 'flex', alignItems: 'center', padding: '0 24px', fontFamily: MONO, fontSize: 22, fontWeight: 700}}>
          <span style={{width: 170, color: hot(103.9) > 0.3 ? C.blue : C.muted}}>row name</span>
          <span style={{width: 210, color: hot(105.2) > 0.3 ? C.amber : C.muted}}>column name</span>
          <span style={{color: hot(106.4) > 0.3 ? C.green : C.muted}}>value</span>
        </div>
        {SRC.map((r, i) => {
          const sent = f >= t(107.6 + i * 0.4) + 20;
          return (
            <div key={i} dir="ltr" style={{position: 'absolute', left: 12, right: 12, top: 54 + i * 48, height: 44, display: 'flex', alignItems: 'center', padding: '0 12px', fontFamily: MONO, fontSize: 23, opacity: sent ? 0.3 : 1, color: C.text}}>
              <span style={{width: 170}}>{r.b}</span><span style={{width: 210}}>{r.c}</span><span>{r.v}</span>
            </div>
          );
        })}
      </Win>

      {/* crosstab engine */}
      <div style={{position: 'absolute', left: 735, top: 600, width: 220, height: 240}}>
        <svg width={220} height={240} viewBox="0 0 220 240" style={{filter: `drop-shadow(0 0 ${14 + 10 * Math.sin(f * 0.2)}px ${C.purple})`}}>
          <path d="M20 40 V190 C20 222 200 222 200 190 V40" fill={`${C.purple}22`} stroke={C.purple} strokeWidth={6} />
          <ellipse cx={110} cy={40} rx={90} ry={26} fill={C.card} stroke={C.purple} strokeWidth={6} />
          <text x={110} y={140} textAnchor="middle" fill={C.text} fontFamily={MONO} fontSize={26} fontWeight={700}>crosstab</text>
          <text x={110} y={172} textAnchor="middle" fill={C.purple} fontFamily={MONO} fontSize={20}>pivot engine</text>
        </svg>
      </div>
      {SRC.map((r, i) => {
        const p = lin(f, t(107.6 + i * 0.4), 20);
        if (p <= 0 || p >= 1) return null;
        const e = p * p * (3 - 2 * p);
        return (
          <div key={i} dir="ltr" style={{position: 'absolute', left: lerp(560, 810, e) - 40, top: lerp(560 + i * 48, 700, e) - 18, width: 80, height: 36, borderRadius: 18, background: C.purple, color: C.text, fontFamily: MONO, fontWeight: 700, fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{r.v}</div>
        );
      })}

      {/* output matrix */}
      <Win x={1000} y={510} w={840} h={400} title="pivot matrix · crosstab output" accent={C.purple} opacity={out}>
        <div dir="ltr" style={{position: 'absolute', left: 20, right: 20, top: 0, height: 52, display: 'flex', alignItems: 'center', fontFamily: MONO, fontSize: 26, fontWeight: 700}}>
          <span style={{width: 250, color: C.muted}}>branch</span><span style={{width: 270, color: C.purple}}>electronics</span><span style={{color: C.purple}}>clothing</span>
        </div>
        {XTAB.map((r, i) => {
          const p = clamp(pop(f, t(111.2 + i * 0.7)));
          return (
            <div key={r.branch} dir="ltr" style={{position: 'absolute', left: 20, right: 20, top: 62 + i * 90, height: 76, display: 'flex', alignItems: 'center', fontFamily: MONO, fontSize: 34, fontWeight: 700, color: C.text, opacity: p, transform: `scale(${0.92 + 0.08 * p})`}}>
              <span style={{width: 250}}>{r.branch}</span>
              <span style={{width: 250, textAlign: 'center', border: `3px solid ${C.purple}`, borderRadius: 12, background: `${C.purple}22`, boxShadow: `0 0 18px ${C.purple}66`, marginRight: 20}}>{r.elec}</span>
              <span style={{width: 250, textAlign: 'center', border: `3px solid ${C.purple}`, borderRadius: 12, background: `${C.purple}22`, boxShadow: `0 0 18px ${C.purple}66`}}>{r.cloth}</span>
            </div>
          );
        })}
      </Win>
      <div style={{position: 'absolute', right: 80, top: 922, opacity: 0}} />
      <Caption text="CREATE EXTENSION tablefunc; ──► Enables Advanced Cross-tabulation" from={t(92)} to={t(104)} />
      <Caption text="crosstab(source_sql) ──► Automatic Multi-Dimensional Matrix Pivoting" from={t(108)} to={sec(44)} tone="ok" />
    </Stage>
  );
};
