import React from 'react';
import {COL, XL} from './theme';
import {ANCH, SCENE_END, SCENE_START} from './sync';
import {Arrow, Box, Cell, FONT, Geo, Rect, Seal, Sel, View, pe, pg, typed} from './kit';
import {IN, INC, K, band, ctr, hdrC, hp, hwFor, one, path, rng, rr} from './data';

type Out = {v: View; zoom: number; zx: number; zy: number};
const A = (i: number, k: number) => ANCH[i][k] - SCENE_START[i];
const END = (i: number) => SCENE_END[i] - SCENE_START[i];
const wrap = (o: number, kids: React.ReactNode) => <div style={{position: 'absolute', inset: 0, opacity: o}}>{kids}</div>;
const emer = (a: number) => `rgba(16,185,129,${a})`;
const blue = (a: number) => `rgba(56,189,248,${a})`;
const amb = (a: number) => `rgba(245,158,11,${a})`;
/** =head + typed(open) + inner + typed(close) + tail  (editing a formula by wrapping it) */
const nest = (t: number, t0: number, t1: number, head: string, open: string, inner: string, close: string, tail: string) => {
  const q = pg(t, t0, t1);
  const a = Math.min(1, q / 0.55), b = Math.max(0, (q - 0.55) / 0.45);
  return '=' + head + open.slice(0, Math.round(open.length * a)) + inner + close.slice(0, Math.round(close.length * b)) + tail;
};
const cellFont: React.CSSProperties = {fontFamily: FONT.cell, fontSize: 14.67, lineHeight: `${XL.rowH - 1}px`, whiteSpace: 'pre', padding: '0 3px', boxSizing: 'border-box'};

