import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, S} from '../theme';
import {B} from '../layout';
import {cairo, mono} from '../fonts';
import {Caption, Card, Defs, Scene, Tag, Title, ease, fs, prog} from '../common';

type Seg = [string, string];
const CODE: Seg[][] = [
  [['CREATE UNIQUE INDEX', C.purple], [' idx_users_email ', C.text], ['ON', C.pink], [' users(email);', C.text]],
  [['INSERT INTO', C.pink], [' users(email) ', C.text], ['VALUES', C.pink], [" ('ahmed@mail.com');", C.amber]],
];
const LEAVES = ['ahmed@mail.com', 'ali@mail.com', 'huda@mail.com', 'khaled@mail.com', 'mona@mail.com', 'sara@mail.com'];
const LX = [130, 370, 480, 720, 830, 1070];
const root = {x: 600, y: 100}, mids = [{x: 250, y: 240}, {x: 600, y: 240}, {x: 950, y: 240}], LY = 380;

export const Scene02: React.FC = () => {
  const f = useCurrentFrame();
  const K = B.s2.code, T = B.s2.tree, E = B.s2.err;
  const size = fs("INSERT INTO users(email) VALUES ('ahmed@mail.com');", K.w - 80, 44, mono);
  const total = CODE.reduce((a, l) => a + l.reduce((b, s) => b + s[0].length, 0), 0);
  let shown = Math.floor(prog(f, 20, 300) * total);
  const sRoot = prog(f, 360, 400), sMid = prog(f, 400, 440), sLeaf = prog(f, 440, 480);
  const hit = f >= 480;
  const alarm = hit ? 0.5 + 0.5 * Math.sin(f * 0.5) : 0;

  return (
    <Scene dur={S.s2.dur} accent={C.red}>
      <Title ar="آلية الفهرس الفريد" en="UNIQUE Index · O(log n) Check" chip="SC 02 · MECHANICS" accent={C.purple} />

      <Card box={K} accent={C.line} at={6}>
        {CODE.map((l, i) => (
          <div key={i} style={{position: 'absolute', left: 36, top: 26 + i * 70, height: 70, whiteSpace: 'pre', fontFamily: mono, fontWeight: 700, fontSize: size, direction: 'ltr'}}>
            {l.map((s, j) => { const take = Math.max(0, Math.min(s[0].length, shown)); shown -= s[0].length; return <span key={j} style={{color: s[1]}}>{s[0].slice(0, take)}</span>; })}
          </div>
        ))}
      </Card>

      <Card box={T} accent={C.purple} at={300}>
        <div style={{position: 'absolute', left: 24, top: 18, direction: 'ltr'}}><Tag color={C.purple}>B-TREE · users.email</Tag></div>
        <svg width={T.w} height={T.h} style={{position: 'absolute', inset: 0}}>
          <Defs />
          {mids.map((m, i) => (<line key={'a' + i} x1={root.x} y1={root.y + 26} x2={m.x} y2={m.y - 26} stroke={i === 0 && sMid > 0 ? C.amber : C.line} strokeWidth={i === 0 && sMid > 0 ? 6 : 3} />))}
          {LX.map((x, i) => (<line key={'b' + i} x1={mids[Math.floor(i / 2)].x} y1={mids[Math.floor(i / 2)].y + 26} x2={x} y2={LY - 28} stroke={i === 0 && sLeaf > 0 ? C.amber : C.line} strokeWidth={i === 0 && sLeaf > 0 ? 6 : 3} />))}
          <rect x={root.x - 70} y={root.y - 26} width={140} height={52} rx={12} fill={C.bg2} stroke={sRoot > 0 ? C.amber : C.line} strokeWidth={sRoot > 0 ? 5 : 3} filter={sRoot > 0 ? 'url(#glow)' : undefined} />
          <text x={root.x} y={root.y + 9} textAnchor="middle" fontFamily={mono} fontSize={24} fontWeight={700} fill={C.dim}>root</text>
          {mids.map((m, i) => (<rect key={i} x={m.x - 60} y={m.y - 26} width={120} height={52} rx={12} fill={C.bg2} stroke={i === 0 && sMid > 0 ? C.amber : C.line} strokeWidth={i === 0 && sMid > 0 ? 5 : 3} />))}
          {LEAVES.map((e, i) => {
            const on = i === 0 && sLeaf > 0;
            return (
              <g key={i}>
                <rect x={LX[i] - 100} y={LY - 28} width={200} height={56} rx={12} fill={on && hit ? `rgba(239,68,68,${0.15 + 0.15 * alarm})` : C.bg2} stroke={on ? (hit ? C.red : C.amber) : C.line} strokeWidth={on ? 5 : 3} filter={on ? 'url(#glow)' : undefined} />
                <text x={LX[i]} y={LY + 7} textAnchor="middle" fontFamily={mono} fontSize={19} fontWeight={700} fill={C.text}>{e}</text>
              </g>
            );
          })}
        </svg>
        <div style={{position: 'absolute', left: 24, right: 24, bottom: 10, textAlign: "center", direction: "rtl", fontFamily: cairo, fontWeight: 900, fontSize: 28, color: C.purple, opacity: prog(f, 500, 560)}}>3 قفزات بس ← من غير مسح الجدول كله</div>
      </Card>

      <Card box={E} accent={hit ? C.red : C.line} at={340}>
        <div style={{position: 'absolute', left: 24, top: 18, direction: 'ltr'}}><Tag color={hit ? C.red : C.dim}>{hit ? 'DUPLICATE REJECTED' : 'CHECKING…'}</Tag></div>
        <div style={{position: 'absolute', left: 24, right: 24, top: 74, direction: 'ltr', opacity: prog(f, 480, 520), fontFamily: mono, fontWeight: 700, fontSize: 25, color: C.red, lineHeight: 1.45}}>ERROR: duplicate key value violates unique constraint "idx_users_email"</div>
        <div style={{position: 'absolute', left: 24, right: 24, top: 240, direction: 'ltr', opacity: prog(f, 520, 560), fontFamily: mono, fontWeight: 700, fontSize: 21, color: C.dim, lineHeight: 1.45}}>DETAIL: Key (email)=(ahmed@mail.com) already exists.</div>
        <div style={{position: 'absolute', left: 24, right: 24, bottom: 26, direction: 'rtl', opacity: prog(f, 560, 620)}}>
          <div style={{fontFamily: mono, fontWeight: 700, fontSize: 30, color: C.green, textAlign: 'center', direction: 'ltr'}}>O(log n) ✓</div>
          <div style={{fontFamily: cairo, fontWeight: 900, fontSize: 26, color: C.text, textAlign: 'center', marginTop: 4}}>حماية مادية على مستوى الجدول</div>
        </div>
      </Card>

      <Caption from={60} to={600} color={C.purple}>CREATE UNIQUE INDEX ──► Fast O(log n) Duplicate Prevention</Caption>
      <Caption from={720} to={1260} color={C.red}>ERROR: duplicate key value violates unique constraint</Caption>
    </Scene>
  );
};
