import React from 'react';
import { C, FONT_MONO } from '../theme';
import { MONO_ADV } from './layout';

const KW = new Set(['True', 'False', 'None', 'import', 'from', 'def', 'return', 'if', 'else', 'for', 'while', 'class']);
const FN = new Set(['print', 'type', 'int', 'float', 'str', 'bool']);

export type Tok = { s: string; c: string };
export const tokenize = (line: string): Tok[] => {
  const out: Tok[] = [];
  const re = /('[^']*'?|"[^"]*"?)|(\d+\.\d+|\d+)|([A-Za-z_][A-Za-z_0-9]*)|(\s+)|(.)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) {
    if (m[1]) out.push({ s: m[1], c: C.str });
    else if (m[2]) out.push({ s: m[2], c: C.num });
    else if (m[3]) {
      const w = m[3];
      const next = line[re.lastIndex];
      if (KW.has(w)) out.push({ s: w, c: C.kw });
      else if (FN.has(w) && next === '(') out.push({ s: w, c: C.fn });
      else out.push({ s: w, c: C.id });
    } else if (m[4]) out.push({ s: m[4], c: C.op });
    else out.push({ s: m[5], c: C.op });
  }
  return out;
};

export type Mark = { line: number; from: number; to: number; kind: 'box' | 'squiggle' | 'sel' | 'glow'; color?: string; a?: number };

export const geom = (fontSize: number) => ({
  charW: fontSize * MONO_ADV,
  lineH: Math.round(fontSize * 1.52),
  padTop: 14,
  gutter: Math.round(fontSize * 2.5),
});

const BUILTINS = ['print', 'property', 'pow', 'type', 'tuple', 'int', 'input', 'isinstance', 'float', 'filter', 'str', 'set', 'sorted', 'sum'];
export const suggestFor = (lineText: string): string[] | null => {
  const m = /([A-Za-z_]+)$/.exec(lineText);
  if (!m || m[1].length < 2) return null;
  const frag = m[1];
  const items = BUILTINS.filter((b) => b.startsWith(frag) && b !== frag);
  return items.length ? items.slice(0, 4) : null;
};