// ================= SCENE 1: TEXTBEFORE / TEXTAFTER =================
const EM = ['ahmed.ali@manzooma.com', 'sara.hassan@gmail.com', 'omar.farouk@manzooma.com', 'mona.adel@outlook.com', 'youssef.nabil@manzooma.com', 'hana.said@yahoo.com', 'karim.mahmoud@manzooma.com', 'nour.salah@gmail.com'];
const SplitText: React.FC<{r: Rect | null; text: string; p1: number; p2: number; cut: number}> = ({r, text, p1, p2, cut}) => {
  if (!r) return null;
  const [b, a] = text.split('@');
  return (
    <div style={{position: 'absolute', left: r.x, top: r.y, width: r.w, height: r.h, background: '#fff', display: 'flex', alignItems: 'center', ...cellFont, zIndex: 5}}>
      <span style={{background: blue(0.38 * p1), color: '#000'}}>{b}</span>
      <span style={{position: 'relative', background: amb(0.6 * cut), color: '#000'}}>@
        <span style={{position: 'absolute', left: 3, top: -34, width: 2, height: 90 * cut, background: COL.amber, boxShadow: `0 0 12px ${COL.amber}`, opacity: cut}}/>
      </span>
      <span style={{background: emer(0.38 * p2), color: '#000'}}>{a}</span>
    </div>
  );
};
export const s1 = (t: number): Out => {
  const tL0 = A(0, 2) + 0.2, tLE = A(0, 2) + 3.0, tB0 = A(0, 3) + 0.3, tBE = tB0 + 2.8, tC0 = tBE + 0.6, tCE = tC0 + 2.4, tF0 = A(0, 4) + 0.8, tF1 = A(0, 4) + 2.8;
  const tr = (r: number) => tF0 + ((r - 3) / 6) * (tF1 - tF0);
  const glow = (t0: number) => { const g1 = 1 - pg(t, t0, t0 + 1.2); return g1 > 0.02 ? g1 : 0; };
  const cell = (r: number, c: number): Cell | undefined => {
    if (r === 1) return c < 3 ? hdrC(['Email', 'Username', 'Domain'][c]) : undefined;
    if (r < 2 || r > 9) return undefined;
    const i = r - 2, bg = band(r), [bf, af] = EM[i].split('@');
    if (c === 0) return {t: EM[i], bg};
    const fixed = r === 2 ? true : t >= tr(r);
    if (c === 1) {
      if (r === 2) {
        if (t < tLE) return {t: '', bg};
        if (t < tBE) return {t: bf, f: '=LEFT(A2,SEARCH("@",A2)-1)', bg: 'rgba(239,68,68,0.22)'};
        return {t: bf, f: '=TEXTBEFORE(A2,"@")', bg: blue(0.3)};
      }
      return fixed ? {t: bf, f: `=TEXTBEFORE(A${r},"@")`, bg: glow(tr(r)) ? blue(0.5 * glow(tr(r))) : bg} : {t: '', bg};
    }
    if (c === 2) {
      if (r === 2) return t >= tCE ? {t: af, f: '=TEXTAFTER(A2,"@")', bg: emer(0.3)} : {t: '', bg};
      return fixed ? {t: af, f: `=TEXTAFTER(A${r},"@")`, bg: glow(tr(r)) ? emer(0.5 * glow(tr(r))) : bg} : {t: '', bg};
    }
    return undefined;
  };
  let sel: Sel = one(1, 0);
  let edit: View['edit'];
  let mode: string | undefined;
  let name: string | undefined;
  let fb = '';
  if (t >= A(0, 1) + 1) { sel = one(2, 0); fb = EM[0]; }
  if (t >= tL0 - 0.8) { sel = one(2, 1); fb = ''; }
  if (t >= tL0 && t < tLE) { edit = {r: 2, c: 1, text: typed('=LEFT(A2,SEARCH("@",A2)-1)', t, tL0, tLE - 0.3), caret: true}; mode = 'Enter'; name = 'B2'; }
  if (t >= tLE) { sel = one(3, 1); }
  if (t >= tB0 - 0.7) { sel = one(2, 1); fb = '=LEFT(A2,SEARCH("@",A2)-1)'; }
  if (t >= tB0 && t < tBE) { edit = {r: 2, c: 1, text: typed('=TEXTBEFORE(A2,"@")', t, tB0 + 0.2, tBE - 0.3), caret: true}; mode = 'Enter'; name = 'B2'; }
  if (t >= tBE) { sel = one(3, 1); fb = ''; }
  if (t >= tC0 - 0.5) { sel = one(2, 2); fb = ''; }
  if (t >= tC0 && t < tCE) { edit = {r: 2, c: 2, text: typed('=TEXTAFTER(A2,"@")', t, tC0 + 0.1, tCE - 0.3), caret: true}; mode = 'Enter'; name = 'C2'; }
  if (t >= tCE) { sel = one(3, 2); }
  if (t >= tF0 - 0.6) { sel = rng(2, 1, 2, 2); }
  if (t >= tF0) sel = rng(2, 1, 2 + Math.round(pe(t, tF0, tF1) * 7), 2, 2, 1);
  const ov = (g: Geo) => {
    const pulse = 0.5 + 0.3 * Math.sin(t * 3.6);
    const cut = pe(t, tBE, tBE + 0.7), p1 = pe(t, tBE, tBE + 0.6), p2 = pe(t, tCE, tCE + 0.6);
    const split = (cut > 0 ? 1 : 0) * (1 - pe(t, tF1, tF1 + 0.6));
    return (
      <div style={{position: 'absolute', inset: 0}}>
        {wrap(split, <SplitText r={g.cell(2, 0)} text={EM[0]} p1={p1} p2={p2} cut={cut}/>)}
        {wrap(pe(t, tLE, tLE + 0.4) * (1 - pe(t, tB0, tB0 + 0.3)), <Box r={g.cell(2, 1)} c={COL.red} w={2.5} glow={pulse} pad={1}/>)}
        {wrap(pe(t, tBE, tBE + 0.4), <Box r={g.cell(2, 1)} c={COL.blue} w={2.5} glow={pulse} pad={1}/>)}
        {wrap(pe(t, tCE, tCE + 0.4), <Box r={g.cell(2, 2)} c={COL.green} w={2.5} glow={pulse} pad={1}/>)}
        {wrap(pe(t, tF1, tF1 + 0.8), <Box r={g.rect(2, 1, 9, 2)} c={COL.green} w={2.5} glow={0.6}/>)}
      </div>
    );
  };
  const cursor = (g: Geo) => {
    const rest = ctr(g, 13, 8), a2 = ctr(g, 2, 0), b2 = ctr(g, 2, 1), c2 = ctr(g, 2, 2), h = hp(g, 2, 2), h9 = hp(g, 9, 2);
    const ks: K[] = [[0, rest.x, rest.y], [A(0, 1) + 0.3, rest.x, rest.y], [A(0, 1) + 1, a2.x, a2.y], [tL0 - 1.2, a2.x, a2.y], [tL0 - 0.8, b2.x, b2.y], [tB0 - 0.7, b2.x, b2.y], [tC0 - 0.5, c2.x, c2.y], [tF0 - 0.1, c2.x, c2.y], [tF0, h.x, h.y, 'cross'], [tF1, h9.x, h9.y, 'cross'], [tF1 + 1, rest.x, rest.y, 'arrow'], [END(0), rest.x, rest.y]];
    return path(t, ks);
  };
  const v: View = {top: 1, freeze: false, widths: [220, 120, 130], cell, sel, edit, fb, name, mode, ov, cursor, sheet: 0, sheets: ['Parse', 'Split & Join', 'Clean', 'Pipeline'], file: 'Text_Functions_Practice'};
  return {v, zoom: 1 + 0.18 * pe(t, 37.4, 39.8), zx: 330, zy: 160};
};

