import type {ReactNode} from 'react';
import {C, FONT, MONO} from '../theme';
import {pop} from './anim';
import {Dax, charW} from './dax';

export const Slicer = ({x, y, w, title, items, sel, op = 1}: {x: number; y: number; w: number; title: string; items: string[]; sel: boolean[]; op?: number}) => {
  if (op < 0.01) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, opacity: op, background: C.white, border: '1px solid #C8C6C4', fontFamily: FONT, direction: 'ltr'}}>
      <div style={{height: 56, lineHeight: '56px', padding: '0 16px', fontSize: 24, fontWeight: 700, color: C.ink, borderBottom: '1px solid ' + C.grid}}>{title}</div>
      {items.map((it, i) => (
        <div key={it} style={{height: 44, lineHeight: '44px', paddingLeft: 16, fontSize: 23, color: C.ink, display: 'flex', alignItems: 'center', background: sel[i] ? '#FFF6D0' : 'transparent'}}>
          <div style={{width: 22, height: 22, border: '2px solid #605E5C', marginRight: 14, background: sel[i] ? '#201F1E' : '#FFFFFF', color: '#FFFFFF', fontSize: 16, lineHeight: '18px', textAlign: 'center'}}>{sel[i] ? '✓' : ''}</div>
          {it}
        </div>
      ))}
    </div>
  );
};
export const slicerItemC = (x: number, y: number, i: number): {x: number; y: number} => ({x: x + 90, y: y + 56 + i * 44 + 22});

export const CardVis = ({x, y, w, h, label, value, op = 1, color = '#C8C6C4', note}: {x: number; y: number; w: number; h: number; label: string; value: string; op?: number; color?: string; note?: string}) => {
  if (op < 0.01) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, opacity: op, background: C.white, border: '3px solid ' + color, fontFamily: FONT, textAlign: 'center', direction: 'ltr', boxSizing: 'border-box'}}>
      <div style={{fontSize: 80, fontWeight: 700, color: C.ink, marginTop: 26}}>{value}</div>
      <div style={{fontSize: 26, color: C.gray, marginTop: 6}}>{label}</div>
      {note ? <div style={{position: 'absolute', right: 10, top: 6, fontSize: 20, color: C.green, direction: 'rtl'}}>{note}</div> : null}
    </div>
  );
};

export type VCol = {h: string; w: number; num?: boolean; color?: string};
export const TableVis = ({x, y, cols, rows, hiRows = [], hiColor = '#FFF1B8', op = 1, boldLast = false}: {x: number; y: number; cols: VCol[]; rows: string[][]; hiRows?: number[]; hiColor?: string; op?: number; boldLast?: boolean}) => {
  if (op < 0.01) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, opacity: op, background: C.white, border: '1px solid #C8C6C4', fontFamily: FONT, direction: 'ltr'}}>
      <div style={{display: 'flex', height: 52, borderBottom: '2px solid #605E5C'}}>
        {cols.map((c) => (
          <div key={c.h} style={{width: c.w, lineHeight: '52px', padding: '0 12px', boxSizing: 'border-box', fontSize: 21, fontWeight: 700, color: C.ink, background: c.color ?? 'transparent', whiteSpace: 'nowrap', textAlign: c.num ? 'right' : 'left'}}>{c.h}</div>
        ))}
      </div>
      {rows.map((r, ri) => (
        <div key={ri} style={{display: 'flex', height: 50, borderBottom: '1px solid ' + C.grid, background: hiRows.includes(ri) ? hiColor : 'transparent', fontWeight: boldLast && ri === rows.length - 1 ? 700 : 400}}>
          {r.map((v, ci) => (
            <div key={ci} style={{width: cols[ci].w, lineHeight: '50px', padding: '0 12px', boxSizing: 'border-box', fontSize: 23, color: C.ink, textAlign: cols[ci].num ? 'right' : 'left', background: cols[ci].color ?? 'transparent', whiteSpace: 'nowrap'}}>{v}</div>
          ))}
        </div>
      ))}
    </div>
  );
};

/** DAX code panel: highlights whole lines and, optionally, one token (found by text) inside a line. */
export const CodeBlock = ({x, y, w, text, size, hi = [], tok, op = 1, dark = false}: {x: number; y: number; w: number; text: string; size: number; hi?: number[]; tok?: {line: number; text: string; color?: string}; op?: number; dark?: boolean}) => {
  if (op < 0.01) return null;
  const lines = text.split('\n');
  const lh = Math.round(size * 1.35);
  const cw = charW(size);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, opacity: op, background: dark ? '#0F172A' : C.white, border: '1px solid ' + (dark ? '#334155' : '#C8C6C4'), padding: '14px 0', boxSizing: 'border-box', direction: 'ltr', fontFamily: MONO}}>
      {lines.map((ln, i) => {
        const on = hi.includes(i);
        const t = tok && tok.line === i ? ln.indexOf(tok.text) : -1;
        return (
          <div key={i} style={{position: 'relative', height: lh, padding: '0 18px', background: on ? (dark ? '#1E3A5F' : '#FFF1B8') : 'transparent', borderLeft: on ? '6px solid ' + C.yellow : '6px solid transparent', boxSizing: 'border-box'}}>
            {t >= 0 && tok ? <div style={{position: 'absolute', left: 24 + t * cw, top: 2, width: tok.text.length * cw, height: lh - 4, background: tok.color ?? '#FCA5A5', opacity: 0.55}} /> : null}
            <div style={{position: 'relative', lineHeight: lh + 'px'}}>
              <Dax text={ln === '' ? ' ' : ln} size={size} dark={dark} line={lh / size} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const Pill = ({fr, at, x, y, w, color, children, size = 30}: {fr: number; at: number; x: number; y: number; w: number; color: string; children: ReactNode; size?: number}) => {
  const p = pop(fr, at, 10);
  if (p < 0.01) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y + (1 - p) * 12, width: w, opacity: p, background: color, color: C.white, fontFamily: FONT, fontSize: size, fontWeight: 700, textAlign: 'center', padding: '8px 10px', boxSizing: 'border-box', direction: 'rtl'}}>{children}</div>
  );
};