export const EditorView: React.FC<{
  x: number; y: number; w: number; h: number;
  lines: string[];
  fontSize?: number;
  cursor?: { line: number; col: number } | null;
  marks?: Mark[];
  frame: number;
  suggest?: boolean;
  dim?: boolean;
}> = ({ x, y, w, h, lines, fontSize = 40, cursor, marks = [], frame, suggest = true, dim }) => {
  const g = geom(fontSize);
  const blinkOn = Math.floor(frame / 16) % 2 === 0;
  const sug = cursor && suggest ? suggestFor((lines[cursor.line] ?? '').slice(0, cursor.col)) : null;
  const textX = g.gutter;
  const curLine = cursor ? cursor.line : -1;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, background: C.edBg, overflow: 'hidden', direction: 'ltr', opacity: dim ? 0.55 : 1 }}>
      {curLine >= 0 && (
        <div style={{ position: 'absolute', left: 0, right: 0, top: g.padTop + curLine * g.lineH, height: g.lineH, background: '#262626', borderTop: '1px solid #2F2F2F', borderBottom: '1px solid #2F2F2F' }} />
      )}
      {lines.map((ln, i) => (
        <div key={i} style={{ position: 'absolute', left: 0, top: g.padTop + i * g.lineH, height: g.lineH, width: w, fontFamily: FONT_MONO, fontSize, lineHeight: `${g.lineH}px` }}>
          <span style={{ position: 'absolute', left: 0, width: g.gutter - 22, textAlign: 'right', color: i === curLine ? '#CCCCCC' : '#6E7681', fontSize: fontSize * 0.82 }}>{i + 1}</span>
          <span style={{ position: 'absolute', left: textX, whiteSpace: 'pre' }}>
            {tokenize(ln).map((t, j) => (
              <span key={j} style={{ color: t.c }}>{t.s}</span>
            ))}
          </span>
        </div>
      ))}
      {marks.map((m, i) => {
        const left = textX + m.from * g.charW - 3;
        const width = (m.to - m.from) * g.charW + 6;
        const top = g.padTop + m.line * g.lineH;
        const col = m.color ?? C.accent;
        const a = m.a ?? 1;
        if (m.kind === 'sel')
          return <div key={i} style={{ position: 'absolute', left, top, width, height: g.lineH, background: '#264F78', opacity: a }} />;
        if (m.kind === 'glow')
          return <div key={i} style={{ position: 'absolute', left, top: top + 4, width, height: g.lineH - 8, background: col, opacity: 0.22 * a, borderRadius: 6 }} />;
        if (m.kind === 'squiggle') {
          const n = Math.max(2, Math.round(width / 8));
          let d = `M0 5`;
          for (let k = 1; k <= n; k++) d += ` L${k * 4} ${k % 2 ? 1 : 5}`;
          return (
            <svg key={i} style={{ position: 'absolute', left, top: top + g.lineH - 12, opacity: a }} width={n * 4} height={8}>
              <path d={d} stroke={col} strokeWidth={2} fill="none" />
            </svg>
          );
        }
        return <div key={i} style={{ position: 'absolute', left, top: top + 4, width, height: g.lineH - 8, border: `3px solid ${col}`, borderRadius: 8, opacity: a, boxSizing: 'border-box' }} />;
      })}
      {cursor && blinkOn && (
        <div style={{ position: 'absolute', left: textX + cursor.col * g.charW, top: g.padTop + cursor.line * g.lineH + 6, width: 3, height: g.lineH - 12, background: '#AEAFAD' }} />
      )}
      {sug && cursor && (
        <div style={{ position: 'absolute', left: textX + (cursor.col - 2) * g.charW, top: g.padTop + (cursor.line + 1) * g.lineH + 4, width: 300, background: '#202020', border: '1px solid #454545', borderRadius: 8, boxShadow: '0 4px 14px rgba(0,0,0,.5)', zIndex: 5, fontFamily: FONT_MONO, fontSize: fontSize * 0.7 }}>
          {sug.map((s, i) => (
            <div key={s} style={{ height: 38, display: 'flex', alignItems: 'center', gap: 12, padding: '0 14px', background: i === 0 ? '#04395E' : 'transparent', color: '#D4D4D4' }}>
              <span style={{ width: 20, height: 20, borderRadius: 4, background: '#B180D7', display: 'inline-block' }} />
              <span>{s}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export type TermLine = { text: string; color?: string; cmd?: boolean };

export const TerminalView: React.FC<{
  x: number; y: number; w: number; h: number;
  lines: TermLine[];
  tab?: 'terminal' | 'problems';
  problems?: number;
  frame: number;
  showCursor?: boolean;
}> = ({ x, y, w, h, lines, tab = 'terminal', problems = 0, frame, showCursor = true }) => {
  const tabs = ['PROBLEMS', 'OUTPUT', 'DEBUG CONSOLE', 'TERMINAL', 'PORTS'];
  const active = tab === 'terminal' ? 'TERMINAL' : 'PROBLEMS';
  const blink = Math.floor(frame / 16) % 2 === 0;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, background: C.chrome, borderTop: `1px solid ${C.line}`, direction: 'ltr', overflow: 'hidden' }}>
      <div style={{ height: 44, display: 'flex', alignItems: 'flex-end', gap: 28, padding: '0 22px', fontFamily: "LessonSans, 'DejaVu Sans', sans-serif", fontSize: 18, color: '#9D9D9D' }}>
        {tabs.map((t) => (
          <div key={t} style={{ paddingBottom: 8, color: t === active ? '#E7E7E7' : '#9D9D9D', borderBottom: t === active ? `2px solid ${C.accent}` : '2px solid transparent', display: 'flex', gap: 8, alignItems: 'center' }}>
            {t}
            {t === 'PROBLEMS' && problems > 0 && <span style={{ background: C.accent, color: '#fff', borderRadius: 12, fontSize: 14, padding: '0 7px' }}>{problems}</span>}
          </div>
        ))}
      </div>
      <div style={{ padding: '10px 22px', fontFamily: FONT_MONO, fontSize: 25, lineHeight: '34px', color: '#CCCCCC', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
        {lines.map((l, i) => {
          const last = i === lines.length - 1;
          return (
            <div key={i} style={{ color: l.color ?? '#CCCCCC' }}>
              {l.cmd ? (
                <>
                  <span style={{ color: '#6CC24A' }}>PS C:\course&gt; </span>
                  <span style={{ color: '#E5E5E5' }}>{l.text}</span>
                </>
              ) : (
                l.text
              )}
              {showCursor && last && l.cmd && blink && <span style={{ background: '#AEAFAD', color: '#AEAFAD' }}>_</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};