// ================= SCENE 2: TEXTSPLIT / TEXTJOIN =================
const CODES = [['PROD', '2026', 'CAIRO'], ['PROD', '2026', 'GIZA'], ['PROD', '2025', 'ALEX']];
export const s2 = (t: number): Out => {
  const tB0 = A(1, 1) + 1.0, tBE = A(1, 1) + 3.6, tF0 = A(1, 1) + 6.4, tF1 = A(1, 1) + 8.0;
  const tJ0 = A(1, 2) + 0.4, tJE = A(1, 2) + 3.6, tJ0f = A(1, 2) + 5.3, tJ1f = A(1, 2) + 7.4;
  const spillT = (r: number) => (r === 2 ? tBE : tF0 + ((r - 2) / 2) * (tF1 - tF0));
  const joinT = (r: number) => (r === 2 ? tJE : tJ0f + ((r - 2) / 3) * (tJ1f - tJ0f));
  const cell = (r: number, c: number): Cell | undefined => {
    if (r === 1) return c < 4 ? hdrC(['Code', 'Part 1', 'Part 2', 'Part 3'][c]) : c === 5 ? hdrC('Joined') : undefined;
    if (r < 2 || r > 5) return undefined;
    const bg = band(r);
    if (r === 5) {
      if (c === 0) return {t: 'Manual', bg};
      if (c === 1) return {t: 'PROD', bg, al: 'l'};
      if (c === 2) return {t: '', bg};
      if (c === 3) return {t: 'ALEX', bg, al: 'l'};
    } else {
      const i = r - 2;
      if (c === 0) return {t: CODES[i].join('-'), bg};
      if (c >= 1 && c <= 3) {
        const d = (c - 1) * 0.15, tt = spillT(r) + d;
        if (t < tt) return {t: '', bg};
        const g1 = 1 - pg(t, tt, tt + 1.0);
        return {t: CODES[i][c - 1], al: 'l', f: c === 1 ? `=TEXTSPLIT(A${r},"-")` : undefined, bg: g1 > 0.02 ? amb(0.55 * g1) : bg};
      }
    }
    if (c === 5) {
      if (t < joinT(r)) return {t: '', bg};
      const parts = r === 5 ? ['PROD', 'ALEX'] : CODES[r - 2];
      const g1 = 1 - pg(t, joinT(r), joinT(r) + 1.0);
      return {t: parts.join(' | '), f: `=TEXTJOIN(" | ",TRUE,B${r}:D${r})`, bg: g1 > 0.02 ? emer(0.5 * g1) : bg, ovf: true};
    }
    return undefined;
  };
  let sel: Sel = one(1, 0);
  let edit: View['edit'];
  let mode: string | undefined;
  let name: string | undefined;
  let fb = '';
  if (t >= tB0 - 0.6) { sel = one(2, 1); }
  if (t >= tB0 && t < tBE) { edit = {r: 2, c: 1, text: typed('=TEXTSPLIT(A2,"-")', t, tB0 + 0.2, tBE - 0.3), caret: true}; mode = 'Enter'; name = 'B2'; }
  if (t >= tBE) { sel = one(2, 1); fb = '=TEXTSPLIT(A2,"-")'; }
  if (t >= tF0 - 0.2) sel = rng(2, 1, 2 + Math.round(pe(t, tF0, tF1) * 2), 1, 2, 1);
  if (t >= tF1 + 1.2) { sel = one(2, 2); fb = '=TEXTSPLIT(A2,"-")'; }
  if (t >= tJ0 - 0.5) { sel = one(2, 5); fb = ''; }
  if (t >= tJ0 && t < tJE) { edit = {r: 2, c: 5, text: typed('=TEXTJOIN(" | ",TRUE,B2:D2)', t, tJ0 + 0.2, tJE - 0.3), caret: true}; mode = 'Enter'; name = 'F2'; }
  if (t >= tJE) { sel = one(2, 5); fb = '=TEXTJOIN(" | ",TRUE,B2:D2)'; }
  if (t >= tJ0f - 0.2) sel = rng(2, 5, 2 + Math.round(pe(t, tJ0f, tJ1f) * 3), 5, 2, 5);
  const ov = (g: Geo) => {
    const pulse = 0.5 + 0.3 * Math.sin(t * 3.6);
    const fr = pe(t, 1.0, 1.8);
    const rows = [2, 3, 4].map((r) => <div key={r} style={{position: 'absolute', inset: 0, opacity: pe(t, spillT(r) + 0.3, spillT(r) + 0.8)}}><Box r={g.rect(r, 1, r, 3)} c={COL.blue} w={2} glow={0.4} pad={0}/></div>);
    const arr = [1, 2, 3].map((c) => {
      const y = rr(g, 2, c).y + 10 + (c - 2) * 5;
      return <Arrow key={c} x1={g.cx(c + 1) - 6} y1={y} x2={g.cx(5) + 4} y2={rr(g, 2, 5).y + 10} c={COL.green} w={2} p={pe(t, tJE + 0.1 * c, tJE + 0.7 + 0.1 * c)}/>;
    });
    return (
      <div style={{position: 'absolute', inset: 0}}>
        {wrap(fr, <div style={{position: 'absolute', inset: 0}}><Box r={g.rect(1, 0, 5, 3)} c={COL.amber} w={2} glow={0.4 + 0.2 * Math.sin(t * 2)} dash pad={2}/><Box r={g.rect(1, 5, 5, 5)} c={COL.green} w={2} glow={0.4 + 0.2 * Math.sin(t * 2)} dash pad={2}/></div>)}
        {rows}
        {wrap((1 - pe(t, tJE + 1.6, tJE + 2.2)) * pe(t, tJE, tJE + 0.2), <div style={{position: 'absolute', inset: 0}}>{arr}</div>)}
        {wrap(pe(t, tJE, tJE + 0.5), <Box r={g.cell(2, 5)} c={COL.green} w={2.5} glow={pulse} pad={1}/>)}
        {wrap(pe(t, A(1, 2) + 8.2, A(1, 2) + 8.8) * (1 - pe(t, A(1, 2) + 11.5, A(1, 2) + 12.2)), <Box r={g.cell(5, 2)} c={COL.blue} w={2.5} glow={pulse} dash pad={1}/>)}
        {wrap(pe(t, tJ1f + 1, tJ1f + 1.8), <Box r={g.rect(2, 5, 5, 5)} c={COL.green} w={2.5} glow={0.6}/>)}
      </div>
    );
  };
  const cursor = (g: Geo) => {
    const rest = ctr(g, 11, 8), b2 = ctr(g, 2, 1), h = hp(g, 2, 1), h4 = hp(g, 4, 1), f2 = ctr(g, 2, 5), hf = hp(g, 2, 5), hf5 = hp(g, 5, 5), c5 = ctr(g, 5, 2);
    const ks: K[] = [[0, rest.x, rest.y], [tB0 - 1.2, rest.x, rest.y], [tB0 - 0.6, b2.x, b2.y], [tF0 - 0.3, b2.x, b2.y], [tF0, h.x, h.y, 'cross'], [tF1, h4.x, h4.y, 'cross'], [tF1 + 1, ctr(g, 2, 2).x, ctr(g, 2, 2).y, 'arrow'], [tJ0 - 0.5, f2.x, f2.y], [tJ0f - 0.3, f2.x, f2.y], [tJ0f, hf.x, hf.y, 'cross'], [tJ1f, hf5.x, hf5.y, 'cross'], [A(1, 2) + 8.4, c5.x, c5.y, 'arrow'], [END(1) - 6, c5.x, c5.y], [END(1) - 4, rest.x, rest.y]];
    return path(t, ks);
  };
  const v: View = {top: 1, freeze: false, widths: [130, 70, 70, 80, 30, 170], cell, sel, edit, fb, name, mode, ov, cursor, sheet: 1, sheets: ['Parse', 'Split & Join', 'Clean', 'Pipeline'], file: 'Text_Functions_Practice'};
  return {v, zoom: 1 + 0.18 * (1 - pe(t, 1.0, 3.0)), zx: 330, zy: 160};
};

