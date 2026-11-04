import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, S} from '../theme';
import {B} from '../layout';
import {cairo, mono} from '../fonts';
import {Caption, Card, Defs, Scene, Title, fs, prog} from '../common';

type Seg = [string, string];
const CODE: Seg[][] = [
  [['SELECT', C.pink], [' emp.name, mgr.name, dir.name', C.text]],
  [['FROM', C.pink], [' employees ', C.text], ['emp', C.blue]],
  [['LEFT JOIN', C.pink], [' employees ', C.text], ['mgr', C.green]],
  [['  ON', C.pink], [' emp.manager_id = mgr.employee_id', C.text]],
  [['LEFT JOIN', C.pink], [' employees ', C.text], ['dir', C.purple]],
  [['  ON', C.pink], [' mgr.manager_id = dir.employee_id;', C.text]],
];
// tree nodes (relative to the tree card)
const NW = 170, NH = 80;
const NODES = [
  {id: 'd', n: 'أحمد', r: 'dir', x: 450, y: 100, c: C.purple, lvl: 0},
  {id: 'm1', n: 'سارة', r: 'mgr', x: 250, y: 300, c: C.green, lvl: 1, p: 'd'},
  {id: 'm2', n: 'خالد', r: 'mgr', x: 650, y: 300, c: C.green, lvl: 1, p: 'd'},
  {id: 'e1', n: 'كريم', r: 'emp', x: 130, y: 500, c: C.blue, lvl: 2, p: 'm1'},
  {id: 'e2', n: 'ليلى', r: 'emp', x: 370, y: 500, c: C.blue, lvl: 2, p: 'm1'},
  {id: 'e3', n: 'منى', r: 'emp', x: 530, y: 500, c: C.blue, lvl: 2, p: 'm2'},
  {id: 'e4', n: 'هدى', r: 'emp', x: 770, y: 500, c: C.blue, lvl: 2, p: 'm2'},
];
const at = (l: number) => 450 + l * 120; // level reveal frames
const PATH = ['e1', 'm1', 'd'];

export const Scene04: React.FC = () => {
  const f = useCurrentFrame();
  const K = B.s4.code, T = B.s4.tree;
  const size = fs('SELECT emp.name, mgr.name, dir.name', K.w - 70, 32, mono);
  const total = CODE.reduce((a, l) => a + l.reduce((b, s) => b + s[0].length, 0), 0);
  let shown = Math.floor(prog(f, 20, 420) * total);
  const trace = prog(f, 800, 1000);
  const byId = (id: string) => NODES.find((n) => n.id === id)!;

  return (
    <Scene dur={S.s4.dur} accent={C.purple}>
      <Title ar="التتبع الشجري متعدد المستويات" en="Multi-Level SELF JOIN" chip="SC 04 · TREE" accent={C.purple} />

      <Card box={K} accent={C.line} at={6}>
        {CODE.map((l, i) => (
          <div key={i} style={{position: 'absolute', left: 30, top: 40 + i * 62, height: 62, whiteSpace: 'pre', fontFamily: mono, fontWeight: 700, fontSize: size, direction: 'ltr'}}>
            {l.map((s, j) => { const take = Math.max(0, Math.min(s[0].length, shown)); shown -= s[0].length; return <span key={j} style={{color: s[1]}}>{s[0].slice(0, take)}</span>; })}
          </div>
        ))}
        <div style={{position: 'absolute', left: 30, right: 30, top: 460, display: 'flex', gap: 16, direction: 'ltr', opacity: prog(f, 420, 470)}}>
          {[['emp', 'موظف', C.blue], ['mgr', 'مدير مباشر', C.green], ['dir', 'مدير قطاع', C.purple]].map(([k, ar, c]) => (
            <div key={k} style={{flex: 1, borderRadius: 14, border: `3px solid ${c}`, background: C.panel2, padding: '10px 8px', textAlign: 'center'}}>
              <div style={{fontFamily: mono, fontWeight: 700, fontSize: 26, color: c}}>{k}</div>
              <div style={{fontFamily: cairo, fontWeight: 700, fontSize: 24, color: C.text}}>{ar}</div>
            </div>
          ))}
        </div>
        <div style={{position: 'absolute', left: 30, right: 30, bottom: 28, direction: 'rtl', fontFamily: cairo, fontWeight: 900, fontSize: 30, color: C.purple, opacity: prog(f, 800, 860)}}>تكرار الربط الذاتي = مستوى إداري جديد</div>
      </Card>

      <Card box={T} accent={C.purple} at={440} />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <Defs />
        {NODES.filter((n) => n.p).map((n) => {
          const p = byId(n.p!);
          const t = prog(f, at(n.lvl) - 30, at(n.lvl) + 20);
          const hot = trace > 0 && PATH.includes(n.id) && PATH.includes(n.p!);
          return <line key={n.id} x1={T.x + p.x} y1={T.y + p.y + NH / 2} x2={T.x + p.x + (n.x - p.x) * t} y2={T.y + p.y + NH / 2 + (n.y - p.y - NH) * t} stroke={hot ? C.amber : C.dim} strokeWidth={hot ? 7 : 3} opacity={t > 0 ? 1 : 0} filter={hot ? 'url(#glow)' : undefined} />;
        })}
        {NODES.map((n) => {
          const o = prog(f, at(n.lvl), at(n.lvl) + 30);
          const hot = trace > 0 && PATH.includes(n.id);
          return (
            <g key={n.id} opacity={o} filter={hot ? 'url(#glow)' : undefined}>
              <rect x={T.x + n.x - NW / 2} y={T.y + n.y - NH / 2} width={NW} height={NH} rx={18} fill={C.bg2} stroke={hot ? C.amber : n.c} strokeWidth={hot ? 6 : 4} />
              <text x={T.x + n.x} y={T.y + n.y + 4} textAnchor="middle" fontFamily={cairo} fontSize={30} fontWeight={900} fill={C.text}>{n.n}</text>
              <text x={T.x + n.x} y={T.y + n.y + 30} textAnchor="middle" fontFamily={mono} fontSize={20} fontWeight={700} fill={n.c}>{n.r}</text>
            </g>
          );
        })}
      </svg>
      <div style={{position: 'absolute', left: T.x + 30, top: T.y + T.h - 78, width: T.w - 60, textAlign: 'center', direction: 'rtl', fontFamily: cairo, fontWeight: 900, fontSize: 32, color: C.amber, opacity: trace}}>كريم ➔ سارة ➔ أحمد</div>

      <Caption from={60} to={540} color={C.purple}>Multi-Level SELF JOIN ──► Employee ➔ Direct Manager ➔ Department Director</Caption>
      <Caption from={660} to={1080} color={C.green}>Hierarchical Tree ──► Navigates Multi-Tier Organizational Structures</Caption>
    </Scene>
  );
};
