import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, S} from '../theme';
import {B} from '../layout';
import {cairo, mono} from '../fonts';
import {Caption, Card, Scene, Tag, Title, ease, fs, lerp, prog} from '../common';

type Seg = [string, string];
const Q1: Seg[][] = [
  [['SELECT', C.pink], [' * ', C.text], ['FROM', C.pink], [' store_products', C.text]],
  [['WHERE', C.pink], [' attributes ', C.text], ['@>', C.blue], [` '{"color": "Red"}';`, C.amber]],
];
const PROD = [['لابتوب', '{"color":"Red","ram":"8GB"}', true], ['ماوس', '{"color":"Black"}', false], ['كيبورد', '{"color":"Red","type":"mech"}', true], ['شاشة', '{"color":"Silver"}', false], ['سماعة', '{"color":"Red","bt":true}', true]] as const;
const Q2: Seg[][] = [
  [['SET', C.pink], [' attributes = ', C.text], ['jsonb_set', C.amber], ['(attributes,', C.text]],
  [["       '{specs,ram}'", C.text], [`, '"16GB"'`, C.amber], [')', C.text]],
  [['SET', C.pink], [' attributes = attributes ', C.text], ['-', C.red], [" 'tags';", C.text]],
];

export const Scene02: React.FC = () => {
  const f = useCurrentFrame();
  const L = B.s2.left, R = B.s2.right;
  const s1 = fs("WHERE attributes @> '{\"color\": \"Red\"}';", L.w - 60, 30, mono);
  const t1 = Q1.reduce((a, l) => a + l.reduce((b, s) => b + s[0].length, 0), 0);
  let sh1 = Math.floor(prog(f, 20, 200) * t1);
  const t2 = Q2.reduce((a, l) => a + l.reduce((b, s) => b + s[0].length, 0), 0);
  let sh2 = Math.floor(prog(f, 360, 560) * t2);
  const mut = ease(prog(f, 580, 700)); // jsonb_set in place
  const del = ease(prog(f, 800, 900)); // key deletion

  return (
    <Scene dur={S.s2.dur} accent={C.blue}>
      <Title ar="الاحتواء والتعديل المباشر" en="@> Operator & jsonb_set" chip="SC 02 · OPERATORS" accent={C.blue} />

      <Card box={L} accent={C.blue} at={6}>
        <div style={{position: 'absolute', left: 24, top: 18, direction: 'ltr'}}><Tag color={C.blue}>CONTAINMENT · @&gt;</Tag></div>
        {Q1.map((l, i) => (
          <div key={i} style={{position: 'absolute', left: 24, top: 66 + i * 50, height: 50, whiteSpace: 'pre', fontFamily: mono, fontWeight: 700, fontSize: s1, direction: 'ltr'}}>
            {l.map((s, j) => { const take = Math.max(0, Math.min(s[0].length, sh1)); sh1 -= s[0].length; return <span key={j} style={{color: s[1]}}>{s[0].slice(0, take)}</span>; })}
          </div>
        ))}
        {PROD.map((p, i) => {
          const hit = prog(f, 220 + i * 40, 260 + i * 40);
          const ok = p[2];
          return (
            <div key={i} style={{position: 'absolute', left: 20, right: 20, top: 200 + i * 80, height: 66, borderRadius: 14, border: `3px solid ${hit > 0.5 ? (ok ? C.blue : C.line) : C.line}`, background: hit > 0.5 && ok ? 'rgba(56,189,248,0.12)' : C.panel2, display: 'flex', alignItems: 'center', gap: 14, padding: '0 16px', direction: 'ltr', opacity: Math.min(prog(f, 40 + i * 10, 70 + i * 10), hit > 0.5 && !ok ? 0.4 : 1)}}>
              <span style={{width: 110, fontFamily: cairo, fontWeight: 900, fontSize: 28, color: C.text, direction: 'rtl', textAlign: 'left'}}>{p[0]}</span>
              <span style={{flex: 1, fontFamily: mono, fontWeight: 700, fontSize: 21, color: C.dim, whiteSpace: 'nowrap'}}>{p[1]}</span>
              <span style={{fontFamily: mono, fontWeight: 700, fontSize: 30, color: C.blue, opacity: hit > 0.5 && ok ? 1 : 0}}>✓</span>
            </div>
          );
        })}
        <div style={{position: 'absolute', left: 24, right: 24, bottom: 22, textAlign: 'center', direction: 'rtl', fontFamily: cairo, fontWeight: 900, fontSize: 28, color: C.blue, opacity: prog(f, 460, 520)}}>3 منتجات بتحتوي على لون أحمر</div>
      </Card>

      <Card box={R} accent={C.amber} at={340}>
        <div style={{position: 'absolute', left: 24, top: 18, direction: 'ltr'}}><Tag color={C.amber}>IN-PLACE MUTATION</Tag></div>
        {Q2.map((l, i) => (
          <div key={i} style={{position: 'absolute', left: 24, top: 66 + i * 48, height: 48, whiteSpace: 'pre', fontFamily: mono, fontWeight: 700, fontSize: 27, direction: 'ltr'}}>
            {l.map((s, j) => { const take = Math.max(0, Math.min(s[0].length, sh2)); sh2 -= s[0].length; return <span key={j} style={{color: s[1]}}>{s[0].slice(0, take)}</span>; })}
          </div>
        ))}
        <div style={{position: 'absolute', left: 20, right: 20, top: 250, direction: 'ltr', fontFamily: mono, fontWeight: 700, fontSize: 26, color: C.dim, opacity: prog(f, 380, 420)}}>specs / tags</div>
        {[
          {k: '"specs.ram"', v: mut > 0.5 ? '"16GB"' : '"8GB"', c: mut > 0.5 ? C.green : C.text, border: mut > 0.5 ? C.green : mut > 0 ? C.amber : C.line},
          {k: '"specs.storage"', v: '"256GB"', c: C.text, border: C.line},
          {k: '"tags"', v: '["new","sale"]', c: del > 0.3 ? C.red : C.text, border: del > 0.3 ? C.red : C.line},
        ].map((r, i) => (
          <div key={i} style={{position: 'absolute', left: 20, right: 20, top: 296 + i * 86, height: 70, borderRadius: 14, border: `3px solid ${r.border}`, background: i === 2 && del > 0.3 ? 'rgba(239,68,68,0.10)' : C.panel2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', direction: 'ltr', fontFamily: mono, fontWeight: 700, fontSize: 26, color: r.c, opacity: i === 2 ? 1 - 0.55 * del : prog(f, 400 + i * 20, 440 + i * 20), textDecoration: i === 2 && del > 0.3 ? 'line-through' : 'none'}}>
            <span>{r.k}</span><span>{r.v}</span>
          </div>
        ))}
        <div style={{position: 'absolute', left: 24, right: 24, bottom: 22, textAlign: 'center', direction: 'rtl', fontFamily: cairo, fontWeight: 900, fontSize: 28, color: del > 0.5 ? C.red : C.green, opacity: prog(f, 700, 760)}}>{del > 0.5 ? 'المفتاح اتحذف فوراً بالمعامل -' : 'القيمة اتعدّلت مكانها ✓'}</div>
      </Card>

      <Caption from={60} to={600} color={C.blue}>Containment Operator (@&gt;) ──► Filters Rows Containing Target Key/Value Pairs</Caption>
      <Caption from={720} to={1260} color={C.green}>jsonb_set & Operator (-) ──► In-Place Key Modifications & Instant Property Deletion</Caption>
    </Scene>
  );
};