// ================= SCENE 3: TRIM / CLEAN / SUBSTITUTE =================
const NP = '□';
const RAW = ['  #Cairo##  Branch' + NP + ' ', '##Giza    Store#  ', ' Alex  #Hub' + NP + '  ', 'Tanta  ##  Outlet' + NP];
const sub = (s: string) => s.split('#').join('');
const cln = (s: string) => s.split(NP).join('');
const trm = (s: string) => s.replace(/ +/g, ' ').replace(/^ | $/g, '');
const stageStr = (s: string, st: number) => (st === 0 ? s : st === 1 ? trm(s) : st === 2 ? trm(cln(s)) : trm(cln(sub(s))));
const Dirty: React.FC<{r: Rect | null; text: string; gs: number; gn: number; gh: number}> = ({r, text, gs, gn, gh}) => {
  if (!r) return null;
  return (
    <div style={{position: 'absolute', left: r.x, top: r.y, width: r.w, height: r.h, background: '#fff', display: 'flex', alignItems: 'center', ...cellFont, zIndex: 5}}>
      {text.split('').map((ch, i) =>
        ch === ' ' ? <span key={i} style={{color: COL.red, opacity: 0.5 + 0.5 * gs, textShadow: gs > 0.3 ? `0 0 8px ${COL.red}` : undefined}}>·</span>
        : ch === '#' ? <span key={i} style={{color: '#000', background: amb(0.35 + 0.4 * gh), fontWeight: 700}}>{ch}</span>
        : ch === NP ? <span key={i} style={{color: '#000', background: 'rgba(6,182,212,' + (0.35 + 0.4 * gn) + ')'}}>{ch}</span>
        : <span key={i}>{ch}</span>)}
    </div>
  );
};
export const s3 = (t: number): Out => {
  const a2 = A(2, 2);
  const W = [[a2 + 0.2, a2 + 2.7, a2 + 3.0], [a2 + 4.2, a2 + 7.2, a2 + 7.5], [a2 + 8.7, a2 + 13.0, a2 + 13.3]];
  const stNow = t >= W[2][2] ? 3 : t >= W[1][2] ? 2 : t >= W[0][2] ? 1 : 0;
  const tFill0 = A(2, 3) + 0.5, tFill1 = A(2, 3) + 2.2;
  const trow = (r: number) => (r === 2 ? 0 : tFill0 + ((r - 2) / 3) * (tFill1 - tFill0));
  const cell = (r: number, c: number): Cell | undefined => {
    if (r === 1) return c < 4 ? hdrC(['Dirty Text', 'LEN', 'Clean Text', 'LEN'][c]) : undefined;
    if (r < 2 || r > 5) return undefined;
    const i = r - 2, bg = band(r), raw = RAW[i];
    if (c === 0) return {t: raw.split(NP).join(NP), bg, pre: true};
    if (c === 1) return {t: String(raw.length), f: `=LEN(A${r})`, bg};
    const cur = r === 2 ? (stNow > 0 ? stageStr(raw, stNow) : '') : t >= trow(r) ? stageStr(raw, 3) : '';
    if (c === 2) { const g1 = r === 2 || t < trow(r) ? 0 : 1 - pg(t, trow(r), trow(r) + 1.2); return {t: cur, f: stNow === 3 || r > 2 ? `=TRIM(CLEAN(SUBSTITUTE(A${r},"#","")))` : undefined, bg: g1 > 0.02 ? emer(0.5 * g1) : bg, pre: true}; }
    if (c === 3) return {t: String(cur.length), f: `=LEN(C${r})`, bg};
    return undefined;
  };
  const fText = (st: number) => st === 1 ? '=TRIM(A2)' : st === 2 ? '=TRIM(CLEAN(A2))' : '=TRIM(CLEAN(SUBSTITUTE(A2,"#","")))';
  let sel: Sel = one(1, 0);
  let edit: View['edit'];
  let mode: string | undefined;
  let name: string | undefined;
  let fb = '';
  if (t >= A(2, 1) + 1) { sel = one(2, 0); fb = RAW[0]; }
  if (t >= W[0][0] - 0.6) { sel = one(2, 2); fb = ''; }
  if (t >= W[0][0] && t < W[0][2]) { edit = {r: 2, c: 2, text: typed('=TRIM(A2)', t, W[0][0], W[0][1]), caret: true}; mode = 'Enter'; name = 'C2'; }
  if (t >= W[0][2]) { sel = one(2, 2); fb = fText(1); }
  if (t >= W[1][0] && t < W[1][2]) { edit = {r: 2, c: 2, text: nest(t, W[1][0], W[1][1], 'TRIM(', 'CLEAN(', 'A2', ')', ')'), caret: true}; mode = 'Edit'; name = 'C2'; }
  if (t >= W[1][2]) fb = fText(2);
  if (t >= W[2][0] && t < W[2][2]) { edit = {r: 2, c: 2, text: nest(t, W[2][0], W[2][1], 'TRIM(CLEAN(', 'SUBSTITUTE(', 'A2', ',"#","")', '))'), caret: true}; mode = 'Edit'; name = 'C2'; }
  if (t >= W[2][2]) fb = fText(3);
  if (t >= tFill0 - 0.3) sel = rng(2, 2, 2, 2);
  if (t >= tFill0) sel = rng(2, 2, 2 + Math.round(pe(t, tFill0, tFill1) * 3), 2, 2, 2);
  const ov = (g: Geo) => {
    const dirtyA = pe(t, A(2, 1) + 0.5, A(2, 1) + 1.2) * (1 - pe(t, A(2, 3) + 2.5, A(2, 3) + 3.3));
    const glow = (k: number) => Math.max(0, 1 - Math.abs(t - W[k][2] - 0.4) / 1.3);
    const rows = [0, 1, 2, 3].map((i) => <Dirty key={i} r={g.cell(2 + i, 0)} text={RAW[i]} gs={glow(0)} gn={glow(1)} gh={glow(2)}/>);
    const sc = (k: number) => { const p = pg(t, W[k][2] + 0.05, W[k][2] + 1.0); const r = g.cell(2, 0); return r && p > 0 && p < 1 ? <div key={k} style={{position: 'absolute', left: r.x + r.w * p, top: r.y - 6, width: 3, height: r.h + 12, background: COL.purple, boxShadow: `0 0 14px ${COL.purple}`}}/> : null; };
    const pulse = 0.5 + 0.3 * Math.sin(t * 3.6);
    return (
      <div style={{position: 'absolute', inset: 0}}>
        {wrap(dirtyA, <div style={{position: 'absolute', inset: 0}}>{rows}</div>)}
        {wrap(pe(t, 0.8, 1.6) * (1 - pe(t, A(2, 1), A(2, 1) + 0.6)), <Box r={g.rect(1, 0, 5, 1)} c={COL.red} w={2} glow={0.5} dash pad={2}/>)}
        {sc(0)}{sc(1)}{sc(2)}
        {wrap(pe(t, W[0][2], W[0][2] + 0.4), <Box r={g.cell(2, 2)} c={stNow >= 3 ? COL.green : COL.purple} w={2.5} glow={pulse} pad={1}/>)}
        {wrap(pe(t, tFill1, tFill1 + 0.8), <Box r={g.rect(2, 2, 5, 3)} c={COL.green} w={2.5} glow={0.6}/>)}
      </div>
    );
  };
  const cursor = (g: Geo) => {
    const rest = ctr(g, 11, 6), a2c = ctr(g, 2, 0), c2 = ctr(g, 2, 2), h = hp(g, 2, 2), h5 = hp(g, 5, 2);
    const ks: K[] = [[0, rest.x, rest.y], [A(2, 1) + 0.3, rest.x, rest.y], [A(2, 1) + 1, a2c.x, a2c.y], [W[0][0] - 1.2, a2c.x, a2c.y], [W[0][0] - 0.6, c2.x, c2.y], [tFill0 - 0.3, c2.x, c2.y], [tFill0, h.x, h.y, 'cross'], [tFill1, h5.x, h5.y, 'cross'], [tFill1 + 1, rest.x, rest.y, 'arrow'], [END(2), rest.x, rest.y]];
    return path(t, ks);
  };
  const v: View = {top: 1, freeze: false, widths: [200, 50, 200, 50], cell, sel, edit, fb, name, mode, ov, cursor, sheet: 2, sheets: ['Parse', 'Split & Join', 'Clean', 'Pipeline'], file: 'Text_Functions_Practice'};
  return {v, zoom: 1, zx: 0, zy: 0};
};

