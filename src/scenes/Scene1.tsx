import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {Caption, Chip, Stage, TopBadge, clamp, lerp, lin, pop, sec} from '../kit';
import {EMPS, byId} from '../data';

// SC01 (0-40s): WITH RECURSIVE grows an org tree level by level.
// Anchors (s): 1.2 welcome | 6.4 so far flat data | 10.8 hierarchical data | 15.0 org structure | 17.9 category tree | 21.4 WITH RECURSIVE | 27.1 self-reading table | 33.4 all levels
const S = START.s1;
const t = (g: number) => sec(g - S);
const LV = [270, 430, 590, 750];
const GROW = [6.4, 27.1, 30.2, 33.4];
const NW = 200;
const NH = 76;

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const ghost = clamp(lin(f, t(10.8), 24));
  const pistonOn = clamp(lin(f, t(21.4), 18));
  const pistonY = f < t(27.1) ? lerp(190, LV[0], clamp(lin(f, t(21.4), 24))) : lerp(LV[0], LV[3], clamp(lin(f, t(27.1), sec(8.4))));
  return (
    <Stage dur={1200} inFx="zoom" outFx="left">
      <TopBadge text="التعبيرات التكرارية | Advanced Recursive CTEs (WITH RECURSIVE)" from={sec(2)} to={sec(18)} color={C.blue} />

      <div style={{position: 'absolute', left: 1330, top: 184, opacity: clamp(pop(f, t(15.0)))}}><Chip color={C.blue} style={{fontSize: 24}}>Org chart</Chip></div>
      <div style={{position: 'absolute', left: 1560, top: 184, opacity: clamp(pop(f, t(17.9)))}}><Chip color={C.amber} style={{fontSize: 24}}>Category tree</Chip></div>

      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        {EMPS.filter((e) => e.mgr !== null).map((e) => {
          const p = byId(e.mgr as number);
          const g = clamp(lin(f, t(GROW[e.lvl]), 22));
          const x1 = p.x;
          const y1 = LV[p.lvl] + NH / 2;
          const x2 = e.x;
          const y2 = LV[e.lvl] - NH / 2;
          return (
            <g key={e.id}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.border} strokeWidth={3} strokeDasharray="8 8" opacity={ghost} />
              <line x1={x1} y1={y1} x2={lerp(x1, x2, g)} y2={lerp(y1, y2, g)} stroke={C.green} strokeWidth={5} strokeLinecap="round" style={{filter: `drop-shadow(0 0 8px ${C.green})`}} />
            </g>
          );
        })}
        {[0, 1, 2, 3].map((l) => (
          <text key={l} x={1700} y={LV[l] + 8} fill={C.muted} fontFamily={MONO} fontSize={26} opacity={clamp(lin(f, t(GROW[l] + 0.5), 14))}>level {l + 1}</text>
        ))}
      </svg>

      {EMPS.map((e) => {
        const root = e.lvl === 0;
        const on = clamp(lin(f, t(GROW[e.lvl] + (root ? 0 : 0.8)), 14));
        const vis = root ? clamp(lin(f, t(6.4), 14)) : Math.max(ghost * 0.55, on);
        const col = root ? C.blue : on > 0.2 ? C.green : C.border;
        return (
          <div key={e.id} dir="ltr" style={{position: 'absolute', left: e.x - NW / 2, top: LV[e.lvl] - NH / 2, width: NW, height: NH, borderRadius: 16, border: `3px ${on > 0.2 || root ? 'solid' : 'dashed'} ${col}`, background: on > 0.2 || root ? `${col}22` : 'transparent', boxShadow: on > 0.2 || root ? `0 0 ${24 * (root ? 1 : on)}px ${col}88` : 'none', opacity: vis, transform: `scale(${0.85 + 0.15 * vis})`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, color: C.text}}>
            <div style={{fontSize: 28, fontWeight: 700}}>{on > 0.2 || root ? e.name : '?'}</div>
            <div style={{fontSize: 20, color: on > 0.2 || root ? col : C.muted}}>{on > 0.2 || root ? e.role : 'child'}</div>
          </div>
        );
      })}

      <div dir="ltr" style={{position: 'absolute', left: 80, top: pistonY - 38, width: 250, height: 76, borderRadius: 14, background: `${C.green}22`, border: `3px solid ${C.green}`, boxShadow: `0 0 26px ${C.green}88`, opacity: pistonOn, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: MONO, fontSize: 21, fontWeight: 700, color: C.green}}>
        ⟳ WITH RECURSIVE
      </div>
      <Caption text="WITH RECURSIVE tree AS (...) ──► Navigates Hierarchical & Graph Structures" from={sec(22)} to={sec(38)} />
    </Stage>
  );
};
