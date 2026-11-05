import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Chip, Editor, Sql, Stage, TopBadge, Win, clamp, lin, pop, sec} from '../kit';

// SC02 (40-85s): FILTER (WHERE ...) vs CASE WHEN inside aggregates.
// Anchors (s): 41.4 big advantage | 53.4 instead of writing | 58.1 you write cleanly | 63.3 saves length | 71.5 COUNT/AVG/MAX | 75.8 horizontal reports
const S = START.s2;
const t = (g: number) => sec(g - S);
const LEGACY = "SUM(CASE WHEN status = 'shipped' THEN amount ELSE 0 END)";
const MODERN = "SUM(amount) FILTER (WHERE status = 'shipped')";

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const shrink = clamp(lin(f, t(58.1), 22));
  const bars = clamp(lin(f, t(63.3), 24));
  return (
    <Stage dur={1350} inFx="left" outFx="up">
      <TopBadge text="المعامل المعياري | FILTER (WHERE ...) vs CASE WHEN" from={sec(1)} to={sec(40)} color={C.green} />

      <div style={{position: 'absolute', left: 0, right: 0, top: 160, display: 'flex', justifyContent: 'center', opacity: clamp(lin(f, t(41.4), 14))}}>
        <Chip color={C.blue} style={{fontSize: 26}}>FILTER (WHERE condition) · Standard SQL</Chip>
      </div>

      <div style={{position: 'absolute', left: 80, top: 230, width: 860, height: 280, transform: `scale(${1 - 0.06 * shrink})`, transformOrigin: 'center', opacity: clamp(lin(f, t(50), 14)) * (1 - 0.25 * shrink)}}>
        <Editor x={0} y={0} w={860} h={280} title="Legacy · CASE WHEN" lines={['SUM(CASE WHEN status = \'shipped\'', '    THEN amount', '    ELSE 0 END)']} start={t(53.4)} cps={1.0} size={28} accent={C.amber} hl={0} hlColor={C.amber} />
      </div>
      <div style={{position: 'absolute', left: 980, top: 230, width: 860, height: 280, transform: `scale(${0.94 + 0.06 * shrink})`, transformOrigin: 'center', opacity: clamp(lin(f, t(56.5), 14))}}>
        <Editor x={0} y={0} w={860} h={280} title="Modern · FILTER" lines={['SUM(amount)', "  FILTER (WHERE status = 'shipped')"]} start={t(58.1)} cps={1.0} size={28} accent={C.green} hl={1} hlColor={C.green} />
      </div>

      {/* length bars */}
      <div dir="ltr" style={{position: 'absolute', left: 80, top: 545, width: 1760, fontFamily: MONO, opacity: bars}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 20, height: 46}}>
          <span style={{width: 150, fontSize: 24, color: C.amber}}>legacy</span>
          <div style={{height: 30, width: LEGACY.length * 18 * bars, borderRadius: 8, background: `${C.amber}aa`}} />
          <span style={{fontSize: 24, color: C.amber}}>{LEGACY.length} chars</span>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 20, height: 46}}>
          <span style={{width: 150, fontSize: 24, color: C.green}}>FILTER</span>
          <div style={{height: 30, width: MODERN.length * 18 * bars, borderRadius: 8, background: C.green, boxShadow: `0 0 18px ${C.green}88`}} />
          <span style={{fontSize: 24, color: C.green}}>{MODERN.length} chars · clearer</span>
        </div>
      </div>

      {/* works with every aggregate */}
      {['COUNT(*) FILTER (WHERE status = \'shipped\')', 'AVG(amount) FILTER (WHERE status = \'shipped\')', 'MAX(amount) FILTER (WHERE status = \'shipped\')'].map((c, i) => {
        const p = clamp(pop(f, t(71.5 + i * 1.2)));
        return (
          <div key={i} dir="ltr" style={{boxSizing: 'border-box', position: 'absolute', left: 80 + i * 600, top: 690, width: 560, height: 96, borderRadius: 18, border: `3px solid ${C.green}`, background: `${C.green}14`, padding: '0 20px', display: 'flex', alignItems: 'center', fontFamily: MONO, fontSize: 18, opacity: p, transform: `translateY(${(1 - p) * 24}px)`, whiteSpace: 'nowrap'}}>
            <Sql text={c} />
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 0, right: 0, top: 820, display: 'flex', justifyContent: 'center', opacity: clamp(pop(f, t(75.8)))}}>
        <Chip color={C.green} style={{fontSize: 28, padding: '10px 30px'}}>✓ detailed horizontal comparison reports</Chip>
      </div>

      <Caption text={'Legacy: ' + LEGACY} from={t(50)} to={t(58)} />
      <Caption text={'Modern SQL Standard: ' + MODERN} from={t(60)} to={sec(44)} tone="ok" />
    </Stage>
  );
};