// ================= SCENE 4: single-cell pipeline =================
const EM4 = ['ahmed.ali@manzooma.com', 'sara.hassan@gmail.com', 'youssef. nabil@manzooma.com', 'mona.adel@outlook.com', 'omar.farouk@manzooma.com', 'hana.said@yahoo.com', 'karim.mahmoud @gmail.com', 'nour.salah@gmail.com'];
const names = (e: string) => e.split('@')[0].split('.').map((x) => x.trim());
export const T4 = {s: [A(3, 1) + 3.7, A(3, 1) + 7.5, A(3, 1) + 10.5]};
export const s4 = (t: number): Out => {
  const a1 = A(3, 1), a2 = A(3, 2);
  const W = [[a1 + 0.2, a1 + 3.4, a1 + 3.7], [a1 + 4.0, a1 + 7.2, a1 + 7.5], [a1 + 7.8, a1 + 10.2, a1 + 10.5]];
  const st = t >= W[2][2] ? 3 : t >= W[1][2] ? 2 : t >= W[0][2] ? 1 : 0;
  const tF0 = a2 + 0.5, tF1 = a2 + 3.2;
  const tr = (r: number) => (r === 2 ? 0 : tF0 + ((r - 3) / 6) * (tF1 - tF0));
  const fTxt = (r: number, s: number) => s === 1 ? `=TEXTBEFORE(A${r},"@")` : s === 2 ? `=TEXTSPLIT(TEXTBEFORE(A${r},"@"),".")` : `=TRIM(TEXTSPLIT(TEXTBEFORE(A${r},"@"),"."))`;
  const cell = (r: number, c: number): Cell | undefined => {
    if (r === 1) return c < 3 ? hdrC(['Email', 'First', 'Last'][c]) : undefined;
    if (r < 2 || r > 9) return undefined;
    const i = r - 2, bg = band(r), nm = names(EM4[i]);
    if (c === 0) return {t: EM4[i], bg, pre: true};
    const s = r === 2 ? st : t >= tr(r) ? 3 : 0;
    if (s === 0) return {t: '', bg};
    const g1 = r === 2 ? 0 : 1 - pg(t, tr(r), tr(r) + 1.2);
    const colr = s === 1 ? blue : s === 2 ? amb : emer;
    const b2 = r === 2 ? colr(0.3) : g1 > 0.02 ? emer(0.5 * g1) : bg;
    if (s === 1) return c === 1 ? {t: EM4[i].split('@')[0], f: fTxt(r, 1), bg: b2, ovf: true} : {t: '', bg};
    return c === 1 ? {t: nm[0], f: fTxt(r, s), bg: b2} : c === 2 ? {t: nm[1], bg: b2} : undefined;
  };
  let sel: Sel = one(1, 0);
  let edit: View['edit'];
  let mode: string | undefined;
  let name: string | undefined;
  let fb = '';
  if (t >= a1 - 0.6) { sel = one(2, 1); }
  if (t >= W[0][0] && t < W[0][2]) { edit = {r: 2, c: 1, text: typed('=TEXTBEFORE(A2,"@")', t, W[0][0] + 0.1, W[0][1]), caret: true}; mode = 'Enter'; name = 'B2'; }
  if (t >= W[0][2]) { sel = one(2, 1); fb = fTxt(2, 1); }
  if (t >= W[1][0] && t < W[1][2]) { edit = {r: 2, c: 1, text: nest(t, W[1][0], W[1][1], '', 'TEXTSPLIT(', 'TEXTBEFORE(A2,"@")', ',".")', ''), caret: true}; mode = 'Edit'; name = 'B2'; }
  if (t >= W[1][2]) fb = fTxt(2, 2);
  if (t >= W[2][0] && t < W[2][2]) { edit = {r: 2, c: 1, text: nest(t, W[2][0], W[2][1], '', 'TRIM(', 'TEXTSPLIT(TEXTBEFORE(A2,"@"),".")', ')', ''), caret: true}; mode = 'Edit'; name = 'B2'; }
  if (t >= W[2][2]) fb = fTxt(2, 3);
  if (t >= tF0 - 0.3) sel = rng(2, 1, 2, 1);
  if (t >= tF0) sel = rng(2, 1, 2 + Math.round(pe(t, tF0, tF1) * 7), 1, 2, 1);
  const ov = (g: Geo) => {
    const pulse = 0.5 + 0.3 * Math.sin(t * 3.6);
    const spill = st === 2 ? COL.amber : COL.green;
    return (
      <div style={{position: 'absolute', inset: 0}}>
        {wrap(pe(t, W[0][2], W[0][2] + 0.4) * (t < tF0 ? 1 : 0), <Box r={st >= 2 ? g.rect(2, 1, 2, 2) : g.cell(2, 1)} c={st === 1 ? COL.blue : spill} w={2.5} glow={pulse} pad={1}/>)}
        {wrap(pe(t, a2 + 5, a2 + 5.6) * (1 - pe(t, a2 + 11, a2 + 11.8)), <div style={{position: 'absolute', inset: 0}}><Box r={g.cell(4, 0)} c={COL.red} w={2} glow={0.5} dash pad={1}/><Box r={g.cell(8, 0)} c={COL.red} w={2} glow={0.5} dash pad={1}/><Box r={g.rect(4, 1, 4, 2)} c={COL.green} w={2.5} glow={pulse} pad={1}/><Box r={g.rect(8, 1, 8, 2)} c={COL.green} w={2.5} glow={pulse} pad={1}/></div>)}
        {wrap(pe(t, a2 + 12, a2 + 13), <Box r={g.rect(2, 1, 9, 2)} c={COL.green} w={3} glow={0.8}/>)}
      </div>
    );
  };
  const cursor = (g: Geo) => {
    const rest = ctr(g, 12, 7), b2 = ctr(g, 2, 1), h = hp(g, 2, 1), h9 = hp(g, 9, 1);
    const ks: K[] = [[0, rest.x, rest.y], [a1 - 1.2, rest.x, rest.y], [a1 - 0.6, b2.x, b2.y], [tF0 - 0.3, b2.x, b2.y], [tF0, h.x, h.y, 'cross'], [tF1, h9.x, h9.y, 'cross'], [tF1 + 1, rest.x, rest.y, 'arrow'], [END(3), rest.x, rest.y]];
    return path(t, ks);
  };
  const v: View = {top: 1, freeze: false, widths: [200, 90, 90], cell, sel, edit, fb, name, mode, ov, cursor, sheet: 3, sheets: ['Parse', 'Split & Join', 'Clean', 'Pipeline'], file: 'Text_Functions_Practice'};
  return {v, zoom: 1, zx: 0, zy: 0};
};

