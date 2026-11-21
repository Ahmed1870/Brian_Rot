import React from 'react';
import {COL, FONT_MONO} from '../theme';
import {clamp, ramp} from './anim';

const RE = /("[^"]*")|\b(VALUES|DISTINCT|COUNTROWS|SELECTEDVALUE|HASONEVALUE|IF)\b|(\w+\[[^\]]+\])/g;
type Tok = {t: string; c: string};
const tokenize = (src: string): Tok[] => {
  const out: Tok[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  RE.lastIndex = 0;
  const firstEq = src.indexOf('=');
  while ((m = RE.exec(src))) {
    if (m.index > last) out.push({t: src.slice(last, m.index), c: COL.text});
    out.push({t: m[0], c: m[1] ? COL.str : m[2] ? COL.fn : COL.col});
    last = m.index + m[0].length;
  }
  if (last < src.length) out.push({t: src.slice(last), c: COL.text});
  // اسم الـ Measure/Table قبل أول "=" بلون مميز
  if (firstEq > 0) {
    const head = src.slice(0, firstEq);
    const res: Tok[] = [];
    let pos = 0;
    for (const k of out) {
      const end = pos + k.t.length;
      if (end <= firstEq) res.push({t: k.t, c: COL.num});
      else if (pos < firstEq) {
        res.push({t: k.t.slice(0, firstEq - pos), c: COL.num});
        res.push({t: k.t.slice(firstEq - pos), c: k.c});
      } else res.push(k);
      pos = end;
    }
    void head;
    return res;
  }
  return out;
};

/** عرض كود DAX مع تلوين وكتابة حرفاً حرفاً (chars = عدد الأحرف الظاهرة) */
export const DaxCode: React.FC<{code: string; chars?: number; size?: number}> = ({code, chars = 1e9, size = 26}) => {
  const toks = tokenize(code);
  let left = chars;
  return (
    <pre dir="ltr" style={{margin: 0, fontFamily: FONT_MONO, fontSize: size, lineHeight: 1.45, whiteSpace: 'pre', textAlign: 'left'}}>
      {toks.map((k, i) => {
        if (left <= 0) return null;
        const s = k.t.slice(0, left);
        left -= k.t.length;
        return <span key={i} style={{color: k.c}}>{s}</span>;
      })}
    </pre>
  );
};

export const typedChars = (T: number, t0: number, cps: number): number => Math.max(0, Math.floor((T - t0) * cps));

/** صندوق محرر DAX (شريط الصيغة الموسّع) */
export const DaxBox: React.FC<{T: number; x: number; y: number; w: number; code: string; t0: number; t1: number; hideAt?: number; size?: number}> = ({T, x, y, w, code, t0, t1, hideAt = 1e9, size = 26}) => {
  const o = ramp(T, t0 - 0.3, 0.3) * (1 - ramp(T, hideAt, 0.3));
  if (o <= 0.01) return null;
  const cps = code.length / Math.max(0.5, t1 - t0);
  const n = clamp(typedChars(T, t0, cps), 0, code.length);
  const lines = code.split('\n').length;
  return (
    <div style={{position: 'absolute', left: x, top: y + (1 - o) * 12, width: w, height: 46 + lines * size * 1.45 + 24, opacity: o, background: '#fff', border: `2px solid ${COL.blue}`, boxSizing: 'border-box'}}>
      <div style={{height: 40, background: COL.panel, display: 'flex', alignItems: 'center', gap: 18, padding: '0 14px', fontSize: 22, borderBottom: `1px solid ${COL.line}`}}>
        <span style={{color: COL.red}}>✕</span>
        <span style={{color: COL.green}}>✓</span>
        <span style={{color: COL.sub, fontSize: 18}}>DAX</span>
      </div>
      <div style={{padding: '10px 18px'}}>
        <DaxCode code={code} chars={n} size={size} />
      </div>
    </div>
  );
};
