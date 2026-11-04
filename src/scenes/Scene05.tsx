import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, S} from '../theme';
import {B} from '../layout';
import {cairo, mono} from '../fonts';
import {Caption, Card, Scene, Tag, Title, ease, fs, prog} from '../common';

type Seg = [string, string];
const CODE: Seg[][] = [
  [['SELECT', C.pink], [' sub.category_name ', C.blue], ['AS', C.pink], [' sub_category,', C.text]],
  [['       parent.category_name ', C.purple], ['AS', C.pink], [' main_category', C.text]],
  [['FROM', C.pink], [' categories ', C.text], ['sub', C.blue]],
  [['LEFT JOIN', C.pink], [' categories ', C.text], ['parent', C.purple]],
  [['  ON', C.pink], [' sub.parent_category_id = parent.category_id;', C.text]],
];
const PAIRS = [['إلكترونيات', 'NULL'], ['أجهزة كمبيوتر', 'إلكترونيات'], ['هواتف', 'إلكترونيات'], ['لاب توب', 'أجهزة كمبيوتر'], ['مكتبي', 'أجهزة كمبيوتر']];
const MENU = [
  {t: 'إلكترونيات', d: 0, c: C.amber}, {t: 'أجهزة كمبيوتر', d: 1, c: C.blue}, {t: 'لاب توب', d: 2, c: C.green},
  {t: 'مكتبي', d: 2, c: C.green}, {t: 'هواتف', d: 1, c: C.blue}, {t: 'ملابس', d: 0, c: C.amber}, {t: 'رجالي', d: 1, c: C.blue},
];

export const Scene05: React.FC = () => {
  const f = useCurrentFrame();
  const K = B.s5.code, P = B.s5.pairs, M = B.s5.store;
  const size = fs('  ON sub.parent_category_id = parent.category_id;', K.w - 70, 30, mono);
  const total = CODE.reduce((a, l) => a + l.reduce((b, s) => b + s[0].length, 0), 0);
  let shown = Math.floor(prog(f, 20, 420) * total);
  const stamp = ease(prog(f, 640, 700));
  const crumb = prog(f, 700, 760);

  return (
    <Scene dur={S.s5.dur} accent={C.green}>
      <Title ar="شجرات الفئات في المتجر" en="Category Trees & Breadcrumbs" chip="SC 05 · E-COMMERCE" accent={C.green} />

      <Card box={K} accent={C.line} at={6}>
        {CODE.map((l, i) => (
          <div key={i} style={{position: 'absolute', left: 30, top: 28 + i * 58, height: 58, whiteSpace: 'pre', fontFamily: mono, fontWeight: 700, fontSize: size, direction: 'ltr'}}>
            {l.map((s, j) => { const take = Math.max(0, Math.min(s[0].length, shown)); shown -= s[0].length; return <span key={j} style={{color: s[1]}}>{s[0].slice(0, take)}</span>; })}
          </div>
        ))}
      </Card>

      <Card box={P} accent={C.blue} at={300}>
        <div style={{position: 'absolute', left: 24, top: 14, direction: 'ltr'}}><Tag color={C.blue}>RESULT · sub → parent</Tag></div>
        {PAIRS.map((p, i) => {
          const t = ease(prog(f, 340 + i * 30, 380 + i * 30));
          return (
            <div key={i} style={{position: 'absolute', left: 24, right: 24, top: 56 + i * 49, height: 42, display: 'flex', gap: 14, direction: 'ltr', opacity: t, transform: `translateX(${(1 - t) * -60}px)`}}>
              <div style={{width: 440, borderRadius: 10, border: `2px solid ${C.blue}`, background: 'rgba(56,189,248,0.10)', display: 'flex', alignItems: 'center', padding: '0 16px', fontFamily: cairo, fontWeight: 700, fontSize: 24, color: C.text}}>{p[0]}</div>
              <div style={{flex: 1, borderRadius: 10, border: `2px solid ${p[1] === 'NULL' ? C.amber : C.purple}`, background: p[1] === 'NULL' ? 'rgba(245,158,11,0.12)' : 'rgba(168,85,247,0.10)', display: 'flex', alignItems: 'center', padding: '0 16px', fontFamily: p[1] === 'NULL' ? mono : cairo, fontWeight: 700, fontSize: 24, color: p[1] === 'NULL' ? C.amber : C.text}}>{p[1]}</div>
            </div>
          );
        })}
      </Card>

      <Card box={M} accent={C.green} at={420}>
        <div style={{position: 'absolute', left: 28, top: 22, direction: 'ltr'}}><Tag color={C.green}>MANZOOMA STORE · MENU</Tag></div>
        <div style={{position: 'absolute', right: 24, top: 14, width: 100, height: 100, borderRadius: 50, border: `6px solid ${C.green}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: mono, fontWeight: 700, fontSize: 36, color: C.green, opacity: stamp, transform: `scale(${0.6 + 0.4 * stamp}) rotate(-10deg)`}}>✓</div>
        {MENU.map((m, i) => {
          const t = ease(prog(f, 480 + i * 30, 520 + i * 30));
          return (
            <div key={i} style={{position: 'absolute', left: 28 + m.d * 52, right: 28, top: 130 + i * 64, height: 54, borderRadius: 14, border: `3px solid ${m.c}`, background: C.panel2, display: 'flex', alignItems: 'center', padding: '0 20px', fontFamily: cairo, fontWeight: 700, fontSize: 28, color: C.text, direction: 'rtl', opacity: t, transform: `translateX(${(1 - t) * 70}px)`}}>{m.t}</div>
          );
        })}
        <div style={{position: 'absolute', left: 28, right: 28, bottom: 24, textAlign: 'center', direction: 'rtl', fontFamily: cairo, fontWeight: 900, fontSize: fs('إلكترونيات › أجهزة كمبيوتر › لاب توب', M.w - 56, 30), color: C.green, opacity: crumb}}>إلكترونيات › أجهزة كمبيوتر › لاب توب</div>
      </Card>

      <Caption from={60} to={540} color={C.blue}>Category Hierarchy ──► Sub-Categories Linked to Parent Categories</Caption>
      <Caption from={660} to={1080} color={C.green}>E-Commerce Value ──► Powers Nested Catalog Navigation & Breadcrumbs</Caption>
    </Scene>
  );
};
