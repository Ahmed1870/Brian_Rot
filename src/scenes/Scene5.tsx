import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Check, Chip, Editor, Stage, TopBadge, Win, clamp, lin, pop, sec} from '../kit';
import {EMPS, pathOf} from '../data';

// SC05 (170-209s): auto-indented org chart + breadcrumb path.
// Anchors (s): 171.2 enterprise | 182.1 org tree with indentation | 188.2 full path | 193.1 executive tool | 199.8 product sequence tracking
const S = START.s5;
const t = (g: number) => sec(g - S);

export const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  const seal = clamp(pop(f, t(193.1)));
  const hdr = clamp(lin(f, t(182.1), 14));
  return (
    <Stage dur={1170} inFx="morph" outFx="fade">
      <TopBadge text="الهيكل الإداري | Org Chart & Path Tracking" from={sec(1)} to={sec(36)} color={C.green} />

      <Editor x={80} y={170} w={1190} h={320} title="Query Editor" lines={['WITH RECURSIVE org_tree AS (', '  SELECT emp_id, name, manager_id, 1 AS level, name AS path', '  FROM employees WHERE manager_id IS NULL', '  UNION ALL', "  SELECT e.emp_id, e.name, e.manager_id, t.level + 1, t.path || ' > ' || e.name", '  FROM employees e JOIN org_tree t ON e.manager_id = t.emp_id', ')', "SELECT REPEAT('  ', level - 1) || '+- ' || name AS visual_tree, path FROM org_tree;"]} start={t(171.2)} cps={1.5} size={19} hl={f >= t(188.2) ? 4 : f >= t(182.1) ? 7 : -1} hlColor={C.green} />

      <div dir="ltr" style={{position: 'absolute', left: 1320, top: 190, display: 'flex', alignItems: 'center', gap: 14, opacity: seal, transform: `scale(${0.85 + 0.15 * seal}) rotate(-3deg)`, background: C.card, border: `3px solid ${C.green}`, borderRadius: 18, padding: '10px 26px', fontFamily: MONO, fontSize: 28, fontWeight: 700, color: C.green}}>
        <Check p={seal} size={42} /> HIERARCHY APPROVED
      </div>
      <div style={{position: 'absolute', left: 1320, top: 300, opacity: clamp(pop(f, t(188.2)))}}><Chip color={C.purple} style={{fontSize: 24}}>breadcrumb · full lineage</Chip></div>
      <div style={{position: 'absolute', left: 1320, top: 366, opacity: clamp(pop(f, t(199.8)))}}><Chip color={C.amber} style={{fontSize: 24}}>product &amp; logistics trees</Chip></div>

      <Win x={80} y={510} w={1760} h={400} title="org_chart_report" accent={C.green}>
        <div dir="ltr" style={{position: 'absolute', left: 30, right: 30, top: 0, height: 44, display: 'flex', alignItems: 'center', fontFamily: MONO, fontSize: 24, fontWeight: 700, opacity: hdr}}>
          <span style={{width: 520, color: C.muted}}>visual_tree</span>
          <span style={{color: C.muted}}>path</span>
        </div>
        {EMPS.map((e, i) => {
          const p = clamp(lin(f, t(182.1 + i * 0.6), 12));
          const pp = clamp(lin(f, t(188.2 + i * 0.5), 12));
          return (
            <div key={e.id} dir="ltr" style={{position: 'absolute', left: 30, right: 30, top: 46 + i * 36, height: 34, display: 'flex', alignItems: 'center', fontFamily: MONO, fontSize: 24}}>
              <span style={{width: 520, whiteSpace: 'pre', color: C.text, opacity: p, transform: `translateX(${(1 - p) * 30}px)`}}>
                {'  '.repeat(e.lvl)}<span style={{color: C.green}}>└─ </span>{e.name}
              </span>
              <span style={{color: C.purple, opacity: pp, transform: `translateX(${(1 - pp) * 30}px)`}}>{pathOf(e).join(' → ')}</span>
            </div>
          );
        })}
      </Win>
      <Caption text="Enterprise Hierarchies ──► Org Chart & Visual Product Category Tree" from={t(173)} to={t(187)} />
      <Caption text="Path Tracking ──► Generates Full Lineage & Breadcrumb Paths" from={t(190)} to={sec(37.5)} tone="ok" />
    </Stage>
  );
};
