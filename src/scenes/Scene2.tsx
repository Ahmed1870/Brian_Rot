import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Chip, Mix, Sql, Stage, TopBadge, Win, clamp, lin, pop, sec, typed} from '../kit';
import {LEVELS} from '../data';

// SC02 (40-85s): anatomy - Anchor, UNION ALL, Recursive member.
// Anchors (s): 41.3 three parts | 46.5 part one | 51.1 anchor | 58.5 UNION ALL | 61.6 part three | 65.9 recursive JOIN | 74.4 repeats level by level
const S = START.s2;
const t = (g: number) => sec(g - S);
const LINES: {text: string; role: 'anchor' | 'union' | 'rec' | null}[] = [
  {text: 'WITH RECURSIVE emp_hierarchy AS (', role: null},
  {text: '  SELECT emp_id, name, manager_id, 1 AS level', role: 'anchor'},
  {text: '  FROM employees WHERE manager_id IS NULL', role: 'anchor'},
  {text: '  UNION ALL', role: 'union'},
  {text: '  SELECT e.emp_id, e.name, e.manager_id, h.level + 1', role: 'rec'},
  {text: '  FROM employees e', role: 'rec'},
  {text: '  JOIN emp_hierarchy h ON e.manager_id = h.emp_id', role: 'rec'},
  {text: ')', role: null},
  {text: 'SELECT * FROM emp_hierarchy;', role: null},
];
const COL = {anchor: C.blue, union: C.amber, rec: C.purple};
const AT = {anchor: 51.1, union: 58.5, rec: 65.9};

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const vis = typed(LINES.map((l) => l.text).join('\n'), f, t(41.3), 1.1).split('\n');
  const roleOn = (r: 'anchor' | 'union' | 'rec') => clamp(lin(f, t(AT[r]), 14));
  const pulse = (r: 'anchor' | 'union' | 'rec') => {
    const d = f - t(AT[r]);
    return d >= 0 && d < 40 ? Math.sin((d / 40) * Math.PI) : 0;
  };
  const labels: {r: 'anchor' | 'union' | 'rec'; text: string; sub: string}[] = [
    {r: 'anchor', text: '① Anchor Member', sub: 'root seed · runs once'},
    {r: 'union', text: '② UNION ALL', sub: 'accumulative merge'},
    {r: 'rec', text: '③ Recursive Member', sub: 'JOIN with previous step'},
  ];
  return (
    <Stage dur={1350} inFx="left" outFx="left">
      <TopBadge text="التشريح البنيوي | Anchor · UNION ALL · Recursive" from={sec(1)} to={sec(40)} color={C.purple} />

      <Win x={80} y={180} w={1100} h={540} title="Recursive CTE anatomy">
        <div dir="ltr" style={{position: 'absolute', inset: 0, background: C.deep, padding: '18px 22px', fontFamily: MONO, fontSize: 26}}>
          {LINES.map((l, i) => {
            const v = vis[i] ?? '';
            const on = l.role ? roleOn(l.role) : 0;
            const col = l.role ? COL[l.role] : C.text;
            const pu = l.role ? pulse(l.role) : 0;
            return (
              <div key={i} style={{display: 'flex', minHeight: 46, alignItems: 'center', borderRadius: 8, background: on > 0.1 ? `${col}${pu > 0.3 ? '44' : '22'}` : 'transparent', borderLeft: `6px solid ${on > 0.1 ? col : 'transparent'}`, paddingLeft: 10}}>
                <span style={{color: '#475569', width: 40, flexShrink: 0}}>{i + 1}</span>
                <span style={{whiteSpace: 'pre', color: on > 0.1 ? col : C.text, fontWeight: on > 0.1 ? 700 : 400}}>{on > 0.1 ? v : <Sql text={v} />}</span>
              </div>
            );
          })}
        </div>
      </Win>

      <div style={{position: 'absolute', left: 1220, top: 190, width: 620, display: 'flex', flexDirection: 'column', gap: 14}}>
        {labels.map((lb) => {
          const p = clamp(pop(f, t(AT[lb.r])));
          return (
            <div key={lb.r} dir="ltr" style={{boxSizing: 'border-box', height: 96, borderRadius: 18, border: `3px solid ${COL[lb.r]}`, background: `${COL[lb.r]}18`, padding: '12px 24px', opacity: p, transform: `translateX(${(1 - p) * 40}px)`, fontFamily: MONO}}>
              <div style={{fontSize: 30, fontWeight: 700, color: COL[lb.r]}}>{lb.text}</div>
              <div style={{fontSize: 22, color: C.muted, marginTop: 4}}>{lb.sub}</div>
            </div>
          );
        })}
      </div>

      <Win x={1220} y={520} w={620} h={360} title="iterations" accent={C.green} opacity={clamp(lin(f, t(74.4), 14))}>
        {LEVELS.map((lv, i) => {
          const p = clamp(pop(f, t(74.4 + i * 1.7)));
          return (
            <div key={i} dir="ltr" style={{position: 'absolute', left: 20, right: 20, top: 14 + i * 74, height: 64, display: 'flex', alignItems: 'center', gap: 14, fontFamily: MONO, opacity: p, transform: `translateX(${(1 - p) * 30}px)`}}>
              <span style={{width: 150, fontSize: 24, color: C.green, fontWeight: 700}}>level {i + 1}</span>
              {lv.map((e) => <Chip key={e.id} color={C.green} style={{fontSize: 22, padding: '4px 14px'}}>{e.name}</Chip>)}
            </div>
          );
        })}
      </Win>
      <div dir="ltr" style={{position: 'absolute', left: 80, top: 760, width: 1100, display: 'flex', justifyContent: 'center', opacity: clamp(lin(f, t(76), 14))}}>
        <Chip color={C.green} style={{fontSize: 26}}>repeat until the recursive part returns no rows</Chip>
      </div>
      <Caption text="Anchor Member (Initial Query) ──► Sets the Root Seed of Recursion" from={t(46)} to={t(58)} />
      <Caption text="Recursive Member + UNION ALL ──► Joins Previous Iteration to Child Rows" from={t(63)} to={sec(44)} tone="ok" />
    </Stage>
  );
};