// ================= SCENE 5: 50,000 rows =================
const FN = ['ahmed', 'sara', 'omar', 'mona', 'youssef', 'hana', 'karim', 'nour', 'laila', 'tarek'];
const LN = ['ali', 'hassan', 'farouk', 'adel', 'nabil', 'said', 'mahmoud', 'salah', 'fathy', 'gaber'];
const DM = ['manzooma.com', 'gmail.com', 'outlook.com', 'yahoo.com'];
const BR = ['CAIRO', 'GIZA', 'ALEX', 'TANTA', 'ASWAN', 'LUXOR'];
const emailOf = (r: number) => `${FN[r % 10]}.${LN[(r * 7) % 10]}${r % 9 === 0 ? ' ' : ''}@${DM[r % 4]}`;
const skuOf = (r: number) => `PROD-${2024 + (r % 3)}-${BR[r % 6]}${r % 13 === 0 ? '  ' : ''}`;
export const T5 = {down1: A(4, 0) + 3.5, home: A(4, 0) + 7.0, down2: A(4, 2) + 1.0};
export const s5 = (t: number): Out => {
  const a1 = A(4, 1), a2 = A(4, 2);
  const tB0 = a1 + 0.4, tBE = a1 + 4.3, tBF = a1 + 5.2, tF0 = a1 + 6.5, tFE = a1 + 9.1, tFF = a1 + 9.8;
  const top = t >= T5.down1 && t < T5.home ? 49987 : t >= T5.down2 && t < T5.down2 + 8 ? 49987 : 2;
  const cell = (r: number, c: number): Cell | undefined => {
    if (r === 1) return c < 3 ? hdrC(['Email', 'First', 'Last'][c]) : c >= 4 && c <= 7 ? hdrC(['SKU', 'Prefix', 'Year', 'Branch'][c - 4]) : undefined;
    if (r < 2 || r > 50001 || c > 7 || c === 3) return undefined;
    const bg = band(r);
    if (c === 0) return {t: emailOf(r), bg, pre: true};
    if (c === 4) return {t: skuOf(r), bg, pre: true};
    if (c <= 2) {
      const tt = r === 2 ? tBE : tBF;
      if (t < tt) return {t: '', bg};
      const g1 = 1 - pg(t, tt, tt + 1.4);
      const nm = emailOf(r).split('@')[0].split('.').map((x) => x.trim());
      return {t: nm[c - 1], f: c === 1 ? `=TRIM(TEXTSPLIT(TEXTBEFORE(A${r},"@"),"."))` : undefined, bg: g1 > 0.02 ? emer(0.5 * g1) : bg};
    }
    const tt = r === 2 ? tFE : tFF;
    if (t < tt) return {t: '', bg};
    const g1 = 1 - pg(t, tt, tt + 1.4);
    const parts = skuOf(r).trim().split('-');
    return {t: parts[c - 5], al: 'l', f: c === 5 ? `=TEXTSPLIT(TRIM(E${r}),"-")` : undefined, bg: g1 > 0.02 ? amb(0.5 * g1) : bg};
  };
  let sel: Sel = one(1, 0);
  let edit: View['edit'];
  let mode: string | undefined;
  let name: string | undefined;
  let fb = '';
  if (t >= T5.down1 && t < T5.home) sel = one(50001, 0);
  if (t >= tB0 - 0.4) { sel = one(2, 1); }
  if (t >= tB0 && t < tBE) { edit = {r: 2, c: 1, text: typed('=TRIM(TEXTSPLIT(TEXTBEFORE(A2,"@"),"."))', t, tB0 + 0.2, tBE - 0.3), caret: true}; mode = 'Enter'; name = 'B2'; }
  if (t >= tBE) { sel = one(2, 1); fb = '=TRIM(TEXTSPLIT(TEXTBEFORE(A2,"@"),"."))'; }
  if (t >= tBF) sel = rng(2, 1, 50001, 1, 2, 1);
  if (t >= tF0 - 0.4) { sel = one(2, 5); fb = ''; }
  if (t >= tF0 && t < tFE) { edit = {r: 2, c: 5, text: typed('=TEXTSPLIT(TRIM(E2),"-")', t, tF0 + 0.2, tFE - 0.3), caret: true}; mode = 'Enter'; name = 'F2'; }
  if (t >= tFE) { sel = one(2, 5); fb = '=TEXTSPLIT(TRIM(E2),"-")'; }
  if (t >= tFF) sel = rng(2, 5, 50001, 5, 2, 5);
  if (t >= T5.down2) { sel = one(50001, 5); fb = '=TEXTSPLIT(TRIM(E50001),"-")'; }
  if (t >= T5.down2 + 8) { sel = one(1, 0); fb = ''; }
  const ov = (g: Geo) => {
    const pulse = 0.5 + 0.3 * Math.sin(t * 3.6);
    return (
      <div style={{position: 'absolute', inset: 0}}>
        {wrap(pe(t, a1 - 0.5, a1 + 0.3) * (1 - pe(t, tBE, tBE + 0.4)), <div style={{position: 'absolute', inset: 0}}><Box r={g.cell(9, 0)} c={COL.red} w={2} glow={pulse} dash pad={1}/><Box r={g.cell(10, 4)} c={COL.red} w={2} glow={pulse} dash pad={1}/></div>)}
        {wrap(pe(t, tBE, tBE + 0.5) * (1 - pe(t, tBF + 2, tBF + 3)), <Box r={g.rect(2, 1, 2, 2)} c={COL.green} w={2.5} glow={pulse} pad={1}/>)}
        {wrap(pe(t, tFE, tFE + 0.5) * (1 - pe(t, tFF + 2, tFF + 3)), <Box r={g.rect(2, 5, 2, 7)} c={COL.amber} w={2.5} glow={pulse} pad={1}/>)}
        <Seal x={1010} y={150} s={130} p={pe(t, a2 + 4.5, a2 + 5.9) * (1 - pe(t, a2 + 12, a2 + 13))}/>
      </div>
    );
  };
  const cursor = (g: Geo) => {
    const b2 = ctr(g, 2, 1), hb = hp(g, 2, 1), f2 = ctr(g, 2, 5), hf = hp(g, 2, 5);
    const ks: K[] = [[0, 700, 200], [tB0 - 1.4, 700, 200], [tB0 - 0.4, b2.x, b2.y], [tBF - 0.5, b2.x, b2.y], [tBF - 0.1, hb.x, hb.y, 'cross'], [tBF + 0.6, hb.x, hb.y, 'cross'], [tF0 - 0.5, f2.x, f2.y, 'arrow'], [tFF - 0.5, f2.x, f2.y], [tFF - 0.1, hf.x, hf.y, 'cross'], [tFF + 0.6, hf.x, hf.y, 'cross'], [tFF + 1.2, 700, 200, 'arrow'], [END(4), 700, 200]];
    return path(t, ks);
  };
  const v: View = {top, freeze: true, widths: [215, 80, 90, 24, 130, 64, 64, 80], hw: hwFor(top + 14), cell, sel, edit, fb, name, mode, ov, cursor, sheet: 0, sheets: ['Customers_2026', 'Summary'], file: 'manzooma_sales_2026.xlsx', vs: {pos: (top / 50001) * 0.85, size: 0.0004}};
  return {v, zoom: 1, zx: 0, zy: 0};
};
