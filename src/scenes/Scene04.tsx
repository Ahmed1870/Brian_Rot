import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, S} from '../theme';
import {B} from '../layout';
import {cairo, mono} from '../fonts';
import {Caption, Card, Scene, Tag, Title, ease, fs, prog} from '../common';

type Seg = [string, string];
const CODE: {segs: Seg[]; hot?: [number, number, string]}[] = [
  {segs: [['CREATE OR REPLACE VIEW', C.amber], [' v_active_users', C.text]], hot: [60, 450, C.amber]},
  {segs: [['WITH', C.pink], [' (', C.text], ['security_barrier = true', C.purple], [') ', C.text], ['AS', C.pink]], hot: [450, 800, C.purple]},
  {segs: [['SELECT', C.pink], [' user_id, username, email', C.text]]},
  {segs: [['FROM', C.pink], [' users', C.text]]},
  {segs: [['WHERE', C.pink], [" status = 'active';", C.text]]},
  {segs: [['-- cleanup', C.dim]]},
  {segs: [['DROP VIEW', C.red], [' v_active_users;', C.text]], hot: [800, 1100, C.red]},
];
const CARDS = [
  {k: 'rep', t0: 60, col: C.amber, tag: 'CREATE OR REPLACE VIEW', l1: 'بيحدّث المنطق من غير ما يضيّع الصلاحيات', l2: 'بشرط نفس أسماء وأنواع الأعمدة المخرجة'},
  {k: 'bar', t0: 450, col: C.purple, tag: 'SECURITY BARRIER', l1: 'بيمنع تسريب الصفوف المفلترة', l2: 'عبر الدوال والاستعلامات الفرعية الخبيثة'},
  {k: 'drop', t0: 800, col: C.red, tag: 'DROP VIEW', l1: 'بيحذف المنظور بس', l2: 'الجداول الأصلية سليمة (CASCADE / RESTRICT)'},
] as const;

export const Scene04: React.FC = () => {
  const f = useCurrentFrame();
  const K = B.s4.code;
  const size = fs("WITH (security_barrier = true) AS", K.w - 80, 38, mono);
  const total = CODE.reduce((a, l) => a + l.segs.reduce((b, s) => b + s[0].length, 0), 0);
  let shown = Math.floor(prog(f, 20, 700) * total);

  return (
    <Scene dur={S.s4.dur} accent={C.amber}>
      <Title ar="الصيانة والتحديث" en="REPLACE · SECURITY BARRIER · DROP" chip="SC 04 · MAINTENANCE" accent={C.amber} />

      <Card box={K} accent={C.line} at={6}>
        {CODE.map((l, i) => {
          const hot = l.hot && f >= l.hot[0] && f < l.hot[1];
          return (
            <div key={i} style={{position: 'absolute', left: 16, right: 16, top: 34 + i * 88, height: 74, borderRadius: 14, display: 'flex', alignItems: 'center', padding: '0 20px', whiteSpace: 'pre', fontFamily: mono, fontWeight: 700, fontSize: size, direction: 'ltr', background: hot ? 'rgba(148,163,184,0.10)' : 'transparent', border: `3px solid ${hot ? l.hot![2] : 'transparent'}`}}>
              {l.segs.map((s, j) => { const take = Math.max(0, Math.min(s[0].length, shown)); shown -= s[0].length; return <span key={j} style={{color: s[1]}}>{s[0].slice(0, take)}</span>; })}
            </div>
          );
        })}
      </Card>

      {CARDS.map((c) => {
        const box = B.s4[c.k];
        const t = ease(prog(f, c.t0, c.t0 + 50));
        return (
          <Card key={c.k} box={box} accent={c.col} at={c.t0 - 20}>
            <div style={{position: 'absolute', left: 24, top: 18, direction: 'ltr'}}><Tag color={c.col}>{c.tag}</Tag></div>
            <div style={{position: 'absolute', left: 24, right: 24, top: 66, direction: 'rtl', opacity: t}}>
              <div style={{fontFamily: cairo, fontWeight: 900, fontSize: fs(c.l1, box.w - 48, 34), color: C.text, whiteSpace: 'nowrap'}}>{c.l1}</div>
              <div style={{fontFamily: cairo, fontWeight: 700, fontSize: fs(c.l2, box.w - 48, 28), color: c.col, marginTop: 10, whiteSpace: 'nowrap'}}>{c.l2}</div>
            </div>
          </Card>
        );
      })}

      <Caption from={60} to={540} color={C.amber}>CREATE OR REPLACE VIEW ──► Updates Logic Without Losing Permissions</Caption>
      <Caption from={660} to={1080} color={C.purple}>WITH (security_barrier = true) ──► Prevents Side-Channel Data Leaks</Caption>
    </Scene>
  );
};
